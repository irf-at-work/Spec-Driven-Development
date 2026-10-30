using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Tests.Services;

public sealed class CompanyServiceDeleteTests
{
    [Fact]
    public async Task Deletes_unreferenced_company_without_cascading()
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.Add(new() { CompCode = "SAFE", CompName = "Safe company" });
        repository.DepartmentRows.Add(new()
        {
            DeptCompCode = "OTHER",
            DeptDivnCode = "DIV",
            DeptCode = "DEPT",
            DeptName = "Unrelated department",
        });
        var service = new CompanyService(repository);

        var deleted = await service.DeleteAsync("SAFE", CancellationToken.None);

        Assert.True(deleted);
        Assert.Empty(repository.CompanyRows);
        Assert.Single(repository.DepartmentRows);
        Assert.Equal(1, repository.SaveCount);
    }

    [Fact]
    public async Task Returns_false_when_company_does_not_exist()
    {
        var repository = new FakeCompanyRepository();
        var service = new CompanyService(repository);

        var deleted = await service.DeleteAsync("MISSING", CancellationToken.None);

        Assert.False(deleted);
        Assert.Equal(0, repository.SaveCount);
    }

    [Fact]
    public async Task Refuses_deletion_when_a_department_references_company()
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.Add(new() { CompCode = "USED", CompName = "Used company" });
        repository.DepartmentRows.Add(new()
        {
            DeptCompCode = "USED",
            DeptDivnCode = "DIV",
            DeptCode = "DEPT",
            DeptName = "Department",
        });
        var service = new CompanyService(repository);

        await Assert.ThrowsAsync<CompanyReferenceException>(
            () => service.DeleteAsync("USED", CancellationToken.None));

        Assert.Single(repository.CompanyRows);
        Assert.Single(repository.DepartmentRows);
        Assert.Equal(0, repository.SaveCount);
    }
}
