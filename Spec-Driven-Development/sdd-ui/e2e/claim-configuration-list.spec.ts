import { expect, test } from '@playwright/test';

const listResponse = {
  items: [
    {
      ccmCode: 'CCM-01',
      ccmName: 'Claims Configuration',
      ccmShortName: 'CLAIMS',
      moduleName: 'Claims',
    },
  ],
  page: 1,
  pageSize: 10,
  totalCount: 1,
};

test('opens the CCM listing and sends filtering to the server', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/claim-configurations**', async (route) => {
    requests.push(new URL(route.request().url()));
    await route.fulfill({ json: listResponse });
  });

  await page.goto('/claim-configurations');
  await expect(page.getByRole('heading', { name: 'Claim Configuration Master' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'CCM-01', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add' })).toHaveAttribute(
    'href',
    '/claim-configurations/add',
  );

  await page.getByRole('textbox', { name: 'Filter value for Claim Config Code' }).fill('CCM');
  await page.getByRole('button', { name: 'Filter Claim Config Code' }).click();
  await page.getByRole('button', { name: 'Starts With' }).click();
  await page.getByRole('button', { name: 'Apply filter for Claim Config Code' }).click();

  await expect.poll(() => requests.length).toBeGreaterThan(1);
  const filteredRequest = requests.at(-1)!;
  expect(filteredRequest.searchParams.get('ccmCodeOperator')).toBe('StartsWith');
  expect(filteredRequest.searchParams.get('ccmCodeValue')).toBe('CCM');
  expect(filteredRequest.searchParams.get('page')).toBe('1');
});

test('shows an explicit server error instead of an empty successful list', async ({ page }) => {
  await page.route('**/api/claim-configurations**', async (route) => {
    await route.fulfill({ status: 500, json: { title: 'Unexpected error' } });
  });

  await page.goto('/claim-configurations');
  await expect(
    page.getByRole('alert').getByText('The claim configurations could not be loaded. Please try again.'),
  ).toBeVisible();
});
