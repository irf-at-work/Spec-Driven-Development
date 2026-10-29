using System.Text.Json;
using SDD.API.Common;

namespace SDD.API.Tests.Common;

public sealed class PaginatedResultTests
{
    [Fact]
    public void Defaults_to_an_empty_first_page_with_page_size_ten()
    {
        var result = new PaginatedResult<int>();

        Assert.Empty(result.Items);
        Assert.Equal(1, result.Page);
        Assert.Equal(10, result.PageSize);
        Assert.Equal(0, result.TotalCount);
    }

    [Fact]
    public void Can_be_extended_by_application_specific_result_types()
    {
        var result = new ExtendedPaginatedResult { ContinuationToken = "next" };

        Assert.Equal("next", result.ContinuationToken);
        Assert.IsAssignableFrom<PaginatedResult<int>>(result);
    }

    [Fact]
    public void Serializes_items_and_metadata_using_the_shared_json_names()
    {
        var result = new PaginatedResult<int>
        {
            Items = [4, 8],
            Page = 2,
            PageSize = 2,
            TotalCount = 5,
        };

        using var document = JsonDocument.Parse(
            JsonSerializer.Serialize(result, new JsonSerializerOptions(JsonSerializerDefaults.Web)));
        var root = document.RootElement;

        Assert.Equal(JsonValueKind.Array, root.GetProperty("items").ValueKind);
        Assert.Equal(2, root.GetProperty("page").GetInt32());
        Assert.Equal(2, root.GetProperty("pageSize").GetInt32());
        Assert.Equal(5, root.GetProperty("totalCount").GetInt32());
        Assert.Equal(8, root.GetProperty("items")[1].GetInt32());
    }

    [Fact]
    public void Retains_metadata_for_an_empty_out_of_range_page()
    {
        var result = new PaginatedResult<int>
        {
            Page = 7,
            PageSize = 10,
            TotalCount = 23,
        };

        Assert.Empty(result.Items);
        Assert.Equal(7, result.Page);
        Assert.Equal(10, result.PageSize);
        Assert.Equal(23, result.TotalCount);
    }

    private sealed class ExtendedPaginatedResult : PaginatedResult<int>
    {
        public string? ContinuationToken { get; init; }
    }
}
