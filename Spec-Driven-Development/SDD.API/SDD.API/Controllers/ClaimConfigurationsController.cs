using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SDD.API.Configuration;
using SDD.API.Contracts;
using SDD.API.DTOs;
using SDD.API.Services;
using SDD.API.Infrastructure;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/claim-configurations")]
public sealed class ClaimConfigurationsController(
    ClaimConfigurationService configurations,
    ClaimConfigurationProductService products,
    IOptions<ClaimConfigurationOptions> companyOptions) : ControllerBase
{
    [HttpGet("available-products")]
    public async Task<ActionResult<PaginatedResult<AvailableProductDto>>> AvailableProducts(
        int page = 1,
        int pageSize = ClaimConfigurationListQuery.PageSize,
        CancellationToken cancellationToken = default)
    {
        if (!ValidateProductPage(page, pageSize, out var errors))
        {
            return ValidationProblem(new ValidationProblemDetails(errors));
        }

        return await products.GetAvailableAsync(page, pageSize, cancellationToken);
    }

    [HttpGet("{ccmCode}/products")]
    public async Task<ActionResult<PaginatedResult<AssociatedProductDto>>> ProductsForCcm(
        string ccmCode,
        int page = 1,
        int pageSize = ClaimConfigurationListQuery.PageSize,
        CancellationToken cancellationToken = default)
    {
        if (!ValidateProductPage(page, pageSize, out var errors, allowFiveRowPage: true))
        {
            return ValidationProblem(new ValidationProblemDetails(errors));
        }

        var configuration = await configurations.GetAsync(
            companyOptions.Value.CompanyCode,
            ccmCode,
            cancellationToken);
        if (configuration is null)
        {
            return Problem(statusCode: StatusCodes.Status404NotFound, title: "Claim configuration not found");
        }

        return await products.GetAssociatedAsync(ccmCode, page, pageSize, cancellationToken);
    }

    [HttpPost("{ccmCode}/products")]
    public async Task<IActionResult> AddProduct(
        string ccmCode,
        AddClaimConfigurationProductRequest request,
        CancellationToken cancellationToken)
    {
        if (!companyOptions.Value.WritesEnabled) return WritesDisabledProblem();
        if (string.IsNullOrWhiteSpace(request.ProductCode))
        {
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>
            {
                ["productCode"] = ["Product Code is required."]
            }));
        }

        var result = await products.AddAsync(
            companyOptions.Value.CompanyCode,
            ccmCode,
            request.ProductCode,
            cancellationToken);
        return result.Outcome switch
        {
            ProductAssociationOutcome.Added => NoContent(),
            ProductAssociationOutcome.NotFound => Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Claim configuration not found"),
            ProductAssociationOutcome.Duplicate => Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Product already linked",
                Detail = "This product is already linked to the claim configuration."
            }),
            ProductAssociationOutcome.ChoiceUnavailable => ValidationProblem(new ValidationProblemDetails(
                new Dictionary<string, string[]> { ["productCode"] = ["Choose an active product from the available list."] })),
            _ => throw new InvalidOperationException("Unexpected product association outcome.")
        };
    }

    [HttpDelete("{ccmCode}/products/{productCode}")]
    public async Task<IActionResult> DeleteProduct(
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken)
    {
        if (!companyOptions.Value.WritesEnabled) return WritesDisabledProblem();
        var result = await products.DeleteAsync(ccmCode, productCode, cancellationToken);
        return result.Outcome == ProductAssociationOutcome.Deleted
            ? NoContent()
            : Problem(statusCode: StatusCodes.Status404NotFound, title: "Product association not found");
    }

    [HttpGet("write-status")]
    public ActionResult<ClaimConfigurationWriteStatusDto> WriteStatus()
    {
        var enabled = companyOptions.Value.WritesEnabled;
        return new ClaimConfigurationWriteStatusDto(
            enabled,
            enabled
                ? "CCM writes are enabled."
                : "The global CCM_CODE unique index is verified. Enable ClaimConfiguration:WritesEnabled when ready to allow writes.",
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
        detail: "The global CCM_CODE unique index is verified. Enable ClaimConfiguration:WritesEnabled when ready to allow writes.");

    private ObjectResult DuplicateProblem() => Conflict(new ValidationProblemDetails(
        new Dictionary<string, string[]>
        {
            ["ccmCode"] = ["This CCM Code already exists. CCM Codes must be globally unique."]
        })
    {
        Status = StatusCodes.Status409Conflict,
        Title = "Duplicate CCM Code"
    });

    private static bool ValidateProductPage(
        int page,
        int pageSize,
        out Dictionary<string, string[]> errors,
        bool allowFiveRowPage = false)
    {
        errors = new Dictionary<string, string[]>();
        ColumnFilterQuery.ValidatePage(page, errors);
        if (!allowFiveRowPage || pageSize != 5)
        {
            ColumnFilterQuery.ValidatePageSize(pageSize, errors);
        }
        return errors.Count == 0;
    }
}
