namespace SDD.API.Contracts;

public sealed class ListItemListItemDto
{
    public required string LiType { get; init; }

    public required string LiCode { get; init; }

    public string? Description { get; init; }

    public string? ShortDescription { get; init; }

    public string? Value { get; init; }

    public string? ActiveYn { get; init; }

    public string? CreatedBy { get; init; }

    public string? LastUpdatedBy { get; init; }
}
