# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: claim-config-e2e\create-edit-claim-configuration.spec.ts >> create defaults Rounding Value to zero and blocks negative input
- Location: ..\tests\claim-config-e2e\create-edit-claim-configuration.spec.ts:116:5

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator: getByLabel('Rounding Value')
Expected: "0.00000"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveValue" getByLabel('Rounding Value') with timeout 5000ms
  - waiting for getByLabel('Rounding Value')

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
  113 |     await page.getByRole("button", { name: `Open ${ccmCode}` }).click();
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
> 130 |   await expect(roundingValue).toHaveValue("0.00000");
      |                               ^ Error: expect(locator).toHaveValue(expected) failed
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