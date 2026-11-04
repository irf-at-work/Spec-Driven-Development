using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class ListItemListAndDetailsE2ETests(DashboardUiFixture dashboard) : PageTest
{
    [Fact]
    public async Task List_filters_sorts_pages_and_restores_state_after_details_navigation()
    {
        var listRequests = new List<string>();
        await Page.RouteAsync("**/api/list-items**", async route =>
        {
            if (await FulfillPreflightAsync(route)) return;
            listRequests.Add(route.Request.Url);
            var path = new Uri(route.Request.Url).AbsolutePath;
            await FulfillJsonAsync(
                route,
                path.EndsWith("/COUNTRY/AE", StringComparison.OrdinalIgnoreCase) ? ListItemDetails() : ListItems(),
                200);
        });

        await Page.GotoAsync(new Uri(
            dashboard.BaseAddress,
            "/listing-master?page=2&pageSize=10&sortBy=liType&sortDirection=desc&liType=COUNTRY&liTypeOperator=Equals"
        ).ToString());

        foreach (var width in new[] { 320, 768, 1024, 1440 })
        {
            await Page.SetViewportSizeAsync(width, 800);
            Assert.True(await Page.EvaluateAsync<bool>("() => document.documentElement.scrollWidth <= window.innerWidth"));
        }
        await Page.SetViewportSizeAsync(1280, 800);

        foreach (var column in new[] { "List type", "List code", "Description", "Short description", "Value", "Active", "History" })
        {
            await Expect(Page.GetByRole(AriaRole.Columnheader, new() { Name = column }).First).ToBeVisibleAsync();
        }

        var typeFilter = Page.GetByLabel("Filter by list type");
        await Expect(typeFilter).ToHaveValueAsync("COUNTRY");
        await Page.GetByLabel("List type operator").SelectOptionAsync("Contains");
        await Expect(Page).ToHaveURLAsync(new Regex("liTypeOperator=Contains"));
        await typeFilter.FillAsync("REGION");
        await Expect(Page).ToHaveURLAsync(new Regex("liType=REGION"));
        await Expect(Page).ToHaveURLAsync(new Regex("page=1"));
        await Page.GetByRole(AriaRole.Columnheader, new() { Name = "Description" }).First.ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("sortBy=description"));
        await Page.GetByRole(AriaRole.Button, new() { Name = "Next page" }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("page=2"));

        await Page.GetByText("United Arab Emirates", new() { Exact = true }).ClickAsync();
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "List Item Master" })).ToBeVisibleAsync();
        await Expect(Page.GetByText("Flexible one", new() { Exact = true })).ToBeVisibleAsync();
        await Expect(Page.GetByText("02-01-2024", new() { Exact = true })).ToBeVisibleAsync();
        var history = Page.GetByText("Reviewer", new() { Exact = true });
        await Expect(history).ToBeVisibleAsync();

        await Page.GetByRole(AriaRole.Link, new() { Name = "Back to list items" }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("liType=REGION"));
        await Expect(Page).ToHaveURLAsync(new Regex("sortBy=description"));
        await Expect(Page).ToHaveURLAsync(new Regex("page=2"));
        Assert.NotEmpty(listRequests);

        var table = Page.Locator(".table-container");
        Assert.True(await table.EvaluateAsync<bool>("element => element.scrollWidth > element.clientWidth"));
        await table.EvaluateAsync("element => element.scrollLeft = element.scrollWidth");
        await Expect(Page.GetByRole(AriaRole.Columnheader, new() { Name = "History" }).First).ToBeVisibleAsync();
        foreach (var width in new[] { 320, 768, 1024, 1440 })
        {
            await Page.SetViewportSizeAsync(width, 800);
            Assert.True(await Page.EvaluateAsync<bool>("() => document.documentElement.scrollWidth <= window.innerWidth"));
            await Expect(Page.GetByRole(AriaRole.Columnheader, new() { Name = "History" }).First).ToBeVisibleAsync();
        }
    }

    [Fact]
    public async Task Company_master_navigation_remains_available_from_masters_menu()
    {
        await Page.RouteAsync("**/api/list-items**", async route =>
        {
            if (await FulfillPreflightAsync(route)) return;
            await FulfillJsonAsync(route, ListItems(), 200);
        });
        await Page.RouteAsync("**/api/companies**", async route =>
        {
            if (await FulfillPreflightAsync(route)) return;
            await FulfillJsonAsync(route, new { items = Array.Empty<object>(), page = 1, pageSize = 10, totalCount = 0 }, 200);
        });
        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/listing-master").ToString());
        await Page.GetByRole(AriaRole.Button, new() { Name = "Masters" }).ClickAsync();
        await Page.GetByRole(AriaRole.Menuitem, new() { Name = "Company Master" }).ClickAsync();
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Company Master" })).ToBeVisibleAsync();
    }

    private static object ListItems() => new
    {
        items = new[]
        {
            new
            {
                liType = "COUNTRY",
                liCode = "AE",
                description = "United Arab Emirates",
                shortDescription = "UAE",
                value = "971",
                activeYn = "Y",
                createdBy = "Admin",
                lastUpdatedBy = "Reviewer",
            },
        },
        page = 1,
        pageSize = 10,
        totalCount = 30,
    };

    private static object ListItemDetails() => new
    {
        liType = "COUNTRY",
        liCode = "AE",
        description = "United Arab Emirates",
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
