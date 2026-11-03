using SDD.API.Contracts;

namespace SDD.API.Services;

public interface IApplicableModulesService
{
    Task<PaginatedResult<ApplicableModuleSummary>> ListAsync(
        string docCode,
        int page,
        int pageSize,
        IReadOnlyList<ApplicableModuleFilter> filters,
        ApplicableModuleSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken);

    Task<ApplicableModuleRecord?> GetAsync(
        string docCode,
        decimal damodUid,
        CancellationToken cancellationToken);

    Task<ApplicableModuleRecord> CreateAsync(
        string docCode,
        ApplicableModuleWriteRequest request,
        CancellationToken cancellationToken);

    Task<ApplicableModuleRecord?> UpdateAsync(
        string docCode,
        decimal damodUid,
        ApplicableModuleUpdateRequest request,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(
        string docCode,
        decimal damodUid,
        string expectedVersion,
        CancellationToken cancellationToken);
}
