using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public interface ICodesRepository
{
    Task<int> CountAsync(
        IReadOnlyList<CodeColumnFilter> filters,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<STD_CODES>> GetPageAsync(
        int skip,
        int pageSize,
        IReadOnlyList<CodeColumnFilter> filters,
        CodeSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken);

    Task<STD_CODES?> FindAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken);

    Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken);

    Task<bool> ExistsAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken);

    Task AddAsync(STD_CODES record, CancellationToken cancellationToken);

    Task SaveChangesAsync(CancellationToken cancellationToken);

    void Remove(STD_CODES record);
}
