import{$t as dc,An as ob,Dt as Wn,E as He,En as mn,Et as We$1,Gt as bx,Ht as bs,In as qt,Jt as ce,K as Lr,M as J,Mn as ol,Nn as pn,O as Ho,Ot as Wo,Pn as q,Pt as Zl,Q as Nt,Qt as cu,Rt as b,S as GZ,St as Ve,T as HY,Tn as le,Ut as bt,V as Ks,Vn as se,Y as Mw,Zt as co,an as f,ar as yi,b as Fr,c as BY,ct as Qw,dn as hs,dr as zn,dt as Re,et as Ou,f as Cp,fn as ht$1,fr as zo,h as E,hn as ie,ht as Sp,it as Q,j as Ip,kn as mx,kt as X5,ln as gn,nr as xe,nt as Pe,o as An,on as fc,qt as cE,r as $e,s as Ap,sr as yt,t as $,un as hn,ur as ze,v as En,yn as jr}from"./main-Z2EJ2UB4.js";import{A as hu,B as vs,D as er,F as pu,G as xu,H as wm,K as yu,L as ra,M as lt$1,O as fu,P as nn,S as _u,T as bu,V as vu,d as Qa,f as Qo,g as Va,i as Fm,j as kd,k as gu,m as Tn,n as Ct,p as Ss,r as Cu,s as Md,z as uu}from"./chunk-DyxVlU7Q.js";var We=new b(`MAT_SORT_DEFAULT_OPTIONS`);var L=(()=>{class t{_defaultOptions;_initializedStream=new An(1);sortables=new Map;_stateChanges=new E;active;start=`asc`;get direction(){return this._direction}set direction(e){this._direction=e}_direction=``;disableClear;disabled=!1;sortChange=new q;initialized=this._initializedStream;constructor(e){this._defaultOptions=e}register(e){this.sortables.set(e.id,e)}deregister(e){this.sortables.delete(e.id)}sort(e){this.active!=e.id?(this.active=e.id,this.direction=e.start?e.start:this.start):this.direction=this.getNextSortDirection(e),this.sortChange.emit({active:this.active,direction:this.direction})}getNextSortDirection(e){if(!e)return``;let a=e?.disableClear??this.disableClear??!!this._defaultOptions?.disableClear,l=Xe(e.start||this.start,a),m=l.indexOf(this.direction)+1;return m>=l.length&&(m=0),l[m]}ngOnInit(){this._initializedStream.next()}ngOnChanges(){this._stateChanges.next()}ngOnDestroy(){this._stateChanges.complete(),this._initializedStream.complete()}static ɵfac=function(a){return new(a||t)(Ho(We,8))};static ɵdir=J({type:t,selectors:[[``,`matSort`,``]],hostAttrs:[1,`mat-sort`],inputs:{active:[0,`matSortActive`,`active`],start:[0,`matSortStart`,`start`],direction:[0,`matSortDirection`,`direction`],disableClear:[2,`matSortDisableClear`,`disableClear`,Pe],disabled:[2,`matSortDisabled`,`disabled`,Pe]},outputs:{sortChange:`matSortChange`},exportAs:[`matSort`],features:[Nt]})}return t})();function Xe(t,n){let e=[`asc`,`desc`];return t==`desc`&&e.reverse(),n||e.push(``),e}var Ze=(()=>{class t{_sort=f(L,{optional:!0});_columnDef=f(lt$1,{optional:!0});_changeDetectorRef=f(Wn);_focusMonitor=f(Ks);_elementRef=f(Q);_ariaDescriber=f(X5,{optional:!0});_renderChanges;_animationsDisabled=yt();_recentlyCleared=Re(null);_sortButton;id;arrowPosition=`after`;start;disabled=!1;get sortActionDescription(){return this._sortActionDescription}set sortActionDescription(e){this._updateSortActionDescription(e)}_sortActionDescription=`Sort`;disableClear;constructor(){f(bt).load(Mw);let e=f(We,{optional:!0});this._sort,e?.arrowPosition&&(this.arrowPosition=e?.arrowPosition)}ngOnInit(){!this.id&&this._columnDef&&(this.id=this._columnDef.name),this._sort.register(this),this._renderChanges=Ou(this._sort._stateChanges,this._sort.sortChange).subscribe(()=>this._changeDetectorRef.markForCheck()),this._sortButton=this._elementRef.nativeElement.querySelector(`.mat-sort-header-container`),this._updateSortActionDescription(this._sortActionDescription)}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(()=>{Promise.resolve().then(()=>this._recentlyCleared.set(null))})}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef),this._sort.deregister(this),this._renderChanges?.unsubscribe(),this._sortButton&&this._ariaDescriber?.removeDescription(this._sortButton,this._sortActionDescription)}_toggleOnInteraction(){if(!this._isDisabled()){let e=this._isSorted(),a=this._sort.direction;this._sort.sort(this),this._recentlyCleared.set(e&&!this._isSorted()?a:null)}}_handleKeydown(e){(e.keyCode===32||e.keyCode===13)&&(e.preventDefault(),this._toggleOnInteraction())}_isSorted(){return this._sort.active==this.id&&(this._sort.direction===`asc`||this._sort.direction===`desc`)}_isDisabled(){return this._sort.disabled||this.disabled}_getAriaSortAttribute(){return this._isSorted()?this._sort.direction==`asc`?`ascending`:`descending`:`none`}_renderArrow(){return!this._isDisabled()||this._isSorted()}_updateSortActionDescription(e){this._sortButton&&(this._ariaDescriber?.removeDescription(this._sortButton,this._sortActionDescription),this._ariaDescriber?.describe(this._sortButton,e)),this._sortActionDescription=e}static ɵfac=function(a){return new(a||t)};static ɵcmp=(function(){let e=[`*`,[[``,`matSortHeaderIcon`,``]]],a=[`*`,`[matSortHeaderIcon]`];function l(w,u){w&1&&(ob(),pn(0,`svg`,3),mn(1,`path`,4),hn())}function m(w,u){w&1&&(pn(0,`div`,2),qt(1,1,null,l,2,0),hn())}return ce({type:t,selectors:[[``,`mat-sort-header`,``]],hostAttrs:[1,`mat-sort-header`],hostVars:3,hostBindings:function(u,d){u&1&&jr(`click`,function(){return d._toggleOnInteraction()})(`keydown`,function(Je){return d._handleKeydown(Je)})(`mouseleave`,function(){return d._recentlyCleared.set(null)}),u&2&&(ht$1(`aria-sort`,d._getAriaSortAttribute()),He(`mat-sort-header-disabled`,d._isDisabled()))},inputs:{id:[0,`mat-sort-header`,`id`],arrowPosition:`arrowPosition`,start:`start`,disabled:[2,`disabled`,`disabled`,Pe],sortActionDescription:`sortActionDescription`,disableClear:[2,`disableClear`,`disableClear`,Pe]},exportAs:[`matSortHeader`],ngContentSelectors:a,decls:4,vars:17,consts:[[1,`mat-sort-header-container`,`mat-focus-indicator`],[1,`mat-sort-header-content`],[1,`mat-sort-header-arrow`],[`viewBox`,`0 -960 960 960`,`focusable`,`false`,`aria-hidden`,`true`],[`d`,`M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z`]],template:function(u,d){u&1&&(Wo(e),pn(0,`div`,0)(1,`div`,1),qt(2),hn(),Lr(3,m,3,0,`div`,2),hn()),u&2&&(He(`mat-sort-header-sorted`,d._isSorted())(`mat-sort-header-position-before`,d.arrowPosition===`before`)(`mat-sort-header-descending`,d._sort.direction===`desc`)(`mat-sort-header-ascending`,d._sort.direction===`asc`)(`mat-sort-header-recently-cleared-ascending`,d._recentlyCleared()===`asc`)(`mat-sort-header-recently-cleared-descending`,d._recentlyCleared()===`desc`)(`mat-sort-header-animations-disabled`,d._animationsDisabled),ht$1(`tabindex`,d._isDisabled()?null:0)(`role`,d._isDisabled()?null:`button`),xe(3),Fr(d._renderArrow()?3:-1))},styles:[`.mat-sort-header {
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
`],encapsulation:2})})()}return t})();var qe=(()=>{class t{static ɵfac=function(a){return new(a||t)};static ɵmod=le({type:t});static ɵinj=se({imports:[En]})}return t})();function tt(t,n){t&1&&zo(0,`mat-progress-bar`,8)}function nt(t,n){if(t&1){let e=Ip();ze(0,`div`,9)(1,`p`),gn(2,`The vehicle makes could not be loaded.`),We$1(),ze(3,`button`,11),jr(`click`,function(){dc(e);let l=ol();return fc(l.load())}),gn(4,`Try again`),We$1()()}}function at(t,n){t&1&&(ze(0,`th`,27),gn(1,`Make Code`),We$1())}function rt(t,n){if(t&1&&(ze(0,`td`,28),gn(1),We$1()),t&2){let e=n.$implicit;xe(),bs(e.makeCode)}}function it(t,n){t&1&&(ze(0,`th`,27),gn(1,`Make Name`),We$1())}function ot(t,n){if(t&1&&(ze(0,`td`,28),gn(1),We$1()),t&2){let e=n.$implicit;xe(),bs(e.makeName)}}function st(t,n){t&1&&(ze(0,`th`,27),gn(1,`Short Name`),We$1())}function dt(t,n){if(t&1&&(ze(0,`td`,28),gn(1),We$1()),t&2){let e=n.$implicit;xe(),bs(e.shortName)}}function lt(t,n){t&1&&(ze(0,`th`,29),gn(1,`Status`),We$1())}function ct(t,n){if(t&1&&(ze(0,`td`,28),gn(1),We$1()),t&2){let e=n.$implicit;xe(),bs(e.active?`Active`:`Inactive`)}}function mt(t,n){t&1&&(ze(0,`th`,30),gn(1,`Actions`),We$1())}function ht(t,n){if(t&1){let e=Ip();ze(0,`td`,31)(1,`button`,32),jr(`click`,function(){let l=dc(e).$implicit,m=ol(2);return fc(m.open(l))}),gn(2,` Open `),We$1(),ze(3,`button`,33),jr(`click`,function(){let l=dc(e).$implicit,m=ol(2);return fc(m.confirmDelete(l))}),gn(4,` Delete `),We$1()()}if(t&2){let e=n.$implicit;xe(),ht$1(`aria-label`,`Open `+e.makeCode),xe(2),ht$1(`aria-label`,`Delete `+e.makeCode)}}function pt(t,n){t&1&&zo(0,`tr`,34)}function ut(t,n){t&1&&zo(0,`tr`,35)}function ft(t,n){if(t&1&&(ze(0,`p`,26),gn(1),We$1()),t&2){let e=ol(2);xe(),bs(e.emptyMessage())}}function gt(t,n){if(t&1){let e=Ip();ze(0,`div`,12)(1,`table`,13),jr(`matSortChange`,function(l){dc(e);let m=ol();return fc(m.onSort(l))}),Cp(2,14),zn(3,at,2,0,`th`,15)(4,rt,2,1,`td`,16),Sp(),Cp(5,17),zn(6,it,2,0,`th`,15)(7,ot,2,1,`td`,16),Sp(),Cp(8,18),zn(9,st,2,0,`th`,15)(10,dt,2,1,`td`,16),Sp(),Cp(11,19),zn(12,lt,2,0,`th`,20)(13,ct,2,1,`td`,16),Sp(),Cp(14,21),zn(15,mt,2,0,`th`,22)(16,ht,5,2,`td`,23),Sp(),zn(17,pt,1,0,`tr`,24)(18,ut,1,0,`tr`,25),We$1()(),Lr(19,ft,2,1,`p`,26)}if(t&2){let e=ol();xe(),hs(`dataSource`,e.items())(`matSortActive`,e.sortColumn())(`matSortDirection`,e.sortDirection()),xe(16),hs(`matHeaderRowDef`,e.columns),xe(),hs(`matRowDefColumns`,e.columns),xe(),Fr(!e.loading()&&e.items().length===0?19:-1)}}var _t=300;var Ke=5e3;var Ge=class t{client=f(Qw);router=f(Zl);dialog=f(cE);snackBar=f(BY);destroyRef=f(Ve);pageSize=10;columns=[`makeCode`,`makeName`,`shortName`,`status`,`actions`];searchControl=new Qo(``,{nonNullable:!0});items=Re([]);totalCount=Re(0);pageIndex=Re(0);searchText=Re(``);sortColumn=Re(`makeCode`);sortDirection=Re(`asc`);loading=Re(!1);loadFailed=Re(!1);emptyMessage=Ap(()=>this.searchText()?`No vehicle makes match your search. Try a different code or name.`:`There are no vehicle makes yet. Select "Add vehicle make" to create the first one.`);constructor(){this.searchControl.valueChanges.pipe(co(_t),$(n=>n.trim()),yi(),Qa()).subscribe(n=>{this.searchText.set(n),this.pageIndex.set(0),this.load()}),this.load()}load(){this.loading.set(!0),this.loadFailed.set(!1),this.client.list(this.pageIndex()+1,this.searchText(),this.sortColumn(),this.sortDirection()).pipe(Qa(this.destroyRef)).subscribe({next:n=>{this.items.set(n.items??[]),this.totalCount.set(n.totalCount??0),this.loading.set(!1)},error:()=>{this.loadFailed.set(!0),this.loading.set(!1)}})}onSort(n){this.sortColumn.set(n.active),this.sortDirection.set(n.direction===`desc`?`desc`:`asc`),this.pageIndex.set(0),this.load()}onPage(n){this.pageIndex.set(n.pageIndex),this.load()}add(){this.router.navigate([`/vehicle-makes/new`])}open(n){this.router.navigate([`/vehicle-makes/view`],{state:{makeCode:n.makeCode}})}confirmDelete(n){GZ(this.dialog,{title:`Delete this vehicle make?`,message:`${n.makeName} (${n.makeCode}) will be permanently deleted. This cannot be undone.`,confirmLabel:`Delete permanently`,cancelLabel:`Cancel`,destructive:!0}).pipe(ie(e=>e),$e(()=>this.client.delete(n.makeCode)),Qa(this.destroyRef)).subscribe({next:()=>{this.snackBar.open(`Vehicle make deleted.`,`Close`,{duration:Ke}),this.items().length===1&&this.pageIndex()>0&&this.pageIndex.update(e=>e-1),this.load()},error:e=>{if(HY(e)&&e.problem.status===409){let a=e.problem.fieldErrors.makeCode?.[0];a&&this.snackBar.open(a,`Close`,{duration:Ke})}this.load()}})}static ɵfac=function(e){return new(e||t)};static ɵcmp=ce({type:t,selectors:[[`app-vehicle-make-list`]],decls:19,vars:8,consts:[[1,`page`],[1,`page-header`],[1,`subtitle`],[`matButton`,`filled`,`type`,`button`,3,`click`],[1,`toolbar`],[`appearance`,`outline`,`subscriptSizing`,`dynamic`,1,`search`],[`matInput`,``,`type`,`search`,`autocomplete`,`off`,3,`formControl`],[1,`table-card`],[`mode`,`indeterminate`,`aria-label`,`Loading vehicle makes`],[`role`,`alert`,1,`state`],[`aria-label`,`Select a page of vehicle makes`,3,`page`,`length`,`pageSize`,`pageIndex`,`hidePageSize`,`showFirstLastButtons`],[`matButton`,`outlined`,`type`,`button`,3,`click`],[1,`table-scroll`],[`mat-table`,``,`matSort`,``,`matSortDisableClear`,``,3,`matSortChange`,`dataSource`,`matSortActive`,`matSortDirection`],[`matColumnDef`,`makeCode`],[`mat-header-cell`,``,`mat-sort-header`,``,4,`matHeaderCellDef`],[`mat-cell`,``,4,`matCellDef`],[`matColumnDef`,`makeName`],[`matColumnDef`,`shortName`],[`matColumnDef`,`status`],[`mat-header-cell`,``,4,`matHeaderCellDef`],[`matColumnDef`,`actions`],[`mat-header-cell`,``,`class`,`actions-column`,4,`matHeaderCellDef`],[`mat-cell`,``,`class`,`actions-column`,4,`matCellDef`],[`mat-header-row`,``,4,`matHeaderRowDef`],[`mat-row`,``,4,`matRowDef`,`matRowDefColumns`],[1,`state`],[`mat-header-cell`,``,`mat-sort-header`,``],[`mat-cell`,``],[`mat-header-cell`,``],[`mat-header-cell`,``,1,`actions-column`],[`mat-cell`,``,1,`actions-column`],[`matButton`,``,`type`,`button`,3,`click`],[`matButton`,``,`type`,`button`,1,`delete-action`,3,`click`],[`mat-header-row`,``],[`mat-row`,``]],template:function(e,a){e&1&&(ze(0,`section`,0)(1,`header`,1)(2,`div`)(3,`h1`),gn(4,`Vehicle Make Master`),We$1(),ze(5,`p`,2),gn(6,`Find, add and maintain the vehicle makes used across insurance records.`),We$1()(),ze(7,`button`,3),jr(`click`,function(){return a.add()}),gn(8,`Add vehicle make`),We$1()(),ze(9,`div`,4)(10,`mat-form-field`,5)(11,`mat-label`),gn(12,`Search by code, name or short name`),We$1(),ze(13,`input`,6),mx(),We$1()()(),ze(14,`div`,7),Lr(15,tt,1,0,`mat-progress-bar`,8),Lr(16,nt,5,0,`div`,9)(17,gt,20,6),ze(18,`mat-paginator`,10),jr(`page`,function(m){return a.onPage(m)}),We$1()()()),e&2&&(xe(13),hs(`formControl`,a.searchControl),bx(),xe(2),Fr(a.loading()?15:-1),xe(),Fr(a.loadFailed()?16:17),xe(2),hs(`length`,a.totalCount())(`pageSize`,a.pageSize)(`pageIndex`,a.pageIndex())(`hidePageSize`,!0)(`showFirstLastButtons`,!0))},dependencies:[Ss,er,vs,ra,cu,Ct,nn,Tn,kd,Md,wm,Va,Fm,qe,L,Ze,Cu,uu,pu,bu,hu,fu,yu,gu,_u,vu,xu],styles:[`.page[_ngcontent-%COMP%]{max-width:1100px;margin:0 auto;padding:24px 24px 48px}.page-header[_ngcontent-%COMP%]{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}h1[_ngcontent-%COMP%]{margin:0 0 4px;font-size:1.5rem;font-weight:600;color:var(--%NS%sdd-text)}.subtitle[_ngcontent-%COMP%]{margin:0;color:var(--%NS%sdd-muted)}.toolbar[_ngcontent-%COMP%]{margin-bottom:16px}.search[_ngcontent-%COMP%]{width:min(420px,100%)}.table-card[_ngcontent-%COMP%]{background:var(--%NS%sdd-surface);border:1px solid var(--%NS%sdd-border);border-radius:8px;overflow:hidden}.table-scroll[_ngcontent-%COMP%]{overflow-x:auto}table[_ngcontent-%COMP%]{width:100%}.actions-column[_ngcontent-%COMP%]{width:1%;white-space:nowrap;text-align:right}.delete-action[_ngcontent-%COMP%]{--%NS%mat-button-text-label-text-color: #b3261e}.state[_ngcontent-%COMP%]{margin:0;padding:32px 16px;text-align:center;color:var(--%NS%sdd-muted)}@media(max-width:600px){.page-header[_ngcontent-%COMP%]{flex-direction:column}}`]})};export{Ge as VehicleMakeListComponent};