using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/vehicle-makes")]
public class VehicleMakesController(
    VehicleMakeService vehicleMakes,
    ILogger<VehicleMakesController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<VehicleMakeListItemDto>>> List(
        int page = 1,
        string? search = null,
        string? sortBy = null,
        string? sortDirection = null,
        CancellationToken cancellationToken = default)
    {
        var errors = VehicleMakeListQuery.Validate(page, sortBy, sortDirection);
        if (errors.Count > 0)
        {
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        return await vehicleMakes.ListAsync(page, search, sortBy, sortDirection, cancellationToken);
    }

    [HttpGet("{makeCode}")]
    public async Task<ActionResult<VehicleMakeDto>> Get(string makeCode, CancellationToken cancellationToken)
    {
        var vehicleMake = await vehicleMakes.GetAsync(makeCode, cancellationToken);
        if (vehicleMake is null)
        {
            return NotFoundProblem();
        }

        return vehicleMake;
    }

    // Answers 200 with the saved make rather than 201 Created: the return type can only describe a 200 response
    // (constitution B8 forbids response attributes), and the generated Angular client treats any other success code as a failure.
    [HttpPost]
    public async Task<ActionResult<VehicleMakeDto>> Create(
        CreateVehicleMakeRequest request,
        CancellationToken cancellationToken)
    {
        var values = VehicleMakeInputRules.Normalise(request);
        var errors = VehicleMakeInputRules.Validate(values, checkMakeCode: true);
        if (errors.Count > 0)
        {
            LogValidationFailure("Create", values.MakeCode, errors);
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        var created = await vehicleMakes.CreateAsync(values, cancellationToken);
        if (created is null)
        {
            return ConflictProblem("Make code already exists", "This make code already exists.");
        }

        return created;
    }

    [HttpPut("{makeCode}")]
    public async Task<ActionResult<VehicleMakeDto>> Update(
        string makeCode,
        UpdateVehicleMakeRequest request,
        CancellationToken cancellationToken)
    {
        var values = VehicleMakeInputRules.Normalise(makeCode, request);
        var errors = VehicleMakeInputRules.Validate(values, checkMakeCode: false);
        if (errors.Count > 0)
        {
            LogValidationFailure("Update", values.MakeCode, errors);
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        var updated = await vehicleMakes.UpdateAsync(values, cancellationToken);
        if (updated is null)
        {
            return NotFoundProblem();
        }

        return updated;
    }

    [HttpDelete("{makeCode}")]
    public async Task<IActionResult> Delete(string makeCode, CancellationToken cancellationToken)
    {
        var outcome = await vehicleMakes.DeleteAsync(makeCode, cancellationToken);

        if (outcome == VehicleMakeDeleteOutcome.HasModels)
        {
            // Keyed by makeCode so the screen can show this plain-English sentence without ever showing raw server text.
            return ConflictProblem(
                "Vehicle make still has models",
                "This make still has models. Delete its models first, then delete the make.");
        }

        if (outcome == VehicleMakeDeleteOutcome.NotFound)
        {
            return NotFoundProblem();
        }

        return NoContent();
    }

    // Only the action, the code and the names of the invalid fields are logged. What the user typed (names, remarks) is not,
    // because the logs must not hold unnecessary personal data (constitution Article 8).
    private void LogValidationFailure(string action, string makeCode, IReadOnlyDictionary<string, string[]> errors) =>
        logger.LogWarning(
            "{Action} failed (ValidationError): vehicle make {MakeCode} has invalid fields {Fields}",
            action,
            makeCode,
            string.Join(", ", errors.Keys));

    private ActionResult ConflictProblem(string title, string makeCodeMessage) =>
        ValidationProblem(new ValidationProblemDetails(
            new Dictionary<string, string[]> { ["makeCode"] = [makeCodeMessage] })
        {
            Status = StatusCodes.Status409Conflict,
            Title = title
        });

    private ObjectResult NotFoundProblem() =>
        Problem(
            statusCode: StatusCodes.Status404NotFound,
            title: "Vehicle make not found",
            detail: "No vehicle make exists with that code. It may have been deleted. Please refresh the list and try again.");
}
