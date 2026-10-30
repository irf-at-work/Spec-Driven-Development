using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SDD.API.Common;
using SDD.API.Contracts;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/companies")]
public sealed class CompanyController(CompanyService service) : ControllerBase
{
    [HttpGet]
    public async Task<Results<Ok<PaginatedResult<CompanyListItemDto>>, ValidationProblem>> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string sortBy = "companyName",
        [FromQuery] string sortDirection = "asc",
        [FromQuery] string? companyName = null,
        [FromQuery] string? shortName = null,
        [FromQuery] string? primaryAddress = null,
        [FromQuery] DateOnly? incorporationDate = null,
        [FromQuery] string? referenceNumber = null,
        [FromQuery] DateOnly? licenceIssueDate = null,
        [FromQuery] DateOnly? licenceExpiryDate = null,
        [FromQuery] string? companyInCharge = null,
        [FromQuery] string? phone = null,
        [FromQuery] string? email = null,
        [FromQuery] string? website = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return TypedResults.Ok(await service.ListAsync(new CompanyListQuery
            {
                Page = page,
                PageSize = pageSize,
                SortBy = sortBy,
                SortDirection = sortDirection,
                CompanyName = companyName,
                ShortName = shortName,
                PrimaryAddress = primaryAddress,
                IncorporationDate = incorporationDate,
                ReferenceNumber = referenceNumber,
                LicenceIssueDate = licenceIssueDate,
                LicenceExpiryDate = licenceExpiryDate,
                CompanyInCharge = companyInCharge,
                Phone = phone,
                Email = email,
                Website = website,
            }, cancellationToken));
        }
        catch (CompanyValidationException exception)
        {
            return TypedResults.ValidationProblem(exception.Errors.ToDictionary());
        }
    }

    [HttpGet("{companyCode}")]
    public async Task<Results<Ok<CompanyDto>, NotFound<ProblemDetails>>> Get(
        string companyCode,
        CancellationToken cancellationToken)
    {
        var company = await service.GetAsync(companyCode, cancellationToken);
        return company is null
            ? TypedResults.NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Company not found.",
                Detail = "No company exists with the requested company code.",
            })
            : TypedResults.Ok(company);
    }

    [HttpPost]
    public async Task<Results<Created<CompanyDto>, Conflict<ProblemDetails>, ValidationProblem>> Create(
        CreateCompanyRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var company = await service.CreateAsync(request, cancellationToken);
            return TypedResults.Created(
                $"/api/companies/{Uri.EscapeDataString(company.CompanyCode)}",
                company);
        }
        catch (CompanyValidationException exception)
        {
            return TypedResults.ValidationProblem(exception.Errors.ToDictionary());
        }
        catch (CompanyConflictException exception)
        {
            return ConflictProblem(exception.Message);
        }
    }

    [HttpPut("{companyCode}")]
    public async Task<Results<Ok<CompanyDto>, NotFound<ProblemDetails>, ValidationProblem>> Update(
        string companyCode,
        UpdateCompanyRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var company = await service.UpdateAsync(companyCode, request, cancellationToken);
            return company is null
                ? TypedResults.NotFound(new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "Company not found.",
                    Detail = "No company exists with the requested company code.",
                })
                : TypedResults.Ok(company);
        }
        catch (CompanyValidationException exception)
        {
            return TypedResults.ValidationProblem(exception.Errors.ToDictionary());
        }
    }

    [HttpDelete("{companyCode}")]
    public async Task<Results<NoContent, NotFound<ProblemDetails>, Conflict<ProblemDetails>>> Delete(
        string companyCode,
        CancellationToken cancellationToken)
    {
        try
        {
            return await service.DeleteAsync(companyCode, cancellationToken)
                ? TypedResults.NoContent()
                : TypedResults.NotFound(new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "Company not found.",
                    Detail = "No company exists with the requested company code.",
                });
        }
        catch (CompanyReferenceException exception)
        {
            return ConflictProblem(exception.Message);
        }
    }

    private static Conflict<ProblemDetails> ConflictProblem(string detail) =>
        TypedResults.Conflict(new ProblemDetails
        {
            Status = StatusCodes.Status409Conflict,
            Title = "The company could not be changed.",
            Detail = detail,
        });
}
