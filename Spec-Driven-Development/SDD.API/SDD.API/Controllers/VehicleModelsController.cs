using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Controllers;

// The make code always comes from the web address, never from the request body, so a model cannot be moved to another make.
[ApiController]
[Route("api/vehicle-makes/{makeCode}/models")]
public class VehicleModelsController(
    VehicleModelService vehicleModels,
    ILogger<VehicleModelsController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<VehicleModelDto>>> List(
        string makeCode,
        int page = 1,
        string? modelCode = null,
        string? modelCodeOperator = null,
        string? modelName = null,
        string? modelNameOperator = null,
        string? shortName = null,
        string? shortNameOperator = null,
        bool? active = null,
        string? activeOperator = null,
        CancellationToken cancellationToken = default)
    {
        var filters = new ColumnFilters(
            new TextFilter(modelCode, modelCodeOperator),
            new TextFilter(modelName, modelNameOperator),
            new TextFilter(shortName, shortNameOperator),
            new StatusFilter(active, activeOperator));

        var errors = VehicleModelListQuery.Validate(page, filters);
        if (errors.Count > 0)
        {
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        var result = await vehicleModels.ListAsync(makeCode, page, filters, cancellationToken);
        if (result is null)
        {
            return MakeNotFoundProblem();
        }

        return result;
    }

    // Used by the model's own page to load one model by its key.
    [HttpGet("{modelCode}")]
    public async Task<ActionResult<VehicleModelDto>> Get(
        string makeCode,
        string modelCode,
        CancellationToken cancellationToken)
    {
        var result = await vehicleModels.GetAsync(makeCode, modelCode, cancellationToken);
        return ToResponse(result);
    }

    // Answers 200 with the saved model rather than 201 Created, for the same reason as makes (see VehicleMakesController).
    [HttpPost]
    public async Task<ActionResult<VehicleModelDto>> Create(
        string makeCode,
        CreateVehicleModelRequest request,
        CancellationToken cancellationToken)
    {
        var values = VehicleModelInputRules.Normalise(makeCode, request);
        var errors = VehicleModelInputRules.Validate(values, checkModelCode: true);
        if (errors.Count > 0)
        {
            LogValidationFailure("Create", values, errors);
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        var result = await vehicleModels.CreateAsync(values, cancellationToken);
        return ToResponse(result);
    }

    [HttpPut("{modelCode}")]
    public async Task<ActionResult<VehicleModelDto>> Update(
        string makeCode,
        string modelCode,
        UpdateVehicleModelRequest request,
        CancellationToken cancellationToken)
    {
        var values = VehicleModelInputRules.Normalise(makeCode, modelCode, request);
        var errors = VehicleModelInputRules.Validate(values, checkModelCode: false);
        if (errors.Count > 0)
        {
            LogValidationFailure("Update", values, errors);
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>(errors)));
        }

        var result = await vehicleModels.UpdateAsync(values, cancellationToken);
        return ToResponse(result);
    }

    [HttpDelete("{modelCode}")]
    public async Task<IActionResult> Delete(string makeCode, string modelCode, CancellationToken cancellationToken)
    {
        var outcome = await vehicleModels.DeleteAsync(makeCode, modelCode, cancellationToken);
        if (outcome == VehicleModelOutcome.ModelNotFound)
        {
            return ModelNotFoundProblem();
        }

        return NoContent();
    }

    private ActionResult<VehicleModelDto> ToResponse(VehicleModelResult result)
    {
        switch (result.Outcome)
        {
            case VehicleModelOutcome.DuplicateCode:
                return FieldProblem(
                    StatusCodes.Status409Conflict,
                    "Model code already exists",
                    new Dictionary<string, string[]> { ["modelCode"] = ["This model code already exists for this make."] });
            case VehicleModelOutcome.InvalidOptions:
                return FieldProblem(
                    StatusCodes.Status400BadRequest,
                    "One or more choices are not available",
                    new Dictionary<string, string[]>(result.Errors ?? new Dictionary<string, string[]>()));
            case VehicleModelOutcome.MakeNotFound:
                return MakeNotFoundProblem();
            case VehicleModelOutcome.ModelNotFound:
                return ModelNotFoundProblem();
            default:
                return result.Model!;
        }
    }

    // Only the action, the codes and the names of the invalid fields are logged. What the user typed is not,
    // because the logs must not hold unnecessary personal data (constitution Article 8).
    private void LogValidationFailure(
        string action,
        VehicleModelValues values,
        IReadOnlyDictionary<string, string[]> errors) =>
        logger.LogWarning(
            "{Action} model failed (ValidationError): vehicle model {MakeCode}/{ModelCode} has invalid fields {Fields}",
            action,
            values.MakeCode,
            values.ModelCode,
            string.Join(", ", errors.Keys));

    private ActionResult FieldProblem(int status, string title, Dictionary<string, string[]> errors)
    {
        var details = new ValidationProblemDetails(errors) { Status = status, Title = title };
        return status == StatusCodes.Status409Conflict
            ? Conflict(details)
            : ValidationProblem(details);
    }

    private ObjectResult MakeNotFoundProblem() =>
        Problem(
            statusCode: StatusCodes.Status404NotFound,
            title: "Vehicle make not found",
            detail: "No vehicle make exists with that code. It may have been deleted. Please go back to the list and try again.");

    private ObjectResult ModelNotFoundProblem() =>
        Problem(
            statusCode: StatusCodes.Status404NotFound,
            title: "Vehicle model not found",
            detail: "No vehicle model exists with that code. It may have been deleted. Please refresh the models and try again.");
}
