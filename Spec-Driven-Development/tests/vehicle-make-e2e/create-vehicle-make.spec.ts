import { expect, test } from "@playwright/test";
import {
  createMakeThroughApi,
  newMakeCode,
  openMake,
  removeMakeThroughApi,
} from "./helpers";

test.describe("Add a vehicle make", () => {
  const created: string[] = [];

  test.afterAll(async ({ request }) => {
    for (const makeCode of created) {
      await removeMakeThroughApi(request, makeCode);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/vehicle-makes");
    await page.getByRole("button", { name: "Add vehicle make" }).click();
  });

  test("saves a valid make with tidy names, in capitals, and Active on by default", async ({
    page,
  }) => {
    const makeCode = newMakeCode();
    created.push(makeCode);

    await expect(page.getByRole("switch", { name: "Active" })).toBeChecked();
    await page
      .getByLabel("Make Code", { exact: true })
      .fill(makeCode.toLowerCase());
    await page.getByLabel("Make Name", { exact: true }).fill("toyota   motor");
    await page.getByLabel("Short Name", { exact: true }).fill("toyota");
    await page.getByRole("button", { name: "Save vehicle make" }).click();

    await expect(page.getByText("Vehicle make saved.")).toBeVisible();
    await page.getByLabel("Search by code, name or short name").fill(makeCode);
    const row = page.locator("tr.mat-mdc-row").filter({ hasText: makeCode });
    await expect(row).toContainText("Toyota Motor");
    await expect(row).toContainText("Active");
  });

  test("lets the user switch Active off while adding", async ({ page }) => {
    const makeCode = newMakeCode();
    created.push(makeCode);

    await page.getByLabel("Make Code", { exact: true }).fill(makeCode);
    await page.getByLabel("Make Name", { exact: true }).fill("Dormant Make");
    await page.getByLabel("Short Name", { exact: true }).fill("Dormant");
    await page.getByRole("switch", { name: "Active" }).click();
    await page.getByRole("button", { name: "Save vehicle make" }).click();

    await expect(page.getByText("Vehicle make saved.")).toBeVisible();
    await openMake(page, makeCode);
    await expect(
      page.getByRole("switch", { name: "Active" }),
    ).not.toBeChecked();
  });

  test("tells the user which required fields are missing and saves nothing", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Save vehicle make" }).click();

    await expect(page.getByText("Make Code is required.")).toBeVisible();
    await expect(page.getByText("Make Name is required.")).toBeVisible();
    await expect(page.getByText("Short Name is required.")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Add vehicle make" }),
    ).toBeVisible();
  });

  test("rejects a code with characters other than letters, digits and hyphens", async ({
    page,
  }) => {
    await page.getByLabel("Make Code", { exact: true }).fill("BAD_CODE");
    await page.getByLabel("Make Name", { exact: true }).fill("Some Make");
    await page.getByLabel("Short Name", { exact: true }).fill("Some");
    await page.getByRole("button", { name: "Save vehicle make" }).click();

    await expect(
      page.getByText("Make Code can contain only letters, digits and hyphens."),
    ).toBeVisible();
  });

  test("stops typing at the limit and shows the maximum-characters message", async ({
    page,
  }) => {
    const shortName = page.getByLabel("Short Name", { exact: true });

    // Typed key by key, because fill() sets the value directly and would skip the browser's own length limit.
    await shortName.pressSequentially("x".repeat(40));

    await expect(shortName).toHaveValue("x".repeat(30));
    await expect(page.getByText("Maximum 30 characters.")).toBeVisible();
  });

  test("keeps Arabic text exactly as typed, shown right to left", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Additional Information" }).click();
    const arabic = "  تويوتا   موتور ";
    const arabicName = page.getByLabel("Arabic Make Name", { exact: true });

    await arabicName.fill(arabic);

    await expect(arabicName).toHaveAttribute("dir", "rtl");
    await expect(arabicName).toHaveValue(arabic);
  });

  test("refuses a code that already exists and says so beside the field", async ({
    page,
    request,
  }) => {
    const makeCode = newMakeCode();
    created.push(makeCode);
    await createMakeThroughApi(request, {
      makeCode,
      makeName: "First Name",
      shortName: "First",
    });

    await page.getByLabel("Make Code", { exact: true }).fill(makeCode);
    await page.getByLabel("Make Name", { exact: true }).fill("Second Name");
    await page.getByLabel("Short Name", { exact: true }).fill("Second");
    await page.getByRole("button", { name: "Save vehicle make" }).click();

    await expect(
      page.getByText("This make code already exists."),
    ).toBeVisible();
  });
});
