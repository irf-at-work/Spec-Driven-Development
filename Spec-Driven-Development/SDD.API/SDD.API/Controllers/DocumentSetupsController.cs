using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/document-setups")]
public sealed class DocumentSetupsController(IDocumentSetupsService documentSetupsService) : ControllerBase
{
    private static readonly int[] AllowedPageSizes = [10, 15, 20, 50];

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<DocumentSetupSummary>>> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] DocumentSetupSortColumn? sortBy = null,
        [FromQuery] CodeSortDirection? sortDirection = null,
        [FromQuery] CodeFilterOperator? docCodeOperator = null,
        [FromQuery] string? docCodeValue = null,
        [FromQuery] CodeFilterOperator? docNameOperator = null,
        [FromQuery] string? docNameValue = null,
        [FromQuery] CodeFilterOperator? docDescriptionOperator = null,
        [FromQuery] string? docDescriptionValue = null,
        [FromQuery] CodeFilterOperator? setupForOperator = null,
        [FromQuery] string? setupForValue = null,
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

        var filters = new List<DocumentSetupFilter>(4);
        AddFilter(errors, filters, "docCode", DocumentSetupFilterColumn.DocCode, docCodeOperator, docCodeValue);
        AddFilter(errors, filters, "docName", DocumentSetupFilterColumn.DocName, docNameOperator, docNameValue);
        AddFilter(
            errors,
            filters,
            "docDescription",
            DocumentSetupFilterColumn.DocDescription,
            docDescriptionOperator,
            docDescriptionValue);
        AddFilter(errors, filters, "setupFor", DocumentSetupFilterColumn.SetupFor, setupForOperator, setupForValue);

        if (errors.Count > 0)
        {
            return BadRequest(new ValidationProblemDetails(errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "One or more validation errors occurred."
            });
        }

        return Ok(await documentSetupsService.ListAsync(
            page,
            pageSize,
            filters,
            sortBy ?? DocumentSetupSortColumn.DocCode,
            sortDirection ?? CodeSortDirection.Ascending,
            cancellationToken));
    }

    [HttpPost]
    public async Task<ActionResult<DocumentSetupRecord>> Create(
        DocumentSetupWriteRequest request,
        CancellationToken cancellationToken = default)
    {
        var record = await documentSetupsService.CreateAsync(request, cancellationToken);
        return Created($"/api/document-setups/{Uri.EscapeDataString(record.DocCode)}", record);
    }

    [HttpGet("{docCode}")]
    public async Task<ActionResult<DocumentSetupRecord>> Get(
        string docCode,
        CancellationToken cancellationToken = default)
    {
        var record = await documentSetupsService.GetAsync(docCode, cancellationToken);
        return record is null
            ? NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "The document setup was not found.",
                Detail = "Check the Doc Code and try again.",
            })
            : Ok(record);
    }

    [HttpPut("{docCode}")]
    public async Task<ActionResult<DocumentSetupRecord>> Update(
        string docCode,
        DocumentSetupUpdateRequest request,
        CancellationToken cancellationToken = default)
    {
        var record = await documentSetupsService.UpdateAsync(docCode, request, cancellationToken);
        return record is null
            ? NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "The document setup was not found.",
                Detail = "Reload the listing and try again.",
            })
            : Ok(record);
    }

    [HttpDelete("{docCode}")]
    public async Task<IActionResult> Delete(
        string docCode,
        [FromQuery] string? expectedVersion,
        CancellationToken cancellationToken = default)
    {
        var deleted = await documentSetupsService.DeleteAsync(
            docCode,
            expectedVersion ?? string.Empty,
            cancellationToken);
        return deleted
            ? NoContent()
            : NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "The document setup was not found.",
                Detail = "Reload the listing and try again.",
            });
    }

    private static void AddFilter(
        IDictionary<string, string[]> errors,
        ICollection<DocumentSetupFilter> filters,
        string field,
        DocumentSetupFilterColumn column,
        CodeFilterOperator? filterOperator,
        string? value)
    {
        if (filterOperator is null && value is null)
        {
            return;
        }

        if (filterOperator is null ||
            !Enum.IsDefined(filterOperator.Value) ||
            string.IsNullOrWhiteSpace(value))
        {
            errors[$"{field}Value"] = ["Choose a filter operator and enter a filter value."];
            return;
        }

        filters.Add(new DocumentSetupFilter(column, filterOperator.Value, value));
    }
}
