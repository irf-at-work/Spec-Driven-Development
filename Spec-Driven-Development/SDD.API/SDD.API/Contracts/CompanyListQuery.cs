namespace SDD.API.Contracts;

public sealed class CompanyListQuery
{
    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;

    public string SortBy { get; set; } = "companyName";

    public string SortDirection { get; set; } = "asc";

    public string? CompanyName { get; set; }

    public string? ShortName { get; set; }

    public string? PrimaryAddress { get; set; }

    public DateOnly? IncorporationDate { get; set; }

    public string? ReferenceNumber { get; set; }

    public DateOnly? LicenceIssueDate { get; set; }

    public DateOnly? LicenceExpiryDate { get; set; }

    public string? CompanyInCharge { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Website { get; set; }
}
