import { expect, test, type APIRequestContext } from "@playwright/test";
import {
  apiUrl,
  createMakeThroughApi,
  newMakeCode,
  openMake,
  removeMakeThroughApi,
} from "./helpers";

// Models are added and edited on their own pages, opened from the make's page.
test.describe("Manage vehicle models", () => {
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

  test("lists a make's models with their controls, and has no models section on a new-make form", async ({
    page,
    request,
  }) => {
    const modelCode = "LISTED-1";
    createdModelCodes.push(modelCode);
    await createModelThroughApi(request, makeCode, modelCode);

    await openMake(page, makeCode);

    const row = page.locator("tr.mat-mdc-row").filter({ hasText: modelCode });
    await expect(row).toContainText("Model Test");
    await expect(
      row.getByRole("button", { name: `Edit ${modelCode}` }),
    ).toBeVisible();
    await expect(
      row.getByRole("button", { name: `Delete ${modelCode}` }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Add model" })).toBeVisible();

    await page.goto("/vehicle-makes/new");
    await expect(
      page.getByRole("heading", { name: "Add vehicle make" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Vehicle Models" }),
    ).toHaveCount(0);
  });

  test("creates, edits and permanently deletes a model on its own pages", async ({
    page,
    request,
  }) => {
    const modelCode = "INLINE-1";
    createdModelCodes.push(modelCode);

    await openMake(page, makeCode);
    await expect(
      page.getByText(/No models have been added for this make yet/),
    ).toBeVisible();
    await page.getByRole("button", { name: "Add model" }).click();

    await expect(
      page.getByRole("heading", {
        name: `Add Vehicle Model for Make ${makeCode}`,
      }),
    ).toBeVisible();
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
    await page.getByRole("button", { name: "Save vehicle model" }).click();

    await expect(page.getByText("Vehicle model created.")).toBeVisible();
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

    await row.getByRole("button", { name: `Edit ${modelCode}` }).click();
    await expect(page.getByLabel("Model Code", { exact: true })).toBeDisabled();
    await page.getByLabel("Model Name", { exact: true }).fill("updated model");
    await page.getByRole("switch", { name: "Active" }).click();
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Vehicle model updated.")).toBeVisible();
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

    await row.getByRole("button", { name: `Delete ${modelCode}` }).click();
    await expect(
      page.getByRole("heading", { name: "Delete vehicle model" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Delete permanently" }).click();
    await expect(page.getByText("Vehicle model deleted.")).toBeVisible();
    await expect(
      page.locator("tr.mat-mdc-row").filter({ hasText: modelCode }),
    ).toHaveCount(0);
    createdModelCodes = createdModelCodes.filter((code) => code !== modelCode);
  });

  test("asks before discarding an unsaved model", async ({ page }) => {
    const modelCode = "UNSAVED-1";

    await openMake(page, makeCode);
    await page.getByRole("button", { name: "Add model" }).click();
    await page.getByLabel("Model Code", { exact: true }).fill(modelCode);

    await page.getByRole("button", { name: "Back to make" }).click();
    await expect(
      page.getByRole("heading", { name: "Discard your changes?" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Keep editing" }).click();
    await expect(page.getByLabel("Model Code", { exact: true })).toHaveValue(
      modelCode,
    );

    await page.getByRole("button", { name: "Back to make" }).click();
    await page.getByRole("button", { name: "Discard changes" }).click();
    await expect(
      page.getByRole("heading", { name: "Vehicle make details" }),
    ).toBeVisible();
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
