using System.Linq.Expressions;
using SDD.API.Data.Scaffolded;

namespace SDD.API.Services;

public sealed class PremiumAdjustmentListRow
{
    public BrmMiscCode Code { get; init; } = null!;

    public string CodeTypeDescription { get; init; } = string.Empty;
}

public static class PremiumAdjustmentListQuery
{
    public const int PageSize = 10;

    private const string DefaultSortColumn = "codeType";

    private static readonly IReadOnlyDictionary<string, Expression<Func<PremiumAdjustmentListRow, string?>>> TextColumns =
        new Dictionary<string, Expression<Func<PremiumAdjustmentListRow, string?>>>(StringComparer.OrdinalIgnoreCase)
        {
            ["codeType"] = row => row.CodeTypeDescription,
            ["code"] = row => row.Code.McCode,
            ["companyCode"] = row => row.Code.McCompCode,
            ["name"] = row => row.Code.McDesc,
            ["shortName"] = row => row.Code.McShortDesc
        };

    private static readonly IReadOnlyDictionary<string, Expression<Func<PremiumAdjustmentListRow, string?>>> SortColumns =
        new Dictionary<string, Expression<Func<PremiumAdjustmentListRow, string?>>>(StringComparer.OrdinalIgnoreCase)
        {
            ["codeType"] = row => row.CodeTypeDescription.ToUpper(),
            ["code"] = row => row.Code.McCode.ToUpper(),
            ["companyCode"] = row => row.Code.McCompCode.ToUpper(),
            ["name"] = row => (row.Code.McDesc ?? string.Empty).ToUpper(),
            ["shortName"] = row => (row.Code.McShortDesc ?? string.Empty).ToUpper()
        };

    private static readonly IReadOnlyDictionary<string, string> FilterableFields =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["codeType"] = "codeType",
            ["code"] = "code",
            ["companyCode"] = "companyCode",
            ["name"] = "name",
            ["shortName"] = "shortName"
        };

    public static IQueryable<PremiumAdjustmentListRow> JoinCodeTypes(
        IQueryable<BrmMiscCode> codes,
        IQueryable<StdListItem> listItems)
    {
        var codeTypes = listItems.Where(item => item.LiType == "CALC_TYPE");
        return from code in codes
               join item in codeTypes on code.McType equals item.LiCode into matchingItems
               from item in matchingItems.DefaultIfEmpty()
               select new PremiumAdjustmentListRow
               {
                   Code = code,
                   CodeTypeDescription = item == null ? code.McType : item.LiDesc ?? code.McType
               };
    }

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
            errors["sortBy"] = ["Sort by must be codeType, code, companyCode, name or shortName."];
        }

        if (!string.IsNullOrWhiteSpace(sortDirection)
            && !string.Equals(sortDirection.Trim(), "asc", StringComparison.OrdinalIgnoreCase)
            && !string.Equals(sortDirection.Trim(), "desc", StringComparison.OrdinalIgnoreCase))
        {
            errors["sortDirection"] = ["Sort direction must be asc or desc."];
        }

        return errors;
    }

    public static IQueryable<PremiumAdjustmentListRow> Apply(
        IQueryable<PremiumAdjustmentListRow> source,
        ColumnFilters filters,
        string? sortBy,
        string? sortDirection)
    {
        var filtered = ColumnFilterQuery.Apply(
            source,
            filters,
            TextColumns,
            row => row.Code.McActiveYn);
        var column = SortColumns[string.IsNullOrWhiteSpace(sortBy) ? DefaultSortColumn : sortBy.Trim()];
        var ordered = string.Equals(sortDirection?.Trim(), "desc", StringComparison.OrdinalIgnoreCase)
            ? filtered.OrderByDescending(column)
            : filtered.OrderBy(column);

        return ordered
            .ThenBy(row => row.Code.McType)
            .ThenBy(row => row.Code.McCode)
            .ThenBy(row => row.Code.McCompCode);
    }
}
