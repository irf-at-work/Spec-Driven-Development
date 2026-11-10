import {
  expect,
  test,
} from "../../sdd-ui/node_modules/@playwright/test/index.js";
import type { Page } from "../../sdd-ui/node_modules/@playwright/test/index.js";

const ccmCode = "CCM001";
const detail = {
  companyCode: "ASRTEST",
  ccmCode,
  name: "CLAIM CONFIGURATION",
  shortName: "CLAIM",
  nameL2: "إعداد المطالبة",
  shortNameL2: "مطالبة",
  module: null,
  accountingPostingType: null,
  accountingExchangeRateType: null,
  roundingType: null,
  roundingValue: null,
  applicableCurrencyType: null,
  defaultEstimatedClosureReasonCode: null,
  defaultRecoveryDeductionCode: null,
  printBeforeApproval: true,
  reprint: true,
  claimAccountingDocumentGeneration: true,
  claimCoinsuranceAccountingDocumentGeneration: true,
  active: true,
  createdBy: "admin",
  createdAt: "2026-11-10T09:00:00Z",
  updatedBy: "admin",
  updatedAt: "2026-11-10T09:00:00Z",
};

async function openConfiguration(page: Page, create = false): Promise<void> {
  await page.route("**/api/claim-configurations**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/write-status")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          enabled: true,
          message: "Ready",
          companyCode: "ASRTEST",
        }),
      });
      return;
    }
    if (url.pathname.endsWith("/products")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [],
          page: 1,
          pageSize: 5,
          totalCount: 0,
        }),
      });
      return;
    }
    if (url.pathname.endsWith("/available-products")) {
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
    if (url.pathname === "/api/claim-configurations") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [{ ...detail }],
          page: 1,
          pageSize: 10,
          totalCount: 1,
        }),
      });
      return;
    }
    if (route.request().method() === "PUT") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(detail),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(detail),
    });
  });
  await page.route("**/api/claim-configuration-options/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ items: [], page: 1, pageSize: 10, totalCount: 0 }),
    });
  });
  await page.goto(
    create ? "/claim-configurations/new" : "/claim-configurations",
  );
  if (!create)
    await page.getByRole("button", { name: `Open ${ccmCode}` }).click();
}

test("create defaults Rounding Value to zero and blocks negative input", async ({
  page,
}) => {
  let createRequests = 0;
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      request.url().endsWith("/api/claim-configurations")
    )
      createRequests += 1;
  });
  await openConfiguration(page, true);

  await expect(page.getByLabel("CCM Code")).toHaveAttribute(
    "aria-required",
    "true",
  );
  await expect(page.getByLabel("Claim Config Name")).toHaveAttribute(
    "aria-required",
    "true",
  );
  const roundingValue = page.getByLabel("Rounding Value");
  await expect(roundingValue).toHaveValue("0.00000");
  await expect(roundingValue).toHaveAttribute("min", "0");
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeEnabled();
  await roundingValue.fill("-0.00001");
  await expect(
    page.getByText("Rounding Value cannot be negative."),
  ).toBeVisible();

  await page.getByLabel("CCM Code").fill("CCM002");
  await page.getByLabel("Claim Config Name").fill("Claim Config");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(createRequests).toBe(0);
});

test("eye opens the editable view with shared Arabic and Active controls, without Company Code", async ({
  page,
}) => {
  await openConfiguration(page);

  await expect(
    page.getByRole("heading", { name: "Claim Configuration Details" }),
  ).toBeVisible();
  await expect(page.getByText(ccmCode, { exact: true })).toBeVisible();
  await expect(page.getByLabel("Claim Config Name")).toHaveValue(
    "CLAIM CONFIGURATION",
  );
  await expect(page.getByLabel("Arabic Name")).toHaveAttribute("dir", "rtl");
  await expect(page.getByLabel("Arabic Name")).toHaveValue("إعداد المطالبة");
  await expect(
    page.getByRole("button", { name: /Additional Information/ }),
  ).toBeVisible();
  await expect(page.getByRole("switch", { name: "Active" })).toBeEnabled();
  await expect(page.getByText("Company Code", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Audit information")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Applicable Products" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Add Product" })).toBeEnabled();
});

test("view page saves edits through the update endpoint", async ({ page }) => {
  await openConfiguration(page);
  await page.getByLabel("Arabic Short Name").fill(" اسم جديد ");
  await page.getByRole("switch", { name: "Active" }).click();

  const update = page.waitForRequest(
    (request) =>
      request.method() === "PUT" &&
      request.url().endsWith(`/api/claim-configurations/${ccmCode}`),
  );
  await page.getByRole("button", { name: "Save changes" }).click();
  const request = await update;
  const body = request.postDataJSON() as {
    shortNameL2: string;
    active: boolean;
  };
  expect(body.shortNameL2).toBe(" اسم جديد ");
  expect(body.active).toBe(false);
});

test("saved CCM Add action opens a blank form and confirms leaving unsaved edits", async ({
  page,
}) => {
  await openConfiguration(page);
  await page.getByLabel("Arabic Short Name").fill("غير محفوظ");
  await page.getByRole("button", { name: "Add claim configuration" }).click();

  await expect(page.getByText("Discard your changes?")).toBeVisible();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await expect(page.getByLabel("Arabic Short Name")).toHaveValue("غير محفوظ");

  await page.getByRole("button", { name: "Add claim configuration" }).click();
  await page.getByRole("button", { name: "Discard changes" }).click();
  await expect(page).toHaveURL(/\/claim-configurations\/new$/);
  await expect(page.getByLabel("CCM Code")).toHaveValue("");
});
