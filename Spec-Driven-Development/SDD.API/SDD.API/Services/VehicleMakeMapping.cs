using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;

namespace SDD.API.Services;

public static class VehicleMakeMapping
{
    // The database allows a missing name, but the application requires one (data-model.md), so a gap shows as blank.
    public static VehicleMakeDto ToDto(BrmVehMake make) =>
        new(
            make.VmakCode,
            make.VmakName ?? string.Empty,
            make.VmakShortName ?? string.Empty,
            make.VmakRemarks,
            make.VmakNameL2,
            make.VmakShortNameL2,
            make.VmakRemarksL2,
            make.VmakCrBy,
            make.VmakUpBy);
}
