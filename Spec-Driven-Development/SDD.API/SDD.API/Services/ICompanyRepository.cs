using SDD.API.Data.Entities;

namespace SDD.API.Services;

public interface ICompanyRepository
{
    IQueryable<StdCompany> Companies { get; }

    IQueryable<StdDepartment> Departments { get; }

    void Add(StdCompany company);

    void Remove(StdCompany company);

    Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);

    Task<bool> AnyAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);

    Task<List<T>> ToListAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
