namespace SDD.API.Contracts;

public sealed class CompanyListItemDto
{
    public required string CompanyCode { get; init; }

    public required string CompanyName { get; init; }

    public string? ShortName { get; init; }

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

    public string? LastUpdatedBy { get; init; }
}
