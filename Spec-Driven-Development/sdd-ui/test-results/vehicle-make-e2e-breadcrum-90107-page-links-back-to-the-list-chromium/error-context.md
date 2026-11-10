# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vehicle-make-e2e\breadcrumb.spec.ts >> Breadcrumb >> the add page links back to the list
- Location: ..\tests\vehicle-make-e2e\breadcrumb.spec.ts:37:7

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByRole('navigation', { name: 'Breadcrumb' }).locator('[aria-current="page"]')
Expected: "Add vehicle make"
Received: "Vehicle Makes"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByRole('navigation', { name: 'Breadcrumb' }).locator('[aria-current="page"]') with timeout 5000ms
  - waiting for getByRole('navigation', { name: 'Breadcrumb' }).locator('[aria-current="page"]')
    12 × locator resolved to <span aria-current="page" _ngcontent-ng-c1479368586="">Vehicle Makes</span>
       - unexpected value "Vehicle Makes"

```

```yaml
- text: Vehicle Makes
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
> 41 |     await expect(trail.locator('[aria-current="page"]')).toHaveText(
     |                                                          ^ Error: expect(locator).toHaveText(expected) failed
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
  76 |     await page.getByLabel("Make Code").fill("ZTCRUMB");
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