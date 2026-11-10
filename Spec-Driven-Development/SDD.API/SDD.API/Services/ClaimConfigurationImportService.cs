using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SDD.API.Configuration;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;

namespace SDD.API.Services;

public sealed class ClaimConfigurationImportService(
    SddDbContext database,
    ClaimConfigurationService configurations,
    ClaimConfigurationProductService products,
    ClaimConfigurationOptionsService choices,
    IOptions<ClaimConfigurationOptions> companyOptions)
{
    public const int MaximumRows = 1000;

    public async Task<ClaimConfigurationImportPreviewDto> PreviewAsync(
        ClaimConfigurationImportRequest? request,
        CancellationToken cancellationToken)
    {
        var configurationRows = request?.Configurations ?? [];
        var linkRows = request?.ProductLinks ?? [];
        var globalErrors = new List<string>();
        if (configurationRows.Count + linkRows.Count > MaximumRows)
            globalErrors.Add($"Workbook cannot contain more than {MaximumRows} data rows across both sheets.");
        if (configurationRows.Count == 0 && linkRows.Count == 0)
            globalErrors.Add("Workbook contains no data rows.");

        var normalizedCodes = configurationRows.Select(row => Value(row, "ccmCode").Trim().ToUpperInvariant()).ToArray();
        var duplicates = normalizedCodes.Where(code => code.Length > 0)
            .GroupBy(code => code, StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        // Product-link-only workbooks may intentionally reference CCMs that already exist.
        // Include those references when checking the database so valid links are not rejected.
        var referencedCodes = linkRows.Select(row => Value(row, "ccmCode").Trim().ToUpperInvariant());
        var existingCodes = normalizedCodes.Concat(referencedCodes)
            .Where(code => code.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();
        var globallyExistingCodes = existingCodes.Length == 0
            ? new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            : (await database.BrmClmConfigs.AsNoTracking()
                .Where(row => existingCodes.Contains(row.CcmCode))
                .Select(row => row.CcmCode)
                .ToListAsync(cancellationToken)).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var company = companyOptions.Value.CompanyCode.Trim().ToUpperInvariant();
        var companyExistingCodes = existingCodes.Length == 0
            ? new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            : (await database.BrmClmConfigs.AsNoTracking()
                .Where(row => row.CcmCompCode == company && existingCodes.Contains(row.CcmCode))
                .Select(row => row.CcmCode)
                .ToListAsync(cancellationToken)).ToHashSet(StringComparer.OrdinalIgnoreCase);

        var configurationStatuses = new List<ClaimConfigurationImportRowStatus>(configurationRows.Count);
        var validNewCodes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        for (var index = 0; index < configurationRows.Count; index++)
        {
            var row = configurationRows[index];
            var values = ToValues(row, out var conversionErrors);
            var alreadyExists = globallyExistingCodes.Contains(values.CcmCode);
            var ruleErrors = ClaimConfigurationInputRules.Validate(values);
            var errors = alreadyExists
                ? ruleErrors.Where(entry => entry.Key == "ccmCode")
                    .SelectMany(entry => entry.Value.Select(message => $"{entry.Key}: {message}")).ToList()
                : conversionErrors.Concat(ruleErrors
                    .SelectMany(entry => entry.Value.Select(message => $"{entry.Key}: {message}"))).ToList();
            if (duplicates.Contains(values.CcmCode)) errors.Add("CCM Code appears more than once in this workbook.");

            foreach (var (field, code) in alreadyExists ? [] : SettingChoices(values))
            {
                if (string.IsNullOrWhiteSpace(code)) continue;
                if (!await choices.IsActiveChoiceAsync(field, code, cancellationToken))
                    errors.Add($"{field}: choose an active value from the approved list.");
            }

            if (errors.Count == 0 && !alreadyExists) validNewCodes.Add(values.CcmCode);
            configurationStatuses.Add(new ClaimConfigurationImportRowStatus(
                index + 2,
                values.CcmCode,
                errors.Count == 0,
                alreadyExists,
                errors.ToArray()));
        }

        var linkStatuses = new List<ClaimConfigurationImportRowStatus>(linkRows.Count);
        var seenLinks = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        for (var index = 0; index < linkRows.Count; index++)
        {
            var row = linkRows[index];
            var ccmCode = Value(row, "ccmCode").Trim().ToUpperInvariant();
            var productCode = Value(row, "productCode").Trim().ToUpperInvariant();
            var key = $"{ccmCode}|{productCode}";
            var errors = new List<string>();
            if (ccmCode.Length == 0) errors.Add("CCM Code is required.");
            if (productCode.Length == 0) errors.Add("Product Code is required.");
            if (key.Length > 1 && !seenLinks.Add(key)) errors.Add("CCM Code and Product Code pair appears more than once in this workbook.");
            if (ccmCode.Length > 0 && !companyExistingCodes.Contains(ccmCode) && !validNewCodes.Contains(ccmCode))
                errors.Add("CCM Code must identify an existing configuration or a valid new CCM row in this workbook.");

            var choiceExists = productCode.Length > 0 && await database.StdListItems.AsNoTracking()
                .AnyAsync(item => item.LiType == ClaimConfigurationProductService.ProductListType
                    && item.LiCode == productCode && item.LiActiveYn == "Y", cancellationToken);
            if (productCode.Length > 0 && !choiceExists) errors.Add("Product Code must be an active approved product choice.");

            var alreadyExists = ccmCode.Length > 0 && productCode.Length > 0 && await database.BrmCcmProds.AsNoTracking()
                .AnyAsync(link => link.CcmpCcmCode == ccmCode && link.CcmpCode == productCode, cancellationToken);
            linkStatuses.Add(new ClaimConfigurationImportRowStatus(
                index + 2,
                key,
                errors.Count == 0,
                alreadyExists,
                errors.ToArray()));
        }

        return new ClaimConfigurationImportPreviewDto(configurationStatuses, linkStatuses, globalErrors.ToArray());
    }

    public async Task<(ClaimConfigurationImportResultDto? Result, ClaimConfigurationImportPreviewDto Preview)> ImportAsync(
        ClaimConfigurationImportRequest request,
        CancellationToken cancellationToken)
    {
        var preview = await PreviewAsync(request, cancellationToken);
        if (preview.Errors.Length > 0 || preview.Configurations.Any(row => !row.IsValid) || preview.ProductLinks.Any(row => !row.IsValid))
            return (null, preview);

        await using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var insertedConfigurations = 0;
            var skippedConfigurations = 0;
            for (var index = 0; index < (request.Configurations?.Count ?? 0); index++)
            {
                var rowStatus = preview.Configurations[index];
                if (rowStatus.AlreadyExists)
                {
                    skippedConfigurations++;
                    continue;
                }

                var values = ToValues(request.Configurations![index], out _);
                var saved = await configurations.CreateAsync(companyOptions.Value.CompanyCode, values, cancellationToken);
                if (saved.Outcome != ClaimConfigurationSaveOutcome.Saved)
                    throw new InvalidOperationException($"CCM import failed for row {rowStatus.RowNumber}; the transaction was rolled back.");
                insertedConfigurations++;
            }

            var insertedLinks = 0;
            var skippedLinks = 0;
            for (var index = 0; index < (request.ProductLinks?.Count ?? 0); index++)
            {
                var row = request.ProductLinks![index];
                var ccmCode = Value(row, "ccmCode").Trim().ToUpperInvariant();
                var productCode = Value(row, "productCode").Trim().ToUpperInvariant();
                if (preview.ProductLinks[index].AlreadyExists)
                {
                    skippedLinks++;
                    continue;
                }

                var added = await products.AddAsync(companyOptions.Value.CompanyCode, ccmCode, productCode, cancellationToken);
                if (added.Outcome == ProductAssociationOutcome.Duplicate)
                {
                    skippedLinks++;
                    continue;
                }
                if (added.Outcome != ProductAssociationOutcome.Added)
                    throw new InvalidOperationException($"Product-link import failed for row {index + 2}; the transaction was rolled back.");
                insertedLinks++;
            }

            await transaction.CommitAsync(cancellationToken);
            return (new ClaimConfigurationImportResultDto(insertedConfigurations, skippedConfigurations, insertedLinks, skippedLinks), preview);
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    private static ClaimConfigurationValues ToValues(Dictionary<string, string?> row, out List<string> errors)
    {
        var conversionErrors = new List<string>();
        decimal? rounding = null;
        var roundingText = Value(row, "roundingValue");
        if (roundingText.Length > 0)
        {
            if (decimal.TryParse(roundingText, NumberStyles.Number, CultureInfo.InvariantCulture, out var parsed)) rounding = parsed;
            else conversionErrors.Add("roundingValue: enter a number.");
        }

        bool? Flag(string field)
        {
            var value = Value(row, field).Trim();
            if (value.Length == 0) return null;
            if (value.Equals("Y", StringComparison.OrdinalIgnoreCase) || value.Equals("TRUE", StringComparison.OrdinalIgnoreCase)) return true;
            if (value.Equals("N", StringComparison.OrdinalIgnoreCase) || value.Equals("FALSE", StringComparison.OrdinalIgnoreCase)) return false;
            conversionErrors.Add($"{field}: enter Y or N.");
            return null;
        }

        var values = ClaimConfigurationInputRules.Normalise(new CreateClaimConfigurationRequest(
            Value(row, "ccmCode"), Value(row, "name"), Nullable(row, "shortName"), Nullable(row, "nameL2"), Nullable(row, "shortNameL2"),
            Nullable(row, "module"), Nullable(row, "accountingPostingType"), Nullable(row, "accountingExchangeRateType"),
            Nullable(row, "roundingType"), rounding, Nullable(row, "applicableCurrencyType"), Nullable(row, "defaultEstimatedClosureReasonCode"),
            Nullable(row, "defaultRecoveryDeductionCode"), Flag("printBeforeApproval"), Flag("reprint"),
            Flag("claimAccountingDocumentGeneration"), Flag("claimCoinsuranceAccountingDocumentGeneration"), Flag("active")));
        errors = conversionErrors;
        return values;
    }

    private static IEnumerable<(string Field, string? Code)> SettingChoices(ClaimConfigurationValues values)
    {
        yield return ("module", values.Module);
        yield return ("postingType", values.AccountingPostingType);
        yield return ("exchangeRateType", values.AccountingExchangeRateType);
        yield return ("roundType", values.RoundingType);
        yield return ("applicableCurrencyType", values.ApplicableCurrencyType);
        yield return ("estimatedClosureReason", values.DefaultEstimatedClosureReasonCode);
        yield return ("recoveryDeduction", values.DefaultRecoveryDeductionCode);
    }

    private static string Value(Dictionary<string, string?> row, string key) => row.GetValueOrDefault(key) ?? string.Empty;
    private static string? Nullable(Dictionary<string, string?> row, string key) => string.IsNullOrWhiteSpace(Value(row, key)) ? null : Value(row, key);
}
