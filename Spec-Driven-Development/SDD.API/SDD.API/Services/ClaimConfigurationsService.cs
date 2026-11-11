using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public sealed class ClaimConfigurationsService(
    IClaimConfigurationsRepository repository,
    ClaimConfigurationValidator validator,
    OracleColumnLengthValidator columnLengthValidator,
    ILogger<ClaimConfigurationsService> logger) : IClaimConfigurationsService
{
    private static readonly IReadOnlyDictionary<string, string> LookupTypes =
        new Dictionary<string, string>(StringComparer.Ordinal)
        {
            ["module"] = "CCM_MODULE",
            ["postingType"] = "CCM_POST_TYPE",
            ["exchangeRateType"] = "CCM_EXCH_RATE",
            ["roundingType"] = "CCM_ROUND_TYPE",
            ["applicableCurrencies"] = "CCM_CURR_TYPE",
            ["defaultEstimateCloseReasonCode"] = "CCM_CLO_REASON",
            ["defaultRecoveryCodeForDedl"] = "CCM_DFLT_RECV_DEDU",
            ["productCode"] = "CCM_PRODUCT"
        };

    private static readonly IReadOnlyDictionary<string, string> ColumnNames =
        new Dictionary<string, string>(StringComparer.Ordinal)
        {
            ["ccmCode"] = "CCM_CODE",
            ["ccmName"] = "CCM_NAME",
            ["ccmShortName"] = "CCM_SHORT_NAME",
            ["nameInArabic"] = "CCM_NAME_L2",
            ["shortNameInArabic"] = "CCM_SHORT_NAME_L2",
            ["module"] = "CCM_MODULE",
            ["postingType"] = "CCM_ACNT_POSTING_TYPE",
            ["exchangeRateType"] = "CCM_ACNT_EXCH_RATE_TYPE",
            ["roundingType"] = "CCM_ROUND_TYPE",
            ["applicableCurrencies"] = "CCM_APPL_CURR_TYPE",
            ["defaultEstimateCloseReasonCode"] = "CCM_DFLT_EST_CLO_REASON_CODE",
            ["defaultRecoveryCodeForDedl"] = "CCM_DFLT_RECV_DEDU_CODE",
            ["printBeforeApprovalYn"] = "CCM_PRNT_BEF_APPR_YN",
            ["rePrintAllowedYn"] = "CCM_RE_PRNT_YN",
            ["claimAccountDocumentGenerationYn"] = "CCM_CLM_ACNT_DOC_GEN_YN",
            ["sharingClaimsAccountDocumentGenerationYn"] = "CCM_CLM_COINS_ACNT_DOC_GEN_YN",
            ["activeYn"] = "CCM_ACTIVE_YN"
        };

    public async Task<PaginatedResult<ClaimConfigurationSummary>> ListAsync(
        int page,
        int pageSize,
        IReadOnlyList<ClaimConfigurationFilter> filters,
        ClaimConfigurationSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken)
    {
        if (page < 1 || pageSize is not (10 or 15 or 20 or 50) ||
            !Enum.IsDefined(sortBy) || !Enum.IsDefined(sortDirection))
        {
            throw InvalidPage();
        }

        var skip = (long)(page - 1) * pageSize;
        if (skip > int.MaxValue)
        {
            throw InvalidPage();
        }

        var totalCount = await repository.CountAsync(filters, cancellationToken);
        var rows = await repository.GetPageAsync(
            (int)skip,
            pageSize,
            filters,
            sortBy,
            sortDirection,
            cancellationToken);
        return new PaginatedResult<ClaimConfigurationSummary>(
            rows.Select(row => new ClaimConfigurationSummary(
                row.CcmCompCode,
                row.CcmCode,
                row.CcmName,
                row.CcmShortName,
                row.ModuleName,
                row.CreatedBy,
                row.CreatedDate,
                row.UpdatedBy,
                row.UpdatedDate)).ToArray(),
            page,
            pageSize,
            totalCount);
    }

    public async Task<ClaimConfigurationRecord> CreateAsync(
        ClaimConfigurationWrite request,
        CancellationToken cancellationToken)
    {
        validator.EnsureValid(request);
        await EnsureParentColumnLengthsAsync(request, null, cancellationToken);
        await EnsureLookupsAsync(request, null, cancellationToken);
        if (await repository.ExistsAsync(request.CcmCode!, cancellationToken))
        {
            throw DuplicateParent();
        }

        var record = ToEntity(request);
        record.CCM_COMP_CODE = "CCM001";
        record.CCM_CR_BY = "ADMIN";
        record.CCM_CR_DT = await repository.GetSystemDateAsync(cancellationToken);
        record.CCM_UP_BY = null;
        record.CCM_UP_DT = null;
        try
        {
            await repository.AddAsync(record, cancellationToken);
            await repository.SaveChangesAsync(cancellationToken);
        }
        catch (OracleException exception) when (exception.Number == 1)
        {
            throw DuplicateParent();
        }
        catch (DbUpdateException exception) when (FindOracleException(exception)?.Number == 1)
        {
            throw DuplicateParent();
        }

        logger.LogInformation("Created a Claim Configuration Master record.");
        return await MapAsync(record, cancellationToken);
    }

    public async Task<ClaimConfigurationRecord?> GetAsync(
        string ccmCode,
        CancellationToken cancellationToken)
    {
        await EnsureKeyLengthAsync("ccmCode", "BRM_CLM_CONFIG", "CCM_CODE", ccmCode, cancellationToken);
        var record = await repository.FindAsync(ccmCode, cancellationToken);
        return record is null ? null : await MapAsync(record, cancellationToken);
    }

    public async Task<ClaimConfigurationRecord?> UpdateAsync(
        string ccmCode,
        ClaimConfigurationUpdate request,
        CancellationToken cancellationToken)
    {
        if (!string.Equals(request.CcmCode, ccmCode, StringComparison.Ordinal))
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The claim configuration code cannot be changed.",
                "Keep Claim Config Code unchanged when editing this record.");
        }

        if (string.IsNullOrWhiteSpace(request.ExpectedVersion))
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The expected version is required.",
                "Reload the claim configuration and try again.");
        }

        validator.EnsureValid(request);
        var original = await repository.FindAsync(ccmCode, cancellationToken);
        if (original is null)
        {
            return null;
        }

        await EnsureParentColumnLengthsAsync(request, original, cancellationToken);
        await EnsureLookupsAsync(request, original, cancellationToken);
        var record = await repository.UpdateIfCurrentAsync(
            ccmCode,
            request.ExpectedVersion,
            async (current, token) =>
            {
                ApplyEditableValues(current, request);
                current.CCM_UP_BY = "ADMIN";
                current.CCM_UP_DT = await repository.GetSystemDateAsync(token);
            },
            cancellationToken);

        if (record is null)
        {
            return null;
        }

        logger.LogInformation("Updated a Claim Configuration Master record.");
        return await MapAsync(record, cancellationToken);
    }

    public async Task<bool> DeleteAsync(string ccmCode, CancellationToken cancellationToken)
    {
        await EnsureKeyLengthAsync("ccmCode", "BRM_CLM_CONFIG", "CCM_CODE", ccmCode, cancellationToken);
        var deleted = await repository.DeleteIfChildFreeAsync(ccmCode, cancellationToken);
        if (deleted)
        {
            logger.LogInformation("Deleted a Claim Configuration Master record.");
        }

        return deleted;
    }

    public async Task<IReadOnlyList<ClaimConfigurationLookupOption>> GetLookupsAsync(
        string liType,
        CancellationToken cancellationToken)
    {
        if (!LookupTypes.Values.Contains(liType, StringComparer.Ordinal))
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The requested lookup type is not supported.",
                "Choose one of the CCM lookup types.");
        }

        return await repository.GetActiveLookupsAsync(liType, cancellationToken);
    }

    public async Task<IReadOnlyList<ApplicableProductSummary>> GetProductsAsync(
        string ccmCode,
        CancellationToken cancellationToken)
    {
        await EnsureParentExistsAsync(ccmCode, cancellationToken);
        return await repository.GetProductsAsync(ccmCode, cancellationToken);
    }

    public async Task<ApplicableProductRecord> CreateProductAsync(
        string ccmCode,
        ApplicableProductWrite request,
        CancellationToken cancellationToken)
    {
        validator.EnsureProductValid(request);
        await EnsureProductColumnLengthsAsync(ccmCode, request.ProductCode!, cancellationToken);
        if (!await repository.IsActiveLookupAsync(
                "CCM_PRODUCT",
                request.ProductCode!,
                cancellationToken))
        {
            throw InvalidProductLookup();
        }

        try
        {
            var record = await repository.CreateProductAsync(
                ccmCode,
                request.ProductCode!,
                cancellationToken);
            logger.LogInformation("Created an Applicable Product mapping.");
            return await MapProductAsync(record, cancellationToken);
        }
        catch (OracleException exception) when (exception.Number == 1)
        {
            throw DuplicateProduct();
        }
        catch (DbUpdateException exception) when (FindOracleException(exception)?.Number == 1)
        {
            throw DuplicateProduct();
        }
    }

    public async Task<ApplicableProductRecord?> GetProductAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken)
    {
        await EnsureProductColumnLengthsAsync(ccmCode, productCode, cancellationToken);
        await EnsureParentExistsAsync(ccmCode, cancellationToken);
        var record = await repository.FindProductAsync(ccmCode, productCode, cancellationToken);
        return record is null ? null : await MapProductAsync(record, cancellationToken);
    }

    public async Task<ApplicableProductRecord?> UpdateProductAsync(
        string ccmCode,
        string productCode,
        ApplicableProductUpdate request,
        CancellationToken cancellationToken)
    {
        validator.EnsureProductValid(request);
        if (string.IsNullOrWhiteSpace(request.ExpectedVersion))
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The expected version is required.",
                "Reload the Applicable Product mapping and try again.");
        }

        await EnsureProductColumnLengthsAsync(ccmCode, productCode, cancellationToken);
        await EnsureProductColumnLengthsAsync(ccmCode, request.ProductCode!, cancellationToken);
        try
        {
            var record = await repository.UpdateProductIfCurrentAsync(
                ccmCode,
                productCode,
                request.ProductCode!,
                request.ExpectedVersion,
                cancellationToken);
            if (record is null)
            {
                return null;
            }

            logger.LogInformation("Updated an Applicable Product mapping.");
            return await MapProductAsync(record, cancellationToken);
        }
        catch (OracleException exception) when (exception.Number == 1)
        {
            throw DuplicateProduct();
        }
        catch (DbUpdateException exception) when (FindOracleException(exception)?.Number == 1)
        {
            throw DuplicateProduct();
        }
    }

    public async Task<bool> DeleteProductAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken)
    {
        await EnsureProductColumnLengthsAsync(ccmCode, productCode, cancellationToken);
        var deleted = await repository.DeleteProductAsync(ccmCode, productCode, cancellationToken);
        if (deleted)
        {
            logger.LogInformation("Deleted an Applicable Product mapping.");
        }

        return deleted;
    }

    private async Task EnsureParentExistsAsync(string ccmCode, CancellationToken cancellationToken)
    {
        await EnsureKeyLengthAsync("ccmCode", "BRM_CLM_CONFIG", "CCM_CODE", ccmCode, cancellationToken);
        if (await repository.FindAsync(ccmCode, cancellationToken) is null)
        {
            throw MissingParent();
        }
    }

    private async Task EnsureParentColumnLengthsAsync(
        ClaimConfigurationWrite request,
        BRM_CLM_CONFIG? existing,
        CancellationToken cancellationToken)
    {
        var values = new Dictionary<string, string?>
        {
            ["companyCode"] = "CCM001",
            ["ccmCode"] = request.CcmCode,
            ["ccmName"] = request.CcmName,
            ["ccmShortName"] = request.CcmShortName,
            ["nameInArabic"] = request.NameInArabic,
            ["shortNameInArabic"] = request.ShortNameInArabic,
            ["module"] = request.Module,
            ["postingType"] = request.PostingType,
            ["exchangeRateType"] = request.ExchangeRateType,
            ["roundingType"] = request.RoundingType,
            ["applicableCurrencies"] = request.ApplicableCurrencies,
            ["defaultEstimateCloseReasonCode"] = request.DefaultEstimateCloseReasonCode,
            ["defaultRecoveryCodeForDedl"] = request.DefaultRecoveryCodeForDedl,
            ["printBeforeApprovalYn"] = request.PrintBeforeApprovalYn ?? existing?.CCM_PRNT_BEF_APPR_YN ?? "N",
            ["rePrintAllowedYn"] = request.RePrintAllowedYn ?? existing?.CCM_RE_PRNT_YN ?? "N",
            ["claimAccountDocumentGenerationYn"] = request.ClaimAccountDocumentGenerationYn ??
                existing?.CCM_CLM_ACNT_DOC_GEN_YN ?? "N",
            ["sharingClaimsAccountDocumentGenerationYn"] = request.SharingClaimsAccountDocumentGenerationYn ??
                existing?.CCM_CLM_COINS_ACNT_DOC_GEN_YN ?? "N",
            ["activeYn"] = request.ActiveYn ?? existing?.CCM_ACTIVE_YN ?? "Y"
        };
        var metadataValues = values.Select(pair => pair.Key == "companyCode"
                ? new OracleColumnValue(pair.Key, "BRM_CLM_CONFIG", "CCM_COMP_CODE", pair.Value)
                : new OracleColumnValue(pair.Key, "BRM_CLM_CONFIG", ColumnNames[pair.Key], pair.Value))
            .ToArray();
        var metadata = await columnLengthValidator.ValidateAsync(metadataValues, cancellationToken);
        ThrowColumnErrors(metadata, values);
    }

    private async Task EnsureKeyLengthAsync(
        string field,
        string table,
        string column,
        string value,
        CancellationToken cancellationToken)
    {
        var values = new Dictionary<string, string?> { [field] = value };
        var metadata = await columnLengthValidator.ValidateAsync(
            [new OracleColumnValue(field, table, column, value)],
            cancellationToken);
        ThrowColumnErrors(metadata, values);
    }

    private async Task EnsureProductColumnLengthsAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken)
    {
        var values = new Dictionary<string, string?>
        {
            ["ccmCode"] = ccmCode,
            ["productCode"] = productCode
        };
        var metadata = await columnLengthValidator.ValidateAsync(
            [
                new OracleColumnValue("ccmCode", "BRM_CCM_PROD", "CCMP_CCM_CODE", ccmCode),
                new OracleColumnValue("productCode", "BRM_CCM_PROD", "CCMP_CODE", productCode)
            ],
            cancellationToken);
        ThrowColumnErrors(metadata, values);
    }

    private static void ThrowColumnErrors(
        IReadOnlyList<OracleColumnLength> metadata,
        IReadOnlyDictionary<string, string?> values)
    {
        var errors = new Dictionary<string, List<string>>();
        foreach (var column in metadata)
        {
            if (!values.TryGetValue(column.FieldName, out var value))
            {
                throw new InvalidOperationException(
                    $"No submitted value was provided for Oracle field {column.FieldName}.");
            }

            if (value is null && !column.IsNullable)
            {
                AddError(errors, column.FieldName, "This field is required by the database.");
            }
            else if (column.ActualLength > column.MaximumLength)
            {
                var unit = column.IsCharacterSemantics ? "characters" : "bytes";
                AddError(errors, column.FieldName, $"This field cannot exceed {column.MaximumLength} {unit}.");
            }
        }

        if (errors.Count > 0)
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The submitted claim configuration is not valid.",
                "Correct the highlighted fields and try again.",
                errors.ToDictionary(
                    pair => JsonNamingPolicy.CamelCase.ConvertName(pair.Key),
                    pair => pair.Value.ToArray()));
        }
    }

    private async Task EnsureLookupsAsync(
        ClaimConfigurationWrite request,
        BRM_CLM_CONFIG? existing,
        CancellationToken cancellationToken)
    {
        await EnsureLookupAsync("module", request.Module, existing?.CCM_MODULE, cancellationToken);
        await EnsureLookupAsync("postingType", request.PostingType, existing?.CCM_ACNT_POSTING_TYPE, cancellationToken);
        await EnsureLookupAsync(
            "exchangeRateType",
            request.ExchangeRateType,
            existing?.CCM_ACNT_EXCH_RATE_TYPE,
            cancellationToken);
        await EnsureLookupAsync("roundingType", request.RoundingType, existing?.CCM_ROUND_TYPE, cancellationToken);
        await EnsureLookupAsync(
            "applicableCurrencies",
            request.ApplicableCurrencies,
            existing?.CCM_APPL_CURR_TYPE,
            cancellationToken);
        await EnsureLookupAsync(
            "defaultEstimateCloseReasonCode",
            request.DefaultEstimateCloseReasonCode,
            existing?.CCM_DFLT_EST_CLO_REASON_CODE,
            cancellationToken);
        await EnsureLookupAsync(
            "defaultRecoveryCodeForDedl",
            request.DefaultRecoveryCodeForDedl,
            existing?.CCM_DFLT_RECV_DEDU_CODE,
            cancellationToken);
    }

    private async Task EnsureLookupAsync(
        string field,
        string? value,
        string? savedValue,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(value) ||
            string.Equals(value, savedValue, StringComparison.Ordinal))
        {
            return;
        }

        if (await repository.IsActiveLookupAsync(LookupTypes[field], value, cancellationToken))
        {
            return;
        }

        throw new CodesApiException(
            StatusCodes.Status400BadRequest,
            "The submitted claim configuration is not valid.",
            "Choose an active value from the corresponding lookup.",
            new Dictionary<string, string[]>
            {
                [field] = ["Choose an active value from the corresponding lookup."]
            });
    }

    private async Task<ClaimConfigurationRecord> MapAsync(
        BRM_CLM_CONFIG record,
        CancellationToken cancellationToken) =>
        new()
        {
            CcmCode = record.CCM_CODE,
            CcmName = record.CCM_NAME,
            CcmShortName = record.CCM_SHORT_NAME,
            NameInArabic = record.CCM_NAME_L2,
            ShortNameInArabic = record.CCM_SHORT_NAME_L2,
            Module = record.CCM_MODULE,
            ModuleDescription = await repository.GetLookupDescriptionAsync("CCM_MODULE", record.CCM_MODULE, cancellationToken),
            PostingType = record.CCM_ACNT_POSTING_TYPE,
            PostingTypeDescription = await repository.GetLookupDescriptionAsync("CCM_POST_TYPE", record.CCM_ACNT_POSTING_TYPE, cancellationToken),
            ExchangeRateType = record.CCM_ACNT_EXCH_RATE_TYPE,
            ExchangeRateTypeDescription = await repository.GetLookupDescriptionAsync("CCM_EXCH_RATE", record.CCM_ACNT_EXCH_RATE_TYPE, cancellationToken),
            RoundingType = record.CCM_ROUND_TYPE,
            RoundingTypeDescription = await repository.GetLookupDescriptionAsync("CCM_ROUND_TYPE", record.CCM_ROUND_TYPE, cancellationToken),
            RoundingValue = record.CCM_ROUND_VALUE,
            ApplicableCurrencies = record.CCM_APPL_CURR_TYPE,
            ApplicableCurrenciesDescription = await repository.GetLookupDescriptionAsync("CCM_CURR_TYPE", record.CCM_APPL_CURR_TYPE, cancellationToken),
            DefaultEstimateCloseReasonCode = record.CCM_DFLT_EST_CLO_REASON_CODE,
            DefaultEstimateCloseReasonDescription = await repository.GetLookupDescriptionAsync("CCM_CLO_REASON", record.CCM_DFLT_EST_CLO_REASON_CODE, cancellationToken),
            DefaultRecoveryCodeForDedl = record.CCM_DFLT_RECV_DEDU_CODE,
            DefaultRecoveryCodeForDedlDescription = await repository.GetLookupDescriptionAsync("CCM_DFLT_RECV_DEDU", record.CCM_DFLT_RECV_DEDU_CODE, cancellationToken),
            PrintBeforeApprovalYn = record.CCM_PRNT_BEF_APPR_YN,
            RePrintAllowedYn = record.CCM_RE_PRNT_YN,
            ClaimAccountDocumentGenerationYn = record.CCM_CLM_ACNT_DOC_GEN_YN,
            SharingClaimsAccountDocumentGenerationYn = record.CCM_CLM_COINS_ACNT_DOC_GEN_YN,
            ActiveYn = record.CCM_ACTIVE_YN,
            CreatedBy = record.CCM_CR_BY,
            CreatedDate = record.CCM_CR_DT,
            UpdatedBy = record.CCM_UP_BY,
            UpdatedDate = record.CCM_UP_DT,
            Version = ClaimConfigurationVersion.Create(record)
        };

    private async Task<ApplicableProductRecord> MapProductAsync(
        BRM_CCM_PROD product,
        CancellationToken cancellationToken) =>
        new()
        {
            ParentCcmCode = product.CCMP_CCM_CODE,
            ProductCode = product.CCMP_CODE,
            ProductName = await repository.GetLookupDescriptionAsync(
                "CCM_PRODUCT",
                product.CCMP_CODE,
                cancellationToken),
            CreatedBy = product.CCMP_CR_BY,
            CreatedDate = product.CCMP_CR_DT,
            UpdatedBy = product.CCMP_UP_BY,
            UpdatedDate = product.CCMP_UP_DT,
            Version = ClaimConfigurationVersion.Create(product)
        };

    private static BRM_CLM_CONFIG ToEntity(ClaimConfigurationWrite request) =>
        new()
        {
            CCM_CODE = request.CcmCode!,
            CCM_NAME = request.CcmName!,
            CCM_SHORT_NAME = request.CcmShortName,
            CCM_NAME_L2 = request.NameInArabic,
            CCM_SHORT_NAME_L2 = request.ShortNameInArabic,
            CCM_MODULE = request.Module,
            CCM_ACNT_POSTING_TYPE = request.PostingType,
            CCM_ACNT_EXCH_RATE_TYPE = request.ExchangeRateType,
            CCM_ROUND_TYPE = request.RoundingType,
            CCM_ROUND_VALUE = request.RoundingValue,
            CCM_APPL_CURR_TYPE = request.ApplicableCurrencies,
            CCM_DFLT_EST_CLO_REASON_CODE = request.DefaultEstimateCloseReasonCode,
            CCM_DFLT_RECV_DEDU_CODE = request.DefaultRecoveryCodeForDedl,
            CCM_PRNT_BEF_APPR_YN = request.PrintBeforeApprovalYn ?? "N",
            CCM_RE_PRNT_YN = request.RePrintAllowedYn ?? "N",
            CCM_CLM_ACNT_DOC_GEN_YN = request.ClaimAccountDocumentGenerationYn ?? "N",
            CCM_CLM_COINS_ACNT_DOC_GEN_YN = request.SharingClaimsAccountDocumentGenerationYn ?? "N",
            CCM_ACTIVE_YN = request.ActiveYn ?? "Y"
        };

    private static void ApplyEditableValues(BRM_CLM_CONFIG record, ClaimConfigurationWrite request)
    {
        record.CCM_NAME = request.CcmName!;
        record.CCM_SHORT_NAME = request.CcmShortName;
        record.CCM_NAME_L2 = request.NameInArabic;
        record.CCM_SHORT_NAME_L2 = request.ShortNameInArabic;
        record.CCM_MODULE = request.Module;
        record.CCM_ACNT_POSTING_TYPE = request.PostingType;
        record.CCM_ACNT_EXCH_RATE_TYPE = request.ExchangeRateType;
        record.CCM_ROUND_TYPE = request.RoundingType;
        record.CCM_ROUND_VALUE = request.RoundingValue;
        record.CCM_APPL_CURR_TYPE = request.ApplicableCurrencies;
        record.CCM_DFLT_EST_CLO_REASON_CODE = request.DefaultEstimateCloseReasonCode;
        record.CCM_DFLT_RECV_DEDU_CODE = request.DefaultRecoveryCodeForDedl;
        record.CCM_PRNT_BEF_APPR_YN = request.PrintBeforeApprovalYn ?? record.CCM_PRNT_BEF_APPR_YN;
        record.CCM_RE_PRNT_YN = request.RePrintAllowedYn ?? record.CCM_RE_PRNT_YN;
        record.CCM_CLM_ACNT_DOC_GEN_YN = request.ClaimAccountDocumentGenerationYn ??
            record.CCM_CLM_ACNT_DOC_GEN_YN;
        record.CCM_CLM_COINS_ACNT_DOC_GEN_YN = request.SharingClaimsAccountDocumentGenerationYn ??
            record.CCM_CLM_COINS_ACNT_DOC_GEN_YN;
        record.CCM_ACTIVE_YN = request.ActiveYn ?? record.CCM_ACTIVE_YN;
    }

    private static void AddError(
        IDictionary<string, List<string>> errors,
        string field,
        string message)
    {
        if (!errors.TryGetValue(field, out var messages))
        {
            messages = [];
            errors[field] = messages;
        }

        messages.Add(message);
    }

    private static CodesApiException InvalidPage() =>
        new(
            StatusCodes.Status400BadRequest,
            "The requested page is not available.",
            "Choose a positive page number and a page size of 10, 15, 20, or 50.");

    private static CodesApiException DuplicateParent() =>
        new(
            StatusCodes.Status409Conflict,
            "A claim configuration with this code already exists.",
            "Enter a different Claim Config Code.");

    private static CodesApiException DuplicateProduct() =>
        new(
            StatusCodes.Status409Conflict,
            "This product is already mapped to the claim configuration.",
            "Choose a different Product Code.");

    private static CodesApiException InvalidProductLookup() =>
        new(
            StatusCodes.Status400BadRequest,
            "The submitted product mapping is not valid.",
            "Choose an active Product Code from the product lookup.",
            new Dictionary<string, string[]>
            {
                ["productCode"] = ["Choose an active Product Code."]
            });

    private static CodesApiException MissingParent() =>
        new(
            StatusCodes.Status404NotFound,
            "The claim configuration could not be found.",
            "Refresh the listing and try again.");

    private static OracleException? FindOracleException(Exception exception)
    {
        for (Exception? current = exception; current is not null; current = current.InnerException)
        {
            if (current is OracleException oracleException)
            {
                return oracleException;
            }
        }

        return null;
    }
}