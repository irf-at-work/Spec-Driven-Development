using System.Linq.Expressions;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public sealed record ClaimConfigurationListRow
{
    public required string CcmCompCode { get; init; }
    public required string CcmCode { get; init; }
    public required string CcmName { get; init; }
    public string? CcmShortName { get; init; }
    public string? ModuleName { get; init; }
    public string? CreatedBy { get; init; }
    public DateTime? CreatedDate { get; init; }
    public string? UpdatedBy { get; init; }
    public DateTime? UpdatedDate { get; init; }
}

internal static class ClaimConfigurationQuery
{
    public static IQueryable<ClaimConfigurationListRow> Create(
        IQueryable<BRM_CLM_CONFIG> records,
        IQueryable<STD_LIST_ITEM> lookups) =>
        records.Select(record => new ClaimConfigurationListRow
        {
            CcmCompCode = record.CCM_COMP_CODE,
            CcmCode = record.CCM_CODE,
            CcmName = record.CCM_NAME,
            CcmShortName = record.CCM_SHORT_NAME,
            CreatedBy = record.CCM_CR_BY,
            CreatedDate = record.CCM_CR_DT,
            UpdatedBy = record.CCM_UP_BY,
            UpdatedDate = record.CCM_UP_DT,
            ModuleName = lookups
                .Where(item => item.LI_TYPE == "CCM_MODULE" && item.LI_CODE == record.CCM_MODULE)
                .Select(item => item.LI_DESC)
                .FirstOrDefault()
        });

    public static IQueryable<ClaimConfigurationListRow> ApplyFilters(
        IQueryable<ClaimConfigurationListRow> query,
        IReadOnlyList<ClaimConfigurationFilter> filters)
    {
        foreach (var filter in filters)
        {
            var parameter = Expression.Parameter(typeof(ClaimConfigurationListRow), "record");
            var property = Expression.Property(parameter, GetPropertyName(filter.Column));
            var notNull = Expression.NotEqual(property, Expression.Constant(null, typeof(string)));
            var upper = Expression.Call(property, nameof(string.ToUpper), Type.EmptyTypes);
            var value = Expression.Constant(filter.Value.ToUpperInvariant());
            Expression predicate = filter.Operator switch
            {
                CodeFilterOperator.StartsWith => Expression.Call(upper, nameof(string.StartsWith), Type.EmptyTypes, value),
                CodeFilterOperator.EndsWith => Expression.Call(upper, nameof(string.EndsWith), Type.EmptyTypes, value),
                CodeFilterOperator.Contains => Expression.Call(upper, nameof(string.Contains), Type.EmptyTypes, value),
                CodeFilterOperator.DoesNotContain => Expression.Not(
                    Expression.Call(upper, nameof(string.Contains), Type.EmptyTypes, value)),
                CodeFilterOperator.EqualTo => Expression.Equal(upper, value),
                CodeFilterOperator.NotEqualTo => Expression.NotEqual(upper, value),
                _ => throw new ArgumentOutOfRangeException(nameof(filter), filter.Operator, "Unsupported filter operator.")
            };
            query = query.Where(Expression.Lambda<Func<ClaimConfigurationListRow, bool>>(
                Expression.AndAlso(notNull, predicate),
                parameter));
        }

        return query;
    }

    public static IOrderedQueryable<ClaimConfigurationListRow> ApplySort(
        IQueryable<ClaimConfigurationListRow> query,
        ClaimConfigurationSortColumn sortBy,
        CodeSortDirection direction)
    {
        var descending = direction == CodeSortDirection.Descending;
        var ordered = sortBy switch
        {
            ClaimConfigurationSortColumn.CompanyCode => Order(query, row => row.CcmCompCode, descending),
            ClaimConfigurationSortColumn.Code => Order(query, row => row.CcmCode, descending),
            ClaimConfigurationSortColumn.Name => Order(query, row => row.CcmName, descending),
            ClaimConfigurationSortColumn.ShortName => Order(query, row => row.CcmShortName, descending),
            ClaimConfigurationSortColumn.ModuleName => Order(query, row => row.ModuleName, descending),
            _ => throw new ArgumentOutOfRangeException(nameof(sortBy), sortBy, "Unsupported sort column.")
        };

        return sortBy == ClaimConfigurationSortColumn.CompanyCode
            ? ordered.ThenBy(row => row.CcmCode)
            : sortBy == ClaimConfigurationSortColumn.Code
            ? ordered
            : ordered.ThenBy(row => row.CcmCode);
    }

    private static IOrderedQueryable<ClaimConfigurationListRow> Order(
        IQueryable<ClaimConfigurationListRow> query,
        Expression<Func<ClaimConfigurationListRow, string?>> selector,
        bool descending) =>
        descending ? query.OrderByDescending(selector) : query.OrderBy(selector);

    private static string GetPropertyName(ClaimConfigurationFilterColumn column) =>
        column switch
        {
            ClaimConfigurationFilterColumn.CompanyCode => nameof(ClaimConfigurationListRow.CcmCompCode),
            ClaimConfigurationFilterColumn.CcmCode => nameof(ClaimConfigurationListRow.CcmCode),
            ClaimConfigurationFilterColumn.CcmName => nameof(ClaimConfigurationListRow.CcmName),
            ClaimConfigurationFilterColumn.ShortName => nameof(ClaimConfigurationListRow.CcmShortName),
            ClaimConfigurationFilterColumn.ModuleName => nameof(ClaimConfigurationListRow.ModuleName),
            _ => throw new ArgumentOutOfRangeException(nameof(column), column, "Unsupported filter column.")
        };
}