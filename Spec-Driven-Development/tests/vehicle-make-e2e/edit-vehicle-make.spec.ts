import { expect, test } from '@playwright/test';
import { apiUrl, createMakeThroughApi, newMakeCode, openMake, removeMakeThroughApi } from './helpers';

test.describe('Open and edit a vehicle make', () => {
  let makeCode = '';

  test.beforeEach(async ({ request }) => {
    makeCode = newMakeCode();
    await createMakeThroughApi(request, { makeCode, makeName: 'Edit Me', shortName: 'Edit' });
  });

  test.afterEach(async ({ request }) => {
    await removeMakeThroughApi(request, makeCode);
  });

  test('saves a valid change after Edit is switched on, and the code stays locked', async ({ page }) => {
    await openMake(page, makeCode);
    await page.getByRole('switch', { name: 'Edit' }).click();

    await expect(page.getByLabel('Make Code', { exact: true })).toBeDisabled();
    await page.getByLabel('Make Name', { exact: true }).fill('renamed make');
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByText('Vehicle make updated.')).toBeVisible();
    await expect(page.getByLabel('Make Name', { exact: true })).toHaveValue('Renamed Make');
    await expect(page.getByLabel('Make Name', { exact: true })).toBeDisabled();
  });

  test('shows what is wrong and saves nothing when a change is invalid', async ({ page }) => {
    await openMake(page, makeCode);
    await page.getByRole('switch', { name: 'Edit' }).click();

    await page.getByLabel('Make Name', { exact: true }).fill('');
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByText('Make Name is required.')).toBeVisible();
  });

  test('opens Additional Information by itself when it holds data', async ({ page, request }) => {
    const withRemarks = newMakeCode();
    await request.post(`${apiUrl}/api/vehicle-makes`, {
      data: { makeCode: withRemarks, makeName: 'Has Remarks', shortName: 'Remarks', remarks: 'Some remarks' },
    });

    try {
      await openMake(page, withRemarks);
      await expect(page.getByLabel('Remarks', { exact: true })).toBeVisible();
    } finally {
      await removeMakeThroughApi(request, withRemarks);
    }
  });

  test('deactivates and restores a make with the Active switch', async ({ page }) => {
    await openMake(page, makeCode);
    await page.getByRole('switch', { name: 'Edit' }).click();
    await page.getByRole('switch', { name: 'Active' }).click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Vehicle make updated.')).toBeVisible();
    await expect(page.getByRole('switch', { name: 'Active' })).not.toBeChecked();

    await page.getByRole('switch', { name: 'Edit' }).click();
    await page.getByRole('switch', { name: 'Active' }).click();
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByRole('switch', { name: 'Active' })).toBeChecked();
  });

  test('asks before discarding unsaved changes: keep editing, then discard', async ({ page }) => {
    await openMake(page, makeCode);
    await page.getByRole('switch', { name: 'Edit' }).click();
    await page.getByLabel('Make Name', { exact: true }).fill('Unsaved Name');

    await page.getByRole('switch', { name: 'Edit' }).click();
    await expect(page.getByRole('heading', { name: 'Discard your changes?' })).toBeVisible();
    await page.getByRole('button', { name: 'Keep editing' }).click();
    await expect(page.getByLabel('Make Name', { exact: true })).toHaveValue('Unsaved Name');
    await expect(page.getByLabel('Make Name', { exact: true })).toBeEnabled();

    await page.getByRole('switch', { name: 'Edit' }).click();
    await page.getByRole('button', { name: 'Discard changes' }).click();
    await expect(page.getByLabel('Make Name', { exact: true })).toHaveValue('Edit Me');
    await expect(page.getByLabel('Make Name', { exact: true })).toBeDisabled();
  });
});
