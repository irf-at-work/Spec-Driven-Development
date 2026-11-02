using SDD.API.Contracts;
using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Tests.Services;

public sealed class CompanyStructureServiceTests
{
    [Fact]
    public async Task Creates_company_scoped_divisions_and_persists_them_immediately()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.CompanyRows.Add(new() { CompCode = "C01", CompName = "Company" });
        var service = new CompanyStructureService(repository);

        var result = await service.CreateDivisionsAsync(
            "C01",
            [
                new CreateDivisionRequest { DivisionCode = "NORTH", Name = "Northern Office" },
                new CreateDivisionRequest { DivisionCode = "SOUTH", Name = "Southern Office" },
            ],
            CancellationToken.None);

        Assert.Equal(["NORTH", "SOUTH"], result.Select(division => division.DivisionCode));
        Assert.Equal(1, repository.SaveCount);
        Assert.All(repository.DivisionRows, division =>
        {
            Assert.Equal("C01", division.DivnCompCode);
            Assert.Equal("Admin", division.DivnCrBy);
            Assert.NotNull(division.DivnCrDt);
        });
    }

    [Fact]
    public async Task Rejects_divisions_for_unknown_company_without_persisting()
    {
        var repository = new FakeCompanyStructureRepository();
        var service = new CompanyStructureService(repository);

        await Assert.ThrowsAsync<CompanyNotFoundException>(() =>
            service.CreateDivisionsAsync(
                "MISSING",
                [new CreateDivisionRequest { DivisionCode = "NORTH", Name = "Northern Office" }],
                CancellationToken.None));

        Assert.Empty(repository.DivisionRows);
        Assert.Equal(0, repository.SaveCount);
    }

    [Fact]
    public async Task Creates_one_department_assignment_for_each_selected_company_division()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.CompanyRows.Add(new() { CompCode = "C01", CompName = "Company" });
        repository.DivisionRows.AddRange(
        [
            new() { DivnCompCode = "C01", DivnCode = "NORTH", DivnName = "Northern Office" },
            new() { DivnCompCode = "C01", DivnCode = "SOUTH", DivnName = "Southern Office" },
            new() { DivnCompCode = "C02", DivnCode = "NORTH", DivnName = "Other Office" },
        ]);
        var service = new CompanyStructureService(repository);

        var result = await service.CreateDepartmentAsync(
            "C01",
            new CreateDepartmentRequest
            {
                DepartmentCode = "FIN",
                Name = "Finance",
                DivisionCodes = ["NORTH", "SOUTH"],
            },
            CancellationToken.None);

        Assert.Equal(["NORTH", "SOUTH"], result.DivisionCodes);
        Assert.Equal(2, repository.DepartmentRows.Count);
        Assert.All(repository.DepartmentRows, department => Assert.Equal("C01", department.DeptCompCode));
        Assert.Equal(1, repository.SaveCount);
    }

    [Fact]
    public async Task Rejects_department_assignment_to_a_division_owned_by_another_company()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.CompanyRows.Add(new() { CompCode = "C01", CompName = "Company" });
        repository.DivisionRows.Add(new()
        {
            DivnCompCode = "C02",
            DivnCode = "NORTH",
            DivnName = "Other Office",
        });
        var service = new CompanyStructureService(repository);

        await Assert.ThrowsAsync<CompanyValidationException>(() =>
            service.CreateDepartmentAsync(
                "C01",
                new CreateDepartmentRequest
                {
                    DepartmentCode = "FIN",
                    Name = "Finance",
                    DivisionCodes = ["NORTH"],
                },
                CancellationToken.None));

        Assert.Empty(repository.DepartmentRows);
        Assert.Equal(0, repository.SaveCount);
    }

    [Fact]
    public async Task Rejects_inconsistent_details_for_existing_company_department_code()
    {
        var repository = new FakeCompanyStructureRepository();
        repository.CompanyRows.Add(new() { CompCode = "C01", CompName = "Company" });
        repository.DivisionRows.Add(new()
        {
            DivnCompCode = "C01",
            DivnCode = "NORTH",
            DivnName = "Northern Office",
        });
        repository.DepartmentRows.Add(new()
        {
            DeptCompCode = "C01",
            DeptDivnCode = "SOUTH",
            DeptCode = "FIN",
            DeptName = "Finance",
        });
        var service = new CompanyStructureService(repository);

        await Assert.ThrowsAsync<CompanyConflictException>(() =>
            service.CreateDepartmentAsync(
                "C01",
                new CreateDepartmentRequest
                {
                    DepartmentCode = "FIN",
                    Name = "Financial Services",
                    DivisionCodes = ["NORTH"],
                },
                CancellationToken.None));

        Assert.Single(repository.DepartmentRows);
        Assert.Equal(0, repository.SaveCount);
    }

    [Fact]
    public async Task Does_not_report_a_successful_save_when_persistence_fails()
    {
        var repository = new FakeCompanyStructureRepository
        {
            SaveException = new InvalidOperationException("The database is unavailable."),
        };
        repository.CompanyRows.Add(new() { CompCode = "C01", CompName = "Company" });
        var service = new CompanyStructureService(repository);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.CreateDivisionsAsync(
                "C01",
                [new CreateDivisionRequest { DivisionCode = "NORTH", Name = "Northern Office" }],
                CancellationToken.None));

        Assert.Equal("The database is unavailable.", exception.Message);
        Assert.Equal(1, repository.SaveCount);
    }
}

internal sealed class FakeCompanyStructureRepository : ICompanyStructureRepository
{
    public List<StdCompany> CompanyRows { get; } = [];

    public List<StdDivision> DivisionRows { get; } = [];

    public List<StdDepartment> DepartmentRows { get; } = [];

    public Exception? SaveException { get; init; }

    public int SaveCount { get; private set; }

    public IQueryable<StdCompany> Companies => CompanyRows.AsQueryable();

    public IQueryable<StdDivision> Divisions => DivisionRows.AsQueryable();

    public IQueryable<StdDepartment> Departments => DepartmentRows.AsQueryable();

    public void Add(StdDivision division) => DivisionRows.Add(division);

    public void Add(StdDepartment department) => DepartmentRows.Add(department);

    public void Remove(StdDivision division) => DivisionRows.Remove(division);

    public void Remove(StdDepartment department) => DepartmentRows.Remove(department);

    public Task<bool> AnyAsync<T>(IQueryable<T> query, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(query.Any());
    }

    public Task<List<T>> ToListAsync<T>(IQueryable<T> query, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(query.ToList());
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        SaveCount++;
        if (SaveException is not null)
        {
            throw SaveException;
        }

        return Task.FromResult(1);
    }
}
