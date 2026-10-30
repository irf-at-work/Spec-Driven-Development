using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SDD.API.Configuration;
using SDD.API.Contracts;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;
using SDD.API.Infrastructure;

namespace SDD.API.Services;

/// <summary>What happened when a permanent delete was requested.</summary>
public enum VehicleMakeDeleteOutcome
{
    Deleted,
    NotFound,
    HasModels
}

public sealed class VehicleMakeService(
    SddDbContext database,
    IOptions<AuditOptions> auditOptions,
    TimeProvider clock,
    ILogger<VehicleMakeService> logger)
{
    public async Task<PaginatedResult<VehicleMakeListItemDto>> ListAsync(
        int page,
        string? search,
        string? sortBy,
        string? sortDirection,
        CancellationToken cancellationToken)
    {
        var matching = VehicleMakeListQuery.Apply(database.BrmVehMakes.AsNoTracking(), search, sortBy, sortDirection);

        var totalCount = await matching.CountAsync(cancellationToken);

        // Worked out in 64 bits so that a very large page number cannot overflow into a negative skip.
        var skip = (int)Math.Min((long)(page - 1) * VehicleMakeListQuery.PageSize, int.MaxValue);

        // Inactive makes stay in the list (FR-029), so there is no filter on the flag, only a read of it.
        var rows = await matching
            .Skip(skip)
            .Take(VehicleMakeListQuery.PageSize)
            .Select(make => new { make.VmakCode, make.VmakName, make.VmakShortName, make.VmakActiveYn })
            .ToListAsync(cancellationToken);

        var items = rows
            .Select(make => new VehicleMakeListItemDto(
                make.VmakCode,
                make.VmakName ?? string.Empty,
                make.VmakShortName ?? string.Empty,
                VehicleMakeMapping.IsActive(make.VmakActiveYn)))
            .ToList();

        return new PaginatedResult<VehicleMakeListItemDto>(items, page, VehicleMakeListQuery.PageSize, totalCount);
    }

    public async Task<VehicleMakeDto?> GetAsync(string makeCode, CancellationToken cancellationToken)
    {
        var normalisedCode = VehicleMakeInputRules.NormaliseMakeCode(makeCode);

        var make = await database.BrmVehMakes
            .AsNoTracking()
            .FirstOrDefaultAsync(existing => existing.VmakCode == normalisedCode, cancellationToken);

        return make is null ? null : VehicleMakeMapping.ToDto(make);
    }

    /// <summary>Saves a new make. Returns null when the code already exists, in which case nothing is saved.</summary>
    public async Task<VehicleMakeDto?> CreateAsync(VehicleMakeValues values, CancellationToken cancellationToken)
    {
        // Counted rather than asked with Any(): the Oracle 19c provider handled this form reliably in this project.
        var alreadyExists = await database.BrmVehMakes
            .CountAsync(existing => existing.VmakCode == values.MakeCode, cancellationToken) > 0;
        if (alreadyExists)
        {
            LogDuplicate(values.MakeCode);
            return null;
        }

        var now = GulfStandardTimeNow();
        var user = auditOptions.Value.UserName;
        var make = new BrmVehMake
        {
            VmakCode = values.MakeCode,
            VmakName = values.MakeName,
            VmakShortName = values.ShortName,
            VmakRemarks = values.Remarks,
            VmakNameL2 = values.ArabicMakeName,
            VmakShortNameL2 = values.ArabicShortName,
            VmakRemarksL2 = values.ArabicRemarks,
            // A new make is Active unless the user switched it off (FR-027).
            VmakActiveYn = VehicleMakeMapping.ToFlag(values.Active ?? true),
            VmakCrBy = user,
            VmakCrDt = now,
            VmakUpBy = user,
            VmakUpDt = now
        };

        database.BrmVehMakes.Add(make);

        try
        {
            await database.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (OracleErrors.Has(exception, OracleErrors.UniqueConstraintViolation))
        {
            // Two people saved the same new code at the same moment: the database primary key let only one through.
            database.Entry(make).State = EntityState.Detached;
            LogDuplicate(values.MakeCode);
            return null;
        }

        logger.LogInformation("Created vehicle make {MakeCode}", make.VmakCode);
        return VehicleMakeMapping.ToDto(make);
    }

    /// <summary>Saves changes to an existing make. Returns null when no make has that code.</summary>
    public async Task<VehicleMakeDto?> UpdateAsync(VehicleMakeValues values, CancellationToken cancellationToken)
    {
        var make = await database.BrmVehMakes
            .FirstOrDefaultAsync(existing => existing.VmakCode == values.MakeCode, cancellationToken);
        if (make is null)
        {
            logger.LogWarning("Update failed (NotFound): vehicle make {MakeCode} does not exist", values.MakeCode);
            return null;
        }

        make.VmakName = values.MakeName;
        make.VmakShortName = values.ShortName;
        make.VmakRemarks = values.Remarks;
        make.VmakNameL2 = values.ArabicMakeName;
        make.VmakShortNameL2 = values.ArabicShortName;
        make.VmakRemarksL2 = values.ArabicRemarks;

        // Turning Active off or on is how a make is retired or restored (FR-027). A request that does not mention it leaves it alone.
        if (values.Active is { } active)
        {
            make.VmakActiveYn = VehicleMakeMapping.ToFlag(active);
        }

        make.VmakUpBy = auditOptions.Value.UserName;
        make.VmakUpDt = GulfStandardTimeNow();

        await database.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Updated vehicle make {MakeCode}", make.VmakCode);
        return VehicleMakeMapping.ToDto(make);
    }

    /// <summary>
    /// Permanently removes a make that has no models (FR-026). A make that still has models is left untouched
    /// and <see cref="VehicleMakeDeleteOutcome.HasModels"/> is returned.
    /// </summary>
    public async Task<VehicleMakeDeleteOutcome> DeleteAsync(string makeCode, CancellationToken cancellationToken)
    {
        var normalisedCode = VehicleMakeInputRules.NormaliseMakeCode(makeCode);

        var hasModels = await database.BrmVehModels
            .CountAsync(model => model.VmodVmakCode == normalisedCode, cancellationToken) > 0;
        if (hasModels)
        {
            logger.LogWarning("Delete refused (HasModels): vehicle make {MakeCode} still has models", normalisedCode);
            return VehicleMakeDeleteOutcome.HasModels;
        }

        int removed;
        try
        {
            removed = await database.BrmVehMakes
                .Where(existing => existing.VmakCode == normalisedCode)
                .ExecuteDeleteAsync(cancellationToken);
        }
        catch (Exception exception) when (OracleErrors.Has(exception, OracleErrors.ChildRecordFound))
        {
            // A model was added between the check above and the delete: the database foreign key stopped it.
            logger.LogWarning("Delete refused (HasModels): vehicle make {MakeCode} gained a model during the delete", normalisedCode);
            return VehicleMakeDeleteOutcome.HasModels;
        }

        if (removed == 0)
        {
            logger.LogWarning("Delete failed (NotFound): vehicle make {MakeCode} does not exist", normalisedCode);
            return VehicleMakeDeleteOutcome.NotFound;
        }

        logger.LogInformation("Deleted vehicle make {MakeCode}", normalisedCode);
        return VehicleMakeDeleteOutcome.Deleted;
    }

    private DateTime GulfStandardTimeNow() => GulfStandardTime.Now(clock);

    private void LogDuplicate(string makeCode) =>
        logger.LogWarning("Create failed (DuplicateCode): vehicle make {MakeCode} already exists", makeCode);
}
