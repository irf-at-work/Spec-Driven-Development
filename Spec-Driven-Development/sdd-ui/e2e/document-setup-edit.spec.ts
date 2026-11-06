import { expect, test, type Page } from '@playwright/test';

const parent = {
  docCode: 'DOC-EDIT',
  docName: 'Existing document',
  nameInArabic: null,
  docDescription: 'Existing description',
  descriptionInArabic: null,
  docSetupFor: '101',
  flex1: null,
  flex2: null,
  activeYn: 'Y',
  createdBy: 'ADMIN',
  createdDate: '2026-11-02T09:30:00',
  updatedBy: null,
  updatedDate: null,
  version: 'parent-version-1',
};

const assetModule = {
  damodUid: '98765432109876543',
  applicableFor: 'ASSET',
  productFrom: '1001',
  productTo: '1002',
  pcmFrom: '101',
  pcmTo: '201',
  ccmFrom: '101',
  ccmTo: '601',
  mandatoryYn: 'N',
  activeYn: 'Y',
  version: 'module-version-1',
};

function listResult(items: unknown[] = []) {
  return { items, page: 1, pageSize: 10, totalCount: items.length };
}

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
          code: 'POLICY',
          codeType: 'APPLICABLE_FOR',
          codeDescription: 'Policy',
          companyCode: '101',
        },
        {
          code: 'CLAIM',
          codeType: 'APPLICABLE_FOR',
          codeDescription: 'Claim',
          companyCode: '101',
        },
        {
          code: 'FA',
          codeType: 'APPLICABLE_FOR',
          codeDescription: 'Fixed Asset',
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

async function mockParentPage(page: Page, modules: unknown[] = []): Promise<void> {
  await page.route('**/api/document-setups/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/applicable-modules')) {
      await route.fulfill({ contentType: 'application/json', json: listResult(modules) });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: parent });
  });
}

test('shows a breadcrumb on the Document Setup Edit page', async ({ page }) => {
  await mockParentPage(page);
  await page.goto('/document-setups/DOC-EDIT/edit');

  const breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
  expect(
    await breadcrumbs.evaluate((element) => element.closest('.document-setup-edit-page')),
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
  await expect(breadcrumbs.locator('[aria-current="page"]')).toHaveText('DOC-EDIT');
});

test('header Add opens the Add Document Setup page', async ({ page }) => {
  await mockParentPage(page);
  await page.goto('/document-setups/DOC-EDIT/edit');

  const headerActions = page.locator('.page-header-actions');
  await expect(headerActions.getByRole('link', { name: 'Add', exact: true })).toBeVisible();
  await headerActions.getByRole('link', { name: 'Add', exact: true }).click();
  await expect(page).toHaveURL('/document-setups/add');
  await expect(page.getByRole('heading', { name: 'Add Document Setup' })).toBeVisible();
});

test('loads Doc Setup For choices from Codes Master on Edit', async ({ page }) => {
  await mockParentPage(page);
  await page.goto('/document-setups/DOC-EDIT/edit');
  await page.getByRole('combobox', { name: 'Doc Setup For' }).click();
  await expect(page.getByRole('option', { name: '101 — File Upload' })).toBeVisible();
  await expect(page.getByRole('option', { name: '102 — Doc Print' })).toBeVisible();
});

test('sorts Applicable Module columns on the server in both directions', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/document-setups/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/applicable-modules')) {
      requests.push(url);
      await route.fulfill({ contentType: 'application/json', json: listResult([assetModule]) });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: parent });
  });

  await page.goto('/document-setups/DOC-EDIT/edit');
  await expect.poll(() => requests.at(-1)?.searchParams.get('sortBy')).toBe('ApplicableFor');
  expect(requests.at(-1)?.searchParams.get('sortDirection')).toBe('Ascending');

  const header = page.locator('th.mat-column-productFrom [mat-sort-header]');
  await header.click();
  await expect.poll(() => requests.at(-1)?.searchParams.get('sortBy')).toBe('ProductFrom');
  await expect.poll(() => requests.at(-1)?.searchParams.get('sortDirection')).toBe('Ascending');

  await header.click();
  await expect.poll(() => requests.at(-1)?.searchParams.get('sortDirection')).toBe('Descending');
});

test('filters Applicable Modules by Applicable For on the server', async ({ page }) => {
  const requests: URL[] = [];
  const modules = [assetModule, { ...assetModule, damodUid: '2', applicableFor: 'ASR' }];
  await page.route('**/api/document-setups/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/applicable-modules')) {
      requests.push(url);
      const filterValue = url.searchParams.get('applicableForValue')?.toUpperCase();
      const items = filterValue
        ? modules.filter((module) => module.applicableFor.includes(filterValue))
        : modules;
      await route.fulfill({
        contentType: 'application/json',
        json: { ...listResult(items), totalCount: items.length },
      });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: parent });
  });

  await page.goto('/document-setups/DOC-EDIT/edit');
  await expect(page.getByRole('row', { name: /ASSET/ })).toBeVisible();
  await expect(page.getByRole('row', { name: /ASR/ })).toBeVisible();
  const filterInput = page.getByLabel('Filter value for Applicable For', { exact: true });
  await filterInput.fill('ASR');
  await page.getByRole('button', { name: 'Filter Applicable For', exact: true }).click();
  await page.getByRole('button', { name: 'Contains', exact: true }).click();
  await page.getByRole('button', { name: 'Apply filter for Applicable For' }).click();

  await expect
    .poll(() => requests.at(-1)?.searchParams.get('applicableForOperator'))
    .toBe('Contains');
  expect(requests.at(-1)?.searchParams.get('applicableForValue')).toBe('ASR');
  expect(requests.at(-1)?.searchParams.get('page')).toBe('1');
  const moduleRows = page
    .getByRole('table', { name: 'Applicable Modules' })
    .locator('.mat-mdc-row');
  await expect(moduleRows.filter({ hasText: 'ASR' })).toBeVisible();
  await expect(moduleRows.filter({ hasText: 'ASSET' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Clear all filters' }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.has('applicableForValue')).toBe(false);
  await expect(moduleRows.filter({ hasText: 'ASSET' })).toBeVisible();
});

test('filters Applicable Modules by Product From on the server', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/document-setups/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/applicable-modules')) {
      requests.push(url);
      await route.fulfill({ contentType: 'application/json', json: listResult([assetModule]) });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: parent });
  });

  await page.goto('/document-setups/DOC-EDIT/edit');
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

  const filterInput = page.getByLabel('Filter value for Product From', { exact: true });
  await filterInput.fill('1001');
  await page.getByRole('button', { name: 'Filter Product From', exact: true }).click();
  await page.getByRole('button', { name: 'Contains', exact: true }).click();
  await page.getByRole('button', { name: 'Apply filter for Product From' }).click();

  await expect
    .poll(() => requests.at(-1)?.searchParams.get('productFromOperator'))
    .toBe('Contains');
  expect(requests.at(-1)?.searchParams.get('productFromValue')).toBe('1001');
});

test('loads parent audit values and child range columns, and Reset restores the parent snapshot', async ({
  page,
}) => {
  await mockParentPage(page, [assetModule]);
  await page.goto('/document-setups/DOC-EDIT/edit');

  await expect(page.getByRole('heading', { name: 'Document Setup' })).toBeVisible();
  await expect(
    page.locator('.page-header-actions').getByRole('link', { name: 'Add' }),
  ).toBeVisible();
  const auditButton = page.getByRole('button', { name: 'Audit details for DOC-EDIT' });
  await expect(auditButton).toBeVisible();
  await expect(auditButton).toHaveText('i');
  const header = page.locator('header.page-header');
  await expect(header.getByRole('button', { name: 'Back' })).toBeVisible();
  expect(
    await header.locator('.page-header-actions').evaluate((actions) => {
      const audit = actions.querySelector('app-creation-audit-details');
      const back = actions.querySelector('button');
      return Boolean(
        audit && back && audit.compareDocumentPosition(back) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }),
  ).toBe(true);
  await auditButton.hover();
  await expect(page.getByRole('tooltip')).toContainText(
    'Created By: ADMIN; Created Date: 02-Nov-2026; Updated By: Not recorded; Updated Date: Not recorded',
  );
  const moduleRow = page
    .getByRole('table', { name: 'Applicable Modules' })
    .getByRole('row', { name: /ASSET/ });
  const editButton = page.getByRole('button', {
    name: 'Applicable Module 98765432109876543',
    exact: true,
  });
  await expect(editButton).toBeVisible();
  await expect(editButton.locator('svg')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Delete Applicable Module 98765432109876543' }).locator('svg'),
  ).toHaveCount(1);
  await expect(moduleRow).toContainText('PERSONAL LINES - MOTOR COMPREHENSIVE');
  await expect(moduleRow).toContainText('MOTOR PERSONAL LINES');
  await expect(moduleRow).toContainText('PACKAGE POLICY');
  await expect(moduleRow).not.toContainText('1001');
  await expect(moduleRow).not.toContainText('101');
  await expect(moduleRow).not.toContainText('601');
  for (const column of [
    'Applicable For',
    'Product From',
    'Product To',
    'PCM From',
    'PCM To',
    'CCM From',
    'CCM To',
    'Mandatory',
    'Active',
  ]) {
    await expect(page.getByRole('columnheader', { name: column })).toBeVisible();
  }

  await page.getByRole('textbox', { name: 'Doc Name' }).fill('Unsaved name');
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('textbox', { name: 'Doc Name' })).toHaveValue('Existing document');
  await expect(page.getByRole('textbox', { name: 'Doc Code' })).toHaveAttribute('readonly', 'true');
});

test('shows descriptions only, neutral table colors, and edit/delete icons for saved modules', async ({
  page,
}) => {
  await mockParentPage(page, [assetModule]);
  await page.goto('/document-setups/DOC-EDIT/edit');

  const moduleRow = page
    .getByRole('table', { name: 'Applicable Modules' })
    .getByRole('row', { name: /ASSET/ });
  await expect(moduleRow).toContainText('PERSONAL LINES - MOTOR COMPREHENSIVE');
  await expect(moduleRow).toContainText('MOTOR PERSONAL LINES');
  await expect(moduleRow).toContainText('PACKAGE POLICY');
  await expect(moduleRow).not.toContainText('1001');
  await expect(moduleRow).not.toContainText('101');
  await expect(moduleRow).not.toContainText('601');
  await expect(
    page.getByRole('table', { name: 'Applicable Modules' }).getByRole('columnheader').first(),
  ).toHaveCSS('background-color', 'rgb(241, 237, 232)');
  await expect(moduleRow.locator('td').first()).toHaveCSS('background-color', 'rgb(255, 253, 251)');
  const pagination = page.getByRole('navigation', {
    name: 'Applicable Module page selection',
  });
  await expect(pagination.getByRole('button')).toHaveCount(5);
  await expect(pagination.getByRole('button', { name: 'Page 1' })).toBeVisible();
  await expect(page.locator('.pagination-row')).toHaveCSS('background-color', 'rgb(255, 253, 251)');
  await expect(page.locator('.mat-mdc-paginator-page-size')).toHaveCount(0);
  await expect(
    page
      .getByRole('button', { name: 'Applicable Module 98765432109876543', exact: true })
      .locator('svg'),
  ).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Delete Applicable Module 98765432109876543' }).locator('svg'),
  ).toHaveCount(1);
});

test('centres the empty Applicable Modules state and keeps Add visible', async ({ page }) => {
  await mockParentPage(page);
  await page.goto('/document-setups/DOC-EDIT/edit');

  const emptyModules = page.locator('.empty-modules');
  await expect(emptyModules).toHaveText('No Applicable Modules have been added.');
  await expect(emptyModules).toHaveCSS('text-align', 'center');
  await expect(
    page.locator('.modules-actions').getByRole('button', { name: 'Add', exact: true }),
  ).toBeVisible();
});

test('selects an Applicable Module page from the numbered paginator', async ({ page }) => {
  const modules = Array.from({ length: 52 }, (_, index) => ({
    ...assetModule,
    damodUid: String(index + 1),
    applicableFor: `MODULE-${index + 1}`,
  }));
  const requests: URL[] = [];
  await page.route('**/api/document-setups/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/applicable-modules')) {
      requests.push(url);
      const requestedPage = Number(url.searchParams.get('page') ?? 1);
      const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
      const start = (requestedPage - 1) * pageSize;
      await route.fulfill({
        contentType: 'application/json',
        json: {
          items: modules.slice(start, start + pageSize),
          page: requestedPage,
          pageSize,
          totalCount: modules.length,
        },
      });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: parent });
  });
  await page.goto('/document-setups/DOC-EDIT/edit');

  const pageNumbers = page.getByRole('navigation', {
    name: 'Applicable Module page selection',
  });
  await pageNumbers.getByRole('button', { name: 'Last page' }).click();
  await expect(pageNumbers.getByRole('button', { name: 'Page 6' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'MODULE-51', exact: true })).toBeVisible();
  await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('6');
  await pageNumbers.getByRole('button', { name: 'Previous page' }).click();
  await expect(pageNumbers.getByRole('button', { name: 'Page 5' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'MODULE-41', exact: true })).toBeVisible();
  await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('5');
});

test('updates the parent with its loaded version and reports stale saves with reload guidance', async ({
  page,
}) => {
  let submittedBody: Record<string, unknown> | undefined;
  await page.route('**/api/document-setups/DOC-EDIT', async (route) => {
    if (route.request().method() === 'PUT') {
      submittedBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        contentType: 'application/json',
        json: {
          ...parent,
          docName: 'Updated document',
          updatedBy: 'ADMIN',
          version: 'parent-version-2',
        },
      });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: parent });
  });
  await page.route('**/api/document-setups/DOC-EDIT/applicable-modules**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/applicable-modules')) {
      await route.fulfill({ contentType: 'application/json', json: listResult() });
      return;
    }

    await route.fallback();
  });

  await page.goto('/document-setups/DOC-EDIT/edit');
  await page.getByRole('textbox', { name: 'Doc Name' }).fill('Updated document');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('dialog')).toContainText('Document setup updated successfully.');
  expect(submittedBody?.['docCode']).toBe('DOC-EDIT');
  expect(submittedBody?.['expectedVersion']).toBe('parent-version-1');

  await page.route('**/api/document-setups/DOC-EDIT', async (route) => {
    if (route.request().method() === 'PUT') {
      await route.fulfill({
        status: 409,
        contentType: 'application/problem+json',
        json: {
          status: 409,
          title: 'The document setup has changed.',
          detail: 'Reload the document setup.',
        },
      });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: parent });
  });
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('textbox', { name: 'Doc Name' }).fill('Stale value');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('alert')).toContainText('Reload the page');
});

test('child Add shows Fixed Asset ranges, prevents duplicate saves, and submits server-managed defaults', async ({
  page,
}) => {
  let submittedBody: Record<string, unknown> | undefined;
  let postCount = 0;
  let releasePost: (() => void) | undefined;
  const postGate = new Promise<void>((resolve) => {
    releasePost = resolve;
  });
  await page.route('**/api/document-setups/DOC-EDIT/applicable-modules', async (route) => {
    if (route.request().method() === 'POST') {
      postCount += 1;
      submittedBody = route.request().postDataJSON() as Record<string, unknown>;
      await postGate;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        json: { ...assetModule, damodUid: '98765432109876544' },
      });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: listResult() });
  });
  await page.route('**/api/document-setups/DOC-EDIT', async (route) => {
    await route.fulfill({ contentType: 'application/json', json: parent });
  });

  await page.goto('/document-setups/DOC-EDIT/applicable-modules/add');
  await expect(page.getByRole('heading', { name: 'Applicable Module' })).toBeVisible();
  const breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(breadcrumbs.getByRole('link', { name: 'Document Setups' })).toHaveAttribute(
    'href',
    '/document-setups',
  );
  await expect(breadcrumbs.getByRole('link', { name: 'DOC-EDIT' })).toHaveAttribute(
    'href',
    '/document-setups/DOC-EDIT/edit',
  );
  await expect(breadcrumbs.locator('[aria-current="page"]')).toHaveText('Applicable Module');
  await expect(page.getByRole('combobox', { name: 'Product From' })).toHaveCount(0);
  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'FA — Fixed Asset' }).click();
  await expect(page.getByRole('combobox', { name: 'Product From' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Product From' }).click();
  await page.getByRole('option', { name: '1002 — PERSONAL LINES - MOTOR THIRD PARTY' }).click();
  await page.getByRole('combobox', { name: 'Product To' }).click();
  await page.getByRole('option', { name: '1001 — PERSONAL LINES - MOTOR COMPREHENSIVE' }).click();
  await page.getByRole('combobox', { name: 'PCM From' }).click();
  await page.getByRole('option', { name: '101 — MOTOR PERSONAL LINES' }).click();
  await page.getByRole('combobox', { name: 'PCM To' }).click();
  await page.getByRole('option', { name: '201 — PROPERTY' }).click();
  await page.getByRole('combobox', { name: 'CCM From' }).click();
  await page.getByRole('option', { name: '101 — MOTOR DIRECT' }).click();
  await page.getByRole('combobox', { name: 'CCM To' }).click();
  await page.getByRole('option', { name: '601 — PACKAGE POLICY' }).click();

  const saveButton = page.locator('form button[type="submit"]');
  await saveButton.click();
  await expect(saveButton).toBeDisabled();
  await saveButton.click({ force: true });
  releasePost?.();

  await expect(page.getByRole('dialog')).toContainText('Applicable Module created successfully.');
  expect(postCount).toBe(1);
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page).toHaveURL('/document-setups/DOC-EDIT/applicable-modules/add');
  await expect(page.getByRole('combobox', { name: 'Applicable For' })).toContainText(
    'FA — Fixed Asset',
  );
  await expect(page.getByRole('combobox', { name: 'Product From' })).toContainText(
    '1002 — PERSONAL LINES - MOTOR THIRD PARTY',
  );
  expect(submittedBody?.['applicableFor']).toBe('FA');
  expect(submittedBody?.['productFrom']).toBe('1002');
  expect(submittedBody?.['productTo']).toBe('1001');
  expect(submittedBody?.['pcmFrom']).toBe('101');
  expect(submittedBody?.['pcmTo']).toBe('201');
  expect(submittedBody?.['ccmFrom']).toBe('101');
  expect(submittedBody?.['ccmTo']).toBe('601');
  expect(submittedBody?.['mandatoryYn']).toBe('N');
  expect(submittedBody?.['activeYn']).toBe('Y');
});

test('Policy and Claim Applicable For choices show Product, PCM, and CCM ranges', async ({ page }) => {
  await page.goto('/document-setups/DOC-EDIT/applicable-modules/add');
  const applicableFor = page.getByRole('combobox', { name: 'Applicable For' });

  for (const [optionName, fieldName] of [
    ['POLICY — Policy', 'Product From'],
    ['CLAIM — Claim', 'Product From'],
  ]) {
    await applicableFor.click();
    await page.getByRole('option', { name: optionName }).click();
    await expect(page.getByRole('combobox', { name: fieldName })).toBeVisible();
    for (const rangeField of ['Product To', 'PCM From', 'PCM To', 'CCM From', 'CCM To']) {
      await expect(page.getByRole('combobox', { name: rangeField })).toBeVisible();
    }
  }
});

test('Applicable Module edit Add opens a blank new Applicable Module page', async ({ page }) => {
  await page.route(
    '**/api/document-setups/DOC-EDIT/applicable-modules/98765432109876543',
    async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        json: { ...assetModule, damodDocCode: 'DOC-EDIT', createdBy: 'ADMIN' },
      });
    },
  );

  await page.goto(
    '/document-setups/DOC-EDIT/applicable-modules/98765432109876543/edit',
  );

  const headerActions = page.locator('.page-header-actions');
  await expect(headerActions.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
  await expect(headerActions.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
  await expect(headerActions.getByRole('button').nth(0)).toHaveText('Add');
  await headerActions.getByRole('button', { name: 'Add', exact: true }).click();

  await expect(page).toHaveURL('/document-setups/DOC-EDIT/applicable-modules/add');
  await expect(page.getByRole('heading', { name: 'Applicable Module' })).toBeVisible();
  await expect(page.locator('.page-header-actions').getByRole('button', { name: 'Add' })).toHaveCount(
    0,
  );
});

test('draft Applicable Module Add resets the form after confirming unsaved changes', async ({
  page,
}) => {
  await page.goto('/document-setups/add/applicable-modules/add');
  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'FA — Fixed Asset' }).click();
  await expect(page.getByRole('combobox', { name: 'Product From' })).toBeVisible();

  await page.locator('.page-header-actions').getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('dialog')).toContainText('Your changes will be lost');
  await page.getByRole('button', { name: 'Discard' }).click();

  await expect(page).toHaveURL('/document-setups/add/applicable-modules/add');
  await expect(page.getByRole('combobox', { name: 'Product From' })).toHaveCount(0);
});

test('saving a draft Applicable Module stays on the page and keeps the selected value', async ({
  page,
}) => {
  await page.goto('/document-setups/add/applicable-modules/add');
  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'ASR' }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('dialog')).toContainText(
    'Applicable Module added to the document setup draft.',
  );
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page).toHaveURL('/document-setups/add/applicable-modules/add');
  await expect(page.getByRole('combobox', { name: 'Applicable For' })).toContainText('ASR');
});

test('uses ALL for unselected Fixed Asset range options in the saved request', async ({ page }) => {
  let submittedBody: Record<string, unknown> | undefined;
  await mockParentPage(page);
  await page.route('**/api/document-setups/DOC-EDIT/applicable-modules', async (route) => {
    if (route.request().method() === 'POST') {
      submittedBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        json: {
          ...assetModule,
          damodUid: '98765432109876544',
          productFrom: 'ALL',
          productTo: 'ALL',
          pcmFrom: 'ALL',
          pcmTo: 'ALL',
          ccmFrom: 'ALL',
          ccmTo: 'ALL',
        },
      });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: listResult() });
  });

  await page.goto('/document-setups/DOC-EDIT/applicable-modules/add');
  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'FA — Fixed Asset' }).click();
  for (const field of ['Product From', 'Product To', 'PCM From', 'PCM To', 'CCM From', 'CCM To']) {
    const dropdown = page.getByRole('combobox', { name: field });
    await expect(dropdown).toContainText('ALL');
    await dropdown.click();
    await expect(page.getByRole('option', { name: 'ALL', exact: true })).toBeVisible();
    await page.getByRole('option', { name: 'ALL', exact: true }).click();
  }

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('dialog')).toContainText('Applicable Module created successfully.');
  expect(submittedBody).toMatchObject({
    productFrom: 'ALL',
    productTo: 'ALL',
    pcmFrom: 'ALL',
    pcmTo: 'ALL',
    ccmFrom: 'ALL',
    ccmTo: 'ALL',
  });
});

test('changing an ASSET child to Assured Master saves ALL for all six ranges', async ({ page }) => {
  let submittedBody: Record<string, unknown> | undefined;
  await page.route(
    '**/api/document-setups/DOC-EDIT/applicable-modules/98765432109876543',
    async (route) => {
      if (route.request().method() === 'PUT') {
        submittedBody = route.request().postDataJSON() as Record<string, unknown>;
        await route.fulfill({
          contentType: 'application/json',
          json: {
            ...assetModule,
            applicableFor: 'ASR',
            productFrom: 'ALL',
            productTo: 'ALL',
            pcmFrom: 'ALL',
            pcmTo: 'ALL',
            ccmFrom: 'ALL',
            ccmTo: 'ALL',
            version: 'module-version-2',
          },
        });
        return;
      }

      await route.fulfill({
        contentType: 'application/json',
        json: { ...assetModule, damodDocCode: 'DOC-EDIT' },
      });
    },
  );
  await page.route('**/api/document-setups/DOC-EDIT/applicable-modules**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/applicable-modules')) {
      await route.fulfill({ contentType: 'application/json', json: listResult() });
      return;
    }

    await route.fallback();
  });
  await page.route('**/api/document-setups/DOC-EDIT', async (route) => {
    await route.fulfill({ contentType: 'application/json', json: parent });
  });

  await page.goto('/document-setups/DOC-EDIT/applicable-modules/98765432109876543/edit');
  await expect(page.getByRole('combobox', { name: 'Product From' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'ASR' }).click();
  await expect(page.getByRole('combobox', { name: 'Product From' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('dialog')).toContainText('Applicable Module updated successfully.');

  expect(submittedBody?.['applicableFor']).toBe('ASR');
  expect(submittedBody?.['expectedVersion']).toBe('module-version-1');
  expect(submittedBody).toMatchObject({
    productFrom: 'ALL',
    productTo: 'ALL',
    pcmFrom: 'ALL',
    pcmTo: 'ALL',
    ccmFrom: 'ALL',
    ccmTo: 'ALL',
  });
});

test('child Delete confirms the selected decimal-string ID and sends its version', async ({
  page,
}) => {
  let deleteUrl = '';
  await mockParentPage(page, [assetModule]);
  await page.route(
    '**/api/document-setups/DOC-EDIT/applicable-modules/98765432109876543**',
    async (route) => {
      deleteUrl = route.request().url();
      await route.fulfill({ status: 204 });
    },
  );

  await page.goto('/document-setups/DOC-EDIT/edit');
  await page.getByRole('button', { name: 'Delete Applicable Module 98765432109876543' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('98765432109876543');
  await dialog.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('dialog')).toContainText('Applicable Module deleted successfully.');
  expect(deleteUrl).toContain('expectedVersion=module-version-1');
});

test('dirty child form asks before leaving and can be reset', async ({ page }) => {
  await page.route('**/api/document-setups**', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ contentType: 'application/json', json: listResult() });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: parent });
  });
  await page.goto('/document-setups/DOC-EDIT/applicable-modules/add');
  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'ASSET — Asset' }).click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('combobox', { name: 'Product From' })).toHaveCount(0);

  await page.getByRole('combobox', { name: 'Applicable For' }).click();
  await page.getByRole('option', { name: 'ASR' }).click();
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('dialog')).toContainText('Your changes will be lost');
  await page.getByRole('button', { name: 'Stay' }).click();
  await expect(page.getByRole('heading', { name: 'Applicable Module' })).toBeVisible();
});

test('parent Edit More control is keyboard operable and dirty navigation asks before leaving', async ({
  page,
}) => {
  await mockParentPage(page);
  await page.goto('/document-setups/DOC-EDIT/edit');

  const moreButton = page.getByRole('button', { name: 'More' });
  await moreButton.focus();
  await page.keyboard.press('Enter');
  await expect(moreButton).toHaveAttribute('aria-expanded', 'true');

  await page.getByRole('textbox', { name: 'Doc Name' }).fill('Unsaved parent value');
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('dialog')).toContainText('Your changes will be lost');
  await page.getByRole('button', { name: 'Stay' }).click();
  await expect(page.getByRole('heading', { name: 'Edit Document Setup' })).toBeVisible();
});
