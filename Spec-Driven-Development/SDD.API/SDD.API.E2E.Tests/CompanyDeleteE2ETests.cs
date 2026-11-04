using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class CompanyDeleteE2ETests(DashboardUiFixture dashboard) : PageTest
{
    [Fact]
    public async Task Cancelling_deletion_does_not_send_a_delete_request()
    {
        var deleteRequests = 0;
        await AddCompanyApiMockAsync(route =>
        {
            if (string.Equals(route.Request.Method, "DELETE", StringComparison.OrdinalIgnoreCase))
            {
                Interlocked.Increment(ref deleteRequests);
                return route.FulfillAsync(new RouteFulfillOptions
                {
                    Status = 204,
                    Headers = CorsHeaders(),
                });
            }

            return FulfillJsonAsync(
                route,
                new Uri(route.Request.Url).AbsolutePath.EndsWith("/NORTH", StringComparison.OrdinalIgnoreCase)
                    ? CompanyDetails()
                    : CompanyList(),
                200);
        });
        Page.Dialog += async (_, dialog) => await dialog.DismissAsync();

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/NORTH").ToString());
        await Page.GetByRole(AriaRole.Button, new() { Name = "Delete" }).ClickAsync();

        await Expect(Page).ToHaveURLAsync(new Regex("/company-master/NORTH$"));
        Assert.Equal(0, Volatile.Read(ref deleteRequests));
    }

    [Fact]
    public async Task Confirming_deletion_removes_company_and_returns_to_the_list()
    {
        var deleteRequests = 0;
        await AddCompanyApiMockAsync(route =>
        {
            if (string.Equals(route.Request.Method, "DELETE", StringComparison.OrdinalIgnoreCase))
            {
                Interlocked.Increment(ref deleteRequests);
                return route.FulfillAsync(new RouteFulfillOptions
                {
                    Status = 204,
                    Headers = CorsHeaders(),
                });
            }

            return FulfillJsonAsync(
                route,
                new Uri(route.Request.Url).AbsolutePath.EndsWith("/NORTH", StringComparison.OrdinalIgnoreCase)
                    ? CompanyDetails()
                    : CompanyList(),
                200);
        });
        Page.Dialog += async (_, dialog) => await dialog.AcceptAsync();

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/NORTH").ToString());
        await Page.GetByRole(AriaRole.Button, new() { Name = "Delete" }).ClickAsync();

        await Expect(Page).ToHaveURLAsync(new Regex("/company-master$"));
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Company Master" })).ToBeVisibleAsync();
        Assert.Equal(1, Volatile.Read(ref deleteRequests));
    }

    [Fact]
    public async Task Referenced_company_conflict_is_explained_without_navigating_away()
    {
        await AddCompanyApiMockAsync(route =>
        {
            if (string.Equals(route.Request.Method, "DELETE", StringComparison.OrdinalIgnoreCase))
            {
                return FulfillJsonAsync(route, new { title = "Conflict", status = 409 }, 409);
            }

            return FulfillJsonAsync(
                route,
                new Uri(route.Request.Url).AbsolutePath.EndsWith("/NORTH", StringComparison.OrdinalIgnoreCase)
                    ? CompanyDetails()
                    : CompanyList(),
                200);
        });
        Page.Dialog += async (_, dialog) => await dialog.AcceptAsync();

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/NORTH").ToString());
        await Page.GetByRole(AriaRole.Button, new() { Name = "Delete" }).ClickAsync();

        await Expect(Page.GetByRole(AriaRole.Alert)).ToContainTextAsync("used by other records");
        await Expect(Page).ToHaveURLAsync(new Regex("/company-master/NORTH$"));
    }

    private async Task AddCompanyApiMockAsync(Func<IRoute, Task> handleRequest)
    {
        await Page.RouteAsync("**/api/companies**", async route =>
        {
            if (string.Equals(route.Request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase))
            {
                await route.FulfillAsync(new RouteFulfillOptions { Status = 204, Headers = CorsHeaders() });
                return;
            }

            if (string.Equals(route.Request.Method, "GET", StringComparison.OrdinalIgnoreCase) &&
                new Uri(route.Request.Url).AbsolutePath.EndsWith("/divisions", StringComparison.OrdinalIgnoreCase))
            {
                await FulfillJsonAsync(route, Array.Empty<object>(), 200);
                return;
            }

            await handleRequest(route);
        });
    }

    private static object CompanyList() => new
    {
        items = Array.Empty<object>(),
        page = 1,
        pageSize = 10,
        totalCount = 0,
    };

    private static object CompanyDetails() => new
    {
        companyCode = "NORTH",
        companyName = "North Insurance",
        shortName = "North",
        primaryAddress = "Bay Road, Tower 2",
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
