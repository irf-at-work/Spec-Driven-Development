namespace SDD.API.DTOs;

/// <summary>One choice in a dropdown: the code that is stored, and the English description that is shown.</summary>
public sealed record LookupOptionDto(string Code, string Description);

/// <summary>
/// All nine dropdowns of the model row in one response, so the screen makes one call instead of nine.
/// Each list holds the active items of its own standard list type, ordered by description.
/// </summary>
public sealed record VehicleModelOptionsDto(
    IReadOnlyList<LookupOptionDto> Variants,
    IReadOnlyList<LookupOptionDto> VehicleTypes,
    IReadOnlyList<LookupOptionDto> BodyTypes,
    IReadOnlyList<LookupOptionDto> FuelTypes,
    IReadOnlyList<LookupOptionDto> Cylinders,
    IReadOnlyList<LookupOptionDto> Doors,
    IReadOnlyList<LookupOptionDto> DrivingTypes,
    IReadOnlyList<LookupOptionDto> BodyColours,
    IReadOnlyList<LookupOptionDto> Categories);
