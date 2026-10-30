namespace SDD.API.Services;

/// <summary>
/// The nine standard-list types whose items fill the model dropdowns (data-model.md). They are fixed here, never taken
/// from a request, so nobody can read other lists through this page.
/// </summary>
public static class VehicleModelListTypes
{
    public const string Variant = "VEH_VARIANT";
    public const string VehicleType = "VEH_TYPE";
    public const string BodyType = "VEH_BODY_TYPE";
    public const string FuelType = "VEH_FUEL_TYPE";
    public const string Cylinders = "VEH_CYLINDER";
    public const string Doors = "VEH_DOORS";
    public const string DrivingType = "VEH_DRIVING_TYPE";
    public const string BodyColour = "VEH_BODY_COLOR";
    public const string Category = "VEH_CATEGORY";

    public static readonly string[] All =
    [
        Variant, VehicleType, BodyType, FuelType, Cylinders, Doors, DrivingType, BodyColour, Category
    ];
}
