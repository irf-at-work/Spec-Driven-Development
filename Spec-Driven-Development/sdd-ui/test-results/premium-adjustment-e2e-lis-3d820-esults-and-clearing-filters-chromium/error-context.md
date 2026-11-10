# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: premium-adjustment-e2e\list-and-read.spec.ts >> supports text and status operators, empty results and clearing filters
- Location: ..\tests\premium-adjustment-e2e\list-and-read.spec.ts:180:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('combobox', { name: 'Code Type filter operator', exact: true })

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
> 190 |   await codeTypeOperator.click();
      |                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
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