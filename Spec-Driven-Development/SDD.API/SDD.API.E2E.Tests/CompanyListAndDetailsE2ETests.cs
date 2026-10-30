using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class CompanyListAndDetailsE2ETests(DashboardUiFixture dashboard) : PageTest
{
    [Fact]
    public async Task Company_list_supports_column_filters_sorting_and_pagination()
    {
        await Page.RouteAsync("**/api/companies**", async route =>
        {
            if (await FulfillPreflightAsync(route))
            {
                return;
            }

            await FulfillJsonAsync(route, CompanyList(), 200);
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master?page=2&pageSize=10&sortBy=companyName&sortDirection=desc&companyName=North").ToString());

        foreach (var column in new[]
        {
            "Actions",
            "Company name",
            "Short name",
            "Primary address",
            "Incorporation date",
            "Reference number",
            "Licence issue date",
            "Licence expiry date",
            "Company in charge",
            "Phone",
            "Email",
            "Website",
        })
        {
            await Expect(Page.GetByRole(AriaRole.Columnheader, new() { Name = column, Exact = true })).ToBeVisibleAsync();
        }

        var companyNameFilter = Page.GetByLabel("Filter by company name");
        await Expect(companyNameFilter).ToHaveValueAsync("North");
        await companyNameFilter.FillAsync("South");
        await Expect(Page).ToHaveURLAsync(new Regex("companyName=South"));
        await Expect(Page).ToHaveURLAsync(new Regex("page=1"));

        await Page.GetByRole(AriaRole.Columnheader, new() { Name = "Company name", Exact = true }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("sortDirection=asc"));

        await Page.GetByRole(AriaRole.Button, new() { Name = "Next page" }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("page=2"));
    }

    [Fact]
    public async Task Company_details_show_history_and_return_to_the_retained_list_state()
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
                path.EndsWith("/NORTH", StringComparison.OrdinalIgnoreCase) ? CompanyDetails() : CompanyList(),
                200);
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master?page=2&pageSize=10&sortBy=companyName&sortDirection=desc&shortName=North").ToString());
        await Page.GetByText("North Insurance", new() { Exact = true }).ClickAsync();
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "North Insurance" })).ToBeVisibleAsync();
        await Expect(Page.GetByText("02-01-2024", new() { Exact = true })).ToBeVisibleAsync();

        var history = Page.GetByRole(AriaRole.Button, new() { Name = "Created by Admin; last updated by Reviewer" });
        await history.FocusAsync();
        await Expect(history).ToBeFocusedAsync();
        await Expect(history).ToHaveAccessibleNameAsync("Created by Admin; last updated by Reviewer");
        await history.HoverAsync();
        var tooltip = Page.Locator(".mat-mdc-tooltip");
        await Expect(tooltip).ToBeVisibleAsync();
        await Expect(tooltip).ToContainTextAsync("Created by Admin");
        await Expect(tooltip).ToContainTextAsync("last updated by Reviewer");

        await Page.GetByRole(AriaRole.Link, new() { Name = "Back to companies" }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("page=2"));
        await Expect(Page).ToHaveURLAsync(new Regex("shortName=North"));
        await Expect(Page.GetByLabel("Filter by short name")).ToHaveValueAsync("North");
    }

    private static object CompanyList() => new
    {
        items = new[]
        {
            new
            {
                companyCode = "NORTH",
                companyName = "North Insurance",
                shortName = "North",
                primaryAddress = "Bay Road, Tower 2",
                incorporationDate = "2020-03-05",
                referenceNumber = "REF-1",
                licenceIssueDate = "2024-01-01",
                licenceExpiryDate = "2027-01-01",
                companyInCharge = "Alex",
                phone = "123",
                email = "alex@example.test",
                website = "north.example.test",
                createdBy = "Admin",
                lastUpdatedBy = "Reviewer",
            },
        },
        page = 1,
        pageSize = 10,
        totalCount = 30,
    };

    private static object CompanyDetails() => new
    {
        companyCode = "NORTH",
        companyName = "North Insurance",
        shortName = "North",
        address1 = "Bay Road",
        address2 = "Tower 2",
        primaryAddress = "Bay Road, Tower 2",
        incorporationDate = "2020-03-05",
        referenceNumber = "REF-1",
        licenceIssueDate = "2024-01-01",
        licenceExpiryDate = "2027-01-01",
        companyInCharge = "Alex",
        phone = "123",
        email = "alex@example.test",
        website = "north.example.test",
        createdBy = "Admin",
        lastUpdatedBy = "Reviewer",
        createdAt = "2024-01-01T22:30:00Z",
        lastUpdatedAt = "2024-01-01T00:00:00Z",
    };

    private static async Task<bool> FulfillPreflightAsync(IRoute route)
    {
        if (!string.Equals(route.Request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        await route.FulfillAsync(new RouteFulfillOptions
        {
            Status = 204,
            Headers = CorsHeaders(),
        });
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
