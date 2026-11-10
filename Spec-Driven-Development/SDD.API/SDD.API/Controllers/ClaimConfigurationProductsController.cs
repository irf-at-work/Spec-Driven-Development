using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ClaimConfigurationProductsController(ClaimConfigurationProductService products) : ControllerBase
{
    [HttpGet("{productCode}/claim-configurations")]
    public async Task<ActionResult<PaginatedResult<ClaimConfigurationListItemDto>>> GetClaimConfigurations(
        string productCode,
        int page = 1,
        int pageSize = ClaimConfigurationListQuery.PageSize,
        CancellationToken cancellationToken = default)
    {
        var errors = new Dictionary<string, string[]>();
        ColumnFilterQuery.ValidatePage(page, errors);
        ColumnFilterQuery.ValidatePageSize(pageSize, errors);
        if (errors.Count > 0)
        {
            return ValidationProblem(new ValidationProblemDetails(errors));
        }

        return await products.GetForProductAsync(productCode, page, pageSize, cancellationToken);
    }
}
