using System.Linq.Expressions;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

internal static class DocumentSetupQuery
{
    public static IQueryable<STD_DOCUMENT> ApplyFilters(
        IQueryable<STD_DOCUMENT> query,
        IReadOnlyList<DocumentSetupFilter> filters)
    {
        foreach (var filter in filters)
        {
            var parameter = Expression.Parameter(typeof(STD_DOCUMENT), "document");
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
            query = query.Where(Expression.Lambda<Func<STD_DOCUMENT, bool>>(
                Expression.AndAlso(notNull, predicate),
                parameter));
        }

        return query;
    }

    public static IOrderedQueryable<STD_DOCUMENT> ApplySort(
        IQueryable<STD_DOCUMENT> query,
        DocumentSetupSortColumn sortBy,
        CodeSortDirection direction)
    {
        var descending = direction == CodeSortDirection.Descending;
        var ordered = sortBy switch
        {
            DocumentSetupSortColumn.DocCode => Order(query, document => document.DOC_CODE, descending),
            DocumentSetupSortColumn.DocName => Order(query, document => document.DOC_NAME, descending),
            DocumentSetupSortColumn.DocDescription => Order(query, document => document.DOC_DESC, descending),
            DocumentSetupSortColumn.SetupFor => Order(query, document => document.DOC_SETUP_FOR, descending),
            DocumentSetupSortColumn.ActiveYn => Order(query, document => document.DOC_ACTIVE_YN, descending),
            _ => throw new ArgumentOutOfRangeException(nameof(sortBy), sortBy, "Unsupported sort column.")
        };

        return sortBy == DocumentSetupSortColumn.DocCode
            ? ordered
            : ordered.ThenBy(document => document.DOC_CODE);
    }

    private static IOrderedQueryable<STD_DOCUMENT> Order(
        IQueryable<STD_DOCUMENT> query,
        Expression<Func<STD_DOCUMENT, string?>> selector,
        bool descending) =>
        descending ? query.OrderByDescending(selector) : query.OrderBy(selector);

    private static string GetPropertyName(DocumentSetupFilterColumn column) =>
        column switch
        {
            DocumentSetupFilterColumn.DocCode => nameof(STD_DOCUMENT.DOC_CODE),
            DocumentSetupFilterColumn.DocName => nameof(STD_DOCUMENT.DOC_NAME),
            DocumentSetupFilterColumn.DocDescription => nameof(STD_DOCUMENT.DOC_DESC),
            DocumentSetupFilterColumn.SetupFor => nameof(STD_DOCUMENT.DOC_SETUP_FOR),
            _ => throw new ArgumentOutOfRangeException(nameof(column), column, "Unsupported filter column.")
        };
}
