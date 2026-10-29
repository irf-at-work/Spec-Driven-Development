namespace SDD.API.DTOs;

// Fields are nullable on purpose: a missing value is reported by our own validation with a friendly message,
// instead of the framework rejecting the request before it reaches that validation.
public sealed record CreateVehicleMakeRequest(
    string? MakeCode,
    string? MakeName,
    string? ShortName,
    string? Remarks,
    string? ArabicMakeName,
    string? ArabicShortName,
    string? ArabicRemarks);
