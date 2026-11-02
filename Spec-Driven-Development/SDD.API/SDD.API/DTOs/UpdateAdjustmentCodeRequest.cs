namespace SDD.API.DTOs;

public sealed record UpdateAdjustmentCodeRequest(
    string? Name,
    string? ShortName,
    string? DiscountType,
    string? ChargesType,
    string? ChargesCategory,
    string? Remarks,
    string? ArabicName,
    string? ArabicShortName,
    string? ArabicRemarks,
    bool? Active = null);
