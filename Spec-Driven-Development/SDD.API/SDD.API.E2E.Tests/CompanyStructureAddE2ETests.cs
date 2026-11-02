using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class CompanyStructureAddE2ETests(DashboardUiFixture dashboard) : PageTest
{
    [Fact]
    public async Task Persists_each_setup_step_before_advancing_and_finishes_on_company_details()
    {
        var companySaved = false;
        var divisionsSaved = false;
        var divisionRequest = string.Empty;
        var departmentRequest = string.Empty;
        await Page.RouteAsync("**/api/companies**", async route =>
        {
            if (await FulfillPreflightAsync(route))
            {
                return;
            }

            var path = new Uri(route.Request.Url).AbsolutePath;
            if (path == "/api/companies" && route.Request.Method == "POST")
            {
                companySaved = true;
                await FulfillJsonAsync(route, CompanyDetails(), 201);
            }
            else if (path == "/api/companies/NORTH/divisions" && route.Request.Method == "POST")
            {
                Assert.True(companySaved);
                divisionRequest = route.Request.PostData ?? string.Empty;
                divisionsSaved = true;
                await FulfillJsonAsync(route, new[] { Division("WEST", "Western Office") }, 201);
            }
            else if (path == "/api/companies/NORTH/divisions")
            {
                await FulfillJsonAsync(
                    route,
                    divisionsSaved ? new[] { Division("WEST", "Western Office") } : Array.Empty<object>(),
                    200);
            }
            else if (path == "/api/companies/NORTH/departments" && route.Request.Method == "POST")
            {
                departmentRequest = route.Request.PostData ?? string.Empty;
                await FulfillJsonAsync(route, new
                {
                    departmentCode = "FIN",
                    name = "Finance",
                    shortName = "Finance",
                    divisionCodes = new[] { "WEST" },
                }, 201);
            }
            else
            {
                await FulfillJsonAsync(route, CompanyDetails(), 200);
            }
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/new").ToString());
        await Expect(Page.Locator("[data-step]")).ToHaveCountAsync(3);
        await Page.GetByLabel("Company code").FillAsync("NORTH");
        await Page.GetByLabel("Company name").FillAsync("North Insurance");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save & Add Division" }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("/company-master/new\\?.*step=division"));

        await Page.GetByRole(AriaRole.Button, new() { Name = "Add new division" }).ClickAsync();
        await Page.GetByLabel("Division code").FillAsync("WEST");
        await Page.GetByLabel("Division name").FillAsync("Western Office");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save & Add Department" }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("/company-master/new\\?.*step=department"));
        Assert.Contains("\"divisionCode\":\"WEST\"", divisionRequest);
        Assert.Contains("Add new department", await Page.Locator("body").InnerTextAsync());

        await Expect(Page.Locator("[formcontrolname='departmentCode']")).ToHaveCountAsync(1);
        await Page.Locator("[formcontrolname='departmentCode']").FillAsync("FIN");
        await Page.Locator("[formcontrolname='name']").FillAsync("Finance");
        await Page.Locator("mat-select[formcontrolname='divisionCodes']").ClickAsync();
        await Page.GetByRole(AriaRole.Option, new() { Name = "Western Office (WEST)" }).ClickAsync();
        await Page.Keyboard.PressAsync("Escape");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save", Exact = true }).ClickAsync();

        await Expect(Page).ToHaveURLAsync(new Regex("/company-master/NORTH$"));
        Assert.True(companySaved);
        Assert.Contains("\"departmentCode\":\"FIN\"", departmentRequest);
        Assert.Contains("\"divisionCodes\":[\"WEST\"]", departmentRequest);
    }

    [Fact]
    public async Task Keeps_basic_details_on_the_current_step_when_company_save_fails()
    {
        await Page.RouteAsync("**/api/companies**", async route =>
        {
            if (await FulfillPreflightAsync(route))
            {
                return;
            }

            await FulfillJsonAsync(route, new { title = "Unavailable", detail = "Try again later." }, 500);
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/new").ToString());
        await Page.GetByLabel("Company code").FillAsync("NORTH");
        await Page.GetByLabel("Company name").FillAsync("North Insurance");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save & Add Division" }).ClickAsync();

        await Expect(Page.GetByRole(AriaRole.Alert)).ToContainTextAsync("Try again later.");
        await Expect(Page).ToHaveURLAsync(new Regex("/company-master/new$"));
        await Expect(Page.GetByLabel("Company code")).ToHaveValueAsync("NORTH");
        await Expect(Page.GetByLabel("Company name")).ToHaveValueAsync("North Insurance");
    }

    [Fact]
    public async Task Keeps_division_details_on_the_current_step_when_division_save_fails()
    {
        await Page.RouteAsync("**/api/companies**", async route =>
        {
            if (await FulfillPreflightAsync(route))
            {
                return;
            }

            var path = new Uri(route.Request.Url).AbsolutePath;
            if (path == "/api/companies" && route.Request.Method == "POST")
            {
                await FulfillJsonAsync(route, CompanyDetails(), 201);
            }
            else if (path == "/api/companies/NORTH/divisions" && route.Request.Method == "POST")
            {
                await FulfillJsonAsync(
                    route,
                    new { title = "Unavailable", detail = "Divisions could not be saved." },
                    500);
            }
            else
            {
                await FulfillJsonAsync(route, Array.Empty<object>(), 200);
            }
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/new").ToString());
        await Page.GetByLabel("Company code").FillAsync("NORTH");
        await Page.GetByLabel("Company name").FillAsync("North Insurance");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save & Add Division" }).ClickAsync();
        await Page.GetByRole(AriaRole.Button, new() { Name = "Add new division" }).ClickAsync();
        await Page.GetByLabel("Division code").FillAsync("WEST");
        await Page.GetByLabel("Division name").FillAsync("Western Office");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save & Add Department" }).ClickAsync();

        await Expect(Page.GetByRole(AriaRole.Alert)).ToContainTextAsync("Divisions could not be saved.");
        await Expect(Page).ToHaveURLAsync(new Regex("/company-master/new\\?.*step=division"));
        await Expect(Page.Locator("[formcontrolname='divisionCode']")).ToHaveValueAsync("WEST");
        await Expect(Page.Locator("[formcontrolname='name']")).ToHaveValueAsync("Western Office");
    }

    private static object CompanyDetails() => new
    {
        companyCode = "NORTH",
        companyName = "North Insurance",
        shortName = "North Insurance",
        createdBy = "Admin",
        lastUpdatedBy = "Admin",
    };

    private static object Division(string code, string name) => new
    {
        divisionCode = code,
        name,
        shortName = name,
        departments = Array.Empty<object>(),
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
