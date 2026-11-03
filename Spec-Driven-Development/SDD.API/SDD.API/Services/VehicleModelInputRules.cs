using SDD.API.DTOs;

namespace SDD.API.Services;

/// <summary>The cleaned-up values of a vehicle model, ready to be validated and saved.</summary>
public sealed record VehicleModelValues(
    string MakeCode,
    string ModelCode,
    string ModelName,
    string ShortName,
    string? Remarks,
    string? ArabicModelName,
    string? ArabicShortName,
    string? ArabicRemarks,
    string? Variant,
    string? VehicleType,
    string? Weight,
    string? LoadCapacity,
    string? BodyType,
    string? FuelType,
    int? EngineCapacity,
    string? Cylinders,
    int? Seats,
    int? Passengers,
    int? Drivers,
    string? Doors,
    int? MakeYear,
    string? DrivingType,
    string? BodyColour,
    decimal? Value,
    string? Category,
    bool? Active);

/// <summary>
/// The single home of the Vehicle Model rules (FR-019 to FR-021). Text is cleaned and checked with the same helpers as
/// makes, so the two pages cannot drift apart. Whether a dropdown code really exists is checked in the service,
/// because that needs the database.
/// </summary>
public static class VehicleModelInputRules
{
    public const int ModelCodeMaxLength = 12;
    public const int ModelNameMaxLength = 100;
    public const int ShortNameMaxLength = 30;
    public const int RemarksMaxLength = 2000;
    public const int ArabicModelNameMaxLength = 100;
    public const int ArabicShortNameMaxLength = 30;
    public const int ArabicRemarksMaxLength = 2000;
    public const int ListCodeMaxLength = 12;
    public const int FreeTextMaxLength = 100;
    public const int ThreeDigitMaximum = 999;
    public const int MakeYearMaximum = 9999;

    public static VehicleModelValues Normalise(string makeCode, CreateVehicleModelRequest request) =>
        new(
            VehicleMakeInputRules.NormaliseMakeCode(makeCode),
            VehicleMakeInputRules.NormaliseMakeCode(request.ModelCode),
            VehicleMakeInputRules.NormaliseEnglishName(request.ModelName),
            VehicleMakeInputRules.NormaliseEnglishName(request.ShortName),
            VehicleMakeInputRules.NormaliseOptionalEnglishText(request.Remarks),
            VehicleMakeInputRules.KeepArabicExactly(request.ArabicModelName),
            VehicleMakeInputRules.KeepArabicExactly(request.ArabicShortName),
            VehicleMakeInputRules.KeepArabicExactly(request.ArabicRemarks),
            ListCode(request.Variant),
            ListCode(request.VehicleType),
            VehicleMakeInputRules.NormaliseOptionalEnglishText(request.Weight),
            VehicleMakeInputRules.NormaliseOptionalEnglishText(request.LoadCapacity),
            ListCode(request.BodyType),
            ListCode(request.FuelType),
            request.EngineCapacity,
            ListCode(request.Cylinders),
            request.Seats,
            request.Passengers,
            request.Drivers,
            ListCode(request.Doors),
            request.MakeYear,
            ListCode(request.DrivingType),
            ListCode(request.BodyColour),
            request.Value,
            ListCode(request.Category),
            request.Active);

    // Both codes come from the web address, because they can never be changed.
    public static VehicleModelValues Normalise(string makeCode, string modelCode, UpdateVehicleModelRequest request) =>
        Normalise(
            makeCode,
            new CreateVehicleModelRequest(
                modelCode,
                request.ModelName,
                request.ShortName,
                request.Remarks,
                request.ArabicModelName,
                request.ArabicShortName,
                request.ArabicRemarks,
                request.Variant,
                request.VehicleType,
                request.Weight,
                request.LoadCapacity,
                request.BodyType,
                request.FuelType,
                request.EngineCapacity,
                request.Cylinders,
                request.Seats,
                request.Passengers,
                request.Drivers,
                request.Doors,
                request.MakeYear,
                request.DrivingType,
                request.BodyColour,
                request.Value,
                request.Category,
                request.Active));

    /// <summary>
    /// Returns field errors keyed by the JSON field name (camelCase); an empty result means the values are valid.
    /// The code is only checked when creating, because on update it is not editable.
    /// </summary>
    public static IReadOnlyDictionary<string, string[]> Validate(VehicleModelValues values, bool checkModelCode)
    {
        var errors = new Dictionary<string, string[]>();

        if (checkModelCode)
        {
            AddIfInvalidModelCode(errors, values.ModelCode);
        }

        VehicleMakeInputRules.AddIfInvalidRequiredText(errors, "modelName", "Model name", values.ModelName, ModelNameMaxLength);
        VehicleMakeInputRules.AddIfInvalidRequiredText(errors, "shortName", "Short name", values.ShortName, ShortNameMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "remarks", values.Remarks, RemarksMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "arabicModelName", values.ArabicModelName, ArabicModelNameMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "arabicShortName", values.ArabicShortName, ArabicShortNameMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "arabicRemarks", values.ArabicRemarks, ArabicRemarksMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "weight", values.Weight, FreeTextMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "loadCapacity", values.LoadCapacity, FreeTextMaxLength);

        VehicleMakeInputRules.AddIfTooLong(errors, "variant", values.Variant, ListCodeMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "vehicleType", values.VehicleType, ListCodeMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "bodyType", values.BodyType, ListCodeMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "fuelType", values.FuelType, ListCodeMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "cylinders", values.Cylinders, ListCodeMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "doors", values.Doors, ListCodeMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "drivingType", values.DrivingType, ListCodeMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "bodyColour", values.BodyColour, ListCodeMaxLength);
        VehicleMakeInputRules.AddIfTooLong(errors, "category", values.Category, ListCodeMaxLength);

        if (values.EngineCapacity is < 0)
        {
            errors["engineCapacity"] = ["Engine capacity must be a whole number of zero or more."];
        }

        AddIfOutOfRange(errors, "seats", "Seats", values.Seats, ThreeDigitMaximum);
        AddIfOutOfRange(errors, "passengers", "Passengers", values.Passengers, ThreeDigitMaximum);
        AddIfOutOfRange(errors, "drivers", "Drivers", values.Drivers, ThreeDigitMaximum);
        AddIfOutOfRange(errors, "makeYear", "Make year", values.MakeYear, MakeYearMaximum);

        if (values.Value is < 0)
        {
            errors["value"] = ["Value must be zero or more."];
        }

        return errors;
    }

    // A dropdown that was left empty is stored as nothing at all. A code is kept exactly as chosen, because list codes can be mixed case.
    private static string? ListCode(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }

    private static void AddIfInvalidModelCode(Dictionary<string, string[]> errors, string modelCode)
    {
        if (modelCode.Length == 0)
        {
            errors["modelCode"] = ["Model code is required."];
        }
        else if (modelCode.Length > ModelCodeMaxLength)
        {
            errors["modelCode"] = [VehicleMakeInputRules.MaximumCharactersMessage(ModelCodeMaxLength)];
        }
        else if (!modelCode.All(VehicleMakeInputRules.IsAllowedMakeCodeCharacter))
        {
            errors["modelCode"] = ["Model code can contain only letters, digits and hyphens."];
        }
    }

    private static void AddIfOutOfRange(
        Dictionary<string, string[]> errors,
        string fieldName,
        string displayName,
        int? value,
        int maximum)
    {
        if (value is { } number && (number < 0 || number > maximum))
        {
            errors[fieldName] = [$"{displayName} must be a whole number from 0 to {maximum}."];
        }
    }
}
