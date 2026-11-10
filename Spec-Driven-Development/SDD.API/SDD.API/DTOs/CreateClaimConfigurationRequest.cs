namespace SDD.API.DTOs;

public sealed record CreateClaimConfigurationRequest(
    string? CcmCode,
    string? Name,
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
