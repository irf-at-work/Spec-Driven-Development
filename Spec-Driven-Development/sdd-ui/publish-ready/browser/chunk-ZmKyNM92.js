import {
  Ct as _N,
  G as ON,
  Hn as wp,
  In as up,
  Jn as yE,
  L as Ko,
  Lt as dT,
  N as Ib,
  Un as xN,
  Y as P_,
  _ as DE,
  b as Eb,
  c as AN,
  ct as Uc,
  dt as Wm,
  hn as mp,
  it as Sc,
  jn as tb,
  k as Hc,
  kn as sp,
  kt as b,
  m as Ce,
  o as $N,
  ot as UN,
  qn as yA,
  sn as kN,
  ut as Vc,
  yt as Ym,
} from './main-RR6WM3XY.js';
import { c as Rs, i as Hi, k as ks, x as bi } from './chunk-CnuPNpsB.js';
import { t as We } from './chunk-BbQnuOdJ.js';
var E = dT(We());
var K = (a, i) => i.rowNumber;
function Q(a, i) {
  if ((a & 1 && (Sc(0, `p`, 11), yA(1), up()), a & 2)) {
    let e = $N();
    (P_(), mp(`Selected: `, e.fileName()));
  }
}
function Z(a, i) {
  if ((a & 1 && Vc(0, `mat-progress-bar`, 12), a & 2)) {
    let e = $N();
    Uc(`aria-label`, e.loading() ? `Checking workbook` : `Importing lookup rows`);
  }
}
function ee(a, i) {
  if ((a & 1 && (Sc(0, `div`, 13), yA(1), up()), a & 2)) {
    let e = $N();
    (P_(), Eb(e.errorMessage()));
  }
}
function te(a, i) {
  if ((a & 1 && (Sc(0, `div`, 14), yA(1), up()), a & 2)) {
    let e = $N();
    (P_(), Eb(e.resultMessage()));
  }
}
function ne(a, i) {
  if ((a & 1 && (Sc(0, `p`), yA(1), up()), a & 2)) {
    let e = i.$implicit;
    (P_(), Eb(e));
  }
}
function ie(a, i) {
  if ((a & 1 && (Sc(0, `div`, 13), ON(1, ne, 2, 1, `p`, null, xN), up()), a & 2)) {
    let e = $N();
    (P_(), kN(e.errors));
  }
}
function oe(a, i) {
  if ((a & 1 && (Sc(0, `span`, 20), yA(1), up()), a & 2)) {
    let e = $N().$implicit;
    (P_(), mp(`Invalid: `, e.errors.join(` `)));
  }
}
function re(a, i) {
  a & 1 && (Sc(0, `span`, 21), yA(1, `Already exists; will skip`), up());
}
function ae(a, i) {
  a & 1 && (Sc(0, `span`, 22), yA(1, `Ready to insert`), up());
}
function le(a, i) {
  if (
    (a & 1 &&
      (Sc(0, `tr`)(1, `td`),
      yA(2),
      up(),
      Sc(3, `td`),
      yA(4),
      up(),
      Sc(5, `td`),
      yA(6),
      up(),
      Sc(7, `td`),
      yA(8),
      up(),
      Sc(9, `td`),
      yA(10),
      up(),
      Sc(11, `td`),
      _N(12, oe, 2, 1, `span`, 20)(13, re, 2, 0, `span`, 21)(14, ae, 2, 0, `span`, 22),
      up()()),
    a & 2)
  ) {
    let e = i.$implicit;
    (P_(2),
      Eb(e.rowNumber),
      P_(2),
      Eb(e.listType),
      P_(2),
      Eb(e.code),
      P_(2),
      Eb(e.description),
      P_(2),
      Eb(e.active),
      P_(2),
      AN(e.isValid ? (e.alreadyExists ? 13 : 14) : 12));
  }
}
function se(a, i) {
  if (a & 1) {
    let e = UN();
    (_N(0, ie, 3, 0, `div`, 13),
      Sc(1, `section`, 15)(2, `div`, 16)(3, `div`)(4, `h2`, 17),
      yA(5, `Import preview`),
      up(),
      Sc(6, `p`),
      yA(7),
      up()(),
      Sc(8, `button`, 18),
      Hc(`click`, function () {
        Wm(e);
        let s = $N();
        return Ym(s.importRows());
      }),
      yA(9, ` Import valid rows `),
      up()(),
      Sc(10, `div`, 19)(11, `table`)(12, `thead`)(13, `tr`)(14, `th`),
      yA(15, `Excel row`),
      up(),
      Sc(16, `th`),
      yA(17, `LI_TYPE`),
      up(),
      Sc(18, `th`),
      yA(19, `LI_CODE`),
      up(),
      Sc(20, `th`),
      yA(21, `LI_DESC`),
      up(),
      Sc(22, `th`),
      yA(23, `Active`),
      up(),
      Sc(24, `th`),
      yA(25, `Result`),
      up()()(),
      Sc(26, `tbody`),
      ON(27, le, 15, 6, `tr`, null, K),
      up()()()());
  }
  if (a & 2) {
    let e = i,
      r = $N();
    (AN(e.errors.length > 0 ? 0 : -1),
      P_(7),
      Ib(
        ` `,
        e.rows.length,
        ` rows · `,
        r.newRowCount(),
        ` new · `,
        r.existingRowCount(),
        ` existing `,
      ),
      P_(),
      tb(`disabled`, !r.canImport() || r.importing()),
      P_(19),
      kN(e.rows));
  }
}
var de = 5242880;
var $ = 1e3;
var q = [`LI_TYPE`, `LI_CODE`, `LI_DESC`, `LI_ACTIVE_YN`];
var ce = [
  [`VEH_VARIANT`, `STD`, `Standard`, `Y`],
  [`VEH_TYPE`, `SEDAN`, `Sedan`, `Y`],
  [`VEH_BODY_TYPE`, `SUV`, `Sports Utility Vehicle`, `Y`],
  [`VEH_FUEL_TYPE`, `PETROL`, `Petrol`, `Y`],
  [`VEH_CYLINDER`, `4`, `4 Cylinders`, `Y`],
  [`VEH_DOORS`, `4`, `4 Doors`, `Y`],
  [`VEH_DRIVING_TYPE`, `AWD`, `All-Wheel Drive`, `Y`],
  [`VEH_BODY_COLOR`, `WHITE`, `White`, `Y`],
  [`VEH_CATEGORY`, `PRIVATE`, `Private`, `Y`],
];
var z = class a {
  router = b(Ko);
  optionsClient = b(DE);
  notifications = b(yE);
  fileName = Ce(``);
  errorMessage = Ce(``);
  preview = Ce(null);
  loading = Ce(!1);
  importing = Ce(!1);
  resultMessage = Ce(``);
  canImport = wp(() => {
    let i = this.preview();
    return (
      !!i &&
      i.errors.length === 0 &&
      i.rows.length > 0 &&
      i.rows.every((e) => e.isValid) &&
      i.rows.some((e) => !e.alreadyExists)
    );
  });
  newRowCount = wp(
    () => this.preview()?.rows.filter((i) => i.isValid && !i.alreadyExists).length ?? 0,
  );
  existingRowCount = wp(() => this.preview()?.rows.filter((i) => i.alreadyExists).length ?? 0);
  back() {
    this.router.navigate([`/vehicle-makes`]);
  }
  async downloadTemplate() {
    let i = new E.Workbook(),
      e = i.addWorksheet(`STD_LIST_ITEM`);
    e.addRow([...q]);
    for (let p of ce) e.addRow(p);
    ((e.views = [{ state: `frozen`, ySplit: 1 }]),
      (e.columns = [
        { width: 24, style: { numFmt: `@` } },
        { width: 18, style: { numFmt: `@` } },
        { width: 34 },
        { width: 20, style: { numFmt: `@` } },
      ]),
      (e.getRow(1).font = { bold: !0 }));
    let r = await i.xlsx.writeBuffer(),
      s = new Blob([r], {
        type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
      }),
      c = URL.createObjectURL(s),
      d = document.createElement(`a`);
    ((d.href = c),
      (d.download = `vehicle-model-dropdown-template.xlsx`),
      d.click(),
      URL.revokeObjectURL(c));
  }
  async onFileSelected(i) {
    let e = i.target,
      r = e.files?.[0];
    if ((this.preview.set(null), this.resultMessage.set(``), this.errorMessage.set(``), !!r)) {
      if ((this.fileName.set(r.name), (e.value = ``), !r.name.toLowerCase().endsWith(`.xlsx`))) {
        this.errorMessage.set(`Choose an Excel .xlsx workbook.`);
        return;
      }
      if (r.size > de) {
        this.errorMessage.set(`The workbook must be 5 MB or smaller.`);
        return;
      }
      this.loading.set(!0);
      try {
        let s = await this.readWorkbook(r);
        if (s.length === 0) {
          this.errorMessage.set(`The worksheet has no data rows.`);
          return;
        }
        if (s.length > $) {
          this.errorMessage.set(`The workbook can contain no more than ${$} data rows.`);
          return;
        }
        let c = { rows: s };
        this.optionsClient.previewImport(c).subscribe({
          next: (d) => {
            (this.preview.set(d), this.loading.set(!1));
          },
          error: () => {
            (this.errorMessage.set(`The workbook could not be checked. Please try again.`),
              this.loading.set(!1));
          },
        });
      } catch {
        (this.errorMessage.set(
          `The workbook could not be read. Check that it is a valid .xlsx file.`,
        ),
          this.loading.set(!1));
      }
    }
  }
  async importRows() {
    let i = this.preview();
    if (!i || !this.canImport()) return;
    let e = i.rows.filter((d) => !d.alreadyExists).length,
      r = i.rows.length - e;
    if (
      !(await this.notifications.confirm({
        title: `Import vehicle dropdown choices?`,
        text: `${e} new rows will be inserted. ${r} existing rows will be skipped. Existing data will not be changed.`,
        confirmButtonText: `Import rows`,
        cancelButtonText: `Cancel`,
      }))
    )
      return;
    this.importing.set(!0);
    let c = {
      rows: i.rows.map((d) => ({
        rowNumber: d.rowNumber,
        listType: d.listType,
        code: d.code,
        description: d.description,
        active: d.active,
      })),
    };
    this.optionsClient.import(c).subscribe({
      next: (d) => {
        (this.importing.set(!1),
          this.resultMessage.set(
            `Import complete: ${d.insertedCount} inserted, ${d.skippedExistingCount} existing rows skipped.`,
          ),
          this.notifications.success(`Vehicle dropdown choices imported.`),
          this.optionsClient.previewImport(c).subscribe({ next: (p) => this.preview.set(p) }));
      },
      error: () => {
        (this.importing.set(!1),
          this.errorMessage.set(
            `The import could not be confirmed. The preview is being refreshed; check row statuses before retrying.`,
          ),
          this.optionsClient.previewImport(c).subscribe({ next: (d) => this.preview.set(d) }));
      },
    });
  }
  async readWorkbook(i) {
    let e = new E.Workbook();
    await e.xlsx.load(await i.arrayBuffer());
    let r = e.getWorksheet(`STD_LIST_ITEM`);
    if (!r) throw new Error(`Required worksheet not found.`);
    let s = /* @__PURE__ */ new Map();
    r.getRow(1).eachCell((p, f) => {
      s.set(this.cellText(p).trim().toUpperCase(), f);
    });
    let c = q.filter((p) => !s.has(p));
    if (c.length > 0) throw new Error(`Missing columns: ${c.join(`, `)}`);
    let d = [];
    return (
      r.eachRow({ includeEmpty: !1 }, (p, f) => {
        if (f === 1) return;
        let I = this.cellText(p.getCell(s.get(`LI_TYPE`))),
          O = this.cellText(p.getCell(s.get(`LI_CODE`))),
          k = this.cellText(p.getCell(s.get(`LI_DESC`))),
          S = this.cellText(p.getCell(s.get(`LI_ACTIVE_YN`)));
        [I, O, k, S].some((G) => G.trim() !== ``) &&
          d.push({ rowNumber: f, listType: I, code: O, description: k, active: S });
      }),
      d
    );
  }
  cellText(i) {
    let e = i.value;
    if (e == null) return ``;
    if (typeof e == `string` || typeof e == `number` || typeof e == `boolean`) return String(e);
    if (typeof e == `object` && `text` in e && typeof e.text == `string`) return e.text;
    if (typeof e == `object` && `result` in e) {
      let r = e.result;
      return typeof r == `string` || typeof r == `number` ? String(r) : ``;
    }
    return ``;
  }
  static ɵfac = function (e) {
    return new (e || a)();
  };
  static ɵcmp = sp({
    type: a,
    selectors: [[`app-vehicle-model-options-import`]],
    decls: 51,
    vars: 6,
    consts: [
      [1, `page`],
      [1, `page-header`],
      [1, `title-row`],
      [1, `subtitle`],
      [1, `header-actions`],
      [
        `action`,
        `back`,
        `tooltip`,
        `Back to vehicle makes`,
        `accessibleName`,
        `Back to vehicle makes`,
        3,
        `clicked`,
      ],
      [`matButton`, `outlined`, `type`, `button`, 3, `click`],
      [1, `card`, `instructions`],
      [1, `card`, `uploader`],
      [`for`, `lookup-workbook`],
      [
        `id`,
        `lookup-workbook`,
        `type`,
        `file`,
        `accept`,
        `.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
        3,
        `change`,
        `disabled`,
      ],
      [1, `file-name`],
      [`mode`, `indeterminate`],
      [`role`, `alert`, 1, `message`, `error`],
      [`role`, `status`, 1, `message`, `success`],
      [`aria-labelledby`, `preview-heading`, 1, `card`, `preview`],
      [1, `preview-header`],
      [`id`, `preview-heading`],
      [`matButton`, `filled`, `type`, `button`, 3, `click`, `disabled`],
      [1, `table-scroll`],
      [1, `invalid`],
      [1, `skipped`],
      [1, `ready`],
    ],
    template: function (e, r) {
      if (
        (e & 1 &&
          (Sc(0, `section`, 0)(1, `header`, 1)(2, `div`, 2)(3, `div`)(4, `h1`),
          yA(5, `Import Vehicle Dropdown Choices`),
          up(),
          Sc(6, `p`, 3),
          yA(7, `Upload approved choices for the vehicle model dropdowns.`),
          up()()(),
          Sc(8, `div`, 4)(9, `app-icon-button`, 5),
          Hc(`clicked`, function () {
            return r.back();
          }),
          up(),
          Sc(10, `button`, 6),
          Hc(`click`, function () {
            return r.downloadTemplate();
          }),
          yA(11, ` Download Excel template `),
          up()()(),
          Sc(12, `div`, 7)(13, `h2`),
          yA(14, `Workbook format`),
          up(),
          Sc(15, `p`),
          yA(16, ` Use the `),
          Sc(17, `strong`),
          yA(18, `STD_LIST_ITEM`),
          up(),
          yA(19, ` worksheet and the columns `),
          Sc(20, `code`),
          yA(21, `LI_TYPE`),
          up(),
          yA(22, `, `),
          Sc(23, `code`),
          yA(24, `LI_CODE`),
          up(),
          yA(25, `, `),
          Sc(26, `code`),
          yA(27, `LI_DESC`),
          up(),
          yA(28, `, and `),
          Sc(29, `code`),
          yA(30, `LI_ACTIVE_YN`),
          up(),
          yA(31, `. `),
          up(),
          Sc(32, `p`),
          yA(33, ` Only the nine vehicle model list types are accepted. Active values must be `),
          Sc(34, `code`),
          yA(35, `Y`),
          up(),
          yA(36, ` or `),
          Sc(37, `code`),
          yA(38, `N`),
          up(),
          yA(39, `. Existing codes are skipped and never overwritten. `),
          up(),
          Sc(40, `p`),
          yA(41, `Maximum file size: 5 MB. Maximum data rows: 1,000.`),
          up()(),
          Sc(42, `div`, 8)(43, `label`, 9),
          yA(44, `Choose workbook (.xlsx)`),
          up(),
          Sc(45, `input`, 10),
          Hc(`change`, function (c) {
            return r.onFileSelected(c);
          }),
          up(),
          _N(46, Q, 2, 1, `p`, 11),
          up(),
          _N(47, Z, 1, 1, `mat-progress-bar`, 12),
          _N(48, ee, 2, 1, `div`, 13),
          _N(49, te, 2, 1, `div`, 14),
          _N(50, se, 29, 5),
          up()),
        e & 2)
      ) {
        let s;
        (P_(45),
          tb(`disabled`, r.loading() || r.importing()),
          P_(),
          AN(r.fileName() ? 46 : -1),
          P_(),
          AN(r.loading() || r.importing() ? 47 : -1),
          P_(),
          AN(r.errorMessage() ? 48 : -1),
          P_(),
          AN(r.resultMessage() ? 49 : -1),
          P_(),
          AN((s = r.preview()) ? 50 : -1, s));
      }
    },
    dependencies: [Hi, bi, ks, Rs],
    styles: [
      `.page[_ngcontent-%COMP%]{margin:0 auto;padding:24px 24px 48px}.page-header[_ngcontent-%COMP%], .title-row[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%], .preview-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:16px}.page-header[_ngcontent-%COMP%]{margin-bottom:20px}.title-row[_ngcontent-%COMP%]{justify-content:flex-start}.header-actions[_ngcontent-%COMP%]{justify-content:flex-end}h1[_ngcontent-%COMP%], h2[_ngcontent-%COMP%], p[_ngcontent-%COMP%]{margin-top:0}h1[_ngcontent-%COMP%]{margin-bottom:4px;color:var(--%NS%sdd-text);font-size:1.5rem}h2[_ngcontent-%COMP%]{margin-bottom:8px;font-size:1.125rem}.subtitle[_ngcontent-%COMP%], .file-name[_ngcontent-%COMP%], .preview-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-bottom:0;color:var(--%NS%sdd-muted)}.card[_ngcontent-%COMP%]{margin-bottom:16px;padding:20px;border:1px solid var(--%NS%sdd-border);border-radius:8px;background:var(--%NS%sdd-surface)}.instructions[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child{margin-bottom:0}.uploader[_ngcontent-%COMP%]{display:grid;justify-items:start;gap:10px}.uploader[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-weight:600}.message[_ngcontent-%COMP%]{margin-bottom:16px;padding:12px 16px;border-radius:6px}.message[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child{margin-bottom:0}.error[_ngcontent-%COMP%], .invalid[_ngcontent-%COMP%]{color:var(--%NS%sdd-danger, #b3261e)}.success[_ngcontent-%COMP%], .ready[_ngcontent-%COMP%]{color:var(--%NS%sdd-success, #216e39)}.skipped[_ngcontent-%COMP%]{color:var(--%NS%sdd-muted)}.table-scroll[_ngcontent-%COMP%]{overflow-x:auto}table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse}th[_ngcontent-%COMP%], td[_ngcontent-%COMP%]{padding:10px 12px;border-bottom:1px solid var(--%NS%sdd-border);text-align:left;vertical-align:top}th[_ngcontent-%COMP%]{font-weight:600}.preview-header[_ngcontent-%COMP%]{margin-bottom:16px}@media(max-width:700px){.preview-header[_ngcontent-%COMP%]{align-items:flex-start;flex-direction:column}.page-header[_ngcontent-%COMP%]{align-items:stretch;flex-direction:column}.header-actions[_ngcontent-%COMP%]{justify-content:flex-end}}`,
    ],
  });
};
export { z as VehicleModelOptionsImportComponent };
