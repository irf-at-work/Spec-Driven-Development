import { expect, test } from '@playwright/test';

const record = {
  code: 'DELETE-ME',
  codeType: 'GENERAL',
  companyCode: 'DELETE-ME',
  codeDescription: 'Delete test record',
  shortDescription: null,
  longDescription: null,
  value1: null,
  value2: null,
  flex1: null,
  flex2: null,
  descriptionInArabic: null,
  shortDescriptionInArabic: null,
  longDescriptionInArabic: null,
  activeYn: null,
  createdBy: 'ADMIN',
  createdDate: '2025-01-15T00:00:00',
};

test('requires confirmation containing both key values and removes only after success', async ({
  page,
}) => {
  let deleted = false;
  await page.route('**/api/codes**', async (route) => {
    if (route.request().method() === 'DELETE') {
      deleted = true;
      await route.fulfill({ status: 204 });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: deleted ? [] : [record],
        page: 1,
        pageSize: 10,
        totalCount: deleted ? 0 : 1,
      },
    });
  });

  await page.goto('/codes');
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('DELETE-ME');
    expect(dialog.message()).toContain('GENERAL');
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'Delete DELETE-ME (GENERAL)' }).click();

  await expect(
    page.getByRole('status').filter({ hasText: 'Code deleted successfully.' }),
  ).toBeVisible();
  await expect(page.getByText('No codes are available.')).toBeVisible();
  await expect(page.getByRole('row')).toHaveCount(0);
});

test('cancelling confirmation makes no delete request', async ({ page }) => {
  let deleteRequests = 0;
  await page.route('**/api/codes**', async (route) => {
    if (route.request().method() === 'DELETE') {
      deleteRequests++;
    }
    await route.fulfill({
      contentType: 'application/json',
      json: { items: [record], page: 1, pageSize: 10, totalCount: 1 },
    });
  });

  await page.goto('/codes');
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: 'Delete DELETE-ME (GENERAL)' }).click();

  await expect(page.getByRole('cell', { name: 'DELETE-ME', exact: true })).toBeVisible();
  expect(deleteRequests).toBe(0);
});

test('keeps the row and shows safe constraint feedback when deletion fails', async ({ page }) => {
  await page.route('**/api/codes**', async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({
        status: 409,
        contentType: 'application/problem+json',
        json: { title: 'The code could not be deleted.', detail: 'Database constraint details.' },
      });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: { items: [record], page: 1, pageSize: 10, totalCount: 1 },
    });
  });

  await page.goto('/codes');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete DELETE-ME (GENERAL)' }).click();

  await expect(page.getByRole('alert')).toContainText(
    'This code cannot be deleted because another record depends on it.',
  );
  await expect(page.getByText('Database constraint details.')).toHaveCount(0);
  await expect(page.getByRole('cell', { name: 'DELETE-ME', exact: true })).toBeVisible();
});
