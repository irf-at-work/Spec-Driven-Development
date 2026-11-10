import { expect, test } from '@playwright/test';

test('manages Applicable Products with lookup validation and refreshed rows', async ({ page }) => {
  let products: { productCode: string; productName: string }[] = [];
  let productVersion = 'version-1';
  let productLookupType = '';
  await page.route('**/api/claim-configurations/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    if (path.includes('/lookups/')) {
      productLookupType = path.split('/').at(-1) ?? '';
      await route.fulfill({
        json: [
          { code: 'PRD-01', description: 'Product One' },
          { code: 'PRD-02', description: 'Product Two' },
        ],
      });
      return;
    }

    if (path.endsWith('/products') && request.method() === 'GET') {
      await route.fulfill({ json: products });
      return;
    }

    if (path.endsWith('/products') && request.method() === 'POST') {
      const { productCode } = request.postDataJSON() as { productCode: string };
      products = [
        ...products,
        { productCode, productName: productCode === 'PRD-01' ? 'Product One' : 'Product Two' },
      ];
      await route.fulfill({
        status: 201,
        json: {
          parentCcmCode: 'CCM-01',
          productCode,
          productName: products.at(-1)?.productName,
          version: productVersion,
        },
      });
      return;
    }

    if (path.endsWith('/products/PRD-01') && request.method() === 'GET') {
      await route.fulfill({
        json: {
          parentCcmCode: 'CCM-01',
          productCode: 'PRD-01',
          productName: 'Product One',
          version: productVersion,
        },
      });
      return;
    }

    if (path.endsWith('/products/PRD-01') && request.method() === 'PUT') {
      const { productCode } = request.postDataJSON() as { productCode: string };
      products = [{ productCode, productName: 'Product Two' }];
      productVersion = 'version-2';
      await route.fulfill({
        json: {
          parentCcmCode: 'CCM-01',
          productCode,
          productName: 'Product Two',
          version: productVersion,
        },
      });
      return;
    }

    if (path.endsWith('/products/PRD-02') && request.method() === 'DELETE') {
      products = [];
      await route.fulfill({ status: 204 });
      return;
    }

    if (path.endsWith('/CCM-01') && request.method() === 'GET') {
      await route.fulfill({
        json: {
          ccmCode: 'CCM-01',
          ccmName: 'Claims',
          ccmShortName: null,
          nameInArabic: null,
          shortNameInArabic: null,
          module: null,
          moduleDescription: null,
          postingType: null,
          postingTypeDescription: null,
          exchangeRateType: null,
          exchangeRateTypeDescription: null,
          roundingType: null,
          roundingTypeDescription: null,
          roundingValue: null,
          applicableCurrencies: null,
          applicableCurrenciesDescription: null,
          defaultEstimateCloseReasonCode: null,
          defaultEstimateCloseReasonDescription: null,
          defaultRecoveryCodeForDedl: null,
          defaultRecoveryCodeForDedlDescription: null,
          printBeforeApprovalYn: 'N',
          rePrintAllowedYn: 'N',
          claimAccountDocumentGenerationYn: 'N',
          sharingClaimsAccountDocumentGenerationYn: 'N',
          activeYn: 'Y',
          version: 'parent-version',
        },
      });
      return;
    }

    await route.fulfill({ status: 404, json: { title: 'Not found' } });
  });

  await page.goto('/claim-configurations/CCM-01/edit');
  const productsSection = page.getByRole('region', { name: 'Applicable Products' });
  await productsSection.getByRole('button', { name: 'Add', exact: true }).click();
  const addDialog = page.getByRole('dialog', { name: 'Add Applicable Product' });
  await expect(addDialog.getByRole('button', { name: 'Cancel' })).toHaveCount(0);
  await addDialog.getByLabel('Product Code').click();
  await expect(page.getByRole('option').first()).toHaveText('Select');
  await page.getByRole('option', { name: 'PRD-01 — Product One' }).click();
  await addDialog.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('cell', { name: 'PRD-01', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Product One', exact: true })).toBeVisible();
  expect(productLookupType).toBe('CCM_PRODUCT');

  await productsSection.getByRole('button', { name: 'Add', exact: true }).click();
  const duplicateDialog = page.getByRole('dialog', { name: 'Add Applicable Product' });
  await duplicateDialog.getByLabel('Product Code').click();
  await page.getByRole('option', { name: 'PRD-01 — Product One' }).click();
  await duplicateDialog.getByRole('button', { name: 'Save' }).click();
  await expect(duplicateDialog.getByRole('alert')).toContainText('already mapped');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Edit product PRD-01' }).click();
  const editDialog = page.getByRole('dialog', { name: 'Edit Applicable Product' });
  await editDialog.getByLabel('Product Code').click();
  await page.getByRole('option', { name: 'PRD-02 — Product Two' }).click();
  await editDialog.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('cell', { name: 'PRD-02', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Product Two', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Delete product PRD-02' }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'PRD-02', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Delete product PRD-02' }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('No Applicable Products are mapped to this claim configuration.')).toBeVisible();
});

test('filters Applicable Products by Product Code and Product Name', async ({ page }) => {
  await page.route('**/api/claim-configurations/**', async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    if (path.includes('/lookups/')) {
      await route.fulfill({ json: [] });
      return;
    }
    if (path.endsWith('/products')) {
      await route.fulfill({
        json: [
          { productCode: 'PRD-01', productName: 'Alpha Product' },
          { productCode: 'PRD-02', productName: 'Product Two' },
        ],
      });
      return;
    }
    if (path.endsWith('/CCM-01')) {
      await route.fulfill({
        json: {
          ccmCode: 'CCM-01',
          ccmName: 'Claims',
          version: 'parent-version',
        },
      });
      return;
    }
    await route.fulfill({ status: 404, json: { title: 'Not found' } });
  });

  await page.goto('/claim-configurations/CCM-01/edit');
  await expect(page.getByRole('cell', { name: 'PRD-01', exact: true })).toBeVisible();
  const secondProductCode = page.getByRole('cell', { name: 'PRD-02', exact: true });
  await expect(secondProductCode).toBeVisible();
  await expect(secondProductCode).toHaveCSS('background-color', 'rgb(247, 245, 242)');

  await page.getByLabel('Filter value for Product Code').fill('prd');
  await page.getByRole('button', { name: 'Filter Product Code' }).click();
  await page.getByRole('button', { name: 'Contains', exact: true }).last().click();
  await page.getByRole('button', { name: 'Apply filter for Product Code' }).click();

  await page.getByLabel('Filter value for Product Name').fill('alpha');
  await page.getByRole('button', { name: 'Filter Product Name' }).click();
  await page.getByRole('button', { name: 'Contains', exact: true }).last().click();
  await page.getByRole('button', { name: 'Apply filter for Product Name' }).click();

  await expect(page.getByRole('cell', { name: 'PRD-01', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'PRD-02', exact: true })).toHaveCount(0);
  await expect(page.getByRole('cell', { name: 'Alpha Product', exact: true })).toBeVisible();
  await expect(
    page.locator('button[aria-label="Edit product PRD-01"] svg path'),
  ).toHaveCount(1);
  await expect(
    page.locator('button[aria-label="Delete product PRD-01"] svg path'),
  ).toHaveCount(1);

  await page.getByRole('button', { name: 'Filter Product Code' }).click();
  await page.getByRole('button', { name: 'Equal To', exact: true }).click();
  await page.getByLabel('Filter value for Product Code').fill('MISSING');
  await page.getByRole('button', { name: 'Apply filter for Product Code' }).click();
  await expect(page.getByText('No Applicable Products match the applied filters.')).toBeVisible();

  await page.getByRole('button', { name: 'Clear product filters' }).click();
  await expect(page.getByRole('cell', { name: 'PRD-02', exact: true })).toBeVisible();
});
