import { expect, test } from "@playwright/test";
import {
  createMakeThroughApi,
  newMakeCode,
  removeMakeThroughApi,
  searchFor,
} from "./helpers";

test.describe("Permanently delete a vehicle make", () => {
  let makeCode = "";

  test.beforeEach(async ({ request, page }) => {
    makeCode = newMakeCode();
    await createMakeThroughApi(request, {
      makeCode,
      makeName: "Delete Me",
      shortName: "Delete",
    });
    await page.goto("/vehicle-makes");
    await searchFor(page, makeCode);
  });

  test.afterEach(async ({ request }) => {
    await removeMakeThroughApi(request, makeCode);
  });

  test("cancelling the warning leaves the make in place", async ({ page }) => {
    await page
      .getByRole("button", { name: `Delete ${makeCode}`, exact: true })
      .click();

    await expect(page.getByText("This cannot be undone.")).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(
      page.locator("tr.mat-mdc-row").filter({ hasText: makeCode }),
    ).toHaveCount(1);
  });

  test("confirming the warning removes the make for good", async ({ page }) => {
    await page
      .getByRole("button", { name: `Delete ${makeCode}`, exact: true })
      .click();
    await page.getByRole("button", { name: "Delete permanently" }).click();

    await expect(page.getByText("Vehicle make deleted.")).toBeVisible();
    await expect(
      page.locator("tr.mat-mdc-row").filter({ hasText: makeCode }),
    ).toHaveCount(0);
  });
});

// Not covered yet: the refusal for a make that still has models (FR-026, the "delete its models first" message). A test
// needs a model to exist, which is only possible once models can be added through the API and page (tasks T033 to T039).
