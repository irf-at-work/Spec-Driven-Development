using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SDD.API.Common;
using SDD.API.Contracts;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/list-items")]
public sealed class ListItemController(ListItemService service) : ControllerBase
{
    [HttpGet]
    public async Task<Results<Ok<PaginatedResult<ListItemListItemDto>>, ValidationProblem>> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string sortBy = "liType",
        [FromQuery] string sortDirection = "asc",
        [FromQuery] string? liType = null,
        [FromQuery] ListItemFilterOperator? liTypeOperator = null,
        [FromQuery] string? liCode = null,
        [FromQuery] ListItemFilterOperator? liCodeOperator = null,
        [FromQuery] string? description = null,
        [FromQuery] ListItemFilterOperator? descriptionOperator = null,
        [FromQuery] string? shortDescription = null,
        [FromQuery] ListItemFilterOperator? shortDescriptionOperator = null,
        [FromQuery] string? value = null,
        [FromQuery] ListItemFilterOperator? valueOperator = null,
        [FromQuery] string? activeYn = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return TypedResults.Ok(await service.ListAsync(new ListItemListQuery
            {
                Page = page,
                PageSize = pageSize,
                SortBy = sortBy,
                SortDirection = sortDirection,
                LiType = liType,
                LiTypeOperator = liTypeOperator,
                LiCode = liCode,
                LiCodeOperator = liCodeOperator,
                Description = description,
                DescriptionOperator = descriptionOperator,
                ShortDescription = shortDescription,
                ShortDescriptionOperator = shortDescriptionOperator,
                Value = value,
                ValueOperator = valueOperator,
                ActiveYn = activeYn,
            }, cancellationToken));
        }
        catch (ListItemValidationException exception)
        {
            return TypedResults.ValidationProblem(exception.Errors.ToDictionary());
        }
    }

    [HttpGet("{liType}/{liCode}")]
    public async Task<Results<Ok<ListItemDto>, NotFound<ProblemDetails>>> Get(
        string liType,
        string liCode,
        CancellationToken cancellationToken)
    {
        var item = await service.GetAsync(liType, liCode, cancellationToken);
        return item is null
            ? TypedResults.NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "List item not found.",
                Detail = "No list item exists with the requested type and code.",
            })
            : TypedResults.Ok(item);
    }

    [HttpPost]
    public async Task<Results<Created<ListItemDto>, Conflict<ProblemDetails>, ValidationProblem>> Create(
        CreateListItemRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var item = await service.CreateAsync(request, cancellationToken);
            return TypedResults.Created(
                $"/api/list-items/{Uri.EscapeDataString(item.LiType)}/{Uri.EscapeDataString(item.LiCode)}",
                item);
        }
        catch (ListItemValidationException exception)
        {
            return TypedResults.ValidationProblem(exception.Errors.ToDictionary());
        }
        catch (ListItemConflictException exception)
        {
            return ConflictProblem(exception.Message);
        }
    }

    [HttpPut("{liType}/{liCode}")]
    public async Task<Results<Ok<ListItemDto>, NotFound<ProblemDetails>, ValidationProblem>> Update(
        string liType,
        string liCode,
        UpdateListItemRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var item = await service.UpdateAsync(liType, liCode, request, cancellationToken);
            return item is null
                ? TypedResults.NotFound(new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "List item not found.",
                    Detail = "No list item exists with the requested type and code.",
                })
                : TypedResults.Ok(item);
        }
        catch (ListItemValidationException exception)
        {
            return TypedResults.ValidationProblem(exception.Errors.ToDictionary());
        }
    }

    [HttpDelete("{liType}/{liCode}")]
    public async Task<Results<NoContent, NotFound<ProblemDetails>, Conflict<ProblemDetails>>> Delete(
        string liType,
        string liCode,
        CancellationToken cancellationToken)
    {
        try
        {
            return await service.DeleteAsync(liType, liCode, cancellationToken)
                ? TypedResults.NoContent()
                : TypedResults.NotFound(new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "List item not found.",
                    Detail = "No list item exists with the requested type and code.",
                });
        }
        catch (ListItemReferenceException exception)
        {
            return ConflictProblem(exception.Message);
        }
    }

    private static Conflict<ProblemDetails> ConflictProblem(string detail) =>
        TypedResults.Conflict(new ProblemDetails
        {
            Status = StatusCodes.Status409Conflict,
            Title = "The list item could not be changed.",
            Detail = detail,
        });
}
