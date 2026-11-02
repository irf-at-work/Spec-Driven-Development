using System.ComponentModel.DataAnnotations;

namespace SDD.API.Contracts;

public sealed class CreateDivisionsRequest
{
    public IReadOnlyList<CreateDivisionRequest> Divisions { get; init; } = [];
}

public sealed class CreateDivisionRequest
{
    [Required, StringLength(12)]
    public string DivisionCode { get; init; } = string.Empty;

    [Required, StringLength(100)]
    public string Name { get; init; } = string.Empty;

    [StringLength(30)]
    public string? ShortName { get; init; }

    [StringLength(100)]
    public string? NameL2 { get; init; }

    [StringLength(30)]
    public string? ShortNameL2 { get; init; }

    [StringLength(100)]
    public string? Address1 { get; init; }

    [StringLength(100)]
    public string? Address2 { get; init; }

    [StringLength(100)]
    public string? Address3 { get; init; }

    [StringLength(100)]
    public string? Address1L2 { get; init; }

    [StringLength(100)]
    public string? Address2L2 { get; init; }

    [StringLength(100)]
    public string? Address3L2 { get; init; }

    [StringLength(20)]
    public string? CommercialRegistrationNumber { get; init; }

    public DateOnly? LicenceIssueDate { get; init; }

    public DateOnly? LicenceExpiryDate { get; init; }

    [StringLength(60)]
    public string? InCharge { get; init; }

    [StringLength(60)]
    public string? InChargeL2 { get; init; }

    [StringLength(20)]
    public string? Phone { get; init; }

    [StringLength(20)]
    public string? Fax { get; init; }

    [StringLength(20)]
    public string? Mobile { get; init; }

    [StringLength(100)]
    public string? Email { get; init; }

    public string? Remarks { get; init; }

    [RegularExpression("^[YN]$")]
    public string? Active { get; init; }
}

public sealed class UpdateDivisionRequest
{
    [Required, StringLength(100)]
    public string Name { get; init; } = string.Empty;

    [StringLength(30)]
    public string? ShortName { get; init; }

    [StringLength(100)]
    public string? NameL2 { get; init; }

    [StringLength(30)]
    public string? ShortNameL2 { get; init; }

    [StringLength(100)]
    public string? Address1 { get; init; }

    [StringLength(100)]
    public string? Address2 { get; init; }

    [StringLength(100)]
    public string? Address3 { get; init; }

    [StringLength(100)]
    public string? Address1L2 { get; init; }

    [StringLength(100)]
    public string? Address2L2 { get; init; }

    [StringLength(100)]
    public string? Address3L2 { get; init; }

    [StringLength(20)]
    public string? CommercialRegistrationNumber { get; init; }

    public DateOnly? LicenceIssueDate { get; init; }

    public DateOnly? LicenceExpiryDate { get; init; }

    [StringLength(60)]
    public string? InCharge { get; init; }

    [StringLength(60)]
    public string? InChargeL2 { get; init; }

    [StringLength(20)]
    public string? Phone { get; init; }

    [StringLength(20)]
    public string? Fax { get; init; }

    [StringLength(20)]
    public string? Mobile { get; init; }

    [StringLength(100)]
    public string? Email { get; init; }

    public string? Remarks { get; init; }

    [RegularExpression("^[YN]$")]
    public string? Active { get; init; }
}

public sealed class DivisionDto
{
    public string DivisionCode { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? ShortName { get; init; }
    public string? NameL2 { get; init; }
    public string? ShortNameL2 { get; init; }
    public string? Address1 { get; init; }
    public string? Address2 { get; init; }
    public string? Address3 { get; init; }
    public string? Address1L2 { get; init; }
    public string? Address2L2 { get; init; }
    public string? Address3L2 { get; init; }
    public string? CommercialRegistrationNumber { get; init; }
    public DateOnly? LicenceIssueDate { get; init; }
    public DateOnly? LicenceExpiryDate { get; init; }
    public string? InCharge { get; init; }
    public string? InChargeL2 { get; init; }
    public string? Phone { get; init; }
    public string? Fax { get; init; }
    public string? Mobile { get; init; }
    public string? Email { get; init; }
    public string? Remarks { get; init; }
    public string? Active { get; init; }
    public IReadOnlyList<DepartmentDto> Departments { get; init; } = [];
}
