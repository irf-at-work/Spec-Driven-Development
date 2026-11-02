using Microsoft.EntityFrameworkCore;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;
using SDD.API.Infrastructure;

namespace SDD.API.Services;

public sealed class VehicleModelOptionsImportService(SddDbContext database)
{
    public const int MaximumRows = 1_000;

    private sealed record NormalizedRow(
        int RowNumber,
        string ListType,
        string Code,
        string Description,
        string Active,
        IReadOnlyList<string> Errors);

    public async Task<VehicleModelOptionsImportPreviewDto> PreviewAsync(
        IReadOnlyList<VehicleModelOptionImportRowDto>? rows,
        CancellationToken cancellationToken)
    {
        if (rows is null || rows.Count == 0)
        {
            return new VehicleModelOptionsImportPreviewDto([], ["The workbook contains no data rows."]);
        }

        if (rows.Count > MaximumRows)
        {
            return new VehicleModelOptionsImportPreviewDto([], [$"The workbook can contain no more than {MaximumRows} data rows."]);
        }

        var normalized = rows.Select(Normalize).ToList();
        var repeatedKeys = normalized
            .Where(row => row.ListType.Length > 0 && row.Code.Length > 0)
            .GroupBy(row => Key(row.ListType, row.Code), StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() > 1)
            .SelectMany(group => group)
            .Select(row => row.RowNumber)
            .ToHashSet();

        var existingKeys = await FindExistingKeysAsync(normalized, cancellationToken);

        var previewRows = normalized.Select(row =>
        {
            var errors = row.Errors.ToList();
            if (repeatedKeys.Contains(row.RowNumber))
            {
                errors.Add("This (LI_TYPE, LI_CODE) key appears more than once in the workbook.");
            }

            return new VehicleModelOptionImportPreviewRowDto(
                row.RowNumber,
                row.ListType,
                row.Code,
                row.Description,
                row.Active,
                existingKeys.Contains(Key(row.ListType, row.Code)),
                errors);
        }).ToList();

        return new VehicleModelOptionsImportPreviewDto(previewRows, []);
    }

    public async Task<VehicleModelOptionsImportResultDto> ImportAsync(
        IReadOnlyList<VehicleModelOptionImportRowDto>? rows,
        CancellationToken cancellationToken)
    {
        var preview = await PreviewAsync(rows, cancellationToken);
        if (preview.Errors.Count > 0 || preview.Rows.Any(row => !row.IsValid))
        {
            throw new VehicleModelOptionsImportValidationException(preview);
        }

        var toInsert = preview.Rows.Where(row => !row.AlreadyExists).ToList();
        if (toInsert.Count == 0)
        {
            return new VehicleModelOptionsImportResultDto(0, preview.Rows.Count);
        }

        await using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);
        database.StdListItems.AddRange(toInsert.Select(row => new StdListItem
        {
            LiType = row.ListType,
            LiCode = row.Code,
            LiDesc = row.Description,
            LiActiveYn = row.Active
        }));

        try
        {
            await database.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (OracleErrors.Has(exception, OracleErrors.UniqueConstraintViolation))
        {
            await transaction.RollbackAsync(cancellationToken);
            throw new VehicleModelOptionsImportConflictException();
        }

        return new VehicleModelOptionsImportResultDto(toInsert.Count, preview.Rows.Count - toInsert.Count);
    }

    private static NormalizedRow Normalize(VehicleModelOptionImportRowDto row)
    {
        var listType = (row.ListType ?? string.Empty).Trim().ToUpperInvariant();
        var code = (row.Code ?? string.Empty).Trim().ToUpperInvariant();
        var description = (row.Description ?? string.Empty).Trim();
        var active = (row.Active ?? string.Empty).Trim().ToUpperInvariant();
        var errors = new List<string>();

        if (!VehicleModelListTypes.All.Contains(listType, StringComparer.Ordinal))
        {
            errors.Add("LI_TYPE must be one of the nine supported vehicle model list types.");
        }
        if (listType.Length > 20)
        {
            errors.Add("LI_TYPE cannot exceed 20 characters.");
        }
        if (code.Length == 0)
        {
            errors.Add("LI_CODE is required.");
        }
        else if (code.Length > 12)
        {
            errors.Add("LI_CODE cannot exceed 12 characters.");
        }
        if (description.Length == 0)
        {
            errors.Add("LI_DESC is required.");
        }
        else if (description.Length > 100)
        {
            errors.Add("LI_DESC cannot exceed 100 characters.");
        }
        if (active is not ("Y" or "N"))
        {
            errors.Add("LI_ACTIVE_YN must be Y or N.");
        }

        return new NormalizedRow(row.RowNumber, listType, code, description, active, errors);
    }

    private async Task<HashSet<string>> FindExistingKeysAsync(
        IReadOnlyList<NormalizedRow> rows,
        CancellationToken cancellationToken)
    {
        var existing = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var eligible = rows.Where(row => row.Errors.Count == 0).ToList();

        foreach (var group in eligible.GroupBy(row => row.ListType, StringComparer.Ordinal))
        {
            var codes = group.Select(row => row.Code).Distinct(StringComparer.Ordinal).ToArray();
            var matches = await database.StdListItems
                .AsNoTracking()
                .Where(item => item.LiType == group.Key && codes.Contains(item.LiCode))
                .Select(item => new { item.LiType, item.LiCode })
                .ToListAsync(cancellationToken);

            foreach (var match in matches)
            {
                existing.Add(Key(match.LiType, match.LiCode));
            }
        }

        return existing;
    }

    private static string Key(string listType, string code) => $"{listType}\u001f{code}";
}

public sealed class VehicleModelOptionsImportValidationException(
    VehicleModelOptionsImportPreviewDto preview) : Exception("The import contains invalid rows.")
{
    public VehicleModelOptionsImportPreviewDto Preview { get; } = preview;
}

public sealed class VehicleModelOptionsImportConflictException()
    : Exception("A lookup key was added by another request during this import.");
