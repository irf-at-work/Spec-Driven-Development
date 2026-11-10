import {
  expect,
  test,
} from "../../sdd-ui/node_modules/@playwright/test/index.js";

test("deactivates and reactivates a CCM while retaining its product link", async ({
  page,
}) => {
  let active = true;
  const linkedProduct = {
    productCode: "PRD001",
    productType: "CCM_PRODUCT",
    description: "Test product",
  };
  const detail = {
    companyCode: "ASRTEST",
    ccmCode: "CCM001",
    name: "CLAIM CONFIGURATION",
    shortName: "CLAIM",
    nameL2: null,
    shortNameL2: null,
    module: null,
    accountingPostingType: null,
    accountingExchangeRateType: null,
    roundingType: null,
    roundingValue: 0,
    applicableCurrencyType: null,
    defaultEstimatedClosureReasonCode: null,
    defaultRecoveryDeductionCode: null,
    printBeforeApproval: false,
    reprint: false,
    claimAccountingDocumentGeneration: true,
    claimCoinsuranceAccountingDocumentGeneration: true,
    get active() {
      return active;
    },
    createdBy: "admin",
    createdAt: "2026-11-10T09:00:00Z",
    updatedBy: "admin",
    updatedAt: "2026-11-10T09:00:00Z",
  };

  await page.route("**/api/claim-configurations**", async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
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
    } else if (url.pathname.endsWith("/products") && method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [linkedProduct],
          page: 1,
          pageSize: 5,
          totalCount: 1,
        }),
      });
    } else if (
      url.pathname === "/api/claim-configurations" &&
      method === "GET"
    ) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [{ ...detail, active }],
          page: 1,
          pageSize: 10,
          totalCount: 1,
        }),
      });
    } else if (method === "PUT") {
      const body = route.request().postDataJSON() as { active: boolean };
      active = body.active;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(detail),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(detail),
      });
    }
  });
  await page.route("**/api/claim-configuration-options/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ items: [], page: 1, pageSize: 10, totalCount: 0 }),
    });
  });

  await page.goto("/claim-configurations");
  await page.getByRole("button", { name: "Open CCM001" }).click();
  const activeSwitch = page.getByRole("switch", { name: "Active" });
  await expect(activeSwitch).toBeChecked();
  await expect(page.getByText("Test product")).toBeVisible();
  await activeSwitch.click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator("tr.mat-mdc-row")).toContainText("Inactive");

  await page.getByRole("button", { name: "Open CCM001" }).click();
  await expect(page.getByRole("switch", { name: "Active" })).not.toBeChecked();
  await expect(page.getByText("Test product")).toBeVisible();
  await page.getByRole("switch", { name: "Active" }).click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator("tr.mat-mdc-row")).toContainText("Active");
});
