import { buildTrail, isBreadcrumbPage } from './breadcrumb';

describe('buildTrail', () => {
  const none = { makeCode: null, modelCode: null };
  const toyota = { makeCode: 'TOY', modelCode: null };
  const corolla = { makeCode: 'TOY', modelCode: 'COROLLA' };

  const labels = (trail: ReturnType<typeof buildTrail>) => trail.map((crumb) => crumb.label);

  it('shows only where you are on the list page, with no link on the current step', () => {
    const trail = buildTrail('makes', none);

    expect(labels(trail)).toEqual(['Master Data', 'Vehicle Makes']);
    expect(trail[1].link).toBeUndefined();
  });

  it('links back to the list from the add-make page', () => {
    const trail = buildTrail('make-new', none);

    expect(labels(trail)).toEqual(['Master Data', 'Vehicle Makes', 'Add vehicle make']);
    expect(trail[1].link).toEqual(['/vehicle-makes']);
  });

  it('names the open make by its code, with a plain fallback when the code is not known', () => {
    expect(labels(buildTrail('make-view', toyota))).toEqual(['Master Data', 'Vehicle Makes', 'TOY']);
    expect(labels(buildTrail('make-view', none))[2]).toBe('Vehicle make');
  });

  it('puts the make between the list and the add-model page, and links to it with its code in the state', () => {
    const trail = buildTrail('model-new', toyota);

    expect(labels(trail)).toEqual(['Master Data', 'Vehicle Makes', 'TOY', 'Add model']);
    expect(trail[2].link).toEqual(['/vehicle-makes/view']);
    expect(trail[2].state).toEqual({ makeCode: 'TOY' });
  });

  it('names the model being edited', () => {
    expect(labels(buildTrail('model-edit', corolla))).toEqual([
      'Master Data',
      'Vehicle Makes',
      'TOY',
      'Edit COROLLA',
    ]);
  });

  it('never links the current step', () => {
    for (const page of ['makes', 'make-new', 'make-view', 'model-new', 'model-edit'] as const) {
      const trail = buildTrail(page, corolla);
      expect(trail[trail.length - 1].link).toBeUndefined();
    }
  });
});

describe('isBreadcrumbPage', () => {
  it('accepts the known pages only', () => {
    expect(isBreadcrumbPage('model-edit')).toBe(true);
    expect(isBreadcrumbPage('somewhere-else')).toBe(false);
    expect(isBreadcrumbPage(undefined)).toBe(false);
  });
});
