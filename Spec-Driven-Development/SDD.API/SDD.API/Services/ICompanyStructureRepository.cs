using SDD.API.Data.Entities;

namespace SDD.API.Services;

public interface ICompanyStructureRepository
{
    IQueryable<StdCompany> Companies { get; }
    IQueryable<StdDivision> Divisions { get; }
    IQueryable<StdDepartment> Departments { get; }

    void Add(StdDivision division);
    void Add(StdDepartment department);
    void Remove(StdDivision division);
    void Remove(StdDepartment department);

    Task<bool> AnyAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);
    Task<List<T>> ToListAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
