namespace SDD.API.DTOs;

public sealed record VehicleModelOptionImportRowDto(
    int RowNumber,
    string? ListType,
    string? Code,
    string? Description,
    string? Active);

public sealed record VehicleModelOptionsImportRequestDto(
    IReadOnlyList<VehicleModelOptionImportRowDto>? Rows);

public sealed record VehicleModelOptionImportPreviewRowDto(
    int RowNumber,
    string ListType,
    string Code,
    string Description,
    string Active,
    bool AlreadyExists,
    IReadOnlyList<string> Errors)
{
    public bool IsValid => Errors.Count == 0;
}

public sealed record VehicleModelOptionsImportPreviewDto(
    IReadOnlyList<VehicleModelOptionImportPreviewRowDto> Rows,
    IReadOnlyList<string> Errors);

public sealed record VehicleModelOptionsImportResultDto(int InsertedCount, int SkippedExistingCount);
