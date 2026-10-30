using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SDD.API.Configuration;
using SDD.API.Contracts;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;
using SDD.API.Infrastructure;

namespace SDD.API.Services;

/// <summary>What happened when a model was saved or deleted. The controller turns each outcome into a plain response.</summary>
public enum VehicleModelOutcome
{
    Saved,
    Found,
    Deleted,
    MakeNotFound,
    ModelNotFound,
    DuplicateCode,
    InvalidOptions
}

public sealed record VehicleModelResult(
    VehicleModelOutcome Outcome,
    VehicleModelDto? Model = null,
    IReadOnlyDictionary<string, string[]>? Errors = null);

public sealed class VehicleModelService(
    SddDbContext database,
    IOptions<AuditOptions> auditOptions,
    TimeProvider clock,
    ILogger<VehicleModelService> logger)
{
    private sealed record ListItem(string Type, string Code, string Description);

    /// <summary>The models of one make that match the filters, 10 per page, by Model Code. Returns null when the make does not exist.</summary>
    public async Task<PaginatedResult<VehicleModelDto>?> ListAsync(
        string makeCode,
        int page,
        ColumnFilters filters,
        CancellationToken cancellationToken)
    {
        var normalisedMakeCode = VehicleMakeInputRules.NormaliseMakeCode(makeCode);
        if (!await MakeExistsAsync(normalisedMakeCode, cancellationToken))
        {
            return null;
        }

        // Filters apply to every model of the make before a page is cut out, then the models come back in code order.
        var matching = VehicleModelListQuery.Apply(
            database.BrmVehModels
                .AsNoTracking()
                .Where(model => model.VmodVmakCode == normalisedMakeCode),
            filters);

        var totalCount = await matching.CountAsync(cancellationToken);

        // Worked out in 64 bits so that a very large page number cannot overflow into a negative skip.
        var skip = (int)Math.Min((long)(page - 1) * VehicleMakeListQuery.PageSize, int.MaxValue);

        // Inactive models stay in the list (FR-029), so there is no filter on the flag unless the user chooses one.
        var rows = await matching
            .Skip(skip)
            .Take(VehicleMakeListQuery.PageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResult<VehicleModelDto>(
            rows.Select(VehicleModelMapping.ToDto).ToList(),
            page,
            VehicleMakeListQuery.PageSize,
            totalCount);
    }

    /// <summary>One model by its make and model code, for the model's own page.</summary>
    public async Task<VehicleModelResult> GetAsync(
        string makeCode,
        string modelCode,
        CancellationToken cancellationToken)
    {
        var normalisedMakeCode = VehicleMakeInputRules.NormaliseMakeCode(makeCode);
        var normalisedModelCode = VehicleMakeInputRules.NormaliseMakeCode(modelCode);

        if (!await MakeExistsAsync(normalisedMakeCode, cancellationToken))
        {
            return new VehicleModelResult(VehicleModelOutcome.MakeNotFound);
        }

        var model = await database.BrmVehModels
            .AsNoTracking()
            .FirstOrDefaultAsync(
                existing => existing.VmodVmakCode == normalisedMakeCode && existing.VmodCode == normalisedModelCode,
                cancellationToken);

        return model is null
            ? new VehicleModelResult(VehicleModelOutcome.ModelNotFound)
            : new VehicleModelResult(VehicleModelOutcome.Found, VehicleModelMapping.ToDto(model));
    }

    public async Task<VehicleModelResult> CreateAsync(VehicleModelValues values, CancellationToken cancellationToken)
    {
        if (!await MakeExistsAsync(values.MakeCode, cancellationToken))
        {
            logger.LogWarning("Create model failed (MakeNotFound): vehicle make {MakeCode} does not exist", values.MakeCode);
            return new VehicleModelResult(VehicleModelOutcome.MakeNotFound);
        }

        // Counted rather than asked with Any(): the Oracle 19c provider handled this form reliably in this project.
        var alreadyExists = await database.BrmVehModels
            .CountAsync(
                model => model.VmodVmakCode == values.MakeCode && model.VmodCode == values.ModelCode,
                cancellationToken) > 0;
        if (alreadyExists)
        {
            LogDuplicate(values);
            return new VehicleModelResult(VehicleModelOutcome.DuplicateCode);
        }

        var invalidOptions = await FindInvalidOptionsAsync(values, current: null, cancellationToken);
        if (invalidOptions.Count > 0)
        {
            return new VehicleModelResult(VehicleModelOutcome.InvalidOptions, Errors: invalidOptions);
        }

        var now = GulfStandardTime.Now(clock);
        var user = auditOptions.Value.UserName;
        var model = new BrmVehModel
        {
            VmodVmakCode = values.MakeCode,
            VmodCode = values.ModelCode,
            // A new model is Active unless the user switched it off (FR-028).
            VmodActiveYn = VehicleMakeMapping.ToFlag(values.Active ?? true),
            VmodCrBy = user,
            VmodCrDt = now,
            VmodUpBy = user,
            VmodUpDt = now
        };
        ApplyDetails(model, values);

        database.BrmVehModels.Add(model);

        try
        {
            await database.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (OracleErrors.Has(exception, OracleErrors.UniqueConstraintViolation))
        {
            // Two people saved the same new code at the same moment: the database primary key let only one through.
            database.Entry(model).State = EntityState.Detached;
            LogDuplicate(values);
            return new VehicleModelResult(VehicleModelOutcome.DuplicateCode);
        }

        logger.LogInformation("Created vehicle model {MakeCode}/{ModelCode}", values.MakeCode, values.ModelCode);
        return new VehicleModelResult(VehicleModelOutcome.Saved, VehicleModelMapping.ToDto(model));
    }

    public async Task<VehicleModelResult> UpdateAsync(VehicleModelValues values, CancellationToken cancellationToken)
    {
        var model = await database.BrmVehModels
            .FirstOrDefaultAsync(
                existing => existing.VmodVmakCode == values.MakeCode && existing.VmodCode == values.ModelCode,
                cancellationToken);
        if (model is null)
        {
            logger.LogWarning(
                "Update model failed (NotFound): vehicle model {MakeCode}/{ModelCode} does not exist",
                values.MakeCode,
                values.ModelCode);
            return new VehicleModelResult(VehicleModelOutcome.ModelNotFound);
        }

        var invalidOptions = await FindInvalidOptionsAsync(values, model, cancellationToken);
        if (invalidOptions.Count > 0)
        {
            return new VehicleModelResult(VehicleModelOutcome.InvalidOptions, Errors: invalidOptions);
        }

        ApplyDetails(model, values);

        // Turning Active off or on retires or restores the model (FR-028). A request that does not mention it leaves it alone.
        if (values.Active is { } active)
        {
            model.VmodActiveYn = VehicleMakeMapping.ToFlag(active);
        }

        model.VmodUpBy = auditOptions.Value.UserName;
        model.VmodUpDt = GulfStandardTime.Now(clock);

        await database.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Updated vehicle model {MakeCode}/{ModelCode}", values.MakeCode, values.ModelCode);
        return new VehicleModelResult(VehicleModelOutcome.Saved, VehicleModelMapping.ToDto(model));
    }

    public async Task<VehicleModelOutcome> DeleteAsync(
        string makeCode,
        string modelCode,
        CancellationToken cancellationToken)
    {
        var normalisedMakeCode = VehicleMakeInputRules.NormaliseMakeCode(makeCode);
        var normalisedModelCode = VehicleMakeInputRules.NormaliseMakeCode(modelCode);

        var removed = await database.BrmVehModels
            .Where(model => model.VmodVmakCode == normalisedMakeCode && model.VmodCode == normalisedModelCode)
            .ExecuteDeleteAsync(cancellationToken);

        if (removed == 0)
        {
            logger.LogWarning(
                "Delete model failed (NotFound): vehicle model {MakeCode}/{ModelCode} does not exist",
                normalisedMakeCode,
                normalisedModelCode);
            return VehicleModelOutcome.ModelNotFound;
        }

        logger.LogInformation("Deleted vehicle model {MakeCode}/{ModelCode}", normalisedMakeCode, normalisedModelCode);
        return VehicleModelOutcome.Deleted;
    }

    /// <summary>The choices of all nine dropdowns: the active standard-list items of each fixed list type.</summary>
    public async Task<VehicleModelOptionsDto> GetOptionsAsync(CancellationToken cancellationToken)
    {
        var items = await LoadActiveItemsAsync(cancellationToken);

        IReadOnlyList<LookupOptionDto> For(string listType) =>
            items
                .Where(item => item.Type == listType)
                .Select(item => new LookupOptionDto(item.Code, item.Description))
                .ToList();

        return new VehicleModelOptionsDto(
            For(VehicleModelListTypes.Variant),
            For(VehicleModelListTypes.VehicleType),
            For(VehicleModelListTypes.BodyType),
            For(VehicleModelListTypes.FuelType),
            For(VehicleModelListTypes.Cylinders),
            For(VehicleModelListTypes.Doors),
            For(VehicleModelListTypes.DrivingType),
            For(VehicleModelListTypes.BodyColour),
            For(VehicleModelListTypes.Category));
    }

    private async Task<bool> MakeExistsAsync(string makeCode, CancellationToken cancellationToken) =>
        await database.BrmVehMakes.CountAsync(make => make.VmakCode == makeCode, cancellationToken) > 0;

    private async Task<List<ListItem>> LoadActiveItemsAsync(CancellationToken cancellationToken)
    {
        // Read only: this feature never writes to the standard list table.
        var rows = await database.StdListItems
            .AsNoTracking()
            .Where(item => VehicleModelListTypes.All.Contains(item.LiType) && item.LiActiveYn == VehicleMakeMapping.ActiveFlag)
            .OrderBy(item => item.LiDesc)
            .ThenBy(item => item.LiCode)
            .Select(item => new { item.LiType, item.LiCode, item.LiDesc })
            .ToListAsync(cancellationToken);

        return rows.Select(row => new ListItem(row.LiType, row.LiCode, row.LiDesc ?? row.LiCode)).ToList();
    }

    // FR-021: a dropdown code must be an active item of its own list type, even if the screen sent something else.
    // Only a newly chosen value is checked. Keeping the value already stored is always allowed, even if the item
    // has been made inactive since.
    private async Task<IReadOnlyDictionary<string, string[]>> FindInvalidOptionsAsync(
        VehicleModelValues values,
        BrmVehModel? current,
        CancellationToken cancellationToken)
    {
        var choices = new (string Field, string Label, string ListType, string? Chosen, string? Stored)[]
        {
            ("variant", "a variant", VehicleModelListTypes.Variant, values.Variant, current?.VmodVariant),
            ("vehicleType", "a type", VehicleModelListTypes.VehicleType, values.VehicleType, current?.VmodType),
            ("bodyType", "a body type", VehicleModelListTypes.BodyType, values.BodyType, current?.VmodBodyType),
            ("fuelType", "a fuel type", VehicleModelListTypes.FuelType, values.FuelType, current?.VmodFuelType),
            ("cylinders", "the number of cylinders", VehicleModelListTypes.Cylinders, values.Cylinders, current?.VmodCylinder),
            ("doors", "the number of doors", VehicleModelListTypes.Doors, values.Doors, current?.VmodDoors),
            ("drivingType", "a driving type", VehicleModelListTypes.DrivingType, values.DrivingType, current?.VmodDrivingType),
            ("bodyColour", "a body colour", VehicleModelListTypes.BodyColour, values.BodyColour, current?.VmodBodyColor),
            ("category", "a category", VehicleModelListTypes.Category, values.Category, current?.VmodCatgCode)
        };

        var toCheck = choices.Where(choice => choice.Chosen is not null && choice.Chosen != choice.Stored).ToList();
        var errors = new Dictionary<string, string[]>();
        if (toCheck.Count == 0)
        {
            return errors;
        }

        var active = await LoadActiveItemsAsync(cancellationToken);
        foreach (var choice in toCheck)
        {
            if (!active.Any(item => item.Type == choice.ListType && item.Code == choice.Chosen))
            {
                errors[choice.Field] = [$"Please choose {choice.Label} from the list."];
            }
        }

        return errors;
    }

    private void ApplyDetails(BrmVehModel model, VehicleModelValues values)
    {
        model.VmodName = values.ModelName;
        model.VmodShortName = values.ShortName;
        model.VmodRemarks = values.Remarks;
        model.VmodNameL2 = values.ArabicModelName;
        model.VmodShortNameL2 = values.ArabicShortName;
        model.VmodRemarksL2 = values.ArabicRemarks;
        model.VmodVariant = values.Variant;
        model.VmodType = values.VehicleType;
        model.VmodWeight = values.Weight;
        model.VmodLoadCapacity = values.LoadCapacity;
        model.VmodBodyType = values.BodyType;
        model.VmodFuelType = values.FuelType;
        model.VmodCylinder = values.Cylinders;
        model.VmodDoors = values.Doors;
        model.VmodDrivingType = values.DrivingType;
        model.VmodBodyColor = values.BodyColour;
        model.VmodCatgCode = values.Category;

        SetNumber(model, nameof(BrmVehModel.VmodCc), values.EngineCapacity);
        SetNumber(model, nameof(BrmVehModel.VmodNoSeats), values.Seats);
        SetNumber(model, nameof(BrmVehModel.VmodNoPass), values.Passengers);
        SetNumber(model, nameof(BrmVehModel.VmodNoDrvr), values.Drivers);
        SetNumber(model, nameof(BrmVehModel.VmodMakeYear), values.MakeYear);
        SetNumber(model, nameof(BrmVehModel.VmodValueLc), values.Value);
    }

    // Oracle's NUMBER columns become decimal, short and so on in the scaffolded entity, depending on their size. The
    // value is converted to whatever type the column has, so this file does not depend on that detail.
    private void SetNumber(BrmVehModel model, string propertyName, decimal? value)
    {
        var property = database.Entry(model).Property(propertyName);
        var columnType = property.Metadata.ClrType;
        var targetType = Nullable.GetUnderlyingType(columnType) ?? columnType;

        property.CurrentValue = value is null
            ? null
            : Convert.ChangeType(value.Value, targetType, CultureInfo.InvariantCulture);
    }

    private void LogDuplicate(VehicleModelValues values) =>
        logger.LogWarning(
            "Create model failed (DuplicateCode): vehicle model {MakeCode}/{ModelCode} already exists",
            values.MakeCode,
            values.ModelCode);
}
