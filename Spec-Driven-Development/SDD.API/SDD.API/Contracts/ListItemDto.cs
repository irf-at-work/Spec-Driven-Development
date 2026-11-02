namespace SDD.API.Contracts;

public sealed class ListItemDto
{
    public required string LiType { get; init; }

    public required string LiCode { get; init; }

    public string? Description { get; init; }

    public string? DescriptionL2 { get; init; }

    public string? ShortDescription { get; init; }

    public string? ShortDescriptionL2 { get; init; }

    public string? Value { get; init; }

    public string? ActiveYn { get; init; }

    public string? Flex01 { get; init; }

    public string? Flex02 { get; init; }

    public string? CreatedBy { get; init; }

    public DateTime? CreatedAt { get; init; }

    public string? LastUpdatedBy { get; init; }

    public DateTime? LastUpdatedAt { get; init; }
}
