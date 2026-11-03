using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public sealed class ApplicableModulesRepository(CodesMasterContext context) : IApplicableModulesRepository
{
    public async Task<bool> ParentExistsAsync(string docCode, CancellationToken cancellationToken) =>
        await context.STD_DOCUMENT.CountAsync(
            document => document.DOC_CODE == docCode,
            cancellationToken) > 0;

    public Task<int> CountAsync(
        string docCode,
        IReadOnlyList<ApplicableModuleFilter> filters,
        CancellationToken cancellationToken) =>
        ApplyFilters(ForDocument(docCode), filters).CountAsync(cancellationToken);

    public async Task<IReadOnlyList<STD_DOC_APPL_MODULE>> GetPageAsync(
        string docCode,
        int skip,
        int pageSize,
        IReadOnlyList<ApplicableModuleFilter> filters,
        ApplicableModuleSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken) =>
        await ApplicableModuleQuery.ApplySort(ApplyFilters(ForDocument(docCode), filters), sortBy, sortDirection)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

    public Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken) =>
        OracleSystemDate.GetAsync(context, cancellationToken);

    public Task<STD_DOC_APPL_MODULE?> FindAsync(
        string docCode,
        decimal damodUid,
        CancellationToken cancellationToken) =>
        context.STD_DOC_APPL_MODULE
            .AsNoTracking()
            .SingleOrDefaultAsync(
                module => module.DAMOD_DOC_CODE == docCode && module.DAMOD_UID == damodUid,
                cancellationToken);

    public async Task<STD_DOC_APPL_MODULE?> CreateWithNextIdAsync(
        STD_DOC_APPL_MODULE module,
        CancellationToken cancellationToken)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        if (!await OracleRowLock.LockDocumentAsync(context, module.DAMOD_DOC_CODE!, cancellationToken))
        {
            return null;
        }

        await context.Database.ExecuteSqlRawAsync(
            "LOCK TABLE IIRIS_RD_DEVP.STD_DOC_APPL_MODULE IN EXCLUSIVE MODE",
            cancellationToken);

        var maximumId = await context.STD_DOC_APPL_MODULE
            .MaxAsync(row => (decimal?)row.DAMOD_UID, cancellationToken);

        decimal nextId;
        try
        {
            nextId = checked((maximumId ?? 0m) + 1m);
        }
        catch (OverflowException)
        {
            throw new CodesApiException(
                StatusCodes.Status409Conflict,
                "An Applicable Module ID could not be allocated.",
                "The numeric ID range is exhausted; contact an administrator.");
        }

        module.DAMOD_UID = nextId;
        await context.STD_DOC_APPL_MODULE.AddAsync(module, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return module;
    }

    public async Task<STD_DOC_APPL_MODULE?> UpdateIfCurrentAsync(
        string docCode,
        decimal damodUid,
        string expectedVersion,
        Func<STD_DOC_APPL_MODULE, CancellationToken, Task> update,
        CancellationToken cancellationToken)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        if (!await OracleRowLock.LockApplicableModuleAsync(context, docCode, damodUid, cancellationToken))
        {
            return null;
        }

        var module = await context.STD_DOC_APPL_MODULE.SingleOrDefaultAsync(
            row => row.DAMOD_DOC_CODE == docCode && row.DAMOD_UID == damodUid,
            cancellationToken);
        if (module is null)
        {
            return null;
        }

        EnsureVersion(module, expectedVersion);
        await update(module, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return module;
    }

    public async Task<bool> DeleteIfCurrentAsync(
        string docCode,
        decimal damodUid,
        string expectedVersion,
        CancellationToken cancellationToken)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        if (!await OracleRowLock.LockApplicableModuleAsync(context, docCode, damodUid, cancellationToken))
        {
            return false;
        }

        var module = await context.STD_DOC_APPL_MODULE.SingleOrDefaultAsync(
            row => row.DAMOD_DOC_CODE == docCode && row.DAMOD_UID == damodUid,
            cancellationToken);
        if (module is null)
        {
            return false;
        }

        EnsureVersion(module, expectedVersion);
        context.STD_DOC_APPL_MODULE.Remove(module);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return true;
    }

    private IQueryable<STD_DOC_APPL_MODULE> ForDocument(string docCode) =>
        context.STD_DOC_APPL_MODULE
            .AsNoTracking()
            .Where(module => module.DAMOD_DOC_CODE == docCode);

    private static IQueryable<STD_DOC_APPL_MODULE> ApplyFilters(
        IQueryable<STD_DOC_APPL_MODULE> query,
        IReadOnlyList<ApplicableModuleFilter> filters) =>
        ApplicableModuleQuery.ApplyFilter(query, filters);

    private static void EnsureVersion(STD_DOC_APPL_MODULE module, string expectedVersion)
    {
        if (!string.Equals(
                DocumentSetupVersion.Create(module),
                expectedVersion,
                StringComparison.Ordinal))
        {
            throw new CodesApiException(
                StatusCodes.Status409Conflict,
                "The Applicable Module has changed.",
                "Reload the Applicable Module before saving or deleting it.");
        }
    }
}
