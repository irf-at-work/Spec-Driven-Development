import { expect, test } from '@playwright/test';

function createRecords(start: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const number = start + index;
    return {
      code: `CODE-${number}`,
      codeType: 'GENERAL',
      companyCode: `CODE-${number}`,
      codeDescription: `Description ${number}`,
      shortDescription: `Short ${number}`,
      longDescription: null,
      value1: `Value ${number}`,
      value2: null,
      flex1: null,
      flex2: null,
      descriptionInArabic: null,
      shortDescriptionInArabic: null,
      longDescriptionInArabic: null,
      activeYn: 'Y',
      createdBy: 'ADMIN',
      createdDate: '2025-01-15T00:00:00Z',
    };
  });
}

test('navigates to Codes Master, displays the required columns, and paginates ten records', async ({
  page,
}) => {
  await page.route('**/api/codes**', async (route) => {
    const requestedPage = Number(new URL(route.request().url()).searchParams.get('page') ?? 1);
    const records = requestedPage === 1 ? createRecords(1, 10) : createRecords(11, 2);
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: records,
        page: requestedPage,
        pageSize: 10,
        totalCount: 12,
      },
    });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Codes Master' }).click();

  const headers = page.getByRole('columnheader');
  await expect(headers).toHaveText([
    'Code',
    'Code Description',
    'Type',
    'Value 1',
    'Value 2',
    'Actions',
  ]);
  await expect(page.getByRole('row')).toHaveCount(11);

  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByRole('cell', { name: 'CODE-11', exact: true })).toBeVisible();
});

test('distinguishes an empty listing from an error', async ({ page }) => {
  await page.route('**/api/codes**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { items: [], page: 1, pageSize: 10, totalCount: 0 },
    });
  });

  await page.goto('/codes');
  await expect(page.getByRole('status')).toContainText('No codes are available.');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('shows a retrieval error instead of an empty result', async ({ page }) => {
  await page.route('**/api/codes**', async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'application/problem+json',
      json: {
        title: 'The codes could not be loaded.',
        status: 503,
        detail: 'Please try again.',
      },
    });
  });

  await page.goto('/codes');
  await expect(page.getByRole('alert')).toContainText('The codes could not be loaded.');
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('shows creation audit details when its row control receives keyboard focus', async ({
  page,
}) => {
  await page.route('**/api/codes**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: createRecords(1, 1),
        page: 1,
        pageSize: 10,
        totalCount: 1,
      },
    });
  });

  await page.goto('/codes');
  await page.getByRole('button', { name: 'Creation audit for CODE-1' }).focus();
  await expect(page.getByRole('tooltip')).toContainText('Created By: ADMIN');
  await expect(page.getByRole('tooltip')).toContainText('15-Jan-2025');
});

test('shows NULL creation audit values as not recorded after pointer activation', async ({
  page,
}) => {
  const record = {
    ...createRecords(1, 1)[0],
    createdBy: null,
    createdDate: null,
  };
  await page.route('**/api/codes**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { items: [record], page: 1, pageSize: 10, totalCount: 1 },
    });
  });

  await page.goto('/codes');
  await page.getByRole('button', { name: 'Creation audit for CODE-1' }).click();

  await expect(page.getByRole('tooltip')).toContainText('Created By: Not recorded');
  await expect(page.getByRole('tooltip')).toContainText('Created Date: Not recorded');
});
