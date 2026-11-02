using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using SDD.API.Contracts;
using SDD.API.Data.Entities;

namespace SDD.API.Services;

public sealed class CompanyStructureService(
    ICompanyStructureRepository repository,
    TimeProvider? timeProvider = null)
{
    private readonly TimeProvider _timeProvider = timeProvider ?? TimeProvider.System;

    public async Task<IReadOnlyList<DivisionDto>?> GetDivisionsAsync(
        string companyCode,
        CancellationToken cancellationToken)
    {
        if (!await CompanyExistsAsync(companyCode, cancellationToken))
        {
            return null;
        }

        var divisions = await repository.ToListAsync(
            repository.Divisions.Where(division => division.DivnCompCode == companyCode)
                .OrderBy(division => division.DivnName)
                .ThenBy(division => division.DivnCode),
            cancellationToken);
        var departments = await repository.ToListAsync(
            repository.Departments.Where(department => department.DeptCompCode == companyCode),
            cancellationToken);
        EnsureDepartmentGroupsConsistent(departments);

        return divisions.Select(division => ToDivisionDto(
            division,
            departments.Where(department => department.DeptDivnCode == division.DivnCode))).ToArray();
    }

    public async Task<IReadOnlyList<DepartmentDto>?> GetDepartmentsAsync(
        string companyCode,
        CancellationToken cancellationToken)
    {
        if (!await CompanyExistsAsync(companyCode, cancellationToken))
        {
            return null;
        }

        var rows = await repository.ToListAsync(
            repository.Departments.Where(department => department.DeptCompCode == companyCode),
            cancellationToken);
        EnsureDepartmentGroupsConsistent(rows);
        return rows.GroupBy(department => department.DeptCode)
            .OrderBy(group => group.Key)
            .Select(ToDepartmentDto)
            .ToArray();
    }

    public async Task<IReadOnlyList<DivisionDto>> CreateDivisionsAsync(
        string companyCode,
        IReadOnlyCollection<CreateDivisionRequest> requests,
        CancellationToken cancellationToken)
    {
        if (!await CompanyExistsAsync(companyCode, cancellationToken))
        {
            throw new CompanyNotFoundException();
        }

        var errors = new Dictionary<string, string[]>();
        if (requests.Count > 0)
        {
            for (var index = 0; index < requests.Count; index++)
            {
                var request = requests.ElementAt(index);
                var validation = Validate(request);
                foreach (var (field, messages) in validation)
                {
                    errors[$"divisions[{index}].{field}"] = messages;
                }

                if (!string.IsNullOrWhiteSpace(request.DivisionCode) &&
                    requests.Take(index).Any(item => string.Equals(
                        item.DivisionCode.Trim(),
                        request.DivisionCode.Trim(),
                        StringComparison.OrdinalIgnoreCase)))
                {
                    errors[$"divisions[{index}].divisionCode"] = ["Division codes must be unique."];
                }
            }
        }
        if (errors.Count > 0)
        {
            throw new CompanyValidationException(errors);
        }

        if (requests.Count == 0)
        {
            return [];
        }

        var normalizedCodes = requests.Select(request => request.DivisionCode.Trim()).ToArray();
        var existing = await repository.ToListAsync(
            repository.Divisions.Where(division =>
                division.DivnCompCode == companyCode && normalizedCodes.Contains(division.DivnCode)),
            cancellationToken);
        if (existing.Count > 0)
        {
            throw new CompanyConflictException("A division with one of these codes already exists.");
        }

        var now = _timeProvider.GetUtcNow().UtcDateTime;
        var divisions = requests.Select(request => ToDivisionEntity(companyCode, request, now)).ToArray();
        foreach (var division in divisions)
        {
            repository.Add(division);
        }

        await SaveChangesWithConflictCheckAsync(
            cancellationToken,
            "A division with one of these codes already exists.");
        return divisions.Select(division => ToDivisionDto(division, [])).ToArray();
    }

    public async Task<DepartmentDto> CreateDepartmentAsync(
        string companyCode,
        CreateDepartmentRequest request,
        CancellationToken cancellationToken)
    {
        if (!await CompanyExistsAsync(companyCode, cancellationToken))
        {
            throw new CompanyNotFoundException();
        }

        var errors = Validate(request);
        if (request.DivisionCodes.Count == 0 || request.DivisionCodes.Any(string.IsNullOrWhiteSpace))
        {
            errors["divisionCodes"] = ["Select at least one division."];
        }
        if (request.DivisionCodes.Distinct(StringComparer.OrdinalIgnoreCase).Count() != request.DivisionCodes.Count)
        {
            errors["divisionCodes"] = ["Division selections must be unique."];
        }
        if (errors.Count > 0)
        {
            throw new CompanyValidationException(errors);
        }

        var divisionCodes = request.DivisionCodes.Select(code => code.Trim()).ToArray();
        var divisions = await repository.ToListAsync(
            repository.Divisions.Where(division =>
                division.DivnCompCode == companyCode && divisionCodes.Contains(division.DivnCode)),
            cancellationToken);
        if (divisions.Count != divisionCodes.Length)
        {
            throw new CompanyValidationException(new Dictionary<string, string[]>
            {
                ["divisionCodes"] = ["Every selected division must belong to this company."],
            });
        }

        var code = request.DepartmentCode.Trim();
        var existingRows = await repository.ToListAsync(
            repository.Departments.Where(department =>
                department.DeptCompCode == companyCode && department.DeptCode == code),
            cancellationToken);
        if (existingRows.Count > 0 && existingRows.Any(row => !DepartmentDetailsMatch(row, request)))
        {
            throw new CompanyConflictException(
                "A department with this code already exists with different details.");
        }

        EnsureConsistentDepartmentDetails(existingRows);
        var existingAssignments = existingRows.Select(row => row.DeptDivnCode).ToHashSet(StringComparer.Ordinal);
        var now = _timeProvider.GetUtcNow().UtcDateTime;
        foreach (var divisionCode in divisionCodes.Where(code => !existingAssignments.Contains(code)))
        {
            repository.Add(ToDepartmentEntity(companyCode, divisionCode, request, now));
        }

        if (divisionCodes.Any(code => !existingAssignments.Contains(code)))
        {
            await SaveChangesWithConflictCheckAsync(
                cancellationToken,
                "A department assignment with this code already exists.");
        }

        return ToDepartmentDto(existingRows.Concat(divisionCodes
            .Where(code => !existingAssignments.Contains(code))
            .Select(code => ToDepartmentEntity(companyCode, code, request, now))));
    }

    public async Task<IReadOnlyList<DepartmentDto>> LinkExistingDepartmentsAsync(
        string companyCode,
        string divisionCode,
        IReadOnlyCollection<string> departmentCodes,
        CancellationToken cancellationToken)
    {
        if (!await CompanyExistsAsync(companyCode, cancellationToken))
        {
            throw new CompanyNotFoundException();
        }

        var division = await repository.AnyAsync(
            repository.Divisions.Where(item =>
                item.DivnCompCode == companyCode && item.DivnCode == divisionCode),
            cancellationToken);
        if (!division)
        {
            throw new CompanyValidationException(new Dictionary<string, string[]>
            {
                ["divisionCode"] = ["The division must belong to this company."],
            });
        }
        if (departmentCodes.Count == 0 ||
            departmentCodes.Any(string.IsNullOrWhiteSpace) ||
            departmentCodes.Distinct(StringComparer.OrdinalIgnoreCase).Count() != departmentCodes.Count)
        {
            throw new CompanyValidationException(new Dictionary<string, string[]>
            {
                ["departmentCodes"] = ["Select one or more distinct departments."],
            });
        }

        var codes = departmentCodes.Select(code => code.Trim()).ToArray();
        var rows = await repository.ToListAsync(
            repository.Departments.Where(item =>
                item.DeptCompCode == companyCode && codes.Contains(item.DeptCode)),
            cancellationToken);
        var existingCodes = rows.Select(row => row.DeptCode).ToHashSet(StringComparer.Ordinal);
        if (codes.Any(code => !existingCodes.Contains(code)))
        {
            throw new CompanyValidationException(new Dictionary<string, string[]>
            {
                ["departmentCodes"] = ["Every selected department must belong to this company."],
            });
        }
        EnsureDepartmentGroupsConsistent(rows);

        var now = _timeProvider.GetUtcNow().UtcDateTime;
        var additions = rows.GroupBy(row => row.DeptCode)
            .Where(group => group.All(row => row.DeptDivnCode != divisionCode))
            .Select(group => CloneDepartment(group.First(), divisionCode, now))
            .ToArray();
        foreach (var addition in additions)
        {
            repository.Add(addition);
        }
        if (additions.Length > 0)
        {
            await SaveChangesWithConflictCheckAsync(
                cancellationToken,
                "A department assignment already exists for this division.");
        }

        return rows.GroupBy(row => row.DeptCode)
            .Select(group => ToDepartmentDto(group.Concat(
                additions.Where(item => item.DeptCode == group.Key))))
            .ToArray();
    }

    public async Task<DivisionDto?> UpdateDivisionAsync(
        string companyCode,
        string divisionCode,
        UpdateDivisionRequest request,
        CancellationToken cancellationToken)
    {
        var errors = Validate(request);
        if (errors.Count > 0)
        {
            throw new CompanyValidationException(errors);
        }

        var divisions = await repository.ToListAsync(
            repository.Divisions.Where(division =>
                division.DivnCompCode == companyCode && division.DivnCode == divisionCode),
            cancellationToken);
        if (divisions.Count == 0)
        {
            return null;
        }

        var division = divisions[0];
        ApplyDivisionDetails(division, request);
        division.DivnUpBy = "Admin";
        division.DivnUpDt = _timeProvider.GetUtcNow().UtcDateTime;
        await repository.SaveChangesAsync(cancellationToken);
        var departments = await repository.ToListAsync(
            repository.Departments.Where(item =>
                item.DeptCompCode == companyCode && item.DeptDivnCode == divisionCode),
            cancellationToken);
        return ToDivisionDto(division, departments);
    }

    public async Task<bool> DeleteDivisionAsync(
        string companyCode,
        string divisionCode,
        CancellationToken cancellationToken)
    {
        var divisions = await repository.ToListAsync(
            repository.Divisions.Where(division =>
                division.DivnCompCode == companyCode && division.DivnCode == divisionCode),
            cancellationToken);
        if (divisions.Count == 0)
        {
            return false;
        }
        if (await repository.AnyAsync(
                repository.Departments.Where(department =>
                    department.DeptCompCode == companyCode && department.DeptDivnCode == divisionCode),
                cancellationToken))
        {
            throw new CompanyConflictException(
                "Remove the division's department assignments before deleting this division.");
        }

        repository.Remove(divisions[0]);
        await repository.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> RemoveDepartmentAssignmentAsync(
        string companyCode,
        string divisionCode,
        string departmentCode,
        CancellationToken cancellationToken)
    {
        var rows = await repository.ToListAsync(
            repository.Departments.Where(department =>
                department.DeptCompCode == companyCode &&
                department.DeptDivnCode == divisionCode &&
                department.DeptCode == departmentCode),
            cancellationToken);
        if (rows.Count == 0)
        {
            return false;
        }

        var assignments = await repository.ToListAsync(
            repository.Departments.Where(department =>
                department.DeptCompCode == companyCode && department.DeptCode == departmentCode),
            cancellationToken);
        if (assignments.Count <= 1)
        {
            throw new CompanyConflictException(
                "A department must remain assigned to at least one division.");
        }

        repository.Remove(rows[0]);
        await repository.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task<bool> CompanyExistsAsync(string companyCode, CancellationToken cancellationToken) =>
        await repository.AnyAsync(
            repository.Companies.Where(company => company.CompCode == companyCode),
            cancellationToken);

    private async Task SaveChangesWithConflictCheckAsync(
        CancellationToken cancellationToken,
        string conflictMessage)
    {
        try
        {
            await repository.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (FindOracleException(exception)?.Number == 1)
        {
            throw new CompanyConflictException(conflictMessage);
        }
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

    private static Dictionary<string, string[]> Validate(object request)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(request, new ValidationContext(request), results, validateAllProperties: true);
        return results.SelectMany(result => result.MemberNames.DefaultIfEmpty(string.Empty)
                .Select(member => (member, result.ErrorMessage ?? "The value is invalid.")))
            .GroupBy(item => item.member, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(group => group.Key, group => group.Select(item => item.Item2).ToArray());
    }

    private static StdDivision ToDivisionEntity(
        string companyCode,
        CreateDivisionRequest request,
        DateTime now) =>
        new()
        {
            DivnCompCode = companyCode,
            DivnCode = request.DivisionCode.Trim(),
            DivnName = request.Name.Trim(),
            DivnShortName = request.ShortName,
            DivnNameL2 = request.NameL2,
            DivnShortNameL2 = request.ShortNameL2,
            DivnAddr1 = request.Address1,
            DivnAddr2 = request.Address2,
            DivnAddr3 = request.Address3,
            DivnAddr1L2 = request.Address1L2,
            DivnAddr2L2 = request.Address2L2,
            DivnAddr3L2 = request.Address3L2,
            DivnCrNo = request.CommercialRegistrationNumber,
            DivnLicenseIssDt = ToDateTime(request.LicenceIssueDate),
            DivnLicenseExpDt = ToDateTime(request.LicenceExpiryDate),
            DivnIncharge = request.InCharge,
            DivnInchargeL2 = request.InChargeL2,
            DivnPhone = request.Phone,
            DivnFax = request.Fax,
            DivnMobile = request.Mobile,
            DivnEmail = request.Email,
            DivnRemarks = request.Remarks,
            DivnActiveYn = request.Active ?? "Y",
            DivnCrBy = "Admin",
            DivnCrDt = now,
            DivnUpBy = "Admin",
            DivnUpDt = now,
        };

    private static void ApplyDivisionDetails(StdDivision division, UpdateDivisionRequest request)
    {
        division.DivnName = request.Name.Trim();
        division.DivnShortName = request.ShortName;
        division.DivnNameL2 = request.NameL2;
        division.DivnShortNameL2 = request.ShortNameL2;
        division.DivnAddr1 = request.Address1;
        division.DivnAddr2 = request.Address2;
        division.DivnAddr3 = request.Address3;
        division.DivnAddr1L2 = request.Address1L2;
        division.DivnAddr2L2 = request.Address2L2;
        division.DivnAddr3L2 = request.Address3L2;
        division.DivnCrNo = request.CommercialRegistrationNumber;
        division.DivnLicenseIssDt = ToDateTime(request.LicenceIssueDate);
        division.DivnLicenseExpDt = ToDateTime(request.LicenceExpiryDate);
        division.DivnIncharge = request.InCharge;
        division.DivnInchargeL2 = request.InChargeL2;
        division.DivnPhone = request.Phone;
        division.DivnFax = request.Fax;
        division.DivnMobile = request.Mobile;
        division.DivnEmail = request.Email;
        division.DivnRemarks = request.Remarks;
        division.DivnActiveYn = request.Active ?? "Y";
    }

    private static DivisionDto ToDivisionDto(StdDivision division, IEnumerable<StdDepartment> departments) =>
        new()
        {
            DivisionCode = division.DivnCode,
            Name = division.DivnName,
            ShortName = division.DivnShortName,
            NameL2 = division.DivnNameL2,
            ShortNameL2 = division.DivnShortNameL2,
            Address1 = division.DivnAddr1,
            Address2 = division.DivnAddr2,
            Address3 = division.DivnAddr3,
            Address1L2 = division.DivnAddr1L2,
            Address2L2 = division.DivnAddr2L2,
            Address3L2 = division.DivnAddr3L2,
            CommercialRegistrationNumber = division.DivnCrNo,
            LicenceIssueDate = ToDateOnly(division.DivnLicenseIssDt),
            LicenceExpiryDate = ToDateOnly(division.DivnLicenseExpDt),
            InCharge = division.DivnIncharge,
            InChargeL2 = division.DivnInchargeL2,
            Phone = division.DivnPhone,
            Fax = division.DivnFax,
            Mobile = division.DivnMobile,
            Email = division.DivnEmail,
            Remarks = division.DivnRemarks,
            Active = division.DivnActiveYn,
            Departments = departments.GroupBy(department => department.DeptCode)
                .OrderBy(group => group.Key)
                .Select(ToDepartmentDto)
                .ToArray(),
        };

    private static DepartmentDto ToDepartmentDto(IGrouping<string, StdDepartment> departments)
    {
        var first = departments.First();
        return new DepartmentDto
        {
            DepartmentCode = first.DeptCode,
            Name = first.DeptName,
            ShortName = first.DeptShortName,
            NameL2 = first.DeptNameL2,
            ShortNameL2 = first.DeptShortNameL2,
            InCharge = first.DeptIncharge,
            InChargeL2 = first.DeptInchargeL2,
            Remarks = first.DeptRemarks,
            Active = first.DeptActiveYn,
            DivisionCodes = departments.Select(department => department.DeptDivnCode)
                .Distinct(StringComparer.Ordinal)
                .OrderBy(code => code)
                .ToArray(),
        };
    }

    private static DepartmentDto ToDepartmentDto(IEnumerable<StdDepartment> departments) =>
        ToDepartmentDto(departments.GroupBy(department => department.DeptCode).Single());

    private static StdDepartment ToDepartmentEntity(
        string companyCode,
        string divisionCode,
        CreateDepartmentRequest request,
        DateTime now) =>
        new()
        {
            DeptCompCode = companyCode,
            DeptDivnCode = divisionCode,
            DeptCode = request.DepartmentCode.Trim(),
            DeptName = request.Name.Trim(),
            DeptShortName = request.ShortName,
            DeptNameL2 = request.NameL2,
            DeptShortNameL2 = request.ShortNameL2,
            DeptIncharge = request.InCharge,
            DeptInchargeL2 = request.InChargeL2,
            DeptRemarks = request.Remarks,
            DeptActiveYn = request.Active ?? "Y",
            DeptCrBy = "Admin",
            DeptCrDt = now,
            DeptUpBy = "Admin",
            DeptUpDt = now,
        };

    private static StdDepartment CloneDepartment(StdDepartment source, string divisionCode, DateTime now) =>
        new()
        {
            DeptCompCode = source.DeptCompCode,
            DeptDivnCode = divisionCode,
            DeptCode = source.DeptCode,
            DeptName = source.DeptName,
            DeptShortName = source.DeptShortName,
            DeptNameL2 = source.DeptNameL2,
            DeptShortNameL2 = source.DeptShortNameL2,
            DeptIncharge = source.DeptIncharge,
            DeptInchargeL2 = source.DeptInchargeL2,
            DeptRemarks = source.DeptRemarks,
            DeptActiveYn = source.DeptActiveYn,
            DeptCrBy = "Admin",
            DeptCrDt = now,
            DeptUpBy = "Admin",
            DeptUpDt = now,
        };

    private static bool DepartmentDetailsMatch(StdDepartment existing, CreateDepartmentRequest request) =>
        existing.DeptName == request.Name.Trim() &&
        existing.DeptShortName == request.ShortName &&
        existing.DeptNameL2 == request.NameL2 &&
        existing.DeptShortNameL2 == request.ShortNameL2 &&
        existing.DeptIncharge == request.InCharge &&
        existing.DeptInchargeL2 == request.InChargeL2 &&
        existing.DeptRemarks == request.Remarks &&
        existing.DeptActiveYn == (request.Active ?? "Y");

    private static void EnsureConsistentDepartmentDetails(IReadOnlyCollection<StdDepartment> rows)
    {
        if (rows.Count < 2)
        {
            return;
        }
        var first = rows.First();
        if (rows.Skip(1).Any(row =>
                row.DeptName != first.DeptName ||
                row.DeptShortName != first.DeptShortName ||
                row.DeptNameL2 != first.DeptNameL2 ||
                row.DeptShortNameL2 != first.DeptShortNameL2 ||
                row.DeptIncharge != first.DeptIncharge ||
                row.DeptInchargeL2 != first.DeptInchargeL2 ||
                row.DeptRemarks != first.DeptRemarks ||
                row.DeptActiveYn != first.DeptActiveYn))
        {
            throw new CompanyConflictException(
                $"Department '{first.DeptCode}' has inconsistent details across its division assignments.");
        }
    }

    private static void EnsureDepartmentGroupsConsistent(IEnumerable<StdDepartment> rows)
    {
        foreach (var group in rows.GroupBy(row => row.DeptCode))
        {
            EnsureConsistentDepartmentDetails(group.ToArray());
        }
    }

    private static DateTime? ToDateTime(DateOnly? date) =>
        date is null ? null : date.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);

    private static DateOnly? ToDateOnly(DateTime? date) =>
        date is null ? null : DateOnly.FromDateTime(date.Value);
}
