using System.Linq.Expressions;
using SDD.API.Data.Scaffolded;

namespace SDD.API.Services;

/// <summary>
/// Search and sorting for the vehicle-make list. Both are applied to the whole table before a page is cut out
/// (FR-001, FR-002), so a match on page 5 is found from page 1 and sorting covers every record.
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

    public static IReadOnlyDictionary<string, string[]> Validate(int page, string? sortBy, string? sortDirection)
    {
        var errors = new Dictionary<string, string[]>();

        if (page < 1 || page > MaximumPage)
        {
            errors["page"] = [$"Page must be a number from 1 to {MaximumPage}."];
        }

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
        string? search,
        string? sortBy,
        string? sortDirection)
    {
        var filtered = Filter(source, search);
        var sortKey = SortColumns[string.IsNullOrWhiteSpace(sortBy) ? DefaultSortColumn : sortBy.Trim()];

        var ordered = IsDescending(sortDirection)
            ? filtered.OrderByDescending(sortKey)
            : filtered.OrderBy(sortKey);

        // A second, unique sort key keeps the order stable, so a record never repeats or vanishes between pages.
        return ordered.ThenBy(make => make.VmakCode);
    }

    private static IQueryable<BrmVehMake> Filter(IQueryable<BrmVehMake> source, string? search)
    {
        var term = search?.Trim().ToUpperInvariant();
        if (string.IsNullOrEmpty(term))
        {
            return source;
        }

        // Upper-casing both sides makes the search ignore case, whatever the database's own collation does.
        return source.Where(make =>
            make.VmakCode.ToUpper().Contains(term)
            || (make.VmakName != null && make.VmakName.ToUpper().Contains(term))
            || (make.VmakShortName != null && make.VmakShortName.ToUpper().Contains(term)));
    }

    private static bool IsAscending(string? sortDirection) =>
        string.Equals(sortDirection?.Trim(), "asc", StringComparison.OrdinalIgnoreCase);

    private static bool IsDescending(string? sortDirection) =>
        string.Equals(sortDirection?.Trim(), "desc", StringComparison.OrdinalIgnoreCase);
}
