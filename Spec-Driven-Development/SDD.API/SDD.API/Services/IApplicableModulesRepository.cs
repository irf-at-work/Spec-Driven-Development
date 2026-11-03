using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public interface IApplicableModulesRepository
{
    Task<bool> ParentExistsAsync(string docCode, CancellationToken cancellationToken);

    Task<int> CountAsync(
        string docCode,
        IReadOnlyList<ApplicableModuleFilter> filters,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<STD_DOC_APPL_MODULE>> GetPageAsync(
        string docCode,
        int skip,
        int pageSize,
        IReadOnlyList<ApplicableModuleFilter> filters,
        ApplicableModuleSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken);

    Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken);

    Task<STD_DOC_APPL_MODULE?> FindAsync(
        string docCode,
        decimal damodUid,
        CancellationToken cancellationToken);

    Task<STD_DOC_APPL_MODULE?> CreateWithNextIdAsync(
        STD_DOC_APPL_MODULE module,
        CancellationToken cancellationToken);

    Task<STD_DOC_APPL_MODULE?> UpdateIfCurrentAsync(
        string docCode,
        decimal damodUid,
        string expectedVersion,
        Func<STD_DOC_APPL_MODULE, CancellationToken, Task> update,
        CancellationToken cancellationToken);

    Task<bool> DeleteIfCurrentAsync(
        string docCode,
        decimal damodUid,
        string expectedVersion,
        CancellationToken cancellationToken);
}
