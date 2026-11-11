using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/claim-configurations")]
public sealed class ClaimConfigurationsController(IClaimConfigurationsService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<ClaimConfigurationSummary>>> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] ClaimConfigurationSortColumn? sortBy = null,
        [FromQuery] CodeSortDirection? sortDirection = null,
        [FromQuery] CodeFilterOperator? companyCodeOperator = null,
        [FromQuery] string? companyCodeValue = null,
        [FromQuery] CodeFilterOperator? ccmCodeOperator = null,
        [FromQuery] string? ccmCodeValue = null,
        [FromQuery] CodeFilterOperator? ccmNameOperator = null,
        [FromQuery] string? ccmNameValue = null,
        [FromQuery] CodeFilterOperator? shortNameOperator = null,
        [FromQuery] string? shortNameValue = null,
        [FromQuery] CodeFilterOperator? moduleNameOperator = null,
        [FromQuery] string? moduleNameValue = null,
        CancellationToken cancellationToken = default)
    {
        var errors = new Dictionary<string, string[]>();
        var filters = new List<ClaimConfigurationFilter>(5);
        AddFilter(errors, filters, "companyCode", ClaimConfigurationFilterColumn.CompanyCode, companyCodeOperator, companyCodeValue);
        AddFilter(errors, filters, "ccmCode", ClaimConfigurationFilterColumn.CcmCode, ccmCodeOperator, ccmCodeValue);
        AddFilter(errors, filters, "ccmName", ClaimConfigurationFilterColumn.CcmName, ccmNameOperator, ccmNameValue);
        AddFilter(errors, filters, "shortName", ClaimConfigurationFilterColumn.ShortName, shortNameOperator, shortNameValue);
        AddFilter(errors, filters, "moduleName", ClaimConfigurationFilterColumn.ModuleName, moduleNameOperator, moduleNameValue);

        if (page < 1)
        {
            errors[nameof(page)] = ["Page must be greater than zero."];
        }

        if (pageSize is not (10 or 15 or 20 or 50))
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

        if (errors.Count > 0)
        {
            return BadRequest(new ValidationProblemDetails(errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "One or more validation errors occurred."
            });
        }

        var result = await service.ListAsync(
            page,
            pageSize,
            filters,
            sortBy ?? ClaimConfigurationSortColumn.Code,
            sortDirection ?? CodeSortDirection.Ascending,
            cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ClaimConfigurationRecord>> Create(
        ClaimConfigurationWrite request,
        CancellationToken cancellationToken = default)
    {
        var record = await service.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Get), new { ccmCode = record.CcmCode }, record);
    }

    [HttpGet("{ccmCode}")]
    public async Task<ActionResult<ClaimConfigurationRecord>> Get(
        [FromRoute, Required] string ccmCode,
        CancellationToken cancellationToken = default)
    {
        var record = await service.GetAsync(ccmCode, cancellationToken);
        if (record is null)
        {
            throw MissingParent();
        }

        return Ok(record);
    }

    [HttpPut("{ccmCode}")]
    public async Task<ActionResult<ClaimConfigurationRecord>> Update(
        [FromRoute, Required] string ccmCode,
        ClaimConfigurationUpdate request,
        CancellationToken cancellationToken = default)
    {
        var record = await service.UpdateAsync(ccmCode, request, cancellationToken);
        if (record is null)
        {
            throw MissingParent();
        }

        return Ok(record);
    }

    [HttpDelete("{ccmCode}")]
    public async Task<IActionResult> Delete(
        [FromRoute, Required] string ccmCode,
        CancellationToken cancellationToken = default)
    {
        if (!await service.DeleteAsync(ccmCode, cancellationToken))
        {
            throw MissingParent();
        }

        return NoContent();
    }

    [HttpGet("lookups/{liType}")]
    public async Task<ActionResult<IReadOnlyList<ClaimConfigurationLookupOption>>> GetLookups(
        [FromRoute, Required] string liType,
        CancellationToken cancellationToken = default) =>
        Ok(await service.GetLookupsAsync(liType, cancellationToken));

    [HttpGet("{ccmCode}/products")]
    public async Task<ActionResult<IReadOnlyList<ApplicableProductSummary>>> GetProducts(
        [FromRoute, Required] string ccmCode,
        CancellationToken cancellationToken = default) =>
        Ok(await service.GetProductsAsync(ccmCode, cancellationToken));

    [HttpPost("{ccmCode}/products")]
    public async Task<ActionResult<ApplicableProductRecord>> CreateProduct(
        [FromRoute, Required] string ccmCode,
        ApplicableProductWrite request,
        CancellationToken cancellationToken = default)
    {
        var record = await service.CreateProductAsync(ccmCode, request, cancellationToken);
        return CreatedAtAction(
            nameof(GetProduct),
            new { ccmCode, productCode = record.ProductCode },
            record);
    }

    [HttpGet("{ccmCode}/products/{productCode}")]
    public async Task<ActionResult<ApplicableProductRecord>> GetProduct(
        [FromRoute, Required] string ccmCode,
        [FromRoute, Required] string productCode,
        CancellationToken cancellationToken = default)
    {
        var record = await service.GetProductAsync(ccmCode, productCode, cancellationToken);
        if (record is null)
        {
            throw MissingProduct();
        }

        return Ok(record);
    }

    [HttpPut("{ccmCode}/products/{productCode}")]
    public async Task<ActionResult<ApplicableProductRecord>> UpdateProduct(
        [FromRoute, Required] string ccmCode,
        [FromRoute, Required] string productCode,
        ApplicableProductUpdate request,
        CancellationToken cancellationToken = default)
    {
        var record = await service.UpdateProductAsync(ccmCode, productCode, request, cancellationToken);
        if (record is null)
        {
            throw MissingProduct();
        }

        return Ok(record);
    }

    [HttpDelete("{ccmCode}/products/{productCode}")]
    public async Task<IActionResult> DeleteProduct(
        [FromRoute, Required] string ccmCode,
        [FromRoute, Required] string productCode,
        CancellationToken cancellationToken = default)
    {
        if (!await service.DeleteProductAsync(ccmCode, productCode, cancellationToken))
        {
            throw MissingProduct();
        }

        return NoContent();
    }

    private static void AddFilter(
        IDictionary<string, string[]> errors,
        ICollection<ClaimConfigurationFilter> filters,
        string field,
        ClaimConfigurationFilterColumn column,
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

        filters.Add(new ClaimConfigurationFilter(column, filterOperator.Value, value));
    }

    private static CodesApiException MissingParent() =>
        new(
            StatusCodes.Status404NotFound,
            "The claim configuration could not be found.",
            "Refresh the listing and try again.");

    private static CodesApiException MissingProduct() =>
        new(
            StatusCodes.Status404NotFound,
            "The Applicable Product mapping could not be found.",
            "Refresh the claim configuration and try again.");
}