# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: claim-config-e2e\list-and-read.spec.ts >> deletes only after confirmation and leaves linked configurations untouched
- Location: ..\tests\claim-config-e2e\list-and-read.spec.ts:122:5

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator: getByRole('button', { name: 'Delete CCM001' })
Expected: enabled
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeEnabled" getByRole('button', { name: 'Delete CCM001' }) with timeout 5000ms
  - waiting for getByRole('button', { name: 'Delete CCM001' })

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
  27  |         contentType: "application/json",
  28  |         body: JSON.stringify({
  29  |           enabled: true,
  30  |           message: "Ready",
  31  |           companyCode: "ASRTEST",
  32  |         }),
  33  |       });
  34  |     } else if (route.request().method() === "DELETE") {
  35  |       calls.deletes += 1;
  36  |       if (linkedDelete) {
  37  |         await route.fulfill({
  38  |           status: 409,
  39  |           contentType: "application/problem+json",
  40  |           body: JSON.stringify({
  41  |             status: 409,
  42  |             title: "Claim configuration has linked products",
  43  |           }),
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
> 127 |   await expect(deleteAction).toBeEnabled();
      |                              ^ Error: expect(locator).toBeEnabled() failed
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
  144 |   await page.getByRole("button", { name: "Delete CCM001" }).click();
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