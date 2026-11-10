# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: claim-config-e2e\list-and-read.spec.ts >> shows the prior CCM columns without Company Code and places Action last
- Location: ..\tests\claim-config-e2e\list-and-read.spec.ts:78:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('columnheader').first()
Expected substring: "Claim Config Code"
Received string:    "Make CodeContains"
Timeout: 5000ms

Call log:
  - Expect "toContainText" getByRole('columnheader').first() with timeout 5000ms
  - waiting for getByRole('columnheader').first()
    11 × locator resolved to <th mat-header-cell="" role="columnheader" _ngcontent-ng-c3265251550="" class="mat-mdc-header-cell mdc-data-table__header-cell cdk-header-cell cdk-column-makeCode mat-column-makeCode">…</th>
       - unexpected value "Make CodeContains"

```

```yaml
- columnheader "Make Code":
  - button "Make Code"
  - textbox "Code..."
  - combobox "Code... operator": Contains
```

# Test source

```ts
  1   | import {
  2   |   expect,
  3   |   test,
  4   | } from "../../sdd-ui/node_modules/@playwright/test/index.js";
  5   | import type { Page } from "../../sdd-ui/node_modules/@playwright/test/index.js";
  6   | 
  7   | const row = {
  8   |   companyCode: "ASRTEST",
  9   |   ccmCode: "CCM001",
  10  |   name: "CLAIM CONFIG",
  11  |   shortName: "CLAIM",
  12  |   module: "AV",
  13  |   active: true,
  14  | };
  15  | 
  16  | async function mockList(
  17  |   page: Page,
  18  |   linkedDelete = false,
  19  | ): Promise<{ deletes: number }> {
  20  |   let deleted = false;
  21  |   const calls = { deletes: 0 };
  22  |   await page.route("**/api/claim-configurations**", async (route) => {
  23  |     const url = new URL(route.request().url());
  24  |     if (url.pathname.endsWith("/write-status")) {
  25  |       await route.fulfill({
  26  |         status: 200,
  27  |         contentType: "application/json",
  28  |         body: JSON.stringify({
  29  |           enabled: true,
  30  |           message: "Ready",
  31  |           companyCode: "ASRTEST",
  32  |         }),
  33  |       });
  34  |     } else if (route.request().method() === "DELETE") {
  35  |       calls.deletes += 1;
  36  |       if (linkedDelete) {
  37  |         await route.fulfill({
  38  |           status: 409,
  39  |           contentType: "application/problem+json",
  40  |           body: JSON.stringify({
  41  |             status: 409,
  42  |             title: "Claim configuration has linked products",
  43  |           }),
  44  |         });
  45  |       } else {
  46  |         deleted = true;
  47  |         await route.fulfill({ status: 204 });
  48  |       }
  49  |     } else {
  50  |       await route.fulfill({
  51  |         status: 200,
  52  |         contentType: "application/json",
  53  |         body: JSON.stringify({
  54  |           items: deleted ? [] : [row],
  55  |           page: 1,
  56  |           pageSize: 10,
  57  |           totalCount: deleted ? 0 : 1,
  58  |         }),
  59  |       });
  60  |     }
  61  |   });
  62  |   await page.route("**/api/claim-configuration-options/**", async (route) => {
  63  |     await route.fulfill({
  64  |       status: 200,
  65  |       contentType: "application/json",
  66  |       body: JSON.stringify({
  67  |         items: [{ code: "AV", description: "Aviation" }],
  68  |         page: 1,
  69  |         pageSize: 10,
  70  |         totalCount: 1,
  71  |       }),
  72  |     });
  73  |   });
  74  |   await page.goto("/claim-configurations");
  75  |   return calls;
  76  | }
  77  | 
  78  | test("shows the prior CCM columns without Company Code and places Action last", async ({
  79  |   page,
  80  | }) => {
  81  |   await mockList(page);
  82  |   const headers = page.getByRole("columnheader");
> 83  |   await expect(headers.nth(0)).toContainText("Claim Config Code");
      |                                ^ Error: expect(locator).toContainText(expected) failed
  84  |   await expect(headers.nth(1)).toContainText("Name");
  85  |   await expect(headers.nth(2)).toContainText("Short Name");
  86  |   await expect(headers.nth(3)).toContainText("Module Name");
  87  |   await expect(headers.nth(5)).toContainText("Action");
  88  |   await expect(page.getByText("Aviation", { exact: true })).toBeVisible();
  89  |   await expect(page.getByText("Company Code", { exact: true })).toHaveCount(0);
  90  | });
  91  | 
  92  | test("uses unchecked N checkboxes and omits the removed helper labels on create", async ({
  93  |   page,
  94  | }) => {
  95  |   await mockList(page);
  96  |   await page.getByRole("button", { name: "Add claim configuration" }).click();
  97  | 
  98  |   const printBeforeApproval = page.getByRole("checkbox", {
  99  |     name: "Print Before Approval Yn",
  100 |   });
  101 |   const reprintAllowed = page.getByRole("checkbox", {
  102 |     name: "RePrint Allowed",
  103 |   });
  104 |   const claimAccounting = page.getByRole("checkbox", {
  105 |     name: "Claim Accounting Document Generation",
  106 |   });
  107 |   const coinsuranceAccounting = page.getByRole("checkbox", {
  108 |     name: "Claim Coinsurance Accounting Document Generation",
  109 |   });
  110 |   await expect(printBeforeApproval).not.toBeChecked();
  111 |   await expect(reprintAllowed).not.toBeChecked();
  112 |   await expect(claimAccounting).toBeChecked();
  113 |   await expect(coinsuranceAccounting).toBeChecked();
  114 |   await page.getByRole("button", { name: /Additional Information/ }).click();
  115 |   await expect(page.getByLabel("Arabic Name")).toBeVisible();
  116 |   await expect(
  117 |     page.getByText("1–12 letters, digits, or hyphens. Saved in uppercase."),
  118 |   ).toHaveCount(0);
  119 |   await expect(page.getByText("Required.", { exact: true })).toHaveCount(0);
  120 | });
  121 | 
  122 | test("deletes only after confirmation and leaves linked configurations untouched", async ({
  123 |   page,
  124 | }) => {
  125 |   const calls = await mockList(page);
  126 |   const deleteAction = page.getByRole("button", { name: "Delete CCM001" });
  127 |   await expect(deleteAction).toBeEnabled();
  128 |   await deleteAction.click();
  129 |   await page.getByRole("button", { name: "Cancel" }).click();
  130 |   expect(calls.deletes).toBe(0);
  131 | 
  132 |   await page.getByRole("button", { name: "Delete CCM001" }).click();
  133 |   await page.getByRole("button", { name: "Delete permanently" }).click();
  134 |   await expect.poll(() => calls.deletes).toBe(1);
  135 |   await expect(
  136 |     page.getByText("There are no claim configurations to display."),
  137 |   ).toBeVisible();
  138 | });
  139 | 
  140 | test("reports linked-product conflict without deleting the CCM", async ({
  141 |   page,
  142 | }) => {
  143 |   await mockList(page, true);
  144 |   await page.getByRole("button", { name: "Delete CCM001" }).click();
  145 |   await page.getByRole("button", { name: "Delete permanently" }).click();
  146 |   await expect(
  147 |     page.getByText(
  148 |       "Remove the linked products before deleting this claim configuration.",
  149 |     ),
  150 |   ).toBeVisible();
  151 |   await expect(
  152 |     page.getByRole("cell", { name: "CCM001", exact: true }),
  153 |   ).toBeVisible();
  154 | });
  155 | 
```