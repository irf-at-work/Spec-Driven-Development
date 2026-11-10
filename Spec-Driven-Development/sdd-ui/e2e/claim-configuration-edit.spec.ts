import { expect, test } from '@playwright/test';

test('CCM Add form uses the required Y/N defaults and Reset restores the initial values', async ({
  page,
}) => {
  await page.route('**/api/claim-configurations/lookups/**', async (route) => {
    const type = new URL(route.request().url()).pathname.split('/').pop();
    const code = type === 'CCM_POST_TYPE' || type === 'CCM_EXCH_RATE' ? '1' : '01';
    await route.fulfill({ json: [{ code, description: 'Sample option' }] });
  });

  await page.goto('/claim-configurations/add');

  await expect(page.getByRole('heading', { name: 'Claim Configuration' })).toBeVisible();
  await expect(page.getByLabel('Claim Config Code')).toBeVisible();
  await expect(page.getByLabel('Claim Config Name')).toBeVisible();
  await expect(page.getByLabel('CCM_COMP_CODE')).toHaveCount(0);

  const printToggle = page.getByRole('switch', { name: 'Print Before Approval Y/N' });
  const activeToggle = page.getByRole('switch', { name: 'Active Y/N' });
  await expect(printToggle).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('button', { name: 'More' }).click();
  await expect(activeToggle).toHaveAttribute('aria-checked', 'true');

  await page.getByLabel('Claim Config Code').fill('CCM-01');
  await page.getByLabel('Claim Config Name').fill('Example');
  await printToggle.click();
  await expect(printToggle).toHaveAttribute('aria-checked', 'true');

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByLabel('Claim Config Code')).toHaveValue('');
  await expect(page.getByLabel('Claim Config Name')).toHaveValue('');
  await expect(printToggle).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('button', { name: 'More' })).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'More' }).click();
  await expect(activeToggle).toHaveAttribute('aria-checked', 'true');
});

test('CCM Add requires only Claim Config Code and Claim Config Name', async ({ page }) => {
  await page.route('**/api/claim-configurations/lookups/**', async (route) => {
    const type = new URL(route.request().url()).pathname.split('/').pop();
    const code = type === 'CCM_POST_TYPE' || type === 'CCM_EXCH_RATE' ? '1' : '01';
    await route.fulfill({ json: [{ code, description: 'Sample option' }] });
  });
  await page.route('**/api/claim-configurations', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        json: { ccmCode: 'CCM-02', ccmName: 'Example', version: 'v1' },
      });
      return;
    }

    await route.continue();
  });
  await page.route('**/api/claim-configurations/CCM-02', async (route) => {
    await route.fulfill({
      json: {
        ccmCode: 'CCM-02',
        ccmName: 'Example',
        version: 'v1',
      },
    });
  });
  await page.route('**/api/claim-configurations/CCM-02/products', async (route) => {
    await route.fulfill({ json: [] });
  });

  await page.goto('/claim-configurations/add');
  await page.getByLabel('Claim Config Code').fill('CCM-02');
  await page.getByLabel('Claim Config Name').fill('Example');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page).toHaveURL(/\/claim-configurations\/CCM-02\/edit$/);
});

test('CCM Add header action clears the form and restores defaults', async ({ page }) => {
  await page.route('**/api/claim-configurations/lookups/**', async (route) => {
    await route.fulfill({ json: [] });
  });

  await page.goto('/claim-configurations/add');
  const header = page.locator('.page-header');
  await expect(header.getByRole('button', { name: 'Add' })).toBeVisible();
  await expect(header.getByRole('button', { name: 'Back' })).toBeVisible();

  await page.getByLabel('Claim Config Code').fill('CCM-03');
  await page.getByLabel('Claim Config Name').fill('Temporary');
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole('switch', { name: 'Print Before Approval Y/N' }).click();
  await page.getByRole('switch', { name: 'Active Y/N' }).click();

  await header.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByLabel('Claim Config Code')).toHaveValue('');
  await expect(page.getByLabel('Claim Config Name')).toHaveValue('');
  await expect(page.getByRole('button', { name: 'More' })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('switch', { name: 'Print Before Approval Y/N' })).toHaveAttribute(
    'aria-checked',
    'false',
  );
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('switch', { name: 'Active Y/N' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
});

test('CCM edit page Add action opens a fresh Add page', async ({ page }) => {
  const lookupTypes: string[] = [];
  await page.route('**/api/claim-configurations/lookups/**', async (route) => {
    const type = new URL(route.request().url()).pathname.split('/').pop() ?? '';
    lookupTypes.push(type);
    await route.fulfill({
      json:
        type === 'CCM_DFLT_RECV_DEDU'
          ? [{ code: 'REC-01', description: 'Recovery Code' }]
          : [],
    });
  });
  await page.route('**/api/claim-configurations/CCM-01', async (route) => {
    await route.fulfill({
      json: {
        ccmCode: 'CCM-01',
        ccmName: 'Claims',
        version: 'v1',
      },
    });
  });
  await page.route('**/api/claim-configurations/CCM-01/products', async (route) => {
    await route.fulfill({ json: [] });
  });

  await page.goto('/claim-configurations/CCM-01/edit');
  await expect.poll(() => lookupTypes).toContain('CCM_DFLT_RECV_DEDU');
  const addButton = page.locator('.page-header').getByRole('button', { name: 'Add' });
  await expect(addButton).toBeVisible();
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
  await addButton.click();

  await expect(page).toHaveURL(/\/claim-configurations\/add$/);
  await expect(page.getByLabel('Claim Config Code')).toHaveValue('');
});
