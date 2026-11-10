using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace SDD.API.Tests.ClaimConfigurations;

public sealed class ClaimConfigurationCrudApiTests(ClaimConfigurationImportApiFactory factory)
    : IClassFixture<ClaimConfigurationImportApiFactory>
{
    private readonly HttpClient client = factory.CreateClient();
    private static CancellationToken Cancellation => TestContext.Current.CancellationToken;

    [Fact]
    public async Task Create_read_update_and_delete_preserve_the_key_and_stamp_audit_values()
    {
        var code = NewCode();
        try
        {
            using var created = await client.PostAsJsonAsync(
                "/api/claim-configurations",
                new { ccmCode = code.ToLowerInvariant(), name = "claim configuration", shortName = "claim" },
                Cancellation);
            Assert.Equal(HttpStatusCode.OK, created.StatusCode);
            using var createdJson = JsonDocument.Parse(await created.Content.ReadAsStringAsync(Cancellation));
            Assert.Equal(code, createdJson.RootElement.GetProperty("ccmCode").GetString());
            Assert.Equal("CLAIM CONFIGURATION", createdJson.RootElement.GetProperty("name").GetString());
            Assert.Equal("admin", createdJson.RootElement.GetProperty("createdBy").GetString());

            using var read = await client.GetAsync($"/api/claim-configurations/{code}", Cancellation);
            Assert.Equal(HttpStatusCode.OK, read.StatusCode);

            using var update = await client.PutAsJsonAsync(
                $"/api/claim-configurations/{code}",
                new { name = "Updated configuration", shortName = "UPDATED", active = false },
                Cancellation);
            Assert.Equal(HttpStatusCode.OK, update.StatusCode);
            using var updatedJson = JsonDocument.Parse(await update.Content.ReadAsStringAsync(Cancellation));
            Assert.Equal(code, updatedJson.RootElement.GetProperty("ccmCode").GetString());
            Assert.Equal("UPDATED CONFIGURATION", updatedJson.RootElement.GetProperty("name").GetString());
            Assert.False(updatedJson.RootElement.GetProperty("active").GetBoolean());
            Assert.Equal("admin", updatedJson.RootElement.GetProperty("updatedBy").GetString());

            using var delete = await client.DeleteAsync($"/api/claim-configurations/{code}", Cancellation);
            Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);
        }
        finally
        {
            using var cleanup = await client.DeleteAsync($"/api/claim-configurations/{code}", Cancellation);
        }
    }

    [Fact]
    public async Task Create_rejects_a_missing_name_and_a_globally_duplicate_code()
    {
        var code = NewCode();
        using var invalid = await client.PostAsJsonAsync(
            "/api/claim-configurations", new { ccmCode = code }, Cancellation);
        Assert.Equal(HttpStatusCode.BadRequest, invalid.StatusCode);

        using var first = await client.PostAsJsonAsync(
            "/api/claim-configurations", new { ccmCode = code, name = "FIRST" }, Cancellation);
        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        try
        {
            using var duplicate = await client.PostAsJsonAsync(
                "/api/claim-configurations", new { ccmCode = code, name = "SECOND" }, Cancellation);
            Assert.Equal(HttpStatusCode.Conflict, duplicate.StatusCode);
        }
        finally
        {
            using var cleanup = await client.DeleteAsync($"/api/claim-configurations/{code}", Cancellation);
        }
    }

    [Fact]
    public async Task Create_defaults_flags_and_rounding_while_preserving_arabic_text()
    {
        var code = NewCode();
        const string arabic = "  إعداد المطالبة  ";
        using var response = await client.PostAsJsonAsync(
            "/api/claim-configurations",
            new { ccmCode = code, name = "claim configuration", nameL2 = arabic },
            Cancellation);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        try
        {
            using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
            var saved = document.RootElement;
            Assert.Equal("ASRTEST", saved.GetProperty("companyCode").GetString());
            Assert.Equal(0m, saved.GetProperty("roundingValue").GetDecimal());
            Assert.False(saved.GetProperty("printBeforeApproval").GetBoolean());
            Assert.False(saved.GetProperty("reprint").GetBoolean());
            Assert.True(saved.GetProperty("claimAccountingDocumentGeneration").GetBoolean());
            Assert.True(saved.GetProperty("claimCoinsuranceAccountingDocumentGeneration").GetBoolean());
            Assert.Equal(arabic, saved.GetProperty("nameL2").GetString());
        }
        finally
        {
            using var cleanup = await client.DeleteAsync($"/api/claim-configurations/{code}", Cancellation);
        }
    }

    [Fact]
    public async Task Create_rejects_a_choice_that_is_not_in_an_active_approved_list()
    {
        var code = NewCode();
        using var response = await client.PostAsJsonAsync(
            "/api/claim-configurations",
            new { ccmCode = code, name = "INVALID CHOICE", module = "ZZ" },
            Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
        Assert.True(body.RootElement.GetProperty("errors").TryGetProperty("module", out _));
    }

    private static string NewCode() => ("ZT" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant();
}
