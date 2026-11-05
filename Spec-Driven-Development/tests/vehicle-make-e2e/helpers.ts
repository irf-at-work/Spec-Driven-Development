import { APIRequestContext, Page } from "@playwright/test";

// Must match API_BASE_URL_VALUE in sdd-ui/src/app/core/app-config.ts, because the browser calls the API at that address.
export const apiUrl = process.env["SDD_API_URL"] ?? "http://localhost:5114";

export interface NewMake {
  readonly makeCode: string;
  readonly makeName: string;
  readonly shortName: string;
  readonly active?: boolean;
}

// "ZT" plus ten hex characters: exactly the 12 a code may have, and easy to recognise as test data.
export function newMakeCode(): string {
  return `ZT${Math.random().toString(16).slice(2, 12).padEnd(10, "0")}`.toUpperCase();
}

// Test data is created and removed through the application's own API, so no one touches the database directly.
export async function createMakeThroughApi(
  request: APIRequestContext,
  make: NewMake,
): Promise<void> {
  const response = await request.post(`${apiUrl}/api/vehicle-makes`, {
    data: make,
  });
  if (!response.ok()) {
    throw new Error(
      `Could not create test make ${make.makeCode}: status ${response.status()}.`,
    );
  }
}

// A "not found" answer is fine here: the test may already have deleted the make itself.
export async function removeMakeThroughApi(
  request: APIRequestContext,
  makeCode: string,
): Promise<void> {
  await request.delete(`${apiUrl}/api/vehicle-makes/${makeCode}`);
}

export async function filterByCode(page: Page, text: string): Promise<void> {
  // The placeholder is also set on the <app-column-filter> wrapper, so aim at the real input inside it.
  await page
    .locator('app-column-filter input[placeholder="Code..."]')
    .first()
    .fill(text);
}

// Backwards-compatible alias for existing tests
export async function searchFor(page: Page, text: string): Promise<void> {
  await filterByCode(page, text);
}

export async function openMake(page: Page, makeCode: string): Promise<void> {
  await page.goto("/vehicle-makes");
  await filterByCode(page, makeCode);
  await page
    .getByRole("button", { name: `Open ${makeCode}`, exact: true })
    .click();
}
