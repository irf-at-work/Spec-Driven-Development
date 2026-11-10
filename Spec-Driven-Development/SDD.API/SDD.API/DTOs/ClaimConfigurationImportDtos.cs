namespace SDD.API.DTOs;

public sealed record ClaimConfigurationImportRequest(
    IReadOnlyList<Dictionary<string, string?>>? Configurations,
    IReadOnlyList<Dictionary<string, string?>>? ProductLinks);

public sealed record ClaimConfigurationImportRowStatus(
    int RowNumber,
    string Key,
    bool IsValid,
    bool AlreadyExists,
    string[] Errors);

public sealed record ClaimConfigurationImportPreviewDto(
    IReadOnlyList<ClaimConfigurationImportRowStatus> Configurations,
    IReadOnlyList<ClaimConfigurationImportRowStatus> ProductLinks,
    string[] Errors);

public sealed record ClaimConfigurationImportResultDto(
    int InsertedConfigurations,
    int SkippedConfigurations,
    int InsertedLinks,
    int SkippedLinks);
