using System.Linq.Expressions;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

internal static class ApplicableModuleQuery
{
    public static IOrderedQueryable<STD_DOC_APPL_MODULE> ApplySort(
        IQueryable<STD_DOC_APPL_MODULE> query,
        ApplicableModuleSortColumn sortBy,
        CodeSortDirection direction)
    {
        var descending = direction == CodeSortDirection.Descending;
        var ordered = sortBy switch
        {
            ApplicableModuleSortColumn.DamodUid => descending
                ? query.OrderByDescending(module => module.DAMOD_UID)
                : query.OrderBy(module => module.DAMOD_UID),
            ApplicableModuleSortColumn.ApplicableFor => Order(query, module => module.DAMOD_APPL_FOR, descending),
            ApplicableModuleSortColumn.ProductFrom => Order(query, module => module.DAMOD_PROD_CODE_FM, descending),
            ApplicableModuleSortColumn.ProductTo => Order(query, module => module.DAMOD_PROD_CODE_TO, descending),
            ApplicableModuleSortColumn.PcmFrom => Order(query, module => module.DAMOD_PCM_CODE_FM, descending),
            ApplicableModuleSortColumn.PcmTo => Order(query, module => module.DAMOD_PCM_CODE_TO, descending),
            ApplicableModuleSortColumn.CcmFrom => Order(query, module => module.DAMOD_CCM_CODE_FM, descending),
            ApplicableModuleSortColumn.CcmTo => Order(query, module => module.DAMOD_CCM_CODE_TO, descending),
            ApplicableModuleSortColumn.MandatoryYn => Order(query, module => module.DAMOD_DOC_MAND_YN, descending),
            ApplicableModuleSortColumn.ActiveYn => Order(query, module => module.DAMOD_ACTIVE_YN, descending),
            _ => throw new ArgumentOutOfRangeException(nameof(sortBy), sortBy, "Unsupported sort column.")
        };

        return sortBy == ApplicableModuleSortColumn.DamodUid
            ? ordered
            : ordered.ThenBy(module => module.DAMOD_UID);
    }

    public static IQueryable<STD_DOC_APPL_MODULE> ApplyFilter(
        IQueryable<STD_DOC_APPL_MODULE> query,
        IReadOnlyList<ApplicableModuleFilter> filters)
    {
        foreach (var filter in filters)
        {
            var parameter = Expression.Parameter(typeof(STD_DOC_APPL_MODULE), "module");
            var property = Expression.Property(parameter, GetPropertyName(filter.Column));
            var notNull = Expression.NotEqual(property, Expression.Constant(null, typeof(string)));
            var uppercase = Expression.Call(property, nameof(string.ToUpper), Type.EmptyTypes);
            var value = Expression.Constant(filter.Value.ToUpperInvariant());
            Expression predicate = filter.Operator switch
            {
                CodeFilterOperator.StartsWith => Expression.Call(uppercase, nameof(string.StartsWith), Type.EmptyTypes, value),
                CodeFilterOperator.EndsWith => Expression.Call(uppercase, nameof(string.EndsWith), Type.EmptyTypes, value),
                CodeFilterOperator.Contains => Expression.Call(uppercase, nameof(string.Contains), Type.EmptyTypes, value),
                CodeFilterOperator.DoesNotContain => Expression.Not(
                    Expression.Call(uppercase, nameof(string.Contains), Type.EmptyTypes, value)),
                CodeFilterOperator.EqualTo => Expression.Equal(uppercase, value),
                CodeFilterOperator.NotEqualTo => Expression.NotEqual(uppercase, value),
                _ => throw new ArgumentOutOfRangeException(nameof(filter), filter.Operator, "Unsupported filter operator.")
            };

            query = query.Where(Expression.Lambda<Func<STD_DOC_APPL_MODULE, bool>>(
                Expression.AndAlso(notNull, predicate),
                parameter));
        }

        return query;
    }

    private static string GetPropertyName(ApplicableModuleFilterColumn column) =>
        column switch
        {
            ApplicableModuleFilterColumn.ApplicableFor => nameof(STD_DOC_APPL_MODULE.DAMOD_APPL_FOR),
            ApplicableModuleFilterColumn.ProductFrom => nameof(STD_DOC_APPL_MODULE.DAMOD_PROD_CODE_FM),
            ApplicableModuleFilterColumn.ProductTo => nameof(STD_DOC_APPL_MODULE.DAMOD_PROD_CODE_TO),
            ApplicableModuleFilterColumn.PcmFrom => nameof(STD_DOC_APPL_MODULE.DAMOD_PCM_CODE_FM),
            ApplicableModuleFilterColumn.PcmTo => nameof(STD_DOC_APPL_MODULE.DAMOD_PCM_CODE_TO),
            ApplicableModuleFilterColumn.CcmFrom => nameof(STD_DOC_APPL_MODULE.DAMOD_CCM_CODE_FM),
            ApplicableModuleFilterColumn.CcmTo => nameof(STD_DOC_APPL_MODULE.DAMOD_CCM_CODE_TO),
            ApplicableModuleFilterColumn.MandatoryYn => nameof(STD_DOC_APPL_MODULE.DAMOD_DOC_MAND_YN),
            ApplicableModuleFilterColumn.ActiveYn => nameof(STD_DOC_APPL_MODULE.DAMOD_ACTIVE_YN),
            _ => throw new ArgumentOutOfRangeException(nameof(column), column, "Unsupported filter column.")
        };

    private static IOrderedQueryable<STD_DOC_APPL_MODULE> Order(
        IQueryable<STD_DOC_APPL_MODULE> query,
        Expression<Func<STD_DOC_APPL_MODULE, string?>> selector,
        bool descending) =>
        descending ? query.OrderByDescending(selector) : query.OrderBy(selector);
}
