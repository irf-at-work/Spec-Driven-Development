namespace SDD.API.Contracts;

/// <summary>
/// The shared shape for every list endpoint: one page of items plus the totals needed for paging.
/// </summary>
public sealed record PaginatedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int TotalCount);
