using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace SDD.API.Tests.ClaimConfigurations;

public sealed class ClaimConfigurationLifecycleApiTests(ClaimConfigurationImportApiFactory factory)
    : IClassFixture<ClaimConfigurationImportApiFactory>
{
    private readonly HttpClient client = factory.CreateClient();
    private static CancellationToken Cancellation => TestContext.Current.CancellationToken;

    [Fact]
    public async Task Configuration_can_be_deactivated_and_reactivated_without_deleting_it()
    {
        var code = ("ZT" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant();
        using var create = await client.PostAsJsonAsync(
            "/api/claim-configurations", new { ccmCode = code, name = "LIFECYCLE TEST" }, Cancellation);
        Assert.Equal(HttpStatusCode.OK, create.StatusCode);

        try
        {
            foreach (var active in new[] { false, true })
            {
                using var update = await client.PutAsJsonAsync(
                    $"/api/claim-configurations/{code}",
                    new { name = "LIFECYCLE TEST", active }, Cancellation);
                Assert.Equal(HttpStatusCode.OK, update.StatusCode);
                using var detail = JsonDocument.Parse(await update.Content.ReadAsStringAsync(Cancellation));
                Assert.Equal(active, detail.RootElement.GetProperty("active").GetBoolean());
            }

            using var listed = await client.GetAsync($"/api/claim-configurations?ccmCode={code}&ccmCodeOperator=equals", Cancellation);
            using var listJson = JsonDocument.Parse(await listed.Content.ReadAsStringAsync(Cancellation));
            Assert.Contains(listJson.RootElement.GetProperty("items").EnumerateArray(),
                item => item.GetProperty("ccmCode").GetString() == code && item.GetProperty("active").GetBoolean());
        }
        finally
        {
            using var delete = await client.DeleteAsync($"/api/claim-configurations/{code}", Cancellation);
        }
    }

    private static string NewCode() => ("ZT" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant();
}
