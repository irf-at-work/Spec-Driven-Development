import { Workbook } from "../../sdd-ui/node_modules/exceljs/index.js";
import {
  expect,
  test,
} from "../../sdd-ui/node_modules/@playwright/test/index.js";

test("CCM list import action uses the upload icon and opens its import page", async ({
  page,
}) => {
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
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ items: [], page: 1, pageSize: 10, totalCount: 0 }),
    });
  });
  await page.goto("/claim-configurations");
  const importButton = page.getByRole("button", {
    name: "Import claim configurations",
  });
  await expect(importButton).toBeVisible();
  await importButton.click();
  await expect(page).toHaveURL(/\/claim-configurations\/import$/);
  await expect(
    page.getByRole("heading", { name: "Import Claim Configurations" }),
  ).toBeVisible();
});

test("downloaded template contains the CCM and optional PRODUCT_LINKS sheets", async ({
  page,
}) => {
  await page.goto("/claim-configurations/import");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Excel template" }).click();
  const download = await downloadEvent;
  const path = await download.path();
  if (!path) throw new Error("The template download did not produce a file.");
  const workbook = new Workbook();
  await workbook.xlsx.readFile(path);
  expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual([
    "CCM",
    "PRODUCT_LINKS",
  ]);
  expect(workbook.getWorksheet("CCM")?.getRow(1).getCell(1).text).toBe(
    "CCM_CODE",
  );
  expect(
    workbook.getWorksheet("PRODUCT_LINKS")?.getRow(1).getCell(2).text,
  ).toBe("PRODUCT_CODE");
});

test("CCM import previews both sheets, confirms, and reports separate counts", async ({
  page,
}) => {
  await page.route(
    "**/api/claim-configurations/import/preview",
    async (route) => {
      const request = route.request().postDataJSON() as {
        configurations: Record<string, string | null>[];
        productLinks: Record<string, string | null>[];
      };
      expect(request.configurations).toHaveLength(2);
      expect(request.productLinks).toHaveLength(2);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          configurations: [
            {
              rowNumber: 2,
              key: "CCM001",
              isValid: true,
              alreadyExists: false,
              errors: [],
            },
            {
              rowNumber: 3,
              key: "CCM002",
              isValid: true,
              alreadyExists: true,
              errors: [],
            },
          ],
          productLinks: [
            {
              rowNumber: 2,
              key: "CCM001 / PRD001",
              isValid: true,
              alreadyExists: false,
              errors: [],
            },
            {
              rowNumber: 3,
              key: "CCM002 / PRD002",
              isValid: true,
              alreadyExists: true,
              errors: [],
            },
          ],
          errors: [],
        }),
      });
    },
  );
  let confirmedPayload: unknown;
  await page.route("**/api/claim-configurations/import", async (route) => {
    confirmedPayload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        insertedConfigurations: 1,
        skippedConfigurations: 1,
        insertedLinks: 1,
        skippedLinks: 1,
      }),
    });
  });
  await page.goto("/claim-configurations/import");

  const workbook = new Workbook();
  const ccm = workbook.addWorksheet("CCM");
  const ccmHeaders = [
    "CCM_CODE",
    "NAME",
    "SHORT_NAME",
    "NAME_L2",
    "SHORT_NAME_L2",
    "MODULE",
    "ACCOUNTING_POSTING_TYPE",
    "ACCOUNTING_EXCHANGE_RATE_TYPE",
    "ROUNDING_TYPE",
    "ROUNDING_VALUE",
    "APPLICABLE_CURRENCY_TYPE",
    "DEFAULT_ESTIMATED_CLOSURE_REASON_CODE",
    "DEFAULT_RECOVERY_DEDUCTION_CODE",
    "PRINT_BEFORE_APPROVAL",
    "REPRINT",
    "CLAIM_ACCOUNTING_DOCUMENT_GENERATION",
    "CLAIM_COINSURANCE_ACCOUNTING_DOCUMENT_GENERATION",
    "ACTIVE",
  ];
  ccm.addRow(ccmHeaders);
  ccm.addRow(["CCM001", "CLAIM CONFIG"]);
  ccm.addRow(["CCM002", "ALREADY PRESENT"]);
  const links = workbook.addWorksheet("PRODUCT_LINKS");
  links.addRow(["CCM_CODE", "PRODUCT_CODE"]);
  links.addRow(["CCM001", "PRD001"]);
  links.addRow(["CCM002", "PRD002"]);
  const bytes = await workbook.xlsx.writeBuffer();
  await page.locator("#ccm-workbook").setInputFiles({
    name: "claim-configurations.xlsx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    buffer: Buffer.from(bytes),
  });

  await expect(
    page.getByRole("heading", { name: "Import preview" }),
  ).toBeVisible();
  await expect(page.getByText("CCM001 / PRD001")).toBeVisible();
  await page.getByRole("button", { name: "Confirm import" }).click();
  await page.getByRole("button", { name: "Import", exact: true }).click();

  await expect(page.getByRole("status")).toContainText(
    "1 CCMs inserted, 1 CCMs skipped",
  );
  await expect(page.getByRole("status")).toContainText(
    "1 links inserted, and 1 links skipped",
  );
  expect(confirmedPayload).toMatchObject({
    configurations: [
      { ccmCode: "CCM001", name: "CLAIM CONFIG" },
      { ccmCode: "CCM002", name: "ALREADY PRESENT" },
    ],
    productLinks: [
      { ccmCode: "CCM001", productCode: "PRD001" },
      { ccmCode: "CCM002", productCode: "PRD002" },
    ],
  });
});

test("server confirmation failure does not show a success result", async ({
  page,
}) => {
  await page.route(
    "**/api/claim-configurations/import/preview",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          configurations: [
            {
              rowNumber: 2,
              key: "CCM003",
              isValid: true,
              alreadyExists: false,
              errors: [],
            },
          ],
          productLinks: [],
          errors: [],
        }),
      });
    },
  );
  await page.route("**/api/claim-configurations/import", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/problem+json",
      body: "{}",
    });
  });
  await page.goto("/claim-configurations/import");
  const workbook = new Workbook();
  const ccm = workbook.addWorksheet("CCM");
  ccm.addRow([
    "CCM_CODE",
    "NAME",
    "SHORT_NAME",
    "NAME_L2",
    "SHORT_NAME_L2",
    "MODULE",
    "ACCOUNTING_POSTING_TYPE",
    "ACCOUNTING_EXCHANGE_RATE_TYPE",
    "ROUNDING_TYPE",
    "ROUNDING_VALUE",
    "APPLICABLE_CURRENCY_TYPE",
    "DEFAULT_ESTIMATED_CLOSURE_REASON_CODE",
    "DEFAULT_RECOVERY_DEDUCTION_CODE",
    "PRINT_BEFORE_APPROVAL",
    "REPRINT",
    "CLAIM_ACCOUNTING_DOCUMENT_GENERATION",
    "CLAIM_COINSURANCE_ACCOUNTING_DOCUMENT_GENERATION",
    "ACTIVE",
  ]);
  ccm.addRow(["CCM003", "CLAIM CONFIG"]);
  const bytes = await workbook.xlsx.writeBuffer();
  await page.locator("#ccm-workbook").setInputFiles({
    name: "failure.xlsx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    buffer: Buffer.from(bytes),
  });
  await page.getByRole("button", { name: "Confirm import" }).click();
  await page.getByRole("button", { name: "Import", exact: true }).click();

  await expect(page.getByRole("alert")).toContainText(
    "Import was not completed",
  );
  await expect(page.getByText("Import complete")).toHaveCount(0);
});

test("invalid CCM rows block confirmation", async ({ page }) => {
  await page.route(
    "**/api/claim-configurations/import/preview",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          configurations: [
            {
              rowNumber: 2,
              key: "",
              isValid: false,
              alreadyExists: false,
              errors: ["ccmCode: Claim Config Code is required."],
            },
          ],
          productLinks: [],
          errors: [],
        }),
      });
    },
  );
  await page.goto("/claim-configurations/import");
  const workbook = new Workbook();
  const ccm = workbook.addWorksheet("CCM");
  ccm.addRow([
    "CCM_CODE",
    "NAME",
    "SHORT_NAME",
    "NAME_L2",
    "SHORT_NAME_L2",
    "MODULE",
    "ACCOUNTING_POSTING_TYPE",
    "ACCOUNTING_EXCHANGE_RATE_TYPE",
    "ROUNDING_TYPE",
    "ROUNDING_VALUE",
    "APPLICABLE_CURRENCY_TYPE",
    "DEFAULT_ESTIMATED_CLOSURE_REASON_CODE",
    "DEFAULT_RECOVERY_DEDUCTION_CODE",
    "PRINT_BEFORE_APPROVAL",
    "REPRINT",
    "CLAIM_ACCOUNTING_DOCUMENT_GENERATION",
    "CLAIM_COINSURANCE_ACCOUNTING_DOCUMENT_GENERATION",
    "ACTIVE",
  ]);
  ccm.addRow(["", "CLAIM CONFIG"]);
  const bytes = await workbook.xlsx.writeBuffer();
  await page.locator("#ccm-workbook").setInputFiles({
    name: "invalid.xlsx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    buffer: Buffer.from(bytes),
  });

  await expect(page.getByText(/Claim Config Code is required/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Confirm import" }),
  ).toBeDisabled();
});

test("workbooks larger than 5 MB are rejected before preview", async ({
  page,
}) => {
  let previewRequests = 0;
  await page.route(
    "**/api/claim-configurations/import/preview",
    async (route) => {
      previewRequests += 1;
      await route.fulfill({ status: 200, body: "{}" });
    },
  );
  await page.goto("/claim-configurations/import");
  await page.locator("#ccm-workbook").setInputFiles({
    name: "too-large.xlsx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
  });

  await expect(page.getByRole("alert")).toHaveText(
    "Workbook must be 5 MB or smaller.",
  );
  expect(previewRequests).toBe(0);
});

test("invalid product-link references block import", async ({ page }) => {
  await page.route(
    "**/api/claim-configurations/import/preview",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          configurations: [],
          productLinks: [
            {
              rowNumber: 2,
              key: "UNKNOWN / PRD001",
              isValid: false,
              alreadyExists: false,
              errors: [
                "CCM Code must identify an existing configuration or a valid new CCM row in this workbook.",
              ],
            },
          ],
          errors: [],
        }),
      });
    },
  );
  await page.goto("/claim-configurations/import");
  const workbook = new Workbook();
  const ccm = workbook.addWorksheet("CCM");
  ccm.addRow([
    "CCM_CODE",
    "NAME",
    "SHORT_NAME",
    "NAME_L2",
    "SHORT_NAME_L2",
    "MODULE",
    "ACCOUNTING_POSTING_TYPE",
    "ACCOUNTING_EXCHANGE_RATE_TYPE",
    "ROUNDING_TYPE",
    "ROUNDING_VALUE",
    "APPLICABLE_CURRENCY_TYPE",
    "DEFAULT_ESTIMATED_CLOSURE_REASON_CODE",
    "DEFAULT_RECOVERY_DEDUCTION_CODE",
    "PRINT_BEFORE_APPROVAL",
    "REPRINT",
    "CLAIM_ACCOUNTING_DOCUMENT_GENERATION",
    "CLAIM_COINSURANCE_ACCOUNTING_DOCUMENT_GENERATION",
    "ACTIVE",
  ]);
  const links = workbook.addWorksheet("PRODUCT_LINKS");
  links.addRow(["CCM_CODE", "PRODUCT_CODE"]);
  links.addRow(["UNKNOWN", "PRD001"]);
  const bytes = await workbook.xlsx.writeBuffer();
  await page.locator("#ccm-workbook").setInputFiles({
    name: "invalid-link.xlsx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    buffer: Buffer.from(bytes),
  });

  await expect(
    page.getByText(/must identify an existing configuration/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Confirm import" }),
  ).toBeDisabled();
});
