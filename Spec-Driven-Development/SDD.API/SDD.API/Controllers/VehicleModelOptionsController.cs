using Microsoft.AspNetCore.Mvc;
using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Controllers;

// One call returns all nine dropdowns. It is deliberately not paged: the lists are small, fixed lookups, an
// owner-approved exception recorded under constitution C3. The list types are fixed in the service, never read from the request.
[ApiController]
[Route("api/vehicle-model-options")]
public class VehicleModelOptionsController(VehicleModelService vehicleModels) : ControllerBase
{
    [HttpGet]
    public Task<VehicleModelOptionsDto> Get(CancellationToken cancellationToken) =>
        vehicleModels.GetOptionsAsync(cancellationToken);
}
