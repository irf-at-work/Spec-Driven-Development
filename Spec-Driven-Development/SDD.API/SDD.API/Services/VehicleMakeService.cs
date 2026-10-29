using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Oracle.ManagedDataAccess.Client;
using SDD.API.Configuration;
using SDD.API.Contracts;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;

namespace SDD.API.Services;

public sealed class VehicleMakeService(
    SddDbContext database,
    IOptions<AuditOptions> auditOptions,
    TimeProvider clock,
    ILogger<VehicleMakeService> logger)
{
    // Oracle's error number for "unique constraint violated" (ORA-00001).
    private const int OracleUniqueConstraintViolation = 1;

    // The United Arab Emirates uses Gulf Standard Time all year round: UTC plus four hours, no daylight saving (constitution B3).
    private static readonly TimeSpan GulfStandardTimeOffset = TimeSpan.FromHours(4);

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

        var items = await matching
            .Skip(skip)
            .Take(VehicleMakeListQuery.PageSize)
            .Select(make => new VehicleMakeListItemDto(
                make.VmakCode,
                make.VmakName ?? string.Empty,
                make.VmakShortName ?? string.Empty))
            .ToListAsync(cancellationToken);

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
    //    Console.WriteLine(
    //database.BrmVehMakes
    //    .Where(existing => existing.VmakCode == values.MakeCode)
    //    .ToQueryString());
        var alreadyExists = await database.BrmVehMakes
    .CountAsync(
        existing => existing.VmakCode == values.MakeCode,
        cancellationToken) > 0;

        if (alreadyExists)
        {
            LogDuplicate(values.MakeCode);
            return null;
        }

        //var alreadyExists = await database.BrmVehMakes
        //    .AnyAsync(existing => existing.VmakCode == values.MakeCode, cancellationToken);
        //if (alreadyExists)
        //{
        //    LogDuplicate(values.MakeCode);
        //    return null;
        //}

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
        catch (DbUpdateException exception) when (IsDuplicateKey(exception))
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
        make.VmakUpBy = auditOptions.Value.UserName;
        make.VmakUpDt = GulfStandardTimeNow();

        await database.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Updated vehicle make {MakeCode}", make.VmakCode);
        return VehicleMakeMapping.ToDto(make);
    }

    /// <summary>Permanently removes a make. Returns false when no make has that code.</summary>
    public async Task<bool> DeleteAsync(string makeCode, CancellationToken cancellationToken)
    {
        var normalisedCode = VehicleMakeInputRules.NormaliseMakeCode(makeCode);

        var removed = await database.BrmVehMakes
            .Where(existing => existing.VmakCode == normalisedCode)
            .ExecuteDeleteAsync(cancellationToken);

        if (removed == 0)
        {
            logger.LogWarning("Delete failed (NotFound): vehicle make {MakeCode} does not exist", normalisedCode);
            return false;
        }

        logger.LogInformation("Deleted vehicle make {MakeCode}", normalisedCode);
        return true;
    }

    private DateTime GulfStandardTimeNow() =>
        clock.GetUtcNow().UtcDateTime.Add(GulfStandardTimeOffset);

    private void LogDuplicate(string makeCode) =>
        logger.LogWarning("Create failed (DuplicateCode): vehicle make {MakeCode} already exists", makeCode);

    private static bool IsDuplicateKey(Exception exception)
    {
        for (var current = exception; current is not null; current = current.InnerException)
        {
            if (current is OracleException { Number: OracleUniqueConstraintViolation })
            {
                return true;
            }
        }

        return false;
    }
}
