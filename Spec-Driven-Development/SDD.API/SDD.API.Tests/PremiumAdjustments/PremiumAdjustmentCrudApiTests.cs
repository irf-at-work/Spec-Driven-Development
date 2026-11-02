using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SDD.API.Data.Scaffolded;
using SDD.API.Tests.VehicleMakes;

namespace SDD.API.Tests.PremiumAdjustments;

[Collection("Oracle API")]
public sealed class PremiumAdjustmentCrudApiTests(OracleApiFactory factory)
{
    private const string Url = "/api/premium-adjustments";
    private readonly HttpClient client = factory.CreateClient();
    private static CancellationToken Cancellation => TestContext.Current.CancellationToken;

    [Fact]
    public async Task Update_requires_legacy_classifications_and_keeps_a_held_inactive_value()
    {
        using var options = await GetOptionsAsync();
        var codeType = Option(options, "codeTypes");
        var chargesType = Option(options, "chargesTypes");
        var chargesCategory = Option(options, "chargesCategories");
        var code = NewCode();
        var companyCode = NewCompanyCode();

        await InsertLegacyAsync(codeType, code, companyCode, "ZT_INACTIVE");
        try
        {
            var missing = await client.PutAsJsonAsync(
                KeyUrl(codeType, code, companyCode),
                new { name = "Legacy name", shortName = "Legacy" },
                Cancellation);
            Assert.Equal(HttpStatusCode.BadRequest, missing.StatusCode);
            using (var problem = await JsonDocument.ParseAsync(
                       await missing.Content.ReadAsStreamAsync(Cancellation),
                       cancellationToken: Cancellation))
            {
                var errors = problem.RootElement.GetProperty("errors");
                Assert.True(errors.TryGetProperty("discountType", out _));
                Assert.True(errors.TryGetProperty("chargesType", out _));
                Assert.True(errors.TryGetProperty("chargesCategory", out _));
            }

            using (var invalidHeldValue = await client.PutAsJsonAsync(
                       KeyUrl(codeType, code, companyCode),
                       new
                       {
                           name = "Legacy name",
                           shortName = "Legacy",
                           discountType = "ZT_NEW",
                           chargesType,
                           chargesCategory
                       },
                       Cancellation))
            {
                Assert.Equal(HttpStatusCode.BadRequest, invalidHeldValue.StatusCode);
                using var problem = await JsonDocument.ParseAsync(
                    await invalidHeldValue.Content.ReadAsStreamAsync(Cancellation),
                    cancellationToken: Cancellation);
                Assert.True(problem.RootElement.GetProperty("errors").TryGetProperty("discountType", out _));
            }

            var updated = await client.PutAsJsonAsync(
                KeyUrl(codeType, code, companyCode),
                new
                {
                    codeType = "IGNORED",
                    code = "IGNORED",
                    companyCode = "IGNORED",
                    name = "  updated   legacy ",
                    shortName = "Legacy",
                    discountType = "ZT_INACTIVE",
                    chargesType,
                    chargesCategory,
                    active = false
                },
                Cancellation);

            Assert.Equal(HttpStatusCode.OK, updated.StatusCode);
            using var body = await JsonDocument.ParseAsync(
                await updated.Content.ReadAsStreamAsync(Cancellation),
                cancellationToken: Cancellation);
            Assert.Equal("ZT_INACTIVE", body.RootElement.GetProperty("discountType").GetString());
            Assert.Equal("Updated legacy", body.RootElement.GetProperty("name").GetString());
            Assert.False(body.RootElement.GetProperty("active").GetBoolean());
            Assert.Equal("admin", body.RootElement.GetProperty("lastChangedBy").GetString());

            var restored = await client.PutAsJsonAsync(
                KeyUrl(codeType, code, companyCode),
                new
                {
                    name = "Updated legacy",
                    shortName = "Legacy",
                    discountType = "ZT_INACTIVE",
                    chargesType,
                    chargesCategory,
                    active = true
                },
                Cancellation);
            Assert.Equal(HttpStatusCode.OK, restored.StatusCode);
            using var restoredBody = await JsonDocument.ParseAsync(
                await restored.Content.ReadAsStreamAsync(Cancellation),
                cancellationToken: Cancellation);
            Assert.True(restoredBody.RootElement.GetProperty("active").GetBoolean());
        }
        finally
        {
            await RemoveAsync(codeType, code, companyCode);
        }
    }

    [Fact]
    public async Task Delete_removes_only_the_selected_adjustment_and_reports_missing_rows()
    {
        using var options = await GetOptionsAsync();
        var codeType = Option(options, "codeTypes");
        var discountType = Option(options, "discountTypes");
        var chargesType = Option(options, "chargesTypes");
        var chargesCategory = Option(options, "chargesCategories");
        var codeToDelete = NewCode();
        var codeToKeep = NewCode();
        var companyCode = NewCompanyCode();

        try
        {
            using var first = await CreateAsync(codeType, codeToDelete, companyCode, discountType, chargesType, chargesCategory);
            using var second = await CreateAsync(codeType, codeToKeep, companyCode, discountType, chargesType, chargesCategory);
            Assert.Equal(HttpStatusCode.OK, first.StatusCode);
            Assert.Equal(HttpStatusCode.OK, second.StatusCode);

            var deleted = await client.DeleteAsync(KeyUrl(codeType, codeToDelete, companyCode), Cancellation);
            Assert.Equal(HttpStatusCode.NoContent, deleted.StatusCode);

            var kept = await client.GetAsync(KeyUrl(codeType, codeToKeep, companyCode), Cancellation);
            Assert.Equal(HttpStatusCode.OK, kept.StatusCode);

            var missing = await client.DeleteAsync(KeyUrl(codeType, codeToDelete, companyCode), Cancellation);
            Assert.Equal(HttpStatusCode.NotFound, missing.StatusCode);
            using var problem = await JsonDocument.ParseAsync(
                await missing.Content.ReadAsStreamAsync(Cancellation),
                cancellationToken: Cancellation);
            Assert.Equal(404, problem.RootElement.GetProperty("status").GetInt32());
        }
        finally
        {
            await RemoveAsync(codeType, codeToDelete, companyCode);
            await RemoveAsync(codeType, codeToKeep, companyCode);
        }
    }

    private async Task<JsonDocument> GetOptionsAsync()
    {
        var response = await client.GetAsync("/api/premium-adjustment-options", Cancellation);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return await JsonDocument.ParseAsync(
            await response.Content.ReadAsStreamAsync(Cancellation),
            cancellationToken: Cancellation);
    }

    private static string Option(JsonDocument options, string list) =>
        Assert.IsType<string>(options.RootElement.GetProperty(list)[0].GetProperty("code").GetString());

    private string NewCode() => ("ZT" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant();
    private string NewCompanyCode() => ("ZC" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant();

    private Task<HttpResponseMessage> CreateAsync(
        string codeType,
        string code,
        string companyCode,
        string discountType,
        string chargesType,
        string chargesCategory) =>
        client.PostAsJsonAsync(
            Url,
            new
            {
                codeType,
                code,
                companyCode,
                name = "Test adjustment",
                shortName = "Test",
                discountType,
                chargesType,
                chargesCategory
            },
            Cancellation);

    private async Task InsertLegacyAsync(string codeType, string code, string companyCode, string heldDiscountType)
    {
        using var scope = factory.Services.CreateScope();
        var database = scope.ServiceProvider.GetRequiredService<SddDbContext>();
        database.BrmMiscCodes.Add(new BrmMiscCode
        {
            McType = codeType,
            McCode = code,
            McCompCode = companyCode,
            McDesc = "Legacy name",
            McShortDesc = "Legacy",
            McDiscType = heldDiscountType,
            McActiveYn = "Y"
        });
        await database.SaveChangesAsync(Cancellation);
    }

    private async Task RemoveAsync(string codeType, string code, string companyCode)
    {
        using var scope = factory.Services.CreateScope();
        var database = scope.ServiceProvider.GetRequiredService<SddDbContext>();
        await database.BrmMiscCodes
            .Where(item => item.McType == codeType && item.McCode == code && item.McCompCode == companyCode)
            .ExecuteDeleteAsync(Cancellation);
    }

    private static string KeyUrl(string codeType, string code, string companyCode) =>
        $"{Url}/{Uri.EscapeDataString(codeType)}/{Uri.EscapeDataString(code)}/{Uri.EscapeDataString(companyCode)}";
}
