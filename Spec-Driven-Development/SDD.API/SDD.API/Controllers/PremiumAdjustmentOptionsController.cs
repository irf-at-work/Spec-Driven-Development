using Microsoft.AspNetCore.Mvc;
using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Controllers;

[ApiController]
[Route("api/premium-adjustment-options")]
public sealed class PremiumAdjustmentOptionsController(PremiumAdjustmentService adjustments) : ControllerBase
{
    [HttpGet]
    public Task<PremiumAdjustmentOptionsDto> Get(CancellationToken cancellationToken) =>
        adjustments.GetOptionsAsync(cancellationToken);
}
