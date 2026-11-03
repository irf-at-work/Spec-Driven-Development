namespace SDD.API.DTOs;

// There is deliberately no ModelCode or MakeCode here: together they are the record's identity and never change.
// Active is optional: leaving it out keeps the model's current status as it is.
public sealed record UpdateVehicleModelRequest(
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
