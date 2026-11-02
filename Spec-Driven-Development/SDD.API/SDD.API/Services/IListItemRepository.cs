using SDD.API.Data.Entities;

namespace SDD.API.Services;

public interface IListItemRepository
{
    IQueryable<StdListItem> ListItems { get; }

    void Add(StdListItem item);

    void Remove(StdListItem item);

    Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);

    Task<bool> AnyAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);

    Task<List<T>> ToListAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
