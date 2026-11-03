using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using SDD.API.Tests.VehicleMakes;

namespace SDD.API.Tests.PremiumAdjustments;

[Collection("Oracle API")]
public sealed class PremiumAdjustmentInputRulesTests(OracleApiFactory factory)
{
    private readonly HttpClient client = factory.CreateClient();
    private static CancellationToken Cancellation => TestContext.Current.CancellationToken;

    [Fact]
    public async Task Required_fields_are_reported_by_name()
    {
        var response = await client.PostAsJsonAsync("/api/premium-adjustments", new { }, Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        using var problem = await JsonDocument.ParseAsync(
            await response.Content.ReadAsStreamAsync(Cancellation),
            cancellationToken: Cancellation);
        var errors = problem.RootElement.GetProperty("errors");
        foreach (var field in new[]
        {
            "codeType", "code", "companyCode", "name", "shortName",
            "discountType", "chargesType", "chargesCategory"
        })
        {
            Assert.True(errors.TryGetProperty(field, out _), $"Expected an error for {field}.");
        }
    }

    [Theory]
    [InlineData("bad code", "VALID", "code")]
    [InlineData("VALID", "bad company", "companyCode")]
    [InlineData("TOOLONGCODE01", "VALID", "code")]
    [InlineData("VALID", "TOOLONGCOMP01", "companyCode")]
    public async Task Codes_must_use_only_allowed_characters_and_fit_the_limit(
        string code,
        string companyCode,
        string field)
    {
        var response = await client.PostAsJsonAsync(
            "/api/premium-adjustments",
            InvalidClassificationRequest(code, companyCode),
            Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.True(await HasFieldErrorAsync(response, field));
    }

    [Fact]
    public async Task Classification_values_are_validated_by_the_api()
    {
        var response = await client.PostAsJsonAsync(
            "/api/premium-adjustments",
            InvalidClassificationRequest("ZT1000000001", "ZT2000000001"),
            Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.True(await HasFieldErrorAsync(response, "codeType"));
        Assert.True(await HasFieldErrorAsync(response, "discountType"));
        Assert.True(await HasFieldErrorAsync(response, "chargesType"));
        Assert.True(await HasFieldErrorAsync(response, "chargesCategory"));
    }

    [Fact]
    public async Task Over_length_values_are_rejected_before_persistence()
    {
        var response = await client.PostAsJsonAsync(
            "/api/premium-adjustments",
            new
            {
                codeType = "ZT_INVALID",
                code = "ZT1000000001",
                companyCode = "ZT2000000001",
                name = new string('N', 101),
                shortName = new string('S', 31),
                discountType = "ZT_INVALID",
                chargesType = "ZT_INVALID",
                chargesCategory = "ZT_INVALID",
                remarks = new string('R', 2001),
                arabicName = new string('ع', 101),
                arabicShortName = new string('ع', 31),
                arabicRemarks = new string('ع', 2001)
            },
            Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        foreach (var field in new[]
        {
            "name", "shortName", "remarks", "arabicName", "arabicShortName", "arabicRemarks"
        })
        {
            Assert.True(await HasFieldErrorAsync(response, field), $"Expected an error for {field}.");
        }
    }

    private static object InvalidClassificationRequest(string code, string companyCode) => new
    {
        codeType = "ZT_INVALID",
        code,
        companyCode,
        name = "Test adjustment",
        shortName = "Test",
        discountType = "ZT_INVALID",
        chargesType = "ZT_INVALID",
        chargesCategory = "ZT_INVALID"
    };

    private static async Task<bool> HasFieldErrorAsync(HttpResponseMessage response, string field)
    {
        using var problem = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
        return problem.RootElement.GetProperty("errors").TryGetProperty(field, out _);
    }
}
