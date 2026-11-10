import {
  Bn as wE,
  Ct as _N,
  Hn as wp,
  In as up,
  Jn as yE,
  L as Ko,
  Sn as pp,
  Y as P_,
  a as U,
  an as je,
  b as Eb,
  c as AN,
  dt as Wm,
  f as C,
  gt as Y,
  ht as Xw,
  it as Sc,
  jn as tb,
  k as Hc,
  kn as sp,
  kt as b,
  m as Ce$1,
  o as $N,
  ot as UN,
  qn as yA,
  rn as hp,
  t as n,
  ut as Vc,
  yt as Ym,
} from './main-RR6WM3XY.js';
import { c as Rs, i as Hi } from './chunk-CnuPNpsB.js';
import './chunk-v95b3x4p.js';
import {
  a as Ut,
  c as Zn,
  d as ia,
  f as na,
  h as ta,
  i as Kn,
  l as aa,
  m as pn,
  o as Xn,
  p as oa,
  r as Jn,
  s as Yn,
  t as Bt,
  u as ea,
} from './chunk-CUrU3FYc.js';
import { n as _e$1, r as be, t as K } from './chunk-BYN9Y580.js';
function te(n, e) {
  n & 1 && Vc(0, `mat-progress-bar`, 7);
}
function ne(n, e) {
  if (n & 1) {
    let t = UN();
    (Sc(0, `div`, 8)(1, `p`),
      yA(2, `The premium adjustments could not be loaded.`),
      up(),
      Sc(3, `button`, 10),
      Hc(`click`, function () {
        Wm(t);
        let r = $N();
        return Ym(r.load());
      }),
      yA(4, `Try again`),
      up()());
  }
}
function ie(n, e) {
  if (n & 1) {
    let t = UN();
    (Sc(0, `th`, 27)(1, `div`, 28),
      yA(2, `Code Type`),
      up(),
      Sc(3, `app-column-filter`, 29),
      Hc(`filterChange`, function (r) {
        Wm(t);
        let m = $N(2);
        return Ym(m.onTextFilterChange(`codeType`, r));
      }),
      up()());
  }
}
function ae(n, e) {
  if ((n & 1 && (Sc(0, `td`, 30), yA(1), up()), n & 2)) {
    let t = e.$implicit;
    (P_(), Eb(t.codeTypeDescription));
  }
}
function oe(n, e) {
  if (n & 1) {
    let t = UN();
    (Sc(0, `th`, 27)(1, `div`, 31),
      yA(2, `Code`),
      up(),
      Sc(3, `app-column-filter`, 32),
      Hc(`filterChange`, function (r) {
        Wm(t);
        let m = $N(2);
        return Ym(m.onTextFilterChange(`code`, r));
      }),
      up()());
  }
}
function re(n, e) {
  if ((n & 1 && (Sc(0, `td`, 30), yA(1), up()), n & 2)) {
    let t = e.$implicit;
    (P_(), Eb(t.code));
  }
}
function me(n, e) {
  if (n & 1) {
    let t = UN();
    (Sc(0, `th`, 27)(1, `div`, 33),
      yA(2, `Company Code`),
      up(),
      Sc(3, `app-column-filter`, 34),
      Hc(`filterChange`, function (r) {
        Wm(t);
        let m = $N(2);
        return Ym(m.onTextFilterChange(`companyCode`, r));
      }),
      up()());
  }
}
function le(n, e) {
  if ((n & 1 && (Sc(0, `td`, 30), yA(1), up()), n & 2)) {
    let t = e.$implicit;
    (P_(), Eb(t.companyCode));
  }
}
function de(n, e) {
  if (n & 1) {
    let t = UN();
    (Sc(0, `th`, 27)(1, `div`, 35),
      yA(2, `Name`),
      up(),
      Sc(3, `app-column-filter`, 36),
      Hc(`filterChange`, function (r) {
        Wm(t);
        let m = $N(2);
        return Ym(m.onTextFilterChange(`name`, r));
      }),
      up()());
  }
}
function se(n, e) {
  if ((n & 1 && (Sc(0, `td`, 30), yA(1), up()), n & 2)) {
    let t = e.$implicit;
    (P_(), Eb(t.name));
  }
}
function ce(n, e) {
  if (n & 1) {
    let t = UN();
    (Sc(0, `th`, 27)(1, `div`, 37),
      yA(2, `Short Name`),
      up(),
      Sc(3, `app-column-filter`, 38),
      Hc(`filterChange`, function (r) {
        Wm(t);
        let m = $N(2);
        return Ym(m.onTextFilterChange(`shortName`, r));
      }),
      up()());
  }
}
function ue(n, e) {
  if ((n & 1 && (Sc(0, `td`, 30), yA(1), up()), n & 2)) {
    let t = e.$implicit;
    (P_(), Eb(t.shortName));
  }
}
function pe(n, e) {
  if (n & 1) {
    let t = UN();
    (Sc(0, `th`, 27)(1, `div`),
      yA(2, `Status`),
      up(),
      Sc(3, `app-column-filter`, 39),
      Hc(`filterChange`, function (r) {
        Wm(t);
        let m = $N(2);
        return Ym(m.onActiveFilterChange(r));
      }),
      up()());
  }
}
function _e(n, e) {
  if ((n & 1 && (Sc(0, `td`, 30), yA(1), up()), n & 2)) {
    let t = e.$implicit;
    (P_(), Eb(t.active ? `Active` : `Inactive`));
  }
}
function Ce(n, e) {
  n & 1 && (Sc(0, `th`, 40), yA(1, `Actions`), up());
}
function fe(n, e) {
  if (n & 1) {
    let t = UN();
    (Sc(0, `td`, 41)(1, `app-icon-button`, 42),
      Hc(`clicked`, function () {
        let r = Wm(t).$implicit,
          m = $N(2);
        return Ym(m.open(r));
      }),
      up(),
      Sc(2, `app-icon-button`, 43),
      Hc(`clicked`, function () {
        let r = Wm(t).$implicit,
          m = $N(2);
        return Ym(m.delete(r));
      }),
      up()());
  }
  if (n & 2) {
    let t = e.$implicit;
    (P_(),
      tb(`tooltip`, `Open ` + t.code)(`accessibleName`, `Open ` + t.code),
      P_(),
      tb(`danger`, !0)(`tooltip`, `Delete ` + t.code)(`accessibleName`, `Delete ` + t.code));
  }
}
function ye(n, e) {
  n & 1 && Vc(0, `tr`, 44);
}
function he(n, e) {
  n & 1 && Vc(0, `tr`, 45);
}
function ge(n, e) {
  if ((n & 1 && (Sc(0, `p`, 26), yA(1), up()), n & 2)) {
    let t = $N(2);
    (P_(), Eb(t.emptyMessage()));
  }
}
function ve(n, e) {
  if (n & 1) {
    let t = UN();
    (Sc(0, `div`, 11)(1, `table`, 12),
      Hc(`matSortChange`, function (r) {
        Wm(t);
        let m = $N();
        return Ym(m.onSort(r));
      }),
      pp(2, 13),
      Xw(3, ie, 4, 0, `th`, 14)(4, ae, 2, 1, `td`, 15),
      hp(),
      pp(5, 16),
      Xw(6, oe, 4, 0, `th`, 14)(7, re, 2, 1, `td`, 15),
      hp(),
      pp(8, 17),
      Xw(9, me, 4, 0, `th`, 14)(10, le, 2, 1, `td`, 15),
      hp(),
      pp(11, 18),
      Xw(12, de, 4, 0, `th`, 14)(13, se, 2, 1, `td`, 15),
      hp(),
      pp(14, 19),
      Xw(15, ce, 4, 0, `th`, 14)(16, ue, 2, 1, `td`, 15),
      hp(),
      pp(17, 20),
      Xw(18, pe, 4, 0, `th`, 14)(19, _e, 2, 1, `td`, 15),
      hp(),
      pp(20, 21),
      Xw(21, Ce, 2, 0, `th`, 22)(22, fe, 3, 5, `td`, 23),
      hp(),
      Xw(23, ye, 1, 0, `tr`, 24)(24, he, 1, 0, `tr`, 25),
      up()(),
      _N(25, ge, 2, 1, `p`, 26));
  }
  if (n & 2) {
    let t = $N();
    (P_(),
      tb(`dataSource`, t.items())(`matSortActive`, t.sortColumn())(
        `matSortDirection`,
        t.sortDirection(),
      ),
      P_(22),
      tb(`matHeaderRowDef`, t.columns),
      P_(),
      tb(`matRowDefColumns`, t.columns),
      P_(),
      AN(!t.loading() && t.items().length === 0 ? 25 : -1));
  }
}
function xe(n) {
  return [`codeType`, `code`, `companyCode`, `name`, `shortName`].includes(n);
}
var ee = class n$1 {
  client = b(wE);
  router = b(Ko);
  destroyRef = b(je);
  notifications = b(yE);
  pageSizeOptions = [10, 25, 50];
  pageSize = Ce$1(10);
  columns = [`codeType`, `code`, `companyCode`, `name`, `shortName`, `status`, `actions`];
  items = Ce$1([]);
  totalCount = Ce$1(0);
  pageIndex = Ce$1(0);
  filters = Ce$1({
    codeType: { value: ``, operator: `contains` },
    code: { value: ``, operator: `contains` },
    companyCode: { value: ``, operator: `contains` },
    name: { value: ``, operator: `contains` },
    shortName: { value: ``, operator: `contains` },
  });
  activeFilter = Ce$1({ value: ``, operator: `equals` });
  sortColumn = Ce$1(`codeType`);
  sortDirection = Ce$1(`asc`);
  loading = Ce$1(!1);
  loadFailed = Ce$1(!1);
  hasActiveFilter = wp(
    () => Object.values(this.filters()).some((e) => !!e.value) || !!this.activeFilter().value,
  );
  emptyMessage = wp(() =>
    this.hasActiveFilter()
      ? `No premium adjustments match your filters. Try adjusting or clearing the filter values.`
      : `There are no premium adjustments yet. Select Add to create the first one.`,
  );
  constructor() {
    this.load();
  }
  load() {
    (this.loading.set(!0), this.loadFailed.set(!1));
    let e = this.filters(),
      t = this.activeFilter(),
      o = t.value ? t.value === `true` : void 0;
    this.client
      .list(
        this.pageIndex() + 1,
        e.codeType.value || void 0,
        e.codeType.value ? e.codeType.operator : void 0,
        e.code.value || void 0,
        e.code.value ? e.code.operator : void 0,
        e.companyCode.value || void 0,
        e.companyCode.value ? e.companyCode.operator : void 0,
        e.name.value || void 0,
        e.name.value ? e.name.operator : void 0,
        e.shortName.value || void 0,
        e.shortName.value ? e.shortName.operator : void 0,
        o,
        t.value ? t.operator : void 0,
        this.sortColumn(),
        this.sortDirection(),
        this.pageSize(),
      )
      .pipe(U(this.destroyRef))
      .subscribe({
        next: (r) => {
          (this.items.set(r.items ?? []),
            this.totalCount.set(r.totalCount ?? 0),
            this.loading.set(!1));
        },
        error: () => {
          (this.loading.set(!1), this.loadFailed.set(!0));
        },
      });
  }
  onTextFilterChange(e, t) {
    (this.filters.update((o) => Y(C({}, o), { [e]: t })), this.pageIndex.set(0), this.load());
  }
  onActiveFilterChange(e) {
    (this.activeFilter.set(e), this.pageIndex.set(0), this.load());
  }
  onSort(e) {
    (!e.direction || !xe(e.active)
      ? (this.sortColumn.set(`codeType`), this.sortDirection.set(`asc`))
      : (this.sortColumn.set(e.active), this.sortDirection.set(e.direction)),
      this.pageIndex.set(0),
      this.load());
  }
  onPage(e) {
    (this.pageIndex.set(e.pageIndex), this.pageSize.set(e.pageSize), this.load());
  }
  add() {
    this.router.navigate([`/premium-adjustments/new`]);
  }
  importAdjustments() {
    this.router.navigate([`/premium-adjustments/import`]);
  }
  open(e) {
    this.router.navigate([`/premium-adjustments/view`], {
      state: { codeType: e.codeType, code: e.code, companyCode: e.companyCode },
    });
  }
  async delete(e) {
    (await this.notifications.confirm({
      title: `Delete premium adjustment?`,
      text: `This deletion is permanent and cannot be undone. Turning Active off is the reversible alternative.`,
      confirmButtonText: `Delete permanently`,
      cancelButtonText: `Cancel`,
      isDanger: !0,
    })) &&
      this.client
        .delete(e.codeType, e.code, e.companyCode)
        .pipe(U(this.destroyRef))
        .subscribe({
          next: () => {
            (this.notifications.success(`Premium adjustment deleted.`),
              this.items().length === 1 &&
                this.pageIndex() > 0 &&
                this.pageIndex.update((o) => o - 1),
              this.load());
          },
          error: (o) => {
            if (n(o) && o.problem.status === 404) {
              (this.notifications.info(
                `This premium adjustment was already deleted. The list has been refreshed.`,
              ),
                this.load());
              return;
            }
            this.notifications.error(
              `The premium adjustment could not be deleted. Please refresh the list and try again.`,
            );
          },
        });
  }
  static ɵfac = function (t) {
    return new (t || n$1)();
  };
  static ɵcmp = sp({
    type: n$1,
    selectors: [[`app-premium-adjustment-list`]],
    decls: 15,
    vars: 7,
    consts: [
      [1, `page`],
      [1, `page-header`],
      [1, `subtitle`],
      [1, `header-actions`],
      [
        `action`,
        `upload`,
        `tooltip`,
        `Import premium adjustments`,
        `accessibleName`,
        `Import premium adjustments`,
        3,
        `clicked`,
      ],
      [
        `action`,
        `add`,
        `tooltip`,
        `Add premium adjustment`,
        `accessibleName`,
        `Add premium adjustment`,
        3,
        `clicked`,
      ],
      [1, `table-card`],
      [`mode`, `indeterminate`, `aria-label`, `Loading premium adjustments`],
      [`role`, `alert`, 1, `state`],
      [
        `aria-label`,
        `Select a page of premium adjustments`,
        3,
        `page`,
        `length`,
        `pageSize`,
        `pageSizeOptions`,
        `pageIndex`,
        `showFirstLastButtons`,
      ],
      [`matButton`, `outlined`, `type`, `button`, 3, `click`],
      [1, `table-scroll`],
      [
        `mat-table`,
        ``,
        `matSort`,
        ``,
        `matSortDisableClear`,
        ``,
        3,
        `matSortChange`,
        `dataSource`,
        `matSortActive`,
        `matSortDirection`,
      ],
      [`matColumnDef`, `codeType`],
      [`mat-header-cell`, ``, 4, `matHeaderCellDef`],
      [`mat-cell`, ``, 4, `matCellDef`],
      [`matColumnDef`, `code`],
      [`matColumnDef`, `companyCode`],
      [`matColumnDef`, `name`],
      [`matColumnDef`, `shortName`],
      [`matColumnDef`, `status`],
      [`matColumnDef`, `actions`],
      [`mat-header-cell`, ``, `class`, `actions-column`, 4, `matHeaderCellDef`],
      [`mat-cell`, ``, `class`, `actions-column`, 4, `matCellDef`],
      [`mat-header-row`, ``, 4, `matHeaderRowDef`],
      [`mat-row`, ``, 4, `matRowDef`, `matRowDefColumns`],
      [1, `state`],
      [`mat-header-cell`, ``],
      [`mat-sort-header`, `codeType`],
      [`placeholder`, `Code Type filter`, 3, `filterChange`],
      [`mat-cell`, ``],
      [`mat-sort-header`, `code`],
      [`placeholder`, `Code filter`, 3, `filterChange`],
      [`mat-sort-header`, `companyCode`],
      [`placeholder`, `Company Code filter`, 3, `filterChange`],
      [`mat-sort-header`, `name`],
      [`placeholder`, `Name filter`, 3, `filterChange`],
      [`mat-sort-header`, `shortName`],
      [`placeholder`, `Short Name filter`, 3, `filterChange`],
      [`type`, `status`, 3, `filterChange`],
      [`mat-header-cell`, ``, 1, `actions-column`],
      [`mat-cell`, ``, 1, `actions-column`],
      [`action`, `open`, 3, `clicked`, `tooltip`, `accessibleName`],
      [`action`, `delete`, 3, `clicked`, `danger`, `tooltip`, `accessibleName`],
      [`mat-header-row`, ``],
      [`mat-row`, ``],
    ],
    template: function (t, o) {
      (t & 1 &&
        (Sc(0, `section`, 0)(1, `header`, 1)(2, `div`)(3, `h1`),
        yA(4, `Premium Adjustment Master`),
        up(),
        Sc(5, `p`, 2),
        yA(6, `Find and maintain premium adjustment codes.`),
        up()(),
        Sc(7, `div`, 3)(8, `app-icon-button`, 4),
        Hc(`clicked`, function () {
          return o.importAdjustments();
        }),
        up(),
        Sc(9, `app-icon-button`, 5),
        Hc(`clicked`, function () {
          return o.add();
        }),
        up()()(),
        Sc(10, `div`, 6),
        _N(11, te, 1, 0, `mat-progress-bar`, 7),
        _N(12, ne, 5, 0, `div`, 8)(13, ve, 26, 6),
        Sc(14, `mat-paginator`, 9),
        Hc(`page`, function (m) {
          return o.onPage(m);
        }),
        up()()()),
        t & 2 &&
          (P_(11),
          AN(o.loading() ? 11 : -1),
          P_(),
          AN(o.loadFailed() ? 12 : 13),
          P_(2),
          tb(`length`, o.totalCount())(`pageSize`, o.pageSize())(
            `pageSizeOptions`,
            o.pageSizeOptions,
          )(`pageIndex`, o.pageIndex())(`showFirstLastButtons`, !0)));
    },
    dependencies: [pn, Ut, Rs, _e$1, K, be, oa, Kn, Yn, ta, Zn, Xn, na, Jn, ea, aa, ia, Bt, Hi],
    styles: [
      `.page[_ngcontent-%COMP%]{margin:0 auto;padding:24px 24px 48px}.page-header[_ngcontent-%COMP%]{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}h1[_ngcontent-%COMP%]{margin:0 0 4px;font-size:1.5rem;font-weight:600;color:var(--%NS%sdd-text)}.subtitle[_ngcontent-%COMP%]{margin:0;color:var(--%NS%sdd-muted)}.table-card[_ngcontent-%COMP%]{overflow:hidden;border:1px solid var(--%NS%sdd-border);border-radius:8px;background:var(--%NS%sdd-surface)}.table-scroll[_ngcontent-%COMP%]{overflow-x:auto}table[_ngcontent-%COMP%]{width:100%}.actions-column[_ngcontent-%COMP%]{width:1%;white-space:nowrap;text-align:right}.state[_ngcontent-%COMP%]{margin:0;padding:32px 16px;color:var(--%NS%sdd-muted);text-align:center}@media(max-width:760px){.page-header[_ngcontent-%COMP%]{flex-direction:column}}`,
    ],
  });
};
export { ee as PremiumAdjustmentListComponent };
