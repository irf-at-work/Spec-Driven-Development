using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using SDD.API.Contracts;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/codes")]
public sealed class CodesController(ICodesService codesService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<CodeRecordResponse>>> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] CodeSortColumn? sortBy = null,
        [FromQuery] CodeSortDirection? sortDirection = null,
        [FromQuery] CodeFilterOperator? codeOperator = null,
        [FromQuery] string? codeValue = null,
        [FromQuery] CodeFilterOperator? codeDescriptionOperator = null,
        [FromQuery] string? codeDescriptionValue = null,
        [FromQuery] CodeFilterOperator? codeTypeOperator = null,
        [FromQuery] string? codeTypeValue = null,
        [FromQuery] CodeFilterOperator? value1Operator = null,
        [FromQuery] string? value1Value = null,
        [FromQuery] CodeFilterOperator? value2Operator = null,
        [FromQuery] string? value2Value = null,
        CancellationToken cancellationToken = default)
    {
        var errors = new Dictionary<string, string[]>();
        if (page < 1)
        {
            errors[nameof(page)] = ["Page must be greater than zero."];
        }

        if (pageSize < 1)
        {
            errors[nameof(pageSize)] = ["Page size must be greater than zero."];
        }

        if (sortBy is not null && !Enum.IsDefined(sortBy.Value))
        {
            errors[nameof(sortBy)] = ["Choose a supported sort column."];
        }

        if (sortDirection is not null && !Enum.IsDefined(sortDirection.Value))
        {
            errors[nameof(sortDirection)] = ["Choose a supported sort direction."];
        }

        var filters = new List<CodeColumnFilter>(5);
        AddFilter(errors, filters, "code", CodeFilterColumn.Code, codeOperator, codeValue);
        AddFilter(
            errors,
            filters,
            "codeDescription",
            CodeFilterColumn.CodeDescription,
            codeDescriptionOperator,
            codeDescriptionValue);
        AddFilter(errors, filters, "codeType", CodeFilterColumn.CodeType, codeTypeOperator, codeTypeValue);
        AddFilter(errors, filters, "value1", CodeFilterColumn.Value1, value1Operator, value1Value);
        AddFilter(errors, filters, "value2", CodeFilterColumn.Value2, value2Operator, value2Value);

        if (errors.Count > 0)
        {
            return BadRequest(new ValidationProblemDetails(errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "One or more validation errors occurred."
            });
        }

        var result = await codesService.ListAsync(
            page,
            pageSize,
            filters,
            sortBy ?? CodeSortColumn.Code,
            sortDirection ?? CodeSortDirection.Ascending,
            cancellationToken);
        return Ok(result);
    }

    [HttpGet("record")]
    public async Task<ActionResult<CodeRecordResponse>> Get(
        [FromQuery, Required] string code,
        [FromQuery, Required] string codeType,
        CancellationToken cancellationToken = default)
    {
        var record = await codesService.GetAsync(code, codeType, cancellationToken);
        if (record is null)
        {
            throw MissingRecord();
        }

        return Ok(record);
    }

    [HttpPost]
    public async Task<ActionResult<CodeRecordResponse>> Create(
        CodeWriteRequest request,
        CancellationToken cancellationToken = default)
    {
        var record = await codesService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(
            nameof(Get),
            new { code = record.Code, codeType = record.CodeType },
            record);
    }

    [HttpPut("record")]
    public async Task<ActionResult<CodeRecordResponse>> Update(
        [FromQuery, Required] string code,
        [FromQuery, Required] string codeType,
        CodeWriteRequest request,
        CancellationToken cancellationToken = default)
    {
        var record = await codesService.UpdateAsync(code, codeType, request, cancellationToken);
        if (record is null)
        {
            throw MissingRecord();
        }

        return Ok(record);
    }

    [HttpDelete("record")]
    public async Task<IActionResult> Delete(
        [FromQuery, Required] string code,
        [FromQuery, Required] string codeType,
        CancellationToken cancellationToken = default)
    {
        var deleted = await codesService.DeleteAsync(code, codeType, cancellationToken);
        if (!deleted)
        {
            throw MissingRecord();
        }

        return NoContent();
    }

    private static CodesApiException MissingRecord() =>
        new(
            StatusCodes.Status404NotFound,
            "The code could not be found.",
            "Refresh the listing and try again.");

    private static void AddFilter(
        IDictionary<string, string[]> errors,
        ICollection<CodeColumnFilter> filters,
        string field,
        CodeFilterColumn column,
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

        filters.Add(new CodeColumnFilter(column, filterOperator.Value, value));
    }
}
