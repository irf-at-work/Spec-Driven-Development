namespace SDD.API.Contracts;

public sealed class ListItemListQuery
{
    public int Page { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public string SortBy { get; init; } = "liType";

    public string SortDirection { get; init; } = "asc";

    public string? LiType { get; init; }

    public ListItemFilterOperator? LiTypeOperator { get; init; }

    public string? LiCode { get; init; }

    public ListItemFilterOperator? LiCodeOperator { get; init; }

    public string? Description { get; init; }

    public ListItemFilterOperator? DescriptionOperator { get; init; }

    public string? ShortDescription { get; init; }

    public ListItemFilterOperator? ShortDescriptionOperator { get; init; }

    public string? Value { get; init; }

    public ListItemFilterOperator? ValueOperator { get; init; }

    public string? ActiveYn { get; init; }
}
