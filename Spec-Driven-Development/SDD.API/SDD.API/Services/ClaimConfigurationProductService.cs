using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SDD.API.Contracts;
using SDD.API.Configuration;
using SDD.API.Data.ClaimConfigurations;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;
using SDD.API.Infrastructure;

namespace SDD.API.Services;

public enum ProductAssociationOutcome { Added, Deleted, NotFound, Duplicate, ChoiceUnavailable }

public sealed record ProductAssociationResult(ProductAssociationOutcome Outcome);

public sealed class ClaimConfigurationProductService(
    SddDbContext database,
    IOptions<AuditOptions> auditOptions,
    TimeProvider clock,
    ILogger<ClaimConfigurationProductService> logger)
{
    public const string ProductListType = "CCM_PRODUCT";

    public async Task<PaginatedResult<AvailableProductDto>> GetAvailableAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var choices = database.StdListItems.AsNoTracking()
            .Where(item => item.LiType == ProductListType && item.LiActiveYn == "Y");
        var totalCount = await choices.CountAsync(cancellationToken);
        var skip = (int)Math.Min((long)(page - 1) * pageSize, int.MaxValue);
        var rows = await choices
            .OrderBy(item => item.LiDesc)
            .ThenBy(item => item.LiCode)
            .Skip(skip)
            .Take(pageSize)
            .Select(item => new AvailableProductDto(item.LiCode, item.LiType, item.LiDesc ?? item.LiCode))
            .ToListAsync(cancellationToken);
        return new PaginatedResult<AvailableProductDto>(rows, page, pageSize, totalCount);
    }

    public async Task<PaginatedResult<AssociatedProductDto>> GetAssociatedAsync(
        string ccmCode,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var code = ccmCode.Trim().ToUpperInvariant();
        var links = database.BrmCcmProds.AsNoTracking()
            .Where(link => link.CcmpCcmCode == code);
        var totalCount = await links.CountAsync(cancellationToken);
        var skip = (int)Math.Min((long)(page - 1) * pageSize, int.MaxValue);
        var productCodes = await links
            .OrderBy(link => link.CcmpCode)
            .Skip(skip)
            .Take(pageSize)
            .Select(link => link.CcmpCode)
            .ToListAsync(cancellationToken);

        var productRows = productCodes.Count == 0
            ? []
            : await database.StdListItems.AsNoTracking()
                .Where(item => item.LiType == ProductListType && productCodes.Contains(item.LiCode))
                .Select(item => new { item.LiCode, item.LiType, item.LiDesc })
                .ToListAsync(cancellationToken);
        var productsByCode = productRows
            .GroupBy(item => item.LiCode)
            .ToDictionary(group => group.Key, group => group.First());
        var rows = productCodes.Select(productCode => productsByCode.TryGetValue(productCode, out var product)
                ? new AssociatedProductDto(productCode, product.LiType, product.LiDesc ?? product.LiCode)
                : new AssociatedProductDto(productCode, ProductListType, "Product choice is no longer available"))
            .ToList();
        return new PaginatedResult<AssociatedProductDto>(rows, page, pageSize, totalCount);
    }

    public async Task<ProductAssociationResult> AddAsync(
        string companyCode,
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken)
    {
        var company = companyCode.Trim().ToUpperInvariant();
        var ccm = ccmCode.Trim().ToUpperInvariant();
        var product = productCode.Trim();
        var ccmCount = await database.BrmClmConfigs.AsNoTracking()
            .Where(row => row.CcmCompCode == company && row.CcmCode == ccm)
            .CountAsync(cancellationToken);
        if (ccmCount == 0) return new ProductAssociationResult(ProductAssociationOutcome.NotFound);

        var productCount = await database.StdListItems.AsNoTracking()
            .Where(item => item.LiType == ProductListType && item.LiCode == product && item.LiActiveYn == "Y")
            .CountAsync(cancellationToken);
        if (productCount == 0) return new ProductAssociationResult(ProductAssociationOutcome.ChoiceUnavailable);

        var existingCount = await database.BrmCcmProds.AsNoTracking()
            .Where(link => link.CcmpCcmCode == ccm && link.CcmpCode == product)
            .CountAsync(cancellationToken);
        if (existingCount > 0) return new ProductAssociationResult(ProductAssociationOutcome.Duplicate);

        var now = GulfStandardTime.Now(clock);
        var user = auditOptions.Value.UserName;
        var linkEntity = new BrmCcmProd
        {
            CcmpCcmCode = ccm,
            CcmpCode = product,
            CcmpCrBy = user,
            CcmpCrDt = now,
            CcmpUpBy = user,
            CcmpUpDt = now
        };
        database.BrmCcmProds.Add(linkEntity);
        try
        {
            await database.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (OracleErrors.Has(exception, OracleErrors.UniqueConstraintViolation))
        {
            database.Entry(linkEntity).State = EntityState.Detached;
            return new ProductAssociationResult(ProductAssociationOutcome.Duplicate);
        }

        logger.LogInformation("Linked product {ProductCode} to CCM {CcmCode}", product, ccm);
        return new ProductAssociationResult(ProductAssociationOutcome.Added);
    }

    public async Task<ProductAssociationResult> DeleteAsync(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken)
    {
        var ccm = ccmCode.Trim().ToUpperInvariant();
        var product = productCode.Trim();
        var link = await database.BrmCcmProds.FirstOrDefaultAsync(
            row => row.CcmpCcmCode == ccm && row.CcmpCode == product,
            cancellationToken);
        if (link is null) return new ProductAssociationResult(ProductAssociationOutcome.NotFound);

        database.BrmCcmProds.Remove(link);
        await database.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Removed product {ProductCode} from CCM {CcmCode}", product, ccm);
        return new ProductAssociationResult(ProductAssociationOutcome.Deleted);
    }

    public async Task<PaginatedResult<ClaimConfigurationListItemDto>> GetForProductAsync(
        string productCode,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var product = productCode.Trim();
        var matches = from link in database.BrmCcmProds.AsNoTracking()
                      join config in database.BrmClmConfigs.AsNoTracking()
                        on link.CcmpCcmCode equals config.CcmCode
                      where link.CcmpCode == product
                      orderby config.CcmCode
                      select config;
        var totalCount = await matches.CountAsync(cancellationToken);
        var skip = (int)Math.Min((long)(page - 1) * pageSize, int.MaxValue);
        var rows = await matches.Skip(skip).Take(pageSize)
            .Select(row => new ClaimConfigurationListItemDto(
                row.CcmCompCode,
                row.CcmCode,
                row.CcmName,
                row.CcmShortName ?? string.Empty,
                row.CcmModule,
                ClaimConfigurationMapping.IsActive(row.CcmActiveYn)))
            .ToListAsync(cancellationToken);
        return new PaginatedResult<ClaimConfigurationListItemDto>(rows, page, pageSize, totalCount);
    }
}
