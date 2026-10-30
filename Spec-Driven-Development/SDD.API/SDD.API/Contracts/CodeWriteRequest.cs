using System.ComponentModel.DataAnnotations;

namespace SDD.API.Contracts;

public sealed class CodeWriteRequest
{
    [Required]
    public string Code { get; init; } = string.Empty;

    [Required]
    public string CodeType { get; init; } = string.Empty;

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
}
