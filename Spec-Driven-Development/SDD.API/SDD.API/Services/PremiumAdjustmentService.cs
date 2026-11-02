using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SDD.API.Configuration;
using SDD.API.Contracts;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;
using SDD.API.Infrastructure;

namespace SDD.API.Services;

public enum PremiumAdjustmentSaveOutcome
{
    Saved,
    Invalid,
    Duplicate,
    NotFound
}

public sealed record PremiumAdjustmentSaveResult(
    PremiumAdjustmentSaveOutcome Outcome,
    AdjustmentCodeDto? Adjustment = null,
    IReadOnlyDictionary<string, string[]>? Errors = null);

public enum PremiumAdjustmentDeleteOutcome
{
    Deleted,
    NotFound
}

public sealed class PremiumAdjustmentService(
    SddDbContext database,
    IOptions<AuditOptions> auditOptions,
    TimeProvider clock,
    ILogger<PremiumAdjustmentService> logger)
{
    private static readonly (string ListType, string Field, string Label)[] ClassificationFields =
    [
        ("CALC_TYPE", "codeType", "Code Type"),
        ("DISCOUNT_TYPE", "discountType", "Discount Type"),
        ("CHARGE_TYPE", "chargesType", "Charges Type"),
        ("CHARGE_CAT", "chargesCategory", "Charges Category")
    ];

    public async Task<PremiumAdjustmentOptionsDto> GetOptionsAsync(CancellationToken cancellationToken)
    {
        var rows = await database.StdListItems
            .AsNoTracking()
            .Where(item =>
                item.LiActiveYn == "Y"
                && (item.LiType == "CALC_TYPE"
                    || item.LiType == "DISCOUNT_TYPE"
                    || item.LiType == "CHARGE_TYPE"
                    || item.LiType == "CHARGE_CAT"))
            .OrderBy(item => item.LiDesc)
            .ThenBy(item => item.LiCode)
            .ToListAsync(cancellationToken);

        IReadOnlyList<LookupOptionDto> Options(string listType) =>
            rows.Where(item => item.LiType == listType)
                .Select(item => new LookupOptionDto(item.LiCode, item.LiDesc ?? item.LiCode))
                .ToList();

        return new PremiumAdjustmentOptionsDto(
            Options("CALC_TYPE"),
            Options("DISCOUNT_TYPE"),
            Options("CHARGE_TYPE"),
            Options("CHARGE_CAT"));
    }

    public async Task<PaginatedResult<AdjustmentCodeListItemDto>> ListAsync(
        int page,
        ColumnFilters filters,
        string? sortBy,
        string? sortDirection,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var matching = PremiumAdjustmentListQuery.Apply(
            PremiumAdjustmentListQuery.JoinCodeTypes(
                database.BrmMiscCodes.AsNoTracking(),
                database.StdListItems.AsNoTracking()),
            filters,
            sortBy,
            sortDirection);

        var totalCount = await matching.CountAsync(cancellationToken);
        var skip = (int)Math.Min((long)(page - 1) * pageSize, int.MaxValue);
        var rows = await matching
            .Skip(skip)
            .Take(pageSize)
            .Select(row => new
            {
                row.Code.McType,
                row.CodeTypeDescription,
                row.Code.McCode,
                row.Code.McCompCode,
                row.Code.McDesc,
                row.Code.McShortDesc,
                row.Code.McActiveYn
            })
            .ToListAsync(cancellationToken);

        var items = rows.Select(row => new AdjustmentCodeListItemDto(
            row.McType,
            row.CodeTypeDescription,
            row.McCode,
            row.McCompCode,
            row.McDesc ?? string.Empty,
            row.McShortDesc ?? string.Empty,
            PremiumAdjustmentMapping.IsActive(row.McActiveYn))).ToList();

        return new PaginatedResult<AdjustmentCodeListItemDto>(items, page, pageSize, totalCount);
    }

    public async Task<AdjustmentCodeDto?> GetAsync(
        string codeType,
        string code,
        string companyCode,
        CancellationToken cancellationToken)
    {
        var keyType = codeType.Trim().ToUpperInvariant();
        var keyCode = code.Trim().ToUpperInvariant();
        var keyCompanyCode = companyCode.Trim().ToUpperInvariant();
        var row = await PremiumAdjustmentListQuery.JoinCodeTypes(
                database.BrmMiscCodes.AsNoTracking(),
                database.StdListItems.AsNoTracking())
            .FirstOrDefaultAsync(
                result => result.Code.McType == keyType
                    && result.Code.McCode == keyCode
                    && result.Code.McCompCode == keyCompanyCode,
                cancellationToken);

        return row is null ? null : PremiumAdjustmentMapping.ToDto(row);
    }

    public async Task<PremiumAdjustmentSaveResult> CreateAsync(
        PremiumAdjustmentValues values,
        CancellationToken cancellationToken)
    {
        var invalidOptions = await FindInvalidOptionsAsync(values, current: null, cancellationToken);
        if (invalidOptions.Count > 0)
        {
            return new PremiumAdjustmentSaveResult(PremiumAdjustmentSaveOutcome.Invalid, Errors: invalidOptions);
        }

        var exists = await database.BrmMiscCodes.CountAsync(
            item => item.McType == values.CodeType
                && item.McCode == values.Code
                && item.McCompCode == values.CompanyCode,
            cancellationToken) > 0;
        if (exists)
        {
            LogDuplicate(values);
            return new PremiumAdjustmentSaveResult(PremiumAdjustmentSaveOutcome.Duplicate);
        }

        var now = GulfStandardTime.Now(clock);
        var user = auditOptions.Value.UserName;
        var entity = new BrmMiscCode
        {
            McType = values.CodeType,
            McCode = values.Code,
            McCompCode = values.CompanyCode,
            McDesc = values.Name,
            McShortDesc = values.ShortName,
            McDiscType = values.DiscountType,
            McChgType = values.ChargesType,
            McChgCateg = values.ChargesCategory,
            McLongDesc = values.Remarks,
            McDescL2 = values.ArabicName,
            McShortDescL2 = values.ArabicShortName,
            McLongDescL2 = values.ArabicRemarks,
            McActiveYn = PremiumAdjustmentMapping.ToFlag(values.Active ?? true),
            McCrBy = user,
            McCrDt = now,
            McUpBy = user,
            McUpDt = now
        };
        database.BrmMiscCodes.Add(entity);

        try
        {
            await database.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (OracleErrors.Has(exception, OracleErrors.UniqueConstraintViolation))
        {
            database.Entry(entity).State = EntityState.Detached;
            LogDuplicate(values);
            return new PremiumAdjustmentSaveResult(PremiumAdjustmentSaveOutcome.Duplicate);
        }

        logger.LogInformation("Created premium adjustment {CodeType}/{Code}/{CompanyCode}", values.CodeType, values.Code, values.CompanyCode);
        return new PremiumAdjustmentSaveResult(
            PremiumAdjustmentSaveOutcome.Saved,
            await ToDtoAsync(entity, cancellationToken));
    }

    public async Task<PremiumAdjustmentSaveResult> UpdateAsync(
        PremiumAdjustmentValues values,
        CancellationToken cancellationToken)
    {
        var entity = await database.BrmMiscCodes.FirstOrDefaultAsync(
            item => item.McType == values.CodeType
                && item.McCode == values.Code
                && item.McCompCode == values.CompanyCode,
            cancellationToken);
        if (entity is null)
        {
            logger.LogWarning(
                "Update failed (NotFound): premium adjustment {CodeType}/{Code}/{CompanyCode} does not exist",
                values.CodeType,
                values.Code,
                values.CompanyCode);
            return new PremiumAdjustmentSaveResult(PremiumAdjustmentSaveOutcome.NotFound);
        }

        var invalidOptions = await FindInvalidOptionsAsync(values, entity, cancellationToken);
        if (invalidOptions.Count > 0)
        {
            return new PremiumAdjustmentSaveResult(PremiumAdjustmentSaveOutcome.Invalid, Errors: invalidOptions);
        }

        entity.McDesc = values.Name;
        entity.McShortDesc = values.ShortName;
        entity.McDiscType = values.DiscountType;
        entity.McChgType = values.ChargesType;
        entity.McChgCateg = values.ChargesCategory;
        entity.McLongDesc = values.Remarks;
        entity.McDescL2 = values.ArabicName;
        entity.McShortDescL2 = values.ArabicShortName;
        entity.McLongDescL2 = values.ArabicRemarks;
        if (values.Active is { } active)
        {
            entity.McActiveYn = PremiumAdjustmentMapping.ToFlag(active);
        }

        entity.McUpBy = auditOptions.Value.UserName;
        entity.McUpDt = GulfStandardTime.Now(clock);
        await database.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Updated premium adjustment {CodeType}/{Code}/{CompanyCode}", values.CodeType, values.Code, values.CompanyCode);
        return new PremiumAdjustmentSaveResult(
            PremiumAdjustmentSaveOutcome.Saved,
            await ToDtoAsync(entity, cancellationToken));
    }

    public async Task<PremiumAdjustmentDeleteOutcome> DeleteAsync(
        string codeType,
        string code,
        string companyCode,
        CancellationToken cancellationToken)
    {
        var keyType = codeType.Trim().ToUpperInvariant();
        var keyCode = code.Trim().ToUpperInvariant();
        var keyCompanyCode = companyCode.Trim().ToUpperInvariant();
        var removed = await database.BrmMiscCodes
            .Where(item => item.McType == keyType && item.McCode == keyCode && item.McCompCode == keyCompanyCode)
            .ExecuteDeleteAsync(cancellationToken);

        if (removed == 0)
        {
            logger.LogWarning(
                "Delete failed (NotFound): premium adjustment {CodeType}/{Code}/{CompanyCode} does not exist",
                keyType,
                keyCode,
                keyCompanyCode);
            return PremiumAdjustmentDeleteOutcome.NotFound;
        }

        logger.LogInformation("Deleted premium adjustment {CodeType}/{Code}/{CompanyCode}", keyType, keyCode, keyCompanyCode);
        return PremiumAdjustmentDeleteOutcome.Deleted;
    }

    private async Task<IReadOnlyDictionary<string, string[]>> FindInvalidOptionsAsync(
        PremiumAdjustmentValues values,
        BrmMiscCode? current,
        CancellationToken cancellationToken)
    {
        var errors = new Dictionary<string, string[]>();
        var requested = new Dictionary<string, string>(StringComparer.Ordinal)
        {
            ["codeType"] = values.CodeType,
            ["discountType"] = values.DiscountType,
            ["chargesType"] = values.ChargesType,
            ["chargesCategory"] = values.ChargesCategory
        };
        var existing = current is null
            ? new Dictionary<string, string?>(StringComparer.Ordinal)
            : new Dictionary<string, string?>(StringComparer.Ordinal)
            {
                ["codeType"] = current.McType,
                ["discountType"] = current.McDiscType,
                ["chargesType"] = current.McChgType,
                ["chargesCategory"] = current.McChgCateg
            };

        var toCheck = ClassificationFields
            .Where(field =>
                requested[field.Field].Length > 0
                && (!existing.TryGetValue(field.Field, out var oldValue)
                    || !string.Equals(oldValue, requested[field.Field], StringComparison.OrdinalIgnoreCase)))
            .ToArray();
        if (toCheck.Length == 0)
        {
            return errors;
        }

        var codeType = requested["codeType"];
        var discountType = requested["discountType"];
        var chargesType = requested["chargesType"];
        var chargesCategory = requested["chargesCategory"];
        var activeItems = await database.StdListItems
            .AsNoTracking()
            .Where(item =>
                item.LiActiveYn == "Y"
                && ((item.LiType == "CALC_TYPE" && item.LiCode == codeType)
                    || (item.LiType == "DISCOUNT_TYPE" && item.LiCode == discountType)
                    || (item.LiType == "CHARGE_TYPE" && item.LiCode == chargesType)
                    || (item.LiType == "CHARGE_CAT" && item.LiCode == chargesCategory)))
            .Select(item => new { item.LiType, item.LiCode })
            .ToListAsync(cancellationToken);

        foreach (var field in toCheck)
        {
            var value = requested[field.Field];
            var found = activeItems.Any(item =>
                item.LiType == field.ListType && string.Equals(item.LiCode, value, StringComparison.OrdinalIgnoreCase));
            if (!found)
            {
                errors[field.Field] = [$"Choose an active {field.Label} from the list."];
            }
        }

        return errors;
    }

    private async Task<AdjustmentCodeDto> ToDtoAsync(BrmMiscCode entity, CancellationToken cancellationToken)
    {
        var description = await database.StdListItems
            .AsNoTracking()
            .Where(item => item.LiType == "CALC_TYPE" && item.LiCode == entity.McType)
            .Select(item => item.LiDesc)
            .FirstOrDefaultAsync(cancellationToken);

        return PremiumAdjustmentMapping.ToDto(entity, description ?? entity.McType);
    }

    private void LogDuplicate(PremiumAdjustmentValues values) =>
        logger.LogWarning(
            "Create failed (DuplicateCombination): premium adjustment {CodeType}/{Code}/{CompanyCode} already exists",
            values.CodeType,
            values.Code,
            values.CompanyCode);
}
