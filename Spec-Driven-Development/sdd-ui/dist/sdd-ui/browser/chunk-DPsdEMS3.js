import{$ as Rw,At as b,B as Nc,C as Go,Ct as Yf,D as Hf,Dt as _n,E as He$1,F as Lw,Ft as bo,I as M,L as Mc,N as Kf,Pt as bl,R as Mm,St as YM,V as Nw,X as Qw,Z as RN,Zt as ii,_t as X0,at as Tw,bn as tN,c as Bi,dn as pc,h as Eo,hn as rN,ht as Wf,it as Tm,j as Jf,jn as xi,ln as oN,lt as V0,mn as qw,o as Aw,ot as UD,q as QG,st as Um,t as $0,tn as ke,u as CA,ut as VD,vn as se,wn as up,wt as Zf,x as Gf,zt as dS}from"./main-Q5M5XZIC.js";import{K as pe,L as de,R as ee,b as Po,it as zn,k as Yh,l as Ft,t as $l,w as Ua}from"./chunk-ozhQvM3W.js";import{a as Ut,c as Zn,d as hn,f as ia,h as ta,i as Kn,l as aa,m as oa,n as G,o as Xn,p as na,r as Jn,s as Yn,t as Bt,u as ea}from"./chunk-D8TAcGIL.js";var Ne=new M(`MAT_SORT_DEFAULT_OPTIONS`);var P=(()=>{class t{_defaultOptions;_initializedStream=new Go(1);sortables=new Map;_stateChanges=new se;active;start=`asc`;get direction(){return this._direction}set direction(e){this._direction=e}_direction=``;disableClear;disabled=!1;sortChange=new He$1;initialized=this._initializedStream;constructor(e){this._defaultOptions=e}register(e){this.sortables.set(e.id,e)}deregister(e){this.sortables.delete(e.id)}sort(e){this.active!=e.id?(this.active=e.id,this.direction=e.start?e.start:this.start):this.direction=this.getNextSortDirection(e),this.sortChange.emit({active:this.active,direction:this.direction})}getNextSortDirection(e){if(!e)return``;let a=e?.disableClear??this.disableClear??!!this._defaultOptions?.disableClear,r=Te(e.start||this.start,a),i=r.indexOf(this.direction)+1;return i>=r.length&&(i=0),r[i]}ngOnInit(){this._initializedStream.next()}ngOnChanges(){this._stateChanges.next()}ngOnDestroy(){this._stateChanges.complete(),this._initializedStream.complete()}static ɵfac=function(a){return new(a||t)(Eo(Ne,8))};static ɵdir=Bi({type:t,selectors:[[``,`matSort`,``]],hostAttrs:[1,`mat-sort`],inputs:{active:[0,`matSortActive`,`active`],start:[0,`matSortStart`,`start`],direction:[0,`matSortDirection`,`direction`],disableClear:[2,`matSortDisableClear`,`disableClear`,CA],disabled:[2,`matSortDisabled`,`disabled`,CA]},outputs:{sortChange:`matSortChange`},exportAs:[`matSort`],features:[xi]})}return t})();function Te(t,n){let e=[`asc`,`desc`];return t==`desc`&&e.reverse(),n||e.push(``),e}var Ee=(()=>{class t{_sort=b(P,{optional:!0});_columnDef=b(G,{optional:!0});_changeDetectorRef=b(up);_focusMonitor=b(Ft);_elementRef=b(bo);_ariaDescriber=b(Po,{optional:!0});_renderChanges;_animationsDisabled=de();_recentlyCleared=_n(null);_sortButton;id;arrowPosition=`after`;start;disabled=!1;get sortActionDescription(){return this._sortActionDescription}set sortActionDescription(e){this._updateSortActionDescription(e)}_sortActionDescription=`Sort`;disableClear;constructor(){b(pe).load(zn);let e=b(Ne,{optional:!0});this._sort,e?.arrowPosition&&(this.arrowPosition=e?.arrowPosition)}ngOnInit(){!this.id&&this._columnDef&&(this.id=this._columnDef.name),this._sort.register(this),this._renderChanges=dS(this._sort._stateChanges,this._sort.sortChange).subscribe(()=>this._changeDetectorRef.markForCheck()),this._sortButton=this._elementRef.nativeElement.querySelector(`.mat-sort-header-container`),this._updateSortActionDescription(this._sortActionDescription)}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(()=>{Promise.resolve().then(()=>this._recentlyCleared.set(null))})}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef),this._sort.deregister(this),this._renderChanges?.unsubscribe(),this._sortButton&&this._ariaDescriber?.removeDescription(this._sortButton,this._sortActionDescription)}_toggleOnInteraction(){if(!this._isDisabled()){let e=this._isSorted(),a=this._sort.direction;this._sort.sort(this),this._recentlyCleared.set(e&&!this._isSorted()?a:null)}}_handleKeydown(e){(e.keyCode===32||e.keyCode===13)&&(e.preventDefault(),this._toggleOnInteraction())}_isSorted(){return this._sort.active==this.id&&(this._sort.direction===`asc`||this._sort.direction===`desc`)}_isDisabled(){return this._sort.disabled||this.disabled}_getAriaSortAttribute(){return this._isSorted()?this._sort.direction==`asc`?`ascending`:`descending`:`none`}_renderArrow(){return!this._isDisabled()||this._isSorted()}_updateSortActionDescription(e){this._sortButton&&(this._ariaDescriber?.removeDescription(this._sortButton,this._sortActionDescription),this._ariaDescriber?.describe(this._sortButton,e)),this._sortActionDescription=e}static ɵfac=function(a){return new(a||t)};static ɵcmp=(function(){let e=[`*`,[[``,`matSortHeaderIcon`,``]]],a=[`*`,`[matSortHeaderIcon]`];function r(b,C){b&1&&(Um(),Wf(0,`svg`,3),Rw(1,`path`,4),Yf())}function i(b,C){b&1&&(Wf(0,`div`,2),oN(1,1,null,r,2,0),Yf())}return Hf({type:t,selectors:[[``,`mat-sort-header`,``]],hostAttrs:[1,`mat-sort-header`],hostVars:3,hostBindings:function(C,l){C&1&&Lw(`click`,function(){return l._toggleOnInteraction()})(`keydown`,function(Fe){return l._handleKeydown(Fe)})(`mouseleave`,function(){return l._recentlyCleared.set(null)}),C&2&&(Nw(`aria-sort`,l._getAriaSortAttribute()),qw(`mat-sort-header-disabled`,l._isDisabled()))},inputs:{id:[0,`mat-sort-header`,`id`],arrowPosition:`arrowPosition`,start:`start`,disabled:[2,`disabled`,`disabled`,CA],sortActionDescription:`sortActionDescription`,disableClear:[2,`disableClear`,`disableClear`,CA]},exportAs:[`matSortHeader`],ngContentSelectors:a,decls:4,vars:17,consts:[[1,`mat-sort-header-container`,`mat-focus-indicator`],[1,`mat-sort-header-content`],[1,`mat-sort-header-arrow`],[`viewBox`,`0 -960 960 960`,`focusable`,`false`,`aria-hidden`,`true`],[`d`,`M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z`]],template:function(C,l){C&1&&(rN(e),Wf(0,`div`,0)(1,`div`,1),oN(2),Yf(),V0(3,i,3,0,`div`,2),Yf()),C&2&&(qw(`mat-sort-header-sorted`,l._isSorted())(`mat-sort-header-position-before`,l.arrowPosition===`before`)(`mat-sort-header-descending`,l._sort.direction===`desc`)(`mat-sort-header-ascending`,l._sort.direction===`asc`)(`mat-sort-header-recently-cleared-ascending`,l._recentlyCleared()===`asc`)(`mat-sort-header-recently-cleared-descending`,l._recentlyCleared()===`desc`)(`mat-sort-header-animations-disabled`,l._animationsDisabled),Nw(`tabindex`,l._isDisabled()?null:0)(`role`,l._isDisabled()?null:`button`),YM(3),$0(l._renderArrow()?3:-1))},styles:[`.mat-sort-header {
  cursor: pointer;
}

.mat-sort-header-disabled {
  cursor: default;
}

.mat-sort-header-container {
  display: flex;
  align-items: center;
  letter-spacing: normal;
  outline: 0;
}
[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container, [mat-sort-header].cdk-program-focused .mat-sort-header-container {
  border-bottom: var(--%NS%mat-focus-indicator-fallback-border-style, solid) 1px currentColor;
}
.mat-sort-header-container::before {
  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 4px) * -1);
}

.mat-sort-header-content {
  display: flex;
  align-items: center;
}

.mat-sort-header-position-before {
  flex-direction: row-reverse;
}

@keyframes _mat-sort-header-recently-cleared-ascending {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-25%);
    opacity: 0;
  }
}
@keyframes _mat-sort-header-recently-cleared-descending {
  from {
    transform: translateY(0) rotate(180deg);
    opacity: 1;
  }
  to {
    transform: translateY(25%) rotate(180deg);
    opacity: 0;
  }
}
.mat-sort-header-arrow {
  height: 12px;
  width: 12px;
  position: relative;
  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1), opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  overflow: visible;
  color: var(--%NS%mat-sort-arrow-color, var(--%NS%mat-sys-on-surface));
}
.mat-sort-header.cdk-keyboard-focused .mat-sort-header-arrow, .mat-sort-header.cdk-program-focused .mat-sort-header-arrow, .mat-sort-header:hover .mat-sort-header-arrow {
  opacity: 0.54;
}
.mat-sort-header .mat-sort-header-sorted .mat-sort-header-arrow {
  opacity: 1;
}
.mat-sort-header-descending .mat-sort-header-arrow {
  transform: rotate(180deg);
}
.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow {
  transform: translateY(-25%);
}
.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow {
  transition: none;
  animation: _mat-sort-header-recently-cleared-ascending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.mat-sort-header-recently-cleared-descending .mat-sort-header-arrow {
  transition: none;
  animation: _mat-sort-header-recently-cleared-descending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.mat-sort-header-animations-disabled .mat-sort-header-arrow {
  transition-duration: 0ms;
  animation-duration: 0ms;
}
.mat-sort-header-arrow > svg, .mat-sort-header-arrow [matSortHeaderIcon] {
  width: 24px;
  height: 24px;
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -12px 0 0 -12px;
  transform: translateZ(0);
}
.mat-sort-header-arrow, [dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow {
  margin: 0 0 0 6px;
}
.mat-sort-header-position-before .mat-sort-header-arrow, [dir=rtl] .mat-sort-header-arrow {
  margin: 0 6px 0 0;
}
`],encapsulation:2})})()}return t})();var Ve=(()=>{class t{static ɵfac=function(a){return new(a||t)};static ɵmod=Mc({type:t});static ɵinj=ii({imports:[ee]})}return t})();function Le(t,n){t&1&&Nc(0,`mat-progress-bar`,6)}function Pe(t,n){if(t&1){let e=X0();pc(0,`div`,7)(1,`p`),RN(2,`The vehicle makes could not be loaded.`),Gf(),pc(3,`button`,9),Lw(`click`,function(){Tm(e);let r=tN();return Mm(r.load())}),RN(4,`Try again`),Gf()()}}function He(t,n){if(t&1){let e=X0();pc(0,`th`,24)(1,`div`,25),RN(2,`Make Code`),Gf(),pc(3,`app-column-filter`,26),Lw(`filterChange`,function(r){Tm(e);let i=tN(2);return Mm(i.onFilterChange(`makeCode`,r))}),Gf()()}}function Re(t,n){if(t&1&&(pc(0,`td`,27),RN(1),Gf()),t&2){let e=n.$implicit;YM(),Qw(e.makeCode)}}function Be(t,n){if(t&1){let e=X0();pc(0,`th`,24)(1,`div`,25),RN(2,`Make Name`),Gf(),pc(3,`app-column-filter`,28),Lw(`filterChange`,function(r){Tm(e);let i=tN(2);return Mm(i.onFilterChange(`makeName`,r))}),Gf()()}}function ze(t,n){if(t&1&&(pc(0,`td`,27),RN(1),Gf()),t&2){let e=n.$implicit;YM(),Qw(e.makeName)}}function je(t,n){if(t&1){let e=X0();pc(0,`th`,24)(1,`div`,25),RN(2,`Short Name`),Gf(),pc(3,`app-column-filter`,29),Lw(`filterChange`,function(r){Tm(e);let i=tN(2);return Mm(i.onFilterChange(`shortName`,r))}),Gf()()}}function $e(t,n){if(t&1&&(pc(0,`td`,27),RN(1),Gf()),t&2){let e=n.$implicit;YM(),Qw(e.shortName)}}function Ye(t,n){if(t&1){let e=X0();pc(0,`th`,24)(1,`div`),RN(2,`Status`),Gf(),pc(3,`app-column-filter`,30),Lw(`filterChange`,function(r){Tm(e);let i=tN(2);return Mm(i.onFilterChange(`status`,r))}),Gf()()}}function qe(t,n){if(t&1&&(pc(0,`td`,27),RN(1),Gf()),t&2){let e=n.$implicit;YM(),Qw(e.active?`Active`:`Inactive`)}}function Ue(t,n){t&1&&(pc(0,`th`,31),RN(1,`Actions`),Gf())}function We(t,n){if(t&1){let e=X0();pc(0,`td`,32)(1,`app-icon-button`,33),Lw(`clicked`,function(){let r=Tm(e).$implicit,i=tN(2);return Mm(i.open(r))}),Gf(),pc(2,`app-icon-button`,34),Lw(`clicked`,function(){let r=Tm(e).$implicit,i=tN(2);return Mm(i.confirmDelete(r))}),Gf()()}if(t&2){let e=n.$implicit;YM(),Aw(`tooltip`,`Open `+e.makeCode)(`accessibleName`,`Open `+e.makeCode),YM(),Aw(`danger`,!0)(`tooltip`,`Delete `+e.makeCode)(`accessibleName`,`Delete `+e.makeCode)}}function Ze(t,n){t&1&&Nc(0,`tr`,35)}function Ke(t,n){t&1&&Nc(0,`tr`,36)}function Ge(t,n){if(t&1&&(pc(0,`p`,23),RN(1),Gf()),t&2){let e=tN(2);YM(),Qw(e.emptyMessage())}}function Je(t,n){if(t&1){let e=X0();pc(0,`div`,10)(1,`table`,11),Lw(`matSortChange`,function(r){Tm(e);let i=tN();return Mm(i.onSort(r))}),Zf(2,12),Tw(3,He,4,0,`th`,13)(4,Re,2,1,`td`,14),Kf(),Zf(5,15),Tw(6,Be,4,0,`th`,13)(7,ze,2,1,`td`,14),Kf(),Zf(8,16),Tw(9,je,4,0,`th`,13)(10,$e,2,1,`td`,14),Kf(),Zf(11,17),Tw(12,Ye,4,0,`th`,13)(13,qe,2,1,`td`,14),Kf(),Zf(14,18),Tw(15,Ue,2,0,`th`,19)(16,We,3,5,`td`,20),Kf(),Tw(17,Ze,1,0,`tr`,21)(18,Ke,1,0,`tr`,22),Gf()(),V0(19,Ge,2,1,`p`,23)}if(t&2){let e=tN();YM(),Aw(`dataSource`,e.items())(`matSortActive`,e.sortColumn())(`matSortDirection`,e.sortDirection()),YM(16),Aw(`matHeaderRowDef`,e.columns),YM(),Aw(`matRowDefColumns`,e.columns),YM(),$0(!e.loading()&&e.items().length===0?19:-1)}}var Ie=class t{client=b(VD);router=b(bl);notifications=b(UD);destroyRef=b(ke);pageSize=10;columns=[`makeCode`,`makeName`,`shortName`,`status`,`actions`];items=_n([]);totalCount=_n(0);pageIndex=_n(0);makeCodeFilter=_n({value:``,operator:`contains`});makeNameFilter=_n({value:``,operator:`contains`});shortNameFilter=_n({value:``,operator:`contains`});statusFilter=_n({value:``,operator:`equals`});sortColumn=_n(`makeCode`);sortDirection=_n(`asc`);loading=_n(!1);loadFailed=_n(!1);hasActiveFilter=Jf(()=>!!(this.makeCodeFilter().value||this.makeNameFilter().value||this.shortNameFilter().value||this.statusFilter().value));emptyMessage=Jf(()=>this.hasActiveFilter()?`No vehicle makes match your filters. Try adjusting or clearing the filter values.`:`There are no vehicle makes yet. Select Add to create the first one.`);constructor(){this.load()}load(){this.loading.set(!0),this.loadFailed.set(!1);let n=this.statusFilter().value?this.statusFilter().value===`true`:void 0,e=this.statusFilter().value?this.statusFilter().operator:void 0;this.client.list(this.pageIndex()+1,this.makeCodeFilter().value||void 0,this.makeCodeFilter().value?this.makeCodeFilter().operator:void 0,this.makeNameFilter().value||void 0,this.makeNameFilter().value?this.makeNameFilter().operator:void 0,this.shortNameFilter().value||void 0,this.shortNameFilter().value?this.shortNameFilter().operator:void 0,n,e,this.sortColumn(),this.sortDirection()).pipe($l(this.destroyRef)).subscribe({next:a=>{this.items.set(a.items??[]),this.totalCount.set(a.totalCount??0),this.loading.set(!1)},error:()=>{this.loading.set(!1),this.loadFailed.set(!0)}})}onFilterChange(n,e){n===`makeCode`?this.makeCodeFilter.set(e):n===`makeName`?this.makeNameFilter.set(e):n===`shortName`?this.shortNameFilter.set(e):n===`status`&&this.statusFilter.set(e),this.pageIndex.set(0),this.load()}onSort(n){n.direction?(this.sortColumn.set(n.active),this.sortDirection.set(n.direction)):(this.sortColumn.set(`makeCode`),this.sortDirection.set(`asc`)),this.pageIndex.set(0),this.load()}onPage(n){this.pageIndex.set(n.pageIndex),this.load()}add(){this.router.navigate([`/vehicle-makes/new`])}open(n){this.router.navigate([`/vehicle-makes/view`],{state:{makeCode:n.makeCode}})}async confirmDelete(n){let e=n.makeCode;await this.notifications.confirm({title:`Delete vehicle make ${e}?`,text:`This deletion is permanent and cannot be undone.`,confirmButtonText:`Delete permanently`,cancelButtonText:`Cancel`,isDanger:!0})&&this.client.delete(e).pipe($l(this.destroyRef)).subscribe({next:()=>{this.notifications.success(`Vehicle make deleted.`),this.load()},error:r=>{if(QG(r)&&r.problem.status===409){let i=r.problem.fieldErrors.makeCode,b=Array.isArray(i)&&i.length>0?i[0]:`This make still has models. Delete its models first.`;this.notifications.error(b,`Cannot delete make`)}else this.notifications.error(`The vehicle make could not be deleted.`,`Delete failed`)}})}static ɵfac=function(e){return new(e||t)};static ɵcmp=Hf({type:t,selectors:[[`app-vehicle-make-list`]],decls:14,vars:7,consts:[[1,`page`],[1,`page-header`],[1,`subtitle`],[1,`header-actions`],[`action`,`add`,`tooltip`,`Add vehicle make`,`accessibleName`,`Add vehicle make`,3,`clicked`],[1,`table-card`],[`mode`,`indeterminate`,`aria-label`,`Loading vehicle makes`],[`role`,`alert`,1,`state`],[`aria-label`,`Select a page of vehicle makes`,3,`page`,`length`,`pageSize`,`pageIndex`,`hidePageSize`,`showFirstLastButtons`],[`matButton`,`outlined`,`type`,`button`,3,`click`],[1,`table-scroll`],[`mat-table`,``,`matSort`,``,`matSortDisableClear`,``,3,`matSortChange`,`dataSource`,`matSortActive`,`matSortDirection`],[`matColumnDef`,`makeCode`],[`mat-header-cell`,``,4,`matHeaderCellDef`],[`mat-cell`,``,4,`matCellDef`],[`matColumnDef`,`makeName`],[`matColumnDef`,`shortName`],[`matColumnDef`,`status`],[`matColumnDef`,`actions`],[`mat-header-cell`,``,`class`,`actions-column`,4,`matHeaderCellDef`],[`mat-cell`,``,`class`,`actions-column`,4,`matCellDef`],[`mat-header-row`,``,4,`matHeaderRowDef`],[`mat-row`,``,4,`matRowDef`,`matRowDefColumns`],[1,`state`],[`mat-header-cell`,``],[`mat-sort-header`,``],[`placeholder`,`Code...`,3,`filterChange`],[`mat-cell`,``],[`placeholder`,`Name...`,3,`filterChange`],[`placeholder`,`Short name...`,3,`filterChange`],[`type`,`status`,3,`filterChange`],[`mat-header-cell`,``,1,`actions-column`],[`mat-cell`,``,1,`actions-column`],[`action`,`open`,3,`clicked`,`tooltip`,`accessibleName`],[`action`,`delete`,3,`clicked`,`danger`,`tooltip`,`accessibleName`],[`mat-header-row`,``],[`mat-row`,``]],template:function(e,a){e&1&&(pc(0,`section`,0)(1,`header`,1)(2,`div`)(3,`h1`),RN(4,`Vehicle Make Master`),Gf(),pc(5,`p`,2),RN(6,` Find, add and maintain the vehicle makes used across insurance records. `),Gf()(),pc(7,`div`,3)(8,`app-icon-button`,4),Lw(`clicked`,function(){return a.add()}),Gf()()(),pc(9,`div`,5),V0(10,Le,1,0,`mat-progress-bar`,6),V0(11,Pe,5,0,`div`,7)(12,Je,20,6),pc(13,`mat-paginator`,8),Lw(`page`,function(i){return a.onPage(i)}),Gf()()()),e&2&&(YM(10),$0(a.loading()?10:-1),YM(),$0(a.loadFailed()?11:12),YM(2),Aw(`length`,a.totalCount())(`pageSize`,a.pageSize)(`pageIndex`,a.pageIndex())(`hidePageSize`,!0)(`showFirstLastButtons`,!0))},dependencies:[hn,Ut,Yh,Ve,P,Ee,oa,Kn,Yn,ta,Zn,Xn,na,Jn,ea,aa,ia,Bt,Ua],styles:[`.page[_ngcontent-%COMP%]{margin:0 auto;padding:24px 24px 48px}.page-header[_ngcontent-%COMP%]{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}h1[_ngcontent-%COMP%]{margin:0 0 4px;font-size:1.5rem;font-weight:600;color:var(--%NS%sdd-text)}.subtitle[_ngcontent-%COMP%]{margin:0;color:var(--%NS%sdd-muted)}.toolbar[_ngcontent-%COMP%]{margin-bottom:16px}.search[_ngcontent-%COMP%]{width:min(420px,100%)}.table-card[_ngcontent-%COMP%]{background:var(--%NS%sdd-surface);border:1px solid var(--%NS%sdd-border);border-radius:8px;overflow:hidden}.table-scroll[_ngcontent-%COMP%]{overflow-x:auto}table[_ngcontent-%COMP%]{width:100%}.actions-column[_ngcontent-%COMP%]{width:1%;white-space:nowrap;text-align:right}.delete-action[_ngcontent-%COMP%]{--%NS%mat-button-text-label-text-color: #b3261e}.state[_ngcontent-%COMP%]{margin:0;padding:32px 16px;text-align:center;color:var(--%NS%sdd-muted)}@media(max-width:600px){.page-header[_ngcontent-%COMP%]{flex-direction:column}}`]})};export{Ie as VehicleMakeListComponent};