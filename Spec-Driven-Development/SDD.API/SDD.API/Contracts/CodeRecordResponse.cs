namespace SDD.API.Contracts;

public sealed class CodeRecordResponse
{
    public required string Code { get; init; }
    public required string CodeType { get; init; }
    public required string CompanyCode { get; init; }
    public string? CodeDescription { get; init; }
    public string? ShortDescription { get; init; }
    public string? LongDescription { get; init; }
    public string? Value1 { get; init; }
    public string? Value2 { get; init; }
    public string? Flex1 { get; init; }
    public string? Flex2 { get; init; }
    public string? DescriptionInArabic { get; init; }
    public string? ShortDescriptionInArabic { get; init; }
    public string? LongDescriptionInArabic { get; init; }
    public string? ActiveYn { get; init; }
    public string? CreatedBy { get; init; }
    public DateTime? CreatedDate { get; init; }
    public string? UpdatedBy { get; init; }
    public DateTime? UpdatedDate { get; init; }
}
