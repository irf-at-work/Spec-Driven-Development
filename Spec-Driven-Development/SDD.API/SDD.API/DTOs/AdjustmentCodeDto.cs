namespace SDD.API.DTOs;

public sealed record AdjustmentCodeDto(
    string CodeType,
    string CodeTypeDescription,
    string Code,
    string CompanyCode,
    string Name,
    string ShortName,
    string? DiscountType,
    string? ChargesType,
    string? ChargesCategory,
    string? Remarks,
    string? ArabicName,
    string? ArabicShortName,
    string? ArabicRemarks,
    bool Active,
    string? CreatedBy,
    string? LastChangedBy);
