using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public interface IClaimConfigurationsRepository
{
    Task<int> CountAsync(
        IReadOnlyList<ClaimConfigurationFilter> filters,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<ClaimConfigurationListRow>> GetPageAsync(
        int skip,
        int pageSize,
        IReadOnlyList<ClaimConfigurationFilter> filters,
        ClaimConfigurationSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken);

    Task<bool> ExistsAsync(string ccmCode, CancellationToken cancellationToken);
    Task<BRM_CLM_CONFIG?> FindAsync(string ccmCode, CancellationToken cancellationToken);
    Task AddAsync(BRM_CLM_CONFIG record, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
    Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken);

    Task<BRM_CLM_CONFIG?> UpdateIfCurrentAsync(
        string ccmCode,
        string expectedVersion,
        Func<BRM_CLM_CONFIG, CancellationToken, Task> update,
        CancellationToken cancellationToken);

    Task<bool> DeleteIfChildFreeAsync(string ccmCode, CancellationToken cancellationToken);
    Task<IReadOnlyList<ClaimConfigurationLookupOption>> GetActiveLookupsAsync(
        string liType,
        CancellationToken cancellationToken);
    Task<bool> IsActiveLookupAsync(string liType, string code, CancellationToken cancellationToken);
    Task<string?> GetLookupDescriptionAsync(
        string liType,
        string? code,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<ApplicableProductSummary>> GetProductsAsync(
        string ccmCode,
        CancellationToken cancellationToken);
    Task<BRM_CCM_PROD?> FindProductAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken);
    Task<BRM_CCM_PROD> CreateProductAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken);
    Task<BRM_CCM_PROD?> UpdateProductIfCurrentAsync(
        string ccmCode,
        string productCode,
        string newProductCode,
        string expectedVersion,
        CancellationToken cancellationToken);
    Task<bool> DeleteProductAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken);
}