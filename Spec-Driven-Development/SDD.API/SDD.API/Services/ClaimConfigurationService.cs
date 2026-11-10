using Microsoft.EntityFrameworkCore;
using SDD.API.Contracts;
using SDD.API.Data.ClaimConfigurations;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;

namespace SDD.API.Services;

public sealed class ClaimConfigurationService(SddDbContext database)
{
    public async Task<ClaimConfigurationDto?> GetAsync(
        string companyCode,
        string ccmCode,
        CancellationToken cancellationToken)
    {
        var company = companyCode.Trim().ToUpperInvariant();
        var code = ccmCode.Trim().ToUpperInvariant();
        var row = await database.BrmClmConfigs.AsNoTracking()
            .FirstOrDefaultAsync(item => item.CcmCompCode == company && item.CcmCode == code, cancellationToken);
        return row is null ? null : ClaimConfigurationMapping.ToDto(row);
    }

    public async Task<PaginatedResult<ClaimConfigurationListItemDto>> ListAsync(
        int page,
        ColumnFilters filters,
        string? sortBy,
        string? sortDirection,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var matching = ClaimConfigurationListQuery.Apply(
            database.BrmClmConfigs.AsNoTracking(),
            filters,
            sortBy,
            sortDirection);
        var totalCount = await matching.CountAsync(cancellationToken);
        var skip = (int)Math.Min((long)(page - 1) * pageSize, int.MaxValue);
        var rows = await matching
            .Skip(skip)
            .Take(pageSize)
            .Select(row => new
            {
                row.CcmCompCode,
                row.CcmCode,
                row.CcmName,
                row.CcmShortName,
                row.CcmActiveYn
            })
            .ToListAsync(cancellationToken);

        var items = rows.Select(row => new ClaimConfigurationListItemDto(
            row.CcmCompCode,
            row.CcmCode,
            row.CcmName,
            row.CcmShortName ?? string.Empty,
            ClaimConfigurationMapping.IsActive(row.CcmActiveYn))).ToList();

        return new PaginatedResult<ClaimConfigurationListItemDto>(items, page, pageSize, totalCount);
    }
}
