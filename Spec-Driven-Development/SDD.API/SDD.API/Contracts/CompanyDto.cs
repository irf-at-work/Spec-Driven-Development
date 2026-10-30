namespace SDD.API.Contracts;

public sealed class CompanyDto
{
    public required string CompanyCode { get; init; }

    public required string CompanyName { get; init; }

    public string? ShortName { get; init; }

    public string? Address1 { get; init; }

    public string? Address2 { get; init; }

    public string? Address3 { get; init; }

    public string PrimaryAddress { get; init; } = string.Empty;

    public DateOnly? IncorporationDate { get; init; }

    public string? ReferenceNumber { get; init; }

    public DateOnly? LicenceIssueDate { get; init; }

    public DateOnly? LicenceExpiryDate { get; init; }

    public string? CompanyInCharge { get; init; }

    public string? Phone { get; init; }

    public string? Email { get; init; }

    public string? Website { get; init; }

    public string? CreatedBy { get; init; }

    public DateTime? CreatedAt { get; init; }

    public string? LastUpdatedBy { get; init; }

    public DateTime? LastUpdatedAt { get; init; }
}
