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
      updatedBy: 'EDITOR',
      updatedDate: '2025-02-20T00:00:00Z',
    };
  });
}

test('shows the hard-coded company name in the application toolbar', async ({ page }) => {
  await page.goto('/codes');

  await expect(page.locator('.application-name')).toHaveText('ABC Broker Insurance');
});

async function applyColumnFilter(
  page: import('@playwright/test').Page,
  column: string,
  operator: string,
  value?: string,
) {
  const filterInput = page.getByLabel(`Filter value for ${column}`, { exact: true });
  if (value !== undefined) {
    await filterInput.fill(value);
    await expect(filterInput).toHaveValue(value);
  }
  await page.getByRole('button', { name: `Filter ${column}`, exact: true }).click();
  if (value !== undefined) {
    await expect(filterInput).toHaveValue(value);
  }
  await page.getByRole('button', { name: operator, exact: true }).click();
  if (value !== undefined) {
    await expect(filterInput).toHaveValue(value);
  }
  await page.getByRole('button', { name: `Apply filter for ${column}` }).click();
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
  const mastersToggle = page.getByRole('button', { name: 'Masters' });
  await expect(mastersToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Codes Master' })).toBeVisible();
  await mastersToggle.click();
  await expect(mastersToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('link', { name: 'Codes Master' })).toHaveCount(0);
  await mastersToggle.click();
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
  const headerBackgrounds = await headers.evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).backgroundColor),
  );
  expect(headerBackgrounds).toEqual(Array(6).fill('rgb(241, 237, 232)'));
  const rows = page.locator('.mat-mdc-row');
  await expect(rows.nth(0).locator('.mat-mdc-cell').first()).toHaveCSS(
    'background-color',
    'rgb(255, 253, 251)',
  );
  await expect(rows.nth(1).locator('.mat-mdc-cell').first()).toHaveCSS(
    'background-color',
    'rgb(247, 245, 242)',
  );
  await rows.nth(1).hover();
  await expect(rows.nth(1).locator('.mat-mdc-cell').first()).toHaveCSS(
    'background-color',
    'rgb(238, 231, 223)',
  );
  await rows.nth(0).hover();
  await expect(rows.nth(0).locator('.mat-mdc-cell').first()).toHaveCSS(
    'background-color',
    'rgb(250, 248, 246)',
  );
  await expect(page.getByRole('row')).toHaveCount(11);
  await expect(page.getByRole('link', { name: 'Edit CODE-1 (GENERAL)' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete CODE-1 (GENERAL)' })).toBeVisible();

  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByRole('cell', { name: 'CODE-11', exact: true })).toBeVisible();
});

test('keeps the table headings visible while scrolling through rows', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 480 });
  await page.route('**/api/codes**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: createRecords(1, 10),
        page: 1,
        pageSize: 10,
        totalCount: 10,
      },
    });
  });

  await page.goto('/codes');
  const tableContainer = page.locator('.table-container');
  const firstHeader = page.getByRole('columnheader').first();
  await expect
    .poll(() => tableContainer.evaluate((element) => element.scrollHeight > element.clientHeight))
    .toBe(true);

  const containerTop = await tableContainer.evaluate(
    (element) => element.getBoundingClientRect().top,
  );
  await tableContainer.evaluate((element) => {
    element.scrollTop = 200;
  });
  await expect
    .poll(async () => (await firstHeader.boundingBox())?.y)
    .toBeCloseTo(containerTop + 1, 0);
});

test('sorts data columns on the server and resets to the first page', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/codes**', async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: createRecords(1, 10),
        page: Number(url.searchParams.get('page') ?? 1),
        pageSize: Number(url.searchParams.get('pageSize') ?? 10),
        totalCount: 30,
      },
    });
  });

  await page.goto('/codes');
  await page.getByRole('button', { name: 'Next page' }).click();
  await page.locator('th.mat-column-description .column-heading').click();

  await expect.poll(() => requests.at(-1)?.searchParams.get('sortBy')).toBe('CodeDescription');
  expect(requests.at(-1)?.searchParams.get('sortDirection')).toBe('Ascending');
  expect(requests.at(-1)?.searchParams.get('page')).toBe('1');

  await page.locator('th.mat-column-description .column-heading').click();
  await expect.poll(() => requests.at(-1)?.searchParams.get('sortDirection')).toBe('Descending');
  expect(requests.at(-1)?.searchParams.get('sortBy')).toBe('CodeDescription');
});

test('sorts every data column in ascending and descending order', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/codes**', async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: createRecords(1, 10),
        page: Number(url.searchParams.get('page') ?? 1),
        pageSize: 10,
        totalCount: 20,
      },
    });
  });

  const sortableColumns = [
    { header: 'Code', sortBy: 'Code', selector: 'code' },
    { header: 'Code Description', sortBy: 'CodeDescription', selector: 'description' },
    { header: 'Type', sortBy: 'CodeType', selector: 'type' },
    { header: 'Value 1', sortBy: 'Value1', selector: 'value1' },
    { header: 'Value 2', sortBy: 'Value2', selector: 'value2' },
  ];

  await page.goto('/codes');
  await expect(page.getByRole('cell', { name: 'CODE-1', exact: true })).toBeVisible();

  for (const column of sortableColumns) {
    const header = page.locator(`th.mat-column-${column.selector} .column-heading`);
    let requestCount = requests.length;
    await header.click();
    await expect.poll(() => requests.length).toBeGreaterThan(requestCount);
    await expect.poll(() => requests.at(-1)?.searchParams.get('sortBy')).toBe(column.sortBy);
    if (requests.at(-1)?.searchParams.get('sortDirection') === 'Descending') {
      requestCount = requests.length;
      await header.click();
      await expect.poll(() => requests.length).toBeGreaterThan(requestCount);
    }
    await expect.poll(() => requests.at(-1)?.searchParams.get('sortDirection')).toBe('Ascending');

    requestCount = requests.length;
    await header.click();
    await expect.poll(() => requests.length).toBeGreaterThan(requestCount);
    await expect.poll(() => requests.at(-1)?.searchParams.get('sortBy')).toBe(column.sortBy);
    await expect.poll(() => requests.at(-1)?.searchParams.get('sortDirection')).toBe('Descending');
  }
});

test('shows compact pagination controls and uses a page size of 10', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/codes**', async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: createRecords(1, Math.min(pageSize, 20)),
        page: Number(url.searchParams.get('page') ?? 1),
        pageSize,
        totalCount: 20,
      },
    });
  });

  await page.goto('/codes');
  const pagination = page.getByRole('navigation', { name: 'Codes Master page selection' });
  await expect(pagination.getByRole('button')).toHaveCount(6);
  await expect(pagination.getByRole('button', { name: 'Page 1' })).toBeVisible();
  await expect(page.locator('.mat-mdc-paginator-page-size')).toHaveCount(0);
  await expect.poll(() => requests.at(-1)?.searchParams.get('pageSize')).toBe('10');
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

test('shows creation audit details when its row control is hovered', async ({ page }) => {
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
  await page.getByRole('button', { name: 'Audit details for CODE-1' }).hover();
  await expect(page.getByRole('tooltip')).toContainText('Created By: ADMIN');
  await expect(page.getByRole('tooltip')).toContainText('Created Date: 15-Jan-2025');
  await expect(page.getByRole('tooltip')).toContainText('Updated By: EDITOR');
  await expect(page.getByRole('tooltip')).toContainText('Updated Date: 20-Feb-2025');
});

test('shows NULL creation audit values as not recorded after pointer activation', async ({
  page,
}) => {
  const record = {
    ...createRecords(1, 1)[0],
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null,
  };
  await page.route('**/api/codes**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { items: [record], page: 1, pageSize: 10, totalCount: 1 },
    });
  });

  await page.goto('/codes');
  await page.getByRole('button', { name: 'Audit details for CODE-1' }).click();

  await expect(page.getByRole('tooltip')).toContainText('Created By: Not recorded');
  await expect(page.getByRole('tooltip')).toContainText('Created Date: Not recorded');
  await expect(page.getByRole('tooltip')).toContainText('Updated By: Not recorded');
  await expect(page.getByRole('tooltip')).toContainText('Updated Date: Not recorded');
});

test('shows filter inputs and controls below their table column headings', async ({ page }) => {
  await page.route('**/api/codes**', async (route) => {
    const url = new URL(route.request().url());
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

  await page.goto('/codes');

  const codeHeader = page.locator('th.mat-column-code');
  const codeFilter = codeHeader.locator('app-column-filter-control');
  await expect(codeFilter.getByLabel('Filter value for Code', { exact: true })).toBeVisible();
  await expect(codeFilter.getByRole('button', { name: 'Filter Code' })).toBeVisible();
  const inputBox = await codeFilter.locator('.filter-input-row').boundingBox();
  const headingBox = await codeHeader.locator('.column-heading').boundingBox();
  expect(inputBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(inputBox!.y).toBeGreaterThan(headingBox!.y);
  const filterRowBoxes = await page
    .locator('tr.mat-mdc-header-row .filter-input-row')
    .evaluateAll((elements) =>
      elements.map((element) => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      }),
    );
  expect(filterRowBoxes).toHaveLength(5);
  expect(
    Math.max(...filterRowBoxes.map((box) => box.y)) -
      Math.min(...filterRowBoxes.map((box) => box.y)),
  ).toBeLessThan(2);
  expect(
    Math.max(...filterRowBoxes.map((box) => box.height)) -
      Math.min(...filterRowBoxes.map((box) => box.height)),
  ).toBeLessThan(2);

  await codeFilter.getByRole('button', { name: 'Filter Code' }).click();
  const operatorPanel = page.getByRole('dialog', { name: 'Filter Code' });
  await expect(operatorPanel).toBeVisible();
  await expect(operatorPanel.getByRole('button', { name: 'Starts With' })).toBeVisible();
  await expect(operatorPanel.getByRole('button', { name: 'Ends With' })).toBeVisible();
  await expect(page.locator('.cdk-overlay-container')).toContainText('Starts With');
  await expect(operatorPanel.locator('xpath=ancestor::table')).toHaveCount(0);
  await page.keyboard.press('Escape');
});

test('filters all records case-insensitively with the selected column operator', async ({
  page,
}) => {
  const requests: URL[] = [];
  await page.route('**/api/codes**', async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    const filtered = url.searchParams.has('codeOperator');
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: filtered ? createRecords(12, 1) : createRecords(1, 10),
        page: Number(url.searchParams.get('page') ?? 1),
        pageSize: 10,
        totalCount: filtered ? 1 : 12,
      },
    });
  });

  await page.goto('/codes');
  await page.getByRole('button', { name: 'Filter Code', exact: true }).click();

  const operators = page.locator('.filter-panel .operator-option');
  await expect(operators).toHaveText([
    'No Filter',
    'Starts With',
    'Ends With',
    'Contains',
    'Does Not Contain',
    'Equal To',
    'Not Equal To',
  ]);
  await page.keyboard.press('Escape');

  for (const [filterOperator, operatorLabel] of [
    ['StartsWith', 'Starts With'],
    ['EndsWith', 'Ends With'],
    ['Contains', 'Contains'],
    ['DoesNotContain', 'Does Not Contain'],
    ['EqualTo', 'Equal To'],
    ['NotEqualTo', 'Not Equal To'],
  ]) {
    await applyColumnFilter(page, 'Code', operatorLabel, 'code-12');

    await expect.poll(() => requests.at(-1)?.searchParams.get('codeOperator')).toBe(filterOperator);
    expect(requests.at(-1)?.searchParams.get('codeValue')).toBe('code-12');
    expect(requests.at(-1)?.searchParams.get('page')).toBe('1');
    await expect(page.getByRole('cell', { name: 'CODE-12', exact: true })).toBeVisible();
  }

  await expect(
    page.getByRole('navigation', { name: 'Codes Master page selection' }).getByRole('button', {
      name: 'Page 1',
    }),
  ).toBeDisabled();
});

test('filters each visible data column', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/codes**', async (route) => {
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

  const filterColumns = [
    { label: 'Code', parameter: 'code' },
    { label: 'Code Description', parameter: 'codeDescription' },
    { label: 'Type', parameter: 'codeType' },
    { label: 'Value 1', parameter: 'value1' },
    { label: 'Value 2', parameter: 'value2' },
  ];

  await page.goto('/codes');

  for (const column of filterColumns) {
    await applyColumnFilter(page, column.label, 'Contains', 'match');
    await expect
      .poll(() => requests.at(-1)?.searchParams.get(`${column.parameter}Operator`))
      .toBe('Contains');
    expect(requests.at(-1)?.searchParams.get(`${column.parameter}Value`)).toBe('match');
  }
});

test('navigates with first, previous, current, next, and last controls', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/codes**', async (route) => {
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

  await page.goto('/codes');
  const pagination = page.getByRole('navigation', { name: 'Codes Master page selection' });
  const paginationRow = page.locator('.pagination-row');
  const rowBox = await paginationRow.boundingBox();
  const controlsBox = await pagination.boundingBox();
  expect(rowBox).not.toBeNull();
  expect(controlsBox).not.toBeNull();
  expect(controlsBox!.x + controlsBox!.width).toBeCloseTo(rowBox!.x + rowBox!.width, 0);
  await expect(pagination.getByRole('button', { name: 'Page 1' })).toHaveCSS(
    'background-color',
    'rgb(96, 68, 47)',
  );
  for (const pageNumber of [1, 2, 3, 4, 5]) {
    await expect(pagination.getByRole('button', { name: `Page ${pageNumber}` })).toBeVisible();
  }

  await pagination.getByRole('button', { name: 'Last page' }).click();
  await expect(pagination.getByRole('button', { name: 'Page 6' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'CODE-51', exact: true })).toBeVisible();
  await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('6');

  await pagination.getByRole('button', { name: 'Previous page' }).click();
  await expect(pagination.getByRole('button', { name: 'Page 5' })).toBeVisible();
  await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('5');
  await pagination.getByRole('button', { name: 'First page' }).click();
  await expect(pagination.getByRole('button', { name: 'Page 1' })).toBeVisible();
  await pagination.getByRole('button', { name: 'Page 2' }).click();
  await expect(pagination.getByRole('button', { name: 'Page 2' })).toBeVisible();
  await expect(pagination.getByRole('button', { name: 'Page 1' })).toHaveCount(0);
  for (const pageNumber of [2, 3, 4, 5, 6]) {
    await expect(pagination.getByRole('button', { name: `Page ${pageNumber}` })).toBeVisible();
  }
  await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('2');
});

test('disables the currently selected page number', async ({ page }) => {
  await page.route('**/api/codes**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: createRecords(1, 10),
        page: 1,
        pageSize: 10,
        totalCount: 52,
      },
    });
  });
  await page.goto('/codes');
  await expect(
    page.getByRole('navigation', { name: 'Codes Master page selection' }).getByRole('button', {
      name: 'Page 1',
    }),
  ).toBeDisabled();
});

test('combines column filters and clears one without clearing the others', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/codes**', async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    const codeValue = url.searchParams.get('codeValue');
    const typeValue = url.searchParams.get('codeTypeValue');
    const filtered = Boolean(codeValue || typeValue);
    const requestedPage = Number(url.searchParams.get('page') ?? 1);
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: filtered
          ? createRecords(12, 1)
          : requestedPage === 1
            ? createRecords(1, 10)
            : createRecords(11, 2),
        page: requestedPage,
        pageSize: 10,
        totalCount: filtered ? 1 : 12,
      },
    });
  });

  await page.goto('/codes');
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByRole('cell', { name: 'CODE-11', exact: true })).toBeVisible();
  await applyColumnFilter(page, 'Code', 'Equal To', 'CODE-12');
  await expect(page.getByRole('cell', { name: 'CODE-12', exact: true })).toBeVisible();
  await applyColumnFilter(page, 'Type', 'Contains', 'general');

  expect(requests.at(-1)?.searchParams.get('codeOperator')).toBe('EqualTo');
  expect(requests.at(-1)?.searchParams.get('codeValue')).toBe('CODE-12');
  expect(requests.at(-1)?.searchParams.get('codeTypeOperator')).toBe('Contains');
  expect(requests.at(-1)?.searchParams.get('codeTypeValue')).toBe('general');
  expect(requests.at(-1)?.searchParams.get('page')).toBe('1');
  await expect(page.getByRole('cell', { name: 'CODE-12', exact: true })).toBeVisible();

  await applyColumnFilter(page, 'Code', 'No Filter');

  expect(requests.at(-1)?.searchParams.has('codeOperator')).toBe(false);
  expect(requests.at(-1)?.searchParams.has('codeValue')).toBe(false);
  expect(requests.at(-1)?.searchParams.get('codeTypeOperator')).toBe('Contains');
  expect(requests.at(-1)?.searchParams.get('codeTypeValue')).toBe('general');
});

test('keeps filters available when the filtered result is empty', async ({ page }) => {
  await page.route('**/api/codes**', async (route) => {
    const url = new URL(route.request().url());
    const hasNoMatch = url.searchParams.get('codeValue') === 'missing';
    await route.fulfill({
      contentType: 'application/json',
      json: {
        items: hasNoMatch ? [] : createRecords(1, 10),
        page: Number(url.searchParams.get('page') ?? 1),
        pageSize: 10,
        totalCount: hasNoMatch ? 0 : 12,
      },
    });
  });

  await page.goto('/codes');
  await applyColumnFilter(page, 'Code', 'Equal To', 'missing');

  await expect(page.getByRole('status')).toContainText('No codes match the applied filters.');
  await expect(page.getByRole('columnheader').first()).toBeVisible();
  await applyColumnFilter(page, 'Code', 'No Filter');
  await expect(page.getByRole('cell', { name: 'CODE-1', exact: true })).toBeVisible();
});
