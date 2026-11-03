using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Oracle.ManagedDataAccess.Client;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public sealed class DocumentSetupsRepository(CodesMasterContext context) : IDocumentSetupsRepository
{
    public Task<int> CountAsync(
        IReadOnlyList<DocumentSetupFilter> filters,
        CancellationToken cancellationToken) =>
        ApplyFilters(filters).CountAsync(cancellationToken);

    public async Task<IReadOnlyList<STD_DOCUMENT>> GetPageAsync(
        int skip,
        int pageSize,
        IReadOnlyList<DocumentSetupFilter> filters,
        DocumentSetupSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken) =>
        await DocumentSetupQuery.ApplySort(ApplyFilters(filters), sortBy, sortDirection)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

    public async Task<bool> ExistsAsync(string docCode, CancellationToken cancellationToken) =>
        await context.STD_DOCUMENT.CountAsync(
            document => document.DOC_CODE == docCode,
            cancellationToken) > 0;

    public async Task<bool> SetupForCodeExistsAsync(
        string setupForCode,
        CancellationToken cancellationToken) =>
        await context.STD_CODES.CountAsync(
            code => code.CC_CODE == setupForCode && code.CC_TYPE == "DOC_SETUP_FOR",
            cancellationToken) > 0;

    public Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken) =>
        OracleSystemDate.GetAsync(context, cancellationToken);

    public async Task AddAsync(STD_DOCUMENT document, CancellationToken cancellationToken) =>
        await context.STD_DOCUMENT.AddAsync(document, cancellationToken);

    public async Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _ = await context.SaveChangesAsync(cancellationToken);

    public Task<STD_DOCUMENT?> FindAsync(string docCode, CancellationToken cancellationToken) =>
        context.STD_DOCUMENT
            .AsNoTracking()
            .SingleOrDefaultAsync(document => document.DOC_CODE == docCode, cancellationToken);

    public async Task<STD_DOCUMENT?> UpdateIfCurrentAsync(
        string docCode,
        string expectedVersion,
        Func<STD_DOCUMENT, CancellationToken, Task> update,
        CancellationToken cancellationToken)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        if (!await OracleRowLock.LockDocumentAsync(context, docCode, cancellationToken))
        {
            return null;
        }

        var document = await context.STD_DOCUMENT
            .SingleOrDefaultAsync(record => record.DOC_CODE == docCode, cancellationToken);
        if (document is null)
        {
            return null;
        }

        EnsureVersion(document, expectedVersion);
        await update(document, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return document;
    }

    public async Task<bool> DeleteIfCurrentAndChildFreeAsync(
        string docCode,
        string expectedVersion,
        CancellationToken cancellationToken)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        if (!await OracleRowLock.LockDocumentAsync(context, docCode, cancellationToken))
        {
            return false;
        }

        var document = await context.STD_DOCUMENT
            .SingleOrDefaultAsync(record => record.DOC_CODE == docCode, cancellationToken);
        if (document is null)
        {
            return false;
        }

        EnsureVersion(document, expectedVersion);
        if (await context.STD_DOC_APPL_MODULE
                .CountAsync(module => module.DAMOD_DOC_CODE == docCode, cancellationToken) > 0)
        {
            throw new CodesApiException(
                StatusCodes.Status409Conflict,
                "The document setup has applicable modules.",
                "Delete its Applicable Module rows before deleting the document setup.");
        }

        context.STD_DOCUMENT.Remove(document);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return true;
    }

    private IQueryable<STD_DOCUMENT> ApplyFilters(IReadOnlyList<DocumentSetupFilter> filters) =>
        DocumentSetupQuery.ApplyFilters(context.STD_DOCUMENT.AsNoTracking(), filters);

    private static void EnsureVersion(STD_DOCUMENT document, string expectedVersion)
    {
        if (!string.Equals(
                DocumentSetupVersion.Create(document),
                expectedVersion,
                StringComparison.Ordinal))
        {
            throw new CodesApiException(
                StatusCodes.Status409Conflict,
                "The document setup has changed.",
                "Reload the document setup before saving your changes.");
        }
    }
}
