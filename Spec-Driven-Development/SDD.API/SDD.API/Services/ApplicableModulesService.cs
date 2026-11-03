using System.Globalization;
using Microsoft.AspNetCore.Http;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public sealed class ApplicableModulesService(
    IApplicableModulesRepository repository,
    ApplicableModuleValidator validator,
    ILogger<ApplicableModulesService> logger) : IApplicableModulesService
{
    public async Task<PaginatedResult<ApplicableModuleSummary>> ListAsync(
        string docCode,
        int page,
        int pageSize,
        IReadOnlyList<ApplicableModuleFilter> filters,
        ApplicableModuleSortColumn sortBy,
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

        if (!await repository.ParentExistsAsync(docCode, cancellationToken))
        {
            throw ParentNotFound();
        }

        var skip = (long)(page - 1) * pageSize;
        if (skip > int.MaxValue)
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The requested page is not available.",
                "Choose a lower page number or page size.");
        }

        var totalCount = await repository.CountAsync(docCode, filters, cancellationToken);
        var rows = await repository.GetPageAsync(
            docCode,
            (int)skip,
            pageSize,
            filters,
            sortBy,
            sortDirection,
            cancellationToken);
        return new PaginatedResult<ApplicableModuleSummary>(
            rows.Select(MapSummary).ToArray(),
            page,
            pageSize,
            totalCount);
    }

    public async Task<ApplicableModuleRecord?> GetAsync(
        string docCode,
        decimal damodUid,
        CancellationToken cancellationToken)
    {
        var module = await repository.FindAsync(docCode, damodUid, cancellationToken);
        return module is null ? null : Map(module);
    }

    public async Task<ApplicableModuleRecord> CreateAsync(
        string docCode,
        ApplicableModuleWriteRequest request,
        CancellationToken cancellationToken)
    {
        validator.EnsureValid(request);
        var module = new STD_DOC_APPL_MODULE
        {
            DAMOD_DOC_CODE = docCode,
            DAMOD_APPL_FOR = request.ApplicableFor,
            DAMOD_PROD_CODE_FM = request.ProductFrom,
            DAMOD_PROD_CODE_TO = request.ProductTo,
            DAMOD_PCM_CODE_FM = request.PcmFrom,
            DAMOD_PCM_CODE_TO = request.PcmTo,
            DAMOD_CCM_CODE_FM = request.CcmFrom,
            DAMOD_CCM_CODE_TO = request.CcmTo,
            DAMOD_DOC_MAND_YN = string.IsNullOrWhiteSpace(request.MandatoryYn) ? "N" : request.MandatoryYn,
            DAMOD_ACTIVE_YN = string.IsNullOrWhiteSpace(request.ActiveYn) ? "Y" : request.ActiveYn,
            DAMOD_CR_BY = "ADMIN",
            DAMOD_CR_DT = await repository.GetSystemDateAsync(cancellationToken),
            DAMOD_UP_BY = null,
            DAMOD_UP_DT = null,
        };

        var created = await repository.CreateWithNextIdAsync(module, cancellationToken);
        if (created is null)
        {
            throw ParentNotFound();
        }

        logger.LogInformation("Created an Applicable Module record.");
        return Map(created);
    }

    public async Task<ApplicableModuleRecord?> UpdateAsync(
        string docCode,
        decimal damodUid,
        ApplicableModuleUpdateRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.ExpectedVersion))
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The expected version is required.",
                "Reload the Applicable Module and try again.");
        }

        validator.EnsureValid(request);
        var module = await repository.UpdateIfCurrentAsync(
            docCode,
            damodUid,
            request.ExpectedVersion,
            async (current, token) =>
            {
                current.DAMOD_APPL_FOR = request.ApplicableFor;
                current.DAMOD_PROD_CODE_FM = request.ProductFrom;
                current.DAMOD_PROD_CODE_TO = request.ProductTo;
                current.DAMOD_PCM_CODE_FM = request.PcmFrom;
                current.DAMOD_PCM_CODE_TO = request.PcmTo;
                current.DAMOD_CCM_CODE_FM = request.CcmFrom;
                current.DAMOD_CCM_CODE_TO = request.CcmTo;
                current.DAMOD_DOC_MAND_YN = string.IsNullOrWhiteSpace(request.MandatoryYn)
                    ? current.DAMOD_DOC_MAND_YN
                    : request.MandatoryYn;
                current.DAMOD_ACTIVE_YN = string.IsNullOrWhiteSpace(request.ActiveYn)
                    ? current.DAMOD_ACTIVE_YN
                    : request.ActiveYn;
                current.DAMOD_UP_BY = "ADMIN";
                current.DAMOD_UP_DT = await repository.GetSystemDateAsync(token);
            },
            cancellationToken);

        if (module is null)
        {
            return null;
        }

        logger.LogInformation("Updated an Applicable Module record.");
        return Map(module);
    }

    public Task<bool> DeleteAsync(
        string docCode,
        decimal damodUid,
        string expectedVersion,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(expectedVersion))
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The expected version is required.",
                "Reload the Applicable Module and try again.");
        }

        return repository.DeleteIfCurrentAsync(docCode, damodUid, expectedVersion, cancellationToken);
    }

    private static ApplicableModuleSummary MapSummary(STD_DOC_APPL_MODULE module) =>
        new(
            FormatId(module.DAMOD_UID),
            module.DAMOD_APPL_FOR ?? string.Empty,
            module.DAMOD_PROD_CODE_FM,
            module.DAMOD_PROD_CODE_TO,
            module.DAMOD_PCM_CODE_FM,
            module.DAMOD_PCM_CODE_TO,
            module.DAMOD_CCM_CODE_FM,
            module.DAMOD_CCM_CODE_TO,
            module.DAMOD_DOC_MAND_YN,
            module.DAMOD_ACTIVE_YN,
            DocumentSetupVersion.Create(module));

    private static ApplicableModuleRecord Map(STD_DOC_APPL_MODULE module) =>
        new(
            FormatId(module.DAMOD_UID),
            module.DAMOD_DOC_CODE ?? string.Empty,
            module.DAMOD_APPL_FOR ?? string.Empty,
            module.DAMOD_PROD_CODE_FM,
            module.DAMOD_PROD_CODE_TO,
            module.DAMOD_PCM_CODE_FM,
            module.DAMOD_PCM_CODE_TO,
            module.DAMOD_CCM_CODE_FM,
            module.DAMOD_CCM_CODE_TO,
            module.DAMOD_DOC_MAND_YN,
            module.DAMOD_ACTIVE_YN,
            module.DAMOD_CR_BY,
            module.DAMOD_CR_DT,
            module.DAMOD_UP_BY,
            module.DAMOD_UP_DT,
            DocumentSetupVersion.Create(module));

    private static string FormatId(decimal damodUid) =>
        damodUid.ToString("G29", CultureInfo.InvariantCulture);

    private static CodesApiException ParentNotFound() =>
        new(
            StatusCodes.Status404NotFound,
            "The document setup was not found.",
            "The Applicable Module must belong to an existing document setup.");
}
