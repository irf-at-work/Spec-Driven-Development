using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using SDD.API.Common;
using SDD.API.Contracts;
using SDD.API.Data.Entities;

namespace SDD.API.Services;

public sealed class CompanyService(
    ICompanyRepository repository,
    TimeProvider? timeProvider = null)
{
    private static readonly IReadOnlyDictionary<string, string> SortColumns =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["companyName"] = "companyName",
            ["shortName"] = "shortName",
            ["primaryAddress"] = "primaryAddress",
            ["incorporationDate"] = "incorporationDate",
            ["referenceNumber"] = "referenceNumber",
            ["licenceIssueDate"] = "licenceIssueDate",
            ["licenceExpiryDate"] = "licenceExpiryDate",
            ["companyInCharge"] = "companyInCharge",
            ["phone"] = "phone",
            ["email"] = "email",
            ["website"] = "website",
        };

    private readonly TimeProvider _timeProvider = timeProvider ?? TimeProvider.System;

    public async Task<PaginatedResult<CompanyListItemDto>> ListAsync(
        CompanyListQuery request,
        CancellationToken cancellationToken)
    {
        ValidateListQuery(request);

        IQueryable<StdCompany> companies = repository.Companies;
        companies = ApplyTextFilter(companies, request.CompanyName, company => company.CompName);
        companies = ApplyTextFilter(companies, request.ShortName, company => company.CompShortName);
        companies = ApplyAddressFilter(companies, request.PrimaryAddress);
        companies = ApplyDateFilter(companies, request.IncorporationDate, company => company.CompIncorpDt);
        companies = ApplyTextFilter(companies, request.ReferenceNumber, company => company.CompRefNo);
        companies = ApplyDateFilter(companies, request.LicenceIssueDate, company => company.CompLicenseIssDt);
        companies = ApplyDateFilter(companies, request.LicenceExpiryDate, company => company.CompLicenseExpDt);
        companies = ApplyTextFilter(companies, request.CompanyInCharge, company => company.CompIncharge);
        companies = ApplyTextFilter(companies, request.Phone, company => company.CompPhone);
        companies = ApplyTextFilter(companies, request.Email, company => company.CompEmail);
        companies = ApplyTextFilter(companies, request.Website, company => company.CompWebsite);

        var totalCount = await repository.CountAsync(companies, cancellationToken);
        var offset = (long)(request.Page - 1) * request.PageSize;
        var items = offset > int.MaxValue
            ? []
            : await repository.ToListAsync(
                ApplyOrdering(companies, request.SortBy, request.SortDirection)
                    .Skip((int)offset)
                    .Take(request.PageSize),
                cancellationToken);

        return new PaginatedResult<CompanyListItemDto>
        {
            Items = items.Select(ToListItem).ToArray(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
        };
    }

    public async Task<CompanyDto?> GetAsync(string companyCode, CancellationToken cancellationToken)
    {
        var company = await repository.ToListAsync(
            repository.Companies.Where(item => item.CompCode == companyCode),
            cancellationToken);
        return company.Count == 0 ? null : ToCompanyDto(company[0]);
    }

    public async Task<CompanyDto> CreateAsync(
        CreateCompanyRequest request,
        CancellationToken cancellationToken)
    {
        Validate(request);

        if (await repository.AnyAsync(
            repository.Companies.Where(company => company.CompCode == request.CompanyCode),
            cancellationToken))
        {
            throw new CompanyConflictException("A company with this company code already exists.");
        }

        var now = _timeProvider.GetUtcNow().UtcDateTime;
        var company = new StdCompany
        {
            CompCode = request.CompanyCode,
            CompName = request.CompanyName,
            CompShortName = string.IsNullOrWhiteSpace(request.ShortName)
                ? request.CompanyName[..Math.Min(request.CompanyName.Length, 30)]
                : request.ShortName,
            CompAddr1 = request.Address1,
            CompAddr2 = request.Address2,
            CompAddr3 = request.Address3,
            CompIncorpDt = ToDateTime(request.IncorporationDate),
            CompRefNo = request.ReferenceNumber,
            CompLicenseIssDt = ToDateTime(request.LicenceIssueDate),
            CompLicenseExpDt = ToDateTime(request.LicenceExpiryDate),
            CompIncharge = request.CompanyInCharge,
            CompPhone = request.Phone,
            CompEmail = request.Email,
            CompWebsite = request.Website,
            CompCrBy = "Admin",
            CompCrDt = now,
            CompUpBy = "Admin",
            CompUpDt = now,
        };
        repository.Add(company);

        try
        {
            await repository.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (FindOracleException(exception)?.Number == 1)
        {
            throw new CompanyConflictException("A company with this company code already exists.");
        }

        return ToCompanyDto(company);
    }

    public async Task<CompanyDto?> UpdateAsync(
        string companyCode,
        UpdateCompanyRequest request,
        CancellationToken cancellationToken)
    {
        Validate(request);

        var rows = await repository.ToListAsync(
            repository.Companies.Where(company => company.CompCode == companyCode),
            cancellationToken);
        if (rows.Count == 0)
        {
            return null;
        }

        var company = rows[0];
        if (request.Phone != company.CompPhone)
        {
            ValidatePhoneChange(request.Phone);
        }

        if (request.CompanyName is not null)
        {
            company.CompName = request.CompanyName;
        }
        company.CompShortName = request.ShortName;
        company.CompAddr1 = request.Address1;
        company.CompAddr2 = request.Address2;
        company.CompAddr3 = request.Address3;
        company.CompIncorpDt = ToDateTime(request.IncorporationDate);
        company.CompRefNo = request.ReferenceNumber;
        company.CompLicenseIssDt = ToDateTime(request.LicenceIssueDate);
        company.CompLicenseExpDt = ToDateTime(request.LicenceExpiryDate);
        company.CompIncharge = request.CompanyInCharge;
        company.CompPhone = request.Phone;
        company.CompEmail = request.Email;
        company.CompWebsite = request.Website;
        company.CompUpBy = "Admin";
        company.CompUpDt = _timeProvider.GetUtcNow().UtcDateTime;

        await repository.SaveChangesAsync(cancellationToken);
        return ToCompanyDto(company);
    }

    public async Task<bool> DeleteAsync(string companyCode, CancellationToken cancellationToken)
    {
        var rows = await repository.ToListAsync(
            repository.Companies.Where(company => company.CompCode == companyCode),
            cancellationToken);
        if (rows.Count == 0)
        {
            return false;
        }

        if (await repository.AnyAsync(
            repository.Departments.Where(department => department.DeptCompCode == companyCode),
            cancellationToken))
        {
            throw new CompanyReferenceException();
        }

        repository.Remove(rows[0]);
        try
        {
            await repository.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (FindOracleException(exception)?.Number == 2292)
        {
            throw new CompanyReferenceException();
        }

        return true;
    }

    private static IQueryable<StdCompany> ApplyTextFilter(
        IQueryable<StdCompany> companies,
        string? value,
        Expression<Func<StdCompany, string?>> field)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return companies;
        }

        var parameter = field.Parameters[0];
        var notNull = Expression.NotEqual(field.Body, Expression.Constant(null, typeof(string)));
        var lower = Expression.Call(field.Body, nameof(string.ToLower), Type.EmptyTypes);
        var term = Expression.Constant(value.Trim().ToLowerInvariant());
        var contains = Expression.Call(lower, nameof(string.Contains), Type.EmptyTypes, term);
        return companies.Where(Expression.Lambda<Func<StdCompany, bool>>(
            Expression.AndAlso(notNull, contains), parameter));
    }

    private static IQueryable<StdCompany> ApplyAddressFilter(IQueryable<StdCompany> companies, string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return companies;
        }

        var terms = value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(term => term.ToLowerInvariant())
            .ToArray();
        foreach (var term in terms)
        {
            companies = companies.Where(company =>
                (company.CompAddr1 != null && company.CompAddr1.ToLower().Contains(term))
                || (company.CompAddr2 != null && company.CompAddr2.ToLower().Contains(term))
                || (company.CompAddr3 != null && company.CompAddr3.ToLower().Contains(term)));
        }

        return companies;
    }

    private static IQueryable<StdCompany> ApplyDateFilter(
        IQueryable<StdCompany> companies,
        DateOnly? value,
        Expression<Func<StdCompany, DateTime?>> field)
    {
        if (value is null)
        {
            return companies;
        }

        var start = value.Value.ToDateTime(TimeOnly.MinValue);
        var end = start.AddDays(1);
        var parameter = field.Parameters[0];
        var notNull = Expression.Property(field.Body, nameof(Nullable<DateTime>.HasValue));
        var dateValue = Expression.Property(field.Body, nameof(Nullable<DateTime>.Value));
        var withinRange = Expression.AndAlso(
            Expression.GreaterThanOrEqual(dateValue, Expression.Constant(start)),
            Expression.LessThan(dateValue, Expression.Constant(end)));
        return companies.Where(Expression.Lambda<Func<StdCompany, bool>>(
            Expression.AndAlso(notNull, withinRange), parameter));
    }

    private static IQueryable<StdCompany> ApplyOrdering(
        IQueryable<StdCompany> companies,
        string sortBy,
        string sortDirection)
    {
        var descending = string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase);
        var ordered = (sortBy.ToLowerInvariant(), descending) switch
        {
            ("companyname", false) => companies.OrderBy(company => company.CompName),
            ("companyname", true) => companies.OrderByDescending(company => company.CompName),
            ("shortname", false) => companies.OrderBy(company => company.CompShortName),
            ("shortname", true) => companies.OrderByDescending(company => company.CompShortName),
            ("primaryaddress", false) => companies.OrderBy(company => company.CompAddr1).ThenBy(company => company.CompAddr2).ThenBy(company => company.CompAddr3),
            ("primaryaddress", true) => companies.OrderByDescending(company => company.CompAddr1).ThenByDescending(company => company.CompAddr2).ThenByDescending(company => company.CompAddr3),
            ("incorporationdate", false) => companies.OrderBy(company => company.CompIncorpDt),
            ("incorporationdate", true) => companies.OrderByDescending(company => company.CompIncorpDt),
            ("referencenumber", false) => companies.OrderBy(company => company.CompRefNo),
            ("referencenumber", true) => companies.OrderByDescending(company => company.CompRefNo),
            ("licenceissuedate", false) => companies.OrderBy(company => company.CompLicenseIssDt),
            ("licenceissuedate", true) => companies.OrderByDescending(company => company.CompLicenseIssDt),
            ("licenceexpirydate", false) => companies.OrderBy(company => company.CompLicenseExpDt),
            ("licenceexpirydate", true) => companies.OrderByDescending(company => company.CompLicenseExpDt),
            ("companyincharge", false) => companies.OrderBy(company => company.CompIncharge),
            ("companyincharge", true) => companies.OrderByDescending(company => company.CompIncharge),
            ("phone", false) => companies.OrderBy(company => company.CompPhone),
            ("phone", true) => companies.OrderByDescending(company => company.CompPhone),
            ("email", false) => companies.OrderBy(company => company.CompEmail),
            ("email", true) => companies.OrderByDescending(company => company.CompEmail),
            ("website", false) => companies.OrderBy(company => company.CompWebsite),
            ("website", true) => companies.OrderByDescending(company => company.CompWebsite),
            _ => throw new InvalidOperationException("The company sort field was not validated."),
        };

        return ordered.ThenBy(company => company.CompCode);
    }

    private static CompanyListItemDto ToListItem(StdCompany company) => new()
    {
        CompanyCode = company.CompCode,
        CompanyName = company.CompName,
        ShortName = company.CompShortName,
        PrimaryAddress = ComposeAddress(company),
        IncorporationDate = ToDateOnly(company.CompIncorpDt),
        ReferenceNumber = company.CompRefNo,
        LicenceIssueDate = ToDateOnly(company.CompLicenseIssDt),
        LicenceExpiryDate = ToDateOnly(company.CompLicenseExpDt),
        CompanyInCharge = company.CompIncharge,
        Phone = company.CompPhone,
        Email = company.CompEmail,
        Website = company.CompWebsite,
        CreatedBy = company.CompCrBy,
        LastUpdatedBy = company.CompUpBy,
    };

    private static CompanyDto ToCompanyDto(StdCompany company) => new()
    {
        CompanyCode = company.CompCode,
        CompanyName = company.CompName,
        ShortName = company.CompShortName,
        Address1 = company.CompAddr1,
        Address2 = company.CompAddr2,
        Address3 = company.CompAddr3,
        PrimaryAddress = ComposeAddress(company),
        IncorporationDate = ToDateOnly(company.CompIncorpDt),
        ReferenceNumber = company.CompRefNo,
        LicenceIssueDate = ToDateOnly(company.CompLicenseIssDt),
        LicenceExpiryDate = ToDateOnly(company.CompLicenseExpDt),
        CompanyInCharge = company.CompIncharge,
        Phone = company.CompPhone,
        Email = company.CompEmail,
        Website = company.CompWebsite,
        CreatedBy = company.CompCrBy,
        CreatedAt = ToUtc(company.CompCrDt),
        LastUpdatedBy = company.CompUpBy,
        LastUpdatedAt = ToUtc(company.CompUpDt),
    };

    private static string ComposeAddress(StdCompany company) =>
        string.Join(", ", new[] { company.CompAddr1, company.CompAddr2, company.CompAddr3 }
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .Select(value => value!.Trim()));

    private static DateOnly? ToDateOnly(DateTime? value) =>
        value is null ? null : DateOnly.FromDateTime(value.Value);

    private static DateTime? ToDateTime(DateOnly? value) =>
        value?.ToDateTime(TimeOnly.MinValue);

    private static DateTime? ToUtc(DateTime? value) =>
        value is null ? null : DateTime.SpecifyKind(value.Value, DateTimeKind.Utc);

    private static void ValidateListQuery(CompanyListQuery request)
    {
        var errors = new Dictionary<string, string[]>();
        if (request.Page < 1)
        {
            errors[nameof(request.Page)] = ["Page must be greater than zero."];
        }

        if (request.PageSize < 1)
        {
            errors[nameof(request.PageSize)] = ["Page size must be greater than zero."];
        }

        if (string.IsNullOrWhiteSpace(request.SortBy) || !SortColumns.ContainsKey(request.SortBy))
        {
            errors[JsonNamingPolicy.CamelCase.ConvertName(nameof(request.SortBy))] =
                ["Choose a supported company column to sort by."];
        }

        if (!string.Equals(request.SortDirection, "asc", StringComparison.OrdinalIgnoreCase)
            && !string.Equals(request.SortDirection, "desc", StringComparison.OrdinalIgnoreCase))
        {
            errors[JsonNamingPolicy.CamelCase.ConvertName(nameof(request.SortDirection))] =
                ["Sort direction must be 'asc' or 'desc'."];
        }

        var offset = ((long)request.Page - 1) * request.PageSize;
        if (request.Page > 0 && request.PageSize > 0 && offset > int.MaxValue)
        {
            errors[JsonNamingPolicy.CamelCase.ConvertName(nameof(request.Page))] = ["The requested page is too large."];
        }

        if (errors.Count > 0)
        {
            throw new CompanyValidationException(errors);
        }
    }

    private static void Validate(object request)
    {
        var validationResults = new List<ValidationResult>();
        Validator.TryValidateObject(request, new ValidationContext(request), validationResults, validateAllProperties: true);
        if (validationResults.Count == 0)
        {
            return;
        }

        var errors = validationResults
            .SelectMany(result => result.MemberNames.DefaultIfEmpty(string.Empty)
                .Select(member => (
                    member: JsonNamingPolicy.CamelCase.ConvertName(member),
                    error: result.ErrorMessage ?? "The value is invalid.")))
            .GroupBy(item => item.member)
            .ToDictionary(group => group.Key, group => group.Select(item => item.error).ToArray());
        throw new CompanyValidationException(errors);
    }

    private static void ValidatePhoneChange(string? phone)
    {
        if (string.IsNullOrEmpty(phone) ||
            phone.Length == 10 && phone.All(char.IsAsciiDigit))
        {
            return;
        }

        throw new CompanyValidationException(new Dictionary<string, string[]>
        {
            ["phone"] = ["Phone number must contain exactly 10 digits."],
        });
    }

    private static OracleException? FindOracleException(Exception exception)
    {
        for (var current = exception; current is not null; current = current.InnerException!)
        {
            if (current is OracleException oracleException)
            {
                return oracleException;
            }
        }

        return null;
    }
}
