# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: premium-adjustment-e2e\delete-adjustment-code.spec.ts >> cancelling permanent deletion leaves the row untouched
- Location: ..\tests\premium-adjustment-e2e\delete-adjustment-code.spec.ts:54:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Delete ZT1000000001' })

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
  7   | const item = {
  8   |   codeType: "CALC01",
  9   |   codeTypeDescription: "Calculation",
  10  |   code: "ZT1000000001",
  11  |   companyCode: "ZC2000000001",
  12  |   name: "Premium Cover",
  13  |   shortName: "Cover",
  14  |   active: true,
  15  | };
  16  | 
  17  | async function mockDelete(
  18  |   page: Page,
  19  |   missing = false,
  20  | ): Promise<{ count: number }> {
  21  |   const calls = { count: 0 };
  22  |   await page.route("**/api/premium-adjustments**", async (route) => {
  23  |     if (route.request().method() === "DELETE") {
  24  |       calls.count += 1;
  25  |       if (missing) {
  26  |         await route.fulfill({
  27  |           status: 404,
  28  |           contentType: "application/problem+json",
  29  |           body: JSON.stringify({
  30  |             status: 404,
  31  |             detail: "Do not expose this raw detail.",
  32  |           }),
  33  |         });
  34  |       } else {
  35  |         await route.fulfill({ status: 204 });
  36  |       }
  37  |       return;
  38  |     }
  39  |     await route.fulfill({
  40  |       status: 200,
  41  |       contentType: "application/json",
  42  |       body: JSON.stringify({
  43  |         items: [item],
  44  |         page: 1,
  45  |         pageSize: 10,
  46  |         totalCount: 1,
  47  |       }),
  48  |     });
  49  |   });
  50  |   await page.goto("/premium-adjustments");
  51  |   return calls;
  52  | }
  53  | 
  54  | test("cancelling permanent deletion leaves the row untouched", async ({
  55  |   page,
  56  | }) => {
  57  |   const requests = await mockDelete(page);
> 58  |   await page.getByRole("button", { name: `Delete ${item.code}` }).click();
      |                                                                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
  59  |   await expect(
  60  |     page.getByRole("dialog", { name: "Delete premium adjustment?" }),
  61  |   ).toBeVisible();
  62  |   await expect(page.getByText(/permanent and cannot be undone/i)).toBeVisible();
  63  |   await page.getByRole("button", { name: "Cancel" }).click();
  64  |   expect(requests.count).toBe(0);
  65  |   await expect(
  66  |     page.getByRole("cell", { name: item.code, exact: true }),
  67  |   ).toBeVisible();
  68  | });
  69  | 
  70  | test("confirmation deletes the row and a missing record gets a safe message", async ({
  71  |   page,
  72  | }) => {
  73  |   const requests = await mockDelete(page);
  74  |   await page.getByRole("button", { name: `Delete ${item.code}` }).click();
  75  |   await page.getByRole("button", { name: "Delete permanently" }).click();
  76  |   await expect.poll(() => requests.count).toBe(1);
  77  |   await expect(page.getByText("Premium adjustment deleted.")).toBeVisible();
  78  | 
  79  |   await page.goto("/premium-adjustments");
  80  |   await page.route("**/api/premium-adjustments**", async (route) => {
  81  |     if (route.request().method() === "DELETE") {
  82  |       await route.fulfill({
  83  |         status: 404,
  84  |         contentType: "application/problem+json",
  85  |         body: JSON.stringify({
  86  |           status: 404,
  87  |           detail: "Do not expose this raw detail.",
  88  |         }),
  89  |       });
  90  |       return;
  91  |     }
  92  |     await route.fulfill({
  93  |       status: 200,
  94  |       contentType: "application/json",
  95  |       body: JSON.stringify({
  96  |         items: [item],
  97  |         page: 1,
  98  |         pageSize: 10,
  99  |         totalCount: 1,
  100 |       }),
  101 |     });
  102 |   });
  103 |   await page.getByRole("button", { name: `Delete ${item.code}` }).click();
  104 |   await page.getByRole("button", { name: "Delete permanently" }).click();
  105 |   await expect(page.getByText(/already deleted/i)).toBeVisible();
  106 |   await expect(page.getByText("Do not expose this raw detail.")).toHaveCount(0);
  107 | });
  108 | 
```