namespace SDD.API.DTOs;

public sealed record ClaimConfigurationListItemDto(
    string CompanyCode,
    string CcmCode,
    string Name,
    string ShortName,
    bool Active);
