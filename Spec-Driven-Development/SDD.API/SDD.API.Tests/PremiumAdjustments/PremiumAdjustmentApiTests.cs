using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SDD.API.Contracts;
using SDD.API.Data.Scaffolded;
using SDD.API.Tests.VehicleMakes;

namespace SDD.API.Tests.PremiumAdjustments;

[Collection("Oracle API")]
public sealed class PremiumAdjustmentApiTests(OracleApiFactory factory)
{
    private readonly HttpClient client = factory.CreateClient();
    private static CancellationToken Cancellation => TestContext.Current.CancellationToken;

    [Fact]
    public async Task List_returns_the_shared_page_shape_with_a_fixed_page_size()
    {
        var response = await client.GetAsync("/api/premium-adjustments?page=1", Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var page = await response.Content.ReadFromJsonAsync<PaginatedResult<TestListItem>>(Cancellation);
        Assert.NotNull(page);
        Assert.Equal(1, page.Page);
        Assert.Equal(10, page.PageSize);
        Assert.NotNull(page.Items);
    }

    [Theory]
    [InlineData("?page=0", "page")]
    [InlineData("?codeType=CALC&codeTypeOperator=regex", "codeTypeOperator")]
    [InlineData("?active=true&activeOperator=contains", "activeOperator")]
    [InlineData("?sortBy=unexpected", "sortBy")]
    [InlineData("?sortDirection=sideways", "sortDirection")]
    public async Task Invalid_list_parameters_return_problem_details(string query, string field)
    {
        var response = await client.GetAsync($"/api/premium-adjustments{query}", Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<Dictionary<string, JsonElement>>(Cancellation);
        Assert.NotNull(problem);
        Assert.True(problem.ContainsKey("errors"));
        Assert.True(problem["errors"].TryGetProperty(field, out _));
    }

    [Fact]
    public async Task Create_normalizes_english_preserves_arabic_defaults_active_and_refuses_a_duplicate()
    {
        var optionsResponse = await client.GetAsync("/api/premium-adjustment-options", Cancellation);
        Assert.Equal(HttpStatusCode.OK, optionsResponse.StatusCode);
        using var options = await JsonDocument.ParseAsync(
            await optionsResponse.Content.ReadAsStreamAsync(Cancellation),
            cancellationToken: Cancellation);

        var codeType = FirstOption(options.RootElement, "codeTypes");
        var discountType = FirstOption(options.RootElement, "discountTypes");
        var chargesType = FirstOption(options.RootElement, "chargesTypes");
        var chargesCategory = FirstOption(options.RootElement, "chargesCategories");
        var code = NewCode();
        var companyCode = NewCompanyCode();
        const string arabic = "  خصم   خاص ";

        try
        {
            var request = CreateRequest(codeType, code.ToLowerInvariant(), companyCode.ToLowerInvariant(),
                discountType, chargesType, chargesCategory, arabic);
            var created = await client.PostAsJsonAsync("/api/premium-adjustments", request, Cancellation);

            Assert.Equal(HttpStatusCode.OK, created.StatusCode);
            using var body = await JsonDocument.ParseAsync(
                await created.Content.ReadAsStreamAsync(Cancellation),
                cancellationToken: Cancellation);
            Assert.Equal(code, body.RootElement.GetProperty("code").GetString());
            Assert.Equal(companyCode, body.RootElement.GetProperty("companyCode").GetString());
            Assert.Equal("Premium Cover", body.RootElement.GetProperty("name").GetString());
            Assert.Equal("BMW", body.RootElement.GetProperty("shortName").GetString());
            Assert.Equal(arabic, body.RootElement.GetProperty("arabicName").GetString());
            Assert.True(body.RootElement.GetProperty("active").GetBoolean());
            Assert.Equal("admin", body.RootElement.GetProperty("createdBy").GetString());
            Assert.Equal("admin", body.RootElement.GetProperty("lastChangedBy").GetString());

            var duplicate = await client.PostAsJsonAsync(
                "/api/premium-adjustments",
                request,
                Cancellation);
            Assert.Equal(HttpStatusCode.Conflict, duplicate.StatusCode);
            using var problem = await JsonDocument.ParseAsync(
                await duplicate.Content.ReadAsStreamAsync(Cancellation),
                cancellationToken: Cancellation);
            Assert.Equal(
                "This code type, code and company code combination already exists.",
                problem.RootElement.GetProperty("errors").GetProperty("code")[0].GetString());
        }
        finally
        {
            await RemoveAdjustmentAsync(codeType, code, companyCode);
        }
    }

    [Fact]
    public async Task Create_can_start_inactive()
    {
        var optionsResponse = await client.GetAsync("/api/premium-adjustment-options", Cancellation);
        using var options = await JsonDocument.ParseAsync(
            await optionsResponse.Content.ReadAsStreamAsync(Cancellation),
            cancellationToken: Cancellation);
        var codeType = FirstOption(options.RootElement, "codeTypes");
        var discountType = FirstOption(options.RootElement, "discountTypes");
        var chargesType = FirstOption(options.RootElement, "chargesTypes");
        var chargesCategory = FirstOption(options.RootElement, "chargesCategories");
        var code = NewCode();
        var companyCode = NewCompanyCode();

        try
        {
            var response = await client.PostAsJsonAsync(
                "/api/premium-adjustments",
                CreateRequest(codeType, code, companyCode, discountType, chargesType, chargesCategory, null, false),
                Cancellation);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            using var body = await JsonDocument.ParseAsync(
                await response.Content.ReadAsStreamAsync(Cancellation),
                cancellationToken: Cancellation);
            Assert.False(body.RootElement.GetProperty("active").GetBoolean());
        }
        finally
        {
            await RemoveAdjustmentAsync(codeType, code, companyCode);
        }
    }

    [Fact]
    public async Task Concurrent_duplicate_creates_are_resolved_by_the_database_unique_key()
    {
        var optionsResponse = await client.GetAsync("/api/premium-adjustment-options", Cancellation);
        using var options = await JsonDocument.ParseAsync(
            await optionsResponse.Content.ReadAsStreamAsync(Cancellation),
            cancellationToken: Cancellation);
        var codeType = FirstOption(options.RootElement, "codeTypes");
        var discountType = FirstOption(options.RootElement, "discountTypes");
        var chargesType = FirstOption(options.RootElement, "chargesTypes");
        var chargesCategory = FirstOption(options.RootElement, "chargesCategories");
        var code = NewCode();
        var companyCode = NewCompanyCode();
        var request = CreateRequest(codeType, code, companyCode, discountType, chargesType, chargesCategory, null);

        try
        {
            var responses = await Task.WhenAll(
                client.PostAsJsonAsync("/api/premium-adjustments", request, Cancellation),
                client.PostAsJsonAsync("/api/premium-adjustments", request, Cancellation));

            Assert.Single(responses, response => response.StatusCode == HttpStatusCode.OK);
            Assert.Single(responses, response => response.StatusCode == HttpStatusCode.Conflict);
        }
        finally
        {
            await RemoveAdjustmentAsync(codeType, code, companyCode);
        }
    }

    private static string NewCode() => ("ZT" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant();

    private static string NewCompanyCode() => ("ZC" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant();

    private static string FirstOption(JsonElement options, string listName)
    {
        var list = options.GetProperty(listName).EnumerateArray().ToArray();
        Assert.NotEmpty(list);
        return list[0].GetProperty("code").GetString()!;
    }

    private static Dictionary<string, object?> CreateRequest(
        string codeType,
        string code,
        string companyCode,
        string discountType,
        string chargesType,
        string chargesCategory,
        string? arabicName,
        bool? active = null)
    {
        var request = new Dictionary<string, object?>
        {
            ["codeType"] = codeType,
            ["code"] = code,
            ["companyCode"] = companyCode,
            ["name"] = "  premium   cover  ",
            ["shortName"] = "BMW",
            ["discountType"] = discountType,
            ["chargesType"] = chargesType,
            ["chargesCategory"] = chargesCategory,
            ["remarks"] = "Test remarks",
            ["arabicName"] = arabicName
        };
        if (active.HasValue)
        {
            request["active"] = active.Value;
        }

        return request;
    }

    private async Task RemoveAdjustmentAsync(string codeType, string code, string companyCode)
    {
        using var scope = factory.Services.CreateScope();
        var database = scope.ServiceProvider.GetRequiredService<SddDbContext>();
        await database.BrmMiscCodes
            .Where(item => item.McType == codeType && item.McCode == code && item.McCompCode == companyCode)
            .ExecuteDeleteAsync(Cancellation);
    }

    private sealed record TestListItem(
        string CodeType,
        string CodeTypeDescription,
        string Code,
        string CompanyCode,
        string Name,
        string ShortName,
        bool Active);
}
