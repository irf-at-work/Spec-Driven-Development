using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/claim-configuration-options")]
public sealed class ClaimConfigurationOptionsController(ClaimConfigurationOptionsService options) : ControllerBase
{
    [HttpGet("{field}")]
    public async Task<ActionResult<PaginatedResult<LookupChoiceDto>>> Get(
        string field,
        int page = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        if (!ClaimConfigurationOptionsService.IsSupportedField(field))
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Choice field is not available",
                Detail = "The requested field has no approved CCM choice mapping yet.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var errors = new Dictionary<string, string[]>();
        ColumnFilterQuery.ValidatePage(page, errors);
        ColumnFilterQuery.ValidatePageSize(pageSize, errors);
        if (errors.Count > 0)
        {
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        return await options.GetAsync(field, page, pageSize, cancellationToken);
    }
}
