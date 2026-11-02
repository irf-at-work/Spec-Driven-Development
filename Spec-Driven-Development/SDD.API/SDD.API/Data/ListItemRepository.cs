using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Data;

public sealed class ListItemRepository(BrokerDataContext context) : IListItemRepository
{
    public IQueryable<StdListItem> ListItems => context.StdListItems;

    public void Add(StdListItem item) => context.StdListItems.Add(item);

    public void Remove(StdListItem item) => context.StdListItems.Remove(item);

    public Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken cancellationToken) =>
        EntityFrameworkQueryableExtensions.CountAsync(query, cancellationToken);

    public Task<bool> AnyAsync<T>(IQueryable<T> query, CancellationToken cancellationToken) =>
        EntityFrameworkQueryableExtensions.AnyAsync(query, cancellationToken);

    public Task<List<T>> ToListAsync<T>(IQueryable<T> query, CancellationToken cancellationToken) =>
        EntityFrameworkQueryableExtensions.ToListAsync(query, cancellationToken);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        try
        {
            return await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (FindOracleException(exception)?.Number == 1)
        {
            throw new ListItemConflictException("A list item with this type and code already exists.");
        }
        catch (DbUpdateException exception) when (FindOracleException(exception)?.Number == 2292)
        {
            throw new ListItemReferenceException();
        }
    }

    private static OracleException? FindOracleException(Exception exception)
    {
        for (var current = exception; current is not null; current = current.InnerException!)
        {
            if (current is OracleException oracleException) return oracleException;
        }
        return null;
    }
}
