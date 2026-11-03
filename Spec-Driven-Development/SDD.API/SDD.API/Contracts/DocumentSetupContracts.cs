namespace SDD.API.Contracts;

public record DocumentSetupWriteRequest
{
    public string? DocCode { get; init; }
    public string? DocName { get; init; }
    public string? NameInArabic { get; init; }
    public string? DocDescription { get; init; }
    public string? DescriptionInArabic { get; init; }
    public string? DocSetupFor { get; init; }
    public string? Flex1 { get; init; }
    public string? Flex2 { get; init; }
    public string? ActiveYn { get; init; }
}

public sealed record DocumentSetupUpdateRequest : DocumentSetupWriteRequest
{
    public string? ExpectedVersion { get; init; }
}

public sealed record DocumentSetupSummary(
    string DocCode,
    string? DocName,
    string? DocDescription,
    string? DocSetupFor,
    string? ActiveYn,
    string Version,
    string? CreatedBy = null,
    DateTime? CreatedDate = null,
    string? UpdatedBy = null,
    DateTime? UpdatedDate = null);

public sealed record DocumentSetupRecord(
    string DocCode,
    string? DocName,
    string? NameInArabic,
    string? DocDescription,
    string? DescriptionInArabic,
    string? DocSetupFor,
    string? Flex1,
    string? Flex2,
    string? ActiveYn,
    string? CreatedBy,
    DateTime? CreatedDate,
    string? UpdatedBy,
    DateTime? UpdatedDate,
    string Version);

public enum DocumentSetupFilterColumn
{
    DocCode,
    DocName,
    DocDescription,
    SetupFor,
}

public sealed record DocumentSetupFilter(
    DocumentSetupFilterColumn Column,
    CodeFilterOperator Operator,
    string Value);
