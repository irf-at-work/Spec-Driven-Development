using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace SDD.API.Tests.ClaimConfigurations;

public sealed class ClaimConfigurationListApiTests(ClaimConfigurationImportApiFactory factory)
    : IClassFixture<ClaimConfigurationImportApiFactory>
{
    private readonly HttpClient client = factory.CreateClient();
    private static CancellationToken Cancellation => TestContext.Current.CancellationToken;

    [Theory]
    [InlineData(10)]
    [InlineData(25)]
    [InlineData(50)]
    public async Task List_uses_the_requested_supported_page_size(int pageSize)
    {
        using var response = await client.GetAsync($"/api/claim-configurations?page=1&pageSize={pageSize}", Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
        Assert.Equal(pageSize, document.RootElement.GetProperty("pageSize").GetInt32());
    }

    [Fact]
    public async Task List_defaults_to_ten_and_returns_a_deterministic_order()
    {
        using var response = await client.GetAsync("/api/claim-configurations", Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
        var root = document.RootElement;
        Assert.Equal(1, root.GetProperty("page").GetInt32());
        Assert.Equal(10, root.GetProperty("pageSize").GetInt32());
        var codes = root.GetProperty("items").EnumerateArray()
            .Select(item => item.GetProperty("ccmCode").GetString())
            .ToArray();
        //Assert.Equal(codes.Order(StringComparer.Ordinal), codes);
        Assert.Equal(codes.OrderBy(c => c!.ToUpperInvariant(), StringComparer.Ordinal), codes);
    }

    [Fact]
    public async Task Not_equals_filter_includes_a_row_with_an_empty_short_name()
    {
        var code = NewCode();
        await CreateAsync(code, $"FILTER {code}");
        try
        {
            using var response = await client.GetAsync(
                $"/api/claim-configurations?page=1&pageSize=10&ccmCode={code}&ccmCodeOperator=equals&shortName=FILTER_NO_MATCH&shortNameOperator=notEquals",
                Cancellation);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
            Assert.Contains(document.RootElement.GetProperty("items").EnumerateArray(),
                item => item.GetProperty("ccmCode").GetString() == code);
        }
        finally
        {
            await DeleteAsync(code);
        }
    }

    [Theory]
    [InlineData(0, 10)]
    [InlineData(1, 5)]
    [InlineData(1, 100)]
    public async Task List_rejects_invalid_page_or_page_size(int page, int pageSize)
    {
        using var response = await client.GetAsync(
            $"/api/claim-configurations?page={page}&pageSize={pageSize}", Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }

    private async Task CreateAsync(string code, string name)
    {
        using var response = await client.PostAsJsonAsync(
            "/api/claim-configurations", new { ccmCode = code, name }, Cancellation);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private async Task DeleteAsync(string code)
    {
        using var response = await client.DeleteAsync($"/api/claim-configurations/{code}", Cancellation);
        Assert.True(response.StatusCode is HttpStatusCode.NoContent or HttpStatusCode.NotFound);
    }

    private static string NewCode() => ("ZT" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant();
}
