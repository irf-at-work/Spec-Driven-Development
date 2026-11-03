namespace SDD.API.Contracts;

public record ApplicableModuleWriteRequest
{
    public string? ApplicableFor { get; init; }
    public string? ProductFrom { get; init; }
    public string? ProductTo { get; init; }
    public string? PcmFrom { get; init; }
    public string? PcmTo { get; init; }
    public string? CcmFrom { get; init; }
    public string? CcmTo { get; init; }
    public string? MandatoryYn { get; init; }
    public string? ActiveYn { get; init; }
}

public sealed record ApplicableModuleUpdateRequest : ApplicableModuleWriteRequest
{
    public string? ExpectedVersion { get; init; }
}

public sealed record ApplicableModuleSummary(
    string DamodUid,
    string ApplicableFor,
    string? ProductFrom,
    string? ProductTo,
    string? PcmFrom,
    string? PcmTo,
    string? CcmFrom,
    string? CcmTo,
    string? MandatoryYn,
    string? ActiveYn,
    string Version);

public sealed record ApplicableModuleRecord(
    string DamodUid,
    string DamodDocCode,
    string ApplicableFor,
    string? ProductFrom,
    string? ProductTo,
    string? PcmFrom,
    string? PcmTo,
    string? CcmFrom,
    string? CcmTo,
    string? MandatoryYn,
    string? ActiveYn,
    string? CreatedBy,
    DateTime? CreatedDate,
    string? UpdatedBy,
    DateTime? UpdatedDate,
    string Version);

public enum ApplicableModuleFilterColumn
{
    ApplicableFor,
    ProductFrom,
    ProductTo,
    PcmFrom,
    PcmTo,
    CcmFrom,
    CcmTo,
    MandatoryYn,
    ActiveYn
}

public sealed record ApplicableModuleFilter(
    ApplicableModuleFilterColumn Column,
    CodeFilterOperator Operator,
    string Value);
