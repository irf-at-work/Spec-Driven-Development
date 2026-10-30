using SDD.API.Data;

namespace SDD.API.Services;

public interface ICodesRepository
{
    Task<int> CountAsync(CancellationToken cancellationToken);

    Task<IReadOnlyList<STD_CODES>> GetPageAsync(
        int skip,
        int pageSize,
        CancellationToken cancellationToken);

    Task<STD_CODES?> FindAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken);

    Task<bool> ExistsAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken);

    Task AddAsync(STD_CODES record, CancellationToken cancellationToken);

    Task SaveChangesAsync(CancellationToken cancellationToken);

    void Remove(STD_CODES record);
}
