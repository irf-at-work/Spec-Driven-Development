# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: claim-config-e2e\manage-claim-configuration-products.spec.ts >> adds and removes one product association from the saved CCM
- Location: ..\tests\claim-config-e2e\manage-claim-configuration-products.spec.ts:116:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Applicable Products' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Applicable Products' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Applicable Products' })

```

```yaml
- banner:
  - text: Broker Insurance
  - group: Masters ▾
- navigation "Breadcrumb":
  - list:
    - listitem: Master Data
    - listitem: Vehicle Makes
- main:
  - heading "Vehicle Make Master" [level=1]
  - paragraph: Find, add and maintain the vehicle makes used across insurance records.
  - button "Import vehicle makes": upload_file
  - button "Upload vehicle dropdown choices": upload_file
  - button "Add vehicle make": add
  - table:
    - rowgroup:
      - row "Make Code Make Name Short Name Status Actions":
        - columnheader "Make Code":
          - button "Make Code"
          - textbox "Code..."
          - combobox "Code... operator": Contains
        - columnheader "Make Name":
          - button "Make Name"
          - textbox "Name..."
          - combobox "Name... operator": Contains
        - columnheader "Short Name":
          - button "Short Name"
          - textbox "Short name..."
          - combobox "Short name... operator": Contains
        - columnheader "Status":
          - text: Status
          - combobox "Status filter": All
          - combobox "Status operator": Equals
        - columnheader "Actions"
    - rowgroup:
      - row "100 TOYOTA TOYOTA Active Open 100 Delete 100":
        - cell "100"
        - cell "TOYOTA"
        - cell "TOYOTA"
        - cell "Active"
        - cell "Open 100 Delete 100":
          - button "Open 100": visibility
          - button "Delete 100": delete
      - row "101 HONDA HONDA Active Open 101 Delete 101":
        - cell "101"
        - cell "HONDA"
        - cell "HONDA"
        - cell "Active"
        - cell "Open 101 Delete 101":
          - button "Open 101": visibility
          - button "Delete 101": delete
      - row "102 FORD FORD Active Open 102 Delete 102":
        - cell "102"
        - cell "FORD"
        - cell "FORD"
        - cell "Active"
        - cell "Open 102 Delete 102":
          - button "Open 102": visibility
          - button "Delete 102": delete
      - row "104 NISSAN NISSAN Active Open 104 Delete 104":
        - cell "104"
        - cell "NISSAN"
        - cell "NISSAN"
        - cell "Active"
        - cell "Open 104 Delete 104":
          - button "Open 104": visibility
          - button "Delete 104": delete
      - row "105 HYUNDAI HYUNDAI Active Open 105 Delete 105":
        - cell "105"
        - cell "HYUNDAI"
        - cell "HYUNDAI"
        - cell "Active"
        - cell "Open 105 Delete 105":
          - button "Open 105": visibility
          - button "Delete 105": delete
      - row "106 KIA KIA Active Open 106 Delete 106":
        - cell "106"
        - cell "KIA"
        - cell "KIA"
        - cell "Active"
        - cell "Open 106 Delete 106":
          - button "Open 106": visibility
          - button "Delete 106": delete
      - row "107 VOLKSWAGEN VOLKSWAGEN Active Open 107 Delete 107":
        - cell "107"
        - cell "VOLKSWAGEN"
        - cell "VOLKSWAGEN"
        - cell "Active"
        - cell "Open 107 Delete 107":
          - button "Open 107": visibility
          - button "Delete 107": delete
      - row "108 BMW BMW Active Open 108 Delete 108":
        - cell "108"
        - cell "BMW"
        - cell "BMW"
        - cell "Active"
        - cell "Open 108 Delete 108":
          - button "Open 108": visibility
          - button "Delete 108": delete
      - row "110 AUDI AUDI Active Open 110 Delete 110":
        - cell "110"
        - cell "AUDI"
        - cell "AUDI"
        - cell "Active"
        - cell "Open 110 Delete 110":
          - button "Open 110": visibility
          - button "Delete 110": delete
      - row "111 LEXUS LEXUS Active Open 111 Delete 111":
        - cell "111"
        - cell "LEXUS"
        - cell "LEXUS"
        - cell "Active"
        - cell "Open 111 Delete 111":
          - button "Open 111": visibility
          - button "Delete 111": delete
  - group "Select a page of vehicle makes":
    - combobox "Items per page:": "10"
    - status: 1 – 10 of 16
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - button "Next page"
    - button "Last page"
```

# Test source

```ts
  22  |     if (url.pathname.endsWith("/write-status")) {
  23  |       await route.fulfill({
  24  |         status: 200,
  25  |         contentType: "application/json",
  26  |         body: JSON.stringify({
  27  |           enabled: true,
  28  |           message: "Ready",
  29  |           companyCode: "ASRTEST",
  30  |         }),
  31  |       });
  32  |     } else if (url.pathname.endsWith("/available-products")) {
  33  |       await route.fulfill({
  34  |         status: 200,
  35  |         contentType: "application/json",
  36  |         body: JSON.stringify({
  37  |           items: [product],
  38  |           page: 1,
  39  |           pageSize: 10,
  40  |           totalCount: 1,
  41  |         }),
  42  |       });
  43  |     } else if (url.pathname.endsWith("/products") && method === "GET") {
  44  |       await route.fulfill({
  45  |         status: 200,
  46  |         contentType: "application/json",
  47  |         body: JSON.stringify({
  48  |           items: linked ? [product] : [],
  49  |           page: 1,
  50  |           pageSize: 5,
  51  |           totalCount: linked ? 1 : 0,
  52  |         }),
  53  |       });
  54  |     } else if (method === "POST") {
  55  |       calls.adds += 1;
  56  |       linked = true;
  57  |       await route.fulfill({ status: 204 });
  58  |     } else if (method === "DELETE") {
  59  |       calls.deletes += 1;
  60  |       linked = false;
  61  |       await route.fulfill({ status: 204 });
  62  |     } else if (url.pathname === "/api/claim-configurations") {
  63  |       await route.fulfill({
  64  |         status: 200,
  65  |         contentType: "application/json",
  66  |         body: JSON.stringify({
  67  |           items: [],
  68  |           page: 1,
  69  |           pageSize: 10,
  70  |           totalCount: 0,
  71  |         }),
  72  |       });
  73  |     } else {
  74  |       await route.fulfill({
  75  |         status: 200,
  76  |         contentType: "application/json",
  77  |         body: JSON.stringify({
  78  |           companyCode: "ASRTEST",
  79  |           ccmCode,
  80  |           name: "CLAIM CONFIG",
  81  |           shortName: "CLAIM",
  82  |           nameL2: null,
  83  |           shortNameL2: null,
  84  |           module: null,
  85  |           accountingPostingType: null,
  86  |           accountingExchangeRateType: null,
  87  |           roundingType: null,
  88  |           roundingValue: null,
  89  |           applicableCurrencyType: null,
  90  |           defaultEstimatedClosureReasonCode: null,
  91  |           defaultRecoveryDeductionCode: null,
  92  |           printBeforeApproval: false,
  93  |           reprint: false,
  94  |           claimAccountingDocumentGeneration: true,
  95  |           claimCoinsuranceAccountingDocumentGeneration: true,
  96  |           active: true,
  97  |           createdBy: "admin",
  98  |           createdAt: "2026-11-10T09:00:00Z",
  99  |           updatedBy: "admin",
  100 |           updatedAt: "2026-11-10T09:00:00Z",
  101 |         }),
  102 |       });
  103 |     }
  104 |   });
  105 |   await page.route("**/api/claim-configuration-options/**", async (route) => {
  106 |     await route.fulfill({
  107 |       status: 200,
  108 |       contentType: "application/json",
  109 |       body: JSON.stringify({ items: [], page: 1, pageSize: 10, totalCount: 0 }),
  110 |     });
  111 |   });
  112 |   await page.goto(`/claim-configurations/${ccmCode}`);
  113 |   return calls;
  114 | }
  115 | 
  116 | test("adds and removes one product association from the saved CCM", async ({
  117 |   page,
  118 | }) => {
  119 |   const calls = await openProducts(page);
  120 |   await expect(
  121 |     page.getByRole("heading", { name: "Applicable Products" }),
> 122 |   ).toBeVisible();
      |     ^ Error: expect(locator).toBeVisible() failed
  123 |   await page.getByRole("button", { name: "Add Product" }).click();
  124 |   const dialog = page.getByRole("dialog", { name: "Available Products" });
  125 |   await expect(dialog).toBeVisible();
  126 |   await dialog.getByLabel("Product Code").selectOption("PRD001");
  127 |   await dialog.getByRole("button", { name: "Add Product" }).click();
  128 |   await expect.poll(() => calls.adds).toBe(1);
  129 |   await expect(
  130 |     page.getByRole("cell", { name: "PRD001", exact: true }),
  131 |   ).toBeVisible();
  132 |   await expect(
  133 |     page.getByRole("cell", { name: "CCM_PRODUCT - Test product", exact: true }),
  134 |   ).toBeVisible();
  135 | 
  136 |   await page.getByRole("button", { name: "Delete product PRD001" }).click();
  137 |   await page.getByRole("button", { name: "Remove association" }).click();
  138 |   await expect.poll(() => calls.deletes).toBe(1);
  139 |   await expect(
  140 |     page.getByText("No products are linked to this configuration."),
  141 |   ).toBeVisible();
  142 | });
  143 | 
  144 | test("keeps the product dialog open when closing is cancelled", async ({
  145 |   page,
  146 | }) => {
  147 |   await openProducts(page);
  148 |   await page.getByRole("button", { name: "Add Product" }).click();
  149 |   const dialog = page.getByRole("dialog", { name: "Available Products" });
  150 |   await dialog.getByLabel("Product Code").selectOption("PRD001");
  151 |   await dialog.getByRole("button", { name: "Cancel" }).click();
  152 |   await page.getByRole("button", { name: "Keep selecting" }).click();
  153 |   await expect(dialog).toBeVisible();
  154 |   await expect(dialog.getByLabel("Product Code")).toHaveValue("PRD001");
  155 | });
  156 | 
```