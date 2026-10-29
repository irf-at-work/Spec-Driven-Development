import{$ as Pe$1,$n as w0,$t as ft$1,A as Hh,An as ps,Bn as s9,C as Fe,Cn as ln,Ct as Xn$1,D as Gy,Dn as oe,Dt as Ys,E as Gt,En as nb,Et as Yq,G as Me,Gt as dc,H as La,Hn as si$1,Ht as bu,I as Jr,In as rb,It as ae,J as Np,Jt as et,Kn as um,Kt as ea,Ln as re,Lt as am,Mn as q,N as J,Nn as qe,O as H,On as ol,Ot as Yy,P as Jl,Pt as Zy,Qn as w,Qt as fn,R as Ks,Rt as b,S as Ep,Sn as lm,St as Vr,T as Ge,Tn as nR,U as Lr,Un as so,Ut as ce,V as LY,Vn as sR,Vt as bt$1,Wn as ta$1,Wt as cu,X as Nw,Xt as f,Y as Nt$1,Yn as vi$1,Yt as eu,Z as O0,Zn as vt,Zt as fc,_ as Dn,_n as jr,a as A,an as h6,ar as xw,at as Rw,bn as ku,bt as Vo,c as Bm,cn as hs,cr as zn,ct as T,dn as iE,dt as Tp,en as fx,er as wi$1,et as Pr,f as Cp,g as Di$1,gn as jm,gt as Uh,h as D_,ht as Ue,i as $o,in as gt$1,ir as xp,it as Rp,j as Ho,jn as pw,jt as Zl,kn as pn,l as Br,ln as hx,lr as zy,lt as Te,m as D0,mn as im,mt as UZ,n as $e,nn as gn,nr as wt$1,nt as Qh,o as Ae$1,on as hR,ot as S9,p as D,pn as ie,q as Nn,qn as ut,qt as em,r as $n,rn as gs,rr as x6,rt as R,s as Be,sn as hn,st as Sp,tn as g,tr as wn,tt as Q,u as Ce,ut as To,v as E,w as Fr,wn as mn,wt as Xt,x as En,xt as Vp,y as E0,yn as ke,yt as Ve,z as Kw,zn as rt$1,zt as be}from"./main-QQMYYGHG.js";import{A as mn$1,C as Yn,E as et$1,M as ns,O as is,_ as Qr,a as Et,b as Wi$1,c as It$1,d as Mr,f as Mt$1,g as Qn,h as Qi,j as ms,k as kn,l as J$1,m as Nt$2,n as Ae$2,r as At,s as Ft,t as $n$1,x as Xr,y as Vt}from"./chunk-B53sdOlo.js";var qn=(()=>{class n{_animationsDisabled=vt();state=`unchecked`;disabled=!1;appearance=`full`;static ɵfac=function(t){return new(t||n)};static ɵcmp=ae({type:n,selectors:[[`mat-pseudo-checkbox`]],hostAttrs:[1,`mat-pseudo-checkbox`],hostVars:12,hostBindings:function(t,i){t&2&&Fe(`mat-pseudo-checkbox-indeterminate`,i.state===`indeterminate`)(`mat-pseudo-checkbox-checked`,i.state===`checked`)(`mat-pseudo-checkbox-disabled`,i.disabled)(`mat-pseudo-checkbox-minimal`,i.appearance===`minimal`)(`mat-pseudo-checkbox-full`,i.appearance===`full`)(`_mat-animation-noopable`,i._animationsDisabled)},inputs:{state:`state`,disabled:`disabled`,appearance:`appearance`},decls:0,vars:0,template:function(t,i){},styles:[`.mat-pseudo-checkbox {
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1), background-color 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox::after {
  position: absolute;
  opacity: 0;
  content: "";
  border-bottom: 2px solid currentColor;
  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-pseudo-checkbox._mat-animation-noopable::after {
  transition: none;
}

.mat-pseudo-checkbox-disabled {
  cursor: default;
}

.mat-pseudo-checkbox-indeterminate::after {
  left: 1px;
  opacity: 1;
  border-radius: 2px;
}

.mat-pseudo-checkbox-checked::after {
  left: 1px;
  border-left: 2px solid currentColor;
  transform: rotate(-45deg);
  opacity: 1;
  box-sizing: content-box;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  color: var(--%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--%NS%mat-sys-primary));
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-pseudo-checkbox-full {
  border-color: var(--%NS%mat-pseudo-checkbox-full-unselected-icon-color, var(--%NS%mat-sys-on-surface-variant));
  border-width: 2px;
  border-style: solid;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled {
  border-color: var(--%NS%mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {
  background-color: var(--%NS%mat-pseudo-checkbox-full-selected-icon-color, var(--%NS%mat-sys-primary));
  border-color: transparent;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  color: var(--%NS%mat-pseudo-checkbox-full-selected-checkmark-color, var(--%NS%mat-sys-on-primary));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {
  background-color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));
}

.mat-pseudo-checkbox {
  width: 18px;
  height: 18px;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after {
  width: 14px;
  height: 6px;
  transform-origin: center;
  top: -4.2426406871px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  top: 8px;
  width: 16px;
}

.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after {
  width: 10px;
  height: 4px;
  transform-origin: center;
  top: -2.8284271247px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  top: 6px;
  width: 12px;
}
`],encapsulation:2})}return n})();var gt=new b(`MAT_OPTION_PARENT_COMPONENT`);var _t=new b(`MatOptgroup`);var ft=class{source;isUserInput;constructor(l,e=!1){this.source=l,this.isUserInput=e}};var Se=(()=>{class n{_element=f(Q);_changeDetectorRef=f(zn);_parent=f(gt,{optional:!0});group=f(_t,{optional:!0});_signalDisableRipple=!1;_selected=!1;_active=!1;_mostRecentViewValue=``;get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=f(bt$1).getId(`mat-option-`);get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=Te(!1);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return!!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new q;_text;_stateChanges=new w;constructor(){let e=f(gt$1);e.load(xw),e.load(Jl),this._signalDisableRipple=!!this._parent&&To(this._parent.disableRipple)}get active(){return this._active}get viewValue(){return(this._text?.nativeElement.textContent||``).trim()}select(e=!0){this._selected||(this._selected=!0,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}deselect(e=!0){this._selected&&(this._selected=!1,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}focus(e,t){let i=this._getHostElement();typeof i.focus==`function`&&i.focus(t)}setActiveStyles(){this._active||(this._active=!0,this._changeDetectorRef.markForCheck())}setInactiveStyles(){this._active&&(this._active=!1,this._changeDetectorRef.markForCheck())}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!Xn$1(e)&&(this._selectViaInteraction(),e.preventDefault())}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:!0,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(!0))}_getTabIndex(){return this.disabled?`-1`:`0`}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e)}}ngOnDestroy(){this._stateChanges.complete()}_emitSelectionChangeEvent(e=!1){this.onSelectionChange.emit(new ft(this,e))}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[`text`],t=[[[`mat-icon`]],`*`],i=[`mat-icon`,`*`];function a(s,p){if(s&1&&Ho(0,`mat-pseudo-checkbox`,1),s&2){let r=ol();ps(`disabled`,r.disabled)(`state`,r.selected?`checked`:`unchecked`)}}function o(s,p){if(s&1&&Ho(0,`mat-pseudo-checkbox`,3),s&2){let r=ol();ps(`disabled`,r.disabled)}}function d(s,p){if(s&1&&(Ve(0,`span`,4),mn(1),Ue()),s&2){let r=ol();Ce(),gn(`(`,r.group.label,`)`)}}return ae({type:n,selectors:[[`mat-option`]],viewQuery:function(p,r){if(p&1&&jr(e,7),p&2){let u;Br(u=Vr())&&(r._text=u.first)}},hostAttrs:[`role`,`option`,1,`mat-mdc-option`,`mdc-list-item`],hostVars:11,hostBindings:function(p,r){p&1&&Fr(`click`,function(){return r._selectViaInteraction()})(`keydown`,function(_){return r._handleKeydown(_)}),p&2&&(hs(`id`,r.id),ft$1(`aria-selected`,r.selected)(`aria-disabled`,r.disabled.toString()),Fe(`mdc-list-item--selected`,r.selected)(`mat-mdc-option-multiple`,r.multiple)(`mat-mdc-option-active`,r.active)(`mdc-list-item--disabled`,r.disabled))},inputs:{value:`value`,id:`id`,disabled:[2,`disabled`,`disabled`,Ae$1]},outputs:{onSelectionChange:`onSelectionChange`},exportAs:[`matOption`],ngContentSelectors:i,decls:8,vars:5,consts:[[`text`,``],[`aria-hidden`,`true`,1,`mat-mdc-option-pseudo-checkbox`,3,`disabled`,`state`],[1,`mdc-list-item__primary-text`],[`state`,`checked`,`aria-hidden`,`true`,`appearance`,`minimal`,1,`mat-mdc-option-pseudo-checkbox`,3,`disabled`],[1,`cdk-visually-hidden`],[`aria-hidden`,`true`,`mat-ripple`,``,1,`mat-mdc-option-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`]],template:function(p,r){p&1&&($o(t),Pr(0,a,1,2,`mat-pseudo-checkbox`,1),Gt(1),Ve(2,`span`,2,0),Gt(4,1),Ue(),Pr(5,o,1,1,`mat-pseudo-checkbox`,3),Pr(6,d,2,1,`span`,4),Ho(7,`div`,5)),p&2&&(Lr(r.multiple?0:-1),Ce(5),Lr(!r.multiple&&r.selected&&!r.hideSingleSelectionIndicator?5:-1),Ce(),Lr(r.group&&r.group._inert?6:-1),Ce(),ps(`matRippleTrigger`,r._getHostElement())(`matRippleDisabled`,r.disabled||r.disableRipple))},dependencies:[qn,x6],styles:[`.mat-mdc-option {
  -webkit-user-select: none;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 48px;
  padding: 0 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--%NS%mat-option-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-option-label-text-font, var(--%NS%mat-sys-label-large-font));
  line-height: var(--%NS%mat-option-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-size: var(--%NS%mat-option-label-text-size, var(--%NS%mat-sys-body-large-size));
  letter-spacing: var(--%NS%mat-option-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  font-weight: var(--%NS%mat-option-label-text-weight, var(--%NS%mat-sys-body-large-weight));
}
.mat-mdc-option:hover:not(.mdc-list-item--disabled) {
  background-color: var(--%NS%mat-option-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {
  background-color: var(--%NS%mat-option-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));
  outline: 0;
}
.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {
  background-color: var(--%NS%mat-option-selected-state-layer-color, var(--%NS%mat-sys-secondary-container));
}
.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {
  color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-option .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-option.mdc-list-item {
  align-items: center;
  background: transparent;
}
.mat-mdc-option.mdc-list-item--disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {
  opacity: 0.38;
}
.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 32px;
}
[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 16px;
  padding-right: 32px;
}
.mat-mdc-option .mat-icon,
.mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-icon,
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 0;
  margin-left: 16px;
}
.mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-left: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-right: 16px;
  margin-left: 0;
}
.mat-mdc-option .mat-mdc-option-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-option .mdc-list-item__primary-text {
  white-space: normal;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  margin-right: auto;
}
[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {
  margin-right: 0;
  margin-left: auto;
}
@media (forced-colors: active) {
  .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  [dir=rtl] .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-option-multiple {
  --%NS%mat-list-list-item-selected-container-color: var(--%NS%mat-list-list-item-container-color, transparent);
}

.mat-mdc-option-active .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})})()}return n})();function Xn(n,l,e){if(e.length){let t=l.toArray(),i=e.toArray(),a=0;for(let o=0;o<n+1;o++)t[o].group&&t[o].group===i[a]&&a++;return a}return 0}function Zn(n,l,e,t){return n<e?n:n+l>e+t?Math.max(0,n-t+l):e}var Jn=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ce({type:n});static ɵinj=ie({imports:[wn]})}return n})();var bt=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ce({type:n});static ɵinj=ie({imports:[Nw,Jn,Se,wn]})}return n})();var Pi=new b(`mat-select-scroll-strategy`,{providedIn:`root`,factory:()=>{let n=f(A);return()=>am(n)}});var Ai=new b(`MAT_SELECT_CONFIG`);var Fi=new b(`MatSelectTrigger`);var yt=class{source;value;constructor(l,e){this.source=l,this.value=e}};var ni=(()=>{class n{_viewportRuler=f(si$1);_changeDetectorRef=f(zn);_elementRef=f(Q);_dir=f(Dn,{optional:!0});_idGenerator=f(bt$1);_renderer=f(ut);_parentFormField=f(Ft,{optional:!0});ngControl=f(J$1,{self:!0,optional:!0});_liveAnnouncer=f(Uh);_defaultOptions=f(Ai,{optional:!0});_animationsDisabled=vt();_popoverLocation;_initialized=new w;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:`start`,originY:`bottom`,overlayX:`start`,overlayY:`top`},{originX:`end`,originY:`bottom`,overlayX:`end`,overlayY:`top`},{originX:`start`,originY:`top`,overlayX:`start`,overlayY:`bottom`,panelClass:`mat-mdc-select-panel-above`},{originX:`end`,originY:`top`,overlayX:`end`,overlayY:`bottom`,panelClass:`mat-mdc-select-panel-above`}];_scrollOptionIntoView(e){let t=this.options.toArray()[e];if(t){let i=this.panel.nativeElement,a=Xn(e,this.options,this.optionGroups),o=t._getHostElement();e===0&&a===1?i.scrollTop=0:i.scrollTop=Zn(o.offsetTop,o.offsetHeight,i.scrollTop,i.offsetHeight)}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0)}_getChangeEvent(e){return new yt(this,e)}_scrollStrategyFactory=f(Pi);_panelOpen=!1;_compareWith=(e,t)=>e===t;_uid=this._idGenerator.getId(`mat-select-`);_triggerAriaLabelledBy=null;_previousControl;_destroy=new w;_errorStateTracker;stateChanges=new w;disableAutomaticLabeling=!0;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId(`mat-select-value-`);_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||``;get focused(){return this._focused||this._panelOpen}_focused=!1;controlType=`mat-select`;trigger;panel;_overlayDir;panelClass;disabled=!1;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e)}_disableRipple=Te(!1);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties()}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??!1;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next()}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(Ae$2.required)??!1}set required(e){this._required=e,this.stateChanges.next()}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e}_multiple=!1;disableOptionCentering=this._defaultOptions?.disableOptionCentering??!1;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection()}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e)}_value;ariaLabel=``;ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next()}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<`u`?this._defaultOptions.panelWidth:`auto`;canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??!1;optionSelectionChanges=Xt(()=>{let e=this.options;return e?e.changes.pipe(wt$1(e),Be(()=>ku(...e.map(t=>t.onSelectionChange)))):this._initialized.pipe(Be(()=>this.optionSelectionChanges))});openedChange=new q;_openedStream=this.openedChange.pipe(oe(e=>e),H(()=>{}));_closedStream=this.openedChange.pipe(oe(e=>!e),H(()=>{}));selectionChange=new q;valueChange=new q;constructor(){let e=f(Yn),t=f(Mt$1,{optional:!0}),i=f(Nt$2,{optional:!0}),a=f(new Rp(`tabindex`),{optional:!0}),o=f(um,{optional:!0}),d=f(kn,{optional:!0,self:!0});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new et$1(e,d||this.ngControl,i,t,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=a==null?0:parseInt(a)||0,this._popoverLocation=o?.usePopover===!1?null:`inline`,this.id=this.id}ngOnInit(){this._selectionModel=new Vt(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(rt$1(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges())})}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(rt$1(this._destroy)).subscribe(e=>{e.added.forEach(t=>t.select()),e.removed.forEach(t=>t.deselect())}),this.options.changes.pipe(wt$1(null),rt$1(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection()})}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),t=this.ngControl;if(e!==this._triggerAriaLabelledBy){let i=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?i.setAttribute(`aria-labelledby`,e):i.removeAttribute(`aria-labelledby`)}t&&(this._previousControl!==t.control&&(this._previousControl!==void 0&&t.disabled!==null&&t.disabled!==this.disabled&&(this.disabled=t.disabled),this._previousControl=t.control),this.updateErrorState())}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass))}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete()}toggle(){this.panelOpen?this.close():this.open()}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._panelOpen=!0,this._overlayDir.positionChange.pipe(ke(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled()}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!0)))}close(){this._panelOpen&&(this._panelOpen=!1,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?`rtl`:`ltr`),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!1)))}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{t(),clearTimeout(i),this._cleanupDetach=void 0};let e=this.panel.nativeElement,t=this._renderer.listen(e,`animationend`,a=>{a.animationName===`_mat-select-exit`&&(this._cleanupDetach?.(),this._detachOverlay())}),i=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay()},200);e.classList.add(`mat-select-panel-exit`)}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck()}writeValue(e){this._assignValue(e)}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next()}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return``;if(this._multiple){let e=this._selectionModel.selected.map(t=>t.viewValue);return this._isRtl()&&e.reverse(),e.join(`, `)}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState()}_isRtl(){return this._dir?this._dir.value===`rtl`:!1}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e))}_handleClosedKeydown(e){let t=e.keyCode,i=t===40||t===38||t===37||t===39,a=t===13||t===32,o=this._keyManager;if(!o.isTyping()&&a&&!Xn$1(e)||(this.multiple||e.altKey)&&i)e.preventDefault(),this.open();else if(!this.multiple){let d=this.selected;o.onKeydown(e);let s=this.selected;s&&d!==s&&this._liveAnnouncer.announce(s.viewValue,1e4)}}_handleOpenKeydown(e){let t=this._keyManager,i=e.keyCode,a=i===40||i===38,o=t.isTyping();if(a&&e.altKey)e.preventDefault(),this.close();else if(!o&&(i===13||i===32)&&t.activeItem&&!Xn$1(e))e.preventDefault(),t.activeItem._selectViaInteraction();else if(!o&&this._multiple&&i===65&&e.ctrlKey){e.preventDefault();let d=this.options.some(s=>!s.disabled&&!s.selected);this.options.forEach(s=>{s.disabled||(d?s.select():s.deselect())})}else{let d=t.activeItemIndex;t.onKeydown(e),this._multiple&&a&&e.shiftKey&&t.activeItem&&t.activeItemIndex!==d&&t.activeItem._selectViaInteraction()}}_handleOverlayKeydown(e){e.keyCode===27&&!Xn$1(e)&&(e.preventDefault(),this.close())}_onFocus(){this.disabled||(this._focused=!0,this.stateChanges.next())}_onBlur(){this._focused=!1,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next())}get empty(){return!this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next()})}_setSelectionByValue(e){if(this.options.forEach(t=>t.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)e.forEach(t=>this._selectOptionByValue(t)),this._sortValues();else{let t=this._selectOptionByValue(e);t?this._keyManager.updateActiveItem(t):this.panelOpen||this._keyManager.updateActiveItem(-1)}this._changeDetectorRef.markForCheck()}_selectOptionByValue(e){let t=this.options.find(i=>{if(this._selectionModel.isSelected(i))return!1;try{return(i.value!=null||this.canSelectNullableOptions)&&this._compareWith(i.value,e)}catch{return!1}});return t&&this._selectionModel.select(t),t}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,!0):!1}_skipPredicate=e=>this.panelOpen?!1:e.disabled;_getOverlayWidth(e){return this.panelWidth===`auto`?(e instanceof im?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?``:this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck()}_initKeyManager(){this._keyManager=new Hh(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?`rtl`:`ltr`).withHomeAndEnd().withPageUpDown().withAllowedModifierKeys([`shiftKey`]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close())}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction()})}_resetOptions(){let e=ku(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(rt$1(e)).subscribe(t=>{this._onSelect(t.source,t.isUserInput),t.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus())}),ku(...this.options.map(t=>t._stateChanges)).pipe(rt$1(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next()})}_onSelect(e,t){let i=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(i!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),t&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),t&&this.focus())),i!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next()}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((t,i)=>this.sortComparator?this.sortComparator(t,i,e):e.indexOf(t)-e.indexOf(i)),this.stateChanges.next()}}_propagateChanges(e){let t;this.multiple?t=this.selected.map(i=>i.value):t=this.selected?this.selected.value:e,this._value=t,this.valueChange.emit(t),this._onChange(t),this.selectionChange.emit(this._getChangeEvent(t)),this._changeDetectorRef.markForCheck()}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let t=0;t<this.options.length;t++)if(!this.options.get(t).disabled){e=t;break}this._keyManager.setActiveItem(e)}else this._keyManager.setActiveItem(this._selectionModel.selected[0])}_canOpen(){return!this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e)}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,t=e?e+` `:``;return this.ariaLabelledby?t+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||``;return this.ariaLabelledby&&(e+=` `+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute(`aria-describedby`)?.split(` `)||[]}setDescribedByIds(e){let t=this._elementRef.nativeElement;e.length?t.setAttribute(`aria-describedby`,e.join(` `)):t.removeAttribute(`aria-describedby`)}onContainerClick(e){let t=$e(e);t&&(t.tagName===`MAT-OPTION`||t.classList.contains(`cdk-overlay-backdrop`)||t.closest(`.mat-mdc-select-panel`))||(this.focus(),this.open())}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[`trigger`],t=[`panel`],i=[[[`mat-select-trigger`]],`*`],a=[`mat-select-trigger`,`*`];function o(u,_){if(u&1&&(Ve(0,`span`,4),mn(1),Ue()),u&2){let m=ol();Ce(),gs(m.placeholder)}}function d(u,_){u&1&&Gt(0)}function s(u,_){if(u&1&&(Ve(0,`span`,11),mn(1),Ue()),u&2){let m=ol(2);Ce(),gs(m.triggerValue)}}function p(u,_){if(u&1&&(Ve(0,`span`,5),Pr(1,d,1,0)(2,s,2,1,`span`,11),Ue()),u&2){let m=ol();Ce(),Lr(m.customTrigger?1:2)}}function r(u,_){if(u&1){let m=Sp();Ve(0,`div`,12,1),Fr(`keydown`,function(V){dc(m);let K=ol();return fc(K._handleKeydown(V))}),Gt(2,1),Ue()}if(u&2){let m=ol();xp(m.panelClass),Fe(`mat-select-panel-animations-enabled`,!m._animationsDisabled)(`mat-primary`,m._parentFormField?.color===`primary`)(`mat-accent`,m._parentFormField?.color===`accent`)(`mat-warn`,m._parentFormField?.color===`warn`)(`mat-undefined`,!m._parentFormField?.color),ft$1(`id`,m.id+`-panel`)(`aria-multiselectable`,m.multiple)(`aria-label`,m.ariaLabel||null)(`aria-labelledby`,m._getPanelAriaLabelledby())}}return ae({type:n,selectors:[[`mat-select`]],contentQueries:function(_,m,D){if(_&1&&Zy(D,Fi,5)(D,Se,5)(D,_t,5),_&2){let V;Br(V=Vr())&&(m.customTrigger=V.first),Br(V=Vr())&&(m.options=V),Br(V=Vr())&&(m.optionGroups=V)}},viewQuery:function(_,m){if(_&1&&jr(e,5)(t,5)(hR,5),_&2){let D;Br(D=Vr())&&(m.trigger=D.first),Br(D=Vr())&&(m.panel=D.first),Br(D=Vr())&&(m._overlayDir=D.first)}},hostAttrs:[`role`,`combobox`,`aria-haspopup`,`listbox`,1,`mat-mdc-select`],hostVars:21,hostBindings:function(_,m){_&1&&Fr(`keydown`,function(V){return m._handleKeydown(V)})(`focus`,function(){return m._onFocus()})(`blur`,function(){return m._onBlur()}),_&2&&(ft$1(`id`,m.id)(`tabindex`,m.disabled?-1:m.tabIndex)(`aria-controls`,m.panelOpen?m.id+`-panel`:null)(`aria-expanded`,m.panelOpen)(`aria-label`,m.ariaLabel||null)(`aria-required`,m.required.toString())(`aria-disabled`,m.disabled.toString())(`aria-invalid`,m.errorState)(`aria-activedescendant`,m._getAriaActiveDescendant()),Fe(`mat-mdc-select-disabled`,m.disabled)(`mat-mdc-select-invalid`,m.errorState)(`mat-mdc-select-required`,m.required)(`mat-mdc-select-empty`,m.empty)(`mat-mdc-select-multiple`,m.multiple)(`mat-select-open`,m.panelOpen))},inputs:{userAriaDescribedBy:[0,`aria-describedby`,`userAriaDescribedBy`],panelClass:`panelClass`,disabled:[2,`disabled`,`disabled`,Ae$1],disableRipple:[2,`disableRipple`,`disableRipple`,Ae$1],tabIndex:[2,`tabIndex`,`tabIndex`,u=>u==null?0:D_(u)],hideSingleSelectionIndicator:[2,`hideSingleSelectionIndicator`,`hideSingleSelectionIndicator`,Ae$1],placeholder:`placeholder`,required:[2,`required`,`required`,Ae$1],multiple:[2,`multiple`,`multiple`,Ae$1],disableOptionCentering:[2,`disableOptionCentering`,`disableOptionCentering`,Ae$1],compareWith:`compareWith`,value:`value`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],errorStateMatcher:`errorStateMatcher`,typeaheadDebounceInterval:[2,`typeaheadDebounceInterval`,`typeaheadDebounceInterval`,D_],sortComparator:`sortComparator`,id:`id`,panelWidth:`panelWidth`,canSelectNullableOptions:[2,`canSelectNullableOptions`,`canSelectNullableOptions`,Ae$1]},outputs:{openedChange:`openedChange`,_openedStream:`opened`,_closedStream:`closed`,selectionChange:`selectionChange`,valueChange:`valueChange`},exportAs:[`matSelect`],features:[Tp([{provide:At,useExisting:n},{provide:gt,useExisting:n}]),Nt$1],ngContentSelectors:a,decls:11,vars:10,consts:[[`fallbackOverlayOrigin`,`cdkOverlayOrigin`,`trigger`,``],[`panel`,``],[`cdk-overlay-origin`,``,1,`mat-mdc-select-trigger`,3,`click`],[1,`mat-mdc-select-value`],[1,`mat-mdc-select-placeholder`,`mat-mdc-select-min-line`],[1,`mat-mdc-select-value-text`],[1,`mat-mdc-select-arrow-wrapper`],[1,`mat-mdc-select-arrow`],[`viewBox`,`0 0 24 24`,`width`,`24px`,`height`,`24px`,`focusable`,`false`,`aria-hidden`,`true`],[`d`,`M7 10l5 5 5-5z`],[`cdk-connected-overlay`,``,`cdkConnectedOverlayHasBackdrop`,``,`cdkConnectedOverlayBackdropClass`,`cdk-overlay-transparent-backdrop`,3,`detach`,`backdropClick`,`overlayKeydown`,`cdkConnectedOverlayDisableClose`,`cdkConnectedOverlayPanelClass`,`cdkConnectedOverlayScrollStrategy`,`cdkConnectedOverlayOrigin`,`cdkConnectedOverlayPositions`,`cdkConnectedOverlayWidth`,`cdkConnectedOverlayFlexibleDimensions`,`cdkConnectedOverlayUsePopover`],[1,`mat-mdc-select-min-line`],[`role`,`listbox`,`tabindex`,`-1`,1,`mat-mdc-select-panel`,`mdc-menu-surface`,`mdc-menu-surface--open`,3,`keydown`]],template:function(_,m){if(_&1&&($o(i),Ve(0,`div`,2,0),Fr(`click`,function(){return m.open()}),Ve(3,`div`,3),Pr(4,o,2,1,`span`,4)(5,p,3,1,`span`,5),Ue(),Ve(6,`div`,6)(7,`div`,7),nb(),Ve(8,`svg`,8),Ho(9,`path`,9),Ue()()()(),$n(10,r,3,16,`ng-template`,10),Fr(`detach`,function(){return m.close()})(`backdropClick`,function(){return m.close()})(`overlayKeydown`,function(V){return m._handleOverlayKeydown(V)})),_&2){let D=O0(1);Ce(3),ft$1(`id`,m._valueId),Ce(),Lr(m.empty?4:5),Ce(6),ps(`cdkConnectedOverlayDisableClose`,!0)(`cdkConnectedOverlayPanelClass`,m._overlayPanelClass)(`cdkConnectedOverlayScrollStrategy`,m._scrollStrategy)(`cdkConnectedOverlayOrigin`,m._preferredOverlayOrigin||D)(`cdkConnectedOverlayPositions`,m._positions)(`cdkConnectedOverlayWidth`,m._overlayWidth)(`cdkConnectedOverlayFlexibleDimensions`,!0)(`cdkConnectedOverlayUsePopover`,m._popoverLocation)}},dependencies:[im,hR],styles:[`@keyframes _mat-select-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-select-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-select {
  display: inline-block;
  width: 100%;
  outline: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--%NS%mat-select-enabled-trigger-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-select-trigger-text-font, var(--%NS%mat-sys-body-large-font));
  line-height: var(--%NS%mat-select-trigger-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  font-size: var(--%NS%mat-select-trigger-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-select-trigger-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-select-trigger-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}

div.mat-mdc-select-panel {
  box-shadow: var(--%NS%mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}

.mat-mdc-select-disabled {
  color: var(--%NS%mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-select-disabled .mat-mdc-select-placeholder {
  color: var(--%NS%mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-select-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.mat-mdc-select-disabled .mat-mdc-select-trigger {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

.mat-mdc-select-value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mat-mdc-select-value-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mat-mdc-select-arrow-wrapper {
  height: 24px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {
  transform: none;
}

.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,
.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-select-invalid-arrow-color, var(--%NS%mat-sys-error));
}

.mat-mdc-select-arrow {
  width: 10px;
  height: 5px;
  position: relative;
  color: var(--%NS%mat-select-enabled-arrow-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {
  color: var(--%NS%mat-select-focused-arrow-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {
  color: var(--%NS%mat-select-disabled-arrow-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-select-open .mat-mdc-select-arrow {
  transform: rotate(180deg);
}
.mat-form-field-animations-enabled .mat-mdc-select-arrow {
  transition: transform 80ms linear;
}
.mat-mdc-select-arrow svg {
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (forced-colors: active) {
  .mat-mdc-select-arrow svg {
    fill: CanvasText;
  }
  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {
    fill: GrayText;
  }
}

div.mat-mdc-select-panel {
  width: 100%;
  max-height: 275px;
  outline: 0;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  transform-origin: top center;
  border-radius: 0 0 4px 4px;
  position: relative;
  background-color: var(--%NS%mat-select-panel-background-color, var(--%NS%mat-sys-surface-container));
}
.mat-mdc-select-panel-above div.mat-mdc-select-panel {
  border-radius: 4px 4px 0 0;
  transform-origin: bottom center;
}
@media (forced-colors: active) {
  div.mat-mdc-select-panel {
    outline: solid 1px;
  }
}

.mat-select-panel-animations-enabled {
  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.mat-select-panel-animations-enabled.mat-select-panel-exit {
  animation: _mat-select-exit 100ms linear forwards;
}

.mat-mdc-select-placeholder {
  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--%NS%mat-select-placeholder-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {
  transition: none;
}
.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {
  color: transparent;
  -webkit-text-fill-color: transparent;
  transition: none;
  display: block;
}

.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {
  cursor: pointer;
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {
  max-width: calc(100% - 18px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {
  max-width: calc(100% / 0.75 - 24px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {
  max-width: calc(100% - 60px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {
  max-width: calc(100% - 24px);
}

.mat-mdc-select-min-line:empty::before {
  content: " ";
  white-space: pre;
  width: 1px;
  display: inline-block;
  visibility: hidden;
}

.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {
  transform: var(--%NS%mat-select-arrow-transform, translateY(-8px));
}
`],encapsulation:2})})()}return n})();var ii=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ce({type:n});static ɵinj=ie({imports:[bu,bt,wn,Qh,It$1,bt]})}return n})();var zi=20;var Li=new b(`mat-tooltip-scroll-strategy`,{providedIn:`root`,factory:()=>{let n=f(A);return()=>am(n,{scrollThrottle:zi})}});var Bi=new b(`mat-tooltip-default-options`,{providedIn:`root`,factory:()=>({showDelay:0,hideDelay:0,touchendHideDelay:1500})});var ai=`tooltip-panel`;var Vi={passive:!0};var Hi=8;var ji=8;var Ui=24;var Wi=200;var oi=(()=>{class n{_elementRef=f(Q);_ngZone=f(R);_platform=f(re);_ariaDescriber=f(Yq);_focusMonitor=f(Ks);_dir=f(Dn);_injector=f(A);_viewContainerRef=f(et);_mediaMatcher=f(eu);_document=f(T);_renderer=f(ut);_animationsDisabled=vt();_defaultOptions=f(Bi,{optional:!0});_overlayRef=null;_tooltipInstance=null;_overlayPanelClass;_portal;_position=`below`;_positionAtOrigin=!1;_disabled=!1;_tooltipClass;_viewInitialized=!1;_pointerExitEventsInitialized=!1;_tooltipComponent=Gi;_viewportMargin=8;_currentPosition;_cssClassPrefix=`mat-mdc`;_ariaDescriptionPending=!1;_dirSubscribed=!1;get position(){return this._position}set position(e){e!==this._position&&(this._position=e,this._overlayRef&&(this._updatePosition(this._overlayRef),this._tooltipInstance?.show(0),this._overlayRef.updatePosition()))}get positionAtOrigin(){return this._positionAtOrigin}set positionAtOrigin(e){this._positionAtOrigin=h6(e),this._detach(),this._overlayRef=null}get disabled(){return this._disabled}set disabled(e){let t=h6(e);this._disabled!==t&&(this._disabled=t,t?this.hide(0):this._setupPointerEnterEventsIfNeeded(),this._syncAriaDescription(this.message))}get showDelay(){return this._showDelay}set showDelay(e){this._showDelay=Ys(e)}_showDelay;get hideDelay(){return this._hideDelay}set hideDelay(e){this._hideDelay=Ys(e),this._tooltipInstance&&(this._tooltipInstance._mouseLeaveHideDelay=this._hideDelay)}_hideDelay;touchGestures=`auto`;get message(){return this._message}set message(e){let t=this._message;this._message=e!=null?String(e).trim():``,!this._message&&this._isTooltipVisible()?this.hide(0):(this._setupPointerEnterEventsIfNeeded(),this._updateTooltipMessage()),this._syncAriaDescription(t)}_message=``;get tooltipClass(){return this._tooltipClass}set tooltipClass(e){this._tooltipClass=e,this._tooltipInstance&&this._setTooltipClass(this._tooltipClass)}_eventCleanups=[];_touchstartTimeout=null;_destroyed=new w;_isDestroyed=!1;constructor(){let e=this._defaultOptions;e&&(this._showDelay=e.showDelay,this._hideDelay=e.hideDelay,e.position&&(this.position=e.position),e.positionAtOrigin&&(this.positionAtOrigin=e.positionAtOrigin),e.touchGestures&&(this.touchGestures=e.touchGestures),e.tooltipClass&&(this.tooltipClass=e.tooltipClass)),this._viewportMargin=Hi}ngAfterViewInit(){this._viewInitialized=!0,this._setupPointerEnterEventsIfNeeded(),this._focusMonitor.monitor(this._elementRef).pipe(rt$1(this._destroyed)).subscribe(e=>{e?e===`keyboard`&&this._ngZone.run(()=>this.show()):this._ngZone.run(()=>this.hide(0))})}ngOnDestroy(){let e=this._elementRef.nativeElement;this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this._overlayRef&&(this._overlayRef.dispose(),this._tooltipInstance=null),this._eventCleanups.forEach(t=>t()),this._eventCleanups.length=0,this._destroyed.next(),this._destroyed.complete(),this._isDestroyed=!0,this._ariaDescriber.removeDescription(e,this.message,`tooltip`),this._focusMonitor.stopMonitoring(e)}show(e=this.showDelay,t){if(this.disabled||!this.message||this._isTooltipVisible()){this._tooltipInstance?._cancelPendingAnimations();return}let i=this._createOverlay(t);this._detach(),this._portal=this._portal||new En(this._tooltipComponent,this._viewContainerRef);let a=this._tooltipInstance=i.attach(this._portal).instance;a._triggerElement=this._elementRef.nativeElement,a._mouseLeaveHideDelay=this._hideDelay,a.afterHidden().pipe(rt$1(this._destroyed)).subscribe(()=>this._detach()),this._setTooltipClass(this._tooltipClass),this._updateTooltipMessage(),a.show(e)}hide(e=this.hideDelay){let t=this._tooltipInstance;t&&(t.isVisible()?t.hide(e):(t._cancelPendingAnimations(),this._detach()))}toggle(e){this._isTooltipVisible()?this.hide():this.show(void 0,e)}_isTooltipVisible(){return!!this._tooltipInstance&&this._tooltipInstance.isVisible()}_createOverlay(e){if(this._overlayRef){let o=this._overlayRef.getConfig().positionStrategy;if((!this.positionAtOrigin||!e)&&o._origin instanceof Q)return this._overlayRef;this._detach()}let t=this._injector.get(ta$1).getAncestorScrollContainers(this._elementRef),i=`${this._cssClassPrefix}-${ai}`,a=lm(this._injector,this.positionAtOrigin?e||this._elementRef:this._elementRef).withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`).withFlexibleDimensions(!1).withViewportMargin(this._viewportMargin).withScrollableContainers(t).withPopoverLocation(`global`);return a.positionChanges.pipe(rt$1(this._destroyed)).subscribe(o=>{this._updateCurrentPositionClass(o.connectionPair),this._tooltipInstance&&o.scrollableViewProperties.isOverlayClipped&&this._tooltipInstance.isVisible()&&this._ngZone.run(()=>this.hide(0))}),this._overlayRef=Jr(this._injector,{direction:this._dir,positionStrategy:a,panelClass:this._overlayPanelClass?[...this._overlayPanelClass,i]:i,scrollStrategy:this._injector.get(Li)(),disableAnimations:this._animationsDisabled,eventPredicate:this._overlayEventPredicate}),this._updatePosition(this._overlayRef),this._overlayRef.detachments().pipe(rt$1(this._destroyed)).subscribe(()=>this._detach()),this._overlayRef.outsidePointerEvents().pipe(rt$1(this._destroyed)).subscribe(()=>this._tooltipInstance?._handleBodyInteraction()),this._overlayRef.keydownEvents().pipe(rt$1(this._destroyed)).subscribe(o=>{o.preventDefault(),o.stopPropagation(),this._ngZone.run(()=>this.hide(0))}),this._defaultOptions?.disableTooltipInteractivity&&this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`),this._dirSubscribed||(this._dirSubscribed=!0,this._dir.change.pipe(rt$1(this._destroyed)).subscribe(()=>{this._overlayRef&&this._updatePosition(this._overlayRef)})),this._overlayRef}_detach(){this._overlayRef&&this._overlayRef.hasAttached()&&this._overlayRef.detach(),this._tooltipInstance=null}_updatePosition(e){let t=e.getConfig().positionStrategy,i=this._getOrigin(),a=this._getOverlayPosition();t.withPositions([this._addOffset(g(g({},i.main),a.main)),this._addOffset(g(g({},i.fallback),a.fallback))])}_addOffset(e){let t=ji,i=!this._dir||this._dir.value==`ltr`;return e.originY===`top`?e.offsetY=-t:e.originY===`bottom`?e.offsetY=t:e.originX===`start`?e.offsetX=i?-t:t:e.originX===`end`&&(e.offsetX=i?t:-t),e}_getOrigin(){let e=!this._dir||this._dir.value==`ltr`,t=this.position,i;t==`above`||t==`below`?i={originX:`center`,originY:t==`above`?`top`:`bottom`}:t==`before`||t==`left`&&e||t==`right`&&!e?i={originX:`start`,originY:`center`}:(t==`after`||t==`right`&&e||t==`left`&&!e)&&(i={originX:`end`,originY:`center`});let{x:a,y:o}=this._invertPosition(i.originX,i.originY);return{main:i,fallback:{originX:a,originY:o}}}_getOverlayPosition(){let e=!this._dir||this._dir.value==`ltr`,t=this.position,i;t==`above`?i={overlayX:`center`,overlayY:`bottom`}:t==`below`?i={overlayX:`center`,overlayY:`top`}:t==`before`||t==`left`&&e||t==`right`&&!e?i={overlayX:`end`,overlayY:`center`}:(t==`after`||t==`right`&&e||t==`left`&&!e)&&(i={overlayX:`start`,overlayY:`center`});let{x:a,y:o}=this._invertPosition(i.overlayX,i.overlayY);return{main:i,fallback:{overlayX:a,overlayY:o}}}_updateTooltipMessage(){this._tooltipInstance&&(this._tooltipInstance.message=this.message,this._tooltipInstance._markForCheck(),qe(()=>{this._tooltipInstance&&this._overlayRef.updatePosition()},{injector:this._injector}))}_setTooltipClass(e){this._tooltipInstance&&(this._tooltipInstance.tooltipClass=e instanceof Set?Array.from(e):e,this._tooltipInstance._markForCheck())}_invertPosition(e,t){return this.position===`above`||this.position===`below`?t===`top`?t=`bottom`:t===`bottom`&&(t=`top`):e===`end`?e=`start`:e===`start`&&(e=`end`),{x:e,y:t}}_updateCurrentPositionClass(e){let{overlayY:t,originX:i,originY:a}=e,o;if(t===`center`?this._dir&&this._dir.value===`rtl`?o=i===`end`?`left`:`right`:o=i===`start`?`left`:`right`:o=t===`bottom`&&a===`top`?`above`:`below`,o!==this._currentPosition){let d=this._overlayRef;if(d){let s=`${this._cssClassPrefix}-${ai}-`;d.removePanelClass(s+this._currentPosition),d.addPanelClass(s+o)}this._currentPosition=o}}_setupPointerEnterEventsIfNeeded(){this._disabled||!this.message||!this._viewInitialized||this._eventCleanups.length||(this._isTouchPlatform()?this.touchGestures!==`off`&&(this._disableNativeGesturesIfNecessary(),this._addListener(`touchstart`,e=>{let t=e.targetTouches?.[0],i=t?{x:t.clientX,y:t.clientY}:void 0;this._setupPointerExitEventsIfNeeded(),this._touchstartTimeout&&clearTimeout(this._touchstartTimeout);let a=500;this._touchstartTimeout=setTimeout(()=>{this._touchstartTimeout=null,this.show(void 0,i)},this._defaultOptions?.touchLongPressShowDelay??a)})):this._addListener(`mouseenter`,e=>{this._setupPointerExitEventsIfNeeded();let t;e.x!==void 0&&e.y!==void 0&&(t=e),this.show(void 0,t)}))}_setupPointerExitEventsIfNeeded(){if(!this._pointerExitEventsInitialized){if(this._pointerExitEventsInitialized=!0,!this._isTouchPlatform())this._addListener(`mouseleave`,e=>{let t=e.relatedTarget;(!t||!this._overlayRef?.overlayElement.contains(t))&&this.hide()}),this._addListener(`wheel`,e=>{if(this._isTooltipVisible()){let t=this._document.elementFromPoint(e.clientX,e.clientY),i=this._elementRef.nativeElement;t!==i&&!i.contains(t)&&this.hide()}});else if(this.touchGestures!==`off`){this._disableNativeGesturesIfNecessary();let e=()=>{this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this.hide(this._defaultOptions?.touchendHideDelay)};this._addListener(`touchend`,e),this._addListener(`touchcancel`,e)}}}_addListener(e,t){this._eventCleanups.push(this._renderer.listen(this._elementRef.nativeElement,e,t,Vi))}_isTouchPlatform(){let e=this._defaultOptions?.detectHoverCapability;return typeof e==`function`?!e():this._platform.IOS||this._platform.ANDROID?!0:this._platform.isBrowser?!!e&&this._mediaMatcher.matchMedia(`(any-hover: none)`).matches:!1}_disableNativeGesturesIfNecessary(){let e=this.touchGestures;if(e!==`off`){let t=this._elementRef.nativeElement,i=t.style;(e===`on`||t.nodeName!==`INPUT`&&t.nodeName!==`TEXTAREA`)&&(i.userSelect=i.msUserSelect=i.webkitUserSelect=i.MozUserSelect=`none`),(e===`on`||!t.draggable)&&(i.webkitUserDrag=`none`),i.touchAction=`none`,i.webkitTapHighlightColor=`transparent`}}_syncAriaDescription(e){this._ariaDescriptionPending||(this._ariaDescriptionPending=!0,this._ariaDescriber.removeDescription(this._elementRef.nativeElement,e,`tooltip`),this._isDestroyed||qe({write:()=>{this._ariaDescriptionPending=!1,this.message&&!this.disabled&&this._ariaDescriber.describe(this._elementRef.nativeElement,this.message,`tooltip`)}},{injector:this._injector}))}_overlayEventPredicate=e=>e.type===`keydown`?this._isTooltipVisible()&&e.keyCode===27&&!Xn$1(e):!0;static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[``,`matTooltip`,``]],hostAttrs:[1,`mat-mdc-tooltip-trigger`],hostVars:2,hostBindings:function(t,i){t&2&&Fe(`mat-mdc-tooltip-disabled`,i.disabled)},inputs:{position:[0,`matTooltipPosition`,`position`],positionAtOrigin:[0,`matTooltipPositionAtOrigin`,`positionAtOrigin`],disabled:[0,`matTooltipDisabled`,`disabled`],showDelay:[0,`matTooltipShowDelay`,`showDelay`],hideDelay:[0,`matTooltipHideDelay`,`hideDelay`],touchGestures:[0,`matTooltipTouchGestures`,`touchGestures`],message:[0,`matTooltip`,`message`],tooltipClass:[0,`matTooltipClass`,`tooltipClass`]},exportAs:[`matTooltip`]})}return n})();var Gi=(()=>{class n{_changeDetectorRef=f(zn);_elementRef=f(Q);_isMultiline=!1;message;tooltipClass;_showTimeoutId;_hideTimeoutId;_triggerElement;_mouseLeaveHideDelay;_animationsDisabled=vt();_tooltip;_closeOnInteraction=!1;_isVisible=!1;_onHide=new w;_showAnimation=`mat-mdc-tooltip-show`;_hideAnimation=`mat-mdc-tooltip-hide`;show(e){this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=setTimeout(()=>{this._toggleVisibility(!0),this._showTimeoutId=void 0},e)}hide(e){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId=setTimeout(()=>{this._toggleVisibility(!1),this._hideTimeoutId=void 0},e)}afterHidden(){return this._onHide}isVisible(){return this._isVisible}ngOnDestroy(){this._cancelPendingAnimations(),this._onHide.complete(),this._triggerElement=null}_handleBodyInteraction(){this._closeOnInteraction&&this.hide(0)}_markForCheck(){this._changeDetectorRef.markForCheck()}_handleMouseLeave({relatedTarget:e}){(!e||!this._triggerElement.contains(e))&&(this.isVisible()?this.hide(this._mouseLeaveHideDelay):this._finalizeAnimation(!1))}_onShow(){this._isMultiline=this._isTooltipMultiline(),this._markForCheck()}_isTooltipMultiline(){let e=this._elementRef.nativeElement.getBoundingClientRect();return e.height>Ui&&e.width>=Wi}_handleAnimationEnd({animationName:e}){(e===this._showAnimation||e===this._hideAnimation)&&this._finalizeAnimation(e===this._showAnimation)}_cancelPendingAnimations(){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=this._hideTimeoutId=void 0}_finalizeAnimation(e){e?this._closeOnInteraction=!0:this.isVisible()||this._onHide.next()}_toggleVisibility(e){let t=this._tooltip.nativeElement,i=this._showAnimation,a=this._hideAnimation;if(t.classList.remove(e?a:i),t.classList.add(e?i:a),this._isVisible!==e&&(this._isVisible=e,this._changeDetectorRef.markForCheck()),e&&!this._animationsDisabled&&typeof getComputedStyle==`function`){let o=getComputedStyle(t);(o.getPropertyValue(`animation-duration`)===`0s`||o.getPropertyValue(`animation-name`)===`none`)&&(this._animationsDisabled=!0)}e&&this._onShow(),this._animationsDisabled&&(t.classList.add(`_mat-animation-noopable`),this._finalizeAnimation(e))}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[`tooltip`];return ae({type:n,selectors:[[`mat-tooltip-component`]],viewQuery:function(i,a){if(i&1&&jr(e,7),i&2){let o;Br(o=Vr())&&(a._tooltip=o.first)}},hostAttrs:[`aria-hidden`,`true`],hostBindings:function(i,a){i&1&&Fr(`mouseleave`,function(d){return a._handleMouseLeave(d)})},decls:4,vars:5,consts:[[`tooltip`,``],[1,`mdc-tooltip`,`mat-mdc-tooltip`,3,`animationend`],[1,`mat-mdc-tooltip-surface`,`mdc-tooltip__surface`]],template:function(i,a){i&1&&(fn(0,`div`,1,0),Yy(`animationend`,function(d){return a._handleAnimationEnd(d)}),fn(2,`div`,2),mn(3),pn()()),i&2&&(xp(a.tooltipClass),Fe(`mdc-tooltip--multiline`,a._isMultiline),Ce(3),gs(a.message))},styles:[`.mat-mdc-tooltip {
  position: relative;
  transform: scale(0);
  display: inline-flex;
}
.mat-mdc-tooltip::before {
  content: "";
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  position: absolute;
}
.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before {
  top: -8px;
}
.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before {
  bottom: -8px;
}
.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before {
  left: -8px;
}
.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before {
  right: -8px;
}
.mat-mdc-tooltip._mat-animation-noopable {
  animation: none;
  transform: scale(1);
}

.mat-mdc-tooltip-surface {
  word-break: normal;
  overflow-wrap: anywhere;
  padding: 4px 8px;
  min-width: 40px;
  max-width: 200px;
  min-height: 24px;
  max-height: 40vh;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  will-change: transform, opacity;
  background-color: var(--%NS%mat-tooltip-container-color, var(--%NS%mat-sys-inverse-surface));
  color: var(--%NS%mat-tooltip-supporting-text-color, var(--%NS%mat-sys-inverse-on-surface));
  border-radius: var(--%NS%mat-tooltip-container-shape, var(--%NS%mat-sys-corner-extra-small));
  font-family: var(--%NS%mat-tooltip-supporting-text-font, var(--%NS%mat-sys-body-small-font));
  font-size: var(--%NS%mat-tooltip-supporting-text-size, var(--%NS%mat-sys-body-small-size));
  font-weight: var(--%NS%mat-tooltip-supporting-text-weight, var(--%NS%mat-sys-body-small-weight));
  line-height: var(--%NS%mat-tooltip-supporting-text-line-height, var(--%NS%mat-sys-body-small-line-height));
  letter-spacing: var(--%NS%mat-tooltip-supporting-text-tracking, var(--%NS%mat-sys-body-small-tracking));
}
.mat-mdc-tooltip-surface::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}
.mdc-tooltip--multiline .mat-mdc-tooltip-surface {
  text-align: left;
}
[dir=rtl] .mdc-tooltip--multiline .mat-mdc-tooltip-surface {
  text-align: right;
}

.mat-mdc-tooltip-panel {
  line-height: normal;
}
.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive {
  pointer-events: none;
}

@keyframes mat-mdc-tooltip-show {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes mat-mdc-tooltip-hide {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
.mat-mdc-tooltip-show {
  animation: mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards;
}

.mat-mdc-tooltip-hide {
  animation: mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards;
}
`],encapsulation:2})})()}return n})();var ri=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ce({type:n});static ɵinj=ie({imports:[pw,bu,wn,Qh]})}return n})();var Ki=(()=>{class n{changes=new w;itemsPerPageLabel=`Items per page:`;nextPageLabel=`Next page`;previousPageLabel=`Previous page`;firstPageLabel=`First page`;lastPageLabel=`Last page`;getRangeLabel=(e,t,i)=>{if(i==0||t==0)return`0 of ${i}`;i=Math.max(i,0);let a=e*t,o=a<i?Math.min(a+t,i):a+t;return`${a+1} \u2013 ${o} of ${i}`};static ɵfac=function(t){return new(t||n)};static ɵprov=D({token:n,factory:n.ɵfac})}return n})();var Yi=50;var $i=new b(`MAT_PAGINATOR_DEFAULT_OPTIONS`);var wt=(()=>{class n{_intl=f(Ki);_changeDetectorRef=f(zn);_formFieldAppearance;_pageSizeLabelId=f(bt$1).getId(`mat-paginator-page-size-label-`);_intlChanges;_isInitialized=!1;_initializedStream=new Nn(1);color;get pageIndex(){return this._pageIndex}set pageIndex(e){this._pageIndex=Math.max(e||0,0),this._changeDetectorRef.markForCheck()}_pageIndex=0;get length(){return this._length}set length(e){this._length=e||0,this._changeDetectorRef.markForCheck()}_length=0;get pageSize(){return this._pageSize}set pageSize(e){this._pageSize=Math.max(e||0,0),this._updateDisplayedPageSizeOptions()}_pageSize;get pageSizeOptions(){return this._pageSizeOptions}set pageSizeOptions(e){this._pageSizeOptions=(e||[]).map(t=>D_(t,0)),this._updateDisplayedPageSizeOptions()}_pageSizeOptions=[];hidePageSize=!1;showFirstLastButtons=!1;selectConfig={};disabled=!1;page=new q;_displayedPageSizeOptions;initialized=this._initializedStream;constructor(){let e=this._intl,t=f($i,{optional:!0});if(this._intlChanges=e.changes.subscribe(()=>this._changeDetectorRef.markForCheck()),t){let{pageSize:i,pageSizeOptions:a,hidePageSize:o,showFirstLastButtons:d}=t;i!=null&&(this._pageSize=i),a!=null&&(this._pageSizeOptions=a),o!=null&&(this.hidePageSize=o),d!=null&&(this.showFirstLastButtons=d)}this._formFieldAppearance=t?.formFieldAppearance||`outline`}ngOnInit(){this._isInitialized=!0,this._updateDisplayedPageSizeOptions(),this._initializedStream.next()}ngOnDestroy(){this._initializedStream.complete(),this._intlChanges.unsubscribe()}nextPage(){this.hasNextPage()&&this._navigate(this.pageIndex+1)}previousPage(){this.hasPreviousPage()&&this._navigate(this.pageIndex-1)}firstPage(){this.hasPreviousPage()&&this._navigate(0)}lastPage(){this.hasNextPage()&&this._navigate(this.getNumberOfPages()-1)}hasPreviousPage(){return this.pageIndex>=1&&this.pageSize!=0}hasNextPage(){let e=this.getNumberOfPages()-1;return this.pageIndex<e&&this.pageSize!=0}getNumberOfPages(){return this.pageSize?Math.ceil(this.length/this.pageSize):0}_changePageSize(e){let t=this.pageIndex*this.pageSize,i=this.pageIndex;this.pageIndex=Math.floor(t/e)||0,this.pageSize=e,this._emitPageEvent(i)}_nextButtonsDisabled(){return this.disabled||!this.hasNextPage()}_previousButtonsDisabled(){return this.disabled||!this.hasPreviousPage()}_updateDisplayedPageSizeOptions(){this._isInitialized&&(this.pageSize||(this._pageSize=this.pageSizeOptions.length!=0?this.pageSizeOptions[0]:Yi),this._displayedPageSizeOptions=this.pageSizeOptions.slice(),this._displayedPageSizeOptions.indexOf(this.pageSize)===-1&&this._displayedPageSizeOptions.push(this.pageSize),this._displayedPageSizeOptions.sort((e,t)=>e-t),this._changeDetectorRef.markForCheck())}_emitPageEvent(e){this.page.emit({previousPageIndex:e,pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.length})}_navigate(e){let t=this.pageIndex;e!==t&&(this.pageIndex=e,this._emitPageEvent(t))}_buttonClicked(e,t){t||this._navigate(e)}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){function e(s,p){if(s&1&&(Ve(0,`mat-option`,17),mn(1),Ue()),s&2){let r=p.$implicit;ps(`value`,r),Ce(),gn(` `,r,` `)}}function t(s,p){if(s&1){let r=Sp();Ve(0,`mat-form-field`,14)(1,`mat-select`,16,0),Fr(`selectionChange`,function(_){dc(r);let m=ol(2);return fc(m._changePageSize(_.value))}),w0(3,e,2,2,`mat-option`,17,D0),Ue(),Ve(5,`div`,18),Fr(`click`,function(){dc(r);let _=O0(2);return fc(_.open())}),Ue()()}if(s&2){let r=ol(2);ps(`appearance`,r._formFieldAppearance)(`color`,r.color),Ce(),ps(`value`,r.pageSize)(`disabled`,r.disabled),zy(`aria-labelledby`,r._pageSizeLabelId),ps(`panelClass`,r.selectConfig.panelClass||``)(`disableOptionCentering`,r.selectConfig.disableOptionCentering),Ce(2),E0(r._displayedPageSizeOptions)}}function i(s,p){if(s&1&&(Ve(0,`div`,15),mn(1),Ue()),s&2){let r=ol(2);Ce(),gs(r.pageSize)}}function a(s,p){if(s&1&&(Ve(0,`div`,3)(1,`div`,13),mn(2),Ue(),Pr(3,t,6,7,`mat-form-field`,14),Pr(4,i,2,1,`div`,15),Ue()),s&2){let r=ol();Ce(),ft$1(`id`,r._pageSizeLabelId),Ce(),gn(` `,r._intl.itemsPerPageLabel,` `),Ce(),Lr(r._displayedPageSizeOptions.length>1?3:-1),Ce(),Lr(r._displayedPageSizeOptions.length<=1?4:-1)}}function o(s,p){if(s&1){let r=Sp();Ve(0,`button`,19),Fr(`click`,function(){dc(r);let _=ol();return fc(_._buttonClicked(0,_._previousButtonsDisabled()))}),nb(),Ve(1,`svg`,8),Ho(2,`path`,20),Ue()()}if(s&2){let r=ol();ps(`matTooltip`,r._intl.firstPageLabel)(`matTooltipDisabled`,r._previousButtonsDisabled())(`disabled`,r._previousButtonsDisabled())(`tabindex`,r._previousButtonsDisabled()?-1:null),ft$1(`aria-label`,r._intl.firstPageLabel)}}function d(s,p){if(s&1){let r=Sp();Ve(0,`button`,21),Fr(`click`,function(){dc(r);let _=ol();return fc(_._buttonClicked(_.getNumberOfPages()-1,_._nextButtonsDisabled()))}),nb(),Ve(1,`svg`,8),Ho(2,`path`,22),Ue()()}if(s&2){let r=ol();ps(`matTooltip`,r._intl.lastPageLabel)(`matTooltipDisabled`,r._nextButtonsDisabled())(`disabled`,r._nextButtonsDisabled())(`tabindex`,r._nextButtonsDisabled()?-1:null),ft$1(`aria-label`,r._intl.lastPageLabel)}}return ae({type:n,selectors:[[`mat-paginator`]],hostAttrs:[`role`,`group`,1,`mat-mdc-paginator`],inputs:{color:`color`,pageIndex:[2,`pageIndex`,`pageIndex`,D_],length:[2,`length`,`length`,D_],pageSize:[2,`pageSize`,`pageSize`,D_],pageSizeOptions:`pageSizeOptions`,hidePageSize:[2,`hidePageSize`,`hidePageSize`,Ae$1],showFirstLastButtons:[2,`showFirstLastButtons`,`showFirstLastButtons`,Ae$1],selectConfig:`selectConfig`,disabled:[2,`disabled`,`disabled`,Ae$1]},outputs:{page:`page`},exportAs:[`matPaginator`],decls:14,vars:14,consts:[[`selectRef`,``],[1,`mat-mdc-paginator-outer-container`],[1,`mat-mdc-paginator-container`],[1,`mat-mdc-paginator-page-size`],[1,`mat-mdc-paginator-range-actions`],[`aria-atomic`,`true`,`aria-live`,`polite`,`role`,`status`,1,`mat-mdc-paginator-range-label`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-first`,3,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-previous`,3,`click`,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`viewBox`,`0 0 24 24`,`focusable`,`false`,`aria-hidden`,`true`,1,`mat-mdc-paginator-icon`],[`d`,`M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-next`,3,`click`,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`d`,`M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-last`,3,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`aria-hidden`,`true`,1,`mat-mdc-paginator-page-size-label`],[1,`mat-mdc-paginator-page-size-select`,3,`appearance`,`color`],[1,`mat-mdc-paginator-page-size-value`],[`hideSingleSelectionIndicator`,``,3,`selectionChange`,`value`,`disabled`,`aria-labelledby`,`panelClass`,`disableOptionCentering`],[3,`value`],[1,`mat-mdc-paginator-touch-target`,3,`click`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-first`,3,`click`,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`d`,`M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-last`,3,`click`,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`d`,`M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z`]],template:function(p,r){p&1&&(Ve(0,`div`,1)(1,`div`,2),Pr(2,a,5,4,`div`,3),Ve(3,`div`,4)(4,`div`,5),mn(5),Ue(),Pr(6,o,3,5,`button`,6),Ve(7,`button`,7),Fr(`click`,function(){return r._buttonClicked(r.pageIndex-1,r._previousButtonsDisabled())}),nb(),Ve(8,`svg`,8),Ho(9,`path`,9),Ue()(),rb(),Ve(10,`button`,10),Fr(`click`,function(){return r._buttonClicked(r.pageIndex+1,r._nextButtonsDisabled())}),nb(),Ve(11,`svg`,8),Ho(12,`path`,11),Ue()(),Pr(13,d,3,5,`button`,12),Ue()()()),p&2&&(Ce(2),Lr(r.hidePageSize?-1:2),Ce(3),gn(` `,r._intl.getRangeLabel(r.pageIndex,r.pageSize,r.length),` `),Ce(),Lr(r.showFirstLastButtons?6:-1),Ce(),ps(`matTooltip`,r._intl.previousPageLabel)(`matTooltipDisabled`,r._previousButtonsDisabled())(`disabled`,r._previousButtonsDisabled())(`tabindex`,r._previousButtonsDisabled()?-1:null),ft$1(`aria-label`,r._intl.previousPageLabel),Ce(3),ps(`matTooltip`,r._intl.nextPageLabel)(`matTooltipDisabled`,r._nextButtonsDisabled())(`disabled`,r._nextButtonsDisabled())(`tabindex`,r._nextButtonsDisabled()?-1:null),ft$1(`aria-label`,r._intl.nextPageLabel),Ce(3),Lr(r.showFirstLastButtons?13:-1))},dependencies:[$n$1,ni,Se,nR,oi],styles:[`.mat-mdc-paginator {
  display: block;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--%NS%mat-paginator-container-text-color, var(--%NS%mat-sys-on-surface));
  background-color: var(--%NS%mat-paginator-container-background-color, var(--%NS%mat-sys-surface));
  font-family: var(--%NS%mat-paginator-container-text-font, var(--%NS%mat-sys-body-small-font));
  line-height: var(--%NS%mat-paginator-container-text-line-height, var(--%NS%mat-sys-body-small-line-height));
  font-size: var(--%NS%mat-paginator-container-text-size, var(--%NS%mat-sys-body-small-size));
  font-weight: var(--%NS%mat-paginator-container-text-weight, var(--%NS%mat-sys-body-small-weight));
  letter-spacing: var(--%NS%mat-paginator-container-text-tracking, var(--%NS%mat-sys-body-small-tracking));
  --%NS%mat-form-field-container-height: var(--%NS%mat-paginator-form-field-container-height, 40px);
  --%NS%mat-form-field-container-vertical-padding: var(--%NS%mat-paginator-form-field-container-vertical-padding, 8px);
}
.mat-mdc-paginator .mat-mdc-select-value {
  font-size: var(--%NS%mat-paginator-select-trigger-text-size, var(--%NS%mat-sys-body-small-size));
}
.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper {
  display: none;
}
.mat-mdc-paginator .mat-mdc-select {
  line-height: 1.5;
}

.mat-mdc-paginator-outer-container {
  display: flex;
}

.mat-mdc-paginator-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
  flex-wrap: wrap;
  width: 100%;
  min-height: var(--%NS%mat-paginator-container-size, 56px);
}

.mat-mdc-paginator-page-size {
  display: flex;
  align-items: baseline;
  margin-right: 8px;
}
[dir=rtl] .mat-mdc-paginator-page-size {
  margin-right: 0;
  margin-left: 8px;
}

.mat-mdc-paginator-page-size-label {
  margin: 0 4px;
}

.mat-mdc-paginator-page-size-select {
  margin: 0 4px;
  width: var(--%NS%mat-paginator-page-size-select-width, 84px);
}

.mat-mdc-paginator-range-label {
  margin: 0 32px 0 24px;
}

.mat-mdc-paginator-range-actions {
  display: flex;
  align-items: center;
}

.mat-mdc-paginator-icon {
  display: inline-block;
  width: 28px;
  fill: var(--%NS%mat-paginator-enabled-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon {
  fill: var(--%NS%mat-paginator-disabled-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
[dir=rtl] .mat-mdc-paginator-icon {
  transform: rotate(180deg);
}

@media (forced-colors: active) {
  .mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon,
  .mat-mdc-paginator-icon {
    fill: currentColor;
  }
  .mat-mdc-paginator-range-actions .mat-mdc-icon-button {
    outline: solid 1px;
  }
  .mat-mdc-paginator-range-actions .mat-mdc-icon-button[aria-disabled] {
    color: GrayText;
  }
}
.mat-mdc-paginator-touch-target {
  display: var(--%NS%mat-paginator-touch-target-display, block);
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--%NS%mat-paginator-page-size-select-width, 84px);
  height: var(--%NS%mat-paginator-page-size-select-touch-target-height, 48px);
  background-color: transparent;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
`],encapsulation:2})})()}return n})();var si=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ce({type:n});static ɵinj=ie({imports:[sR,ii,ri,wt]})}return n})();var te=new b(`CDK_TABLE`);var at=(()=>{class n{template=f(Ge);static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[``,`cdkCellDef`,``]]})}return n})();var ot=(()=>{class n{template=f(Ge);static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[``,`cdkHeaderCellDef`,``]]})}return n})();var mi=(()=>{class n{template=f(Ge);static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[``,`cdkFooterCellDef`,``]]})}return n})();var ge=(()=>{class n{_table=f(te,{optional:!0});_hasStickyChanged=!1;get name(){return this._name}set name(e){this._setNameInput(e)}_name;get sticky(){return this._sticky}set sticky(e){e!==this._sticky&&(this._sticky=e,this._hasStickyChanged=!0)}_sticky=!1;get stickyEnd(){return this._stickyEnd}set stickyEnd(e){e!==this._stickyEnd&&(this._stickyEnd=e,this._hasStickyChanged=!0)}_stickyEnd=!1;cell;headerCell;footerCell;cssClassFriendlyName;_columnCssClassName;hasStickyChanged(){let e=this._hasStickyChanged;return this.resetStickyChanged(),e}resetStickyChanged(){this._hasStickyChanged=!1}_updateColumnCssClassName(){this._columnCssClassName=[`cdk-column-${this.cssClassFriendlyName}`]}_setNameInput(e){e&&(this._name=e,this.cssClassFriendlyName=e.replace(/[^a-z0-9_-]/gi,`-`),this._updateColumnCssClassName())}static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[``,`cdkColumnDef`,``]],contentQueries:function(t,i,a){if(t&1&&Zy(a,at,5)(a,ot,5)(a,mi,5),t&2){let o;Br(o=Vr())&&(i.cell=o.first),Br(o=Vr())&&(i.headerCell=o.first),Br(o=Vr())&&(i.footerCell=o.first)}},inputs:{name:[0,`cdkColumnDef`,`name`],sticky:[2,`sticky`,`sticky`,Ae$1],stickyEnd:[2,`stickyEnd`,`stickyEnd`,Ae$1]}})}return n})();var it=class{constructor(l,e){e.nativeElement.classList.add(...l._columnCssClassName)}};var pi=(()=>{class n extends it{constructor(){super(f(ge),f(Q))}static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[`cdk-header-cell`],[`th`,`cdk-header-cell`,``]],hostAttrs:[`role`,`columnheader`,1,`cdk-header-cell`],features:[Me]})}return n})();var hi=(()=>{class n extends it{constructor(){let e=f(ge),t=f(Q);super(e,t);let i=e._table?._getCellRole();i&&t.nativeElement.setAttribute(`role`,i)}static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[`cdk-cell`],[`td`,`cdk-cell`,``]],hostAttrs:[1,`cdk-cell`],features:[Me]})}return n})();var xt=(()=>{class n{template=f(Ge);_differs=f(Vp);columns;_columnsDiffer;ngOnChanges(e){if(!this._columnsDiffer){let t=e.columns&&e.columns.currentValue||[];this._columnsDiffer=this._differs.find(t).create(),this._columnsDiffer.diff(t)}}getColumnsDiff(){return this._columnsDiffer.diff(this.columns)}extractCellTemplate(e){return this instanceof Ae?e.headerCell.template:this instanceof kt?e.footerCell.template:e.cell.template}static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,features:[Nt$1]})}return n})();var Ae=(()=>{class n extends xt{_table=f(te,{optional:!0});_hasStickyChanged=!1;get sticky(){return this._sticky}set sticky(e){e!==this._sticky&&(this._sticky=e,this._hasStickyChanged=!0)}_sticky=!1;ngOnChanges(e){super.ngOnChanges(e)}hasStickyChanged(){let e=this._hasStickyChanged;return this.resetStickyChanged(),e}resetStickyChanged(){this._hasStickyChanged=!1}static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵdir=J({type:n,selectors:[[``,`cdkHeaderRowDef`,``]],inputs:{columns:[0,`cdkHeaderRowDef`,`columns`],sticky:[2,`cdkHeaderRowDefSticky`,`sticky`,Ae$1]},features:[Me,Nt$1]})}return n})();var kt=(()=>{class n extends xt{_table=f(te,{optional:!0});_hasStickyChanged=!1;get sticky(){return this._sticky}set sticky(e){e!==this._sticky&&(this._sticky=e,this._hasStickyChanged=!0)}_sticky=!1;ngOnChanges(e){super.ngOnChanges(e)}hasStickyChanged(){let e=this._hasStickyChanged;return this.resetStickyChanged(),e}resetStickyChanged(){this._hasStickyChanged=!1}static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵdir=J({type:n,selectors:[[``,`cdkFooterRowDef`,``]],inputs:{columns:[0,`cdkFooterRowDef`,`columns`],sticky:[2,`cdkFooterRowDefSticky`,`sticky`,Ae$1]},features:[Me,Nt$1]})}return n})();var rt=(()=>{class n extends xt{_table=f(te,{optional:!0});when;static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵdir=J({type:n,selectors:[[``,`cdkRowDef`,``]],inputs:{columns:[0,`cdkRowDefColumns`,`columns`],when:[0,`cdkRowDefWhen`,`when`]},features:[Me]})}return n})();var we=(()=>{class n{_viewContainer=f(et);cells;context;static mostRecentCellOutlet=null;constructor(){n.mostRecentCellOutlet=this}ngOnDestroy(){n.mostRecentCellOutlet===this&&(n.mostRecentCellOutlet=null)}static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[``,`cdkCellOutlet`,``]]})}return n})();var Dt=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵcmp=ae({type:n,selectors:[[`cdk-header-row`],[`tr`,`cdk-header-row`,``]],hostAttrs:[`role`,`row`,1,`cdk-header-row`],decls:1,vars:0,consts:[[`cdkCellOutlet`,``]],template:function(t,i){t&1&&Gy(0,0)},dependencies:[we],encapsulation:2,changeDetection:1})}return n})();var St=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵcmp=ae({type:n,selectors:[[`cdk-row`],[`tr`,`cdk-row`,``]],hostAttrs:[`role`,`row`,1,`cdk-row`],decls:1,vars:0,consts:[[`cdkCellOutlet`,``]],template:function(t,i){t&1&&Gy(0,0)},dependencies:[we],encapsulation:2,changeDetection:1})}return n})();var ui=(()=>{class n{templateRef=f(Ge);_contentClassNames=[`cdk-no-data-row`,`cdk-row`];_cellClassNames=[`cdk-cell`,`cdk-no-data-cell`];_cellSelector=`td, cdk-cell, [cdk-cell], .cdk-cell`;static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[`ng-template`,`cdkNoDataRow`,``]]})}return n})();var li=[`top`,`bottom`,`left`,`right`];var Ct=class{_isNativeHtmlTable;_stickCellCss;_isBrowser;_needsPositionStickyOnElement;direction;_positionListener;_tableInjector;_elemSizeCache=new WeakMap;_resizeObserver=globalThis?.ResizeObserver?new globalThis.ResizeObserver(l=>this._updateCachedSizes(l)):null;_updatedStickyColumnsParamsToReplay=[];_stickyColumnsReplayTimeout=null;_cachedCellWidths=[];_borderCellCss;_destroyed=!1;constructor(l,e,t=!0,i=!0,a,o,d){this._isNativeHtmlTable=l,this._stickCellCss=e,this._isBrowser=t,this._needsPositionStickyOnElement=i,this.direction=a,this._positionListener=o,this._tableInjector=d,this._borderCellCss={top:`${e}-border-elem-top`,bottom:`${e}-border-elem-bottom`,left:`${e}-border-elem-left`,right:`${e}-border-elem-right`}}clearStickyPositioning(l,e){(e.includes(`left`)||e.includes(`right`))&&this._removeFromStickyColumnReplayQueue(l);let t=[];for(let i of l)i.nodeType===i.ELEMENT_NODE&&t.push(i,...Array.from(i.children));qe({write:()=>{for(let i of t)this._removeStickyStyle(i,e)}},{injector:this._tableInjector})}updateStickyColumns(l,e,t,i=!0,a=!0){if(!l.length||!this._isBrowser||!(e.some(K=>K)||t.some(K=>K))){this._positionListener?.stickyColumnsUpdated({sizes:[]}),this._positionListener?.stickyEndColumnsUpdated({sizes:[]});return}let o=l[0],d=o.children.length,s=this.direction===`rtl`,p=s?`right`:`left`,r=s?`left`:`right`,u=e.lastIndexOf(!0),_=t.indexOf(!0),m,D,V;a&&this._updateStickyColumnReplayQueue({rows:[...l],stickyStartStates:[...e],stickyEndStates:[...t]}),qe({earlyRead:()=>{m=this._getCellWidths(o,i),D=this._getStickyStartColumnPositions(m,e),V=this._getStickyEndColumnPositions(m,t)},write:()=>{for(let K of l)for(let Y=0;Y<d;Y++){let Et=K.children[Y];e[Y]&&this._addStickyStyle(Et,p,D[Y],Y===u),t[Y]&&this._addStickyStyle(Et,r,V[Y],Y===_)}this._positionListener&&m.some(K=>!!K)&&(this._positionListener.stickyColumnsUpdated({sizes:u===-1?[]:m.slice(0,u+1).map((K,Y)=>e[Y]?K:null)}),this._positionListener.stickyEndColumnsUpdated({sizes:_===-1?[]:m.slice(_).map((K,Y)=>t[Y+_]?K:null).reverse()}))}},{injector:this._tableInjector})}stickRows(l,e,t){if(!this._isBrowser)return;let i=t===`bottom`?l.slice().reverse():l,a=t===`bottom`?e.slice().reverse():e,o=[],d=[],s=[];qe({earlyRead:()=>{for(let p=0,r=0;p<i.length;p++){if(!a[p])continue;o[p]=r;let u=i[p];s[p]=this._isNativeHtmlTable?Array.from(u.children):[u];let _=this._retrieveElementSize(u).height;r+=_,d[p]=_}},write:()=>{let p=a.lastIndexOf(!0);for(let r=0;r<i.length;r++){if(!a[r])continue;let u=o[r],_=r===p;for(let m of s[r])this._addStickyStyle(m,t,u,_)}t===`top`?this._positionListener?.stickyHeaderRowsUpdated({sizes:d,offsets:o,elements:s}):this._positionListener?.stickyFooterRowsUpdated({sizes:d,offsets:o,elements:s})}},{injector:this._tableInjector})}updateStickyFooterContainer(l,e){this._isNativeHtmlTable&&qe({write:()=>{let t=l.querySelector(`tfoot`);t&&(e.some(i=>!i)?this._removeStickyStyle(t,[`bottom`]):this._addStickyStyle(t,`bottom`,0,!1))}},{injector:this._tableInjector})}destroy(){this._stickyColumnsReplayTimeout&&clearTimeout(this._stickyColumnsReplayTimeout),this._resizeObserver?.disconnect(),this._destroyed=!0}_removeStickyStyle(l,e){if(!l.classList.contains(this._stickCellCss))return;for(let i of e)l.style[i]=``,l.classList.remove(this._borderCellCss[i]);li.some(i=>e.indexOf(i)===-1&&l.style[i])?l.style.zIndex=this._getCalculatedZIndex(l):(l.style.zIndex=``,this._needsPositionStickyOnElement&&(l.style.position=``),l.classList.remove(this._stickCellCss))}_addStickyStyle(l,e,t,i){l.classList.add(this._stickCellCss),i&&l.classList.add(this._borderCellCss[e]),l.style[e]=`${t}px`,l.style.zIndex=this._getCalculatedZIndex(l),this._needsPositionStickyOnElement&&(l.style.cssText+=`position: -webkit-sticky; position: sticky; `)}_getCalculatedZIndex(l){let e={top:100,bottom:10,left:1,right:1},t=0;for(let i of li)l.style[i]&&(t+=e[i]);return t?`${t}`:``}_getCellWidths(l,e=!0){if(!e&&this._cachedCellWidths.length)return this._cachedCellWidths;let t=[],i=l.children;for(let a=0;a<i.length;a++){let o=i[a];t.push(this._retrieveElementSize(o).width)}return this._cachedCellWidths=t,t}_getStickyStartColumnPositions(l,e){let t=[],i=0;for(let a=0;a<l.length;a++)e[a]&&(t[a]=i,i+=l[a]);return t}_getStickyEndColumnPositions(l,e){let t=[],i=0;for(let a=l.length;a>0;a--)e[a]&&(t[a]=i,i+=l[a]);return t}_retrieveElementSize(l){let e=this._elemSizeCache.get(l);if(e)return e;let t=l.getBoundingClientRect(),i={width:t.width,height:t.height};return this._resizeObserver&&(this._elemSizeCache.set(l,i),this._resizeObserver.observe(l,{box:`border-box`})),i}_updateStickyColumnReplayQueue(l){this._removeFromStickyColumnReplayQueue(l.rows),this._stickyColumnsReplayTimeout||this._updatedStickyColumnsParamsToReplay.push(l)}_removeFromStickyColumnReplayQueue(l){let e=new Set(l);for(let t of this._updatedStickyColumnsParamsToReplay)t.rows=t.rows.filter(i=>!e.has(i));this._updatedStickyColumnsParamsToReplay=this._updatedStickyColumnsParamsToReplay.filter(t=>!!t.rows.length)}_updateCachedSizes(l){let e=!1;for(let t of l){let i=t.borderBoxSize?.length?{width:t.borderBoxSize[0].inlineSize,height:t.borderBoxSize[0].blockSize}:{width:t.contentRect.width,height:t.contentRect.height};i.width!==this._elemSizeCache.get(t.target)?.width&&Xi(t.target)&&(e=!0),this._elemSizeCache.set(t.target,i)}e&&this._updatedStickyColumnsParamsToReplay.length&&(this._stickyColumnsReplayTimeout&&clearTimeout(this._stickyColumnsReplayTimeout),this._stickyColumnsReplayTimeout=setTimeout(()=>{if(!this._destroyed){for(let t of this._updatedStickyColumnsParamsToReplay)this.updateStickyColumns(t.rows,t.stickyStartStates,t.stickyEndStates,!0,!1);this._updatedStickyColumnsParamsToReplay=[],this._stickyColumnsReplayTimeout=null}},0))}};function Xi(n){return[`cdk-cell`,`cdk-header-cell`,`cdk-footer-cell`].some(l=>n.classList.contains(l))}function ci(n){return Error(`Could not find column with id "${n}".`)}var Pe=new b(`STICKY_POSITIONING_LISTENER`);var Mt=(()=>{class n{viewContainer=f(et);elementRef=f(Q);constructor(){let e=f(te);e._rowOutlet=this,e._outletAssigned()}static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[``,`rowOutlet`,``]]})}return n})();var Rt=(()=>{class n{viewContainer=f(et);elementRef=f(Q);constructor(){let e=f(te);e._headerRowOutlet=this,e._outletAssigned()}static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[``,`headerRowOutlet`,``]]})}return n})();var Ot=(()=>{class n{viewContainer=f(et);elementRef=f(Q);constructor(){let e=f(te);e._footerRowOutlet=this,e._outletAssigned()}static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[``,`footerRowOutlet`,``]]})}return n})();var Tt=(()=>{class n{viewContainer=f(et);elementRef=f(Q);constructor(){let e=f(te);e._noDataRowOutlet=this,e._outletAssigned()}static ɵfac=function(t){return new(t||n)};static ɵdir=J({type:n,selectors:[[``,`noDataRowOutlet`,``]]})}return n})();var It=(()=>{class n{_differs=f(Vp);_changeDetectorRef=f(zn);_elementRef=f(Q);_dir=f(Dn,{optional:!0});_platform=f(re);_viewRepeater;_viewportRuler=f(si$1);_injector=f(A);_virtualScrollViewport=f(S9,{optional:!0,host:!0});_positionListener=f(Pe,{optional:!0})||f(Pe,{optional:!0,skipSelf:!0});_document=f(T);_data;_renderedRange;_onDestroy=new w;_renderRows;_renderChangeSubscription=null;_columnDefsByName=new Map;_rowDefs;_headerRowDefs;_footerRowDefs;_dataDiffer;_defaultRowDef=null;_customColumnDefs=new Set;_customRowDefs=new Set;_customHeaderRowDefs=new Set;_customFooterRowDefs=new Set;_customNoDataRow=null;_headerRowDefChanged=!0;_footerRowDefChanged=!0;_stickyColumnStylesNeedReset=!0;_forceRecalculateCellWidths=!0;_cachedRenderRowsMap=new Map;_rowDefsByView=new WeakMap;_isNativeHtmlTable;_stickyStyler;stickyCssClass=`cdk-table-sticky`;needsPositionStickyOnElement=!0;_isServer;_isShowingNoDataRow=!1;_hasAllOutlets=!1;_hasInitialized=!1;_headerRowStickyUpdates=new w;_footerRowStickyUpdates=new w;_disableVirtualScrolling=!1;_getCellRole(){if(this._cellRoleInternal===void 0){let e=this._elementRef.nativeElement.getAttribute(`role`);return e===`grid`||e===`treegrid`?`gridcell`:`cell`}return this._cellRoleInternal}_cellRoleInternal=void 0;get trackBy(){return this._trackByFn}set trackBy(e){this._trackByFn=e}_trackByFn;get dataSource(){return this._dataSource}set dataSource(e){this._dataSource!==e&&(this._switchDataSource(e),this._changeDetectorRef.markForCheck())}_dataSource;_dataSourceChanges=new w;_dataStream=new w;get multiTemplateDataRows(){return this._multiTemplateDataRows}set multiTemplateDataRows(e){this._multiTemplateDataRows=e,this._rowOutlet&&this._rowOutlet.viewContainer.length&&(this._forceRenderDataRows(),this.updateStickyColumnStyles())}_multiTemplateDataRows=!1;get fixedLayout(){return this._virtualScrollEnabled()?!0:this._fixedLayout}set fixedLayout(e){this._fixedLayout=e,this._forceRecalculateCellWidths=!0,this._stickyColumnStylesNeedReset=!0}_fixedLayout=!1;recycleRows=!1;contentChanged=new q;viewChange=new be({start:0,end:Number.MAX_VALUE});_rowOutlet;_headerRowOutlet;_footerRowOutlet;_noDataRowOutlet;_contentColumnDefs;_contentRowDefs;_contentHeaderRowDefs;_contentFooterRowDefs;_noDataRow;get renderedRows(){return this._renderRows}constructor(){f(new Rp(`role`),{optional:!0})||this._elementRef.nativeElement.setAttribute(`role`,`table`),this._isServer=!this._platform.isBrowser,this._isNativeHtmlTable=this._elementRef.nativeElement.nodeName===`TABLE`,this._dataDiffer=this._differs.find([]).create((t,i)=>this.trackBy?this.trackBy(i.dataIndex,i.data):i)}ngOnInit(){this._setupStickyStyler(),this._viewportRuler.change().pipe(rt$1(this._onDestroy)).subscribe(()=>{this._forceRecalculateCellWidths=!0})}ngAfterContentInit(){this._viewRepeater=this.recycleRows||this._virtualScrollEnabled()?new Rw:new Qn,this._virtualScrollEnabled()&&this._setupVirtualScrolling(this._virtualScrollViewport),this._hasInitialized=!0}ngAfterContentChecked(){this._canRender()&&this._render()}ngOnDestroy(){this._stickyStyler?.destroy(),[this._rowOutlet?.viewContainer,this._headerRowOutlet?.viewContainer,this._footerRowOutlet?.viewContainer,this._cachedRenderRowsMap,this._customColumnDefs,this._customRowDefs,this._customHeaderRowDefs,this._customFooterRowDefs,this._columnDefsByName].forEach(e=>{e?.clear()}),this._headerRowDefs=[],this._footerRowDefs=[],this._defaultRowDef=null,this._headerRowStickyUpdates.complete(),this._footerRowStickyUpdates.complete(),this._onDestroy.next(),this._onDestroy.complete(),s9(this.dataSource)&&this.dataSource.disconnect(this)}renderRows(){this._renderRows=this._getAllRenderRows();let e=this._dataDiffer.diff(this._renderRows);if(!e){this._updateNoDataRow(),this.contentChanged.next();return}let t=this._rowOutlet.viewContainer;this._viewRepeater.applyChanges(e,t,(i,a,o)=>this._getEmbeddedViewArgs(i.item,o),i=>i.item.data,i=>{if(i.operation===ea.INSERTED&&i.context){this._renderCellTemplateForItem(i.record.item.rowDef,i.context);let a=t.get(i.record.currentIndex);this._rowDefsByView.set(a,i.record.item.rowDef)}}),e.forEachIdentityChange(i=>{let a=i.currentIndex,o=t.get(a);if(this._rowDefsByView.get(o)!==i.item.rowDef){t.remove(a);let d=this._renderRow(this._rowOutlet,i.item.rowDef,a,{$implicit:i.item.data});this._rowDefsByView.set(d,i.item.rowDef)}else o.context.$implicit=i.item.data}),this._updateRowIndexContext(),this._updateNoDataRow(),this.contentChanged.next(),this.updateStickyColumnStyles()}addColumnDef(e){this._customColumnDefs.add(e)}removeColumnDef(e){this._customColumnDefs.delete(e)}addRowDef(e){this._customRowDefs.add(e)}removeRowDef(e){this._customRowDefs.delete(e)}addHeaderRowDef(e){this._customHeaderRowDefs.add(e),this._headerRowDefChanged=!0}removeHeaderRowDef(e){this._customHeaderRowDefs.delete(e),this._headerRowDefChanged=!0}addFooterRowDef(e){this._customFooterRowDefs.add(e),this._footerRowDefChanged=!0}removeFooterRowDef(e){this._customFooterRowDefs.delete(e),this._footerRowDefChanged=!0}setNoDataRow(e){this._customNoDataRow=e}updateStickyHeaderRowStyles(){let e=this._getRenderedRows(this._headerRowOutlet);if(this._isNativeHtmlTable){let i=di(this._headerRowOutlet,`thead`);i&&(i.style.display=e.length?``:`none`)}let t=this._headerRowDefs.map(i=>i.sticky);this._stickyStyler.clearStickyPositioning(e,[`top`]),this._stickyStyler.stickRows(e,t,`top`),this._headerRowDefs.forEach(i=>i.resetStickyChanged())}updateStickyFooterRowStyles(){let e=this._getRenderedRows(this._footerRowOutlet);if(this._isNativeHtmlTable){let i=di(this._footerRowOutlet,`tfoot`);i&&(i.style.display=e.length?``:`none`)}let t=this._footerRowDefs.map(i=>i.sticky);this._stickyStyler.clearStickyPositioning(e,[`bottom`]),this._stickyStyler.stickRows(e,t,`bottom`),this._stickyStyler.updateStickyFooterContainer(this._elementRef.nativeElement,t),this._footerRowDefs.forEach(i=>i.resetStickyChanged())}updateStickyColumnStyles(){let e=this._getRenderedRows(this._headerRowOutlet),t=this._getRenderedRows(this._rowOutlet),i=this._getRenderedRows(this._footerRowOutlet);(this._isNativeHtmlTable&&!this.fixedLayout||this._stickyColumnStylesNeedReset)&&(this._stickyStyler.clearStickyPositioning([...e,...t,...i],[`left`,`right`]),this._stickyColumnStylesNeedReset=!1),e.forEach((a,o)=>{this._addStickyColumnStyles([a],this._headerRowDefs[o])}),this._rowDefs.forEach(a=>{let o=[];for(let d=0;d<t.length;d++)this._renderRows[d].rowDef===a&&o.push(t[d]);this._addStickyColumnStyles(o,a)}),i.forEach((a,o)=>{this._addStickyColumnStyles([a],this._footerRowDefs[o])}),Array.from(this._columnDefsByName.values()).forEach(a=>a.resetStickyChanged())}stickyColumnsUpdated(e){this._positionListener?.stickyColumnsUpdated(e)}stickyEndColumnsUpdated(e){this._positionListener?.stickyEndColumnsUpdated(e)}stickyHeaderRowsUpdated(e){this._headerRowStickyUpdates.next(e),this._positionListener?.stickyHeaderRowsUpdated(e)}stickyFooterRowsUpdated(e){this._footerRowStickyUpdates.next(e),this._positionListener?.stickyFooterRowsUpdated(e)}_outletAssigned(){!this._hasAllOutlets&&this._rowOutlet&&this._headerRowOutlet&&this._footerRowOutlet&&this._noDataRowOutlet&&(this._hasAllOutlets=!0,this._canRender()&&this._render())}_canRender(){return this._hasAllOutlets&&this._hasInitialized}_render(){this._cacheRowDefs(),this._cacheColumnDefs(),!this._headerRowDefs.length&&!this._footerRowDefs.length&&this._rowDefs.length;let t=this._renderUpdatedColumns()||this._headerRowDefChanged||this._footerRowDefChanged;this._stickyColumnStylesNeedReset=this._stickyColumnStylesNeedReset||t,this._forceRecalculateCellWidths=t,this._headerRowDefChanged&&(this._forceRenderHeaderRows(),this._headerRowDefChanged=!1),this._footerRowDefChanged&&(this._forceRenderFooterRows(),this._footerRowDefChanged=!1),this.dataSource&&this._rowDefs.length>0&&!this._renderChangeSubscription?this._observeRenderChanges():this._stickyColumnStylesNeedReset&&this.updateStickyColumnStyles(),this._checkStickyStates()}_getAllRenderRows(){if(!Array.isArray(this._data)||!this._renderedRange)return[];let e=[],t=Math.min(this._data.length,this._renderedRange.end),i=this._cachedRenderRowsMap;this._cachedRenderRowsMap=new Map;for(let a=this._renderedRange.start;a<t;a++){let o=this._data[a],d=this._getRenderRowsForData(o,a,i.get(o));this._cachedRenderRowsMap.has(o)||this._cachedRenderRowsMap.set(o,new WeakMap);for(let s=0;s<d.length;s++){let p=d[s],r=this._cachedRenderRowsMap.get(p.data);r.has(p.rowDef)?r.get(p.rowDef).push(p):r.set(p.rowDef,[p]),e.push(p)}}return e}_getRenderRowsForData(e,t,i){return this._getRowDefs(e,t).map(o=>{let d=i&&i.has(o)?i.get(o):[];if(d.length){let s=d.shift();return s.dataIndex=t,s}else return{data:e,rowDef:o,dataIndex:t}})}_cacheColumnDefs(){this._columnDefsByName.clear(),nt(this._getOwnDefs(this._contentColumnDefs),this._customColumnDefs).forEach(t=>{this._columnDefsByName.has(t.name),this._columnDefsByName.set(t.name,t)})}_cacheRowDefs(){this._headerRowDefs=nt(this._getOwnDefs(this._contentHeaderRowDefs),this._customHeaderRowDefs),this._footerRowDefs=nt(this._getOwnDefs(this._contentFooterRowDefs),this._customFooterRowDefs),this._rowDefs=nt(this._getOwnDefs(this._contentRowDefs),this._customRowDefs);let e=this._rowDefs.filter(t=>!t.when);this._defaultRowDef=e[0]}_renderUpdatedColumns(){let e=(o,d)=>{let s=!!d.getColumnsDiff();return o||s},t=this._rowDefs.reduce(e,!1);t&&this._forceRenderDataRows();let i=this._headerRowDefs.reduce(e,!1);i&&this._forceRenderHeaderRows();let a=this._footerRowDefs.reduce(e,!1);return a&&this._forceRenderFooterRows(),t||i||a}_switchDataSource(e){this._data=[],s9(this.dataSource)&&this.dataSource.disconnect(this),this._renderChangeSubscription&&(this._renderChangeSubscription.unsubscribe(),this._renderChangeSubscription=null),e||(this._dataDiffer&&this._dataDiffer.diff([]),this._rowOutlet&&this._rowOutlet.viewContainer.clear()),this._dataSource=e}_observeRenderChanges(){if(!this.dataSource)return;let e;s9(this.dataSource)?e=this.dataSource.connect(this):Di$1(this.dataSource)?e=this.dataSource:Array.isArray(this.dataSource)&&(e=E(this.dataSource)),this._renderChangeSubscription=wi$1([e,this.viewChange]).pipe(rt$1(this._onDestroy)).subscribe(([t,i])=>{this._data=t||[],this._renderedRange=i,this._dataStream.next(t),this.renderRows()})}_forceRenderHeaderRows(){this._headerRowOutlet.viewContainer.length>0&&this._headerRowOutlet.viewContainer.clear(),this._headerRowDefs.forEach((e,t)=>this._renderRow(this._headerRowOutlet,e,t)),this.updateStickyHeaderRowStyles()}_forceRenderFooterRows(){this._footerRowOutlet.viewContainer.length>0&&this._footerRowOutlet.viewContainer.clear(),this._footerRowDefs.forEach((e,t)=>this._renderRow(this._footerRowOutlet,e,t)),this.updateStickyFooterRowStyles()}_addStickyColumnStyles(e,t){let i=Array.from(t?.columns||[]).map(d=>{let s=this._columnDefsByName.get(d);if(!s)throw ci(d);return s}),a=i.map(d=>d.sticky),o=i.map(d=>d.stickyEnd);this._stickyStyler.updateStickyColumns(e,a,o,!this.fixedLayout||this._forceRecalculateCellWidths)}_getRenderedRows(e){let t=[];for(let i=0;i<e.viewContainer.length;i++){let a=e.viewContainer.get(i);t.push(a.rootNodes[0])}return t}_getRowDefs(e,t){if(this._rowDefs.length===1)return[this._rowDefs[0]];let i=[];if(this.multiTemplateDataRows)i=this._rowDefs.filter(a=>!a.when||a.when(t,e));else{let a=this._rowDefs.find(o=>o.when&&o.when(t,e))||this._defaultRowDef;a&&i.push(a)}return i.length,i}_getEmbeddedViewArgs(e,t){let i=e.rowDef,a={$implicit:e.data};return{templateRef:i.template,context:a,index:t}}_renderRow(e,t,i,a={}){let o=e.viewContainer.createEmbeddedView(t.template,a,i);return this._renderCellTemplateForItem(t,a),o}_renderCellTemplateForItem(e,t){for(let i of this._getCellTemplates(e))we.mostRecentCellOutlet&&we.mostRecentCellOutlet._viewContainer.createEmbeddedView(i,t);this._changeDetectorRef.markForCheck()}_updateRowIndexContext(){let e=this._rowOutlet.viewContainer;for(let t=0,i=e.length;t<i;t++){let o=e.get(t).context;o.count=i,o.first=t===0,o.last=t===i-1,o.even=t%2===0,o.odd=!o.even,this.multiTemplateDataRows?(o.dataIndex=this._renderRows[t].dataIndex,o.renderIndex=t):o.index=this._renderRows[t].dataIndex}}_getCellTemplates(e){return!e||!e.columns?[]:Array.from(e.columns,t=>{let i=this._columnDefsByName.get(t);if(!i)throw ci(t);return e.extractCellTemplate(i)})}_forceRenderDataRows(){this._dataDiffer.diff([]),this._rowOutlet.viewContainer.clear(),this.renderRows()}_checkStickyStates(){let e=(t,i)=>t||i.hasStickyChanged();this._headerRowDefs.reduce(e,!1)&&this.updateStickyHeaderRowStyles(),this._footerRowDefs.reduce(e,!1)&&this.updateStickyFooterRowStyles(),Array.from(this._columnDefsByName.values()).reduce(e,!1)&&(this._stickyColumnStylesNeedReset=!0,this.updateStickyColumnStyles())}_setupStickyStyler(){let e=this._dir?this._dir.value:`ltr`,t=this._injector;this._stickyStyler=new Ct(this._isNativeHtmlTable,this.stickyCssClass,this._platform.isBrowser,this.needsPositionStickyOnElement,e,this,t),(this._dir?this._dir.change:E()).pipe(rt$1(this._onDestroy)).subscribe(i=>{this._stickyStyler.direction=i,this.updateStickyColumnStyles()})}_setupVirtualScrolling(e){let t=typeof requestAnimationFrame<`u`?Bm:jm;this.viewChange.next({start:0,end:0}),e.renderedRangeStream.pipe(La(0,t),rt$1(this._onDestroy)).subscribe(this.viewChange),e.attach({dataStream:this._dataStream,measureRangeSize:(i,a)=>this._measureRangeSize(i,a)}),wi$1([e.renderedContentOffset,this._headerRowStickyUpdates]).pipe(rt$1(this._onDestroy)).subscribe(([i,a])=>{if(!(!a.sizes||!a.offsets||!a.elements))for(let o=0;o<a.elements.length;o++){let d=a.elements[o];if(d){let s=a.offsets[o],p=i!==0?Math.max(i-s,s):-s;for(let r of d)r.style.top=`${-p}px`}}}),wi$1([e.renderedContentOffset,this._footerRowStickyUpdates]).pipe(rt$1(this._onDestroy)).subscribe(([i,a])=>{if(!(!a.sizes||!a.offsets||!a.elements))for(let o=0;o<a.elements.length;o++){let d=a.elements[o];if(d)for(let s of d)s.style.bottom=`${i+a.offsets[o]}px`}})}_getOwnDefs(e){return e.filter(t=>!t._table||t._table===this)}_updateNoDataRow(){let e=this._customNoDataRow||this._noDataRow;if(!e)return;let t=this._rowOutlet.viewContainer.length===0;if(t===this._isShowingNoDataRow)return;let i=this._noDataRowOutlet.viewContainer;if(t){let a=i.createEmbeddedView(e.templateRef),o=a.rootNodes[0];if(a.rootNodes.length===1&&o?.nodeType===this._document.ELEMENT_NODE){o.setAttribute(`role`,`row`),o.classList.add(...e._contentClassNames);let d=o.querySelectorAll(e._cellSelector);for(let s=0;s<d.length;s++)d[s].classList.add(...e._cellClassNames)}}else i.clear();this._isShowingNoDataRow=t,this._changeDetectorRef.markForCheck()}_measureRangeSize(e,t){if(e.start>=e.end||t!==`vertical`)return 0;let i=this.viewChange.value,a=this._rowOutlet.viewContainer;e.start<i.start||(e.end,i.end);let o=e.start-i.start,d=e.end-e.start,s,p;for(let _=0;_<d;_++){let m=a.get(_+o);if(m&&m.rootNodes.length){s=p=m.rootNodes[0];break}}for(let _=d-1;_>-1;_--){let m=a.get(_+o);if(m&&m.rootNodes.length){p=m.rootNodes[m.rootNodes.length-1];break}}let r=s?.getBoundingClientRect?.(),u=p?.getBoundingClientRect?.();return r&&u?u.bottom-r.top:0}_virtualScrollEnabled(){return!this._disableVirtualScrolling&&this._virtualScrollViewport!=null}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[[[`caption`]],[[`colgroup`],[`col`]],`*`],t=[`caption`,`colgroup, col`,`*`];function i(d,s){d&1&&Gt(0,2)}function a(d,s){d&1&&(Ve(0,`thead`,0),Gy(1,1),Ue(),Ve(2,`tbody`,0),Gy(3,2)(4,3),Ue(),Ve(5,`tfoot`,0),Gy(6,4),Ue())}function o(d,s){d&1&&Gy(0,1)(1,2)(2,3)(3,4)}return ae({type:n,selectors:[[`cdk-table`],[`table`,`cdk-table`,``]],contentQueries:function(s,p,r){if(s&1&&Zy(r,ui,5)(r,ge,5)(r,rt,5)(r,Ae,5)(r,kt,5),s&2){let u;Br(u=Vr())&&(p._noDataRow=u.first),Br(u=Vr())&&(p._contentColumnDefs=u),Br(u=Vr())&&(p._contentRowDefs=u),Br(u=Vr())&&(p._contentHeaderRowDefs=u),Br(u=Vr())&&(p._contentFooterRowDefs=u)}},hostAttrs:[1,`cdk-table`],hostVars:2,hostBindings:function(s,p){s&2&&Fe(`cdk-table-fixed-layout`,p.fixedLayout)},inputs:{trackBy:`trackBy`,dataSource:`dataSource`,multiTemplateDataRows:[2,`multiTemplateDataRows`,`multiTemplateDataRows`,Ae$1],fixedLayout:[2,`fixedLayout`,`fixedLayout`,Ae$1],recycleRows:[2,`recycleRows`,`recycleRows`,Ae$1]},outputs:{contentChanged:`contentChanged`},exportAs:[`cdkTable`],features:[Tp([{provide:te,useExisting:n},{provide:Pe,useValue:null}])],ngContentSelectors:t,decls:5,vars:2,consts:[[`role`,`rowgroup`],[`headerRowOutlet`,``],[`rowOutlet`,``],[`noDataRowOutlet`,``],[`footerRowOutlet`,``]],template:function(s,p){s&1&&($o(e),Gt(0),Gt(1,1),Pr(2,i,1,0),Pr(3,a,7,0)(4,o,4,0)),s&2&&(Ce(2),Lr(p._isServer?2:-1),Ce(),Lr(p._isNativeHtmlTable?3:4))},dependencies:[Rt,Mt,Tt,Ot],styles:[`.cdk-table-fixed-layout {
  table-layout: fixed;
}
`],encapsulation:2,changeDetection:1})})()}return n})();function nt(n,l){return n.concat(Array.from(l))}function di(n,l){let e=l.toUpperCase(),t=n.viewContainer.element.nativeElement;for(;t;){let i=t.nodeType===1?t.nodeName:null;if(i===e)return t;if(i===`TABLE`)break;t=t.parentNode}return null}var fi=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ce({type:n});static ɵinj=ie({imports:[em]})}return n})();var gi=new b(`MAT_SORT_DEFAULT_OPTIONS`);var Nt=(()=>{class n{_defaultOptions;_initializedStream=new Nn(1);sortables=new Map;_stateChanges=new w;active;start=`asc`;get direction(){return this._direction}set direction(e){this._direction=e}_direction=``;disableClear;disabled=!1;sortChange=new q;initialized=this._initializedStream;constructor(e){this._defaultOptions=e}register(e){this.sortables.set(e.id,e)}deregister(e){this.sortables.delete(e.id)}sort(e){this.active!=e.id?(this.active=e.id,this.direction=e.start?e.start:this.start):this.direction=this.getNextSortDirection(e),this.sortChange.emit({active:this.active,direction:this.direction})}getNextSortDirection(e){if(!e)return``;let t=e?.disableClear??this.disableClear??!!this._defaultOptions?.disableClear,i=Zi(e.start||this.start,t),a=i.indexOf(this.direction)+1;return a>=i.length&&(a=0),i[a]}ngOnInit(){this._initializedStream.next()}ngOnChanges(){this._stateChanges.next()}ngOnDestroy(){this._stateChanges.complete(),this._initializedStream.complete()}static ɵfac=function(t){return new(t||n)(Vo(gi,8))};static ɵdir=J({type:n,selectors:[[``,`matSort`,``]],hostAttrs:[1,`mat-sort`],inputs:{active:[0,`matSortActive`,`active`],start:[0,`matSortStart`,`start`],direction:[0,`matSortDirection`,`direction`],disableClear:[2,`matSortDisableClear`,`disableClear`,Ae$1],disabled:[2,`matSortDisabled`,`disabled`,Ae$1]},outputs:{sortChange:`matSortChange`},exportAs:[`matSort`],features:[Nt$1]})}return n})();function Zi(n,l){let e=[`asc`,`desc`];return n==`desc`&&e.reverse(),l||e.push(``),e}var _i=(()=>{class n{_sort=f(Nt,{optional:!0});_columnDef=f(ge,{optional:!0});_changeDetectorRef=f(zn);_focusMonitor=f(Ks);_elementRef=f(Q);_ariaDescriber=f(Yq,{optional:!0});_renderChanges;_animationsDisabled=vt();_recentlyCleared=Te(null);_sortButton;id;arrowPosition=`after`;start;disabled=!1;get sortActionDescription(){return this._sortActionDescription}set sortActionDescription(e){this._updateSortActionDescription(e)}_sortActionDescription=`Sort`;disableClear;constructor(){f(gt$1).load(xw);let e=f(gi,{optional:!0});this._sort,e?.arrowPosition&&(this.arrowPosition=e?.arrowPosition)}ngOnInit(){!this.id&&this._columnDef&&(this.id=this._columnDef.name),this._sort.register(this),this._renderChanges=ku(this._sort._stateChanges,this._sort.sortChange).subscribe(()=>this._changeDetectorRef.markForCheck()),this._sortButton=this._elementRef.nativeElement.querySelector(`.mat-sort-header-container`),this._updateSortActionDescription(this._sortActionDescription)}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(()=>{Promise.resolve().then(()=>this._recentlyCleared.set(null))})}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef),this._sort.deregister(this),this._renderChanges?.unsubscribe(),this._sortButton&&this._ariaDescriber?.removeDescription(this._sortButton,this._sortActionDescription)}_toggleOnInteraction(){if(!this._isDisabled()){let e=this._isSorted(),t=this._sort.direction;this._sort.sort(this),this._recentlyCleared.set(e&&!this._isSorted()?t:null)}}_handleKeydown(e){(e.keyCode===32||e.keyCode===13)&&(e.preventDefault(),this._toggleOnInteraction())}_isSorted(){return this._sort.active==this.id&&(this._sort.direction===`asc`||this._sort.direction===`desc`)}_isDisabled(){return this._sort.disabled||this.disabled}_getAriaSortAttribute(){return this._isSorted()?this._sort.direction==`asc`?`ascending`:`descending`:`none`}_renderArrow(){return!this._isDisabled()||this._isSorted()}_updateSortActionDescription(e){this._sortButton&&(this._ariaDescriber?.removeDescription(this._sortButton,this._sortActionDescription),this._ariaDescriber?.describe(this._sortButton,e)),this._sortActionDescription=e}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[`*`,[[``,`matSortHeaderIcon`,``]]],t=[`*`,`[matSortHeaderIcon]`];function i(o,d){o&1&&(nb(),fn(0,`svg`,3),hn(1,`path`,4),pn())}function a(o,d){o&1&&(fn(0,`div`,2),Gt(1,1,null,i,2,0),pn())}return ae({type:n,selectors:[[``,`mat-sort-header`,``]],hostAttrs:[1,`mat-sort-header`],hostVars:3,hostBindings:function(d,s){d&1&&Fr(`click`,function(){return s._toggleOnInteraction()})(`keydown`,function(r){return s._handleKeydown(r)})(`mouseleave`,function(){return s._recentlyCleared.set(null)}),d&2&&(ft$1(`aria-sort`,s._getAriaSortAttribute()),Fe(`mat-sort-header-disabled`,s._isDisabled()))},inputs:{id:[0,`mat-sort-header`,`id`],arrowPosition:`arrowPosition`,start:`start`,disabled:[2,`disabled`,`disabled`,Ae$1],sortActionDescription:`sortActionDescription`,disableClear:[2,`disableClear`,`disableClear`,Ae$1]},exportAs:[`matSortHeader`],ngContentSelectors:t,decls:4,vars:17,consts:[[1,`mat-sort-header-container`,`mat-focus-indicator`],[1,`mat-sort-header-content`],[1,`mat-sort-header-arrow`],[`viewBox`,`0 -960 960 960`,`focusable`,`false`,`aria-hidden`,`true`],[`d`,`M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z`]],template:function(d,s){d&1&&($o(e),fn(0,`div`,0)(1,`div`,1),Gt(2),pn(),Pr(3,a,3,0,`div`,2),pn()),d&2&&(Fe(`mat-sort-header-sorted`,s._isSorted())(`mat-sort-header-position-before`,s.arrowPosition===`before`)(`mat-sort-header-descending`,s._sort.direction===`desc`)(`mat-sort-header-ascending`,s._sort.direction===`asc`)(`mat-sort-header-recently-cleared-ascending`,s._recentlyCleared()===`asc`)(`mat-sort-header-recently-cleared-descending`,s._recentlyCleared()===`desc`)(`mat-sort-header-animations-disabled`,s._animationsDisabled),ft$1(`tabindex`,s._isDisabled()?null:0)(`role`,s._isDisabled()?null:`button`),Ce(3),Lr(s._renderArrow()?3:-1))},styles:[`.mat-sort-header {
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
`],encapsulation:2})})()}return n})();var bi=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ce({type:n});static ɵinj=ie({imports:[wn]})}return n})();var yi=(()=>{class n extends It{stickyCssClass=`mat-mdc-table-sticky`;needsPositionStickyOnElement=!1;static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵcmp=(function(){let e=[[[`caption`]],[[`colgroup`],[`col`]],`*`],t=[`caption`,`colgroup, col`,`*`];function i(d,s){d&1&&Gt(0,2)}function a(d,s){d&1&&(Ve(0,`thead`,0),Gy(1,1),Ue(),Ve(2,`tbody`,2),Gy(3,3)(4,4),Ue(),Ve(5,`tfoot`,0),Gy(6,5),Ue())}function o(d,s){d&1&&Gy(0,1)(1,3)(2,4)(3,5)}return ae({type:n,selectors:[[`mat-table`],[`table`,`mat-table`,``]],hostAttrs:[1,`mat-mdc-table`,`mdc-data-table__table`],hostVars:2,hostBindings:function(s,p){s&2&&Fe(`mat-table-fixed-layout`,p.fixedLayout)},exportAs:[`matTable`],features:[Tp([{provide:It,useExisting:n},{provide:te,useExisting:n},{provide:Pe,useValue:null}]),Me],ngContentSelectors:t,decls:5,vars:2,consts:[[`role`,`rowgroup`],[`headerRowOutlet`,``],[`role`,`rowgroup`,1,`mdc-data-table__content`],[`rowOutlet`,``],[`noDataRowOutlet`,``],[`footerRowOutlet`,``]],template:function(s,p){s&1&&($o(e),Gt(0),Gt(1,1),Pr(2,i,1,0),Pr(3,a,7,0)(4,o,4,0)),s&2&&(Ce(2),Lr(p._isServer?2:-1),Ce(),Lr(p._isNativeHtmlTable?3:4))},dependencies:[Rt,Mt,Tt,Ot],styles:[`.mat-mdc-table-sticky {
  position: sticky !important;
}

mat-table {
  display: block;
}

mat-header-row {
  min-height: var(--%NS%mat-table-header-container-height, 56px);
}

mat-row {
  min-height: var(--%NS%mat-table-row-item-container-height, 52px);
}

mat-footer-row {
  min-height: var(--%NS%mat-table-footer-container-height, 52px);
}

mat-row, mat-header-row, mat-footer-row {
  display: flex;
  border-width: 0;
  border-bottom-width: 1px;
  border-style: solid;
  align-items: center;
  box-sizing: border-box;
}

mat-cell:first-of-type, mat-header-cell:first-of-type, mat-footer-cell:first-of-type {
  padding-left: 24px;
}
[dir=rtl] mat-cell:first-of-type:not(:only-of-type), [dir=rtl] mat-header-cell:first-of-type:not(:only-of-type), [dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type) {
  padding-left: 0;
  padding-right: 24px;
}
mat-cell:last-of-type, mat-header-cell:last-of-type, mat-footer-cell:last-of-type {
  padding-right: 24px;
}
[dir=rtl] mat-cell:last-of-type:not(:only-of-type), [dir=rtl] mat-header-cell:last-of-type:not(:only-of-type), [dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type) {
  padding-right: 0;
  padding-left: 24px;
}

mat-cell, mat-header-cell, mat-footer-cell {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  word-wrap: break-word;
  min-height: inherit;
}

.mat-mdc-table {
  min-width: 100%;
  border: 0;
  border-spacing: 0;
  table-layout: auto;
  white-space: normal;
  background-color: var(--%NS%mat-table-background-color, var(--%NS%mat-sys-surface));
}

.mat-table-fixed-layout {
  table-layout: fixed;
}

.mdc-data-table__cell {
  box-sizing: border-box;
  overflow: hidden;
  text-align: start;
  text-overflow: ellipsis;
}

.mdc-data-table__cell,
.mdc-data-table__header-cell {
  padding: 0 16px;
}

.mat-mdc-header-row {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  height: var(--%NS%mat-table-header-container-height, 56px);
  color: var(--%NS%mat-table-header-headline-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
  font-family: var(--%NS%mat-table-header-headline-font, var(--%NS%mat-sys-title-small-font, Roboto, sans-serif));
  line-height: var(--%NS%mat-table-header-headline-line-height, var(--%NS%mat-sys-title-small-line-height));
  font-size: var(--%NS%mat-table-header-headline-size, var(--%NS%mat-sys-title-small-size, 14px));
  font-weight: var(--%NS%mat-table-header-headline-weight, var(--%NS%mat-sys-title-small-weight, 500));
}

.mat-mdc-row {
  height: var(--%NS%mat-table-row-item-container-height, 52px);
  color: var(--%NS%mat-table-row-item-label-text-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
}

.mat-mdc-row,
.mdc-data-table__content {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--%NS%mat-table-row-item-label-text-font, var(--%NS%mat-sys-body-medium-font, Roboto, sans-serif));
  line-height: var(--%NS%mat-table-row-item-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-table-row-item-label-text-size, var(--%NS%mat-sys-body-medium-size, 14px));
  font-weight: var(--%NS%mat-table-row-item-label-text-weight, var(--%NS%mat-sys-body-medium-weight));
}

.mat-mdc-footer-row {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  height: var(--%NS%mat-table-footer-container-height, 52px);
  color: var(--%NS%mat-table-row-item-label-text-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
  font-family: var(--%NS%mat-table-footer-supporting-text-font, var(--%NS%mat-sys-body-medium-font, Roboto, sans-serif));
  line-height: var(--%NS%mat-table-footer-supporting-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-table-footer-supporting-text-size, var(--%NS%mat-sys-body-medium-size, 14px));
  font-weight: var(--%NS%mat-table-footer-supporting-text-weight, var(--%NS%mat-sys-body-medium-weight));
  letter-spacing: var(--%NS%mat-table-footer-supporting-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
}

.mat-mdc-header-cell {
  border-bottom-color: var(--%NS%mat-table-row-item-outline-color, var(--%NS%mat-sys-outline, rgba(0, 0, 0, 0.12)));
  border-bottom-width: var(--%NS%mat-table-row-item-outline-width, 1px);
  border-bottom-style: solid;
  letter-spacing: var(--%NS%mat-table-header-headline-tracking, var(--%NS%mat-sys-title-small-tracking));
  font-weight: inherit;
  line-height: inherit;
  box-sizing: border-box;
  text-overflow: ellipsis;
  overflow: hidden;
  outline: none;
  text-align: start;
}
.mdc-data-table__row:last-child > .mat-mdc-header-cell {
  border-bottom: none;
}

.mat-mdc-cell {
  border-bottom-color: var(--%NS%mat-table-row-item-outline-color, var(--%NS%mat-sys-outline, rgba(0, 0, 0, 0.12)));
  border-bottom-width: var(--%NS%mat-table-row-item-outline-width, 1px);
  border-bottom-style: solid;
  letter-spacing: var(--%NS%mat-table-row-item-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
  line-height: inherit;
}
.mdc-data-table__row:last-child > .mat-mdc-cell {
  border-bottom: none;
}

.mat-mdc-footer-cell {
  letter-spacing: var(--%NS%mat-table-row-item-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
}

mat-row.mat-mdc-row,
mat-header-row.mat-mdc-header-row,
mat-footer-row.mat-mdc-footer-row {
  border-bottom: none;
}

.mat-mdc-table tbody,
.mat-mdc-table tfoot,
.mat-mdc-table thead,
.mat-mdc-cell,
.mat-mdc-footer-cell,
.mat-mdc-header-row,
.mat-mdc-row,
.mat-mdc-footer-row,
.mat-mdc-table .mat-mdc-header-cell {
  background: inherit;
}

.mat-mdc-table mat-header-row.mat-mdc-header-row,
.mat-mdc-table mat-row.mat-mdc-row,
.mat-mdc-table mat-footer-row.mat-mdc-footer-cell {
  height: unset;
}

mat-header-cell.mat-mdc-header-cell,
mat-cell.mat-mdc-cell,
mat-footer-cell.mat-mdc-footer-cell {
  align-self: stretch;
}
`],encapsulation:2,changeDetection:1})})()}return n})();var vi=(()=>{class n extends at{static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵdir=J({type:n,selectors:[[``,`matCellDef`,``]],features:[Tp([{provide:at,useExisting:n}]),Me]})}return n})();var wi=(()=>{class n extends ot{static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵdir=J({type:n,selectors:[[``,`matHeaderCellDef`,``]],features:[Tp([{provide:ot,useExisting:n}]),Me]})}return n})();var Ci=(()=>{class n extends ge{get name(){return this._name}set name(e){this._setNameInput(e)}_updateColumnCssClassName(){super._updateColumnCssClassName(),this._columnCssClassName.push(`mat-column-${this.cssClassFriendlyName}`)}static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵdir=J({type:n,selectors:[[``,`matColumnDef`,``]],inputs:{name:[0,`matColumnDef`,`name`]},features:[Tp([{provide:ge,useExisting:n}]),Me]})}return n})();var xi=(()=>{class n extends pi{static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵdir=J({type:n,selectors:[[`mat-header-cell`],[`th`,`mat-header-cell`,``]],hostAttrs:[`role`,`columnheader`,1,`mat-mdc-header-cell`,`mdc-data-table__header-cell`],features:[Me]})}return n})();var ki=(()=>{class n extends hi{static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵdir=J({type:n,selectors:[[`mat-cell`],[`td`,`mat-cell`,``]],hostAttrs:[1,`mat-mdc-cell`,`mdc-data-table__cell`],features:[Me]})}return n})();var Di=(()=>{class n extends Ae{static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵdir=J({type:n,selectors:[[``,`matHeaderRowDef`,``]],inputs:{columns:[0,`matHeaderRowDef`,`columns`],sticky:[2,`matHeaderRowDefSticky`,`sticky`,Ae$1]},features:[Tp([{provide:Ae,useExisting:n}]),Me]})}return n})();var Si=(()=>{class n extends rt{static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵdir=J({type:n,selectors:[[``,`matRowDef`,``]],inputs:{columns:[0,`matRowDefColumns`,`columns`],when:[0,`matRowDefWhen`,`when`]},features:[Tp([{provide:rt,useExisting:n}]),Me]})}return n})();var Mi=(()=>{class n extends Dt{static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵcmp=ae({type:n,selectors:[[`mat-header-row`],[`tr`,`mat-header-row`,``]],hostAttrs:[`role`,`row`,1,`mat-mdc-header-row`,`mdc-data-table__header-row`],exportAs:[`matHeaderRow`],features:[Tp([{provide:Dt,useExisting:n}]),Me],decls:1,vars:0,consts:[[`cdkCellOutlet`,``]],template:function(t,i){t&1&&Gy(0,0)},dependencies:[we],encapsulation:2,changeDetection:1})}return n})();var Ri=(()=>{class n extends St{static ɵfac=(()=>{let e;return function(i){return(e||(e=ln(n)))(i||n)}})();static ɵcmp=ae({type:n,selectors:[[`mat-row`],[`tr`,`mat-row`,``]],hostAttrs:[`role`,`row`,1,`mat-mdc-row`,`mdc-data-table__row`],exportAs:[`matRow`],features:[Tp([{provide:St,useExisting:n}]),Me],decls:1,vars:0,consts:[[`cdkCellOutlet`,``]],template:function(t,i){t&1&&Gy(0,0)},dependencies:[we],encapsulation:2,changeDetection:1})}return n})();var Oi=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ce({type:n});static ɵinj=ie({imports:[fi,wn]})}return n})();function ta(n,l){n&1&&Ho(0,`mat-progress-bar`,8)}function na(n,l){if(n&1){let e=Sp();Ve(0,`div`,9)(1,`p`),mn(2,`The vehicle makes could not be loaded.`),Ue(),Ve(3,`button`,11),Fr(`click`,function(){dc(e);let i=ol();return fc(i.load())}),mn(4,`Try again`),Ue()()}}function ia(n,l){n&1&&(Ve(0,`th`,25),mn(1,`Make Code`),Ue())}function aa(n,l){if(n&1&&(Ve(0,`td`,26),mn(1),Ue()),n&2){let e=l.$implicit;Ce(),gs(e.makeCode)}}function oa(n,l){n&1&&(Ve(0,`th`,25),mn(1,`Make Name`),Ue())}function ra(n,l){if(n&1&&(Ve(0,`td`,26),mn(1),Ue()),n&2){let e=l.$implicit;Ce(),gs(e.makeName)}}function sa(n,l){n&1&&(Ve(0,`th`,25),mn(1,`Short Name`),Ue())}function la(n,l){if(n&1&&(Ve(0,`td`,26),mn(1),Ue()),n&2){let e=l.$implicit;Ce(),gs(e.shortName)}}function ca(n,l){n&1&&(Ve(0,`th`,27),mn(1,`Actions`),Ue())}function da(n,l){if(n&1){let e=Sp();Ve(0,`td`,28)(1,`button`,29),Fr(`click`,function(){let i=dc(e).$implicit,a=ol(2);return fc(a.open(i))}),mn(2,` Open `),Ue(),Ve(3,`button`,30),Fr(`click`,function(){let i=dc(e).$implicit,a=ol(2);return fc(a.confirmDelete(i))}),mn(4,` Delete `),Ue()()}if(n&2){let e=l.$implicit;Ce(),ft$1(`aria-label`,`Open `+e.makeCode),Ce(2),ft$1(`aria-label`,`Delete `+e.makeCode)}}function ma(n,l){n&1&&Ho(0,`tr`,31)}function pa(n,l){n&1&&Ho(0,`tr`,32)}function ha(n,l){if(n&1&&(Ve(0,`p`,24),mn(1),Ue()),n&2){let e=ol(2);Ce(),gs(e.emptyMessage())}}function ua(n,l){if(n&1){let e=Sp();Ve(0,`div`,12)(1,`table`,13),Fr(`matSortChange`,function(i){dc(e);let a=ol();return fc(a.onSort(i))}),Ep(2,14),$n(3,ia,2,0,`th`,15)(4,aa,2,1,`td`,16),Cp(),Ep(5,17),$n(6,oa,2,0,`th`,15)(7,ra,2,1,`td`,16),Cp(),Ep(8,18),$n(9,sa,2,0,`th`,15)(10,la,2,1,`td`,16),Cp(),Ep(11,19),$n(12,ca,2,0,`th`,20)(13,da,5,2,`td`,21),Cp(),$n(14,ma,1,0,`tr`,22)(15,pa,1,0,`tr`,23),Ue()(),Pr(16,ha,2,1,`p`,24)}if(n&2){let e=ol();Ce(),ps(`dataSource`,e.items())(`matSortActive`,e.sortColumn())(`matSortDirection`,e.sortDirection()),Ce(13),ps(`matHeaderRowDef`,e.columns),Ce(),ps(`matRowDefColumns`,e.columns),Ce(),Lr(!e.loading()&&e.items().length===0?16:-1)}}var fa=300;var ga=5e3;var Ti=class n{client=f(Kw);router=f(Zl);dialog=f(iE);snackBar=f(LY);destroyRef=f(Pe$1);pageSize=10;columns=[`makeCode`,`makeName`,`shortName`,`actions`];searchControl=new Wi$1(``,{nonNullable:!0});items=Te([]);totalCount=Te(0);pageIndex=Te(0);searchText=Te(``);sortColumn=Te(`makeCode`);sortDirection=Te(`asc`);loading=Te(!1);loadFailed=Te(!1);emptyMessage=Np(()=>this.searchText()?`No vehicle makes match your search. Try a different code or name.`:`There are no vehicle makes yet. Select "Add vehicle make" to create the first one.`);constructor(){this.searchControl.valueChanges.pipe(so(fa),H(l=>l.trim()),vi$1(),Mr()).subscribe(l=>{this.searchText.set(l),this.pageIndex.set(0),this.load()}),this.load()}load(){this.loading.set(!0),this.loadFailed.set(!1),this.client.list(this.pageIndex()+1,this.searchText(),this.sortColumn(),this.sortDirection()).pipe(Mr(this.destroyRef)).subscribe({next:l=>{this.items.set(l.items??[]),this.totalCount.set(l.totalCount??0),this.loading.set(!1)},error:()=>{this.loadFailed.set(!0),this.loading.set(!1)}})}onSort(l){this.sortColumn.set(l.active),this.sortDirection.set(l.direction===`desc`?`desc`:`asc`),this.pageIndex.set(0),this.load()}onPage(l){this.pageIndex.set(l.pageIndex),this.load()}add(){this.router.navigate([`/vehicle-makes/new`])}open(l){this.router.navigate([`/vehicle-makes/view`],{state:{makeCode:l.makeCode}})}confirmDelete(l){UZ(this.dialog,{title:`Delete this vehicle make?`,message:`${l.makeName} (${l.makeCode}) will be permanently deleted. This cannot be undone.`,confirmLabel:`Delete permanently`,cancelLabel:`Cancel`,destructive:!0}).pipe(oe(e=>e),Be(()=>this.client.delete(l.makeCode)),Mr(this.destroyRef)).subscribe({next:()=>{this.snackBar.open(`Vehicle make deleted.`,`Close`,{duration:ga}),this.items().length===1&&this.pageIndex()>0&&this.pageIndex.update(e=>e-1),this.load()},error:()=>this.load()})}static ɵfac=function(e){return new(e||n)};static ɵcmp=ae({type:n,selectors:[[`app-vehicle-make-list`]],decls:19,vars:8,consts:[[1,`page`],[1,`page-header`],[1,`subtitle`],[`matButton`,`filled`,`type`,`button`,3,`click`],[1,`toolbar`],[`appearance`,`outline`,`subscriptSizing`,`dynamic`,1,`search`],[`matInput`,``,`type`,`search`,`autocomplete`,`off`,3,`formControl`],[1,`table-card`],[`mode`,`indeterminate`,`aria-label`,`Loading vehicle makes`],[`role`,`alert`,1,`state`],[`aria-label`,`Select a page of vehicle makes`,3,`page`,`length`,`pageSize`,`pageIndex`,`hidePageSize`,`showFirstLastButtons`],[`matButton`,`outlined`,`type`,`button`,3,`click`],[1,`table-scroll`],[`mat-table`,``,`matSort`,``,`matSortDisableClear`,``,3,`matSortChange`,`dataSource`,`matSortActive`,`matSortDirection`],[`matColumnDef`,`makeCode`],[`mat-header-cell`,``,`mat-sort-header`,``,4,`matHeaderCellDef`],[`mat-cell`,``,4,`matCellDef`],[`matColumnDef`,`makeName`],[`matColumnDef`,`shortName`],[`matColumnDef`,`actions`],[`mat-header-cell`,``,`class`,`actions-column`,4,`matHeaderCellDef`],[`mat-cell`,``,`class`,`actions-column`,4,`matCellDef`],[`mat-header-row`,``,4,`matHeaderRowDef`],[`mat-row`,``,4,`matRowDef`,`matRowDefColumns`],[1,`state`],[`mat-header-cell`,``,`mat-sort-header`,``],[`mat-cell`,``],[`mat-header-cell`,``,1,`actions-column`],[`mat-cell`,``,1,`actions-column`],[`matButton`,``,`type`,`button`,3,`click`],[`matButton`,``,`type`,`button`,1,`delete-action`,3,`click`],[`mat-header-row`,``],[`mat-row`,``]],template:function(e,t){e&1&&(Ve(0,`section`,0)(1,`header`,1)(2,`div`)(3,`h1`),mn(4,`Vehicle Make Master`),Ue(),Ve(5,`p`,2),mn(6,`Find, add and maintain the vehicle makes used across insurance records.`),Ue()(),Ve(7,`button`,3),Fr(`click`,function(){return t.add()}),mn(8,`Add vehicle make`),Ue()(),Ve(9,`div`,4)(10,`mat-form-field`,5)(11,`mat-label`),mn(12,`Search by code, name or short name`),Ue(),Ve(13,`input`,6),fx(),Ue()()(),Ve(14,`div`,7),Pr(15,ta,1,0,`mat-progress-bar`,8),Pr(16,na,5,0,`div`,9)(17,ua,17,6),Ve(18,`mat-paginator`,10),Fr(`page`,function(a){return t.onPage(a)}),Ue()()()),e&2&&(Ce(13),ps(`formControl`,t.searchControl),hx(),Ce(2),Lr(t.loading()?15:-1),Ce(),Lr(t.loadFailed()?16:17),Ce(2),ps(`length`,t.totalCount())(`pageSize`,t.pageSize)(`pageIndex`,t.pageIndex())(`hidePageSize`,!0)(`showFirstLastButtons`,!0))},dependencies:[Qr,mn$1,Xr,Qi,cu,It$1,$n$1,Et,is,ns,si,wt,ms,bi,Nt,_i,Oi,yi,wi,Di,Ci,vi,Si,xi,ki,Mi,Ri],styles:[`.page[_ngcontent-%COMP%]{max-width:1100px;margin:0 auto;padding:24px 24px 48px}.page-header[_ngcontent-%COMP%]{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}h1[_ngcontent-%COMP%]{margin:0 0 4px;font-size:1.5rem;font-weight:600;color:var(--%NS%sdd-text)}.subtitle[_ngcontent-%COMP%]{margin:0;color:var(--%NS%sdd-muted)}.toolbar[_ngcontent-%COMP%]{margin-bottom:16px}.search[_ngcontent-%COMP%]{width:min(420px,100%)}.table-card[_ngcontent-%COMP%]{background:var(--%NS%sdd-surface);border:1px solid var(--%NS%sdd-border);border-radius:8px;overflow:hidden}.table-scroll[_ngcontent-%COMP%]{overflow-x:auto}table[_ngcontent-%COMP%]{width:100%}.actions-column[_ngcontent-%COMP%]{width:1%;white-space:nowrap;text-align:right}.delete-action[_ngcontent-%COMP%]{--%NS%mat-button-text-label-text-color: #b3261e}.state[_ngcontent-%COMP%]{margin:0;padding:32px 16px;text-align:center;color:var(--%NS%sdd-muted)}@media(max-width:600px){.page-header[_ngcontent-%COMP%]{flex-direction:column}}`]})};export{Ti as VehicleMakeListComponent};