import{$ as Oe,$t as dc,An as ob,B as Kn$1,Dn as ms,Dt as Wn$1,E as He,En as mn,Et as We,Gt as bx,Ht as bs,I as Jw,In as qt,It as a_,J as Mp,Jt as ce,K as Lr,L as Jy,Ln as ra$1,M as J,Mn as ol,Nn as pn,Ot as Wo,Pn as q,Pt as Zl,Q as Nt,Qt as cu,R as Ke,Rt as b,S as GZ,Sn as kp,St as Ve,T as HY,Tn as le,Ut as bt,V as Ks,Vn as se,Vt as bn,W as L0,X as N6,Y as Mw,Zn as vt,an as f,b as Fr,bn as k,c as BY,cn as g,cr as z,ct as Qw,dn as hs,dr as zn$1,dt as Re,et as Ou,f as Cp,fn as ht,fr as zo,g as E_,gt as T,h as E,hn as ie,ht as Sp,it as Q,j as Ip,jt as Xy,k as I0,kn as mx,l as Br,ln as gn,m as De,mt as Sn$1,n as $8,nr as xe$1,nt as Pe,on as fc,or as ys,ot as Qn$1,pt as S0,qt as cE,r as $e,rn as er,rr as xp,rt as Pi,s as Ap,sn as ft,sr as yt,t as $,tn as eE,tr as wt,un as hn,ur as ze,ut as R,v as En$1,vn as je,vt as Tp,w as H,wt as Vr,xn as ke,xt as Ur,y as F0,yn as jr,z as Ki,zn as rt}from"./main-Z2EJ2UB4.js";import{A as hu,B as vs,C as aa$1,D as er$1,E as en,F as pu,G as xu,H as wm,I as qr,K as yu,L as ra$2,N as na$1,O as fu,P as nn,R as st,S as _u,T as bu,U as ws,V as vu,W as xs,_ as Vn$1,a as Fo,b as Za$1,c as Mn$1,d as Qa$1,f as Qo,g as Va$1,h as Ur$1,i as Fm,j as kd,k as gu,l as Oo,m as Tn,n as Ct,o as Ja$1,p as Ss,r as Cu,s as Md,t as $e$1,u as Po,v as Xe,w as bt$1,x as _a$1,y as Yt,z as uu}from"./chunk-DyxVlU7Q.js";var Cn=new b(`CdkAccordion`);var kn=(()=>{class e{accordion=f(Cn,{optional:!0,skipSelf:!0});_changeDetectorRef=f(Wn$1);_expansionDispatcher=f(_a$1);_openCloseAllSubscription=z.EMPTY;closed=new q;opened=new q;destroyed=new q;expandedChange=new q;id=f(vt).getId(`cdk-accordion-child-`);get expanded(){return this._expanded}set expanded(t){if(this._expanded!==t){if(this._expanded=t,this.expandedChange.emit(t),t){this.opened.emit();let r=this.accordion?this.accordion.id:this.id;this._expansionDispatcher.notify(this.id,r)}else this.closed.emit();this._changeDetectorRef.markForCheck()}}_expanded=!1;get disabled(){return this._disabled()}set disabled(t){this._disabled.set(t)}_disabled=Re(!1);_removeUniqueSelectionListener=()=>{};ngOnInit(){this._removeUniqueSelectionListener=this._expansionDispatcher.listen((t,r)=>{this.accordion&&!this.accordion.multi&&this.accordion.id===r&&this.id!==t&&(this.expanded=!1)}),this.accordion&&(this._openCloseAllSubscription=this._subscribeToOpenCloseAllActions())}ngOnDestroy(){this.opened.complete(),this.closed.complete(),this.destroyed.emit(),this.destroyed.complete(),this._removeUniqueSelectionListener(),this._openCloseAllSubscription.unsubscribe()}toggle(){this.disabled||(this.expanded=!this.expanded)}close(){this.disabled||(this.expanded=!1)}open(){this.disabled||(this.expanded=!0)}_subscribeToOpenCloseAllActions(){return this.accordion._openCloseAllActions.subscribe(t=>{this.disabled||(this.expanded=t)})}static ɵfac=function(r){return new(r||e)};static ɵdir=J({type:e,selectors:[[`cdk-accordion-item`],[``,`cdkAccordionItem`,``]],inputs:{expanded:[2,`expanded`,`expanded`,Pe],disabled:[2,`disabled`,`disabled`,Pe]},outputs:{closed:`closed`,opened:`opened`,destroyed:`destroyed`,expandedChange:`expandedChange`},exportAs:[`cdkAccordionItem`],features:[Mp([{provide:Cn,useValue:void 0}])]})}return e})();var Sn=(()=>{class e{static ɵfac=function(r){return new(r||e)};static ɵmod=le({type:e});static ɵinj=se({})}return e})();var Mn=new b(`MAT_ACCORDION`);var Nn=new b(`MAT_EXPANSION_PANEL`);var Rn=(()=>{class e{_template=f(Ke);_expansionPanel=f(Nn,{optional:!0});static ɵfac=function(r){return new(r||e)};static ɵdir=J({type:e,selectors:[[`ng-template`,`matExpansionPanelContent`,``]]})}return e})();var En=new b(`MAT_EXPANSION_PANEL_DEFAULT_OPTIONS`);var xe=(()=>{class e extends kn{_viewContainerRef=f(rt);_animationsDisabled=yt();_document=f(T);_ngZone=f(k);_elementRef=f(Q);_renderer=f(ft);_cleanupTransitionEnd;get hideToggle(){return this._hideToggle||this.accordion&&this.accordion.hideToggle}set hideToggle(t){this._hideToggle=t}_hideToggle=!1;get togglePosition(){return this._togglePosition||this.accordion&&this.accordion.togglePosition}set togglePosition(t){this._togglePosition=t}_togglePosition;afterExpand=new q;afterCollapse=new q;_inputChanges=new E;accordion=f(Mn,{optional:!0,skipSelf:!0});_lazyContent;_body;_bodyWrapper;_portal;_headerId=f(vt).getId(`mat-expansion-panel-header-`);constructor(){super();let t=f(En,{optional:!0});this._expansionDispatcher=f(_a$1),t&&(this.hideToggle=t.hideToggle)}_hasSpacing(){return this.accordion?this.expanded&&this.accordion.displayMode==="default":!1}_getExpandedState(){return this.expanded?`expanded`:`collapsed`}toggle(){this.expanded=!this.expanded}close(){this.expanded=!1}open(){this.expanded=!0}ngAfterContentInit(){this._lazyContent&&this._lazyContent._expansionPanel===this&&this.opened.pipe(wt(null),ie(()=>this.expanded&&!this._portal),je(1)).subscribe(()=>{this._portal=new Sn$1(this._lazyContent._template,this._viewContainerRef)}),this._setupAnimationEvents()}ngOnChanges(t){this._inputChanges.next(t)}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTransitionEnd?.(),this._inputChanges.complete()}_containsFocus(){if(this._body){let t=this._document.activeElement,r=this._body.nativeElement;return t===r||r.contains(t)}return!1}_transitionEndListener=({target:t,propertyName:r})=>{t===this._bodyWrapper?.nativeElement&&r===`grid-template-rows`&&this._ngZone.run(()=>{this.expanded?this.afterExpand.emit():this.afterCollapse.emit()})};_setupAnimationEvents(){this._ngZone.runOutsideAngular(()=>{this._animationsDisabled?(this.opened.subscribe(()=>this._ngZone.run(()=>this.afterExpand.emit())),this.closed.subscribe(()=>this._ngZone.run(()=>this.afterCollapse.emit()))):setTimeout(()=>{let t=this._elementRef.nativeElement;this._cleanupTransitionEnd=this._renderer.listen(t,`transitionend`,this._transitionEndListener),t.classList.add(`mat-expansion-panel-animations-enabled`)},200)})}static ɵfac=function(r){return new(r||e)};static ɵcmp=(function(){let t=[`body`],r=[`bodyWrapper`],m=[[[`mat-expansion-panel-header`]],`*`,[[`mat-action-row`]]],u=[`mat-expansion-panel-header`,`*`,`mat-action-row`];function y(c,C){}return ce({type:e,selectors:[[`mat-expansion-panel`]],contentQueries:function(C,k,q){if(C&1&&Xy(q,Rn,5),C&2){let ge;Vr(ge=Ur())&&(k._lazyContent=ge.first)}},viewQuery:function(C,k){if(C&1&&Br(t,5)(r,5),C&2){let q;Vr(q=Ur())&&(k._body=q.first),Vr(q=Ur())&&(k._bodyWrapper=q.first)}},hostAttrs:[1,`mat-expansion-panel`],hostVars:4,hostBindings:function(C,k){C&2&&He(`mat-expanded`,k.expanded)(`mat-expansion-panel-spacing`,k._hasSpacing())},inputs:{hideToggle:[2,`hideToggle`,`hideToggle`,Pe],togglePosition:`togglePosition`},outputs:{afterExpand:`afterExpand`,afterCollapse:`afterCollapse`},exportAs:[`matExpansionPanel`],features:[Mp([{provide:Mn,useValue:void 0},{provide:Nn,useExisting:e}]),ke,Nt],ngContentSelectors:u,decls:9,vars:4,consts:[[`bodyWrapper`,``],[`body`,``],[1,`mat-expansion-panel-content-wrapper`],[`role`,`region`,1,`mat-expansion-panel-content`,3,`id`],[1,`mat-expansion-panel-body`],[3,`cdkPortalOutlet`]],template:function(C,k){C&1&&(Wo(m),qt(0),ze(1,`div`,2,0)(3,`div`,3,1)(5,`div`,4),qt(6,1),zn$1(7,y,0,0,`ng-template`,5),We(),qt(8,2),We()()),C&2&&(xe$1(),ht(`inert`,k.expanded?null:``),xe$1(2),hs(`id`,k.id),ht(`aria-labelledby`,k._headerId),xe$1(4),hs(`cdkPortalOutlet`,k._portal))},dependencies:[er],styles:[`.mat-expansion-panel {
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
`],encapsulation:2})})()}return e})();var tt=(()=>{class e{panel=f(xe,{host:!0});_element=f(Q);_focusMonitor=f(Ks);_changeDetectorRef=f(Wn$1);_parentChangeSubscription=z.EMPTY;constructor(){f(bt).load(Mw);let t=this.panel,r=f(En,{optional:!0}),m=f(new kp(`tabindex`),{optional:!0}),u=t.accordion?t.accordion._stateChanges.pipe(ie(y=>!!(y.hideToggle||y.togglePosition))):De;this.tabIndex=parseInt(m||``)||0,this._parentChangeSubscription=Ou(t.opened,t.closed,u,t._inputChanges.pipe(ie(y=>!!(y.hideToggle||y.disabled||y.togglePosition)))).subscribe(()=>this._changeDetectorRef.markForCheck()),t.closed.pipe(ie(()=>t._containsFocus())).subscribe(()=>this._focusMonitor.focusVia(this._element,`program`)),r&&(this.expandedHeight=r.expandedHeight,this.collapsedHeight=r.collapsedHeight)}expandedHeight;collapsedHeight;tabIndex=0;get disabled(){return this.panel.disabled}_toggle(){this.disabled||this.panel.toggle()}_isExpanded(){return this.panel.expanded}_getExpandedState(){return this.panel._getExpandedState()}_getPanelId(){return this.panel.id}_getTogglePosition(){return this.panel.togglePosition}_showToggle(){return!this.panel.hideToggle&&!this.panel.disabled}_getHeaderHeight(){let t=this._isExpanded();return t&&this.expandedHeight?this.expandedHeight:!t&&this.collapsedHeight?this.collapsedHeight:null}_keydown(t){switch(t.keyCode){case 32:case 13:Qn$1(t)||(t.preventDefault(),this._toggle());break;default:this.panel.accordion&&this.panel.accordion._handleHeaderKeydown(t);return}}focus(t,r){t?this._focusMonitor.focusVia(this._element,t,r):this._element.nativeElement.focus(r)}ngAfterViewInit(){this._focusMonitor.monitor(this._element).subscribe(t=>{t&&this.panel.accordion&&this.panel.accordion._handleHeaderFocus(this)})}ngOnDestroy(){this._parentChangeSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._element)}static ɵfac=function(r){return new(r||e)};static ɵcmp=(function(){let t=[[[`mat-panel-title`]],[[`mat-panel-description`]],`*`],r=[`mat-panel-title`,`mat-panel-description`,`*`];function m(u,y){u&1&&(pn(0,`span`,1),ob(),pn(1,`svg`,2),mn(2,`path`,3),hn()())}return ce({type:e,selectors:[[`mat-expansion-panel-header`]],hostAttrs:[`role`,`button`,1,`mat-expansion-panel-header`,`mat-focus-indicator`],hostVars:13,hostBindings:function(y,c){y&1&&jr(`click`,function(){return c._toggle()})(`keydown`,function(k){return c._keydown(k)}),y&2&&(ht(`id`,c.panel._headerId)(`tabindex`,c.disabled?-1:c.tabIndex)(`aria-controls`,c._getPanelId())(`aria-expanded`,c._isExpanded())(`aria-disabled`,c.panel.disabled),xp(`height`,c._getHeaderHeight()),He(`mat-expanded`,c._isExpanded())(`mat-expansion-toggle-indicator-after`,c._getTogglePosition()===`after`)(`mat-expansion-toggle-indicator-before`,c._getTogglePosition()===`before`))},inputs:{expandedHeight:`expandedHeight`,collapsedHeight:`collapsedHeight`,tabIndex:[2,`tabIndex`,`tabIndex`,u=>u==null?0:E_(u)]},ngContentSelectors:r,decls:5,vars:3,consts:[[1,`mat-content`],[1,`mat-expansion-indicator`],[`xmlns`,`http://www.w3.org/2000/svg`,`viewBox`,`0 -960 960 960`,`aria-hidden`,`true`,`focusable`,`false`],[`d`,`M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z`]],template:function(y,c){y&1&&(Wo(t),pn(0,`span`,0),qt(1),qt(2,1),qt(3,2),hn(),Lr(4,m,3,0,`span`,1)),y&2&&(He(`mat-content-hide-toggle`,!c._showToggle()),xe$1(4),Fr(c._showToggle()?4:-1))},styles:[`.mat-expansion-panel-header {
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
`],encapsulation:2})})()}return e})();var nt=(()=>{class e{static ɵfac=function(r){return new(r||e)};static ɵdir=J({type:e,selectors:[[`mat-panel-description`]],hostAttrs:[1,`mat-expansion-panel-header-description`]})}return e})();var at=(()=>{class e{static ɵfac=function(r){return new(r||e)};static ɵdir=J({type:e,selectors:[[`mat-panel-title`]],hostAttrs:[1,`mat-expansion-panel-header-title`]})}return e})();var it=(()=>{class e{static ɵfac=function(r){return new(r||e)};static ɵmod=le({type:e});static ɵinj=se({imports:[Sn,ra$1,En$1]})}return e})();var In=(()=>{class e{labelPosition=`after`;static ɵfac=function(r){return new(r||e)};static ɵcmp=(function(){return ce({type:e,selectors:[[``,`mat-internal-form-field`,``]],hostAttrs:[1,`mdc-form-field`,`mat-internal-form-field`],hostVars:2,hostBindings:function(m,u){m&2&&He(`mdc-form-field--align-end`,u.labelPosition===`before`)},inputs:{labelPosition:`labelPosition`},ngContentSelectors:[`*`],decls:1,vars:0,template:function(m,u){m&1&&(Wo(),qt(0))},styles:[`.mat-internal-form-field {
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
`],encapsulation:2})})()}return e})();var zn=new b(`mat-slide-toggle-default-options`,{providedIn:`root`,factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})});var ot=class{source;checked;constructor(n,t){this.source=n,this.checked=t}};var me=(()=>{class e{_elementRef=f(Q);_focusMonitor=f(Ks);_changeDetectorRef=f(Wn$1);defaults=f(zn);_injector=f(R);_signalFormField=null;_onChange=t=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(t){return new ot(this,t)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=yt();_focused=!1;name=null;id;labelPosition=`after`;ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(t){this._checked=t,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new q;toggleChange=new q;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){f(bt).load(Mw);let t=f(new kp(`tabindex`),{optional:!0}),r=this.defaults;this.tabIndex=t==null?0:parseInt(t)||0,this.color=r.color||`accent`,this.id=this._uniqueId=f(vt).getId(`mat-mdc-slide-toggle-`),this.hideIcon=r.hideIcon??!1,this.disabledInteractive=r.disabledInteractive??!1,this._labelId=this._uniqueId+`-label`}ngOnInit(){this._signalFormField=this._injector.get(en,void 0,{optional:!0,self:!0})}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(t=>{t===`keyboard`||t===`program`?(this._focused=!0,this._changeDetectorRef.markForCheck()):t||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(t){t.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(t){this.checked=!!t}registerOnChange(t){this._onChange=t}registerOnTouched(t){this._onTouched=t}validate(t){return this.required&&t.value!==!0&&!this._signalFormField?{required:!0}:null}registerOnValidatorChange(t){this._validatorOnChange=t}setDisabledState(t){this.disabled=t,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new ot(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static ɵfac=function(r){return new(r||e)};static ɵcmp=(function(){let t=[`switch`],r=[`*`];function m(u,y){u&1&&(ze(0,`span`,11),ob(),ze(1,`svg`,13),zo(2,`path`,14),We(),ze(3,`svg`,15),zo(4,`path`,16),We()())}return ce({type:e,selectors:[[`mat-slide-toggle`]],viewQuery:function(y,c){if(y&1&&Br(t,5),y&2){let C;Vr(C=Ur())&&(c._switchElement=C.first)}},hostAttrs:[1,`mat-mdc-slide-toggle`],hostVars:15,hostBindings:function(y,c){y&2&&(ms(`id`,c.id),ht(`tabindex`,null)(`aria-label`,null)(`name`,null)(`aria-labelledby`,null),Tp(c.color?`mat-`+c.color:``),He(`mat-mdc-slide-toggle-focused`,c._focused)(`mat-mdc-slide-toggle-checked`,c.checked)(`mat-slide-toggle-full-width`,c.fullWidth)(`_mat-animation-noopable`,c._noopAnimations))},inputs:{name:`name`,id:`id`,labelPosition:`labelPosition`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],required:[2,`required`,`required`,Pe],color:`color`,disabled:[2,`disabled`,`disabled`,Pe],fullWidth:[2,`fullWidth`,`fullWidth`,Pe],disableRipple:[2,`disableRipple`,`disableRipple`,Pe],tabIndex:[2,`tabIndex`,`tabIndex`,u=>u==null?0:E_(u)],checked:[2,`checked`,`checked`,Pe],hideIcon:[2,`hideIcon`,`hideIcon`,Pe],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,Pe]},outputs:{change:`change`,toggleChange:`toggleChange`},exportAs:[`matSlideToggle`],features:[Mp([{provide:Mn$1,useExisting:Pi(()=>e),multi:!0},{provide:Xe,useExisting:e,multi:!0}]),Nt],ngContentSelectors:r,decls:14,vars:27,consts:[[`switch`,``],[`mat-internal-form-field`,``,3,`labelPosition`],[`role`,`switch`,`type`,`button`,1,`mdc-switch`,3,`click`,`tabIndex`,`disabled`],[1,`mat-mdc-slide-toggle-touch-target`],[1,`mdc-switch__track`],[1,`mdc-switch__handle-track`],[1,`mdc-switch__handle`],[1,`mdc-switch__shadow`],[1,`mdc-elevation-overlay`],[1,`mdc-switch__ripple`],[`mat-ripple`,``,1,`mat-mdc-slide-toggle-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mdc-switch__icons`],[1,`mdc-label`,3,`click`,`for`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--on`],[`d`,`M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--off`],[`d`,`M20 13H4v-2h16v2z`]],template:function(y,c){if(y&1&&(Wo(),ze(0,`div`,1)(1,`button`,2,0),jr(`click`,function(){return c._handleClick()}),zo(3,`div`,3)(4,`span`,4),ze(5,`span`,5)(6,`span`,6)(7,`span`,7),zo(8,`span`,8),We(),ze(9,`span`,9),zo(10,`span`,10),We(),Lr(11,m,5,0,`span`,11),We()()(),ze(12,`label`,12),jr(`click`,function(k){return k.stopPropagation()}),qt(13),We()()),y&2){let C=F0(2);hs(`labelPosition`,c.labelPosition),xe$1(),He(`mdc-switch--selected`,c.checked)(`mdc-switch--unselected`,!c.checked)(`mdc-switch--checked`,c.checked)(`mdc-switch--disabled`,c.disabled)(`mat-mdc-slide-toggle-disabled-interactive`,c.disabledInteractive),hs(`tabIndex`,c.disabled&&!c.disabledInteractive?-1:c.tabIndex)(`disabled`,c.disabled&&!c.disabledInteractive),ht(`id`,c.buttonId)(`name`,c.name)(`aria-label`,c.ariaLabel)(`aria-labelledby`,c._getAriaLabelledBy())(`aria-describedby`,c.ariaDescribedby)(`aria-required`,c.required||null)(`aria-checked`,c.checked)(`aria-disabled`,c.disabled&&c.disabledInteractive?`true`:null),xe$1(9),hs(`matRippleTrigger`,C)(`matRippleDisabled`,c.disableRipple||c.disabled)(`matRippleCentered`,!0),xe$1(),Fr(c.hideIcon?-1:11),xe$1(),hs(`for`,c.buttonId),ht(`id`,c._labelId)}},dependencies:[N6,In],styles:[`.mdc-switch {
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
`],encapsulation:2})})()}return e})();function qn(e,n){if(e&1&&(ze(0,`textarea`,1),mx(),We()),e&2){let t=ol();hs(`formControl`,t.control())(`maxlength`,t.maxLength()),ht(`dir`,t.direction())(`lang`,t.rtl()?`ar`:null),bx()}}function jn(e,n){if(e&1){let t=Ip();ze(0,`input`,4),mx(),jr(`blur`,function(){dc(t);let m=ol();return fc(m.convertToUppercase())}),We()}if(e&2){let t=ol();He(`uppercase`,t.uppercase()),hs(`formControl`,t.control())(`maxlength`,t.maxLength()),ht(`dir`,t.direction())(`lang`,t.rtl()?`ar`:null),bx()}}function Un(e,n){if(e&1&&(ze(0,`mat-hint`),gn(1),We()),e&2){let t=ol();xe$1(),bn(`Maximum `,t.maxLength(),` characters.`)}}function Gn(e,n){if(e&1&&(ze(0,`mat-hint`,3),gn(1),We()),e&2){let t=ol();xe$1(),a_(``,t.length(),` / `,t.maxLength())}}function $n(e,n){if(e&1&&(ze(0,`mat-error`),gn(1),We()),e&2){let t=ol();xe$1(),bn(``,t.label(),` is required.`)}}function Xn(e,n){if(e&1&&(ze(0,`mat-error`),gn(1),We()),e&2){let t=ol();xe$1(),bs(t.patternMessage())}}function Wn(e,n){if(e&1&&(ze(0,`mat-error`),gn(1),We()),e&2){let t=ol();xe$1(),bn(`Maximum `,t.maxLength(),` characters.`)}}function Qn(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}var pe=class e{label=ys.required();control=ys.required();maxLength=ys.required();patternMessage=ys(`This value is not in the expected format.`);rtl=ys(!1);multiline=ys(!1);uppercase=ys(!1);showCounter=ys(!1);state=Ja$1(Za$1(this.control).pipe($e(n=>Ou(n.valueChanges,n.statusChanges).pipe(wt(null),$(()=>({length:n.value.length,enabled:n.enabled}))))),{initialValue:{length:0,enabled:!0}});length=Ap(()=>this.state().length);direction=Ap(()=>this.rtl()?`rtl`:`ltr`);limitReached=Ap(()=>this.state().enabled&&this.state().length>=this.maxLength());serverMessage(){let n=this.control().getError(`server`);return typeof n==`string`?n:null}convertToUppercase(){let n=this.control();this.uppercase()&&n.value!==n.value.toUpperCase()&&n.setValue(n.value.toUpperCase())}static ɵfac=function(t){return new(t||e)};static ɵcmp=ce({type:e,selectors:[[`app-limited-text-field`]],inputs:{label:[1,`label`],control:[1,`control`],maxLength:[1,`maxLength`],patternMessage:[1,`patternMessage`],rtl:[1,`rtl`],multiline:[1,`multiline`],uppercase:[1,`uppercase`],showCounter:[1,`showCounter`]},decls:11,vars:5,consts:[[`appearance`,`outline`,`subscriptSizing`,`dynamic`,1,`field`],[`matInput`,``,`rows`,`3`,3,`formControl`,`maxlength`],[`matInput`,``,`type`,`text`,`autocomplete`,`off`,3,`formControl`,`maxlength`,`uppercase`],[`align`,`end`],[`matInput`,``,`type`,`text`,`autocomplete`,`off`,3,`blur`,`formControl`,`maxlength`]],template:function(t,r){if(t&1&&(ze(0,`mat-form-field`,0)(1,`mat-label`),gn(2),We(),Lr(3,qn,1,4,`textarea`,1)(4,jn,1,6,`input`,2),Lr(5,Un,2,1,`mat-hint`),Lr(6,Gn,2,2,`mat-hint`,3),Lr(7,$n,2,1,`mat-error`)(8,Xn,2,1,`mat-error`)(9,Wn,2,1,`mat-error`)(10,Qn,2,1,`mat-error`),We()),t&2){let m;xe$1(2),bs(r.label()),xe$1(),Fr(r.multiline()?3:4),xe$1(2),Fr(r.limitReached()?5:-1),xe$1(),Fr(r.showCounter()?6:-1),xe$1(),Fr(r.control().hasError(`required`)?7:r.control().hasError(`pattern`)?8:r.control().hasError(`maxlength`)?9:(m=r.serverMessage())?10:-1,m)}},dependencies:[Ss,er$1,vs,Po,ra$2,Ct,nn,Tn,Vn$1,aa$1,kd,Md],styles:[`[_nghost-%COMP%]{display:block}.field[_ngcontent-%COMP%]{width:100%}.uppercase[_ngcontent-%COMP%]{text-transform:uppercase}`]})};function X(e){return e.value.trim().length===0?{required:!0}:null}var G=(e,n)=>n.code;function Yn(e,n){if(e&1){let t=Ip();ze(0,`button`,5),jr(`click`,function(){dc(t);let m=ol();return fc(m.addModel())}),gn(1,`Add model`),We()}}function Zn(e,n){e&1&&zo(0,`mat-progress-bar`,3)}function Kn(e,n){e&1&&(ze(0,`th`,19),gn(1,`Model Code`),We())}function Jn(e,n){if(e&1&&(ze(0,`td`,20),gn(1),We()),e&2){let t=n.$implicit;xe$1(),bs(t.modelCode)}}function ea(e,n){e&1&&(ze(0,`th`,19),gn(1,`Model Name`),We())}function ta(e,n){if(e&1&&(ze(0,`td`,20),gn(1),We()),e&2){let t=n.$implicit;xe$1(),bs(t.modelName)}}function na(e,n){e&1&&(ze(0,`th`,19),gn(1,`Short Name`),We())}function aa(e,n){if(e&1&&(ze(0,`td`,20),gn(1),We()),e&2){let t=n.$implicit;xe$1(),bs(t.shortName)}}function ia(e,n){e&1&&(ze(0,`th`,19),gn(1,`Status`),We())}function oa(e,n){if(e&1&&(ze(0,`td`,20),gn(1),We()),e&2){let t=n.$implicit;xe$1(),bs(t.active?`Active`:`Inactive`)}}function ra(e,n){e&1&&(ze(0,`th`,23),gn(1,`Actions`),We())}function la(e,n){if(e&1){let t=Ip();ze(0,`td`,24)(1,`button`,25),jr(`click`,function(){let m=dc(t).$implicit,u=ol(3);return fc(u.editModel(m))}),gn(2,`Edit`),We(),ze(3,`button`,26),jr(`click`,function(){let m=dc(t).$implicit,u=ol(3);return fc(u.deleteModel(m))}),gn(4,` Delete `),We()()}}function da(e,n){e&1&&(Cp(0,14),zn$1(1,ra,2,0,`th`,21)(2,la,5,0,`td`,22),Sp())}function sa(e,n){e&1&&zo(0,`tr`,27)}function ca(e,n){e&1&&zo(0,`tr`,28)}function ma(e,n){if(e&1&&(ze(0,`p`,17),gn(1),We()),e&2){let t=ol(2);xe$1(),bs(t.emptyMessage())}}function pa(e,n){if(e&1){let t=Ip();ze(0,`div`,6)(1,`table`,7),Cp(2,8),zn$1(3,Kn,2,0,`th`,9)(4,Jn,2,1,`td`,10),Sp(),Cp(5,11),zn$1(6,ea,2,0,`th`,9)(7,ta,2,1,`td`,10),Sp(),Cp(8,12),zn$1(9,na,2,0,`th`,9)(10,aa,2,1,`td`,10),Sp(),Cp(11,13),zn$1(12,ia,2,0,`th`,9)(13,oa,2,1,`td`,10),Sp(),Lr(14,da,3,0,`ng-container`,14),zn$1(15,sa,1,0,`tr`,15)(16,ca,1,0,`tr`,16),We()(),Lr(17,ma,2,1,`p`,17),ze(18,`mat-paginator`,18),jr(`page`,function(m){dc(t);let u=ol();return fc(u.onPage(m))}),We()}if(e&2){let t=ol();xe$1(),hs(`dataSource`,t.items()),xe$1(13),Fr(t.makeEditable()?14:-1),xe$1(),hs(`matHeaderRowDef`,t.columns()),xe$1(),hs(`matRowDefColumns`,t.columns()),xe$1(),Fr(!t.loading()&&t.items().length===0?17:-1),xe$1(),hs(`length`,t.totalCount())(`pageSize`,t.pageSize)(`pageIndex`,t.pageIndex())(`hidePageSize`,!0)(`showFirstLastButtons`,!0)}}function ha(e,n){if(e&1&&(ze(0,`mat-option`,43),gn(1),We()),e&2){let t=ol(2);hs(`value`,t.form.controls.variant.value),xe$1(),bn(` `,t.form.controls.variant.value,` (inactive) `)}}function ga(e,n){if(e&1&&(ze(0,`mat-option`,44),gn(1),We()),e&2){let t=n.$implicit;hs(`value`,t.code),xe$1(),bs(t.description)}}function ua(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function fa(e,n){if(e&1&&(ze(0,`mat-option`,43),gn(1),We()),e&2){let t=ol(2);hs(`value`,t.form.controls.vehicleType.value),xe$1(),bn(` `,t.form.controls.vehicleType.value,` (inactive) `)}}function ba(e,n){if(e&1&&(ze(0,`mat-option`,44),gn(1),We()),e&2){let t=n.$implicit;hs(`value`,t.code),xe$1(),bs(t.description)}}function va(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function _a(e,n){if(e&1&&(ze(0,`mat-option`,43),gn(1),We()),e&2){let t=ol(2);hs(`value`,t.form.controls.bodyType.value),xe$1(),bn(` `,t.form.controls.bodyType.value,` (inactive) `)}}function ya(e,n){if(e&1&&(ze(0,`mat-option`,44),gn(1),We()),e&2){let t=n.$implicit;hs(`value`,t.code),xe$1(),bs(t.description)}}function xa(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function wa(e,n){if(e&1&&(ze(0,`mat-option`,43),gn(1),We()),e&2){let t=ol(2);hs(`value`,t.form.controls.fuelType.value),xe$1(),bn(` `,t.form.controls.fuelType.value,` (inactive) `)}}function Ca(e,n){if(e&1&&(ze(0,`mat-option`,44),gn(1),We()),e&2){let t=n.$implicit;hs(`value`,t.code),xe$1(),bs(t.description)}}function ka(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function Sa(e,n){if(e&1&&(ze(0,`mat-option`,43),gn(1),We()),e&2){let t=ol(2);hs(`value`,t.form.controls.cylinders.value),xe$1(),bn(` `,t.form.controls.cylinders.value,` (inactive) `)}}function Ma(e,n){if(e&1&&(ze(0,`mat-option`,44),gn(1),We()),e&2){let t=n.$implicit;hs(`value`,t.code),xe$1(),bs(t.description)}}function Na(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function Ea(e,n){if(e&1&&(ze(0,`mat-option`,43),gn(1),We()),e&2){let t=ol(2);hs(`value`,t.form.controls.doors.value),xe$1(),bn(` `,t.form.controls.doors.value,` (inactive) `)}}function Ta(e,n){if(e&1&&(ze(0,`mat-option`,44),gn(1),We()),e&2){let t=n.$implicit;hs(`value`,t.code),xe$1(),bs(t.description)}}function Ia(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function Da(e,n){if(e&1&&(ze(0,`mat-option`,43),gn(1),We()),e&2){let t=ol(2);hs(`value`,t.form.controls.drivingType.value),xe$1(),bn(` `,t.form.controls.drivingType.value,` (inactive) `)}}function La(e,n){if(e&1&&(ze(0,`mat-option`,44),gn(1),We()),e&2){let t=n.$implicit;hs(`value`,t.code),xe$1(),bs(t.description)}}function Aa(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function Pa(e,n){if(e&1&&(ze(0,`mat-option`,43),gn(1),We()),e&2){let t=ol(2);hs(`value`,t.form.controls.bodyColour.value),xe$1(),bn(` `,t.form.controls.bodyColour.value,` (inactive) `)}}function Va(e,n){if(e&1&&(ze(0,`mat-option`,44),gn(1),We()),e&2){let t=n.$implicit;hs(`value`,t.code),xe$1(),bs(t.description)}}function Fa(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function Oa(e,n){if(e&1&&(ze(0,`mat-option`,43),gn(1),We()),e&2){let t=ol(2);hs(`value`,t.form.controls.category.value),xe$1(),bn(` `,t.form.controls.category.value,` (inactive) `)}}function Ra(e,n){if(e&1&&(ze(0,`mat-option`,44),gn(1),We()),e&2){let t=n.$implicit;hs(`value`,t.code),xe$1(),bs(t.description)}}function za(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function Ha(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function Ba(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function qa(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function ja(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function Ua(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function Ga(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function $a(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function Xa(e,n){e&1&&(ze(0,`mat-error`),gn(1),We()),e&2&&(xe$1(),bs(n))}function Wa(e,n){if(e&1){let t=Ip();ze(0,`form`,29),jr(`ngSubmit`,function(){dc(t);let m=ol();return fc(m.saveModel())}),ze(1,`div`,30),zo(2,`app-limited-text-field`,31)(3,`app-limited-text-field`,32)(4,`app-limited-text-field`,33),ze(5,`mat-slide-toggle`,34),mx(),gn(6,` Active `),We()(),ze(7,`mat-expansion-panel`,35)(8,`mat-expansion-panel-header`)(9,`mat-panel-title`),gn(10,`Additional Information`),We(),ze(11,`mat-panel-description`),gn(12,`Remarks and Arabic names (all optional)`),We()(),ze(13,`div`,30),zo(14,`app-limited-text-field`,36)(15,`app-limited-text-field`,37)(16,`app-limited-text-field`,38)(17,`app-limited-text-field`,39),We()(),ze(18,`div`,30)(19,`mat-form-field`,40)(20,`mat-label`),gn(21,`Variant`),We(),ze(22,`mat-select`,41),mx(),ze(23,`mat-option`,42),gn(24,`None`),We(),Lr(25,ha,2,2,`mat-option`,43),S0(26,ga,2,2,`mat-option`,44,G),We(),Lr(28,ua,2,1,`mat-error`),We(),ze(29,`mat-form-field`,40)(30,`mat-label`),gn(31,`Type`),We(),ze(32,`mat-select`,41),mx(),ze(33,`mat-option`,42),gn(34,`None`),We(),Lr(35,fa,2,2,`mat-option`,43),S0(36,ba,2,2,`mat-option`,44,G),We(),Lr(38,va,2,1,`mat-error`),We(),ze(39,`mat-form-field`,40)(40,`mat-label`),gn(41,`Body Type`),We(),ze(42,`mat-select`,41),mx(),ze(43,`mat-option`,42),gn(44,`None`),We(),Lr(45,_a,2,2,`mat-option`,43),S0(46,ya,2,2,`mat-option`,44,G),We(),Lr(48,xa,2,1,`mat-error`),We(),ze(49,`mat-form-field`,40)(50,`mat-label`),gn(51,`Fuel Type`),We(),ze(52,`mat-select`,41),mx(),ze(53,`mat-option`,42),gn(54,`None`),We(),Lr(55,wa,2,2,`mat-option`,43),S0(56,Ca,2,2,`mat-option`,44,G),We(),Lr(58,ka,2,1,`mat-error`),We(),ze(59,`mat-form-field`,40)(60,`mat-label`),gn(61,`Cylinders`),We(),ze(62,`mat-select`,41),mx(),ze(63,`mat-option`,42),gn(64,`None`),We(),Lr(65,Sa,2,2,`mat-option`,43),S0(66,Ma,2,2,`mat-option`,44,G),We(),Lr(68,Na,2,1,`mat-error`),We(),ze(69,`mat-form-field`,40)(70,`mat-label`),gn(71,`Doors`),We(),ze(72,`mat-select`,41),mx(),ze(73,`mat-option`,42),gn(74,`None`),We(),Lr(75,Ea,2,2,`mat-option`,43),S0(76,Ta,2,2,`mat-option`,44,G),We(),Lr(78,Ia,2,1,`mat-error`),We(),ze(79,`mat-form-field`,40)(80,`mat-label`),gn(81,`Driving Type`),We(),ze(82,`mat-select`,41),mx(),ze(83,`mat-option`,42),gn(84,`None`),We(),Lr(85,Da,2,2,`mat-option`,43),S0(86,La,2,2,`mat-option`,44,G),We(),Lr(88,Aa,2,1,`mat-error`),We(),ze(89,`mat-form-field`,40)(90,`mat-label`),gn(91,`Body Colour`),We(),ze(92,`mat-select`,41),mx(),ze(93,`mat-option`,42),gn(94,`None`),We(),Lr(95,Pa,2,2,`mat-option`,43),S0(96,Va,2,2,`mat-option`,44,G),We(),Lr(98,Fa,2,1,`mat-error`),We(),ze(99,`mat-form-field`,40)(100,`mat-label`),gn(101,`Category`),We(),ze(102,`mat-select`,41),mx(),ze(103,`mat-option`,42),gn(104,`None`),We(),Lr(105,Oa,2,2,`mat-option`,43),S0(106,Ra,2,2,`mat-option`,44,G),We(),Lr(108,za,2,1,`mat-error`),We()(),ze(109,`div`,30)(110,`mat-form-field`,40)(111,`mat-label`),gn(112,`Weight`),We(),ze(113,`input`,45),mx(),We(),Lr(114,Ha,2,1,`mat-error`),We(),ze(115,`mat-form-field`,40)(116,`mat-label`),gn(117,`Load Capacity`),We(),ze(118,`input`,45),mx(),We(),Lr(119,Ba,2,1,`mat-error`),We(),ze(120,`mat-form-field`,40)(121,`mat-label`),gn(122,`Engine Capacity (CC)`),We(),ze(123,`input`,46),mx(),We(),Lr(124,qa,2,1,`mat-error`),We(),ze(125,`mat-form-field`,40)(126,`mat-label`),gn(127,`Seats`),We(),ze(128,`input`,47),mx(),We(),Lr(129,ja,2,1,`mat-error`),We(),ze(130,`mat-form-field`,40)(131,`mat-label`),gn(132,`Passengers`),We(),ze(133,`input`,47),mx(),We(),Lr(134,Ua,2,1,`mat-error`),We(),ze(135,`mat-form-field`,40)(136,`mat-label`),gn(137,`Drivers`),We(),ze(138,`input`,47),mx(),We(),Lr(139,Ga,2,1,`mat-error`),We(),ze(140,`mat-form-field`,40)(141,`mat-label`),gn(142,`Make Year`),We(),ze(143,`input`,48),mx(),We(),Lr(144,$a,2,1,`mat-error`),We(),ze(145,`mat-form-field`,40)(146,`mat-label`),gn(147,`Value (AED)`),We(),ze(148,`input`,49),mx(),We(),Lr(149,Xa,2,1,`mat-error`),We()(),ze(150,`div`,50)(151,`button`,51),jr(`click`,function(){dc(t);let m=ol();return fc(m.cancelModel())}),gn(152,` Cancel `),We(),ze(153,`button`,52),gn(154),We()()()}if(e&2){let t,r,m,u,y,c,C,k,q,ge,mt,pt,ht,gt,ut,ft,bt,d=ol();hs(`formGroup`,d.form),xe$1(2),hs(`control`,d.form.controls.modelCode)(`maxLength`,d.limits.modelCode)(`uppercase`,!0),xe$1(),hs(`control`,d.form.controls.modelName)(`maxLength`,d.limits.modelName),xe$1(),hs(`control`,d.form.controls.shortName)(`maxLength`,d.limits.shortName),xe$1(),hs(`formControl`,d.form.controls.active),bx(),xe$1(9),hs(`control`,d.form.controls.remarks)(`maxLength`,d.limits.remarks)(`multiline`,!0)(`showCounter`,!0),xe$1(),hs(`control`,d.form.controls.arabicModelName)(`maxLength`,d.limits.arabicModelName)(`rtl`,!0),xe$1(),hs(`control`,d.form.controls.arabicShortName)(`maxLength`,d.limits.arabicShortName)(`rtl`,!0),xe$1(),hs(`control`,d.form.controls.arabicRemarks)(`maxLength`,d.limits.arabicRemarks)(`multiline`,!0)(`rtl`,!0)(`showCounter`,!0),xe$1(5),hs(`formControl`,d.form.controls.variant),bx(),xe$1(3),Fr(d.hasInactiveSelection(`variant`)?25:-1),xe$1(),I0(d.optionsFor(`variant`)),xe$1(2),Fr((t=d.fieldError(d.form.controls.variant))?28:-1,t),xe$1(4),hs(`formControl`,d.form.controls.vehicleType),bx(),xe$1(3),Fr(d.hasInactiveSelection(`vehicleType`)?35:-1),xe$1(),I0(d.optionsFor(`vehicleType`)),xe$1(2),Fr((r=d.fieldError(d.form.controls.vehicleType))?38:-1,r),xe$1(4),hs(`formControl`,d.form.controls.bodyType),bx(),xe$1(3),Fr(d.hasInactiveSelection(`bodyType`)?45:-1),xe$1(),I0(d.optionsFor(`bodyType`)),xe$1(2),Fr((m=d.fieldError(d.form.controls.bodyType))?48:-1,m),xe$1(4),hs(`formControl`,d.form.controls.fuelType),bx(),xe$1(3),Fr(d.hasInactiveSelection(`fuelType`)?55:-1),xe$1(),I0(d.optionsFor(`fuelType`)),xe$1(2),Fr((u=d.fieldError(d.form.controls.fuelType))?58:-1,u),xe$1(4),hs(`formControl`,d.form.controls.cylinders),bx(),xe$1(3),Fr(d.hasInactiveSelection(`cylinders`)?65:-1),xe$1(),I0(d.optionsFor(`cylinders`)),xe$1(2),Fr((y=d.fieldError(d.form.controls.cylinders))?68:-1,y),xe$1(4),hs(`formControl`,d.form.controls.doors),bx(),xe$1(3),Fr(d.hasInactiveSelection(`doors`)?75:-1),xe$1(),I0(d.optionsFor(`doors`)),xe$1(2),Fr((c=d.fieldError(d.form.controls.doors))?78:-1,c),xe$1(4),hs(`formControl`,d.form.controls.drivingType),bx(),xe$1(3),Fr(d.hasInactiveSelection(`drivingType`)?85:-1),xe$1(),I0(d.optionsFor(`drivingType`)),xe$1(2),Fr((C=d.fieldError(d.form.controls.drivingType))?88:-1,C),xe$1(4),hs(`formControl`,d.form.controls.bodyColour),bx(),xe$1(3),Fr(d.hasInactiveSelection(`bodyColour`)?95:-1),xe$1(),I0(d.optionsFor(`bodyColour`)),xe$1(2),Fr((k=d.fieldError(d.form.controls.bodyColour))?98:-1,k),xe$1(4),hs(`formControl`,d.form.controls.category),bx(),xe$1(3),Fr(d.hasInactiveSelection(`category`)?105:-1),xe$1(),I0(d.optionsFor(`category`)),xe$1(2),Fr((q=d.fieldError(d.form.controls.category))?108:-1,q),xe$1(5),hs(`formControl`,d.form.controls.weight)(`maxlength`,d.limits.weight),bx(),xe$1(),Fr((ge=d.fieldError(d.form.controls.weight))?114:-1,ge),xe$1(4),hs(`formControl`,d.form.controls.loadCapacity)(`maxlength`,d.limits.loadCapacity),bx(),xe$1(),Fr((mt=d.fieldError(d.form.controls.loadCapacity))?119:-1,mt),xe$1(4),hs(`formControl`,d.form.controls.engineCapacity),bx(),xe$1(),Fr((pt=d.fieldError(d.form.controls.engineCapacity))?124:-1,pt),xe$1(4),hs(`formControl`,d.form.controls.seats),bx(),xe$1(),Fr((ht=d.fieldError(d.form.controls.seats))?129:-1,ht),xe$1(4),hs(`formControl`,d.form.controls.passengers),bx(),xe$1(),Fr((gt=d.fieldError(d.form.controls.passengers))?134:-1,gt),xe$1(4),hs(`formControl`,d.form.controls.drivers),bx(),xe$1(),Fr((ut=d.fieldError(d.form.controls.drivers))?139:-1,ut),xe$1(4),hs(`formControl`,d.form.controls.makeYear),bx(),xe$1(),Fr((ft=d.fieldError(d.form.controls.makeYear))?144:-1,ft),xe$1(4),hs(`formControl`,d.form.controls.value),bx(),xe$1(),Fr((bt=d.fieldError(d.form.controls.value))?149:-1,bt),xe$1(2),hs(`disabled`,d.saving()),xe$1(2),hs(`disabled`,d.saving()||d.loading()),xe$1(),bn(` `,d.creating()?`Save model`:`Save changes`,` `)}}var K=5e3;var B={modelCode:12,modelName:100,shortName:30,remarks:2e3,arabicModelName:100,arabicShortName:30,arabicRemarks:2e3,weight:100,loadCapacity:100};var we=e=>{let n=e.value;return n===null||typeof n==`number`&&Number.isInteger(n)&&n>=0?null:{nonNegativeWholeNumber:!0}};var he=class e{modelsClient=f(eE);optionsClient=f(Jw);dialog=f(cE);snackBar=f(BY);destroyRef=f(Ve);makeCode=ys.required();makeEditable=ys(!1);limits=B;editorOpen=Re(!1);creating=Re(!1);loading=Re(!1);saving=Re(!1);items=Re([]);totalCount=Re(0);pageIndex=Re(0);pageSize=10;columns=Ap(()=>this.makeEditable()?[`modelCode`,`modelName`,`shortName`,`status`,`actions`]:[`modelCode`,`modelName`,`shortName`,`status`]);options=Re({variants:[],vehicleTypes:[],bodyTypes:[],fuelTypes:[],cylinders:[],doors:[],drivingTypes:[],bodyColours:[],categories:[]});form=new Yt({modelCode:new Qo(``,{nonNullable:!0,validators:[$e$1.required,X,$e$1.maxLength(B.modelCode),$e$1.pattern(/^[A-Za-z0-9-]+$/)]}),modelName:new Qo(``,{nonNullable:!0,validators:[$e$1.required,X,$e$1.maxLength(B.modelName)]}),shortName:new Qo(``,{nonNullable:!0,validators:[$e$1.required,X,$e$1.maxLength(B.shortName)]}),remarks:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(B.remarks)]}),arabicModelName:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(B.arabicModelName)]}),arabicShortName:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(B.arabicShortName)]}),arabicRemarks:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(B.arabicRemarks)]}),variant:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(12)]}),vehicleType:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(12)]}),weight:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(B.weight)]}),loadCapacity:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(B.loadCapacity)]}),bodyType:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(12)]}),fuelType:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(12)]}),engineCapacity:new Qo(null,{validators:[we]}),cylinders:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(12)]}),seats:new Qo(null,{validators:[we,$e$1.max(999)]}),passengers:new Qo(null,{validators:[we,$e$1.max(999)]}),drivers:new Qo(null,{validators:[we,$e$1.max(999)]}),doors:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(12)]}),makeYear:new Qo(null,{validators:[we,$e$1.max(9999)]}),drivingType:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(12)]}),bodyColour:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(12)]}),value:new Qo(null,{validators:[$e$1.min(0)]}),category:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(12)]}),active:new Qo(!0,{nonNullable:!0})});currentModel=null;emptyMessage=Ap(()=>`This make has no models yet. Select "Add model" to create the first one.`);constructor(){this.loadOptions(),Ki(()=>{this.makeCode()&&(this.pageIndex.set(0),Oe(()=>this.loadModels()))}),Ki(()=>{!this.makeEditable()&&this.editorOpen()&&this.resetEditor()})}hasUnsavedChanges(){return this.editorOpen()&&this.form.dirty}loadModels(){this.loading.set(!0),this.modelsClient.list(this.makeCode(),this.pageIndex()+1).pipe(Qa$1(this.destroyRef)).subscribe({next:n=>{this.items.set(n.items??[]),this.totalCount.set(n.totalCount??0),this.loading.set(!1)},error:()=>{this.loading.set(!1),this.snackBar.open(`Could not load vehicle models.`,`Close`,{duration:K})}})}onPage(n){this.pageIndex.set(n.pageIndex),this.loadModels()}addModel(){this.makeEditable()&&(this.currentModel=null,this.creating.set(!0),this.form.reset(An()),this.form.enable(),this.editorOpen.set(!0))}editModel(n){this.makeEditable()&&(this.currentModel=n,this.creating.set(!1),this.form.reset(Qa(n)),this.form.controls.modelCode.disable(),this.editorOpen.set(!0))}cancelModel(){if(!this.form.dirty){this.resetEditor();return}GZ(this.dialog,{title:`Discard this model row?`,message:`Your unsaved model changes will be lost.`,confirmLabel:`Discard changes`,cancelLabel:`Keep editing`,destructive:!0}).pipe(Qa$1(this.destroyRef)).subscribe(n=>{n&&this.resetEditor()})}discardForMakeEditOff(){this.resetEditor()}saveModel(){if(this.form.markAllAsTouched(),this.form.invalid||!this.makeEditable())return;let n=this.form.getRawValue(),t=Ya(n),r=this.creating(),m=this.currentModel;this.saving.set(!0);let u=r?this.modelsClient.create(this.makeCode(),g({modelCode:n.modelCode},t)):m?this.modelsClient.update(this.makeCode(),m.modelCode,t):null;if(u===null){this.saving.set(!1),this.snackBar.open(`The selected model is no longer available. Refresh the model list.`,`Close`,{duration:K});return}u.pipe(Qa$1(this.destroyRef)).subscribe({next:()=>{this.saving.set(!1),this.resetEditor(),this.loadModels(),this.snackBar.open(r?`Vehicle model saved.`:`Vehicle model updated.`,`Close`,{duration:K})},error:y=>{this.saving.set(!1),HY(y)?this.showFieldErrors(y.problem):this.snackBar.open(`Could not save the vehicle model.`,`Close`,{duration:K})}})}deleteModel(n){this.makeEditable()&&GZ(this.dialog,{title:`Delete this vehicle model?`,message:`${n.modelName} (${n.modelCode}) will be permanently deleted. This cannot be undone.`,confirmLabel:`Delete permanently`,cancelLabel:`Cancel`,destructive:!0}).pipe(ie(t=>t),$e(()=>this.modelsClient.delete(this.makeCode(),n.modelCode)),Qa$1(this.destroyRef)).subscribe({next:()=>{this.items().length===1&&this.pageIndex()>0&&this.pageIndex.update(t=>t-1),this.loadModels(),this.snackBar.open(`Vehicle model deleted.`,`Close`,{duration:K})},error:()=>{this.snackBar.open(`Could not delete the vehicle model.`,`Close`,{duration:K})}})}optionsFor(n){let t=this.options();switch(n){case`variant`:return t.variants;case`vehicleType`:return t.vehicleTypes;case`bodyType`:return t.bodyTypes;case`fuelType`:return t.fuelTypes;case`cylinders`:return t.cylinders;case`doors`:return t.doors;case`drivingType`:return t.drivingTypes;case`bodyColour`:return t.bodyColours;case`category`:return t.categories}}hasInactiveSelection(n){let t=this.form.controls[n].value;return t.length>0&&!this.optionsFor(n).some(r=>r.code===t)}fieldError(n){if(!n.touched)return null;let t=n.getError(`server`);return typeof t==`string`?t:n.hasError(`required`)?`This field is required.`:n.hasError(`maxlength`)?`The value exceeds its maximum length.`:n.hasError(`nonNegativeWholeNumber`)?`Enter a whole number of zero or more.`:n.hasError(`min`)||n.hasError(`max`)?`The value is outside the allowed range.`:null}loadOptions(){this.optionsClient.get().pipe(Qa$1(this.destroyRef)).subscribe({next:n=>this.options.set(n),error:()=>{this.snackBar.open(`Could not load vehicle model options.`,`Close`,{duration:K})}})}showFieldErrors(n){let t=this.form.controls;for(let[r,m]of Object.entries(n.fieldErrors)){let u=t[r];u&&m.length>0&&(u.setErrors(H(g({},u.errors),{server:m[0]})),u.markAsTouched())}}resetEditor(){this.editorOpen.set(!1),this.creating.set(!1),this.currentModel=null,this.form.reset(An()),this.form.markAsPristine(),this.form.enable()}static ɵfac=function(t){return new(t||e)};static ɵcmp=ce({type:e,selectors:[[`app-vehicle-model-list`]],inputs:{makeCode:[1,`makeCode`],makeEditable:[1,`makeEditable`]},decls:8,vars:3,consts:[[1,`model-list`],[1,`model-header`],[`matButton`,`filled`,`type`,`button`],[`mode`,`indeterminate`,`aria-label`,`Loading vehicle models`],[`novalidate`,``,1,`model-form`,3,`formGroup`],[`matButton`,`filled`,`type`,`button`,3,`click`],[1,`table-scroll`],[`mat-table`,``,3,`dataSource`],[`matColumnDef`,`modelCode`],[`mat-header-cell`,``,4,`matHeaderCellDef`],[`mat-cell`,``,4,`matCellDef`],[`matColumnDef`,`modelName`],[`matColumnDef`,`shortName`],[`matColumnDef`,`status`],[`matColumnDef`,`actions`],[`mat-header-row`,``,4,`matHeaderRowDef`],[`mat-row`,``,4,`matRowDef`,`matRowDefColumns`],[1,`state`],[`aria-label`,`Select a page of vehicle models`,3,`page`,`length`,`pageSize`,`pageIndex`,`hidePageSize`,`showFirstLastButtons`],[`mat-header-cell`,``],[`mat-cell`,``],[`mat-header-cell`,``,`class`,`actions-column`,4,`matHeaderCellDef`],[`mat-cell`,``,`class`,`actions-column`,4,`matCellDef`],[`mat-header-cell`,``,1,`actions-column`],[`mat-cell`,``,1,`actions-column`],[`matButton`,``,`type`,`button`,3,`click`],[`matButton`,``,`type`,`button`,1,`delete-action`,3,`click`],[`mat-header-row`,``],[`mat-row`,``],[`novalidate`,``,1,`model-form`,3,`ngSubmit`,`formGroup`],[1,`grid`],[`label`,`Model Code`,`patternMessage`,`Model Code can contain only letters, digits and hyphens.`,1,`code`,3,`control`,`maxLength`,`uppercase`],[`label`,`Model Name`,1,`name`,3,`control`,`maxLength`],[`label`,`Short Name`,1,`short`,3,`control`,`maxLength`],[1,`active`,3,`formControl`],[1,`additional`],[`label`,`Remarks`,1,`full`,3,`control`,`maxLength`,`multiline`,`showCounter`],[`label`,`Arabic Model Name`,1,`half`,3,`control`,`maxLength`,`rtl`],[`label`,`Arabic Short Name`,1,`half`,3,`control`,`maxLength`,`rtl`],[`label`,`Arabic Remarks`,1,`full`,3,`control`,`maxLength`,`multiline`,`rtl`,`showCounter`],[`appearance`,`outline`,`subscriptSizing`,`dynamic`],[3,`formControl`],[`value`,``],[`disabled`,``,3,`value`],[3,`value`],[`matInput`,``,`type`,`text`,3,`formControl`,`maxlength`],[`matInput`,``,`type`,`number`,`step`,`1`,`min`,`0`,3,`formControl`],[`matInput`,``,`type`,`number`,`step`,`1`,`min`,`0`,`max`,`999`,3,`formControl`],[`matInput`,``,`type`,`number`,`step`,`1`,`min`,`0`,`max`,`9999`,3,`formControl`],[`matInput`,``,`type`,`number`,`min`,`0`,`step`,`0.01`,3,`formControl`],[1,`actions`],[`matButton`,``,`type`,`button`,3,`click`,`disabled`],[`matButton`,`filled`,`type`,`submit`,3,`disabled`]],template:function(t,r){t&1&&(ze(0,`section`,0)(1,`header`,1)(2,`h2`),gn(3,`Vehicle Models`),We(),Lr(4,Yn,2,0,`button`,2),We(),Lr(5,Zn,1,0,`mat-progress-bar`,3),Lr(6,pa,19,10)(7,Wa,155,72,`form`,4),We()),t&2&&(xe$1(4),Fr(r.makeEditable()&&!r.editorOpen()?4:-1),xe$1(),Fr(r.loading()?5:-1),xe$1(),Fr(r.editorOpen()?7:6))},dependencies:[Ss,ws,er$1,na$1,vs,xs,Po,Oo,Fo,ra$2,bt$1,cu,it,xe,tt,at,nt,Ct,nn,Tn,aa$1,kd,Md,wm,Va$1,Fm,qr,Ur$1,st,me,Cu,uu,pu,bu,hu,fu,yu,gu,_u,vu,xu,pe],styles:[`.model-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1rem;margin-top:1rem}.model-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:1rem}.model-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0;font-size:1.25rem}.table-scroll[_ngcontent-%COMP%]{overflow-x:auto}.model-form[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1rem;padding:1rem;border:1px solid var(--%NS%mdc-outline-color, #9e9e9e);border-radius:4px;background:var(--%NS%mdc-container-color, #ffffff)}.grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}.code[_ngcontent-%COMP%], .name[_ngcontent-%COMP%], .short[_ngcontent-%COMP%], .active[_ngcontent-%COMP%], .full[_ngcontent-%COMP%]{grid-column:1 / -1}.half[_ngcontent-%COMP%]{grid-column:span 1}.state[_ngcontent-%COMP%]{color:var(--%NS%mdc-text-secondary-on-background-color, #666);font-size:.875rem}.actions-column[_ngcontent-%COMP%]{text-align:center}.delete-action[_ngcontent-%COMP%]{color:var(--%NS%mdc-error-container-color, #b3261e)}`]})};function An(){return{modelCode:``,modelName:``,shortName:``,remarks:``,arabicModelName:``,arabicShortName:``,arabicRemarks:``,variant:``,vehicleType:``,weight:``,loadCapacity:``,bodyType:``,fuelType:``,engineCapacity:null,cylinders:``,seats:null,passengers:null,drivers:null,doors:``,makeYear:null,drivingType:``,bodyColour:``,value:null,category:``,active:!0}}function Qa(e){return{modelCode:e.modelCode,modelName:e.modelName,shortName:e.shortName,remarks:e.remarks??``,arabicModelName:e.arabicModelName??``,arabicShortName:e.arabicShortName??``,arabicRemarks:e.arabicRemarks??``,variant:e.variant??``,vehicleType:e.vehicleType??``,weight:e.weight??``,loadCapacity:e.loadCapacity??``,bodyType:e.bodyType??``,fuelType:e.fuelType??``,engineCapacity:e.engineCapacity,cylinders:e.cylinders??``,seats:e.seats,passengers:e.passengers,drivers:e.drivers,doors:e.doors??``,makeYear:e.makeYear,drivingType:e.drivingType??``,bodyColour:e.bodyColour??``,value:e.value,category:e.category??``,active:e.active}}function Ya(e){return{modelName:e.modelName,shortName:e.shortName,remarks:e.remarks||null,arabicModelName:e.arabicModelName||null,arabicShortName:e.arabicShortName||null,arabicRemarks:e.arabicRemarks||null,variant:e.variant||null,vehicleType:e.vehicleType||null,weight:e.weight||null,loadCapacity:e.loadCapacity||null,bodyType:e.bodyType||null,fuelType:e.fuelType||null,engineCapacity:e.engineCapacity,cylinders:e.cylinders||null,seats:e.seats,passengers:e.passengers,drivers:e.drivers,doors:e.doors||null,makeYear:e.makeYear,drivingType:e.drivingType||null,bodyColour:e.bodyColour||null,value:e.value,category:e.category||null,active:e.active}}var Za=[`editSwitch`];function Ka(e,n){e&1&&(ze(0,`p`,3),gn(1,`Review the details, or switch on Edit to change them.`),We())}function Ja(e,n){e&1&&(ze(0,`p`,3),gn(1,`Fields marked * are required.`),We())}function ei(e,n){if(e&1){let t=Ip();ze(0,`mat-slide-toggle`,21,0),jr(`change`,function(m){dc(t);let u=ol();return fc(u.onEditToggle(m))}),gn(2,` Edit `),We()}if(e&2){let t=ol();hs(`checked`,t.editing())(`disabled`,t.loading()||t.saving())}}function ti(e,n){e&1&&zo(0,`mat-progress-bar`,5)}function ni(e,n){if(e&1&&(ze(0,`button`,19),gn(1),We()),e&2){let t=ol();hs(`disabled`,t.saving()||t.loading()),xe$1(),bn(` `,t.mode===`create`?`Save vehicle make`:`Save changes`,` `)}}function ai(e,n){if(e&1&&zo(0,`app-vehicle-model-list`,20),e&2){let t=ol();hs(`makeCode`,t.currentMakeCode())(`makeEditable`,t.editing())}}var Pn=5e3;var W={makeCode:12,makeName:100,shortName:30,remarks:2e3,arabicMakeName:100,arabicShortName:30,arabicRemarks:2e3};var ii=[`remarks`,`arabicMakeName`,`arabicShortName`,`arabicRemarks`];var Vn=class e{client=f(Qw);router=f(Zl);dialog=f(cE);snackBar=f(BY);destroyRef=f(Ve);editToggle=$8(`editSwitch`,{read:me});modelList=$8(he);mode=f(Kn$1).snapshot.data.mode===`view`?`view`:`create`;heading=this.mode===`create`?`Add vehicle make`:`Vehicle make details`;limits=W;editing=Re(this.mode===`create`);loading=Re(!1);saving=Re(!1);additionalOpen=Re(!1);currentMakeCode=Re(``);form=new Yt({makeCode:new Qo(``,{nonNullable:!0,validators:[$e$1.required,X,$e$1.maxLength(W.makeCode),$e$1.pattern(/^[A-Za-z0-9-]+$/)]}),makeName:new Qo(``,{nonNullable:!0,validators:[$e$1.required,X,$e$1.maxLength(W.makeName)]}),shortName:new Qo(``,{nonNullable:!0,validators:[$e$1.required,X,$e$1.maxLength(W.shortName)]}),remarks:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(W.remarks)]}),arabicMakeName:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(W.arabicMakeName)]}),arabicShortName:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(W.arabicShortName)]}),arabicRemarks:new Qo(``,{nonNullable:!0,validators:[$e$1.maxLength(W.arabicRemarks)]}),active:new Qo(!0,{nonNullable:!0})});savedValues=null;constructor(){if(this.mode===`view`){let n=oi();if(n===null){this.router.navigate([`/vehicle-makes`]);return}this.applyEditState(),this.loadMake(n)}}hasUnsavedChanges(){return this.form.dirty||(this.modelList()?.hasUnsavedChanges()??!1)}back(){this.router.navigate([`/vehicle-makes`])}onEditToggle(n){if(n.checked){this.editing.set(!0),this.applyEditState();return}if(!this.hasUnsavedChanges()){this.stopEditing();return}GZ(this.dialog,{title:`Discard your changes?`,message:`You have changes that have not been saved. Turning editing off will discard them.`,confirmLabel:`Discard changes`,cancelLabel:`Keep editing`,destructive:!0}).pipe(Qa$1(this.destroyRef)).subscribe(t=>{if(t){this.stopEditing();return}let r=this.editToggle();r&&(r.checked=!0)})}save(){if(this.form.markAllAsTouched(),this.form.invalid){this.openAdditionalInformationIfItHasAnError();return}let n=this.form.getRawValue(),t={makeName:n.makeName,shortName:n.shortName,remarks:n.remarks,arabicMakeName:n.arabicMakeName,arabicShortName:n.arabicShortName,arabicRemarks:n.arabicRemarks,active:n.active};if(this.saving.set(!0),this.mode===`create`){this.client.create(g({makeCode:n.makeCode},t)).pipe(Qa$1(this.destroyRef)).subscribe({next:()=>{this.saving.set(!1),this.form.markAsPristine(),this.snackBar.open(`Vehicle make saved.`,`Close`,{duration:Pn}),this.back()},error:r=>this.onSaveFailed(r)});return}this.client.update(n.makeCode,t).pipe(Qa$1(this.destroyRef)).subscribe({next:r=>{this.saving.set(!1);let m=this.modelList()?.hasUnsavedChanges()??!1;this.showMake(r),this.editing.set(m),this.applyEditState(),this.snackBar.open(`Vehicle make updated.`,`Close`,{duration:Pn})},error:r=>this.onSaveFailed(r)})}loadMake(n){this.loading.set(!0),this.client.get(n).pipe(Qa$1(this.destroyRef)).subscribe({next:t=>{this.loading.set(!1),this.showMake(t)},error:()=>this.back()})}showMake(n){let t={makeCode:n.makeCode,makeName:n.makeName,shortName:n.shortName,remarks:n.remarks??``,arabicMakeName:n.arabicMakeName??``,arabicShortName:n.arabicShortName??``,arabicRemarks:n.arabicRemarks??``,active:n.active!==!1};this.form.reset(t),this.currentMakeCode.set(t.makeCode),this.savedValues=t,this.additionalOpen.set(t.remarks!==``||t.arabicMakeName!==``||t.arabicShortName!==``||t.arabicRemarks!==``),this.applyEditState()}stopEditing(){this.modelList()?.discardForMakeEditOff(),this.savedValues&&this.form.reset(this.savedValues),this.editing.set(!1),this.applyEditState()}applyEditState(){this.mode===`create`||this.editing()?(this.form.enable(),this.mode===`view`&&this.form.controls.makeCode.disable()):this.form.disable()}onSaveFailed(n){if(this.saving.set(!1),!HY(n))throw n;this.showFieldErrors(n.problem)}showFieldErrors(n){let t=this.form.controls;for(let[r,m]of Object.entries(n.fieldErrors)){let u=t[r];u&&m.length>0&&(u.setErrors({server:m[0]}),u.markAsTouched())}this.openAdditionalInformationIfItHasAnError()}openAdditionalInformationIfItHasAnError(){let n=this.form.controls;ii.some(t=>n[t].invalid)&&this.additionalOpen.set(!0)}static ɵfac=function(t){return new(t||e)};static ɵcmp=ce({type:e,selectors:[[`app-vehicle-make-form`]],viewQuery:function(t,r){t&1&&Jy(r.editToggle,Za,5,me)(r.modelList,he,5),t&2&&L0(2)},decls:32,vars:31,consts:[[`editSwitch`,``],[1,`page`],[1,`page-header`],[1,`subtitle`],[3,`checked`,`disabled`],[`mode`,`indeterminate`,`aria-label`,`Loading the vehicle make`],[`novalidate`,``,1,`card`,3,`ngSubmit`,`formGroup`],[1,`grid`],[`label`,`Make Code`,`patternMessage`,`Make Code can contain only letters, digits and hyphens.`,1,`code`,3,`control`,`maxLength`,`uppercase`],[`label`,`Make Name`,1,`name`,3,`control`,`maxLength`],[`label`,`Short Name`,1,`short`,3,`control`,`maxLength`],[1,`active`,3,`formControl`],[1,`additional`,3,`opened`,`closed`,`expanded`],[`label`,`Remarks`,1,`full`,3,`control`,`maxLength`,`multiline`,`showCounter`],[`label`,`Arabic Make Name`,1,`half`,3,`control`,`maxLength`,`rtl`],[`label`,`Arabic Short Name`,1,`half`,3,`control`,`maxLength`,`rtl`],[`label`,`Arabic Remarks`,1,`full`,3,`control`,`maxLength`,`multiline`,`rtl`,`showCounter`],[1,`actions`],[`matButton`,``,`type`,`button`,3,`click`],[`matButton`,`filled`,`type`,`submit`,3,`disabled`],[3,`makeCode`,`makeEditable`],[3,`change`,`checked`,`disabled`]],template:function(t,r){t&1&&(ze(0,`section`,1)(1,`header`,2)(2,`div`)(3,`h1`),gn(4),We(),Lr(5,Ka,2,0,`p`,3)(6,Ja,2,0,`p`,3),We(),Lr(7,ei,3,2,`mat-slide-toggle`,4),We(),Lr(8,ti,1,0,`mat-progress-bar`,5),ze(9,`form`,6),jr(`ngSubmit`,function(){return r.save()}),ze(10,`div`,7),zo(11,`app-limited-text-field`,8)(12,`app-limited-text-field`,9)(13,`app-limited-text-field`,10),ze(14,`mat-slide-toggle`,11),mx(),gn(15,`Active`),We()(),ze(16,`mat-expansion-panel`,12),jr(`opened`,function(){return r.additionalOpen.set(!0)})(`closed`,function(){return r.additionalOpen.set(!1)}),ze(17,`mat-expansion-panel-header`)(18,`mat-panel-title`),gn(19,`Additional Information`),We(),ze(20,`mat-panel-description`),gn(21,`Remarks and Arabic names (all optional)`),We()(),ze(22,`div`,7),zo(23,`app-limited-text-field`,13)(24,`app-limited-text-field`,14)(25,`app-limited-text-field`,15)(26,`app-limited-text-field`,16),We()(),ze(27,`div`,17)(28,`button`,18),jr(`click`,function(){return r.back()}),gn(29,`Back to list`),We(),Lr(30,ni,2,2,`button`,19),We()(),Lr(31,ai,1,2,`app-vehicle-model-list`,20),We()),t&2&&(xe$1(4),bs(r.heading),xe$1(),Fr(r.mode===`view`&&r.currentMakeCode()?5:6),xe$1(2),Fr(r.mode===`view`?7:-1),xe$1(),Fr(r.loading()?8:-1),xe$1(),hs(`formGroup`,r.form),xe$1(2),hs(`control`,r.form.controls.makeCode)(`maxLength`,r.limits.makeCode)(`uppercase`,!0),xe$1(),hs(`control`,r.form.controls.makeName)(`maxLength`,r.limits.makeName),xe$1(),hs(`control`,r.form.controls.shortName)(`maxLength`,r.limits.shortName),xe$1(),hs(`formControl`,r.form.controls.active),bx(),xe$1(2),hs(`expanded`,r.additionalOpen()),xe$1(7),hs(`control`,r.form.controls.remarks)(`maxLength`,r.limits.remarks)(`multiline`,!0)(`showCounter`,!0),xe$1(),hs(`control`,r.form.controls.arabicMakeName)(`maxLength`,r.limits.arabicMakeName)(`rtl`,!0),xe$1(),hs(`control`,r.form.controls.arabicShortName)(`maxLength`,r.limits.arabicShortName)(`rtl`,!0),xe$1(),hs(`control`,r.form.controls.arabicRemarks)(`maxLength`,r.limits.arabicRemarks)(`multiline`,!0)(`rtl`,!0)(`showCounter`,!0),xe$1(4),Fr(r.editing()?30:-1),xe$1(),Fr(r.mode===`view`?31:-1))},dependencies:[Ss,ws,vs,xs,ra$2,bt$1,cu,it,xe,tt,at,nt,Fm,me,pe,he],styles:[`.page[_ngcontent-%COMP%]{max-width:900px;margin:0 auto;padding:24px 24px 48px}.page-header[_ngcontent-%COMP%]{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}h1[_ngcontent-%COMP%]{margin:0 0 4px;font-size:1.5rem;font-weight:600;color:var(--%NS%sdd-text)}.subtitle[_ngcontent-%COMP%]{margin:0;color:var(--%NS%sdd-muted)}.card[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--%NS%sdd-surface);border:1px solid var(--%NS%sdd-border);border-radius:8px}.grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}.code[_ngcontent-%COMP%]{grid-column:span 3}.name[_ngcontent-%COMP%]{grid-column:span 6}.short[_ngcontent-%COMP%]{grid-column:span 3}.half[_ngcontent-%COMP%]{grid-column:span 6}.full[_ngcontent-%COMP%]{grid-column:span 12}.additional[_ngcontent-%COMP%]{box-shadow:none;border:1px solid var(--%NS%sdd-border)}.actions[_ngcontent-%COMP%]{display:flex;justify-content:space-between;gap:12px}@media(max-width:700px){.code[_ngcontent-%COMP%], .name[_ngcontent-%COMP%], .short[_ngcontent-%COMP%], .half[_ngcontent-%COMP%]{grid-column:span 12}.page-header[_ngcontent-%COMP%]{flex-direction:column}}`]})};function oi(){let e=history.state;if(typeof e==`object`&&e!==null&&`makeCode`in e){let n=e.makeCode;return typeof n==`string`&&n.length>0?n:null}return null}export{Vn as VehicleMakeFormComponent};