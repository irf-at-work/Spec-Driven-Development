using Microsoft.EntityFrameworkCore;
using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Data;

public sealed class CompanyRepository(BrokerDataContext context) : ICompanyRepository
{
    public IQueryable<StdCompany> Companies => context.StdCompanies;

    public IQueryable<StdDepartment> Departments => context.StdDepartments;

    public void Add(StdCompany company) => context.StdCompanies.Add(company);

    public void Remove(StdCompany company) => context.StdCompanies.Remove(company);

    public Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken cancellationToken) =>
        EntityFrameworkQueryableExtensions.CountAsync(query, cancellationToken);

    public Task<bool> AnyAsync<T>(IQueryable<T> query, CancellationToken cancellationToken) =>
        EntityFrameworkQueryableExtensions.AnyAsync(query, cancellationToken);

    public Task<List<T>> ToListAsync<T>(IQueryable<T> query, CancellationToken cancellationToken) =>
        EntityFrameworkQueryableExtensions.ToListAsync(query, cancellationToken);

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken) =>
        context.SaveChangesAsync(cancellationToken);
}
