using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Tests.Services;

internal sealed class FakeListItemRepository : IListItemRepository
{
    private readonly List<StdListItem> _pendingAdds = [];
    private readonly List<StdListItem> _pendingRemovals = [];

    public List<StdListItem> Rows { get; } = [];

    public IQueryable<StdListItem> ListItems => Rows.AsQueryable();

    public int SaveCount { get; private set; }

    public Exception? SaveException { get; set; }

    public void Add(StdListItem item) => _pendingAdds.Add(item);

    public void Remove(StdListItem item) => _pendingRemovals.Add(item);

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
        if (SaveException is not null)
        {
            _pendingAdds.Clear();
            _pendingRemovals.Clear();
            throw SaveException;
        }

        Rows.AddRange(_pendingAdds);
        foreach (var item in _pendingRemovals) Rows.Remove(item);
        _pendingAdds.Clear();
        _pendingRemovals.Clear();
        SaveCount++;
        return Task.FromResult(1);
    }
}
