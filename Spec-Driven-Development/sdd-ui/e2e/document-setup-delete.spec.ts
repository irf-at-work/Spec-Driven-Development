import { expect, test } from '@playwright/test';

const record = {
  docCode: 'DOC-DELETE',
  docName: 'Delete candidate',
  docDescription: null,
  docSetupFor: '101',
  activeYn: 'Y',
  version: 'version-delete-1',
};

function listResult(items: unknown[] = [record]) {
  return { items, page: 1, pageSize: 10, totalCount: items.length };
}

test('confirms deletion with the selected Doc Code and cancellation preserves the record', async ({
  page,
}) => {
  let deleteCount = 0;
  await page.route('**/api/document-setups**', async (route) => {
    if (route.request().method() === 'DELETE') {
      deleteCount += 1;
      await route.fulfill({ status: 204 });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: listResult() });
  });

  await page.goto('/document-setups');
  await page.getByRole('button', { name: 'Delete DOC-DELETE' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('DOC-DELETE');
  await expect(dialog).toContainText('cannot be undone');
  await dialog.getByRole('button', { name: 'Cancel' }).click();

  await expect(page.getByRole('cell', { name: 'DOC-DELETE', exact: true })).toBeVisible();
  expect(deleteCount).toBe(0);
});

test('shows a safe child-blocked conflict and keeps the selected parent', async ({ page }) => {
  await page.route('**/api/document-setups**', async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({
        status: 409,
        contentType: 'application/problem+json',
        json: {
          status: 409,
          title: 'The document setup has applicable modules.',
          detail: 'Delete its Applicable Module rows before deleting the document setup.',
        },
      });
      return;
    }

    await route.fulfill({ contentType: 'application/json', json: listResult() });
  });

  await page.goto('/document-setups');
  await page.getByRole('button', { name: 'Delete DOC-DELETE' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();

  await expect(page.getByRole('dialog')).toContainText(
    'cannot be deleted while Applicable Modules exist',
  );
  await page.getByRole('dialog').getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('cell', { name: 'DOC-DELETE', exact: true })).toBeVisible();
});

test('sends the row version, disables repeated Delete actions, and refreshes after success', async ({
  page,
}) => {
  let deleteCount = 0;
  let deleteUrl = '';
  let releaseDelete: (() => void) | undefined;
  const deleteGate = new Promise<void>((resolve) => {
    releaseDelete = resolve;
  });
  let deleted = false;
  let listRequests = 0;
  await page.route('**/api/document-setups**', async (route) => {
    if (route.request().method() === 'DELETE') {
      deleteCount += 1;
      deleteUrl = route.request().url();
      await deleteGate;
      deleted = true;
      await route.fulfill({ status: 204 });
      return;
    }

    listRequests += 1;
    await route.fulfill({
      contentType: 'application/json',
      json: listResult(deleted ? [] : [record]),
    });
  });

  await page.goto('/document-setups');
  await page.getByRole('button', { name: 'Delete DOC-DELETE' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
  const deleteButton = page.getByRole('button', { name: 'Delete DOC-DELETE' });
  await expect(deleteButton).toBeDisabled();
  await deleteButton.click({ force: true });
  expect(deleteCount).toBe(1);
  releaseDelete?.();

  await expect(page.getByRole('dialog')).toContainText('Document setup deleted successfully.');
  expect(deleteUrl).toContain('expectedVersion=version-delete-1');
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('status')).toContainText('No document setups are available.');
  expect(listRequests).toBe(2);
});
