using Microsoft.AspNetCore.Mvc;
using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Controllers;

// One call returns all nine dropdowns. The list types are fixed in the service, never read from the request.
// The separate import endpoints accept only those same fixed types.
[ApiController]
[Route("api/vehicle-model-options")]
public class VehicleModelOptionsController(
    VehicleModelService vehicleModels,
    VehicleModelOptionsImportService importService) : ControllerBase
{
    [HttpGet]
    public Task<VehicleModelOptionsDto> Get(CancellationToken cancellationToken) =>
        vehicleModels.GetOptionsAsync(cancellationToken);

    [HttpPost("import/preview")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<ActionResult<VehicleModelOptionsImportPreviewDto>> PreviewImport(
        [FromBody] VehicleModelOptionsImportRequestDto request,
        CancellationToken cancellationToken) =>
        await importService.PreviewAsync(request.Rows, cancellationToken);

    [HttpPost("import")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<ActionResult<VehicleModelOptionsImportResultDto>> Import(
        [FromBody] VehicleModelOptionsImportRequestDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            return await importService.ImportAsync(request.Rows, cancellationToken);
        }
        catch (VehicleModelOptionsImportValidationException exception)
        {
            var errors = new Dictionary<string, string[]>();
            if (exception.Preview.Errors.Count > 0)
            {
                errors["rows"] = exception.Preview.Errors.ToArray();
            }
            foreach (var row in exception.Preview.Rows.Where(row => !row.IsValid))
            {
                errors[$"rows[{row.RowNumber}]"] = row.Errors.ToArray();
            }

            return BadRequest(new ValidationProblemDetails(errors)
            {
                Title = "The lookup workbook contains invalid rows.",
                Status = StatusCodes.Status400BadRequest
            });
        }
        catch (VehicleModelOptionsImportConflictException)
        {
            return Conflict(new ProblemDetails
            {
                Title = "The lookup import could not be completed.",
                Detail = "A matching lookup key was added during import. Preview the workbook again.",
                Status = StatusCodes.Status409Conflict
            });
        }
    }
}
