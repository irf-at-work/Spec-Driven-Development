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
            "#1b5b8d",
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

        var tableWrapper = Page.GetByTestId("shared-table-wrapper");
        await Expect(tableWrapper).ToBeVisibleAsync();
        Assert.Equal(
            "auto",
            await tableWrapper.EvaluateAsync<string>("element => getComputedStyle(element).overflowX"));
        Assert.NotEmpty(await Page.GetByRole(AriaRole.Columnheader).First.EvaluateAsync<string>(
            "element => getComputedStyle(element).backgroundColor"));

        var filter = Page.GetByLabel("Search examples");
        await Expect(filter).ToBeVisibleAsync();
        Assert.NotEqual(
            "rgba(0, 0, 0, 0)",
            await filter.EvaluateAsync<string>("element => getComputedStyle(element).borderTopColor"));
    }
}
