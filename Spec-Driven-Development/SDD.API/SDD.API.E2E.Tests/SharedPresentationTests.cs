using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using SDD.API.E2E.Tests.Fixtures;

namespace SDD.API.E2E.Tests;

[Collection(DashboardUiCollection.Name)]
public sealed class SharedPresentationTests(DashboardUiFixture dashboard) : PageTest
{
    [Fact]
    public async Task Shared_controls_keep_their_theme_and_fit_a_narrow_viewport()
    {
        await Page.SetViewportSizeAsync(390, 844);
        await Page.GotoAsync(dashboard.BaseAddress.ToString());

        var header = Page.GetByRole(AriaRole.Banner);
        var headerPosition = await header.EvaluateAsync<string>("element => getComputedStyle(element).position");
        Assert.Equal("sticky", headerPosition);
        Assert.Equal(
            "#23685f",
            await Page.EvaluateAsync<string>(
                "() => getComputedStyle(document.documentElement).getPropertyValue('--color-primary-700').trim()"));

        var headerBox = await header.BoundingBoxAsync();
        var mastersBox = await header.GetByRole(AriaRole.Button, new() { Name = "Masters" }).BoundingBoxAsync();
        if (headerBox is null || mastersBox is null)
        {
            throw new InvalidOperationException("The dashboard header or Masters control is not visible.");
        }

        Assert.True(mastersBox.X >= headerBox.X);
        Assert.True(mastersBox.X + mastersBox.Width <= headerBox.X + headerBox.Width);

        var content = Page.Locator("main.dashboard-content");
        await Expect(content).ToBeVisibleAsync();
        Assert.Equal(string.Empty, (await content.InnerTextAsync()).Trim());
    }
}
