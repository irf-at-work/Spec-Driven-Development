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

        if (errors.Count > 0)
        {
            return BadRequest(new ValidationProblemDetails(errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "One or more validation errors occurred."
            });
        }

        var result = await codesService.ListAsync(page, pageSize, cancellationToken);
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
}
