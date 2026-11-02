using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class ListItemAddEditE2ETests(DashboardUiFixture dashboard) : PageTest
{
    [Fact]
    public async Task Duplicate_feedback_create_and_same_page_edit_preserve_immutable_identity()
    {
        var createCount = 0;
        var createRequest = string.Empty;
        var updateRequest = string.Empty;
        var description = "United Arab Emirates";
        await Page.RouteAsync("**/api/list-items**", async route =>
        {
            if (await FulfillPreflightAsync(route)) return;
            var path = new Uri(route.Request.Url).AbsolutePath;
            if (string.Equals(route.Request.Method, "POST", StringComparison.OrdinalIgnoreCase))
            {
                createRequest = route.Request.PostData ?? string.Empty;
                createCount++;
                if (createCount == 1)
                {
                    await FulfillJsonAsync(route, new { title = "Conflict", status = 409 }, 409);
                    return;
                }

                await FulfillJsonAsync(route, ListItem(description), 201);
                return;
            }

            if (string.Equals(route.Request.Method, "PUT", StringComparison.OrdinalIgnoreCase))
            {
                updateRequest = route.Request.PostData ?? string.Empty;
                using var request = JsonDocument.Parse(updateRequest);
                description = request.RootElement.GetProperty("description").GetString() ?? string.Empty;
                await FulfillJsonAsync(route, ListItem(description), 200);
                return;
            }

            await FulfillJsonAsync(route, ListItem(description), 200);
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/listing-master/new").ToString());
        await Page.GetByLabel("List type").FillAsync("COUNTRY");
        await Page.GetByLabel("List code").FillAsync("AE");
        await Page.GetByLabel("Description", new() { Exact = true }).FillAsync(description);
        await Page.GetByRole(AriaRole.Button, new() { Name = "Create list item" }).ClickAsync();
        await Expect(Page.GetByRole(AriaRole.Alert)).ToContainTextAsync("already exists");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Create list item" }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("/listing-master/COUNTRY/AE$"));

        using (var request = JsonDocument.Parse(createRequest))
        {
            Assert.Equal("COUNTRY", request.RootElement.GetProperty("liType").GetString());
            Assert.Equal("AE", request.RootElement.GetProperty("liCode").GetString());
        }

        await Page.GetByRole(AriaRole.Button, new() { Name = "Edit", Exact = true }).ClickAsync();
        var typeInput = Page.GetByLabel("List type");
        var codeInput = Page.GetByLabel("List code");
        await Expect(typeInput).ToHaveAttributeAsync("readonly", "true");
        await Expect(codeInput).ToHaveAttributeAsync("readonly", "true");
        var descriptionInput = Page.GetByLabel("Description", new() { Exact = true });
        await descriptionInput.FillAsync("Unsaved description");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Cancel" }).ClickAsync();
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "United Arab Emirates" })).ToBeVisibleAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Edit", Exact = true }).ClickAsync();
        await Page.GetByLabel("Description", new() { Exact = true }).FillAsync("United Arab Emirates (Updated)");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save changes" }).ClickAsync();
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "United Arab Emirates (Updated)" })).ToBeVisibleAsync();

        using var update = JsonDocument.Parse(updateRequest);
        Assert.False(update.RootElement.TryGetProperty("liType", out _));
        Assert.False(update.RootElement.TryGetProperty("liCode", out _));
        Assert.Equal("United Arab Emirates (Updated)", update.RootElement.GetProperty("description").GetString());
    }

    private static object ListItem(string description) => new
    {
        liType = "COUNTRY",
        liCode = "AE",
        description,
        descriptionL2 = "الإمارات العربية المتحدة",
        shortDescription = "UAE",
        shortDescriptionL2 = "UAE L2",
        value = "971",
        activeYn = "Y",
        flex01 = "Flexible one",
        flex02 = "Flexible two",
        createdBy = "Admin",
        createdAt = "2024-01-02T00:00:00Z",
        lastUpdatedBy = "Reviewer",
        lastUpdatedAt = "2024-02-03T00:00:00Z",
    };

    private static async Task<bool> FulfillPreflightAsync(IRoute route)
    {
        if (!string.Equals(route.Request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase)) return false;
        await route.FulfillAsync(new RouteFulfillOptions { Status = 204, Headers = CorsHeaders() });
        return true;
    }

    private static Task FulfillJsonAsync(IRoute route, object body, int status) =>
        route.FulfillAsync(new RouteFulfillOptions
        {
            Status = status,
            ContentType = "application/json",
            Body = JsonSerializer.Serialize(body),
            Headers = CorsHeaders(),
        });

    private static Dictionary<string, string> CorsHeaders() => new()
    {
        ["Access-Control-Allow-Origin"] = "http://127.0.0.1:4200",
        ["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS",
        ["Access-Control-Allow-Headers"] = "content-type, accept",
    };
}
