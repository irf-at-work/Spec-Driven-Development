namespace SDD.API.DTOs;

public sealed record MasterDataImportRequest(IReadOnlyList<Dictionary<string, string?>> Rows);
public sealed record MasterDataImportResult(int InsertedCount, int SkippedExistingCount);
