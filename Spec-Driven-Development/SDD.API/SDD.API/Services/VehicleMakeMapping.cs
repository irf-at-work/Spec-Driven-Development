using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;

namespace SDD.API.Services;

public static class VehicleMakeMapping
{
    // The Active flag is stored as one letter (FR-027).
    public const string ActiveFlag = "Y";
    public const string InactiveFlag = "N";

    public static string ToFlag(bool active) => active ? ActiveFlag : InactiveFlag;

    // An older row with no flag at all counts as Active, so nothing already in the table disappears from use.
    public static bool IsActive(string? flag) => flag != InactiveFlag;

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
            IsActive(make.VmakActiveYn),
            make.VmakCrBy,
            make.VmakUpBy);
}
