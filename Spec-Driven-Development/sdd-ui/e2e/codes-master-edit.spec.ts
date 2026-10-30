import { expect, test } from '@playwright/test';

const editRecord = {
  code: 'EDIT',
  codeType: 'GENERAL',
  companyCode: 'EDIT',
  codeDescription: 'Original description',
  shortDescription: 'Short',
  longDescription: null,
  value1: 'One',
  value2: null,
  flex1: null,
  flex2: null,
  descriptionInArabic: 'وصف',
  shortDescriptionInArabic: null,
  longDescriptionInArabic: null,
  activeYn: null,
  createdBy: 'ADMIN',
  createdDate: '2025-01-15T00:00:00',
};

test('loads by both key values, keeps identity immutable, and updates the record', async ({
  page,
}) => {
  let updateBody: Record<string, unknown> | undefined;
  await page.route('**/api/codes/record**', async (route) => {
    if (route.request().method() === 'GET') {
      const url = new URL(route.request().url());
      expect(url.searchParams.get('code')).toBe('EDIT');
      expect(url.searchParams.get('codeType')).toBe('GENERAL');
      await route.fulfill({ contentType: 'application/json', json: editRecord });
      return;
    }

    updateBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      contentType: 'application/json',
      json: { ...editRecord, codeDescription: 'Updated description' },
    });
  });
  await page.route('**/api/codes**', async (route) => {
    if (new URL(route.request().url()).pathname.endsWith('/record')) {
      await route.fallback();
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: { items: [editRecord], page: 1, pageSize: 10, totalCount: 1 },
    });
  });

  await page.goto('/codes/edit?code=EDIT&codeType=GENERAL');
  await expect(page.getByRole('textbox', { name: 'Code', exact: true })).toHaveValue('EDIT');
  await expect(page.getByRole('textbox', { name: 'Code', exact: true })).toHaveAttribute(
    'readonly',
    'true',
  );
  await expect(page.getByRole('textbox', { name: 'Code Type', exact: true })).toHaveValue(
    'GENERAL',
  );
  await expect(page.getByRole('textbox', { name: 'Code Type', exact: true })).toHaveAttribute(
    'readonly',
    'true',
  );
  await expect(page.getByRole('textbox', { name: 'Code Description', exact: true })).toHaveValue(
    'Original description',
  );

  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('textbox', { name: 'Desc In Arabic', exact: true })).toHaveValue(
    'وصف',
  );
  await page
    .getByRole('textbox', { name: 'Code Description', exact: true })
    .fill('Updated description');
  await page.getByRole('button', { name: 'Save' }).first().click();

  await expect(page.getByRole('heading', { name: 'Codes Master' })).toBeVisible();
  await expect(page.locator('.success-message')).toContainText('Code updated successfully.');
  expect(updateBody?.['code']).toBe('EDIT');
  expect(updateBody?.['codeType']).toBe('GENERAL');
  expect(updateBody?.['codeDescription']).toBe('Updated description');
});

test('shows a safe missing-record error', async ({ page }) => {
  await page.route('**/api/codes/record**', async (route) => {
    await route.fulfill({
      status: 404,
      contentType: 'application/problem+json',
      json: { title: 'The code could not be found.', detail: 'Internal database details.' },
    });
  });

  await page.goto('/codes/edit?code=MISSING&codeType=GENERAL');

  await expect(page.getByRole('alert')).toContainText(
    'The code could not be found. Return to the listing and try again.',
  );
  await expect(page.getByText('Internal database details.')).toHaveCount(0);
});

test('asks before leaving an edited record with unsaved changes', async ({ page }) => {
  await page.route('**/api/codes/record**', async (route) => {
    await route.fulfill({ contentType: 'application/json', json: editRecord });
  });

  await page.goto('/codes/edit?code=EDIT&codeType=GENERAL');
  await page.getByRole('textbox', { name: 'Code Description', exact: true }).fill('Draft change');
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: 'Cancel' }).click();

  await expect(page.getByRole('heading', { name: 'Edit Codes Master' })).toBeVisible();
});
