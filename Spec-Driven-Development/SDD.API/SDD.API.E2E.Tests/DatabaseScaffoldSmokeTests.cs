using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class DatabaseScaffoldSmokeTests(
    DashboardUiFixture dashboard,
    DatabaseScaffoldApiFixture api) : PageTest
{
    [Fact]
    public async Task Dashboard_remains_usable_while_the_api_with_registered_context_is_running()
    {
        Assert.True(api.IsRunning);

        await Page.GotoAsync(dashboard.BaseAddress.ToString());

        var content = Page.Locator("main.dashboard-content");
        await Expect(content).ToBeVisibleAsync();
        Assert.Equal(string.Empty, (await content.InnerTextAsync()).Trim());
        await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Masters" })).ToBeVisibleAsync();
    }
}
