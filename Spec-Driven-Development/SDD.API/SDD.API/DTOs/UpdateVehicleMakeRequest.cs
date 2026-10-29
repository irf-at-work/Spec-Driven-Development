namespace SDD.API.DTOs;

// There is deliberately no MakeCode here: the code is the record's identity and never changes after creation.
public sealed record UpdateVehicleMakeRequest(
    string? MakeName,
    string? ShortName,
    string? Remarks,
    string? ArabicMakeName,
    string? ArabicShortName,
    string? ArabicRemarks);
