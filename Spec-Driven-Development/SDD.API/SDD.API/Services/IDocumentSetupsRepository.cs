using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public interface IDocumentSetupsRepository
{
    Task<int> CountAsync(IReadOnlyList<DocumentSetupFilter> filters, CancellationToken cancellationToken);

    Task<IReadOnlyList<STD_DOCUMENT>> GetPageAsync(
        int skip,
        int pageSize,
        IReadOnlyList<DocumentSetupFilter> filters,
        DocumentSetupSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken);

    Task<bool> ExistsAsync(string docCode, CancellationToken cancellationToken);

    Task<bool> SetupForCodeExistsAsync(string setupForCode, CancellationToken cancellationToken);

    Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken);

    Task AddAsync(STD_DOCUMENT document, CancellationToken cancellationToken);

    Task SaveChangesAsync(CancellationToken cancellationToken);

    Task<STD_DOCUMENT?> FindAsync(string docCode, CancellationToken cancellationToken);

    Task<STD_DOCUMENT?> UpdateIfCurrentAsync(
        string docCode,
        string expectedVersion,
        Func<STD_DOCUMENT, CancellationToken, Task> update,
        CancellationToken cancellationToken);

    Task<bool> DeleteIfCurrentAndChildFreeAsync(
        string docCode,
        string expectedVersion,
        CancellationToken cancellationToken);
}
