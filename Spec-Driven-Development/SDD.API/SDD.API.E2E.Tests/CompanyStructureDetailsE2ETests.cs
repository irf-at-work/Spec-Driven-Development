using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class CompanyStructureDetailsE2ETests(DashboardUiFixture dashboard) : PageTest
{
    [Fact]
    public async Task Shows_collapsible_division_cards_with_department_tables_and_keeps_company_details()
    {
        await Page.RouteAsync("**/api/companies**", async route =>
        {
            if (await FulfillPreflightAsync(route))
            {
                return;
            }

            var path = new Uri(route.Request.Url).AbsolutePath;
            if (path == "/api/companies/NORTH/divisions")
            {
                await FulfillJsonAsync(route, new[]
                {
                    Division("WEST", "Western Office", [Department("FIN", "Finance")]),
                    Division("EAST", "Eastern Office", [Department("IT", "Information Technology")]),
                }, 200);
            }
            else
            {
                await FulfillJsonAsync(route, CompanyDetails(), 200);
            }
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/NORTH").ToString());

        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "North Insurance" })).ToBeVisibleAsync();
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Divisions" })).ToBeVisibleAsync();
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Western Office" })).ToBeVisibleAsync();
        await Expect(Page.GetByText("Finance", new() { Exact = true })).ToBeVisibleAsync();
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Eastern Office" })).ToBeVisibleAsync();
        await Expect(Page.GetByText("Information Technology", new() { Exact = true })).ToBeVisibleAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Collapse division WEST" }).ClickAsync();
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Western Office" })).ToBeVisibleAsync();
        await Expect(Page.GetByText("Finance", new() { Exact = true })).ToBeHiddenAsync();
    }

    [Fact]
    public async Task Shows_an_empty_divisions_state_when_the_company_has_no_divisions()
    {
        await Page.RouteAsync("**/api/companies**", async route =>
        {
            if (await FulfillPreflightAsync(route))
            {
                return;
            }

            var path = new Uri(route.Request.Url).AbsolutePath;
            await FulfillJsonAsync(
                route,
                path == "/api/companies/NORTH/divisions" ? Array.Empty<object>() : CompanyDetails(),
                200);
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/NORTH").ToString());

        await Expect(Page.GetByText("No divisions have been added to this company yet.")).ToBeVisibleAsync();
    }

    private static object CompanyDetails() => new
    {
        companyCode = "NORTH",
        companyName = "North Insurance",
        shortName = "North",
        createdBy = "Admin",
        lastUpdatedBy = "Admin",
    };

    private static object Division(string code, string name, object[] departments) => new
    {
        divisionCode = code,
        name,
        shortName = name,
        departments,
    };

    private static object Department(string code, string name) => new
    {
        departmentCode = code,
        name,
        divisionCodes = new[] { "WEST" },
    };

    private static async Task<bool> FulfillPreflightAsync(IRoute route)
    {
        if (!string.Equals(route.Request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

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
