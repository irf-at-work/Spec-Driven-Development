using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SDD.API.Configuration;
using SDD.API.Contracts;
using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/claim-configurations")]
public sealed class ClaimConfigurationsController(
    ClaimConfigurationService configurations,
    IOptions<ClaimConfigurationOptions> companyOptions) : ControllerBase
{
    [HttpGet("{ccmCode}")]
    public async Task<ActionResult<ClaimConfigurationDto>> Get(string ccmCode, CancellationToken cancellationToken)
    {
        var result = await configurations.GetAsync(companyOptions.Value.CompanyCode, ccmCode, cancellationToken);
        if (result is null)
        {
            return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Claim configuration not found",
                detail: "No claim configuration exists with that CCM Code for the configured Company Code.");
        }

        return result;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<ClaimConfigurationListItemDto>>> List(
        int page = 1,
        string? companyCode = null,
        string? companyCodeOperator = null,
        string? ccmCode = null,
        string? ccmCodeOperator = null,
        string? name = null,
        string? nameOperator = null,
        string? shortName = null,
        string? shortNameOperator = null,
        bool? active = null,
        string? activeOperator = null,
        string? sortBy = null,
        string? sortDirection = null,
        int pageSize = ClaimConfigurationListQuery.PageSize,
        CancellationToken cancellationToken = default)
    {
        var filters = new ColumnFilters(
            new Dictionary<string, TextFilter>(StringComparer.OrdinalIgnoreCase)
            {
                ["companyCode"] = new TextFilter(companyCode, companyCodeOperator),
                ["ccmCode"] = new TextFilter(ccmCode, ccmCodeOperator),
                ["name"] = new TextFilter(name, nameOperator),
                ["shortName"] = new TextFilter(shortName, shortNameOperator)
            },
            new StatusFilter(active, activeOperator));

        var errors = ClaimConfigurationListQuery.Validate(page, filters, sortBy, sortDirection, pageSize);
        if (errors.Count > 0)
        {
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        return await configurations.ListAsync(page, filters, sortBy, sortDirection, pageSize, cancellationToken);
    }
}
