import {
  expect,
  test,
} from "../../sdd-ui/node_modules/@playwright/test/index.js";
import type { Page } from "../../sdd-ui/node_modules/@playwright/test/index.js";

const item = {
  codeType: "CALC01",
  codeTypeDescription: "Calculation",
  code: "ZT1000000001",
  companyCode: "ZC2000000001",
  name: "Premium Cover",
  shortName: "Cover",
  active: true,
};

async function mockDelete(
  page: Page,
  missing = false,
): Promise<{ count: number }> {
  const calls = { count: 0 };
  await page.route("**/api/premium-adjustments**", async (route) => {
    if (route.request().method() === "DELETE") {
      calls.count += 1;
      if (missing) {
        await route.fulfill({
          status: 404,
          contentType: "application/problem+json",
          body: JSON.stringify({
            status: 404,
            detail: "Do not expose this raw detail.",
          }),
        });
      } else {
        await route.fulfill({ status: 204 });
      }
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [item],
        page: 1,
        pageSize: 10,
        totalCount: 1,
      }),
    });
  });
  await page.goto("/premium-adjustments");
  return calls;
}

test("cancelling permanent deletion leaves the row untouched", async ({
  page,
}) => {
  const requests = await mockDelete(page);
  await page.getByRole("button", { name: `Delete ${item.code}` }).click();
  await expect(
    page.getByRole("dialog", { name: "Delete premium adjustment?" }),
  ).toBeVisible();
  await expect(page.getByText(/permanent and cannot be undone/i)).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  expect(requests.count).toBe(0);
  await expect(
    page.getByRole("cell", { name: item.code, exact: true }),
  ).toBeVisible();
});

test("confirmation deletes the row and a missing record gets a safe message", async ({
  page,
}) => {
  const requests = await mockDelete(page);
  await page.getByRole("button", { name: `Delete ${item.code}` }).click();
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await expect.poll(() => requests.count).toBe(1);
  await expect(page.getByText("Premium adjustment deleted.")).toBeVisible();

  await page.goto("/premium-adjustments");
  await page.route("**/api/premium-adjustments**", async (route) => {
    if (route.request().method() === "DELETE") {
      await route.fulfill({
        status: 404,
        contentType: "application/problem+json",
        body: JSON.stringify({
          status: 404,
          detail: "Do not expose this raw detail.",
        }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [item],
        page: 1,
        pageSize: 10,
        totalCount: 1,
      }),
    });
  });
  await page.getByRole("button", { name: `Delete ${item.code}` }).click();
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await expect(page.getByText(/already deleted/i)).toBeVisible();
  await expect(page.getByText("Do not expose this raw detail.")).toHaveCount(0);
});
