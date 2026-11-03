using SDD.API.Contracts;

namespace SDD.API.Services;

public interface IDocumentSetupsService
{
    Task<PaginatedResult<DocumentSetupSummary>> ListAsync(
        int page,
        int pageSize,
        IReadOnlyList<DocumentSetupFilter> filters,
        DocumentSetupSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken);

    Task<DocumentSetupRecord> CreateAsync(
        DocumentSetupWriteRequest request,
        CancellationToken cancellationToken);

    Task<DocumentSetupRecord?> GetAsync(string docCode, CancellationToken cancellationToken);

    Task<DocumentSetupRecord?> UpdateAsync(
        string docCode,
        DocumentSetupUpdateRequest request,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(
        string docCode,
        string expectedVersion,
        CancellationToken cancellationToken);
}
