using SDD.API.Contracts;

namespace SDD.API.Services;

public interface ICodesService
{
    Task<PaginatedResult<CodeRecordResponse>> ListAsync(
        int page,
        int pageSize,
        IReadOnlyList<CodeColumnFilter> filters,
        CodeSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken);

    Task<CodeRecordResponse?> GetAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken);

    Task<CodeRecordResponse> CreateAsync(
        CodeWriteRequest request,
        CancellationToken cancellationToken);

    Task<CodeRecordResponse?> UpdateAsync(
        string code,
        string codeType,
        CodeWriteRequest request,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken);
}
