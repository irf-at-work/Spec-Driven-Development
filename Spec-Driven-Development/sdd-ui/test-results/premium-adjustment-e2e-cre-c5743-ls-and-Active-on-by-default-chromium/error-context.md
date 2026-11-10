# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: premium-adjustment-e2e\create-adjustment-code.spec.ts >> validates fields and creates with Arabic details and Active on by default
- Location: ..\tests\premium-adjustment-e2e\create-adjustment-code.spec.ts:88:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Add premium adjustment' })

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
  7   | const options = {
  8   |   codeTypes: [{ code: "CALC01", description: "Calculation" }],
  9   |   discountTypes: [{ code: "DISC01", description: "Standard discount" }],
  10  |   chargesTypes: [{ code: "CHG01", description: "Base charge" }],
  11  |   chargesCategories: [{ code: "CAT01", description: "Motor" }],
  12  | };
  13  | 
  14  | async function mockCreateApi(page: Page, duplicate = false): Promise<void> {
  15  |   await page.route("**/api/premium-adjustment-options**", async (route) => {
  16  |     await route.fulfill({
  17  |       status: 200,
  18  |       contentType: "application/json",
  19  |       body: JSON.stringify(options),
  20  |     });
  21  |   });
  22  |   await page.route("**/api/premium-adjustments**", async (route) => {
  23  |     if (route.request().method() !== "POST") {
  24  |       await route.fulfill({
  25  |         status: 200,
  26  |         contentType: "application/json",
  27  |         body: JSON.stringify({
  28  |           items: [],
  29  |           page: 1,
  30  |           pageSize: 10,
  31  |           totalCount: 0,
  32  |         }),
  33  |       });
  34  |       return;
  35  |     }
  36  | 
  37  |     if (duplicate) {
  38  |       await route.fulfill({
  39  |         status: 409,
  40  |         contentType: "application/problem+json",
  41  |         body: JSON.stringify({
  42  |           title: "Duplicate premium adjustment",
  43  |           status: 409,
  44  |           errors: {
  45  |             code: [
  46  |               "This code type, code and company code combination already exists.",
  47  |             ],
  48  |           },
  49  |         }),
  50  |       });
  51  |       return;
  52  |     }
  53  | 
  54  |     const request = route.request().postDataJSON() as Record<string, unknown>;
  55  |     await route.fulfill({
  56  |       status: 200,
  57  |       contentType: "application/json",
  58  |       body: JSON.stringify({
  59  |         ...request,
  60  |         code: String(request["code"]).toUpperCase(),
  61  |         companyCode: String(request["companyCode"]).toUpperCase(),
  62  |         name: "Premium Cover",
  63  |         shortName: "BMW",
  64  |         codeTypeDescription: "Calculation",
  65  |         active: request["active"] ?? true,
  66  |         createdBy: "admin",
  67  |         lastChangedBy: "admin",
  68  |       }),
  69  |     });
  70  |   });
  71  | }
  72  | 
  73  | async function fillRequiredFields(page: Page): Promise<void> {
  74  |   await page.getByLabel("Code Type", { exact: true }).click();
  75  |   await page.getByRole("option", { name: "Calculation" }).click();
  76  |   await page.getByLabel("Code", { exact: true }).fill("zt1000000001");
  77  |   await page.getByLabel("Company Code", { exact: true }).fill("zt2000000001");
  78  |   await page.getByLabel("Name", { exact: true }).fill("  premium   cover  ");
  79  |   await page.getByLabel("Short Name", { exact: true }).fill("BMW");
  80  |   await page.getByLabel("Discount Type").click();
  81  |   await page.getByRole("option", { name: "Standard discount" }).click();
  82  |   await page.getByLabel("Charges Type").click();
  83  |   await page.getByRole("option", { name: "Base charge" }).click();
  84  |   await page.getByLabel("Charges Category").click();
  85  |   await page.getByRole("option", { name: "Motor" }).click();
  86  | }
  87  | 
  88  | test("validates fields and creates with Arabic details and Active on by default", async ({
  89  |   page,
  90  | }) => {
  91  |   await mockCreateApi(page);
  92  |   await page.goto("/premium-adjustments");
> 93  |   await page.getByRole("button", { name: "Add premium adjustment" }).click();
      |                                                                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  94  | 
  95  |   await expect(
  96  |     page.getByRole("heading", { name: "Add Premium Adjustment" }),
  97  |   ).toBeVisible();
  98  |   await page.getByRole("button", { name: "Save" }).click();
  99  |   await expect(page.getByText(/required/i).first()).toBeVisible();
  100 |   await page.getByLabel("Code", { exact: true }).fill("ZT12345678901");
  101 |   await expect(
  102 |     page.getByText(/maximum length|12 characters/i).first(),
  103 |   ).toBeVisible();
  104 | 
  105 |   await fillRequiredFields(page);
  106 |   const active = page.getByRole("switch", { name: "Active" });
  107 |   await expect(active).toBeChecked();
  108 |   await active.click();
  109 |   await expect(active).not.toBeChecked();
  110 |   await active.click();
  111 |   await expect(active).toBeChecked();
  112 |   await page.getByRole("button", { name: "Additional Information" }).click();
  113 |   const arabicName = "  خصم خاص ";
  114 |   await page.getByLabel("Arabic Name").fill(arabicName);
  115 |   await expect(page.getByLabel("Arabic Name")).toHaveAttribute("dir", "rtl");
  116 | 
  117 |   const post = page.waitForRequest(
  118 |     (request) =>
  119 |       request.url().includes("/api/premium-adjustments") &&
  120 |       request.method() === "POST",
  121 |   );
  122 |   await page.getByRole("button", { name: "Save" }).click();
  123 |   const request = await post;
  124 |   expect(request.postDataJSON()).toMatchObject({
  125 |     code: "ZT1000000001",
  126 |     companyCode: "ZT2000000001",
  127 |     arabicName,
  128 |   });
  129 | });
  130 | 
  131 | test("shows the duplicate message and prompts before discarding unsaved changes", async ({
  132 |   page,
  133 | }) => {
  134 |   await mockCreateApi(page, true);
  135 |   await page.goto("/premium-adjustments");
  136 |   await page.getByRole("button", { name: "Add premium adjustment" }).click();
  137 |   await fillRequiredFields(page);
  138 |   await page.getByRole("button", { name: "Save" }).click();
  139 |   await expect(
  140 |     page.getByText(
  141 |       "This code type, code and company code combination already exists.",
  142 |     ),
  143 |   ).toBeVisible();
  144 | 
  145 |   await page.getByLabel("Name", { exact: true }).fill("Unsaved update");
  146 |   await page.getByRole("link", { name: "Premium Adjustments" }).click();
  147 |   await expect(
  148 |     page.getByRole("dialog", { name: "Discard your changes?" }),
  149 |   ).toBeVisible();
  150 |   await page.getByRole("button", { name: "Keep editing" }).click();
  151 |   await expect(
  152 |     page.getByRole("dialog", { name: "Discard your changes?" }),
  153 |   ).toHaveCount(0);
  154 |   await expect(page).toHaveURL(/\/premium-adjustments\/new$/);
  155 | 
  156 |   await page
  157 |     .getByRole("button", { name: "Back to premium adjustments" })
  158 |     .click();
  159 |   await expect(
  160 |     page.getByRole("dialog", { name: "Discard your changes?" }),
  161 |   ).toBeVisible();
  162 |   await page.getByRole("button", { name: "Keep editing" }).click();
  163 |   await expect(
  164 |     page.getByRole("dialog", { name: "Discard your changes?" }),
  165 |   ).toHaveCount(0);
  166 |   await expect(page).toHaveURL(/\/premium-adjustments\/new$/);
  167 | });
  168 | 
  169 | test("browser back asks before leaving and honours keep editing", async ({
  170 |   page,
  171 | }) => {
  172 |   await mockCreateApi(page);
  173 |   await page.goto("/premium-adjustments");
  174 |   await page.getByRole("button", { name: "Add premium adjustment" }).click();
  175 |   await page.getByLabel("Code", { exact: true }).fill("ZT1000000001");
  176 | 
  177 |   await page.evaluate(() => window.history.back());
  178 |   await expect(
  179 |     page.getByRole("dialog", { name: "Discard your changes?" }),
  180 |   ).toBeVisible();
  181 |   await page.getByRole("button", { name: "Keep editing" }).click();
  182 |   await expect(
  183 |     page.getByRole("dialog", { name: "Discard your changes?" }),
  184 |   ).toHaveCount(0);
  185 |   await expect(page).toHaveURL(/\/premium-adjustments\/new$/);
  186 | });
  187 | 
  188 | test("confirming the browser-back prompt leaves the unsaved form", async ({
  189 |   page,
  190 | }) => {
  191 |   await mockCreateApi(page);
  192 |   await page.goto("/premium-adjustments");
  193 |   await page.getByRole("button", { name: "Add premium adjustment" }).click();
```