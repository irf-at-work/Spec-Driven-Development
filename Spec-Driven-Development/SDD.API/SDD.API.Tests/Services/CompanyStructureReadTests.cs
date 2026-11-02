using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Tests.Services;

public sealed class CompanyStructureReadTests
{
    [Fact]
    public async Task Returns_each_company_division_with_its_assigned_departments()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.CompanyRows.AddRange(
        [
            new() { CompCode = "C01", CompName = "Company" },
            new() { CompCode = "C02", CompName = "Other company" },
        ]);
        repository.DivisionRows.AddRange(
        [
            new() { DivnCompCode = "C01", DivnCode = "NORTH", DivnName = "Northern Office" },
            new() { DivnCompCode = "C01", DivnCode = "SOUTH", DivnName = "Southern Office" },
            new() { DivnCompCode = "C02", DivnCode = "WEST", DivnName = "Other Office" },
        ]);
        repository.DepartmentRows.AddRange(
        [
            Department("NORTH", "FIN"),
            Department("SOUTH", "FIN"),
            Department("SOUTH", "IT"),
            Department("WEST", "OTHER", "C02"),
        ]);
        var service = new CompanyStructureService(repository);

        var result = await service.GetDivisionsAsync("C01", CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(["NORTH", "SOUTH"], result.Select(division => division.DivisionCode));
        Assert.Equal(["FIN"], result[0].Departments.Select(department => department.DepartmentCode));
        Assert.Equal(["FIN", "IT"], result[1].Departments.Select(department => department.DepartmentCode));
        Assert.Equal(["NORTH"], result[0].Departments[0].DivisionCodes);
    }

    [Fact]
    public async Task Returns_company_scoped_logical_departments_with_all_division_assignments()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.CompanyRows.Add(new() { CompCode = "C01", CompName = "Company" });
        repository.DepartmentRows.AddRange(
        [
            Department("NORTH", "FIN"),
            Department("SOUTH", "FIN"),
            Department("NORTH", "IT"),
        ]);
        var service = new CompanyStructureService(repository);

        var result = await service.GetDepartmentsAsync("C01", CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(["FIN", "IT"], result.Select(department => department.DepartmentCode));
        Assert.Equal(["NORTH", "SOUTH"], result[0].DivisionCodes);
    }

    [Fact]
    public async Task Does_not_return_structure_for_an_unknown_company()
    {
        var service = new CompanyStructureService(new FakeCompanyStructureRepository());

        Assert.Null(await service.GetDivisionsAsync("MISSING", CancellationToken.None));
        Assert.Null(await service.GetDepartmentsAsync("MISSING", CancellationToken.None));
    }

    [Fact]
    public async Task Rejects_inconsistent_logical_department_rows_in_read_results()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.CompanyRows.Add(new() { CompCode = "C01", CompName = "Company" });
        repository.DepartmentRows.AddRange(
        [
            Department("NORTH", "FIN"),
            new()
            {
                DeptCompCode = "C01",
                DeptDivnCode = "SOUTH",
                DeptCode = "FIN",
                DeptName = "Finance and Accounting",
            },
        ]);
        var service = new CompanyStructureService(repository);

        await Assert.ThrowsAsync<CompanyConflictException>(() =>
            service.GetDepartmentsAsync("C01", CancellationToken.None));
    }

    private static StdDepartment Department(string divisionCode, string departmentCode, string companyCode = "C01") =>
        new()
        {
            DeptCompCode = companyCode,
            DeptDivnCode = divisionCode,
            DeptCode = departmentCode,
            DeptName = departmentCode == "FIN" ? "Finance" : departmentCode,
            DeptActiveYn = "Y",
        };
}
