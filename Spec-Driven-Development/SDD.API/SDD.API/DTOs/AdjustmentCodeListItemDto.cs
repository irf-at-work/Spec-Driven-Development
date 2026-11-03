namespace SDD.API.DTOs;

public sealed record AdjustmentCodeListItemDto(
    string CodeType,
    string CodeTypeDescription,
    string Code,
    string CompanyCode,
    string Name,
    string ShortName,
    bool Active);
