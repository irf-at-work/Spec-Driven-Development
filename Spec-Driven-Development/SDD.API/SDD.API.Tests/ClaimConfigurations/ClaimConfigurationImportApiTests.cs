using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace SDD.API.Tests.ClaimConfigurations;

public sealed class ClaimConfigurationImportApiFactory : WebApplicationFactory<Program>
{
    private readonly string connectionString;

    public ClaimConfigurationImportApiFactory()
    {
        connectionString = Environment.GetEnvironmentVariable("SDD_TEST_ORACLE_CONNECTION") ?? string.Empty;
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Set SDD_TEST_ORACLE_CONNECTION to an approved Oracle TEST schema before running CCM import API tests.");
        }

    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((_, configuration) => configuration.AddInMemoryCollection(
            new Dictionary<string, string?>
            {
                ["ConnectionStrings:SddOracle"] = connectionString,
                ["ClaimConfiguration:CompanyCode"] = "ASRTEST",
                ["ClaimConfiguration:WritesEnabled"] = "true",
            }));
    }
}

public sealed class ClaimConfigurationImportApiTests(ClaimConfigurationImportApiFactory factory)
    : IClassFixture<ClaimConfigurationImportApiFactory>
{
    private readonly HttpClient client = factory.CreateClient();
    private static CancellationToken Cancellation => TestContext.Current.CancellationToken;

    [Fact]
    public async Task Preview_reports_the_combined_row_limit_across_both_sheets()
    {
        var configurations = Enumerable.Range(0, 500)
            .Select(_ => new Dictionary<string, string?>())
            .ToArray();
        var productLinks = Enumerable.Range(0, 501)
            .Select(_ => new Dictionary<string, string?>())
            .ToArray();

        using var response = await client.PostAsJsonAsync(
            "/api/claim-configurations/import/preview",
            new { configurations, productLinks },
            Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
        Assert.Contains(
            body.RootElement.GetProperty("errors").EnumerateArray().Select(item => item.GetString()),
            message => message is not null && message.Contains("1,000", StringComparison.Ordinal));
    }

    [Fact]
    public async Task Confirm_rejects_invalid_rows_before_writing_any_records()
    {
        var configurations = new[] { new Dictionary<string, string?> { ["ccmCode"] = "" } };

        using var response = await client.PostAsJsonAsync(
            "/api/claim-configurations/import",
            new { configurations, productLinks = Array.Empty<Dictionary<string, string?>>() },
            Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
        Assert.True(body.RootElement.GetProperty("errors").TryGetProperty("ccm_row_2", out _));
    }

    [Fact]
    public async Task Existing_configuration_is_skipped_even_when_other_workbook_fields_are_blank()
    {
        var code = ("ZS" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant();
        using var create = await client.PostAsJsonAsync(
            "/api/claim-configurations",
            new { ccmCode = code, name = "ORIGINAL NAME" },
            Cancellation);
        Assert.Equal(HttpStatusCode.OK, create.StatusCode);

        try
        {
            var configurations = new[] { new Dictionary<string, string?> { ["ccmCode"] = code } };
            using var response = await client.PostAsJsonAsync(
                "/api/claim-configurations/import",
                new { configurations, productLinks = Array.Empty<Dictionary<string, string?>>() },
                Cancellation);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            using var result = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
            Assert.Equal(1, result.RootElement.GetProperty("skippedConfigurations").GetInt32());

            using var read = await client.GetAsync($"/api/claim-configurations/{code}", Cancellation);
            using var detail = JsonDocument.Parse(await read.Content.ReadAsStringAsync(Cancellation));
            Assert.Equal("ORIGINAL NAME", detail.RootElement.GetProperty("name").GetString());
        }
        finally
        {
            using var delete = await client.DeleteAsync($"/api/claim-configurations/{code}", Cancellation);
        }
    }

    [Fact]
    public async Task Invalid_product_link_prevents_a_valid_new_configuration_from_being_partially_imported()
    {
        var code = ("ZI" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant();
        var configurations = new[]
        {
            new Dictionary<string, string?> { ["ccmCode"] = code, ["name"] = "IMPORT TEST" },
        };
        var productLinks = new[]
        {
            new Dictionary<string, string?> { ["ccmCode"] = code, ["productCode"] = "ZZ_INVALID_PRODUCT" },
        };

        using var response = await client.PostAsJsonAsync(
            "/api/claim-configurations/import",
            new { configurations, productLinks },
            Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        using var read = await client.GetAsync($"/api/claim-configurations/{code}", Cancellation);
        Assert.Equal(HttpStatusCode.NotFound, read.StatusCode);
    }
}
