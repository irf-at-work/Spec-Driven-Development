using SDD.API.DTOs;

namespace SDD.API.Services;

public sealed record ClaimConfigurationValues(
    string CcmCode,
    string Name,
    string? ShortName,
    string? NameL2,
    string? ShortNameL2,
    string? Module,
    string? AccountingPostingType,
    string? AccountingExchangeRateType,
    string? RoundingType,
    decimal? RoundingValue,
    string? ApplicableCurrencyType,
    string? DefaultEstimatedClosureReasonCode,
    string? DefaultRecoveryDeductionCode,
    bool? PrintBeforeApproval,
    bool? Reprint,
    bool? ClaimAccountingDocumentGeneration,
    bool? ClaimCoinsuranceAccountingDocumentGeneration,
    bool? Active);

public static class ClaimConfigurationInputRules
{
    public static ClaimConfigurationValues Normalise(CreateClaimConfigurationRequest request) => new(
        NormaliseCode(request.CcmCode),
        NormaliseRequiredName(request.Name),
        NormaliseOptionalName(request.ShortName),
        request.NameL2,
        request.ShortNameL2,
        NormaliseOptionalCode(request.Module),
        NormaliseOptionalCode(request.AccountingPostingType),
        NormaliseOptionalCode(request.AccountingExchangeRateType),
        NormaliseOptionalCode(request.RoundingType),
        request.RoundingValue,
        NormaliseOptionalCode(request.ApplicableCurrencyType),
        NormaliseOptionalCode(request.DefaultEstimatedClosureReasonCode),
        NormaliseOptionalCode(request.DefaultRecoveryDeductionCode),
        request.PrintBeforeApproval,
        request.Reprint,
        request.ClaimAccountingDocumentGeneration,
        request.ClaimCoinsuranceAccountingDocumentGeneration,
        request.Active);

    public static ClaimConfigurationValues Normalise(UpdateClaimConfigurationRequest request, string ccmCode) => new(
        NormaliseCode(ccmCode),
        NormaliseRequiredName(request.Name),
        NormaliseOptionalName(request.ShortName),
        request.NameL2,
        request.ShortNameL2,
        NormaliseOptionalCode(request.Module),
        NormaliseOptionalCode(request.AccountingPostingType),
        NormaliseOptionalCode(request.AccountingExchangeRateType),
        NormaliseOptionalCode(request.RoundingType),
        request.RoundingValue,
        NormaliseOptionalCode(request.ApplicableCurrencyType),
        NormaliseOptionalCode(request.DefaultEstimatedClosureReasonCode),
        NormaliseOptionalCode(request.DefaultRecoveryDeductionCode),
        request.PrintBeforeApproval,
        request.Reprint,
        request.ClaimAccountingDocumentGeneration,
        request.ClaimCoinsuranceAccountingDocumentGeneration,
        request.Active);

    public static IReadOnlyDictionary<string, string[]> Validate(ClaimConfigurationValues values)
    {
        var errors = new Dictionary<string, string[]>();
        if (values.CcmCode.Length is < 1 or > 12 || !values.CcmCode.All(IsAllowedCodeCharacter))
        {
            errors["ccmCode"] = ["CCM Code is required and can contain 1–12 letters, digits or hyphens."];
        }

        if (values.Name.Length == 0)
        {
            errors["name"] = ["Claim Config Name is required."];
        }
        if (values.RoundingValue is { } rounding && (rounding <= -1000m || rounding >= 1000m || decimal.Round(rounding, 5) != rounding))
        {
            errors["roundingValue"] = ["Rounding Value exceeds the storage capacity of NUMBER(8,5)."];
        }

        return errors;
    }

    private static string NormaliseCode(string? value) => (value ?? string.Empty).Trim().ToUpperInvariant();

    private static string? NormaliseOptionalCode(string? value)
    {
        var normalised = NormaliseCode(value);
        return normalised.Length == 0 ? null : normalised;
    }

    private static string NormaliseRequiredName(string? value) => (value ?? string.Empty).Trim().ToUpperInvariant();

    private static string? NormaliseOptionalName(string? value)
    {
        var normalised = (value ?? string.Empty).Trim();
        return normalised.Length == 0 ? null : normalised.ToUpperInvariant();
    }

    private static bool IsAllowedCodeCharacter(char character) =>
        character is (>= 'A' and <= 'Z') or (>= '0' and <= '9') or '-';

}
