using System.Linq.Expressions;
using SDD.API.Data.Scaffolded;

namespace SDD.API.Services;

/// <summary>
/// Column filters and sorting for the vehicle-make list. Both are applied to the whole table before a page is cut out
/// (FR-001, FR-002, FR-030), so a match on page 5 is found from page 1 and sorting covers every record.
/// </summary>
public static class VehicleMakeListQuery
{
    public const int PageSize = 10;
    public const int MaximumPage = 1_000_000;

    private const string DefaultSortColumn = "makeCode";

    // The allow-list: only these names can be sorted on, so nothing a caller types ever reaches the query as a column name.
    private static readonly Dictionary<string, Expression<Func<BrmVehMake, string?>>> SortColumns =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["makeCode"] = make => make.VmakCode,
            ["makeName"] = make => make.VmakName,
            ["shortName"] = make => make.VmakShortName
        };

    public static IReadOnlyDictionary<string, string[]> Validate(
        int page,
        ColumnFilters filters,
        string? sortBy,
        string? sortDirection)
    {
        var errors = new Dictionary<string, string[]>();

        ColumnFilterQuery.ValidatePage(page, errors);
        ColumnFilterQuery.ValidateOperators(filters, "makeCode", "makeName", errors);

        if (!string.IsNullOrWhiteSpace(sortBy) && !SortColumns.ContainsKey(sortBy.Trim()))
        {
            errors["sortBy"] = ["Sort by must be makeCode, makeName or shortName."];
        }

        if (!string.IsNullOrWhiteSpace(sortDirection) && !IsAscending(sortDirection) && !IsDescending(sortDirection))
        {
            errors["sortDirection"] = ["Sort direction must be asc or desc."];
        }

        return errors;
    }

    /// <summary>Assumes <see cref="Validate"/> has already passed.</summary>
    public static IQueryable<BrmVehMake> Apply(
        IQueryable<BrmVehMake> source,
        ColumnFilters filters,
        string? sortBy,
        string? sortDirection)
    {
        var filtered = ColumnFilterQuery.Apply(
            source,
            filters,
            make => make.VmakCode,
            make => make.VmakName,
            make => make.VmakShortName,
            make => make.VmakActiveYn);
        var sortKey = SortColumns[string.IsNullOrWhiteSpace(sortBy) ? DefaultSortColumn : sortBy.Trim()];

        var ordered = IsDescending(sortDirection)
            ? filtered.OrderByDescending(sortKey)
            : filtered.OrderBy(sortKey);

        // A second, unique sort key keeps the order stable, so a record never repeats or vanishes between pages.
        return ordered.ThenBy(make => make.VmakCode);
    }

    private static bool IsAscending(string? sortDirection) =>
        string.Equals(sortDirection?.Trim(), "asc", StringComparison.OrdinalIgnoreCase);

    private static bool IsDescending(string? sortDirection) =>
        string.Equals(sortDirection?.Trim(), "desc", StringComparison.OrdinalIgnoreCase);
}
