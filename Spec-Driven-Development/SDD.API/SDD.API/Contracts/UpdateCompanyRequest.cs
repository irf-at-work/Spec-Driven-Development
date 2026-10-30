using System.ComponentModel.DataAnnotations;

namespace SDD.API.Contracts;

public sealed class UpdateCompanyRequest
{
    [StringLength(100), MinLength(1)]
    public string? CompanyName { get; init; }

    [StringLength(30)]
    public string? ShortName { get; init; }

    [StringLength(100)]
    public string? Address1 { get; init; }

    [StringLength(100)]
    public string? Address2 { get; init; }

    [StringLength(100)]
    public string? Address3 { get; init; }

    public DateOnly? IncorporationDate { get; init; }

    [StringLength(20)]
    public string? ReferenceNumber { get; init; }

    public DateOnly? LicenceIssueDate { get; init; }

    public DateOnly? LicenceExpiryDate { get; init; }

    [StringLength(60)]
    public string? CompanyInCharge { get; init; }

    [StringLength(20)]
    public string? Phone { get; init; }

    [StringLength(100)]
    public string? Email { get; init; }

    [StringLength(100)]
    public string? Website { get; init; }
}
