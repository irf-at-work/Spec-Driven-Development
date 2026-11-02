using Microsoft.EntityFrameworkCore;
using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Data;

public sealed class CompanyStructureRepository(BrokerDataContext context) : ICompanyStructureRepository
{
    public IQueryable<StdCompany> Companies => context.StdCompanies;

    public IQueryable<StdDivision> Divisions => context.StdDivisions;

    public IQueryable<StdDepartment> Departments => context.StdDepartments;

    public void Add(StdDivision division) => context.StdDivisions.Add(division);

    public void Add(StdDepartment department) => context.StdDepartments.Add(department);

    public void Remove(StdDivision division) => context.StdDivisions.Remove(division);

    public void Remove(StdDepartment department) => context.StdDepartments.Remove(department);

    public Task<bool> AnyAsync<T>(IQueryable<T> query, CancellationToken cancellationToken) =>
        EntityFrameworkQueryableExtensions.AnyAsync(query, cancellationToken);

    public Task<List<T>> ToListAsync<T>(IQueryable<T> query, CancellationToken cancellationToken) =>
        EntityFrameworkQueryableExtensions.ToListAsync(query, cancellationToken);

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken) =>
        context.SaveChangesAsync(cancellationToken);
}
