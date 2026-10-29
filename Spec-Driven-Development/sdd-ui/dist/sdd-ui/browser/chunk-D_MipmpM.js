import{$ as Pe,$t as ft,An as ps,C as Fe,Ct as Xn,Dn as oe,E as Gt$1,En as nb,F as Jn,Fn as ra,G as Me,Gt as dc,It as ae,J as Np,Jn as ve,Jt as et,M as Ip,Mn as q,Mt as Zn,N as J,O as H,On as ol,Pt as Zy,Q as Oi,Qn as w,Qt as fn,R as Ks,Rt as b,St as Vr,T as Ge,Tt as Xy,U as Lr,Ut as ce,V as LY,Vt as bt,Wt as cu,Xn as vs,Xt as f,Y as Nt,Z as O0,Zn as vt,Zt as fc,_n as jr,a as A,ar as xw,bn as ku,cn as hs,cr as zn,ct as T,d as Cn,dn as iE,dt as Tp,en as fx,et as Pr,fn as i_,h as D_,ht as Ue,i as $o,in as gt,ir as xp,it as Rp,j as Ho,jt as Zl,kn as pn$1,l as Br,ln as hx,lt as Te,mt as UZ,nn as gn,nr as wt,o as Ae,pn as ie,qn as ut,r as $n,rn as gs,rr as x6,rt as R,s as Be,sn as hn,sr as z,st as Sp,tn as g,tr as wn,tt as Q,u as Ce,ur as n,vn as k0,vt as V8,w as Fr,wn as mn$1,yn as ke$1,yt as Ve,z as Kw}from"./main-QQMYYGHG.js";import{A as mn$2,D as fr,M as ns,N as un,O as is,P as wr,S as Ye,T as er,_ as Qr,a as Et,b as Wi,c as It,d as Mr,h as Qi,i as Dt$1,j as ms,k as kn,m as Nt$1,n as Ae$1,o as Fe$1,p as Nr,t as $n$1,u as Kr,v as Ri,w as Zr,x as Xr}from"./chunk-B53sdOlo.js";var Pt=new b(`CdkAccordion`);var Tt=(()=>{class t{accordion=f(Pt,{optional:!0,skipSelf:!0});_changeDetectorRef=f(zn);_expansionDispatcher=f(fr);_openCloseAllSubscription=z.EMPTY;closed=new q;opened=new q;destroyed=new q;expandedChange=new q;id=f(bt).getId(`cdk-accordion-child-`);get expanded(){return this._expanded}set expanded(e){if(this._expanded!==e){if(this._expanded=e,this.expandedChange.emit(e),e){this.opened.emit();let n=this.accordion?this.accordion.id:this.id;this._expansionDispatcher.notify(this.id,n)}else this.closed.emit();this._changeDetectorRef.markForCheck()}}_expanded=!1;get disabled(){return this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=Te(!1);_removeUniqueSelectionListener=()=>{};ngOnInit(){this._removeUniqueSelectionListener=this._expansionDispatcher.listen((e,n)=>{this.accordion&&!this.accordion.multi&&this.accordion.id===n&&this.id!==e&&(this.expanded=!1)}),this.accordion&&(this._openCloseAllSubscription=this._subscribeToOpenCloseAllActions())}ngOnDestroy(){this.opened.complete(),this.closed.complete(),this.destroyed.emit(),this.destroyed.complete(),this._removeUniqueSelectionListener(),this._openCloseAllSubscription.unsubscribe()}toggle(){this.disabled||(this.expanded=!this.expanded)}close(){this.disabled||(this.expanded=!1)}open(){this.disabled||(this.expanded=!0)}_subscribeToOpenCloseAllActions(){return this.accordion._openCloseAllActions.subscribe(e=>{this.disabled||(this.expanded=e)})}static ɵfac=function(n){return new(n||t)};static ɵdir=J({type:t,selectors:[[`cdk-accordion-item`],[``,`cdkAccordionItem`,``]],inputs:{expanded:[2,`expanded`,`expanded`,Ae],disabled:[2,`disabled`,`disabled`,Ae]},outputs:{closed:`closed`,opened:`opened`,destroyed:`destroyed`,expandedChange:`expandedChange`},exportAs:[`cdkAccordionItem`],features:[Tp([{provide:Pt,useValue:void 0}])]})}return t})();var Dt=(()=>{class t{static ɵfac=function(n){return new(n||t)};static ɵmod=ce({type:t});static ɵinj=ie({})}return t})();var zt=new b(`MAT_ACCORDION`);var Ft=new b(`MAT_EXPANSION_PANEL`);var Ut=(()=>{class t{_template=f(Ge);_expansionPanel=f(Ft,{optional:!0});static ɵfac=function(n){return new(n||t)};static ɵdir=J({type:t,selectors:[[`ng-template`,`matExpansionPanelContent`,``]]})}return t})();var Ot=new b(`MAT_EXPANSION_PANEL_DEFAULT_OPTIONS`);var ke=(()=>{class t extends Tt{_viewContainerRef=f(et);_animationsDisabled=vt();_document=f(T);_ngZone=f(R);_elementRef=f(Q);_renderer=f(ut);_cleanupTransitionEnd;get hideToggle(){return this._hideToggle||this.accordion&&this.accordion.hideToggle}set hideToggle(e){this._hideToggle=e}_hideToggle=!1;get togglePosition(){return this._togglePosition||this.accordion&&this.accordion.togglePosition}set togglePosition(e){this._togglePosition=e}_togglePosition;afterExpand=new q;afterCollapse=new q;_inputChanges=new w;accordion=f(zt,{optional:!0,skipSelf:!0});_lazyContent;_body;_bodyWrapper;_portal;_headerId=f(bt).getId(`mat-expansion-panel-header-`);constructor(){super();let e=f(Ot,{optional:!0});this._expansionDispatcher=f(fr),e&&(this.hideToggle=e.hideToggle)}_hasSpacing(){return this.accordion?this.expanded&&this.accordion.displayMode==="default":!1}_getExpandedState(){return this.expanded?`expanded`:`collapsed`}toggle(){this.expanded=!this.expanded}close(){this.expanded=!1}open(){this.expanded=!0}ngAfterContentInit(){this._lazyContent&&this._lazyContent._expansionPanel===this&&this.opened.pipe(wt(null),oe(()=>this.expanded&&!this._portal),ke$1(1)).subscribe(()=>{this._portal=new Cn(this._lazyContent._template,this._viewContainerRef)}),this._setupAnimationEvents()}ngOnChanges(e){this._inputChanges.next(e)}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTransitionEnd?.(),this._inputChanges.complete()}_containsFocus(){if(this._body){let e=this._document.activeElement,n=this._body.nativeElement;return e===n||n.contains(e)}return!1}_transitionEndListener=({target:e,propertyName:n})=>{e===this._bodyWrapper?.nativeElement&&n===`grid-template-rows`&&this._ngZone.run(()=>{this.expanded?this.afterExpand.emit():this.afterCollapse.emit()})};_setupAnimationEvents(){this._ngZone.runOutsideAngular(()=>{this._animationsDisabled?(this.opened.subscribe(()=>this._ngZone.run(()=>this.afterExpand.emit())),this.closed.subscribe(()=>this._ngZone.run(()=>this.afterCollapse.emit()))):setTimeout(()=>{let e=this._elementRef.nativeElement;this._cleanupTransitionEnd=this._renderer.listen(e,`transitionend`,this._transitionEndListener),e.classList.add(`mat-expansion-panel-animations-enabled`)},200)})}static ɵfac=function(n){return new(n||t)};static ɵcmp=(function(){let e=[`body`],n=[`bodyWrapper`],c=[[[`mat-expansion-panel-header`]],`*`,[[`mat-action-row`]]],l=[`mat-expansion-panel-header`,`*`,`mat-action-row`];function m(i,h){}return ae({type:t,selectors:[[`mat-expansion-panel`]],contentQueries:function(h,u,z){if(h&1&&Zy(z,Ut,5),h&2){let Se;Br(Se=Vr())&&(u._lazyContent=Se.first)}},viewQuery:function(h,u){if(h&1&&jr(e,5)(n,5),h&2){let z;Br(z=Vr())&&(u._body=z.first),Br(z=Vr())&&(u._bodyWrapper=z.first)}},hostAttrs:[1,`mat-expansion-panel`],hostVars:4,hostBindings:function(h,u){h&2&&Fe(`mat-expanded`,u.expanded)(`mat-expansion-panel-spacing`,u._hasSpacing())},inputs:{hideToggle:[2,`hideToggle`,`hideToggle`,Ae],togglePosition:`togglePosition`},outputs:{afterExpand:`afterExpand`,afterCollapse:`afterCollapse`},exportAs:[`matExpansionPanel`],features:[Tp([{provide:zt,useValue:void 0},{provide:Ft,useExisting:t}]),Me,Nt],ngContentSelectors:l,decls:9,vars:4,consts:[[`bodyWrapper`,``],[`body`,``],[1,`mat-expansion-panel-content-wrapper`],[`role`,`region`,1,`mat-expansion-panel-content`,3,`id`],[1,`mat-expansion-panel-body`],[3,`cdkPortalOutlet`]],template:function(h,u){h&1&&($o(c),Gt$1(0),Ve(1,`div`,2,0)(3,`div`,3,1)(5,`div`,4),Gt$1(6,1),$n(7,m,0,0,`ng-template`,5),Ue(),Gt$1(8,2),Ue()()),h&2&&(Ce(),ft(`inert`,u.expanded?null:``),Ce(2),ps(`id`,u.id),ft(`aria-labelledby`,u._headerId),Ce(4),ps(`cdkPortalOutlet`,u._portal))},dependencies:[Jn],styles:[`.mat-expansion-panel {
  box-sizing: content-box;
  display: block;
  margin: 0;
  overflow: hidden;
}
.mat-expansion-panel.mat-expansion-panel-animations-enabled {
  transition: margin 225ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel {
  position: relative;
  background: var(--%NS%mat-expansion-container-background-color, var(--%NS%mat-sys-surface));
  color: var(--%NS%mat-expansion-container-text-color, var(--%NS%mat-sys-on-surface));
  border-radius: var(--%NS%mat-expansion-container-shape, 12px);
}
.mat-expansion-panel:not([class*=mat-elevation-z]) {
  box-shadow: var(--%NS%mat-expansion-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}
.mat-accordion .mat-expansion-panel:not(.mat-expanded), .mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing) {
  border-radius: 0;
}
.mat-accordion .mat-expansion-panel:first-of-type {
  border-top-right-radius: var(--%NS%mat-expansion-container-shape, 12px);
  border-top-left-radius: var(--%NS%mat-expansion-container-shape, 12px);
}
.mat-accordion .mat-expansion-panel:last-of-type {
  border-bottom-right-radius: var(--%NS%mat-expansion-container-shape, 12px);
  border-bottom-left-radius: var(--%NS%mat-expansion-container-shape, 12px);
}
@media (forced-colors: active) {
  .mat-expansion-panel {
    outline: solid 1px;
  }
}

.mat-expansion-panel-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  grid-template-columns: 100%;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-content-wrapper {
  transition: grid-template-rows 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
  grid-template-rows: 1fr;
}
@supports not (grid-template-rows: 0fr) {
  .mat-expansion-panel-content-wrapper {
    height: 0;
  }
  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
    height: auto;
  }
}
@media print {
  .mat-expansion-panel-content-wrapper {
    height: 0;
  }
  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
    height: auto;
  }
}

.mat-expansion-panel-content {
  display: flex;
  flex-direction: column;
  overflow: visible;
  min-height: 0;
  visibility: hidden;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-content {
  transition: visibility 190ms linear;
}
.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper > .mat-expansion-panel-content {
  visibility: visible;
}
.mat-expansion-panel-content {
  font-family: var(--%NS%mat-expansion-container-text-font, var(--%NS%mat-sys-body-large-font));
  font-size: var(--%NS%mat-expansion-container-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-expansion-container-text-weight, var(--%NS%mat-sys-body-large-weight));
  line-height: var(--%NS%mat-expansion-container-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  letter-spacing: var(--%NS%mat-expansion-container-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}

.mat-expansion-panel-body {
  padding: 0 24px 16px;
}

.mat-expansion-panel-spacing {
  margin: 16px 0;
}
.mat-accordion > .mat-expansion-panel-spacing:first-child, .mat-accordion > *:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {
  margin-top: 0;
}
.mat-accordion > .mat-expansion-panel-spacing:last-child, .mat-accordion > *:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {
  margin-bottom: 0;
}

.mat-action-row {
  border-top-style: solid;
  border-top-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 16px 8px 16px 24px;
  border-top-color: var(--%NS%mat-expansion-actions-divider-color, var(--%NS%mat-sys-outline));
}
.mat-action-row .mat-button-base,
.mat-action-row .mat-mdc-button-base {
  margin-left: 8px;
}
[dir=rtl] .mat-action-row .mat-button-base,
[dir=rtl] .mat-action-row .mat-mdc-button-base {
  margin-left: 0;
  margin-right: 8px;
}
`],encapsulation:2})})()}return t})();var Lt=(()=>{class t{panel=f(ke,{host:!0});_element=f(Q);_focusMonitor=f(Ks);_changeDetectorRef=f(zn);_parentChangeSubscription=z.EMPTY;constructor(){f(gt).load(xw);let e=this.panel,n=f(Ot,{optional:!0}),c=f(new Rp(`tabindex`),{optional:!0}),l=e.accordion?e.accordion._stateChanges.pipe(oe(m=>!!(m.hideToggle||m.togglePosition))):ve;this.tabIndex=parseInt(c||``)||0,this._parentChangeSubscription=ku(e.opened,e.closed,l,e._inputChanges.pipe(oe(m=>!!(m.hideToggle||m.disabled||m.togglePosition)))).subscribe(()=>this._changeDetectorRef.markForCheck()),e.closed.pipe(oe(()=>e._containsFocus())).subscribe(()=>this._focusMonitor.focusVia(this._element,`program`)),n&&(this.expandedHeight=n.expandedHeight,this.collapsedHeight=n.collapsedHeight)}expandedHeight;collapsedHeight;tabIndex=0;get disabled(){return this.panel.disabled}_toggle(){this.disabled||this.panel.toggle()}_isExpanded(){return this.panel.expanded}_getExpandedState(){return this.panel._getExpandedState()}_getPanelId(){return this.panel.id}_getTogglePosition(){return this.panel.togglePosition}_showToggle(){return!this.panel.hideToggle&&!this.panel.disabled}_getHeaderHeight(){let e=this._isExpanded();return e&&this.expandedHeight?this.expandedHeight:!e&&this.collapsedHeight?this.collapsedHeight:null}_keydown(e){switch(e.keyCode){case 32:case 13:Xn(e)||(e.preventDefault(),this._toggle());break;default:this.panel.accordion&&this.panel.accordion._handleHeaderKeydown(e);return}}focus(e,n){e?this._focusMonitor.focusVia(this._element,e,n):this._element.nativeElement.focus(n)}ngAfterViewInit(){this._focusMonitor.monitor(this._element).subscribe(e=>{e&&this.panel.accordion&&this.panel.accordion._handleHeaderFocus(this)})}ngOnDestroy(){this._parentChangeSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._element)}static ɵfac=function(n){return new(n||t)};static ɵcmp=(function(){let e=[[[`mat-panel-title`]],[[`mat-panel-description`]],`*`],n=[`mat-panel-title`,`mat-panel-description`,`*`];function c(l,m){l&1&&(fn(0,`span`,1),nb(),fn(1,`svg`,2),hn(2,`path`,3),pn$1()())}return ae({type:t,selectors:[[`mat-expansion-panel-header`]],hostAttrs:[`role`,`button`,1,`mat-expansion-panel-header`,`mat-focus-indicator`],hostVars:13,hostBindings:function(m,i){m&1&&Fr(`click`,function(){return i._toggle()})(`keydown`,function(u){return i._keydown(u)}),m&2&&(ft(`id`,i.panel._headerId)(`tabindex`,i.disabled?-1:i.tabIndex)(`aria-controls`,i._getPanelId())(`aria-expanded`,i._isExpanded())(`aria-disabled`,i.panel.disabled),Ip(`height`,i._getHeaderHeight()),Fe(`mat-expanded`,i._isExpanded())(`mat-expansion-toggle-indicator-after`,i._getTogglePosition()===`after`)(`mat-expansion-toggle-indicator-before`,i._getTogglePosition()===`before`))},inputs:{expandedHeight:`expandedHeight`,collapsedHeight:`collapsedHeight`,tabIndex:[2,`tabIndex`,`tabIndex`,l=>l==null?0:D_(l)]},ngContentSelectors:n,decls:5,vars:3,consts:[[1,`mat-content`],[1,`mat-expansion-indicator`],[`xmlns`,`http://www.w3.org/2000/svg`,`viewBox`,`0 -960 960 960`,`aria-hidden`,`true`,`focusable`,`false`],[`d`,`M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z`]],template:function(m,i){m&1&&($o(e),fn(0,`span`,0),Gt$1(1),Gt$1(2,1),Gt$1(3,2),pn$1(),Pr(4,c,3,0,`span`,1)),m&2&&(Fe(`mat-content-hide-toggle`,!i._showToggle()),Ce(4),Lr(i._showToggle()?4:-1))},styles:[`.mat-expansion-panel-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
  border-radius: inherit;
  outline: 0;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-header {
  transition: height 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel-header::before {
  border-radius: inherit;
}
.mat-expansion-panel-header {
  height: var(--%NS%mat-expansion-header-collapsed-state-height, 48px);
  font-family: var(--%NS%mat-expansion-header-text-font, var(--%NS%mat-sys-title-medium-font));
  font-size: var(--%NS%mat-expansion-header-text-size, var(--%NS%mat-sys-title-medium-size));
  font-weight: var(--%NS%mat-expansion-header-text-weight, var(--%NS%mat-sys-title-medium-weight));
  line-height: var(--%NS%mat-expansion-header-text-line-height, var(--%NS%mat-sys-title-medium-line-height));
  letter-spacing: var(--%NS%mat-expansion-header-text-tracking, var(--%NS%mat-sys-title-medium-tracking));
}
.mat-expansion-panel-header.mat-expanded {
  height: var(--%NS%mat-expansion-header-expanded-state-height, 64px);
}
.mat-expansion-panel-header[aria-disabled=true] {
  color: var(--%NS%mat-expansion-header-disabled-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-expansion-panel-header:not([aria-disabled=true]) {
  cursor: pointer;
}
.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {
  background: var(--%NS%mat-expansion-header-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
@media (hover: none) {
  .mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {
    background: var(--%NS%mat-expansion-container-background-color, var(--%NS%mat-sys-surface));
  }
}
.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused, .mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused {
  background: var(--%NS%mat-expansion-header-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));
}
.mat-expansion-panel-header._mat-animation-noopable {
  transition: none;
}
.mat-expansion-panel-header.mat-expanded:focus, .mat-expansion-panel-header.mat-expanded:hover {
  background: inherit;
}
.mat-expansion-panel-header.mat-expansion-toggle-indicator-before {
  flex-direction: row-reverse;
}
.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {
  margin: 0 16px 0 0;
}
[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {
  margin: 0 0 0 16px;
}

.mat-content {
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
}
.mat-content.mat-content-hide-toggle {
  margin-right: 8px;
}
[dir=rtl] .mat-content.mat-content-hide-toggle {
  margin-right: 0;
  margin-left: 8px;
}
.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {
  margin-left: 24px;
  margin-right: 0;
}
[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {
  margin-right: 24px;
  margin-left: 0;
}

.mat-expansion-panel-header-title {
  color: var(--%NS%mat-expansion-header-text-color, var(--%NS%mat-sys-on-surface));
}

.mat-expansion-panel-header-title,
.mat-expansion-panel-header-description {
  display: flex;
  flex-grow: 1;
  flex-basis: 0;
  margin-right: 16px;
  align-items: center;
}
[dir=rtl] .mat-expansion-panel-header-title,
[dir=rtl] .mat-expansion-panel-header-description {
  margin-right: 0;
  margin-left: 16px;
}
.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,
.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description {
  color: inherit;
}

.mat-expansion-panel-header-description {
  flex-grow: 2;
  color: var(--%NS%mat-expansion-header-description-color, var(--%NS%mat-sys-on-surface-variant));
}

.mat-expansion-panel-animations-enabled .mat-expansion-indicator {
  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel-header.mat-expanded .mat-expansion-indicator {
  transform: rotate(180deg);
}
.mat-expansion-indicator::after {
  border-style: solid;
  border-width: 0 2px 2px 0;
  content: "";
  padding: 3px;
  transform: rotate(45deg);
  vertical-align: middle;
  color: var(--%NS%mat-expansion-header-indicator-color, var(--%NS%mat-sys-on-surface-variant));
  display: var(--%NS%mat-expansion-legacy-header-indicator-display, none);
}
.mat-expansion-indicator svg {
  width: 24px;
  height: 24px;
  margin: 0 -8px;
  vertical-align: middle;
  fill: var(--%NS%mat-expansion-header-indicator-color, var(--%NS%mat-sys-on-surface-variant));
  display: var(--%NS%mat-expansion-header-indicator-display, inline-block);
}

@media (forced-colors: active) {
  .mat-expansion-panel-content {
    border-top: 1px solid;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
`],encapsulation:2})})()}return t})();var Rt=(()=>{class t{static ɵfac=function(n){return new(n||t)};static ɵdir=J({type:t,selectors:[[`mat-panel-description`]],hostAttrs:[1,`mat-expansion-panel-header-description`]})}return t})();var Vt=(()=>{class t{static ɵfac=function(n){return new(n||t)};static ɵdir=J({type:t,selectors:[[`mat-panel-title`]],hostAttrs:[1,`mat-expansion-panel-header-title`]})}return t})();var Ht=(()=>{class t{static ɵfac=function(n){return new(n||t)};static ɵmod=ce({type:t});static ɵinj=ie({imports:[Dt,ra,wn]})}return t})();var qt=(()=>{class t{labelPosition=`after`;static ɵfac=function(n){return new(n||t)};static ɵcmp=(function(){return ae({type:t,selectors:[[``,`mat-internal-form-field`,``]],hostAttrs:[1,`mdc-form-field`,`mat-internal-form-field`],hostVars:2,hostBindings:function(c,l){c&2&&Fe(`mdc-form-field--align-end`,l.labelPosition===`before`)},inputs:{labelPosition:`labelPosition`},ngContentSelectors:[`*`],decls:1,vars:0,template:function(c,l){c&1&&($o(),Gt$1(0))},styles:[`.mat-internal-form-field {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
.mat-internal-form-field > label, .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
  order: 0;
}
[dir=rtl] .mat-internal-form-field > label, [dir=rtl] .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
}

.mdc-form-field--align-end > label, .mdc-form-field--align-end > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
  order: -1;
}
[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label, [dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
}
`],encapsulation:2})})()}return t})();var Gt=new b(`mat-slide-toggle-default-options`,{providedIn:`root`,factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})});var ge=class{source;checked;constructor(a,e){this.source=a,this.checked=e}};var ue=(()=>{class t{_elementRef=f(Q);_focusMonitor=f(Ks);_changeDetectorRef=f(zn);defaults=f(Gt);_injector=f(A);_signalFormField=null;_onChange=e=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(e){return new ge(this,e)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=vt();_focused=!1;name=null;id;labelPosition=`after`;ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(e){this._checked=e,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new q;toggleChange=new q;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){f(gt).load(xw);let e=f(new Rp(`tabindex`),{optional:!0}),n=this.defaults;this.tabIndex=e==null?0:parseInt(e)||0,this.color=n.color||`accent`,this.id=this._uniqueId=f(bt).getId(`mat-mdc-slide-toggle-`),this.hideIcon=n.hideIcon??!1,this.disabledInteractive=n.disabledInteractive??!1,this._labelId=this._uniqueId+`-label`}ngOnInit(){this._signalFormField=this._injector.get(kn,void 0,{optional:!0,self:!0})}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(e=>{e===`keyboard`||e===`program`?(this._focused=!0,this._changeDetectorRef.markForCheck()):e||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(e){e.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(e){this.checked=!!e}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}validate(e){return this.required&&e.value!==!0&&!this._signalFormField?{required:!0}:null}registerOnValidatorChange(e){this._validatorOnChange=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new ge(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static ɵfac=function(n){return new(n||t)};static ɵcmp=(function(){let e=[`switch`],n=[`*`];function c(l,m){l&1&&(Ve(0,`span`,11),nb(),Ve(1,`svg`,13),Ho(2,`path`,14),Ue(),Ve(3,`svg`,15),Ho(4,`path`,16),Ue()())}return ae({type:t,selectors:[[`mat-slide-toggle`]],viewQuery:function(m,i){if(m&1&&jr(e,5),m&2){let h;Br(h=Vr())&&(i._switchElement=h.first)}},hostAttrs:[1,`mat-mdc-slide-toggle`],hostVars:15,hostBindings:function(m,i){m&2&&(hs(`id`,i.id),ft(`tabindex`,null)(`aria-label`,null)(`name`,null)(`aria-labelledby`,null),xp(i.color?`mat-`+i.color:``),Fe(`mat-mdc-slide-toggle-focused`,i._focused)(`mat-mdc-slide-toggle-checked`,i.checked)(`mat-slide-toggle-full-width`,i.fullWidth)(`_mat-animation-noopable`,i._noopAnimations))},inputs:{name:`name`,id:`id`,labelPosition:`labelPosition`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],required:[2,`required`,`required`,Ae],color:`color`,disabled:[2,`disabled`,`disabled`,Ae],fullWidth:[2,`fullWidth`,`fullWidth`,Ae],disableRipple:[2,`disableRipple`,`disableRipple`,Ae],tabIndex:[2,`tabIndex`,`tabIndex`,l=>l==null?0:D_(l)],checked:[2,`checked`,`checked`,Ae],hideIcon:[2,`hideIcon`,`hideIcon`,Ae],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,Ae]},outputs:{change:`change`,toggleChange:`toggleChange`},exportAs:[`matSlideToggle`],features:[Tp([{provide:un,useExisting:Oi(()=>t),multi:!0},{provide:Fe$1,useExisting:t,multi:!0}]),Nt],ngContentSelectors:n,decls:14,vars:27,consts:[[`switch`,``],[`mat-internal-form-field`,``,3,`labelPosition`],[`role`,`switch`,`type`,`button`,1,`mdc-switch`,3,`click`,`tabIndex`,`disabled`],[1,`mat-mdc-slide-toggle-touch-target`],[1,`mdc-switch__track`],[1,`mdc-switch__handle-track`],[1,`mdc-switch__handle`],[1,`mdc-switch__shadow`],[1,`mdc-elevation-overlay`],[1,`mdc-switch__ripple`],[`mat-ripple`,``,1,`mat-mdc-slide-toggle-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mdc-switch__icons`],[1,`mdc-label`,3,`click`,`for`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--on`],[`d`,`M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--off`],[`d`,`M20 13H4v-2h16v2z`]],template:function(m,i){if(m&1&&($o(),Ve(0,`div`,1)(1,`button`,2,0),Fr(`click`,function(){return i._handleClick()}),Ho(3,`div`,3)(4,`span`,4),Ve(5,`span`,5)(6,`span`,6)(7,`span`,7),Ho(8,`span`,8),Ue(),Ve(9,`span`,9),Ho(10,`span`,10),Ue(),Pr(11,c,5,0,`span`,11),Ue()()(),Ve(12,`label`,12),Fr(`click`,function(u){return u.stopPropagation()}),Gt$1(13),Ue()()),m&2){let h=O0(2);ps(`labelPosition`,i.labelPosition),Ce(),Fe(`mdc-switch--selected`,i.checked)(`mdc-switch--unselected`,!i.checked)(`mdc-switch--checked`,i.checked)(`mdc-switch--disabled`,i.disabled)(`mat-mdc-slide-toggle-disabled-interactive`,i.disabledInteractive),ps(`tabIndex`,i.disabled&&!i.disabledInteractive?-1:i.tabIndex)(`disabled`,i.disabled&&!i.disabledInteractive),ft(`id`,i.buttonId)(`name`,i.name)(`aria-label`,i.ariaLabel)(`aria-labelledby`,i._getAriaLabelledBy())(`aria-describedby`,i.ariaDescribedby)(`aria-required`,i.required||null)(`aria-checked`,i.checked)(`aria-disabled`,i.disabled&&i.disabledInteractive?`true`:null),Ce(9),ps(`matRippleTrigger`,h)(`matRippleDisabled`,i.disableRipple||i.disabled)(`matRippleCentered`,!0),Ce(),Lr(i.hideIcon?-1:11),Ce(),ps(`for`,i.buttonId),ft(`id`,i._labelId)}},dependencies:[x6,qt],styles:[`.mdc-switch {
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 0;
  position: relative;
  width: var(--%NS%mat-slide-toggle-track-width, 52px);
}
.mdc-switch.mdc-switch--disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-switch.mat-mdc-slide-toggle-disabled-interactive {
  pointer-events: auto;
}

.mdc-switch__track {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: var(--%NS%mat-slide-toggle-track-height, 32px);
  border-radius: var(--%NS%mat-slide-toggle-track-shape, var(--%NS%mat-sys-corner-full));
}
.mdc-switch--disabled.mdc-switch .mdc-switch__track {
  opacity: var(--%NS%mat-slide-toggle-disabled-track-opacity, 0.12);
}
.mdc-switch__track::before, .mdc-switch__track::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  width: 100%;
  border-width: var(--%NS%mat-slide-toggle-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-track-outline-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--selected .mdc-switch__track::before, .mdc-switch--selected .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-selected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-selected-track-outline-color, transparent);
}
.mdc-switch--disabled .mdc-switch__track::before, .mdc-switch--disabled .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-color, var(--%NS%mat-sys-on-surface));
}
@media (forced-colors: active) {
  .mdc-switch__track {
    border-color: currentColor;
  }
}
.mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: translateX(0);
  background: var(--%NS%mat-slide-toggle-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch--selected .mdc-switch__track::before {
  transform: translateX(-100%);
}
.mdc-switch--selected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-hover-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-focus-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:active .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-track-color, var(--%NS%mat-sys-surface-variant));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::before, .mdc-switch.mdc-switch--disabled .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch__track::after {
  transform: translateX(-100%);
  background: var(--%NS%mat-slide-toggle-selected-track-color, var(--%NS%mat-sys-primary));
}
[dir=rtl] .mdc-switch__track::after {
  transform: translateX(100%);
}
.mdc-switch--selected .mdc-switch__track::after {
  transform: translateX(0);
}
.mdc-switch--selected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:active .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-track-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::after, .mdc-switch.mdc-switch--disabled .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-track-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch__handle-track {
  height: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  left: 0;
  right: auto;
  transform: translateX(0);
  width: calc(100% - var(--%NS%mat-slide-toggle-handle-width));
}
[dir=rtl] .mdc-switch__handle-track {
  left: auto;
  right: 0;
}
.mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(-100%);
}

.mdc-switch__handle {
  display: flex;
  pointer-events: auto;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: auto;
  transition: width 75ms cubic-bezier(0.4, 0, 0.2, 1), height 75ms cubic-bezier(0.4, 0, 0.2, 1), margin 75ms cubic-bezier(0.4, 0, 0.2, 1);
  width: var(--%NS%mat-slide-toggle-handle-width);
  height: var(--%NS%mat-slide-toggle-handle-height);
  border-radius: var(--%NS%mat-slide-toggle-handle-shape, var(--%NS%mat-sys-corner-full));
}
[dir=rtl] .mdc-switch__handle {
  left: auto;
  right: 0;
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  margin: var(--%NS%mat-slide-toggle-unselected-handle-horizontal-margin, 0 8px);
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-unselected-with-icon-handle-horizontal-margin, 0 4px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  margin: var(--%NS%mat-slide-toggle-selected-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-selected-with-icon-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch__handle:has(.mdc-switch__icons) {
  width: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
}
.mat-mdc-slide-toggle .mdc-switch:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
  height: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%selected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-selected-pressed-handle-horizontal-margin, 0 22px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%unselected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-unselected-pressed-handle-horizontal-margin, 0 2px);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-handle-opacity, 1);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-handle-opacity, 0.38);
}
.mdc-switch__handle::before, .mdc-switch__handle::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  width: 100%;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1), border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}
@media (forced-colors: active) {
  .mdc-switch__handle::before, .mdc-switch__handle::after {
    border-color: currentColor;
  }
}
.mdc-switch--%NS%selected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-handle-color, var(--%NS%mat-sys-on-primary));
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-handle-color, var(--%NS%mat-sys-primary-container));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:hover:not(:focus):not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:focus:not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:active .mdc-switch__handle::after, .mdc-switch--selected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-handle-color, var(--%NS%mat-sys-surface));
}
.mdc-switch--%NS%unselected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-handle-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--%NS%unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-handle-color, var(--%NS%mat-sys-on-surface));
}
.mdc-switch__handle::before {
  background: var(--%NS%mat-slide-toggle-handle-surface-color);
}

.mdc-switch__shadow {
  border-radius: inherit;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.mdc-switch:enabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-handle-elevation-shadow);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__shadow, .mdc-switch.mdc-switch--disabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-disabled-handle-elevation-shadow);
}

.mdc-switch__ripple {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  width: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
  height: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
}
.mdc-switch__ripple::after {
  content: "";
  opacity: 0;
}
.mdc-switch--disabled .mdc-switch__ripple::after {
  display: none;
}
.mat-mdc-slide-toggle-disabled-interactive .mdc-switch__ripple::after {
  display: block;
}
.mdc-switch:hover .mdc-switch__ripple::after {
  transition: 75ms opacity cubic-bezier(0, 0, 0.2, 1);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:focus .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:active .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:hover:not(:focus) .mdc-switch__ripple::after, .mdc-switch--%NS%unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}

.mdc-switch__icons {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 1;
  transform: translateZ(0);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-icon-opacity, 0.38);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-icon-opacity, 0.38);
}

.mdc-switch__icon {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1);
}
.mdc-switch--unselected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-selected-icon-color, var(--%NS%mat-sys-on-primary-container));
}
.mdc-switch--selected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-selected-icon-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch--selected .mdc-switch__icon--on,
.mdc-switch--unselected .mdc-switch__icon--off {
  opacity: 1;
  transition: opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1);
}

.mat-mdc-slide-toggle {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  -webkit-tap-highlight-color: transparent;
  outline: 0;
}
.mat-mdc-slide-toggle .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple,
.mat-mdc-slide-toggle .mdc-switch__ripple::after {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple:not(:empty),
.mat-mdc-slide-toggle .mdc-switch__ripple::after:not(:empty) {
  transform: translateZ(0);
}
.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mat-focus-indicator::before {
  content: "";
}
.mat-mdc-slide-toggle .mat-internal-form-field {
  color: var(--%NS%mat-slide-toggle-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-slide-toggle-label-text-font, var(--%NS%mat-sys-body-medium-font));
  line-height: var(--%NS%mat-slide-toggle-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-slide-toggle-label-text-size, var(--%NS%mat-sys-body-medium-size));
  letter-spacing: var(--%NS%mat-slide-toggle-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
  font-weight: var(--%NS%mat-slide-toggle-label-text-weight, var(--%NS%mat-sys-body-medium-weight));
}
.mat-mdc-slide-toggle .mat-ripple-element {
  opacity: 0.12;
}
.mat-mdc-slide-toggle .mat-focus-indicator::before {
  border-radius: 50%;
}
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle-track,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__icon,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::after,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::after {
  transition: none;
}
.mat-mdc-slide-toggle .mdc-switch:enabled + .mdc-label {
  cursor: pointer;
}
.mat-mdc-slide-toggle .mdc-switch--disabled + label {
  color: var(--%NS%mat-slide-toggle-disabled-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-slide-toggle label:empty {
  display: none;
}

.mat-slide-toggle-full-width {
  width: 100%;
}
.mat-slide-toggle-full-width .mat-internal-form-field {
  width: 100%;
  justify-content: space-between;
}
.mat-slide-toggle-full-width .mat-internal-form-field label {
  margin: 0;
  flex-grow: 1;
  text-align: end;
}
.mat-slide-toggle-full-width .mdc-form-field--align-end label {
  text-align: start;
}

.mat-mdc-slide-toggle-touch-target {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--%NS%mat-slide-toggle-touch-target-size, 48px);
  width: 100%;
  transform: translate(-50%, -50%);
  display: var(--%NS%mat-slide-toggle-touch-target-display, block);
}
[dir=rtl] .mat-mdc-slide-toggle-touch-target {
  left: auto;
  right: 50%;
  transform: translate(50%, -50%);
}
`],encapsulation:2})})()}return t})();function Yt(t,a){if(t&1&&(Ve(0,`textarea`,1),fx(),Ue()),t&2){let e=ol();ps(`formControl`,e.control())(`maxlength`,e.maxLength()),ft(`dir`,e.direction())(`lang`,e.rtl()?`ar`:null),hx()}}function $t(t,a){if(t&1){let e=Sp();Ve(0,`input`,4),fx(),Fr(`blur`,function(){dc(e);let c=ol();return fc(c.convertToUppercase())}),Ue()}if(t&2){let e=ol();Fe(`uppercase`,e.uppercase()),ps(`formControl`,e.control())(`maxlength`,e.maxLength()),ft(`dir`,e.direction())(`lang`,e.rtl()?`ar`:null),hx()}}function Jt(t,a){if(t&1&&(Ve(0,`mat-hint`),mn$1(1),Ue()),t&2){let e=ol();Ce(),gn(`Maximum `,e.maxLength(),` characters.`)}}function en(t,a){if(t&1&&(Ve(0,`mat-hint`,3),mn$1(1),Ue()),t&2){let e=ol();Ce(),i_(``,e.length(),` / `,e.maxLength())}}function tn(t,a){if(t&1&&(Ve(0,`mat-error`),mn$1(1),Ue()),t&2){let e=ol();Ce(),gn(``,e.label(),` is required.`)}}function nn(t,a){if(t&1&&(Ve(0,`mat-error`),mn$1(1),Ue()),t&2){let e=ol();Ce(),gs(e.patternMessage())}}function an(t,a){if(t&1&&(Ve(0,`mat-error`),mn$1(1),Ue()),t&2){let e=ol();Ce(),gn(`Maximum `,e.maxLength(),` characters.`)}}function on(t,a){t&1&&(Ve(0,`mat-error`),mn$1(1),Ue()),t&2&&(Ce(),gs(a))}var fe=class t{label=vs.required();control=vs.required();maxLength=vs.required();patternMessage=vs(`This value is not in the expected format.`);rtl=vs(!1);multiline=vs(!1);uppercase=vs(!1);showCounter=vs(!1);state=wr(Nr(this.control).pipe(Be(a=>ku(a.valueChanges,a.statusChanges).pipe(wt(null),H(()=>({length:a.value.length,enabled:a.enabled}))))),{initialValue:{length:0,enabled:!0}});length=Np(()=>this.state().length);direction=Np(()=>this.rtl()?`rtl`:`ltr`);limitReached=Np(()=>this.state().enabled&&this.state().length>=this.maxLength());serverMessage(){let a=this.control().getError(`server`);return typeof a==`string`?a:null}convertToUppercase(){let a=this.control();this.uppercase()&&a.value!==a.value.toUpperCase()&&a.setValue(a.value.toUpperCase())}static ɵfac=function(e){return new(e||t)};static ɵcmp=ae({type:t,selectors:[[`app-limited-text-field`]],inputs:{label:[1,`label`],control:[1,`control`],maxLength:[1,`maxLength`],patternMessage:[1,`patternMessage`],rtl:[1,`rtl`],multiline:[1,`multiline`],uppercase:[1,`uppercase`],showCounter:[1,`showCounter`]},decls:11,vars:5,consts:[[`appearance`,`outline`,`subscriptSizing`,`dynamic`,1,`field`],[`matInput`,``,`rows`,`3`,3,`formControl`,`maxlength`],[`matInput`,``,`type`,`text`,`autocomplete`,`off`,3,`formControl`,`maxlength`,`uppercase`],[`align`,`end`],[`matInput`,``,`type`,`text`,`autocomplete`,`off`,3,`blur`,`formControl`,`maxlength`]],template:function(e,n){if(e&1&&(Ve(0,`mat-form-field`,0)(1,`mat-label`),mn$1(2),Ue(),Pr(3,Yt,1,4,`textarea`,1)(4,$t,1,6,`input`,2),Pr(5,Jt,2,1,`mat-hint`),Pr(6,en,2,2,`mat-hint`,3),Pr(7,tn,2,1,`mat-error`)(8,nn,2,1,`mat-error`)(9,an,2,1,`mat-error`)(10,on,2,1,`mat-error`),Ue()),e&2){let c;Ce(2),gs(n.label()),Ce(),Lr(n.multiline()?3:4),Ce(2),Lr(n.limitReached()?5:-1),Ce(),Lr(n.showCounter()?6:-1),Ce(),Lr(n.control().hasError(`required`)?7:n.control().hasError(`pattern`)?8:n.control().hasError(`maxlength`)?9:(c=n.serverMessage())?10:-1,c)}},dependencies:[Qr,mn$2,Xr,Ri,Qi,It,$n$1,Et,Dt$1,er,is,ns],styles:[`[_nghost-%COMP%]{display:block}.field[_ngcontent-%COMP%]{width:100%}.uppercase[_ngcontent-%COMP%]{text-transform:uppercase}`]})};function be(t){return t.value.trim().length===0?{required:!0}:null}function rn(t,a){t&1&&(Ve(0,`p`,2),mn$1(1,`Review the details, or switch on Edit to change them.`),Ue())}function sn(t,a){t&1&&(Ve(0,`p`,2),mn$1(1,`Fields marked * are required.`),Ue())}function dn(t,a){if(t&1){let e=Sp();Ve(0,`mat-slide-toggle`,18),Fr(`change`,function(c){dc(e);let l=ol();return fc(l.onEditToggle(c))}),mn$1(1,` Edit `),Ue()}if(t&2){let e=ol();ps(`checked`,e.editing())(`disabled`,e.loading()||e.saving())}}function ln(t,a){t&1&&Ho(0,`mat-progress-bar`,4)}function cn(t,a){if(t&1&&(Ve(0,`button`,17),mn$1(1),Ue()),t&2){let e=ol();ps(`disabled`,e.saving()||e.loading()),Ce(),gn(` `,e.mode===`create`?`Save vehicle make`:`Save changes`,` `)}}var jt=5e3;var P={makeCode:12,makeName:100,shortName:30,remarks:2e3,arabicMakeName:100,arabicShortName:30,arabicRemarks:2e3};var mn=[`remarks`,`arabicMakeName`,`arabicShortName`,`arabicRemarks`];var Bt=class t{client=f(Kw);router=f(Zl);dialog=f(iE);snackBar=f(LY);destroyRef=f(Pe);editToggle=V8(ue);mode=f(Zn).snapshot.data.mode===`view`?`view`:`create`;heading=this.mode===`create`?`Add vehicle make`:`Vehicle make details`;limits=P;editing=Te(this.mode===`create`);loading=Te(!1);saving=Te(!1);additionalOpen=Te(!1);form=new Ye({makeCode:new Wi(``,{nonNullable:!0,validators:[Ae$1.required,be,Ae$1.maxLength(P.makeCode),Ae$1.pattern(/^[A-Za-z0-9-]+$/)]}),makeName:new Wi(``,{nonNullable:!0,validators:[Ae$1.required,be,Ae$1.maxLength(P.makeName)]}),shortName:new Wi(``,{nonNullable:!0,validators:[Ae$1.required,be,Ae$1.maxLength(P.shortName)]}),remarks:new Wi(``,{nonNullable:!0,validators:[Ae$1.maxLength(P.remarks)]}),arabicMakeName:new Wi(``,{nonNullable:!0,validators:[Ae$1.maxLength(P.arabicMakeName)]}),arabicShortName:new Wi(``,{nonNullable:!0,validators:[Ae$1.maxLength(P.arabicShortName)]}),arabicRemarks:new Wi(``,{nonNullable:!0,validators:[Ae$1.maxLength(P.arabicRemarks)]})});savedValues=null;constructor(){if(this.mode===`view`){let a=pn();if(a===null){this.router.navigate([`/vehicle-makes`]);return}this.applyEditState(),this.loadMake(a)}}hasUnsavedChanges(){return this.form.dirty}back(){this.router.navigate([`/vehicle-makes`])}onEditToggle(a){if(a.checked){this.editing.set(!0),this.applyEditState();return}if(!this.form.dirty){this.stopEditing();return}UZ(this.dialog,{title:`Discard your changes?`,message:`You have changes that have not been saved. Turning editing off will discard them.`,confirmLabel:`Discard changes`,cancelLabel:`Keep editing`,destructive:!0}).pipe(Mr(this.destroyRef)).subscribe(e=>{if(e){this.stopEditing();return}let n=this.editToggle();n&&(n.checked=!0)})}save(){if(this.form.markAllAsTouched(),this.form.invalid){this.openAdditionalInformationIfItHasAnError();return}let a=this.form.getRawValue(),e={makeName:a.makeName,shortName:a.shortName,remarks:a.remarks,arabicMakeName:a.arabicMakeName,arabicShortName:a.arabicShortName,arabicRemarks:a.arabicRemarks};if(this.saving.set(!0),this.mode===`create`){this.client.create(g({makeCode:a.makeCode},e)).pipe(Mr(this.destroyRef)).subscribe({next:()=>{this.saving.set(!1),this.form.markAsPristine(),this.snackBar.open(`Vehicle make saved.`,`Close`,{duration:jt}),this.back()},error:n=>this.onSaveFailed(n)});return}this.client.update(a.makeCode,e).pipe(Mr(this.destroyRef)).subscribe({next:n=>{this.saving.set(!1),this.editing.set(!1),this.showMake(n),this.snackBar.open(`Vehicle make updated.`,`Close`,{duration:jt})},error:n=>this.onSaveFailed(n)})}loadMake(a){this.loading.set(!0),this.client.get(a).pipe(Mr(this.destroyRef)).subscribe({next:e=>{this.loading.set(!1),this.showMake(e)},error:()=>this.back()})}showMake(a){let e={makeCode:a.makeCode,makeName:a.makeName,shortName:a.shortName,remarks:a.remarks??``,arabicMakeName:a.arabicMakeName??``,arabicShortName:a.arabicShortName??``,arabicRemarks:a.arabicRemarks??``};this.form.reset(e),this.savedValues=e,this.additionalOpen.set(e.remarks!==``||e.arabicMakeName!==``||e.arabicShortName!==``||e.arabicRemarks!==``),this.applyEditState()}stopEditing(){this.savedValues&&this.form.reset(this.savedValues),this.editing.set(!1),this.applyEditState()}applyEditState(){this.mode===`create`||this.editing()?(this.form.enable(),this.mode===`view`&&this.form.controls.makeCode.disable()):this.form.disable()}onSaveFailed(a){if(this.saving.set(!1),!n(a))throw a;this.showFieldErrors(a.problem)}showFieldErrors(a){let e=this.form.controls;for(let[n,c]of Object.entries(a.fieldErrors)){let l=e[n];l&&c.length>0&&(l.setErrors({server:c[0]}),l.markAsTouched())}this.openAdditionalInformationIfItHasAnError()}openAdditionalInformationIfItHasAnError(){let a=this.form.controls;mn.some(e=>a[e].invalid)&&this.additionalOpen.set(!0)}static ɵfac=function(e){return new(e||t)};static ɵcmp=ae({type:t,selectors:[[`app-vehicle-make-form`]],viewQuery:function(e,n){e&1&&Xy(n.editToggle,ue,5),e&2&&k0()},decls:29,vars:29,consts:[[1,`page`],[1,`page-header`],[1,`subtitle`],[3,`checked`,`disabled`],[`mode`,`indeterminate`,`aria-label`,`Loading the vehicle make`],[`novalidate`,``,1,`card`,3,`ngSubmit`,`formGroup`],[1,`grid`],[`label`,`Make Code`,`patternMessage`,`Make Code can contain only letters, digits and hyphens.`,1,`code`,3,`control`,`maxLength`,`uppercase`],[`label`,`Make Name`,1,`name`,3,`control`,`maxLength`],[`label`,`Short Name`,1,`short`,3,`control`,`maxLength`],[1,`additional`,3,`opened`,`closed`,`expanded`],[`label`,`Remarks`,1,`full`,3,`control`,`maxLength`,`multiline`,`showCounter`],[`label`,`Arabic Make Name`,1,`half`,3,`control`,`maxLength`,`rtl`],[`label`,`Arabic Short Name`,1,`half`,3,`control`,`maxLength`,`rtl`],[`label`,`Arabic Remarks`,1,`full`,3,`control`,`maxLength`,`multiline`,`rtl`,`showCounter`],[1,`actions`],[`matButton`,``,`type`,`button`,3,`click`],[`matButton`,`filled`,`type`,`submit`,3,`disabled`],[3,`change`,`checked`,`disabled`]],template:function(e,n){e&1&&(Ve(0,`section`,0)(1,`header`,1)(2,`div`)(3,`h1`),mn$1(4),Ue(),Pr(5,rn,2,0,`p`,2)(6,sn,2,0,`p`,2),Ue(),Pr(7,dn,2,2,`mat-slide-toggle`,3),Ue(),Pr(8,ln,1,0,`mat-progress-bar`,4),Ve(9,`form`,5),Fr(`ngSubmit`,function(){return n.save()}),Ve(10,`div`,6),Ho(11,`app-limited-text-field`,7)(12,`app-limited-text-field`,8)(13,`app-limited-text-field`,9),Ue(),Ve(14,`mat-expansion-panel`,10),Fr(`opened`,function(){return n.additionalOpen.set(!0)})(`closed`,function(){return n.additionalOpen.set(!1)}),Ve(15,`mat-expansion-panel-header`)(16,`mat-panel-title`),mn$1(17,`Additional Information`),Ue(),Ve(18,`mat-panel-description`),mn$1(19,`Remarks and Arabic names (all optional)`),Ue()(),Ve(20,`div`,6),Ho(21,`app-limited-text-field`,11)(22,`app-limited-text-field`,12)(23,`app-limited-text-field`,13)(24,`app-limited-text-field`,14),Ue()(),Ve(25,`div`,15)(26,`button`,16),Fr(`click`,function(){return n.back()}),mn$1(27,`Back to list`),Ue(),Pr(28,cn,2,2,`button`,17),Ue()()()),e&2&&(Ce(4),gs(n.heading),Ce(),Lr(n.mode===`view`?5:6),Ce(2),Lr(n.mode===`view`?7:-1),Ce(),Lr(n.loading()?8:-1),Ce(),ps(`formGroup`,n.form),Ce(2),ps(`control`,n.form.controls.makeCode)(`maxLength`,n.limits.makeCode)(`uppercase`,!0),Ce(),ps(`control`,n.form.controls.makeName)(`maxLength`,n.limits.makeName),Ce(),ps(`control`,n.form.controls.shortName)(`maxLength`,n.limits.shortName),Ce(),ps(`expanded`,n.additionalOpen()),Ce(7),ps(`control`,n.form.controls.remarks)(`maxLength`,n.limits.remarks)(`multiline`,!0)(`showCounter`,!0),Ce(),ps(`control`,n.form.controls.arabicMakeName)(`maxLength`,n.limits.arabicMakeName)(`rtl`,!0),Ce(),ps(`control`,n.form.controls.arabicShortName)(`maxLength`,n.limits.arabicShortName)(`rtl`,!0),Ce(),ps(`control`,n.form.controls.arabicRemarks)(`maxLength`,n.limits.arabicRemarks)(`multiline`,!0)(`rtl`,!0)(`showCounter`,!0),Ce(4),Lr(n.editing()?28:-1))},dependencies:[Qr,Zr,Kr,Nt$1,cu,Ht,ke,Lt,Vt,Rt,ms,ue,fe],styles:[`.page[_ngcontent-%COMP%]{max-width:900px;margin:0 auto;padding:24px 24px 48px}.page-header[_ngcontent-%COMP%]{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}h1[_ngcontent-%COMP%]{margin:0 0 4px;font-size:1.5rem;font-weight:600;color:var(--%NS%sdd-text)}.subtitle[_ngcontent-%COMP%]{margin:0;color:var(--%NS%sdd-muted)}.card[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--%NS%sdd-surface);border:1px solid var(--%NS%sdd-border);border-radius:8px}.grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}.code[_ngcontent-%COMP%]{grid-column:span 3}.name[_ngcontent-%COMP%]{grid-column:span 6}.short[_ngcontent-%COMP%]{grid-column:span 3}.half[_ngcontent-%COMP%]{grid-column:span 6}.full[_ngcontent-%COMP%]{grid-column:span 12}.additional[_ngcontent-%COMP%]{box-shadow:none;border:1px solid var(--%NS%sdd-border)}.actions[_ngcontent-%COMP%]{display:flex;justify-content:space-between;gap:12px}@media(max-width:700px){.code[_ngcontent-%COMP%], .name[_ngcontent-%COMP%], .short[_ngcontent-%COMP%], .half[_ngcontent-%COMP%]{grid-column:span 12}.page-header[_ngcontent-%COMP%]{flex-direction:column}}`]})};function pn(){let t=history.state;if(typeof t==`object`&&t!==null&&`makeCode`in t){let a=t.makeCode;return typeof a==`string`&&a.length>0?a:null}return null}export{Bt as VehicleMakeFormComponent};