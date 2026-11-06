import { expect, test } from '@playwright/test';

function createRecords(start: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const number = start + index;
    return {
      docCode: `DOC-${number}`,
      docName: `Document ${number}`,
      docDescription: `Description ${number}`,
      docSetupFor: '101',
      activeYn: 'Y',
      createdBy: 'ADMIN',
      createdDate: '2026-11-02T09:30:00',
      updatedBy: 'ADMIN',
      updatedDate: '2026-11-02T10:30:00',
      version: `version-${number}`,
    };
  });
}

async function openDocumentSetups(page: import('@playwright/test').Page) {
  await page.route('**/api/codes**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { items: [], page: 1, pageSize: 10, totalCount: 0 },
    });
  });
  await page.goto('/');
  const mastersToggle = page.getByRole('button', { name: 'Masters' });
  if ((await mastersToggle.getAttribute('aria-expanded')) !== 'true') {
    await mastersToggle.click();
  }

  await page.getByRole('link', { name: 'Document Setup' }).click();
}

async function applyColumnFilter(
  page: import('@playwright/test').Page,
  column: string,
  operator: string,
  value: string,
) {
  await page.getByLabel(`Filter value for ${column}`, { exact: true }).fill(value);
  await page.getByRole('button', { name: `Filter ${column}`, exact: true }).click();
  await page.getByRole('button', { name: operator, exact: true }).click();
  await page.getByRole('button', { name: `Apply filter for ${column}` }).click();
}

test('navigates to Document Setup and displays the required columns and selected row actions', async ({
  page,
}) => {
  await page.route('**/api/document-setups**', async (route) => {
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

  await openDocumentSetups(page);
  const breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(breadcrumbs.locator('[aria-current="page"]')).toHaveText('Document Setup');
  await expect(page.getByRole('columnheader')).toHaveCount(6);
  for (const column of [
    'Doc Code',
    'Doc Name',
    'Description',
    'Setup For',
    'Active Y/N',
    'Actions',
  ]) {
    await expect(page.getByRole('columnheader', { name: column })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'Edit DOC-1' })).toHaveAttribute(
    'href',
    /document-setups\/DOC-1\/edit/,
  );
  await expect(page.getByRole('button', { name: 'Delete DOC-1' })).toBeVisible();
  const auditButton = page.getByRole('button', { name: 'Audit details for DOC-1' });
  await expect(auditButton).toBeVisible();
  await auditButton.hover();
  await expect(page.getByRole('tooltip')).toContainText(
    'Created By: ADMIN; Created Date: 02-Nov-2026; Updated By: ADMIN; Updated Date: 02-Nov-2026',
  );
  await expect(page.getByRole('link', { name: 'Add' })).toBeVisible();
});

test('uses lighter text weights for the Document Setup listing and filter placeholder', async ({
  page,
}) => {
  await page.route('**/api/document-setups**', async (route) => {
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

  await openDocumentSetups(page);
  await expect(page.locator('#document-setups-heading')).toHaveCSS('font-weight', '600');
  await expect(page.locator('th.mat-column-docCode .column-heading')).toHaveCSS(
    'font-weight',
    '600',
  );
  await expect(page.getByLabel('Filter value for Doc Code', { exact: true })).toHaveCSS(
    'font-weight',
    '400',
  );
});

test('sorts Document Setup columns on the server in both directions', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/document-setups**', async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: createRecords(1, 1),
        page: Number(url.searchParams.get('page') ?? 1),
        pageSize: 10,
        totalCount: 1,
      },
    });
  });

  await openDocumentSetups(page);
  await expect.poll(() => requests.at(-1)?.searchParams.get('sortBy')).toBe('DocCode');
  expect(requests.at(-1)?.searchParams.get('sortDirection')).toBe('Ascending');

  const header = page.locator('th.mat-column-docName .column-heading');
  await header.click();
  await expect.poll(() => requests.at(-1)?.searchParams.get('sortBy')).toBe('DocName');
  await expect.poll(() => requests.at(-1)?.searchParams.get('sortDirection')).toBe('Ascending');

  await header.click();
  await expect.poll(() => requests.at(-1)?.searchParams.get('sortDirection')).toBe('Descending');
});

test('renders absent optional listing values as blank', async ({ page }) => {
  await page.route('**/api/document-setups**', async (route) => {
    const record = {
      ...createRecords(1, 1)[0],
      docName: null,
      docDescription: null,
      docSetupFor: null,
      activeYn: null,
    };
    await route.fulfill({
      contentType: 'application/json',
      json: { items: [record], page: 1, pageSize: 10, totalCount: 1 },
    });
  });

  await openDocumentSetups(page);
  const cells = page.getByRole('row').nth(1).getByRole('cell');
  await expect(cells.nth(1)).toHaveText('');
  await expect(cells.nth(2)).toHaveText('');
  await expect(cells.nth(3)).toHaveText('');
  await expect(cells.nth(4)).toHaveText('');
});

test('sends per-column filters together and resets to the first page', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/document-setups**', async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    const hasFilters = [
      'docCodeOperator',
      'docNameOperator',
      'docDescriptionOperator',
      'setupForOperator',
    ].some((key) => url.searchParams.has(key));
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: hasFilters ? [] : createRecords(1, 1),
        page: Number(url.searchParams.get('page') ?? 1),
        pageSize: 10,
        totalCount: hasFilters ? 0 : 1,
      },
    });
  });

  await openDocumentSetups(page);
  await applyColumnFilter(page, 'Doc Code', 'Contains', 'policy');
  await applyColumnFilter(page, 'Doc Name', 'Starts With', 'home');
  await applyColumnFilter(page, 'Description', 'Contains', 'coverage');
  await applyColumnFilter(page, 'Setup For', 'Equal To', '101');

  await expect.poll(() => requests.at(-1)?.searchParams.get('docCodeOperator')).toBe('Contains');
  expect(requests.at(-1)?.searchParams.get('docCodeValue')).toBe('policy');
  expect(requests.at(-1)?.searchParams.get('docNameOperator')).toBe('StartsWith');
  expect(requests.at(-1)?.searchParams.get('docNameValue')).toBe('home');
  expect(requests.at(-1)?.searchParams.get('docDescriptionOperator')).toBe('Contains');
  expect(requests.at(-1)?.searchParams.get('docDescriptionValue')).toBe('coverage');
  expect(requests.at(-1)?.searchParams.get('setupForOperator')).toBe('EqualTo');
  expect(requests.at(-1)?.searchParams.get('setupForValue')).toBe('101');
  expect(requests.at(-1)?.searchParams.get('page')).toBe('1');
});

test('paginates document setups with compact controls and a fixed page size', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/document-setups**', async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    const requestedPage = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: requestedPage === 1 ? createRecords(1, pageSize) : createRecords(11, 2),
        page: requestedPage,
        pageSize,
        totalCount: 12,
      },
    });
  });
  await openDocumentSetups(page);
  await openDocumentSetups(page);
  const pagination = page.getByRole('navigation', { name: 'Document Setup page selection' });
  await expect(pagination.getByRole('button')).toHaveCount(6);
  await expect(page.locator('.mat-mdc-paginator-page-size')).toHaveCount(0);
  await expect.poll(() => requests.at(-1)?.searchParams.get('pageSize')).toBe('10');
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByRole('cell', { name: 'DOC-11', exact: true })).toBeVisible();
  await expect.poll(() => requests.at(-1)?.searchParams.get('pageSize')).toBe('10');
  await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('2');
});

test('selects a document setup page from the numbered paginator', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/document-setups**', async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    const requestedPage = Number(url.searchParams.get('page') ?? 1);
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: createRecords((requestedPage - 1) * 10 + 1, 10),
        page: requestedPage,
        pageSize: 10,
        totalCount: 52,
      },
    });
  });

  await openDocumentSetups(page);
  const pageNumbers = page.getByRole('navigation', { name: 'Document Setup page selection' });
  await pageNumbers.getByRole('button', { name: 'Last page' }).click();
  await expect(pageNumbers.getByRole('button', { name: 'Page 6' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'DOC-51', exact: true })).toBeVisible();
  await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('6');

  await pageNumbers.getByRole('button', { name: 'Previous page' }).click();
  await expect(pageNumbers.getByRole('button', { name: 'Page 5' })).toBeVisible();
  await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('5');
});

test('distinguishes an empty listing from a retrieval error and can retry', async ({ page }) => {
  let shouldFail = false;
  await page.route('**/api/document-setups**', async (route) => {
    if (shouldFail) {
      await route.fulfill({
        status: 503,
        contentType: 'application/problem+json',
        json: { title: 'The document setups could not be loaded.', status: 503 },
      });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: { items: [], page: 1, pageSize: 10, totalCount: 0 },
    });
  });

  await openDocumentSetups(page);
  await expect(page.getByRole('status')).toContainText('No document setups are available.');
  await expect(page.getByRole('alert')).toHaveCount(0);

  shouldFail = true;
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('The document setups could not be loaded.');
  shouldFail = false;
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByRole('status')).toContainText('No document setups are available.');
});
