import {
  expect,
  test,
} from "../../sdd-ui/node_modules/@playwright/test/index.js";
import type { Page } from "../../sdd-ui/node_modules/@playwright/test/index.js";

interface AdjustmentCodeListItemDto {
  codeType: string;
  codeTypeDescription: string;
  code: string;
  companyCode: string;
  name: string;
  shortName: string;
  active: boolean;
}

interface AdjustmentCodeDto extends AdjustmentCodeListItemDto {
  discountType: string | null;
  chargesType: string | null;
  chargesCategory: string | null;
  remarks: string | null;
  arabicName: string | null;
  arabicShortName: string | null;
  arabicRemarks: string | null;
  createdBy: string | null;
  lastChangedBy: string | null;
}

const items: AdjustmentCodeListItemDto[] = [
  {
    codeType: "CALC_A",
    codeTypeDescription: "Vehicle",
    code: "ZT1000000001",
    companyCode: "ZT9000000001",
    name: "Premium cover",
    shortName: "Cover",
    active: true,
  },
  {
    codeType: "CALC_B",
    codeTypeDescription: "Benefit",
    code: "ZT1000000002",
    companyCode: "ZT9000000002",
    name: "Inactive cover",
    shortName: "Old cover",
    active: false,
  },
];

const detail: AdjustmentCodeDto = {
  ...items[0],
  discountType: "PCT",
  chargesType: "BASE",
  chargesCategory: "MOTOR",
  remarks: "Read-only notes",
  arabicName: null,
  arabicShortName: null,
  arabicRemarks: null,
  createdBy: "admin",
  lastChangedBy: "admin",
};

async function mockApi(page: Page) {
  const requests: URL[] = [];
  await page.route("**/api/premium-adjustment-options**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        codeTypes: [],
        discountTypes: [],
        chargesTypes: [],
        chargesCategories: [],
      }),
    });
  });
  await page.route("**/api/premium-adjustments**", async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    if (url.pathname.replace(/^\/+/, "/") === "/api/premium-adjustments") {
      const noMatches = url.searchParams.get("name") === "no-match";
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: noMatches ? [] : items,
          page: Number(url.searchParams.get("page") ?? 1),
          pageSize: 10,
          totalCount: noMatches ? 0 : 25,
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(detail),
    });
  });
  return requests;
}

test("renders per-column filters, status, breadcrumb and accessible row actions", async ({
  page,
}) => {
  await mockApi(page);
  await page.goto("/premium-adjustments");

  await expect(
    page.getByRole("heading", { name: "Premium Adjustment Master" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toContainText("Master Data");
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toContainText("Premium Adjustments");
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  for (const column of [
    "Code Type",
    "Code",
    "Company Code",
    "Name",
    "Short Name",
  ]) {
    await expect(
      page.getByRole("textbox", { name: `${column} filter`, exact: true }),
    ).toBeVisible();
  }
  await expect(
    page.getByRole("combobox", { name: "Status filter" }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Active", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Inactive", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Add premium adjustment" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Open ZT1000000001" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Delete ZT1000000001" }),
  ).toBeEnabled();
});

test("returns to page one after filtering, sorts and opens a read-only record", async ({
  page,
}) => {
  const requests = await mockApi(page);
  await page.goto("/premium-adjustments");

  await page.getByRole("button", { name: "Next page" }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.get("page")).toBe("2");

  const nameFilter = page.getByRole("textbox", {
    name: "Name filter",
    exact: true,
  });
  await nameFilter.fill("premium");
  await expect.poll(() => requests.at(-1)?.searchParams.get("page")).toBe("1");
  await expect
    .poll(() => requests.at(-1)?.searchParams.get("name"))
    .toBe("premium");

  await page.getByRole("button", { name: "Open ZT1000000001" }).click();
  await expect(page).toHaveURL(/\/premium-adjustments\/view$/);
  await expect(
    page.getByRole("heading", { name: "Premium Adjustment Details" }),
  ).toBeVisible();
  await expect(page.getByLabel("Remarks", { exact: true })).toHaveValue(
    "Read-only notes",
  );
});

test("supports text and status operators, empty results and clearing filters", async ({
  page,
}) => {
  const requests = await mockApi(page);
  await page.goto("/premium-adjustments");

  const codeTypeOperator = page.getByRole("combobox", {
    name: "Code Type filter operator",
    exact: true,
  });
  await codeTypeOperator.click();
  await page.getByRole("option", { name: "Starts with" }).click();
  await page
    .getByRole("textbox", {
      name: "Code Type filter",
      exact: true,
    })
    .fill("Vehicle");
  await expect
    .poll(() => requests.at(-1)?.searchParams.get("codeTypeOperator"))
    .toBe("startsWith");

  await page.getByRole("combobox", { name: "Status filter" }).click();
  await page.getByRole("option", { name: "Inactive" }).click();
  await expect
    .poll(() => requests.at(-1)?.searchParams.get("active"))
    .toBe("false");
  await page.getByRole("combobox", { name: "Status operator" }).click();
  await page.getByRole("option", { name: "Not equal" }).click();
  await expect
    .poll(() => requests.at(-1)?.searchParams.get("activeOperator"))
    .toBe("notEquals");

  const nameFilter = page.getByRole("textbox", {
    name: "Name filter",
    exact: true,
  });
  await nameFilter.fill("no-match");
  await expect(
    page.getByText(
      "No premium adjustments match your filters. Try adjusting or clearing the filter values.",
    ),
  ).toBeVisible();

  await nameFilter.fill("");
  await expect.poll(() => requests.at(-1)?.searchParams.get("name")).toBeNull();
  await expect(page.getByRole("cell", { name: "Premium cover" })).toBeVisible();

  await page.getByRole("button", { name: "Next page" }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.get("page")).toBe("2");
  await page.getByRole("button", { name: "Name", exact: true }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.get("page")).toBe("1");
  await expect
    .poll(() => requests.at(-1)?.searchParams.get("sortBy"))
    .toBe("name");
});
