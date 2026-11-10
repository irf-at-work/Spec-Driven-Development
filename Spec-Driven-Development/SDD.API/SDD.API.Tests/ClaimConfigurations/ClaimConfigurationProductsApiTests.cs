using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace SDD.API.Tests.ClaimConfigurations;

public sealed class ClaimConfigurationProductsApiTests(ClaimConfigurationImportApiFactory factory)
    : IClassFixture<ClaimConfigurationImportApiFactory>
{
    private readonly HttpClient client = factory.CreateClient();
    private static CancellationToken Cancellation => TestContext.Current.CancellationToken;

    [Fact]
    public async Task Association_list_defaults_to_ten_accepts_five_and_rejects_an_inactive_product()
    {
        var code = NewCode();
        using var create = await client.PostAsJsonAsync(
            "/api/claim-configurations", new { ccmCode = code, name = "PRODUCT TEST" }, Cancellation);
        Assert.Equal(HttpStatusCode.OK, create.StatusCode);

        try
        {
            using var defaultPage = await client.GetAsync($"/api/claim-configurations/{code}/products", Cancellation);
            using var defaultJson = JsonDocument.Parse(await defaultPage.Content.ReadAsStringAsync(Cancellation));
            Assert.Equal(10, defaultJson.RootElement.GetProperty("pageSize").GetInt32());

            using var fiveRows = await client.GetAsync($"/api/claim-configurations/{code}/products?page=1&pageSize=5", Cancellation);
            using var fiveJson = JsonDocument.Parse(await fiveRows.Content.ReadAsStringAsync(Cancellation));
            Assert.Equal(5, fiveJson.RootElement.GetProperty("pageSize").GetInt32());

            using var addUnknown = await client.PostAsJsonAsync(
                $"/api/claim-configurations/{code}/products",
                new { productCode = "ZZ_UNKNOWN" }, Cancellation);
            Assert.Equal(HttpStatusCode.BadRequest, addUnknown.StatusCode);

            using var productLookup = await client.GetAsync(
                "/api/products/ZZ_UNKNOWN/claim-configurations?page=1&pageSize=10", Cancellation);
            Assert.Equal(HttpStatusCode.OK, productLookup.StatusCode);
        }
        finally
        {
            using var delete = await client.DeleteAsync($"/api/claim-configurations/{code}", Cancellation);
        }
    }

    private static string NewCode() => ("ZT" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant();
}
