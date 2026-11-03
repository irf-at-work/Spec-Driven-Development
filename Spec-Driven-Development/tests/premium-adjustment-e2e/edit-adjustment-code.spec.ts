import {
  expect,
  test,
} from "../../sdd-ui/node_modules/@playwright/test/index.js";
import type { Page } from "../../sdd-ui/node_modules/@playwright/test/index.js";

const key = {
  codeType: "CALC01",
  code: "ZT1000000001",
  companyCode: "ZC2000000001",
};
const options = {
  codeTypes: [{ code: "CALC01", description: "Calculation" }],
  discountTypes: [{ code: "DISC01", description: "Standard discount" }],
  chargesTypes: [{ code: "CHG01", description: "Base charge" }],
  chargesCategories: [{ code: "CAT01", description: "Motor" }],
};
const adjustment = {
  ...key,
  codeTypeDescription: "Calculation",
  name: "Premium Cover",
  shortName: "Cover",
  discountType: "INACTIVE",
  chargesType: "CHG01",
  chargesCategory: "CAT01",
  remarks: "Existing notes",
  arabicName: "غطاء",
  arabicShortName: null,
  arabicRemarks: null,
  active: true,
  createdBy: "admin",
  lastChangedBy: "admin",
};

async function openAdjustment(page: Page): Promise<void> {
  await page.route("**/api/premium-adjustments**", async (route) => {
    const request = route.request();
    if (
      request.method() === "GET" &&
      new URL(request.url()).pathname.replace(/^\/+/, "/") ===
        "/api/premium-adjustments"
    ) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [adjustment],
          page: 1,
          pageSize: 10,
          totalCount: 1,
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(adjustment),
    });
  });
  await page.route("**/api/premium-adjustment-options**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(options),
    });
  });
  await page.goto("/premium-adjustments");
  await page.getByRole("button", { name: `Open ${key.code}` }).click();
}

test("opens read-only, edits immutable-key fields, and saves an active-state change", async ({
  page,
}) => {
  await openAdjustment(page);

  await expect(page.getByLabel("Name", { exact: true })).toBeDisabled();
  await expect(page.getByLabel("Code", { exact: true })).toBeDisabled();
  await expect(page.getByLabel("Company Code")).toBeDisabled();
  await expect(page.getByRole("switch", { name: "Active" })).toBeDisabled();
  await expect(page.getByLabel("Remarks", { exact: true })).toHaveValue(
    "Existing notes",
  );
  await expect(page.getByLabel("Arabic Name")).toHaveValue("غطاء");
  await expect(page.getByLabel("Discount Type", { exact: true })).toContainText(
    "INACTIVE (inactive)",
  );

  await page.getByRole("switch", { name: "Edit" }).click();
  await expect(page.getByLabel("Name", { exact: true })).toBeEnabled();
  await expect(page.getByLabel("Code", { exact: true })).toBeDisabled();
  await expect(page.getByRole("switch", { name: "Active" })).toBeEnabled();
  await page.getByLabel("Name", { exact: true }).fill("Changed name");
  await page.getByRole("switch", { name: "Active" }).click();

  const update = page.waitForRequest(
    (request) =>
      request.method() === "PUT" &&
      request.url().includes("/api/premium-adjustments/"),
  );
  await page.getByRole("button", { name: "Save" }).click();
  const request = await update;
  expect(new URL(request.url()).pathname).toContain(
    `/${key.codeType}/${key.code}/${key.companyCode}`,
  );
  expect(request.postDataJSON()).toMatchObject({
    name: "Changed name",
    discountType: "INACTIVE",
    active: false,
  });
  await expect(page.getByRole("switch", { name: "Edit" })).not.toBeChecked();
});

test("requires missing legacy classifications and asks before discarding edit changes", async ({
  page,
}) => {
  await page.route("**/api/premium-adjustments**", async (route) => {
    const url = new URL(route.request().url());
    if (
      route.request().method() === "GET" &&
      url.pathname.replace(/^\/+/, "/") === "/api/premium-adjustments"
    ) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [adjustment],
          page: 1,
          pageSize: 10,
          totalCount: 1,
        }),
      });
      return;
    }
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ...adjustment,
          discountType: null,
          chargesType: null,
          chargesCategory: null,
        }),
      });
      return;
    }
    await route.fulfill({
      status: 400,
      contentType: "application/problem+json",
      body: JSON.stringify({
        status: 400,
        errors: { discountType: ["Discount Type is required."] },
      }),
    });
  });
  await page.route("**/api/premium-adjustment-options**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(options),
    });
  });
  await page.goto("/premium-adjustments");
  await page.getByRole("button", { name: `Open ${key.code}` }).click();
  await page.getByRole("switch", { name: "Edit" }).click();
  await page.getByLabel("Name", { exact: true }).fill("Unsaved");
  await page.getByRole("switch", { name: "Edit" }).click();
  await expect(
    page.getByRole("dialog", { name: "Discard your changes?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await expect(page.getByRole("switch", { name: "Edit" })).toBeChecked();

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Discount Type is required.")).toBeVisible();
});
