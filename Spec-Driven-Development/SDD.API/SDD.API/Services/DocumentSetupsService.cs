using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public sealed class DocumentSetupsService(
    IDocumentSetupsRepository repository,
    DocumentSetupValidator validator,
    ILogger<DocumentSetupsService> logger) : IDocumentSetupsService
{
    public async Task<PaginatedResult<DocumentSetupSummary>> ListAsync(
        int page,
        int pageSize,
        IReadOnlyList<DocumentSetupFilter> filters,
        DocumentSetupSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken)
    {
        if (page < 1 || pageSize is not (10 or 15 or 20 or 50))
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The requested page is not available.",
                "Choose a positive page number and a page size of 10, 15, 20, or 50.");
        }

        var skip = (long)(page - 1) * pageSize;
        if (skip > int.MaxValue)
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The requested page is not available.",
                "Choose a lower page number or page size.");
        }

        var totalCount = await repository.CountAsync(filters, cancellationToken);
        var records = await repository.GetPageAsync(
            (int)skip,
            pageSize,
            filters,
            sortBy,
            sortDirection,
            cancellationToken);
        return new PaginatedResult<DocumentSetupSummary>(
            records.Select(record => new DocumentSetupSummary(
                record.DOC_CODE,
                record.DOC_NAME,
                record.DOC_DESC,
                record.DOC_SETUP_FOR,
                record.DOC_ACTIVE_YN,
                DocumentSetupVersion.Create(record),
                record.DOC_CR_BY,
                record.DOC_CR_DT,
                record.DOC_UP_BY,
                record.DOC_UP_DT)).ToArray(),
            page,
            pageSize,
            totalCount);
    }

    public async Task<DocumentSetupRecord> CreateAsync(
        DocumentSetupWriteRequest request,
        CancellationToken cancellationToken)
    {
        validator.EnsureValid(request);
        await EnsureSetupForCodeExistsAsync(request.DocSetupFor!, cancellationToken);
        if (await repository.ExistsAsync(request.DocCode!, cancellationToken))
        {
            throw DuplicateDocument();
        }

        var document = new STD_DOCUMENT
        {
            DOC_CODE = request.DocCode!,
            DOC_NAME = request.DocName,
            DOC_NAME_L2 = request.NameInArabic,
            DOC_DESC = request.DocDescription,
            DOC_DESC_L2 = request.DescriptionInArabic,
            DOC_SETUP_FOR = request.DocSetupFor,
            DOC_ACTIVE_YN = string.IsNullOrWhiteSpace(request.ActiveYn) ? "Y" : request.ActiveYn,
            DOC_FLEX_01 = request.Flex1,
            DOC_FLEX_02 = request.Flex2,
            DOC_CR_BY = "ADMIN",
            DOC_CR_DT = await repository.GetSystemDateAsync(cancellationToken),
            DOC_UP_BY = null,
            DOC_UP_DT = null,
        };

        try
        {
            await repository.AddAsync(document, cancellationToken);
            await repository.SaveChangesAsync(cancellationToken);
        }
        catch (OracleException exception) when (exception.Number == 1)
        {
            throw DuplicateDocument();
        }
        catch (DbUpdateException exception) when (FindOracleException(exception)?.Number == 1)
        {
            throw DuplicateDocument();
        }

        logger.LogInformation("Created a Document Setup record.");
        return Map(document);
    }

    public async Task<DocumentSetupRecord?> GetAsync(
        string docCode,
        CancellationToken cancellationToken)
    {
        var document = await repository.FindAsync(docCode, cancellationToken);
        return document is null ? null : Map(document);
    }

    public async Task<DocumentSetupRecord?> UpdateAsync(
        string docCode,
        DocumentSetupUpdateRequest request,
        CancellationToken cancellationToken)
    {
        if (!string.Equals(docCode, request.DocCode, StringComparison.Ordinal))
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The document code cannot be changed.",
                "Keep Doc Code unchanged when editing a document setup.");
        }

        if (string.IsNullOrWhiteSpace(request.ExpectedVersion))
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The expected version is required.",
                "Reload the document setup and try again.");
        }

        validator.EnsureValid(request);
        await EnsureSetupForCodeExistsAsync(request.DocSetupFor!, cancellationToken);
        var document = await repository.UpdateIfCurrentAsync(
            docCode,
            request.ExpectedVersion,
            async (current, token) =>
            {
                current.DOC_NAME = request.DocName;
                current.DOC_NAME_L2 = request.NameInArabic;
                current.DOC_DESC = request.DocDescription;
                current.DOC_DESC_L2 = request.DescriptionInArabic;
                current.DOC_SETUP_FOR = request.DocSetupFor;
                current.DOC_FLEX_01 = request.Flex1;
                current.DOC_FLEX_02 = request.Flex2;
                current.DOC_ACTIVE_YN = string.IsNullOrWhiteSpace(request.ActiveYn)
                    ? current.DOC_ACTIVE_YN
                    : request.ActiveYn;
                current.DOC_UP_BY = "ADMIN";
                current.DOC_UP_DT = await repository.GetSystemDateAsync(token);
            },
            cancellationToken);

        if (document is null)
        {
            return null;
        }

        logger.LogInformation("Updated a Document Setup record.");
        return Map(document);
    }

    public async Task<bool> DeleteAsync(
        string docCode,
        string expectedVersion,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(expectedVersion))
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The expected version is required.",
                "Reload the document setup and try again.");
        }

        var deleted = await repository.DeleteIfCurrentAndChildFreeAsync(
            docCode,
            expectedVersion,
            cancellationToken);
        if (deleted)
        {
            logger.LogInformation("Deleted a Document Setup record.");
        }

        return deleted;
    }

    private static DocumentSetupRecord Map(STD_DOCUMENT document) =>
        new(
            document.DOC_CODE,
            document.DOC_NAME,
            document.DOC_NAME_L2,
            document.DOC_DESC,
            document.DOC_DESC_L2,
            document.DOC_SETUP_FOR,
            document.DOC_FLEX_01,
            document.DOC_FLEX_02,
            document.DOC_ACTIVE_YN,
            document.DOC_CR_BY,
            document.DOC_CR_DT,
            document.DOC_UP_BY,
            document.DOC_UP_DT,
            DocumentSetupVersion.Create(document));

    private async Task EnsureSetupForCodeExistsAsync(
        string setupForCode,
        CancellationToken cancellationToken)
    {
        if (await repository.SetupForCodeExistsAsync(setupForCode, cancellationToken))
        {
            return;
        }

        throw new CodesApiException(
            StatusCodes.Status400BadRequest,
            "The submitted document setup is not valid.",
            "Choose a Doc Setup For code from Codes Master.",
            new Dictionary<string, string[]>
            {
                ["docSetupFor"] = ["The code must belong to DOC_SETUP_FOR in Codes Master."]
            });
    }

    private static CodesApiException DuplicateDocument() =>
        new(
            StatusCodes.Status409Conflict,
            "The document code already exists.",
            "Choose a different Doc Code and try again.");

    private static OracleException? FindOracleException(Exception exception)
    {
        for (var current = exception; current is not null; current = current.InnerException!)
        {
            if (current is OracleException oracleException)
            {
                return oracleException;
            }
        }

        return null;
    }
}
