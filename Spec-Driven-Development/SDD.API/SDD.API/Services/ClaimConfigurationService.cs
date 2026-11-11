using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SDD.API.Configuration;
using SDD.API.Contracts;
using SDD.API.Data.ClaimConfigurations;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;
using SDD.API.Infrastructure;

namespace SDD.API.Services;

public enum ClaimConfigurationSaveOutcome
{
    Saved,
    Invalid,
    Duplicate,
    NotFound
}

public enum ClaimConfigurationDeleteOutcome
{
    Deleted,
    NotFound,
    HasProductLinks
}

public sealed record ClaimConfigurationSaveResult(
    ClaimConfigurationSaveOutcome Outcome,
    ClaimConfigurationDto? Configuration = null,
    IReadOnlyDictionary<string, string[]>? Errors = null);

public sealed record ClaimConfigurationDeleteResult(ClaimConfigurationDeleteOutcome Outcome);

public sealed class ClaimConfigurationService(
    SddDbContext database,
    ClaimConfigurationOptionsService choices,
    IOptions<AuditOptions> auditOptions,
    TimeProvider clock,
    ILogger<ClaimConfigurationService> logger)
{
    private static readonly (string Field, string? CodeProperty)[] ChoiceFields =
    [
        ("module", nameof(ClaimConfigurationValues.Module)),
        ("postingType", nameof(ClaimConfigurationValues.AccountingPostingType)),
        ("exchangeRateType", nameof(ClaimConfigurationValues.AccountingExchangeRateType)),
        ("roundType", nameof(ClaimConfigurationValues.RoundingType)),
        ("applicableCurrencyType", nameof(ClaimConfigurationValues.ApplicableCurrencyType)),
        ("estimatedClosureReason", nameof(ClaimConfigurationValues.DefaultEstimatedClosureReasonCode)),
        ("recoveryDeduction", nameof(ClaimConfigurationValues.DefaultRecoveryDeductionCode))
    ];

    public async Task<ClaimConfigurationDto?> GetAsync(
        string companyCode,
        string ccmCode,
        CancellationToken cancellationToken)
    {
        // CCM_CODE is globally unique, so the app and portal can share rows across company codes.
        var code = ccmCode.Trim().ToUpperInvariant();
        var row = await database.BrmClmConfigs.AsNoTracking()
            .FirstOrDefaultAsync(item => item.CcmCode == code, cancellationToken);
        return row is null ? null : ClaimConfigurationMapping.ToDto(row);
    }

    public async Task<PaginatedResult<ClaimConfigurationListItemDto>> ListAsync(
        int page,
        ColumnFilters filters,
        string? sortBy,
        string? sortDirection,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var matching = ClaimConfigurationListQuery.Apply(
            database.BrmClmConfigs.AsNoTracking(),
            filters,
            sortBy,
            sortDirection);
        var totalCount = await matching.CountAsync(cancellationToken);
        var skip = (int)Math.Min((long)(page - 1) * pageSize, int.MaxValue);
        var rows = await matching
            .Skip(skip)
            .Take(pageSize)
            .Select(row => new
            {
                row.CcmCompCode,
                row.CcmCode,
                row.CcmName,
                row.CcmShortName,
                row.CcmModule,
                row.CcmActiveYn
            })
            .ToListAsync(cancellationToken);

        var items = rows.Select(row => new ClaimConfigurationListItemDto(
            row.CcmCompCode,
            row.CcmCode,
            row.CcmName,
            row.CcmShortName ?? string.Empty,
            row.CcmModule,
            ClaimConfigurationMapping.IsActive(row.CcmActiveYn))).ToList();

        return new PaginatedResult<ClaimConfigurationListItemDto>(items, page, pageSize, totalCount);
    }

    public async Task<ClaimConfigurationSaveResult> CreateAsync(
        string companyCode,
        ClaimConfigurationValues values,
        CancellationToken cancellationToken)
    {
        var errors = await ValidateChoicesAsync(values, current: null, cancellationToken);
        if (errors.Count > 0)
        {
            return new ClaimConfigurationSaveResult(ClaimConfigurationSaveOutcome.Invalid, Errors: errors);
        }

        var company = companyCode.Trim().ToUpperInvariant();
        var existingCount = await database.BrmClmConfigs.AsNoTracking()
            .Where(row => row.CcmCode == values.CcmCode)
            .CountAsync(cancellationToken);
        var exists = existingCount > 0;
        if (exists)
        {
            return new ClaimConfigurationSaveResult(ClaimConfigurationSaveOutcome.Duplicate);
        }

        var now = GulfStandardTime.Now(clock);
        var user = auditOptions.Value.UserName;
        var entity = new BrmClmConfig
        {
            CcmCompCode = company,
            CcmCode = values.CcmCode,
            CcmName = values.Name,
            CcmShortName = values.ShortName,
            CcmNameL2 = values.NameL2,
            CcmShortNameL2 = values.ShortNameL2,
            CcmModule = values.Module,
            CcmAcntPostingType = values.AccountingPostingType,
            CcmAcntExchRateType = values.AccountingExchangeRateType,
            CcmRoundType = values.RoundingType,
            CcmRoundValue = values.RoundingValue,
            CcmApplCurrType = values.ApplicableCurrencyType,
            CcmDfltEstCloReasonCode = values.DefaultEstimatedClosureReasonCode,
            CcmDfltRecvDeduCode = values.DefaultRecoveryDeductionCode,
            CcmPrntBefApprYn = ToFlag(values.PrintBeforeApproval ?? false),
            CcmRePrntYn = ToFlag(values.Reprint ?? false),
            CcmClmAcntDocGenYn = ToFlag(values.ClaimAccountingDocumentGeneration ?? true),
            CcmClmCoinsAcntDocGenYn = ToFlag(values.ClaimCoinsuranceAccountingDocumentGeneration ?? true),
            CcmActiveYn = ToFlag(values.Active ?? true),
            CcmCrBy = user,
            CcmCrDt = now,
            CcmUpBy = user,
            CcmUpDt = now
        };
        database.BrmClmConfigs.Add(entity);

        try
        {
            await database.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (OracleErrors.Has(exception, OracleErrors.UniqueConstraintViolation))
        {
            database.Entry(entity).State = EntityState.Detached;
            return new ClaimConfigurationSaveResult(ClaimConfigurationSaveOutcome.Duplicate);
        }
        catch (DbUpdateException exception) when (OracleErrors.Has(exception, OracleErrors.ValueTooLarge))
        {
            database.Entry(entity).State = EntityState.Detached;
            return StorageCapacityError();
        }

        logger.LogInformation("Created CCM {CcmCode} for company {CompanyCode}", values.CcmCode, company);
        return new ClaimConfigurationSaveResult(
            ClaimConfigurationSaveOutcome.Saved,
            ClaimConfigurationMapping.ToDto(entity));
    }

    public async Task<ClaimConfigurationSaveResult> UpdateAsync(
        string companyCode,
        string ccmCode,
        ClaimConfigurationValues values,
        CancellationToken cancellationToken)
    {
        var code = ccmCode.Trim().ToUpperInvariant();
        var entity = await database.BrmClmConfigs.FirstOrDefaultAsync(
            row => row.CcmCode == code,
            cancellationToken);
        if (entity is null)
        {
            return new ClaimConfigurationSaveResult(ClaimConfigurationSaveOutcome.NotFound);
        }

        var errors = await ValidateChoicesAsync(values, entity, cancellationToken);
        if (errors.Count > 0)
        {
            return new ClaimConfigurationSaveResult(ClaimConfigurationSaveOutcome.Invalid, Errors: errors);
        }

        entity.CcmName = values.Name;
        entity.CcmShortName = values.ShortName;
        entity.CcmNameL2 = values.NameL2;
        entity.CcmShortNameL2 = values.ShortNameL2;
        entity.CcmModule = values.Module;
        entity.CcmAcntPostingType = values.AccountingPostingType;
        entity.CcmAcntExchRateType = values.AccountingExchangeRateType;
        entity.CcmRoundType = values.RoundingType;
        entity.CcmRoundValue = values.RoundingValue;
        entity.CcmApplCurrType = values.ApplicableCurrencyType;
        entity.CcmDfltEstCloReasonCode = values.DefaultEstimatedClosureReasonCode;
        // Recovery choices have no confirmed list mapping yet. Preserve the current value on update.
        entity.CcmDfltRecvDeduCode = values.DefaultRecoveryDeductionCode;
        entity.CcmPrntBefApprYn = values.PrintBeforeApproval is { } print ? ToFlag(print) : entity.CcmPrntBefApprYn;
        entity.CcmRePrntYn = values.Reprint is { } reprint ? ToFlag(reprint) : entity.CcmRePrntYn;
        entity.CcmClmAcntDocGenYn = values.ClaimAccountingDocumentGeneration is { } accounting
            ? ToFlag(accounting)
            : entity.CcmClmAcntDocGenYn;
        entity.CcmClmCoinsAcntDocGenYn = values.ClaimCoinsuranceAccountingDocumentGeneration is { } coinsurance
            ? ToFlag(coinsurance)
            : entity.CcmClmCoinsAcntDocGenYn;
        if (values.Active is { } active)
        {
            entity.CcmActiveYn = ToFlag(active);
        }

        entity.CcmUpBy = auditOptions.Value.UserName;
        entity.CcmUpDt = GulfStandardTime.Now(clock);
        try
        {
            await database.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (OracleErrors.Has(exception, OracleErrors.ValueTooLarge))
        {
            database.Entry(entity).State = EntityState.Detached;
            return StorageCapacityError();
        }

        logger.LogInformation("Updated CCM {CcmCode} (row company {CompanyCode})", code, entity.CcmCompCode);
        return new ClaimConfigurationSaveResult(
            ClaimConfigurationSaveOutcome.Saved,
            ClaimConfigurationMapping.ToDto(entity));
    }

    public async Task<ClaimConfigurationDeleteResult> DeleteAsync(
        string companyCode,
        string ccmCode,
        CancellationToken cancellationToken)
    {
        var code = ccmCode.Trim().ToUpperInvariant();
        var entity = await database.BrmClmConfigs.FirstOrDefaultAsync(
            row => row.CcmCode == code,
            cancellationToken);
        if (entity is null)
        {
            return new ClaimConfigurationDeleteResult(ClaimConfigurationDeleteOutcome.NotFound);
        }

        var productLinkCount = await database.BrmCcmProds.AsNoTracking()
            .Where(row => row.CcmpCcmCode == code)
            .CountAsync(cancellationToken);
        if (productLinkCount > 0)
        {
            return new ClaimConfigurationDeleteResult(ClaimConfigurationDeleteOutcome.HasProductLinks);
        }

        database.BrmClmConfigs.Remove(entity);
        try
        {
            await database.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (OracleErrors.Has(exception, OracleErrors.ChildRecordFound))
        {
            return new ClaimConfigurationDeleteResult(ClaimConfigurationDeleteOutcome.HasProductLinks);
        }

        logger.LogInformation("Deleted CCM {CcmCode} (row company {CompanyCode})", code, entity.CcmCompCode);
        return new ClaimConfigurationDeleteResult(ClaimConfigurationDeleteOutcome.Deleted);
    }

    private async Task<Dictionary<string, string[]>> ValidateChoicesAsync(
        ClaimConfigurationValues values,
        BrmClmConfig? current,
        CancellationToken cancellationToken)
    {
        var errors = new Dictionary<string, string[]>();
        foreach (var (field, property) in ChoiceFields)
        {
            var code = field switch
            {
                "module" => values.Module,
                "postingType" => values.AccountingPostingType,
                "exchangeRateType" => values.AccountingExchangeRateType,
                "roundType" => values.RoundingType,
                "applicableCurrencyType" => values.ApplicableCurrencyType,
                "estimatedClosureReason" => values.DefaultEstimatedClosureReasonCode,
                "recoveryDeduction" => values.DefaultRecoveryDeductionCode,
                _ => null
            };
            var oldCode = current is null ? null : field switch
            {
                "module" => current.CcmModule,
                "postingType" => current.CcmAcntPostingType,
                "exchangeRateType" => current.CcmAcntExchRateType,
                "roundType" => current.CcmRoundType,
                "applicableCurrencyType" => current.CcmApplCurrType,
                "estimatedClosureReason" => current.CcmDfltEstCloReasonCode,
                "recoveryDeduction" => current.CcmDfltRecvDeduCode,
                _ => null
            };

            if (string.IsNullOrWhiteSpace(code)
                || string.Equals(code, oldCode, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            if (!await choices.IsActiveChoiceAsync(field, code, cancellationToken))
            {
                errors[field] = ["Choose an active value from the available list."];
                //errors[property!] = ["Choose an active value from the available list."];
            }
        }

        return errors;
    }

    private static string ToFlag(bool value) => value ? "Y" : "N";

    private static ClaimConfigurationSaveResult StorageCapacityError() =>
        new(
            ClaimConfigurationSaveOutcome.Invalid,
            Errors: new Dictionary<string, string[]>
            {
                ["storage"] = ["A value exceeds the storage capacity of a database column. Shorten the value and try again."]
            });
}
