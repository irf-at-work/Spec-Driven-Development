using SDD.API.Contracts;

namespace SDD.API.Services;

public interface IClaimConfigurationsService
{
    Task<PaginatedResult<ClaimConfigurationSummary>> ListAsync(
        int page,
        int pageSize,
        IReadOnlyList<ClaimConfigurationFilter> filters,
        ClaimConfigurationSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken);
    Task<ClaimConfigurationRecord> CreateAsync(
        ClaimConfigurationWrite request,
        CancellationToken cancellationToken);
    Task<ClaimConfigurationRecord?> GetAsync(string ccmCode, CancellationToken cancellationToken);
    Task<ClaimConfigurationRecord?> UpdateAsync(
        string ccmCode,
        ClaimConfigurationUpdate request,
        CancellationToken cancellationToken);
    Task<bool> DeleteAsync(string ccmCode, CancellationToken cancellationToken);
    Task<IReadOnlyList<ClaimConfigurationLookupOption>> GetLookupsAsync(
        string liType,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<ApplicableProductSummary>> GetProductsAsync(
        string ccmCode,
        CancellationToken cancellationToken);
    Task<ApplicableProductRecord> CreateProductAsync(
        string ccmCode,
        ApplicableProductWrite request,
        CancellationToken cancellationToken);
    Task<ApplicableProductRecord?> GetProductAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken);
    Task<ApplicableProductRecord?> UpdateProductAsync(
        string ccmCode,
        string productCode,
        ApplicableProductUpdate request,
        CancellationToken cancellationToken);
    Task<bool> DeleteProductAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken);
}