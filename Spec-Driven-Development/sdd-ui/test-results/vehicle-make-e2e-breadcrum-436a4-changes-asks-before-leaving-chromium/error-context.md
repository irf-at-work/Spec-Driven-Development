# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vehicle-make-e2e\breadcrumb.spec.ts >> Breadcrumb >> using a breadcrumb with unsaved changes asks before leaving
- Location: ..\tests\vehicle-make-e2e\breadcrumb.spec.ts:72:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel('Make Code')

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
              - status [ref=e330]: 1 – 10 of 17
              - button "First page" [disabled] [ref=e331]
              - button "Previous page" [disabled] [ref=e336]
              - button "Next page" [ref=e341] [cursor=pointer]
              - button "Last page" [ref=e346] [cursor=pointer]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | import {
  3  |   createMakeThroughApi,
  4  |   newMakeCode,
  5  |   removeMakeThroughApi,
  6  | } from "./helpers";
  7  | 
  8  | test.describe("Breadcrumb", () => {
  9  |   let makeCode = "";
  10 | 
  11 |   test.beforeEach(async ({ request }) => {
  12 |     makeCode = newMakeCode();
  13 |     await createMakeThroughApi(request, {
  14 |       makeCode,
  15 |       makeName: "Crumb Make",
  16 |       shortName: "Crumb",
  17 |     });
  18 |   });
  19 | 
  20 |   test.afterEach(async ({ request }) => {
  21 |     await removeMakeThroughApi(request, makeCode);
  22 |   });
  23 | 
  24 |   test("the list page shows where you are, and the current step is not a link", async ({
  25 |     page,
  26 |   }) => {
  27 |     await page.goto("/vehicle-makes");
  28 | 
  29 |     const trail = page.getByRole("navigation", { name: "Breadcrumb" });
  30 |     await expect(trail).toContainText("Master Data");
  31 |     await expect(trail.locator('[aria-current="page"]')).toHaveText(
  32 |       "Vehicle Makes",
  33 |     );
  34 |     await expect(trail.getByRole("link")).toHaveCount(0);
  35 |   });
  36 | 
  37 |   test("the add page links back to the list", async ({ page }) => {
  38 |     await page.goto("/vehicle-makes/new");
  39 | 
  40 |     const trail = page.getByRole("navigation", { name: "Breadcrumb" });
  41 |     await expect(trail.locator('[aria-current="page"]')).toHaveText(
  42 |       "Add vehicle make",
  43 |     );
  44 | 
  45 |     await trail.getByRole("link", { name: "Vehicle Makes" }).click();
  46 | 
  47 |     await expect(
  48 |       page.getByRole("heading", { name: "Vehicle Make Master" }),
  49 |     ).toBeVisible();
  50 |   });
  51 | 
  52 |   test("a model page links back to its make, which opens with its code and a clean address", async ({
  53 |     page,
  54 |   }) => {
  55 |     await page.goto(`/vehicle-makes/${makeCode}/models/new`);
  56 | 
  57 |     const trail = page.getByRole("navigation", { name: "Breadcrumb" });
  58 |     await expect(trail.locator('[aria-current="page"]')).toHaveText(
  59 |       "Add model",
  60 |     );
  61 | 
  62 |     await trail.getByRole("link", { name: makeCode }).click();
  63 | 
  64 |     await expect(
  65 |       page.getByRole("heading", { name: "Vehicle make details" }),
  66 |     ).toBeVisible();
  67 |     await expect(trail.locator('[aria-current="page"]')).toHaveText(makeCode);
  68 |     // The code travels in the navigation state, so it is not in the address.
  69 |     await expect(page).toHaveURL(/\/vehicle-makes\/view$/);
  70 |   });
  71 | 
  72 |   test("using a breadcrumb with unsaved changes asks before leaving", async ({
  73 |     page,
  74 |   }) => {
  75 |     await page.goto("/vehicle-makes/new");
> 76 |     await page.getByLabel("Make Code").fill("ZTCRUMB");
     |                                        ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  77 | 
  78 |     const trail = page.getByRole("navigation", { name: "Breadcrumb" });
  79 |     await trail.getByRole("link", { name: "Vehicle Makes" }).click();
  80 |     await expect(page.getByText("Discard your changes?")).toBeVisible();
  81 | 
  82 |     await page.getByRole("button", { name: "Keep editing" }).click();
  83 |     await expect(
  84 |       page.getByRole("heading", { name: "Add vehicle make" }),
  85 |     ).toBeVisible();
  86 | 
  87 |     await trail.getByRole("link", { name: "Vehicle Makes" }).click();
  88 |     await page.getByRole("button", { name: "Discard changes" }).click();
  89 |     await expect(
  90 |       page.getByRole("heading", { name: "Vehicle Make Master" }),
  91 |     ).toBeVisible();
  92 |   });
  93 | });
  94 | 
```