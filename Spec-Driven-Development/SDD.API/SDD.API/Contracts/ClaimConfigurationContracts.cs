namespace SDD.API.Contracts;

public record ClaimConfigurationWrite
{
    public string? CcmCode { get; init; }
    public string? CcmName { get; init; }
    public string? CcmShortName { get; init; }
    public string? NameInArabic { get; init; }
    public string? ShortNameInArabic { get; init; }
    public string? Module { get; init; }
    public string? PostingType { get; init; }
    public string? ExchangeRateType { get; init; }
    public string? RoundingType { get; init; }
    public decimal? RoundingValue { get; init; }
    public string? ApplicableCurrencies { get; init; }
    public string? DefaultEstimateCloseReasonCode { get; init; }
    public string? DefaultRecoveryCodeForDedl { get; init; }
    public string? PrintBeforeApprovalYn { get; init; }
    public string? RePrintAllowedYn { get; init; }
    public string? ClaimAccountDocumentGenerationYn { get; init; }
    public string? SharingClaimsAccountDocumentGenerationYn { get; init; }
    public string? ActiveYn { get; init; }
}

public sealed record ClaimConfigurationUpdate : ClaimConfigurationWrite
{
    public string? ExpectedVersion { get; init; }
}

public sealed record ClaimConfigurationSummary(
    string CcmCompCode,
    string CcmCode,
    string CcmName,
    string? CcmShortName,
    string? ModuleName,
    string? CreatedBy,
    DateTime? CreatedDate,
    string? UpdatedBy,
    DateTime? UpdatedDate);

public sealed record ClaimConfigurationRecord
{
    public required string CcmCode { get; init; }
    public required string CcmName { get; init; }
    public string? CcmShortName { get; init; }
    public string? NameInArabic { get; init; }
    public string? ShortNameInArabic { get; init; }
    public string? Module { get; init; }
    public string? ModuleDescription { get; init; }
    public string? PostingType { get; init; }
    public string? PostingTypeDescription { get; init; }
    public string? ExchangeRateType { get; init; }
    public string? ExchangeRateTypeDescription { get; init; }
    public string? RoundingType { get; init; }
    public string? RoundingTypeDescription { get; init; }
    public decimal? RoundingValue { get; init; }
    public string? ApplicableCurrencies { get; init; }
    public string? ApplicableCurrenciesDescription { get; init; }
    public string? DefaultEstimateCloseReasonCode { get; init; }
    public string? DefaultEstimateCloseReasonDescription { get; init; }
    public string? DefaultRecoveryCodeForDedl { get; init; }
    public string? DefaultRecoveryCodeForDedlDescription { get; init; }
    public string? PrintBeforeApprovalYn { get; init; }
    public string? RePrintAllowedYn { get; init; }
    public string? ClaimAccountDocumentGenerationYn { get; init; }
    public string? SharingClaimsAccountDocumentGenerationYn { get; init; }
    public string? ActiveYn { get; init; }
    public string? CreatedBy { get; init; }
    public DateTime? CreatedDate { get; init; }
    public string? UpdatedBy { get; init; }
    public DateTime? UpdatedDate { get; init; }
    public required string Version { get; init; }
}

public enum ClaimConfigurationSortColumn
{
    CompanyCode,
    Code,
    Name,
    ShortName,
    ModuleName
}

public enum ClaimConfigurationFilterColumn
{
    CompanyCode,
    CcmCode,
    CcmName,
    ShortName,
    ModuleName
}

public sealed record ClaimConfigurationFilter(
    ClaimConfigurationFilterColumn Column,
    CodeFilterOperator Operator,
    string Value);

public sealed record ClaimConfigurationLookupOption(string Code, string? Description);

public record ApplicableProductWrite
{
    public string? ProductCode { get; init; }
}

public sealed record ApplicableProductUpdate : ApplicableProductWrite
{
    public string? ExpectedVersion { get; init; }
}

public sealed record ApplicableProductSummary(string ProductCode, string? ProductName);

public sealed record ApplicableProductRecord
{
    public required string ParentCcmCode { get; init; }
    public required string ProductCode { get; init; }
    public string? ProductName { get; init; }
    public string? CreatedBy { get; init; }
    public DateTime? CreatedDate { get; init; }
    public string? UpdatedBy { get; init; }
    public DateTime? UpdatedDate { get; init; }
    public required string Version { get; init; }
}

public sealed record OracleColumnValue(string FieldName, string TableName, string ColumnName, string? Value);

public sealed record OracleColumnLength(
    string FieldName,
    string TableName,
    string ColumnName,
    bool IsCharacterSemantics,
    bool IsNullable,
    int MaximumLength,
    int? ActualLength);