import { expect, test, type APIRequestContext } from "@playwright/test";
import {
  apiUrl,
  createMakeThroughApi,
  newMakeCode,
  openMake,
  removeMakeThroughApi,
} from "./helpers";

test.describe("Manage vehicle models inline", () => {
  let makeCode = "";
  let createdModelCodes: string[] = [];

  test.beforeEach(async ({ request }) => {
    makeCode = newMakeCode();
    createdModelCodes = [];
    await createMakeThroughApi(request, {
      makeCode,
      makeName: "Model Test Make",
      shortName: "Model Test",
    });
  });

  test.afterEach(async ({ request }) => {
    for (const modelCode of createdModelCodes) {
      await request.delete(
        `${apiUrl}/api/vehicle-makes/${makeCode}/models/${modelCode}`,
      );
    }
    await removeMakeThroughApi(request, makeCode);
  });

  test("shows existing models read-only and leaves model controls off a new-make form", async ({
    page,
    request,
  }) => {
    const modelCode = "READ-ONLY";
    createdModelCodes.push(modelCode);
    await createModelThroughApi(request, makeCode, modelCode);

    await openMake(page, makeCode);

    const row = page.locator("tr.mat-mdc-row").filter({ hasText: modelCode });
    await expect(row).toContainText("Model Test");
    await expect(row.getByRole("button", { name: "Edit" })).toHaveCount(0);
    await expect(row.getByRole("button", { name: "Delete" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Add model" })).toHaveCount(
      0,
    );

    await page.goto("/vehicle-makes/new");
    await expect(
      page.getByRole("heading", { name: "Add vehicle make" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Vehicle Models" }),
    ).toHaveCount(0);
  });

  test("creates, edits, deactivates, restores and permanently deletes a model", async ({
    page,
    request,
  }) => {
    const modelCode = "INLINE-1";
    createdModelCodes.push(modelCode);

    await openMake(page, makeCode);
    await page.getByRole("switch", { name: "Edit" }).click();
    await expect(page.getByText("This make has no models yet.")).toBeVisible();
    await page.getByRole("button", { name: "Add model" }).click();

    await expect(page.getByRole("switch", { name: "Active" })).toBeChecked();
    await page
      .getByLabel("Model Code", { exact: true })
      .fill(modelCode.toLowerCase());
    await page.getByLabel("Model Name", { exact: true }).fill("inline model");
    await page.getByLabel("Short Name", { exact: true }).fill("inline");

    const optionsResponse = await request.get(
      `${apiUrl}/api/vehicle-model-options`,
    );
    expect(optionsResponse.ok()).toBeTruthy();
    const options = (await optionsResponse.json()) as {
      variants: Array<{ code: string; description: string }>;
    };
    const variant = options.variants[0];
    if (!variant) {
      throw new Error(
        "The approved test schema must contain at least one active vehicle variant.",
      );
    }
    await page.getByRole("combobox", { name: "Variant" }).click();
    await page
      .getByRole("option", { name: variant.description, exact: true })
      .click();

    await page.getByRole("switch", { name: "Active" }).click();
    await page.getByRole("button", { name: "Save model" }).click();

    const row = page.locator("tr.mat-mdc-row").filter({ hasText: modelCode });
    await expect(row).toContainText("Inactive");
    let response = await request.get(
      `${apiUrl}/api/vehicle-makes/${makeCode}/models?page=1`,
    );
    expect(response.ok()).toBeTruthy();
    let result = (await response.json()) as {
      items: Array<{ modelCode: string; variant: string | null }>;
    };
    let stored = result.items.find((item) => item.modelCode === modelCode);
    if (!stored) {
      throw new Error(
        `Created model ${modelCode} was not returned by the models list.`,
      );
    }
    expect(stored.modelCode).toBe(modelCode);
    expect(stored.variant).toBe(variant?.code ?? null);

    await row.getByRole("button", { name: "Edit" }).click();
    await expect(page.getByLabel("Model Code", { exact: true })).toBeDisabled();
    await page.getByLabel("Model Name", { exact: true }).fill("updated model");
    await page.getByRole("switch", { name: "Active" }).click();
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(row).toContainText("Updated Model");
    await expect(row).toContainText("Active");

    response = await request.get(
      `${apiUrl}/api/vehicle-makes/${makeCode}/models?page=1`,
    );
    result = (await response.json()) as {
      items: Array<{ modelCode: string; variant: string | null }>;
    };
    stored = result.items.find((item) => item.modelCode === modelCode);
    if (!stored) {
      throw new Error(
        `Updated model ${modelCode} was not returned by the models list.`,
      );
    }
    expect(stored.modelCode).toBe(modelCode);

    await row.getByRole("button", { name: "Delete" }).click();
    await expect(
      page.getByRole("heading", { name: "Delete this vehicle model?" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Delete permanently" }).click();
    await expect(
      page.locator("tr.mat-mdc-row").filter({ hasText: modelCode }),
    ).toHaveCount(0);
    createdModelCodes = createdModelCodes.filter((code) => code !== modelCode);
  });

  test("confirms discarding an unsaved model row and keeps make changes independent", async ({
    page,
  }) => {
    const modelCode = "UNSAVED-1";

    await openMake(page, makeCode);
    await page.getByRole("switch", { name: "Edit" }).click();
    await page
      .getByLabel("Make Name", { exact: true })
      .fill("Unsaved make change");
    await page.getByRole("button", { name: "Add model" }).click();
    await page.getByLabel("Model Code", { exact: true }).fill(modelCode);

    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Discard this model row?" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Keep editing" }).click();
    await expect(page.getByLabel("Model Code", { exact: true })).toHaveValue(
      modelCode,
    );

    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await page.getByRole("button", { name: "Discard changes" }).click();
    await expect(page.getByRole("button", { name: "Add model" })).toBeVisible();
    await expect(page.getByLabel("Make Name", { exact: true })).toHaveValue(
      "Unsaved make change",
    );

    await page.getByRole("button", { name: "Add model" }).click();
    createdModelCodes.push("SAVE-ROW");
    await page.getByLabel("Model Code", { exact: true }).fill("SAVE-ROW");
    await page.getByLabel("Model Name", { exact: true }).fill("Saved row");
    await page.getByLabel("Short Name", { exact: true }).fill("Row");
    await page.getByRole("button", { name: "Save model" }).click();

    await expect(page.getByLabel("Make Name", { exact: true })).toHaveValue(
      "Unsaved make change",
    );
    await expect(page.getByRole("switch", { name: "Edit" })).toBeChecked();
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Vehicle make updated.")).toBeVisible();
  });
});

async function createModelThroughApi(
  request: APIRequestContext,
  makeCode: string,
  modelCode: string,
): Promise<void> {
  const response = await request.post(
    `${apiUrl}/api/vehicle-makes/${makeCode}/models`,
    {
      data: { modelCode, modelName: "Model Test", shortName: "Model Test" },
    },
  );
  if (!response.ok()) {
    throw new Error(
      `Could not create test model ${modelCode}: status ${response.status()}.`,
    );
  }
}
