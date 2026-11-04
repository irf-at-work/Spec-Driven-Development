using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class CompanyStructureEditE2ETests(DashboardUiFixture dashboard) : PageTest
{
    [Fact]
    public async Task Edits_division_and_manages_new_existing_and_removed_department_assignments()
    {
        var divisionName = "Western Office";
        var westDepartments = new List<object> { Department("FIN", "Finance", ["WEST", "EAST"]) };
        var eastDepartments = new List<object> { Department("FIN", "Finance", ["WEST", "EAST"]) };
        var updateRequest = string.Empty;
        var newDepartmentRequest = string.Empty;
        var linkedDepartmentRequest = string.Empty;
        var requests = new List<string>();
        await Page.RouteAsync("**/api/companies**", async route =>
        {
            if (await FulfillPreflightAsync(route))
            {
                return;
            }

            var path = new Uri(route.Request.Url).AbsolutePath;
            requests.Add($"{route.Request.Method} {path}");
            if (path == "/api/companies/NORTH/divisions" && route.Request.Method == "GET")
            {
                await FulfillJsonAsync(route, new[]
                {
                    Division("WEST", divisionName, westDepartments.ToArray()),
                    Division("EAST", "Eastern Office", eastDepartments.ToArray()),
                }, 200);
            }
            else if (path == "/api/companies/NORTH/divisions/WEST" && route.Request.Method == "PUT")
            {
                updateRequest = route.Request.PostData ?? string.Empty;
                using var body = JsonDocument.Parse(updateRequest);
                divisionName = body.RootElement.GetProperty("name").GetString()!;
                await FulfillJsonAsync(route, Division("WEST", divisionName, westDepartments.ToArray()), 200);
            }
            else if (path == "/api/companies/NORTH/departments" && route.Request.Method == "GET")
            {
                await FulfillJsonAsync(route, new[]
                {
                    LogicalDepartment("FIN", "Finance", ["WEST", "EAST"]),
                    LogicalDepartment("HR", "Human Resources", ["EAST"]),
                    LogicalDepartment("OPS", "Operations", ["WEST"]),
                }, 200);
            }
            else if (path == "/api/companies/NORTH/departments" && route.Request.Method == "POST")
            {
                newDepartmentRequest = route.Request.PostData ?? string.Empty;
                westDepartments.Add(Department("OPS", "Operations", ["WEST"]));
                await FulfillJsonAsync(route, LogicalDepartment("OPS", "Operations", ["WEST"]), 201);
            }
            else if (path == "/api/companies/NORTH/divisions/WEST/departments" && route.Request.Method == "POST")
            {
                linkedDepartmentRequest = route.Request.PostData ?? string.Empty;
                westDepartments.Add(Department("HR", "Human Resources", ["WEST", "EAST"]));
                await FulfillJsonAsync(route, new[] { LogicalDepartment("HR", "Human Resources", ["WEST", "EAST"]) }, 200);
            }
            else if (path == "/api/companies/NORTH/divisions/WEST/departments/FIN" &&
                route.Request.Method == "DELETE")
            {
                westDepartments.RemoveAll(department =>
                    JsonSerializer.SerializeToElement(department)
                        .GetProperty("departmentCode").GetString() == "FIN");
                await FulfillEmptyAsync(route, 204);
            }
            else if (path == "/api/companies/NORTH")
            {
                await FulfillJsonAsync(route, CompanyDetails(), 200);
            }
            else
            {
                await FulfillJsonAsync(route, new { title = "Unexpected request" }, 404);
            }
        });

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/NORTH").ToString());
        await Page.GetByRole(AriaRole.Button, new() { Name = "Edit division WEST", Exact = true }).ClickAsync();
        await Page.GetByLabel("Division name", new() { Exact = true }).FillAsync("Western Hub");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save division" }).ClickAsync();
        await Expect(Page.Locator(".division-panel mat-panel-title").First).ToContainTextAsync("Western Hub");
        Assert.Contains("\"name\":\"Western Hub\"", updateRequest);

        await Page.GetByRole(AriaRole.Button, new() { Name = "Edit division WEST", Exact = true }).ClickAsync();
        await Page.GetByRole(AriaRole.Button, new() { Name = "Add new department" }).ClickAsync();
        await Page.GetByLabel("Department code").FillAsync("OPS");
        await Page.GetByLabel("Department name").FillAsync("Operations");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Save department" }).ClickAsync();
        await Expect(Page.GetByText("Operations", new() { Exact = true })).ToBeVisibleAsync();
        Assert.Contains("\"divisionCodes\":[\"WEST\"]", newDepartmentRequest);

        await Page.GetByRole(AriaRole.Button, new() { Name = "Add existing departments" }).ClickAsync();
        await Page.Locator(".department-dialog mat-select").ClickAsync();
        var hrOption = Page.GetByRole(AriaRole.Option, new() { Name = "Human Resources (HR)" });
        await hrOption.ClickAsync();
        await Expect(hrOption).ToHaveAttributeAsync("aria-selected", "true");
        await Page.Keyboard.PressAsync("Escape");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Add selected departments" }).ClickAsync();
        await Expect(Page.Locator(".department-dialog")).ToHaveCountAsync(0);
        Assert.Contains(
            "POST /api/companies/NORTH/divisions/WEST/departments",
            requests);
        Assert.Contains("\"departmentCodes\":[\"HR\"]", linkedDepartmentRequest);

        var westPanel = Page.Locator(".division-panel").Nth(0);
        var actionColumn = westPanel.Locator(".department-action-column").First;
        await Expect(actionColumn).ToBeVisibleAsync();
        Assert.Equal("sticky", await actionColumn.EvaluateAsync<string>("element => getComputedStyle(element).position"));

        Page.Dialog += async (_, dialog) => await dialog.AcceptAsync();
        await Page.GetByRole(AriaRole.Button, new() { Name = "Remove Finance from Western Hub" }).ClickAsync();
        await Expect(westPanel.GetByText("Finance", new() { Exact = true })).ToHaveCountAsync(0);
        var eastPanel = Page.Locator(".division-panel").Nth(1);
        await eastPanel.Locator("mat-expansion-panel-header").ClickAsync();
        await Expect(eastPanel.GetByText("Finance", new() { Exact = true })).ToBeVisibleAsync();
    }

    [Fact]
    public async Task Cancelling_division_deletion_keeps_the_division_unchanged()
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
                await FulfillJsonAsync(route, new[] { Division("WEST", "Western Office", []) }, 200);
            }
            else
            {
                await FulfillJsonAsync(route, CompanyDetails(), 200);
            }
        });
        Page.Dialog += async (_, dialog) => await dialog.DismissAsync();

        await Page.GotoAsync(new Uri(dashboard.BaseAddress, "/company-master/NORTH").ToString());
        await Page.GetByRole(AriaRole.Button, new() { Name = "Delete division WEST", Exact = true }).ClickAsync();

        await Expect(Page.Locator(".division-panel mat-panel-title").First).ToContainTextAsync("Western Office");
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

    private static object Department(string code, string name, string[] divisionCodes) => new
    {
        departmentCode = code,
        name,
        divisionCodes,
    };

    private static object LogicalDepartment(string code, string name, string[] divisionCodes) => new
    {
        departmentCode = code,
        name,
        divisionCodes,
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

    private static Task FulfillEmptyAsync(IRoute route, int status) =>
        route.FulfillAsync(new RouteFulfillOptions
        {
            Status = status,
            Headers = CorsHeaders(),
        });

    private static Dictionary<string, string> CorsHeaders() => new()
    {
        ["Access-Control-Allow-Origin"] = "http://127.0.0.1:4200",
        ["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS",
        ["Access-Control-Allow-Headers"] = "content-type, accept",
    };
}
