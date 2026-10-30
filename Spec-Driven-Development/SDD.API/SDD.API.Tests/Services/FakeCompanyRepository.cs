using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Tests.Services;

internal sealed class FakeCompanyRepository : ICompanyRepository
{
    public List<StdCompany> CompanyRows { get; } = [];

    public List<StdDepartment> DepartmentRows { get; } = [];

    public IQueryable<StdCompany> Companies => CompanyRows.AsQueryable();

    public IQueryable<StdDepartment> Departments => DepartmentRows.AsQueryable();

    public int SaveCount { get; private set; }

    public void Add(StdCompany company) => CompanyRows.Add(company);

    public void Remove(StdCompany company) => CompanyRows.Remove(company);

    public Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(query.Count());
    }

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
        return Task.FromResult(1);
    }
}
