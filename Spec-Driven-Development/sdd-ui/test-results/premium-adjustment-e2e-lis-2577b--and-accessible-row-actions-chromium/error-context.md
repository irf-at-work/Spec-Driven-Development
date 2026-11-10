# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: premium-adjustment-e2e\list-and-read.spec.ts >> renders per-column filters, status, breadcrumb and accessible row actions
- Location: ..\tests\premium-adjustment-e2e\list-and-read.spec.ts:104:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Premium Adjustment Master' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Premium Adjustment Master' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Premium Adjustment Master' })

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
  12  |   name: string;
  13  |   shortName: string;
  14  |   active: boolean;
  15  | }
  16  | 
  17  | interface AdjustmentCodeDto extends AdjustmentCodeListItemDto {
  18  |   discountType: string | null;
  19  |   chargesType: string | null;
  20  |   chargesCategory: string | null;
  21  |   remarks: string | null;
  22  |   arabicName: string | null;
  23  |   arabicShortName: string | null;
  24  |   arabicRemarks: string | null;
  25  |   createdBy: string | null;
  26  |   lastChangedBy: string | null;
  27  | }
  28  | 
  29  | const items: AdjustmentCodeListItemDto[] = [
  30  |   {
  31  |     codeType: "CALC_A",
  32  |     codeTypeDescription: "Vehicle",
  33  |     code: "ZT1000000001",
  34  |     companyCode: "ZT9000000001",
  35  |     name: "Premium cover",
  36  |     shortName: "Cover",
  37  |     active: true,
  38  |   },
  39  |   {
  40  |     codeType: "CALC_B",
  41  |     codeTypeDescription: "Benefit",
  42  |     code: "ZT1000000002",
  43  |     companyCode: "ZT9000000002",
  44  |     name: "Inactive cover",
  45  |     shortName: "Old cover",
  46  |     active: false,
  47  |   },
  48  | ];
  49  | 
  50  | const detail: AdjustmentCodeDto = {
  51  |   ...items[0],
  52  |   discountType: "PCT",
  53  |   chargesType: "BASE",
  54  |   chargesCategory: "MOTOR",
  55  |   remarks: "Read-only notes",
  56  |   arabicName: null,
  57  |   arabicShortName: null,
  58  |   arabicRemarks: null,
  59  |   createdBy: "admin",
  60  |   lastChangedBy: "admin",
  61  | };
  62  | 
  63  | async function mockApi(page: Page) {
  64  |   const requests: URL[] = [];
  65  |   await page.route("**/api/premium-adjustment-options**", async (route) => {
  66  |     await route.fulfill({
  67  |       status: 200,
  68  |       contentType: "application/json",
  69  |       body: JSON.stringify({
  70  |         codeTypes: [],
  71  |         discountTypes: [],
  72  |         chargesTypes: [],
  73  |         chargesCategories: [],
  74  |       }),
  75  |     });
  76  |   });
  77  |   await page.route("**/api/premium-adjustments**", async (route) => {
  78  |     const url = new URL(route.request().url());
  79  |     requests.push(url);
  80  |     if (url.pathname.replace(/^\/+/, "/") === "/api/premium-adjustments") {
  81  |       const noMatches = url.searchParams.get("name") === "no-match";
  82  |       await route.fulfill({
  83  |         status: 200,
  84  |         contentType: "application/json",
  85  |         body: JSON.stringify({
  86  |           items: noMatches ? [] : items,
  87  |           page: Number(url.searchParams.get("page") ?? 1),
  88  |           pageSize: 10,
  89  |           totalCount: noMatches ? 0 : 25,
  90  |         }),
  91  |       });
  92  |       return;
  93  |     }
  94  | 
  95  |     await route.fulfill({
  96  |       status: 200,
  97  |       contentType: "application/json",
  98  |       body: JSON.stringify(detail),
  99  |     });
  100 |   });
  101 |   return requests;
  102 | }
  103 | 
  104 | test("renders per-column filters, status, breadcrumb and accessible row actions", async ({
  105 |   page,
  106 | }) => {
  107 |   await mockApi(page);
  108 |   await page.goto("/premium-adjustments");
  109 | 
  110 |   await expect(
  111 |     page.getByRole("heading", { name: "Premium Adjustment Master" }),
> 112 |   ).toBeVisible();
      |     ^ Error: expect(locator).toBeVisible() failed
  113 |   await expect(
  114 |     page.getByRole("navigation", { name: "Breadcrumb" }),
  115 |   ).toContainText("Master Data");
  116 |   await expect(
  117 |     page.getByRole("navigation", { name: "Breadcrumb" }),
  118 |   ).toContainText("Premium Adjustments");
  119 |   await expect(page.getByRole("searchbox")).toHaveCount(0);
  120 |   for (const column of [
  121 |     "Code Type",
  122 |     "Code",
  123 |     "Company Code",
  124 |     "Name",
  125 |     "Short Name",
  126 |   ]) {
  127 |     await expect(
  128 |       page.getByRole("textbox", { name: `${column} filter`, exact: true }),
  129 |     ).toBeVisible();
  130 |   }
  131 |   await expect(
  132 |     page.getByRole("combobox", { name: "Status filter" }),
  133 |   ).toBeVisible();
  134 |   await expect(
  135 |     page.getByRole("cell", { name: "Active", exact: true }),
  136 |   ).toBeVisible();
  137 |   await expect(
  138 |     page.getByRole("cell", { name: "Inactive", exact: true }),
  139 |   ).toBeVisible();
  140 |   await expect(
  141 |     page.getByRole("button", { name: "Add premium adjustment" }),
  142 |   ).toBeEnabled();
  143 |   await expect(
  144 |     page.getByRole("button", { name: "Open ZT1000000001" }),
  145 |   ).toBeVisible();
  146 |   await expect(
  147 |     page.getByRole("button", { name: "Delete ZT1000000001" }),
  148 |   ).toBeEnabled();
  149 | });
  150 | 
  151 | test("returns to page one after filtering, sorts and opens a read-only record", async ({
  152 |   page,
  153 | }) => {
  154 |   const requests = await mockApi(page);
  155 |   await page.goto("/premium-adjustments");
  156 | 
  157 |   await page.getByRole("button", { name: "Next page" }).click();
  158 |   await expect.poll(() => requests.at(-1)?.searchParams.get("page")).toBe("2");
  159 | 
  160 |   const nameFilter = page.getByRole("textbox", {
  161 |     name: "Name filter",
  162 |     exact: true,
  163 |   });
  164 |   await nameFilter.fill("premium");
  165 |   await expect.poll(() => requests.at(-1)?.searchParams.get("page")).toBe("1");
  166 |   await expect
  167 |     .poll(() => requests.at(-1)?.searchParams.get("name"))
  168 |     .toBe("premium");
  169 | 
  170 |   await page.getByRole("button", { name: "Open ZT1000000001" }).click();
  171 |   await expect(page).toHaveURL(/\/premium-adjustments\/view$/);
  172 |   await expect(
  173 |     page.getByRole("heading", { name: "Premium Adjustment Details" }),
  174 |   ).toBeVisible();
  175 |   await expect(page.getByLabel("Remarks", { exact: true })).toHaveValue(
  176 |     "Read-only notes",
  177 |   );
  178 | });
  179 | 
  180 | test("supports text and status operators, empty results and clearing filters", async ({
  181 |   page,
  182 | }) => {
  183 |   const requests = await mockApi(page);
  184 |   await page.goto("/premium-adjustments");
  185 | 
  186 |   const codeTypeOperator = page.getByRole("combobox", {
  187 |     name: "Code Type filter operator",
  188 |     exact: true,
  189 |   });
  190 |   await codeTypeOperator.click();
  191 |   await page.getByRole("option", { name: "Starts with" }).click();
  192 |   await page
  193 |     .getByRole("textbox", {
  194 |       name: "Code Type filter",
  195 |       exact: true,
  196 |     })
  197 |     .fill("Vehicle");
  198 |   await expect
  199 |     .poll(() => requests.at(-1)?.searchParams.get("codeTypeOperator"))
  200 |     .toBe("startsWith");
  201 | 
  202 |   await page.getByRole("combobox", { name: "Status filter" }).click();
  203 |   await page.getByRole("option", { name: "Inactive" }).click();
  204 |   await expect
  205 |     .poll(() => requests.at(-1)?.searchParams.get("active"))
  206 |     .toBe("false");
  207 |   await page.getByRole("combobox", { name: "Status operator" }).click();
  208 |   await page.getByRole("option", { name: "Not equal" }).click();
  209 |   await expect
  210 |     .poll(() => requests.at(-1)?.searchParams.get("activeOperator"))
  211 |     .toBe("notEquals");
  212 | 
```