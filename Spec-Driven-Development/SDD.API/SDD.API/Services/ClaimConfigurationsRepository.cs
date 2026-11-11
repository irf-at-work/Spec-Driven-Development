using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public sealed class ClaimConfigurationsRepository(CodesMasterContext context)
    : IClaimConfigurationsRepository
{
    private static readonly string[] ListingCompanyCodes = ["CCM001", "ASRTEST"];

    public Task<int> CountAsync(
        IReadOnlyList<ClaimConfigurationFilter> filters,
        CancellationToken cancellationToken) =>
        ClaimConfigurationQuery.ApplyFilters(
                ClaimConfigurationQuery.Create(
                    context.BRM_CLM_CONFIG.AsNoTracking()
                        .Where(record => ListingCompanyCodes.Contains(record.CCM_COMP_CODE)),
                    context.STD_LIST_ITEM.AsNoTracking()),
                filters)
            .CountAsync(cancellationToken);

    public async Task<IReadOnlyList<ClaimConfigurationListRow>> GetPageAsync(
        int skip,
        int pageSize,
        IReadOnlyList<ClaimConfigurationFilter> filters,
        ClaimConfigurationSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken) =>
        await ClaimConfigurationQuery.ApplySort(
                ClaimConfigurationQuery.ApplyFilters(
                    ClaimConfigurationQuery.Create(
                        context.BRM_CLM_CONFIG.AsNoTracking()
                            .Where(record => ListingCompanyCodes.Contains(record.CCM_COMP_CODE)),
                        context.STD_LIST_ITEM.AsNoTracking()),
                    filters),
                sortBy,
                sortDirection)
            .ThenBy(record => record.CcmCode)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

    public async Task<bool> ExistsAsync(string ccmCode, CancellationToken cancellationToken) =>
        await context.BRM_CLM_CONFIG.CountAsync(
            record => record.CCM_CODE == ccmCode,
            cancellationToken) > 0;

    public Task<BRM_CLM_CONFIG?> FindAsync(string ccmCode, CancellationToken cancellationToken) =>
        context.BRM_CLM_CONFIG.AsNoTracking()
            .SingleOrDefaultAsync(
                record => record.CCM_CODE == ccmCode,
                cancellationToken);

    public async Task AddAsync(BRM_CLM_CONFIG record, CancellationToken cancellationToken) =>
        await context.BRM_CLM_CONFIG.AddAsync(record, cancellationToken);

    public async Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _ = await context.SaveChangesAsync(cancellationToken);

    public Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken) =>
        OracleSystemDate.GetAsync(context, cancellationToken);

    public async Task<BRM_CLM_CONFIG?> UpdateIfCurrentAsync(
        string ccmCode,
        string expectedVersion,
        Func<BRM_CLM_CONFIG, CancellationToken, Task> update,
        CancellationToken cancellationToken)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        if (!await OracleRowLock.LockClaimConfigurationAsync(context, ccmCode, cancellationToken))
        {
            return null;
        }

        var record = await context.BRM_CLM_CONFIG.SingleOrDefaultAsync(
            item => item.CCM_CODE == ccmCode,
            cancellationToken);
        if (record is null)
        {
            return null;
        }

        EnsureVersion(ClaimConfigurationVersion.Create(record), expectedVersion);
        await update(record, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return record;
    }

    public async Task<bool> DeleteIfChildFreeAsync(
        string ccmCode,
        CancellationToken cancellationToken)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        if (!await OracleRowLock.LockClaimConfigurationAsync(context, ccmCode, cancellationToken))
        {
            return false;
        }

        var record = await context.BRM_CLM_CONFIG.SingleOrDefaultAsync(
            item => item.CCM_CODE == ccmCode,
            cancellationToken);
        if (record is null)
        {
            return false;
        }

        if (await context.BRM_CCM_PROD.CountAsync(
                product => product.CCMP_CCM_CODE == ccmCode,
                cancellationToken) > 0)
        {
            throw new CodesApiException(
                StatusCodes.Status409Conflict,
                "The claim configuration has Applicable Products.",
                "Delete its Applicable Products mappings before deleting the claim configuration.");
        }

        context.BRM_CLM_CONFIG.Remove(record);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return true;
    }

    public async Task<IReadOnlyList<ClaimConfigurationLookupOption>> GetActiveLookupsAsync(
        string liType,
        CancellationToken cancellationToken) =>
        await context.STD_LIST_ITEM.AsNoTracking()
            .Where(item => item.LI_TYPE == liType && item.LI_ACTIVE_YN == "Y")
            .OrderBy(item => item.LI_CODE)
            .Select(item => new ClaimConfigurationLookupOption(item.LI_CODE, item.LI_DESC))
            .ToListAsync(cancellationToken);

    public async Task<bool> IsActiveLookupAsync(
        string liType,
        string code,
        CancellationToken cancellationToken) =>
        await context.STD_LIST_ITEM.AsNoTracking().CountAsync(
            item => item.LI_TYPE == liType && item.LI_CODE == code && item.LI_ACTIVE_YN == "Y",
            cancellationToken) > 0;

    public Task<string?> GetLookupDescriptionAsync(
        string liType,
        string? code,
        CancellationToken cancellationToken)
    {
        if (code is null)
        {
            return Task.FromResult<string?>(null);
        }

        return context.STD_LIST_ITEM.AsNoTracking()
            .Where(item => item.LI_TYPE == liType && item.LI_CODE == code)
            .Select(item => item.LI_DESC)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<ApplicableProductSummary>> GetProductsAsync(
        string ccmCode,
        CancellationToken cancellationToken) =>
        await context.BRM_CCM_PROD.AsNoTracking()
            .Where(product => product.CCMP_CCM_CODE == ccmCode)
            .OrderBy(product => product.CCMP_CODE)
            .Select(product => new ApplicableProductSummary(
                product.CCMP_CODE,
                context.STD_LIST_ITEM.AsNoTracking()
                    .Where(item => item.LI_TYPE == "CCM_PRODUCT" && item.LI_CODE == product.CCMP_CODE)
                    .Select(item => item.LI_DESC)
                    .FirstOrDefault()))
            .ToListAsync(cancellationToken);

    public Task<BRM_CCM_PROD?> FindProductAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken) =>
        context.BRM_CCM_PROD.AsNoTracking()
            .SingleOrDefaultAsync(
                product => product.CCMP_CCM_CODE == ccmCode && product.CCMP_CODE == productCode,
                cancellationToken);

    public async Task<BRM_CCM_PROD> CreateProductAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        if (!await OracleRowLock.LockClaimConfigurationAsync(context, ccmCode, cancellationToken))
        {
            throw MissingParent();
        }

        await EnsureActiveProductAsync(productCode, cancellationToken);
        var product = new BRM_CCM_PROD
        {
            CCMP_CCM_CODE = ccmCode,
            CCMP_CODE = productCode,
            CCMP_CR_BY = "ADMIN",
            CCMP_CR_DT = await GetSystemDateAsync(cancellationToken),
            CCMP_UP_BY = null,
            CCMP_UP_DT = null
        };
        await context.BRM_CCM_PROD.AddAsync(product, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return product;
    }

    public async Task<BRM_CCM_PROD?> UpdateProductIfCurrentAsync(
        string ccmCode,
        string productCode,
        string newProductCode,
        string expectedVersion,
        CancellationToken cancellationToken)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        if (!await OracleRowLock.LockClaimConfigurationAsync(context, ccmCode, cancellationToken))
        {
            return null;
        }

        if (!await OracleRowLock.LockApplicableProductAsync(
                context,
                ccmCode,
                productCode,
                cancellationToken))
        {
            return null;
        }

        var product = await context.BRM_CCM_PROD.SingleOrDefaultAsync(
            item => item.CCMP_CCM_CODE == ccmCode && item.CCMP_CODE == productCode,
            cancellationToken);
        if (product is null)
        {
            return null;
        }

        EnsureVersion(ClaimConfigurationVersion.Create(product), expectedVersion);
        if (!string.Equals(productCode, newProductCode, StringComparison.Ordinal))
        {
            await EnsureActiveProductAsync(newProductCode, cancellationToken);
        }

        if (!string.Equals(productCode, newProductCode, StringComparison.Ordinal) &&
            await context.BRM_CCM_PROD.CountAsync(
                item => item.CCMP_CCM_CODE == ccmCode && item.CCMP_CODE == newProductCode,
                cancellationToken) > 0)
        {
            throw DuplicateProduct();
        }

        product.CCMP_CODE = newProductCode;
        product.CCMP_UP_BY = "ADMIN";
        product.CCMP_UP_DT = await GetSystemDateAsync(cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return product;
    }

    public async Task<bool> DeleteProductAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        if (!await OracleRowLock.LockClaimConfigurationAsync(context, ccmCode, cancellationToken))
        {
            return false;
        }

        if (!await OracleRowLock.LockApplicableProductAsync(
                context,
                ccmCode,
                productCode,
                cancellationToken))
        {
            return false;
        }

        var product = await context.BRM_CCM_PROD.SingleOrDefaultAsync(
            item => item.CCMP_CCM_CODE == ccmCode && item.CCMP_CODE == productCode,
            cancellationToken);
        if (product is null)
        {
            return false;
        }

        context.BRM_CCM_PROD.Remove(product);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return true;
    }

    private async Task EnsureActiveProductAsync(string productCode, CancellationToken cancellationToken)
    {
        if (await IsActiveLookupAsync("CCM_PRODUCT", productCode, cancellationToken))
        {
            return;
        }

        throw new CodesApiException(
            StatusCodes.Status400BadRequest,
            "The submitted product mapping is not valid.",
            "Choose an active Product Code from the product lookup.",
            new Dictionary<string, string[]>
            {
                ["productCode"] = ["Choose an active Product Code."]
            });
    }

    private static void EnsureVersion(string currentVersion, string expectedVersion)
    {
        if (!string.Equals(currentVersion, expectedVersion, StringComparison.Ordinal))
        {
            throw new CodesApiException(
                StatusCodes.Status409Conflict,
                "The claim configuration has changed.",
                "Reload the claim configuration before saving your changes.");
        }
    }

    private static CodesApiException MissingParent() =>
        new(
            StatusCodes.Status404NotFound,
            "The claim configuration could not be found.",
            "Refresh the listing and try again.");

    private static CodesApiException DuplicateProduct() =>
        new(
            StatusCodes.Status409Conflict,
            "This product is already mapped to the claim configuration.",
            "Choose a different Product Code.");
}