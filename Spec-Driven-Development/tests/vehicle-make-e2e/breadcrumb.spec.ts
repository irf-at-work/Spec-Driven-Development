import { expect, test } from "@playwright/test";
import {
  createMakeThroughApi,
  newMakeCode,
  removeMakeThroughApi,
} from "./helpers";

test.describe("Breadcrumb", () => {
  let makeCode = "";

  test.beforeEach(async ({ request }) => {
    makeCode = newMakeCode();
    await createMakeThroughApi(request, {
      makeCode,
      makeName: "Crumb Make",
      shortName: "Crumb",
    });
  });

  test.afterEach(async ({ request }) => {
    await removeMakeThroughApi(request, makeCode);
  });

  test("the list page shows where you are, and the current step is not a link", async ({
    page,
  }) => {
    await page.goto("/vehicle-makes");

    const trail = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(trail).toContainText("Master Data");
    await expect(trail.locator('[aria-current="page"]')).toHaveText(
      "Vehicle Makes",
    );
    await expect(trail.getByRole("link")).toHaveCount(0);
  });

  test("the add page links back to the list", async ({ page }) => {
    await page.goto("/vehicle-makes/new");

    const trail = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(trail.locator('[aria-current="page"]')).toHaveText(
      "Add vehicle make",
    );

    await trail.getByRole("link", { name: "Vehicle Makes" }).click();

    await expect(
      page.getByRole("heading", { name: "Vehicle Make Master" }),
    ).toBeVisible();
  });

  test("a model page links back to its make, which opens with its code and a clean address", async ({
    page,
  }) => {
    await page.goto(`/vehicle-makes/${makeCode}/models/new`);

    const trail = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(trail.locator('[aria-current="page"]')).toHaveText(
      "Add model",
    );

    await trail.getByRole("link", { name: makeCode }).click();

    await expect(
      page.getByRole("heading", { name: "Vehicle make details" }),
    ).toBeVisible();
    await expect(trail.locator('[aria-current="page"]')).toHaveText(makeCode);
    // The code travels in the navigation state, so it is not in the address.
    await expect(page).toHaveURL(/\/vehicle-makes\/view$/);
  });

  test("using a breadcrumb with unsaved changes asks before leaving", async ({
    page,
  }) => {
    await page.goto("/vehicle-makes/new");
    await page.getByLabel("Make Code").fill("ZTCRUMB");

    const trail = page.getByRole("navigation", { name: "Breadcrumb" });
    await trail.getByRole("link", { name: "Vehicle Makes" }).click();
    await expect(page.getByText("Discard your changes?")).toBeVisible();

    await page.getByRole("button", { name: "Keep editing" }).click();
    await expect(
      page.getByRole("heading", { name: "Add vehicle make" }),
    ).toBeVisible();

    await trail.getByRole("link", { name: "Vehicle Makes" }).click();
    await page.getByRole("button", { name: "Discard changes" }).click();
    await expect(
      page.getByRole("heading", { name: "Vehicle Make Master" }),
    ).toBeVisible();
  });
});
