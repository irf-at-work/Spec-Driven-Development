using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SDD.API.Data.Scaffolded;
using SDD.API.Tests.VehicleMakes;

namespace SDD.API.Tests.PremiumAdjustments;

[Collection("Oracle API")]
public sealed class PremiumAdjustmentOptionsApiTests(OracleApiFactory factory)
{
    private readonly HttpClient client = factory.CreateClient();
    private static CancellationToken Cancellation => TestContext.Current.CancellationToken;

    [Fact]
    public async Task Options_return_four_fixed_lists_ordered_by_description()
    {
        var response = await client.GetAsync("/api/premium-adjustment-options", Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var options = await JsonDocument.ParseAsync(
            await response.Content.ReadAsStreamAsync(Cancellation),
            cancellationToken: Cancellation);

        using var scope = factory.Services.CreateScope();
        var database = scope.ServiceProvider.GetRequiredService<SddDbContext>();
        var listTypes = new Dictionary<string, string>
        {
            ["codeTypes"] = "CALC_TYPE",
            ["discountTypes"] = "DISCOUNT_TYPE",
            ["chargesTypes"] = "CHARGE_TYPE",
            ["chargesCategories"] = "CHARGE_CAT"
        };

        foreach (var (listName, listType) in listTypes)
        {
            var actual = options.RootElement.GetProperty(listName)
                .EnumerateArray()
                .Select(option => (
                    Code: option.GetProperty("code").GetString(),
                    Description: option.GetProperty("description").GetString()))
                .ToArray();
            var expected = await database.StdListItems
                .AsNoTracking()
                .Where(item => item.LiType == listType && item.LiActiveYn == "Y")
                .OrderBy(item => item.LiDesc)
                .Select(item => new { item.LiCode, item.LiDesc })
                .ToArrayAsync(Cancellation);

            Assert.Equal(expected.Select(item => item.LiCode), actual.Select(item => item.Code));
            Assert.Equal(expected.Select(item => item.LiDesc), actual.Select(item => item.Description));
            Assert.Equal(actual.OrderBy(item => item.Description, StringComparer.OrdinalIgnoreCase), actual);
        }
    }

    [Fact]
    public async Task Options_endpoint_does_not_accept_a_client_selected_list_type()
    {
        var response = await client.GetAsync(
            "/api/premium-adjustment-options?listType=UNTRUSTED",
            Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var options = await JsonDocument.ParseAsync(
            await response.Content.ReadAsStreamAsync(Cancellation),
            cancellationToken: Cancellation);
        Assert.True(options.RootElement.TryGetProperty("codeTypes", out _));
        Assert.True(options.RootElement.TryGetProperty("discountTypes", out _));
        Assert.True(options.RootElement.TryGetProperty("chargesTypes", out _));
        Assert.True(options.RootElement.TryGetProperty("chargesCategories", out _));
    }
}
