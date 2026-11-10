using System.Linq.Expressions;
using SDD.API.Data.ClaimConfigurations;

namespace SDD.API.Services;

public static class ClaimConfigurationListQuery
{
    public const int PageSize = 10;
    public static readonly int[] PageSizeOptions = [10, 25, 50];

    private const string DefaultSortColumn = "ccmCode";

    private static readonly IReadOnlyDictionary<string, Expression<Func<BrmClmConfig, string?>>> TextColumns =
        new Dictionary<string, Expression<Func<BrmClmConfig, string?>>>(StringComparer.OrdinalIgnoreCase)
        {
            ["ccmCode"] = row => row.CcmCode,
            ["name"] = row => row.CcmName,
            ["shortName"] = row => row.CcmShortName,
            ["module"] = row => row.CcmModule
        };

    private static readonly IReadOnlyDictionary<string, Expression<Func<BrmClmConfig, string?>>> SortColumns =
        new Dictionary<string, Expression<Func<BrmClmConfig, string?>>>(StringComparer.OrdinalIgnoreCase)
        {
            ["ccmCode"] = row => row.CcmCode.ToUpper(),
            ["name"] = row => (row.CcmName ?? string.Empty).ToUpper(),
            ["shortName"] = row => (row.CcmShortName ?? string.Empty).ToUpper(),
            ["module"] = row => (row.CcmModule ?? string.Empty).ToUpper()
        };

    private static readonly IReadOnlyDictionary<string, string> FilterableFields =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["ccmCode"] = "ccmCode",
            ["name"] = "name",
            ["shortName"] = "shortName",
            ["module"] = "module"
        };

    public static IReadOnlyDictionary<string, string[]> Validate(
        int page,
        ColumnFilters filters,
        string? sortBy,
        string? sortDirection,
        int pageSize = PageSize)
    {
        var errors = new Dictionary<string, string[]>();
        ColumnFilterQuery.ValidatePage(page, errors);
        ColumnFilterQuery.ValidatePageSize(pageSize, errors);
        ColumnFilterQuery.ValidateOperators(filters, FilterableFields, errors);

        if (!string.IsNullOrWhiteSpace(sortBy) && !SortColumns.ContainsKey(sortBy.Trim()))
        {
            errors["sortBy"] = ["Sort by must be ccmCode, name, shortName or module."];
        }

        if (!string.IsNullOrWhiteSpace(sortDirection)
            && !string.Equals(sortDirection.Trim(), "asc", StringComparison.OrdinalIgnoreCase)
            && !string.Equals(sortDirection.Trim(), "desc", StringComparison.OrdinalIgnoreCase))
        {
            errors["sortDirection"] = ["Sort direction must be asc or desc."];
        }

        return errors;
    }

    public static IQueryable<BrmClmConfig> Apply(
        IQueryable<BrmClmConfig> source,
        ColumnFilters filters,
        string? sortBy,
        string? sortDirection)
    {
        var filtered = ColumnFilterQuery.Apply(source, filters, TextColumns, row => row.CcmActiveYn);
        var sort = SortColumns[string.IsNullOrWhiteSpace(sortBy) ? DefaultSortColumn : sortBy.Trim()];
        var ordered = string.Equals(sortDirection?.Trim(), "desc", StringComparison.OrdinalIgnoreCase)
            ? filtered.OrderByDescending(sort)
            : filtered.OrderBy(sort);

        return ordered.ThenBy(row => row.CcmCompCode).ThenBy(row => row.CcmCode);
    }
}
