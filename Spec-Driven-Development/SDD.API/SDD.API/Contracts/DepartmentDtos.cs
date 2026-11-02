using System.ComponentModel.DataAnnotations;

namespace SDD.API.Contracts;

public sealed class CreateDepartmentRequest
{
    [Required, StringLength(12)]
    public string DepartmentCode { get; init; } = string.Empty;

    [Required, StringLength(100)]
    public string Name { get; init; } = string.Empty;

    [StringLength(30)]
    public string? ShortName { get; init; }

    [StringLength(100)]
    public string? NameL2 { get; init; }

    [StringLength(30)]
    public string? ShortNameL2 { get; init; }

    [StringLength(60)]
    public string? InCharge { get; init; }

    [StringLength(60)]
    public string? InChargeL2 { get; init; }

    public string? Remarks { get; init; }

    [RegularExpression("^[YN]$")]
    public string? Active { get; init; }

    [Required, MinLength(1)]
    public IReadOnlyList<string> DivisionCodes { get; init; } = [];
}

public sealed class LinkDepartmentsRequest
{
    [Required, MinLength(1)]
    public IReadOnlyList<string> DepartmentCodes { get; init; } = [];
}

public sealed class DepartmentDto
{
    public string DepartmentCode { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? ShortName { get; init; }
    public string? NameL2 { get; init; }
    public string? ShortNameL2 { get; init; }
    public string? InCharge { get; init; }
    public string? InChargeL2 { get; init; }
    public string? Remarks { get; init; }
    public string? Active { get; init; }
    public IReadOnlyList<string> DivisionCodes { get; init; } = [];
}
