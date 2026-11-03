using System.Globalization;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;

namespace SDD.API.Services;

public static class VehicleModelMapping
{
    // The database allows a missing name, but the application requires one (data-model.md), so a gap shows as blank.
    public static VehicleModelDto ToDto(BrmVehModel model) =>
        new(
            model.VmodVmakCode,
            model.VmodCode,
            model.VmodName ?? string.Empty,
            model.VmodShortName ?? string.Empty,
            model.VmodRemarks,
            model.VmodNameL2,
            model.VmodShortNameL2,
            model.VmodRemarksL2,
            model.VmodVariant,
            model.VmodType,
            model.VmodWeight,
            model.VmodLoadCapacity,
            model.VmodBodyType,
            model.VmodFuelType,
            ToWholeNumber(model.VmodCc),
            model.VmodCylinder,
            ToWholeNumber(model.VmodNoSeats),
            ToWholeNumber(model.VmodNoPass),
            ToWholeNumber(model.VmodNoDrvr),
            model.VmodDoors,
            ToWholeNumber(model.VmodMakeYear),
            model.VmodDrivingType,
            model.VmodBodyColor,
            ToAmount(model.VmodValueLc),
            model.VmodCatgCode,
            VehicleMakeMapping.IsActive(model.VmodActiveYn),
            model.VmodCrBy,
            model.VmodUpBy);

    // How Oracle's NUMBER columns appear in the scaffolded entity (decimal, short and so on) depends on their size, so
    // the number columns are read and written through these helpers. That keeps every other file free of the detail.
    private static int? ToWholeNumber<T>(T? value)
        where T : struct, IConvertible =>
        value is null ? null : Convert.ToInt32(value.Value, CultureInfo.InvariantCulture);

    private static decimal? ToAmount<T>(T? value)
        where T : struct, IConvertible =>
        value is null ? null : Convert.ToDecimal(value.Value, CultureInfo.InvariantCulture);
}
