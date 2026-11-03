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
  await expect(page.locator('.form-page')).toHaveCSS('background-color', 'rgb(255, 253, 251)');
  await expect(page.locator('.form-card')).toHaveCSS('padding', '0px');
  await expect(page.locator('.form-card')).toHaveCSS('border-width', '0px');
  await expect(page.locator('.primary-fields')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('.primary-fields')).toHaveCSS('border-width', '0px');
  const firstField = await page.locator('.form-grid > mat-form-field').nth(0).boundingBox();
  const secondField = await page.locator('.form-grid > mat-form-field').nth(1).boundingBox();
  expect(firstField).not.toBeNull();
  expect(secondField).not.toBeNull();
  expect(Math.abs(firstField!.width - secondField!.width)).toBeLessThan(2);
  const flex1Field = await page.getByRole('textbox', { name: 'Flex 1' }).boundingBox();
  const flex2Field = await page.getByRole('textbox', { name: 'Flex 2' }).boundingBox();
  expect(flex1Field).not.toBeNull();
  expect(flex2Field).not.toBeNull();
  expect(Math.abs(flex1Field!.width - flex2Field!.width)).toBeLessThan(2);
  expect(Math.abs(flex1Field!.height - flex2Field!.height)).toBeLessThan(2);
  await expect(page.locator('.page-header-actions')).toHaveText(/Add\s*Back/);
  await expect(page.locator('.form-actions')).toHaveCSS('justify-content', 'center');
  await expect(page.locator('.form-actions').getByRole('button')).toHaveText(['Save', 'Cancel']);
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
  await expect(page.getByRole('button', { name: 'Back' })).toHaveCount(1);
  await expect(page.locator('mat-form-field mat-hint')).toHaveCount(0);
  await expect(page.getByLabel('Desc In Arabic')).toHaveCount(0);

  await page.getByRole('textbox', { name: 'Code', exact: true }).fill('NEW');
  await page.getByRole('textbox', { name: 'Code Type', exact: true }).fill('GENERAL');
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.locator('.more-fields')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('.more-fields')).toHaveCSS('border-width', '0px');
  await expect(page.getByRole('switch', { name: 'Active Y/N' })).toBeChecked();
  await page.getByRole('textbox', { name: 'Desc In Arabic', exact: true }).fill('وصف');
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('textbox', { name: 'Desc In Arabic', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('textbox', { name: 'Desc In Arabic', exact: true })).toHaveValue(
    'وصف',
  );
  await expect(page.getByRole('textbox', { name: 'Desc In Arabic', exact: true })).toHaveCSS(
    'text-align',
    'right',
  );
  await expect(
    page.getByRole('textbox', { name: 'Short Desc In Arabic', exact: true }),
  ).toHaveAttribute('dir', 'rtl');
  await expect(
    page.getByRole('textbox', { name: 'Long Description In Arabic', exact: true }),
  ).toHaveCSS('text-align', 'right');
});

test('shows the Codes Master Add breadcrumb with a greater-than separator', async ({ page }) => {
  await page.goto('/codes/add');

  const breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
  expect(await breadcrumbs.evaluate((element) => element.closest('.form-page'))).toBeNull();
  await expect(breadcrumbs.getByRole('link', { name: 'Codes Master' })).toHaveAttribute(
    'href',
    '/codes',
  );
  await expect(breadcrumbs.locator('[aria-current="page"]')).toHaveText('Add Code');
  await expect
    .poll(() =>
      breadcrumbs.locator('li + li').evaluate((item) => getComputedStyle(item, '::before').content),
    )
    .toBe('">"');
});

test('keeps the Add form readable and free of horizontal overflow on small screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/codes/add');

  const formPage = page.locator('.form-page');
  await expect(formPage).toBeVisible();
  await expect(formPage.locator('.form-card')).toBeVisible();
  const pageDimensions = await formPage.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(pageDimensions.scrollWidth).toBeLessThanOrEqual(pageDimensions.clientWidth);

  const gridColumns = await formPage
    .locator('.form-grid')
    .first()
    .evaluate((element) => {
      return getComputedStyle(element).gridTemplateColumns.split(' ').length;
    });
  expect(gridColumns).toBe(1);
});

test('fills short description from code description up to 30 characters', async ({ page }) => {
  await page.goto('/codes/add');
  const description = 'A code description that is longer than thirty characters';
  await page.getByRole('textbox', { name: 'Code Description', exact: true }).fill(description);

  const shortDescription = page.getByRole('textbox', { name: 'Short Description', exact: true });
  await expect(shortDescription).toHaveValue(description.slice(0, 30));

  await shortDescription.fill('Manual short description');
  await page.getByRole('textbox', { name: 'Code Description', exact: true }).fill('Changed');
  await expect(shortDescription).toHaveValue('Manual short description');
});

test('submits the default active toggle as Y and an unchecked toggle as N', async ({ page }) => {
  const submittedValues: unknown[] = [];
  await page.route('**/api/codes**', async (route) => {
    if (route.request().method() === 'POST') {
      submittedValues.push(route.request().postDataJSON()['activeYn']);
      await route.fulfill({ status: 201, contentType: 'application/json', json: createdRecord });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: { items: [createdRecord], page: 1, pageSize: 10, totalCount: 1 },
    });
  });

  await page.goto('/codes/add');
  await page.getByRole('button', { name: 'More' }).click();
  const activeToggle = page.getByRole('switch', { name: 'Active Y/N' });
  await expect(activeToggle).toBeChecked();
  await page.getByRole('textbox', { name: 'Code', exact: true }).fill('NEW');
  await page.getByRole('textbox', { name: 'Code Type', exact: true }).fill('GENERAL');
  await page
    .getByRole('textbox', { name: 'Code Description', exact: true })
    .fill('New description');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect.poll(() => submittedValues.length).toBe(1);
  expect(submittedValues[0]).toBe('Y');
  await expect(page.locator('.swal2-popup')).toContainText('Code created successfully.');
  await page.getByRole('button', { name: 'OK' }).click();

  await page.goto('/codes/add');
  await page.getByRole('button', { name: 'More' }).click();
  const uncheckedToggle = page.getByRole('switch', { name: 'Active Y/N' });
  await expect(uncheckedToggle).toBeChecked();
  await uncheckedToggle.click();
  await expect(uncheckedToggle).not.toBeChecked();
  await page.getByRole('textbox', { name: 'Code', exact: true }).fill('NEW2');
  await page.getByRole('textbox', { name: 'Code Type', exact: true }).fill('GENERAL');
  await page
    .getByRole('textbox', { name: 'Code Description', exact: true })
    .fill('New description');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect.poll(() => submittedValues.length).toBe(2);
  expect(submittedValues[1]).toBe('N');
  await expect(page.locator('.swal2-popup')).toContainText('Code created successfully.');
});

test('validates required fields before sending a create request', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/codes**', async (route) => {
    requests++;
    await route.fulfill({ status: 201, json: createdRecord });
  });

  await page.goto('/codes/add');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.locator('.swal2-popup')).toContainText(
    'Code, Code Type, Code Description are required.',
  );
  await page.locator('.swal2-confirm').click();
  await expect(page.getByText('This field is required.')).toHaveCount(3);
  expect(requests).toBe(0);
});

test('Add on the Add page starts a fresh form without submitting it', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/codes**', async (route) => {
    if (route.request().method() === 'POST') {
      requests++;
    }
    await route.fulfill({
      contentType: 'application/json',
      json: { items: [], page: 1, pageSize: 10, totalCount: 0 },
    });
  });

  await page.goto('/codes');
  await page.getByRole('link', { name: 'Add' }).click();
  await expect(page).toHaveURL(/\/codes\/add$/);
  await page.getByRole('textbox', { name: 'Code', exact: true }).fill('NEW');
  await page.getByRole('textbox', { name: 'Code Type', exact: true }).fill('GENERAL');
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole('textbox', { name: 'Desc In Arabic', exact: true }).fill('وصف');
  await page.locator('.page-header-actions').getByRole('button', { name: 'Add' }).click();

  await expect(page.getByRole('heading', { name: 'Codes Master' })).toBeVisible();
  await expect(page).toHaveURL(/\/codes\/add$/);
  await expect(page.getByRole('textbox', { name: 'Code', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'Code Type', exact: true })).toHaveValue('');
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('switch', { name: 'Active Y/N' })).toBeChecked();
  await expect(page.getByRole('textbox', { name: 'Desc In Arabic', exact: true })).toHaveValue('');
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
  await page.getByRole('textbox', { name: 'Code Description', exact: true }).fill('Duplicate');
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
  await page.getByRole('textbox', { name: 'Code Description', exact: true }).fill('New code');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
  await expect(page.getByRole('heading', { name: 'Codes Master' })).toBeVisible();
  await expect(page.locator('.swal2-popup')).toContainText('Code created successfully.');
  expect(requests).toBe(1);
});

test('resets the Add form when Cancel is clicked', async ({ page }) => {
  await page.goto('/codes/add');
  await page.getByRole('textbox', { name: 'Code', exact: true }).fill('DRAFT');
  await page
    .getByRole('textbox', { name: 'Code Description', exact: true })
    .fill('Draft description');
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole('textbox', { name: 'Desc In Arabic', exact: true }).fill('وصف');

  await page.getByRole('button', { name: 'Cancel' }).click();

  await expect(page).toHaveURL(/\/codes\/add$/);
  await expect(page.getByRole('textbox', { name: 'Code', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'Code Description', exact: true })).toHaveValue(
    '',
  );
  await expect(page.getByRole('button', { name: 'More' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await page.getByRole('textbox', { name: 'Code Description', exact: true }).fill('Fresh');
  await expect(page.getByRole('textbox', { name: 'Short Description', exact: true })).toHaveValue(
    'Fresh',
  );
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('switch', { name: 'Active Y/N' })).toBeChecked();
  await expect(page.getByRole('textbox', { name: 'Desc In Arabic', exact: true })).toHaveValue('');
});
