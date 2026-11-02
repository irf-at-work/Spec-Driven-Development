using Microsoft.EntityFrameworkCore;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public sealed class CodesRepository(CodesMasterContext context) : ICodesRepository
{
    public Task<int> CountAsync(
        IReadOnlyList<CodeColumnFilter> filters,
        CancellationToken cancellationToken) =>
        ApplyFilters(filters).CountAsync(cancellationToken);

    public async Task<IReadOnlyList<STD_CODES>> GetPageAsync(
        int skip,
        int pageSize,
        IReadOnlyList<CodeColumnFilter> filters,
        CodeSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken) =>
        await ApplySort(ApplyFilters(filters), sortBy, sortDirection)
            .ThenBy(record => record.CC_CODE)
            .ThenBy(record => record.CC_TYPE)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

    private IQueryable<STD_CODES> ApplyFilters(IReadOnlyList<CodeColumnFilter> filters)
    {
        var query = context.STD_CODES.AsNoTracking();
        foreach (var filter in filters)
        {
            query = ApplyFilter(query, filter);
        }

        return query;
    }

    private static IQueryable<STD_CODES> ApplyFilter(
        IQueryable<STD_CODES> query,
        CodeColumnFilter filter)
    {
        var propertyName = filter.Column switch
        {
            CodeFilterColumn.Code => nameof(STD_CODES.CC_CODE),
            CodeFilterColumn.CodeDescription => nameof(STD_CODES.CC_DESC),
            CodeFilterColumn.CodeType => nameof(STD_CODES.CC_TYPE),
            CodeFilterColumn.Value1 => nameof(STD_CODES.CC_VALUE1),
            CodeFilterColumn.Value2 => nameof(STD_CODES.CC_VALUE2),
            _ => throw new ArgumentOutOfRangeException(nameof(filter), filter.Column, "Unsupported filter column.")
        };
        var value = filter.Value.ToUpperInvariant();
        var escapedValue = EscapeLikeValue(value);

        return filter.Operator switch
        {
            CodeFilterOperator.StartsWith => query.Where(record =>
                EF.Functions.Like(
                    EF.Property<string>(record, propertyName).ToUpper(),
                    $"{escapedValue}%",
                    "!")),
            CodeFilterOperator.EndsWith => query.Where(record =>
                EF.Functions.Like(
                    EF.Property<string>(record, propertyName).ToUpper(),
                    $"%{escapedValue}",
                    "!")),
            CodeFilterOperator.Contains => query.Where(record =>
                EF.Functions.Like(
                    EF.Property<string>(record, propertyName).ToUpper(),
                    $"%{escapedValue}%",
                    "!")),
            CodeFilterOperator.DoesNotContain => query.Where(record =>
                !EF.Functions.Like(
                    EF.Property<string>(record, propertyName).ToUpper(),
                    $"%{escapedValue}%",
                    "!")),
            CodeFilterOperator.EqualTo => query.Where(record =>
                EF.Property<string>(record, propertyName).ToUpper() == value),
            CodeFilterOperator.NotEqualTo => query.Where(record =>
                EF.Property<string>(record, propertyName).ToUpper() != value),
            _ => throw new ArgumentOutOfRangeException(nameof(filter), filter.Operator, "Unsupported filter operator.")
        };
    }

    private static string EscapeLikeValue(string value) =>
        value.Replace("!", "!!", StringComparison.Ordinal)
            .Replace("%", "!%", StringComparison.Ordinal)
            .Replace("_", "!_", StringComparison.Ordinal);

    private static IOrderedQueryable<STD_CODES> ApplySort(
        IQueryable<STD_CODES> query,
        CodeSortColumn sortBy,
        CodeSortDirection sortDirection)
    {
        var propertyName = sortBy switch
        {
            CodeSortColumn.Code => nameof(STD_CODES.CC_CODE),
            CodeSortColumn.CodeDescription => nameof(STD_CODES.CC_DESC),
            CodeSortColumn.CodeType => nameof(STD_CODES.CC_TYPE),
            CodeSortColumn.Value1 => nameof(STD_CODES.CC_VALUE1),
            CodeSortColumn.Value2 => nameof(STD_CODES.CC_VALUE2),
            _ => throw new ArgumentOutOfRangeException(nameof(sortBy), sortBy, "Unsupported sort column.")
        };
        var orderedQuery = sortDirection switch
        {
            CodeSortDirection.Ascending => query.OrderBy(record =>
                EF.Property<string>(record, propertyName)),
            CodeSortDirection.Descending => query.OrderByDescending(record =>
                EF.Property<string>(record, propertyName)),
            _ => throw new ArgumentOutOfRangeException(
                nameof(sortDirection),
                sortDirection,
                "Unsupported sort direction.")
        };

        return orderedQuery;
    }

    public Task<STD_CODES?> FindAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken) =>
        context.STD_CODES.SingleOrDefaultAsync(
            record => record.CC_CODE == code && record.CC_TYPE == codeType,
            cancellationToken);

    public Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken) =>
        context.Database
            .SqlQuery<DateTime>($"SELECT SYSDATE AS \"Value\" FROM DUAL")
            .SingleAsync(cancellationToken);

    public async Task<bool> ExistsAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken)
    {
        var count = await context.STD_CODES.CountAsync(
            record => record.CC_CODE == code && record.CC_TYPE == codeType,
            cancellationToken);
        return count > 0;
    }

    public async Task AddAsync(STD_CODES record, CancellationToken cancellationToken) =>
        await context.STD_CODES.AddAsync(record, cancellationToken);

    public async Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _ = await context.SaveChangesAsync(cancellationToken);

    public void Remove(STD_CODES record) => context.STD_CODES.Remove(record);
}
