using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class ListItemDeleteE2ETests(DashboardUiFixture dashboard) : PageTest
{
    [Fact]
    public async Task Cancelling_deletion_does_not_send_a_delete_request()
    {
        var deleteRequests = 0;
        await AddApiMockAsync(route =>
        {
            if (string.Equals(route.Request.Method, "DELETE", StringComparison.OrdinalIgnoreCase))
            {
                deleteRequests++;
                return route.FulfillAsync(new RouteFulfillOptions { Status = 204, Headers = CorsHeaders() });
            }

            return FulfillJsonAsync(route, IsDetailsRequest(route) ? ListItem() : EmptyList(), 200);
        });
        Page.Dialog += async (_, dialog) => await dialog.DismissAsync();

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/listing-master/COUNTRY/AE").ToString());
        await Page.GetByRole(AriaRole.Button, new() { Name = "Delete" }).ClickAsync();

        await Expect(Page).ToHaveURLAsync(new Regex("/listing-master/COUNTRY/AE$"));
        Assert.Equal(0, deleteRequests);
    }

    [Fact]
    public async Task Confirming_deletion_returns_to_the_list()
    {
        var deleteRequests = 0;
        await AddApiMockAsync(route =>
        {
            if (string.Equals(route.Request.Method, "DELETE", StringComparison.OrdinalIgnoreCase))
            {
                deleteRequests++;
                return route.FulfillAsync(new RouteFulfillOptions { Status = 204, Headers = CorsHeaders() });
            }

            return FulfillJsonAsync(route, IsDetailsRequest(route) ? ListItem() : EmptyList(), 200);
        });
        Page.Dialog += async (_, dialog) => await dialog.AcceptAsync();

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/listing-master/COUNTRY/AE").ToString());
        await Page.GetByRole(AriaRole.Button, new() { Name = "Delete" }).ClickAsync();

        await Expect(Page).ToHaveURLAsync(new Regex("/listing-master$"));
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "List Item Master" })).ToBeVisibleAsync();
        Assert.Equal(1, deleteRequests);
    }

    [Fact]
    public async Task Reference_conflict_keeps_details_open_and_explains_the_failure()
    {
        await AddApiMockAsync(route =>
        {
            if (string.Equals(route.Request.Method, "DELETE", StringComparison.OrdinalIgnoreCase))
            {
                return FulfillJsonAsync(route, new { title = "Conflict", status = 409 }, 409);
            }

            return FulfillJsonAsync(route, IsDetailsRequest(route) ? ListItem() : EmptyList(), 200);
        });
        Page.Dialog += async (_, dialog) => await dialog.AcceptAsync();

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/listing-master/COUNTRY/AE").ToString());
        await Page.GetByRole(AriaRole.Button, new() { Name = "Delete" }).ClickAsync();

        await Expect(Page.GetByRole(AriaRole.Alert)).ToContainTextAsync("referenced by other records");
        await Expect(Page).ToHaveURLAsync(new Regex("/listing-master/COUNTRY/AE$"));
    }

    private async Task AddApiMockAsync(Func<IRoute, Task> handleRequest)
    {
        await Page.RouteAsync("**/api/list-items**", async route =>
        {
            if (string.Equals(route.Request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase))
            {
                await route.FulfillAsync(new RouteFulfillOptions { Status = 204, Headers = CorsHeaders() });
                return;
            }
            await handleRequest(route);
        });
    }

    private static bool IsDetailsRequest(IRoute route) =>
        new Uri(route.Request.Url).AbsolutePath.EndsWith("/COUNTRY/AE", StringComparison.OrdinalIgnoreCase);

    private static object EmptyList() => new { items = Array.Empty<object>(), page = 1, pageSize = 10, totalCount = 0 };

    private static object ListItem() => new
    {
        liType = "COUNTRY",
        liCode = "AE",
        description = "United Arab Emirates",
        shortDescription = "UAE",
        value = "971",
        activeYn = "Y",
        createdBy = "Admin",
        lastUpdatedBy = "Reviewer",
    };

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
