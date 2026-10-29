using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(PaginatedResultCollection.Name)]
public sealed class PaginatedResultContractTests(PaginatedResultTestHost host) : PageTest
{
    [Fact]
    public async Task Serializes_populated_and_out_of_range_pages_with_contract_metadata()
    {
        await using var request = await Playwright.APIRequest.NewContextAsync();

        using var populated = await GetResultAsync(request, page: 1, pageSize: 2);
        Assert.Equal(2, populated.RootElement.GetProperty("items").GetArrayLength());
        Assert.Equal(1, populated.RootElement.GetProperty("page").GetInt32());
        Assert.Equal(2, populated.RootElement.GetProperty("pageSize").GetInt32());
        Assert.Equal(2, populated.RootElement.GetProperty("totalCount").GetInt32());

        using var outOfRange = await GetResultAsync(request, page: 4, pageSize: 2);
        Assert.Equal(0, outOfRange.RootElement.GetProperty("items").GetArrayLength());
        Assert.Equal(4, outOfRange.RootElement.GetProperty("page").GetInt32());
        Assert.Equal(2, outOfRange.RootElement.GetProperty("pageSize").GetInt32());
        Assert.Equal(2, outOfRange.RootElement.GetProperty("totalCount").GetInt32());
    }

    private async Task<JsonDocument> GetResultAsync(IAPIRequestContext request, int page, int pageSize)
    {
        var response = await request.GetAsync(
            new Uri(host.Address, $"/paginated-result?page={page}&pageSize={pageSize}").ToString());

        Assert.True(response.Ok, $"The test endpoint returned HTTP {response.Status}.");
        return JsonDocument.Parse(await response.TextAsync());
    }
}
