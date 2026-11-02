using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Tests.Services;

public sealed class ListItemServiceDeleteTests
{
    [Fact]
    public async Task Deletes_existing_composite_identity_and_returns_false_for_missing_item()
    {
        var repository = new FakeListItemRepository();
        repository.Rows.Add(new StdListItem { LiType = "COUNTRY", LiCode = "AE" });
        var service = new ListItemService(repository);

        var deleted = await service.DeleteAsync("COUNTRY", "AE", CancellationToken.None);
        var missing = await service.DeleteAsync("COUNTRY", "XX", CancellationToken.None);

        Assert.True(deleted);
        Assert.False(missing);
        Assert.Empty(repository.Rows);
        Assert.Equal(1, repository.SaveCount);
    }

    [Fact]
    public async Task Preserves_item_when_repository_reports_a_reference_conflict()
    {
        var repository = new FakeListItemRepository();
        repository.Rows.Add(new StdListItem { LiType = "COUNTRY", LiCode = "AE" });
        repository.SaveException = new ListItemReferenceException();
        var service = new ListItemService(repository);

        await Assert.ThrowsAsync<ListItemReferenceException>(() =>
            service.DeleteAsync("COUNTRY", "AE", CancellationToken.None));

        var retained = Assert.Single(repository.Rows);
        Assert.Equal("COUNTRY", retained.LiType);
        Assert.Equal("AE", retained.LiCode);
        Assert.Equal(0, repository.SaveCount);
    }
}
