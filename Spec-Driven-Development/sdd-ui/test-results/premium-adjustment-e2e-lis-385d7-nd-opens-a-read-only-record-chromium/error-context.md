# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: premium-adjustment-e2e\list-and-read.spec.ts >> returns to page one after filtering, sorts and opens a read-only record
- Location: ..\tests\premium-adjustment-e2e\list-and-read.spec.ts:151:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "2"
Received: undefined

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
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
              - cell "112" [ref=e152]
              - cell "MAZDA" [ref=e153]
              - cell "MAZDA" [ref=e154]
              - cell "Active" [ref=e155]
              - cell [ref=e156]:
                - button "Open 112" [ref=e158] [cursor=pointer]:
                  - generic [ref=e159]: visibility
                - button "Delete 112" [ref=e163] [cursor=pointer]:
                  - generic [ref=e164]: delete
            - row [ref=e167]:
              - cell "113" [ref=e168]
              - cell "SUBARU" [ref=e169]
              - cell "SUBARU" [ref=e170]
              - cell "Active" [ref=e171]
              - cell [ref=e172]:
                - button "Open 113" [ref=e174] [cursor=pointer]:
                  - generic [ref=e175]: visibility
                - button "Delete 113" [ref=e179] [cursor=pointer]:
                  - generic [ref=e180]: delete
            - row [ref=e183]:
              - cell "114" [ref=e184]
              - cell "MITSUBISHI" [ref=e185]
              - cell "MITSUBISHI" [ref=e186]
              - cell "Active" [ref=e187]
              - cell [ref=e188]:
                - button "Open 114" [ref=e190] [cursor=pointer]:
                  - generic [ref=e191]: visibility
                - button "Delete 114" [ref=e195] [cursor=pointer]:
                  - generic [ref=e196]: delete
            - row [ref=e199]:
              - cell "115" [ref=e200]
              - cell "JEEP" [ref=e201]
              - cell "JEEP" [ref=e202]
              - cell "Active" [ref=e203]
              - cell [ref=e204]:
                - button "Open 115" [ref=e206] [cursor=pointer]:
                  - generic [ref=e207]: visibility
                - button "Delete 115" [ref=e211] [cursor=pointer]:
                  - generic [ref=e212]: delete
            - row [ref=e215]:
              - cell "116" [ref=e216]
              - cell "LAND ROVER" [ref=e217]
              - cell "LAND ROVER" [ref=e218]
              - cell "Active" [ref=e219]
              - cell [ref=e220]:
                - button "Open 116" [ref=e222] [cursor=pointer]:
                  - generic [ref=e223]: visibility
                - button "Delete 116" [ref=e227] [cursor=pointer]:
                  - generic [ref=e228]: delete
            - row [ref=e231]:
              - cell "117" [ref=e232]
              - cell "VOLVO" [ref=e233]
              - cell "VOLVO" [ref=e234]
              - cell "Active" [ref=e235]
              - cell [ref=e236]:
                - button "Open 117" [ref=e238] [cursor=pointer]:
                  - generic [ref=e239]: visibility
                - button "Delete 117" [ref=e243] [cursor=pointer]:
                  - generic [ref=e244]: delete
        - group "Select a page of vehicle makes" [ref=e247]:
          - generic [ref=e249]:
            - generic [ref=e250]:
              - generic [aria-hidden] [ref=e251]: "Items per page:"
              - combobox "Items per page:" [ref=e256] [cursor=pointer]:
                - generic [ref=e257]: "10"
            - generic [ref=e265]:
              - status [ref=e266]: 11 – 16 of 16
              - button "First page" [ref=e267] [cursor=pointer]
              - button "Previous page" [ref=e272] [cursor=pointer]
              - button "Next page" [disabled] [active] [ref=e277]
              - button "Last page" [disabled] [ref=e282]
```

# Test source

```ts
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
  112 |   ).toBeVisible();
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
> 158 |   await expect.poll(() => requests.at(-1)?.searchParams.get("page")).toBe("2");
      |                                                                      ^ Error: expect(received).toBe(expected) // Object.is equality
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
  213 |   const nameFilter = page.getByRole("textbox", {
  214 |     name: "Name filter",
  215 |     exact: true,
  216 |   });
  217 |   await nameFilter.fill("no-match");
  218 |   await expect(
  219 |     page.getByText(
  220 |       "No premium adjustments match your filters. Try adjusting or clearing the filter values.",
  221 |     ),
  222 |   ).toBeVisible();
  223 | 
  224 |   await nameFilter.fill("");
  225 |   await expect.poll(() => requests.at(-1)?.searchParams.get("name")).toBeNull();
  226 |   await expect(page.getByRole("cell", { name: "Premium cover" })).toBeVisible();
  227 | 
  228 |   await page.getByRole("button", { name: "Next page" }).click();
  229 |   await expect.poll(() => requests.at(-1)?.searchParams.get("page")).toBe("2");
  230 |   await page.getByRole("button", { name: "Name", exact: true }).click();
  231 |   await expect.poll(() => requests.at(-1)?.searchParams.get("page")).toBe("1");
  232 |   await expect
  233 |     .poll(() => requests.at(-1)?.searchParams.get("sortBy"))
  234 |     .toBe("name");
  235 | });
  236 | 
```