import { expect, test } from "../../sdd-ui/node_modules/@playwright/test/index.js";
import type { Page } from "../../sdd-ui/node_modules/@playwright/test/index.js";

const ccmCode = "CCM001";
const product = { productCode: "PRD001", productType: "CCM_PRODUCT", description: "Test product" };

async function openProducts(page: Page): Promise<{ adds: number; deletes: number }> {
  let linked = false;
  const calls = { adds: 0, deletes: 0 };
  await page.route("**/api/claim-configurations**", async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    if (url.pathname.endsWith("/write-status")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ enabled: true, message: "Ready", companyCode: "ASRTEST" }) });
    } else if (url.pathname.endsWith("/available-products")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: [product], page: 1, pageSize: 10, totalCount: 1 }) });
    } else if (url.pathname.endsWith("/products") && method === "GET") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: linked ? [product] : [], page: 1, pageSize: 5, totalCount: linked ? 1 : 0 }) });
    } else if (method === "POST") {
      calls.adds += 1;
      linked = true;
      await route.fulfill({ status: 204 });
    } else if (method === "DELETE") {
      calls.deletes += 1;
      linked = false;
      await route.fulfill({ status: 204 });
    } else if (url.pathname === "/api/claim-configurations") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: [], page: 1, pageSize: 10, totalCount: 0 }) });
    } else {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          companyCode: "ASRTEST", ccmCode, name: "CLAIM CONFIG", shortName: "CLAIM",
          nameL2: null, shortNameL2: null, module: null, accountingPostingType: null,
          accountingExchangeRateType: null, roundingType: null, roundingValue: null,
          applicableCurrencyType: null, defaultEstimatedClosureReasonCode: null,
          defaultRecoveryDeductionCode: null, printBeforeApproval: false, reprint: false,
          claimAccountingDocumentGeneration: true, claimCoinsuranceAccountingDocumentGeneration: true,
          active: true, createdBy: "admin", createdAt: "2026-11-10T09:00:00Z",
          updatedBy: "admin", updatedAt: "2026-11-10T09:00:00Z",
        }),
      });
    }
  });
  await page.route("**/api/claim-configuration-options/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: [], page: 1, pageSize: 10, totalCount: 0 }) });
  });
  await page.goto(`/claim-configurations/${ccmCode}`);
  return calls;
}

test("adds and removes one product association from the saved CCM", async ({ page }) => {
  const calls = await openProducts(page);
  await expect(page.getByRole("heading", { name: "Applicable Products" })).toBeVisible();
  await page.getByRole("button", { name: "Add Product" }).click();
  const dialog = page.getByRole("dialog", { name: "Available Products" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Product Code").selectOption("PRD001");
  await dialog.getByRole("button", { name: "Add Product" }).click();
  await expect.poll(() => calls.adds).toBe(1);
  await expect(page.getByRole("cell", { name: "PRD001", exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "CCM_PRODUCT - Test product", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Delete product PRD001" }).click();
  await page.getByRole("button", { name: "Remove association" }).click();
  await expect.poll(() => calls.deletes).toBe(1);
  await expect(page.getByText("No products are linked to this configuration.")).toBeVisible();
});

test("keeps the product dialog open when closing is cancelled", async ({ page }) => {
  await openProducts(page);
  await page.getByRole("button", { name: "Add Product" }).click();
  const dialog = page.getByRole("dialog", { name: "Available Products" });
  await dialog.getByLabel("Product Code").selectOption("PRD001");
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await page.getByRole("button", { name: "Keep selecting" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Product Code")).toHaveValue("PRD001");
});
