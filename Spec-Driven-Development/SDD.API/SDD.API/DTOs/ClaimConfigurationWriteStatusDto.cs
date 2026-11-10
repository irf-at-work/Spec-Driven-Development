namespace SDD.API.DTOs;

public sealed record ClaimConfigurationWriteStatusDto(bool Enabled, string Message, string CompanyCode);
