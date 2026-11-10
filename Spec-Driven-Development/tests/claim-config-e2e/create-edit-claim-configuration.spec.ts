import { expect, test } from "../../sdd-ui/node_modules/@playwright/test/index.js";
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

async function openConfiguration(page: Page): Promise<void> {
  await page.route("**/api/claim-configurations**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/write-status")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ enabled: true, message: "Ready", companyCode: "ASRTEST" }),
      });
      return;
    }
    if (url.pathname === "/api/claim-configurations") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [{ ...detail }], page: 1, pageSize: 10, totalCount: 1 }),
      });
      return;
    }
    if (route.request().method() === "PUT") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(detail) });
      return;
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(detail) });
  });
  await page.route("**/api/claim-configuration-options/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ items: [], page: 1, pageSize: 10, totalCount: 0 }),
    });
  });
  await page.goto("/claim-configurations");
  await page.getByRole("button", { name: `Open ${ccmCode}` }).click();
}

test("eye opens the editable view with shared Arabic and Active controls, without Company Code", async ({ page }) => {
  await openConfiguration(page);

  await expect(page.getByRole("heading", { name: "Claim Configuration Details" })).toBeVisible();
  await expect(page.getByText(ccmCode, { exact: true })).toBeVisible();
  await expect(page.getByLabel("Claim Config Name")).toHaveValue("CLAIM CONFIGURATION");
  await expect(page.getByLabel("Arabic Name")).toHaveAttribute("dir", "rtl");
  await expect(page.getByLabel("Arabic Name")).toHaveValue("إعداد المطالبة");
  await expect(page.getByRole("button", { name: /Additional Information/ })).toBeVisible();
  await expect(page.getByRole("switch", { name: "Active" })).toBeEnabled();
  await expect(page.getByText("Company Code", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Audit information")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Applicable Products" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add Product" })).toBeDisabled();
});

test("view page saves edits through the update endpoint", async ({ page }) => {
  await openConfiguration(page);
  await page.getByLabel("Arabic Short Name").fill(" اسم جديد ");
  await page.getByRole("switch", { name: "Active" }).click();

  const update = page.waitForRequest((request) =>
    request.method() === "PUT" && request.url().endsWith(`/api/claim-configurations/${ccmCode}`),
  );
  await page.getByRole("button", { name: "Save changes" }).click();
  const request = await update;
  const body = request.postDataJSON() as { shortNameL2: string; active: boolean };
  expect(body.shortNameL2).toBe(" اسم جديد ");
  expect(body.active).toBe(false);
});
