import { expect, test } from "@playwright/test";
import {
  createMakeThroughApi,
  newMakeCode,
  openMake,
  removeMakeThroughApi,
  searchFor,
} from "./helpers";

// Eleven makes sharing one run id, so a search for that id shows exactly them: ten on page one and one on page two.
const runId = Math.random()
  .toString(16)
  .slice(2, 10)
  .padEnd(8, "0")
  .toUpperCase();
const codes = Array.from(
  { length: 11 },
  (_, index) => `ZT${runId}${String(index + 1).padStart(2, "0")}`,
);

test.describe("Find and browse vehicle makes", () => {
  test.beforeAll(async ({ request }) => {
    for (const [index, makeCode] of codes.entries()) {
      await createMakeThroughApi(request, {
        makeCode,
        makeName: `Browse Make ${String(index + 1).padStart(2, "0")}`,
        shortName: `B${String(index + 1).padStart(2, "0")}`,
        active: index !== 10,
      });
    }
  });

  test.afterAll(async ({ request }) => {
    for (const makeCode of codes) {
      await removeMakeThroughApi(request, makeCode);
    }
  });

  test("shows ten makes a page in Make Code order and moves between pages", async ({
    page,
  }) => {
    await page.goto("/vehicle-makes");
    await searchFor(page, runId);

    const rows = page.locator("tr.mat-mdc-row");
    await expect(rows).toHaveCount(10);
    await expect(rows.first()).toContainText(codes[0]);

    await page.getByRole("button", { name: "Next page" }).click();
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText(codes[10]);
  });

  test("sorting by Make Name descending covers every page", async ({
    page,
  }) => {
    await page.goto("/vehicle-makes");
    await searchFor(page, runId);
    await expect(page.locator("tr.mat-mdc-row")).toHaveCount(10);

    // Click the sort label itself: the middle of the header cell is the filter box.
    const makeNameSort = page
      .locator("[mat-sort-header]")
      .filter({ hasText: "Make Name" });
    await makeNameSort.click();
    await makeNameSort.click();

    await expect(page.locator("tr.mat-mdc-row").first()).toContainText(
      "Browse Make 11",
    );
  });

  test("shows each make as Active or Inactive and keeps inactive makes in the list", async ({
    page,
  }) => {
    await page.goto("/vehicle-makes");
    await searchFor(page, runId);

    const rows = page.locator("tr.mat-mdc-row");
    // Wait for the debounced code filter to finish before changing pages. Otherwise
    // its response can reset the paginator after the click and leave us on page one.
    await expect(rows).toHaveCount(10);
    await expect(rows.first()).toContainText(codes[0]);
    await expect(rows.first()).toContainText("Active");

    await page.getByRole("button", { name: "Next page" }).click();
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText(codes[10]);
    await expect(rows.first()).toContainText("Inactive");
  });

  test("says so when nothing matches the search", async ({ page }) => {
    await page.goto("/vehicle-makes");
    await searchFor(page, newMakeCode());

    await expect(
      page.getByText("No vehicle makes match your filters."),
    ).toBeVisible();
  });

  test("opens a make with its code locked and the rest editable", async ({
    page,
  }) => {
    await openMake(page, codes[0]);

    await expect(
      page.getByRole("heading", { name: "Vehicle make details" }),
    ).toBeVisible();
    await expect(page.getByLabel("Make Code", { exact: true })).toHaveValue(
      codes[0],
    );
    await expect(page.getByLabel("Make Code", { exact: true })).toBeDisabled();
    await expect(page.getByLabel("Make Name", { exact: true })).toBeEnabled();
    await expect(page.getByLabel("Short Name", { exact: true })).toBeEnabled();
    await expect(page.getByRole("switch", { name: "Active" })).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "Save changes" }),
    ).toBeVisible();
  });
});
