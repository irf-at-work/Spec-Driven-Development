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
    [HttpGet("write-status")]
    public ActionResult<ClaimConfigurationWriteStatusDto> WriteStatus()
    {
        var enabled = companyOptions.Value.WritesEnabled;
        return new ClaimConfigurationWriteStatusDto(
            enabled,
            enabled
                ? "CCM writes are enabled."
                : "Apply and verify the global CCM_CODE unique index, then enable ClaimConfiguration:WritesEnabled.",
            companyOptions.Value.CompanyCode);
    }

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
        string? ccmCode = null,
        string? ccmCodeOperator = null,
        string? name = null,
        string? nameOperator = null,
        string? shortName = null,
        string? shortNameOperator = null,
        string? module = null,
        string? moduleOperator = null,
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
                ["ccmCode"] = new TextFilter(ccmCode, ccmCodeOperator),
                ["name"] = new TextFilter(name, nameOperator),
                ["shortName"] = new TextFilter(shortName, shortNameOperator),
                ["module"] = new TextFilter(module, moduleOperator)
            },
            new StatusFilter(active, activeOperator));

        var errors = ClaimConfigurationListQuery.Validate(page, filters, sortBy, sortDirection, pageSize);
        if (errors.Count > 0)
        {
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        return await configurations.ListAsync(page, filters, sortBy, sortDirection, pageSize, cancellationToken);
    }

    [HttpPost]
    public async Task<ActionResult<ClaimConfigurationDto>> Create(
        CreateClaimConfigurationRequest request,
        CancellationToken cancellationToken)
    {
        if (!companyOptions.Value.WritesEnabled)
        {
            return WritesDisabledProblem();
        }

        var values = ClaimConfigurationInputRules.Normalise(request);
        var errors = new Dictionary<string, string[]>(ClaimConfigurationInputRules.Validate(values));
        if (errors.Count > 0)
        {
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        var result = await configurations.CreateAsync(companyOptions.Value.CompanyCode, values, cancellationToken);
        if (result.Outcome == ClaimConfigurationSaveOutcome.Invalid)
        {
            return ValidationProblem(new ValidationProblemDetails(
                new Dictionary<string, string[]>(result.Errors ?? new Dictionary<string, string[]>())));
        }

        if (result.Outcome == ClaimConfigurationSaveOutcome.Duplicate)
        {
            return DuplicateProblem();
        }

        var saved = result.Configuration ?? throw new InvalidOperationException("A saved CCM must have a response record.");
        return Ok(saved);
    }

    [HttpPut("{ccmCode}")]
    public async Task<ActionResult<ClaimConfigurationDto>> Update(
        string ccmCode,
        UpdateClaimConfigurationRequest request,
        CancellationToken cancellationToken)
    {
        if (!companyOptions.Value.WritesEnabled)
        {
            return WritesDisabledProblem();
        }

        var values = ClaimConfigurationInputRules.Normalise(request, ccmCode);
        var errors = new Dictionary<string, string[]>(ClaimConfigurationInputRules.Validate(values));
        if (errors.Count > 0)
        {
            errors.Remove("ccmCode");
            if (errors.Count > 0)
            {
                return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
            }
        }

        var result = await configurations.UpdateAsync(
            companyOptions.Value.CompanyCode,
            ccmCode,
            values,
            cancellationToken);
        if (result.Outcome == ClaimConfigurationSaveOutcome.NotFound)
        {
            return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Claim configuration not found",
                detail: "No claim configuration exists with that CCM Code for the configured Company Code.");
        }

        if (result.Outcome == ClaimConfigurationSaveOutcome.Invalid)
        {
            return ValidationProblem(new ValidationProblemDetails(
                new Dictionary<string, string[]>(result.Errors ?? new Dictionary<string, string[]>())));
        }

        if (result.Outcome == ClaimConfigurationSaveOutcome.Duplicate)
        {
            return DuplicateProblem();
        }

        return result.Configuration ?? throw new InvalidOperationException("A saved CCM must have a response record.");
    }

    [HttpDelete("{ccmCode}")]
    public async Task<IActionResult> Delete(string ccmCode, CancellationToken cancellationToken)
    {
        if (!companyOptions.Value.WritesEnabled)
        {
            return WritesDisabledProblem();
        }

        var result = await configurations.DeleteAsync(
            companyOptions.Value.CompanyCode,
            ccmCode,
            cancellationToken);
        return result.Outcome switch
        {
            ClaimConfigurationDeleteOutcome.Deleted => NoContent(),
            ClaimConfigurationDeleteOutcome.NotFound => Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Claim configuration not found",
                detail: "No claim configuration exists with that CCM Code for the configured Company Code."),
            ClaimConfigurationDeleteOutcome.HasProductLinks => Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Claim configuration has linked products",
                Detail = "Remove the CCM's product links before deleting the claim configuration. No product links were changed."
            }),
            _ => throw new InvalidOperationException("Unexpected CCM delete outcome.")
        };
    }

    private ObjectResult WritesDisabledProblem() => Problem(
        statusCode: StatusCodes.Status503ServiceUnavailable,
        title: "Claim configuration writes are disabled",
        detail: "Apply and verify the global CCM_CODE unique index before enabling ClaimConfiguration:WritesEnabled.");

    private ObjectResult DuplicateProblem() => Conflict(new ValidationProblemDetails(
        new Dictionary<string, string[]>
        {
            ["ccmCode"] = ["This CCM Code already exists. CCM Codes must be globally unique."]
        })
    {
        Status = StatusCodes.Status409Conflict,
        Title = "Duplicate CCM Code"
    });
}
