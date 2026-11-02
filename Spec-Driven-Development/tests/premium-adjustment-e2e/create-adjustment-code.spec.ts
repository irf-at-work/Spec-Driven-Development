import {
  expect,
  test,
} from "../../sdd-ui/node_modules/@playwright/test/index.js";
import type { Page } from "../../sdd-ui/node_modules/@playwright/test/index.js";

const options = {
  codeTypes: [{ code: "CALC01", description: "Calculation" }],
  discountTypes: [{ code: "DISC01", description: "Standard discount" }],
  chargesTypes: [{ code: "CHG01", description: "Base charge" }],
  chargesCategories: [{ code: "CAT01", description: "Motor" }],
};

async function mockCreateApi(page: Page, duplicate = false): Promise<void> {
  await page.route("**/api/premium-adjustment-options**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(options),
    });
  });
  await page.route("**/api/premium-adjustments**", async (route) => {
    if (route.request().method() !== "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [],
          page: 1,
          pageSize: 10,
          totalCount: 0,
        }),
      });
      return;
    }

    if (duplicate) {
      await route.fulfill({
        status: 409,
        contentType: "application/problem+json",
        body: JSON.stringify({
          title: "Duplicate premium adjustment",
          status: 409,
          errors: {
            code: [
              "This code type, code and company code combination already exists.",
            ],
          },
        }),
      });
      return;
    }

    const request = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ...request,
        code: String(request["code"]).toUpperCase(),
        companyCode: String(request["companyCode"]).toUpperCase(),
        name: "Premium Cover",
        shortName: "BMW",
        codeTypeDescription: "Calculation",
        active: request["active"] ?? true,
        createdBy: "admin",
        lastChangedBy: "admin",
      }),
    });
  });
}

async function fillRequiredFields(page: Page): Promise<void> {
  await page.getByLabel("Code Type", { exact: true }).click();
  await page.getByRole("option", { name: "Calculation" }).click();
  await page.getByLabel("Code", { exact: true }).fill("zt1000000001");
  await page.getByLabel("Company Code", { exact: true }).fill("zt2000000001");
  await page.getByLabel("Name", { exact: true }).fill("  premium   cover  ");
  await page.getByLabel("Short Name", { exact: true }).fill("BMW");
  await page.getByLabel("Discount Type").click();
  await page.getByRole("option", { name: "Standard discount" }).click();
  await page.getByLabel("Charges Type").click();
  await page.getByRole("option", { name: "Base charge" }).click();
  await page.getByLabel("Charges Category").click();
  await page.getByRole("option", { name: "Motor" }).click();
}

test("validates fields and creates with Arabic details and Active on by default", async ({
  page,
}) => {
  await mockCreateApi(page);
  await page.goto("/premium-adjustments");
  await page.getByRole("button", { name: "Add premium adjustment" }).click();

  await expect(
    page.getByRole("heading", { name: "Add Premium Adjustment" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText(/required/i).first()).toBeVisible();
  await page.getByLabel("Code", { exact: true }).fill("ZT12345678901");
  await expect(
    page.getByText(/maximum length|12 characters/i).first(),
  ).toBeVisible();

  await fillRequiredFields(page);
  const active = page.getByRole("switch", { name: "Active" });
  await expect(active).toBeChecked();
  await active.click();
  await expect(active).not.toBeChecked();
  await active.click();
  await expect(active).toBeChecked();
  await page.getByRole("button", { name: "Additional Information" }).click();
  const arabicName = "  خصم خاص ";
  await page.getByLabel("Arabic Name").fill(arabicName);
  await expect(page.getByLabel("Arabic Name")).toHaveAttribute("dir", "rtl");

  const post = page.waitForRequest(
    (request) =>
      request.url().includes("/api/premium-adjustments") &&
      request.method() === "POST",
  );
  await page.getByRole("button", { name: "Save" }).click();
  const request = await post;
  expect(request.postDataJSON()).toMatchObject({
    code: "ZT1000000001",
    companyCode: "ZT2000000001",
    arabicName,
  });
});

test("shows the duplicate message and prompts before discarding unsaved changes", async ({
  page,
}) => {
  await mockCreateApi(page, true);
  await page.goto("/premium-adjustments");
  await page.getByRole("button", { name: "Add premium adjustment" }).click();
  await fillRequiredFields(page);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(
    page.getByText(
      "This code type, code and company code combination already exists.",
    ),
  ).toBeVisible();

  await page.getByLabel("Name", { exact: true }).fill("Unsaved update");
  await page.getByRole("link", { name: "Premium Adjustments" }).click();
  await expect(
    page.getByRole("dialog", { name: "Discard your changes?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await expect(
    page.getByRole("dialog", { name: "Discard your changes?" }),
  ).toHaveCount(0);
  await expect(page).toHaveURL(/\/premium-adjustments\/new$/);

  await page
    .getByRole("button", { name: "Back to premium adjustments" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Discard your changes?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await expect(
    page.getByRole("dialog", { name: "Discard your changes?" }),
  ).toHaveCount(0);
  await expect(page).toHaveURL(/\/premium-adjustments\/new$/);
});

test("browser back asks before leaving and honours keep editing", async ({
  page,
}) => {
  await mockCreateApi(page);
  await page.goto("/premium-adjustments");
  await page.getByRole("button", { name: "Add premium adjustment" }).click();
  await page.getByLabel("Code", { exact: true }).fill("ZT1000000001");

  await page.evaluate(() => window.history.back());
  await expect(
    page.getByRole("dialog", { name: "Discard your changes?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await expect(
    page.getByRole("dialog", { name: "Discard your changes?" }),
  ).toHaveCount(0);
  await expect(page).toHaveURL(/\/premium-adjustments\/new$/);
});

test("confirming the browser-back prompt leaves the unsaved form", async ({
  page,
}) => {
  await mockCreateApi(page);
  await page.goto("/premium-adjustments");
  await page.getByRole("button", { name: "Add premium adjustment" }).click();
  await page.getByLabel("Code", { exact: true }).fill("ZT1000000001");
  await page.evaluate(() => window.history.back());
  await expect(
    page.getByRole("dialog", { name: "Discard your changes?" }),
  ).toBeVisible();
  const discard = page.getByRole("button", { name: "Discard changes" });
  await expect(discard).toBeEnabled();
  await discard.click();
  await expect(page).toHaveURL(/\/premium-adjustments$/);
});
