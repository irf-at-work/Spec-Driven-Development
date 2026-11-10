import {
  expect,
  test,
} from "../../sdd-ui/node_modules/@playwright/test/index.js";
import type { Page } from "../../sdd-ui/node_modules/@playwright/test/index.js";

const row = {
  companyCode: "ASRTEST",
  ccmCode: "CCM001",
  name: "CLAIM CONFIG",
  shortName: "CLAIM",
  module: "AV",
  active: true,
};

async function mockList(
  page: Page,
  linkedDelete = false,
): Promise<{ deletes: number }> {
  let deleted = false;
  const calls = { deletes: 0 };
  await page.route("**/api/claim-configurations**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/write-status")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          enabled: true,
          message: "Ready",
          companyCode: "ASRTEST",
        }),
      });
    } else if (route.request().method() === "DELETE") {
      calls.deletes += 1;
      if (linkedDelete) {
        await route.fulfill({
          status: 409,
          contentType: "application/problem+json",
          body: JSON.stringify({
            status: 409,
            title: "Claim configuration has linked products",
          }),
        });
      } else {
        deleted = true;
        await route.fulfill({ status: 204 });
      }
    } else {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: deleted ? [] : [row],
          page: 1,
          pageSize: 10,
          totalCount: deleted ? 0 : 1,
        }),
      });
    }
  });
  await page.route("**/api/claim-configuration-options/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [{ code: "AV", description: "Aviation" }],
        page: 1,
        pageSize: 10,
        totalCount: 1,
      }),
    });
  });
  await page.goto("/claim-configurations");
  return calls;
}

test("shows the prior CCM columns without Company Code and places Action last", async ({
  page,
}) => {
  await mockList(page);
  await expect(
    page.getByRole("button", { name: "Import claim configurations" }),
  ).toBeVisible();
  const headers = page.getByRole("columnheader");
  await expect(headers.nth(0)).toContainText("Claim Config Code");
  await expect(headers.nth(1)).toContainText("Name");
  await expect(headers.nth(2)).toContainText("Short Name");
  await expect(headers.nth(3)).toContainText("Module Name");
  await expect(headers.nth(5)).toContainText("Action");
  await expect(page.getByText("Aviation", { exact: true })).toBeVisible();
  await expect(page.getByText("Company Code", { exact: true })).toHaveCount(0);
});

test("filters and sorts the full CCM list and returns to page one", async ({
  page,
}) => {
  const requests: URL[] = [];
  const rows = Array.from({ length: 10 }, (_, index) => ({
    ...row,
    ccmCode: `CCM${String(index + 1).padStart(3, "0")}`,
    name: `Configuration ${index + 1}`,
  }));
  await page.route("**/api/claim-configurations**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/write-status")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          enabled: true,
          message: "Ready",
          companyCode: "ASRTEST",
        }),
      });
      return;
    }
    requests.push(url);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: rows,
        page: Number(url.searchParams.get("page") ?? 1),
        pageSize: 10,
        totalCount: 11,
      }),
    });
  });
  await page.goto("/claim-configurations");
  await expect(page.locator("tr.mat-mdc-row")).toHaveCount(10);
  expect(requests[0]?.searchParams.get("sortBy")).toBe("ccmCode");
  expect(requests[0]?.searchParams.get("sortDirection")).toBe("asc");
  await expect(page.getByRole("searchbox")).toHaveCount(0);

  await page.getByRole("button", { name: "Next page" }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.get("page")).toBe("2");
  await page
    .getByRole("textbox", { name: "Name filter", exact: true })
    .fill("config");
  await expect
    .poll(() => requests.at(-1)?.searchParams.get("name"))
    .toBe("config");
  expect(requests.at(-1)?.searchParams.get("page")).toBe("1");

  const operator = page.getByRole("combobox", {
    name: "Name filter operator",
    exact: true,
  });
  await operator.click();
  await page.getByRole("option", { name: "Not equal to" }).click();
  await page
    .getByRole("textbox", { name: "Name filter", exact: true })
    .fill("none");
  await expect
    .poll(() => requests.at(-1)?.searchParams.get("nameOperator"))
    .toBe("notEquals");

  await page.getByRole("button", { name: "Next page" }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.get("page")).toBe("2");
  const nameSort = page
    .locator("[mat-sort-header]")
    .filter({ hasText: "Name" });
  await nameSort.click();
  await expect
    .poll(() => requests.at(-1)?.searchParams.get("sortBy"))
    .toBe("name");
  expect(requests.at(-1)?.searchParams.get("page")).toBe("1");
});

test("uses unchecked N checkboxes and omits the removed helper labels on create", async ({
  page,
}) => {
  await mockList(page);
  await page.getByRole("button", { name: "Add claim configuration" }).click();

  const printBeforeApproval = page.getByRole("checkbox", {
    name: "Print Before Approval Yn",
  });
  const reprintAllowed = page.getByRole("checkbox", {
    name: "RePrint Allowed",
  });
  const claimAccounting = page.getByRole("checkbox", {
    name: "Claim Accounting Document Generation",
  });
  const coinsuranceAccounting = page.getByRole("checkbox", {
    name: "Claim Coinsurance Accounting Document Generation",
  });
  await expect(printBeforeApproval).not.toBeChecked();
  await expect(reprintAllowed).not.toBeChecked();
  await expect(claimAccounting).toBeChecked();
  await expect(coinsuranceAccounting).toBeChecked();
  await page.getByRole("button", { name: /Additional Information/ }).click();
  await expect(page.getByLabel("Arabic Name")).toBeVisible();
  await expect(
    page.getByText("1–12 letters, digits, or hyphens. Saved in uppercase."),
  ).toHaveCount(0);
  await expect(page.getByText("Required.", { exact: true })).toHaveCount(0);
});

test("deletes only after confirmation and leaves linked configurations untouched", async ({
  page,
}) => {
  const calls = await mockList(page);
  const deleteAction = page.getByRole("button", { name: "Delete CCM001" });
  await expect(deleteAction).toBeEnabled();
  await deleteAction.click();
  await page.getByRole("button", { name: "Cancel" }).click();
  expect(calls.deletes).toBe(0);

  await page.getByRole("button", { name: "Delete CCM001" }).click();
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await expect.poll(() => calls.deletes).toBe(1);
  await expect(
    page.getByText("There are no claim configurations to display."),
  ).toBeVisible();
});

test("reports linked-product conflict without deleting the CCM", async ({
  page,
}) => {
  await mockList(page, true);
  await page.getByRole("button", { name: "Delete CCM001" }).click();
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await expect(
    page.getByText(
      "Remove the linked products before deleting this claim configuration.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "CCM001", exact: true }),
  ).toBeVisible();
});
