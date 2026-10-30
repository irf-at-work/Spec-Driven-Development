import { expect, test } from '@playwright/test';

const createdRecord = {
  code: 'NEW',
  codeType: 'GENERAL',
  companyCode: 'NEW',
  codeDescription: 'New code',
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

test('shows fields in order and preserves More values while collapsed', async ({ page }) => {
  await page.goto('/codes/add');

  await expect(page.getByRole('heading', { name: 'Codes Master' })).toBeVisible();
  await expect(page.locator('mat-form-field mat-label')).toHaveText([
    'Code',
    'Code Type',
    'Code Description',
    'Short Description',
    'Long Description',
    'Value 1',
    'Value 2',
    'Flex 1',
    'Flex 2',
  ]);
  await expect(page.getByLabel('Desc In Arabic')).toHaveCount(0);

  await page.getByRole('textbox', { name: 'Code', exact: true }).fill('NEW');
  await page.getByRole('textbox', { name: 'Code Type', exact: true }).fill('GENERAL');
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole('textbox', { name: 'Desc In Arabic', exact: true }).fill('وصف');
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('textbox', { name: 'Desc In Arabic', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('textbox', { name: 'Desc In Arabic', exact: true })).toHaveValue(
    'وصف',
  );
});

test('validates required fields before sending a create request', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/codes**', async (route) => {
    requests++;
    await route.fulfill({ status: 201, json: createdRecord });
  });

  await page.goto('/codes/add');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('This field is required.')).toHaveCount(2);
  expect(requests).toBe(0);
});

test('shows server byte validation errors next to the affected field', async ({ page }) => {
  await page.route('**/api/codes**', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/problem+json',
      json: {
        title: 'The submitted code is not valid.',
        errors: { codeDescription: ['This field cannot exceed 100 bytes.'] },
      },
    });
  });

  await page.goto('/codes/add');
  await page.getByRole('textbox', { name: 'Code', exact: true }).fill('NEW');
  await page.getByRole('textbox', { name: 'Code Type', exact: true }).fill('GENERAL');
  await page.getByRole('textbox', { name: 'Code Description', exact: true }).fill('A'.repeat(101));
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('alert')).toContainText('Please correct the highlighted fields.');
  await expect(page.getByText('This field cannot exceed 100 bytes.')).toBeVisible();
});

test('shows duplicate feedback and does not leave the Add page', async ({ page }) => {
  await page.route('**/api/codes**', async (route) => {
    await route.fulfill({
      status: 409,
      contentType: 'application/problem+json',
      json: { title: 'This code already exists.', status: 409 },
    });
  });

  await page.goto('/codes/add');
  await page.getByRole('textbox', { name: 'Code', exact: true }).fill('DUP');
  await page.getByRole('textbox', { name: 'Code Type', exact: true }).fill('GENERAL');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('alert')).toContainText(
    'A record with the same Code and Code Type already exists.',
  );
  await expect(page.getByRole('heading', { name: 'Codes Master' })).toBeVisible();
});

test('guards repeated submission and returns to the listing with success feedback', async ({
  page,
}) => {
  let requests = 0;
  await page.route('**/api/codes**', async (route) => {
    if (route.request().method() === 'POST') {
      requests++;
      await new Promise((resolve) => setTimeout(resolve, 150));
      await route.fulfill({ status: 201, contentType: 'application/json', json: createdRecord });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: { items: [createdRecord], page: 1, pageSize: 10, totalCount: 1 },
    });
  });

  await page.goto('/codes/add');
  await page.getByRole('textbox', { name: 'Code', exact: true }).fill('NEW');
  await page.getByRole('textbox', { name: 'Code Type', exact: true }).fill('GENERAL');
  await page.getByRole('button', { name: 'Add', exact: true }).click();

  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
  await expect(page.getByRole('heading', { name: 'Codes Master' })).toBeVisible();
  await expect(page.locator('.success-message')).toContainText('Code created successfully.');
  expect(requests).toBe(1);
});

test('asks before discarding unsaved changes', async ({ page }) => {
  await page.goto('/codes/add');
  await page.getByRole('textbox', { name: 'Code', exact: true }).fill('DRAFT');
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: 'Cancel' }).click();

  await expect(page.getByRole('heading', { name: ' Codes Master' })).toBeVisible();
});
