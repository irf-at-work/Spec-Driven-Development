# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: claim-config-e2e\manage-claim-configuration-products.spec.ts >> keeps the product dialog open when closing is cancelled
- Location: ..\tests\claim-config-e2e\manage-claim-configuration-products.spec.ts:144:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Add Product' })

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e4]: Broker Insurance
    - group [ref=e5]:
      - generic "Masters ▾" [ref=e6] [cursor=pointer]
  - navigation "Breadcrumb" [ref=e8]:
    - list [ref=e9]:
      - listitem [ref=e10]:
        - generic [ref=e11]: Master Data
        - generic [aria-hidden] [ref=e12]: ›
      - listitem [ref=e13]:
        - generic [ref=e14]: Vehicle Makes
  - main [ref=e15]:
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - heading "Vehicle Make Master" [level=1] [ref=e20]
          - paragraph [ref=e21]: Find, add and maintain the vehicle makes used across insurance records.
        - generic [ref=e22]:
          - button "Import vehicle makes" [ref=e24] [cursor=pointer]:
            - generic [ref=e25]: upload_file
          - button "Upload vehicle dropdown choices" [ref=e29] [cursor=pointer]:
            - generic [ref=e30]: upload_file
          - button "Add vehicle make" [ref=e34] [cursor=pointer]:
            - generic [ref=e35]: add
      - generic [ref=e38]:
        - table [ref=e40]:
          - rowgroup [ref=e41]:
            - row [ref=e42]:
              - columnheader [ref=e43]:
                - button "Make Code" [ref=e45] [cursor=pointer]
                - generic [ref=e51]:
                  - textbox "Code..." [ref=e56]
                  - combobox "Code... operator" [ref=e61] [cursor=pointer]:
                    - generic [ref=e62]: Contains
              - columnheader [ref=e69]:
                - button "Make Name" [ref=e71] [cursor=pointer]
                - generic [ref=e77]:
                  - textbox "Name..." [ref=e82]
                  - combobox "Name... operator" [ref=e87] [cursor=pointer]:
                    - generic [ref=e88]: Contains
              - columnheader [ref=e95]:
                - button "Short Name" [ref=e97] [cursor=pointer]
                - generic [ref=e103]:
                  - textbox "Short name..." [ref=e108]
                  - combobox "Short name... operator" [ref=e113] [cursor=pointer]:
                    - generic [ref=e114]: Contains
              - columnheader "Status" [ref=e121]:
                - generic [ref=e124]:
                  - combobox "Status filter" [ref=e129] [cursor=pointer]:
                    - generic [ref=e130]: All
                  - combobox "Status operator" [ref=e141] [cursor=pointer]:
                    - generic [ref=e142]: Equals
              - columnheader "Actions" [ref=e149]
          - rowgroup [ref=e150]:
            - row [ref=e151]:
              - cell "100" [ref=e152]
              - cell "TOYOTA" [ref=e153]
              - cell "TOYOTA" [ref=e154]
              - cell "Active" [ref=e155]
              - cell [ref=e156]:
                - button "Open 100" [ref=e158] [cursor=pointer]:
                  - generic [ref=e159]: visibility
                - button "Delete 100" [ref=e163] [cursor=pointer]:
                  - generic [ref=e164]: delete
            - row [ref=e167]:
              - cell "101" [ref=e168]
              - cell "HONDA" [ref=e169]
              - cell "HONDA" [ref=e170]
              - cell "Active" [ref=e171]
              - cell [ref=e172]:
                - button "Open 101" [ref=e174] [cursor=pointer]:
                  - generic [ref=e175]: visibility
                - button "Delete 101" [ref=e179] [cursor=pointer]:
                  - generic [ref=e180]: delete
            - row [ref=e183]:
              - cell "102" [ref=e184]
              - cell "FORD" [ref=e185]
              - cell "FORD" [ref=e186]
              - cell "Active" [ref=e187]
              - cell [ref=e188]:
                - button "Open 102" [ref=e190] [cursor=pointer]:
                  - generic [ref=e191]: visibility
                - button "Delete 102" [ref=e195] [cursor=pointer]:
                  - generic [ref=e196]: delete
            - row [ref=e199]:
              - cell "104" [ref=e200]
              - cell "NISSAN" [ref=e201]
              - cell "NISSAN" [ref=e202]
              - cell "Active" [ref=e203]
              - cell [ref=e204]:
                - button "Open 104" [ref=e206] [cursor=pointer]:
                  - generic [ref=e207]: visibility
                - button "Delete 104" [ref=e211] [cursor=pointer]:
                  - generic [ref=e212]: delete
            - row [ref=e215]:
              - cell "105" [ref=e216]
              - cell "HYUNDAI" [ref=e217]
              - cell "HYUNDAI" [ref=e218]
              - cell "Active" [ref=e219]
              - cell [ref=e220]:
                - button "Open 105" [ref=e222] [cursor=pointer]:
                  - generic [ref=e223]: visibility
                - button "Delete 105" [ref=e227] [cursor=pointer]:
                  - generic [ref=e228]: delete
            - row [ref=e231]:
              - cell "106" [ref=e232]
              - cell "KIA" [ref=e233]
              - cell "KIA" [ref=e234]
              - cell "Active" [ref=e235]
              - cell [ref=e236]:
                - button "Open 106" [ref=e238] [cursor=pointer]:
                  - generic [ref=e239]: visibility
                - button "Delete 106" [ref=e243] [cursor=pointer]:
                  - generic [ref=e244]: delete
            - row [ref=e247]:
              - cell "107" [ref=e248]
              - cell "VOLKSWAGEN" [ref=e249]
              - cell "VOLKSWAGEN" [ref=e250]
              - cell "Active" [ref=e251]
              - cell [ref=e252]:
                - button "Open 107" [ref=e254] [cursor=pointer]:
                  - generic [ref=e255]: visibility
                - button "Delete 107" [ref=e259] [cursor=pointer]:
                  - generic [ref=e260]: delete
            - row [ref=e263]:
              - cell "108" [ref=e264]
              - cell "BMW" [ref=e265]
              - cell "BMW" [ref=e266]
              - cell "Active" [ref=e267]
              - cell [ref=e268]:
                - button "Open 108" [ref=e270] [cursor=pointer]:
                  - generic [ref=e271]: visibility
                - button "Delete 108" [ref=e275] [cursor=pointer]:
                  - generic [ref=e276]: delete
            - row [ref=e279]:
              - cell "110" [ref=e280]
              - cell "AUDI" [ref=e281]
              - cell "AUDI" [ref=e282]
              - cell "Active" [ref=e283]
              - cell [ref=e284]:
                - button "Open 110" [ref=e286] [cursor=pointer]:
                  - generic [ref=e287]: visibility
                - button "Delete 110" [ref=e291] [cursor=pointer]:
                  - generic [ref=e292]: delete
            - row [ref=e295]:
              - cell "111" [ref=e296]
              - cell "LEXUS" [ref=e297]
              - cell "LEXUS" [ref=e298]
              - cell "Active" [ref=e299]
              - cell [ref=e300]:
                - button "Open 111" [ref=e302] [cursor=pointer]:
                  - generic [ref=e303]: visibility
                - button "Delete 111" [ref=e307] [cursor=pointer]:
                  - generic [ref=e308]: delete
        - group "Select a page of vehicle makes" [ref=e311]:
          - generic [ref=e313]:
            - generic [ref=e314]:
              - generic [aria-hidden] [ref=e315]: "Items per page:"
              - combobox "Items per page:" [ref=e320] [cursor=pointer]:
                - generic [ref=e321]: "10"
            - generic [ref=e329]:
              - status [ref=e330]: 1 – 10 of 16
              - button "First page" [disabled] [ref=e331]
              - button "Previous page" [disabled] [ref=e336]
              - button "Next page" [ref=e341] [cursor=pointer]
              - button "Last page" [ref=e346] [cursor=pointer]
```

# Test source

```ts
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
  122 |   ).toBeVisible();
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
> 148 |   await page.getByRole("button", { name: "Add Product" }).click();
      |                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  149 |   const dialog = page.getByRole("dialog", { name: "Available Products" });
  150 |   await dialog.getByLabel("Product Code").selectOption("PRD001");
  151 |   await dialog.getByRole("button", { name: "Cancel" }).click();
  152 |   await page.getByRole("button", { name: "Keep selecting" }).click();
  153 |   await expect(dialog).toBeVisible();
  154 |   await expect(dialog.getByLabel("Product Code")).toHaveValue("PRD001");
  155 | });
  156 | 
```