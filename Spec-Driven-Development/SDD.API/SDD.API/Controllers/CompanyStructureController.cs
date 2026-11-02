using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/companies/{companyCode}")]
public sealed class CompanyStructureController(CompanyStructureService service) : ControllerBase
{
    [HttpGet("divisions")]
    public async Task<Results<Ok<IReadOnlyList<DivisionDto>>, NotFound<ProblemDetails>>> GetDivisions(
        string companyCode,
        CancellationToken cancellationToken)
    {
        var divisions = await service.GetDivisionsAsync(companyCode, cancellationToken);
        return divisions is null
            ? NotFoundProblem()
            : TypedResults.Ok(divisions);
    }

    [HttpGet("departments")]
    public async Task<Results<Ok<IReadOnlyList<DepartmentDto>>, NotFound<ProblemDetails>, Conflict<ProblemDetails>>> GetDepartments(
        string companyCode,
        CancellationToken cancellationToken)
    {
        try
        {
            var departments = await service.GetDepartmentsAsync(companyCode, cancellationToken);
            return departments is null ? NotFoundProblem() : TypedResults.Ok(departments);
        }
        catch (CompanyConflictException exception)
        {
            return ConflictProblem(exception.Message);
        }
    }

    [HttpPost("divisions")]
    public async Task<Results<Created<IReadOnlyList<DivisionDto>>, NotFound<ProblemDetails>, Conflict<ProblemDetails>, ValidationProblem>> CreateDivisions(
        string companyCode,
        CreateDivisionsRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var divisions = await service.CreateDivisionsAsync(
                companyCode,
                request.Divisions,
                cancellationToken);
            return TypedResults.Created($"/api/companies/{Uri.EscapeDataString(companyCode)}/divisions", divisions);
        }
        catch (CompanyNotFoundException)
        {
            return NotFoundProblem();
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

    [HttpPut("divisions/{divisionCode}")]
    public async Task<Results<Ok<DivisionDto>, NotFound<ProblemDetails>, ValidationProblem>> UpdateDivision(
        string companyCode,
        string divisionCode,
        UpdateDivisionRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var division = await service.UpdateDivisionAsync(
                companyCode,
                divisionCode,
                request,
                cancellationToken);
            return division is null
                ? NotFoundProblem("Division not found.", "No division exists with the requested code in this company.")
                : TypedResults.Ok(division);
        }
        catch (CompanyValidationException exception)
        {
            return TypedResults.ValidationProblem(exception.Errors.ToDictionary());
        }
    }

    [HttpDelete("divisions/{divisionCode}")]
    public async Task<Results<NoContent, NotFound<ProblemDetails>, Conflict<ProblemDetails>>> DeleteDivision(
        string companyCode,
        string divisionCode,
        [FromQuery] string? destinationDivisionCode,
        CancellationToken cancellationToken)
    {
        try
        {
            return await service.DeleteDivisionAsync(
                    companyCode,
                    divisionCode,
                    destinationDivisionCode,
                    cancellationToken)
                ? TypedResults.NoContent()
                : NotFoundProblem("Division not found.", "No division exists with the requested code in this company.");
        }
        catch (CompanyConflictException exception)
        {
            return ConflictProblem(exception.Message);
        }
    }

    [HttpPost("departments")]
    public async Task<Results<Created<DepartmentDto>, NotFound<ProblemDetails>, Conflict<ProblemDetails>, ValidationProblem>> CreateDepartment(
        string companyCode,
        CreateDepartmentRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var department = await service.CreateDepartmentAsync(companyCode, request, cancellationToken);
            return TypedResults.Created(
                $"/api/companies/{Uri.EscapeDataString(companyCode)}/departments/{Uri.EscapeDataString(department.DepartmentCode)}",
                department);
        }
        catch (CompanyNotFoundException)
        {
            return NotFoundProblem();
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

    [HttpPost("divisions/{divisionCode}/departments")]
    public async Task<Results<Ok<IReadOnlyList<DepartmentDto>>, NotFound<ProblemDetails>, Conflict<ProblemDetails>, ValidationProblem>> LinkExistingDepartments(
        string companyCode,
        string divisionCode,
        LinkDepartmentsRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            return TypedResults.Ok(await service.LinkExistingDepartmentsAsync(
                companyCode,
                divisionCode,
                request.DepartmentCodes,
                cancellationToken));
        }
        catch (CompanyNotFoundException)
        {
            return NotFoundProblem();
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

    [HttpDelete("divisions/{divisionCode}/departments/{departmentCode}")]
    public async Task<Results<NoContent, NotFound<ProblemDetails>, Conflict<ProblemDetails>>> RemoveDepartmentAssignment(
        string companyCode,
        string divisionCode,
        string departmentCode,
        CancellationToken cancellationToken)
    {
        try
        {
            return await service.RemoveDepartmentAssignmentAsync(
                companyCode,
                divisionCode,
                departmentCode,
                cancellationToken)
                ? TypedResults.NoContent()
                : NotFoundProblem("Assignment not found.", "The department is not assigned to this division.");
        }
        catch (CompanyConflictException exception)
        {
            return ConflictProblem(exception.Message);
        }
    }

    private static NotFound<ProblemDetails> NotFoundProblem(
        string title = "Company not found.",
        string detail = "No company exists with the requested company code.") =>
        TypedResults.NotFound(new ProblemDetails
        {
            Status = StatusCodes.Status404NotFound,
            Title = title,
            Detail = detail,
        });

    private static Conflict<ProblemDetails> ConflictProblem(string detail) =>
        TypedResults.Conflict(new ProblemDetails
        {
            Status = StatusCodes.Status409Conflict,
            Title = "The company structure could not be changed.",
            Detail = detail,
        });
}
