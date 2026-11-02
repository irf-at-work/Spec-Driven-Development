using SDD.API.Contracts;
using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Tests.Services;

public sealed class ListItemServiceWriteTests
{
    [Fact]
    public async Task Creates_list_item_with_default_active_status_and_audit_values()
    {
        var repository = new FakeListItemRepository();
        var now = new DateTimeOffset(2026, 11, 2, 12, 0, 0, TimeSpan.Zero);
        var service = new ListItemService(repository, new FixedTimeProvider(now));

        var result = await service.CreateAsync(new CreateListItemRequest
        {
            LiType = "COUNTRY",
            LiCode = "AE",
            Description = "United Arab Emirates",
        }, CancellationToken.None);

        var row = Assert.Single(repository.Rows);
        Assert.Equal("Y", row.LiActiveYn);
        Assert.Equal("Admin", result.CreatedBy);
        Assert.Equal(now.UtcDateTime, result.CreatedAt);
        Assert.Equal("Admin", result.LastUpdatedBy);
        Assert.Equal(now.UtcDateTime, result.LastUpdatedAt);
        Assert.Equal(1, repository.SaveCount);
    }

    [Fact]
    public async Task Rejects_duplicate_identity_and_invalid_lengths_or_active_status()
    {
        var repository = new FakeListItemRepository();
        repository.Rows.Add(new StdListItem { LiType = "T", LiCode = "C" });
        var service = new ListItemService(repository);

        await Assert.ThrowsAsync<ListItemConflictException>(() =>
            service.CreateAsync(new CreateListItemRequest { LiType = "T", LiCode = "C" }, CancellationToken.None));

        var error = await Assert.ThrowsAsync<ListItemValidationException>(() =>
            service.CreateAsync(new CreateListItemRequest
            {
                LiType = new string('T', 21),
                LiCode = new string('C', 13),
                Description = new string('D', 101),
                DescriptionL2 = new string('E', 101),
                ShortDescription = new string('S', 31),
                ShortDescriptionL2 = new string('L', 31),
                Value = new string('V', 101),
                ActiveYn = "X",
                Flex01 = new string('1', 101),
                Flex02 = new string('2', 101),
            }, CancellationToken.None));

        foreach (var field in new[]
        {
            "liType", "liCode", "description", "descriptionL2", "shortDescription",
            "shortDescriptionL2", "value", "activeYn", "flex01", "flex02",
        })
        {
            Assert.Contains(field, error.Errors.Keys);
        }
        Assert.Single(repository.Rows);
        Assert.Equal(0, repository.SaveCount);
    }

    [Fact]
    public async Task Rejects_missing_composite_identity_and_concurrent_duplicate_conflict()
    {
        var repository = new FakeListItemRepository();
        var service = new ListItemService(repository);

        var missingIdentity = await Assert.ThrowsAsync<ListItemValidationException>(() =>
            service.CreateAsync(new CreateListItemRequest { LiType = "", LiCode = "" }, CancellationToken.None));
        Assert.Contains("liType", missingIdentity.Errors.Keys);
        Assert.Contains("liCode", missingIdentity.Errors.Keys);

        repository.Rows.Add(new StdListItem { LiType = "COUNTRY", LiCode = "AE" });
        repository.SaveException = new ListItemConflictException("A list item with this type and code already exists.");
        await Assert.ThrowsAsync<ListItemConflictException>(() =>
            service.CreateAsync(new CreateListItemRequest { LiType = "COUNTRY", LiCode = "AE" }, CancellationToken.None));

        Assert.Single(repository.Rows);
        Assert.Equal(0, repository.SaveCount);
    }

    [Fact]
    public async Task Updates_only_provided_values_and_last_write_wins()
    {
        var repository = new FakeListItemRepository();
        repository.Rows.Add(new StdListItem
        {
            LiType = "T",
            LiCode = "C",
            LiDesc = "Old",
            LiDescL2 = "Preserve",
            LiFlex01 = "Preserve too",
        });
        var firstSave = new DateTimeOffset(2026, 11, 2, 12, 0, 0, TimeSpan.Zero);
        var service = new ListItemService(repository, new FixedTimeProvider(firstSave));
        await service.UpdateAsync("T", "C", new UpdateListItemRequest { Description = "First" }, CancellationToken.None);

        var latestTime = firstSave.AddMinutes(1);
        service = new ListItemService(repository, new FixedTimeProvider(latestTime));
        var result = await service.UpdateAsync(
            "T",
            "C",
            new UpdateListItemRequest { Description = "Latest", ActiveYn = "N" },
            CancellationToken.None);

        Assert.NotNull(result);
        var row = Assert.Single(repository.Rows);
        Assert.Equal("T", row.LiType);
        Assert.Equal("C", row.LiCode);
        Assert.Equal("Latest", row.LiDesc);
        Assert.Equal("Preserve", row.LiDescL2);
        Assert.Equal("Preserve too", row.LiFlex01);
        Assert.Equal("N", row.LiActiveYn);
        Assert.Equal("Admin", row.LiUpBy);
        Assert.Equal(latestTime.UtcDateTime, result.LastUpdatedAt);
        Assert.Equal(2, repository.SaveCount);
    }

    private sealed class FixedTimeProvider(DateTimeOffset utcNow) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => utcNow;
    }
}
