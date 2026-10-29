namespace SDD.API.DTOs;

public sealed record VehicleMakeDto(
    string MakeCode,
    string MakeName,
    string ShortName,
    string? Remarks,
    string? ArabicMakeName,
    string? ArabicShortName,
    string? ArabicRemarks,
    string? CreatedBy,
    string? LastChangedBy);
