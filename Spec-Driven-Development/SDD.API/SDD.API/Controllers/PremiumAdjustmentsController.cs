using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/premium-adjustments")]
public sealed class PremiumAdjustmentsController(
    PremiumAdjustmentService adjustments,
    MasterDataImportService imports,
    ILogger<PremiumAdjustmentsController> logger) : ControllerBase
{
    [HttpPost("import/preview")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public Task<PremiumAdjustmentImportPreviewDto> PreviewImport(MasterDataImportRequest request, CancellationToken cancellationToken) =>
        imports.PreviewAdjustmentsAsync(MapRows(request), cancellationToken);

    [HttpPost("import")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<ActionResult<MasterImportResultDto>> Import(MasterDataImportRequest request, CancellationToken cancellationToken)
    {
        try { return await imports.ImportAdjustmentsAsync(MapRows(request), cancellationToken); }
        catch (InvalidOperationException ex) { return BadRequest(new ProblemDetails { Title = "Premium adjustment import could not be completed", Detail = ex.Message, Status = 400 }); }
    }

    private static PremiumAdjustmentImportRowDto[] MapRows(MasterDataImportRequest request) => request.Rows.Select((row,index) => new PremiumAdjustmentImportRowDto(index+2,row.GetValueOrDefault("codeType"),row.GetValueOrDefault("code"),row.GetValueOrDefault("companyCode"),row.GetValueOrDefault("name"),row.GetValueOrDefault("shortName"),row.GetValueOrDefault("discountType"),row.GetValueOrDefault("chargesType"),row.GetValueOrDefault("chargesCategory"),row.GetValueOrDefault("remarks"),row.GetValueOrDefault("arabicName"),row.GetValueOrDefault("arabicShortName"),row.GetValueOrDefault("arabicRemarks"),row.GetValueOrDefault("active")?.Trim().ToUpperInvariant() switch { "Y"=>true,"N"=>false,_=>null },row.GetValueOrDefault("active"))).ToArray();

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<AdjustmentCodeListItemDto>>> List(
        int page = 1,
        string? codeType = null,
        string? codeTypeOperator = null,
        string? code = null,
        string? codeOperator = null,
        string? companyCode = null,
        string? companyCodeOperator = null,
        string? name = null,
        string? nameOperator = null,
        string? shortName = null,
        string? shortNameOperator = null,
        bool? active = null,
        string? activeOperator = null,
        string? sortBy = null,
        string? sortDirection = null,
        int pageSize = PremiumAdjustmentListQuery.PageSize,
        CancellationToken cancellationToken = default)
    {
        var filters = new ColumnFilters(
            new Dictionary<string, TextFilter>(StringComparer.OrdinalIgnoreCase)
            {
                ["codeType"] = new TextFilter(codeType, codeTypeOperator),
                ["code"] = new TextFilter(code, codeOperator),
                ["companyCode"] = new TextFilter(companyCode, companyCodeOperator),
                ["name"] = new TextFilter(name, nameOperator),
                ["shortName"] = new TextFilter(shortName, shortNameOperator)
            },
            new StatusFilter(active, activeOperator));

        var errors = PremiumAdjustmentListQuery.Validate(page, filters, sortBy, sortDirection, pageSize);
        if (errors.Count > 0)
        {
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        return await adjustments.ListAsync(page, filters, sortBy, sortDirection, pageSize, cancellationToken);
    }

    [HttpGet("{codeType}/{code}/{companyCode}")]
    public async Task<ActionResult<AdjustmentCodeDto>> Get(
        string codeType,
        string code,
        string companyCode,
        CancellationToken cancellationToken)
    {
        var adjustment = await adjustments.GetAsync(codeType, code, companyCode, cancellationToken);
        if (adjustment is null)
        {
            return NotFoundProblem();
        }

        return adjustment;
    }

    [HttpPost]
    public async Task<ActionResult<AdjustmentCodeDto>> Create(
        CreateAdjustmentCodeRequest request,
        CancellationToken cancellationToken)
    {
        var values = PremiumAdjustmentInputRules.Normalise(request);
        var errors = PremiumAdjustmentInputRules.Validate(values, validateKey: true);
        if (errors.Count > 0)
        {
            LogValidationFailure("Create", values, errors);
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        var result = await adjustments.CreateAsync(values, cancellationToken);
        if (result.Outcome == PremiumAdjustmentSaveOutcome.Invalid)
        {
            var optionErrors = result.Errors ?? throw new InvalidOperationException("Invalid adjustment values must include field errors.");
            LogValidationFailure("Create", values, optionErrors);
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(optionErrors)));
        }

        if (result.Outcome == PremiumAdjustmentSaveOutcome.Duplicate)
        {
            return DuplicateProblem();
        }

        return result.Adjustment ?? throw new InvalidOperationException("A successful create must return the saved adjustment.");
    }

    [HttpPut("{codeType}/{code}/{companyCode}")]
    public async Task<ActionResult<AdjustmentCodeDto>> Update(
        string codeType,
        string code,
        string companyCode,
        UpdateAdjustmentCodeRequest request,
        CancellationToken cancellationToken)
    {
        var values = PremiumAdjustmentInputRules.Normalise(codeType, code, companyCode, request);
        var errors = PremiumAdjustmentInputRules.Validate(values, validateKey: false);
        if (errors.Count > 0)
        {
            LogValidationFailure("Update", values, errors);
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        var result = await adjustments.UpdateAsync(values, cancellationToken);
        if (result.Outcome == PremiumAdjustmentSaveOutcome.NotFound)
        {
            return NotFoundProblem();
        }

        if (result.Outcome == PremiumAdjustmentSaveOutcome.Invalid)
        {
            var optionErrors = result.Errors ?? throw new InvalidOperationException("Invalid adjustment values must include field errors.");
            LogValidationFailure("Update", values, optionErrors);
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(optionErrors)));
        }

        return result.Adjustment ?? throw new InvalidOperationException("A successful update must return the saved adjustment.");
    }

    [HttpDelete("{codeType}/{code}/{companyCode}")]
    public async Task<IActionResult> Delete(
        string codeType,
        string code,
        string companyCode,
        CancellationToken cancellationToken)
    {
        var outcome = await adjustments.DeleteAsync(codeType, code, companyCode, cancellationToken);
        return outcome == PremiumAdjustmentDeleteOutcome.Deleted ? NoContent() : NotFoundProblem();
    }

    private void LogValidationFailure(
        string action,
        PremiumAdjustmentValues values,
        IReadOnlyDictionary<string, string[]> errors) =>
        logger.LogWarning(
            "{Action} failed (ValidationError): premium adjustment {CodeType}/{Code}/{CompanyCode} has invalid fields {Fields}",
            action,
            values.CodeType,
            values.Code,
            values.CompanyCode,
            string.Join(", ", errors.Keys));

    private ObjectResult DuplicateProblem() =>
        Conflict(new ValidationProblemDetails(
            new Dictionary<string, string[]>
            {
                ["code"] = ["This code type, code and company code combination already exists."]
            })
        {
            Status = StatusCodes.Status409Conflict,
            Title = "Duplicate premium adjustment"
        });

    private ObjectResult NotFoundProblem() =>
        Problem(
            statusCode: StatusCodes.Status404NotFound,
            title: "Premium adjustment not found",
            detail: "No premium adjustment exists with that code type, code and company code. It may have been deleted. Please refresh the list and try again.");
}
