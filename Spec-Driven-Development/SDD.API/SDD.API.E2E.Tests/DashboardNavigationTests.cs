using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class DashboardNavigationTests(DashboardUiFixture dashboard) : PageTest
{
    [Fact]
    public async Task Masters_menu_shows_two_destinations_and_opens_each_route()
    {
        await Page.GotoAsync(dashboard.BaseAddress.ToString());

        var header = Page.GetByRole(AriaRole.Banner);
        var masters = header.GetByRole(AriaRole.Button, new() { Name = "Masters" });
        await Expect(header).ToBeVisibleAsync();
        await Expect(masters).ToHaveCountAsync(1);
        await masters.ClickAsync();

        var menu = Page.GetByRole(AriaRole.Menu);
        var menuItems = menu.GetByRole(AriaRole.Menuitem);
        await Expect(menuItems).ToHaveCountAsync(2);
        await Expect(menu.GetByRole(AriaRole.Menuitem, new() { Name = "Company Master" })).ToBeVisibleAsync();
        await Expect(menu.GetByRole(AriaRole.Menuitem, new() { Name = "Listing Master" })).ToBeVisibleAsync();

        await menu.GetByRole(AriaRole.Menuitem, new() { Name = "Company Master" }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("/company-master$"));
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Company Master" })).ToBeVisibleAsync();

        await masters.ClickAsync();
        await menu.GetByRole(AriaRole.Menuitem, new() { Name = "Listing Master" }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex("/listing-master$"));
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Listing Master" })).ToBeVisibleAsync();
    }
}
