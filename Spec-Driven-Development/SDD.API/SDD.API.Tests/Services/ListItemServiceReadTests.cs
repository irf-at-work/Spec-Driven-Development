using SDD.API.Contracts;
using SDD.API.Data.Entities;
using SDD.API.Services;

namespace SDD.API.Tests.Services;

public sealed class ListItemServiceReadTests
{
    [Fact]
    public async Task Lists_with_default_page_size_and_deterministic_composite_key_order()
    {
        var repository = new FakeListItemRepository();
        repository.Rows.AddRange(
        [
            new() { LiType = "B", LiCode = "2", LiDesc = "Second" },
            new() { LiType = "A", LiCode = "2", LiDesc = "Second" },
            new() { LiType = "A", LiCode = "1", LiDesc = "First" },
        ]);
        var service = new ListItemService(repository);

        var result = await service.ListAsync(new ListItemListQuery(), CancellationToken.None);

        Assert.Equal(10, result.PageSize);
        Assert.Equal(3, result.TotalCount);
        Assert.Equal(["A:1", "A:2", "B:2"], result.Items.Select(item => $"{item.LiType}:{item.LiCode}"));
    }

    [Fact]
    public async Task Applies_case_insensitive_filter_before_paging_and_allowlists_sorting()
    {
        var repository = new FakeListItemRepository();
        repository.Rows.AddRange(
        [
            new() { LiType = "T", LiCode = "1", LiDesc = "Alpha" },
            new() { LiType = "T", LiCode = "2", LiDesc = "Beta" },
            new() { LiType = "T", LiCode = "3", LiDesc = "ALPINE" },
        ]);
        var service = new ListItemService(repository);

        var result = await service.ListAsync(new ListItemListQuery
        {
            Description = "alp",
            DescriptionOperator = ListItemFilterOperator.Contains,
            Page = 2,
            PageSize = 1,
            SortBy = "liCode",
            SortDirection = "desc",
        }, CancellationToken.None);

        Assert.Equal(2, result.TotalCount);
        Assert.Equal("1", Assert.Single(result.Items).LiCode);
        Assert.Equal(2, result.Page);

        var error = await Assert.ThrowsAsync<ListItemValidationException>(
            () => service.ListAsync(
                new ListItemListQuery { SortBy = "audit" },
                CancellationToken.None));
        Assert.Contains("sortBy", error.Errors.Keys);
    }

    [Fact]
    public async Task Returns_details_and_null_for_missing_composite_identity()
    {
        var repository = new FakeListItemRepository();
        repository.Rows.Add(new StdListItem
        {
            LiType = "COUNTRY",
            LiCode = "AE",
            LiDesc = "United Arab Emirates",
            LiDescL2 = "Arabic description",
            LiFlex01 = "Extra",
            LiCrBy = "Admin",
            LiCrDt = new DateTime(2026, 1, 2),
        });
        var service = new ListItemService(repository);

        var item = await service.GetAsync("COUNTRY", "AE", CancellationToken.None);
        var missing = await service.GetAsync("COUNTRY", "XX", CancellationToken.None);

        Assert.NotNull(item);
        Assert.Equal("Arabic description", item.DescriptionL2);
        Assert.Equal("Extra", item.Flex01);
        Assert.Equal(DateTimeKind.Utc, item.CreatedAt!.Value.Kind);
        Assert.Null(missing);
    }
}
