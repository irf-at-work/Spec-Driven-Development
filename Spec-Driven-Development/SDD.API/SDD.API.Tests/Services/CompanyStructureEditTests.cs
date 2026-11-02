using SDD.API.Contracts;
using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Tests.Services;

public sealed class CompanyStructureEditTests
{
    [Fact]
    public async Task Updates_division_details_and_audit_fields()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.DivisionRows.Add(new()
        {
            DivnCompCode = "C01",
            DivnCode = "NORTH",
            DivnName = "Old name",
        });
        var service = new CompanyStructureService(repository);

        var updated = await service.UpdateDivisionAsync(
            "C01",
            "NORTH",
            new UpdateDivisionRequest { Name = "Northern Office", ShortName = "North" },
            CancellationToken.None);

        Assert.NotNull(updated);
        Assert.Equal("Northern Office", updated.Name);
        Assert.Equal("North", updated.ShortName);
        Assert.Equal("Admin", repository.DivisionRows[0].DivnUpBy);
        Assert.Equal(1, repository.SaveCount);
    }

    [Fact]
    public async Task Deletes_division_and_moves_departments_to_the_selected_division()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.CompanyRows.Add(new() { CompCode = "C01", CompName = "Company" });
        repository.DivisionRows.Add(Division("NORTH"));
        repository.DivisionRows.Add(Division("SOUTH"));
        repository.DepartmentRows.Add(Department("NORTH", "FIN"));
        repository.DepartmentRows.Add(Department("NORTH", "IT"));
        var service = new CompanyStructureService(repository);

        var deleted = await service.DeleteDivisionAsync(
            "C01",
            "NORTH",
            "SOUTH",
            CancellationToken.None);

        Assert.True(deleted);
        Assert.Equal(["SOUTH"], repository.DivisionRows.Select(division => division.DivnCode));
        Assert.Equal(
            ["FIN", "IT"],
            repository.DepartmentRows.Select(department => department.DeptCode).OrderBy(code => code));
        Assert.All(repository.DepartmentRows, department => Assert.Equal("SOUTH", department.DeptDivnCode));
        Assert.Equal(1, repository.SaveCount);
    }

    [Fact]
    public async Task Division_deletion_keeps_departments_already_assigned_to_the_destination()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.DivisionRows.AddRange([Division("NORTH"), Division("SOUTH")]);
        repository.DepartmentRows.AddRange(
        [
            Department("NORTH", "FIN"),
            Department("SOUTH", "FIN"),
            Department("NORTH", "IT"),
        ]);
        var service = new CompanyStructureService(repository);

        var deleted = await service.DeleteDivisionAsync(
            "C01",
            "NORTH",
            "SOUTH",
            CancellationToken.None);

        Assert.True(deleted);
        Assert.Equal(["FIN", "IT"], repository.DepartmentRows.Select(department => department.DeptCode).OrderBy(code => code));
        Assert.All(repository.DepartmentRows, department => Assert.Equal("SOUTH", department.DeptDivnCode));
        Assert.Equal(1, repository.SaveCount);
    }

    [Fact]
    public async Task Division_deletion_requires_an_existing_destination_when_departments_remain()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.DivisionRows.Add(Division("NORTH"));
        repository.DepartmentRows.Add(Department("NORTH", "FIN"));
        var service = new CompanyStructureService(repository);

        await Assert.ThrowsAsync<CompanyConflictException>(() =>
            service.DeleteDivisionAsync("C01", "NORTH", null, CancellationToken.None));

        Assert.Single(repository.DivisionRows);
        Assert.Single(repository.DepartmentRows);
        Assert.Equal("NORTH", repository.DepartmentRows[0].DeptDivnCode);
        Assert.Equal(0, repository.SaveCount);
    }

    [Fact]
    public async Task Links_existing_departments_without_duplicate_assignments()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.CompanyRows.Add(new() { CompCode = "C01", CompName = "Company" });
        repository.DivisionRows.Add(Division("NORTH"));
        repository.DepartmentRows.AddRange(
        [
            Department("NORTH", "FIN"),
            Department("SOUTH", "FIN"),
            Department("SOUTH", "IT"),
        ]);
        var service = new CompanyStructureService(repository);

        var firstLink = await service.LinkExistingDepartmentsAsync(
            "C01",
            "NORTH",
            ["FIN", "IT"],
            CancellationToken.None);
        var secondLink = await service.LinkExistingDepartmentsAsync(
            "C01",
            "NORTH",
            ["FIN", "IT"],
            CancellationToken.None);

        Assert.Equal(2, firstLink.Count);
        Assert.Equal(["NORTH", "SOUTH"], firstLink.Single(department => department.DepartmentCode == "FIN").DivisionCodes);
        Assert.Equal(["NORTH", "SOUTH"], firstLink.Single(department => department.DepartmentCode == "IT").DivisionCodes);
        Assert.Equal(4, repository.DepartmentRows.Count);
        Assert.Equal(1, repository.SaveCount);
        Assert.Equal(2, secondLink.Count);
    }

    [Fact]
    public async Task Removes_one_assignment_and_preserves_the_other_assignments()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.DepartmentRows.AddRange(
        [
            Department("NORTH", "FIN"),
            Department("SOUTH", "FIN"),
        ]);
        var service = new CompanyStructureService(repository);

        var removed = await service.RemoveDepartmentAssignmentAsync(
            "C01",
            "NORTH",
            "FIN",
            CancellationToken.None);

        Assert.True(removed);
        Assert.Equal(["SOUTH"], repository.DepartmentRows.Select(row => row.DeptDivnCode));
        Assert.Equal(1, repository.SaveCount);
    }

    [Fact]
    public async Task Removes_the_final_department_assignment()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.DepartmentRows.Add(Department("NORTH", "FIN"));
        var service = new CompanyStructureService(repository);

        var removed = await service.RemoveDepartmentAssignmentAsync(
            "C01",
            "NORTH",
            "FIN",
            CancellationToken.None);

        Assert.True(removed);
        Assert.Empty(repository.DepartmentRows);
        Assert.Equal(1, repository.SaveCount);
    }

    private static StdDivision Division(string divisionCode) =>
        new()
        {
            DivnCompCode = "C01",
            DivnCode = divisionCode,
            DivnName = divisionCode,
        };

    private static StdDepartment Department(string divisionCode, string departmentCode) =>
        new()
        {
            DeptCompCode = "C01",
            DeptDivnCode = divisionCode,
            DeptCode = departmentCode,
            DeptName = departmentCode == "FIN" ? "Finance" : "Information Technology",
            DeptActiveYn = "Y",
        };
}
