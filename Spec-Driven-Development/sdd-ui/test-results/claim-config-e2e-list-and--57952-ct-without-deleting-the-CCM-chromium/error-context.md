# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: claim-config-e2e\list-and-read.spec.ts >> reports linked-product conflict without deleting the CCM
- Location: ..\tests\claim-config-e2e\list-and-read.spec.ts:140:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Delete CCM001' })

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
  83  |   await expect(headers.nth(0)).toContainText("Claim Config Code");
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
> 144 |   await page.getByRole("button", { name: "Delete CCM001" }).click();
      |                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
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