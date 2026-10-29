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

        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Dashboard" })).ToBeVisibleAsync();
        await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Masters" })).ToBeVisibleAsync();
        await Expect(Page.GetByTestId("shared-table-wrapper")).ToBeVisibleAsync();
    }
}
