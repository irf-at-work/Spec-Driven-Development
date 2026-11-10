# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: claim-config-e2e\create-edit-claim-configuration.spec.ts >> view page saves edits through the update endpoint
- Location: ..\tests\claim-config-e2e\create-edit-claim-configuration.spec.ts:172:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Open CCM001' })

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
  13  |   nameL2: "إعداد المطالبة",
  14  |   shortNameL2: "مطالبة",
  15  |   module: null,
  16  |   accountingPostingType: null,
  17  |   accountingExchangeRateType: null,
  18  |   roundingType: null,
  19  |   roundingValue: null,
  20  |   applicableCurrencyType: null,
  21  |   defaultEstimatedClosureReasonCode: null,
  22  |   defaultRecoveryDeductionCode: null,
  23  |   printBeforeApproval: true,
  24  |   reprint: true,
  25  |   claimAccountingDocumentGeneration: true,
  26  |   claimCoinsuranceAccountingDocumentGeneration: true,
  27  |   active: true,
  28  |   createdBy: "admin",
  29  |   createdAt: "2026-11-10T09:00:00Z",
  30  |   updatedBy: "admin",
  31  |   updatedAt: "2026-11-10T09:00:00Z",
  32  | };
  33  | 
  34  | async function openConfiguration(page: Page, create = false): Promise<void> {
  35  |   await page.route("**/api/claim-configurations**", async (route) => {
  36  |     const url = new URL(route.request().url());
  37  |     if (url.pathname.endsWith("/write-status")) {
  38  |       await route.fulfill({
  39  |         status: 200,
  40  |         contentType: "application/json",
  41  |         body: JSON.stringify({
  42  |           enabled: true,
  43  |           message: "Ready",
  44  |           companyCode: "ASRTEST",
  45  |         }),
  46  |       });
  47  |       return;
  48  |     }
  49  |     if (url.pathname.endsWith("/products")) {
  50  |       await route.fulfill({
  51  |         status: 200,
  52  |         contentType: "application/json",
  53  |         body: JSON.stringify({
  54  |           items: [],
  55  |           page: 1,
  56  |           pageSize: 5,
  57  |           totalCount: 0,
  58  |         }),
  59  |       });
  60  |       return;
  61  |     }
  62  |     if (url.pathname.endsWith("/available-products")) {
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
  73  |       return;
  74  |     }
  75  |     if (url.pathname === "/api/claim-configurations") {
  76  |       await route.fulfill({
  77  |         status: 200,
  78  |         contentType: "application/json",
  79  |         body: JSON.stringify({
  80  |           items: [{ ...detail }],
  81  |           page: 1,
  82  |           pageSize: 10,
  83  |           totalCount: 1,
  84  |         }),
  85  |       });
  86  |       return;
  87  |     }
  88  |     if (route.request().method() === "PUT") {
  89  |       await route.fulfill({
  90  |         status: 200,
  91  |         contentType: "application/json",
  92  |         body: JSON.stringify(detail),
  93  |       });
  94  |       return;
  95  |     }
  96  |     await route.fulfill({
  97  |       status: 200,
  98  |       contentType: "application/json",
  99  |       body: JSON.stringify(detail),
  100 |     });
  101 |   });
  102 |   await page.route("**/api/claim-configuration-options/**", async (route) => {
  103 |     await route.fulfill({
  104 |       status: 200,
  105 |       contentType: "application/json",
  106 |       body: JSON.stringify({ items: [], page: 1, pageSize: 10, totalCount: 0 }),
  107 |     });
  108 |   });
  109 |   await page.goto(
  110 |     create ? "/claim-configurations/new" : "/claim-configurations",
  111 |   );
  112 |   if (!create)
> 113 |     await page.getByRole("button", { name: `Open ${ccmCode}` }).click();
      |                                                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  114 | }
  115 | 
  116 | test("create defaults Rounding Value to zero and blocks negative input", async ({
  117 |   page,
  118 | }) => {
  119 |   let createRequests = 0;
  120 |   page.on("request", (request) => {
  121 |     if (
  122 |       request.method() === "POST" &&
  123 |       request.url().endsWith("/api/claim-configurations")
  124 |     )
  125 |       createRequests += 1;
  126 |   });
  127 |   await openConfiguration(page, true);
  128 | 
  129 |   const roundingValue = page.getByLabel("Rounding Value");
  130 |   await expect(roundingValue).toHaveValue("0.00000");
  131 |   await expect(roundingValue).toHaveAttribute("min", "0");
  132 |   await expect(
  133 |     page.getByRole("button", { name: "Save", exact: true }),
  134 |   ).toBeEnabled();
  135 |   await roundingValue.fill("-0.00001");
  136 |   await expect(
  137 |     page.getByText("Rounding Value cannot be negative."),
  138 |   ).toBeVisible();
  139 | 
  140 |   await page.getByLabel("CCM Code").fill("CCM002");
  141 |   await page.getByLabel("Claim Config Name").fill("Claim Config");
  142 |   await page.getByRole("button", { name: "Save", exact: true }).click();
  143 |   expect(createRequests).toBe(0);
  144 | });
  145 | 
  146 | test("eye opens the editable view with shared Arabic and Active controls, without Company Code", async ({
  147 |   page,
  148 | }) => {
  149 |   await openConfiguration(page);
  150 | 
  151 |   await expect(
  152 |     page.getByRole("heading", { name: "Claim Configuration Details" }),
  153 |   ).toBeVisible();
  154 |   await expect(page.getByText(ccmCode, { exact: true })).toBeVisible();
  155 |   await expect(page.getByLabel("Claim Config Name")).toHaveValue(
  156 |     "CLAIM CONFIGURATION",
  157 |   );
  158 |   await expect(page.getByLabel("Arabic Name")).toHaveAttribute("dir", "rtl");
  159 |   await expect(page.getByLabel("Arabic Name")).toHaveValue("إعداد المطالبة");
  160 |   await expect(
  161 |     page.getByRole("button", { name: /Additional Information/ }),
  162 |   ).toBeVisible();
  163 |   await expect(page.getByRole("switch", { name: "Active" })).toBeEnabled();
  164 |   await expect(page.getByText("Company Code", { exact: true })).toHaveCount(0);
  165 |   await expect(page.getByLabel("Audit information")).toHaveCount(0);
  166 |   await expect(
  167 |     page.getByRole("heading", { name: "Applicable Products" }),
  168 |   ).toBeVisible();
  169 |   await expect(page.getByRole("button", { name: "Add Product" })).toBeEnabled();
  170 | });
  171 | 
  172 | test("view page saves edits through the update endpoint", async ({ page }) => {
  173 |   await openConfiguration(page);
  174 |   await page.getByLabel("Arabic Short Name").fill(" اسم جديد ");
  175 |   await page.getByRole("switch", { name: "Active" }).click();
  176 | 
  177 |   const update = page.waitForRequest(
  178 |     (request) =>
  179 |       request.method() === "PUT" &&
  180 |       request.url().endsWith(`/api/claim-configurations/${ccmCode}`),
  181 |   );
  182 |   await page.getByRole("button", { name: "Save changes" }).click();
  183 |   const request = await update;
  184 |   const body = request.postDataJSON() as {
  185 |     shortNameL2: string;
  186 |     active: boolean;
  187 |   };
  188 |   expect(body.shortNameL2).toBe(" اسم جديد ");
  189 |   expect(body.active).toBe(false);
  190 | });
  191 | 
```