using System.ComponentModel.DataAnnotations;

namespace SDD.API.Contracts;

public sealed class CreateListItemRequest
{
    [Required]
    [MaxLength(20)]
    public required string LiType { get; init; }

    [Required]
    [MaxLength(12)]
    public required string LiCode { get; init; }

    [MaxLength(100)]
    public string? Description { get; init; }

    [MaxLength(100)]
    public string? DescriptionL2 { get; init; }

    [MaxLength(30)]
    public string? ShortDescription { get; init; }

    [MaxLength(30)]
    public string? ShortDescriptionL2 { get; init; }

    [MaxLength(100)]
    public string? Value { get; init; }

    [RegularExpression("^[YN]$")]
    public string? ActiveYn { get; init; }

    [MaxLength(100)]
    public string? Flex01 { get; init; }

    [MaxLength(100)]
    public string? Flex02 { get; init; }
}
