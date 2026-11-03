using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/document-setups/{docCode}/applicable-modules")]
public sealed class ApplicableModulesController(IApplicableModulesService applicableModulesService) : ControllerBase
{
    private static readonly int[] AllowedPageSizes = [10, 15, 20, 50];

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<ApplicableModuleSummary>>> List(
        string docCode,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] ApplicableModuleSortColumn? sortBy = null,
        [FromQuery] CodeSortDirection? sortDirection = null,
        [FromQuery] CodeFilterOperator? applicableForOperator = null,
        [FromQuery] string? applicableForValue = null,
        [FromQuery] CodeFilterOperator? productFromOperator = null,
        [FromQuery] string? productFromValue = null,
        [FromQuery] CodeFilterOperator? productToOperator = null,
        [FromQuery] string? productToValue = null,
        [FromQuery] CodeFilterOperator? pcmFromOperator = null,
        [FromQuery] string? pcmFromValue = null,
        [FromQuery] CodeFilterOperator? pcmToOperator = null,
        [FromQuery] string? pcmToValue = null,
        [FromQuery] CodeFilterOperator? ccmFromOperator = null,
        [FromQuery] string? ccmFromValue = null,
        [FromQuery] CodeFilterOperator? ccmToOperator = null,
        [FromQuery] string? ccmToValue = null,
        [FromQuery] CodeFilterOperator? mandatoryYnOperator = null,
        [FromQuery] string? mandatoryYnValue = null,
        [FromQuery] CodeFilterOperator? activeYnOperator = null,
        [FromQuery] string? activeYnValue = null,
        CancellationToken cancellationToken = default)
    {
        var errors = new Dictionary<string, string[]>();
        if (page < 1)
        {
            errors[nameof(page)] = ["Page must be greater than zero."];
        }

        if (!AllowedPageSizes.Contains(pageSize))
        {
            errors[nameof(pageSize)] = ["Choose a page size of 10, 15, 20, or 50."];
        }

        if (sortBy is not null && !Enum.IsDefined(sortBy.Value))
        {
            errors[nameof(sortBy)] = ["Choose a supported sort column."];
        }

        if (sortDirection is not null && !Enum.IsDefined(sortDirection.Value))
        {
            errors[nameof(sortDirection)] = ["Choose a supported sort direction."];
        }

        var filters = new List<ApplicableModuleFilter>(9);
        AddFilter(errors, filters, "applicableFor", ApplicableModuleFilterColumn.ApplicableFor, applicableForOperator, applicableForValue);
        AddFilter(errors, filters, "productFrom", ApplicableModuleFilterColumn.ProductFrom, productFromOperator, productFromValue);
        AddFilter(errors, filters, "productTo", ApplicableModuleFilterColumn.ProductTo, productToOperator, productToValue);
        AddFilter(errors, filters, "pcmFrom", ApplicableModuleFilterColumn.PcmFrom, pcmFromOperator, pcmFromValue);
        AddFilter(errors, filters, "pcmTo", ApplicableModuleFilterColumn.PcmTo, pcmToOperator, pcmToValue);
        AddFilter(errors, filters, "ccmFrom", ApplicableModuleFilterColumn.CcmFrom, ccmFromOperator, ccmFromValue);
        AddFilter(errors, filters, "ccmTo", ApplicableModuleFilterColumn.CcmTo, ccmToOperator, ccmToValue);
        AddFilter(errors, filters, "mandatoryYn", ApplicableModuleFilterColumn.MandatoryYn, mandatoryYnOperator, mandatoryYnValue);
        AddFilter(errors, filters, "activeYn", ApplicableModuleFilterColumn.ActiveYn, activeYnOperator, activeYnValue);

        if (errors.Count > 0)
        {
            return BadRequest(new ValidationProblemDetails(errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "One or more validation errors occurred.",
            });
        }

        return Ok(await applicableModulesService.ListAsync(
            docCode,
            page,
            pageSize,
            filters,
            sortBy ?? ApplicableModuleSortColumn.ApplicableFor,
            sortDirection ?? CodeSortDirection.Ascending,
            cancellationToken));
    }

    private static void AddFilter(
        IDictionary<string, string[]> errors,
        ICollection<ApplicableModuleFilter> filters,
        string parameterName,
        ApplicableModuleFilterColumn column,
        CodeFilterOperator? filterOperator,
        string? value)
    {
        if (filterOperator is null && value is null)
        {
            return;
        }

        if (filterOperator is null || !Enum.IsDefined(filterOperator.Value) || string.IsNullOrWhiteSpace(value))
        {
            errors[$"{parameterName}Value"] = ["Choose a filter operator and enter a filter value."];
            return;
        }

        filters.Add(new ApplicableModuleFilter(column, filterOperator.Value, value));
    }

    [HttpGet("{damodUid}")]
    public async Task<ActionResult<ApplicableModuleRecord>> Get(
        string docCode,
        string damodUid,
        CancellationToken cancellationToken = default)
    {
        if (!TryParseId(damodUid, out var parsedId))
        {
            return InvalidId();
        }

        var record = await applicableModulesService.GetAsync(docCode, parsedId, cancellationToken);
        return record is null
            ? NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "The Applicable Module was not found.",
                Detail = "Check the document setup and Applicable Module ID, then try again.",
            })
            : Ok(record);
    }

    [HttpPost]
    public async Task<ActionResult<ApplicableModuleRecord>> Create(
        string docCode,
        ApplicableModuleWriteRequest request,
        CancellationToken cancellationToken = default)
    {
        var record = await applicableModulesService.CreateAsync(docCode, request, cancellationToken);
        var location =
            $"/api/document-setups/{Uri.EscapeDataString(docCode)}/applicable-modules/{Uri.EscapeDataString(record.DamodUid)}";
        return Created(location, record);
    }

    [HttpPut("{damodUid}")]
    public async Task<ActionResult<ApplicableModuleRecord>> Update(
        string docCode,
        string damodUid,
        ApplicableModuleUpdateRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!TryParseId(damodUid, out var parsedId))
        {
            return InvalidId();
        }

        var record = await applicableModulesService.UpdateAsync(
            docCode,
            parsedId,
            request,
            cancellationToken);
        return record is null
            ? NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "The Applicable Module was not found.",
                Detail = "Reload the document setup and try again.",
            })
            : Ok(record);
    }

    [HttpDelete("{damodUid}")]
    public async Task<IActionResult> Delete(
        string docCode,
        string damodUid,
        [FromQuery] string? expectedVersion,
        CancellationToken cancellationToken = default)
    {
        if (!TryParseId(damodUid, out var parsedId))
        {
            return InvalidId();
        }

        if (string.IsNullOrWhiteSpace(expectedVersion))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "The expected version is required.",
                Detail = "Reload the Applicable Module and try again.",
            });
        }

        return await applicableModulesService.DeleteAsync(
            docCode,
            parsedId,
            expectedVersion,
            cancellationToken)
            ? NoContent()
            : NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "The Applicable Module was not found.",
                Detail = "Reload the document setup and try again.",
            });
    }

    private BadRequestObjectResult InvalidId() =>
        BadRequest(new ValidationProblemDetails(new Dictionary<string, string[]>
        {
            ["damodUid"] = ["The Applicable Module ID must be a decimal number."],
        })
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "One or more validation errors occurred.",
        });

    private static bool TryParseId(string value, out decimal parsedId) =>
        decimal.TryParse(
            value,
            NumberStyles.AllowDecimalPoint,
            CultureInfo.InvariantCulture,
            out parsedId);
}
