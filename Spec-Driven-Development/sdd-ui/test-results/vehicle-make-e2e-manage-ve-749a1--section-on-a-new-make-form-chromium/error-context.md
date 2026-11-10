# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vehicle-make-e2e\manage-vehicle-models.spec.ts >> Manage vehicle models >> lists a make's models with their controls, and has no models section on a new-make form
- Location: ..\tests\vehicle-make-e2e\manage-vehicle-models.spec.ts:34:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Add vehicle make' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Add vehicle make' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Add vehicle make' })

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
    - status: 1 – 10 of 17
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - button "Next page"
    - button "Last page"
```

# Test source

```ts
  1   | import { expect, test, type APIRequestContext } from "@playwright/test";
  2   | import {
  3   |   apiUrl,
  4   |   createMakeThroughApi,
  5   |   newMakeCode,
  6   |   openMake,
  7   |   removeMakeThroughApi,
  8   | } from "./helpers";
  9   | 
  10  | // Models are added and edited on their own pages, opened from the make's page.
  11  | test.describe("Manage vehicle models", () => {
  12  |   let makeCode = "";
  13  |   let createdModelCodes: string[] = [];
  14  | 
  15  |   test.beforeEach(async ({ request }) => {
  16  |     makeCode = newMakeCode();
  17  |     createdModelCodes = [];
  18  |     await createMakeThroughApi(request, {
  19  |       makeCode,
  20  |       makeName: "Model Test Make",
  21  |       shortName: "Model Test",
  22  |     });
  23  |   });
  24  | 
  25  |   test.afterEach(async ({ request }) => {
  26  |     for (const modelCode of createdModelCodes) {
  27  |       await request.delete(
  28  |         `${apiUrl}/api/vehicle-makes/${makeCode}/models/${modelCode}`,
  29  |       );
  30  |     }
  31  |     await removeMakeThroughApi(request, makeCode);
  32  |   });
  33  | 
  34  |   test("lists a make's models with their controls, and has no models section on a new-make form", async ({
  35  |     page,
  36  |     request,
  37  |   }) => {
  38  |     const modelCode = "LISTED-1";
  39  |     createdModelCodes.push(modelCode);
  40  |     await createModelThroughApi(request, makeCode, modelCode);
  41  | 
  42  |     await openMake(page, makeCode);
  43  | 
  44  |     const row = page.locator("tr.mat-mdc-row").filter({ hasText: modelCode });
  45  |     await expect(row).toContainText("Model Test");
  46  |     await expect(
  47  |       row.getByRole("button", { name: `Edit ${modelCode}` }),
  48  |     ).toBeVisible();
  49  |     await expect(
  50  |       row.getByRole("button", { name: `Delete ${modelCode}` }),
  51  |     ).toBeVisible();
  52  |     await expect(page.getByRole("button", { name: "Add model" })).toBeVisible();
  53  | 
  54  |     await page.goto("/vehicle-makes/new");
  55  |     await expect(
  56  |       page.getByRole("heading", { name: "Add vehicle make" }),
> 57  |     ).toBeVisible();
      |       ^ Error: expect(locator).toBeVisible() failed
  58  |     await expect(
  59  |       page.getByRole("heading", { name: "Vehicle Models" }),
  60  |     ).toHaveCount(0);
  61  |   });
  62  | 
  63  |   test("creates, edits and permanently deletes a model on its own pages", async ({
  64  |     page,
  65  |     request,
  66  |   }) => {
  67  |     const modelCode = "INLINE-1";
  68  |     createdModelCodes.push(modelCode);
  69  | 
  70  |     await openMake(page, makeCode);
  71  |     await expect(
  72  |       page.getByText(/No models have been added for this make yet/),
  73  |     ).toBeVisible();
  74  |     await page.getByRole("button", { name: "Add model" }).click();
  75  | 
  76  |     await expect(
  77  |       page.getByRole("heading", {
  78  |         name: `Add Vehicle Model for Make ${makeCode}`,
  79  |       }),
  80  |     ).toBeVisible();
  81  |     await expect(page.getByRole("switch", { name: "Active" })).toBeChecked();
  82  |     await page
  83  |       .getByLabel("Model Code", { exact: true })
  84  |       .fill(modelCode.toLowerCase());
  85  |     await page.getByLabel("Model Name", { exact: true }).fill("inline model");
  86  |     await page.getByLabel("Short Name", { exact: true }).fill("inline");
  87  | 
  88  |     const optionsResponse = await request.get(
  89  |       `${apiUrl}/api/vehicle-model-options`,
  90  |     );
  91  |     expect(optionsResponse.ok()).toBeTruthy();
  92  |     const options = (await optionsResponse.json()) as {
  93  |       variants: Array<{ code: string; description: string }>;
  94  |     };
  95  |     const variant = options.variants[0];
  96  |     if (!variant) {
  97  |       throw new Error(
  98  |         "The approved test schema must contain at least one active vehicle variant.",
  99  |       );
  100 |     }
  101 |     await page.getByRole("combobox", { name: "Variant" }).click();
  102 |     await page
  103 |       .getByRole("option", { name: variant.description, exact: true })
  104 |       .click();
  105 | 
  106 |     await page.getByRole("switch", { name: "Active" }).click();
  107 |     await page.getByRole("button", { name: "Save vehicle model" }).click();
  108 | 
  109 |     await expect(page.getByText("Vehicle model created.")).toBeVisible();
  110 |     const row = page.locator("tr.mat-mdc-row").filter({ hasText: modelCode });
  111 |     await expect(row).toContainText("Inactive");
  112 |     let response = await request.get(
  113 |       `${apiUrl}/api/vehicle-makes/${makeCode}/models?page=1`,
  114 |     );
  115 |     expect(response.ok()).toBeTruthy();
  116 |     let result = (await response.json()) as {
  117 |       items: Array<{ modelCode: string; variant: string | null }>;
  118 |     };
  119 |     let stored = result.items.find((item) => item.modelCode === modelCode);
  120 |     if (!stored) {
  121 |       throw new Error(
  122 |         `Created model ${modelCode} was not returned by the models list.`,
  123 |       );
  124 |     }
  125 |     expect(stored.modelCode).toBe(modelCode);
  126 |     expect(stored.variant).toBe(variant?.code ?? null);
  127 | 
  128 |     await row.getByRole("button", { name: `Edit ${modelCode}` }).click();
  129 |     await expect(page.getByLabel("Model Code", { exact: true })).toBeDisabled();
  130 |     await page.getByLabel("Model Name", { exact: true }).fill("updated model");
  131 |     await page.getByRole("switch", { name: "Active" }).click();
  132 |     await page.getByRole("button", { name: "Save changes" }).click();
  133 |     await expect(page.getByText("Vehicle model updated.")).toBeVisible();
  134 |     await expect(row).toContainText("Updated Model");
  135 |     await expect(row).toContainText("Active");
  136 | 
  137 |     response = await request.get(
  138 |       `${apiUrl}/api/vehicle-makes/${makeCode}/models?page=1`,
  139 |     );
  140 |     result = (await response.json()) as {
  141 |       items: Array<{ modelCode: string; variant: string | null }>;
  142 |     };
  143 |     stored = result.items.find((item) => item.modelCode === modelCode);
  144 |     if (!stored) {
  145 |       throw new Error(
  146 |         `Updated model ${modelCode} was not returned by the models list.`,
  147 |       );
  148 |     }
  149 |     expect(stored.modelCode).toBe(modelCode);
  150 | 
  151 |     await row.getByRole("button", { name: `Delete ${modelCode}` }).click();
  152 |     await expect(
  153 |       page.getByRole("heading", { name: "Delete vehicle model" }),
  154 |     ).toBeVisible();
  155 |     await page.getByRole("button", { name: "Delete permanently" }).click();
  156 |     await expect(page.getByText("Vehicle model deleted.")).toBeVisible();
  157 |     await expect(
```