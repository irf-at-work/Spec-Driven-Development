# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: premium-adjustment-e2e\edit-adjustment-code.spec.ts >> opens with the key fields locked, edits the rest, and saves an active-state change
- Location: ..\tests\premium-adjustment-e2e\edit-adjustment-code.spec.ts:73:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Open ZT1000000001' })

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
  1   | import {
  2   |   expect,
  3   |   test,
  4   | } from "../../sdd-ui/node_modules/@playwright/test/index.js";
  5   | import type { Page } from "../../sdd-ui/node_modules/@playwright/test/index.js";
  6   | 
  7   | const key = {
  8   |   codeType: "CALC01",
  9   |   code: "ZT1000000001",
  10  |   companyCode: "ZC2000000001",
  11  | };
  12  | const options = {
  13  |   codeTypes: [{ code: "CALC01", description: "Calculation" }],
  14  |   discountTypes: [{ code: "DISC01", description: "Standard discount" }],
  15  |   chargesTypes: [{ code: "CHG01", description: "Base charge" }],
  16  |   chargesCategories: [{ code: "CAT01", description: "Motor" }],
  17  | };
  18  | const adjustment = {
  19  |   ...key,
  20  |   codeTypeDescription: "Calculation",
  21  |   name: "Premium Cover",
  22  |   shortName: "Cover",
  23  |   discountType: "INACTIVE",
  24  |   chargesType: "CHG01",
  25  |   chargesCategory: "CAT01",
  26  |   remarks: "Existing notes",
  27  |   arabicName: "غطاء",
  28  |   arabicShortName: null,
  29  |   arabicRemarks: null,
  30  |   active: true,
  31  |   createdBy: "admin",
  32  |   lastChangedBy: "admin",
  33  | };
  34  | 
  35  | async function openAdjustment(page: Page): Promise<void> {
  36  |   await page.route("**/api/premium-adjustments**", async (route) => {
  37  |     const request = route.request();
  38  |     if (
  39  |       request.method() === "GET" &&
  40  |       new URL(request.url()).pathname.replace(/^\/+/, "/") ===
  41  |         "/api/premium-adjustments"
  42  |     ) {
  43  |       await route.fulfill({
  44  |         status: 200,
  45  |         contentType: "application/json",
  46  |         body: JSON.stringify({
  47  |           items: [adjustment],
  48  |           page: 1,
  49  |           pageSize: 10,
  50  |           totalCount: 1,
  51  |         }),
  52  |       });
  53  |       return;
  54  |     }
  55  | 
  56  |     await route.fulfill({
  57  |       status: 200,
  58  |       contentType: "application/json",
  59  |       body: JSON.stringify(adjustment),
  60  |     });
  61  |   });
  62  |   await page.route("**/api/premium-adjustment-options**", async (route) => {
  63  |     await route.fulfill({
  64  |       status: 200,
  65  |       contentType: "application/json",
  66  |       body: JSON.stringify(options),
  67  |     });
  68  |   });
  69  |   await page.goto("/premium-adjustments");
> 70  |   await page.getByRole("button", { name: `Open ${key.code}` }).click();
      |                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  71  | }
  72  | 
  73  | test("opens with the key fields locked, edits the rest, and saves an active-state change", async ({
  74  |   page,
  75  | }) => {
  76  |   await openAdjustment(page);
  77  | 
  78  |   await expect(page.getByLabel("Name", { exact: true })).toBeEnabled();
  79  |   await expect(page.getByLabel("Code", { exact: true })).toBeDisabled();
  80  |   await expect(page.getByLabel("Company Code")).toBeDisabled();
  81  |   await expect(page.getByRole("switch", { name: "Active" })).toBeEnabled();
  82  |   await expect(page.getByLabel("Remarks", { exact: true })).toHaveValue(
  83  |     "Existing notes",
  84  |   );
  85  |   await expect(page.getByLabel("Arabic Name")).toHaveValue("غطاء");
  86  |   await expect(page.getByLabel("Discount Type", { exact: true })).toContainText(
  87  |     "INACTIVE (inactive)",
  88  |   );
  89  | 
  90  |   await page.getByLabel("Name", { exact: true }).fill("Changed name");
  91  |   await page.getByRole("switch", { name: "Active" }).click();
  92  | 
  93  |   const update = page.waitForRequest(
  94  |     (request) =>
  95  |       request.method() === "PUT" &&
  96  |       request.url().includes("/api/premium-adjustments/"),
  97  |   );
  98  |   await page.getByRole("button", { name: "Save changes" }).click();
  99  |   const request = await update;
  100 |   expect(new URL(request.url()).pathname).toContain(
  101 |     `/${key.codeType}/${key.code}/${key.companyCode}`,
  102 |   );
  103 |   expect(request.postDataJSON()).toMatchObject({
  104 |     name: "Changed name",
  105 |     discountType: "INACTIVE",
  106 |     active: false,
  107 |   });
  108 |   await expect(page.getByText("Premium adjustment updated.")).toBeVisible();
  109 | });
  110 | 
  111 | test("requires missing legacy classifications and asks before discarding changes", async ({
  112 |   page,
  113 | }) => {
  114 |   await page.route("**/api/premium-adjustments**", async (route) => {
  115 |     const url = new URL(route.request().url());
  116 |     if (
  117 |       route.request().method() === "GET" &&
  118 |       url.pathname.replace(/^\/+/, "/") === "/api/premium-adjustments"
  119 |     ) {
  120 |       await route.fulfill({
  121 |         status: 200,
  122 |         contentType: "application/json",
  123 |         body: JSON.stringify({
  124 |           items: [adjustment],
  125 |           page: 1,
  126 |           pageSize: 10,
  127 |           totalCount: 1,
  128 |         }),
  129 |       });
  130 |       return;
  131 |     }
  132 |     if (route.request().method() === "GET") {
  133 |       await route.fulfill({
  134 |         status: 200,
  135 |         contentType: "application/json",
  136 |         body: JSON.stringify({
  137 |           ...adjustment,
  138 |           discountType: null,
  139 |           chargesType: null,
  140 |           chargesCategory: null,
  141 |         }),
  142 |       });
  143 |       return;
  144 |     }
  145 |     await route.fulfill({
  146 |       status: 400,
  147 |       contentType: "application/problem+json",
  148 |       body: JSON.stringify({
  149 |         status: 400,
  150 |         errors: { discountType: ["Discount Type is required."] },
  151 |       }),
  152 |     });
  153 |   });
  154 |   await page.route("**/api/premium-adjustment-options**", async (route) => {
  155 |     await route.fulfill({
  156 |       status: 200,
  157 |       contentType: "application/json",
  158 |       body: JSON.stringify(options),
  159 |     });
  160 |   });
  161 |   await page.goto("/premium-adjustments");
  162 |   await page.getByRole("button", { name: `Open ${key.code}` }).click();
  163 | 
  164 |   const name = page.getByLabel("Name", { exact: true });
  165 |   await name.fill("Unsaved");
  166 |   await page
  167 |     .getByRole("button", { name: "Back to premium adjustments" })
  168 |     .click();
  169 |   await expect(
  170 |     page.getByRole("dialog", { name: "Discard your changes?" }),
```