using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class CompanyAddEditE2ETests(DashboardUiFixture dashboard) : PageTest
{
    [Fact]
    public async Task Create_form_prefills_short_name_accepts_dates_and_submits_date_only_values()
    {
        var createRequest = string.Empty;
        await Page.RouteAsync("**/api/companies**", async route =>
        {
            if (await FulfillPreflightAsync(route))
            {
                return;
            }

            if (string.Equals(route.Request.Method, "POST", StringComparison.OrdinalIgnoreCase))
            {
                createRequest = route.Request.PostData ?? string.Empty;
                await FulfillJsonAsync(route, CompanyDetails(), 201);
                return;
            }

            await FulfillJsonAsync(route, CompanyList(), 200);
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/new").ToString());
        await Page.GetByLabel("Company code").FillAsync("NEWCO");
        var companyName = "A company name that exceeds thirty characters";
        await Page.GetByLabel("Company name").FillAsync(companyName);
        var shortName = Page.GetByLabel("Short name");
        await Expect(shortName).ToHaveValueAsync(companyName[..30]);
        await shortName.FillAsync(new string('x', 31));
        await Expect(shortName).ToHaveValueAsync(new string('x', 30));
        Assert.Equal("30", await shortName.GetAttributeAsync("maxlength"));
        await shortName.FillAsync("New Company");

        var datePickerToggle = Page.GetByRole(AriaRole.Button, new() { Name = "Open calendar" }).First;
        await datePickerToggle.ClickAsync();
        await Page.Locator(".mat-calendar-body-today").ClickAsync();
        var incorporationDate = Page.Locator("input[formcontrolname='incorporationDate']");
        await Expect(incorporationDate).ToHaveValueAsync(new Regex("^\\d{2}-\\d{2}-\\d{4}$"));

        await incorporationDate.FillAsync("09-01-2024");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save", Exact = true }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("/company-master/NEWCO$"));

        using var request = JsonDocument.Parse(createRequest);
        Assert.Equal("2024-01-09", request.RootElement.GetProperty("incorporationDate").GetString());
        Assert.Equal("New Company", request.RootElement.GetProperty("shortName").GetString());
    }

    [Fact]
    public async Task Duplicate_code_is_associated_with_its_field_and_company_name_can_be_edited_in_place()
    {
        var updateRequest = string.Empty;
        var currentCompanyName = "North Insurance";
        await Page.RouteAsync("**/api/companies**", async route =>
        {
            if (await FulfillPreflightAsync(route))
            {
                return;
            }

            var path = new Uri(route.Request.Url).AbsolutePath;
            if (string.Equals(route.Request.Method, "POST", StringComparison.OrdinalIgnoreCase))
            {
                await FulfillJsonAsync(route, new { title = "Conflict", status = 409 }, 409);
            }
            else if (string.Equals(route.Request.Method, "PUT", StringComparison.OrdinalIgnoreCase))
            {
                updateRequest = route.Request.PostData ?? string.Empty;
                currentCompanyName = "North Mutual";
                await FulfillJsonAsync(route, CompanyDetails("NORTH", currentCompanyName), 200);
            }
            else if (path.EndsWith("/NORTH", StringComparison.OrdinalIgnoreCase))
            {
                await FulfillJsonAsync(route, CompanyDetails("NORTH", currentCompanyName), 200);
            }
            else
            {
                await FulfillJsonAsync(route, CompanyList(), 200);
            }
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/new").ToString());
        await Page.GetByLabel("Company code").FillAsync("NORTH");
        await Page.GetByLabel("Company name").FillAsync("North Insurance");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save", Exact = true }).ClickAsync();
        await Expect(Page.GetByText("This company code already exists.")).ToBeVisibleAsync();

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/NORTH/edit").ToString());
        var companyName = Page.GetByLabel("Company name");
        await Expect(companyName).ToBeEnabledAsync();
        await Expect(companyName).ToHaveValueAsync("North Insurance");
        await Expect(Page.GetByText("NORTH", new() { Exact = true }).First).ToBeVisibleAsync();
        await Expect(Page.Locator("[formControlName='companyCode']")).ToHaveCountAsync(0);
        var fieldLabels = Page.Locator("app-company-fields .field-group h2");
        await Expect(fieldLabels).ToHaveTextAsync(["Company information", "Address", "Licensing", "Contact"]);
        var companyFieldNames = await Page.Locator("app-company-fields mat-form-field mat-label").AllTextContentsAsync();
        Assert.Equal(
            ["Company name", "Short name", "Address 1", "Address 2", "Address 3", "Incorporation date", "Reference number", "Licence issue date", "Licence expiry date", "Company in charge", "Phone", "Email", "Website"],
            companyFieldNames.Select(label => label.Trim()));
        await companyName.FillAsync("North Mutual");
        await Page.GetByLabel("Short name").FillAsync("Updated North");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save", Exact = true }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("/company-master/NORTH$"));
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "North Mutual" })).ToBeVisibleAsync();

        using var request = JsonDocument.Parse(updateRequest);
        Assert.False(request.RootElement.TryGetProperty("companyCode", out _));
        Assert.Equal("North Mutual", request.RootElement.GetProperty("companyName").GetString());
        Assert.Equal("Updated North", request.RootElement.GetProperty("shortName").GetString());
    }

    [Fact]
    public async Task Details_view_and_edit_keep_company_fields_in_the_same_order_and_cancel_restores_values()
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
                path.EndsWith("/divisions", StringComparison.OrdinalIgnoreCase)
                    ? Array.Empty<object>()
                    : CompanyDetails("NORTH", "North Insurance"),
                200);
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/NORTH").ToString());
        var fieldGroups = Page.Locator("app-company-fields .field-group h2");
        await Expect(fieldGroups).ToHaveTextAsync(["Company information", "Address", "Licensing", "Contact"]);
        var viewFieldLabels = Page.Locator("app-company-fields .read-field span");
        await Expect(viewFieldLabels).ToHaveCountAsync(14);
        var viewLabels = await viewFieldLabels.AllTextContentsAsync();
        await Page.GetByRole(AriaRole.Button, new() { Name = "Edit", Exact = true }).ClickAsync();
        var companyName = Page.GetByLabel("Company name");
        await companyName.FillAsync("Unsaved name");
        await Page.GetByLabel("Address 1").FillAsync("Unsaved address");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Cancel" }).ClickAsync();
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "North Insurance" })).ToBeVisibleAsync();
        await Expect(viewFieldLabels).ToHaveCountAsync(14);
        var restoredLabels = await viewFieldLabels.AllTextContentsAsync();
        Assert.Equal(viewLabels, restoredLabels);
        var restoredName = await Page.Locator("app-company-fields .read-field")
            .Filter(new() { HasText = "Company name" })
            .Locator("strong")
            .InnerTextAsync();
        Assert.Equal("North Insurance", restoredName);
        var restoredAddress = await Page.Locator("app-company-fields .read-field")
            .Filter(new() { HasText = "Address 1" })
            .Locator("strong")
            .InnerTextAsync();
        Assert.Equal("Bay Road", restoredAddress);
    }

    private static object CompanyList() => new
    {
        items = Array.Empty<object>(),
        page = 1,
        pageSize = 10,
        totalCount = 0,
    };

    private static object CompanyDetails(string companyCode = "NEWCO", string companyName = "New Company") => new
    {
        companyCode,
        companyName,
        shortName = companyName,
        address1 = companyCode == "NORTH" ? "Bay Road" : null,
        address2 = (string?)null,
        address3 = (string?)null,
        incorporationDate = "2024-01-09",
        referenceNumber = (string?)null,
        licenceIssueDate = (string?)null,
        licenceExpiryDate = (string?)null,
        companyInCharge = (string?)null,
        phone = (string?)null,
        email = (string?)null,
        website = (string?)null,
        createdBy = "Admin",
        lastUpdatedBy = "Admin",
        createdAt = "2024-01-09T00:00:00Z",
        lastUpdatedAt = "2024-01-09T00:00:00Z",
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
