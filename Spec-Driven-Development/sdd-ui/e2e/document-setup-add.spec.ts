import { expect, test } from '@playwright/test';

const createdRecord = {
  docCode: 'DOC-NEW',
  docName: 'New document',
  nameInArabic: null,
  docDescription: null,
  descriptionInArabic: null,
  docSetupFor: '101',
  flex1: null,
  flex2: null,
  activeYn: 'Y',
  createdBy: 'ADMIN',
  createdDate: '2026-11-02T09:30:00',
  updatedBy: null,
  updatedDate: null,
  version: 'version-1',
};

test.beforeEach(async ({ page }) => {
  await page.route('**/api/codes**', async (route) => {
    const url = new URL(route.request().url());
    expect(url.searchParams.get('codeTypeOperator')).toBe('EqualTo');
    const codeType = url.searchParams.get('codeTypeValue');
    const codesByType: Record<string, Array<Record<string, string>>> = {
      APPLICABLE_FOR: [
        { code: 'ASR', codeType: 'APPLICABLE_FOR', codeDescription: 'ASR', companyCode: '101' },
        { code: 'ASSET', codeType: 'APPLICABLE_FOR', codeDescription: 'Asset', companyCode: '101' },
        {
          code: 'FA',
          codeType: 'APPLICABLE_FOR',
          codeDescription: 'Fixed Asset',
          companyCode: '101',
        },
        {
          code: 'CUSTOM',
          codeType: 'APPLICABLE_FOR',
          codeDescription: 'Custom Applicable Type',
          companyCode: '101',
        },
      ],
      DOC_SETUP_FOR: [
        {
          code: '101',
          codeType: 'DOC_SETUP_FOR',
          codeDescription: 'File Upload',
          companyCode: '101',
        },
        {
          code: '102',
          codeType: 'DOC_SETUP_FOR',
          codeDescription: 'Doc Print',
          companyCode: '102',
        },
        {
          code: '103',
          codeType: 'DOC_SETUP_FOR',
          codeDescription: 'Electronic Archive',
          companyCode: '103',
        },
      ],
      PRODUCT: [
        {
          code: '1001',
          codeType: 'PRODUCT',
          codeDescription: 'PERSONAL LINES - MOTOR COMPREHENSIVE',
          companyCode: '101',
        },
        {
          code: '1002',
          codeType: 'PRODUCT',
          codeDescription: 'PERSONAL LINES - MOTOR THIRD PARTY',
          companyCode: '101',
        },
      ],
      PCM: [
        {
          code: '101',
          codeType: 'PCM',
          codeDescription: 'MOTOR PERSONAL LINES',
          companyCode: '101',
        },
        { code: '201', codeType: 'PCM', codeDescription: 'PROPERTY', companyCode: '101' },
      ],
      CCM: [
        { code: '101', codeType: 'CCM', codeDescription: 'MOTOR DIRECT', companyCode: '101' },
        { code: '601', codeType: 'CCM', codeDescription: 'PACKAGE POLICY', companyCode: '101' },
      ],
    };
    expect(codesByType[codeType ?? '']).toBeDefined();
    const codes = codesByType[codeType ?? ''] ?? [];
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: codes,
        page: 1,
        pageSize: 50,
        totalCount: codes.length,
      },
    });
  });
});

test('shows a breadcrumb from the draft Applicable Module form', async ({ page }) => {
  await page.goto('/document-setups/add/applicable-modules/add');

  const breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect
    .poll(() =>
      breadcrumbs
        .locator('li + li')
        .first()
        .evaluate((item) => getComputedStyle(item, '::before').content),
    )
    .toBe('">"');
  await expect(breadcrumbs.getByRole('link', { name: 'Document Setups' })).toHaveAttribute(
    'href',
    '/document-setups',
  );
  await expect(breadcrumbs.getByRole('link', { name: 'New Document Setup' })).toHaveAttribute(
    'href',
    '/document-setups/add',
  );
  await expect(breadcrumbs.locator('[aria-current="page"]')).toHaveText('Applicable Module');
});

test('loads and saves Applicable For choices from the APPLICABLE_FOR Codes Master type', async ({
  page,
}) => {
  await page.goto('/document-setups/add/applicable-modules/add');
  await page.getByRole('combobox', { name: 'Applicable For' }).click();

  await expect(page.getByRole('option', { name: 'ASR — ASR' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'ASSET — Asset' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'CUSTOM — Custom Applicable Type' })).toBeVisible();
  await page.getByRole('option', { name: 'CUSTOM — Custom Applicable Type' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/document-setups\/add$/);
  await expect(page.locator('.table-container')).toContainText('CUSTOM');
});

test('loads Product, PCM, and CCM choices and lists descriptions without codes', async ({
  page,
}) => {
  await page.goto('/document-setups/add/applicable-modules/add');
  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'FA — Fixed Asset' }).click();

  const selections: Array<[string, string]> = [
    ['Product From', '1001 — PERSONAL LINES - MOTOR COMPREHENSIVE'],
    ['Product To', '1002 — PERSONAL LINES - MOTOR THIRD PARTY'],
    ['PCM From', '101 — MOTOR PERSONAL LINES'],
    ['PCM To', '201 — PROPERTY'],
    ['CCM From', '101 — MOTOR DIRECT'],
    ['CCM To', '601 — PACKAGE POLICY'],
  ];
  for (const [field, option] of selections) {
    await page.getByRole('combobox', { name: field }).click();
    await expect(page.getByRole('option', { name: option })).toBeVisible();
    await page.getByRole('option', { name: option }).click();
  }

  await page.getByRole('button', { name: 'Save' }).click();
  const moduleRow = page.getByRole('table', { name: 'Applicable Modules' }).locator('tbody tr');
  await expect(moduleRow).toContainText('FA');
  for (const [, option] of selections) {
    await expect(moduleRow).toContainText(option.slice(option.indexOf('—') + 1).trim());
    await expect(moduleRow).not.toContainText(new RegExp(`\\b${option.split(' — ')[0]}\\b`));
  }
});

test('edits a staged Applicable Module from the Add page', async ({ page }) => {
  await page.goto('/document-setups/add');
  await page.locator('.modules-header').getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'ASSET — Asset' }).click();
  await page.getByRole('combobox', { name: 'Product From' }).click();
  await page.getByRole('option', { name: '1001 — PERSONAL LINES - MOTOR COMPREHENSIVE' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL('/document-setups/add');

  const moduleRow = page.getByRole('table', { name: 'Applicable Modules' }).locator('tbody tr');
  await expect(
    moduleRow.getByRole('button', { name: 'Applicable Module 1', exact: true }).locator('svg'),
  ).toHaveCount(1);
  await expect(
    moduleRow.getByRole('button', { name: 'Remove Applicable Module 1' }).locator('svg'),
  ).toHaveCount(1);
  await moduleRow.getByRole('button', { name: 'Applicable Module 1', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Applicable Module' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Product From' }).click();
  await page.getByRole('option', { name: '1002 — PERSONAL LINES - MOTOR THIRD PARTY' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL('/document-setups/add');
  await expect(moduleRow).toContainText('PERSONAL LINES - MOTOR THIRD PARTY');
  await expect(moduleRow).not.toContainText('PERSONAL LINES - MOTOR COMPREHENSIVE');
});

test('filters staged Applicable Modules across every displayed column', async ({ page }) => {
  await page.goto('/document-setups/add');
  await page.locator('.modules-header').getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'ASSET — Asset' }).click();
  await page.getByRole('combobox', { name: 'Product From' }).click();
  await page.getByRole('option', { name: '1001 — PERSONAL LINES - MOTOR COMPREHENSIVE' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL('/document-setups/add');

  const moduleTable = page.getByRole('table', { name: 'Applicable Modules' });
  for (const column of [
    'Applicable For',
    'Product From',
    'Product To',
    'PCM From',
    'PCM To',
    'CCM From',
    'CCM To',
  ]) {
    await expect(page.getByLabel(`Filter value for ${column}`, { exact: true })).toBeVisible();
  }
  await expect(page.getByLabel('Filter value for Mandatory', { exact: true })).toHaveCount(0);
  await expect(page.getByLabel('Filter value for Active', { exact: true })).toHaveCount(0);

  await page.getByLabel('Filter value for Product From', { exact: true }).fill('COMPREHENSIVE');
  await page.getByRole('button', { name: 'Filter Product From', exact: true }).click();
  await page.getByRole('button', { name: 'Contains', exact: true }).click();
  await page.getByRole('button', { name: 'Apply filter for Product From' }).click();

  const moduleRow = moduleTable.locator('tbody tr');
  await expect(moduleRow).toContainText('PERSONAL LINES - MOTOR COMPREHENSIVE');
  await page.getByLabel('Filter value for Product From', { exact: true }).fill('NO MATCH');
  await page.getByRole('button', { name: 'Filter Product From', exact: true }).click();
  await page.getByRole('button', { name: 'Apply filter for Product From' }).click();
  await expect(moduleRow).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText(
    'No Applicable Modules match the applied filters.',
  );
});

test('shows a breadcrumb on the Document Setup Add page', async ({ page }) => {
  await page.goto('/document-setups/add');

  const headerActions = page.locator('.page-header-actions');
  await expect(headerActions.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
  await headerActions.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page).toHaveURL('/document-setups/add/applicable-modules/add');
  await page.goto('/document-setups/add');

  const breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
  expect(
    await breadcrumbs.evaluate((element) => element.closest('.document-setup-form-page')),
  ).toBeNull();
  await expect
    .poll(() =>
      breadcrumbs
        .locator('li + li')
        .first()
        .evaluate((item) => getComputedStyle(item, '::before').content),
    )
    .toBe('">"');
  await expect(breadcrumbs.getByRole('link', { name: 'Document Setups' })).toHaveAttribute(
    'href',
    '/document-setups',
  );
  await expect(breadcrumbs.locator('[aria-current="page"]')).toHaveText('Add Document Setup');
});

test('validates required fields and resets the blank form with Active Y', async ({ page }) => {
  await page.goto('/document-setups/add');
  await expect(page.getByRole('heading', { name: 'Add Document Setup' })).toBeVisible();
  await expect(
    page.locator('.page-header-actions').getByRole('button', { name: 'Add' }),
  ).toBeVisible();
  const emptyModules = page.locator('.empty-modules');
  await expect(emptyModules).toHaveText('No Applicable Modules have been added.');
  await expect(emptyModules).toHaveCSS('text-align', 'center');
  await expect(page.getByRole('button', { name: 'More' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await expect(page.getByRole('textbox', { name: 'Name in Arabic' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Doc Code, Doc Setup For');
  await page.getByRole('button', { name: 'OK' }).click();

  await page.getByRole('textbox', { name: 'Doc Code' }).fill('UNSAVED');
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('button', { name: 'More' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('textbox', { name: 'Name in Arabic' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('textbox', { name: 'Doc Code' })).toHaveValue('');
  await expect(
    page.locator('.more-fields').getByRole('switch', { name: 'Active Y/N' }),
  ).toBeChecked();
});

test('loads Doc Setup For choices from Codes Master and stores the selected code', async ({
  page,
}) => {
  let submittedSetupFor: unknown;
  await page.route('**/api/document-setups**', async (route) => {
    if (route.request().method() === 'POST') {
      submittedSetupFor = route.request().postDataJSON()['docSetupFor'];
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        json: { ...createdRecord, docCode: 'ARCHIVE', docSetupFor: '103' },
      });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: { items: [], page: 1, pageSize: 10, totalCount: 0 },
    });
  });

  await page.goto('/document-setups/add');
  await page.getByRole('combobox', { name: 'Doc Setup For' }).click();
  await expect(page.getByRole('option', { name: '101 — File Upload' })).toBeVisible();
  await expect(page.getByRole('option', { name: '103 — Electronic Archive' })).toBeVisible();
  await page.getByRole('option', { name: '103 — Electronic Archive' }).click();
  await page.getByRole('textbox', { name: 'Doc Code' }).fill('ARCHIVE');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('dialog')).toContainText('Document setup created successfully.');
  expect(submittedSetupFor).toBe('103');
});

test('creates a parent with File Upload code, default Active Y, and prevents duplicate submits', async ({
  page,
}) => {
  let postCount = 0;
  let submittedBody: Record<string, unknown> | undefined;
  let releasePost: (() => void) | undefined;
  const postGate = new Promise<void>((resolve) => {
    releasePost = resolve;
  });
  await page.route('**/api/document-setups**', async (route) => {
    if (route.request().method() === 'POST') {
      postCount += 1;
      submittedBody = route.request().postDataJSON() as Record<string, unknown>;
      await postGate;
      await route.fulfill({ status: 201, contentType: 'application/json', json: createdRecord });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: { items: [], page: 1, pageSize: 10, totalCount: 0 },
    });
  });

  await page.goto('/document-setups/add');
  await page.getByRole('textbox', { name: 'Doc Code' }).fill('DOC-NEW');
  await page.getByRole('combobox', { name: 'Doc Setup For' }).click();
  await page.getByRole('option', { name: 'File Upload' }).click();
  await page.getByRole('button', { name: 'More' }).click();
  await expect(
    page.locator('.more-fields').getByRole('switch', { name: 'Active Y/N' }),
  ).toBeChecked();
  await page.getByRole('button', { name: 'Save' }).click();
  const saveButton = page.locator('.document-setup-form-page > form button[type="submit"]');
  await expect(saveButton).toBeDisabled();
  await saveButton.click({ force: true });
  releasePost?.();

  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Success' })).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Document setup created successfully.');
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page).toHaveURL('/document-setups/add');
  await expect(page.getByRole('heading', { name: 'Add Document Setup' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Doc Code' })).toBeDisabled();
  await expect(
    page.locator('.modules-header').getByRole('button', { name: 'Add', exact: true }),
  ).toBeEnabled();
  expect(postCount).toBe(1);
  expect(submittedBody?.['docCode']).toBe('DOC-NEW');
  expect(submittedBody?.['docSetupFor']).toBe('101');
  expect(submittedBody?.['activeYn']).toBe('Y');
});

test('stores Doc Print as 102', async ({ page }) => {
  let submittedSetupFor: unknown;
  await page.route('**/api/document-setups**', async (route) => {
    if (route.request().method() === 'POST') {
      submittedSetupFor = route.request().postDataJSON()['docSetupFor'];
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        json: { ...createdRecord, docCode: 'PRINT', docSetupFor: '102' },
      });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: { items: [], page: 1, pageSize: 10, totalCount: 0 },
    });
  });

  await page.goto('/document-setups/add');
  await page.getByRole('textbox', { name: 'Doc Code' }).fill('PRINT');
  await page.getByRole('combobox', { name: 'Doc Setup For' }).click();
  await page.getByRole('option', { name: 'Doc Print' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('dialog')).toContainText('Document setup created successfully.');
  expect(submittedSetupFor).toBe('102');
});

test('creates staged Applicable Modules and stays on the Add page', async ({ page }) => {
  let submittedModule: Record<string, unknown> | undefined;
  let parentPostCount = 0;
  let modulePostCount = 0;
  const savedModule = {
    damodUid: '987654321',
    docCode: 'DOC-NEW',
    applicableFor: 'ASSET',
    productFrom: '1001',
    productTo: '1002',
    pcmFrom: '101',
    pcmTo: '201',
    ccmFrom: '101',
    ccmTo: '601',
    mandatoryYn: 'Y',
    activeYn: 'Y',
    createdBy: 'ADMIN',
    createdDate: '2026-11-02T09:30:00',
    updatedBy: null,
    updatedDate: null,
    version: 'module-version-1',
  };

  await page.route('**/api/document-setups**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    if (request.method() === 'POST' && path === '/api/document-setups') {
      parentPostCount += 1;
      await route.fulfill({ status: 201, contentType: 'application/json', json: createdRecord });
      return;
    }

    if (request.method() === 'POST' && path.endsWith('/applicable-modules')) {
      modulePostCount += 1;
      submittedModule = request.postDataJSON() as Record<string, unknown>;
      if (modulePostCount === 1) {
        await route.fulfill({
          status: 500,
          contentType: 'application/problem+json',
          json: { title: 'Unable to save module' },
        });
        return;
      }
      await route.fulfill({ status: 201, contentType: 'application/json', json: savedModule });
      return;
    }

    if (request.method() === 'GET' && path === '/api/document-setups/DOC-NEW') {
      await route.fulfill({ contentType: 'application/json', json: createdRecord });
      return;
    }

    if (request.method() === 'GET' && path.endsWith('/applicable-modules')) {
      await route.fulfill({
        contentType: 'application/json',
        json: { items: [savedModule], page: 1, pageSize: 10, totalCount: 1 },
      });
      return;
    }

    await route.fulfill({ status: 404 });
  });

  await page.goto('/document-setups/add');
  await page.getByRole('textbox', { name: 'Doc Code' }).fill('DOC-NEW');
  await page.getByRole('combobox', { name: 'Doc Setup For' }).click();
  await page.getByRole('option', { name: 'File Upload' }).click();

  const addModuleButton = page
    .locator('.modules-header')
    .getByRole('button', { name: 'Add', exact: true });
  await expect(addModuleButton).toBeVisible();
  await addModuleButton.click();
  await expect(page).toHaveURL('/document-setups/add/applicable-modules/add');
  await expect(page.getByRole('heading', { name: 'Applicable Module' })).toBeVisible();
  await expect(page.locator('strong').filter({ hasText: 'New Document Setup' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'ASSET — Asset' }).click();
  await page.getByRole('combobox', { name: 'Product From' }).click();
  await page.getByRole('option', { name: '1001 — PERSONAL LINES - MOTOR COMPREHENSIVE' }).click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('combobox', { name: 'Product From' })).toHaveCount(0);
  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'ASSET — Asset' }).click();
  await page.getByRole('combobox', { name: 'Product From' }).click();
  await page.getByRole('option', { name: '1001 — PERSONAL LINES - MOTOR COMPREHENSIVE' }).click();
  await page.getByRole('combobox', { name: 'Product To' }).click();
  await page.getByRole('option', { name: '1002 — PERSONAL LINES - MOTOR THIRD PARTY' }).click();
  await page.getByRole('combobox', { name: 'PCM From' }).click();
  await page.getByRole('option', { name: '101 — MOTOR PERSONAL LINES' }).click();
  await page.getByRole('combobox', { name: 'PCM To' }).click();
  await page.getByRole('option', { name: '201 — PROPERTY' }).click();
  await page.getByRole('combobox', { name: 'CCM From' }).click();
  await page.getByRole('option', { name: '101 — MOTOR DIRECT' }).click();
  await page.getByRole('combobox', { name: 'CCM To' }).click();
  await page.getByRole('option', { name: '601 — PACKAGE POLICY' }).click();
  await page.getByRole('switch', { name: 'Mandatory Y/N' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL('/document-setups/add');
  await expect(page.getByRole('textbox', { name: 'Doc Code' })).toHaveValue('DOC-NEW');

  const pendingTable = page.getByRole('table', { name: 'Applicable Modules' });
  const pendingRow = pendingTable.locator('tbody tr');
  await expect(pendingRow).toContainText('ASSET');
  await expect(pendingRow).toContainText('PERSONAL LINES - MOTOR COMPREHENSIVE');
  await expect(pendingRow).toContainText('PERSONAL LINES - MOTOR THIRD PARTY');
  await expect(pendingRow).toContainText('MOTOR PERSONAL LINES');
  await expect(pendingRow).toContainText('PROPERTY');
  await expect(pendingRow).toContainText('MOTOR DIRECT');
  await expect(pendingRow).toContainText('PACKAGE POLICY');
  await expect(pendingRow).not.toContainText('1001');
  await expect(pendingRow).not.toContainText('1002');
  await expect(pendingRow).not.toContainText('101');
  await expect(pendingRow).not.toContainText('201');
  await expect(pendingRow).not.toContainText('601');
  await expect(pendingRow).toContainText('Y');
  await page.getByRole('button', { name: 'Save', exact: true }).click();

  await expect(page.getByRole('alert')).toContainText(
    'The document setup was created, but an Applicable Module could not be saved.',
  );
  await page.getByRole('button', { name: 'Save Applicable Modules' }).click();
  await expect(page.getByRole('dialog')).toContainText('Applicable Modules created successfully.');
  await page.getByRole('dialog').getByRole('button', { name: 'OK' }).click();
  await expect(page).toHaveURL('/document-setups/add');
  await expect(
    page.getByRole('table', { name: 'Applicable Modules' }).getByText('Saved'),
  ).toBeVisible();
  expect(parentPostCount).toBe(1);
  expect(modulePostCount).toBe(2);
  expect(submittedModule).toEqual({
    applicableFor: 'ASSET',
    productFrom: '1001',
    productTo: '1002',
    pcmFrom: '101',
    pcmTo: '201',
    ccmFrom: '101',
    ccmTo: '601',
    mandatoryYn: 'Y',
    activeYn: 'Y',
  });
  const moduleRow = page.getByRole('table', { name: 'Applicable Modules' }).getByRole('row', {
    name: /ASSET/,
  });
  await expect(moduleRow).toContainText('ASSET');
  await expect(moduleRow).toContainText('PERSONAL LINES - MOTOR COMPREHENSIVE');
  await expect(moduleRow).toContainText('PERSONAL LINES - MOTOR THIRD PARTY');
  await expect(moduleRow).toContainText('MOTOR PERSONAL LINES');
  await expect(moduleRow).toContainText('PROPERTY');
  await expect(moduleRow).toContainText('MOTOR DIRECT');
  await expect(moduleRow).toContainText('PACKAGE POLICY');
  await expect(moduleRow).not.toContainText('1001');
  await expect(moduleRow).not.toContainText('1002');
  await expect(moduleRow).not.toContainText('101');
  await expect(moduleRow).not.toContainText('201');
  await expect(moduleRow).not.toContainText('601');
  await expect(moduleRow).toContainText('Y');

  await page.goto('/document-setups/DOC-NEW/edit');
  const savedModuleRow = page
    .getByRole('table', { name: 'Applicable Modules' })
    .getByRole('row', { name: /ASSET/ });
  await expect(savedModuleRow).toContainText('PERSONAL LINES - MOTOR COMPREHENSIVE');
  await expect(savedModuleRow).toContainText('PERSONAL LINES - MOTOR THIRD PARTY');
  await expect(savedModuleRow).toContainText('MOTOR PERSONAL LINES');
  await expect(savedModuleRow).toContainText('PROPERTY');
  await expect(savedModuleRow).toContainText('MOTOR DIRECT');
  await expect(savedModuleRow).toContainText('PACKAGE POLICY');
  await expect(savedModuleRow).not.toContainText('1001');
});
