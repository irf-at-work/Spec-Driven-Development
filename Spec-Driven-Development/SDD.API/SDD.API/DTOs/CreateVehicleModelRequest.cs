namespace SDD.API.DTOs;

// The make code is not here: it always comes from the web address, so a model cannot be moved to another make.
// Fields are nullable on purpose so that a missing value is reported by our own validation with a friendly message.
// Active is optional: leaving it out means "on", which is the default when a model is added (FR-028).
public sealed record CreateVehicleModelRequest(
    string? ModelCode,
    string? ModelName,
    string? ShortName,
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
    bool? Active = null);
