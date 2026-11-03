namespace SDD.API.DTOs;

public sealed record VehicleMakeImportRowDto(int RowNumber, string? MakeCode, string? MakeName, string? ShortName, string? Remarks, string? ArabicMakeName, string? ArabicShortName, string? ArabicRemarks, bool? Active, string? ActiveText = null);
public sealed record VehicleMakeImportPreviewRowDto(int RowNumber, string MakeCode, string MakeName, string ShortName, bool AlreadyExists, IReadOnlyList<string> Errors)
{
    public bool IsValid => Errors.Count == 0;
}
public sealed record VehicleMakeImportPreviewDto(IReadOnlyList<VehicleMakeImportPreviewRowDto> Rows, IReadOnlyList<string> Errors);

public sealed record PremiumAdjustmentImportRowDto(int RowNumber, string? CodeType, string? Code, string? CompanyCode, string? Name, string? ShortName, string? DiscountType, string? ChargesType, string? ChargesCategory, string? Remarks, string? ArabicName, string? ArabicShortName, string? ArabicRemarks, bool? Active, string? ActiveText = null);
public sealed record PremiumAdjustmentImportPreviewRowDto(int RowNumber, string CodeType, string Code, string CompanyCode, string Name, string ShortName, bool AlreadyExists, IReadOnlyList<string> Errors)
{
    public bool IsValid => Errors.Count == 0;
}
public sealed record PremiumAdjustmentImportPreviewDto(IReadOnlyList<PremiumAdjustmentImportPreviewRowDto> Rows, IReadOnlyList<string> Errors);
public sealed record MasterImportResultDto(int InsertedCount, int SkippedExistingCount);
