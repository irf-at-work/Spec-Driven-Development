var __require = /* @__PURE__ */ ((x) =>
  typeof require !== `undefined`
    ? require
    : typeof Proxy !== `undefined`
      ? new Proxy(x, { get: (a, b) => (typeof require !== `undefined` ? require : a)[b] })
      : x)(function (x) {
  if (typeof require !== `undefined`) return require.apply(this, arguments);
  throw Error(
    'Calling `require` for "' +
      x +
      '" in an environment that doesn\'t expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.',
  );
});
function n$1() {
  let e = history.state;
  if (typeof e == `object` && e !== null && `makeCode` in e) {
    let o = e.makeCode;
    return typeof o == `string` && o.length > 0 ? o : null;
  }
  return null;
}
function t() {
  let e = history.state;
  return typeof e != `object` ||
    e === null ||
    !(`codeType` in e) ||
    !(`code` in e) ||
    !(`companyCode` in e) ||
    typeof e.codeType != `string` ||
    typeof e.code != `string` ||
    typeof e.companyCode != `string`
    ? null
    : { codeType: e.codeType, code: e.code, companyCode: e.companyCode };
}
var nT = Object.create;
var ou = Object.defineProperty;
var rT = Object.defineProperties;
var oT = Object.getOwnPropertyDescriptor;
var iT = Object.getOwnPropertyDescriptors;
var sT = Object.getOwnPropertyNames;
var Eg = Object.getOwnPropertySymbols;
var aT = Object.getPrototypeOf;
var Ig = Object.prototype.hasOwnProperty;
var cT = Object.prototype.propertyIsEnumerable;
var Cg = (e, t, n) =>
  t in e ? ou(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
var C = (e, t) => {
  for (var n in (t ||= {})) Ig.call(t, n) && Cg(e, n, t[n]);
  if (Eg) for (var n of Eg(t)) cT.call(t, n) && Cg(e, n, t[n]);
  return e;
};
var Y = (e, t) => rT(e, iT(t));
var QO = ((e) =>
  typeof __require < `u`
    ? __require
    : typeof Proxy < `u`
      ? new Proxy(e, { get: (t, n) => (typeof __require < `u` ? __require : t)[n] })
      : e)(function (e) {
  if (typeof __require < `u`) return __require.apply(this, arguments);
  throw Error(`Dynamic require of "` + e + `" is not supported`);
});
var lT = (e, t) => () => {
  try {
    return (t || e((t = { exports: {} }).exports, t), t.exports);
  } catch (n) {
    throw ((t = 0), n);
  }
};
var uT = (e, t, n, r) => {
  if ((t && typeof t == `object`) || typeof t == `function`)
    for (let o of sT(t))
      !Ig.call(e, o) &&
        o !== n &&
        ou(e, o, { get: () => t[o], enumerable: !(r = oT(t, o)) || r.enumerable });
  return e;
};
var dT = (e, t, n) => (
  (n = e != null ? nT(aT(e)) : {}),
  uT(t || !e || !e.__esModule ? ou(n, `default`, { value: e, enumerable: !0 }) : n, e)
);
var mE = lT((Xt, Eh) => {
  'use strict';
  (function (e, t) {
    typeof Xt == `object` && typeof Eh < `u`
      ? (Eh.exports = t())
      : typeof define == `function` && define.amd
        ? define(t)
        : ((e = typeof globalThis < `u` ? globalThis : e || self), (e.Sweetalert2 = t()));
  })(Xt, function () {
    'use strict';
    function e(l, u, f) {
      if (typeof l == `function` ? l === u : l.has(u)) return arguments.length < 3 ? u : f;
      throw new TypeError(`Private element is not present on this object`);
    }
    function t(l, u) {
      if (u.has(l))
        throw new TypeError(`Cannot initialize the same private elements twice on an object`);
    }
    function n(l, u) {
      return l.get(e(l, u));
    }
    function r(l, u, f) {
      (t(l, u), u.set(l, f));
    }
    function o(l, u, f) {
      return (l.set(e(l, u), f), f);
    }
    let i = 100,
      s = {},
      a = () => {
        s.previousActiveElement instanceof HTMLElement
          ? (s.previousActiveElement.focus(), (s.previousActiveElement = null))
          : document.body && document.body.focus();
      },
      c = (l) =>
        new Promise((u) => {
          if (!l) return u();
          let f = window.scrollX,
            g = window.scrollY;
          ((s.restoreFocusTimeout = setTimeout(() => {
            (a(), u());
          }, i)),
            window.scrollTo(f, g));
        }),
      d = `swal2-`,
      p = [
        `container`,
        `shown`,
        `height-auto`,
        `iosfix`,
        `popup`,
        `modal`,
        `no-backdrop`,
        `no-transition`,
        `toast`,
        `toast-shown`,
        `show`,
        `hide`,
        `close`,
        `title`,
        `html-container`,
        `actions`,
        `confirm`,
        `deny`,
        `cancel`,
        `footer`,
        `icon`,
        `icon-content`,
        `image`,
        `input`,
        `file`,
        `range`,
        `select`,
        `radio`,
        `checkbox`,
        `label`,
        `textarea`,
        `inputerror`,
        `input-label`,
        `validation-message`,
        `progress-steps`,
        `active-progress-step`,
        `progress-step`,
        `progress-step-line`,
        `loader`,
        `loading`,
        `styled`,
        `top`,
        `top-start`,
        `top-end`,
        `top-left`,
        `top-right`,
        `center`,
        `center-start`,
        `center-end`,
        `center-left`,
        `center-right`,
        `bottom`,
        `bottom-start`,
        `bottom-end`,
        `bottom-left`,
        `bottom-right`,
        `grow-row`,
        `grow-column`,
        `grow-fullscreen`,
        `rtl`,
        `timer-progress-bar`,
        `timer-progress-bar-container`,
        `scrollbar-measure`,
        `icon-success`,
        `icon-warning`,
        `icon-info`,
        `icon-question`,
        `icon-error`,
        `draggable`,
        `dragging`,
      ].reduce((l, u) => ((l[u] = d + u), l), {}),
      y = [`success`, `warning`, `info`, `question`, `error`].reduce(
        (l, u) => ((l[u] = d + u), l),
        {},
      ),
      w = `SweetAlert2:`,
      T = (l) => l.charAt(0).toUpperCase() + l.slice(1),
      E = (l) => {
        console.warn(`${w} ${typeof l == `object` ? l.join(` `) : l}`);
      },
      _ = (l) => {
        console.error(`${w} ${l}`);
      },
      V = [],
      pe = (l) => {
        V.includes(l) || (V.push(l), E(l));
      },
      xt = (l, u = null) => {
        pe(
          `"${l}" is deprecated and will be removed in the next major release.${u ? ` Use "${u}" instead.` : ``}`,
        );
      },
      et = (l) => (typeof l == `function` ? l() : l),
      Jt = (l) => l && typeof l.toPromise == `function`,
      Et = (l) => (Jt(l) ? l.toPromise() : Promise.resolve(l)),
      Ot = (l) => l && Promise.resolve(l) === l,
      kt = () => navigator.userAgent.includes(`Firefox`),
      Oe = () => document.body.querySelector(`.${p.container}`),
      en = (l) => {
        let u = Oe();
        return u ? u.querySelector(l) : null;
      },
      ke = (l) => en(`.${l}`),
      W = () => ke(p.popup),
      qr = () => ke(p.icon),
      IE = () => ke(p[`icon-content`]),
      Ih = () => ke(p.title),
      jl = () => ke(p[`html-container`]),
      Th = () => ke(p.image),
      Bl = () => ke(p[`progress-steps`]),
      As = () => ke(p[`validation-message`]),
      Pt = () => en(`.${p.actions} .${p.confirm}`),
      Gr = () => en(`.${p.actions} .${p.cancel}`),
      Xn = () => en(`.${p.actions} .${p.deny}`),
      TE = () => ke(p[`input-label`]),
      Wr = () => en(`.${p.loader}`),
      Xo = () => ke(p.actions),
      Sh = () => ke(p.footer),
      Rs = () => ke(p[`timer-progress-bar`]),
      Ul = () => ke(p.close),
      SE = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`,
      Vl = () => {
        let l = W();
        if (!l) return [];
        let u = l.querySelectorAll(`[tabindex]:not([tabindex="-1"]):not([tabindex="0"])`),
          f = Array.from(u).sort((D, x) => {
            let G = parseInt(D.getAttribute(`tabindex`) || `0`),
              oe = parseInt(x.getAttribute(`tabindex`) || `0`);
            return G > oe ? 1 : G < oe ? -1 : 0;
          }),
          g = l.querySelectorAll(SE),
          v = Array.from(g).filter((D) => D.getAttribute(`tabindex`) !== `-1`);
        return [...new Set(f.concat(v))].filter((D) => Ze(D));
      },
      Hl = () =>
        tn(document.body, p.shown) &&
        !tn(document.body, p[`toast-shown`]) &&
        !tn(document.body, p[`no-backdrop`]),
      xs = () => {
        let l = W();
        return l ? tn(l, p.toast) : !1;
      },
      ME = () => {
        let l = W();
        return l ? l.hasAttribute(`data-loading`) : !1;
      },
      tt = (l, u) => {
        if (((l.textContent = ``), u)) {
          let g = new DOMParser().parseFromString(u, `text/html`),
            v = g.querySelector(`head`);
          v &&
            Array.from(v.childNodes).forEach((x) => {
              l.appendChild(x);
            });
          let D = g.querySelector(`body`);
          D &&
            Array.from(D.childNodes).forEach((x) => {
              x instanceof HTMLVideoElement || x instanceof HTMLAudioElement
                ? l.appendChild(x.cloneNode(!0))
                : l.appendChild(x);
            });
        }
      },
      tn = (l, u) => (u ? u.split(/\s+/).every((f) => l.classList.contains(f)) : !1),
      _E = (l, u) => {
        Array.from(l.classList).forEach((f) => {
          !Object.values(p).includes(f) &&
            !Object.values(y).includes(f) &&
            !Object.values(u.showClass || {}).includes(f) &&
            l.classList.remove(f);
        });
      },
      nt = (l, u, f) => {
        if ((_E(l, u), !u.customClass)) return;
        let g = u.customClass[f];
        if (g) {
          if (typeof g != `string` && !g.forEach) {
            E(
              `Invalid type of customClass.${f}! Expected string or iterable object, got "${typeof g}"`,
            );
            return;
          }
          K(l, g);
        }
      },
      Os = (l, u) => {
        if (!u) return null;
        switch (u) {
          case `select`:
          case `textarea`:
          case `file`:
            return l.querySelector(`.${p.popup} > .${p[u]}`);
          case `checkbox`:
            return l.querySelector(`.${p.popup} > .${p.checkbox} input`);
          case `radio`:
            return (
              l.querySelector(`.${p.popup} > .${p.radio} input:checked`) ||
              l.querySelector(`.${p.popup} > .${p.radio} input:first-child`)
            );
          case `range`:
            return l.querySelector(`.${p.popup} > .${p.range} input`);
          default:
            return l.querySelector(`.${p.popup} > .${p.input}`);
        }
      },
      Mh = (l) => {
        if ((l.focus(), l.type !== `file`)) {
          let u = l.value;
          ((l.value = ``), (l.value = u));
        }
      },
      _h = (l, u, f) => {
        if (!l || !u) return;
        let g = typeof u == `string` ? u.split(/\s+/).filter(Boolean) : u;
        (Array.isArray(l) ? l : [l]).forEach((D) => {
          g.forEach((x) => {
            f ? D.classList.add(x) : D.classList.remove(x);
          });
        });
      },
      K = (l, u) => {
        _h(l, u, !0);
      },
      ut = (l, u) => {
        _h(l, u, !1);
      },
      Sn = (l, u) => Array.from(l.children).find((f) => f instanceof HTMLElement && tn(f, u)),
      Jn = (l, u, f) => {
        (f === `${parseInt(`${f}`)}` && (f = parseInt(f)),
          f || f === 0
            ? l.style.setProperty(u, typeof f == `number` ? `${f}px` : f)
            : l.style.removeProperty(u));
      },
      Re = (l, u = `flex`) => {
        l && (l.style.display = u);
      },
      $e = (l) => {
        l && (l.style.display = `none`);
      },
      $l = (l, u = `block`) => {
        l &&
          new MutationObserver(() => {
            Jo(l, l.innerHTML, u);
          }).observe(l, { childList: !0, subtree: !0 });
      },
      Nh = (l, u, f, g) => {
        let v = l.querySelector(u);
        v && v.style.setProperty(f, g);
      },
      Jo = (l, u, f = `flex`) => {
        u ? Re(l, f) : $e(l);
      },
      Ze = (l) => !!(l && (l.offsetWidth || l.offsetHeight || l.getClientRects().length)),
      NE = () => !Ze(Pt()) && !Ze(Xn()) && !Ze(Gr()),
      zl = (l) => l.scrollHeight > l.clientHeight,
      AE = (l, u) => {
        let f = l;
        for (; f && f !== u;) {
          if (zl(f)) return !0;
          f = f.parentElement;
        }
        return !1;
      },
      Ah = (l) => {
        let u = window.getComputedStyle(l),
          f = parseFloat(u.getPropertyValue(`animation-duration`) || `0`),
          g = parseFloat(u.getPropertyValue(`transition-duration`) || `0`);
        return f > 0 || g > 0;
      },
      ql = (l, u = !1) => {
        let f = Rs();
        f &&
          Ze(f) &&
          (u && ((f.style.transition = `none`), (f.style.width = `100%`)),
          setTimeout(() => {
            ((f.style.transition = `width ${l / 1e3}s linear`), (f.style.width = `0%`));
          }, 10));
      },
      RE = () => {
        let l = Rs();
        if (!l) return;
        let u = parseInt(window.getComputedStyle(l).width);
        (l.style.removeProperty(`transition`), (l.style.width = `100%`));
        let g = (u / parseInt(window.getComputedStyle(l).width)) * 100;
        l.style.width = `${g}%`;
      },
      xE = () => typeof window > `u` || typeof document > `u`,
      OE = `
 <div aria-labelledby="${p.title}" aria-describedby="${p[`html-container`]}" class="${p.popup}" tabindex="-1">
   <button type="button" class="${p.close}"></button>
   <ul class="${p[`progress-steps`]}"></ul>
   <div class="${p.icon}"></div>
   <img class="${p.image}" />
   <h2 class="${p.title}" id="${p.title}"></h2>
   <div class="${p[`html-container`]}" id="${p[`html-container`]}"></div>
   <input class="${p.input}" id="${p.input}" />
   <input type="file" class="${p.file}" />
   <div class="${p.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${p.select}" id="${p.select}"></select>
   <div class="${p.radio}"></div>
   <label class="${p.checkbox}">
     <input type="checkbox" id="${p.checkbox}" />
     <span class="${p.label}"></span>
   </label>
   <textarea class="${p.textarea}" id="${p.textarea}"></textarea>
   <div class="${p[`validation-message`]}" id="${p[`validation-message`]}"></div>
   <div class="${p.actions}">
     <div class="${p.loader}"></div>
     <button type="button" class="${p.confirm}"></button>
     <button type="button" class="${p.deny}"></button>
     <button type="button" class="${p.cancel}"></button>
   </div>
   <div class="${p.footer}"></div>
   <div class="${p[`timer-progress-bar-container`]}">
     <div class="${p[`timer-progress-bar`]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, ``),
      kE = () => {
        let l = Oe();
        return l
          ? (l.remove(),
            ut(
              [document.documentElement, document.body],
              [p[`no-backdrop`], p[`toast-shown`], p[`has-column`]],
            ),
            !0)
          : !1;
      },
      er = () => {
        s.currentInstance && s.currentInstance.resetValidationMessage();
      },
      PE = () => {
        let l = W();
        if (!l) return;
        let u = Sn(l, p.input),
          f = Sn(l, p.file),
          g = l.querySelector(`.${p.range} input`),
          v = l.querySelector(`.${p.range} output`),
          D = Sn(l, p.select),
          x = l.querySelector(`.${p.checkbox} input`),
          G = Sn(l, p.textarea);
        (u && (u.oninput = er),
          f && (f.onchange = er),
          D && (D.onchange = er),
          x && (x.onchange = er),
          G && (G.oninput = er),
          g &&
            v &&
            ((g.oninput = () => {
              (er(), (v.value = g.value));
            }),
            (g.onchange = () => {
              (er(), (v.value = g.value));
            })));
      },
      LE = (l) => {
        if (typeof l == `string`) {
          let u = document.querySelector(l);
          if (!u) throw new Error(`Target element "${l}" not found`);
          return u;
        }
        return l;
      },
      FE = (l) => {
        let u = W();
        u &&
          (u.setAttribute(`role`, l.toast ? `alert` : `dialog`),
          u.setAttribute(`aria-live`, l.toast ? `polite` : `assertive`),
          l.toast || u.setAttribute(`aria-modal`, `true`));
      },
      jE = (l) => {
        window.getComputedStyle(l).direction === `rtl` && (K(Oe(), p.rtl), (s.isRTL = !0));
      },
      BE = (l) => {
        let u = kE();
        if (xE()) {
          _(`SweetAlert2 requires document to initialize`);
          return;
        }
        let f = document.createElement(`div`);
        ((f.className = p.container),
          u && K(f, p[`no-transition`]),
          tt(f, OE),
          (f.dataset.swal2Theme = l.theme));
        let g = LE(l.target || `body`);
        (g.appendChild(f),
          l.topLayer && (f.setAttribute(`popover`, ``), f.showPopover()),
          FE(l),
          jE(g),
          PE());
      },
      Gl = (l, u) => {
        l instanceof HTMLElement
          ? u.appendChild(l)
          : typeof l == `object`
            ? UE(l, u)
            : l && tt(u, l);
      },
      UE = (l, u) => {
        `jquery` in l ? VE(u, l) : tt(u, l.toString());
      },
      VE = (l, u) => {
        if (((l.textContent = ``), 0 in u))
          for (let f = 0; f in u; f++) l.appendChild(u[f].cloneNode(!0));
        else l.appendChild(u.cloneNode(!0));
      },
      HE = (l, u) => {
        let f = Xo(),
          g = Wr();
        !f ||
          !g ||
          (!u.showConfirmButton && !u.showDenyButton && !u.showCancelButton ? $e(f) : Re(f),
          nt(f, u, `actions`),
          $E(f, g, u),
          tt(g, u.loaderHtml || ``),
          nt(g, u, `loader`));
      };
    function $E(l, u, f) {
      let g = Pt(),
        v = Xn(),
        D = Gr();
      !g ||
        !v ||
        !D ||
        (Wl(g, `confirm`, f),
        Wl(v, `deny`, f),
        Wl(D, `cancel`, f),
        zE(g, v, D, f),
        f.reverseButtons &&
          (f.toast
            ? (l.insertBefore(D, g), l.insertBefore(v, g))
            : (l.insertBefore(D, u), l.insertBefore(v, u), l.insertBefore(g, u))));
    }
    function zE(l, u, f, g) {
      if (!g.buttonsStyling) {
        ut([l, u, f], p.styled);
        return;
      }
      (K([l, u, f], p.styled),
        [
          [l, `confirm`, g.confirmButtonColor],
          [u, `deny`, g.denyButtonColor],
          [f, `cancel`, g.cancelButtonColor],
        ].forEach(([D, x, G]) => {
          (G && D.style.setProperty(`--swal2-${x}-button-background-color`, G), qE(D));
        }));
    }
    function qE(l) {
      let u = window.getComputedStyle(l);
      if (u.getPropertyValue(`--swal2-action-button-focus-box-shadow`)) return;
      let f = u.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/, `rgba($1, $2, $3, 0.5)`);
      l.style.setProperty(
        `--swal2-action-button-focus-box-shadow`,
        u.getPropertyValue(`--swal2-outline`).replace(/ rgba\(.*/, ` ${f}`),
      );
    }
    function Wl(l, u, f) {
      let g = T(u);
      (Jo(l, f[`show${g}Button`], `inline-block`),
        tt(l, f[`${u}ButtonText`] || ``),
        l.setAttribute(`aria-label`, f[`${u}ButtonAriaLabel`] || ``),
        (l.className = p[u]),
        nt(l, f, `${u}Button`));
    }
    let GE = (l, u) => {
        let f = Ul();
        f &&
          (tt(f, u.closeButtonHtml || ``),
          nt(f, u, `closeButton`),
          Jo(f, u.showCloseButton),
          f.setAttribute(`aria-label`, u.closeButtonAriaLabel || ``));
      },
      WE = (l, u) => {
        let f = Oe();
        f && (YE(f, u.backdrop), ZE(f, u.position), KE(f, u.grow), nt(f, u, `container`));
      };
    function YE(l, u) {
      typeof u == `string`
        ? (l.style.background = u)
        : u || K([document.documentElement, document.body], p[`no-backdrop`]);
    }
    function ZE(l, u) {
      u &&
        (u in p
          ? K(l, p[u])
          : (E(`The "position" parameter is not valid, defaulting to "center"`), K(l, p.center)));
    }
    function KE(l, u) {
      u && K(l, p[`grow-${u}`]);
    }
    var te = {
      innerParams: /* @__PURE__ */ new WeakMap(),
      domCache: /* @__PURE__ */ new WeakMap(),
      focusedElement: /* @__PURE__ */ new WeakMap(),
    };
    let QE = [`input`, `file`, `range`, `select`, `radio`, `checkbox`, `textarea`],
      XE = (l, u) => {
        let f = W();
        if (!f) return;
        let g = te.innerParams.get(l),
          v = !g || u.input !== g.input;
        (QE.forEach((D) => {
          let x = Sn(f, p[D]);
          x && (tC(D, u.inputAttributes), (x.className = p[D]), v && $e(x));
        }),
          u.input && (v && JE(u), nC(u)));
      },
      JE = (l) => {
        if (!l.input) return;
        if (!Ie[l.input]) {
          _(`Unexpected type of input! Expected ${Object.keys(Ie).join(` | `)}, got "${l.input}"`);
          return;
        }
        let u = Rh(l.input);
        if (!u) return;
        let f = Ie[l.input](u, l);
        (Re(u),
          l.inputAutoFocus &&
            setTimeout(() => {
              Mh(f);
            }));
      },
      eC = (l) => {
        for (let { name: u } of Array.from(l.attributes))
          [`id`, `type`, `value`, `style`].includes(u) || l.removeAttribute(u);
      },
      tC = (l, u) => {
        let f = W();
        if (!f) return;
        let g = Os(f, l);
        if (g) {
          eC(g);
          for (let v in u) g.setAttribute(v, u[v]);
        }
      },
      nC = (l) => {
        if (!l.input) return;
        let u = Rh(l.input);
        u && nt(u, l, `input`);
      },
      Yl = (l, u) => {
        !l.placeholder && u.inputPlaceholder && (l.placeholder = u.inputPlaceholder);
      },
      ei = (l, u, f) => {
        if (f.inputLabel) {
          let g = document.createElement(`label`),
            v = p[`input-label`];
          (g.setAttribute(`for`, l.id),
            (g.className = v),
            typeof f.customClass == `object` && K(g, f.customClass.inputLabel),
            (g.innerText = f.inputLabel),
            u.insertAdjacentElement(`beforebegin`, g));
        }
      },
      Rh = (l) => {
        let u = W();
        if (u) return Sn(u, p[l] || p.input);
      },
      ks = (l, u) => {
        [`string`, `number`].includes(typeof u)
          ? (l.value = `${u}`)
          : Ot(u) ||
            E(
              `Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof u}"`,
            );
      },
      Ie = {};
    ((Ie.text =
      Ie.email =
      Ie.password =
      Ie.number =
      Ie.tel =
      Ie.url =
      Ie.search =
      Ie.date =
      Ie[`datetime-local`] =
      Ie.time =
      Ie.week =
      Ie.month =
        (l, u) => {
          let f = l;
          return (ks(f, u.inputValue), ei(f, f, u), Yl(f, u), (f.type = u.input), f);
        }),
      (Ie.file = (l, u) => {
        let f = l;
        return (ei(f, f, u), Yl(f, u), f);
      }),
      (Ie.range = (l, u) => {
        let f = l,
          g = f.querySelector(`input`),
          v = f.querySelector(`output`);
        return (
          g && (ks(g, u.inputValue), (g.type = u.input), ei(g, l, u)),
          v && ks(v, u.inputValue),
          l
        );
      }),
      (Ie.select = (l, u) => {
        let f = l;
        if (((f.textContent = ``), u.inputPlaceholder)) {
          let g = document.createElement(`option`);
          (tt(g, u.inputPlaceholder),
            (g.value = ``),
            (g.disabled = !0),
            (g.selected = !0),
            f.appendChild(g));
        }
        return (ei(f, f, u), f);
      }),
      (Ie.radio = (l) => {
        let u = l;
        return ((u.textContent = ``), l);
      }),
      (Ie.checkbox = (l, u) => {
        let f = W();
        if (!f) throw new Error(`Popup not found`);
        let g = Os(f, `checkbox`);
        if (!g) throw new Error(`Checkbox input not found`);
        ((g.value = `1`), (g.checked = !!u.inputValue));
        let D = l.querySelector(`span`);
        if (D) {
          let x = u.inputPlaceholder || u.inputLabel;
          x && tt(D, x);
        }
        return g;
      }),
      (Ie.textarea = (l, u) => {
        let f = l;
        (ks(f, u.inputValue), Yl(f, u), ei(f, f, u));
        let g = (v) =>
          parseInt(window.getComputedStyle(v).marginLeft) +
          parseInt(window.getComputedStyle(v).marginRight);
        return (
          setTimeout(() => {
            if (`MutationObserver` in window) {
              let v = W();
              if (!v) return;
              let D = parseInt(window.getComputedStyle(v).width),
                x = () => {
                  if (!document.body.contains(f)) return;
                  let G = f.offsetWidth + g(f),
                    oe = W();
                  oe && (G > D ? (oe.style.width = `${G}px`) : Jn(oe, `width`, u.width));
                };
              new MutationObserver(x).observe(f, { attributes: !0, attributeFilter: [`style`] });
            }
          }),
          f
        );
      }));
    let rC = (l, u) => {
        let f = jl();
        f &&
          ($l(f),
          nt(f, u, `htmlContainer`),
          u.html
            ? (Gl(u.html, f), Re(f, `block`))
            : u.text
              ? ((f.textContent = u.text), Re(f, `block`))
              : $e(f),
          XE(l, u));
      },
      oC = (l, u) => {
        let f = Sh();
        f && ($l(f), Jo(f, !!u.footer, `block`), u.footer && Gl(u.footer, f), nt(f, u, `footer`));
      },
      iC = (l, u) => {
        let f = te.innerParams.get(l),
          g = qr();
        if (!g) return;
        if (f && u.icon === f.icon) {
          (kh(g, u), xh(g, u));
          return;
        }
        if (!u.icon && !u.iconHtml) {
          $e(g);
          return;
        }
        if (u.icon && Object.keys(y).indexOf(u.icon) === -1) {
          (_(
            `Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${u.icon}"`,
          ),
            $e(g));
          return;
        }
        (Re(g),
          kh(g, u),
          xh(g, u),
          K(g, u.showClass && u.showClass.icon),
          window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`, Oh));
      },
      xh = (l, u) => {
        for (let [f, g] of Object.entries(y)) u.icon !== f && ut(l, g);
        (K(l, u.icon && y[u.icon]), cC(l, u), Oh(), nt(l, u, `icon`));
      },
      Oh = () => {
        let l = W();
        if (!l) return;
        let u = window.getComputedStyle(l).getPropertyValue(`background-color`);
        l.querySelectorAll(`[class^=swal2-success-circular-line], .swal2-success-fix`).forEach(
          (g) => {
            g.style.backgroundColor = u;
          },
        );
      },
      sC = (l) => `
  ${l.animation ? `<div class="swal2-success-circular-line-left"></div>` : ``}
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div>
  ${l.animation ? `<div class="swal2-success-fix"></div>` : ``}
  ${l.animation ? `<div class="swal2-success-circular-line-right"></div>` : ``}
`,
      aC = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`,
      kh = (l, u) => {
        if (!u.icon && !u.iconHtml) return;
        let f = l.innerHTML,
          g = ``;
        (u.iconHtml
          ? (g = Ph(u.iconHtml))
          : u.icon === `success`
            ? ((g = sC(u)), (f = f.replace(/ style=".*?"/g, ``)))
            : u.icon === `error`
              ? (g = aC)
              : u.icon && (g = Ph({ question: `?`, warning: `!`, info: `i` }[u.icon])),
          f.trim() !== g.trim() && tt(l, g));
      },
      cC = (l, u) => {
        if (u.iconColor) {
          ((l.style.color = u.iconColor), (l.style.borderColor = u.iconColor));
          for (let f of [
            `.swal2-success-line-tip`,
            `.swal2-success-line-long`,
            `.swal2-x-mark-line-left`,
            `.swal2-x-mark-line-right`,
          ])
            Nh(l, f, `background-color`, u.iconColor);
          Nh(l, `.swal2-success-ring`, `border-color`, u.iconColor);
        }
      },
      Ph = (l) => `<div class="${p[`icon-content`]}">${l}</div>`,
      lC = (l, u) => {
        let f = Th();
        if (f) {
          if (!u.imageUrl) {
            $e(f);
            return;
          }
          (Re(f, ``),
            f.setAttribute(`src`, u.imageUrl),
            f.setAttribute(`alt`, u.imageAlt || ``),
            Jn(f, `width`, u.imageWidth),
            Jn(f, `height`, u.imageHeight),
            (f.className = p.image),
            nt(f, u, `image`));
        }
      },
      Zl = !1,
      Lh = 0,
      Fh = 0,
      jh = 0,
      Bh = 0,
      uC = (l) => {
        (l.addEventListener(`mousedown`, Ps),
          document.body.addEventListener(`mousemove`, Ls),
          l.addEventListener(`mouseup`, Fs),
          l.addEventListener(`touchstart`, Ps),
          document.body.addEventListener(`touchmove`, Ls),
          l.addEventListener(`touchend`, Fs));
      },
      dC = (l) => {
        (l.removeEventListener(`mousedown`, Ps),
          document.body.removeEventListener(`mousemove`, Ls),
          l.removeEventListener(`mouseup`, Fs),
          l.removeEventListener(`touchstart`, Ps),
          document.body.removeEventListener(`touchmove`, Ls),
          l.removeEventListener(`touchend`, Fs));
      },
      Ps = (l) => {
        let u = W();
        if (!u) return;
        let f = qr();
        if (l.target === u || (f && f.contains(l.target))) {
          Zl = !0;
          let g = Uh(l);
          ((Lh = g.clientX),
            (Fh = g.clientY),
            (jh = parseInt(u.style.insetInlineStart) || 0),
            (Bh = parseInt(u.style.insetBlockStart) || 0),
            K(u, `swal2-dragging`));
        }
      },
      Ls = (l) => {
        let u = W();
        if (u && Zl) {
          let { clientX: f, clientY: g } = Uh(l),
            v = f - Lh;
          ((u.style.insetInlineStart = `${jh + (s.isRTL ? -v : v)}px`),
            (u.style.insetBlockStart = `${Bh + (g - Fh)}px`));
        }
      },
      Fs = () => {
        let l = W();
        ((Zl = !1), ut(l, `swal2-dragging`));
      },
      Uh = (l) => {
        let u = l.type.startsWith(`touch`) ? l.touches[0] : l;
        return { clientX: u.clientX, clientY: u.clientY };
      },
      fC = (l, u) => {
        let f = Oe(),
          g = W();
        if (!(!f || !g)) {
          if (u.toast) {
            (Jn(f, `width`, u.width), (g.style.width = `100%`));
            let v = Wr();
            v && g.insertBefore(v, qr());
          } else Jn(g, `width`, u.width);
          (Jn(g, `padding`, u.padding),
            u.color && (g.style.color = u.color),
            u.background && (g.style.background = u.background),
            $e(As()),
            pC(g, u),
            u.draggable && !u.toast ? (K(g, p.draggable), uC(g)) : (ut(g, p.draggable), dC(g)));
        }
      },
      pC = (l, u) => {
        let f = u.showClass || {};
        ((l.className = `${p.popup} ${Ze(l) ? f.popup : ``}`),
          u.toast
            ? (K([document.documentElement, document.body], p[`toast-shown`]), K(l, p.toast))
            : K(l, p.modal),
          nt(l, u, `popup`),
          typeof u.customClass == `string` && K(l, u.customClass),
          u.icon && K(l, p[`icon-${u.icon}`]));
      },
      hC = (l, u) => {
        let f = Bl();
        if (!f) return;
        let { progressSteps: g, currentProgressStep: v } = u;
        if (!g || g.length === 0 || v === void 0) {
          $e(f);
          return;
        }
        (Re(f),
          (f.textContent = ``),
          v >= g.length &&
            E(
              `Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)`,
            ),
          g.forEach((D, x) => {
            let G = gC(D);
            if (
              (f.appendChild(G), x === v && K(G, p[`active-progress-step`]), x !== g.length - 1)
            ) {
              let oe = mC(u);
              f.appendChild(oe);
            }
          }));
      },
      gC = (l) => {
        let u = document.createElement(`li`);
        return (K(u, p[`progress-step`]), tt(u, l), u);
      },
      mC = (l) => {
        let u = document.createElement(`li`);
        return (
          K(u, p[`progress-step-line`]),
          l.progressStepsDistance && Jn(u, `width`, l.progressStepsDistance),
          u
        );
      },
      yC = (l, u) => {
        let f = Ih();
        f &&
          ($l(f),
          Jo(f, !!(u.title || u.titleText), `block`),
          u.title && Gl(u.title, f),
          u.titleText && (f.innerText = u.titleText),
          nt(f, u, `title`));
      },
      Vh = (l, u) => {
        var f;
        (fC(l, u),
          WE(l, u),
          hC(l, u),
          iC(l, u),
          lC(l, u),
          yC(l, u),
          GE(l, u),
          rC(l, u),
          HE(l, u),
          oC(l, u));
        let g = W();
        (typeof u.didRender == `function` && g && u.didRender(g),
          (f = s.eventEmitter) === null || f === void 0 || f.emit(`didRender`, g));
      },
      vC = () => Ze(W()),
      Hh = () => {
        var l;
        return (l = Pt()) === null || l === void 0 ? void 0 : l.click();
      },
      wC = () => {
        var l;
        return (l = Xn()) === null || l === void 0 ? void 0 : l.click();
      },
      bC = () => {
        var l;
        return (l = Gr()) === null || l === void 0 ? void 0 : l.click();
      },
      Yr = Object.freeze({
        cancel: `cancel`,
        backdrop: `backdrop`,
        close: `close`,
        esc: `esc`,
        timer: `timer`,
      }),
      $h = (l) => {
        if (l.keydownTarget && l.keydownHandlerAdded && l.keydownHandler) {
          let u = l.keydownHandler;
          (l.keydownTarget.removeEventListener(`keydown`, u, { capture: l.keydownListenerCapture }),
            (l.keydownHandlerAdded = !1));
        }
      },
      DC = (l, u, f) => {
        if (($h(l), !u.toast)) {
          let g = (D) => CC(u, D, f);
          l.keydownHandler = g;
          let v = u.keydownListenerCapture ? window : W();
          if (v) {
            ((l.keydownTarget = v), (l.keydownListenerCapture = u.keydownListenerCapture));
            let D = g;
            (l.keydownTarget.addEventListener(`keydown`, D, { capture: l.keydownListenerCapture }),
              (l.keydownHandlerAdded = !0));
          }
        }
      },
      Kl = (l, u) => {
        var f;
        let g = Vl();
        return g.length
          ? ((l = l + u),
            l === -2 && (l = g.length - 1),
            l === g.length ? (l = 0) : l === -1 && (l = g.length - 1),
            g[l].focus(),
            !(kt() && g[l] instanceof HTMLIFrameElement))
          : ((f = W()) === null || f === void 0 || f.focus(), !0);
      },
      zh = [`ArrowRight`, `ArrowDown`],
      EC = [`ArrowLeft`, `ArrowUp`],
      CC = (l, u, f) => {
        l &&
          (u.isComposing ||
            u.keyCode === 229 ||
            (l.stopKeydownPropagation && u.stopPropagation(),
            u.key === `Enter`
              ? IC(u, l)
              : u.key === `Tab`
                ? TC(u)
                : [...zh, ...EC].includes(u.key)
                  ? SC(u.key)
                  : u.key === `Escape` && MC(u, l, f)));
      },
      IC = (l, u) => {
        if (!et(u.allowEnterKey)) return;
        let f = W();
        if (!f || !u.input) return;
        let g = Os(f, u.input);
        if (
          l.target &&
          g &&
          l.target instanceof HTMLElement &&
          l.target.outerHTML === g.outerHTML
        ) {
          if ([`textarea`, `file`].includes(u.input)) return;
          (Hh(), l.preventDefault());
        }
      },
      TC = (l) => {
        let u = l.target,
          g = Vl().findIndex((D) => D === u),
          v = !0;
        (l.shiftKey ? (v = Kl(g, -1)) : (v = Kl(g, 1)),
          l.stopPropagation(),
          v && l.preventDefault());
      },
      SC = (l) => {
        let u = Xo(),
          f = Pt(),
          g = Xn(),
          v = Gr();
        if (!u || !f || !g || !v) return;
        let D = [f, g, v];
        if (document.activeElement instanceof HTMLElement && !D.includes(document.activeElement))
          return;
        let x = zh.includes(l) ? `nextElementSibling` : `previousElementSibling`,
          G = document.activeElement;
        if (G) {
          for (let oe = 0; oe < u.children.length; oe++) {
            if (((G = G[x]), !G)) return;
            if (G instanceof HTMLButtonElement && Ze(G)) break;
          }
          G instanceof HTMLButtonElement && G.focus();
        }
      },
      MC = (l, u, f) => {
        (l.preventDefault(), et(u.allowEscapeKey) && f(Yr.esc));
      };
    var Zr = {
      swalPromiseResolve: /* @__PURE__ */ new WeakMap(),
      swalPromiseReject: /* @__PURE__ */ new WeakMap(),
    };
    let _C = () => {
        let l = Oe();
        Array.from(document.body.children).forEach((f) => {
          f.contains(l) ||
            (f.hasAttribute(`aria-hidden`) &&
              f.setAttribute(`data-previous-aria-hidden`, f.getAttribute(`aria-hidden`) || ``),
            f.setAttribute(`aria-hidden`, `true`));
        });
      },
      qh = () => {
        Array.from(document.body.children).forEach((u) => {
          u.hasAttribute(`data-previous-aria-hidden`)
            ? (u.setAttribute(`aria-hidden`, u.getAttribute(`data-previous-aria-hidden`) || ``),
              u.removeAttribute(`data-previous-aria-hidden`))
            : u.removeAttribute(`aria-hidden`);
        });
      },
      Ql = typeof window < `u` && !!window.GestureEvent,
      NC = Ql && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
      AC = () => {
        if (Ql && !tn(document.body, p.iosfix)) {
          let l = document.body.scrollTop;
          ((document.body.style.top = `${l * -1}px`), K(document.body, p.iosfix), RC());
        }
      },
      RC = () => {
        let l = Oe();
        if (!l) return;
        let u;
        ((l.ontouchstart = (f) => {
          u = xC(f);
        }),
          (l.ontouchmove = (f) => {
            u && (f.preventDefault(), f.stopPropagation());
          }));
      },
      xC = (l) => {
        let u = l.target,
          f = Oe(),
          g = jl();
        return !f || !g || OC(l) || kC(l)
          ? !1
          : u === f ||
              (!zl(f) &&
                u instanceof HTMLElement &&
                !AE(u, g) &&
                u.tagName !== `INPUT` &&
                u.tagName !== `TEXTAREA` &&
                !(zl(g) && g.contains(u)));
      },
      OC = (l) => !!(l.touches && l.touches.length && l.touches[0].touchType === `stylus`),
      kC = (l) => l.touches && l.touches.length > 1,
      PC = () => {
        if (tn(document.body, p.iosfix)) {
          let l = parseInt(document.body.style.top, 10);
          (ut(document.body, p.iosfix),
            (document.body.style.top = ``),
            (document.body.scrollTop = l * -1));
        }
      },
      LC = () => {
        let l = document.createElement(`div`);
        ((l.className = p[`scrollbar-measure`]), document.body.appendChild(l));
        let u = l.getBoundingClientRect().width - l.clientWidth;
        return (document.body.removeChild(l), u);
      },
      Kr = null,
      FC = (l) => {
        Kr === null &&
          (document.body.scrollHeight > window.innerHeight || l === `scroll`) &&
          ((Kr = parseInt(
            window.getComputedStyle(document.body).getPropertyValue(`padding-right`),
          )),
          (document.body.style.paddingRight = `${Kr + LC()}px`));
      },
      jC = () => {
        Kr !== null && ((document.body.style.paddingRight = `${Kr}px`), (Kr = null));
      };
    function Gh(l, u, f, g) {
      (xs() ? Yh(l, g) : (c(f).then(() => Yh(l, g)), $h(s)),
        Ql
          ? (u.setAttribute(`style`, `display:none !important`),
            u.removeAttribute(`class`),
            (u.innerHTML = ``))
          : u.remove(),
        Hl() && (jC(), PC(), qh()),
        BC());
    }
    function BC() {
      ut(
        [document.documentElement, document.body],
        [p.shown, p[`height-auto`], p[`no-backdrop`], p[`toast-shown`]],
      );
    }
    function Mn(l) {
      l = VC(l);
      let u = Zr.swalPromiseResolve.get(this),
        f = UC(this);
      this.isAwaitingPromise ? l.isDismissed || (ti(this), u(l)) : f && u(l);
    }
    let UC = (l) => {
      let u = W();
      if (!u) return !1;
      let f = te.innerParams.get(l);
      if (!f || tn(u, f.hideClass.popup)) return !1;
      (ut(u, f.showClass.popup), K(u, f.hideClass.popup));
      let g = Oe();
      return (ut(g, f.showClass.backdrop), K(g, f.hideClass.backdrop), HC(l, u, f), !0);
    };
    function Wh(l) {
      let u = Zr.swalPromiseReject.get(this);
      (ti(this), u && u(l));
    }
    let ti = (l) => {
        l.isAwaitingPromise && (delete l.isAwaitingPromise, te.innerParams.get(l) || l._destroy());
      },
      VC = (l) =>
        typeof l > `u`
          ? { isConfirmed: !1, isDenied: !1, isDismissed: !0 }
          : Object.assign({ isConfirmed: !1, isDenied: !1, isDismissed: !1 }, l),
      HC = (l, u, f) => {
        var g;
        let v = Oe(),
          D = Ah(u);
        (typeof f.willClose == `function` && f.willClose(u),
          (g = s.eventEmitter) === null || g === void 0 || g.emit(`willClose`, u),
          D && v
            ? $C(l, u, v, !!f.returnFocus, f.didClose)
            : v && Gh(l, v, !!f.returnFocus, f.didClose));
      },
      $C = (l, u, f, g, v) => {
        s.swalCloseEventFinishedCallback = Gh.bind(null, l, f, g, v);
        let D = function (x) {
          if (x.target === u) {
            var G;
            ((G = s.swalCloseEventFinishedCallback) === null || G === void 0 || G.call(s),
              delete s.swalCloseEventFinishedCallback,
              u.removeEventListener(`animationend`, D),
              u.removeEventListener(`transitionend`, D));
          }
        };
        (u.addEventListener(`animationend`, D), u.addEventListener(`transitionend`, D));
      },
      Yh = (l, u) => {
        setTimeout(() => {
          var f;
          (typeof u == `function` && u.bind(l.params)(),
            (f = s.eventEmitter) === null || f === void 0 || f.emit(`didClose`),
            l._destroy && l._destroy());
        });
      },
      Qr = (l) => {
        let u = W();
        if ((u || new Hs(), (u = W()), !u)) return;
        let f = Wr();
        (xs() ? $e(qr()) : zC(u, l),
          Re(f),
          u.setAttribute(`data-loading`, `true`),
          u.setAttribute(`aria-busy`, `true`),
          u.focus());
      },
      zC = (l, u) => {
        let f = Xo(),
          g = Wr();
        !f ||
          !g ||
          (!u && Ze(Pt()) && (u = Pt()),
          Re(f),
          u && ($e(u), g.setAttribute(`data-button-to-replace`, u.className), f.insertBefore(g, u)),
          K([l, f], p.loading));
      },
      qC = (l, u) => {
        u.input === `select` || u.input === `radio`
          ? KC(l, u)
          : [`text`, `email`, `number`, `tel`, `textarea`].some((f) => f === u.input) &&
            (Jt(u.inputValue) || Ot(u.inputValue)) &&
            (Qr(Pt()), QC(l, u));
      },
      GC = (l, u) => {
        let f = l.getInput();
        if (!f) return null;
        switch (u.input) {
          case `checkbox`:
            return WC(f);
          case `radio`:
            return YC(f);
          case `file`:
            return ZC(f);
          default:
            return u.inputAutoTrim ? f.value.trim() : f.value;
        }
      },
      WC = (l) => (l.checked ? 1 : 0),
      YC = (l) => (l.checked ? l.value : null),
      ZC = (l) =>
        l.files && l.files.length
          ? l.getAttribute(`multiple`) !== null
            ? l.files
            : l.files[0]
          : null,
      KC = (l, u) => {
        let f = W();
        if (!f) return;
        let g = (v) => {
          u.input === `select` ? XC(f, Xl(v), u) : u.input === `radio` && JC(f, Xl(v), u);
        };
        Jt(u.inputOptions) || Ot(u.inputOptions)
          ? (Qr(Pt()),
            Et(u.inputOptions).then((v) => {
              (l.hideLoading(), g(v));
            }))
          : typeof u.inputOptions == `object`
            ? g(u.inputOptions)
            : _(
                `Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof u.inputOptions}`,
              );
      },
      QC = (l, u) => {
        let f = l.getInput();
        f &&
          ($e(f),
          Et(u.inputValue)
            .then((g) => {
              ((f.value = u.input === `number` ? `${parseFloat(g) || 0}` : `${g}`),
                Re(f),
                f.focus(),
                l.hideLoading());
            })
            .catch((g) => {
              (_(`Error in inputValue promise: ${g}`),
                (f.value = ``),
                Re(f),
                f.focus(),
                l.hideLoading());
            }));
      };
    function XC(l, u, f) {
      let g = Sn(l, p.select);
      if (!g) return;
      let v = (D, x, G) => {
        let oe = document.createElement(`option`);
        ((oe.value = G), tt(oe, x), (oe.selected = Zh(G, f.inputValue)), D.appendChild(oe));
      };
      (u.forEach((D) => {
        let x = D[0],
          G = D[1];
        if (Array.isArray(G)) {
          let oe = document.createElement(`optgroup`);
          ((oe.label = x),
            (oe.disabled = !1),
            g.appendChild(oe),
            G.forEach((Xr) => v(oe, Xr[1], Xr[0])));
        } else v(g, G, x);
      }),
        g.focus());
    }
    function JC(l, u, f) {
      let g = Sn(l, p.radio);
      if (!g) return;
      u.forEach((D) => {
        let x = D[0],
          G = D[1],
          oe = document.createElement(`input`),
          Xr = document.createElement(`label`);
        ((oe.type = `radio`),
          (oe.name = p.radio),
          (oe.value = x),
          Zh(x, f.inputValue) && (oe.checked = !0));
        let ru = document.createElement(`span`);
        (tt(ru, G),
          (ru.className = p.label),
          Xr.appendChild(oe),
          Xr.appendChild(ru),
          g.appendChild(Xr));
      });
      let v = g.querySelectorAll(`input`);
      v.length && v[0].focus();
    }
    let Xl = (l) =>
        (l instanceof Map ? Array.from(l) : Object.entries(l)).map(([f, g]) => [
          f,
          typeof g == `object` ? Xl(g) : g,
        ]),
      Zh = (l, u) => !!u && u != null && u.toString() === l.toString(),
      eI = (l) => {
        let u = te.innerParams.get(l);
        (l.disableButtons(), u.input ? Kh(l, `confirm`) : eu(l, !0));
      },
      tI = (l) => {
        let u = te.innerParams.get(l);
        (l.disableButtons(), u.returnInputValueOnDeny ? Kh(l, `deny`) : Jl(l, !1));
      },
      nI = (l, u) => {
        (l.disableButtons(), u(Yr.cancel));
      },
      Kh = (l, u) => {
        let f = te.innerParams.get(l);
        if (!f.input) {
          _(`The "input" parameter is needed to be set when using returnInputValueOn${T(u)}`);
          return;
        }
        let g = l.getInput(),
          v = GC(l, f);
        f.inputValidator
          ? rI(l, v, u)
          : g && !g.checkValidity()
            ? (l.enableButtons(),
              l.showValidationMessage(f.validationMessage || g.validationMessage))
            : u === `deny`
              ? Jl(l, v)
              : eu(l, v);
      },
      rI = (l, u, f) => {
        let g = te.innerParams.get(l);
        (l.disableInput(),
          Promise.resolve()
            .then(() => Et(g.inputValidator(u, g.validationMessage)))
            .then((D) => {
              (l.enableButtons(),
                l.enableInput(),
                D ? l.showValidationMessage(D) : f === `deny` ? Jl(l, u) : eu(l, u));
            }));
      },
      Jl = (l, u) => {
        let f = te.innerParams.get(l);
        (f.showLoaderOnDeny && Qr(Xn()),
          f.preDeny
            ? ((l.isAwaitingPromise = !0),
              Promise.resolve()
                .then(() => Et(f.preDeny(u, f.validationMessage)))
                .then((v) => {
                  v === !1
                    ? (l.hideLoading(), ti(l))
                    : l.close({ isDenied: !0, value: typeof v > `u` ? u : v });
                })
                .catch((v) => Xh(l, v)))
            : l.close({ isDenied: !0, value: u }));
      },
      Qh = (l, u) => {
        l.close({ isConfirmed: !0, value: u });
      },
      Xh = (l, u) => {
        l.rejectPromise(u);
      },
      eu = (l, u) => {
        let f = te.innerParams.get(l);
        (f.showLoaderOnConfirm && Qr(),
          f.preConfirm
            ? (l.resetValidationMessage(),
              (l.isAwaitingPromise = !0),
              Promise.resolve()
                .then(() => Et(f.preConfirm(u, f.validationMessage)))
                .then((v) => {
                  Ze(As()) || v === !1 ? (l.hideLoading(), ti(l)) : Qh(l, typeof v > `u` ? u : v);
                })
                .catch((v) => Xh(l, v)))
            : Qh(l, u));
      };
    function js() {
      let l = te.innerParams.get(this);
      if (!l) return;
      let u = te.domCache.get(this);
      ($e(u.loader),
        xs() ? l.icon && Re(qr()) : oI(u),
        ut([u.popup, u.actions], p.loading),
        u.popup.removeAttribute(`aria-busy`),
        u.popup.removeAttribute(`data-loading`),
        this.enableButtons());
    }
    let oI = (l) => {
      let u = l.loader.getAttribute(`data-button-to-replace`),
        f = u ? l.popup.getElementsByClassName(u) : [];
      f.length ? Re(f[0], `inline-block`) : NE() && $e(l.actions);
    };
    function Jh() {
      let l = te.innerParams.get(this),
        u = te.domCache.get(this);
      return u ? Os(u.popup, l.input) : null;
    }
    function eg(l, u, f) {
      let g = te.domCache.get(l);
      u.forEach((v) => {
        g[v].disabled = f;
      });
    }
    function tg(l, u) {
      let f = W();
      !f ||
        !l ||
        (l.type === `radio`
          ? f.querySelectorAll(`[name="${p.radio}"]`).forEach((v) => {
              v.disabled = u;
            })
          : (l.disabled = u));
    }
    function ng() {
      eg(this, [`confirmButton`, `denyButton`, `cancelButton`], !1);
      let l = te.focusedElement.get(this);
      (l instanceof HTMLElement && document.activeElement === document.body && l.focus(),
        te.focusedElement.delete(this));
    }
    function rg() {
      (te.focusedElement.set(this, document.activeElement),
        eg(this, [`confirmButton`, `denyButton`, `cancelButton`], !0));
    }
    function og() {
      tg(this.getInput(), !1);
    }
    function ig() {
      tg(this.getInput(), !0);
    }
    function sg(l) {
      let u = te.domCache.get(this),
        f = te.innerParams.get(this);
      (tt(u.validationMessage, l),
        (u.validationMessage.className = p[`validation-message`]),
        f.customClass &&
          f.customClass.validationMessage &&
          K(u.validationMessage, f.customClass.validationMessage),
        Re(u.validationMessage));
      let g = this.getInput();
      g &&
        (g.setAttribute(`aria-invalid`, `true`),
        g.setAttribute(`aria-describedby`, p[`validation-message`]),
        Mh(g),
        K(g, p.inputerror));
    }
    function ag() {
      let l = te.domCache.get(this);
      l.validationMessage && $e(l.validationMessage);
      let u = this.getInput();
      u &&
        (u.removeAttribute(`aria-invalid`),
        u.removeAttribute(`aria-describedby`),
        ut(u, p.inputerror));
    }
    let _n = {
        title: ``,
        titleText: ``,
        text: ``,
        html: ``,
        footer: ``,
        icon: void 0,
        iconColor: void 0,
        iconHtml: void 0,
        template: void 0,
        toast: !1,
        draggable: !1,
        animation: !0,
        theme: `light`,
        showClass: {
          popup: `swal2-show`,
          backdrop: `swal2-backdrop-show`,
          icon: `swal2-icon-show`,
        },
        hideClass: {
          popup: `swal2-hide`,
          backdrop: `swal2-backdrop-hide`,
          icon: `swal2-icon-hide`,
        },
        customClass: {},
        target: `body`,
        color: void 0,
        backdrop: !0,
        heightAuto: !0,
        allowOutsideClick: !0,
        allowEscapeKey: !0,
        allowEnterKey: !0,
        stopKeydownPropagation: !0,
        keydownListenerCapture: !1,
        showConfirmButton: !0,
        showDenyButton: !1,
        showCancelButton: !1,
        preConfirm: void 0,
        preDeny: void 0,
        confirmButtonText: `OK`,
        confirmButtonAriaLabel: ``,
        confirmButtonColor: void 0,
        denyButtonText: `No`,
        denyButtonAriaLabel: ``,
        denyButtonColor: void 0,
        cancelButtonText: `Cancel`,
        cancelButtonAriaLabel: ``,
        cancelButtonColor: void 0,
        buttonsStyling: !0,
        reverseButtons: !1,
        focusConfirm: !0,
        focusDeny: !1,
        focusCancel: !1,
        returnFocus: !0,
        showCloseButton: !1,
        closeButtonHtml: `&times;`,
        closeButtonAriaLabel: `Close this dialog`,
        loaderHtml: ``,
        showLoaderOnConfirm: !1,
        showLoaderOnDeny: !1,
        imageUrl: void 0,
        imageWidth: void 0,
        imageHeight: void 0,
        imageAlt: ``,
        timer: void 0,
        timerProgressBar: !1,
        width: void 0,
        padding: void 0,
        background: void 0,
        input: void 0,
        inputPlaceholder: ``,
        inputLabel: ``,
        inputValue: ``,
        inputOptions: {},
        inputAutoFocus: !0,
        inputAutoTrim: !0,
        inputAttributes: {},
        inputValidator: void 0,
        returnInputValueOnDeny: !1,
        validationMessage: void 0,
        grow: !1,
        position: `center`,
        progressSteps: [],
        currentProgressStep: void 0,
        progressStepsDistance: void 0,
        willOpen: void 0,
        didOpen: void 0,
        didRender: void 0,
        willClose: void 0,
        didClose: void 0,
        didDestroy: void 0,
        scrollbarPadding: !0,
        topLayer: !1,
      },
      iI = [
        `allowEscapeKey`,
        `allowOutsideClick`,
        `background`,
        `buttonsStyling`,
        `cancelButtonAriaLabel`,
        `cancelButtonColor`,
        `cancelButtonText`,
        `closeButtonAriaLabel`,
        `closeButtonHtml`,
        `color`,
        `confirmButtonAriaLabel`,
        `confirmButtonColor`,
        `confirmButtonText`,
        `currentProgressStep`,
        `customClass`,
        `denyButtonAriaLabel`,
        `denyButtonColor`,
        `denyButtonText`,
        `didClose`,
        `didDestroy`,
        `draggable`,
        `footer`,
        `hideClass`,
        `html`,
        `icon`,
        `iconColor`,
        `iconHtml`,
        `imageAlt`,
        `imageHeight`,
        `imageUrl`,
        `imageWidth`,
        `preConfirm`,
        `preDeny`,
        `progressSteps`,
        `returnFocus`,
        `reverseButtons`,
        `showCancelButton`,
        `showCloseButton`,
        `showConfirmButton`,
        `showDenyButton`,
        `text`,
        `title`,
        `titleText`,
        `theme`,
        `willClose`,
      ],
      sI = { allowEnterKey: void 0 },
      aI = [
        `allowOutsideClick`,
        `allowEnterKey`,
        `backdrop`,
        `draggable`,
        `focusConfirm`,
        `focusDeny`,
        `focusCancel`,
        `returnFocus`,
        `heightAuto`,
        `keydownListenerCapture`,
      ],
      cg = (l) => Object.prototype.hasOwnProperty.call(_n, l),
      lg = (l) => iI.indexOf(l) !== -1,
      ug = (l) => sI[l],
      cI = (l) => {
        cg(l) || E(`Unknown parameter "${l}"`);
      },
      lI = (l) => {
        aI.includes(l) && E(`The parameter "${l}" is incompatible with toasts`);
      },
      uI = (l) => {
        let u = ug(l);
        u && xt(l, u);
      },
      dg = (l) => {
        (l.backdrop === !1 &&
          l.allowOutsideClick &&
          E('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'),
          l.theme &&
            ![
              `light`,
              `dark`,
              `auto`,
              `minimal`,
              `borderless`,
              `bootstrap-4`,
              `bootstrap-4-light`,
              `bootstrap-4-dark`,
              `bootstrap-5`,
              `bootstrap-5-light`,
              `bootstrap-5-dark`,
              `material-ui`,
              `material-ui-light`,
              `material-ui-dark`,
              `embed-iframe`,
              `bulma`,
              `bulma-light`,
              `bulma-dark`,
            ].includes(l.theme) &&
            E(`Invalid theme "${l.theme}"`));
        for (let u in l) (cI(u), l.toast && lI(u), uI(u));
      };
    function fg(l) {
      let u = Oe(),
        f = W(),
        g = te.innerParams.get(this);
      if (!f || tn(f, g.hideClass.popup)) {
        E(
          `You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`,
        );
        return;
      }
      let v = dI(l),
        D = Object.assign({}, g, v);
      (dg(D),
        u && (u.dataset.swal2Theme = D.theme),
        Vh(this, D),
        te.innerParams.set(this, D),
        Object.defineProperties(this, {
          params: { value: Object.assign({}, this.params, l), writable: !1, enumerable: !0 },
        }));
    }
    let dI = (l) => {
      let u = {};
      return (
        Object.keys(l).forEach((f) => {
          if (lg(f)) u[f] = l[f];
          else E(`Invalid parameter to update: ${f}`);
        }),
        u
      );
    };
    function pg() {
      var l;
      let u = te.domCache.get(this),
        f = te.innerParams.get(this);
      if (!f) {
        hg(this);
        return;
      }
      (u.popup &&
        s.swalCloseEventFinishedCallback &&
        (s.swalCloseEventFinishedCallback(), delete s.swalCloseEventFinishedCallback),
        typeof f.didDestroy == `function` && f.didDestroy(),
        (l = s.eventEmitter) === null || l === void 0 || l.emit(`didDestroy`),
        fI(this));
    }
    let fI = (l) => {
        (hg(l),
          delete l.params,
          delete s.keydownHandler,
          delete s.keydownTarget,
          delete s.currentInstance);
      },
      hg = (l) => {
        l.isAwaitingPromise
          ? (tu(te, l), (l.isAwaitingPromise = !0))
          : (tu(Zr, l),
            tu(te, l),
            delete l.isAwaitingPromise,
            delete l.disableButtons,
            delete l.enableButtons,
            delete l.getInput,
            delete l.disableInput,
            delete l.enableInput,
            delete l.hideLoading,
            delete l.disableLoading,
            delete l.showValidationMessage,
            delete l.resetValidationMessage,
            delete l.close,
            delete l.closePopup,
            delete l.closeModal,
            delete l.closeToast,
            delete l.rejectPromise,
            delete l.update,
            delete l._destroy);
      },
      tu = (l, u) => {
        for (let f in l) l[f].delete(u);
      };
    var pI = Object.freeze({
      __proto__: null,
      _destroy: pg,
      close: Mn,
      closeModal: Mn,
      closePopup: Mn,
      closeToast: Mn,
      disableButtons: rg,
      disableInput: ig,
      disableLoading: js,
      enableButtons: ng,
      enableInput: og,
      getInput: Jh,
      handleAwaitingPromise: ti,
      hideLoading: js,
      rejectPromise: Wh,
      resetValidationMessage: ag,
      showValidationMessage: sg,
      update: fg,
    });
    let hI = (l, u, f) => {
        l.toast ? gI(l, u, f) : (yI(u), vI(u), wI(l, u, f));
      },
      gI = (l, u, f) => {
        u.popup.onclick = () => {
          (l && (mI(l) || l.timer || l.input)) || f(Yr.close);
        };
      },
      mI = (l) =>
        !!(l.showConfirmButton || l.showDenyButton || l.showCancelButton || l.showCloseButton),
      Bs = !1,
      yI = (l) => {
        l.popup.onmousedown = () => {
          l.container.onmouseup = function (u) {
            ((l.container.onmouseup = () => {}), u.target === l.container && (Bs = !0));
          };
        };
      },
      vI = (l) => {
        l.container.onmousedown = (u) => {
          (u.target === l.container && u.preventDefault(),
            (l.popup.onmouseup = function (f) {
              ((l.popup.onmouseup = () => {}),
                (f.target === l.popup ||
                  (f.target instanceof HTMLElement && l.popup.contains(f.target))) &&
                  (Bs = !0));
            }));
        };
      },
      wI = (l, u, f) => {
        u.container.onclick = (g) => {
          if (Bs) {
            Bs = !1;
            return;
          }
          g.target === u.container && et(l.allowOutsideClick) && f(Yr.backdrop);
        };
      },
      bI = (l) => typeof l == `object` && l !== null && `jquery` in l,
      gg = (l) => l instanceof Element || bI(l),
      DI = (l) => {
        let u = {};
        return (
          typeof l[0] == `object` && !gg(l[0])
            ? Object.assign(u, l[0])
            : [`title`, `html`, `icon`].forEach((f, g) => {
                let v = l[g];
                typeof v == `string` || gg(v)
                  ? (u[f] = v)
                  : v !== void 0 &&
                    _(`Unexpected type of ${f}! Expected "string" or "Element", got ${typeof v}`);
              }),
          u
        );
      };
    function EI(...l) {
      return new this(...l);
    }
    function CI(l) {
      class u extends this {
        _main(g, v) {
          return super._main(g, Object.assign({}, l, v));
        }
      }
      return u;
    }
    let II = () => s.timeout && s.timeout.getTimerLeft(),
      mg = () => {
        if (s.timeout) return (RE(), s.timeout.stop());
      },
      yg = () => {
        if (s.timeout) {
          let l = s.timeout.start();
          return (ql(l), l);
        }
      },
      TI = () => {
        let l = s.timeout;
        return l && (l.running ? mg() : yg());
      },
      SI = (l) => {
        if (s.timeout) {
          let u = s.timeout.increase(l);
          return (ql(u, !0), u);
        }
      },
      MI = () => !!(s.timeout && s.timeout.isRunning()),
      vg = !1,
      nu = {};
    function _I(l = `data-swal-template`) {
      ((nu[l] = this), vg || (document.body.addEventListener(`click`, NI), (vg = !0)));
    }
    let NI = (l) => {
      for (let u = l.target; u && u !== document; u = u.parentNode)
        for (let f in nu) {
          let g = u.getAttribute && u.getAttribute(f);
          if (g) {
            nu[f].fire({ template: g });
            return;
          }
        }
    };
    class AI {
      constructor() {
        this.events = {};
      }
      _getHandlersByEventName(u) {
        return (typeof this.events[u] > `u` && (this.events[u] = []), this.events[u]);
      }
      on(u, f) {
        let g = this._getHandlersByEventName(u);
        g.includes(f) || g.push(f);
      }
      once(u, f) {
        let g = (...v) => {
          (this.removeListener(u, g), f.apply(this, v));
        };
        this.on(u, g);
      }
      emit(u, ...f) {
        this._getHandlersByEventName(u).forEach((g) => {
          try {
            g.apply(this, f);
          } catch (v) {
            console.error(v);
          }
        });
      }
      removeListener(u, f) {
        let g = this._getHandlersByEventName(u),
          v = g.indexOf(f);
        v > -1 && g.splice(v, 1);
      }
      removeAllListeners(u) {
        this.events[u] !== void 0 && (this.events[u].length = 0);
      }
      reset() {
        this.events = {};
      }
    }
    s.eventEmitter = new AI();
    var RI = Object.freeze({
      __proto__: null,
      argsToParams: DI,
      bindClickHandler: _I,
      clickCancel: bC,
      clickConfirm: Hh,
      clickDeny: wC,
      enableLoading: Qr,
      fire: EI,
      getActions: Xo,
      getCancelButton: Gr,
      getCloseButton: Ul,
      getConfirmButton: Pt,
      getContainer: Oe,
      getDenyButton: Xn,
      getFocusableElements: Vl,
      getFooter: Sh,
      getHtmlContainer: jl,
      getIcon: qr,
      getIconContent: IE,
      getImage: Th,
      getInputLabel: TE,
      getLoader: Wr,
      getPopup: W,
      getProgressSteps: Bl,
      getTimerLeft: II,
      getTimerProgressBar: Rs,
      getTitle: Ih,
      getValidationMessage: As,
      increaseTimer: SI,
      isDeprecatedParameter: ug,
      isLoading: ME,
      isTimerRunning: MI,
      isUpdatableParameter: lg,
      isValidParameter: cg,
      isVisible: vC,
      mixin: CI,
      off: (l, u) => {
        if (s.eventEmitter) {
          if (!l) {
            s.eventEmitter.reset();
            return;
          }
          u ? s.eventEmitter.removeListener(l, u) : s.eventEmitter.removeAllListeners(l);
        }
      },
      on: (l, u) => {
        s.eventEmitter && s.eventEmitter.on(l, u);
      },
      once: (l, u) => {
        s.eventEmitter && s.eventEmitter.once(l, u);
      },
      resumeTimer: yg,
      showLoading: Qr,
      stopTimer: mg,
      toggleTimer: TI,
    });
    class xI {
      constructor(u, f) {
        ((this.callback = u), (this.remaining = f), (this.running = !1), this.start());
      }
      start() {
        return (
          this.running ||
            ((this.running = !0),
            (this.started = /* @__PURE__ */ new Date()),
            (this.id = setTimeout(this.callback, this.remaining))),
          this.remaining
        );
      }
      stop() {
        return (
          this.started &&
            this.running &&
            ((this.running = !1),
            clearTimeout(this.id),
            (this.remaining -= /* @__PURE__ */ new Date().getTime() - this.started.getTime())),
          this.remaining
        );
      }
      increase(u) {
        let f = this.running;
        return (f && this.stop(), (this.remaining += u), f && this.start(), this.remaining);
      }
      getTimerLeft() {
        return (this.running && (this.stop(), this.start()), this.remaining);
      }
      isRunning() {
        return this.running;
      }
    }
    let wg = [`swal-title`, `swal-html`, `swal-footer`],
      OI = (l) => {
        let u = typeof l.template == `string` ? document.querySelector(l.template) : l.template;
        if (!u) return {};
        let f = u.content;
        return (VI(f), Object.assign(kI(f), PI(f), LI(f), FI(f), jI(f), BI(f), UI(f, wg)));
      },
      kI = (l) => {
        let u = {};
        return (
          Array.from(l.querySelectorAll(`swal-param`)).forEach((g) => {
            tr(g, [`name`, `value`]);
            let v = g.getAttribute(`name`),
              D = g.getAttribute(`value`);
            !v ||
              !D ||
              (v in _n && typeof _n[v] == `boolean`
                ? (u[v] = D !== `false`)
                : v in _n && typeof _n[v] == `object`
                  ? (u[v] = JSON.parse(D))
                  : (u[v] = D));
          }),
          u
        );
      },
      PI = (l) => {
        let u = {};
        return (
          Array.from(l.querySelectorAll(`swal-function-param`)).forEach((g) => {
            let v = g.getAttribute(`name`),
              D = g.getAttribute(`value`);
            !v || !D || (u[v] = new Function(`return ${D}`)());
          }),
          u
        );
      },
      LI = (l) => {
        let u = {};
        return (
          Array.from(l.querySelectorAll(`swal-button`)).forEach((g) => {
            tr(g, [`type`, `color`, `aria-label`]);
            let v = g.getAttribute(`type`);
            if (!v || ![`confirm`, `cancel`, `deny`].includes(v)) return;
            ((u[`${v}ButtonText`] = g.innerHTML), (u[`show${T(v)}Button`] = !0));
            let D = g.getAttribute(`color`);
            D !== null && (u[`${v}ButtonColor`] = D);
            let x = g.getAttribute(`aria-label`);
            x !== null && (u[`${v}ButtonAriaLabel`] = x);
          }),
          u
        );
      },
      FI = (l) => {
        let u = {},
          f = l.querySelector(`swal-image`);
        if (f) {
          tr(f, [`src`, `width`, `height`, `alt`]);
          let g = f.getAttribute(`src`);
          g !== null && (u.imageUrl = g || void 0);
          let v = f.getAttribute(`width`);
          v !== null && (u.imageWidth = v || void 0);
          let D = f.getAttribute(`height`);
          D !== null && (u.imageHeight = D || void 0);
          let x = f.getAttribute(`alt`);
          x !== null && (u.imageAlt = x || void 0);
        }
        return u;
      },
      jI = (l) => {
        let u = {},
          f = l.querySelector(`swal-icon`);
        return (
          f &&
            (tr(f, [`type`, `color`]),
            f.hasAttribute(`type`) && (u.icon = f.getAttribute(`type`)),
            f.hasAttribute(`color`) && (u.iconColor = f.getAttribute(`color`)),
            (u.iconHtml = f.innerHTML)),
          u
        );
      },
      BI = (l) => {
        let u = {},
          f = l.querySelector(`swal-input`);
        f &&
          (tr(f, [`type`, `label`, `placeholder`, `value`]),
          (u.input = f.getAttribute(`type`) || `text`),
          f.hasAttribute(`label`) && (u.inputLabel = f.getAttribute(`label`)),
          f.hasAttribute(`placeholder`) && (u.inputPlaceholder = f.getAttribute(`placeholder`)),
          f.hasAttribute(`value`) && (u.inputValue = f.getAttribute(`value`)));
        let g = Array.from(l.querySelectorAll(`swal-input-option`));
        return (
          g.length &&
            ((u.inputOptions = {}),
            g.forEach((v) => {
              tr(v, [`value`]);
              let D = v.getAttribute(`value`);
              if (!D) return;
              let x = v.innerHTML;
              u.inputOptions[D] = x;
            })),
          u
        );
      },
      UI = (l, u) => {
        let f = {};
        for (let g in u) {
          let v = u[g],
            D = l.querySelector(v);
          D && (tr(D, []), (f[v.replace(/^swal-/, ``)] = D.innerHTML.trim()));
        }
        return f;
      },
      VI = (l) => {
        let u = wg.concat([
          `swal-param`,
          `swal-function-param`,
          `swal-button`,
          `swal-image`,
          `swal-icon`,
          `swal-input`,
          `swal-input-option`,
        ]);
        Array.from(l.children).forEach((f) => {
          let g = f.tagName.toLowerCase();
          u.includes(g) || E(`Unrecognized element <${g}>`);
        });
      },
      tr = (l, u) => {
        Array.from(l.attributes).forEach((f) => {
          u.indexOf(f.name) === -1 &&
            E([
              `Unrecognized attribute "${f.name}" on <${l.tagName.toLowerCase()}>.`,
              `${u.length ? `Allowed attributes are: ${u.join(`, `)}` : `To set the value, use HTML within the element.`}`,
            ]);
        });
      },
      bg = 10,
      HI = (l) => {
        var u, f;
        let g = Oe(),
          v = W();
        if (!g || !v) return;
        (typeof l.willOpen == `function` && l.willOpen(v),
          (u = s.eventEmitter) === null || u === void 0 || u.emit(`willOpen`, v));
        let x = window.getComputedStyle(document.body).overflowY;
        if (
          (qI(g, v, l),
          setTimeout(() => {
            $I(g, v);
          }, bg),
          Hl() && (zI(g, l.scrollbarPadding !== void 0 ? l.scrollbarPadding : !1, x), _C()),
          NC &&
            l.backdrop === !1 &&
            v.scrollHeight > g.clientHeight &&
            (g.style.pointerEvents = `auto`),
          !xs() && !s.previousActiveElement && (s.previousActiveElement = document.activeElement),
          typeof l.didOpen == `function`)
        ) {
          let G = l.didOpen;
          setTimeout(() => G(v));
        }
        (f = s.eventEmitter) === null || f === void 0 || f.emit(`didOpen`, v);
      },
      Us = (l) => {
        let u = W();
        if (!u || l.target !== u) return;
        let f = Oe();
        f &&
          (u.removeEventListener(`animationend`, Us),
          u.removeEventListener(`transitionend`, Us),
          (f.style.overflowY = `auto`),
          ut(f, p[`no-transition`]));
      },
      $I = (l, u) => {
        Ah(u)
          ? ((l.style.overflowY = `hidden`),
            u.addEventListener(`animationend`, Us),
            u.addEventListener(`transitionend`, Us))
          : (l.style.overflowY = `auto`);
      },
      zI = (l, u, f) => {
        (AC(),
          u && f !== `hidden` && FC(f),
          setTimeout(() => {
            l.scrollTop = 0;
          }));
      },
      qI = (l, u, f) => {
        var g;
        ((g = f.showClass) !== null && g !== void 0 && g.backdrop && K(l, f.showClass.backdrop),
          f.animation
            ? (u.style.setProperty(`opacity`, `0`, `important`),
              Re(u, `grid`),
              setTimeout(() => {
                var v;
                ((v = f.showClass) !== null && v !== void 0 && v.popup && K(u, f.showClass.popup),
                  u.style.removeProperty(`opacity`));
              }, bg))
            : Re(u, `grid`),
          K([document.documentElement, document.body], p.shown),
          f.heightAuto &&
            f.backdrop &&
            !f.toast &&
            K([document.documentElement, document.body], p[`height-auto`]));
      };
    var Dg = {
      email: (l, u) =>
        /^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(l)
          ? Promise.resolve()
          : Promise.resolve(u || `Invalid email address`),
      url: (l, u) =>
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(
          l,
        )
          ? Promise.resolve()
          : Promise.resolve(u || `Invalid URL`),
    };
    function GI(l) {
      l.inputValidator ||
        (l.input === `email` && (l.inputValidator = Dg.email),
        l.input === `url` && (l.inputValidator = Dg.url));
    }
    function WI(l) {
      (!l.target ||
        (typeof l.target == `string` && !document.querySelector(l.target)) ||
        (typeof l.target != `string` && !l.target.appendChild)) &&
        (E(`Target parameter is not valid, defaulting to "body"`), (l.target = `body`));
    }
    function YI(l) {
      (GI(l),
        l.showLoaderOnConfirm &&
          !l.preConfirm &&
          E(`showLoaderOnConfirm is set to true, but preConfirm is not defined.
showLoaderOnConfirm should be used together with preConfirm, see usage example:
https://sweetalert2.github.io/#ajax-request`),
        WI(l),
        typeof l.title == `string` &&
          (l.title = l.title
            .split(
              `
`,
            )
            .join(`<br />`)),
        BE(l));
    }
    let Lt;
    var Vs = /* @__PURE__ */ new WeakMap();
    class Te {
      constructor(...u) {
        if (
          (r(this, Vs, Promise.resolve({ isConfirmed: !1, isDenied: !1, isDismissed: !0 })),
          typeof window > `u`)
        )
          return;
        Lt = this;
        let f = Object.freeze(this.constructor.argsToParams(u));
        ((this.params = f), (this.isAwaitingPromise = !1), o(Vs, this, this._main(Lt.params)));
      }
      _main(u, f = {}) {
        if ((dg(Object.assign({}, f, u)), s.currentInstance)) {
          let D = Zr.swalPromiseResolve.get(s.currentInstance),
            { isAwaitingPromise: x } = s.currentInstance;
          (s.currentInstance._destroy(), x || D({ isDismissed: !0 }), Hl() && qh());
        }
        s.currentInstance = Lt;
        let g = KI(u, f);
        (YI(g),
          Object.freeze(g),
          s.timeout && (s.timeout.stop(), delete s.timeout),
          clearTimeout(s.restoreFocusTimeout));
        let v = QI(Lt);
        return (Vh(Lt, g), te.innerParams.set(Lt, g), ZI(Lt, v, g));
      }
      then(u) {
        return n(Vs, this).then(u);
      }
      finally(u) {
        return n(Vs, this).finally(u);
      }
    }
    let ZI = (l, u, f) =>
        new Promise((g, v) => {
          let D = (x) => {
            l.close({ isDismissed: !0, dismiss: x, isConfirmed: !1, isDenied: !1 });
          };
          (Zr.swalPromiseResolve.set(l, g),
            Zr.swalPromiseReject.set(l, v),
            (u.confirmButton.onclick = () => {
              eI(l);
            }),
            (u.denyButton.onclick = () => {
              tI(l);
            }),
            (u.cancelButton.onclick = () => {
              nI(l, D);
            }),
            (u.closeButton.onclick = () => {
              D(Yr.close);
            }),
            hI(f, u, D),
            DC(s, f, D),
            qC(l, f),
            HI(f),
            XI(s, f, D),
            JI(u, f),
            setTimeout(() => {
              u.container.scrollTop = 0;
            }));
        }),
      KI = (l, u) => {
        let f = OI(l),
          g = Object.assign({}, _n, u, f, l);
        return (
          (g.showClass = Object.assign({}, _n.showClass, g.showClass)),
          (g.hideClass = Object.assign({}, _n.hideClass, g.hideClass)),
          g.animation === !1 &&
            ((g.showClass = { backdrop: `swal2-noanimation` }), (g.hideClass = {})),
          g
        );
      },
      QI = (l) => {
        let u = {
          popup: W(),
          container: Oe(),
          actions: Xo(),
          confirmButton: Pt(),
          denyButton: Xn(),
          cancelButton: Gr(),
          loader: Wr(),
          closeButton: Ul(),
          validationMessage: As(),
          progressSteps: Bl(),
        };
        return (te.domCache.set(l, u), u);
      },
      XI = (l, u, f) => {
        let g = Rs();
        ($e(g),
          u.timer &&
            ((l.timeout = new xI(() => {
              (f(`timer`), delete l.timeout);
            }, u.timer)),
            u.timerProgressBar &&
              g &&
              (Re(g),
              nt(g, u, `timerProgressBar`),
              setTimeout(() => {
                l.timeout && l.timeout.running && ql(u.timer);
              }))));
      },
      JI = (l, u) => {
        if (!u.toast) {
          if (!et(u.allowEnterKey)) {
            (xt(`allowEnterKey`, `preConfirm: () => false`), l.popup.focus());
            return;
          }
          eT(l) || tT(l, u) || Kl(-1, 1);
        }
      },
      eT = (l) => {
        let u = Array.from(l.popup.querySelectorAll(`[autofocus]`));
        for (let f of u) if (f instanceof HTMLElement && Ze(f)) return (f.focus(), !0);
        return !1;
      },
      tT = (l, u) =>
        u.focusDeny && Ze(l.denyButton)
          ? (l.denyButton.focus(), !0)
          : u.focusCancel && Ze(l.cancelButton)
            ? (l.cancelButton.focus(), !0)
            : u.focusConfirm && Ze(l.confirmButton)
              ? (l.confirmButton.focus(), !0)
              : !1;
    ((Te.prototype.disableButtons = rg),
      (Te.prototype.enableButtons = ng),
      (Te.prototype.getInput = Jh),
      (Te.prototype.disableInput = ig),
      (Te.prototype.enableInput = og),
      (Te.prototype.hideLoading = js),
      (Te.prototype.disableLoading = js),
      (Te.prototype.showValidationMessage = sg),
      (Te.prototype.resetValidationMessage = ag),
      (Te.prototype.close = Mn),
      (Te.prototype.closePopup = Mn),
      (Te.prototype.closeModal = Mn),
      (Te.prototype.closeToast = Mn),
      (Te.prototype.rejectPromise = Wh),
      (Te.prototype.update = fg),
      (Te.prototype._destroy = pg),
      Object.assign(Te, RI),
      Object.keys(pI).forEach((l) => {
        Te[l] = function (...u) {
          if (Lt && Lt[l]) return Lt[l](...u);
        };
      }),
      (Te.DismissReason = Yr),
      (Te.version = `11.26.25`));
    let Hs = Te;
    return ((Hs.default = Hs), Hs);
  });
  typeof Xt < `u` &&
    Xt.Sweetalert2 &&
    (Xt.swal = Xt.sweetAlert = Xt.Swal = Xt.SweetAlert = Xt.Sweetalert2);
  typeof document < `u` &&
    (function (e, t) {
      var n = e.createElement(`style`);
      if ((e.getElementsByTagName(`head`)[0].appendChild(n), n.styleSheet))
        n.styleSheet.disabled || (n.styleSheet.cssText = t);
      else
        try {
          n.innerHTML = t;
        } catch {
          n.innerText = t;
        }
    })(
      document,
      `:root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.15s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:auto}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;overflow-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;overflow-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:auto}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes swal2-hide{0%{transform:translate3d(0, 0, 0) scale(1);opacity:1}100%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}`,
    );
});
var ni = [null];
var $s = [!1];
var nr = 1;
var fT = null;
var ye$1 = Symbol(`SIGNAL`);
function R(e) {
  let t = ni[0];
  return ((ni[0] = e), t);
}
function zs() {
  return ni[0];
}
var Nn = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producers: void 0,
  producersTail: void 0,
  consumers: void 0,
  consumersTail: void 0,
  recomputing: !1,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  kind: `unknown`,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function nn(e) {
  if ($s[0]) throw new Error(``);
  let t = ni[0];
  if (t === null) return;
  t.consumerOnSignalRead(e);
  let n = t.producersTail;
  if (n !== void 0 && n.producer === e) return;
  let r,
    o = t.recomputing;
  if (o && ((r = n !== void 0 ? n.nextProducer : t.producers), r !== void 0 && r.producer === e)) {
    ((t.producersTail = r), (r.lastReadVersion = e.version), (r.knownValidAtEpoch = nr));
    return;
  }
  let i = e.consumersTail;
  if (i !== void 0 && i.consumer === t && (!o || i.knownValidAtEpoch === nr)) return;
  let s = to(t),
    a = {
      producer: e,
      consumer: t,
      nextProducer: r,
      prevConsumer: void 0,
      knownValidAtEpoch: nr,
      lastReadVersion: e.version,
      nextConsumer: void 0,
    };
  ((t.producersTail = a), n !== void 0 ? (n.nextProducer = a) : (t.producers = a), s && _g(e, a));
}
function Tg() {
  nr++;
}
function An(e) {
  if (!(to(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === nr)) {
    if (!e.producerMustRecompute(e) && !eo(e)) {
      Jr(e);
      return;
    }
    (e.producerRecomputeValue(e), Jr(e));
  }
}
function iu(e) {
  if (e.consumers === void 0) return;
  let t = $s[0];
  $s[0] = !0;
  try {
    for (let n = e.consumers; n !== void 0; n = n.nextConsumer) {
      let r = n.consumer;
      r.dirty || pT(r);
    }
  } finally {
    $s[0] = t;
  }
}
function su() {
  return ni[0]?.consumerAllowSignalWrites !== !1;
}
function pT(e) {
  ((e.dirty = !0), iu(e), e.consumerMarkedDirty?.(e));
}
function Jr(e) {
  ((e.dirty = !1), (e.lastCleanEpoch = nr));
}
function rn(e) {
  return (e && Sg(e), R(e));
}
function Sg(e) {
  if (e.producersTail?.knownValidAtEpoch === nr) {
    let t = e.producers;
    for (; t !== void 0;) ((t.knownValidAtEpoch = null), (t = t.nextProducer));
  }
  ((e.producersTail = void 0), (e.recomputing = !0));
}
function Rn(e, t) {
  (R(t), e && Mg(e));
}
function Mg(e) {
  e.recomputing = !1;
  let t = e.producersTail,
    n = t !== void 0 ? t.nextProducer : e.producers;
  if (n !== void 0) {
    if (to(e))
      do n = au(n);
      while (n !== void 0);
    t !== void 0 ? (t.nextProducer = void 0) : (e.producers = void 0);
  }
}
function eo(e) {
  for (let t = e.producers; t !== void 0; t = t.nextProducer) {
    let n = t.producer,
      r = t.lastReadVersion;
    if (r !== n.version || (An(n), r !== n.version)) return !0;
  }
  return !1;
}
function xn(e) {
  if (to(e)) {
    let t = e.producers;
    for (; t !== void 0;) t = au(t);
  }
  ((e.producers = void 0),
    (e.producersTail = void 0),
    (e.consumers = void 0),
    (e.consumersTail = void 0));
}
function _g(e, t) {
  let n = e.consumersTail,
    r = to(e);
  if (
    (n !== void 0
      ? ((t.nextConsumer = n.nextConsumer), (n.nextConsumer = t))
      : ((t.nextConsumer = void 0), (e.consumers = t)),
    (t.prevConsumer = n),
    (e.consumersTail = t),
    !r)
  )
    for (let o = e.producers; o !== void 0; o = o.nextProducer) _g(o.producer, o);
}
function au(e) {
  let t = e.producer,
    n = e.nextProducer,
    r = e.nextConsumer,
    o = e.prevConsumer;
  if (
    ((e.nextConsumer = void 0),
    (e.prevConsumer = void 0),
    r !== void 0 ? (r.prevConsumer = o) : (t.consumersTail = o),
    o !== void 0)
  )
    o.nextConsumer = r;
  else if (((t.consumers = r), !to(t))) {
    let i = t.producers;
    for (; i !== void 0;) i = au(i);
  }
  return n;
}
function to(e) {
  return e.consumerIsAlwaysLive || e.consumers !== void 0;
}
function ri(e) {
  fT?.(e);
}
function oi(e, t) {
  return Object.is(e, t);
}
function ii(e, t) {
  let n = Object.create(hT);
  ((n.computation = e), t !== void 0 && (n.equal = t));
  let r = () => {
    if ((An(n), nn(n), n.value === dt)) throw n.error;
    return n.value;
  };
  return ((r[ye$1] = n), ri(n), r);
}
var rr = Symbol(`UNSET`);
var or = Symbol(`COMPUTING`);
var dt = Symbol(`ERRORED`);
var hT = Y(C({}, Nn), {
  value: rr,
  dirty: !0,
  error: null,
  equal: oi,
  kind: `computed`,
  producerMustRecompute(e) {
    return e.value === rr || e.value === or;
  },
  producerRecomputeValue(e) {
    if (e.value === or) throw new Error(``);
    let t = e.value;
    e.value = or;
    let n = rn(e),
      r,
      o = !1;
    try {
      ((r = e.computation()), R(null), (o = t !== rr && t !== dt && r !== dt && e.equal(t, r)));
    } catch (i) {
      ((r = dt), (e.error = i));
    } finally {
      Rn(e, n);
    }
    if (o) {
      e.value = t;
      return;
    }
    ((e.value = r), e.version++);
  },
});
function gT() {
  throw new Error();
}
var Ng = gT;
function Ag(e) {
  Ng(e);
}
function cu(e) {
  Ng = e;
}
var mT = null;
function lu(e, t) {
  let n = Object.create(no);
  ((n.value = e), t !== void 0 && (n.equal = t));
  let r = () => Rg(n);
  return ((r[ye$1] = n), ri(n), [r, (s) => On(n, s), (s) => qs(n, s)]);
}
function Rg(e) {
  return (nn(e), e.value);
}
function On(e, t) {
  (su() || Ag(e), e.equal(e.value, t) || ((e.value = t), yT(e)));
}
function qs(e, t) {
  (su() || Ag(e), On(e, t(e.value)));
}
var no = Y(C({}, Nn), { equal: oi, value: void 0, kind: `signal` });
function yT(e) {
  (e.version++, Tg(), iu(e), mT?.(e));
}
var uu = Y(C({}, Nn), {
  consumerIsAlwaysLive: !0,
  consumerAllowSignalWrites: !0,
  dirty: !0,
  kind: `effect`,
});
function du(e) {
  if (((e.dirty = !1), e.version > 0 && !eo(e))) return;
  e.version++;
  let t = rn(e);
  try {
    (e.cleanup(), e.fn());
  } finally {
    Rn(e, t);
  }
}
var fu = [void 0];
function Gs() {
  return fu[0];
}
function Ft(e) {
  let t = fu[0];
  return ((fu[0] = e), t);
}
var xg = Symbol(`NotFound`);
function ro(e) {
  return e === xg || e?.name === `ɵNotFound`;
}
function pu(e, t, n) {
  let r = Object.create(vT);
  ((r.source = e), (r.computation = t), n != null && (r.equal = n));
  let i = () => {
    if ((An(r), nn(r), r.value === dt)) throw r.error;
    return r.value;
  };
  return ((i[ye$1] = r), ri(r), i);
}
function hu(e, t) {
  (An(e), On(e, t), Jr(e));
}
function Og(e, t) {
  if ((An(e), e.value === dt)) throw e.error;
  (qs(e, t), Jr(e));
}
var vT = Y(C({}, Nn), {
  value: rr,
  dirty: !0,
  error: null,
  equal: oi,
  kind: `linkedSignal`,
  producerMustRecompute(e) {
    return e.value === rr || e.value === or;
  },
  producerRecomputeValue(e) {
    if (e.value === or) throw new Error(``);
    let t = e.value;
    e.value = or;
    let n = rn(e),
      r,
      o = !1;
    try {
      let i = e.source(),
        s = t !== rr && t !== dt,
        a = s ? { source: e.sourceValue, value: t } : void 0;
      ((r = e.computation(i, a)),
        (e.sourceValue = i),
        R(null),
        (o = s && r !== dt && e.equal(t, r)));
    } catch (i) {
      ((r = dt), (e.error = i));
    } finally {
      Rn(e, n);
    }
    if (o) {
      e.value = t;
      return;
    }
    ((e.value = r), e.version++);
  },
});
function kg(e) {
  let t = R(null);
  try {
    return e();
  } finally {
    R(t);
  }
}
function $(e) {
  return typeof e == `function`;
}
function oo(e) {
  let n = e((r) => {
    (Error.call(r), (r.stack = /* @__PURE__ */ new Error().stack));
  });
  return ((n.prototype = Object.create(Error.prototype)), (n.prototype.constructor = n), n);
}
var Ws = oo(
  (e) =>
    function (n) {
      (e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ``),
        (this.name = `UnsubscriptionError`),
        (this.errors = n));
    },
);
function ir(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var he = class e {
  constructor(t) {
    ((this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null));
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n))) for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if ($(r))
        try {
          r();
        } catch (i) {
          t = i instanceof Ws ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Pg(i);
          } catch (s) {
            ((t = t ?? []), s instanceof Ws ? (t = [...t, ...s.errors]) : t.push(s));
          }
      }
      if (t) throw new Ws(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Pg(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && ir(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    (n && ir(n, t), t instanceof e && t._removeParent(this));
  }
};
he.EMPTY = (() => {
  let e = new he();
  return ((e.closed = !0), e);
})();
var gu = he.EMPTY;
function Ys(e) {
  return e instanceof he || (e && `closed` in e && $(e.remove) && $(e.add) && $(e.unsubscribe));
}
function Pg(e) {
  $(e) ? e() : e.unsubscribe();
}
var Ct = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var io = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = io;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = io;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Zs(e) {
  io.setTimeout(() => {
    let { onUnhandledError: t } = Ct;
    if (t) t(e);
    else throw e;
  });
}
function si() {}
var Lg = mu(`C`, void 0, void 0);
function Fg(e) {
  return mu(`E`, void 0, e);
}
function jg(e) {
  return mu(`N`, e, void 0);
}
function mu(e, t, n) {
  return { kind: e, value: t, error: n };
}
var sr = null;
function so(e) {
  if (Ct.useDeprecatedSynchronousErrorHandling) {
    let t = !sr;
    if ((t && (sr = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = sr;
      if (((sr = null), n)) throw r;
    }
  } else e();
}
function Bg(e) {
  Ct.useDeprecatedSynchronousErrorHandling && sr && ((sr.errorThrown = !0), (sr.error = e));
}
var ar = class extends he {
  constructor(t) {
    (super(),
      (this.isStopped = !1),
      t ? ((this.destination = t), Ys(t) && t.add(this)) : (this.destination = DT));
  }
  static create(t, n, r) {
    return new on(t, n, r);
  }
  next(t) {
    this.isStopped ? vu(jg(t), this) : this._next(t);
  }
  error(t) {
    this.isStopped ? vu(Fg(t), this) : ((this.isStopped = !0), this._error(t));
  }
  complete() {
    this.isStopped ? vu(Lg, this) : ((this.isStopped = !0), this._complete());
  }
  unsubscribe() {
    this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
  }
  _next(t) {
    this.destination.next(t);
  }
  _error(t) {
    try {
      this.destination.error(t);
    } finally {
      this.unsubscribe();
    }
  }
  _complete() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }
};
var wT = Function.prototype.bind;
function yu(e, t) {
  return wT.call(e, t);
}
var wu = class {
  constructor(t) {
    this.partialObserver = t;
  }
  next(t) {
    let { partialObserver: n } = this;
    if (n.next)
      try {
        n.next(t);
      } catch (r) {
        Ks(r);
      }
  }
  error(t) {
    let { partialObserver: n } = this;
    if (n.error)
      try {
        n.error(t);
      } catch (r) {
        Ks(r);
      }
    else Ks(t);
  }
  complete() {
    let { partialObserver: t } = this;
    if (t.complete)
      try {
        t.complete();
      } catch (n) {
        Ks(n);
      }
  }
};
var on = class extends ar {
  constructor(t, n, r) {
    super();
    let o;
    if ($(t) || !t) o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
    else {
      let i;
      this && Ct.useDeprecatedNextContext
        ? ((i = Object.create(t)),
          (i.unsubscribe = () => this.unsubscribe()),
          (o = {
            next: t.next && yu(t.next, i),
            error: t.error && yu(t.error, i),
            complete: t.complete && yu(t.complete, i),
          }))
        : (o = t);
    }
    this.destination = new wu(o);
  }
};
function Ks(e) {
  Ct.useDeprecatedSynchronousErrorHandling ? Bg(e) : Zs(e);
}
function bT(e) {
  throw e;
}
function vu(e, t) {
  let { onStoppedNotification: n } = Ct;
  n && io.setTimeout(() => n(e, t));
}
var DT = { closed: !0, next: si, error: bT, complete: si };
var ao = (typeof Symbol == `function` && Symbol.observable) || `@@observable`;
function rt(e) {
  return e;
}
function Qs(...e) {
  return bu(e);
}
function bu(e) {
  return e.length === 0
    ? rt
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n);
        };
}
var F$1 = class e {
  constructor(t) {
    t && (this._subscribe = t);
  }
  lift(t) {
    let n = new e();
    return ((n.source = this), (n.operator = t), n);
  }
  subscribe(t, n, r) {
    let o = CT(t) ? t : new on(t, n, r);
    return (
      so(() => {
        let { operator: i, source: s } = this;
        o.add(i ? i.call(o, s) : s ? this._subscribe(o) : this._trySubscribe(o));
      }),
      o
    );
  }
  _trySubscribe(t) {
    try {
      return this._subscribe(t);
    } catch (n) {
      t.error(n);
    }
  }
  forEach(t, n) {
    return (
      (n = Ug(n)),
      new n((r, o) => {
        let i = new on({
          next: (s) => {
            try {
              t(s);
            } catch (a) {
              (o(a), i.unsubscribe());
            }
          },
          error: o,
          complete: r,
        });
        this.subscribe(i);
      })
    );
  }
  _subscribe(t) {
    var n;
    return (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t);
  }
  [ao]() {
    return this;
  }
  pipe(...t) {
    return bu(t)(this);
  }
  toPromise(t) {
    return (
      (t = Ug(t)),
      new t((n, r) => {
        let o;
        this.subscribe(
          (i) => (o = i),
          (i) => r(i),
          () => n(o),
        );
      })
    );
  }
};
F$1.create = (e) => new F$1(e);
function Ug(e) {
  var t;
  return (t = e ?? Ct.Promise) !== null && t !== void 0 ? t : Promise;
}
function ET(e) {
  return e && $(e.next) && $(e.error) && $(e.complete);
}
function CT(e) {
  return (e && e instanceof ar) || (ET(e) && Ys(e));
}
function Du(e) {
  return $(e?.lift);
}
function H(e) {
  return (t) => {
    if (Du(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError(`Unable to lift unknown Observable type`);
  };
}
function B$1(e, t, n, r, o) {
  return new Eu(e, t, n, r, o);
}
var Eu = class extends ar {
  constructor(t, n, r, o, i, s) {
    (super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              t.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              t.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete));
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      (super.unsubscribe(), !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this)));
    }
  }
};
function Vg() {
  return H((e, t) => {
    let n = null;
    e._refCount++;
    let r = B$1(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        n = null;
        return;
      }
      let o = e._connection,
        i = n;
      ((n = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe());
    });
    (e.subscribe(r), r.closed || (n = e.connect()));
  });
}
var Cu = class extends F$1 {
  constructor(t, n) {
    (super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Du(t) && (this.lift = t.lift));
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return ((!t || t.isStopped) && (this._subject = this.subjectFactory()), this._subject);
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    ((this._subject = this._connection = null), t?.unsubscribe());
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new he();
      let n = this.getSubject();
      (t.add(
        this.source.subscribe(
          B$1(
            n,
            void 0,
            () => {
              (this._teardown(), n.complete());
            },
            (r) => {
              (this._teardown(), n.error(r));
            },
            () => this._teardown(),
          ),
        ),
      ),
        t.closed && ((this._connection = null), (t = he.EMPTY)));
    }
    return t;
  }
  refCount() {
    return Vg()(this);
  }
};
var co = {
  schedule(e) {
    let t = requestAnimationFrame,
      n = cancelAnimationFrame,
      { delegate: r } = co;
    r && ((t = r.requestAnimationFrame), (n = r.cancelAnimationFrame));
    let o = t((i) => {
      ((n = void 0), e(i));
    });
    return new he(() => n?.(o));
  },
  requestAnimationFrame(...e) {
    let { delegate: t } = co;
    return (t?.requestAnimationFrame || requestAnimationFrame)(...e);
  },
  cancelAnimationFrame(...e) {
    let { delegate: t } = co;
    return (t?.cancelAnimationFrame || cancelAnimationFrame)(...e);
  },
  delegate: void 0,
};
var Hg = oo(
  (e) =>
    function () {
      (e(this), (this.name = `ObjectUnsubscribedError`), (this.message = `object unsubscribed`));
    },
);
var le = class extends F$1 {
  constructor() {
    (super(),
      (this.closed = !1),
      (this.currentObservers = null),
      (this.observers = []),
      (this.isStopped = !1),
      (this.hasError = !1),
      (this.thrownError = null));
  }
  lift(t) {
    let n = new Xs(this, this);
    return ((n.operator = t), n);
  }
  _throwIfClosed() {
    if (this.closed) throw new Hg();
  }
  next(t) {
    so(() => {
      if ((this._throwIfClosed(), !this.isStopped)) {
        this.currentObservers || (this.currentObservers = Array.from(this.observers));
        for (let n of this.currentObservers) n.next(t);
      }
    });
  }
  error(t) {
    so(() => {
      if ((this._throwIfClosed(), !this.isStopped)) {
        ((this.hasError = this.isStopped = !0), (this.thrownError = t));
        let { observers: n } = this;
        for (; n.length;) n.shift().error(t);
      }
    });
  }
  complete() {
    so(() => {
      if ((this._throwIfClosed(), !this.isStopped)) {
        this.isStopped = !0;
        let { observers: t } = this;
        for (; t.length;) t.shift().complete();
      }
    });
  }
  unsubscribe() {
    ((this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null));
  }
  get observed() {
    var t;
    return ((t = this.observers) === null || t === void 0 ? void 0 : t.length) > 0;
  }
  _trySubscribe(t) {
    return (this._throwIfClosed(), super._trySubscribe(t));
  }
  _subscribe(t) {
    return (this._throwIfClosed(), this._checkFinalizedStatuses(t), this._innerSubscribe(t));
  }
  _innerSubscribe(t) {
    let { hasError: n, isStopped: r, observers: o } = this;
    return n || r
      ? gu
      : ((this.currentObservers = null),
        o.push(t),
        new he(() => {
          ((this.currentObservers = null), ir(o, t));
        }));
  }
  _checkFinalizedStatuses(t) {
    let { hasError: n, thrownError: r, isStopped: o } = this;
    n ? t.error(r) : o && t.complete();
  }
  asObservable() {
    let t = new F$1();
    return ((t.source = this), t);
  }
};
le.create = (e, t) => new Xs(e, t);
var Xs = class extends le {
  constructor(t, n) {
    (super(), (this.destination = t), (this.source = n));
  }
  next(t) {
    var n, r;
    (r = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null ||
      r === void 0 ||
      r.call(n, t);
  }
  error(t) {
    var n, r;
    (r = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null ||
      r === void 0 ||
      r.call(n, t);
  }
  complete() {
    var t, n;
    (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null ||
      n === void 0 ||
      n.call(t);
  }
  _subscribe(t) {
    var n, r;
    return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null &&
      r !== void 0
      ? r
      : gu;
  }
};
var Pe$1 = class extends le {
  constructor(t) {
    (super(), (this._value = t));
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return (!n.closed && t.next(this._value), n);
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return (this._throwIfClosed(), r);
  }
  next(t) {
    super.next((this._value = t));
  }
};
var ai = {
  now() {
    return (ai.delegate || Date).now();
  },
  delegate: void 0,
};
var ci = class extends le {
  constructor(t = 1 / 0, n = 1 / 0, r = ai) {
    (super(),
      (this._bufferSize = t),
      (this._windowTime = n),
      (this._timestampProvider = r),
      (this._buffer = []),
      (this._infiniteTimeWindow = !0),
      (this._infiniteTimeWindow = n === 1 / 0),
      (this._bufferSize = Math.max(1, t)),
      (this._windowTime = Math.max(1, n)));
  }
  next(t) {
    let {
      isStopped: n,
      _buffer: r,
      _infiniteTimeWindow: o,
      _timestampProvider: i,
      _windowTime: s,
    } = this;
    (n || (r.push(t), !o && r.push(i.now() + s)), this._trimBuffer(), super.next(t));
  }
  _subscribe(t) {
    (this._throwIfClosed(), this._trimBuffer());
    let n = this._innerSubscribe(t),
      { _infiniteTimeWindow: r, _buffer: o } = this,
      i = o.slice();
    for (let s = 0; s < i.length && !t.closed; s += r ? 1 : 2) t.next(i[s]);
    return (this._checkFinalizedStatuses(t), n);
  }
  _trimBuffer() {
    let { _bufferSize: t, _timestampProvider: n, _buffer: r, _infiniteTimeWindow: o } = this,
      i = (o ? 1 : 2) * t;
    if ((t < 1 / 0 && i < r.length && r.splice(0, r.length - i), !o)) {
      let s = n.now(),
        a = 0;
      for (let c = 1; c < r.length && r[c] <= s; c += 2) a = c;
      a && r.splice(0, a + 1);
    }
  }
};
var Js = class extends he {
  constructor(t, n) {
    super();
  }
  schedule(t, n = 0) {
    return this;
  }
};
var li = {
  setInterval(e, t, ...n) {
    let { delegate: r } = li;
    return r?.setInterval ? r.setInterval(e, t, ...n) : setInterval(e, t, ...n);
  },
  clearInterval(e) {
    let { delegate: t } = li;
    return (t?.clearInterval || clearInterval)(e);
  },
  delegate: void 0,
};
var kn = class extends Js {
  constructor(t, n) {
    (super(t, n), (this.scheduler = t), (this.work = n), (this.pending = !1));
  }
  schedule(t, n = 0) {
    var r;
    if (this.closed) return this;
    this.state = t;
    let o = this.id,
      i = this.scheduler;
    return (
      o != null && (this.id = this.recycleAsyncId(i, o, n)),
      (this.pending = !0),
      (this.delay = n),
      (this.id = (r = this.id) !== null && r !== void 0 ? r : this.requestAsyncId(i, this.id, n)),
      this
    );
  }
  requestAsyncId(t, n, r = 0) {
    return li.setInterval(t.flush.bind(t, this), r);
  }
  recycleAsyncId(t, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n;
    n != null && li.clearInterval(n);
  }
  execute(t, n) {
    if (this.closed) return /* @__PURE__ */ new Error(`executing a cancelled action`);
    this.pending = !1;
    let r = this._execute(t, n);
    if (r) return r;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(t, n) {
    let r = !1,
      o;
    try {
      this.work(t);
    } catch (i) {
      ((r = !0), (o = i || /* @__PURE__ */ new Error(`Scheduled action threw falsy error`)));
    }
    if (r) return (this.unsubscribe(), o);
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: t, scheduler: n } = this,
        { actions: r } = n;
      ((this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        ir(r, this),
        t != null && (this.id = this.recycleAsyncId(n, t, null)),
        (this.delay = null),
        super.unsubscribe());
    }
  }
};
var IT = 1;
var Iu;
var Tu = {};
function $g(e) {
  return e in Tu ? (delete Tu[e], !0) : !1;
}
var { setImmediate: TT, clearImmediate: ST } = {
    setImmediate(e) {
      let t = IT++;
      return ((Tu[t] = !0), Iu || (Iu = Promise.resolve()), Iu.then(() => $g(t) && e()), t);
    },
    clearImmediate(e) {
      $g(e);
    },
  },
  ui = {
    setImmediate(...e) {
      let { delegate: t } = ui;
      return (t?.setImmediate || TT)(...e);
    },
    clearImmediate(e) {
      let { delegate: t } = ui;
      return (t?.clearImmediate || ST)(e);
    },
    delegate: void 0,
  };
var ea = class extends kn {
  constructor(t, n) {
    (super(t, n), (this.scheduler = t), (this.work = n));
  }
  requestAsyncId(t, n, r = 0) {
    return r !== null && r > 0
      ? super.requestAsyncId(t, n, r)
      : (t.actions.push(this),
        t._scheduled || (t._scheduled = ui.setImmediate(t.flush.bind(t, void 0))));
  }
  recycleAsyncId(t, n, r = 0) {
    var o;
    if (r != null ? r > 0 : this.delay > 0) return super.recycleAsyncId(t, n, r);
    let { actions: i } = t;
    n != null &&
      ((o = i[i.length - 1]) === null || o === void 0 ? void 0 : o.id) !== n &&
      (ui.clearImmediate(n), t._scheduled === n && (t._scheduled = void 0));
  }
};
var lo = class e {
  constructor(t, n = e.now) {
    ((this.schedulerActionCtor = t), (this.now = n));
  }
  schedule(t, n = 0, r) {
    return new this.schedulerActionCtor(this, t).schedule(r, n);
  }
};
lo.now = ai.now;
var Pn = class extends lo {
  constructor(t, n = lo.now) {
    (super(t, n), (this.actions = []), (this._active = !1));
  }
  flush(t) {
    let { actions: n } = this;
    if (this._active) {
      n.push(t);
      return;
    }
    let r;
    this._active = !0;
    do if ((r = t.execute(t.state, t.delay))) break;
    while ((t = n.shift()));
    if (((this._active = !1), r)) {
      for (; (t = n.shift());) t.unsubscribe();
      throw r;
    }
  }
};
var ta = class extends Pn {
  flush(t) {
    this._active = !0;
    let n = this._scheduled;
    this._scheduled = void 0;
    let { actions: r } = this,
      o;
    t = t || r.shift();
    do if ((o = t.execute(t.state, t.delay))) break;
    while ((t = r[0]) && t.id === n && r.shift());
    if (((this._active = !1), o)) {
      for (; (t = r[0]) && t.id === n && r.shift();) t.unsubscribe();
      throw o;
    }
  }
};
var MT = new ta(ea);
var di = new Pn(kn);
var qg = di;
var na = class extends kn {
  constructor(t, n) {
    (super(t, n), (this.scheduler = t), (this.work = n));
  }
  requestAsyncId(t, n, r = 0) {
    return r !== null && r > 0
      ? super.requestAsyncId(t, n, r)
      : (t.actions.push(this),
        t._scheduled || (t._scheduled = co.requestAnimationFrame(() => t.flush(void 0))));
  }
  recycleAsyncId(t, n, r = 0) {
    var o;
    if (r != null ? r > 0 : this.delay > 0) return super.recycleAsyncId(t, n, r);
    let { actions: i } = t;
    n != null &&
      n === t._scheduled &&
      ((o = i[i.length - 1]) === null || o === void 0 ? void 0 : o.id) !== n &&
      (co.cancelAnimationFrame(n), (t._scheduled = void 0));
  }
};
var ra = class extends Pn {
  flush(t) {
    this._active = !0;
    let n;
    t ? (n = t.id) : ((n = this._scheduled), (this._scheduled = void 0));
    let { actions: r } = this,
      o;
    t = t || r.shift();
    do if ((o = t.execute(t.state, t.delay))) break;
    while ((t = r[0]) && t.id === n && r.shift());
    if (((this._active = !1), o)) {
      for (; (t = r[0]) && t.id === n && r.shift();) t.unsubscribe();
      throw o;
    }
  }
};
var _T = new ra(na);
var _e$1 = new F$1((e) => e.complete());
function oa(e) {
  return e && $(e.schedule);
}
function Su(e) {
  return e[e.length - 1];
}
function ia(e) {
  return $(Su(e)) ? e.pop() : void 0;
}
function jt(e) {
  return oa(Su(e)) ? e.pop() : void 0;
}
function Gg(e, t) {
  return typeof Su(e) == `number` ? e.pop() : t;
}
function Yg(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(h) {
      try {
        d(r.next(h));
      } catch (p) {
        s(p);
      }
    }
    function c(h) {
      try {
        d(r.throw(h));
      } catch (p) {
        s(p);
      }
    }
    function d(h) {
      h.done ? i(h.value) : o(h.value).then(a, c);
    }
    d((r = r.apply(e, t || [])).next());
  });
}
function Wg(e) {
  var t = typeof Symbol == `function` && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == `number`)
    return {
      next: function () {
        return (e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e });
      },
    };
  throw new TypeError(t ? `Object is not iterable.` : `Symbol.iterator is not defined.`);
}
function cr(e) {
  return this instanceof cr ? ((this.v = e), this) : new cr(e);
}
function Zg(e, t, n) {
  if (!Symbol.asyncIterator) throw new TypeError(`Symbol.asyncIterator is not defined.`);
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create((typeof AsyncIterator == `function` ? AsyncIterator : Object).prototype)),
    a(`next`),
    a(`throw`),
    a(`return`, s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(y) {
    return function (w) {
      return Promise.resolve(w).then(y, p);
    };
  }
  function a(y, w) {
    r[y] &&
      ((o[y] = function (T) {
        return new Promise(function (E, _) {
          i.push([y, T, E, _]) > 1 || c(y, T);
        });
      }),
      w && (o[y] = w(o[y])));
  }
  function c(y, w) {
    try {
      d(r[y](w));
    } catch (T) {
      m(i[0][3], T);
    }
  }
  function d(y) {
    y.value instanceof cr ? Promise.resolve(y.value.v).then(h, p) : m(i[0][2], y);
  }
  function h(y) {
    c(`next`, y);
  }
  function p(y) {
    c(`throw`, y);
  }
  function m(y, w) {
    (y(w), i.shift(), i.length && c(i[0][0], i[0][1]));
  }
}
function Kg(e) {
  if (!Symbol.asyncIterator) throw new TypeError(`Symbol.asyncIterator is not defined.`);
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Wg == `function` ? Wg(e) : e[Symbol.iterator]()),
      (n = {}),
      r(`next`),
      r(`throw`),
      r(`return`),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          ((s = e[i](s)), o(a, c, s.done, s.value));
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (d) {
      i({ value: d, done: a });
    }, s);
  }
}
var sa = (e) => e && typeof e.length == `number` && typeof e != `function`;
function aa(e) {
  return $(e?.then);
}
function ca(e) {
  return $(e[ao]);
}
function la(e) {
  return Symbol.asyncIterator && $(e?.[Symbol.asyncIterator]);
}
function ua(e) {
  return /* @__PURE__ */ new TypeError(
    `You provided ${e !== null && typeof e == `object` ? `an invalid object` : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function NT() {
  return typeof Symbol != `function` || !Symbol.iterator ? `@@iterator` : Symbol.iterator;
}
var da = NT();
function fa(e) {
  return $(e?.[da]);
}
function pa(e) {
  return Zg(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield cr(n.read());
        if (o) return yield cr(void 0);
        yield yield cr(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function ha(e) {
  return $(e?.getReader);
}
function ie(e) {
  if (e instanceof F$1) return e;
  if (e != null) {
    if (ca(e)) return AT(e);
    if (sa(e)) return RT(e);
    if (aa(e)) return xT(e);
    if (la(e)) return Qg(e);
    if (fa(e)) return OT(e);
    if (ha(e)) return kT(e);
  }
  throw ua(e);
}
function AT(e) {
  return new F$1((t) => {
    let n = e[ao]();
    if ($(n.subscribe)) return n.subscribe(t);
    throw new TypeError(`Provided object does not correctly implement Symbol.observable`);
  });
}
function RT(e) {
  return new F$1((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function xT(e) {
  return new F$1((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n),
    ).then(null, Zs);
  });
}
function OT(e) {
  return new F$1((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function Qg(e) {
  return new F$1((t) => {
    PT(e, t).catch((n) => t.error(n));
  });
}
function kT(e) {
  return Qg(pa(e));
}
function PT(e, t) {
  var n, r, o, i;
  return Yg(this, void 0, void 0, function* () {
    try {
      for (n = Kg(e); (r = yield n.next()), !r.done;) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function Ke(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    (n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe());
  }, r);
  if ((e.add(i), !o)) return i;
}
function ga(e, t = 0) {
  return H((n, r) => {
    n.subscribe(
      B$1(
        r,
        (o) => Ke(r, e, () => r.next(o), t),
        () => Ke(r, e, () => r.complete(), t),
        (o) => Ke(r, e, () => r.error(o), t),
      ),
    );
  });
}
function ma(e, t = 0) {
  return H((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function Xg(e, t) {
  return ie(e).pipe(ma(t), ga(t));
}
function Jg(e, t) {
  return ie(e).pipe(ma(t), ga(t));
}
function em(e, t) {
  return new F$1((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function tm(e, t) {
  return new F$1((n) => {
    let r;
    return (
      Ke(n, t, () => {
        ((r = e[da]()),
          Ke(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0,
          ));
      }),
      () => $(r?.return) && r.return()
    );
  });
}
function ya(e, t) {
  if (!e) throw new Error(`Iterable cannot be null`);
  return new F$1((n) => {
    Ke(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      Ke(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function nm(e, t) {
  return ya(pa(e), t);
}
function rm(e, t) {
  if (e != null) {
    if (ca(e)) return Xg(e, t);
    if (sa(e)) return em(e, t);
    if (aa(e)) return Jg(e, t);
    if (la(e)) return ya(e, t);
    if (fa(e)) return tm(e, t);
    if (ha(e)) return nm(e, t);
  }
  throw ua(e);
}
function ve$1(e, t) {
  return t ? rm(e, t) : ie(e);
}
function I$1(...e) {
  return ve$1(e, jt(e));
}
function j(e, t) {
  let n = $(e) ? e : () => e,
    r = (o) => o.error(n());
  return new F$1(t ? (o) => t.schedule(r, 0, o) : r);
}
function va(e) {
  return !!e && (e instanceof F$1 || ($(e.lift) && $(e.subscribe)));
}
var lr = oo(
  (e) =>
    function () {
      (e(this), (this.name = `EmptyError`), (this.message = `no elements in sequence`));
    },
);
function om(e) {
  return e instanceof Date && !isNaN(e);
}
function ne(e, t) {
  return H((n, r) => {
    let o = 0;
    n.subscribe(
      B$1(r, (i) => {
        r.next(e.call(t, i, o++));
      }),
    );
  });
}
var { isArray: LT } = Array;
function FT(e, t) {
  return LT(t) ? e(...t) : e(t);
}
function wa(e) {
  return ne((t) => FT(e, t));
}
var { isArray: jT } = Array,
  { getPrototypeOf: BT, prototype: UT, keys: VT } = Object;
function ba(e) {
  if (e.length === 1) {
    let t = e[0];
    if (jT(t)) return { args: t, keys: null };
    if (HT(t)) {
      let n = VT(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function HT(e) {
  return e && typeof e == `object` && BT(e) === UT;
}
function Da(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function Mu(...e) {
  let t = jt(e),
    n = ia(e),
    { args: r, keys: o } = ba(e);
  if (r.length === 0) return ve$1([], t);
  let i = new F$1($T(r, t, o ? (s) => Da(o, s) : rt));
  return n ? i.pipe(wa(n)) : i;
}
function $T(e, t, n = rt) {
  return (r) => {
    im(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          im(
            t,
            () => {
              let d = ve$1(e[c], t),
                h = !1;
              d.subscribe(
                B$1(
                  r,
                  (p) => {
                    ((i[c] = p), h || ((h = !0), a--), a || r.next(n(i.slice())));
                  },
                  () => {
                    --s || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function im(e, t, n) {
  e ? Ke(n, e, t) : t();
}
function sm(e, t, n, r, o, i, s, a) {
  let c = [],
    d = 0,
    h = 0,
    p = !1,
    m = () => {
      p && !c.length && !d && t.complete();
    },
    y = (T) => (d < r ? w(T) : c.push(T)),
    w = (T) => {
      (i && t.next(T), d++);
      let E = !1;
      ie(n(T, h++)).subscribe(
        B$1(
          t,
          (_) => {
            (o?.(_), i ? y(_) : t.next(_));
          },
          () => {
            E = !0;
          },
          void 0,
          () => {
            if (E)
              try {
                for (d--; c.length && d < r;) {
                  let _ = c.shift();
                  s ? Ke(t, s, () => w(_)) : w(_);
                }
                m();
              } catch (_) {
                t.error(_);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      B$1(t, y, () => {
        ((p = !0), m());
      }),
    ),
    () => {
      a?.();
    }
  );
}
function S(e, t, n = 1 / 0) {
  return $(t)
    ? S((r, o) => ne((i, s) => t(r, i, o, s))(ie(e(r, o))), n)
    : (typeof t == `number` && (n = t), H((r, o) => sm(r, o, e, n)));
}
function Ea(e = 1 / 0) {
  return S(rt, e);
}
function am() {
  return Ea(1);
}
function uo(...e) {
  return am()(ve$1(e, jt(e)));
}
function fi(e) {
  return new F$1((t) => {
    ie(e()).subscribe(t);
  });
}
function zT(...e) {
  let t = ia(e),
    { args: n, keys: r } = ba(e),
    o = new F$1((i) => {
      let { length: s } = n;
      if (!s) {
        i.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        d = s;
      for (let h = 0; h < s; h++) {
        let p = !1;
        ie(n[h]).subscribe(
          B$1(
            i,
            (m) => {
              (p || ((p = !0), d--), (a[h] = m));
            },
            () => c--,
            void 0,
            () => {
              (!c || !p) && (d || i.next(r ? Da(r, a) : a), i.complete());
            },
          ),
        );
      }
    });
  return t ? o.pipe(wa(t)) : o;
}
function cm(e = 0, t, n = qg) {
  let r = -1;
  return (
    t != null && (oa(t) ? (n = t) : (r = t)),
    new F$1((o) => {
      let i = om(e) ? +e - n.now() : e;
      i < 0 && (i = 0);
      let s = 0;
      return n.schedule(function () {
        o.closed || (o.next(s++), 0 <= r ? this.schedule(void 0, r) : o.complete());
      }, i);
    })
  );
}
function qT(...e) {
  let t = jt(e),
    n = Gg(e, 1 / 0),
    r = e;
  return r.length ? (r.length === 1 ? ie(r[0]) : Ea(n)(ve$1(r, t))) : _e$1;
}
function Qe(e, t) {
  return H((n, r) => {
    let o = 0;
    n.subscribe(B$1(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function lm(e) {
  return H((t, n) => {
    let r = !1,
      o = null,
      i = null,
      s = !1,
      a = () => {
        if ((i?.unsubscribe(), (i = null), r)) {
          r = !1;
          let d = o;
          ((o = null), n.next(d));
        }
        s && n.complete();
      },
      c = () => {
        ((i = null), s && n.complete());
      };
    t.subscribe(
      B$1(
        n,
        (d) => {
          ((r = !0), (o = d), i || ie(e(d)).subscribe((i = B$1(n, a, c))));
        },
        () => {
          ((s = !0), (!r || !i || i.closed) && n.complete());
        },
      ),
    );
  });
}
function GT(e, t = di) {
  return lm(() => cm(e, t));
}
function re(e) {
  return H((t, n) => {
    let r = null,
      o = !1,
      i;
    ((r = t.subscribe(
      B$1(n, void 0, void 0, (s) => {
        ((i = ie(e(s, re(e)(t)))), r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0));
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n)));
  });
}
function fo(e, t) {
  return $(t) ? S(e, t, 1) : S(e, 1);
}
function um(e, t = di) {
  return H((n, r) => {
    let o = null,
      i = null,
      s = null,
      a = () => {
        if (o) {
          (o.unsubscribe(), (o = null));
          let d = i;
          ((i = null), r.next(d));
        }
      };
    function c() {
      let d = s + e,
        h = t.now();
      if (h < d) {
        ((o = this.schedule(void 0, d - h)), r.add(o));
        return;
      }
      a();
    }
    n.subscribe(
      B$1(
        r,
        (d) => {
          ((i = d), (s = t.now()), o || ((o = t.schedule(c, e)), r.add(o)));
        },
        () => {
          (a(), r.complete());
        },
        void 0,
        () => {
          i = o = null;
        },
      ),
    );
  });
}
function dm(e) {
  return H((t, n) => {
    let r = !1;
    t.subscribe(
      B$1(
        n,
        (o) => {
          ((r = !0), n.next(o));
        },
        () => {
          (r || n.next(e), n.complete());
        },
      ),
    );
  });
}
function Ln(e) {
  return e <= 0
    ? () => _e$1
    : H((t, n) => {
        let r = 0;
        t.subscribe(
          B$1(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          }),
        );
      });
}
function fm(e, t = rt) {
  return (
    (e = e ?? WT),
    H((n, r) => {
      let o,
        i = !0;
      n.subscribe(
        B$1(r, (s) => {
          let a = t(s);
          (i || !e(o, a)) && ((i = !1), (o = a), r.next(s));
        }),
      );
    })
  );
}
function WT(e, t) {
  return e === t;
}
function pm(e = YT) {
  return H((t, n) => {
    let r = !1;
    t.subscribe(
      B$1(
        n,
        (o) => {
          ((r = !0), n.next(o));
        },
        () => (r ? n.complete() : n.error(e())),
      ),
    );
  });
}
function YT() {
  return new lr();
}
function pi(e) {
  return H((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function sn(e, t) {
  let n = arguments.length >= 2;
  return (r) => r.pipe(e ? Qe((o, i) => e(o, i, r)) : rt, Ln(1), n ? dm(t) : pm(() => new lr()));
}
function Ca(e) {
  return e <= 0
    ? () => _e$1
    : H((t, n) => {
        let r = [];
        t.subscribe(
          B$1(
            n,
            (o) => {
              (r.push(o), e < r.length && r.shift());
            },
            () => {
              for (let o of r) n.next(o);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            },
          ),
        );
      });
}
function ZT() {
  return H((e, t) => {
    let n,
      r = !1;
    e.subscribe(
      B$1(t, (o) => {
        let i = n;
        ((n = o), r && t.next([i, o]), (r = !0));
      }),
    );
  });
}
function hm(e = {}) {
  let {
    connector: t = () => new le(),
    resetOnError: n = !0,
    resetOnComplete: r = !0,
    resetOnRefCountZero: o = !0,
  } = e;
  return (i) => {
    let s,
      a,
      c,
      d = 0,
      h = !1,
      p = !1,
      m = () => {
        (a?.unsubscribe(), (a = void 0));
      },
      y = () => {
        (m(), (s = c = void 0), (h = p = !1));
      },
      w = () => {
        let T = s;
        (y(), T?.unsubscribe());
      };
    return H((T, E) => {
      (d++, !p && !h && m());
      let _ = (c = c ?? t());
      (E.add(() => {
        (d--, d === 0 && !p && !h && (a = _u(w, o)));
      }),
        _.subscribe(E),
        !s &&
          d > 0 &&
          ((s = new on({
            next: (V) => _.next(V),
            error: (V) => {
              ((p = !0), m(), (a = _u(y, n, V)), _.error(V));
            },
            complete: () => {
              ((h = !0), m(), (a = _u(y, r)), _.complete());
            },
          })),
          ie(T).subscribe(s)));
    })(i);
  };
}
function _u(e, t, ...n) {
  if (t === !0) {
    e();
    return;
  }
  if (t === !1) return;
  let r = new on({
    next: () => {
      (r.unsubscribe(), e());
    },
  });
  return ie(t(...n)).subscribe(r);
}
function KT(e, t, n) {
  let r,
    o = !1;
  return (
    e && typeof e == `object`
      ? ({ bufferSize: r = 1 / 0, windowTime: t = 1 / 0, refCount: o = !1, scheduler: n } = e)
      : (r = e ?? 1 / 0),
    hm({
      connector: () => new ci(r, t, n),
      resetOnError: !0,
      resetOnComplete: !1,
      resetOnRefCountZero: o,
    })
  );
}
function QT(e) {
  return Qe((t, n) => e <= n);
}
function Ia(...e) {
  let t = jt(e);
  return H((n, r) => {
    (t ? uo(e, n, t) : uo(e, n)).subscribe(r);
  });
}
function Xe(e, t) {
  return H((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      B$1(
        r,
        (c) => {
          o?.unsubscribe();
          let d = 0,
            h = i++;
          ie(e(c, h)).subscribe(
            (o = B$1(
              r,
              (p) => r.next(t ? t(c, p, h, d++) : p),
              () => {
                ((o = null), a());
              },
            )),
          );
        },
        () => {
          ((s = !0), a());
        },
      ),
    );
  });
}
function hi(e) {
  return H((t, n) => {
    (ie(e).subscribe(B$1(n, () => n.complete(), si)), !n.closed && t.subscribe(n));
  });
}
function XT(e, t = !1) {
  return H((n, r) => {
    let o = 0;
    n.subscribe(
      B$1(r, (i) => {
        let s = e(i, o++);
        ((s || t) && r.next(i), !s && r.complete());
      }),
    );
  });
}
function ft(e, t, n) {
  let r = $(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? H((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          B$1(
            i,
            (c) => {
              var d;
              ((d = r.next) === null || d === void 0 || d.call(r, c), i.next(c));
            },
            () => {
              var c;
              ((a = !1), (c = r.complete) === null || c === void 0 || c.call(r), i.complete());
            },
            (c) => {
              var d;
              ((a = !1), (d = r.error) === null || d === void 0 || d.call(r, c), i.error(c));
            },
            () => {
              var c, d;
              (a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (d = r.finalize) === null || d === void 0 || d.call(r));
            },
          ),
        );
      })
    : rt;
}
var zu = `https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss`;
var M = class extends Error {
  code;
  constructor(t, n) {
    (super(Ut(t, n)), (this.code = t));
  }
};
function JT(e) {
  return `NG0${Math.abs(e)}`;
}
function Ut(e, t) {
  return `${JT(e)}${t ? `: ` + t : ``}`;
}
function X(e) {
  for (let t in e) if (e[t] === X) return t;
  throw Error(``);
}
function bm(e, t) {
  for (let n in t) Object.hasOwn(t, n) && !Object.hasOwn(e, n) && (e[n] = t[n]);
}
function Di(e) {
  if (typeof e == `string`) return e;
  if (Array.isArray(e)) return `[${e.map(Di).join(`, `)}]`;
  if (e == null) return `` + e;
  let t = e.overriddenName || e.name;
  if (t) return `${t}`;
  let n = e.toString();
  if (n == null) return `` + n;
  let r = n.indexOf(`
`);
  return r >= 0 ? n.slice(0, r) : n;
}
function Ra(e, t) {
  return e ? (t ? `${e} ${t}` : e) : t || ``;
}
var eS = X({ __forward_ref__: X });
function xa(e) {
  return ((e.__forward_ref__ = xa), e);
}
function Le(e) {
  return qu(e) ? e() : e;
}
function qu(e) {
  return typeof e == `function` && Object.hasOwn(e, eS) && e.__forward_ref__ === xa;
}
function k$1(e) {
  return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
}
function go(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function Ei(e) {
  return tS(e, Oa);
}
function Gu(e) {
  return Ei(e) !== null;
}
function tS(e, t) {
  return (Object.hasOwn(e, t) && e[t]) || null;
}
function nS(e) {
  return (e?.[Oa] ?? null) || null;
}
function Au(e) {
  return e && Object.hasOwn(e, Sa) ? e[Sa] : null;
}
var Oa = X({ ɵprov: X });
var Sa = X({ ɵinj: X });
var A = class {
  _desc;
  ngMetadataName = `InjectionToken`;
  ɵprov;
  constructor(t, n) {
    ((this._desc = t),
      (this.ɵprov = void 0),
      typeof n == `number`
        ? (this.__NG_ELEMENT_ID__ = n)
        : n !== void 0 &&
          (this.ɵprov = k$1({
            token: this,
            providedIn: n.providedIn || `root`,
            factory: n.factory,
          })));
  }
  get multi() {
    return this;
  }
  toString() {
    return `InjectionToken ${this._desc}`;
  }
};
function Wu(e) {
  return e && !!e.ɵproviders;
}
var Ci = X({ ɵcmp: X });
var Ii = X({ ɵdir: X });
var Yu = X({ ɵpipe: X });
var Zu = X({ ɵmod: X });
var yi = X({ ɵfac: X });
var mr = X({ __NG_ELEMENT_ID__: X });
var gm = X({ __NG_ENV_ID__: X });
function Dm(e) {
  return (Pa(e, `@NgModule`), e[Zu] || null);
}
function jn(e) {
  return (Pa(e, `@Component`), e[Ci] || null);
}
function ka(e) {
  return (Pa(e, `@Directive`), e[Ii] || null);
}
function Em(e) {
  return (Pa(e, `@Pipe`), e[Yu] || null);
}
function Pa(e, t) {
  if (e == null) throw new M(-919, !1);
}
function un(e) {
  return typeof e == `string` ? e : e == null ? `` : String(e);
}
var Cm = X({ ngErrorCode: X });
var rS = X({ ngErrorMessage: X });
var oS = X({ ngTokenPath: X });
function Ku(e, t) {
  return Im(``, -200, t);
}
function La(e, t) {
  throw new M(-201, !1);
}
function Im(e, t, n) {
  let r = new M(t, e);
  return ((r[Cm] = t), (r[rS] = e), n && (r[oS] = n), r);
}
function iS(e) {
  return e[Cm];
}
var Ru;
function Tm() {
  return Ru;
}
function ot(e) {
  let t = Ru;
  return ((Ru = e), t);
}
function Qu(e, t, n) {
  let r = Ei(e);
  if (r && r.providedIn == `root`) return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & 8) return null;
  if (t !== void 0) return t;
  La(e, ``);
}
var Bn = globalThis;
var ur = {};
var aS = `__NG_DI_FLAG__`;
var xu = class {
  injector;
  constructor(t) {
    this.injector = t;
  }
  retrieve(t, n) {
    let r = dr(n) || 0;
    try {
      return this.injector.get(t, r & 8 ? null : ur, r);
    } catch (o) {
      if (ro(o)) return o;
      throw o;
    }
  }
};
function cS(e, t = 0) {
  let n = Gs();
  if (n === void 0) throw new M(-203, !1);
  if (n === null) return Qu(e, void 0, t);
  {
    let r = lS(t),
      o = n.retrieve(e, r);
    if (ro(o)) {
      if (r.optional) return null;
      throw o;
    }
    return o;
  }
}
function N(e, t = 0) {
  return (Tm() || cS)(Le(e), t);
}
function b(e, t) {
  return N(e, dr(t));
}
function dr(e) {
  return typeof e > `u` || typeof e == `number`
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function lS(e) {
  return { optional: !!(e & 8), host: !!(e & 1), self: !!(e & 2), skipSelf: !!(e & 4) };
}
function Ou(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = Le(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new M(900, !1);
      let o,
        i = 0;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = uS(a);
        typeof c == `number` ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push(N(o, i));
    } else t.push(N(r));
  }
  return t;
}
function uS(e) {
  return e[aS];
}
function fr(e, t) {
  return Object.hasOwn(e, yi) ? e[yi] : null;
}
function Sm(e, t, n) {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let o = e[r],
      i = t[r];
    if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
  }
  return !0;
}
function Mm(e) {
  return e.flat(Number.POSITIVE_INFINITY);
}
function Fa(e, t) {
  e.forEach((n) => (Array.isArray(n) ? Fa(n, t) : t(n)));
}
function Xu(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function Ti(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function _m(e, t) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(t);
  return n;
}
function Nm(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) (e.push(r, e[0]), (e[0] = n));
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t;) {
      let i = o - 2;
      ((e[o] = e[i]), o--);
    }
    ((e[t] = n), (e[t + 1] = r));
  }
}
function ja(e, t, n) {
  let r = mo(e, t);
  return (r >= 0 ? (e[r | 1] = n) : ((r = ~r), Nm(e, r, t, n)), r);
}
function Ba(e, t) {
  let n = mo(e, t);
  if (n >= 0) return e[n | 1];
}
function mo(e, t) {
  return dS(e, t, 1);
}
function dS(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r;) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var Un = {};
var ze = [];
var yr = new A(``);
var Ju = new A(``, -1);
var ed = new A(``);
var ho = class {
  get(t, n = ur) {
    if (n === ur) {
      let o = Im(``, -201);
      throw ((o.name = `ɵNotFound`), o);
    }
    return n;
  }
};
function Vt(e) {
  return { ɵproviders: e };
}
function Am(e) {
  return Vt([{ provide: yr, multi: !0, useValue: e }]);
}
function Rm(...e) {
  return { ɵproviders: td(!0, e), ɵfromNgModule: !0 };
}
function td(e, ...t) {
  let n = [],
    r = /* @__PURE__ */ new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    Fa(t, (s) => {
      let a = s;
      Ma(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && xm(o, i),
    n
  );
}
function xm(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    nd(o, (i) => {
      t(i, r);
    });
  }
}
function Ma(e, t, n, r) {
  if (((e = Le(e)), !e)) return !1;
  let o = null,
    i = Au(e),
    s = !i && jn(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = Au(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let c = typeof s.dependencies == `function` ? s.dependencies() : s.dependencies;
      for (let d of c) Ma(d, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let d;
      (Fa(i.imports, (h) => {
        Ma(h, t, n, r) && ((d ||= []), d.push(h));
      }),
        d !== void 0 && xm(d, t));
    }
    if (!a) {
      let d = fr(o) || (() => new o());
      (t({ provide: o, useFactory: d, deps: ze }, o),
        t({ provide: ed, useValue: o, multi: !0 }, o),
        t({ provide: yr, useValue: () => N(o), multi: !0 }, o));
    }
    let c = i.providers;
    if (c != null && !a) {
      let d = e;
      nd(c, (h) => {
        t(h, d);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function nd(e, t) {
  for (let n of e) (Wu(n) && (n = n.ɵproviders), Array.isArray(n) ? nd(n, t) : t(n));
}
var fS = X({ provide: String, useValue: X });
function Om(e) {
  return e !== null && typeof e == `object` && fS in e;
}
function pS(e) {
  return !!(e && e.useExisting);
}
function hS(e) {
  return !!(e && e.useFactory);
}
function pr(e) {
  return typeof e == `function`;
}
function km(e) {
  return !!e.useClass;
}
var Si = new A(``);
var Ta = {};
var mm = {};
var Nu;
function yo() {
  return (Nu === void 0 && (Nu = new ho()), Nu);
}
var we$1 = class {};
var hr = class extends we$1 {
  parent;
  source;
  scopes;
  records = /* @__PURE__ */ new Map();
  _ngOnDestroyHooks = /* @__PURE__ */ new Set();
  _onDestroyHooks = [];
  get destroyed() {
    return this._destroyed;
  }
  _destroyed = !1;
  injectorDefTypes;
  constructor(t, n, r, o) {
    (super(),
      (this.parent = n),
      (this.source = r),
      (this.scopes = o),
      Pu(t, (s) => this.processProvider(s)),
      this.records.set(Ju, po(void 0, this)),
      o.has(`environment`) && this.records.set(we$1, po(void 0, this)));
    let i = this.records.get(Si);
    (i != null && typeof i.value == `string` && this.scopes.add(i.value),
      (this.injectorDefTypes = new Set(this.get(ed, ze, { self: !0 }))));
  }
  retrieve(t, n) {
    let r = dr(n) || 0;
    try {
      return this.get(t, ur, r);
    } catch (o) {
      if (ro(o)) return o;
      throw o;
    }
  }
  destroy() {
    (gi(this), (this._destroyed = !0));
    let t = R(null);
    try {
      for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
      let n = this._onDestroyHooks;
      this._onDestroyHooks = [];
      for (let r of n) r();
    } finally {
      (this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), R(t));
    }
  }
  onDestroy(t) {
    return (gi(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t));
  }
  runInContext(t) {
    gi(this);
    let n = Ft(this),
      r = ot(void 0);
    try {
      return t();
    } finally {
      (Ft(n), ot(r));
    }
  }
  get(t, n = ur, r) {
    if ((gi(this), Object.hasOwn(t, gm))) return t[gm](this);
    let o = dr(r),
      s = Ft(this),
      a = ot(void 0);
    try {
      if (!(o & 4)) {
        let d = this.records.get(t);
        if (d === void 0) {
          let h = wS(t) && Ei(t);
          (h && this.injectableDefInScope(h) ? (d = po(ku(t), Ta)) : (d = null),
            this.records.set(t, d));
        }
        if (d != null) return this.hydrate(t, d, o);
      }
      let c = o & 2 ? yo() : this.parent;
      return ((n = o & 8 && n === ur ? null : n), c.get(t, n));
    } catch (c) {
      let d = iS(c);
      throw d === -200 || d === -201 ? new M(d, null) : c;
    } finally {
      (ot(a), Ft(s));
    }
  }
  resolveInjectorInitializers() {
    let t = R(null),
      n = Ft(this),
      r = ot(void 0);
    try {
      let i = this.get(yr, ze, { self: !0 });
      for (let s of i) s();
    } finally {
      (Ft(n), ot(r), R(t));
    }
  }
  toString() {
    return `R3Injector[...]`;
  }
  processProvider(t) {
    t = Le(t);
    let n = pr(t) ? t : Le(t && t.provide),
      r = mS(t);
    if (!pr(t) && t.multi === !0) {
      let o = this.records.get(n);
      (o || ((o = po(void 0, Ta, !0)), (o.factory = () => Ou(o.multi)), this.records.set(n, o)),
        (n = t),
        o.multi.push(t));
    }
    this.records.set(n, r);
  }
  hydrate(t, n, r) {
    let o = R(null);
    try {
      if (n.value === mm) throw Ku(``);
      return (
        n.value === Ta && ((n.value = mm), (n.value = n.factory(void 0, r))),
        typeof n.value == `object` && n.value && vS(n.value) && this._ngOnDestroyHooks.add(n.value),
        n.value
      );
    } finally {
      R(o);
    }
  }
  injectableDefInScope(t) {
    if (!t.providedIn) return !1;
    let n = Le(t.providedIn);
    return typeof n == `string` ? n === `any` || this.scopes.has(n) : this.injectorDefTypes.has(n);
  }
  removeOnDestroy(t) {
    let n = this._onDestroyHooks.indexOf(t);
    n !== -1 && this._onDestroyHooks.splice(n, 1);
  }
};
function ku(e) {
  let t = Ei(e),
    n = t !== null ? t.factory : fr(e);
  if (n !== null) return n;
  if (e instanceof A) throw new M(-204, !1);
  if (e instanceof Function) return gS(e);
  throw new M(-204, !1);
}
function gS(e) {
  if (e.length > 0) throw new M(-204, !1);
  let n = nS(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function mS(e) {
  if (Om(e)) return po(void 0, e.useValue);
  return po(rd(e), Ta);
}
function rd(e, t, n) {
  let r;
  if (pr(e)) {
    let o = Le(e);
    return fr(o) || ku(o);
  } else if (Om(e)) r = () => Le(e.useValue);
  else if (hS(e)) r = () => e.useFactory(...Ou(e.deps || []));
  else if (pS(e)) r = (o, i) => N(Le(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
  else {
    let o = Le(e && (e.useClass || e.provide));
    if (yS(e)) r = () => new o(...Ou(e.deps));
    else return fr(o) || ku(o);
  }
  return r;
}
function gi(e) {
  if (e.destroyed) throw new M(-205, !1);
}
function po(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function yS(e) {
  return !!e.deps;
}
function vS(e) {
  return e !== null && typeof e == `object` && typeof e.ngOnDestroy == `function`;
}
function wS(e) {
  return typeof e == `function` || (typeof e == `object` && e.ngMetadataName === `InjectionToken`);
}
function Pu(e, t) {
  for (let n of e) Array.isArray(n) ? Pu(n, t) : n && Wu(n) ? Pu(n.ɵproviders, t) : t(n);
}
function Ne(e, t) {
  let n;
  e instanceof hr ? (gi(e), (n = e)) : (n = new xu(e));
  let o = Ft(n),
    i = ot(void 0);
  try {
    return t();
  } finally {
    (Ft(o), ot(i));
  }
}
function Pm() {
  return Tm() !== void 0 || Gs() != null;
}
var It = 0;
var O = 1;
var P = 2;
var Se = 3;
var ht = 4;
var Ue = 5;
var vr = 6;
var vo = 7;
var be$1 = 8;
var dn = 9;
var Tt = 10;
var se = 11;
var wo = 12;
var od = 13;
var Vn = 14;
var qe = 15;
var Hn = 16;
var wr = 17;
var Ht = 18;
var Mi = 19;
var id = 20;
var an = 21;
var Ua = 22;
var cn = 23;
var it = 24;
var br = 25;
var Lm = 26;
var bo = 27;
var De = 28;
var Fm = 1;
var sd = 6;
var Dr = 7;
var _i = 8;
var Er = 9;
var Ee = 10;
function fn(e) {
  return Array.isArray(e) && typeof e[Fm] == `object`;
}
function gt(e) {
  return Array.isArray(e) && e[Fm] === !0;
}
function ad(e) {
  return (e.flags & 4) !== 0;
}
function $t(e) {
  return e.componentOffset > -1;
}
function Do(e) {
  return (e.flags & 1) === 1;
}
function zt(e) {
  return !!e.template;
}
function Eo(e) {
  return (e[P] & 512) !== 0;
}
function Cr(e) {
  return (e[P] & 256) === 256;
}
var ge$1 = (function (e) {
  return (
    (e[(e.NONE = 0)] = `NONE`),
    (e[(e.HTML = 1)] = `HTML`),
    (e[(e.STYLE = 2)] = `STYLE`),
    (e[(e.SCRIPT = 3)] = `SCRIPT`),
    (e[(e.URL = 4)] = `URL`),
    (e[(e.RESOURCE_URL = 5)] = `RESOURCE_URL`),
    (e[(e.ATTRIBUTE_NO_BINDING = 6)] = `ATTRIBUTE_NO_BINDING`),
    e
  );
})(ge$1 || {});
var mi;
var gr = `svg`;
var Va = `math`;
var Lu = ``;
var ym = `*`;
var Fu = () => Object.create(null);
function bS() {
  return (
    mi ||
    ((mi = Fu()),
    Fn(ge$1.HTML, void 0, [
      [`iframe`, [`srcdoc`]],
      [`*`, [`innerHTML`, `outerHTML`]],
    ]),
    Fn(ge$1.STYLE, void 0, [[`*`, [`style`]]]),
    Fn(ge$1.URL, void 0, [
      [`*`, [`formAction`]],
      [`area`, [`href`]],
      [`a`, [`href`, `xlink:href`]],
      [`form`, [`action`]],
    ]),
    Fn(ge$1.URL, Va, [[`*`, [`href`, `xlink:href`]]]),
    Fn(ge$1.RESOURCE_URL, void 0, [
      [`base`, [`href`]],
      [`embed`, [`src`]],
      [`frame`, [`src`]],
      [`iframe`, [`src`]],
      [`link`, [`href`]],
      [`object`, [`codebase`, `data`]],
    ]),
    Fn(ge$1.URL, gr, [[`a`, [`href`, `xlink:href`]]]),
    Fn(ge$1.ATTRIBUTE_NO_BINDING, gr, [
      [`animate`, [`attributeName`, `values`, `to`, `from`]],
      [`set`, [`to`, `attributeName`]],
      [`animateMotion`, [`attributeName`]],
      [`animateTransform`, [`attributeName`]],
    ]),
    Fn(ge$1.ATTRIBUTE_NO_BINDING, void 0, [
      [
        `unknown`,
        [
          `attributeName`,
          `values`,
          `to`,
          `from`,
          `sandbox`,
          `allow`,
          `allowFullscreen`,
          `referrerPolicy`,
          `csp`,
          `fetchPriority`,
          `credentialless`,
        ],
      ],
      [
        `iframe`,
        [
          `sandbox`,
          `allow`,
          `allowFullscreen`,
          `referrerPolicy`,
          `csp`,
          `fetchPriority`,
          `credentialless`,
        ],
      ],
    ]),
    mi)
  );
}
function Fn(e, t, n) {
  let r = t ?? Lu;
  for (let [o, i] of n) {
    let s = o.toLowerCase();
    for (let a of i) {
      let c = a.toLowerCase(),
        d = (mi[c] ??= Fu()),
        h = (d[r] ??= Fu());
      h[s] = e;
    }
  }
}
function jm(e, t, n) {
  let o = bS()[t.toLowerCase()];
  if (!o) return ge$1.NONE;
  let i = e.toLowerCase(),
    s;
  if (n) {
    let a = o[n];
    a && (s = a[i] ?? a[ym]);
  }
  if (s === void 0) {
    let a = o[Lu];
    a && (s = a[i] ?? a[ym]);
  }
  if (s === void 0 && (!n || n === Lu)) {
    let a = o[gr];
    a && (s = a[i]);
  }
  return s ?? ge$1.NONE;
}
function Ve(e) {
  for (; Array.isArray(e);) e = e[It];
  return e;
}
function cd(e, t) {
  return Ve(t[e]);
}
function Je(e, t) {
  return Ve(t[e.index]);
}
function Ha(e, t) {
  return e.data[t];
}
function Bm(e, t) {
  return e[t];
}
function mt(e, t) {
  let n = t[e];
  return fn(n) ? n : n[It];
}
function Um(e) {
  return (e[P] & 4) === 4;
}
function $a(e) {
  return (e[P] & 128) === 128;
}
function Vm(e) {
  return gt(e[Se]);
}
function yt(e, t) {
  return t == null ? null : e[t];
}
function ld(e) {
  e[wr] = 0;
}
function ud(e) {
  e[P] & 1024 || ((e[P] |= 1024), $a(e) && Ir(e));
}
function Hm(e, t) {
  for (; e > 0;) ((t = t[Vn]), e--);
  return t;
}
function Ni(e) {
  return !!(e[P] & 9216 || e[it]?.dirty);
}
function za(e) {
  (e[Tt].changeDetectionScheduler?.notify(8), e[P] & 64 && (e[P] |= 1024), Ni(e) && Ir(e));
}
function Ir(e) {
  e[Tt].changeDetectionScheduler?.notify(0);
  let t = ln(e);
  for (; t !== null && !(t[P] & 8192 || ((t[P] |= 8192), !$a(t)));) t = ln(t);
}
function qa(e, t) {
  if (Cr(e)) throw new M(911, !1);
  (e[an] === null && (e[an] = []), e[an].push(t));
}
function $m(e, t) {
  if (e[an] === null) return;
  let n = e[an].indexOf(t);
  n !== -1 && e[an].splice(n, 1);
}
function ln(e) {
  let t = e[Se];
  return gt(t) ? t[Se] : t;
}
function dd(e) {
  return (e[vo] ??= []);
}
function fd(e) {
  return (e.cleanup ??= []);
}
function zm(e, t, n, r) {
  let o = dd(t);
  (o.push(n), e.firstCreatePass && fd(e).push(r, o.length - 1));
}
var z = { lFrame: ry(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var ju = !1;
function qm() {
  return z.lFrame.elementDepthCount;
}
function Gm() {
  z.lFrame.elementDepthCount++;
}
function pd() {
  z.lFrame.elementDepthCount--;
}
function Ga() {
  return z.bindingsEnabled;
}
function hd() {
  return z.skipHydrationRootTNode !== null;
}
function gd(e) {
  return z.skipHydrationRootTNode === e;
}
function md() {
  z.skipHydrationRootTNode = null;
}
function L() {
  return z.lFrame.lView;
}
function ue$1() {
  return z.lFrame.tView;
}
function Wm(e) {
  return ((z.lFrame.contextLView = e), e[be$1]);
}
function Ym(e) {
  return ((z.lFrame.contextLView = null), e);
}
function Ae() {
  let e = yd();
  for (; e !== null && e.type === 64;) e = e.parent;
  return e;
}
function yd() {
  return z.lFrame.currentTNode;
}
function Zm() {
  let e = z.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Co(e, t) {
  let n = z.lFrame;
  ((n.currentTNode = e), (n.isParent = t));
}
function vd() {
  return z.lFrame.isParent;
}
function wd() {
  z.lFrame.isParent = !1;
}
function Km() {
  return z.lFrame.contextLView;
}
function bd() {
  return ju;
}
function vi(e) {
  let t = ju;
  return ((ju = e), t);
}
function Dd() {
  return z.lFrame.bindingIndex;
}
function Qm(e) {
  return (z.lFrame.bindingIndex = e);
}
function $n() {
  return z.lFrame.bindingIndex++;
}
function Ai(e) {
  let t = z.lFrame,
    n = t.bindingIndex;
  return ((t.bindingIndex = t.bindingIndex + e), n);
}
function Xm() {
  return z.lFrame.inI18n;
}
function Jm(e, t) {
  let n = z.lFrame;
  ((n.bindingIndex = n.bindingRootIndex = e), Wa(t));
}
function ey() {
  return z.lFrame.currentDirectiveIndex;
}
function Wa(e) {
  z.lFrame.currentDirectiveIndex = e;
}
function ty(e) {
  let t = z.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function Ya() {
  return z.lFrame.currentQueryIndex;
}
function Ri(e) {
  z.lFrame.currentQueryIndex = e;
}
function DS(e) {
  let t = e[O];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Ue] : null;
}
function Ed(e, t, n) {
  if (n & 4) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & 1);)
      if (((o = DS(i)), o === null || ((i = i[Vn]), o.type & 10))) break;
    if (o === null) return !1;
    ((t = o), (e = i));
  }
  let r = (z.lFrame = ny());
  return ((r.currentTNode = t), (r.lView = e), !0);
}
function Za(e) {
  let t = ny(),
    n = e[O];
  ((z.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1));
}
function ny() {
  let e = z.lFrame,
    t = e === null ? null : e.child;
  return t === null ? ry(e) : t;
}
function ry(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return (e !== null && (e.child = t), t);
}
function oy() {
  let e = z.lFrame;
  return ((z.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e);
}
var Cd = oy;
function Ka() {
  let e = oy();
  ((e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0));
}
function iy(e) {
  return (z.lFrame.contextLView = Hm(e, z.lFrame.contextLView))[be$1];
}
function vt() {
  return z.lFrame.selectedIndex;
}
function zn(e) {
  z.lFrame.selectedIndex = e;
}
function Tr() {
  let e = z.lFrame;
  return Ha(e.tView, e.selectedIndex);
}
function sy() {
  z.lFrame.currentNamespace = gr;
}
function ay() {
  ES();
}
function ES() {
  z.lFrame.currentNamespace = null;
}
function Id() {
  return z.lFrame.currentNamespace;
}
var cy = !0;
function Qa() {
  return cy;
}
function xi(e) {
  cy = e;
}
function Bu(e, t = null, n = null, r) {
  let o = Td(e, t, n, r);
  return (o.resolveInjectorInitializers(), o);
}
function Td(e, t = null, n = null, r, o = /* @__PURE__ */ new Set()) {
  return new hr([n || ze, Rm(e)], t || yo(), null, o);
}
var Fe = class e {
  static THROW_IF_NOT_FOUND = ur;
  static NULL = new ho();
  static create(t, n) {
    if (Array.isArray(t)) return Bu({ name: `` }, n, t, ``);
    {
      let r = t.name ?? ``;
      return Bu({ name: r }, t.parent, t.providers, r);
    }
  }
  static ɵprov = k$1({ token: e, providedIn: `any`, factory: () => N(Ju) });
  static __NG_ELEMENT_ID__ = -1;
};
var me = new A(``);
var je = class {
  static __NG_ELEMENT_ID__ = CS;
  static __NG_ENV_ID__ = (t) => t;
};
var _a = class extends je {
  _lView;
  constructor(t) {
    (super(), (this._lView = t));
  }
  get destroyed() {
    return Cr(this._lView);
  }
  onDestroy(t) {
    let n = this._lView;
    return (qa(n, t), () => $m(n, t));
  }
};
function CS() {
  return new _a(L());
}
var ly = !1;
var uy = new A(``);
var pn = (() => {
  class e {
    taskId = 0;
    pendingTasks = /* @__PURE__ */ new Set();
    destroyed = !1;
    pendingTask = new Pe$1(!1);
    debugTaskTracker = b(uy, { optional: !0 });
    get hasPendingTasks() {
      return this.destroyed ? !1 : this.pendingTask.value;
    }
    get hasPendingTasksObservable() {
      return this.destroyed
        ? new F$1((n) => {
            (n.next(!1), n.complete());
          })
        : this.pendingTask;
    }
    add() {
      !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
      let n = this.taskId++;
      return (this.pendingTasks.add(n), this.debugTaskTracker?.add(n), n);
    }
    has(n) {
      return this.pendingTasks.has(n);
    }
    remove(n) {
      (this.pendingTasks.delete(n),
        this.debugTaskTracker?.remove(n),
        this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1));
    }
    ngOnDestroy() {
      (this.pendingTasks.clear(),
        this.hasPendingTasks && this.pendingTask.next(!1),
        (this.destroyed = !0),
        this.pendingTask.unsubscribe());
    }
    static ɵprov = k$1({ token: e, providedIn: `root`, factory: () => new e() });
  }
  return e;
})();
var Uu = class extends le {
  __isAsync;
  destroyRef = void 0;
  pendingTasks = void 0;
  constructor(t = !1) {
    (super(),
      (this.__isAsync = t),
      Pm() &&
        ((this.destroyRef = b(je, { optional: !0 }) ?? void 0),
        (this.pendingTasks = b(pn, { optional: !0 }) ?? void 0)));
  }
  emit(t) {
    let n = R(null);
    try {
      super.next(t);
    } finally {
      R(n);
    }
  }
  subscribe(t, n, r) {
    let o = t,
      i = n || (() => null),
      s = r;
    if (t && typeof t == `object`) {
      let c = t;
      ((o = c.next?.bind(c)), (i = c.error?.bind(c)), (s = c.complete?.bind(c)));
    }
    this.__isAsync &&
      ((i = this.wrapInTimeout(i)),
      o && (o = this.wrapInTimeout(o)),
      s && (s = this.wrapInTimeout(s)));
    let a = super.subscribe({ next: o, error: i, complete: s });
    return (t instanceof he && t.add(a), a);
  }
  wrapInTimeout(t) {
    return (n) => {
      let r = this.pendingTasks?.add();
      setTimeout(() => {
        try {
          t(n);
        } finally {
          r !== void 0 && this.pendingTasks?.remove(r);
        }
      });
    };
  }
};
var Ge = Uu;
function Na(...e) {}
function Sd(e) {
  let t, n;
  function r() {
    e = Na;
    try {
      (n !== void 0 && typeof cancelAnimationFrame == `function` && cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t));
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      (e(), r());
    })),
    typeof requestAnimationFrame == `function` &&
      (n = requestAnimationFrame(() => {
        (e(), r());
      })),
    () => r()
  );
}
function dy(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = Na;
    }
  );
}
var Md = `isAngularZone`;
var wi = Md + `_ID`;
var IS = 0;
var Be = class e {
  hasPendingMacrotasks = !1;
  hasPendingMicrotasks = !1;
  isStable = !0;
  onUnstable = new Ge(!1);
  onMicrotaskEmpty = new Ge(!1);
  onStable = new Ge(!1);
  onError = new Ge(!1);
  constructor(t) {
    let {
      enableLongStackTrace: n = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: o = !1,
      scheduleInRootZone: i = ly,
    } = t;
    if (typeof Zone > `u`) throw new M(908, !1);
    Zone.assertZonePatched();
    let s = this;
    ((s._nesting = 0),
      (s._outer = s._inner = Zone.current),
      Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
      n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
      (s.shouldCoalesceEventChangeDetection = !o && r),
      (s.shouldCoalesceRunChangeDetection = o),
      (s.callbackScheduled = !1),
      (s.scheduleInRootZone = i),
      MS(s));
  }
  static isInAngularZone() {
    return typeof Zone < `u` && Zone.current.get(Md) === !0;
  }
  static assertInAngularZone() {
    if (!e.isInAngularZone()) throw new M(909, !1);
  }
  static assertNotInAngularZone() {
    if (e.isInAngularZone()) throw new M(909, !1);
  }
  run(t, n, r) {
    return this._inner.run(t, n, r);
  }
  runTask(t, n, r, o) {
    let i = this._inner,
      s = i.scheduleEventTask(`NgZoneEvent: ` + o, t, TS, Na, Na);
    try {
      return i.runTask(s, n, r);
    } finally {
      i.cancelTask(s);
    }
  }
  runGuarded(t, n, r) {
    return this._inner.runGuarded(t, n, r);
  }
  runOutsideAngular(t) {
    return this._outer.run(t);
  }
};
var TS = {};
function _d(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      (e._nesting++, e.onMicrotaskEmpty.emit(null));
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function SS(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    Sd(() => {
      ((e.callbackScheduled = !1),
        Vu(e),
        (e.isCheckStableRunning = !0),
        _d(e),
        (e.isCheckStableRunning = !1));
    });
  }
  (e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    Vu(e));
}
function MS(e) {
  let t = () => {
      SS(e);
    },
    n = IS++;
  e._inner = e._inner.fork({
    name: `angular`,
    properties: { [Md]: !0, [wi]: n, [wi + n]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (_S(c)) return r.invokeTask(i, s, a, c);
      try {
        return (vm(e), r.invokeTask(i, s, a, c));
      } finally {
        (((e.shouldCoalesceEventChangeDetection && s.type === `eventTask`) ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          wm(e));
      }
    },
    onInvoke: (r, o, i, s, a, c, d) => {
      try {
        return (vm(e), r.invoke(i, s, a, c, d));
      } finally {
        (e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !NS(c) && t(), wm(e));
      }
    },
    onHasTask: (r, o, i, s) => {
      (r.hasTask(i, s),
        o === i &&
          (s.change == `microTask`
            ? ((e._hasPendingMicrotasks = s.microTask), Vu(e), _d(e))
            : s.change == `macroTask` && (e.hasPendingMacrotasks = s.macroTask)));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s),
      e.runOutsideAngular(() => e.onError.emit(s)),
      !1
    ),
  });
}
function Vu(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function vm(e) {
  (e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null)));
}
function wm(e) {
  (e._nesting--, _d(e));
}
var bi = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new Ge();
  onMicrotaskEmpty = new Ge();
  onStable = new Ge();
  onError = new Ge();
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function _S(e) {
  return fy(e, `__ignore_ng_zone__`);
}
function NS(e) {
  return fy(e, `__scheduler_tick__`);
}
function fy(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var pt = class {
  _console = console;
  handleError(t) {
    this._console.error(`ERROR`, t);
  }
};
function py(e) {
  return hy(e) ? e : new Hu(e);
}
function hy(e) {
  return (
    e instanceof Error ||
    (typeof e == `object` &&
      e !== null &&
      typeof e.name == `string` &&
      typeof e.message == `string`)
  );
}
var Hu = class extends Error {
  constructor(t) {
    (super(String(t), { cause: t }), (this.name = `ErrorBoundaryWrappedError`));
  }
};
var st = new A(``, {
  factory: () => {
    let e = b(Be),
      t = b(we$1),
      n;
    return (r) => {
      e.runOutsideAngular(() => {
        t.destroyed && !n
          ? setTimeout(() => {
              throw r;
            })
          : ((n ??= t.get(pt)), n.handleError(r));
      });
    };
  },
});
var gy = {
  provide: yr,
  useValue: () => {
    b(pt, { optional: !0 });
  },
  multi: !0,
};
var AS = new A(``, {
  factory: () => {
    let e = b(me).defaultView;
    if (!e) return;
    let t = b(st),
      n = (i) => {
        (t(i.reason), i.preventDefault());
      },
      r = (i) => {
        (i.error ? t(i.error) : t(new Error(i.message, { cause: i })), i.preventDefault());
      },
      o = () => {
        (e.addEventListener(`unhandledrejection`, n), e.addEventListener(`error`, r));
      };
    (typeof Zone < `u` ? Zone.root.run(o) : o(),
      b(je).onDestroy(() => {
        (e.removeEventListener(`error`, r), e.removeEventListener(`unhandledrejection`, n));
      }));
  },
});
function RS() {
  return Vt([
    Am(() => {
      b(AS);
    }),
  ]);
}
function Ce$1(e, t) {
  let [n, r, o] = lu(e, t?.equal),
    i = n;
  i[ye$1];
  return ((i.set = r), (i.update = o), (i.asReadonly = Xa.bind(i)), i);
}
function Xa() {
  let e = this[ye$1];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    ((t[ye$1] = e), (e.readonlyFn = t));
  }
  return e.readonlyFn;
}
var Oi = new A(``, { factory: () => xS });
var xS = `ng`;
var Ja = new A(``);
var ki = new A(``, { providedIn: `platform`, factory: () => `unknown` });
var OS = new A(``);
var Pi = new A(``, {
  factory: () => b(me).body?.querySelector(`[ngCspNonce]`)?.getAttribute(`ngCspNonce`) || null,
});
var Io = (() => {
  class e {
    view;
    node;
    constructor(n, r) {
      ((this.view = n), (this.node = r));
    }
    static __NG_ELEMENT_ID__ = kS;
  }
  return e;
})();
function kS() {
  return new Io(L(), Ae());
}
var Bt = class {};
var Li = new A(``, { factory: () => !0 });
var Nd = new A(``);
var ec = (() => {
  class e {
    static ɵprov = k$1({ token: e, providedIn: `root`, factory: () => new $u() });
  }
  return e;
})();
var $u = class {
  dirtyEffectCount = 0;
  queues = /* @__PURE__ */ new Map();
  add(t) {
    (this.enqueue(t), this.schedule(t));
  }
  schedule(t) {
    t.dirty && this.dirtyEffectCount++;
  }
  remove(t) {
    let n = t.zone,
      r = this.queues.get(n);
    r.has(t) && (r.delete(t), t.dirty && this.dirtyEffectCount--);
  }
  enqueue(t) {
    let n = t.zone;
    this.queues.has(n) || this.queues.set(n, /* @__PURE__ */ new Set());
    let r = this.queues.get(n);
    r.has(t) || r.add(t);
  }
  flush() {
    for (; this.dirtyEffectCount > 0;) {
      let t = !1;
      for (let [n, r] of this.queues)
        n === null ? (t ||= this.flushQueue(r)) : (t ||= n.run(() => this.flushQueue(r)));
      t || (this.dirtyEffectCount = 0);
    }
  }
  flushQueue(t) {
    let n = !1;
    for (let r of t) r.dirty && (this.dirtyEffectCount--, (n = !0), r.run());
    return n;
  }
};
var Aa = class {
  [ye$1];
  constructor(t) {
    this[ye$1] = t;
  }
  destroy() {
    this[ye$1].destroy();
  }
};
function Ad(e, t) {
  let n = t?.injector ?? b(Fe),
    r = t?.manualCleanup !== !0 ? n.get(je) : null,
    o,
    i = n.get(Io, null, { optional: !0 }),
    s = n.get(Bt);
  return (
    i !== null
      ? ((o = yy(i.view, s, e)), r instanceof _a && r._lView === i.view && (r = null))
      : (o = FS(e, n.get(ec), s)),
    (o.injector = n),
    r !== null && (o.onDestroyFns = [r.onDestroy(() => o.destroy())]),
    new Aa(o)
  );
}
var my = Y(C({}, uu), {
  cleanupFns: void 0,
  zone: null,
  onDestroyFns: null,
  run() {
    let e = vi(!1);
    try {
      du(this);
    } finally {
      vi(e);
    }
  },
  cleanup() {
    if (!this.cleanupFns?.length) return;
    let e = R(null);
    try {
      for (; this.cleanupFns.length;) this.cleanupFns.pop()();
    } finally {
      ((this.cleanupFns = []), R(e));
    }
  },
});
var PS = Y(C({}, my), {
  consumerMarkedDirty() {
    (this.scheduler.schedule(this), this.notifier.notify(12));
  },
  destroy() {
    if ((xn(this), this.onDestroyFns !== null)) for (let e of this.onDestroyFns) e();
    (this.cleanup(), this.scheduler.remove(this));
  },
});
var LS = Y(C({}, my), {
  consumerMarkedDirty() {
    ((this.view[P] |= 8192), Ir(this.view), this.notifier.notify(13));
  },
  destroy() {
    if ((xn(this), this.onDestroyFns !== null)) for (let e of this.onDestroyFns) e();
    (this.cleanup(), this.view[cn]?.delete(this));
  },
});
function yy(e, t, n) {
  let r = Object.create(LS);
  return (
    (r.view = e),
    (r.zone = typeof Zone < `u` ? Zone.current : null),
    (r.notifier = t),
    (r.userFn = n),
    (r.fn = vy(r, n)),
    (e[cn] ??= /* @__PURE__ */ new Set()),
    e[cn].add(r),
    r.consumerMarkedDirty(r),
    r
  );
}
function FS(e, t, n) {
  let r = Object.create(PS);
  return (
    (r.userFn = e),
    (r.fn = vy(r, e)),
    (r.scheduler = t),
    (r.notifier = n),
    (r.zone = typeof Zone < `u` ? Zone.current : null),
    r.scheduler.add(r),
    r.notifier.notify(12),
    r
  );
}
function vy(e, t) {
  return () => {
    t((n) => (e.cleanupFns ??= []).push(n));
  };
}
function tc(e) {
  return typeof e == `function` && e[ye$1] !== void 0;
}
var Fi = (() => {
  class e {
    internalPendingTasks = b(pn);
    scheduler = b(Bt);
    errorHandler = b(st);
    add() {
      let n = this.internalPendingTasks.add();
      return () => {
        this.internalPendingTasks.has(n) &&
          (this.scheduler.notify(11), this.internalPendingTasks.remove(n));
      };
    }
    run(n) {
      let r = this.add();
      try {
        n().catch(this.errorHandler).finally(r);
      } catch (o) {
        (this.errorHandler(o), r());
      }
    }
    static ɵprov = k$1({ token: e, providedIn: `root`, factory: () => new e() });
  }
  return e;
})();
var _c = Symbol(`InputSignalNode#UNSET`);
var iv = Y(C({}, no), {
  transformFn: void 0,
  applyValueToInputSignal(e, t) {
    On(e, t);
  },
});
function Wi(e) {
  return { toString: e }.toString();
}
var Z = (function (e) {
  return (
    (e[(e.TemplateCreateStart = 0)] = `TemplateCreateStart`),
    (e[(e.TemplateCreateEnd = 1)] = `TemplateCreateEnd`),
    (e[(e.TemplateUpdateStart = 2)] = `TemplateUpdateStart`),
    (e[(e.TemplateUpdateEnd = 3)] = `TemplateUpdateEnd`),
    (e[(e.LifecycleHookStart = 4)] = `LifecycleHookStart`),
    (e[(e.LifecycleHookEnd = 5)] = `LifecycleHookEnd`),
    (e[(e.OutputStart = 6)] = `OutputStart`),
    (e[(e.OutputEnd = 7)] = `OutputEnd`),
    (e[(e.BootstrapApplicationStart = 8)] = `BootstrapApplicationStart`),
    (e[(e.BootstrapApplicationEnd = 9)] = `BootstrapApplicationEnd`),
    (e[(e.BootstrapComponentStart = 10)] = `BootstrapComponentStart`),
    (e[(e.BootstrapComponentEnd = 11)] = `BootstrapComponentEnd`),
    (e[(e.ChangeDetectionStart = 12)] = `ChangeDetectionStart`),
    (e[(e.ChangeDetectionEnd = 13)] = `ChangeDetectionEnd`),
    (e[(e.ChangeDetectionSyncStart = 14)] = `ChangeDetectionSyncStart`),
    (e[(e.ChangeDetectionSyncEnd = 15)] = `ChangeDetectionSyncEnd`),
    (e[(e.AfterRenderHooksStart = 16)] = `AfterRenderHooksStart`),
    (e[(e.AfterRenderHooksEnd = 17)] = `AfterRenderHooksEnd`),
    (e[(e.ComponentStart = 18)] = `ComponentStart`),
    (e[(e.ComponentEnd = 19)] = `ComponentEnd`),
    (e[(e.DeferBlockStateStart = 20)] = `DeferBlockStateStart`),
    (e[(e.DeferBlockStateEnd = 21)] = `DeferBlockStateEnd`),
    (e[(e.DynamicComponentStart = 22)] = `DynamicComponentStart`),
    (e[(e.DynamicComponentEnd = 23)] = `DynamicComponentEnd`),
    (e[(e.HostBindingsUpdateStart = 24)] = `HostBindingsUpdateStart`),
    (e[(e.HostBindingsUpdateEnd = 25)] = `HostBindingsUpdateEnd`),
    e
  );
})(Z || {});
var uc = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(t, n, r) {
    ((this.previousValue = t), (this.currentValue = n), (this.firstChange = r));
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function sv(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
var av = null;
var xr = (() => {
  av = wy;
  let e = () => wy;
  return ((e.ngInherit = !0), e);
})();
function YS() {
  return av;
}
function wy(e) {
  return (e.type.prototype.ngOnChanges && (e.setInput = KS), ZS);
}
function ZS() {
  let e = cv(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === Un) e.previous = t;
    else for (let r in t) n[r] = t[r];
    ((e.current = null), this.ngOnChanges(t));
  }
}
function KS(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = cv(e) || QS(e, { previous: Un, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    d = c[i];
  ((a[i] = new uc(d && d.currentValue, n, c === Un)), sv(e, t, o, n));
}
var Vd = `__ngSimpleChanges__`;
function cv(e) {
  return (Object.hasOwn(e, Vd) && e[Vd]) || null;
}
function QS(e, t) {
  return (e[Vd] = t);
}
var by = [];
var J = function (e, t = null, n) {
  for (let r = 0; r < by.length; r++) {
    let o = by[r];
    o(e, t, n);
  }
};
function XS(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = YS()(t);
    ((n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s));
  }
  (o && (n.preOrderHooks ??= []).push(0 - e, o),
    i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i)));
}
function lv(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let {
      ngAfterContentInit: s,
      ngAfterContentChecked: a,
      ngAfterViewInit: c,
      ngAfterViewChecked: d,
      ngOnDestroy: h,
    } = e.data[n].type.prototype;
    (s && (e.contentHooks ??= []).push(-n, s),
      a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)),
      c && (e.viewHooks ??= []).push(-n, c),
      d && ((e.viewHooks ??= []).push(n, d), (e.viewCheckHooks ??= []).push(n, d)),
      h != null && (e.destroyHooks ??= []).push(n, h));
  }
}
function sc(e, t, n) {
  uv(e, t, 3, n);
}
function ac(e, t, n, r) {
  (e[P] & 3) === n && uv(e, t, n, r);
}
function Rd(e, t) {
  let n = e[P];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[P] = n));
}
function uv(e, t, n, r) {
  let o = r !== void 0 ? e[wr] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == `number`) {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      (t[c] < 0 && (e[wr] += 65536),
        (a < i || i == -1) && (JS(e, n, t, c), (e[wr] = (e[wr] & 4294901760) + c + 2)),
        c++);
}
function Dy(e, t) {
  J(Z.LifecycleHookStart, e, t);
  let n = R(null);
  try {
    t.call(e);
  } finally {
    (R(n), J(Z.LifecycleHookEnd, e, t));
  }
}
function JS(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    a = e[o ? -n[r] : n[r]];
  o ? e[P] >> 14 < e[wr] >> 16 && (e[P] & 3) === t && ((e[P] += 16384), Dy(a, i)) : Dy(a, i);
}
var Mo = -1;
var Mr = class {
  factory;
  name;
  injectImpl;
  resolving = !1;
  canSeeViewProviders;
  multi;
  componentProviders;
  index;
  providerFactory;
  constructor(t, n, r, o) {
    ((this.factory = t), (this.name = o), (this.canSeeViewProviders = n), (this.injectImpl = r));
  }
};
function eM(e) {
  return (e.flags & 8) !== 0;
}
function tM(e) {
  return (e.flags & 16) !== 0;
}
function nM(e, t, n) {
  let r = 0;
  for (; r < n.length;) {
    let o = n[r];
    if (typeof o == `number`) {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      (rM(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++);
    }
  }
  return r;
}
function dv(e) {
  return e === 3 || e === 4 || e === 6;
}
function rM(e) {
  return e.charCodeAt(0) === 64;
}
function No(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == `number`
          ? (n = o)
          : n === 0 || (n === -1 || n === 2 ? Ey(e, n, o, null, t[++r]) : Ey(e, n, o, null, null));
      }
    }
  return e;
}
function Ey(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length;) {
      let a = e[i++];
      if (typeof a == `number`) {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length;) {
    let a = e[i];
    if (typeof a == `number`) break;
    if (a === n) {
      o !== null && (e[i + 1] = o);
      return;
    }
    (i++, o !== null && i++);
  }
  (s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    o !== null && e.splice(i++, 0, o));
}
function fv(e) {
  return e !== Mo;
}
function dc(e) {
  return e & 32767;
}
function oM(e) {
  return e >> 16;
}
function fc(e, t) {
  let n = oM(e),
    r = t;
  for (; n > 0;) ((r = r[Vn]), n--);
  return r;
}
var Hd = !0;
function Cy(e) {
  let t = Hd;
  return ((Hd = e), t);
}
var pv = 255;
var hv = 5;
var sM = 0;
var qt = {};
function aM(e, t, n) {
  let r;
  (typeof n == `string` ? (r = n.charCodeAt(0) || 0) : Object.hasOwn(n, mr) && (r = n[mr]),
    (r ??= n[mr] = sM++));
  let o = r & pv,
    i = 1 << o;
  t.data[e + (o >> hv)] |= i;
}
function pc(e, t) {
  let n = gv(e, t);
  if (n !== -1) return n;
  let r = t[O];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length), xd(r.data, e), xd(t, null), xd(r.blueprint, null));
  let o = If(e, t),
    i = e.injectorIndex;
  if (fv(o)) {
    let s = dc(o),
      a = fc(o, t),
      c = a[O].data;
    for (let d = 0; d < 8; d++) t[i + d] = a[s + d] | c[s + d];
  }
  return ((t[i + 8] = o), i);
}
function xd(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function gv(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function If(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null;) {
    if (((r = Dv(o)), r === null)) return Mo;
    if ((n++, (o = o[Vn]), r.injectorIndex !== -1)) return r.injectorIndex | (n << 16);
  }
  return Mo;
}
function $d(e, t, n) {
  aM(e, t, n);
}
function cM(e, t) {
  if (t === `class`) return e.classes;
  if (t === `style`) return e.styles;
  let n = e.attrs;
  if (n) {
    let r = n.length,
      o = 0;
    for (; o < r;) {
      let i = n[o];
      if (dv(i)) break;
      if (i === 0) o = o + 2;
      else if (typeof i == `number`) for (o++; o < r && typeof n[o] == `string`;) o++;
      else {
        if (i === t) return n[o + 1];
        o = o + 2;
      }
    }
  }
  return null;
}
function mv(e, t, n) {
  if (n & 8 || e !== void 0) return e;
  La(t, `NodeInjector`);
}
function yv(e, t, n, r) {
  if ((n & 8 && r === void 0 && (r = null), (n & 3) === 0)) {
    let o = e[dn],
      i = ot(void 0);
    try {
      return o ? o.get(t, r, n & 8) : Qu(t, r, n & 8);
    } finally {
      ot(i);
    }
  }
  return mv(r, t, n);
}
function vv(e, t, n, r = 0, o) {
  if (e !== null) {
    if (t[P] & 2048 && !(r & 2)) {
      let s = fM(e, t, n, r, qt);
      if (s !== qt) return s;
    }
    let i = wv(e, t, n, r, qt);
    if (i !== qt) return i;
  }
  return yv(t, n, r, o);
}
function wv(e, t, n, r, o) {
  let i = uM(n);
  if (typeof i == `function`) {
    if (!Ed(t, e, r)) return r & 1 ? mv(o, n, r) : yv(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & 8))) La(n);
      else return s;
    } finally {
      Cd();
    }
  } else if (typeof i == `number`) {
    let s = null,
      a = gv(e, t),
      c = Mo,
      d = r & 1 ? t[qe][Ue] : null;
    for (
      (a === -1 || r & 4) &&
      ((c = a === -1 ? If(e, t) : t[a + 8]),
      c === Mo || !Ty(r, !1) ? (a = -1) : ((s = t[O]), (a = dc(c)), (t = fc(c, t))));
      a !== -1;
    ) {
      let h = t[O];
      if (Iy(i, a, h.data)) {
        let p = lM(a, t, n, s, r, d);
        if (p !== qt) return p;
      }
      ((c = t[a + 8]),
        c !== Mo && Ty(r, t[O].data[a + 8] === d) && Iy(i, a, t)
          ? ((s = h), (a = dc(c)), (t = fc(c, t)))
          : (a = -1));
    }
  }
  return o;
}
function lM(e, t, n, r, o, i) {
  let s = t[O],
    a = s.data[e + 8],
    h = cc(a, s, n, r == null ? $t(a) && Hd : r != s && (a.type & 3) !== 0, o & 1 && i === a);
  return h !== null ? Ui(t, s, h, a, o) : qt;
}
function cc(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    c = e.directiveStart,
    d = e.directiveEnd,
    h = i >> 20,
    p = r ? a : a + h,
    m = o ? a + h : d;
  for (let y = p; y < m; y++) {
    let w = s[y];
    if ((y < c && n === w) || (y >= c && w.type === n)) return y;
  }
  if (o) {
    let y = s[c];
    if (y && zt(y) && y.type === n) return c;
  }
  return null;
}
function Ui(e, t, n, r, o) {
  let i = e[n],
    s = t.data;
  if (i instanceof Mr) {
    let a = i;
    if (a.resolving) throw Ku(``);
    let c = Cy(a.canSeeViewProviders);
    a.resolving = !0;
    s[n].type || s[n];
    let p = a.injectImpl ? ot(a.injectImpl) : null;
    Ed(e, r, 0);
    try {
      ((i = e[n] = a.factory(void 0, o, s, e, r)),
        t.firstCreatePass && n >= r.directiveStart && XS(n, s[n], t));
    } finally {
      (p !== null && ot(p), Cy(c), (a.resolving = !1), Cd());
    }
  }
  return i;
}
function uM(e) {
  if (typeof e == `string`) return e.charCodeAt(0) || 0;
  let t = Object.hasOwn(e, mr) ? e[mr] : void 0;
  return typeof t == `number` ? (t >= 0 ? t & pv : dM) : t;
}
function Iy(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> hv)] & r);
}
function Ty(e, t) {
  return !(e & 2) && !(e & 1 && t);
}
var hn = class {
  _tNode;
  _lView;
  constructor(t, n) {
    ((this._tNode = t), (this._lView = n));
  }
  get(t, n, r) {
    return vv(this._tNode, this._lView, t, dr(r), n);
  }
};
function dM() {
  return new hn(Ae(), L());
}
function bv(e) {
  return Wi(() => {
    let t = e.prototype.constructor,
      n = t[yi] || zd(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r;) {
      let i = o[yi] || zd(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function zd(e) {
  return qu(e)
    ? () => {
        let t = zd(Le(e));
        return t && t();
      }
    : fr(e);
}
function fM(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[P] & 2048 && !Eo(s);) {
    let a = wv(i, s, n, r | 2, qt);
    if (a !== qt) return a;
    r &= -5;
    let c = i.parent;
    if (!c) {
      let d = s[id];
      if (d) {
        let h = d.get(n, qt, r);
        if (h !== qt) return h;
      }
      ((c = Dv(s)), (s = s[Vn]));
    }
    i = c;
  }
  return o;
}
function Dv(e) {
  let t = e[O],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[Ue] : null;
}
function Yi(e) {
  return cM(Ae(), e);
}
function de$1(e) {
  return {
    token: e.token,
    providedIn: e.autoProvided === !1 ? null : `root`,
    factory: e.factory,
    value: void 0,
  };
}
function pM() {
  return Lo(Ae(), L());
}
function Lo(e, t) {
  return new Gn(Je(e, t));
}
var Gn = (() => {
  class e {
    nativeElement;
    constructor(n) {
      this.nativeElement = n;
    }
    static __NG_ELEMENT_ID__ = pM;
  }
  return e;
})();
function Ev(e) {
  return e instanceof Gn ? e.nativeElement : e;
}
function hM() {
  return this._results[Symbol.iterator]();
}
var hc = class {
  _emitDistinctChangesOnly;
  dirty = !0;
  _onDirty = void 0;
  _results = [];
  _changesDetected = !1;
  _changes = void 0;
  length = 0;
  first = void 0;
  last = void 0;
  get changes() {
    return (this._changes ??= new le());
  }
  constructor(t = !1) {
    this._emitDistinctChangesOnly = t;
  }
  get(t) {
    return this._results[t];
  }
  map(t) {
    return this._results.map(t);
  }
  filter(t) {
    return this._results.filter(t);
  }
  find(t) {
    return this._results.find(t);
  }
  reduce(t, n) {
    return this._results.reduce(t, n);
  }
  forEach(t) {
    this._results.forEach(t);
  }
  some(t) {
    return this._results.some(t);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(t, n) {
    this.dirty = !1;
    let r = Mm(t);
    (this._changesDetected = !Sm(this._results, r, n)) &&
      ((this._results = r),
      (this.length = r.length),
      (this.last = r[this.length - 1]),
      (this.first = r[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.next(this);
  }
  onDirty(t) {
    this._onDirty = t;
  }
  setDirty() {
    ((this.dirty = !0), this._onDirty?.());
  }
  destroy() {
    this._changes !== void 0 && (this._changes.complete(), this._changes.unsubscribe());
  }
  [Symbol.iterator] = hM;
};
function Cv(e) {
  return (e.flags & 128) === 128;
}
var Tf = (function (e) {
  return (
    (e[(e.OnPush = 0)] = `OnPush`),
    (e[(e.Eager = 1)] = `Eager`),
    (e[(e.Default = 1)] = `Default`),
    e
  );
})(Tf || {});
var Iv = /* @__PURE__ */ new Map();
var gM = 0;
function mM() {
  return gM++;
}
function yM(e) {
  Iv.set(e[Mi], e);
}
function qd(e) {
  Iv.delete(e[Mi]);
}
var Sy = `__ngContext__`;
function Ao(e, t) {
  fn(t) ? ((e[Sy] = t[Mi]), yM(t)) : (e[Sy] = t);
}
function Tv(e) {
  return Mv(e[wo]);
}
function Sv(e) {
  return Mv(e[ht]);
}
function Mv(e) {
  for (; e !== null && !gt(e);) e = e[ht];
  return e;
}
var Gd;
function Sf(e) {
  Gd = e;
}
function _v() {
  if (Gd !== void 0) return Gd;
  if (typeof document < `u`) return document;
  throw new M(210, !1);
}
var Nv = `r`;
var Av = `di`;
var Rv = !1;
var xv = new A(``, { factory: () => Rv });
var My = /* @__PURE__ */ new WeakMap();
function vM(e, t) {
  if (e == null || typeof e != `object`) return;
  let n = My.get(e);
  (n || ((n = /* @__PURE__ */ new WeakSet()), My.set(e, n)), n.add(t));
}
function Nc(e) {
  return (e.flags & 32) === 32;
}
var DM = () => null;
function Ov(e, t, n = !1) {
  return DM(e, t, n);
}
function kv(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = R(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          (Ri(i), a.contentQueries(2, t[s], s));
        }
      }
    } finally {
      R(r);
    }
  }
}
function Wd(e, t, n) {
  Ri(0);
  let r = R(null);
  try {
    t(e, n);
  } finally {
    R(r);
  }
}
function Mf(e, t, n) {
  if (ad(t)) {
    let r = R(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = n[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      R(r);
    }
  }
}
var _t = (function (e) {
  return (
    (e[(e.Emulated = 0)] = `Emulated`),
    (e[(e.None = 2)] = `None`),
    (e[(e.ShadowDom = 3)] = `ShadowDom`),
    (e[(e.ExperimentalIsolatedShadowDom = 4)] = `ExperimentalIsolatedShadowDom`),
    e
  );
})(_t || {});
var gn = class {
  changingThisBreaksApplicationSecurity;
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity}`;
  }
};
var Yd = class extends gn {
  getTypeName() {
    return `HTML`;
  }
};
var Zd = class extends gn {
  getTypeName() {
    return `Style`;
  }
};
var Kd = class extends gn {
  getTypeName() {
    return `Script`;
  }
};
var Qd = class extends gn {
  getTypeName() {
    return `URL`;
  }
};
var Xd = class extends gn {
  getTypeName() {
    return `ResourceURL`;
  }
};
function at(e) {
  return e instanceof gn ? e.changingThisBreaksApplicationSecurity : e;
}
function mn(e, t) {
  let n = Pv(e);
  if (n != null && n !== t) {
    if (n === `ResourceURL` && t === `URL`) return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${zu})`);
  }
  return n === t;
}
function Pv(e) {
  return (e instanceof gn && e.getTypeName()) || null;
}
function _f(e) {
  return new Yd(e);
}
function Nf(e) {
  return new Zd(e);
}
function Af(e) {
  return new Kd(e);
}
function Rf(e) {
  return new Qd(e);
}
function xf(e) {
  return new Xd(e);
}
var EM = { 'http://www.w3.org/2000/svg': gr, 'http://www.w3.org/1998/Math/MathML': Va };
var nc;
function CM() {
  if (nc === void 0 && ((nc = null), Bn.trustedTypes))
    try {
      nc = Bn.trustedTypes.createPolicy(`angular`, {
        createHTML: (e) => e,
        createScript: (e) => e,
        createScriptURL: (e) => e,
      });
    } catch {}
  return nc;
}
function Ac(e) {
  return CM()?.createHTML(e) || e;
}
var rc;
function IM() {
  if (rc === void 0 && ((rc = null), Bn.trustedTypes))
    try {
      rc = Bn.trustedTypes.createPolicy(`angular#unsafe-bypass`, {
        createHTML: (e) => e,
        createScript: (e) => e,
        createScriptURL: (e) => e,
      });
    } catch {}
  return rc;
}
function _y(e) {
  return IM()?.createScriptURL(e) || e;
}
function TM(e) {
  let t = new ef(e);
  return SM() ? new Jd(t) : t;
}
var Jd = class {
  inertDocumentHelper;
  constructor(t) {
    this.inertDocumentHelper = t;
  }
  getInertBodyElement(t) {
    t = `<body><remove></remove>` + t;
    try {
      let n = new window.DOMParser().parseFromString(Ac(t), `text/html`).body;
      return n === null
        ? this.inertDocumentHelper.getInertBodyElement(t)
        : (n.firstChild?.remove(), n);
    } catch {
      return null;
    }
  }
};
var ef = class {
  defaultDoc;
  inertDocument;
  constructor(t) {
    ((this.defaultDoc = t),
      (this.inertDocument =
        this.defaultDoc.implementation.createHTMLDocument(`sanitization-inert`)));
  }
  getInertBodyElement(t) {
    let n = this.inertDocument.createElement(`template`);
    return ((n.innerHTML = Ac(t)), n);
  }
};
function SM() {
  try {
    return !!new window.DOMParser().parseFromString(Ac(``), `text/html`);
  } catch {
    return !1;
  }
}
var MM = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Zi(e) {
  return ((e = String(e)), e.match(MM) ? e : `unsafe:` + e);
}
function yn(e) {
  let t = Object.create(null);
  for (let n of e.split(`,`)) t[n] = !0;
  return t;
}
function Ki(...e) {
  let t = Object.create(null);
  for (let n of e) for (let r in n) Object.hasOwn(n, r) && (t[r] = !0);
  return t;
}
var Lv = yn(`area,br,col,hr,img,wbr`);
var Fv = yn(`colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr`);
var jv = yn(`rp,rt`);
var _M = Ki(jv, Fv);
var Ny = Ki(
  Lv,
  Ki(
    Fv,
    yn(
      `address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul`,
    ),
  ),
  Ki(
    jv,
    yn(
      `a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video`,
    ),
  ),
  _M,
);
var Bv = yn(`background,cite,href,itemtype,longdesc,poster,src,xlink:href`);
var OM = Ki(
  Bv,
  yn(
    `abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width`,
  ),
  yn(
    `aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext`,
  ),
);
var kM = yn(`script,style,template`);
var tf = class {
  sanitizedSomething = !1;
  buf = [];
  sanitizeChildren(t) {
    let n = t.firstChild,
      r = !0,
      o = [];
    for (; n;) {
      if (
        (n.nodeType === Node.ELEMENT_NODE
          ? (r = this.startElement(n))
          : n.nodeType === Node.TEXT_NODE
            ? this.chars(n.nodeValue)
            : (this.sanitizedSomething = !0),
        r && n.firstChild)
      ) {
        (o.push(n), (n = FM(n)));
        continue;
      }
      for (; n;) {
        n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
        let i = LM(n);
        if (i) {
          n = i;
          break;
        }
        n = o.pop();
      }
    }
    return this.buf.join(``);
  }
  startElement(t) {
    let n = Ay(t).toLowerCase();
    if (!Object.hasOwn(Ny, n)) return ((this.sanitizedSomething = !0), !Object.hasOwn(kM, n));
    (this.buf.push(`<`), this.buf.push(n));
    let r = t.attributes;
    for (let o = 0; o < r.length; o++) {
      let i = r.item(o),
        s = i.name,
        a = s.toLowerCase();
      if (!Object.hasOwn(OM, a)) {
        this.sanitizedSomething = !0;
        continue;
      }
      let c = i.value;
      (Bv[a] && (c = Zi(c)), this.buf.push(` `, s, `="`, Ry(c), `"`));
    }
    return (this.buf.push(`>`), !0);
  }
  endElement(t) {
    let n = Ay(t).toLowerCase();
    Object.hasOwn(Ny, n) &&
      !Object.hasOwn(Lv, n) &&
      (this.buf.push(`</`), this.buf.push(n), this.buf.push(`>`));
  }
  chars(t) {
    this.buf.push(Ry(t));
  }
};
function PM(e, t) {
  return (
    (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !==
    Node.DOCUMENT_POSITION_CONTAINED_BY
  );
}
function LM(e) {
  let t = e.nextSibling;
  if (t && e !== t.previousSibling) throw Uv(t);
  return t;
}
function FM(e) {
  let t = e.firstChild;
  if (t && PM(e, t)) throw Uv(t);
  return t;
}
function Ay(e) {
  let t = e.nodeName;
  return typeof t == `string` ? t : `FORM`;
}
function Uv(e) {
  return /* @__PURE__ */ new Error(
    `Failed to sanitize html because the element is clobbered: ${e.outerHTML}`,
  );
}
var jM = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
var BM = /([^\#-~ |!])/g;
function Ry(e) {
  return e
    .replace(/&/g, `&amp;`)
    .replace(jM, function (t) {
      let n = t.charCodeAt(0),
        r = t.charCodeAt(1);
      return `&#` + ((n - 55296) * 1024 + (r - 56320) + 65536) + `;`;
    })
    .replace(BM, function (t) {
      return `&#` + t.charCodeAt(0) + `;`;
    })
    .replace(/</g, `&lt;`)
    .replace(/>/g, `&gt;`);
}
var oc;
function Of(e, t) {
  let n = null;
  try {
    oc = oc || TM(e);
    let r = t ? String(t) : ``;
    n = oc.getInertBodyElement(r);
    let o = 5,
      i = r;
    do {
      if (o === 0) throw new Error(`Failed to sanitize html because the input is unstable`);
      (o--, (r = i), (i = n.innerHTML), (n = oc.getInertBodyElement(r)));
    } while (r !== i);
    return Ac(new tf().sanitizeChildren(xy(n) || n));
  } finally {
    if (n) {
      let r = xy(n) || n;
      for (; r.firstChild;) r.firstChild.remove();
    }
  }
}
function xy(e) {
  return `content` in e && UM(e) ? e.content : null;
}
function UM(e) {
  return e.nodeType === Node.ELEMENT_NODE && e.nodeName === `TEMPLATE`;
}
var VM = /^>|^->|<!--|-->|--!>|<!-$/g;
var HM = /(<|>)/g;
var $M = `​$1​`;
function zM(e) {
  return e.replace(VM, (t) => t.replace(HM, $M));
}
function qM(e, t) {
  return e.createText(t);
}
function GM(e, t, n) {
  e.setValue(t, n);
}
function WM(e, t) {
  return e.createComment(zM(t));
}
function Vv(e, t, n) {
  return e.createElement(t, n);
}
function Sr(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function Hv(e, t, n) {
  e.appendChild(t, n);
}
function Oy(e, t, n, r, o) {
  r !== null ? Sr(e, t, n, r, o) : Hv(e, t, n);
}
function $v(e, t, n, r) {
  e.removeChild(null, t, n, r);
}
function YM(e, t, n) {
  e.setAttribute(t, `style`, n);
}
function ZM(e, t, n) {
  n === `` ? e.removeAttribute(t, `class`) : e.setAttribute(t, `class`, n);
}
function zv(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  (r !== null && nM(e, t, r), o !== null && ZM(e, t, o), i !== null && YM(e, t, i));
}
function KM(e, t = !0) {
  if (e[0] != `:`) return [null, e];
  let n = e.indexOf(`:`, 1);
  if (n === -1) {
    if (t) throw new Error(`Unsupported format "${e}" expecting ":namespace:name"`);
    return [null, e];
  }
  return [e.slice(1, n), e.slice(n + 1)];
}
function qv(e) {
  let t = Wv();
  return t ? t.sanitize(ge$1.URL, e) || `` : mn(e, `URL`) ? at(e) : Zi(un(e));
}
function Gv(e) {
  let t = Wv();
  if (t) return _y(t.sanitize(ge$1.RESOURCE_URL, e) || ``);
  if (mn(e, `ResourceURL`)) return _y(at(e));
  throw new M(-904, !1);
}
function QM(e, t) {
  switch (XM(e, t)) {
    case ge$1.RESOURCE_URL:
      return Gv;
    case ge$1.URL:
      return qv;
    default:
      return null;
  }
}
function kf(e, t, n) {
  return QM(t, n)?.(e) ?? e;
}
function Wv() {
  let e = L();
  return e && e[Tt].sanitizer;
}
function XM(e, t) {
  let [n, r] = JM(e);
  return jm(r, t, n);
}
function JM(e) {
  e = e.toLowerCase();
  let t = KM(e, !1);
  if (t[0]) return t;
  let r = vt() === -1 ? null : Tr(),
    o = r?.namespace;
  if (e === `#host` && r?.type === 2) {
    let i = Je(r, L());
    if ((i.tagName && (e = i.tagName.toLowerCase()), o == null)) {
      let s = i.namespaceURI;
      o = s && EM[s];
    }
  }
  return [o, e];
}
function e_(e) {
  return e instanceof Function ? e() : e;
}
function t_(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
var Yv = `ng-template`;
function n_(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == `string`; o += 2)
      if (t[o] === `class` && t_(t[o + 1].toLowerCase(), n, 0) !== -1) return !0;
  } else if (Pf(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == `string`;) if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function Pf(e) {
  return e.type === 4 && e.value !== Yv;
}
function r_(e, t, n) {
  return t === (e.type === 4 && !n ? Yv : e.value);
}
function o_(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? a_(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == `number`) {
      if (!s && !St(r) && !St(c)) return !1;
      if (s && St(c)) continue;
      ((s = !1), (r = c | (r & 1)));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (((r = 2 | (r & 1)), (c !== `` && !r_(e, c, n)) || (c === `` && t.length === 1))) {
          if (St(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !n_(e, o, c, n)) {
          if (St(r)) return !1;
          s = !0;
        }
      } else {
        let d = t[++a],
          h = i_(c, o, Pf(e), n);
        if (h === -1) {
          if (St(r)) return !1;
          s = !0;
          continue;
        }
        if (d !== ``) {
          let p;
          if ((h > i ? (p = ``) : (p = o[h + 1].toLowerCase()), r & 2 && d !== p)) {
            if (St(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return St(r) || s;
}
function St(e) {
  return (e & 1) === 0;
}
function i_(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length;) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == `string`;) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return c_(t, e);
}
function Zv(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (o_(e, t[r], n)) return !0;
  return !1;
}
function s_(e) {
  let t = e.attrs;
  if (t != null) {
    let n = t.indexOf(5);
    if ((n & 1) === 0) return t[n + 1];
  }
  return null;
}
function a_(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (dv(n)) return t;
  }
  return e.length;
}
function c_(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length;) {
      let r = e[n];
      if (typeof r == `number`) return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function l_(e, t) {
  e: for (let n = 0; n < t.length; n++) {
    let r = t[n];
    if (e.length === r.length) {
      for (let o = 0; o < e.length; o++) if (e[o] !== r[o]) continue e;
      return !0;
    }
  }
  return !1;
}
function ky(e, t) {
  return e ? `:not(` + t.trim() + `)` : t;
}
function u_(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = ``,
    i = !1;
  for (; n < e.length;) {
    let s = e[n];
    if (typeof s == `string`)
      if (r & 2) {
        let a = e[++n];
        o += `[` + s + (a.length > 0 ? `="` + a + `"` : ``) + `]`;
      } else r & 8 ? (o += `.` + s) : r & 4 && (o += ` ` + s);
    else (o !== `` && !St(s) && ((t += ky(i, o)), (o = ``)), (r = s), (i = i || !St(r)));
    n++;
  }
  return (o !== `` && (t += ky(i, o)), t);
}
function d_(e) {
  return e.map(u_).join(`,`);
}
function f_(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length;) {
    let i = e[r];
    if (typeof i == `string`) o === 2 ? i !== `` && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!St(o)) break;
      o = i;
    }
    r++;
  }
  return (n.length && t.push(1, ...n), t);
}
var We = {};
var Gt = (function (e) {
  return ((e[(e.Important = 1)] = `Important`), (e[(e.DashCase = 2)] = `DashCase`), e);
})(Gt || {});
var p_;
function Lf(e, t) {
  return p_(e, t);
}
var Ff = /* @__PURE__ */ new Set();
typeof document < `u` && document?.documentElement?.getAnimations;
var nf = /* @__PURE__ */ new WeakMap();
function Kv(e) {
  return e ? (e[Vn] ?? e) : null;
}
var To = /* @__PURE__ */ new WeakSet();
function h_(e, t, n) {
  let r = nf.get(e);
  if (!r || r.length === 0) return;
  let o = t.parentNode,
    i = t.previousSibling,
    s = Kv(n);
  for (let a = r.length - 1; a >= 0; a--) {
    let { el: c, declarationView: d } = r[a],
      h = c.parentNode;
    c === t
      ? (r.splice(a, 1),
        To.add(c),
        c.dispatchEvent(new CustomEvent(`animationend`, { detail: { cancel: !0 } })))
      : i && c === i
        ? (r.splice(a, 1),
          c.dispatchEvent(new CustomEvent(`animationend`, { detail: { cancel: !0 } })),
          c.parentNode?.removeChild(c))
        : h &&
          o &&
          h !== o &&
          (s === null || d === null || s === d) &&
          (r.splice(a, 1),
          c.dispatchEvent(new CustomEvent(`animationend`, { detail: { cancel: !0 } })),
          c.parentNode?.removeChild(c));
  }
}
function g_(e, t, n) {
  let r = Kv(n),
    o = nf.get(e);
  o
    ? o.some((i) => i.el === t) || o.push({ el: t, declarationView: r })
    : nf.set(e, [{ el: t, declarationView: r }]);
}
var Rc = (function (e) {
  return (
    (e[(e.CHANGE_DETECTION = 0)] = `CHANGE_DETECTION`),
    (e[(e.AFTER_NEXT_RENDER = 1)] = `AFTER_NEXT_RENDER`),
    e
  );
})(Rc || {});
var Nt = new A(``);
var Py = /* @__PURE__ */ new Set();
function vn(e) {
  Py.has(e) || (Py.add(e), performance?.mark?.(`mark_feature_usage`, { detail: { feature: e } }));
}
var xc = (() => {
  class e {
    impl = null;
    execute() {
      this.impl?.execute();
    }
    static ɵprov = k$1({ token: e, providedIn: `root`, factory: () => new e() });
  }
  return e;
})();
var jf = [0, 1, 2, 3];
var Bf = (() => {
  class e {
    ngZone = b(Be);
    scheduler = b(Bt);
    errorHandler = b(pt, { optional: !0 });
    sequences = /* @__PURE__ */ new Set();
    deferredRegistrations = /* @__PURE__ */ new Set();
    executing = !1;
    constructor() {
      b(Nt, { optional: !0 });
    }
    execute() {
      let n = this.sequences.size > 0;
      (n && J(Z.AfterRenderHooksStart), (this.executing = !0));
      for (let r of jf)
        for (let o of this.sequences)
          if (!(o.erroredOrDestroyed || !o.hooks[r]))
            try {
              o.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                this.maybeTrace(() => {
                  let i = o.hooks[r];
                  return i(o.pipelinedValue);
                }, o.snapshot),
              );
            } catch (i) {
              ((o.erroredOrDestroyed = !0), this.errorHandler?.handleError(i));
            }
      this.executing = !1;
      for (let r of this.sequences)
        (r.afterRun(), r.once && (this.sequences.delete(r), r.destroy()));
      for (let r of this.deferredRegistrations) this.sequences.add(r);
      (this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
        this.deferredRegistrations.clear(),
        n && J(Z.AfterRenderHooksEnd));
    }
    register(n) {
      let { view: r } = n;
      r !== void 0 ? ((r[br] ??= []).push(n), Ir(r), (r[P] |= 8192)) : this.addSequence(n);
    }
    addSequence(n) {
      (this.executing ? this.deferredRegistrations.add(n) : this.sequences.add(n),
        this.scheduler.notify(7));
    }
    unregister(n) {
      this.executing && this.sequences.has(n)
        ? ((n.erroredOrDestroyed = !0), (n.pipelinedValue = void 0), (n.once = !0))
        : (this.sequences.delete(n), this.deferredRegistrations.delete(n));
    }
    maybeTrace(n, r) {
      return r ? r.run(Rc.AFTER_NEXT_RENDER, n) : n();
    }
    static ɵprov = k$1({ token: e, providedIn: `root`, factory: () => new e() });
  }
  return e;
})();
var Vi = class {
  impl;
  hooks;
  view;
  once;
  snapshot;
  erroredOrDestroyed = !1;
  pipelinedValue = void 0;
  unregisterOnDestroy;
  constructor(t, n, r, o, i, s = null) {
    ((this.impl = t),
      (this.hooks = n),
      (this.view = r),
      (this.once = o),
      (this.snapshot = s),
      (this.unregisterOnDestroy = i?.onDestroy(() => this.destroy())));
  }
  afterRun() {
    ((this.erroredOrDestroyed = !1),
      (this.pipelinedValue = void 0),
      this.snapshot?.dispose(),
      (this.snapshot = null));
  }
  destroy() {
    (this.impl.unregister(this), this.unregisterOnDestroy?.());
    let t = this.view?.[br];
    t && (this.view[br] = t.filter((n) => n !== this));
  }
};
function Uf(e, t) {
  let n = t?.injector ?? b(Fe);
  return (vn(`NgAfterNextRender`), y_(e, n, t, !0));
}
function m_(e) {
  return e instanceof Function
    ? [void 0, void 0, e, void 0]
    : [e.earlyRead, e.write, e.mixedReadWrite, e.read];
}
function y_(e, t, n, r) {
  let o = t.get(xc);
  o.impl ??= t.get(Bf);
  let i = t.get(Nt, null, { optional: !0 }),
    s = n?.manualCleanup !== !0 ? t.get(je) : null,
    a = t.get(Io, null, { optional: !0 }),
    c = new Vi(o.impl, m_(e), a?.view, r, s, i?.snapshot(null));
  return (o.impl.register(c), c);
}
var rf = null;
var Qv = null;
function Ly(e, t, n, r) {
  rf?.maybeQueueEnterAnimation(e, t, n, r);
}
function Fy(e, t, n, r) {
  rf === null ? r(!1) : rf.runLeaveAnimationsWithCallback(e, t, n, r);
}
function v_(e) {
  Qv?.initViewDetachAnimations(e);
}
function w_(e) {
  Qv?.clearViewDetachAnimations(e);
}
function So(e, t, n, r, o, i, s, a) {
  if (o != null) {
    let c,
      d = !1;
    gt(o) ? (c = o) : fn(o) && ((d = !0), (o = o[It]));
    let h = Ve(o);
    (e === 0 && r !== null
      ? (Ly(a, r, i, n), s == null ? Hv(t, r, h) : Sr(t, r, h, s || null, !0))
      : e === 1 && r !== null
        ? (Sr(t, r, h, s || null, !0), h_(i, h, a), To.has(h) || Ly(a, r, i, n))
        : e === 2
          ? (a?.[Lm]?.leave?.has(i.index) && g_(i, h, a),
            To.delete(h),
            Fy(a, i, n, (p) => {
              if (To.has(h)) {
                To.delete(h);
                return;
              }
              $v(t, h, d, p);
            }))
          : e === 3 &&
            (To.delete(h),
            Fy(a, i, n, () => {
              t.destroyNode(h);
            })),
      c != null && A_(t, e, n, c, i, r, s));
  }
}
function b_(e, t) {
  (Xv(e, t), (t[It] = null), (t[Ue] = null));
}
function D_(e, t, n, r, o, i) {
  ((r[It] = o), (r[Ue] = t), kc(e, r, n, 1, o, i));
}
function Xv(e, t) {
  (t[Tt].changeDetectionScheduler?.notify(9), kc(e, t, t[se], 2, null, null));
}
function E_(e) {
  let t = e[wo];
  if (!t) return Od(e[O], e);
  for (; t;) {
    let n = null;
    if (fn(t)) n = t[wo];
    else {
      let r = t[Ee];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[ht] && t !== e;) (fn(t) && Od(t[O], t), (t = t[Se]));
      (t === null && (t = e), fn(t) && Od(t[O], t), (n = t && t[ht]));
    }
    t = n;
  }
}
function Vf(e, t) {
  let n = e[Er],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Oc(e, t) {
  if (Cr(t)) return;
  let n = t[se];
  (n.destroyNode && kc(e, t, n, 3, null, null), E_(t));
}
function Od(e, t) {
  if (Cr(t)) return;
  let n = R(null);
  try {
    ((t[P] &= -129),
      (t[P] |= 256),
      t[it] && xn(t[it]),
      I_(e, t),
      C_(e, t),
      t[O].type === 1 && t[se].destroy());
    let r = t[Hn];
    if (r !== null && gt(t[Se])) {
      r !== t[Se] && Vf(r, t);
      let o = t[Ht];
      o !== null && o.detachView(e);
    }
    qd(t);
  } finally {
    R(n);
  }
}
function C_(e, t) {
  let n = e.cleanup,
    r = t[vo];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == `string`) {
        let a = n[s + 3];
        (a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2));
      } else {
        let a = r[n[s + 1]];
        n[s].call(a);
      }
  r !== null && (t[vo] = null);
  let o = t[an];
  if (o !== null) {
    t[an] = null;
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      a();
    }
  }
  let i = t[cn];
  if (i !== null) {
    t[cn] = null;
    for (let s of i) s.destroy();
  }
}
function I_(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof Mr)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            J(Z.LifecycleHookStart, a, c);
            try {
              c.call(a);
            } finally {
              J(Z.LifecycleHookEnd, a, c);
            }
          }
        else {
          J(Z.LifecycleHookStart, o, i);
          try {
            i.call(o);
          } finally {
            J(Z.LifecycleHookEnd, o, i);
          }
        }
      }
    }
}
function Jv(e, t, n) {
  if (t === null) throw new M(510, !1);
  return T_(e, t.parent, n);
}
function T_(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168;) ((t = r), (r = t.parent));
  if (r === null) return n[It];
  if ($t(r)) {
    let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
    if (o === _t.None || o === _t.Emulated) return null;
  }
  return Je(r, n);
}
function ew(e, t, n) {
  return M_(e, t, n);
}
function S_(e, t, n) {
  return e.type & 40 ? Je(e, n) : null;
}
var M_ = S_;
function Hf(e, t, n, r) {
  let o = Jv(e, r, t),
    i = t[se],
    a = ew(r.parent || t[Ue], r, t);
  if (o != null)
    if (Array.isArray(n)) for (let c = 0; c < n.length; c++) Oy(i, o, n[c], a, !1);
    else Oy(i, o, n, a, !1);
}
function ji(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return Je(t, e);
    if (n & 4) return of(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return ji(e, r);
      {
        let o = e[t.index];
        return gt(o) ? of(-1, o) : Ve(o);
      }
    } else {
      if (n & 128) return ji(e, t.next);
      if (n & 32) return Lf(t, e)() || Ve(e[t.index]);
      {
        let r = tw(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          return ji(ln(e[qe]), r);
        } else return ji(e, t.next);
      }
    }
  }
  return null;
}
function tw(e, t) {
  if (t !== null) {
    let r = e[qe][Ue],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function of(e, t) {
  let n = Ee + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[O].firstChild;
    if (o !== null) return ji(r, o);
  }
  return t[Dr];
}
function $f(e, t, n, r, o, i, s) {
  for (; n != null;) {
    let a = r[dn];
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let c = r[n.index],
      d = n.type;
    if ((s && t === 0 && (c && Ao(Ve(c), r), (n.flags |= 2)), !Nc(n)))
      if (d & 8) ($f(e, t, n.child, r, o, i, !1), So(t, e, a, o, c, n, i, r));
      else if (d & 32) {
        let h = Lf(n, r),
          p;
        for (; (p = h());) So(t, e, a, o, p, n, i, r);
        So(t, e, a, o, c, n, i, r);
      } else d & 16 ? nw(e, t, r, n, o, i) : So(t, e, a, o, c, n, i, r);
    n = s ? n.projectionNext : n.next;
  }
}
function kc(e, t, n, r, o, i) {
  e.type === 3 ? __(n, r, t, o, i) : $f(n, r, e.firstChild, t, o, i, !1);
}
function __(e, t, n, r, o) {
  let s = n[O].firstChild,
    a = s.next,
    c = Ve(n[s.index]),
    d = Ve(n[a.index]),
    h = a.index + 1,
    p = n[h];
  if (t === 1 || t === 0)
    r !== null &&
      (p && p.hasChildNodes() ? Sr(e, r, p, o, !0) : (Sr(e, r, c, o, !0), Sr(e, r, d, o, !0)));
  else if (t === 2) {
    if ((p || ((p = document.createDocumentFragment()), (n[h] = p)), c && c.parentNode === p))
      return;
    let m = c;
    for (; m !== null;) {
      let y = m.nextSibling;
      if ((p.appendChild(m), m === d)) break;
      m = y;
    }
  }
}
function N_(e, t, n) {
  let r = t[se];
  nw(r, 0, t, n, Jv(e, n, t), ew(n.parent || t[Ue], n, t));
}
function nw(e, t, n, r, o, i) {
  let s = n[qe],
    c = s[Ue].projection[r.projection];
  if (Array.isArray(c))
    for (let d = 0; d < c.length; d++) {
      let h = c[d];
      So(t, e, n[dn], o, h, r, i, n);
    }
  else {
    let d = c,
      h = s[Se];
    (Cv(r) && (d.flags |= 128), $f(e, t, d, h, o, i, !0));
  }
}
function A_(e, t, n, r, o, i, s) {
  let a = r[Dr];
  if ((a !== Ve(r) && So(t, e, n, i, a, o, s), (r[P] & 4) === 0))
    for (let d = Ee; d < r.length; d++) {
      let h = r[d];
      kc(h[O], h, e, t, i, a);
    }
}
function R_(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf(`-`) === -1 ? void 0 : Gt.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == `string` &&
          o.endsWith(`!important`) &&
          ((o = o.slice(0, -10)), (i |= Gt.Important)),
        e.setStyle(n, r, o, i));
  }
}
function zf(e, t, n, r, o, i, s, a, c, d, h) {
  let p = De + r,
    m = p + o,
    y = x_(p, m),
    w = typeof d == `function` ? d() : d;
  return (y[O] = {
    type: e,
    blueprint: y,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: y.slice().fill(null, p),
    bindingStartIndex: p,
    expandoStartIndex: m,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == `function` ? i() : i,
    pipeRegistry: typeof s == `function` ? s() : s,
    firstChild: null,
    schemas: c,
    consts: w,
    incompleteFirstPass: !1,
    ssrId: h,
  });
}
function x_(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : We);
  return n;
}
function O_(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = zf(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : t;
}
function qf(e, t, n, r, o, i, s, a, c, d, h) {
  let p = t.blueprint.slice();
  return (
    (p[It] = o),
    (p[P] = r | 1228),
    (d !== null || (e && e[P] & 2048)) && (p[P] |= 2048),
    ld(p),
    (p[Se] = p[Vn] = e),
    (p[be$1] = n),
    (p[Tt] = s || (e && e[Tt])),
    (p[se] = a || (e && e[se])),
    (p[dn] = c || (e && e[dn]) || null),
    (p[Ue] = i),
    (p[Mi] = mM()),
    (p[vr] = h),
    (p[id] = d),
    (p[qe] = t.type == 2 ? e[qe] : p),
    p
  );
}
function k_(e, t, n) {
  let r = Je(t, e),
    o = O_(n),
    i = e[Tt].rendererFactory,
    s = Gf(e, qf(e, o, null, rw(n), r, t, null, i.createRenderer(r, n), null, null, null));
  return (e[t.index] = s);
}
function rw(e) {
  let t = 16;
  return (e.signals ? (t = 4096) : e.onPush && (t = 64), t);
}
function ow(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) (t.push(r), e.blueprint.push(r), e.data.push(null));
  return o;
}
function Gf(e, t) {
  return (e[wo] ? (e[od][ht] = t) : (e[wo] = t), (e[od] = t), t);
}
function P_(e = 1) {
  iw(ue$1(), L(), vt() + e, !1);
}
function iw(e, t, n, r) {
  if (!r)
    if ((t[P] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && sc(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && ac(t, i, 0, n);
    }
  zn(n);
}
var Qi = (function (e) {
  return (
    (e[(e.None = 0)] = `None`),
    (e[(e.SignalBased = 1)] = `SignalBased`),
    (e[(e.HasDecoratorInputTransform = 2)] = `HasDecoratorInputTransform`),
    e
  );
})(Qi || {});
function _r(e, t, n, r) {
  let o = R(null);
  try {
    let [i, s, a] = e.inputs[n],
      c = null;
    ((s & Qi.SignalBased) !== 0 && (c = t[i][ye$1]),
      c !== null && c.transformFn !== void 0
        ? (r = c.transformFn(r))
        : a !== null && (r = a.call(t, r)),
      e.setInput !== null ? e.setInput(t, c, r, n, i) : sv(t, c, i, r));
  } finally {
    R(o);
  }
}
function sw(e, t, n, r, o) {
  let i = vt(),
    s = r & 2;
  try {
    (zn(-1), s && t.length > De && iw(e, t, De, !1));
    (J(s ? Z.TemplateUpdateStart : Z.TemplateCreateStart, o, n), n(r, o));
  } finally {
    zn(i);
    J(s ? Z.TemplateUpdateEnd : Z.TemplateCreateEnd, o, n);
  }
}
function Pc(e, t, n) {
  (V_(e, t, n), (n.flags & 64) === 64 && H_(e, t, n));
}
function Xi(e, t, n = Je) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function L_(e, t, n, r) {
  let i = r.get(xv, Rv) || n === _t.ShadowDom || n === _t.ExperimentalIsolatedShadowDom;
  return e.selectRootElement(t, i);
}
function B_(e) {
  return e === `class`
    ? `className`
    : e === `for`
      ? `htmlFor`
      : e === `formaction`
        ? `formAction`
        : e === `innerHtml`
          ? `innerHTML`
          : e === `readonly`
            ? `readOnly`
            : e === `tabindex`
              ? `tabIndex`
              : e;
}
function U_(e, t, n, r, o, i) {
  let s = t[O];
  if (Lc(e, s, t, n, r)) {
    $t(e) && lw(t, e.index);
    return;
  }
  (e.type & 3 && (n = B_(n)), aw(e, t, n, r, o, i));
}
function aw(e, t, n, r, o, i) {
  if (e.type & 3) {
    let s = Je(e, t);
    ((r = i != null ? i(r, e.value || ``, n) : r), (r = cw(n, s, r)), o.setProperty(s, n, r));
  } else e.type & 12;
}
function cw(e, t, n) {
  return e === `src` && (t.tagName === `IMG` || t.tagName === `VIDEO`)
    ? n == null
      ? ``
      : at(n)
    : n;
}
function lw(e, t) {
  let n = mt(t, e);
  n[P] & 16 || (n[P] |= 64);
}
function V_(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd;
  ($t(n) && k_(t, n, e.data[r + n.componentOffset]), e.firstCreatePass || pc(n, t));
  let i = n.initialInputs;
  for (let s = r; s < o; s++) {
    let a = e.data[s],
      c = Ui(t, e, s, n);
    if ((Ao(c, t), i !== null && q_(t, s - r, c, a, n, i), zt(a))) {
      let d = mt(n.index, t);
      d[be$1] = Ui(t, e, s, n);
    }
  }
}
function H_(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = ey();
  try {
    zn(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        d = t[a];
      (Wa(a), (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && $_(c, d));
    }
  } finally {
    (zn(-1), Wa(s));
  }
}
function $_(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Wf(e, t) {
  let n = e.directiveRegistry,
    r = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let i = n[o];
      Zv(t, i.selectors, !1) && ((r ??= []), zt(i) ? r.unshift(i) : r.push(i));
    }
  return r;
}
function z_(e, t, n, r, o, i) {
  let s = Je(e, t);
  ((r = cw(n, s, r)), uw(t[se], s, i, e.value, n, r, o));
}
function uw(e, t, n, r, o, i, s) {
  if (i == null) (s?.(i, r || ``, o), e.removeAttribute(t, o, n));
  else {
    let a = s == null ? un(i) : s(i, r || ``, o);
    e.setAttribute(t, o, a, n);
  }
}
function q_(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let c = s[a],
        d = s[a + 1];
      _r(r, n, c, d);
    }
}
function Yf(e, t, n, r, o) {
  let i = De + n,
    s = t[O],
    a = o(s, t, e, r, n);
  ((t[i] = a), Co(e, !0));
  let c = e.type === 2;
  return (
    c ? (zv(t[se], a, e), (qm() === 0 || Do(e)) && Ao(a, t), Gm()) : Ao(a, t),
    Qa() && (!c || !Nc(e)) && Hf(s, t, a, e),
    e
  );
}
function Zf(e) {
  let t = e;
  return (vd() ? wd() : ((t = t.parent), Co(t, !1)), t);
}
function G_(e, t) {
  let n = e[dn];
  if (!n) return;
  let r;
  try {
    r = n.get(st, null);
  } catch {
    r = null;
  }
  r?.(t);
}
function Lc(e, t, n, r, o) {
  let i = e.inputs?.[r],
    s = e.hostDirectiveInputs?.[r],
    a = !1;
  if (s)
    for (let c = 0; c < s.length; c += 2) {
      let d = s[c],
        h = s[c + 1],
        p = t.data[d];
      (_r(p, n[d], h, o), (a = !0));
    }
  if (i)
    for (let c of i) {
      let d = n[c],
        h = t.data[c];
      (_r(h, d, r, o), (a = !0));
    }
  return a;
}
function W_(e, t, n, r, o, i) {
  let s = null,
    a = null,
    c = null,
    d = !1,
    h = e.directiveToIndex.get(r.type);
  if (
    (typeof h == `number` ? (s = h) : ([s, a, c] = h),
    a !== null && c !== null && e.hostDirectiveInputs && Object.hasOwn(e.hostDirectiveInputs, o))
  ) {
    let p = e.hostDirectiveInputs[o];
    for (let m = 0; m < p.length; m += 2) {
      let y = p[m];
      if (y >= a && y <= c) {
        let w = t.data[y],
          T = p[m + 1];
        (_r(w, n[y], T, i), (d = !0));
      } else if (y > c) break;
    }
  }
  return (s !== null && Object.hasOwn(r.inputs, o) && (_r(r, n[s], o, i), (d = !0)), d);
}
function Y_(e, t) {
  let n = mt(t, e),
    r = n[O];
  Z_(r, n);
  let o = n[It];
  (o !== null && n[vr] === null && (n[vr] = Ov(o, n[dn])), J(Z.ComponentStart));
  try {
    Kf(r, n, n[be$1]);
  } finally {
    J(Z.ComponentEnd, n[be$1]);
  }
}
function Z_(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Kf(e, t, n) {
  Za(t);
  try {
    let r = e.viewQuery;
    r !== null && Wd(1, r, n);
    let o = e.template;
    (o !== null && sw(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[Ht]?.finishViewCreation(e),
      e.staticContentQueries && kv(e, t),
      e.staticViewQueries && Wd(2, e.viewQuery, n));
    let i = e.components;
    i !== null && K_(t, i);
  } catch (r) {
    throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
  } finally {
    ((t[P] &= -5), Ka());
  }
}
function K_(e, t) {
  for (let n = 0; n < t.length; n++) Y_(e, t[n]);
}
function Ji(e, t, n, r) {
  let o = R(null);
  try {
    let i = t.tView,
      c = qf(
        e,
        i,
        n,
        e[P] & 4096 ? 4096 : 16,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      );
    c[Hn] = e[t.index];
    let h = e[Ht];
    return (h !== null && (c[Ht] = h.createEmbeddedView(i)), Kf(i, c, n), c);
  } finally {
    R(o);
  }
}
function Ro(e, t) {
  return !t || t.firstChild === null || Cv(e);
}
function Hi(e, t, n, r, o = !1) {
  if (e.type === 3) {
    let i = e.firstChild,
      s = i.next,
      a = Ve(t[i.index]),
      c = Ve(t[s.index]),
      d = a;
    for (; d !== null && (r.push(d), d !== c);) d = d.nextSibling;
    return r;
  }
  for (; n !== null;) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    if (i !== null)
      if (gt(i)) {
        let a = i[Dr];
        (a !== i[It] && r.push(Ve(i)), i[P] & 4 || dw(i, r), r.push(a));
      } else r.push(Ve(i));
    let s = n.type;
    if (s & 8) Hi(e, t, n.child, r);
    else if (s & 32) {
      let a = Lf(n, t),
        c;
      for (; (c = a());) r.push(c);
    } else if (s & 16) {
      let a = tw(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = ln(t[qe]);
        Hi(c[O], c, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function dw(e, t) {
  for (let n = Ee; n < e.length; n++) {
    let r = e[n],
      o = r[O].firstChild;
    o !== null && Hi(r[O], r, o, t);
  }
}
function fw(e) {
  if (e[br] !== null) {
    for (let t of e[br]) t.impl.addSequence(t);
    e[br].length = 0;
  }
}
var pw = [];
function Q_(e) {
  return e[it] ?? X_(e);
}
function X_(e) {
  let t = pw.pop() ?? Object.create(e0);
  return ((t.lView = e), t);
}
function J_(e) {
  e.lView[it] !== e && ((e.lView = null), pw.push(e));
}
var e0 = Y(C({}, Nn), {
  consumerIsAlwaysLive: !0,
  kind: `template`,
  consumerMarkedDirty: (e) => {
    Ir(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[it] = this;
  },
});
function t0(e) {
  let t = e[it] ?? Object.create(n0);
  return ((t.lView = e), t);
}
var n0 = Y(C({}, Nn), {
  consumerIsAlwaysLive: !0,
  kind: `template`,
  consumerMarkedDirty: (e) => {
    let t = ln(e.lView);
    for (; t && !hw(t[O]);) t = ln(t);
    t && ud(t);
  },
  consumerOnSignalRead() {
    this.lView[it] = this;
  },
});
function hw(e) {
  return e.type !== 2;
}
function gw(e) {
  if (e[cn] === null) return;
  let t = !0;
  for (; t;) {
    let n = !1;
    for (let r of e[cn])
      if (
        r.dirty &&
        ((n = !0),
        r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()),
        e[cn] === null)
      )
        return;
    t = n && !!(e[P] & 8192);
  }
}
var r0 = 100;
function mw(e, t = 0) {
  let r = e[Tt].rendererFactory;
  r.begin?.();
  try {
    o0(e, t);
  } finally {
    r.end?.();
  }
}
function o0(e, t) {
  let n = bd();
  try {
    (vi(!0), sf(e, t));
    let r = 0;
    for (; Ni(e);) {
      if (r === r0) throw new M(103, !1);
      (r++, sf(e, 1));
    }
  } finally {
    vi(n);
  }
}
function i0(e, t, n, r) {
  if (Cr(t)) return;
  let o = t[P],
    i = !1;
  Za(t);
  let a = !0,
    c = null,
    d = null;
  hw(e)
    ? ((d = Q_(t)), (c = rn(d)))
    : zs() === null
      ? ((a = !1), (d = t0(t)), (c = rn(d)))
      : t[it] && (xn(t[it]), (t[it] = null));
  try {
    (ld(t), Qm(e.bindingStartIndex), n !== null && sw(e, t, n, 2, r));
    let h = (o & 3) === 3;
    if (h) {
      let y = e.preOrderCheckHooks;
      y !== null && sc(t, y, null);
    } else {
      let y = e.preOrderHooks;
      (y !== null && ac(t, y, 0, null), Rd(t, 0));
    }
    if ((s0(t), gw(t), vw(t, 0), e.contentQueries !== null && kv(e, t), true))
      if (h) {
        let y = e.contentCheckHooks;
        y !== null && sc(t, y);
      } else {
        let y = e.contentHooks;
        (y !== null && ac(t, y, 1), Rd(t, 1));
      }
    c0(e, t);
    let p = e.components;
    p !== null && bw(t, p, 0);
    let m = e.viewQuery;
    if ((m !== null && Wd(2, m, r), true))
      if (h) {
        let y = e.viewCheckHooks;
        y !== null && sc(t, y);
      } else {
        let y = e.viewHooks;
        (y !== null && ac(t, y, 2), Rd(t, 2));
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Ua])) {
      for (let y of t[Ua]) y();
      t[Ua] = null;
    }
    (fw(t), (t[P] &= -73));
  } catch (h) {
    yw(t, h, i);
  } finally {
    (d !== null && (Rn(d, c), a && J_(d)), Ka());
  }
}
function yw(e, t, n) {
  let r = !1,
    o = t,
    i = e,
    s = R(null);
  try {
    for (; i !== null;) {
      if (gt(i)) {
        i = i[Se];
        continue;
      }
      let a = i[bo];
      if (a)
        try {
          let c = e[qe][be$1],
            h = { declarationInstance: c, declarationType: c?.constructor, caughtBy: a },
            p = R(null);
          try {
            a(py(o), h);
          } finally {
            R(p);
          }
          r = !0;
          break;
        } catch (c) {
          o = c;
        }
      i = i[Se];
    }
  } finally {
    R(s);
  }
  if (!r) throw (n || Ir(e), o);
}
function vw(e, t) {
  for (let n = Tv(e); n !== null; n = Sv(n))
    for (let r = Ee; r < n.length; r++) {
      let o = n[r];
      ww(o, t);
    }
}
function s0(e) {
  for (let t = Tv(e); t !== null; t = Sv(t)) {
    if (!(t[P] & 2)) continue;
    let n = t[Er];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      ud(o);
    }
  }
}
function a0(e, t, n) {
  J(Z.ComponentStart);
  let r = mt(t, e);
  try {
    ww(r, n);
  } finally {
    J(Z.ComponentEnd, r[be$1]);
  }
}
function ww(e, t) {
  $a(e) && sf(e, t);
}
function sf(e, t) {
  let r = e[O],
    o = e[P],
    i = e[it],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && eo(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[P] &= -9217),
    s)
  )
    i0(r, e, r.template, e[be$1]);
  else if (o & 8192) {
    let a = R(null);
    try {
      try {
        gw(e);
      } catch (d) {
        yw(e, d, !1);
      }
      vw(e, 1);
      let c = r.components;
      (c !== null && bw(e, c, 1), fw(e));
    } finally {
      R(a);
    }
  }
}
function bw(e, t, n) {
  for (let r = 0; r < t.length; r++) a0(e, t[r], n);
}
function c0(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) zn(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          Jm(s, i);
          let c = t[i];
          J(Z.HostBindingsUpdateStart, c);
          try {
            a(2, c);
          } finally {
            J(Z.HostBindingsUpdateEnd, c);
          }
        }
      }
    } finally {
      zn(-1);
    }
}
function Qf(e, t) {
  let n = bd() ? 64 : 1088;
  for (e[Tt].changeDetectionScheduler?.notify(t); e;) {
    e[P] |= n;
    let r = ln(e);
    if (Eo(e) && !r) return e;
    e = r;
  }
  return null;
}
function Dw(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function Ew(e, t) {
  let n = Ee + t;
  if (n < e.length) return e[n];
}
function es(e, t, n, r = !0) {
  let o = t[O];
  if ((l0(o, t, e, n), r)) {
    let s = of(n, e),
      a = t[se],
      c = a.parentNode(e[Dr]);
    c !== null && D_(o, e[Ue], a, t, c, s);
  }
  let i = t[vr];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function Cw(e, t) {
  let n = $i(e, t);
  return (n !== void 0 && Oc(n[O], n), n);
}
function $i(e, t) {
  if (e.length <= Ee) return;
  let n = Ee + t,
    r = e[n];
  if (r) {
    let o = r[Hn];
    (o !== null && o !== e && Vf(o, r), t > 0 && (e[n - 1][ht] = r[ht]));
    let i = Ti(e, Ee + t);
    b_(r[O], r);
    let s = i[Ht];
    (s !== null && s.detachView(i[O]), (r[Se] = null), (r[ht] = null), (r[P] &= -129));
  }
  return r;
}
function l0(e, t, n, r) {
  let o = Ee + r,
    i = n.length;
  (r > 0 && (n[o - 1][ht] = t),
    r < i - Ee ? ((t[ht] = n[o]), Xu(n, Ee + r, t)) : (n.push(t), (t[ht] = null)),
    (t[Se] = n));
  let s = t[Hn];
  s !== null && n !== s && Iw(s, t);
  let a = t[Ht];
  (a !== null && a.insertView(e), za(t), (t[P] |= 128));
}
function Iw(e, t) {
  let n = e[Er],
    r = t[Se];
  if (fn(r)) e[P] |= 2;
  else {
    let o = r[Se][qe];
    t[qe] !== o && (e[P] |= 2);
  }
  n === null ? (e[Er] = [t]) : n.push(t);
}
var qn = class {
  _lView;
  _cdRefInjectingView;
  _appRef = null;
  _attachedToViewContainer = !1;
  exhaustive;
  get rootNodes() {
    let t = this._lView,
      n = t[O];
    return Hi(n, t, n.firstChild, []);
  }
  constructor(t, n) {
    ((this._lView = t), (this._cdRefInjectingView = n));
  }
  get context() {
    return this._lView[be$1];
  }
  set context(t) {
    this._lView[be$1] = t;
  }
  get destroyed() {
    return Cr(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[Se];
      if (gt(t)) {
        let n = t[_i],
          r = n ? n.indexOf(this) : -1;
        r > -1 && ($i(t, r), Ti(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    Oc(this._lView[O], this._lView);
  }
  onDestroy(t) {
    qa(this._lView, t);
  }
  markForCheck() {
    Qf(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[P] &= -129;
  }
  reattach() {
    (za(this._lView), (this._lView[P] |= 128));
  }
  detectChanges() {
    ((this._lView[P] |= 1024), mw(this._lView));
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new M(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = Eo(this._lView),
      n = this._lView[Hn];
    (n !== null && !t && Vf(n, this._lView), Xv(this._lView[O], this._lView));
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new M(902, !1);
    this._appRef = t;
    let n = Eo(this._lView),
      r = this._lView[Hn];
    (r !== null && !n && Iw(r, this._lView), za(this._lView));
  }
};
var xo = (() => {
  class e {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = u0;
    constructor(n, r, o) {
      ((this._declarationLView = n), (this._declarationTContainer = r), (this.elementRef = o));
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(n, r) {
      return this.createEmbeddedViewImpl(n, r);
    }
    createEmbeddedViewImpl(n, r, o) {
      return new qn(
        Ji(this._declarationLView, this._declarationTContainer, n, {
          embeddedViewInjector: r,
          dehydratedView: o,
        }),
      );
    }
  }
  return e;
})();
function u0() {
  return Fc(Ae(), L());
}
function Fc(e, t) {
  return e.type & 4 ? new xo(t, e, Lo(e, t)) : null;
}
function Fo(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) ((i = d0(e, t, n, r, o)), Xm() && (i.flags |= 32));
  else if (i.type & 64) {
    ((i.type = n), (i.value = r), (i.attrs = o));
    let s = Zm();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return (Co(i, !0), i);
}
function d0(e, t, n, r, o) {
  let i = yd(),
    s = vd(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = p0(e, a, n, t, r, o));
  return (f0(e, c, i, s), c);
}
function f0(e, t, n, r) {
  (e.firstChild === null && (e.firstChild = t),
    n !== null &&
      (r
        ? n.child == null && t.parent !== null && (n.child = t)
        : n.next === null && ((n.next = t), (t.prev = n))));
}
function p0(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    hd() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      controlDirectiveIndex: -1,
      customControlIndex: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      namespace: Id(),
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function h0(e) {
  let t = e[sd] ?? [],
    r = e[Se][se],
    o = [];
  for (let i of t) i.data[Av] !== void 0 ? o.push(i) : g0(i, r);
  e[sd] = o;
}
function g0(e, t) {
  let n = 0,
    r = e.firstChild;
  if (r) {
    let o = e.data[Nv];
    for (; n < o;) {
      let i = r.nextSibling;
      ($v(t, r, !1), (r = i), n++);
    }
  }
}
var m0 = () => null;
var y0 = () => null;
function gc(e, t) {
  return m0(e, t);
}
function Tw(e, t, n) {
  return y0(e, t, n);
}
var Sw = class {};
var Nr = class {};
var Oo = class {
  destroyNode = null;
  static __NG_ELEMENT_ID__ = () => v0();
};
function v0() {
  let e = L(),
    n = mt(Ae().index, e);
  return (fn(n) ? n : e)[se];
}
var Mw = (() => {
  class e {
    static ɵprov = k$1({ token: e, providedIn: `root`, factory: () => null });
  }
  return e;
})();
function _w(e) {
  return e.debugInfo?.className || e.type.name || null;
}
var lc = {};
var mc = class {
  injector;
  parentInjector;
  constructor(t, n) {
    ((this.injector = t), (this.parentInjector = n));
  }
  get(t, n, r) {
    let o = this.injector.get(t, lc, r);
    return o !== lc || n === lc ? o : this.parentInjector.get(t, n, r);
  }
};
function Xf(e) {
  return Aw(e) ? Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e) : !1;
}
function Nw(e, t) {
  if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
  else {
    let n = e[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done;) t(r.value);
  }
}
function Aw(e) {
  return e !== null && (typeof e == `function` || typeof e == `object`);
}
function wt(e, t, n) {
  if (n === We) return !1;
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function Rw(e, t, n, r) {
  let o = wt(e, t, n);
  return wt(e, t + 1, r) || o;
}
function w0(e, t, n, r, o) {
  let i = Rw(e, t, n, r);
  return wt(e, t + 2, o) || i;
}
function _o(e, t, n) {
  return function r(o) {
    let i = r.__ngNativeEl__;
    i !== void 0 && vM(o, i);
    Qf($t(e) ? mt(e.index, t) : t, 5);
    let a = t[be$1],
      c = By(t, a, n, o),
      d = r.__ngNextListenerFn__;
    for (; d;) ((c = By(t, a, d, o) && c), (d = d.__ngNextListenerFn__));
    return c;
  };
}
function By(e, t, n, r) {
  let o = R(null);
  try {
    return (J(Z.OutputStart, t, n), n(r) !== !1);
  } catch (i) {
    return (G_(e, i), !1);
  } finally {
    (J(Z.OutputEnd, t, n), R(o));
  }
}
function xw(e, t, n, r, o, i, s, a) {
  let c = Do(e),
    d = !1,
    h = null;
  if ((!r && c && (h = D0(t, n, i, e.index)), h !== null)) {
    let p = h.__ngLastListenerFn__ || h;
    ((p.__ngNextListenerFn__ = s), (h.__ngLastListenerFn__ = s), (d = !0));
  } else {
    let p = Je(e, n),
      m = r ? r(p) : p;
    r || (a.__ngNativeEl__ = p);
    let y = o.listen(m, i, a);
    if (!b0(i)) Ow(r ? (T) => r(Ve(T[e.index])) : e.index, t, n, i, a, y, !1);
  }
  return d;
}
function b0(e) {
  return e.startsWith(`animation`) || e.startsWith(`transition`);
}
function D0(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[vo],
          c = o[i + 2];
        return a && a.length > c ? a[c] : null;
      }
      typeof s == `string` && (i += 2);
    }
  return null;
}
function Ow(e, t, n, r, o, i, s) {
  let a = t.firstCreatePass ? fd(t) : null,
    c = dd(n),
    d = c.length;
  (c.push(o, i), a && a.push(r, e, d, (d + 1) * (s ? -1 : 1)));
}
function Uy(e, t, n, r, o) {
  let i = null,
    s = null,
    a = null,
    c = !1,
    d = e.directiveToIndex.get(n.type);
  if (
    (typeof d == `number` ? (i = d) : ([i, s, a] = d),
    s !== null && a !== null && e.hostDirectiveOutputs && Object.hasOwn(e.hostDirectiveOutputs, r))
  ) {
    let h = e.hostDirectiveOutputs[r];
    for (let p = 0; p < h.length; p += 2) {
      let m = h[p];
      if (m >= s && m <= a) ((c = !0), yc(e, t, m, h[p + 1], r, o));
      else if (m > a) break;
    }
  }
  return (Object.hasOwn(n.outputs, r) && ((c = !0), yc(e, t, i, r, r, o)), c);
}
function yc(e, t, n, r, o, i) {
  let s = t[n],
    a = t[O],
    p = s[a.data[n].outputs[r]].subscribe(i);
  Ow(e.index, a, t, o, i, p, !0);
}
function E0() {
  C0();
}
function C0() {
  let e = L(),
    t = ue$1(),
    n = Ae();
  if ((t.firstCreatePass && S0(t, n), n.controlDirectiveIndex === -1)) return;
  vn(`NgSignalForms`);
  let r = e[n.controlDirectiveIndex];
  t.data[n.controlDirectiveIndex].controlDef.create(r, new vc(e, t, n));
}
function I0() {
  T0();
}
function T0() {
  let e = L(),
    t = ue$1(),
    n = Tr();
  if (n.controlDirectiveIndex === -1) return;
  let r = t.data[n.controlDirectiveIndex].controlDef,
    o = e[n.controlDirectiveIndex];
  r.update(o, new vc(e, t, n));
}
var vc = class {
  lView;
  tView;
  tNode;
  hasPassThrough;
  constructor(t, n, r) {
    ((this.lView = t),
      (this.tView = n),
      (this.tNode = r),
      (this.hasPassThrough = !!(r.flags & 4096)));
  }
  get customControl() {
    return this.tNode.customControlIndex !== -1
      ? this.lView[this.tNode.customControlIndex]
      : void 0;
  }
  get nativeElement() {
    return Je(this.tNode, this.lView);
  }
  get descriptor() {
    return `<${this.tNode.value}>`;
  }
  listenToCustomControlOutput(t, n) {
    let r = this.tView.data[this.tNode.customControlIndex];
    Uy(this.tNode, this.lView, r, t, _o(this.tNode, this.lView, n));
  }
  listenToCustomControlModel(t) {
    let n = this.tNode.flags & 1024 ? `valueChange` : `checkedChange`,
      r = this.tView.data[this.tNode.customControlIndex];
    Uy(this.tNode, this.lView, r, n, _o(this.tNode, this.lView, t));
  }
  setInputOnDirectives(t, n, r) {
    let o = this.tNode.inputs?.[t],
      i = this.tNode.hostDirectiveInputs?.[t];
    if (!o && !i) return !1;
    let s = !1;
    if (o)
      for (let a of o) {
        if (a === this.tNode.controlDirectiveIndex) continue;
        let c = this.lView[a],
          d = this.tView.data[a];
        (!r || r(Hy(c, d, t))) && (_r(d, c, t, n), (s = !0));
      }
    if (i)
      for (let a = 0; a < i.length; a += 2) {
        let c = i[a];
        if (c === this.tNode.controlDirectiveIndex) continue;
        let d = this.lView[c],
          h = i[a + 1],
          p = this.tView.data[c];
        (!r || r(Hy(d, p, t))) && (_r(p, d, h, n), (s = !0));
      }
    return s;
  }
  setCustomControlModelInput(t) {
    let n = this.tView.data[this.tNode.customControlIndex],
      r = this.tNode.flags & 1024 ? `value` : `checked`;
    W_(this.tNode, this.tView, this.lView, n, r, t);
  }
  customControlHasInput(t) {
    if (this.tNode.customControlIndex === -1) return !1;
    let n = this.tView.data[this.tNode.customControlIndex];
    return (n.signalFormsInputPresence ??= this._buildCustomControlInputCache(n))[t] === !0;
  }
  _buildCustomControlInputCache(t) {
    let n = {};
    for (let r in t.inputs) n[r] = !0;
    if (t.hostDirectives !== null) {
      let r = [...t.hostDirectives];
      for (; r.length > 0;) {
        let o = r.shift();
        if (typeof o != `function`) {
          for (let s in o.inputs) n[o.inputs[s]] = !0;
          let i = Vy(o.directive);
          i !== null && r.push(...i);
          continue;
        }
        for (let i of o()) {
          if (typeof i == `function`) continue;
          if (i.inputs)
            for (let a = 0; a < i.inputs.length; a += 2) {
              let c = i.inputs[a + 1] || i.inputs[a];
              n[c] = !0;
            }
          let s = Vy(i.directive);
          s !== null && r.push(...s);
        }
      }
    }
    return n;
  }
};
function Vy(e) {
  return typeof e == `function` && `ɵdir` in e ? (e.ɵdir.hostDirectives ?? null) : null;
}
function Hy(e, t, n) {
  if (!t.inputs || !Object.hasOwn(t.inputs, n)) return;
  let [r, o] = t.inputs[n];
  if ((o & Qi.SignalBased) !== 0) {
    let s = e[r][ye$1];
    return s.value === _c ? void 0 : s.value;
  }
  return e[r];
}
function S0(e, t, n) {
  for (let o = t.directiveStart; o < t.directiveEnd; o++)
    if (e.data[o].controlDef) {
      t.controlDirectiveIndex = o;
      break;
    }
  if (t.controlDirectiveIndex === -1) return;
  let r = e.data[t.controlDirectiveIndex].controlDef;
  if (r.passThroughInput && (t.inputs?.[r.passThroughInput]?.length ?? 0) > 1) {
    t.flags |= 4096;
    return;
  }
  M0(e, t);
}
function M0(e, t) {
  for (let n = t.directiveStart; n < t.directiveEnd; n++) {
    let r = e.data[n];
    if (!(t.directiveToIndex && !t.directiveToIndex.has(r.type))) {
      if ($y(r, `value`)) {
        ((t.flags |= 1024), (t.customControlIndex = n));
        return;
      }
      if ($y(r, `checked`)) {
        ((t.flags |= 2048), (t.customControlIndex = n));
        return;
      }
    }
  }
  if (
    t.hostDirectiveInputs !== null &&
    t.hostDirectiveOutputs !== null &&
    t.directiveToIndex !== null
  ) {
    let n = (r, o) => {
      let i = t.hostDirectiveInputs[r],
        s = t.hostDirectiveOutputs[r + `Change`];
      if (!i || !s) return !1;
      for (let a = 0; a < i.length; a += 2) {
        let c = i[a];
        for (let d = 0; d < s.length; d += 2)
          if (c === s[d])
            for (let p of t.directiveToIndex.values()) {
              if (!Array.isArray(p)) continue;
              let [m, y, w] = p;
              if (c >= y && c <= w) return ((t.flags |= o), (t.customControlIndex = m), !0);
            }
      }
      return !1;
    };
    if (n(`value`, 1024) || n(`checked`, 2048)) return;
  }
}
function $y(e, t) {
  return _0(e, t) && N0(e, t + `Change`);
}
function _0(e, t) {
  return t in e.inputs;
}
function N0(e, t) {
  return t in e.outputs;
}
var af = Symbol(`BINDING`);
var Or = new A(``);
function wc(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == `number`) i = a;
      else if (i == 1) o = Ra(o, a);
      else if (i == 2) {
        let c = a,
          d = t[++s];
        r = Ra(r, c + `: ` + d + `;`);
      }
    }
  (n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o));
}
function bt(e, t = 0) {
  let n = L();
  if (n === null) return N(e, t);
  return vv(Ae(), n, Le(e), t);
}
function kw(e, t, n, r, o) {
  let i = r === null ? null : { '': -1 },
    s = o(e, n);
  if (s !== null) {
    let a = s,
      c = null,
      d = null;
    for (let h of s)
      if (h.resolveHostDirectives !== null) {
        [a, c, d] = h.resolveHostDirectives(s);
        break;
      }
    x0(e, t, n, a, i, c, d);
  }
  i !== null && r !== null && A0(n, r, i);
}
function A0(e, t, n) {
  let r = (e.localNames = []);
  for (let o = 0; o < t.length; o += 2) {
    let i = n[t[o + 1]];
    if (i == null) throw new M(-301, !1);
    r.push(t[o], i);
  }
}
function R0(e, t, n) {
  ((t.componentOffset = n), (e.components ??= []).push(t.index));
}
function x0(e, t, n, r, o, i, s) {
  let a = r.length,
    c = null;
  for (let m = 0; m < a; m++) {
    let y = r[m];
    (c === null && zt(y) && ((c = y), R0(e, n, m)), $d(pc(n, t), e, y.type));
  }
  (j0(n, e.data.length, a), c?.viewProvidersResolver && c.viewProvidersResolver(c));
  for (let m = 0; m < a; m++) {
    let y = r[m];
    y.providersResolver && y.providersResolver(y);
  }
  let d = !1,
    h = !1,
    p = ow(e, t, a, null);
  a > 0 && (n.directiveToIndex = /* @__PURE__ */ new Map());
  for (let m = 0; m < a; m++) {
    let y = r[m];
    if (
      ((n.mergedAttrs = No(n.mergedAttrs, y.hostAttrs)),
      k0(e, n, t, p, y),
      F0(p, y, o),
      s !== null && s.has(y))
    ) {
      let [T, E] = s.get(y);
      n.directiveToIndex.set(y.type, [p, T + n.directiveStart, E + n.directiveStart]);
    } else (i === null || !i.has(y)) && n.directiveToIndex.set(y.type, p);
    (y.contentQueries !== null && (n.flags |= 4),
      (y.hostBindings !== null || y.hostAttrs !== null || y.hostVars !== 0) && (n.flags |= 64));
    let w = y.type.prototype;
    (!d &&
      (w.ngOnChanges || w.ngOnInit || w.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (d = !0)),
      !h &&
        (w.ngOnChanges || w.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (h = !0)),
      p++);
  }
  O0(e, n, i);
}
function O0(e, t, n) {
  for (let r = t.directiveStart; r < t.directiveEnd; r++) {
    let o = e.data[r];
    if (n === null || !n.has(o)) (zy(0, t, o, r), zy(1, t, o, r), Gy(t, r, !1));
    else {
      let i = n.get(o);
      (qy(0, t, i, r), qy(1, t, i, r), Gy(t, r, !0));
    }
  }
}
function zy(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (Object.hasOwn(o, i)) {
      let s;
      (e === 0 ? (s = t.inputs ??= {}) : (s = t.outputs ??= {}),
        (s[i] ??= []),
        s[i].push(r),
        Pw(t, i));
    }
}
function qy(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (Object.hasOwn(o, i)) {
      let s = o[i],
        a;
      (e === 0 ? (a = t.hostDirectiveInputs ??= {}) : (a = t.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(r, i),
        Pw(t, s));
    }
}
function Pw(e, t) {
  t === `class` ? (e.flags |= 8) : t === `style` && (e.flags |= 16);
}
function Gy(e, t, n) {
  let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
  if (r === null || (!n && o === null) || (n && i === null) || Pf(e)) {
    ((e.initialInputs ??= []), e.initialInputs.push(null));
    return;
  }
  let s = null,
    a = 0;
  for (; a < r.length;) {
    let c = r[a];
    if (c === 0) {
      a += 4;
      continue;
    } else if (c === 5) {
      a += 2;
      continue;
    } else if (typeof c == `number`) break;
    if (!n && Object.hasOwn(o, c)) {
      let d = o[c];
      for (let h of d)
        if (h === t) {
          ((s ??= []), s.push(c, r[a + 1]));
          break;
        }
    } else if (n && Object.hasOwn(i, c)) {
      let d = i[c];
      for (let h = 0; h < d.length; h += 2)
        if (d[h] === t) {
          ((s ??= []), s.push(d[h + 1], r[a + 1]));
          break;
        }
    }
    a += 2;
  }
  ((e.initialInputs ??= []), e.initialInputs.push(s));
}
function k0(e, t, n, r, o) {
  e.data[r] = o;
  let s = new Mr(o.factory || (o.factory = fr(o.type, !0)), zt(o), bt, null);
  ((e.blueprint[r] = s), (n[r] = s), P0(e, t, r, ow(e, n, o.hostVars, We), o));
}
function P0(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    (L0(s) != a && s.push(a), s.push(n, r, i));
  }
}
function L0(e) {
  let t = e.length;
  for (; t > 0;) {
    let n = e[--t];
    if (typeof n == `number` && n < 0) return n;
  }
  return 0;
}
function F0(e, t, n) {
  if (n) {
    if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    zt(t) && (n[``] = e);
  }
}
function j0(e, t, n) {
  ((e.flags |= 1), (e.directiveStart = t), (e.directiveEnd = t + n), (e.providerIndexes = t));
}
function Jf(e, t, n, r, o, i, s, a) {
  let c = t[O],
    d = c.consts,
    p = Fo(c, e, n, r, yt(d, s));
  return (
    i && kw(c, t, p, yt(d, a), o),
    (p.mergedAttrs = No(p.mergedAttrs, p.attrs)),
    p.attrs !== null && wc(p, p.attrs, !1),
    p.mergedAttrs !== null && wc(p, p.mergedAttrs, !0),
    c.queries !== null && c.queries.elementStart(c, p),
    p
  );
}
function ep(e, t) {
  (lv(e, t), ad(t) && e.queries.elementEnd(t));
}
function B0(e, t, n, r, o, i) {
  let s = t.consts,
    c = Fo(t, e, n, r, yt(s, o));
  if (((c.mergedAttrs = No(c.mergedAttrs, c.attrs)), i != null)) {
    let d = yt(s, i);
    c.localNames = [];
    for (let h = 0; h < d.length; h += 2) c.localNames.push(d[h], -1);
  }
  return (
    c.attrs !== null && wc(c, c.attrs, !1),
    c.mergedAttrs !== null && wc(c, c.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, c),
    c
  );
}
var Lw = typeof ShadowRoot < `u`;
var U0 = typeof Document < `u`;
function V0(e) {
  return Object.keys(e).map((t) => {
    let [n, r, o] = e[t],
      i = { propName: n, templateName: t, isSignal: (r & Qi.SignalBased) !== 0 };
    return (o && (i.transform = o), i);
  });
}
function H0(e) {
  return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
}
function $0(e, t, n) {
  let r = t instanceof we$1 ? t : t?.injector;
  return (
    r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r),
    r ? new mc(n, r) : n
  );
}
function z0(e) {
  let t = e.get(Nr, null);
  if (t === null) throw new M(407, !1);
  return {
    rendererFactory: t,
    sanitizer: e.get(Mw, null),
    changeDetectionScheduler: e.get(Bt, null),
    ngReflect: !1,
    tracingService: e.get(Nt, null, { optional: !0 }),
  };
}
function q0(e, t, n) {
  let r = Fw(e);
  return Vv(t, r, r === `svg` ? gr : r === `math` ? Va : n);
}
function G0(e) {
  if (
    (e && `localName` in e && typeof e.localName == `string`
      ? e.localName
      : e?.tagName
    )?.toLowerCase() === `script`
  )
    throw new M(905, !1);
}
function Fw(e) {
  return (e.selectors[0][0] || `div`).toLowerCase();
}
var ko = class {
  componentDef;
  ngModule;
  selector;
  componentType;
  ngContentSelectors;
  isBoundToModule;
  cachedInputs = null;
  cachedOutputs = null;
  get inputs() {
    return ((this.cachedInputs ??= V0(this.componentDef.inputs)), this.cachedInputs);
  }
  get outputs() {
    return ((this.cachedOutputs ??= H0(this.componentDef.outputs)), this.cachedOutputs);
  }
  constructor(t, n) {
    ((this.componentDef = t),
      (this.ngModule = n),
      (this.componentType = t.type),
      (this.selector = d_(t.selectors)),
      (this.ngContentSelectors = t.ngContentSelectors ?? []),
      (this.isBoundToModule = !!n));
  }
  create(t, n, r, o, i, s, a, c) {
    J(Z.DynamicComponentStart);
    let d = R(null);
    try {
      let h = this.componentDef,
        p = $0(h, o || this.ngModule, t),
        m = z0(p),
        y = m.tracingService;
      return y && y.componentCreate
        ? y.componentCreate(_w(h), () => this.createComponentRef(m, p, n, r, i, s, a, c))
        : this.createComponentRef(m, p, n, r, i, s, a, c);
    } finally {
      R(d);
    }
  }
  createComponentRef(t, n, r, o, i, s, a, c) {
    let d = this.componentDef,
      h = W0(o, d, s, i, c),
      p = t.rendererFactory.createRenderer(null, d),
      m = o ? L_(p, o, d.encapsulation, n) : q0(d, p, a ?? null);
    G0(m);
    let y = n.get(Or, null),
      w = Y0(m, () => n.get(me, null) ?? _v());
    y && y.addHost(w);
    let T = s?.some(Wy) || i?.some((V) => typeof V != `function` && V.bindings.some(Wy)),
      E = qf(null, h, null, 512 | rw(d), null, null, t, p, n, null, Ov(m, n, !0));
    (y &&
      Lw &&
      w instanceof ShadowRoot &&
      qa(E, () => {
        y.removeHost(w);
      }),
      (E[De] = m),
      Za(E));
    let _ = null;
    try {
      let V = Jf(De, E, 2, `#host`, () => h.directiveRegistry, !0, 0);
      (zv(p, m, V),
        Ao(m, E),
        Pc(h, E, V),
        Mf(h, V, E),
        ep(h, V),
        r !== void 0 && K0(V, this.ngContentSelectors, r),
        (_ = mt(V.index, E)),
        (E[be$1] = _[be$1]),
        Kf(h, E, null));
    } catch (V) {
      throw (_ !== null && qd(_), qd(E), V);
    } finally {
      (J(Z.DynamicComponentEnd), Ka());
    }
    return new bc(this.componentType, E, !!T);
  }
};
function W0(e, t, n, r, o) {
  let i = e ? [`ng-version`, `22.2.4`] : f_(t.selectors[0]),
    s = null,
    a = null,
    c = 0;
  if (n)
    for (let p of n)
      ((c += p[af].requiredVars),
        p.create && ((p.targetIdx = 0), (s ??= []).push(p)),
        p.update && ((p.targetIdx = 0), (a ??= []).push(p)));
  if (r)
    for (let p = 0; p < r.length; p++) {
      let m = r[p];
      if (typeof m != `function`)
        for (let y of m.bindings) {
          c += y[af].requiredVars;
          let w = p + 1;
          (y.create && ((y.targetIdx = w), (s ??= []).push(y)),
            y.update && ((y.targetIdx = w), (a ??= []).push(y)));
        }
    }
  let d = [t];
  if (r)
    for (let p of r) {
      let y = ka(typeof p == `function` ? p : p.type);
      d.push(y);
    }
  return zf(0, null, Z0(s, a), 1, c, d, null, null, null, [i], null);
}
function Y0(e, t) {
  let n = e.getRootNode?.();
  return U0 && n instanceof Document ? n.head : n && Lw && n instanceof ShadowRoot ? n : t().head;
}
function Z0(e, t) {
  return !e && !t
    ? null
    : (n) => {
        if (n & 1 && e) for (let r of e) r.create();
        if (n & 2 && t) for (let r of t) r.update();
      };
}
function Wy(e) {
  let t = e[af].kind;
  return t === `input` || t === `twoWay`;
}
var bc = class extends Sw {
  _rootLView;
  _hasInputBindings;
  instance;
  hostView;
  changeDetectorRef;
  componentType;
  location;
  previousInputValues = null;
  _tNode;
  constructor(t, n, r) {
    (super(),
      (this._rootLView = n),
      (this._hasInputBindings = r),
      (this._tNode = Ha(n[O], De)),
      (this.location = Lo(this._tNode, n)),
      (this.instance = mt(this._tNode.index, n)[be$1]),
      (this.hostView = this.changeDetectorRef = new qn(n, void 0)),
      (this.componentType = t));
  }
  setInput(t, n) {
    this._hasInputBindings;
    let r = this._tNode;
    if (
      ((this.previousInputValues ??= /* @__PURE__ */ new Map()),
      this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
    )
      return;
    let o = this._rootLView;
    Lc(r, o[O], o, t, n);
    this.previousInputValues.set(t, n);
    Qf(mt(r.index, o), 1);
  }
  get injector() {
    return new hn(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(t) {
    this.hostView.onDestroy(t);
  }
};
function K0(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
var Wn = (() => {
  class e {
    static __NG_ELEMENT_ID__ = Q0;
  }
  return e;
})();
function Q0() {
  return jw(Ae(), L());
}
var cf = class e extends Wn {
  _lContainer;
  _hostTNode;
  _hostLView;
  constructor(t, n, r) {
    (super(), (this._lContainer = t), (this._hostTNode = n), (this._hostLView = r));
  }
  get element() {
    return Lo(this._hostTNode, this._hostLView);
  }
  get injector() {
    return new hn(this._hostTNode, this._hostLView);
  }
  get parentInjector() {
    let t = If(this._hostTNode, this._hostLView);
    if (fv(t)) {
      let n = fc(t, this._hostLView),
        r = dc(t),
        o = n[O].data[r + 8];
      return new hn(o, n);
    } else return new hn(null, this._hostLView);
  }
  clear() {
    for (; this.length > 0;) this.remove(this.length - 1);
  }
  get(t) {
    let n = Yy(this._lContainer);
    return (n !== null && n[t]) || null;
  }
  get length() {
    return this._lContainer.length - Ee;
  }
  createEmbeddedView(t, n, r) {
    let o, i, s;
    typeof r == `number`
      ? (o = r)
      : r != null && ((o = r.index), (i = r.injector), (s = r.onError));
    let a = gc(this._lContainer, t.ssrId),
      c = t.createEmbeddedViewImpl(n || {}, i, a);
    return (s && (c._lView[bo] = s), this.insertImpl(c, o, Ro(this._hostTNode, a)), c);
  }
  createComponent(t, n, r, o, i, s, a) {
    let c,
      d,
      h = n || {};
    ((c = h.index),
      (r = h.injector),
      (o = h.projectableNodes),
      (i = h.environmentInjector || h.ngModuleRef),
      (s = h.directives),
      (a = h.bindings),
      (d = h.onError));
    let p = new ko(jn(t)),
      m = r || this.parentInjector;
    if (!i && p.ngModule == null) {
      let V = this.parentInjector.get(we$1, null);
      V && (i = V);
    }
    let y = jn(p.componentType ?? {}),
      w = gc(this._lContainer, y?.id ?? null),
      T = w?.firstChild ?? null,
      E = p.create(m, o, T, i, s, a, this._getHostElementNamespace());
    return (
      d && (E.hostView._lView[bo] = d),
      this.insertImpl(E.hostView, c, Ro(this._hostTNode, w)),
      E
    );
  }
  _getHostElementNamespace() {
    if (this._hostTNode.type & 2) {
      let t = this._hostTNode.parent ?? this._hostLView[Ue];
      return t !== null &&
        t.type & 2 &&
        typeof t.value == `string` &&
        t.value.toLowerCase() === `foreignobject`
        ? null
        : (t?.namespace ?? null);
    }
    return this._hostTNode.namespace;
  }
  insert(t, n) {
    return this.insertImpl(t, n, !0);
  }
  insertImpl(t, n, r) {
    let o = t._lView;
    if (Vm(o)) {
      let a = this.indexOf(t);
      if (a !== -1) this.detach(a);
      else {
        let c = o[Se],
          d = new e(c, c[Ue], c[Se]);
        d.detach(d.indexOf(t));
      }
    }
    let i = this._adjustIndex(n),
      s = this._lContainer;
    return (es(s, o, i, r), t.attachToViewContainerRef(), Xu(kd(s), i, t), t);
  }
  move(t, n) {
    return this.insert(t, n);
  }
  indexOf(t) {
    let n = Yy(this._lContainer);
    return n !== null ? n.indexOf(t) : -1;
  }
  remove(t) {
    let n = this._adjustIndex(t, -1),
      r = $i(this._lContainer, n);
    r && (Ti(kd(this._lContainer), n), Oc(r[O], r));
  }
  detach(t) {
    let n = this._adjustIndex(t, -1),
      r = $i(this._lContainer, n);
    return r && Ti(kd(this._lContainer), n) != null ? new qn(r) : null;
  }
  _adjustIndex(t, n = 0) {
    return t ?? this.length + n;
  }
};
function Yy(e) {
  return e[_i];
}
function kd(e) {
  return e[_i] || (e[_i] = []);
}
function jw(e, t) {
  let n,
    r = t[e.index];
  return (
    gt(r) ? (n = r) : ((n = Dw(r, t, null, e)), (t[e.index] = n), Gf(t, n)),
    J0(n, t, e, r),
    new cf(n, e, t)
  );
}
function X0(e, t) {
  let n = e[se],
    r = n.createComment(``),
    o = Je(t, e);
  return (Sr(n, n.parentNode(o), r, n.nextSibling(o), !1), r);
}
var J0 = nN;
var eN = () => !1;
function tN(e, t, n) {
  return eN(e, t, n);
}
function nN(e, t, n, r) {
  if (e[Dr]) return;
  let o;
  (n.type & 8 ? (o = Ve(r)) : (o = X0(t, n)), (e[Dr] = o));
}
var lf = class e {
  queryList;
  matches = null;
  constructor(t) {
    this.queryList = t;
  }
  clone() {
    return new e(this.queryList);
  }
  setDirty() {
    this.queryList.setDirty();
  }
};
var uf = class e {
  queries;
  constructor(t = []) {
    this.queries = t;
  }
  createEmbeddedView(t) {
    let n = t.queries;
    if (n !== null) {
      let r = t.contentQueries !== null ? t.contentQueries[0] : n.length,
        o = [];
      for (let i = 0; i < r; i++) {
        let s = n.getByIndex(i),
          a = this.queries[s.indexInDeclarationView];
        o.push(a.clone());
      }
      return new e(o);
    }
    return null;
  }
  insertView(t) {
    this.dirtyQueriesWithMatches(t);
  }
  detachView(t) {
    this.dirtyQueriesWithMatches(t);
  }
  finishViewCreation(t) {
    this.dirtyQueriesWithMatches(t);
  }
  dirtyQueriesWithMatches(t) {
    for (let n = 0; n < this.queries.length; n++)
      np(t, n).matches !== null && this.queries[n].setDirty();
  }
};
var Dc = class {
  flags;
  read;
  predicate;
  constructor(t, n, r = null) {
    ((this.flags = n),
      (this.read = r),
      typeof t == `string` ? (this.predicate = aN(t)) : (this.predicate = t));
  }
};
var df = class e {
  queries;
  constructor(t = []) {
    this.queries = t;
  }
  elementStart(t, n) {
    for (let r = 0; r < this.queries.length; r++) this.queries[r].elementStart(t, n);
  }
  elementEnd(t) {
    for (let n = 0; n < this.queries.length; n++) this.queries[n].elementEnd(t);
  }
  embeddedTView(t) {
    let n = null;
    for (let r = 0; r < this.length; r++) {
      let o = n !== null ? n.length : 0,
        i = this.getByIndex(r).embeddedTView(t, o);
      i && ((i.indexInDeclarationView = r), n !== null ? n.push(i) : (n = [i]));
    }
    return n !== null ? new e(n) : null;
  }
  template(t, n) {
    for (let r = 0; r < this.queries.length; r++) this.queries[r].template(t, n);
  }
  getByIndex(t) {
    return this.queries[t];
  }
  get length() {
    return this.queries.length;
  }
  track(t) {
    this.queries.push(t);
  }
};
var ff = class e {
  metadata;
  matches = null;
  indexInDeclarationView = -1;
  crossesNgTemplate = !1;
  _declarationNodeIndex;
  _appliesToNextNode = !0;
  constructor(t, n = -1) {
    ((this.metadata = t), (this._declarationNodeIndex = n));
  }
  elementStart(t, n) {
    this.isApplyingToNode(n) && this.matchTNode(t, n);
  }
  elementEnd(t) {
    this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1);
  }
  template(t, n) {
    this.elementStart(t, n);
  }
  embeddedTView(t, n) {
    return this.isApplyingToNode(t)
      ? ((this.crossesNgTemplate = !0), this.addMatch(-t.index, n), new e(this.metadata))
      : null;
  }
  isApplyingToNode(t) {
    if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
      let n = this._declarationNodeIndex,
        r = t.parent;
      for (; r !== null && r.type & 8 && r.index !== n;) r = r.parent;
      return n === (r !== null ? r.index : -1);
    }
    return this._appliesToNextNode;
  }
  matchTNode(t, n) {
    let r = this.metadata.predicate;
    if (Array.isArray(r))
      for (let o = 0; o < r.length; o++) {
        let i = r[o];
        (this.matchTNodeWithReadOption(t, n, rN(n, i)),
          this.matchTNodeWithReadOption(t, n, cc(n, t, i, !1, !1)));
      }
    else
      r === xo
        ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1)
        : this.matchTNodeWithReadOption(t, n, cc(n, t, r, !1, !1));
  }
  matchTNodeWithReadOption(t, n, r) {
    if (r !== null) {
      let o = this.metadata.read;
      if (o !== null)
        if (o === Gn || o === Wn || o === Fe || (o === xo && n.type & 4))
          this.addMatch(n.index, -2);
        else {
          let i = cc(n, t, o, !1, !1);
          i !== null && this.addMatch(n.index, i);
        }
      else this.addMatch(n.index, r);
    }
  }
  addMatch(t, n) {
    this.matches === null ? (this.matches = [t, n]) : this.matches.push(t, n);
  }
};
function rN(e, t) {
  let n = e.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
  }
  return null;
}
function oN(e, t) {
  return e.type & 11 ? Lo(e, t) : e.type & 4 ? Fc(e, t) : null;
}
function iN(e, t, n, r) {
  return n === -1 ? oN(t, e) : n === -2 ? sN(e, t, r) : Ui(e, e[O], n, t);
}
function sN(e, t, n) {
  if (n === Gn) return Lo(t, e);
  if (n === xo) return Fc(t, e);
  if (n === Wn) return jw(t, e);
  if (n === Fe) return new hn(t, e);
}
function Bw(e, t, n, r) {
  let o = t[Ht].queries[r];
  if (o.matches === null) {
    let i = e.data,
      s = n.matches,
      a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
      let d = s[c];
      if (d < 0) a.push(null);
      else {
        let h = i[d];
        a.push(iN(t, h, s[c + 1], n.metadata.read));
      }
    }
    o.matches = a;
  }
  return o.matches;
}
function pf(e, t, n, r) {
  let o = e.queries.getByIndex(n),
    i = o.matches;
  if (i !== null) {
    let s = Bw(e, t, o, n);
    for (let a = 0; a < i.length; a += 2) {
      let c = i[a];
      if (c > 0) r.push(s[a / 2]);
      else {
        let d = i[a + 1],
          h = t[-c];
        for (let p = Ee; p < h.length; p++) {
          let m = h[p];
          m[Hn] === m[Se] && pf(m[O], m, d, r);
        }
        if (h[Er] !== null) {
          let p = h[Er];
          for (let m = 0; m < p.length; m++) {
            let y = p[m];
            pf(y[O], y, d, r);
          }
        }
      }
    }
  }
  return r;
}
function tp(e, t) {
  return e[Ht].queries[t].queryList;
}
function Uw(e, t, n) {
  let r = new hc((n & 4) === 4);
  return (zm(e, t, r, r.destroy), (t[Ht] ??= new uf()).queries.push(new lf(r)) - 1);
}
function Vw(e, t, n) {
  let r = ue$1();
  return (
    r.firstCreatePass && ($w(r, new Dc(e, t, n), -1), (t & 2) === 2 && (r.staticViewQueries = !0)),
    Uw(r, L(), t)
  );
}
function Hw(e, t, n, r) {
  let o = ue$1();
  if (o.firstCreatePass) {
    let i = Ae();
    ($w(o, new Dc(t, n, r), i.index), cN(o, e), (n & 2) === 2 && (o.staticContentQueries = !0));
  }
  return Uw(o, L(), n);
}
function aN(e) {
  return e.split(`,`).map((t) => t.trim());
}
function $w(e, t, n) {
  (e.queries === null && (e.queries = new df()), e.queries.track(new ff(t, n)));
}
function cN(e, t) {
  let n = e.contentQueries || (e.contentQueries = []);
  t !== (n.length ? n[n.length - 1] : -1) && n.push(e.queries.length - 1, t);
}
function np(e, t) {
  return e.queries.getByIndex(t);
}
function zw(e, t) {
  let n = e[O],
    r = np(n, t);
  return r.crossesNgTemplate ? pf(n, e, t, []) : Bw(n, e, r, t);
}
function qw(e, t, n) {
  let r,
    o = ii(() => {
      r._dirtyCounter();
      let i = lN(r, e);
      if (t && i === void 0) throw new M(-951, !1);
      return i;
    });
  return ((r = o[ye$1]), (r._dirtyCounter = Ce$1(0)), (r._flatValue = void 0), o);
}
function rp(e) {
  return qw(!0, !1, e);
}
function op(e) {
  return qw(!0, !0, e);
}
function Gw(e, t) {
  let n = e[ye$1];
  ((n._lView = L()),
    (n._queryIndex = t),
    (n._queryList = tp(n._lView, t)),
    n._queryList.onDirty(() => n._dirtyCounter.update((r) => r + 1)));
}
function lN(e, t) {
  let n = e._lView,
    r = e._queryIndex;
  if (n === void 0 || r === void 0 || n[P] & 4) return t ? void 0 : ze;
  let o = tp(n, r),
    i = zw(n, r);
  return (
    o.reset(i, Ev),
    t
      ? o.first
      : o._changesDetected || e._flatValue === void 0
        ? (e._flatValue = o.toArray())
        : e._flatValue
  );
}
function jo(e) {
  return !!e && typeof e.then == `function`;
}
function ip(e) {
  return !!e && typeof e.subscribe == `function`;
}
var Ar = class {};
var jc = class {};
var Ec = class extends Ar {
  ngModuleType;
  _parent;
  _bootstrapComponents = [];
  _r3Injector;
  instance;
  destroyCbs = [];
  constructor(t, n, r, o = !0) {
    (super(), (this.ngModuleType = t), (this._parent = n));
    let i = Dm(t);
    ((this._bootstrapComponents = e_(i.bootstrap)),
      (this._r3Injector = Td(
        t,
        n,
        [{ provide: Ar, useValue: this }, ...r],
        Di(t),
        /* @__PURE__ */ new Set([`environment`]),
      )),
      o && this.resolveInjectorInitializers());
  }
  resolveInjectorInitializers() {
    (this._r3Injector.resolveInjectorInitializers(),
      (this.instance = this._r3Injector.get(this.ngModuleType)));
  }
  get injector() {
    return this._r3Injector;
  }
  destroy() {
    let t = this._r3Injector;
    (!t.destroyed && t.destroy(), this.destroyCbs.forEach((n) => n()), (this.destroyCbs = null));
  }
  onDestroy(t) {
    this.destroyCbs.push(t);
  }
};
var Cc = class extends jc {
  moduleType;
  constructor(t) {
    (super(), (this.moduleType = t));
  }
  create(t) {
    return new Ec(this.moduleType, t, []);
  }
};
var zi = class extends Ar {
  injector;
  instance = null;
  constructor(t) {
    super();
    let n = new hr(
      [...t.providers, { provide: Ar, useValue: this }],
      t.parent || yo(),
      t.debugName,
      /* @__PURE__ */ new Set([`environment`]),
    );
    ((this.injector = n), t.runEnvironmentInitializers && n.resolveInjectorInitializers());
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function ts(e, t, n = null) {
  return new zi({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: !0 }).injector;
}
var uN = (() => {
  class e {
    _injector;
    cachedInjectors = /* @__PURE__ */ new Map();
    constructor(n) {
      this._injector = n;
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = td(!1, n.type),
          o = r.length > 0 ? ts([r], this._injector, ``) : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = k$1({ token: e, providedIn: `environment`, factory: () => new e(N(we$1)) });
  }
  return e;
})();
function sp(e) {
  return Wi(() => {
    let t = Ww(e),
      n = Y(C({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection !== Tf.Eager,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: t.standalone
          ? (o) => o.get(uN).getOrCreateStandaloneInjector(n)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || _t.Emulated,
        styles: e.styles || ze,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: ``,
      });
    (t.standalone && vn(`NgStandalone`), Yw(n));
    let r = e.dependencies;
    return ((n.directiveDefs = Zy(r, dN)), (n.pipeDefs = Zy(r, Em)), (n.id = hN(n)), n);
  });
}
function dN(e) {
  return jn(e) || ka(e);
}
function ns(e) {
  return Wi(() => ({
    type: e.type,
    bootstrap: e.bootstrap || ze,
    declarations: e.declarations || ze,
    imports: e.imports || ze,
    exports: e.exports || ze,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function fN(e, t) {
  if (e == null) return Un;
  let n = {};
  for (let r in e)
    if (Object.hasOwn(e, r)) {
      let o = e[r],
        i,
        s,
        a,
        c;
      (Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i), (c = o[3] || null))
        : ((i = o), (s = o), (a = Qi.None), (c = null)),
        (n[i] = [r, a, c]),
        (t[i] = s));
    }
  return n;
}
function pN(e) {
  if (e == null) return Un;
  let t = {};
  for (let n in e) Object.hasOwn(e, n) && (t[e[n]] = n);
  return t;
}
function kr(e) {
  return Wi(() => {
    let t = Ww(e);
    return (Yw(t), t);
  });
}
function Ww(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    viewProvidersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputConfig: e.inputs || Un,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || ze,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    resolveHostDirectives: null,
    hostDirectives: null,
    controlDef: null,
    signalFormsInputPresence: null,
    inputs: fN(e.inputs, t),
    outputs: pN(e.outputs),
    debugInfo: null,
  };
}
function Yw(e) {
  e.features?.forEach((t) => t(e));
}
function Zy(e, t) {
  return e
    ? () => {
        let n = typeof e == `function` ? e() : e,
          r = [];
        for (let o of n) {
          let i = t(o);
          i !== null && r.push(i);
        }
        return r;
      }
    : null;
}
function hN(e) {
  let t = 0,
    n = typeof e.consts == `function` ? `` : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      n,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let i of r.join(`|`)) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
  return ((t += 2147483648), `c` + t);
}
var Zw = new A(``);
var ap = (() => {
  class e {
    resolve;
    reject;
    initialized = !1;
    done = !1;
    donePromise = new Promise((n, r) => {
      ((this.resolve = n), (this.reject = r));
    });
    appInits = b(Zw, { optional: !0 }) ?? [];
    injector = b(Fe);
    constructor() {}
    runInitializers() {
      if (this.initialized) return;
      let n = [];
      for (let o of this.appInits) {
        let i = Ne(this.injector, o);
        if (jo(i)) n.push(i);
        else if (ip(i)) {
          let s = new Promise((a, c) => {
            i.subscribe({ complete: a, error: c });
          });
          n.push(s);
        }
      }
      let r = () => {
        ((this.done = !0), this.resolve());
      };
      (Promise.all(n)
        .then(() => {
          r();
        })
        .catch((o) => {
          this.reject(o);
        }),
        n.length === 0 && r(),
        (this.initialized = !0));
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function gN(e) {
  return (t) => {
    t.controlDef = {
      create: (n, r) => {
        n?.ɵngControlCreate(r);
      },
      update: (n, r) => {
        n?.ɵngControlUpdate?.(r);
      },
      passThroughInput: e,
    };
  };
}
function mN(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function Kw(e) {
  let t = mN(e.type),
    n = !0,
    r = [e];
  for (; t && t !== Function.prototype && t !== Object.prototype;) {
    let o,
      i = Object.hasOwn(t, Ci) ? t[Ci] : void 0,
      s = Object.hasOwn(t, Ii) ? t[Ii] : void 0;
    if (zt(e)) o = i ?? s;
    else {
      if (i) throw new M(903, !1);
      o = s;
    }
    if (o) {
      if (n) {
        r.push(o);
        let c = e;
        ((c.inputs = Pd(e.inputs)),
          (c.declaredInputs = Pd(e.declaredInputs)),
          (c.outputs = Pd(e.outputs)));
        let d = o.hostBindings;
        d && DN(e, d);
        let h = o.viewQuery,
          p = o.contentQueries;
        if (
          (h && wN(e, h),
          p && bN(e, p),
          yN(e, o),
          bm(e.outputs, o.outputs),
          zt(o) && o.data.animation)
        ) {
          let m = e.data;
          m.animation = (m.animation || []).concat(o.data.animation);
        }
      }
      let a = o.features;
      if (a)
        for (let c = 0; c < a.length; c++) {
          let d = a[c];
          (d && d.ngInherit && d(e), d === Kw && (n = !1));
        }
    }
    t = Object.getPrototypeOf(t);
  }
  vN(r);
}
function yN(e, t) {
  for (let n in t.inputs) {
    if (!Object.hasOwn(t.inputs, n) || Object.hasOwn(e.inputs, n)) continue;
    let r = t.inputs[n];
    r !== void 0 && ((e.inputs[n] = r), (e.declaredInputs[n] = t.declaredInputs[n]));
  }
}
function vN(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    ((o.hostVars = t += o.hostVars), (o.hostAttrs = No(o.hostAttrs, (n = No(n, o.hostAttrs)))));
  }
}
function Pd(e) {
  return e === Un ? {} : e === ze ? [] : e;
}
function wN(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        (t(r, o), n(r, o));
      })
    : (e.viewQuery = t);
}
function bN(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        (t(r, o, i), n(r, o, i));
      })
    : (e.contentQueries = t);
}
function DN(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        (t(r, o), n(r, o));
      })
    : (e.hostBindings = t);
}
function Qw(e, t, n, r, o, i, s, a) {
  if (n.firstCreatePass) {
    e.mergedAttrs = No(e.mergedAttrs, e.attrs);
    let h = (e.tView = zf(
      2,
      e,
      o,
      i,
      s,
      n.directiveRegistry,
      n.pipeRegistry,
      null,
      n.schemas,
      n.consts,
      null,
    ));
    n.queries !== null && (n.queries.template(n, e), (h.queries = n.queries.embeddedTView(e)));
  }
  (a && (e.flags |= a), Co(e, !1));
  let c = CN(n, t, e, r);
  (Qa() && Hf(n, t, c, e), Ao(c, t));
  let d = Dw(c, t, c, e);
  ((t[r + De] = d), Gf(t, d), tN(d, e, t));
}
function EN(e, t, n, r, o, i, s, a, c, d, h) {
  let p = n + De,
    m;
  return (
    t.firstCreatePass
      ? ((m = Fo(t, p, 4, s || null, a || null)),
        Ga() && kw(t, e, m, yt(t.consts, d), Wf),
        lv(t, m))
      : (m = t.data[p]),
    Qw(m, e, t, n, r, o, i, c),
    Do(m) && Pc(t, e, m),
    d != null && Xi(e, m, h),
    m
  );
}
function qi(e, t, n, r, o, i, s, a, c, d, h) {
  let p = n + De,
    m;
  if (t.firstCreatePass) {
    if (((m = Fo(t, p, 4, s || null, a || null)), d != null)) {
      let y = yt(t.consts, d);
      m.localNames = [];
      for (let w = 0; w < y.length; w += 2) m.localNames.push(y[w], -1);
    }
  } else m = t.data[p];
  return (Qw(m, e, t, n, r, o, i, c), d != null && Xi(e, m, h), m);
}
function Xw(e, t, n, r, o, i, s, a) {
  let c = L(),
    d = ue$1();
  return (EN(c, d, e, t, n, r, o, yt(d.consts, i), void 0, s, a), Xw);
}
var CN = IN;
function IN(e, t, n, r) {
  return (xi(!0), t[se].createComment(``));
}
var Bc = (() => {
  class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `platform` });
  }
  return e;
})();
var cp = new A(``);
var rs = new A(``);
function Jw() {
  cu((e) => {
    throw new M(-600, ``);
  });
}
var TN = 10;
var Pr = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = b(st);
    afterRenderManager = b(xc);
    zonelessEnabled = b(Li);
    rootEffectScheduler = b(ec);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = /* @__PURE__ */ new Set();
    autoDetectTestViews = /* @__PURE__ */ new Set();
    includeAllTestViews = !1;
    afterTick = new le();
    get allViews() {
      return [
        ...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(),
        ...this._views,
      ];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    internalPendingTask = b(pn);
    get isStable() {
      return this.internalPendingTask.hasPendingTasksObservable.pipe(ne((n) => !n));
    }
    constructor() {
      b(Nt, { optional: !0 });
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    _injector = b(we$1);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      return this.bootstrapImpl(n, r);
    }
    bootstrapImpl(n, r, o = Fe.NULL) {
      return this._injector.get(Be).run(() => {
        if ((J(Z.BootstrapComponentStart), !this._injector.get(ap).done)) throw new M(405, ``);
        let a = jn(n),
          c = this._injector.get(Ar),
          d = new ko(a, c);
        this.componentTypes.push(n);
        let { hostElement: h, directives: p, bindings: m } = SN(r),
          y = h || d.selector,
          w = d.create(o, [], y, c.injector, p, m),
          T = w.location.nativeElement,
          E = w.injector.get(cp, null);
        return (
          E?.registerApplication(T),
          w.onDestroy(() => {
            (this.detachView(w.hostView), Bi(this.components, w), E?.unregisterApplication(T));
          }),
          this._loadComponent(w),
          J(Z.BootstrapComponentEnd, w),
          w
        );
      });
    }
    tick() {
      (this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick());
    }
    _tick() {
      (J(Z.ChangeDetectionStart),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run(Rc.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl());
    }
    tickImpl = () => {
      if (this._runningTick) throw (J(Z.ChangeDetectionEnd), new M(101, !1));
      let n = R(null);
      try {
        ((this._runningTick = !0), this.synchronize());
      } finally {
        ((this._runningTick = !1),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          R(n),
          this.afterTick.next(),
          J(Z.ChangeDetectionEnd));
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(Nr, null, { optional: !0 }));
      let n = 0;
      for (; this.dirtyFlags !== 0 && n++ < TN;) {
        J(Z.ChangeDetectionSyncStart);
        try {
          this.synchronizeOnce();
        } finally {
          J(Z.ChangeDetectionSyncEnd);
        }
      }
    }
    synchronizeOnce() {
      this.dirtyFlags & 16 && ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush());
      let n = !1;
      if (this.dirtyFlags & 7) {
        let r = !!(this.dirtyFlags & 1);
        ((this.dirtyFlags &= -8), (this.dirtyFlags |= 8));
        for (let { _lView: o } of this.allViews) {
          if (!r && !Ni(o)) continue;
          (mw(o, r && !this.zonelessEnabled ? 0 : 1), (n = !0));
        }
        if (((this.dirtyFlags &= -5), this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23)) return;
      }
      (n || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()),
        this.dirtyFlags & 8 && ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews());
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => Ni(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      (this._views.push(r), r.attachToAppRef(this));
    }
    detachView(n) {
      let r = n;
      (Bi(this._views, r), r.detachFromAppRef());
    }
    _loadComponent(n) {
      this.attachView(n.hostView);
      try {
        this.tick();
      } catch (o) {
        this.internalErrorHandler(o);
      }
      (this.components.push(n), this._injector.get(rs, []).forEach((o) => o(n)));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          (this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy()));
        } finally {
          ((this._destroyed = !0), (this._views = []), (this._destroyListeners = []));
        }
    }
    onDestroy(n) {
      return (this._destroyListeners.push(n), () => Bi(this._destroyListeners, n));
    }
    destroy() {
      if (this._destroyed) throw new M(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function SN(e) {
  return e === void 0 || typeof e == `string` || e instanceof Element ? { hostElement: e } : e;
}
function Bi(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function eb(e, t) {
  let n = L();
  if (wt(n, $n(), t)) {
    let o = ue$1(),
      i = Tr();
    if (Lc(i, o, n, e, t)) $t(i) && lw(n, i.index);
    else {
      let a = Je(i, n);
      uw(n[se], a, null, i.value, e, t, null);
    }
  }
  return eb;
}
function Uc(e, t, n, r) {
  let o = L();
  if (wt(o, $n(), t)) {
    ue$1();
    z_(Tr(), o, e, t, n, r);
  }
  return Uc;
}
var hf = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      (this.attach(r, i), this.attach(o, s));
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function Ld(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function MN(e, t, n, r) {
  let o,
    i,
    s = 0,
    a = e.length - 1;
  if (Array.isArray(t)) {
    R(r);
    let d = t.length - 1;
    for (R(null); s <= a && s <= d;) {
      let h = e.at(s),
        p = t[s],
        m = Ld(s, h, s, p, n);
      if (m !== 0) {
        (m < 0 && e.updateValue(s, p), s++);
        continue;
      }
      let y = e.at(a),
        w = t[d],
        T = Ld(a, y, d, w, n);
      if (T !== 0) {
        (T < 0 && e.updateValue(a, w), a--, d--);
        continue;
      }
      let E = n(s, h),
        _ = n(a, y),
        V = n(s, p);
      if (Object.is(V, _)) {
        let pe = n(d, w);
        (Object.is(pe, E) ? (e.swap(s, a), e.updateValue(a, w), d--, a--) : e.move(a, s),
          e.updateValue(s, p),
          s++);
        continue;
      }
      if (((o ??= new Ic()), (i ??= Qy(e, s, a, n)), gf(e, o, s, V)))
        (e.updateValue(s, p), s++, a++);
      else if (i.has(V)) (o.set(E, e.detach(s)), a--);
      else {
        let pe = e.create(s, t[s]);
        (e.attach(s, pe), s++, a++);
      }
    }
    for (; s <= d;) (Ky(e, o, n, s, t[s]), s++);
  } else if (t != null) {
    R(r);
    let d = t[Symbol.iterator]();
    R(null);
    let h = d.next();
    for (; !h.done && s <= a;) {
      let p = e.at(s),
        m = h.value,
        y = Ld(s, p, s, m, n);
      if (y !== 0) (y < 0 && e.updateValue(s, m), s++, (h = d.next()));
      else {
        ((o ??= new Ic()), (i ??= Qy(e, s, a, n)));
        let w = n(s, m);
        if (gf(e, o, s, w)) (e.updateValue(s, m), s++, a++, (h = d.next()));
        else if (!i.has(w)) (e.attach(s, e.create(s, m)), s++, a++, (h = d.next()));
        else {
          let T = n(s, p);
          (o.set(T, e.detach(s)), a--);
        }
      }
    }
    for (; !h.done;) (Ky(e, o, n, e.length, h.value), (h = d.next()));
  }
  for (; s <= a;) e.destroy(e.detach(a--));
  o?.forEach((d) => {
    e.destroy(d);
  });
}
function gf(e, t, n, r) {
  return t !== void 0 && t.has(r) ? (e.attach(n, t.get(r)), t.delete(r), !0) : !1;
}
function Ky(e, t, n, r, o) {
  if (gf(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function Qy(e, t, n, r) {
  let o = /* @__PURE__ */ new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var Ic = class {
  kvMap = /* @__PURE__ */ new Map();
  _vMap = void 0;
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = /* @__PURE__ */ new Map());
      let o = this._vMap;
      for (; o.has(r);) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r);) ((r = o.get(r)), t(r, n));
      }
  }
};
function _N(e, t, n, r, o, i, s, a) {
  vn(`NgControlFlow`);
  let c = L(),
    d = ue$1();
  return (qi(c, d, e, t, n, r, o, yt(d.consts, i), 256, s, a), lp);
}
function lp(e, t, n, r, o, i, s, a) {
  return (vn(`NgControlFlow`), NN(e, t, n, r, o, i, s, a), lp);
}
function NN(e, t, n, r, o, i, s, a) {
  let c = L(),
    d = ue$1();
  qi(c, d, e, t, n, r, o, yt(d.consts, i), 512, s, a);
}
function AN(e, t) {
  vn(`NgControlFlow`);
  let n = L(),
    r = $n(),
    o = n[r] !== We ? n[r] : -1,
    i = o !== -1 ? Tc(n, De + o) : void 0,
    s = 0;
  if (wt(n, r, e)) {
    let a = R(null);
    try {
      if ((i !== void 0 && Cw(i, s), e !== -1)) {
        let c = De + e,
          d = Tc(n, c),
          h = wf(n[O], c),
          p = Tw(d, h, n);
        es(d, Ji(n, h, t, { dehydratedView: p }), s, Ro(h, p));
      }
    } finally {
      R(a);
    }
  } else if (i !== void 0) {
    let a = Ew(i, s);
    a !== void 0 && (a[be$1] = t);
  }
}
var mf = class {
  lContainer;
  $implicit;
  $index;
  constructor(t, n, r) {
    ((this.lContainer = t), (this.$implicit = n), (this.$index = r));
  }
  get $count() {
    return this.lContainer.length - Ee;
  }
};
function RN(e) {
  return e;
}
function xN(e, t) {
  return t;
}
var yf = class {
  hasEmptyBlock;
  trackByFn;
  liveCollection;
  constructor(t, n, r) {
    ((this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r));
  }
};
function ON(e, t, n, r, o, i, s, a, c, d, h, p, m) {
  vn(`NgControlFlow`);
  let y = L(),
    w = ue$1(),
    T = c !== void 0,
    E = L(),
    V = new yf(T, a ? s.bind(E[qe][be$1]) : s);
  ((E[De + e] = V),
    qi(y, w, e + 1, t, n, r, o, yt(w.consts, i), 256),
    T && qi(y, w, e + 2, c, d, h, p, yt(w.consts, m), 512));
}
var vf = class extends hf {
  lContainer;
  hostLView;
  templateTNode;
  operationsCounter = void 0;
  needsIndexUpdate = !1;
  constructor(t, n, r) {
    (super(), (this.lContainer = t), (this.hostLView = n), (this.templateTNode = r));
  }
  get length() {
    return this.lContainer.length - Ee;
  }
  at(t) {
    return this.getLView(t)[be$1].$implicit;
  }
  attach(t, n) {
    let r = n[vr];
    ((this.needsIndexUpdate ||= t !== this.length),
      es(this.lContainer, n, t, Ro(this.templateTNode, r)),
      PN(this.lContainer, t));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1),
      LN(this.lContainer, t),
      FN(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = gc(this.lContainer, this.templateTNode.tView.ssrId);
    return Ji(this.hostLView, this.templateTNode, new mf(this.lContainer, n, t), {
      dehydratedView: r,
    });
  }
  destroy(t) {
    Oc(t[O], t);
  }
  updateValue(t, n) {
    this.getLView(t)[be$1].$implicit = n;
  }
  reset() {
    this.needsIndexUpdate = !1;
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[be$1].$index = t;
  }
  getLView(t) {
    return jN(this.lContainer, t);
  }
};
function kN(e) {
  let t = R(null),
    n = vt();
  try {
    let r = L(),
      o = r[O],
      i = r[n],
      s = n + 1,
      a = Tc(r, s);
    if (i.liveCollection === void 0) i.liveCollection = new vf(a, r, wf(o, s));
    else i.liveCollection.reset();
    let c = i.liveCollection;
    if ((MN(c, e, i.trackByFn, t), c.updateIndexes(), i.hasEmptyBlock)) {
      let d = $n(),
        h = c.length === 0;
      if (wt(r, d, h)) {
        let p = n + 2,
          m = Tc(r, p);
        if (h) {
          let y = wf(o, p),
            w = Tw(m, y, r);
          es(m, Ji(r, y, void 0, { dehydratedView: w }), 0, Ro(y, w));
        } else (o.firstUpdatePass && h0(m), Cw(m, 0));
      }
    }
  } finally {
    R(t);
  }
}
function Tc(e, t) {
  return e[t];
}
function PN(e, t) {
  if (e.length <= Ee) return;
  let r = e[Ee + t];
  r && w_(r);
}
function LN(e, t) {
  if (e.length <= Ee) return;
  let r = e[Ee + t];
  r && v_(r);
}
function FN(e, t) {
  return $i(e, t);
}
function jN(e, t) {
  return Ew(e, t);
}
function wf(e, t) {
  return Ha(e, t);
}
function tb(e, t, n) {
  let r = L();
  if (wt(r, $n(), t)) {
    ue$1();
    U_(Tr(), r, e, t, r[se], n);
  }
  return tb;
}
function bf(e, t, n, r, o) {
  Lc(t, e, n, o ? `class` : `style`, r);
}
function Sc(e, t, n, r) {
  let o = L(),
    i = o[O],
    s = e + De,
    a = i.firstCreatePass ? Jf(s, o, 2, t, Wf, Ga(), n, r) : i.data[s];
  if ($t(a)) {
    let c = o[Tt].tracingService;
    if (c && c.componentCreate) {
      let d = i.data[a.directiveStart + a.componentOffset];
      return c.componentCreate(_w(d), () => (Xy(e, t, o, a, r), Sc));
    }
  }
  return (Xy(e, t, o, a, r), Sc);
}
function Xy(e, t, n, r, o) {
  if ((Yf(r, n, e, t, rb), Do(r))) {
    let i = n[O];
    (Pc(i, n, r), Mf(i, r, n));
  }
  o != null && Xi(n, r);
}
function up() {
  let e = ue$1(),
    n = Zf(Ae());
  return (
    e.firstCreatePass && ep(e, n),
    gd(n) && md(),
    pd(),
    n.classesWithoutHost != null && eM(n) && bf(e, n, L(), n.classesWithoutHost, !0),
    n.stylesWithoutHost != null && tM(n) && bf(e, n, L(), n.stylesWithoutHost, !1),
    up
  );
}
function Vc(e, t, n, r) {
  return (Sc(e, t, n, r), up(), Vc);
}
function dp(e, t, n, r) {
  let o = L(),
    i = o[O],
    s = e + De,
    a = i.firstCreatePass ? B0(s, i, 2, t, n, r) : i.data[s];
  return (Yf(a, o, e, t, rb), r != null && Xi(o, a), dp);
}
function fp() {
  return (gd(Zf(Ae())) && md(), pd(), fp);
}
function nb(e, t, n, r) {
  return (dp(e, t, n, r), fp(), nb);
}
var rb = (e, t, n, r, o) => (xi(!0), Vv(t[se], r, Id()));
function pp(e, t, n) {
  let r = L(),
    o = r[O],
    i = e + De,
    s = o.firstCreatePass ? Jf(i, r, 8, `ng-container`, Wf, Ga(), t, n) : o.data[i];
  if ((Yf(s, r, e, `ng-container`, BN), Do(s))) {
    let a = r[O];
    (Pc(a, r, s), Mf(a, s, r));
  }
  return (n != null && Xi(r, s), pp);
}
function hp() {
  let e = ue$1(),
    n = Zf(Ae());
  return (e.firstCreatePass && ep(e, n), hp);
}
function ob(e, t, n) {
  return (pp(e, t, n), hp(), ob);
}
var BN = (e, t, n, r, o) => (xi(!0), WM(t[se], ``));
function UN() {
  return L();
}
function ib(e, t, n) {
  let r = L();
  if (wt(r, $n(), t)) {
    ue$1();
    aw(Tr(), r, e, t, r[se], n);
  }
  return ib;
}
var os = `en-US`;
function sb(e) {
  typeof e == `string` && e.toLowerCase().replace(/_/g, `-`);
}
function Hc(e, t, n) {
  let r = L(),
    o = ue$1(),
    i = Ae();
  return (HN(o, r, r[se], i, e, t, n), Hc);
}
function ab(e, t, n) {
  let r = L(),
    o = ue$1(),
    i = Ae();
  return ((i.type & 3 || n) && xw(i, o, r, n, r[se], e, t, _o(i, r, t)), ab);
}
function HN(e, t, n, r, o, i, s) {
  let a = !0,
    c = null;
  if (((r.type & 3 || s) && ((c ??= _o(r, t, i)), xw(r, e, t, s, n, o, i, c) && (a = !1)), a)) {
    let d = r.outputs?.[o],
      h = r.hostDirectiveOutputs?.[o];
    if (h && h.length)
      for (let p = 0; p < h.length; p += 2) {
        let m = h[p],
          y = h[p + 1];
        ((c ??= _o(r, t, i)), yc(r, t, m, y, o, c));
      }
    if (d && d.length) for (let p of d) ((c ??= _o(r, t, i)), yc(r, t, p, o, o, c));
  }
}
function $N(e = 1) {
  return iy(e);
}
function zN(e, t) {
  let n = null,
    r = s_(e);
  for (let o = 0; o < t.length; o++) {
    let i = t[o];
    if (i === `*`) {
      n = o;
      continue;
    }
    if (r === null ? Zv(e, i, !0) : l_(r, i)) return o;
  }
  return n;
}
function qN(e) {
  let t = L()[qe][Ue];
  if (!t.projection) {
    let r = (t.projection = _m(e ? e.length : 1, null)),
      o = r.slice(),
      i = t.child;
    for (; i !== null;) {
      if (i.type !== 128) {
        let s = e ? zN(i, e) : 0;
        s !== null && (o[s] ? (o[s].projectionNext = i) : (r[s] = i), (o[s] = i));
      }
      i = i.next;
    }
  }
}
function GN(e, t = 0, n, r, o, i) {
  let s = L(),
    a = ue$1(),
    c = r ? e + 1 : null;
  c !== null && qi(s, a, c, r, o, i, null, n);
  let d = Fo(a, De + e, 16, null, n || null);
  (d.projection === null && (d.projection = t), wd());
  let p = !s[vr] || hd();
  s[qe][Ue].projection[d.projection] === null && c !== null
    ? WN(s, a, c)
    : p && !Nc(d) && N_(a, s, d);
}
function WN(e, t, n) {
  let r = De + n,
    o = t.data[r],
    i = e[r],
    s = gc(i, o.tView.ssrId);
  es(i, Ji(e, o, void 0, { dehydratedView: s }), 0, Ro(o, s));
}
function gp(e, t, n, r) {
  return (Hw(e, t, n, r), gp);
}
function cb(e, t, n) {
  return (Vw(e, t, n), cb);
}
function lb(e) {
  let t = L(),
    n = ue$1(),
    r = Ya();
  Ri(r + 1);
  let o = np(n, r);
  if (e.dirty && Um(t) === ((o.metadata.flags & 2) === 2)) {
    if (o.matches === null) e.reset([]);
    else {
      let i = zw(t, r);
      (e.reset(i, Ev), e.notifyOnChanges());
    }
    return !0;
  }
  return !1;
}
function ub() {
  return tp(L(), Ya());
}
function db(e, t, n, r, o) {
  return (Gw(t, Hw(e, n, r, o)), db);
}
function fb(e, t, n, r) {
  return (Gw(e, Vw(t, n, r)), fb);
}
function YN(e = 1) {
  Ri(Ya() + e);
}
function ZN(e) {
  return Bm(Km(), De + e);
}
function ic(e, t) {
  return (e << 17) | (t << 2);
}
function Rr(e) {
  return (e >> 17) & 32767;
}
function KN(e) {
  return (e & 2) == 2;
}
function QN(e, t) {
  return (e & 131071) | (t << 17);
}
function Df(e) {
  return e | 2;
}
function Po(e) {
  return (e & 131068) >> 2;
}
function Fd(e, t) {
  return (e & -131069) | (t << 2);
}
function XN(e) {
  return (e & 1) === 1;
}
function Ef(e) {
  return e | 1;
}
function JN(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = Rr(s),
    c = Po(s);
  e[r] = n;
  let d = !1,
    h;
  if (Array.isArray(n)) {
    let p = n;
    ((h = p[1]), (h === null || mo(p, h) > 0) && (d = !0));
  } else h = n;
  if (o)
    if (c !== 0) {
      let m = Rr(e[a + 1]);
      ((e[r + 1] = ic(m, a)),
        m !== 0 && (e[m + 1] = Fd(e[m + 1], r)),
        (e[a + 1] = QN(e[a + 1], r)));
    } else ((e[r + 1] = ic(a, 0)), a !== 0 && (e[a + 1] = Fd(e[a + 1], r)), (a = r));
  else ((e[r + 1] = ic(c, 0)), a === 0 ? (a = r) : (e[c + 1] = Fd(e[c + 1], r)), (c = r));
  (d && (e[r + 1] = Df(e[r + 1])),
    Jy(e, h, r, !0),
    Jy(e, h, r, !1),
    eA(t, h, e, r, i),
    (s = ic(a, c)),
    i ? (t.classBindings = s) : (t.styleBindings = s));
}
function eA(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null && typeof t == `string` && mo(i, t) >= 0 && (n[r + 1] = Ef(n[r + 1]));
}
function Jy(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? Rr(o) : Po(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i);) {
    let c = e[s],
      d = e[s + 1];
    (tA(c, t) && ((a = !0), (e[s + 1] = r ? Ef(d) : Df(d))), (s = r ? Rr(d) : Po(d)));
  }
  a && (e[n + 1] = r ? Df(o) : Ef(o));
}
function tA(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == `string`
      ? mo(e, t) >= 0
      : !1;
}
var Mt = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function nA(e) {
  return e.substring(Mt.key, Mt.keyEnd);
}
function rA(e) {
  return (oA(e), pb(e, hb(e, 0, Mt.textEnd)));
}
function pb(e, t) {
  let n = Mt.textEnd;
  return n === t ? -1 : ((t = Mt.keyEnd = iA(e, (Mt.key = t), n)), hb(e, t, n));
}
function oA(e) {
  ((Mt.key = 0), (Mt.keyEnd = 0), (Mt.value = 0), (Mt.valueEnd = 0), (Mt.textEnd = e.length));
}
function hb(e, t, n) {
  for (; t < n && e.charCodeAt(t) <= 32;) t++;
  return t;
}
function iA(e, t, n) {
  for (; t < n && e.charCodeAt(t) > 32;) t++;
  return t;
}
function gb(e, t, n) {
  return (yb(e, t, n, !1), gb);
}
function mb(e, t) {
  return (yb(e, t, null, !0), mb);
}
function sA(e) {
  cA(hA, aA, e, !0);
}
function aA(e, t) {
  for (let n = rA(t); n >= 0; n = pb(t, n)) ja(e, nA(t), !0);
}
function yb(e, t, n, r) {
  let o = L(),
    i = ue$1(),
    s = Ai(2);
  if ((i.firstUpdatePass && wb(i, e, s, r), t !== We && wt(o, s, t))) {
    let a = i.data[vt()];
    bb(i, a, o, o[se], e, (o[s + 1] = mA(t, n)), r, s);
  }
}
function cA(e, t, n, r) {
  let o = ue$1(),
    i = Ai(2);
  o.firstUpdatePass && wb(o, null, i, r);
  let s = L();
  if (n !== We && wt(s, i, n)) {
    let a = o.data[vt()];
    if (Db(a, r) && !vb(o, i)) {
      let c = r ? a.classesWithoutHost : a.stylesWithoutHost;
      (c !== null && (n = Ra(c, n || ``)), bf(o, a, s, n, r));
    } else gA(o, a, s, s[se], s[i + 1], (s[i + 1] = pA(e, t, n)), r, i);
  }
}
function vb(e, t) {
  return t >= e.expandoStartIndex;
}
function wb(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[vt()],
      s = vb(e, n);
    (Db(i, r) && t === null && !s && (t = !1), (t = lA(o, i, t, r)), JN(o, i, t, n, s, r));
  }
}
function lA(e, t, n, r) {
  let o = ty(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = jd(null, e, t, n, r)), (n = Gi(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = jd(o, e, t, n, r)), i === null)) {
        let c = uA(e, t, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = jd(null, e, t, c[1], r)), (c = Gi(c, t.attrs, r)), dA(e, t, r, c));
      } else i = fA(e, t, r);
  }
  return (i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n);
}
function uA(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (Po(r) !== 0) return e[Rr(r)];
}
function dA(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[Rr(o)] = r;
}
function fA(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = Gi(r, s, n);
  }
  return Gi(r, t.attrs, n);
}
function jd(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = Gi(r, i.hostAttrs, o)), i !== e);
  )
    a++;
  return (e !== null && (n.directiveStylingLast = a), r);
}
function Gi(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == `number`
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : [``, e]), ja(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function pA(e, t, n) {
  if (n == null || n === ``) return ze;
  let r = [],
    o = at(n);
  if (Array.isArray(o)) for (let i = 0; i < o.length; i++) e(r, o[i], !0);
  else if (o instanceof Set) for (let i of o) e(r, i, !0);
  else if (typeof o == `object`) for (let i in o) Object.hasOwn(o, i) && e(r, i, o[i]);
  else typeof o == `string` && t(r, o);
  return r;
}
function hA(e, t, n) {
  let r = String(t);
  r !== `` && !r.includes(` `) && ja(e, r, n);
}
function gA(e, t, n, r, o, i, s, a) {
  o === We && (o = ze);
  let c = 0,
    d = 0,
    h = 0 < o.length ? o[0] : null,
    p = 0 < i.length ? i[0] : null;
  for (; h !== null || p !== null;) {
    let m = c < o.length ? o[c + 1] : void 0,
      y = d < i.length ? i[d + 1] : void 0,
      w = null,
      T;
    (h === p
      ? ((c += 2), (d += 2), m !== y && ((w = p), (T = y)))
      : p === null || (h !== null && h < p)
        ? ((c += 2), (w = h))
        : ((d += 2), (w = p), (T = y)),
      w !== null && bb(e, t, n, r, w, T, s, a),
      (h = c < o.length ? o[c] : null),
      (p = d < i.length ? i[d] : null));
  }
}
function bb(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let c = e.data,
    d = c[a + 1];
  if (!Mc(XN(d) ? ev(c, t, n, o, Po(d), s) : void 0)) {
    Mc(i) || (KN(d) && (i = ev(c, null, n, o, a, s)));
    R_(r, s, cd(vt(), n), o, i);
  }
}
function ev(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0;) {
    let c = e[o],
      d = Array.isArray(c),
      h = d ? c[1] : c,
      p = h === null,
      m = n[o + 1];
    m === We && (m = p ? ze : void 0);
    let y = p ? Ba(m, r) : h === r ? m : void 0;
    if ((d && !Mc(y) && (y = Ba(c, r)), Mc(y) && ((a = y), s))) return a;
    let w = e[o + 1];
    o = s ? Rr(w) : Po(w);
  }
  if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = Ba(c, r));
  }
  return a;
}
function Mc(e) {
  return e !== void 0;
}
function mA(e, t) {
  return (
    e == null ||
      e === `` ||
      (typeof t == `string` ? (e = at(e) + t) : typeof e == `object` && (e = Di(at(e)))),
    e
  );
}
function Db(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
function yA(e, t = ``) {
  let n = L(),
    r = ue$1(),
    o = e + De,
    i = r.firstCreatePass ? Fo(r, o, 1, t, null) : r.data[o],
    s = vA(r, n, i, t);
  ((n[o] = s), Qa() && Hf(r, n, s, i), Co(i, !1));
}
var vA = (e, t, n, r) => (xi(!0), qM(t[se], r));
function wA(e, t, n, r = ``) {
  return wt(e, $n(), n) ? t + un(n) + r : We;
}
function bA(e, t, n, r, o, i = ``) {
  let a = Rw(e, Dd(), n, o);
  return (Ai(2), a ? t + un(n) + r + un(o) + i : We);
}
function DA(e, t, n, r, o, i, s, a = ``) {
  let d = w0(e, Dd(), n, o, s);
  return (Ai(3), d ? t + un(n) + r + un(o) + i + un(s) + a : We);
}
function Eb(e) {
  return (mp(``, e), Eb);
}
function mp(e, t, n) {
  let r = L(),
    o = wA(r, e, t, n);
  return (o !== We && yp(r, vt(), o), mp);
}
function Cb(e, t, n, r, o) {
  let i = L(),
    s = bA(i, e, t, n, r, o);
  return (s !== We && yp(i, vt(), s), Cb);
}
function Ib(e, t, n, r, o, i, s) {
  let a = L(),
    c = DA(a, e, t, n, r, o, i, s);
  return (c !== We && yp(a, vt(), c), Ib);
}
function yp(e, t, n) {
  let r = cd(t, e);
  GM(e[se], r, n);
}
function tv(e, t, n) {
  let r = ue$1();
  r.firstCreatePass && Tb(t, r.data, r.blueprint, zt(e), n);
}
function Tb(e, t, n, r, o) {
  if (((e = Le(e)), Array.isArray(e))) for (let i = 0; i < e.length; i++) Tb(e[i], t, n, r, o);
  else {
    let i = ue$1(),
      s = L(),
      a = Ae(),
      c = pr(e) ? e : Le(e.provide),
      d = rd(e),
      h = a.providerIndexes & 1048575,
      p = a.directiveStart,
      m = a.providerIndexes >> 20;
    if (pr(e) || !e.multi) {
      let y = new Mr(d, o, bt, null),
        w = Ud(c, t, o ? h : h + m, p);
      w === -1
        ? ($d(pc(a, s), i, c),
          Bd(i, e, t.length),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(y),
          s.push(y))
        : ((n[w] = y), (s[w] = y));
    } else {
      let y = Ud(c, t, h + m, p),
        w = Ud(c, t, h, h + m),
        T = y >= 0 && n[y],
        E = w >= 0 && n[w];
      if ((o && !E) || (!o && !T)) {
        $d(pc(a, s), i, c);
        let _ = IA(o ? CA : EA, n.length, o, r, d, e);
        (!o && E && (n[w].providerFactory = _),
          Bd(i, e, t.length, 0),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(_),
          s.push(_));
      } else {
        let _ = Sb(n[o ? w : y], d, !o && r);
        Bd(i, e, y > -1 ? y : w, _);
      }
      !o && r && E && n[w].componentProviders++;
    }
  }
}
function Bd(e, t, n, r) {
  let o = pr(t),
    i = km(t);
  if (o || i) {
    let c = (i ? Le(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
      let d = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let h = d.indexOf(n);
        h === -1 ? d.push(n, [r, c]) : d[h + 1].push(r, c);
      } else d.push(n, c);
    }
  }
}
function Sb(e, t, n) {
  return (n && e.componentProviders++, e.multi.push(t) - 1);
}
function Ud(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function EA(e, t, n, r, o) {
  return Cf(this.multi, []);
}
function CA(e, t, n, r, o) {
  let i = this.multi,
    s;
  if (this.providerFactory) {
    let a = this.providerFactory.componentProviders,
      c = Ui(r, r[O], this.providerFactory.index, o);
    ((s = c.slice(0, a)), Cf(i, s));
    for (let d = a; d < c.length; d++) s.push(c[d]);
  } else ((s = []), Cf(i, s));
  return s;
}
function Cf(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function IA(e, t, n, r, o, i) {
  let s = new Mr(e, n, bt, null);
  return ((s.multi = []), (s.index = t), (s.componentProviders = 0), Sb(s, o, r && !n), s);
}
function TA(e, t) {
  return (n) => {
    ((n.providersResolver = (r, o) => tv(r, o ? o(e) : e, !1)),
      t && (n.viewProvidersResolver = (r, o) => tv(r, o ? o(t) : t, !0)));
  };
}
function SA(e, t) {
  return Fc(e, t);
}
var Mb = (() => {
  class e {
    applicationErrorHandler = b(st);
    appRef = b(Pr);
    taskService = b(pn);
    ngZone = b(Be);
    zonelessEnabled = b(Li);
    tracing = b(Nt, { optional: !0 });
    zoneIsDefined = typeof Zone < `u` && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new he();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(wi) : null;
    scheduleInRootZone =
      !this.zonelessEnabled && this.zoneIsDefined && (b(Nd, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      (this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          let n = this.taskService.add();
          if (
            !this.runningTick &&
            (this.cleanup(), !this.zonelessEnabled || this.appRef.includeAllTestViews)
          ) {
            this.taskService.remove(n);
            return;
          }
          (this.switchToMicrotaskScheduler(), this.taskService.remove(n));
        }),
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ));
    }
    switchToMicrotaskScheduler() {
      this.ngZone.runOutsideAngular(() => {
        let n = this.taskService.add();
        ((this.useMicrotaskScheduler = !0),
          queueMicrotask(() => {
            ((this.useMicrotaskScheduler = !1), this.taskService.remove(n));
          }));
      });
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      switch (n) {
        case 0:
        case 2:
          this.appRef.dirtyFlags |= 2;
          break;
        case 3:
        case 4:
        case 5:
        case 1:
          this.appRef.dirtyFlags |= 4;
          break;
        case 6:
          this.appRef.dirtyFlags |= 2;
          break;
        case 12:
          this.appRef.dirtyFlags |= 16;
          break;
        case 13:
          this.appRef.dirtyFlags |= 2;
          break;
        case 11:
          break;
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick())
      )
        return;
      let r = this.useMicrotaskScheduler ? dy : Sd;
      ((this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() => r(() => this.tick())))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              r(() => this.tick()),
            )));
    }
    shouldScheduleTick() {
      return !(
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(wi + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            ((this.runningTick = !0), this.appRef._tick());
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (r) {
        this.applicationErrorHandler(r);
      } finally {
        (this.taskService.remove(n), this.cleanup());
      }
    }
    ngOnDestroy() {
      (this.subscriptions.unsubscribe(), this.cleanup());
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        ((this.pendingRenderTaskId = null), this.taskService.remove(n));
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function _b() {
  return [
    { provide: Bt, useExisting: Mb },
    { provide: Be, useClass: bi },
    { provide: Li, useValue: !0 },
  ];
}
var vp = (() => {
  class e {
    compileModuleSync(n) {
      return new Cc(n);
    }
    compileModuleAsync(n) {
      return Promise.resolve(this.compileModuleSync(n));
    }
    clearCache() {}
    clearCacheFor(n) {}
    getModuleId(n) {}
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function MA() {
  return (typeof $localize < `u` && $localize.locale) || os;
}
var $c = new A(``, { factory: () => b($c, { optional: !0, skipSelf: !0 }) || MA() });
var zc = class {
  destroyed = !1;
  listeners = null;
  errorHandler = b(pt, { optional: !0 });
  isEmitting = !1;
  hasNullListeners = !1;
  destroyRef = b(je);
  constructor() {
    this.destroyRef.onDestroy(() => {
      ((this.destroyed = !0), (this.listeners = null));
    });
  }
  subscribe(t) {
    if (this.destroyed) throw new M(953, !1);
    return (
      (this.listeners ??= []).push(t),
      {
        unsubscribe: () => {
          let n = this.listeners ? this.listeners.indexOf(t) : -1;
          n > -1 &&
            (this.isEmitting
              ? ((this.hasNullListeners = !0), (this.listeners[n] = null))
              : this.listeners.splice(n, 1));
        },
      }
    );
  }
  emit(t) {
    if (this.destroyed) {
      console.warn(Ut(953, !1));
      return;
    }
    if (this.listeners === null) return;
    this.isEmitting = !0;
    let n = R(null);
    try {
      for (let r of this.listeners)
        try {
          r !== null && r(t);
        } catch (o) {
          this.errorHandler?.handleError(o);
        }
    } finally {
      (this.hasNullListeners &&
        ((this.hasNullListeners = !1), this.listeners && _A(this.listeners)),
        R(n),
        (this.isEmitting = !1));
    }
  }
};
function _A(e) {
  let t = e.length - 1;
  for (; t > -1;) (e[t] === null && e.splice(t, 1), t--);
}
function wp(e, t) {
  return ii(e, t?.equal);
}
function fe$1(e) {
  return kg(e);
}
(class e extends Error {
  _brand;
  constructor(t) {
    super(t);
  }
  static IDLE = new e(`IDLE`);
  static LOADING = new e(`LOADING`);
});
var NA = (e) => e;
function bp(e, t) {
  if (typeof e == `function`) return Ab(pu(e, NA, t?.equal), void 0, t?.set);
  else return Ab(pu(e.source, e.computation, e.equal), void 0, e.set);
}
function Ab(e, t, n) {
  let r = e[ye$1],
    o = e;
  if (n !== void 0) {
    let i = (s) => hu(r, s);
    ((o.set = (s) => n(s, i)), (o.update = (s) => n(s(fe$1(e)), i)));
  } else ((o.set = (i) => hu(r, i)), (o.update = (i) => Og(r, i)));
  return ((o.asReadonly = Xa.bind(e)), o);
}
function Bb(e, t) {
  let n = Object.create(iv);
  ((n.value = e), (n.transformFn = t?.transform));
  function r() {
    if ((nn(n), n.value === _c)) throw new M(-950, null);
    return n.value;
  }
  return ((r[ye$1] = n), r);
}
var Gc = class {
  attributeName;
  constructor(t) {
    this.attributeName = t;
  }
  __NG_ELEMENT_ID__ = () => Yi(this.attributeName);
  toString() {
    return `HostAttributeToken ${this.attributeName}`;
  }
};
function _p(e) {
  return WA(e) ? e.default : e;
}
function WA(e) {
  return e && typeof e == `object` && `default` in e;
}
function n3(e) {
  return new zc();
}
function Rb(e, t) {
  return Bb(e, t);
}
function YA(e) {
  return Bb(_c, e);
}
var Yc = ((Rb.required = YA), Rb);
function xb(e, t) {
  return rp(t);
}
function ZA(e, t) {
  return op(t);
}
var r3 = ((xb.required = ZA), xb);
function Ob(e, t) {
  return rp(t);
}
function KA(e, t) {
  return op(t);
}
var o3 = ((Ob.required = KA), Ob);
var Ep = class {
  supports(t) {
    return Xf(t);
  }
  create(t) {
    return new Cp(t);
  }
};
var XA = (e, t) => t;
var Cp = class {
  length = 0;
  collection;
  _linkedRecords = null;
  _unlinkedRecords = null;
  _previousItHead = null;
  _itHead = null;
  _itTail = null;
  _additionsHead = null;
  _additionsTail = null;
  _movesHead = null;
  _movesTail = null;
  _removalsHead = null;
  _removalsTail = null;
  _identityChangesHead = null;
  _identityChangesTail = null;
  _trackByFn;
  constructor(t) {
    this._trackByFn = t || XA;
  }
  forEachItem(t) {
    let n;
    for (n = this._itHead; n !== null; n = n._next) t(n);
  }
  forEachOperation(t) {
    let n = this._itHead,
      r = this._removalsHead,
      o = 0,
      i = null;
    for (; n || r;) {
      let s = !r || (n && n.currentIndex < kb(r, o, i)) ? n : r,
        a = kb(s, o, i),
        c = s.currentIndex;
      if (s === r) (o--, (r = r._nextRemoved));
      else if (((n = n._next), s.previousIndex == null)) o++;
      else {
        i || (i = []);
        let d = a - o,
          h = c - o;
        if (d != h) {
          for (let m = 0; m < d; m++) {
            let y = m < i.length ? i[m] : (i[m] = 0),
              w = y + m;
            h <= w && w < d && (i[m] = y + 1);
          }
          let p = s.previousIndex;
          i[p] = h - d;
        }
      }
      a !== c && t(s, a, c);
    }
  }
  forEachPreviousItem(t) {
    let n;
    for (n = this._previousItHead; n !== null; n = n._nextPrevious) t(n);
  }
  forEachAddedItem(t) {
    let n;
    for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n);
  }
  forEachMovedItem(t) {
    let n;
    for (n = this._movesHead; n !== null; n = n._nextMoved) t(n);
  }
  forEachRemovedItem(t) {
    let n;
    for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n);
  }
  forEachIdentityChange(t) {
    let n;
    for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange) t(n);
  }
  diff(t) {
    if (((t ??= []), !Xf(t))) throw new M(900, !1);
    return this.check(t) ? this : null;
  }
  onDestroy() {}
  check(t) {
    this._reset();
    let n = this._itHead,
      r = !1,
      o,
      i,
      s;
    if (Array.isArray(t)) {
      this.length = t.length;
      for (let a = 0; a < this.length; a++)
        ((i = t[a]),
          (s = this._trackByFn(a, i)),
          n === null || !Object.is(n.trackById, s)
            ? ((n = this._mismatch(n, i, s, a)), (r = !0))
            : (r && (n = this._verifyReinsertion(n, i, s, a)),
              Object.is(n.item, i) || this._addIdentityChange(n, i)),
          (n = n._next));
    } else
      ((o = 0),
        Nw(t, (a) => {
          ((s = this._trackByFn(o, a)),
            n === null || !Object.is(n.trackById, s)
              ? ((n = this._mismatch(n, a, s, o)), (r = !0))
              : (r && (n = this._verifyReinsertion(n, a, s, o)),
                Object.is(n.item, a) || this._addIdentityChange(n, a)),
            (n = n._next),
            o++);
        }),
        (this.length = o));
    return (this._truncate(n), (this.collection = t), this.isDirty);
  }
  get isDirty() {
    return (
      this._additionsHead !== null ||
      this._movesHead !== null ||
      this._removalsHead !== null ||
      this._identityChangesHead !== null
    );
  }
  _reset() {
    if (this.isDirty) {
      let t;
      for (t = this._previousItHead = this._itHead; t !== null; t = t._next)
        t._nextPrevious = t._next;
      for (t = this._additionsHead; t !== null; t = t._nextAdded) t.previousIndex = t.currentIndex;
      for (
        this._additionsHead = this._additionsTail = null, t = this._movesHead;
        t !== null;
        t = t._nextMoved
      )
        t.previousIndex = t.currentIndex;
      ((this._movesHead = this._movesTail = null),
        (this._removalsHead = this._removalsTail = null),
        (this._identityChangesHead = this._identityChangesTail = null));
    }
  }
  _mismatch(t, n, r, o) {
    let i;
    return (
      t === null ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
      (t = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(r, null)),
      t !== null
        ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, i, o))
        : ((t = this._linkedRecords === null ? null : this._linkedRecords.get(r, o)),
          t !== null
            ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, i, o))
            : (t = this._addAfter(new Ip(n, r), i, o))),
      t
    );
  }
  _verifyReinsertion(t, n, r, o) {
    let i = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(r, null);
    return (
      i !== null
        ? (t = this._reinsertAfter(i, t._prev, o))
        : t.currentIndex != o && ((t.currentIndex = o), this._addToMoves(t, o)),
      t
    );
  }
  _truncate(t) {
    for (; t !== null;) {
      let n = t._next;
      (this._addToRemovals(this._unlink(t)), (t = n));
    }
    (this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
      this._additionsTail !== null && (this._additionsTail._nextAdded = null),
      this._movesTail !== null && (this._movesTail._nextMoved = null),
      this._itTail !== null && (this._itTail._next = null),
      this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
      this._identityChangesTail !== null && (this._identityChangesTail._nextIdentityChange = null));
  }
  _reinsertAfter(t, n, r) {
    this._unlinkedRecords !== null && this._unlinkedRecords.remove(t);
    let o = t._prevRemoved,
      i = t._nextRemoved;
    return (
      o === null ? (this._removalsHead = i) : (o._nextRemoved = i),
      i === null ? (this._removalsTail = o) : (i._prevRemoved = o),
      this._insertAfter(t, n, r),
      this._addToMoves(t, r),
      t
    );
  }
  _moveAfter(t, n, r) {
    return (this._unlink(t), this._insertAfter(t, n, r), this._addToMoves(t, r), t);
  }
  _addAfter(t, n, r) {
    return (
      this._insertAfter(t, n, r),
      this._additionsTail === null
        ? (this._additionsTail = this._additionsHead = t)
        : (this._additionsTail = this._additionsTail._nextAdded = t),
      t
    );
  }
  _insertAfter(t, n, r) {
    let o = n === null ? this._itHead : n._next;
    return (
      (t._next = o),
      (t._prev = n),
      o === null ? (this._itTail = t) : (o._prev = t),
      n === null ? (this._itHead = t) : (n._next = t),
      this._linkedRecords === null && (this._linkedRecords = new Wc()),
      this._linkedRecords.put(t),
      (t.currentIndex = r),
      t
    );
  }
  _remove(t) {
    return this._addToRemovals(this._unlink(t));
  }
  _unlink(t) {
    this._linkedRecords !== null && this._linkedRecords.remove(t);
    let n = t._prev,
      r = t._next;
    return (
      n === null ? (this._itHead = r) : (n._next = r),
      r === null ? (this._itTail = n) : (r._prev = n),
      t
    );
  }
  _addToMoves(t, n) {
    return (
      t.previousIndex === n ||
        (this._movesTail === null
          ? (this._movesTail = this._movesHead = t)
          : (this._movesTail = this._movesTail._nextMoved = t)),
      t
    );
  }
  _addToRemovals(t) {
    return (
      this._unlinkedRecords === null && (this._unlinkedRecords = new Wc()),
      this._unlinkedRecords.put(t),
      (t.currentIndex = null),
      (t._nextRemoved = null),
      this._removalsTail === null
        ? ((this._removalsTail = this._removalsHead = t), (t._prevRemoved = null))
        : ((t._prevRemoved = this._removalsTail),
          (this._removalsTail = this._removalsTail._nextRemoved = t)),
      t
    );
  }
  _addIdentityChange(t, n) {
    return (
      (t.item = n),
      this._identityChangesTail === null
        ? (this._identityChangesTail = this._identityChangesHead = t)
        : (this._identityChangesTail = this._identityChangesTail._nextIdentityChange = t),
      t
    );
  }
};
var Ip = class {
  item;
  trackById;
  currentIndex = null;
  previousIndex = null;
  _nextPrevious = null;
  _prev = null;
  _next = null;
  _prevDup = null;
  _nextDup = null;
  _prevRemoved = null;
  _nextRemoved = null;
  _nextAdded = null;
  _nextMoved = null;
  _nextIdentityChange = null;
  constructor(t, n) {
    ((this.item = t), (this.trackById = n));
  }
};
var Tp = class {
  _head = null;
  _tail = null;
  add(t) {
    this._head === null
      ? ((this._head = this._tail = t), (t._nextDup = null), (t._prevDup = null))
      : ((this._tail._nextDup = t),
        (t._prevDup = this._tail),
        (t._nextDup = null),
        (this._tail = t));
  }
  get(t, n) {
    let r;
    for (r = this._head; r !== null; r = r._nextDup)
      if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, t)) return r;
    return null;
  }
  remove(t) {
    let n = t._prevDup,
      r = t._nextDup;
    return (
      n === null ? (this._head = r) : (n._nextDup = r),
      r === null ? (this._tail = n) : (r._prevDup = n),
      this._head === null
    );
  }
};
var Wc = class {
  map = /* @__PURE__ */ new Map();
  put(t) {
    let n = t.trackById,
      r = this.map.get(n);
    (r || ((r = new Tp()), this.map.set(n, r)), r.add(t));
  }
  get(t, n) {
    let r = t,
      o = this.map.get(r);
    return o ? o.get(t, n) : null;
  }
  remove(t) {
    let n = t.trackById;
    return (this.map.get(n).remove(t) && this.map.delete(n), t);
  }
  get isEmpty() {
    return this.map.size === 0;
  }
  clear() {
    this.map.clear();
  }
};
function kb(e, t, n) {
  let r = e.previousIndex;
  if (r === null) return r;
  let o = 0;
  return (n && r < n.length && (o = n[r]), r + t + o);
}
function Pb() {
  return new Ub([new Ep()]);
}
var Ub = (() => {
  class e {
    factories;
    static ɵprov = k$1({ token: e, providedIn: `root`, factory: Pb });
    constructor(n) {
      this.factories = n;
    }
    static create(n, r) {
      if (r != null) {
        let o = r.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: () => {
          let r = b(e, { optional: !0, skipSelf: !0 });
          return e.create(n, r || Pb());
        },
      };
    }
    find(n) {
      let r = this.factories.find((o) => o.supports(n));
      if (r != null) return r;
      throw new M(901, !1);
    }
  }
  return e;
})();
var Zc = (() => {
  class e {
    static __NG_ELEMENT_ID__ = JA;
  }
  return e;
})();
function JA(e) {
  return eR(Ae(), L(), (e & 16) === 16);
}
function eR(e, t, n) {
  if ($t(e) && !n) {
    let r = mt(e.index, t);
    return new qn(r, r);
  } else if (e.type & 175) {
    let r = t[qe];
    return new qn(r, t);
  }
  return null;
}
var Sp = new A(``);
var tR = new A(``);
function is(e) {
  return !e.moduleRef;
}
function nR(e) {
  let t = is(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(Be);
  return n.run(() => {
    is(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(st),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({ next: r });
      }),
      is(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(Sp);
      (s.add(i),
        t.onDestroy(() => {
          (o.unsubscribe(), s.delete(i));
        }));
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(Sp);
      (s.add(i),
        e.moduleRef.onDestroy(() => {
          (Bi(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i));
        }));
    }
    return oR(r, n, () => {
      let i = t.get(pn),
        s = i.add(),
        a = t.get(ap);
      return (
        a.runInitializers(),
        a.donePromise
          .then(() => {
            if ((sb(t.get($c, os) || os), !t.get(tR, !0)))
              return is(e) ? t.get(Pr) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
            if (is(e)) {
              let h = t.get(Pr);
              return (e.rootComponent !== void 0 && h.bootstrap(e.rootComponent), h);
            } else return (rR?.(e.moduleRef, e.allPlatformModules), e.moduleRef);
          })
          .finally(() => {
            i.remove(s);
          })
      );
    });
  });
}
var rR;
function oR(e, t, n) {
  try {
    let r = n();
    return jo(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e(r)), r);
  }
}
var qc = null;
function iR(e = [], t) {
  return Fe.create({
    name: t,
    providers: [
      { provide: Si, useValue: `platform` },
      { provide: Sp, useValue: /* @__PURE__ */ new Set([() => (qc = null)]) },
      ...e,
    ],
  });
}
function sR(e = []) {
  if (qc) return qc;
  let t = iR(e);
  return ((qc = t), Jw(), aR(t), t);
}
function aR(e) {
  let t = e.get(Ja, null);
  Ne(e, () => {
    t?.forEach((n) => n());
  });
}
function Vb(e) {
  let { rootComponent: t, appProviders: n, platformProviders: r, platformRef: o } = e;
  J(Z.BootstrapApplicationStart);
  try {
    let i = o?.injector ?? sR(r);
    return nR({
      r3Injector: new zi({
        providers: [_b(), gy, ...(n || [])],
        parent: i,
        debugName: ``,
        runEnvironmentInitializers: !1,
      }).injector,
      platformInjector: i,
      rootComponent: t,
    });
  } catch (i) {
    return Promise.reject(i);
  } finally {
    J(Z.BootstrapApplicationEnd);
  }
}
function Kc(e) {
  return typeof e == `boolean` ? e : e != null && e !== `false`;
}
function s3(e, t = NaN) {
  return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t;
}
var Dp = Symbol(`NOT_SET`);
var Hb = /* @__PURE__ */ new Set();
var cR = Y(C({}, no), {
  kind: `afterRenderEffectPhase`,
  consumerIsAlwaysLive: !0,
  consumerAllowSignalWrites: !0,
  value: Dp,
  cleanup: null,
  consumerMarkedDirty() {
    if (this.sequence.impl.executing) {
      if (this.sequence.lastPhase === null || this.sequence.lastPhase < this.phase) return;
      this.sequence.erroredOrDestroyed = !0;
    }
    this.sequence.scheduler.notify(7);
  },
  phaseFn(e) {
    if (((this.sequence.lastPhase = this.phase), !this.dirty)) return this.signal;
    if (((this.dirty = !1), this.value !== Dp && !eo(this))) return this.signal;
    try {
      for (let o of this.cleanup ?? Hb) o();
    } finally {
      this.cleanup?.clear();
    }
    let t = [];
    (e !== void 0 && t.push(e), t.push(this.registerCleanupFn));
    let n = rn(this),
      r;
    try {
      r = this.userFn.apply(null, t);
    } finally {
      Rn(this, n);
    }
    return (
      (this.value === Dp || !this.equal(this.value, r)) && ((this.value = r), this.version++),
      this.signal
    );
  },
});
var Mp = class extends Vi {
  scheduler;
  lastPhase = null;
  nodes = [void 0, void 0, void 0, void 0];
  onDestroyFns = null;
  constructor(t, n, r, o, i, s = null, a) {
    (super(t, [void 0, void 0, void 0, void 0], r, !1, i.get(je), s), (this.scheduler = o));
    for (let c of jf) {
      let d = n[c];
      if (d === void 0) continue;
      let h = Object.create(cR);
      ((h.sequence = this),
        (h.phase = c),
        (h.userFn = d),
        (h.dirty = !0),
        (h.signal = () => (nn(h), h.value)),
        (h.signal[ye$1] = h),
        (h.registerCleanupFn = (p) => (h.cleanup ??= /* @__PURE__ */ new Set()).add(p)),
        (this.nodes[c] = h),
        (this.hooks[c] = (p) => h.phaseFn(p)));
    }
  }
  afterRun() {
    (super.afterRun(), (this.lastPhase = null));
  }
  destroy() {
    if (this.onDestroyFns !== null) for (let t of this.onDestroyFns) t();
    super.destroy();
    for (let t of this.nodes)
      if (t)
        try {
          for (let n of t.cleanup ?? Hb) n();
        } finally {
          xn(t);
        }
  }
};
function a3(e, t) {
  let n = t?.injector ?? b(Fe),
    r = n.get(Bt),
    o = n.get(xc),
    i = n.get(Nt, null, { optional: !0 });
  o.impl ??= n.get(Bf);
  let s = e;
  typeof s == `function` && (s = { mixedReadWrite: e });
  let a = n.get(Io, null, { optional: !0 }),
    c = new Mp(
      o.impl,
      [s.earlyRead, s.write, s.mixedReadWrite, s.read],
      a?.view,
      r,
      n,
      i?.snapshot(null),
      void 0,
    );
  return (o.impl.register(c), c);
}
function c3(e, t) {
  let n = jn(e),
    r = t.elementInjector || yo(),
    i = new ko(n).create(
      r,
      t.projectableNodes,
      t.hostElement,
      t.environmentInjector,
      t.directives,
      t.bindings,
    );
  return (t.onError && (i.hostView._lView[bo] = t.onError), i);
}
var $b = null;
function bn() {
  return $b;
}
function Np(e) {
  $b ??= e;
}
var ss = class {};
var Dn = (() => {
  class e {
    historyGo(n) {
      throw new Error(``);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = k$1({ token: e, factory: () => b(zb), providedIn: `platform` });
  }
  return e;
})();
var zb = (() => {
  class e extends Dn {
    _location;
    _history;
    _doc = b(me);
    constructor() {
      (super(), (this._location = window.location), (this._history = window.history));
    }
    getBaseHrefFromDOM() {
      return bn().getBaseHref(this._doc);
    }
    onPopState(n) {
      let r = bn().getGlobalEventTarget(this._doc, `window`);
      return (r.addEventListener(`popstate`, n, !1), () => r.removeEventListener(`popstate`, n));
    }
    onHashChange(n) {
      let r = bn().getGlobalEventTarget(this._doc, `window`);
      return (
        r.addEventListener(`hashchange`, n, !1),
        () => r.removeEventListener(`hashchange`, n)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(n) {
      this._location.pathname = n;
    }
    pushState(n, r, o) {
      this._history.pushState(n, r, o);
    }
    replaceState(n, r, o) {
      this._history.replaceState(n, r, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(n = 0) {
      this._history.go(n);
    }
    getState() {
      return this._history.state;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = k$1({ token: e, factory: () => new e(), providedIn: `platform` });
  }
  return e;
})();
function Qc(e, t) {
  return e
    ? t
      ? e.endsWith(`/`)
        ? t.startsWith(`/`)
          ? e + t.slice(1)
          : e + t
        : t.startsWith(`/`)
          ? e + t
          : `${e}/${t}`
      : e
    : t;
}
function qb(e) {
  let t = e.search(/#|\?|$/);
  return e[t - 1] === `/` ? e.slice(0, t - 1) + e.slice(t) : e;
}
function Rt(e) {
  return e && e[0] !== `?` ? `?${e}` : e;
}
var Wt = (() => {
  class e {
    historyGo(n) {
      throw new Error(``);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = k$1({ token: e, factory: () => b(Wb), providedIn: `root` });
  }
  return e;
})();
var Ap = new A(``);
var Wb = (() => {
  class e extends Wt {
    _platformLocation;
    _baseHref;
    _removeListenerFns = [];
    constructor(n, r) {
      (super(),
        (this._platformLocation = n),
        (this._baseHref =
          r ?? this._platformLocation.getBaseHrefFromDOM() ?? b(me).location?.origin ?? ``));
    }
    ngOnDestroy() {
      for (; this._removeListenerFns.length;) this._removeListenerFns.pop()();
    }
    onPopState(n) {
      this._removeListenerFns.push(
        this._platformLocation.onPopState(n),
        this._platformLocation.onHashChange(n),
      );
    }
    getBaseHref() {
      return this._baseHref;
    }
    prepareExternalUrl(n) {
      return Qc(this._baseHref, n);
    }
    path(n = !1) {
      let r = this._platformLocation.pathname + Rt(this._platformLocation.search),
        o = this._platformLocation.hash;
      return o && n ? `${r}${o}` : r;
    }
    pushState(n, r, o, i) {
      let s = this.prepareExternalUrl(o + Rt(i));
      this._platformLocation.pushState(n, r, s);
    }
    replaceState(n, r, o, i) {
      let s = this.prepareExternalUrl(o + Rt(i));
      this._platformLocation.replaceState(n, r, s);
    }
    forward() {
      this._platformLocation.forward();
    }
    back() {
      this._platformLocation.back();
    }
    getState() {
      return this._platformLocation.getState();
    }
    historyGo(n = 0) {
      this._platformLocation.historyGo?.(n);
    }
    static ɵfac = function (r) {
      return new (r || e)(N(Dn), N(Ap, 8));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
  }
  return e;
})();
var Lr = (() => {
  class e {
    _subject = new le();
    _basePath;
    _locationStrategy;
    _urlChangeListeners = [];
    _urlChangeSubscription = null;
    constructor(n) {
      this._locationStrategy = n;
      let r = this._locationStrategy.getBaseHref();
      ((this._basePath = dR(qb(Gb(r)))),
        this._locationStrategy.onPopState((o) => {
          let i = { url: this.path(!0), pop: !0, state: o.state, type: o.type };
          (o.hasUAVisualTransition && (i.hasUAVisualTransition = !0), this._subject.next(i));
        }));
    }
    ngOnDestroy() {
      (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeListeners = []));
    }
    path(n = !1) {
      return this.normalize(this._locationStrategy.path(n));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(n, r = ``) {
      return this.path() == this.normalize(n + Rt(r));
    }
    normalize(n) {
      return e.stripTrailingSlash(uR(this._basePath, Gb(n)));
    }
    prepareExternalUrl(n) {
      return (n && n[0] !== `/` && (n = `/` + n), this._locationStrategy.prepareExternalUrl(n));
    }
    go(n, r = ``, o = null) {
      (this._locationStrategy.pushState(o, ``, n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Rt(r)), o));
    }
    replaceState(n, r = ``, o = null) {
      (this._locationStrategy.replaceState(o, ``, n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Rt(r)), o));
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(n = 0) {
      this._locationStrategy.historyGo?.(n);
    }
    onUrlChange(n) {
      return (
        this._urlChangeListeners.push(n),
        (this._urlChangeSubscription ??= this.subscribe((r) => {
          this._notifyUrlChangeListeners(r.url, r.state);
        })),
        () => {
          let r = this._urlChangeListeners.indexOf(n);
          (this._urlChangeListeners.splice(r, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeSubscription = null)));
        }
      );
    }
    _notifyUrlChangeListeners(n = ``, r) {
      this._urlChangeListeners.forEach((o) => o(n, r));
    }
    subscribe(n, r, o) {
      return this._subject.subscribe({ next: n, error: r ?? void 0, complete: o ?? void 0 });
    }
    static normalizeQueryParams = Rt;
    static joinWithSlash = Qc;
    static stripTrailingSlash = qb;
    static ɵfac = function (r) {
      return new (r || e)(N(Wt));
    };
    static ɵprov = k$1({ token: e, factory: () => lR(), providedIn: `root` });
  }
  return e;
})();
function lR() {
  return new Lr(N(Wt));
}
function uR(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let n = t.substring(e.length);
  return n === `` || [`/`, `;`, `?`, `#`].includes(n[0]) ? n : t;
}
function Gb(e) {
  return e.replace(/\/index\.html$/, ``);
}
function dR(e) {
  if (/* @__PURE__ */ new RegExp(`^(https?:)?//`).test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/);
    return n;
  }
  return e;
}
var Rp = (() => {
  class e extends Wt {
    _platformLocation;
    _baseHref = ``;
    _removeListenerFns = [];
    constructor(n, r) {
      (super(), (this._platformLocation = n), r != null && (this._baseHref = r));
    }
    ngOnDestroy() {
      for (; this._removeListenerFns.length;) this._removeListenerFns.pop()();
    }
    onPopState(n) {
      this._removeListenerFns.push(
        this._platformLocation.onPopState(n),
        this._platformLocation.onHashChange(n),
      );
    }
    getBaseHref() {
      return this._baseHref;
    }
    path(n = !1) {
      let r = this._platformLocation.hash ?? `#`;
      return r.length > 0 ? r.substring(1) : r;
    }
    prepareExternalUrl(n) {
      let r = Qc(this._baseHref, n);
      return r.length > 0 ? `#` + r : r;
    }
    pushState(n, r, o, i) {
      let s = this.prepareExternalUrl(o + Rt(i)) || this._platformLocation.pathname;
      this._platformLocation.pushState(n, r, s);
    }
    replaceState(n, r, o, i) {
      let s = this.prepareExternalUrl(o + Rt(i)) || this._platformLocation.pathname;
      this._platformLocation.replaceState(n, r, s);
    }
    forward() {
      this._platformLocation.forward();
    }
    back() {
      this._platformLocation.back();
    }
    getState() {
      return this._platformLocation.getState();
    }
    historyGo(n = 0) {
      this._platformLocation.historyGo?.(n);
    }
    static ɵfac = function (r) {
      return new (r || e)(N(Dn), N(Ap, 8));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var fR = (() => {
  class e {
    _viewContainerRef;
    _viewRef = null;
    ngTemplateOutletContext = null;
    ngTemplateOutlet = null;
    ngTemplateOutletInjector = null;
    injector = b(Fe);
    constructor(n) {
      this._viewContainerRef = n;
    }
    ngOnChanges(n) {
      if (this._shouldRecreateView(n)) {
        let r = this._viewContainerRef;
        if ((this._viewRef && r.remove(r.indexOf(this._viewRef)), !this.ngTemplateOutlet)) {
          this._viewRef = null;
          return;
        }
        let o = this._createContextForwardProxy();
        this._viewRef = r.createEmbeddedView(this.ngTemplateOutlet, o, {
          injector: this._getInjector(),
        });
      }
    }
    _getInjector() {
      return this.ngTemplateOutletInjector === `outlet`
        ? this.injector
        : (this.ngTemplateOutletInjector ?? void 0);
    }
    _shouldRecreateView(n) {
      return !!n.ngTemplateOutlet || !!n.ngTemplateOutletInjector;
    }
    _createContextForwardProxy() {
      return new Proxy(
        {},
        {
          set: (n, r, o) =>
            this.ngTemplateOutletContext ? Reflect.set(this.ngTemplateOutletContext, r, o) : !1,
          get: (n, r, o) => {
            if (this.ngTemplateOutletContext)
              return Reflect.get(this.ngTemplateOutletContext, r, o);
          },
        },
      );
    }
    static ɵfac = function (r) {
      return new (r || e)(bt(Wn));
    };
    static ɵdir = kr({
      type: e,
      selectors: [[``, `ngTemplateOutlet`, ``]],
      inputs: {
        ngTemplateOutletContext: `ngTemplateOutletContext`,
        ngTemplateOutlet: `ngTemplateOutlet`,
        ngTemplateOutletInjector: `ngTemplateOutletInjector`,
      },
      features: [xr],
    });
  }
  return e;
})();
function as(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(`;`)) {
    let r = n.indexOf(`=`),
      [o, i] = r == -1 ? [n, ``] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() !== t) continue;
    let s = i;
    try {
      s = decodeURIComponent(i);
    } catch {}
    return (s.length > 1 && s[0] === `"` && s[s.length - 1] === `"` && (s = s.slice(1, -1)), s);
  }
  return null;
}
var xp = `browser`;
function Gq(e) {
  return e === xp;
}
var cs = class {
  _doc;
  constructor(t) {
    this._doc = t;
  }
  manager;
};
var Xc = (() => {
  class e extends cs {
    constructor(n) {
      super(n);
    }
    supports(n) {
      return !0;
    }
    addEventListener(n, r, o, i) {
      return (n.addEventListener(r, o, i), () => this.removeEventListener(n, r, o, i));
    }
    removeEventListener(n, r, o, i) {
      return n.removeEventListener(r, o, i);
    }
    static ɵfac = function (r) {
      return new (r || e)(N(me));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var tl = new A(``);
var Lp = (() => {
  class e {
    _zone;
    _plugins;
    _eventNameToPlugin = /* @__PURE__ */ new Map();
    constructor(n, r) {
      ((this._zone = r),
        n.forEach((s) => {
          s.manager = this;
        }));
      let o = n.filter((s) => !(s instanceof Xc));
      this._plugins = o.slice().reverse();
      let i = n.find((s) => s instanceof Xc);
      i && this._plugins.push(i);
    }
    addEventListener(n, r, o, i) {
      return this._findPluginFor(r).addEventListener(n, r, o, i);
    }
    getZone() {
      return this._zone;
    }
    _findPluginFor(n) {
      let r = this._eventNameToPlugin.get(n);
      if (r) return r;
      if (((r = this._plugins.find((i) => i.supports(n))), !r)) throw new M(-5101, !1);
      return (this._eventNameToPlugin.set(n, r), r);
    }
    static ɵfac = function (r) {
      return new (r || e)(N(tl), N(Be));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var Op = `ng-app-id`;
function Yb(e) {
  for (let t of e) t.remove();
}
function Zb(e, t) {
  let n = t.createElement(`style`);
  return ((n.textContent = e), n);
}
function vR(e, t, n, r) {
  let o = e.head?.querySelectorAll(`style[${Op}="${t}"],link[${Op}="${t}"]`);
  if (!o || o.length === 0) return !1;
  for (let i of o)
    (i.removeAttribute(Op),
      i instanceof HTMLLinkElement
        ? r.set(i.href.slice(i.href.lastIndexOf(`/`) + 1), { usage: 0, elements: [i] })
        : i.textContent && n.set(i.textContent, { usage: 0, elements: [i] }));
  return !0;
}
function Pp(e, t) {
  let n = t.createElement(`link`);
  return (n.setAttribute(`rel`, `stylesheet`), n.setAttribute(`href`, e), n);
}
var Fp = (() => {
  class e {
    doc;
    appId;
    nonce;
    inline = /* @__PURE__ */ new Map();
    external = /* @__PURE__ */ new Map();
    hosts = /* @__PURE__ */ new Set();
    constructor(n, r, o, i = {}) {
      ((this.doc = n),
        (this.appId = r),
        (this.nonce = o),
        vR(n, r, this.inline, this.external) && this.hosts.add(n.head));
    }
    addStyles(n, r) {
      for (let o of n) this.addUsage(o, this.inline, Zb);
      r?.forEach((o) => this.addUsage(o, this.external, Pp));
    }
    removeStyles(n, r) {
      for (let o of n) this.removeUsage(o, this.inline);
      r?.forEach((o) => this.removeUsage(o, this.external));
    }
    addUsage(n, r, o) {
      let i = r.get(n);
      i
        ? i.usage++
        : r.set(n, {
            usage: 1,
            elements: [...this.hosts].map((s) => this.addElement(s, o(n, this.doc))),
          });
    }
    removeUsage(n, r) {
      let o = r.get(n);
      o && (o.usage--, o.usage <= 0 && (Yb(o.elements), r.delete(n)));
    }
    ngOnDestroy() {
      for (let [, { elements: n }] of [...this.inline, ...this.external]) Yb(n);
      this.hosts.clear();
    }
    addHost(n) {
      if (!this.hosts.has(n)) {
        this.hosts.add(n);
        for (let [r, { elements: o }] of this.inline) o.push(this.addElement(n, Zb(r, this.doc)));
        for (let [r, { elements: o }] of this.external) o.push(this.addElement(n, Pp(r, this.doc)));
      }
    }
    removeHost(n) {
      this.hosts.delete(n);
      for (let r of [...this.inline.values(), ...this.external.values()]) {
        let o = [];
        for (let i of r.elements) i.parentNode === n ? i.remove() : o.push(i);
        r.elements = o;
      }
    }
    addElement(n, r) {
      return (this.nonce && r.setAttribute(`nonce`, this.nonce), n.appendChild(r));
    }
    static ɵfac = function (r) {
      return new (r || e)(N(me), N(Oi), N(Pi, 8), N(ki));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var kp = {
  svg: `http://www.w3.org/2000/svg`,
  xhtml: `http://www.w3.org/1999/xhtml`,
  xlink: `http://www.w3.org/1999/xlink`,
  xml: `http://www.w3.org/XML/1998/namespace`,
  xmlns: `http://www.w3.org/2000/xmlns/`,
  math: `http://www.w3.org/1998/Math/MathML`,
};
var jp = /%COMP%/g;
var Qb = `%COMP%`;
var wR = `_nghost-${Qb}`;
var bR = `_ngcontent-${Qb}`;
var DR = !0;
var ER = new A(``, { factory: () => DR });
var CR = new A(``);
function IR(e) {
  return bR.replace(jp, e);
}
function TR(e) {
  return wR.replace(jp, e);
}
function Xb(e, t) {
  return t.map((n) => n.replace(jp, e));
}
var Bp = (() => {
  class e {
    eventManager;
    sharedStylesHost;
    appId;
    removeStylesOnCompDestroy;
    doc;
    ngZone;
    nonce;
    tracingService;
    rendererByCompId = /* @__PURE__ */ new Map();
    defaultRenderer;
    cssVarNamespace;
    constructor(n, r, o, i, s, a, c = null, d = null, h = null) {
      ((this.eventManager = n),
        (this.sharedStylesHost = r),
        (this.appId = o),
        (this.removeStylesOnCompDestroy = i),
        (this.doc = s),
        (this.ngZone = a),
        (this.nonce = c),
        (this.tracingService = d),
        (this.cssVarNamespace = h ?? ``),
        (this.defaultRenderer = new ls(n, s, a, this.tracingService, this.cssVarNamespace)));
    }
    createRenderer(n, r) {
      if (!n || !r) return this.defaultRenderer;
      let o = this.getOrCreateRenderer(n, r);
      return (o instanceof el ? o.applyToHost(n) : o instanceof us && o.applyStyles(), o);
    }
    getOrCreateRenderer(n, r) {
      let o = this.rendererByCompId,
        i = o.get(r.id);
      if (!i) {
        let s = this.doc,
          a = this.ngZone,
          c = this.eventManager,
          d = this.sharedStylesHost,
          h = this.removeStylesOnCompDestroy,
          p = this.tracingService;
        switch (r.encapsulation) {
          case _t.Emulated:
            i = new el(c, d, r, this.appId, h, s, a, p, this.cssVarNamespace);
            break;
          case _t.ShadowDom:
            return new Jc(c, n, r, s, a, this.nonce, p, this.cssVarNamespace, d);
          case _t.ExperimentalIsolatedShadowDom:
            return new Jc(c, n, r, s, a, this.nonce, p, this.cssVarNamespace);
          default:
            i = new us(c, d, r, h, s, a, p, this.cssVarNamespace);
        }
        o.set(r.id, i);
      }
      return i;
    }
    ngOnDestroy() {
      this.rendererByCompId.clear();
    }
    componentReplaced(n) {
      this.rendererByCompId.delete(n);
    }
    static ɵfac = function (r) {
      return new (r || e)(N(Lp), N(Or), N(Oi), N(ER), N(me), N(Be), N(Pi), N(Nt, 8), N(CR, 8));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var ls = class {
  eventManager;
  doc;
  ngZone;
  tracingService;
  cssVarNamespace;
  data = Object.create(null);
  throwOnSyntheticProps = !0;
  constructor(t, n, r, o, i = ``) {
    ((this.eventManager = t),
      (this.doc = n),
      (this.ngZone = r),
      (this.tracingService = o),
      (this.cssVarNamespace = i));
  }
  destroy() {}
  destroyNode = null;
  createElement(t, n) {
    return n ? this.doc.createElementNS(kp[n] || n, t) : this.doc.createElement(t);
  }
  createComment(t) {
    return this.doc.createComment(t);
  }
  createText(t) {
    return this.doc.createTextNode(t);
  }
  appendChild(t, n) {
    (Kb(t) ? t.content : t).appendChild(n);
  }
  insertBefore(t, n, r) {
    if (t) {
      let o = Kb(t) ? t.content : t;
      if (r != null && r.parentNode !== o) throw new M(-5106, !1);
      o.insertBefore(n, r);
    }
  }
  removeChild(t, n) {
    n.remove();
  }
  selectRootElement(t, n) {
    let r = typeof t == `string` ? this.doc.querySelector(t) : t;
    if (!r) throw new M(-5104, !1);
    return (n || (r.textContent = ``), r);
  }
  parentNode(t) {
    return t.parentNode;
  }
  nextSibling(t) {
    return t.nextSibling;
  }
  setAttribute(t, n, r, o) {
    if (o) {
      n = o + `:` + n;
      let i = kp[o];
      i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
    } else t.setAttribute(n, r);
  }
  removeAttribute(t, n, r) {
    if (r) {
      let o = kp[r];
      o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
    } else t.removeAttribute(n);
  }
  addClass(t, n) {
    t.classList.add(n);
  }
  removeClass(t, n) {
    t.classList.remove(n);
  }
  setStyle(t, n, r, o) {
    let i = n.startsWith(`--`);
    (i && (n = n.replace(`%NS%`, this.cssVarNamespace)),
      i || o & (Gt.DashCase | Gt.Important)
        ? t.style.setProperty(n, r, o & Gt.Important ? `important` : ``)
        : (t.style[n] = r));
  }
  removeStyle(t, n, r) {
    let o = n.startsWith(`--`);
    (o && (n = n.replace(`%NS%`, this.cssVarNamespace)),
      o || r & Gt.DashCase ? t.style.removeProperty(n) : (t.style[n] = ``));
  }
  setProperty(t, n, r) {
    t != null && (t[n] = r);
  }
  setValue(t, n) {
    t.nodeValue = n;
  }
  listen(t, n, r, o) {
    if (typeof t == `string` && ((t = bn().getGlobalEventTarget(this.doc, t)), !t))
      throw new M(-5102, !1);
    let i = this.decoratePreventDefault(r);
    return (
      this.tracingService?.wrapEventListener &&
        (i = this.tracingService.wrapEventListener(t, n, i)),
      this.eventManager.addEventListener(t, n, i, o)
    );
  }
  decoratePreventDefault(t) {
    return (n) => {
      if (n === `__ngUnwrap__`) return t;
      t(n) === !1 && n.preventDefault();
    };
  }
};
function Kb(e) {
  return e.tagName === `TEMPLATE` && e.content !== void 0;
}
var Jc = class extends ls {
  hostEl;
  sharedStylesHost;
  shadowRoot;
  constructor(t, n, r, o, i, s, a, c, d) {
    (super(t, o, i, a, c),
      (this.hostEl = n),
      (this.sharedStylesHost = d),
      (this.shadowRoot = n.attachShadow({ mode: `open` })),
      this.sharedStylesHost && this.sharedStylesHost.addHost(this.shadowRoot));
    let h = r.styles;
    h = Xb(r.id, h).map((m) => m.replace(/%NS%/g, c));
    for (let m of h) {
      let y = document.createElement(`style`);
      (s && y.setAttribute(`nonce`, s), (y.textContent = m), this.shadowRoot.appendChild(y));
    }
    let p = r.getExternalStyles?.();
    if (p)
      for (let m of p) {
        let y = Pp(m, o);
        (s && y.setAttribute(`nonce`, s), this.shadowRoot.appendChild(y));
      }
  }
  nodeOrShadowRoot(t) {
    return t === this.hostEl ? this.shadowRoot : t;
  }
  appendChild(t, n) {
    return super.appendChild(this.nodeOrShadowRoot(t), n);
  }
  insertBefore(t, n, r) {
    return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
  }
  removeChild(t, n) {
    return super.removeChild(null, n);
  }
  parentNode(t) {
    return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
  }
  destroy() {
    this.sharedStylesHost && this.sharedStylesHost.removeHost(this.shadowRoot);
  }
};
var us = class extends ls {
  sharedStylesHost;
  removeStylesOnCompDestroy;
  styles;
  styleUrls;
  constructor(t, n, r, o, i, s, a, c, d) {
    (super(t, i, s, a, c), (this.sharedStylesHost = n), (this.removeStylesOnCompDestroy = o));
    let h = r.styles,
      p = d ? Xb(d, h) : h;
    ((this.styles = p.map((m) => m.replace(/%NS%/g, c))),
      (this.styleUrls = r.getExternalStyles?.(d)));
  }
  applyStyles() {
    this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
  }
  destroy() {
    this.removeStylesOnCompDestroy &&
      Ff.size === 0 &&
      this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
  }
};
var el = class extends us {
  contentAttr;
  hostAttr;
  constructor(t, n, r, o, i, s, a, c, d) {
    let h = o + `-` + r.id;
    (super(t, n, r, i, s, a, c, d, h), (this.contentAttr = IR(h)), (this.hostAttr = TR(h)));
  }
  applyToHost(t) {
    (this.applyStyles(), this.setAttribute(t, this.hostAttr, ``));
  }
  createElement(t, n) {
    let r = super.createElement(t, n);
    return (super.setAttribute(r, this.contentAttr, ``), r);
  }
};
var nl = class e extends ss {
  supportsDOMEvents = !0;
  static makeCurrent() {
    Np(new e());
  }
  onAndCancel(t, n, r, o) {
    return (
      t.addEventListener(n, r, o),
      () => {
        t.removeEventListener(n, r, o);
      }
    );
  }
  dispatchEvent(t, n) {
    t.dispatchEvent(n);
  }
  remove(t) {
    t.remove();
  }
  createElement(t, n) {
    return ((n = n || this.getDefaultDocument()), n.createElement(t));
  }
  createHtmlDocument() {
    return document.implementation.createHTMLDocument(`fakeTitle`);
  }
  getDefaultDocument() {
    return document;
  }
  isElementNode(t) {
    return t.nodeType === Node.ELEMENT_NODE;
  }
  isShadowRoot(t) {
    return t instanceof DocumentFragment;
  }
  getGlobalEventTarget(t, n) {
    return n === `window` ? window : n === `document` ? t : n === `body` ? t.body : null;
  }
  getBaseHref(t) {
    let n = SR();
    return n == null ? null : MR(n);
  }
  resetBaseElement() {
    ds = null;
  }
  getUserAgent() {
    return window.navigator.userAgent;
  }
  getCookie(t) {
    return as(document.cookie, t);
  }
};
var ds = null;
function SR() {
  return ((ds = ds || document.head.querySelector(`base`)), ds ? ds.getAttribute(`href`) : null);
}
function MR(e) {
  return new URL(e, document.baseURI).pathname;
}
var Jb = [`alt`, `control`, `meta`, `shift`];
var _R = {
  '\b': `Backspace`,
  '	': `Tab`,
  '': `Delete`,
  '\x1B': `Escape`,
  Del: `Delete`,
  Esc: `Escape`,
  Left: `ArrowLeft`,
  Right: `ArrowRight`,
  Up: `ArrowUp`,
  Down: `ArrowDown`,
  Menu: `ContextMenu`,
  Scroll: `ScrollLock`,
  Win: `OS`,
};
var NR = {
  alt: (e) => e.altKey,
  control: (e) => e.ctrlKey,
  meta: (e) => e.metaKey,
  shift: (e) => e.shiftKey,
};
var eD = (() => {
  class e extends cs {
    constructor(n) {
      super(n);
    }
    supports(n) {
      return e.parseEventName(n) != null;
    }
    addEventListener(n, r, o, i) {
      let s = e.parseEventName(r),
        a = e.eventCallback(s.fullKey, o, this.manager.getZone());
      return this.manager
        .getZone()
        .runOutsideAngular(() => bn().onAndCancel(n, s.domEventName, a, i));
    }
    static parseEventName(n) {
      let r = n.toLowerCase().split(`.`),
        o = r.shift();
      if (r.length === 0 || !(o === `keydown` || o === `keyup`)) return null;
      let i = e._normalizeKey(r.pop()),
        s = ``,
        a = r.indexOf(`code`);
      if (
        (a > -1 && (r.splice(a, 1), (s = `code.`)),
        Jb.forEach((d) => {
          let h = r.indexOf(d);
          h > -1 && (r.splice(h, 1), (s += d + `.`));
        }),
        (s += i),
        r.length != 0 || i.length === 0)
      )
        return null;
      let c = {};
      return ((c.domEventName = o), (c.fullKey = s), c);
    }
    static matchEventFullKeyCode(n, r) {
      let o = _R[n.key] || n.key,
        i = ``;
      return (
        r.indexOf(`code.`) > -1 && ((o = n.code), (i = `code.`)),
        o == null || !o
          ? !1
          : ((o = o.toLowerCase()),
            o === ` ` ? (o = `space`) : o === `.` && (o = `dot`),
            Jb.forEach((s) => {
              if (s !== o) {
                let a = NR[s];
                a(n) && (i += s + `.`);
              }
            }),
            (i += o),
            i === r)
      );
    }
    static eventCallback(n, r, o) {
      return (i) => {
        e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
      };
    }
    static _normalizeKey(n) {
      return n === `esc` ? `escape` : n;
    }
    static ɵfac = function (r) {
      return new (r || e)(N(me));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
async function AR(e, t, n) {
  return Vb(C({ rootComponent: e }, RR(t, n)));
}
function RR(e, t) {
  return {
    platformRef: t?.platformRef,
    appProviders: [...LR, ...(e?.providers ?? [])],
    platformProviders: PR,
  };
}
function xR() {
  nl.makeCurrent();
}
function OR() {
  return new pt();
}
function kR() {
  return (Sf(document), document);
}
var PR = [
  { provide: ki, useValue: xp },
  { provide: Ja, useValue: xR, multi: !0 },
  { provide: me, useFactory: kR },
];
var LR = [
  { provide: Si, useValue: `root` },
  { provide: pt, useFactory: OR },
  { provide: tl, useClass: Xc, multi: !0 },
  { provide: tl, useClass: eD, multi: !0 },
  Bp,
  { provide: Or, useClass: Fp },
  { provide: Fp, useExisting: Or },
  Lp,
  { provide: Nr, useExisting: Bp },
  [],
];
var ee = class e {
  headers;
  normalizedNames = /* @__PURE__ */ new Map();
  lazyInit;
  lazyUpdate = null;
  constructor(t) {
    t
      ? typeof t == `string`
        ? (this.lazyInit = () => {
            ((this.headers = /* @__PURE__ */ new Map()),
              t
                .split(
                  `
`,
                )
                .forEach((n) => {
                  let r = n.indexOf(`:`);
                  if (r > 0) {
                    let o = n.slice(0, r),
                      i = n.slice(r + 1).trim();
                    this.addHeaderEntry(o, i);
                  }
                }));
          })
        : typeof Headers < `u` && t instanceof Headers
          ? ((this.headers = /* @__PURE__ */ new Map()),
            t.forEach((n, r) => {
              this.addHeaderEntry(r, n);
            }))
          : (this.lazyInit = () => {
              ((this.headers = /* @__PURE__ */ new Map()),
                Object.entries(t).forEach(([n, r]) => {
                  this.setHeaderEntries(n, r);
                }));
            })
      : (this.headers = /* @__PURE__ */ new Map());
  }
  has(t) {
    return (this.init(), this.headers.has(t.toLowerCase()));
  }
  get(t) {
    this.init();
    let n = this.headers.get(t.toLowerCase());
    return n && n.length > 0 ? n[0] : null;
  }
  keys() {
    return (this.init(), Array.from(this.normalizedNames.values()));
  }
  getAll(t) {
    return (this.init(), this.headers.get(t.toLowerCase()) || null);
  }
  append(t, n) {
    return this.clone({ name: t, value: n, op: `a` });
  }
  set(t, n) {
    return this.clone({ name: t, value: n, op: `s` });
  }
  delete(t, n) {
    return this.clone({ name: t, value: n, op: `d` });
  }
  maybeSetNormalizedName(t, n) {
    this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
  }
  init() {
    this.lazyInit &&
      (this.lazyInit instanceof e ? this.copyFrom(this.lazyInit) : this.lazyInit(),
      (this.lazyInit = null),
      this.lazyUpdate &&
        (this.lazyUpdate.forEach((t) => this.applyUpdate(t)), (this.lazyUpdate = null)));
  }
  copyFrom(t) {
    t.init();
    for (let [n, r] of t.headers.entries())
      (this.headers.set(n, r), this.normalizedNames.set(n, t.normalizedNames.get(n)));
  }
  clone(t) {
    let n = new e();
    return (
      (n.lazyInit = this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
      (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
      n
    );
  }
  applyUpdate(t) {
    let n = t.name.toLowerCase();
    switch (t.op) {
      case `a`:
      case `s`:
        let r = t.value;
        if ((typeof r == `string` && (r = [r]), r.length === 0)) return;
        this.maybeSetNormalizedName(t.name, n);
        let o = t.op === `a` ? (this.headers.get(n) || []).slice() : [];
        (o.push(...r), this.headers.set(n, o));
        break;
      case `d`:
        let i = t.value;
        if (i === void 0) (this.headers.delete(n), this.normalizedNames.delete(n));
        else {
          let s = Array.isArray(i) ? i : [i],
            a = this.headers.get(n);
          if (!a) return;
          ((a = a.filter((c) => s.indexOf(c) === -1)),
            a.length === 0
              ? (this.headers.delete(n), this.normalizedNames.delete(n))
              : this.headers.set(n, a));
        }
    }
  }
  addHeaderEntry(t, n) {
    let r = t.toLowerCase();
    (this.maybeSetNormalizedName(t, r),
      this.headers.has(r) ? this.headers.get(r).push(n) : this.headers.set(r, [n]));
  }
  setHeaderEntries(t, n) {
    let r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
      o = t.toLowerCase();
    (this.headers.set(o, r), this.maybeSetNormalizedName(t, o));
  }
  forEach(t) {
    (this.init(),
      Array.from(this.normalizedNames.keys()).forEach((n) =>
        t(this.normalizedNames.get(n), this.headers.get(n)),
      ));
  }
};
var ol = class {
  map = /* @__PURE__ */ new Map();
  set(t, n) {
    return (this.map.set(t, n), this);
  }
  get(t) {
    return (this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t));
  }
  delete(t) {
    return (this.map.delete(t), this);
  }
  has(t) {
    return this.map.has(t);
  }
  keys() {
    return this.map.keys();
  }
};
var il = class {
  encodeKey(t) {
    return tD(t);
  }
  encodeValue(t) {
    return tD(t);
  }
  decodeKey(t) {
    return decodeURIComponent(t);
  }
  decodeValue(t) {
    return decodeURIComponent(t);
  }
};
function FR(e, t) {
  let n = /* @__PURE__ */ new Map();
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, ``)
        .split(`&`)
        .forEach((o) => {
          let i = o.indexOf(`=`),
            [s, a] =
              i == -1
                ? [t.decodeKey(o), ``]
                : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
            c = n.get(s) || [];
          (c.push(a), n.set(s, c));
        }),
    n
  );
}
var jR = /[&+#]/g;
function tD(e) {
  return encodeURI(e).replace(jR, encodeURIComponent);
}
function rl(e) {
  return `${e}`;
}
var En = class e {
  map;
  encoder;
  updates = null;
  cloneFrom = null;
  constructor(t = {}) {
    if (((this.encoder = t.encoder || new il()), t.fromString)) {
      if (t.fromObject) throw new M(2805, !1);
      this.map = FR(t.fromString, this.encoder);
    } else
      t.fromObject
        ? ((this.map = /* @__PURE__ */ new Map()),
          Object.keys(t.fromObject).forEach((n) => {
            let r = t.fromObject[n],
              o = Array.isArray(r) ? r.map(rl) : [rl(r)];
            this.map.set(n, o);
          }))
        : (this.map = null);
  }
  has(t) {
    return (this.init(), this.map.has(t));
  }
  get(t) {
    this.init();
    let n = this.map.get(t);
    return n ? n[0] : null;
  }
  getAll(t) {
    return (this.init(), this.map.get(t) || null);
  }
  keys() {
    return (this.init(), Array.from(this.map.keys()));
  }
  append(t, n) {
    return this.clone({ param: t, value: n, op: `a` });
  }
  appendAll(t) {
    let n = [];
    return (
      Object.keys(t).forEach((r) => {
        let o = t[r];
        Array.isArray(o)
          ? o.forEach((i) => {
              n.push({ param: r, value: i, op: `a` });
            })
          : n.push({ param: r, value: o, op: `a` });
      }),
      this.clone(n)
    );
  }
  set(t, n) {
    return this.clone({ param: t, value: n, op: `s` });
  }
  delete(t, n) {
    return this.clone({ param: t, value: n, op: `d` });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let n = this.encoder.encodeKey(t);
          return this.map
            .get(t)
            .map((r) => n + `=` + this.encoder.encodeValue(r))
            .join(`&`);
        })
        .filter((t) => t !== ``)
        .join(`&`)
    );
  }
  clone(t) {
    let n = new e({ encoder: this.encoder });
    return (
      (n.cloneFrom = this.cloneFrom || this),
      (n.updates = (this.updates || []).concat(t)),
      n
    );
  }
  init() {
    if ((this.map === null && (this.map = /* @__PURE__ */ new Map()), this.cloneFrom !== null)) {
      this.cloneFrom.init();
      for (let [t, n] of this.cloneFrom.map.entries()) this.map.set(t, n);
      (this.updates.forEach((t) => {
        switch (t.op) {
          case `a`:
          case `s`:
            let n = t.op === `a` ? (this.map.get(t.param) || []).slice() : [];
            (n.push(rl(t.value)), this.map.set(t.param, n));
            break;
          case `d`:
            if (t.value !== void 0) {
              let r = (this.map.get(t.param) || []).slice(),
                o = r.indexOf(rl(t.value));
              (o !== -1 && r.splice(o, 1),
                r.length > 0 ? this.map.set(t.param, r) : this.map.delete(t.param));
            } else {
              this.map.delete(t.param);
              break;
            }
        }
      }),
        (this.cloneFrom = this.updates = null));
    }
  }
};
function BR(e) {
  switch (e) {
    case `DELETE`:
    case `GET`:
    case `HEAD`:
    case `OPTIONS`:
    case `JSONP`:
      return !1;
    default:
      return !0;
  }
}
function nD(e) {
  return typeof ArrayBuffer < `u` && e instanceof ArrayBuffer;
}
function rD(e) {
  return typeof Blob < `u` && e instanceof Blob;
}
function oD(e) {
  return typeof FormData < `u` && e instanceof FormData;
}
function UR(e) {
  return typeof URLSearchParams < `u` && e instanceof URLSearchParams;
}
var Up = `Content-Type`;
var iD = `Accept`;
var cD = `text/plain`;
var lD = `application/json`;
var VR = `${lD}, ${cD}, */*`;
var Bo = class e {
  url;
  body = null;
  headers;
  context;
  reportProgress = !1;
  reportUploadProgress = !1;
  reportDownloadProgress = !1;
  withCredentials = !1;
  credentials;
  keepalive = !1;
  cache;
  priority;
  mode;
  redirect;
  referrer;
  integrity;
  referrerPolicy;
  responseType = `json`;
  method;
  params;
  urlWithParams;
  transferCache;
  timeout;
  constructor(t, n, r, o) {
    ((this.url = n), (this.method = t.toUpperCase()));
    let i;
    if ((BR(this.method) || o ? ((this.body = r !== void 0 ? r : null), (i = o)) : (i = r), i)) {
      if (
        ((this.reportProgress = !!i.reportProgress),
        (this.reportUploadProgress = !!i.reportUploadProgress),
        (this.reportDownloadProgress = !!i.reportDownloadProgress),
        (this.withCredentials = !!i.withCredentials),
        (this.keepalive = !!i.keepalive),
        i.responseType && (this.responseType = i.responseType),
        i.headers && (this.headers = i.headers),
        i.context && (this.context = i.context),
        i.params && (this.params = i.params),
        i.priority && (this.priority = i.priority),
        i.cache && (this.cache = i.cache),
        i.credentials && (this.credentials = i.credentials),
        typeof i.timeout == `number`)
      ) {
        if (i.timeout < 1 || !Number.isInteger(i.timeout)) throw new M(2822, ``);
        this.timeout = i.timeout;
      }
      (i.mode && (this.mode = i.mode),
        i.redirect && (this.redirect = i.redirect),
        i.integrity && (this.integrity = i.integrity),
        i.referrer !== void 0 && (this.referrer = i.referrer),
        i.referrerPolicy && (this.referrerPolicy = i.referrerPolicy),
        (this.transferCache = i.transferCache));
    }
    if (((this.headers ??= new ee()), (this.context ??= new ol()), !this.params))
      ((this.params = new En()), (this.urlWithParams = n));
    else {
      let s = this.params.toString();
      if (s.length === 0) this.urlWithParams = n;
      else {
        let a = n,
          c = ``,
          d = n.indexOf(`#`);
        d !== -1 && ((c = n.substring(d)), (a = n.substring(0, d)));
        let h = a.indexOf(`?`),
          p = h === -1 ? `?` : h < a.length - 1 ? `&` : ``;
        this.urlWithParams = a + p + s + c;
      }
    }
  }
  serializeBody() {
    return this.body === null
      ? null
      : typeof this.body == `string` ||
          nD(this.body) ||
          rD(this.body) ||
          oD(this.body) ||
          UR(this.body)
        ? this.body
        : this.body instanceof En
          ? this.body.toString()
          : typeof this.body == `object` ||
              typeof this.body == `boolean` ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
  }
  detectContentTypeHeader() {
    return this.body === null || oD(this.body)
      ? null
      : rD(this.body)
        ? this.body.type || null
        : nD(this.body)
          ? null
          : typeof this.body == `string`
            ? cD
            : this.body instanceof En
              ? `application/x-www-form-urlencoded;charset=UTF-8`
              : typeof this.body == `object` ||
                  typeof this.body == `number` ||
                  typeof this.body == `boolean`
                ? lD
                : null;
  }
  clone(t = {}) {
    let n = t.method || this.method,
      r = t.url || this.url,
      o = t.responseType || this.responseType,
      i = t.keepalive ?? this.keepalive,
      s = t.priority || this.priority,
      a = t.cache || this.cache,
      c = t.mode || this.mode,
      d = t.redirect || this.redirect,
      h = t.credentials || this.credentials,
      p = t.referrer ?? this.referrer,
      m = t.integrity || this.integrity,
      y = t.referrerPolicy || this.referrerPolicy,
      w = t.transferCache ?? this.transferCache,
      T = t.timeout ?? this.timeout,
      E = t.body !== void 0 ? t.body : this.body,
      _ = t.withCredentials ?? this.withCredentials,
      V = t.reportProgress ?? this.reportProgress,
      pe = t.reportUploadProgress ?? this.reportUploadProgress,
      xt = t.reportDownloadProgress ?? this.reportDownloadProgress,
      et = t.headers || this.headers,
      Jt = t.params || this.params,
      Et = t.context ?? this.context;
    return (
      t.setHeaders !== void 0 &&
        (et = Object.keys(t.setHeaders).reduce((Ot, kt) => Ot.set(kt, t.setHeaders[kt]), et)),
      t.setParams &&
        (Jt = Object.keys(t.setParams).reduce((Ot, kt) => Ot.set(kt, t.setParams[kt]), Jt)),
      new e(n, r, E, {
        params: Jt,
        headers: et,
        context: Et,
        reportProgress: V,
        reportUploadProgress: pe,
        reportDownloadProgress: xt,
        responseType: o,
        withCredentials: _,
        transferCache: w,
        keepalive: i,
        cache: a,
        priority: s,
        timeout: T,
        mode: c,
        redirect: d,
        credentials: h,
        referrer: p,
        integrity: m,
        referrerPolicy: y,
      })
    );
  }
};
var jr = (function (e) {
  return (
    (e[(e.Sent = 0)] = `Sent`),
    (e[(e.UploadProgress = 1)] = `UploadProgress`),
    (e[(e.ResponseHeader = 2)] = `ResponseHeader`),
    (e[(e.DownloadProgress = 3)] = `DownloadProgress`),
    (e[(e.Response = 4)] = `Response`),
    (e[(e.User = 5)] = `User`),
    e
  );
})(jr || {});
var ae = class {
  headers;
  status;
  statusText;
  url;
  ok;
  type;
  redirected;
  responseType;
  constructor(t, n = 200, r = `OK`) {
    ((this.headers = t.headers || new ee()),
      (this.status = t.status !== void 0 ? t.status : n),
      (this.statusText = t.statusText || r),
      (this.url = t.url || null),
      (this.redirected = t.redirected),
      (this.responseType = t.responseType),
      (this.ok = this.status >= 200 && this.status < 300));
  }
};
var sl = class e extends ae {
  constructor(t = {}) {
    super(t);
  }
  type = jr.ResponseHeader;
  clone(t = {}) {
    return new e({
      headers: t.headers || this.headers,
      status: t.status !== void 0 ? t.status : this.status,
      statusText: t.statusText || this.statusText,
      url: t.url || this.url || void 0,
    });
  }
};
var ce$1 = class e extends ae {
  body;
  constructor(t = {}) {
    (super(t), (this.body = t.body !== void 0 ? t.body : null));
  }
  type = jr.Response;
  clone(t = {}) {
    return new e({
      body: t.body !== void 0 ? t.body : this.body,
      headers: t.headers || this.headers,
      status: t.status !== void 0 ? t.status : this.status,
      statusText: t.statusText || this.statusText,
      url: t.url || this.url || void 0,
      redirected: t.redirected ?? this.redirected,
      responseType: t.responseType ?? this.responseType,
    });
  }
};
var Fr = class extends ae {
  name = `HttpErrorResponse`;
  message;
  error;
  ok = !1;
  constructor(t) {
    (super(t, 0, `Unknown Error`),
      this.status >= 200 && this.status < 300
        ? (this.message = `Http failure during parsing for ${t.url || `(unknown url)`}`)
        : (this.message = `Http failure response for ${t.url || `(unknown url)`}: ${t.status} ${t.statusText}`),
      (this.error = t.error || null));
  }
};
var HR = 200;
var $R = /^\)\]\}',?\n/;
var uD = new A(``, { factory: () => null });
var al = (() => {
  class e {
    fetchImpl = b(Hp, { optional: !0 })?.fetch ?? ((...n) => globalThis.fetch(...n));
    ngZone = b(Be);
    destroyRef = b(je);
    maxResponseSize = b(uD);
    handle(n) {
      return new F$1((r) => {
        let o = new AbortController(),
          i = !1,
          s = {
            next: (c) => {
              (c.type === jr.Response && (i = !0), r.next(c));
            },
            error: (c) => {
              ((i = !0), r.error(c));
            },
            complete: () => {
              ((i = !0), r.complete());
            },
          };
        this.doRequest(n, o.signal, s).then($p, (c) => s.error(new Fr({ error: c })));
        let a;
        return (
          n.timeout &&
            (a = this.ngZone.runOutsideAngular(() =>
              setTimeout(() => {
                o.signal.aborted || o.abort(new DOMException(`signal timed out`, `TimeoutError`));
              }, n.timeout),
            )),
          () => {
            (a !== void 0 && clearTimeout(a), !i && !o.signal.aborted && o.abort());
          }
        );
      });
    }
    async doRequest(n, r, o) {
      let i = this.createRequestInit(n),
        s;
      try {
        let E = this.ngZone.runOutsideAngular(() =>
          this.fetchImpl(n.urlWithParams, C({ signal: r }, i)),
        );
        (zR(E), o.next({ type: jr.Sent }), (s = await E));
      } catch (E) {
        o.error(
          new Fr({
            error: E,
            status: E.status ?? 0,
            statusText: E.statusText,
            url: n.urlWithParams,
            headers: E.headers,
          }),
        );
        return;
      }
      let a = new ee(s.headers),
        c = s.statusText,
        d = s.url || n.urlWithParams,
        h = s.status,
        p = null,
        m = n.reportProgress || n.reportDownloadProgress;
      if ((m && o.next(new sl({ headers: a, status: h, statusText: c, url: d })), s.body)) {
        let E = s.headers.get(Up) ?? ``,
          _ = s.headers.get(`content-length`),
          V = _ !== null ? Number(_) : NaN;
        this.maxResponseSize !== null &&
          Number.isFinite(V) &&
          V > this.maxResponseSize &&
          (await s.body.cancel(), sD(this.maxResponseSize));
        let pe = [],
          xt = s.body.getReader(),
          et = 0,
          Jt,
          Et,
          Ot = typeof Zone < `u` && Zone.current,
          kt = !1;
        if (
          (await this.ngZone.runOutsideAngular(async () => {
            for (;;) {
              if (this.destroyRef.destroyed) {
                (await xt.cancel(), (kt = !0));
                break;
              }
              let { done: en, value: ke } = await xt.read();
              if (en) break;
              if (
                (pe.push(ke),
                (et += ke.length),
                this.maxResponseSize !== null &&
                  et > this.maxResponseSize &&
                  (await xt.cancel(), sD(this.maxResponseSize)),
                m)
              ) {
                Et =
                  n.responseType === `text`
                    ? (Et ?? ``) + (Jt ??= aD(E)).decode(ke, { stream: !0 })
                    : void 0;
                let W = () =>
                  o.next({
                    type: jr.DownloadProgress,
                    total: Number.isFinite(V) ? V : void 0,
                    loaded: et,
                    partialText: Et,
                  });
                Ot ? Ot.run(W) : W();
              }
            }
          }),
          kt)
        ) {
          o.complete();
          return;
        }
        let Oe = this.concatChunks(pe, et);
        try {
          p = this.parseBody(n, Oe, E, h);
        } catch (en) {
          o.error(
            new Fr({
              error: en,
              headers: new ee(s.headers),
              status: s.status,
              statusText: s.statusText,
              url: s.url || n.urlWithParams,
            }),
          );
          return;
        }
      }
      h === 0 && (h = p ? HR : 0);
      let y = h >= 200 && h < 300,
        w = s.redirected,
        T = s.type;
      y
        ? (o.next(
            new ce$1({
              body: p,
              headers: a,
              status: h,
              statusText: c,
              url: d,
              redirected: w,
              responseType: T,
            }),
          ),
          o.complete())
        : o.error(
            new Fr({
              error: p,
              headers: a,
              status: h,
              statusText: c,
              url: d,
              redirected: w,
              responseType: T,
            }),
          );
    }
    parseBody(n, r, o, i) {
      switch (n.responseType) {
        case `json`:
          let s = new TextDecoder().decode(r).replace($R, ``);
          if (s === ``) return null;
          try {
            return JSON.parse(s);
          } catch (a) {
            if (i < 200 || i >= 300) return s;
            throw a;
          }
        case `text`:
          return aD(o).decode(r);
        case `blob`:
          return new Blob([r], { type: o });
        case `arraybuffer`:
          return r.buffer;
      }
    }
    createRequestInit(n) {
      if (n.reportUploadProgress) throw new M(2824, !1);
      let r = {},
        o;
      if (
        ((o = n.credentials),
        n.withCredentials && (o = `include`),
        n.headers.forEach((i, s) => (r[i] = s.join(`,`))),
        n.headers.has(iD) || (r[iD] = VR),
        !n.headers.has(Up))
      ) {
        let i = n.detectContentTypeHeader();
        i !== null && (r[Up] = i);
      }
      return {
        body: n.serializeBody(),
        method: n.method,
        headers: r,
        credentials: o,
        keepalive: n.keepalive,
        cache: n.cache,
        priority: n.priority,
        mode: n.mode,
        redirect: n.redirect,
        referrer: n.referrer,
        integrity: n.integrity,
        referrerPolicy: n.referrerPolicy,
      };
    }
    concatChunks(n, r) {
      let o = new Uint8Array(r),
        i = 0;
      for (let s of n) (o.set(s, i), (i += s.length));
      return o;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var Hp = class {};
function $p() {}
function zR(e) {
  e.then($p, $p);
}
function sD(e) {
  throw new M(-2825, !1);
}
var qR = /charset=\s*["']?([^;"'\s]+)["']?/i;
function aD(e) {
  let t = e.match(qR);
  if (t !== null)
    try {
      return new TextDecoder(t[1]);
    } catch {}
  return new TextDecoder();
}
var GR = new A(``, { factory: () => !0 });
var WR = `XSRF-TOKEN`;
var YR = new A(``, { factory: () => WR });
var ZR = `X-XSRF-TOKEN`;
var KR = new A(``, { factory: () => ZR });
var QR = (() => {
  class e {
    cookieName = b(YR);
    doc = b(me);
    lastCookieString = ``;
    lastToken = null;
    parseCount = 0;
    getToken() {
      let n = this.doc.cookie || ``;
      return (
        n !== this.lastCookieString &&
          (this.parseCount++,
          (this.lastToken = as(n, this.cookieName)),
          (this.lastCookieString = n)),
        this.lastToken
      );
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var dD = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = k$1({
      token: e,
      factory: function (r) {
        let o = null;
        return (r ? (o = new (r || e)()) : (o = N(QR)), o);
      },
      providedIn: `root`,
    });
  }
  return e;
})();
function fD(e, t) {
  if (!b(GR) || e.method === `GET` || e.method === `HEAD`) return t(e);
  try {
    let o = b(Dn).href,
      { origin: i } = new URL(o),
      { origin: s } = new URL(e.url, i);
    if (i !== s) return t(e);
  } catch {
    return t(e);
  }
  let n = b(dD).getToken(),
    r = b(KR);
  return (n != null && !e.headers.has(r) && (e = e.clone({ headers: e.headers.set(r, n) })), t(e));
}
function XR(e, t) {
  return t(e);
}
function JR(e, t, n) {
  return (r, o) => Ne(n, () => t(r, (i) => e(i, o)));
}
var zp = new A(``, { factory: () => [fD] });
var pD = new A(``);
var hD = new A(``, { factory: () => !0 });
var qp = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = k$1({
      token: e,
      factory: function (r) {
        let o = null;
        return (r ? (o = new (r || e)()) : (o = N(al)), o);
      },
      providedIn: `root`,
    });
  }
  return e;
})();
var cl = (() => {
  class e {
    backend;
    injector;
    chain = null;
    pendingTasks = b(Fi);
    contributeToStability = b(hD);
    constructor(n, r) {
      ((this.backend = n), (this.injector = r));
    }
    handle(n) {
      if (this.chain === null) {
        let o = this.injector.get(ll, null, { skipSelf: !0 }),
          i = o !== null && this.backend === o,
          s = this.injector.get(pD, [], i ? { self: !0 } : void 0),
          a = Array.from(/* @__PURE__ */ new Set([...this.injector.get(zp), ...s]));
        this.chain = a.reduceRight((c, d) => JR(c, d, this.injector), XR);
      }
      let r = this.chain;
      if (this.contributeToStability) {
        let o = this.pendingTasks.add();
        return fe$1(() => r(n, (i) => this.backend.handle(i))).pipe(pi(o));
      } else return fe$1(() => r(n, (o) => this.backend.handle(o)));
    }
    static ɵfac = function (r) {
      return new (r || e)(N(qp), N(we$1));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
  }
  return e;
})();
var ll = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = k$1({
      token: e,
      factory: function (r) {
        let o = null;
        return (r ? (o = new (r || e)()) : (o = N(cl)), o);
      },
      providedIn: `root`,
    });
  }
  return e;
})();
function Vp(e, t) {
  return C({ body: t }, e);
}
var Cn = (() => {
  class e {
    handler;
    constructor(n) {
      this.handler = n;
    }
    request(n, r, o = {}) {
      let i;
      if (n instanceof Bo) i = n;
      else {
        let c;
        o.headers instanceof ee ? (c = o.headers) : (c = new ee(o.headers));
        let d;
        (o.params &&
          (o.params instanceof En ? (d = o.params) : (d = new En({ fromObject: o.params }))),
          (i = new Bo(n, r, o.body !== void 0 ? o.body : null, {
            headers: c,
            context: o.context,
            params: d,
            reportProgress: o.reportProgress,
            reportUploadProgress: o.reportUploadProgress,
            reportDownloadProgress: o.reportDownloadProgress,
            responseType: o.responseType || `json`,
            withCredentials: o.withCredentials,
            transferCache: o.transferCache,
            keepalive: o.keepalive,
            priority: o.priority,
            cache: o.cache,
            mode: o.mode,
            redirect: o.redirect,
            credentials: o.credentials,
            referrer: o.referrer,
            referrerPolicy: o.referrerPolicy,
            integrity: o.integrity,
            timeout: o.timeout,
          })));
      }
      let s = I$1(i).pipe(fo((c) => this.handler.handle(c)));
      if (n instanceof Bo || o.observe === `events`) return s;
      let a = s.pipe(Qe((c) => c instanceof ce$1));
      switch (o.observe || `body`) {
        case `body`:
          switch (i.responseType) {
            case `arraybuffer`:
              return a.pipe(
                ne((c) => {
                  if (c.body !== null && !(c.body instanceof ArrayBuffer)) throw new M(2806, !1);
                  return c.body;
                }),
              );
            case `blob`:
              return a.pipe(
                ne((c) => {
                  if (c.body !== null && !(c.body instanceof Blob)) throw new M(2807, !1);
                  return c.body;
                }),
              );
            case `text`:
              return a.pipe(
                ne((c) => {
                  if (c.body !== null && typeof c.body != `string`) throw new M(2808, !1);
                  return c.body;
                }),
              );
            default:
              return a.pipe(ne((c) => c.body));
          }
        case `response`:
          return a;
        default:
          throw new M(2809, !1);
      }
    }
    delete(n, r = {}) {
      return this.request(`DELETE`, n, r);
    }
    get(n, r = {}) {
      return this.request(`GET`, n, r);
    }
    head(n, r = {}) {
      return this.request(`HEAD`, n, r);
    }
    jsonp(n, r) {
      return this.request(`JSONP`, n, {
        params: new En().append(r, `JSONP_CALLBACK`),
        observe: `body`,
        responseType: `json`,
      });
    }
    options(n, r = {}) {
      return this.request(`OPTIONS`, n, r);
    }
    patch(n, r, o = {}) {
      return this.request(`PATCH`, n, Vp(o, r));
    }
    post(n, r, o = {}) {
      return this.request(`POST`, n, Vp(o, r));
    }
    put(n, r, o = {}) {
      return this.request(`PUT`, n, Vp(o, r));
    }
    static ɵfac = function (r) {
      return new (r || e)(N(ll));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
  }
  return e;
})();
var Gp = (function (e) {
  return (
    (e[(e.Interceptors = 0)] = `Interceptors`),
    (e[(e.LegacyInterceptors = 1)] = `LegacyInterceptors`),
    (e[(e.CustomXsrfConfiguration = 2)] = `CustomXsrfConfiguration`),
    (e[(e.NoXsrfProtection = 3)] = `NoXsrfProtection`),
    (e[(e.JsonpSupport = 4)] = `JsonpSupport`),
    (e[(e.RequestsMadeViaParent = 5)] = `RequestsMadeViaParent`),
    (e[(e.Fetch = 6)] = `Fetch`),
    (e[(e.Xhr = 7)] = `Xhr`),
    e
  );
})(Gp || {});
function ex(e, t) {
  return { ɵkind: e, ɵproviders: t };
}
function tx(...e) {
  let t = [
    Cn,
    al,
    cl,
    { provide: ll, useExisting: cl },
    { provide: qp, useFactory: () => b(al) },
    { provide: zp, useValue: fD, multi: !0 },
  ];
  for (let n of e) t.push(...n.ɵproviders);
  return Vt(t);
}
function nx(e) {
  return ex(
    Gp.Interceptors,
    e.map((t) => ({ provide: zp, useValue: t, multi: !0 })),
  );
}
var gD = (() => {
  class e {
    _doc;
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || ``;
    }
    static ɵfac = function (r) {
      return new (r || e)(N(me));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
  }
  return e;
})();
var rx = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = k$1({
      token: e,
      factory: function (r) {
        let o = null;
        return (r ? (o = new (r || e)()) : (o = N(ox)), o);
      },
      providedIn: `root`,
    });
  }
  return e;
})();
var ox = (() => {
  class e extends rx {
    _doc = b(me);
    sanitize(n, r) {
      if (r == null) return null;
      switch (n) {
        case ge$1.NONE:
          return r;
        case ge$1.HTML:
          return mn(r, `HTML`) ? at(r) : Of(this._doc, String(r)).toString();
        case ge$1.STYLE:
          return mn(r, `Style`) ? at(r) : r;
        case ge$1.SCRIPT:
          if (mn(r, `Script`)) return at(r);
          throw new M(5200, !1);
        case ge$1.URL:
          return mn(r, `URL`) ? at(r) : Zi(String(r));
        case ge$1.RESOURCE_URL:
          if (mn(r, `ResourceURL`)) return at(r);
          throw new M(-5201, !1);
        default:
          throw new M(5202, !1);
      }
    }
    bypassSecurityTrustHtml(n) {
      return _f(n);
    }
    bypassSecurityTrustStyle(n) {
      return Nf(n);
    }
    bypassSecurityTrustScript(n) {
      return Af(n);
    }
    bypassSecurityTrustUrl(n) {
      return Rf(n);
    }
    bypassSecurityTrustResourceUrl(n) {
      return xf(n);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var U$1 = `primary`;
var Ts = Symbol(`RouteTitle`);
var Xp = class {
  params;
  constructor(t) {
    this.params = t || {};
  }
  has(t) {
    return Object.hasOwn(this.params, t);
  }
  get(t) {
    if (this.has(t)) {
      let n = this.params[t];
      return Array.isArray(n) ? n[0] : n;
    }
    return null;
  }
  getAll(t) {
    if (this.has(t)) {
      let n = this.params[t];
      return Array.isArray(n) ? n : [n];
    }
    return [];
  }
  get keys() {
    return Object.keys(this.params);
  }
};
function Ur(e) {
  return new Xp(e);
}
function Wp(e, t, n) {
  for (let r = 0; r < e.length; r++) {
    let o = e[r],
      i = t[r];
    if (o[0] === `:`) n[o.substring(1)] = i;
    else if (o !== i.path) return !1;
  }
  return !0;
}
function CD(e, t, n) {
  let r = n.path.split(`/`),
    o = r.indexOf(`**`);
  if (o === -1) {
    if (r.length > e.length || (n.pathMatch === `full` && (t.hasChildren() || r.length < e.length)))
      return null;
    let c = {},
      d = e.slice(0, r.length);
    return Wp(r, d, c) ? { consumed: d, posParams: c } : null;
  }
  if (o !== r.lastIndexOf(`**`)) return null;
  let i = r.slice(0, o),
    s = r.slice(o + 1);
  if (
    i.length + s.length > e.length ||
    (n.pathMatch === `full` && t.hasChildren() && n.path !== `**`)
  )
    return null;
  let a = {};
  return !Wp(i, e.slice(0, i.length), a) || !Wp(s, e.slice(e.length - s.length), a)
    ? null
    : { consumed: e, posParams: a };
}
function gl(e) {
  return new Promise((t, n) => {
    e.pipe(sn()).subscribe({ next: (r) => t(r), error: (r) => n(r) });
  });
}
function ax(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; ++n) if (!Zt(e[n], t[n])) return !1;
  return !0;
}
function Zt(e, t) {
  let n = e ? Jp(e) : void 0,
    r = t ? Jp(t) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let o;
  for (let i = 0; i < n.length; i++) if (((o = n[i]), !ID(e[o], t[o]))) return !1;
  return !0;
}
function Jp(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function ID(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1;
    let n = [...e].sort(),
      r = [...t].sort();
    return n.every((o, i) => r[i] === o);
  } else return e === t;
}
function cx(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function Ss(e) {
  return va(e) ? e : jo(e) ? ve$1(Promise.resolve(e)) : I$1(e);
}
function TD(e) {
  return va(e) ? gl(e) : Promise.resolve(e);
}
var lx = { exact: _D, subset: ND };
var SD = { exact: ux, subset: dx, ignored: () => !0 };
var MD = { paths: `exact`, fragment: `ignored`, matrixParams: `ignored`, queryParams: `exact` };
var ml = { paths: `subset`, fragment: `ignored`, matrixParams: `ignored`, queryParams: `subset` };
function eh(e, t, n) {
  let r = C(C({}, ml), n || {});
  return (
    lx[r.paths](e.root, t.root, r.matrixParams) &&
    SD[r.queryParams](e.queryParams, t.queryParams) &&
    !(r.fragment === `exact` && e.fragment !== t.fragment)
  );
}
function ux(e, t) {
  return Zt(e, t);
}
function _D(e, t, n) {
  if (
    !Br(e.segments, t.segments) ||
    !fl(e.segments, t.segments, n) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let r in t.children) if (!e.children[r] || !_D(e.children[r], t.children[r], n)) return !1;
  return !0;
}
function dx(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length && Object.keys(t).every((n) => ID(e[n], t[n]))
  );
}
function ND(e, t, n) {
  return AD(e, t, t.segments, n);
}
function AD(e, t, n, r) {
  if (e.segments.length > n.length) {
    let o = e.segments.slice(0, n.length);
    return !(!Br(o, n) || t.hasChildren() || !fl(o, n, r));
  } else if (e.segments.length === n.length) {
    if (!Br(e.segments, n) || !fl(e.segments, n, r)) return !1;
    for (let o in t.children) if (!e.children[o] || !ND(e.children[o], t.children[o], r)) return !1;
    return !0;
  } else {
    let o = n.slice(0, e.segments.length),
      i = n.slice(e.segments.length);
    return !Br(e.segments, o) || !fl(e.segments, o, r) || !e.children[U$1]
      ? !1
      : AD(e.children[U$1], t, i, r);
  }
}
function fl(e, t, n) {
  return t.every((r, o) => SD[n](e[o].parameters, r.parameters));
}
var ct = class {
  root;
  queryParams;
  fragment;
  _queryParamMap;
  constructor(t = new Q([], {}), n = {}, r = null) {
    ((this.root = t), (this.queryParams = n), (this.fragment = r));
  }
  get queryParamMap() {
    return ((this._queryParamMap ??= Ur(this.queryParams)), this._queryParamMap);
  }
  toString() {
    return gx.serialize(this);
  }
};
var Q = class {
  segments;
  children;
  parent = null;
  constructor(t, n) {
    ((this.segments = t), (this.children = n), Object.values(n).forEach((r) => (r.parent = this)));
  }
  hasChildren() {
    return this.numberOfChildren > 0;
  }
  get numberOfChildren() {
    return Object.keys(this.children).length;
  }
  toString() {
    return pl(this);
  }
};
var Yn = class {
  path;
  parameters;
  _parameterMap;
  constructor(t, n) {
    ((this.path = t), (this.parameters = n));
  }
  get parameterMap() {
    return ((this._parameterMap ??= Ur(this.parameters)), this._parameterMap);
  }
  toString() {
    return xD(this);
  }
};
function fx(e, t) {
  return Br(e, t) && e.every((n, r) => Zt(n.parameters, t[r].parameters));
}
function Br(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path);
}
function px(e, t) {
  let n = [];
  return (
    Object.entries(e.children).forEach(([r, o]) => {
      r === U$1 && (n = n.concat(t(o, r)));
    }),
    Object.entries(e.children).forEach(([r, o]) => {
      r !== U$1 && (n = n.concat(t(o, r)));
    }),
    n
  );
}
var Yo = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: () => new Zn() });
  }
  return e;
})();
var Zn = class {
  parse(t) {
    let n = new nh(t);
    return new ct(n.parseRootSegment(), n.parseQueryParams(), n.parseFragment());
  }
  serialize(t) {
    let n = `/${Uo(t.root, !0)}`;
    hx(n) && (n = `/`);
    let r = wx(t.queryParams),
      o = typeof t.fragment == `string` ? `#${yx(t.fragment)}` : ``;
    return `${n}${r}${o}`;
  }
};
var mD = `http://fake`;
function hx(e) {
  try {
    let t = new URL(e, mD);
    return t.origin !== mD || t.pathname.startsWith(`//`);
  } catch {
    return !0;
  }
}
var gx = new Zn();
function pl(e) {
  return e.segments.map((t) => xD(t)).join(`/`);
}
function Uo(e, t) {
  if (!e.hasChildren()) return pl(e);
  if (t) {
    let n = e.children[U$1] ? Uo(e.children[U$1], !1) : ``,
      r = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== U$1 && r.push(`${o}:${Uo(i, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join(`//`)})` : n
    );
  } else {
    if (Object.keys(e.children).length === 1 && e.children[U$1] != null)
      return `${pl(e)}/${Uo(e.children[U$1], !1)}`;
    let n = px(e, (r, o) => (o === U$1 ? [mx(Uo(e.children[U$1], !1))] : [`${o}:${Uo(r, !1)}`]));
    return `${pl(e)}/(${n.join(`//`)})`;
  }
}
function mx(e) {
  return e.replace(OD, (t) => t.replace(/:/g, `%3A`));
}
function RD(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, `@`)
    .replace(/%3A/gi, `:`)
    .replace(/%24/g, `$`)
    .replace(/%2C/gi, `,`);
}
function ul(e) {
  return RD(e).replace(/%3B/gi, `;`);
}
function yx(e) {
  return encodeURI(e);
}
function th(e) {
  return RD(e).replace(/\(/g, `%28`).replace(/\)/g, `%29`).replace(/%26/gi, `&`);
}
function hl(e) {
  return decodeURIComponent(e);
}
function yD(e) {
  return hl(e.replace(/\+/g, `%20`));
}
function xD(e) {
  return `${th(e.path)}${vx(e.parameters)}`;
}
function vx(e) {
  return Object.entries(e)
    .map(([t, n]) => `;${th(t)}=${th(n)}`)
    .join(``);
}
function wx(e) {
  let t = Object.entries(e)
    .map(([n, r]) =>
      Array.isArray(r) ? r.map((o) => `${ul(n)}=${ul(o)}`).join(`&`) : `${ul(n)}=${ul(r)}`,
    )
    .filter((n) => n);
  return t.length ? `?${t.join(`&`)}` : ``;
}
var Yp = 1073741824;
function yl(e, t, n) {
  (Number(t) >= 32 && !Object.hasOwn(e, Yp) && ((e[Yp] = n), delete e[Yp]), (e[t] = n));
}
var OD = /^[^\/()?;#]+/;
function Zp(e) {
  let t = e.match(OD);
  return t ? t[0] : ``;
}
var bx = /^[^\/()?;=#]+/;
function Dx(e) {
  let t = e.match(bx);
  return t ? t[0] : ``;
}
var Ex = /^[^=?&#]+/;
function Cx(e) {
  let t = e.match(Ex);
  return t ? t[0] : ``;
}
var Ix = /^[^&#]+/;
function Tx(e) {
  let t = e.match(Ix);
  return t ? t[0] : ``;
}
var nh = class {
  url;
  remaining;
  constructor(t) {
    ((this.url = t), (this.remaining = t));
  }
  parseRootSegment() {
    for (; this.consumeOptional(`/`););
    return this.remaining === `` || this.peekStartsWith(`?`) || this.peekStartsWith(`#`)
      ? new Q([], {})
      : new Q([], this.parseChildren());
  }
  parseQueryParams() {
    let t = {};
    if (this.consumeOptional(`?`))
      do this.parseQueryParam(t);
      while (this.consumeOptional(`&`));
    return t;
  }
  parseFragment() {
    return this.consumeOptional(`#`) ? decodeURIComponent(this.remaining) : null;
  }
  parseChildren(t = 0) {
    if (t > 50) throw new M(4010, !1);
    if (this.remaining === ``) return {};
    this.consumeOptional(`/`);
    let n = [];
    for (
      this.peekStartsWith(`(`) || n.push(this.parseSegment());
      this.peekStartsWith(`/`) && !this.peekStartsWith(`//`) && !this.peekStartsWith(`/(`);
    )
      (this.capture(`/`), n.push(this.parseSegment()));
    let r = {};
    this.peekStartsWith(`/(`) && (this.capture(`/`), (r = this.parseParens(!0, t)));
    let o = {};
    return (
      this.peekStartsWith(`(`) && (o = this.parseParens(!1, t)),
      (n.length > 0 || Object.keys(r).length > 0) && (o[U$1] = new Q(n, r)),
      o
    );
  }
  parseSegment() {
    let t = Zp(this.remaining);
    if (t === `` && this.peekStartsWith(`;`)) throw new M(4009, !1);
    return (this.capture(t), new Yn(hl(t), this.parseMatrixParams()));
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(`;`);) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let n = Dx(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = ``;
    if (this.consumeOptional(`=`)) {
      let o = Zp(this.remaining);
      o && ((r = o), this.capture(r));
    }
    yl(t, hl(n), hl(r));
  }
  parseQueryParam(t) {
    let n = Cx(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = ``;
    if (this.consumeOptional(`=`)) {
      let s = Tx(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let o = yD(n),
      i = yD(r);
    if (Object.hasOwn(t, o)) {
      let s = t[o];
      (Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i));
    } else t[o] = i;
  }
  parseParens(t, n) {
    let r = Object.create(null);
    for (this.capture(`(`); !this.consumeOptional(`)`) && this.remaining.length > 0;) {
      let o = Zp(this.remaining),
        i = this.remaining[o.length];
      if (i !== `/` && i !== `)` && i !== `;`) throw new M(4010, !1);
      let s;
      o.indexOf(`:`) > -1
        ? ((s = o.slice(0, o.indexOf(`:`))), this.capture(s), this.capture(`:`))
        : t && (s = U$1);
      let a = this.parseChildren(n + 1),
        c = Object.keys(a).length === 1 && a[U$1] ? a[U$1] : new Q([], a);
      (yl(r, s ?? U$1, c), this.consumeOptional(`//`));
    }
    return r;
  }
  peekStartsWith(t) {
    return this.remaining.startsWith(t);
  }
  consumeOptional(t) {
    return this.peekStartsWith(t)
      ? ((this.remaining = this.remaining.substring(t.length)), !0)
      : !1;
  }
  capture(t) {
    if (!this.consumeOptional(t)) throw new M(4011, !1);
  }
};
function kD(e) {
  return e.segments.length > 0 ? new Q([], { [U$1]: e }) : e;
}
function PD(e) {
  let t = Object.create(null);
  for (let [r, o] of Object.entries(e.children)) {
    let i = PD(o);
    if (r === U$1 && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) yl(t, s, a);
    else (i.segments.length > 0 || i.hasChildren()) && yl(t, r, i);
  }
  return Sx(new Q(e.segments, t));
}
function Sx(e) {
  if (e.numberOfChildren === 1 && e.children[U$1]) {
    let t = e.children[U$1];
    return new Q(e.segments.concat(t.segments), t.children);
  }
  return e;
}
function Kn(e) {
  return e instanceof ct;
}
function LD(e, t, n = null, r = null, o = new Zn()) {
  return jD(FD(e), t, n, r, o);
}
function FD(e) {
  let t;
  function n(i) {
    let s = {};
    for (let c of i.children) {
      let d = n(c);
      s[c.outlet] = d;
    }
    let a = new Q(i.url, s);
    return (i === e && (t = a), a);
  }
  let o = kD(n(e.root));
  return t ?? o;
}
function jD(e, t, n, r, o) {
  let i = e;
  for (; i.parent;) i = i.parent;
  if (t.length === 0) return Kp(i, i, i, n, r, o);
  let s = Mx(t);
  if (s.toRoot()) return Kp(i, i, new Q([], {}), n, r, o);
  let a = _x(s, i, e),
    c = a.processChildren
      ? ps(a.segmentGroup, a.index, s.commands)
      : UD(a.segmentGroup, a.index, s.commands);
  return Kp(i, a.segmentGroup, c, n, r, o);
}
function vl(e) {
  return typeof e == `object` && e != null && !e.outlets && !e.segmentPath;
}
function ys(e) {
  return typeof e == `object` && e != null && e.outlets;
}
function vD(e, t, n) {
  e ||= `ɵ`;
  let r = new ct();
  return ((r.queryParams = { [e]: t }), n.parse(n.serialize(r)).queryParams[e]);
}
function Kp(e, t, n, r, o, i) {
  let s = {};
  for (let [d, h] of Object.entries(r ?? {}))
    h != null && (s[d] = Array.isArray(h) ? h.map((p) => vD(d, p, i)) : vD(d, h, i));
  let a;
  e === t ? (a = n) : (a = BD(e, t, n));
  return new ct(kD(PD(a)), s, o);
}
function BD(e, t, n) {
  let r = Object.create(null);
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === t ? (r[o] = n) : (r[o] = BD(i, t, n));
    }),
    new Q(e.segments, r)
  );
}
var wl = class {
  isAbsolute;
  numberOfDoubleDots;
  commands;
  constructor(t, n, r) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      t && r.length > 0 && vl(r[0]))
    )
      throw new M(4003, !1);
    let o = r.find(ys);
    if (o && o !== cx(r)) throw new M(4004, !1);
  }
  toRoot() {
    return this.isAbsolute && this.commands.length === 1 && this.commands[0] == `/`;
  }
};
function Mx(e) {
  if (typeof e[0] == `string` && e.length === 1 && e[0] === `/`) return new wl(!0, 0, e);
  let t = 0,
    n = !1,
    r = e.reduce((o, i, s) => {
      if (typeof i == `object` && i != null) {
        if (i.outlets) {
          let a = {};
          return (
            Object.entries(i.outlets).forEach(([c, d]) => {
              a[c] = typeof d == `string` ? d.split(`/`) : d;
            }),
            [...o, { outlets: a }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != `string`
        ? [...o, i]
        : s === 0
          ? (i.split(`/`).forEach((a, c) => {
              (c == 0 && a === `.`) ||
                (c == 0 && a === `` ? (n = !0) : a === `..` ? t++ : a != `` && o.push(a));
            }),
            o)
          : [...o, i];
    }, []);
  return new wl(n, t, r);
}
var Ho = class {
  segmentGroup;
  processChildren;
  index;
  constructor(t, n, r) {
    ((this.segmentGroup = t), (this.processChildren = n), (this.index = r));
  }
};
function _x(e, t, n) {
  if (e.isAbsolute) return new Ho(t, !0, 0);
  if (!n) return new Ho(t, !1, NaN);
  if (n.parent === null) return new Ho(n, !0, 0);
  let r = vl(e.commands[0]) ? 0 : 1;
  return Nx(n, n.segments.length - 1 + r, e.numberOfDoubleDots);
}
function Nx(e, t, n) {
  let r = e,
    o = t,
    i = n;
  for (; i > o;) {
    if (((i -= o), (r = r.parent), !r)) throw new M(4005, !1);
    o = r.segments.length;
  }
  return new Ho(r, !1, o - i);
}
function Ax(e) {
  return ys(e[0]) ? e[0].outlets : { [U$1]: e };
}
function UD(e, t, n) {
  if (((e ??= new Q([], {})), e.segments.length === 0 && e.hasChildren())) return ps(e, t, n);
  let r = Rx(e, t, n),
    o = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new Q(e.segments.slice(0, r.pathIndex), {});
    return ((i.children[U$1] = new Q(e.segments.slice(r.pathIndex), e.children)), ps(i, 0, o));
  } else
    return r.match && o.length === 0
      ? new Q(e.segments, {})
      : r.match && !e.hasChildren()
        ? rh(e, t, n)
        : r.match
          ? ps(e, 0, o)
          : rh(e, t, n);
}
function ps(e, t, n) {
  if (n.length === 0) return new Q(e.segments, {});
  {
    let r = Ax(n),
      o = Object.create(null);
    if (
      Object.keys(r).some((i) => i !== U$1) &&
      e.children[U$1] &&
      e.numberOfChildren === 1 &&
      e.children[U$1].segments.length === 0
    ) {
      let i = ps(e.children[U$1], t, n);
      return new Q(e.segments, i.children);
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        (typeof s == `string` && (s = [s]), s !== null && (o[i] = UD(e.children[i], t, s)));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s);
      }),
      new Q(e.segments, o)
    );
  }
}
function Rx(e, t, n) {
  let r = 0,
    o = t,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length;) {
    if (r >= n.length) return i;
    let s = e.segments[o],
      a = n[r];
    if (ys(a)) break;
    let c = `${a}`,
      d = r < n.length - 1 ? n[r + 1] : null;
    if (o > 0 && c === void 0) break;
    if (c && d && typeof d == `object` && d.outlets === void 0) {
      if (!bD(c, d, s)) return i;
      r += 2;
    } else {
      if (!bD(c, {}, s)) return i;
      r++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: r };
}
function rh(e, t, n) {
  let r = e.segments.slice(0, t),
    o = 0;
  for (; o < n.length;) {
    let i = n[o];
    if (ys(i)) return new Q(r, xx(i.outlets));
    if (o === 0 && vl(n[0])) {
      let c = e.segments[t];
      (r.push(new Yn(c.path, wD(n[0]))), o++);
      continue;
    }
    let s = ys(i) ? i.outlets[U$1] : `${i}`,
      a = o < n.length - 1 ? n[o + 1] : null;
    s && a && vl(a) ? (r.push(new Yn(s, wD(a))), (o += 2)) : (r.push(new Yn(s, {})), o++);
  }
  return new Q(r, {});
}
function xx(e) {
  let t = {};
  return (
    Object.entries(e).forEach(([n, r]) => {
      (typeof r == `string` && (r = [r]), r !== null && (t[n] = rh(new Q([], {}), 0, r)));
    }),
    t
  );
}
function wD(e) {
  let t = {};
  return (Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t);
}
function bD(e, t, n) {
  return e == n.path && Zt(t, n.parameters);
}
var bl = class {
  rootInjector;
  outlet = null;
  route = null;
  children;
  attachRef = null;
  get injector() {
    return this.route?.snapshot._environmentInjector ?? this.rootInjector;
  }
  constructor(t) {
    ((this.rootInjector = t), (this.children = new Vr(this.rootInjector)));
  }
  resetChildren() {
    this.children = new Vr(this.rootInjector);
  }
};
var Vr = (() => {
  class e {
    rootInjector;
    contexts = /* @__PURE__ */ new Map();
    constructor(n) {
      this.rootInjector = n;
    }
    onChildOutletCreated(n, r) {
      let o = this.getOrCreateContext(n);
      ((o.outlet = r), this.contexts.set(n, o));
    }
    onChildOutletDestroyed(n) {
      let r = this.getContext(n);
      r && ((r.outlet = null), (r.attachRef = null));
    }
    onOutletDeactivated() {
      let n = this.contexts;
      return ((this.contexts = /* @__PURE__ */ new Map()), n);
    }
    onOutletReAttached(n) {
      this.contexts = n;
    }
    getOrCreateContext(n) {
      let r = this.getContext(n);
      return (r || ((r = new bl(this.rootInjector)), this.contexts.set(n, r)), r);
    }
    getContext(n) {
      return this.contexts.get(n) || null;
    }
    static ɵfac = function (r) {
      return new (r || e)(N(we$1));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
  }
  return e;
})();
var Dl = class {
  _root;
  constructor(t) {
    this._root = t;
  }
  get root() {
    return this._root.value;
  }
  parent(t) {
    let n = this.pathFromRoot(t);
    return n.length > 1 ? n[n.length - 2] : null;
  }
  children(t) {
    let n = oh(t, this._root);
    return n ? n.children.map((r) => r.value) : [];
  }
  firstChild(t) {
    let n = oh(t, this._root);
    return n && n.children.length > 0 ? n.children[0].value : null;
  }
  siblings(t) {
    let n = ih(t, this._root);
    return n.length < 2 ? [] : n[n.length - 2].children.map((o) => o.value).filter((o) => o !== t);
  }
  pathFromRoot(t) {
    return ih(t, this._root).map((n) => n.value);
  }
};
function oh(e, t) {
  if (e === t.value) return t;
  for (let n of t.children) {
    let r = oh(e, n);
    if (r) return r;
  }
  return null;
}
function ih(e, t) {
  if (e === t.value) return [t];
  for (let n of t.children) {
    let r = ih(e, n);
    if (r.length) return (r.unshift(t), r);
  }
  return [];
}
var Ye = class {
  value;
  children;
  constructor(t, n) {
    ((this.value = t), (this.children = n));
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Vo(e) {
  let t = {};
  return (e && e.children.forEach((n) => (t[n.value.outlet] = n)), t);
}
var vs = class extends Dl {
  snapshot;
  constructor(t, n) {
    (super(t), (this.snapshot = n), gh(this, t));
  }
  toString() {
    return this.snapshot.toString();
  }
};
function VD(e, t) {
  let n = Ox(e, t),
    r = new Pe$1([new Yn(``, {})]),
    o = new Pe$1({}),
    i = new Pe$1({}),
    c = new In(r, o, new Pe$1({}), new Pe$1(``), i, U$1, e, n.root);
  return ((c.snapshot = n.root), new vs(new Ye(c, []), n));
}
function Ox(e, t) {
  return new ws(``, new Ye(new zo([], {}, {}, ``, {}, U$1, e, null, {}, t), []));
}
var In = class {
  urlSubject;
  paramsSubject;
  queryParamsSubject;
  fragmentSubject;
  dataSubject;
  outlet;
  component;
  snapshot;
  _futureSnapshot;
  _routerState;
  _paramMap;
  _queryParamMap;
  title;
  url;
  params;
  queryParams;
  fragment;
  data;
  resources;
  _localInjector;
  pending;
  paramsSignal;
  queryParamsSignal;
  paramMapSignal;
  queryParamMapSignal;
  fragmentSignal;
  dataSignal;
  constructor(t, n, r, o, i, s, a, c) {
    ((this.urlSubject = t),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(ne((d) => d[Ts])) ?? I$1(void 0)),
      (this.url = t),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = o),
      (this.data = i));
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return ((this._paramMap ??= this.params.pipe(ne((t) => Ur(t)))), this._paramMap);
  }
  get queryParamMap() {
    return ((this._queryParamMap ??= this.queryParams.pipe(ne((t) => Ur(t)))), this._queryParamMap);
  }
  toString() {
    return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
  }
  _setPending(t) {
    ((this._futureSnapshot = t), this.pending?.set(!0));
  }
};
var kx = `always`;
function hh(e, t, n) {
  let r,
    { routeConfig: o } = e;
  return (
    t !== null &&
    (n === `always` || o?.path === `` || (!t.component && !t.routeConfig?.loadComponent))
      ? (r = {
          params:
            Object.keys(e.params).length === 0
              ? t.params
              : Object.freeze(C(C({}, t.params), e.params)),
          data: Object.freeze(C(C({}, t.data), e.data)),
          resolve: C(C(C(C({}, e.data), t.data), o?.data), e._resolvedData),
        })
      : (r = {
          params: Object.freeze(C({}, e.params)),
          data: Object.freeze(C({}, e.data)),
          resolve: C(C({}, e.data), e._resolvedData ?? {}),
        }),
    o && $D(o) && (r.resolve[Ts] = o.title),
    r
  );
}
var zo = class {
  url;
  params;
  queryParams;
  fragment;
  data;
  outlet;
  component;
  routeConfig;
  _resolve;
  _resolvedData;
  _routerState;
  _paramMap;
  _queryParamMap;
  _environmentInjector;
  resources;
  get title() {
    return this.data?.[Ts];
  }
  constructor(t, n, r, o, i, s, a, c, d, h) {
    ((this.url = t),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = o),
      (this.data = i),
      (this.outlet = s),
      (this.component = a),
      (this.routeConfig = c),
      (this._resolve = d),
      (this._environmentInjector = h));
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return ((this._paramMap ??= Ur(this.params)), this._paramMap);
  }
  get queryParamMap() {
    return ((this._queryParamMap ??= Ur(this.queryParams)), this._queryParamMap);
  }
  toString() {
    return `Route(url:'${this.url.map((r) => r.toString()).join(`/`)}', path:'${this.routeConfig ? this.routeConfig.path : ``}')`;
  }
};
var ws = class extends Dl {
  url;
  constructor(t, n) {
    (super(n), (this.url = t), gh(this, n));
  }
  toString() {
    return HD(this._root);
  }
};
function gh(e, t) {
  ((t.value._routerState = e), t.children.forEach((n) => gh(e, n)));
}
function HD(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(HD).join(`, `)} } ` : ``;
  return `${e.value}${t}`;
}
function Qp(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      n = e._futureSnapshot;
    ((e.snapshot = n),
      Zt(t.queryParams, n.queryParams) || e.queryParamsSubject.next(n.queryParams),
      t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
      Zt(t.params, n.params) || e.paramsSubject.next(n.params),
      ax(t.url, n.url) || e.urlSubject.next(n.url),
      Zt(t.data, n.data) || e.dataSubject.next(n.data));
  } else ((e.snapshot = e._futureSnapshot), e.dataSubject.next(e._futureSnapshot.data));
}
function sh(e, t) {
  let n = Zt(e.params, t.params) && fx(e.url, t.url),
    r = !e.parent != !t.parent;
  return n && !r && (!e.parent || sh(e.parent, t.parent));
}
function $D(e) {
  return typeof e.title == `string` || e.title === null;
}
var zD = new A(``);
var mh = (() => {
  class e {
    activated = null;
    get activatedComponentRef() {
      return this.activated;
    }
    _activatedRoute = null;
    name = U$1;
    activateEvents = new Ge();
    deactivateEvents = new Ge();
    attachEvents = new Ge();
    detachEvents = new Ge();
    routerOutletData = Yc();
    parentContexts = b(Vr);
    location = b(Wn);
    changeDetector = b(Zc);
    inputBinder = b(kl, { optional: !0 });
    supportsBindingToComponentInputs = !0;
    ngOnChanges(n) {
      if (n.name) {
        let { firstChange: r, previousValue: o } = n.name;
        if (r) return;
        (this.isTrackedInParentContexts(o) &&
          (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
          this.initializeOutletWithName());
      }
    }
    ngOnDestroy() {
      (this.isTrackedInParentContexts(this.name) &&
        this.parentContexts.onChildOutletDestroyed(this.name),
        this.inputBinder?.unsubscribeFromRouteData(this));
    }
    isTrackedInParentContexts(n) {
      return this.parentContexts.getContext(n)?.outlet === this;
    }
    ngOnInit() {
      this.initializeOutletWithName();
    }
    initializeOutletWithName() {
      if ((this.parentContexts.onChildOutletCreated(this.name, this), this.activated)) return;
      let n = this.parentContexts.getContext(this.name);
      n?.route &&
        (n.attachRef ? this.attach(n.attachRef, n.route) : this.activateWith(n.route, n.injector));
    }
    get isActivated() {
      return !!this.activated;
    }
    get component() {
      if (!this.activated) throw new M(4012, !1);
      return this.activated.instance;
    }
    get activatedRoute() {
      if (!this.activated) throw new M(4012, !1);
      return this._activatedRoute;
    }
    get activatedRouteData() {
      return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
    }
    detach() {
      if (!this.activated) throw new M(4012, !1);
      this.location.detach();
      let n = this.activated;
      return (
        (this.activated = null),
        (this._activatedRoute = null),
        this.detachEvents.emit(n.instance),
        n
      );
    }
    attach(n, r) {
      ((this.activated = n),
        (this._activatedRoute = r),
        this.location.insert(n.hostView),
        this.inputBinder?.bindActivatedRouteToOutletComponent(this, this.location.injector),
        this.attachEvents.emit(n.instance));
    }
    deactivate() {
      if (this.activated) {
        let n = this.component;
        (this.inputBinder?.unsubscribeFromRouteData(this),
          this.activated.destroy(),
          (this.activated = null),
          (this._activatedRoute = null),
          this.deactivateEvents.emit(n));
      }
    }
    activateWith(n, r) {
      if (this.isActivated) throw new M(4013, !1);
      this._activatedRoute = n;
      let o = this.location,
        s = n.snapshot.component,
        a = this.parentContexts.getOrCreateContext(this.name).children,
        c = new ah(n, a, o.injector, this.routerOutletData);
      ((this.activated = o.createComponent(s, {
        index: o.length,
        injector: c,
        environmentInjector: r,
      })),
        this.changeDetector.markForCheck(),
        this.inputBinder?.bindActivatedRouteToOutletComponent(this, this.location.injector),
        this.activateEvents.emit(this.activated.instance));
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵdir = kr({
      type: e,
      selectors: [[`router-outlet`]],
      inputs: { name: `name`, routerOutletData: [1, `routerOutletData`] },
      outputs: {
        activateEvents: `activate`,
        deactivateEvents: `deactivate`,
        attachEvents: `attach`,
        detachEvents: `detach`,
      },
      exportAs: [`outlet`],
      features: [xr],
    });
  }
  return e;
})();
var ah = class {
  route;
  childContexts;
  parent;
  outletData;
  constructor(t, n, r, o) {
    ((this.route = t), (this.childContexts = n), (this.parent = r), (this.outletData = o));
  }
  get(t, n) {
    return t === In
      ? this.route
      : t === Vr
        ? this.childContexts
        : t === zD
          ? this.outletData
          : this.parent.get(t, n);
  }
};
var kl = new A(``);
var yh = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵcmp = sp({
      type: e,
      selectors: [[`ng-component`]],
      exportAs: [`emptyRouterOutlet`],
      decls: 1,
      vars: 0,
      template: function (r, o) {
        r & 1 && Vc(0, `router-outlet`);
      },
      dependencies: [mh],
      encapsulation: 2,
      changeDetection: 1,
    });
  }
  return e;
})();
function vh(e) {
  let t = e.children && e.children.map(vh),
    n = t ? Y(C({}, e), { children: t }) : C({}, e);
  return (
    !n.component &&
      !n.loadComponent &&
      (t || n.loadChildren) &&
      n.outlet &&
      n.outlet !== U$1 &&
      (n.component = yh),
    n
  );
}
var hs = `imperative`;
var xe$1 = (function (e) {
  return (
    (e[(e.NavigationStart = 0)] = `NavigationStart`),
    (e[(e.NavigationEnd = 1)] = `NavigationEnd`),
    (e[(e.NavigationCancel = 2)] = `NavigationCancel`),
    (e[(e.NavigationError = 3)] = `NavigationError`),
    (e[(e.RoutesRecognized = 4)] = `RoutesRecognized`),
    (e[(e.ResolveStart = 5)] = `ResolveStart`),
    (e[(e.ResolveEnd = 6)] = `ResolveEnd`),
    (e[(e.GuardsCheckStart = 7)] = `GuardsCheckStart`),
    (e[(e.GuardsCheckEnd = 8)] = `GuardsCheckEnd`),
    (e[(e.RouteConfigLoadStart = 9)] = `RouteConfigLoadStart`),
    (e[(e.RouteConfigLoadEnd = 10)] = `RouteConfigLoadEnd`),
    (e[(e.ChildActivationStart = 11)] = `ChildActivationStart`),
    (e[(e.ChildActivationEnd = 12)] = `ChildActivationEnd`),
    (e[(e.ActivationStart = 13)] = `ActivationStart`),
    (e[(e.ActivationEnd = 14)] = `ActivationEnd`),
    (e[(e.Scroll = 15)] = `Scroll`),
    (e[(e.NavigationSkipped = 16)] = `NavigationSkipped`),
    e
  );
})(xe$1 || {});
var lt = class {
  id;
  url;
  constructor(t, n) {
    ((this.id = t), (this.url = n));
  }
};
var Hr = class extends lt {
  type = xe$1.NavigationStart;
  navigationTrigger;
  restoredState;
  constructor(t, n, r = `imperative`, o = null) {
    (super(t, n), (this.navigationTrigger = r), (this.restoredState = o));
  }
  toString() {
    return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
  }
};
var Qt = class extends lt {
  urlAfterRedirects;
  type = xe$1.NavigationEnd;
  constructor(t, n, r) {
    (super(t, n), (this.urlAfterRedirects = r));
  }
  toString() {
    return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
  }
};
var He = (function (e) {
  return (
    (e[(e.Redirect = 0)] = `Redirect`),
    (e[(e.SupersededByNewNavigation = 1)] = `SupersededByNewNavigation`),
    (e[(e.NoDataFromResolver = 2)] = `NoDataFromResolver`),
    (e[(e.GuardRejected = 3)] = `GuardRejected`),
    (e[(e.Aborted = 4)] = `Aborted`),
    e
  );
})(He || {});
var bs = (function (e) {
  return (
    (e[(e.IgnoredSameUrlNavigation = 0)] = `IgnoredSameUrlNavigation`),
    (e[(e.IgnoredByUrlHandlingStrategy = 1)] = `IgnoredByUrlHandlingStrategy`),
    e
  );
})(bs || {});
var Dt = class extends lt {
  reason;
  code;
  type = xe$1.NavigationCancel;
  constructor(t, n, r, o) {
    (super(t, n), (this.reason = r), (this.code = o));
  }
  toString() {
    return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
  }
};
function qD(e) {
  return e instanceof Dt && (e.code === He.Redirect || e.code === He.SupersededByNewNavigation);
}
var Tn = class extends lt {
  reason;
  code;
  type = xe$1.NavigationSkipped;
  constructor(t, n, r, o) {
    (super(t, n), (this.reason = r), (this.code = o));
  }
};
var $r = class extends lt {
  error;
  target;
  type = xe$1.NavigationError;
  constructor(t, n, r, o) {
    (super(t, n), (this.error = r), (this.target = o));
  }
  toString() {
    return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
  }
};
var Ds = class extends lt {
  urlAfterRedirects;
  state;
  type = xe$1.RoutesRecognized;
  constructor(t, n, r, o) {
    (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
  }
  toString() {
    return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var El = class extends lt {
  urlAfterRedirects;
  state;
  type = xe$1.GuardsCheckStart;
  constructor(t, n, r, o) {
    (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
  }
  toString() {
    return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var Cl = class extends lt {
  urlAfterRedirects;
  state;
  shouldActivate;
  type = xe$1.GuardsCheckEnd;
  constructor(t, n, r, o, i) {
    (super(t, n), (this.urlAfterRedirects = r), (this.state = o), (this.shouldActivate = i));
  }
  toString() {
    return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
  }
};
var Il = class extends lt {
  urlAfterRedirects;
  state;
  type = xe$1.ResolveStart;
  constructor(t, n, r, o) {
    (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
  }
  toString() {
    return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var Tl = class extends lt {
  urlAfterRedirects;
  state;
  type = xe$1.ResolveEnd;
  constructor(t, n, r, o) {
    (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
  }
  toString() {
    return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var Sl = class {
  route;
  type = xe$1.RouteConfigLoadStart;
  constructor(t) {
    this.route = t;
  }
  toString() {
    return `RouteConfigLoadStart(path: ${this.route.path})`;
  }
};
var Ml = class {
  route;
  type = xe$1.RouteConfigLoadEnd;
  constructor(t) {
    this.route = t;
  }
  toString() {
    return `RouteConfigLoadEnd(path: ${this.route.path})`;
  }
};
var _l = class {
  snapshot;
  type = xe$1.ChildActivationStart;
  constructor(t) {
    this.snapshot = t;
  }
  toString() {
    return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ``}')`;
  }
};
var Nl = class {
  snapshot;
  type = xe$1.ChildActivationEnd;
  constructor(t) {
    this.snapshot = t;
  }
  toString() {
    return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ``}')`;
  }
};
var Al = class {
  snapshot;
  type = xe$1.ActivationStart;
  constructor(t) {
    this.snapshot = t;
  }
  toString() {
    return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ``}')`;
  }
};
var Rl = class {
  snapshot;
  type = xe$1.ActivationEnd;
  constructor(t) {
    this.snapshot = t;
  }
  toString() {
    return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ``}')`;
  }
};
var qo = class {};
var Es = class {};
var Go = class {
  url;
  navigationBehaviorOptions;
  constructor(t, n) {
    ((this.url = t), (this.navigationBehaviorOptions = n));
  }
};
function Px(e) {
  return !(e instanceof qo) && !(e instanceof Go) && !(e instanceof Es);
}
function Lx(e, t, n) {
  let r = /* @__PURE__ */ new Set();
  return { newlyCreatedRoutes: r, state: new vs(Cs(e, t._root, n ? n._root : void 0, r), t) };
}
function Cs(e, t, n, r) {
  if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
    let o = n.value;
    o._setPending(t.value);
    return new Ye(o, Fx(e, t, n, r));
  } else {
    if (e.shouldAttach(t.value)) {
      let s = e.retrieve(t.value);
      if (s !== null) {
        let a = s.route;
        return (
          a.value._setPending(t.value),
          (a.children = t.children.map((c) => Cs(e, c, void 0, r))),
          a
        );
      }
    }
    let o = jx(t.value);
    (o._setPending(t.value), r.add(o));
    return new Ye(
      o,
      t.children.map((s) => Cs(e, s, void 0, r)),
    );
  }
}
function Fx(e, t, n, r) {
  return t.children.map((o) => {
    for (let i of n.children)
      if (e.shouldReuseRoute(o.value, i.value.snapshot)) return Cs(e, o, i, r);
    return Cs(e, o, void 0, r);
  });
}
function jx(e) {
  return new In(
    new Pe$1(e.url),
    new Pe$1(e.params),
    new Pe$1(e.queryParams),
    new Pe$1(e.fragment),
    new Pe$1(e.data),
    e.outlet,
    e.component,
    e,
  );
}
var Qn = class e extends Error {
  redirectTo;
  navigationBehaviorOptions;
  constructor(t, n) {
    (super(),
      (this.redirectTo = t),
      (this.navigationBehaviorOptions = n),
      Object.setPrototypeOf(this, e.prototype));
  }
};
var GD = `ngNavigationCancelingError`;
function gs(e, t) {
  let { redirectTo: n, navigationBehaviorOptions: r } = Kn(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    o = WD(!1, He.Redirect);
  return ((o.url = n), (o.navigationBehaviorOptions = r), o);
}
function WD(e, t) {
  let n = /* @__PURE__ */ new Error(`NavigationCancelingError: ${e || ``}`);
  return ((n[GD] = !0), (n.cancellationCode = t), n);
}
function Bx(e) {
  return YD(e) && Kn(e.url);
}
function YD(e) {
  return !!e && e[GD];
}
var ch = class {
  routeReuseStrategy;
  futureState;
  currState;
  forwardEvent;
  inputBindingEnabled;
  constructor(t, n, r, o, i) {
    ((this.routeReuseStrategy = t),
      (this.futureState = n),
      (this.currState = r),
      (this.forwardEvent = o),
      (this.inputBindingEnabled = i));
  }
  activate(t) {
    let n = this.futureState._root,
      r = this.currState ? this.currState._root : null;
    (this.deactivateChildRoutes(n, r, t),
      Qp(this.futureState.root),
      this.activateChildRoutes(n, r, t));
  }
  deactivateChildRoutes(t, n, r) {
    let o = Vo(n);
    (t.children.forEach((i) => {
      let s = i.value.outlet;
      (this.deactivateRoutes(i, o[s], r), delete o[s]);
    }),
      Object.values(o).forEach((i) => {
        this.deactivateRouteAndItsChildren(i, r);
      }));
  }
  deactivateRoutes(t, n, r) {
    let o = t.value,
      i = n ? n.value : null;
    if (o === i)
      if (o.component) {
        let s = r.getContext(o.outlet);
        s && this.deactivateChildRoutes(t, n, s.children);
      } else this.deactivateChildRoutes(t, n, r);
    else i && this.deactivateRouteAndItsChildren(n, r);
  }
  deactivateRouteAndItsChildren(t, n) {
    t.value.component && this.routeReuseStrategy.shouldDetach(t.value.snapshot)
      ? this.detachAndStoreRouteSubtree(t, n)
      : this.deactivateRouteAndOutlet(t, n);
  }
  detachAndStoreRouteSubtree(t, n) {
    let r = n.getContext(t.value.outlet),
      o = r && t.value.component ? r.children : n,
      i = Vo(t);
    for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
    if (r && r.outlet) {
      let s = r.outlet.detach(),
        a = r.children.contexts;
      (r.resetChildren(),
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: s,
          route: t,
          contexts: a,
        }));
    }
  }
  deactivateRouteAndOutlet(t, n) {
    let r = n.getContext(t.value.outlet),
      o = r && t.value.component ? r.children : n,
      i = Vo(t);
    for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
    (r &&
      (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
      (r.attachRef = null),
      (r.route = null)),
      t.value._localInjector?.destroy());
  }
  activateChildRoutes(t, n, r) {
    let o = Vo(n);
    (t.children.forEach((i) => {
      (this.activateRoutes(i, o[i.value.outlet], r), this.forwardEvent(new Rl(i.value.snapshot)));
    }),
      t.children.length && this.forwardEvent(new Nl(t.value.snapshot)));
  }
  activateRoutes(t, n, r) {
    let o = t.value,
      i = n ? n.value : null;
    if ((Qp(o), o === i))
      if (o.component) {
        let s = r.getOrCreateContext(o.outlet);
        this.activateChildRoutes(t, n, s.children);
      } else this.activateChildRoutes(t, n, r);
    else if (o.component) {
      let s = r.getOrCreateContext(o.outlet);
      if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
        let a = this.routeReuseStrategy.retrieve(o.snapshot);
        (this.routeReuseStrategy.store(o.snapshot, null),
          s.children.onOutletReAttached(a.contexts),
          (s.attachRef = a.componentRef),
          (s.route = a.route.value),
          s.outlet && s.outlet.attach(a.componentRef, a.route.value),
          Qp(a.route.value),
          this.activateChildRoutes(t, null, s.children));
      } else
        ((s.attachRef = null),
          (s.route = o),
          s.outlet && s.outlet.activateWith(o, s.injector),
          this.activateChildRoutes(t, null, s.children));
    } else this.activateChildRoutes(t, null, r);
  }
};
var xl = class {
  path;
  route;
  constructor(t) {
    ((this.path = t), (this.route = this.path[this.path.length - 1]));
  }
};
var $o = class {
  component;
  route;
  constructor(t, n) {
    ((this.component = t), (this.route = n));
  }
};
function Ux(e, t, n) {
  let r = e._root;
  return fs(r, t ? t._root : null, n, [r.value]);
}
function Vx(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: e, guards: t };
}
function Zo(e, t) {
  let n = Symbol(),
    r = t.get(e, n);
  return r === n ? (typeof e == `function` && !Gu(e) ? e : t.get(e)) : r;
}
function fs(e, t, n, r, o = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let i = Vo(t);
  return (
    e.children.forEach((s) => {
      (Hx(s, i[s.value.outlet], n, r.concat([s.value]), o), delete i[s.value.outlet]);
    }),
    Object.entries(i).forEach(([s, a]) => ms(a, n.getContext(s), n, o)),
    o
  );
}
function Hx(e, t, n, r, o = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let i = e.value,
    s = t ? t.value : null,
    a = n ? n.getContext(e.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let c = $x(s, i, i.routeConfig.runGuardsAndResolvers);
    (c
      ? o.canActivateChecks.push(new xl(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? fs(e, t, a ? a.children : null, r, o) : fs(e, t, n, r, o),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new $o(a.outlet.component, s)));
  } else
    (s && ms(t, a, n, o),
      o.canActivateChecks.push(new xl(r)),
      i.component ? fs(e, null, a ? a.children : null, r, o) : fs(e, null, n, r, o));
  return o;
}
function $x(e, t, n) {
  if (typeof n == `function`) return Ne(t._environmentInjector, () => n(e, t));
  switch (n) {
    case `pathParamsChange`:
      return !Br(e.url, t.url);
    case `pathParamsOrQueryParamsChange`:
      return !Br(e.url, t.url) || !Zt(e.queryParams, t.queryParams);
    case `always`:
      return !0;
    case `paramsOrQueryParamsChange`:
      return !sh(e, t) || !Zt(e.queryParams, t.queryParams);
    default:
      return !sh(e, t);
  }
}
function ms(e, t, n, r) {
  let o = Vo(e),
    i = e.value;
  (Object.entries(o).forEach(([s, a]) => {
    i.component
      ? t
        ? ms(a, t.children.getContext(s), t.children, r)
        : ms(a, null, null, r)
      : ms(a, n ? n.getContext(s) : null, n, r);
  }),
    i.component
      ? t && t.outlet && t.outlet.isActivated
        ? r.canDeactivateChecks.push(new $o(t.outlet.component, i))
        : r.canDeactivateChecks.push(new $o(null, i))
      : r.canDeactivateChecks.push(new $o(null, i)));
}
function Ms(e) {
  return typeof e == `function`;
}
function zx(e) {
  return typeof e == `boolean`;
}
function qx(e) {
  return e && Ms(e.canLoad);
}
function Gx(e) {
  return e && Ms(e.canActivate);
}
function Wx(e) {
  return e && Ms(e.canActivateChild);
}
function Yx(e) {
  return e && Ms(e.canDeactivate);
}
function Zx(e) {
  return e && Ms(e.canMatch);
}
function ZD(e) {
  return e instanceof lr || e?.name === `EmptyError`;
}
var dl = Symbol(`INITIAL_VALUE`);
function Wo() {
  return Xe((e) =>
    Mu(
      e.map((t) =>
        t.pipe(
          Ln(1),
          re((n) => {
            if (n instanceof Qn) return I$1(n);
            throw n;
          }),
          Ia(dl),
        ),
      ),
    ).pipe(
      ne((t) => {
        for (let n of t)
          if (n !== !0) {
            if (n === dl) return dl;
            if (n === !1 || Kx(n)) return n;
          }
        return !0;
      }),
      Qe((t) => t !== dl),
      Ln(1),
    ),
  );
}
function Kx(e) {
  return Kn(e) || e instanceof Qn;
}
function KD(e) {
  return new F$1((t) => {
    if (e.aborted) {
      (t.next(), t.complete());
      return;
    }
    let n = () => {
      (t.next(), t.complete());
    };
    return (e.addEventListener(`abort`, n), () => e.removeEventListener(`abort`, n));
  });
}
function QD(e) {
  return hi(KD(e));
}
function Qx(e) {
  return S((t) => {
    let {
      targetSnapshot: n,
      currentSnapshot: r,
      guards: { canActivateChecks: o, canDeactivateChecks: i },
    } = t;
    return i.length === 0 && o.length === 0
      ? I$1(Y(C({}, t), { guardsResult: !0 }))
      : Xx(i, n, r).pipe(
          S((s) => (s && zx(s) ? Jx(n, o, e) : I$1(s))),
          ne((s) => Y(C({}, t), { guardsResult: s })),
        );
  });
}
function Xx(e, t, n) {
  return ve$1(e).pipe(
    S((r) => oO(r.component, r.route, n, t)),
    sn((r) => r !== !0, !0),
  );
}
function Jx(e, t, n) {
  return ve$1(t).pipe(
    fo((r) => uo(tO(r.route.parent, n), eO(r.route, n), rO(e, r.path), nO(e, r.route))),
    sn((r) => r !== !0, !0),
  );
}
function eO(e, t) {
  return (e !== null && t && t(new Al(e)), I$1(!0));
}
function tO(e, t) {
  return (e !== null && t && t(new _l(e)), I$1(!0));
}
function nO(e, t) {
  let n = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!n || n.length === 0) return I$1(!0);
  return I$1(
    n.map((o) =>
      fi(() => {
        let i = t._environmentInjector,
          s = Zo(o, i);
        return Ss(Gx(s) ? s.canActivate(t, e) : Ne(i, () => s(t, e))).pipe(sn());
      }),
    ),
  ).pipe(Wo());
}
function rO(e, t) {
  let n = t[t.length - 1];
  return I$1(
    t
      .slice(0, t.length - 1)
      .reverse()
      .map((i) => Vx(i))
      .filter((i) => i !== null)
      .map((i) =>
        fi(() => {
          return I$1(
            i.guards.map((a) => {
              let c = i.node._environmentInjector,
                d = Zo(a, c);
              return Ss(Wx(d) ? d.canActivateChild(n, e) : Ne(c, () => d(n, e))).pipe(sn());
            }),
          ).pipe(Wo());
        }),
      ),
  ).pipe(Wo());
}
function oO(e, t, n, r) {
  let o = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return I$1(!0);
  return I$1(
    o.map((s) => {
      let a = t._environmentInjector,
        c = Zo(s, a);
      return wh(() => (Yx(c) ? c.canDeactivate(e, t, n, r) : Ne(a, () => c(e, t, n, r)))).pipe(
        sn(),
      );
    }),
  ).pipe(Wo());
}
function iO(e, t, n, r, o) {
  let i = t.canLoad;
  if (i === void 0 || i.length === 0) return I$1(!0);
  return I$1(
    i.map((a) => {
      let c = Zo(a, e),
        d = wh(() => (qx(c) ? c.canLoad(t, n) : Ne(e, () => c(t, n))));
      return o ? d.pipe(QD(o)) : d;
    }),
  ).pipe(Wo(), XD(r));
}
function wh(e) {
  try {
    return Ss(e());
  } catch (t) {
    return new F$1((n) => n.error(t));
  }
}
function XD(e) {
  return Qs(
    ft((t) => {
      if (typeof t != `boolean`) throw gs(e, t);
    }),
    ne((t) => t === !0),
  );
}
function sO(e, t, n, r, o, i) {
  let s = t.canMatch;
  if (!s || s.length === 0) return I$1(!0);
  return I$1(
    s.map((c) => {
      let d = Zo(c, e);
      return wh(() => (Zx(d) ? d.canMatch(t, n, o) : Ne(e, () => d(t, n, o)))).pipe(QD(i));
    }),
  ).pipe(Wo(), XD(r));
}
var Yt = class e extends Error {
  name = `NoMatch`;
  segmentGroup;
  constructor(t) {
    (super(), (this.segmentGroup = t || null), Object.setPrototypeOf(this, e.prototype));
  }
};
var Is = class e extends Error {
  urlTree;
  name = `AbsoluteRedirect`;
  constructor(t) {
    (super(), (this.urlTree = t), Object.setPrototypeOf(this, e.prototype));
  }
};
function aO(e) {
  throw new M(4e3, !1);
}
function cO(e) {
  throw WD(!1, He.GuardRejected);
}
var lh = class {
  urlSerializer;
  urlTree;
  constructor(t, n) {
    ((this.urlSerializer = t), (this.urlTree = n));
  }
  async lineralizeSegments(t, n) {
    let r = [],
      o = n.root;
    for (;;) {
      if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return r;
      if (o.numberOfChildren > 1 || !o.children[U$1]) throw aO(`${t.redirectTo}`);
      o = o.children[U$1];
    }
  }
  async applyRedirectCommands(t, n, r, o, i) {
    let s = await lO(n, o, i);
    if (s instanceof ct) throw new Is(s);
    let a = this.applyRedirectCreateUrlTree(s, this.urlSerializer.parse(s), t, r);
    if (s[0] === `/`) throw new Is(a);
    return a;
  }
  applyRedirectCreateUrlTree(t, n, r, o) {
    return new ct(
      this.createSegmentGroup(t, n.root, r, o),
      this.createQueryParams(n.queryParams, this.urlTree.queryParams),
      n.fragment,
    );
  }
  createQueryParams(t, n) {
    let r = {};
    return (
      Object.entries(t).forEach(([o, i]) => {
        if (typeof i == `string` && i[0] === `:`) {
          let a = i.substring(1);
          r[o] = n[a];
        } else r[o] = i;
      }),
      r
    );
  }
  createSegmentGroup(t, n, r, o) {
    let i = this.createSegments(t, n.segments, r, o),
      s = Object.create(null);
    return (
      Object.entries(n.children).forEach(([a, c]) => {
        s[a] = this.createSegmentGroup(t, c, r, o);
      }),
      new Q(i, s)
    );
  }
  createSegments(t, n, r, o) {
    return n.map((i) => (i.path[0] === `:` ? this.findPosParam(t, i, o) : this.findOrReturn(i, r)));
  }
  findPosParam(t, n, r) {
    let o = r[n.path.substring(1)];
    if (!o) throw new M(4001, !1);
    return o;
  }
  findOrReturn(t, n) {
    let r = 0;
    for (let o of n) {
      if (o.path === t.path) return (n.splice(r), o);
      r++;
    }
    return t;
  }
};
function lO(e, t, n) {
  if (typeof e == `string`) return Promise.resolve(e);
  let r = e;
  return gl(Ss(Ne(n, () => r(t))));
}
function uO(e, t) {
  return (
    e.providers && !e._injector && (e._injector = ts(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  );
}
function Kt(e) {
  return e.outlet || U$1;
}
function dO(e, t) {
  let n = e.filter((r) => Kt(r) === t);
  return (n.push(...e.filter((r) => Kt(r) !== t)), n);
}
var uh = {
  matched: !1,
  consumedSegments: [],
  remainingSegments: [],
  parameters: {},
  positionalParamSegments: {},
};
function JD(e) {
  return {
    routeConfig: e.routeConfig,
    url: e.url,
    params: e.params,
    queryParams: e.queryParams,
    fragment: e.fragment,
    data: e.data,
    outlet: e.outlet,
    title: e.title,
    paramMap: e.paramMap,
    queryParamMap: e.queryParamMap,
  };
}
function fO(e, t, n, r, o, i, s) {
  let a = eE(e, t, n);
  if (!a.matched) return I$1(a);
  let c = JD(i(a));
  return ((r = uO(t, r)), sO(r, t, n, o, c, s).pipe(ne((d) => (d === !0 ? a : C({}, uh)))));
}
function eE(e, t, n) {
  if (t.path === ``)
    return t.pathMatch === `full` && (e.hasChildren() || n.length > 0)
      ? C({}, uh)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (t.matcher || CD)(n, e, t);
  if (!o) return C({}, uh);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
    i[a] = c.path;
  });
  let s = o.consumed.length > 0 ? C(C({}, i), o.consumed[o.consumed.length - 1].parameters) : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: n.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function DD(e, t, n, r) {
  return n.length > 0 && gO(e, n, r)
    ? { segmentGroup: new Q(t, hO(r, new Q(n, e.children))), slicedSegments: [] }
    : n.length === 0 && mO(e, n, r)
      ? { segmentGroup: new Q(e.segments, pO(e, n, r, e.children)), slicedSegments: n }
      : { segmentGroup: new Q(e.segments, e.children), slicedSegments: n };
}
function pO(e, t, n, r) {
  let o = {};
  for (let i of n)
    if (Pl(e, t, i) && !r[Kt(i)]) {
      let s = new Q([], {});
      o[Kt(i)] = s;
    }
  return C(C({}, r), o);
}
function hO(e, t) {
  let n = {};
  n[U$1] = t;
  for (let r of e)
    if (r.path === `` && Kt(r) !== U$1) {
      let o = new Q([], {});
      n[Kt(r)] = o;
    }
  return n;
}
function gO(e, t, n) {
  return n.some((r) => Pl(e, t, r) && Kt(r) !== U$1);
}
function mO(e, t, n) {
  return n.some((r) => Pl(e, t, r));
}
function Pl(e, t, n) {
  return (e.hasChildren() || t.length > 0) && n.pathMatch === `full` ? !1 : n.path === ``;
}
function yO(e, t, n) {
  return t.length === 0 && !e.hasChildren();
}
var dh = class {};
async function vO(e, t, n, r, o, i, s, a) {
  return new fh(e, t, n, r, o, s, i, a).recognize();
}
var wO = 31;
var fh = class {
  injector;
  configLoader;
  rootComponentType;
  config;
  urlTree;
  paramsInheritanceStrategy;
  urlSerializer;
  abortSignal;
  applyRedirects;
  absoluteRedirectCount = 0;
  allowRedirects = !0;
  queryParams;
  constructor(t, n, r, o, i, s, a, c) {
    ((this.injector = t),
      (this.configLoader = n),
      (this.rootComponentType = r),
      (this.config = o),
      (this.urlTree = i),
      (this.paramsInheritanceStrategy = s),
      (this.urlSerializer = a),
      (this.abortSignal = c),
      (this.applyRedirects = new lh(this.urlSerializer, this.urlTree)),
      (this.queryParams = Object.freeze(C({}, this.urlTree.queryParams))));
  }
  noMatchError(t) {
    return new M(4002, `'${t.segmentGroup}'`);
  }
  async recognize() {
    let t = DD(this.urlTree.root, [], [], this.config).segmentGroup,
      { children: n, rootSnapshot: r } = await this.match(t),
      i = new ws(``, new Ye(r, n)),
      s = LD(r, [], this.urlTree.queryParams, this.urlTree.fragment);
    return (
      (s.queryParams = this.urlTree.queryParams),
      (i.url = this.urlSerializer.serialize(s)),
      { state: i, tree: s }
    );
  }
  async match(t) {
    let n = new zo(
      [],
      Object.freeze({}),
      this.queryParams,
      this.urlTree.fragment,
      Object.freeze({}),
      U$1,
      this.rootComponentType,
      null,
      {},
      this.injector,
    );
    try {
      return {
        children: await this.processSegmentGroup(this.injector, this.config, t, U$1, n),
        rootSnapshot: n,
      };
    } catch (r) {
      if (r instanceof Is)
        return (
          this.absoluteRedirectCount++,
          this.absoluteRedirectCount > wO && (this.allowRedirects = !1),
          (this.urlTree = r.urlTree),
          (this.queryParams = Object.freeze(C({}, this.urlTree.queryParams))),
          this.match(r.urlTree.root)
        );
      throw r instanceof Yt ? this.noMatchError(r) : r;
    }
  }
  async processSegmentGroup(t, n, r, o, i) {
    if (r.segments.length === 0 && r.hasChildren()) return this.processChildren(t, n, r, i);
    let s = await this.processSegment(t, n, r, r.segments, o, !0, i);
    return s instanceof Ye ? [s] : [];
  }
  async processChildren(t, n, r, o) {
    let i = [];
    for (let c of Object.keys(r.children)) c === `primary` ? i.unshift(c) : i.push(c);
    let s = [];
    for (let c of i) {
      let d = r.children[c],
        h = dO(n, c),
        p = await this.processSegment(t, h, d, d.segments, c, !0, o);
      p instanceof Ye && s.push(p);
    }
    let a = tE(s);
    return (bO(a), a);
  }
  async processSegment(t, n, r, o, i, s, a) {
    for (let c of n)
      try {
        return await this.processSegmentAgainstRoute(c._injector ?? t, n, c, r, o, i, s, a);
      } catch (d) {
        if (d instanceof Yt || ZD(d)) continue;
        throw d;
      }
    if (yO(r, o)) return new dh();
    throw new Yt(r);
  }
  async processSegmentAgainstRoute(t, n, r, o, i, s, a, c) {
    if (
      Kt(r) !== s &&
      (s === U$1 ||
        !Pl(o, i, r) ||
        (!r.children?.length && !r.loadChildren) ||
        (i.length === 0 && !o.hasChildren()))
    )
      throw new Yt(o);
    if (r.redirectTo === void 0) return this.matchSegmentAgainstRoute(t, o, r, i, s, c);
    if (this.allowRedirects && a)
      return this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s, c);
    throw new Yt(o);
  }
  async expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, a) {
    let {
      matched: c,
      parameters: d,
      consumedSegments: h,
      positionalParamSegments: p,
      remainingSegments: m,
    } = eE(n, o, i);
    if (!c) throw new Yt(n);
    let y = this.createSnapshot(t, o, i, d, a);
    if (this.abortSignal.aborted) throw new Error(this.abortSignal.reason);
    let w = await this.applyRedirects.applyRedirectCommands(h, o.redirectTo, p, JD(y), t),
      T = await this.applyRedirects.lineralizeSegments(o, w);
    return this.processSegment(t, r, n, T.concat(m), s, !1, a);
  }
  createSnapshot(t, n, r, o, i) {
    let s = new zo(
        r,
        o,
        this.queryParams,
        this.urlTree.fragment,
        CO(n),
        Kt(n),
        n.component ?? n._loadedComponent ?? null,
        n,
        IO(n),
        t,
      ),
      a = hh(s, i, this.paramsInheritanceStrategy);
    return ((s.params = a.params), (s.data = a.data), s);
  }
  async matchSegmentAgainstRoute(t, n, r, o, i, s) {
    if (this.abortSignal.aborted) throw new Error(this.abortSignal.reason);
    let a = (pe) => this.createSnapshot(t, r, pe.consumedSegments, pe.parameters, s),
      c = await gl(fO(n, r, o, t, this.urlSerializer, a, this.abortSignal));
    if ((r.path === `**` && (n.children = {}), !c?.matched)) throw new Yt(n);
    t = r._injector ?? t;
    let { routes: d } = await this.getChildConfig(t, r, o),
      h = r._loadedInjector ?? t,
      { parameters: p, consumedSegments: m, remainingSegments: y } = c,
      w = this.createSnapshot(t, r, m, p, s),
      T = Kt(r) === i,
      { segmentGroup: E, slicedSegments: _ } = T
        ? DD(n, m, y, d)
        : { segmentGroup: n, slicedSegments: y };
    if (T && _.length === 0 && E.hasChildren())
      return new Ye(w, await this.processChildren(h, d, E, w));
    if (T && d.length === 0 && _.length === 0) return new Ye(w, []);
    let V = await this.processSegment(h, d, E, _, T ? U$1 : i, !0, w);
    if (!T && !(V instanceof Ye)) throw new Yt(n);
    return new Ye(w, V instanceof Ye ? [V] : []);
  }
  async getChildConfig(t, n, r) {
    if (n.children) return { routes: n.children, injector: t };
    if (n.loadChildren) {
      if (n._loadedRoutes !== void 0) {
        let i = n._loadedNgModuleFactory;
        return (
          i && !n._loadedInjector && (n._loadedInjector = i.create(t).injector),
          { routes: n._loadedRoutes, injector: n._loadedInjector }
        );
      }
      if (this.abortSignal.aborted) throw new Error(this.abortSignal.reason);
      if (await gl(iO(t, n, r, this.urlSerializer, this.abortSignal))) {
        let i = await this.configLoader.loadChildren(t, n);
        return (
          (n._loadedRoutes = i.routes),
          (n._loadedInjector = i.injector),
          (n._loadedNgModuleFactory = i.factory),
          i
        );
      }
      throw cO(n);
    }
    return { routes: [], injector: t };
  }
};
function bO(e) {
  e.sort((t, n) =>
    t.value.outlet === U$1
      ? -1
      : n.value.outlet === U$1
        ? 1
        : t.value.outlet.localeCompare(n.value.outlet),
  );
}
function DO(e) {
  let t = e.value.routeConfig;
  return t && t.path === ``;
}
function tE(e) {
  let t = [],
    n = /* @__PURE__ */ new Set();
  for (let o of e) {
    if (!DO(o)) {
      t.push(o);
      continue;
    }
    let i = t.find((s) => o.value.routeConfig === s.value.routeConfig);
    i !== void 0 ? (i.children.push(...o.children), n.add(i)) : t.push(o);
  }
  for (let o of n) {
    let i = tE(o.children);
    t.push(new Ye(o.value, i));
  }
  let r = t.filter((o) => !n.has(o));
  return (EO(r), r);
}
function EO(e) {
  let t = Object.create(null);
  e.forEach((n) => {
    let r = t[n.value.outlet];
    if (r) {
      r.url.map((s) => s.toString()).join(`/`);
      n.value.url.map((s) => s.toString()).join(`/`);
      throw new M(4006, !1);
    }
    t[n.value.outlet] = n.value;
  });
}
function CO(e) {
  return e.data || {};
}
function IO(e) {
  return e.resolve || {};
}
function TO(e, t, n, r, o, i, s) {
  return S(async (a) => {
    let { state: c, tree: d } = await vO(e, t, n, r, a.extractedUrl, o, i, s);
    return Y(C({}, a), { targetSnapshot: c, urlAfterRedirects: d });
  });
}
function SO(e) {
  return S((t) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: r },
    } = t;
    if (!r.length) return I$1(t);
    let o = new Set(r.map((a) => a.route)),
      i = /* @__PURE__ */ new Set();
    for (let a of o) if (!i.has(a)) for (let c of nE(a)) i.add(c);
    let s = 0;
    return ve$1(i).pipe(
      fo((a) => (o.has(a) ? MO(a, n, e) : ((a.data = hh(a, a.parent, e).resolve), I$1(void 0)))),
      ft(() => s++),
      Ca(1),
      S((a) => (s === i.size ? I$1(t) : _e$1)),
    );
  });
}
function nE(e) {
  return [e, ...e.children.map((n) => nE(n)).flat()];
}
function MO(e, t, n) {
  let r = e.routeConfig,
    o = e._resolve;
  return (
    r?.title !== void 0 && !$D(r) && (o[Ts] = r.title),
    fi(
      () => (
        (e.data = hh(e, e.parent, n).resolve),
        _O(o, e, t).pipe(ne((i) => ((e._resolvedData = i), (e.data = C(C({}, e.data), i)), null)))
      ),
    )
  );
}
function _O(e, t, n) {
  let r = Jp(e);
  if (r.length === 0) return I$1({});
  let o = {};
  return ve$1(r).pipe(
    S((i) =>
      NO(e[i], t, n).pipe(
        sn(),
        ft((s) => {
          if (s instanceof Qn) throw gs(new Zn(), s);
          o[i] = s;
        }),
      ),
    ),
    Ca(1),
    ne(() => o),
    re((i) => (ZD(i) ? _e$1 : j(i))),
  );
}
function NO(e, t, n) {
  let r = t._environmentInjector,
    o = Zo(e, r);
  return Ss(o.resolve ? o.resolve(t, n) : Ne(r, () => o(t, n)));
}
var rE = new A(``);
function ph(e) {
  return Xe((t) => {
    let n = e(t);
    return n ? ve$1(n).pipe(ne(() => t)) : I$1(t);
  });
}
var bh = (() => {
  class e {
    buildTitle(n) {
      let r,
        o = n.root;
      for (; o !== void 0;)
        ((r = this.getResolvedTitleForRoute(o) ?? r),
          (o = o.children.find((i) => i.outlet === U$1)));
      return r;
    }
    getResolvedTitleForRoute(n) {
      return n.data[Ts];
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: () => b(oE) });
  }
  return e;
})();
var oE = (() => {
  class e extends bh {
    title;
    constructor(n) {
      (super(), (this.title = n));
    }
    updateTitle(n) {
      let r = this.buildTitle(n);
      r !== void 0 && this.title.setTitle(r);
    }
    static ɵfac = function (r) {
      return new (r || e)(N(gD));
    };
    static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
  }
  return e;
})();
var zr = new A(``, { factory: () => ({}) });
var _s = new A(``);
var iE = (() => {
  class e {
    componentLoaders = /* @__PURE__ */ new WeakMap();
    childrenLoaders = /* @__PURE__ */ new WeakMap();
    onLoadStartListener;
    onLoadEndListener;
    compiler = b(vp);
    async loadComponent(n, r) {
      if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
      if (r._loadedComponent) return Promise.resolve(r._loadedComponent);
      this.onLoadStartListener && this.onLoadStartListener(r);
      let o = (async () => {
        try {
          let s = await aE(_p(await TD(Ne(n, () => r.loadComponent()))));
          return (this.onLoadEndListener && this.onLoadEndListener(r), (r._loadedComponent = s), s);
        } finally {
          this.componentLoaders.delete(r);
        }
      })();
      return (this.componentLoaders.set(r, o), o);
    }
    loadChildren(n, r) {
      if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
      if (r._loadedRoutes)
        return Promise.resolve({ routes: r._loadedRoutes, injector: r._loadedInjector });
      this.onLoadStartListener && this.onLoadStartListener(r);
      let o = (async () => {
        try {
          let i = await sE(r, this.compiler, n, this.onLoadEndListener);
          return (
            (r._loadedRoutes = i.routes),
            (r._loadedInjector = i.injector),
            (r._loadedNgModuleFactory = i.factory),
            i
          );
        } finally {
          this.childrenLoaders.delete(r);
        }
      })();
      return (this.childrenLoaders.set(r, o), o);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
async function sE(e, t, n, r) {
  let i = await aE(_p(await TD(Ne(n, () => e.loadChildren())))),
    s;
  (i instanceof jc || Array.isArray(i) ? (s = i) : (s = await t.compileModuleAsync(i)), r && r(e));
  let a, c, h;
  return (
    Array.isArray(s)
      ? (c = s)
      : ((a = s.create(n).injector),
        (h = s),
        (c = a.get(_s, [], { optional: !0, self: !0 }).flat())),
    { routes: c.map(vh), injector: a, factory: h }
  );
}
async function aE(e) {
  return e;
}
var Ll = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: () => b(AO) });
  }
  return e;
})();
var AO = (() => {
  class e {
    shouldProcessUrl(n) {
      return !0;
    }
    extract(n) {
      return n;
    }
    merge(n, r) {
      return n;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var cE = new A(``);
var RO = () => {};
var lE = new A(``);
var uE = (() => {
  class e {
    currentNavigation = Ce$1(null, { equal: () => !1 });
    currentTransition = null;
    lastSuccessfulNavigation = Ce$1(null);
    events = new le();
    transitionAbortWithErrorSubject = new le();
    configLoader = b(iE);
    environmentInjector = b(we$1);
    destroyRef = b(je);
    urlSerializer = b(Yo);
    rootContexts = b(Vr);
    location = b(Lr);
    inputBindingEnabled = b(kl, { optional: !0 }) !== null;
    titleStrategy = b(bh);
    options = b(zr, { optional: !0 }) || {};
    paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || kx;
    urlHandlingStrategy = b(Ll);
    createViewTransition = b(cE, { optional: !0 });
    navigationErrorHandler = b(lE, { optional: !0 });
    routerResourcesFeature = b(rE, { optional: !0 });
    navigationId = 0;
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    transitions;
    afterPreactivation = () => I$1(void 0);
    rootComponentType = null;
    destroyed = !1;
    constructor() {
      let n = (o) => this.events.next(new Sl(o)),
        r = (o) => this.events.next(new Ml(o));
      ((this.configLoader.onLoadEndListener = r),
        (this.configLoader.onLoadStartListener = n),
        this.destroyRef.onDestroy(() => {
          this.destroyed = !0;
        }));
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let r = ++this.navigationId;
      fe$1(() => {
        this.transitions?.next(
          Y(C({}, n), {
            extractedUrl: this.urlHandlingStrategy.extract(n.rawUrl),
            targetSnapshot: null,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
            id: r,
            routesRecognizeHandler: {},
            beforeActivateHandler: {},
          }),
        );
      });
    }
    setupNavigations(n) {
      return (
        (this.transitions = new Pe$1(null)),
        this.transitions.pipe(
          Qe((r) => r !== null),
          Xe((r) => {
            let o = !0,
              i = !1,
              s = new AbortController(),
              a = () => !i && this.currentTransition?.id === r.id;
            return I$1(r).pipe(
              Xe((c) => {
                if (this.navigationId > r.id)
                  return (
                    this.cancelNavigationTransition(r, ``, He.SupersededByNewNavigation),
                    _e$1
                  );
                this.currentTransition = r;
                let d = this.lastSuccessfulNavigation();
                this.currentNavigation.set({
                  id: c.id,
                  initialUrl: c.rawUrl,
                  extractedUrl: c.extractedUrl,
                  targetBrowserUrl:
                    typeof c.extras.browserUrl == `string`
                      ? this.urlSerializer.parse(c.extras.browserUrl)
                      : c.extras.browserUrl,
                  trigger: c.source,
                  extras: c.extras,
                  previousNavigation: d ? Y(C({}, d), { previousNavigation: null }) : null,
                  abort: () => s.abort(),
                  routesRecognizeHandler: c.routesRecognizeHandler,
                  beforeActivateHandler: c.beforeActivateHandler,
                });
                let h =
                    !n.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl(),
                  p = c.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!h && p !== `reload`)
                  return (
                    this.events.next(
                      new Tn(
                        c.id,
                        this.urlSerializer.serialize(c.rawUrl),
                        ``,
                        bs.IgnoredSameUrlNavigation,
                      ),
                    ),
                    c.resolve(!1),
                    _e$1
                  );
                if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                  return I$1(c).pipe(
                    Xe(
                      (m) => (
                        this.events.next(
                          new Hr(
                            m.id,
                            this.urlSerializer.serialize(m.extractedUrl),
                            m.source,
                            m.restoredState,
                          ),
                        ),
                        m.id !== this.navigationId ? _e$1 : Promise.resolve(m)
                      ),
                    ),
                    TO(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy,
                      s.signal,
                    ),
                    ft((m) => {
                      ((r.targetSnapshot = m.targetSnapshot),
                        (r.urlAfterRedirects = m.urlAfterRedirects),
                        this.currentNavigation.update(
                          (y) => ((y.finalUrl = m.urlAfterRedirects), y),
                        ),
                        this.events.next(new Es()));
                    }),
                    Xe((m) =>
                      ve$1(r.routesRecognizeHandler.deferredHandle ?? I$1(void 0)).pipe(
                        ne(() => m),
                      ),
                    ),
                    ft(() => {
                      let m = new Ds(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects),
                        c.targetSnapshot,
                      );
                      this.events.next(m);
                    }),
                  );
                if (h && this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)) {
                  let { id: m, extractedUrl: y, source: w, restoredState: T, extras: E } = c,
                    _ = new Hr(m, this.urlSerializer.serialize(y), w, T);
                  this.events.next(_);
                  let V = VD(this.rootComponentType, this.environmentInjector).snapshot;
                  return (
                    (this.currentTransition = r =
                      Y(C({}, c), {
                        targetSnapshot: V,
                        urlAfterRedirects: y,
                        extras: Y(C({}, E), { skipLocationChange: !1, replaceUrl: !1 }),
                      })),
                    this.currentNavigation.update((pe) => ((pe.finalUrl = y), pe)),
                    I$1(r)
                  );
                } else
                  return (
                    this.events.next(
                      new Tn(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        ``,
                        bs.IgnoredByUrlHandlingStrategy,
                      ),
                    ),
                    c.resolve(!1),
                    _e$1
                  );
              }),
              ne((c) => {
                let d = new El(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                );
                return (
                  this.events.next(d),
                  (this.currentTransition = r =
                    Y(C({}, c), {
                      guards: Ux(c.targetSnapshot, c.currentSnapshot, this.rootContexts),
                    })),
                  r
                );
              }),
              Qx((c) => this.events.next(c)),
              Xe((c) => {
                if (
                  ((r.guardsResult = c.guardsResult),
                  c.guardsResult && typeof c.guardsResult != `boolean`)
                )
                  throw gs(this.urlSerializer, c.guardsResult);
                let d = new Cl(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                  !!c.guardsResult,
                );
                if ((this.events.next(d), !a())) return _e$1;
                if (!c.guardsResult)
                  return (this.cancelNavigationTransition(c, ``, He.GuardRejected), _e$1);
                if (c.guards.canActivateChecks.length === 0) return I$1(c);
                let h = new Il(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                );
                if ((this.events.next(h), !a())) return _e$1;
                let p = !1;
                return I$1(c).pipe(
                  SO(this.paramsInheritanceStrategy),
                  ft({
                    next: () => {
                      p = !0;
                      let m = new Tl(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects),
                        c.targetSnapshot,
                      );
                      this.events.next(m);
                    },
                    complete: () => {
                      p || this.cancelNavigationTransition(c, ``, He.NoDataFromResolver);
                    },
                  }),
                );
              }),
              ph((c) => {
                let d = (p) => {
                    let m = [];
                    if (p.routeConfig?._loadedComponent)
                      p.component = p.routeConfig?._loadedComponent;
                    else if (p.routeConfig?.loadComponent) {
                      let y = p._environmentInjector;
                      m.push(
                        this.configLoader.loadComponent(y, p.routeConfig).then((w) => {
                          p.component = w;
                        }),
                      );
                    }
                    for (let y of p.children) m.push(...d(y));
                    return m;
                  },
                  h = d(c.targetSnapshot.root);
                return h.length === 0 ? I$1(c) : ve$1(Promise.all(h).then(() => c));
              }),
              Xe((c) => {
                let { newlyCreatedRoutes: d, state: h } = Lx(
                  n.routeReuseStrategy,
                  c.targetSnapshot,
                  c.currentRouterState,
                );
                return (
                  (this.currentTransition =
                    r =
                    c =
                      Y(C({}, c), { targetRouterState: h, newlyCreatedRoutes: d })),
                  this.currentNavigation.update((p) => ((p.targetRouterState = h), p)),
                  I$1(c)
                );
              }),
              this.routerResourcesFeature?.setupAndRunResources(s.signal) ?? ((c) => c),
              ph(() => this.afterPreactivation()),
              Xe(() => {
                let { currentSnapshot: c, targetSnapshot: d } = r,
                  h = this.createViewTransition?.(
                    this.environmentInjector,
                    c.root,
                    d.root,
                    r.hasUAVisualTransition,
                  );
                return h ? ve$1(h).pipe(ne(() => r)) : I$1(r);
              }),
              Ln(1),
              Xe((c) => {
                ((o = !1), this.events.next(new qo()));
                let d = r.beforeActivateHandler.deferredHandle;
                return d ? ve$1(d.then(() => c)) : I$1(c);
              }),
              ft((c) => {
                (new ch(
                  n.routeReuseStrategy,
                  r.targetRouterState,
                  r.currentRouterState,
                  (d) => this.events.next(d),
                  this.inputBindingEnabled,
                ).activate(this.rootContexts),
                  c.newlyCreatedRoutes?.clear(),
                  a() &&
                    (dE(c.targetRouterState),
                    (i = !0),
                    this.currentNavigation.update((d) => ((d.abort = RO), d)),
                    this.lastSuccessfulNavigation.set(fe$1(this.currentNavigation)),
                    this.events.next(
                      new Qt(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects),
                      ),
                    ),
                    this.titleStrategy?.updateTitle(c.targetRouterState.snapshot),
                    c.resolve(!0)));
              }),
              hi(
                KD(s.signal).pipe(
                  Qe(() => !i && o),
                  ft(() => {
                    this.cancelNavigationTransition(r, s.signal.reason + ``, He.Aborted);
                  }),
                ),
              ),
              ft({
                complete: () => {
                  i = !0;
                },
              }),
              hi(
                this.transitionAbortWithErrorSubject.pipe(
                  ft((c) => {
                    throw c;
                  }),
                ),
              ),
              pi(() => {
                (s.abort(),
                  i || this.cancelNavigationTransition(r, ``, He.SupersededByNewNavigation),
                  this.currentTransition?.id === r.id &&
                    (this.currentNavigation.set(null), (this.currentTransition = null)));
              }),
              re((c) => {
                if (((i = !0), ED(r), this.destroyed)) return (r.resolve(!1), _e$1);
                if ((c instanceof Qn && (c = gs(this.urlSerializer, c)), YD(c)))
                  (this.events.next(
                    new Dt(
                      r.id,
                      this.urlSerializer.serialize(r.extractedUrl),
                      c.message,
                      c.cancellationCode,
                    ),
                  ),
                    Bx(c)
                      ? this.events.next(new Go(c.url, c.navigationBehaviorOptions))
                      : r.resolve(!1));
                else {
                  let d = new $r(
                    r.id,
                    this.urlSerializer.serialize(r.extractedUrl),
                    c,
                    r.targetSnapshot ?? void 0,
                  );
                  try {
                    let h = Ne(this.environmentInjector, () => this.navigationErrorHandler?.(d));
                    if (h instanceof Qn) {
                      let { message: p, cancellationCode: m } = gs(this.urlSerializer, h);
                      (this.events.next(
                        new Dt(r.id, this.urlSerializer.serialize(r.extractedUrl), p, m),
                      ),
                        this.events.next(new Go(h.redirectTo, h.navigationBehaviorOptions)));
                    } else throw (this.events.next(d), c);
                  } catch (h) {
                    this.options.resolveNavigationPromiseOnError ? r.resolve(!1) : r.reject(h);
                  }
                }
                return _e$1;
              }),
            );
          }),
        )
      );
    }
    cancelNavigationTransition(n, r, o) {
      ED(n);
      let i = new Dt(n.id, this.urlSerializer.serialize(n.extractedUrl), r, o);
      (this.events.next(i), n.resolve(!1));
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      let n = this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))),
        r = fe$1(this.currentNavigation),
        o = r?.targetBrowserUrl ?? r?.extractedUrl;
      return n.toString() !== o?.toString() && !r?.extras.skipLocationChange;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function xO(e) {
  return e !== hs;
}
function ED(e) {
  for (let t of e.newlyCreatedRoutes ?? [])
    (t._localInjector?.destroy(), (t._localInjector = void 0));
  dE(e.targetRouterState);
}
function dE(e) {
  if (!e) return;
  let t = (n) => {
    (n.value.pending?.set(!1), n.children.forEach(t));
  };
  t(e._root);
}
var fE = new A(``);
var pE = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: () => b(OO) });
  }
  return e;
})();
var Ol = class {
  shouldDetach(t) {
    return !1;
  }
  store(t, n) {}
  shouldAttach(t) {
    return !1;
  }
  retrieve(t) {
    return null;
  }
  shouldReuseRoute(t, n) {
    return t.routeConfig === n.routeConfig;
  }
  shouldDestroyInjector(t) {
    return !0;
  }
};
var OO = (() => {
  class e extends Ol {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var Fl = (() => {
  class e {
    urlSerializer = b(Yo);
    options = b(zr, { optional: !0 }) || {};
    canceledNavigationResolution = this.options.canceledNavigationResolution || `replace`;
    location = b(Lr);
    urlHandlingStrategy = b(Ll);
    urlUpdateStrategy = this.options.urlUpdateStrategy || `deferred`;
    currentUrlTree = new ct();
    getCurrentUrlTree() {
      return this.currentUrlTree;
    }
    rawUrlTree = this.currentUrlTree;
    getRawUrlTree() {
      return this.rawUrlTree;
    }
    createBrowserPath({ finalUrl: n, initialUrl: r, targetBrowserUrl: o }) {
      let i = n !== void 0 ? this.urlHandlingStrategy.merge(n, r) : r,
        s = o ?? i;
      return s instanceof ct ? this.urlSerializer.serialize(s) : s;
    }
    routerUrlState(n) {
      return n?.targetBrowserUrl === void 0 || n?.finalUrl === void 0
        ? {}
        : { ɵrouterUrl: this.urlSerializer.serialize(n.finalUrl) };
    }
    commitTransition({ targetRouterState: n, finalUrl: r, initialUrl: o }) {
      r && n
        ? ((this.currentUrlTree = r),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(r, o)),
          (this.routerState = n))
        : (this.rawUrlTree = o);
    }
    routerState = VD(null, b(we$1));
    getRouterState() {
      return this.routerState;
    }
    _stateMemento = this.createStateMemento();
    get stateMemento() {
      return this._stateMemento;
    }
    updateStateMemento() {
      this._stateMemento = this.createStateMemento();
    }
    createStateMemento() {
      return {
        rawUrlTree: this.rawUrlTree,
        currentUrlTree: this.currentUrlTree,
        routerState: this.routerState,
      };
    }
    restoredState() {
      return this.location.getState();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: () => b(kO) });
  }
  return e;
})();
var kO = (() => {
  class e extends Fl {
    currentPageId = 0;
    lastSuccessfulId = -1;
    get browserPageId() {
      return this.canceledNavigationResolution !== `computed`
        ? this.currentPageId
        : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
    }
    registerNonRouterCurrentEntryChangeListener(n) {
      return this.location.subscribe((r) => {
        r.type === `popstate` &&
          setTimeout(() => {
            n(r.url, r.state, `popstate`, { replaceUrl: !0 }, r.hasUAVisualTransition);
          });
      });
    }
    handleRouterEvent(n, r) {
      n instanceof Hr
        ? this.updateStateMemento()
        : n instanceof Tn
          ? this.commitTransition(r)
          : n instanceof Ds
            ? this.urlUpdateStrategy === `eager` &&
              (r.extras.skipLocationChange || this.setBrowserUrl(this.createBrowserPath(r), r))
            : n instanceof qo
              ? (this.commitTransition(r),
                this.urlUpdateStrategy === `deferred` &&
                  !r.extras.skipLocationChange &&
                  this.setBrowserUrl(this.createBrowserPath(r), r))
              : n instanceof Dt
                ? qD(n)
                  ? n.code === He.Redirect &&
                    this.routerState === r.targetRouterState &&
                    this.resetInternalState(r)
                  : this.restoreHistory(r)
                : n instanceof $r
                  ? this.restoreHistory(r, !0)
                  : n instanceof Qt &&
                    ((this.lastSuccessfulId = n.id), (this.currentPageId = this.browserPageId));
    }
    setBrowserUrl(n, r) {
      let { extras: o, id: i } = r,
        { replaceUrl: s, state: a } = o;
      if (this.location.isCurrentPathEqualTo(n) || s) {
        let c = this.browserPageId,
          d = C(C({}, a), this.generateNgRouterState(i, c, r));
        this.location.replaceState(n, ``, d);
      } else {
        let c = C(C({}, a), this.generateNgRouterState(i, this.browserPageId + 1, r));
        this.location.go(n, ``, c);
      }
    }
    restoreHistory(n, r = !1) {
      if (this.canceledNavigationResolution === `computed`) {
        let o = this.browserPageId,
          i = this.currentPageId - o;
        i !== 0
          ? this.location.historyGo(i)
          : this.getCurrentUrlTree() === n.finalUrl &&
            i === 0 &&
            (this.resetInternalState(n), this.resetUrlToCurrentUrlTree());
      } else
        this.canceledNavigationResolution === `replace` &&
          (r && this.resetInternalState(n), this.resetUrlToCurrentUrlTree());
    }
    resetInternalState({ finalUrl: n }) {
      ((this.routerState = this.stateMemento.routerState),
        (this.currentUrlTree = this.stateMemento.currentUrlTree),
        (this.rawUrlTree = this.urlHandlingStrategy.merge(
          this.currentUrlTree,
          n ?? this.rawUrlTree,
        )));
    }
    resetUrlToCurrentUrlTree() {
      this.location.replaceState(
        this.urlSerializer.serialize(this.getRawUrlTree()),
        ``,
        this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
      );
    }
    generateNgRouterState(n, r, o) {
      return this.canceledNavigationResolution === `computed`
        ? C({ navigationId: n, ɵrouterPageId: r }, this.routerUrlState(o))
        : C({ navigationId: n }, this.routerUrlState(o));
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function Dh(e, t) {
  e.events
    .pipe(
      Qe((n) => n instanceof Qt || n instanceof Dt || n instanceof $r || n instanceof Tn),
      ne((n) =>
        n instanceof Qt || n instanceof Tn
          ? 0
          : (
                n instanceof Dt
                  ? n.code === He.Redirect || n.code === He.SupersededByNewNavigation
                  : !1
              )
            ? 2
            : 1,
      ),
      Qe((n) => n !== 2),
      Ln(1),
    )
    .subscribe(() => {
      t();
    });
}
var Ko = (() => {
  class e {
    get currentUrlTree() {
      return this.stateManager.getCurrentUrlTree();
    }
    get rawUrlTree() {
      return this.stateManager.getRawUrlTree();
    }
    disposed = !1;
    nonRouterCurrentEntryChangeSubscription;
    console = b(Bc);
    stateManager = b(Fl);
    options = b(zr, { optional: !0 }) || {};
    pendingTasks = b(pn);
    urlUpdateStrategy = this.options.urlUpdateStrategy || `deferred`;
    navigationTransitions = b(uE);
    urlSerializer = b(Yo);
    location = b(Lr);
    urlHandlingStrategy = b(Ll);
    injector = b(we$1);
    _events = new le();
    get events() {
      return this._events;
    }
    get routerState() {
      return this.stateManager.getRouterState();
    }
    navigated = !1;
    routeReuseStrategy = b(pE);
    injectorCleanup = b(fE, { optional: !0 });
    onSameUrlNavigation = this.options.onSameUrlNavigation || `ignore`;
    config = b(_s, { optional: !0 })?.flat() ?? [];
    componentInputBindingEnabled = !!b(kl, { optional: !0 });
    currentNavigation = this.navigationTransitions.currentNavigation.asReadonly();
    constructor() {
      (this.resetConfig(this.config),
        this.navigationTransitions.setupNavigations(this).subscribe({ error: (n) => {} }),
        this.subscribeToNavigationEvents());
    }
    eventsSubscription = new he();
    subscribeToNavigationEvents() {
      let n = this.navigationTransitions.events.subscribe((r) => {
        try {
          let o = this.navigationTransitions.currentTransition,
            i = fe$1(this.navigationTransitions.currentNavigation);
          if (o !== null && i !== null) {
            if (
              (this.stateManager.handleRouterEvent(r, i),
              r instanceof Dt && r.code !== He.Redirect && r.code !== He.SupersededByNewNavigation)
            )
              this.navigated = !0;
            else if (r instanceof Qt)
              ((this.navigated = !0),
                this.injectorCleanup?.(this.routeReuseStrategy, this.routerState, this.config));
            else if (r instanceof Go) {
              let s = r.navigationBehaviorOptions,
                a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl),
                c = C(
                  {
                    scroll: o.extras.scroll,
                    browserUrl: o.extras.browserUrl,
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      o.extras.replaceUrl || this.urlUpdateStrategy === `eager` || xO(o.source),
                  },
                  s,
                );
              this.scheduleNavigation(a, hs, null, c, o.hasUAVisualTransition, {
                resolve: o.resolve,
                reject: o.reject,
                promise: o.promise,
              });
            }
          }
          Px(r) && this._events.next(r);
        } catch (o) {
          this.navigationTransitions.transitionAbortWithErrorSubject.next(o);
        }
      });
      this.eventsSubscription.add(n);
    }
    resetRootComponentType(n) {
      ((this.routerState.root.component = n), (this.navigationTransitions.rootComponentType = n));
    }
    initialNavigation() {
      (this.setUpLocationChangeListener(),
        this.navigationTransitions.hasRequestedNavigation ||
          this.navigateToSyncWithBrowser(
            this.location.path(!0),
            hs,
            this.stateManager.restoredState(),
            { replaceUrl: !0 },
          ));
    }
    setUpLocationChangeListener() {
      this.nonRouterCurrentEntryChangeSubscription ??=
        this.stateManager.registerNonRouterCurrentEntryChangeListener((n, r, o, i, s) => {
          this.navigateToSyncWithBrowser(n, o, r, i, s);
        });
    }
    navigateToSyncWithBrowser(n, r, o, i, s) {
      let a = o?.navigationId ? o : null,
        c = o?.ɵrouterUrl ?? n;
      if ((o?.ɵrouterUrl && (i = Y(C({}, i), { browserUrl: n })), o)) {
        let h = C({}, o);
        (delete h.navigationId,
          delete h.ɵrouterPageId,
          delete h.ɵrouterUrl,
          Object.keys(h).length !== 0 && (i.state = h));
      }
      let d = this.parseUrl(c);
      this.scheduleNavigation(d, r, a, i, s).catch((h) => {
        this.disposed || this.injector.get(st)(h);
      });
    }
    get url() {
      return this.serializeUrl(this.currentUrlTree);
    }
    getCurrentNavigation() {
      return fe$1(this.navigationTransitions.currentNavigation);
    }
    get lastSuccessfulNavigation() {
      return this.navigationTransitions.lastSuccessfulNavigation;
    }
    resetConfig(n) {
      ((this.config = n.map(vh)), (this.navigated = !1));
    }
    ngOnDestroy() {
      this.dispose();
    }
    dispose() {
      (this._events.unsubscribe(),
        this.navigationTransitions.complete(),
        this.nonRouterCurrentEntryChangeSubscription?.unsubscribe(),
        (this.nonRouterCurrentEntryChangeSubscription = void 0),
        (this.disposed = !0),
        this.eventsSubscription.unsubscribe());
    }
    createUrlTree(n, r = {}) {
      let {
          relativeTo: o,
          queryParams: i,
          fragment: s,
          queryParamsHandling: a,
          preserveFragment: c,
        } = r,
        d = c ? this.currentUrlTree.fragment : s,
        h = null;
      switch (a ?? this.options.defaultQueryParamsHandling) {
        case `merge`:
          h = C(C({}, this.currentUrlTree.queryParams), i);
          break;
        case `preserve`:
          h = this.currentUrlTree.queryParams;
          break;
        default:
          h = i || null;
      }
      let p;
      try {
        p = FD(o ? o.snapshot : this.routerState.snapshot.root);
      } catch {
        ((typeof n[0] != `string` || n[0][0] !== `/`) && (n = []), (p = this.currentUrlTree.root));
      }
      return jD(p, n, h, d ?? null, this.urlSerializer);
    }
    navigateByUrl(n, r = { skipLocationChange: !1 }) {
      let o = Kn(n) ? n : this.parseUrl(n),
        i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
      return this.scheduleNavigation(i, hs, null, r);
    }
    navigate(n, r = { skipLocationChange: !1 }) {
      return (PO(n), this.navigateByUrl(this.createUrlTree(n, r), r));
    }
    serializeUrl(n) {
      return this.urlSerializer.serialize(n);
    }
    parseUrl(n) {
      try {
        return this.urlSerializer.parse(n);
      } catch {
        return (this.console.warn(Ut(4018, !1)), this.urlSerializer.parse(`/`));
      }
    }
    isActive(n, r) {
      let o;
      if ((r === !0 ? (o = C({}, MD)) : r === !1 ? (o = C({}, ml)) : (o = C(C({}, ml), r)), Kn(n)))
        return eh(this.currentUrlTree, n, o);
      let i = this.parseUrl(n);
      return eh(this.currentUrlTree, i, o);
    }
    scheduleNavigation(n, r, o, i, s, a) {
      if (this.disposed) return Promise.resolve(!1);
      let c, d, h;
      a
        ? ((c = a.resolve), (d = a.reject), (h = a.promise))
        : (h = new Promise((m, y) => {
            ((c = m), (d = y));
          }));
      let p = this.pendingTasks.add();
      return (
        Dh(this, () => {
          queueMicrotask(() => this.pendingTasks.remove(p));
        }),
        this.navigationTransitions.handleNavigationRequest({
          source: r,
          restoredState: o,
          currentUrlTree: this.currentUrlTree,
          currentRawUrl: this.currentUrlTree,
          rawUrl: n,
          extras: i,
          hasUAVisualTransition: s,
          resolve: c,
          reject: d,
          promise: h,
          currentSnapshot: this.routerState.snapshot,
          currentRouterState: this.routerState,
        }),
        h.catch(Promise.reject.bind(Promise))
      );
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function PO(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new M(4008, !1);
}
var jO = (() => {
  class e {
    router = b(Ko);
    stateManager = b(Fl);
    fragment = Ce$1(``);
    queryParams = Ce$1({});
    path = Ce$1(``);
    serializer = b(Yo);
    constructor() {
      (this.updateState(),
        this.router.events?.subscribe((n) => {
          n instanceof Qt && this.updateState();
        }));
    }
    updateState() {
      let { fragment: n, root: r, queryParams: o } = this.stateManager.getCurrentUrlTree();
      (this.fragment.set(n),
        this.queryParams.set(o),
        this.path.set(this.serializer.serialize(new ct(r))));
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = de$1({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var hE = (() => {
  class e {
    router;
    route;
    tabIndexAttribute;
    renderer;
    el;
    locationStrategy;
    hrefAttributeValue = b(new Gc(`href`), { optional: !0 });
    reactiveHref = bp(() => {
      if (!this.isAnchorElement) return this.hrefAttributeValue;
      (this.reactiveRouterState.path(),
        this._preserveFragment() && this.reactiveRouterState.fragment());
      let n = (r) => r === `preserve` || r === `merge`;
      return (
        (n(this._queryParamsHandling()) || n(this.options?.defaultQueryParamsHandling)) &&
          this.reactiveRouterState.queryParams(),
        this.computeHref(this.createUrlTree())
      );
    });
    get href() {
      return fe$1(this.reactiveHref);
    }
    set href(n) {
      this.reactiveHref.set(n);
    }
    set target(n) {
      this._target.set(n);
    }
    get target() {
      return fe$1(this._target);
    }
    _target = Ce$1(void 0);
    set queryParams(n) {
      this._queryParams.set(n);
    }
    get queryParams() {
      return fe$1(this._queryParams);
    }
    _queryParams = Ce$1(void 0, { equal: () => !1 });
    set fragment(n) {
      this._fragment.set(n);
    }
    get fragment() {
      return fe$1(this._fragment);
    }
    _fragment = Ce$1(void 0);
    set queryParamsHandling(n) {
      this._queryParamsHandling.set(n);
    }
    get queryParamsHandling() {
      return fe$1(this._queryParamsHandling);
    }
    _queryParamsHandling = Ce$1(void 0);
    set state(n) {
      this._state.set(n);
    }
    get state() {
      return fe$1(this._state);
    }
    _state = Ce$1(void 0, { equal: () => !1 });
    set info(n) {
      this._info.set(n);
    }
    get info() {
      return fe$1(this._info);
    }
    _info = Ce$1(void 0, { equal: () => !1 });
    set relativeTo(n) {
      this._relativeTo.set(n);
    }
    get relativeTo() {
      return fe$1(this._relativeTo);
    }
    _relativeTo = Ce$1(void 0);
    set preserveFragment(n) {
      this._preserveFragment.set(n);
    }
    get preserveFragment() {
      return fe$1(this._preserveFragment);
    }
    _preserveFragment = Ce$1(!1);
    set skipLocationChange(n) {
      this._skipLocationChange.set(n);
    }
    get skipLocationChange() {
      return fe$1(this._skipLocationChange);
    }
    _skipLocationChange = Ce$1(!1);
    set replaceUrl(n) {
      this._replaceUrl.set(n);
    }
    get replaceUrl() {
      return fe$1(this._replaceUrl);
    }
    _replaceUrl = Ce$1(!1);
    browserUrl = Yc(void 0);
    isAnchorElement;
    onChanges = new le();
    applicationErrorHandler = b(st);
    options = b(zr, { optional: !0 });
    reactiveRouterState = b(jO);
    constructor(n, r, o, i, s, a) {
      ((this.router = n),
        (this.route = r),
        (this.tabIndexAttribute = o),
        (this.renderer = i),
        (this.el = s),
        (this.locationStrategy = a));
      let c = s.nativeElement.tagName?.toLowerCase();
      this.isAnchorElement =
        c === `a` ||
        c === `area` ||
        !!(
          typeof customElements == `object` &&
          customElements.get(c)?.observedAttributes?.includes?.(`href`)
        );
    }
    setTabIndexIfNotOnNativeEl(n) {
      this.tabIndexAttribute != null ||
        this.isAnchorElement ||
        this.applyAttributeValue(`tabindex`, n);
    }
    ngOnChanges(n) {
      this.onChanges.next(this);
    }
    routerLinkInput = Ce$1(null);
    set routerLink(n) {
      n == null
        ? (this.routerLinkInput.set(null), this.setTabIndexIfNotOnNativeEl(null))
        : (Kn(n)
            ? this.routerLinkInput.set(n)
            : this.routerLinkInput.set(Array.isArray(n) ? n : [n]),
          this.setTabIndexIfNotOnNativeEl(`0`));
    }
    onClick(n, r, o, i, s) {
      let a = this.urlTree;
      if (
        a === null ||
        (this.isAnchorElement &&
          (n !== 0 ||
            r ||
            o ||
            i ||
            s ||
            (typeof this.target == `string` && this.target != `_self`)))
      )
        return !0;
      let c = this.browserUrl(),
        d = C(
          {
            skipLocationChange: this.skipLocationChange,
            replaceUrl: this.replaceUrl,
            state: this.state,
            info: this.info,
          },
          c !== void 0 && { browserUrl: c },
        );
      return (
        this.router.navigateByUrl(a, d)?.catch((h) => {
          this.applicationErrorHandler(h);
        }),
        !this.isAnchorElement
      );
    }
    ngOnDestroy() {}
    applyAttributeValue(n, r) {
      let o = this.renderer,
        i = this.el.nativeElement;
      r !== null ? o.setAttribute(i, n, r) : o.removeAttribute(i, n);
    }
    createUrlTree() {
      let n = this.routerLinkInput();
      return n === null || !this.router.createUrlTree
        ? null
        : Kn(n)
          ? n
          : this.router.createUrlTree(n, {
              relativeTo: this._relativeTo() !== void 0 ? this._relativeTo() : this.route,
              queryParams: this._queryParams(),
              fragment: this._fragment(),
              queryParamsHandling: this._queryParamsHandling(),
              preserveFragment: this._preserveFragment(),
            });
    }
    get urlTree() {
      return fe$1(() => this.createUrlTree());
    }
    computeHref(n) {
      return n !== null && this.locationStrategy
        ? (this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(n)) ?? ``)
        : null;
    }
    static ɵfac = function (r) {
      return new (r || e)(bt(Ko), bt(In), Yi(`tabindex`), bt(Oo), bt(Gn), bt(Wt));
    };
    static ɵdir = kr({
      type: e,
      selectors: [[``, `routerLink`, ``]],
      hostVars: 2,
      hostBindings: function (r, o) {
        (r & 1 &&
          Hc(`click`, function (s) {
            return o.onClick(s.button, s.ctrlKey, s.shiftKey, s.altKey, s.metaKey);
          }),
          r & 2 && Uc(`href`, o.reactiveHref(), kf)(`target`, o._target()));
      },
      inputs: {
        target: `target`,
        queryParams: `queryParams`,
        fragment: `fragment`,
        queryParamsHandling: `queryParamsHandling`,
        state: `state`,
        info: `info`,
        relativeTo: `relativeTo`,
        preserveFragment: [2, `preserveFragment`, `preserveFragment`, Kc],
        skipLocationChange: [2, `skipLocationChange`, `skipLocationChange`, Kc],
        replaceUrl: [2, `replaceUrl`, `replaceUrl`, Kc],
        browserUrl: [1, `browserUrl`],
        routerLink: `routerLink`,
      },
      features: [xr],
    });
  }
  return e;
})();
var BO = new A(``);
function UO(e, ...t) {
  return Vt([
    { provide: _s, multi: !0, useValue: e },
    { provide: In, useFactory: VO },
    { provide: rs, multi: !0, useFactory: HO },
    t.map((n) => n.ɵproviders),
  ]);
}
function VO() {
  return b(Ko).routerState.root;
}
function gE(e, t) {
  return { ɵkind: e, ɵproviders: t };
}
function HO() {
  let e = b(Fe);
  return (t) => {
    let n = e.get(Pr);
    if (t !== n.components[0]) return;
    let r = e.get(Ko),
      o = e.get($O);
    (e.get(zO) === 1 && r.initialNavigation(),
      e.get(qO, null, { optional: !0 })?.setUpPreloading(),
      e.get(BO, null, { optional: !0 })?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe()));
  };
}
var $O = new A(``, { factory: () => new le() });
var zO = new A(``, { factory: () => 1 });
var qO = new A(``);
function GO(e) {
  return gE(5, [{ provide: zr, useValue: e }]);
}
function WO() {
  return gE(6, [{ provide: Wt, useClass: Rp }]);
}
var Ns = dT(mE());
var yE = class e {
  success(t) {
    Ns.default.fire({
      icon: `success`,
      text: t,
      showConfirmButton: !1,
      timer: 3500,
      timerProgressBar: !0,
    });
  }
  error(t, n = `Error`) {
    Ns.default.fire({ icon: `error`, title: n, text: t, confirmButtonText: `OK` });
  }
  info(t) {
    Ns.default.fire({ icon: `info`, text: t, showConfirmButton: !1, timer: 3500 });
  }
  async confirm(t) {
    return (
      await Ns.default.fire({
        title: t.title,
        text: t.text,
        icon: `warning`,
        showCancelButton: !0,
        confirmButtonColor: t.isDanger ? `#b3261e` : `#1d4e89`,
        cancelButtonColor: `#4a5666`,
        confirmButtonText: t.confirmButtonText ?? `Confirm`,
        cancelButtonText: t.cancelButtonText ?? `Cancel`,
        reverseButtons: !0,
        focusCancel: !0,
      })
    ).isConfirmed;
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
};
var Qo = new A(`API_BASE_URL`);
var vE = class e {
  http;
  baseUrl;
  jsonParseReviver = void 0;
  constructor(t, n) {
    ((this.http = t), (this.baseUrl = n ?? ``));
  }
  get() {
    let t = this.baseUrl + `/api/premium-adjustment-options`;
    t = t.replace(/[?&]$/, ``);
    let n = {
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ Accept: `application/json` }),
    };
    return this.http
      .request(`get`, t, n)
      .pipe(S((r) => this.processGet(r)))
      .pipe(
        re((r) => {
          if (r instanceof ae)
            try {
              return this.processGet(r);
            } catch (o) {
              return j(o);
            }
          else return j(r);
        }),
      );
  }
  processGet(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  static ɵfac = function (n) {
    return new (n || e)(N(Cn), N(Qo, 8));
  };
  static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
};
var wE = class e {
  http;
  baseUrl;
  jsonParseReviver = void 0;
  constructor(t, n) {
    ((this.http = t), (this.baseUrl = n ?? ``));
  }
  list(t, n, r, o, i, s, a, c, d, h, p, m, y, w, T, E) {
    let _ = this.baseUrl + `/api/premium-adjustments?`;
    if (t === null) throw new globalThis.Error(`The parameter 'page' cannot be null.`);
    if ((t !== void 0 && (_ += `page=` + encodeURIComponent(`` + t) + `&`), n === null))
      throw new globalThis.Error(`The parameter 'codeType' cannot be null.`);
    if ((n !== void 0 && (_ += `codeType=` + encodeURIComponent(`` + n) + `&`), r === null))
      throw new globalThis.Error(`The parameter 'codeTypeOperator' cannot be null.`);
    if ((r !== void 0 && (_ += `codeTypeOperator=` + encodeURIComponent(`` + r) + `&`), o === null))
      throw new globalThis.Error(`The parameter 'code' cannot be null.`);
    if ((o !== void 0 && (_ += `code=` + encodeURIComponent(`` + o) + `&`), i === null))
      throw new globalThis.Error(`The parameter 'codeOperator' cannot be null.`);
    if ((i !== void 0 && (_ += `codeOperator=` + encodeURIComponent(`` + i) + `&`), s === null))
      throw new globalThis.Error(`The parameter 'companyCode' cannot be null.`);
    if ((s !== void 0 && (_ += `companyCode=` + encodeURIComponent(`` + s) + `&`), a === null))
      throw new globalThis.Error(`The parameter 'companyCodeOperator' cannot be null.`);
    if (
      (a !== void 0 && (_ += `companyCodeOperator=` + encodeURIComponent(`` + a) + `&`), c === null)
    )
      throw new globalThis.Error(`The parameter 'name' cannot be null.`);
    if ((c !== void 0 && (_ += `name=` + encodeURIComponent(`` + c) + `&`), d === null))
      throw new globalThis.Error(`The parameter 'nameOperator' cannot be null.`);
    if ((d !== void 0 && (_ += `nameOperator=` + encodeURIComponent(`` + d) + `&`), h === null))
      throw new globalThis.Error(`The parameter 'shortName' cannot be null.`);
    if ((h !== void 0 && (_ += `shortName=` + encodeURIComponent(`` + h) + `&`), p === null))
      throw new globalThis.Error(`The parameter 'shortNameOperator' cannot be null.`);
    if (
      (p !== void 0 && (_ += `shortNameOperator=` + encodeURIComponent(`` + p) + `&`), m === null)
    )
      throw new globalThis.Error(`The parameter 'active' cannot be null.`);
    if ((m !== void 0 && (_ += `active=` + encodeURIComponent(`` + m) + `&`), y === null))
      throw new globalThis.Error(`The parameter 'activeOperator' cannot be null.`);
    if ((y !== void 0 && (_ += `activeOperator=` + encodeURIComponent(`` + y) + `&`), w === null))
      throw new globalThis.Error(`The parameter 'sortBy' cannot be null.`);
    if ((w !== void 0 && (_ += `sortBy=` + encodeURIComponent(`` + w) + `&`), T === null))
      throw new globalThis.Error(`The parameter 'sortDirection' cannot be null.`);
    if ((T !== void 0 && (_ += `sortDirection=` + encodeURIComponent(`` + T) + `&`), E === null))
      throw new globalThis.Error(`The parameter 'pageSize' cannot be null.`);
    (E !== void 0 && (_ += `pageSize=` + encodeURIComponent(`` + E) + `&`),
      (_ = _.replace(/[?&]$/, ``)));
    let V = {
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ Accept: `application/json` }),
    };
    return this.http
      .request(`get`, _, V)
      .pipe(S((pe) => this.processList(pe)))
      .pipe(
        re((pe) => {
          if (pe instanceof ae)
            try {
              return this.processList(pe);
            } catch (xt) {
              return j(xt);
            }
          else return j(pe);
        }),
      );
  }
  processList(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  create(t) {
    let n = this.baseUrl + `/api/premium-adjustments`;
    n = n.replace(/[?&]$/, ``);
    let o = {
      body: JSON.stringify(t),
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ 'Content-Type': `application/json`, Accept: `application/json` }),
    };
    return this.http
      .request(`post`, n, o)
      .pipe(S((i) => this.processCreate(i)))
      .pipe(
        re((i) => {
          if (i instanceof ae)
            try {
              return this.processCreate(i);
            } catch (s) {
              return j(s);
            }
          else return j(i);
        }),
      );
  }
  processCreate(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  get(t, n, r) {
    let o = this.baseUrl + `/api/premium-adjustments/{codeType}/{code}/{companyCode}`;
    if (t == null) throw new globalThis.Error(`The parameter 'codeType' must be defined.`);
    if (((o = o.replace(`{codeType}`, encodeURIComponent(`` + t))), n == null))
      throw new globalThis.Error(`The parameter 'code' must be defined.`);
    if (((o = o.replace(`{code}`, encodeURIComponent(`` + n))), r == null))
      throw new globalThis.Error(`The parameter 'companyCode' must be defined.`);
    ((o = o.replace(`{companyCode}`, encodeURIComponent(`` + r))), (o = o.replace(/[?&]$/, ``)));
    let i = {
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ Accept: `application/json` }),
    };
    return this.http
      .request(`get`, o, i)
      .pipe(S((s) => this.processGet(s)))
      .pipe(
        re((s) => {
          if (s instanceof ae)
            try {
              return this.processGet(s);
            } catch (a) {
              return j(a);
            }
          else return j(s);
        }),
      );
  }
  processGet(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  update(t, n, r, o) {
    let i = this.baseUrl + `/api/premium-adjustments/{codeType}/{code}/{companyCode}`;
    if (t == null) throw new globalThis.Error(`The parameter 'codeType' must be defined.`);
    if (((i = i.replace(`{codeType}`, encodeURIComponent(`` + t))), n == null))
      throw new globalThis.Error(`The parameter 'code' must be defined.`);
    if (((i = i.replace(`{code}`, encodeURIComponent(`` + n))), r == null))
      throw new globalThis.Error(`The parameter 'companyCode' must be defined.`);
    ((i = i.replace(`{companyCode}`, encodeURIComponent(`` + r))), (i = i.replace(/[?&]$/, ``)));
    let a = {
      body: JSON.stringify(o),
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ 'Content-Type': `application/json`, Accept: `application/json` }),
    };
    return this.http
      .request(`put`, i, a)
      .pipe(S((c) => this.processUpdate(c)))
      .pipe(
        re((c) => {
          if (c instanceof ae)
            try {
              return this.processUpdate(c);
            } catch (d) {
              return j(d);
            }
          else return j(c);
        }),
      );
  }
  processUpdate(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  delete(t, n, r) {
    let o = this.baseUrl + `/api/premium-adjustments/{codeType}/{code}/{companyCode}`;
    if (t == null) throw new globalThis.Error(`The parameter 'codeType' must be defined.`);
    if (((o = o.replace(`{codeType}`, encodeURIComponent(`` + t))), n == null))
      throw new globalThis.Error(`The parameter 'code' must be defined.`);
    if (((o = o.replace(`{code}`, encodeURIComponent(`` + n))), r == null))
      throw new globalThis.Error(`The parameter 'companyCode' must be defined.`);
    ((o = o.replace(`{companyCode}`, encodeURIComponent(`` + r))), (o = o.replace(/[?&]$/, ``)));
    let i = { observe: `response`, responseType: `blob`, headers: new ee({}) };
    return this.http
      .request(`delete`, o, i)
      .pipe(S((s) => this.processDelete(s)))
      .pipe(
        re((s) => {
          if (s instanceof ae)
            try {
              return this.processDelete(s);
            } catch (a) {
              return j(a);
            }
          else return j(s);
        }),
      );
  }
  processDelete(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(S((i) => I$1(null)))
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  static ɵfac = function (n) {
    return new (n || e)(N(Cn), N(Qo, 8));
  };
  static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
};
var bE = class e {
  http;
  baseUrl;
  jsonParseReviver = void 0;
  constructor(t, n) {
    ((this.http = t), (this.baseUrl = n ?? ``));
  }
  list(t, n, r, o, i, s, a, c, d, h, p, m) {
    let y = this.baseUrl + `/api/vehicle-makes?`;
    if (t === null) throw new globalThis.Error(`The parameter 'page' cannot be null.`);
    if ((t !== void 0 && (y += `page=` + encodeURIComponent(`` + t) + `&`), n === null))
      throw new globalThis.Error(`The parameter 'makeCode' cannot be null.`);
    if ((n !== void 0 && (y += `makeCode=` + encodeURIComponent(`` + n) + `&`), r === null))
      throw new globalThis.Error(`The parameter 'makeCodeOperator' cannot be null.`);
    if ((r !== void 0 && (y += `makeCodeOperator=` + encodeURIComponent(`` + r) + `&`), o === null))
      throw new globalThis.Error(`The parameter 'makeName' cannot be null.`);
    if ((o !== void 0 && (y += `makeName=` + encodeURIComponent(`` + o) + `&`), i === null))
      throw new globalThis.Error(`The parameter 'makeNameOperator' cannot be null.`);
    if ((i !== void 0 && (y += `makeNameOperator=` + encodeURIComponent(`` + i) + `&`), s === null))
      throw new globalThis.Error(`The parameter 'shortName' cannot be null.`);
    if ((s !== void 0 && (y += `shortName=` + encodeURIComponent(`` + s) + `&`), a === null))
      throw new globalThis.Error(`The parameter 'shortNameOperator' cannot be null.`);
    if (
      (a !== void 0 && (y += `shortNameOperator=` + encodeURIComponent(`` + a) + `&`), c === null)
    )
      throw new globalThis.Error(`The parameter 'active' cannot be null.`);
    if ((c !== void 0 && (y += `active=` + encodeURIComponent(`` + c) + `&`), d === null))
      throw new globalThis.Error(`The parameter 'activeOperator' cannot be null.`);
    if ((d !== void 0 && (y += `activeOperator=` + encodeURIComponent(`` + d) + `&`), h === null))
      throw new globalThis.Error(`The parameter 'sortBy' cannot be null.`);
    if ((h !== void 0 && (y += `sortBy=` + encodeURIComponent(`` + h) + `&`), p === null))
      throw new globalThis.Error(`The parameter 'sortDirection' cannot be null.`);
    if ((p !== void 0 && (y += `sortDirection=` + encodeURIComponent(`` + p) + `&`), m === null))
      throw new globalThis.Error(`The parameter 'pageSize' cannot be null.`);
    (m !== void 0 && (y += `pageSize=` + encodeURIComponent(`` + m) + `&`),
      (y = y.replace(/[?&]$/, ``)));
    let w = {
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ Accept: `application/json` }),
    };
    return this.http
      .request(`get`, y, w)
      .pipe(S((T) => this.processList(T)))
      .pipe(
        re((T) => {
          if (T instanceof ae)
            try {
              return this.processList(T);
            } catch (E) {
              return j(E);
            }
          else return j(T);
        }),
      );
  }
  processList(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  create(t) {
    let n = this.baseUrl + `/api/vehicle-makes`;
    n = n.replace(/[?&]$/, ``);
    let o = {
      body: JSON.stringify(t),
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ 'Content-Type': `application/json`, Accept: `application/json` }),
    };
    return this.http
      .request(`post`, n, o)
      .pipe(S((i) => this.processCreate(i)))
      .pipe(
        re((i) => {
          if (i instanceof ae)
            try {
              return this.processCreate(i);
            } catch (s) {
              return j(s);
            }
          else return j(i);
        }),
      );
  }
  processCreate(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  get(t) {
    let n = this.baseUrl + `/api/vehicle-makes/{makeCode}`;
    if (t == null) throw new globalThis.Error(`The parameter 'makeCode' must be defined.`);
    ((n = n.replace(`{makeCode}`, encodeURIComponent(`` + t))), (n = n.replace(/[?&]$/, ``)));
    let r = {
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ Accept: `application/json` }),
    };
    return this.http
      .request(`get`, n, r)
      .pipe(S((o) => this.processGet(o)))
      .pipe(
        re((o) => {
          if (o instanceof ae)
            try {
              return this.processGet(o);
            } catch (i) {
              return j(i);
            }
          else return j(o);
        }),
      );
  }
  processGet(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  update(t, n) {
    let r = this.baseUrl + `/api/vehicle-makes/{makeCode}`;
    if (t == null) throw new globalThis.Error(`The parameter 'makeCode' must be defined.`);
    ((r = r.replace(`{makeCode}`, encodeURIComponent(`` + t))), (r = r.replace(/[?&]$/, ``)));
    let i = {
      body: JSON.stringify(n),
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ 'Content-Type': `application/json`, Accept: `application/json` }),
    };
    return this.http
      .request(`put`, r, i)
      .pipe(S((s) => this.processUpdate(s)))
      .pipe(
        re((s) => {
          if (s instanceof ae)
            try {
              return this.processUpdate(s);
            } catch (a) {
              return j(a);
            }
          else return j(s);
        }),
      );
  }
  processUpdate(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  delete(t) {
    let n = this.baseUrl + `/api/vehicle-makes/{makeCode}`;
    if (t == null) throw new globalThis.Error(`The parameter 'makeCode' must be defined.`);
    ((n = n.replace(`{makeCode}`, encodeURIComponent(`` + t))), (n = n.replace(/[?&]$/, ``)));
    let r = { observe: `response`, responseType: `blob`, headers: new ee({}) };
    return this.http
      .request(`delete`, n, r)
      .pipe(S((o) => this.processDelete(o)))
      .pipe(
        re((o) => {
          if (o instanceof ae)
            try {
              return this.processDelete(o);
            } catch (i) {
              return j(i);
            }
          else return j(o);
        }),
      );
  }
  processDelete(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(S((i) => I$1(null)))
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  static ɵfac = function (n) {
    return new (n || e)(N(Cn), N(Qo, 8));
  };
  static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
};
var DE = class e {
  http;
  baseUrl;
  jsonParseReviver = void 0;
  constructor(t, n) {
    ((this.http = t), (this.baseUrl = n ?? ``));
  }
  get() {
    let t = this.baseUrl + `/api/vehicle-model-options`;
    t = t.replace(/[?&]$/, ``);
    let n = {
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ Accept: `application/json` }),
    };
    return this.http
      .request(`get`, t, n)
      .pipe(S((r) => this.processGet(r)))
      .pipe(
        re((r) => {
          if (r instanceof ae)
            try {
              return this.processGet(r);
            } catch (o) {
              return j(o);
            }
          else return j(r);
        }),
      );
  }
  processGet(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  previewImport(t) {
    let n = this.baseUrl + `/api/vehicle-model-options/import/preview`;
    n = n.replace(/[?&]$/, ``);
    let o = {
      body: JSON.stringify(t),
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ 'Content-Type': `application/json`, Accept: `application/json` }),
    };
    return this.http
      .request(`post`, n, o)
      .pipe(S((i) => this.processPreviewImport(i)))
      .pipe(
        re((i) => {
          if (i instanceof ae)
            try {
              return this.processPreviewImport(i);
            } catch (s) {
              return j(s);
            }
          else return j(i);
        }),
      );
  }
  processPreviewImport(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  import(t) {
    let n = this.baseUrl + `/api/vehicle-model-options/import`;
    n = n.replace(/[?&]$/, ``);
    let o = {
      body: JSON.stringify(t),
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ 'Content-Type': `application/json`, Accept: `application/json` }),
    };
    return this.http
      .request(`post`, n, o)
      .pipe(S((i) => this.processImport(i)))
      .pipe(
        re((i) => {
          if (i instanceof ae)
            try {
              return this.processImport(i);
            } catch (s) {
              return j(s);
            }
          else return j(i);
        }),
      );
  }
  processImport(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  static ɵfac = function (n) {
    return new (n || e)(N(Cn), N(Qo, 8));
  };
  static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
};
var EE = class e {
  http;
  baseUrl;
  jsonParseReviver = void 0;
  constructor(t, n) {
    ((this.http = t), (this.baseUrl = n ?? ``));
  }
  list(t, n, r, o, i, s, a, c, d, h, p) {
    let m = this.baseUrl + `/api/vehicle-makes/{makeCode}/models?`;
    if (t == null) throw new globalThis.Error(`The parameter 'makeCode' must be defined.`);
    if (((m = m.replace(`{makeCode}`, encodeURIComponent(`` + t))), n === null))
      throw new globalThis.Error(`The parameter 'page' cannot be null.`);
    if ((n !== void 0 && (m += `page=` + encodeURIComponent(`` + n) + `&`), r === null))
      throw new globalThis.Error(`The parameter 'modelCode' cannot be null.`);
    if ((r !== void 0 && (m += `modelCode=` + encodeURIComponent(`` + r) + `&`), o === null))
      throw new globalThis.Error(`The parameter 'modelCodeOperator' cannot be null.`);
    if (
      (o !== void 0 && (m += `modelCodeOperator=` + encodeURIComponent(`` + o) + `&`), i === null)
    )
      throw new globalThis.Error(`The parameter 'modelName' cannot be null.`);
    if ((i !== void 0 && (m += `modelName=` + encodeURIComponent(`` + i) + `&`), s === null))
      throw new globalThis.Error(`The parameter 'modelNameOperator' cannot be null.`);
    if (
      (s !== void 0 && (m += `modelNameOperator=` + encodeURIComponent(`` + s) + `&`), a === null)
    )
      throw new globalThis.Error(`The parameter 'shortName' cannot be null.`);
    if ((a !== void 0 && (m += `shortName=` + encodeURIComponent(`` + a) + `&`), c === null))
      throw new globalThis.Error(`The parameter 'shortNameOperator' cannot be null.`);
    if (
      (c !== void 0 && (m += `shortNameOperator=` + encodeURIComponent(`` + c) + `&`), d === null)
    )
      throw new globalThis.Error(`The parameter 'active' cannot be null.`);
    if ((d !== void 0 && (m += `active=` + encodeURIComponent(`` + d) + `&`), h === null))
      throw new globalThis.Error(`The parameter 'activeOperator' cannot be null.`);
    if ((h !== void 0 && (m += `activeOperator=` + encodeURIComponent(`` + h) + `&`), p === null))
      throw new globalThis.Error(`The parameter 'pageSize' cannot be null.`);
    (p !== void 0 && (m += `pageSize=` + encodeURIComponent(`` + p) + `&`),
      (m = m.replace(/[?&]$/, ``)));
    let y = {
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ Accept: `application/json` }),
    };
    return this.http
      .request(`get`, m, y)
      .pipe(S((w) => this.processList(w)))
      .pipe(
        re((w) => {
          if (w instanceof ae)
            try {
              return this.processList(w);
            } catch (T) {
              return j(T);
            }
          else return j(w);
        }),
      );
  }
  processList(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  create(t, n) {
    let r = this.baseUrl + `/api/vehicle-makes/{makeCode}/models`;
    if (t == null) throw new globalThis.Error(`The parameter 'makeCode' must be defined.`);
    ((r = r.replace(`{makeCode}`, encodeURIComponent(`` + t))), (r = r.replace(/[?&]$/, ``)));
    let i = {
      body: JSON.stringify(n),
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ 'Content-Type': `application/json`, Accept: `application/json` }),
    };
    return this.http
      .request(`post`, r, i)
      .pipe(S((s) => this.processCreate(s)))
      .pipe(
        re((s) => {
          if (s instanceof ae)
            try {
              return this.processCreate(s);
            } catch (a) {
              return j(a);
            }
          else return j(s);
        }),
      );
  }
  processCreate(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  get(t, n) {
    let r = this.baseUrl + `/api/vehicle-makes/{makeCode}/models/{modelCode}`;
    if (t == null) throw new globalThis.Error(`The parameter 'makeCode' must be defined.`);
    if (((r = r.replace(`{makeCode}`, encodeURIComponent(`` + t))), n == null))
      throw new globalThis.Error(`The parameter 'modelCode' must be defined.`);
    ((r = r.replace(`{modelCode}`, encodeURIComponent(`` + n))), (r = r.replace(/[?&]$/, ``)));
    let o = {
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ Accept: `application/json` }),
    };
    return this.http
      .request(`get`, r, o)
      .pipe(S((i) => this.processGet(i)))
      .pipe(
        re((i) => {
          if (i instanceof ae)
            try {
              return this.processGet(i);
            } catch (s) {
              return j(s);
            }
          else return j(i);
        }),
      );
  }
  processGet(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  update(t, n, r) {
    let o = this.baseUrl + `/api/vehicle-makes/{makeCode}/models/{modelCode}`;
    if (t == null) throw new globalThis.Error(`The parameter 'makeCode' must be defined.`);
    if (((o = o.replace(`{makeCode}`, encodeURIComponent(`` + t))), n == null))
      throw new globalThis.Error(`The parameter 'modelCode' must be defined.`);
    ((o = o.replace(`{modelCode}`, encodeURIComponent(`` + n))), (o = o.replace(/[?&]$/, ``)));
    let s = {
      body: JSON.stringify(r),
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ 'Content-Type': `application/json`, Accept: `application/json` }),
    };
    return this.http
      .request(`put`, o, s)
      .pipe(S((a) => this.processUpdate(a)))
      .pipe(
        re((a) => {
          if (a instanceof ae)
            try {
              return this.processUpdate(a);
            } catch (c) {
              return j(c);
            }
          else return j(a);
        }),
      );
  }
  processUpdate(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  delete(t, n) {
    let r = this.baseUrl + `/api/vehicle-makes/{makeCode}/models/{modelCode}`;
    if (t == null) throw new globalThis.Error(`The parameter 'makeCode' must be defined.`);
    if (((r = r.replace(`{makeCode}`, encodeURIComponent(`` + t))), n == null))
      throw new globalThis.Error(`The parameter 'modelCode' must be defined.`);
    ((r = r.replace(`{modelCode}`, encodeURIComponent(`` + n))), (r = r.replace(/[?&]$/, ``)));
    let o = { observe: `response`, responseType: `blob`, headers: new ee({}) };
    return this.http
      .request(`delete`, r, o)
      .pipe(S((i) => this.processDelete(i)))
      .pipe(
        re((i) => {
          if (i instanceof ae)
            try {
              return this.processDelete(i);
            } catch (s) {
              return j(s);
            }
          else return j(i);
        }),
      );
  }
  processDelete(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(S((i) => I$1(null)))
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  static ɵfac = function (n) {
    return new (n || e)(N(Cn), N(Qo, 8));
  };
  static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
};
(class e {
  http;
  baseUrl;
  jsonParseReviver = void 0;
  constructor(t, n) {
    ((this.http = t), (this.baseUrl = n ?? ``));
  }
  get() {
    let t = this.baseUrl + `/WeatherForecast`;
    t = t.replace(/[?&]$/, ``);
    let n = {
      observe: `response`,
      responseType: `blob`,
      headers: new ee({ Accept: `application/json` }),
    };
    return this.http
      .request(`get`, t, n)
      .pipe(S((r) => this.processGet(r)))
      .pipe(
        re((r) => {
          if (r instanceof ae)
            try {
              return this.processGet(r);
            } catch (o) {
              return j(o);
            }
          else return j(r);
        }),
      );
  }
  processGet(t) {
    let n = t.status,
      r = t instanceof ce$1 ? t.body : t.error instanceof Blob ? t.error : void 0,
      o = {};
    if (t.headers) for (let i of t.headers.keys()) o[i] = t.headers.get(i);
    return n === 200
      ? q(r).pipe(
          S((i) => {
            let s = null;
            return ((s = i === `` ? null : JSON.parse(i, this.jsonParseReviver)), I$1(s));
          }),
        )
      : n !== 200 && n !== 204
        ? q(r).pipe(S((i) => Me$1(`An unexpected server error occurred.`, n, i, o)))
        : I$1(null);
  }
  static ɵfac = function (n) {
    return new (n || e)(N(Cn), N(Qo, 8));
  };
  static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
});
var Ch = class extends Error {
  message;
  status;
  response;
  headers;
  result;
  constructor(t, n, r, o, i) {
    (super(),
      (this.message = t),
      (this.status = n),
      (this.response = r),
      (this.headers = o),
      (this.result = i));
  }
  isSwaggerException = !0;
  static isSwaggerException(t) {
    return t.isSwaggerException === !0;
  }
};
function Me$1(e, t, n, r, o) {
  return o != null ? j(o) : j(new Ch(e, t, n, r, null));
}
function q(e) {
  return new F$1((t) => {
    if (!e) (t.next(``), t.complete());
    else {
      let n = new FileReader();
      ((n.onload = (r) => {
        (t.next(r.target.result), t.complete());
      }),
        n.readAsText(e));
    }
  });
}
function U(n) {
  n || (n = b(je));
  let e = new F$1((t) => {
    if (n.destroyed) {
      t.next();
      return;
    }
    return n.onDestroy(t.next.bind(t));
  });
  return (t) => t.pipe(hi(e));
}
function T(n, e) {
  let t = e?.injector ?? b(Fe),
    o = new ci(1),
    c = Ad(
      () => {
        let r;
        try {
          r = n();
        } catch (i) {
          fe$1(() => o.error(i));
          return;
        }
        fe$1(() => o.next(r));
      },
      { injector: t, manualCleanup: !0 },
    );
  return (
    t.get(je).onDestroy(() => {
      (c.destroy(), o.complete());
    }),
    o.asObservable()
  );
}
function F(n, e) {
  let o = !e?.manualCleanup ? (e?.injector?.get(je) ?? b(je)) : null,
    c = h(e?.equal),
    r;
  e?.requireSync
    ? (r = Ce$1({ kind: 0 }, { equal: c }))
    : (r = Ce$1({ kind: 1, value: e?.initialValue }, { equal: c }));
  let i,
    v = n.subscribe({
      next: (s) => r.set({ kind: 1, value: s }),
      error: (s) => {
        (r.set({ kind: 2, error: s }), i?.());
      },
      complete: () => {
        i?.();
      },
    });
  if (e?.requireSync && r().kind === 0) throw new M(601, !1);
  return (
    (i = o?.onDestroy(v.unsubscribe.bind(v))),
    wp(
      () => {
        let s = r();
        switch (s.kind) {
          case 1:
            return s.value;
          case 2:
            throw s.error;
          case 0:
            throw new M(601, !1);
        }
      },
      { equal: e?.equal },
    )
  );
}
function h(n = Object.is) {
  return (e, t) => e.kind === 1 && t.kind === 1 && n(e.value, t.value);
}
var r = class extends Error {
  constructor(o) {
    super(`The API request failed with status ${o.status}.`);
    this.problem = o;
    this.name = `ApiProblemError`;
  }
  problem;
};
function n(e) {
  return e instanceof r;
}
var pe = (e, t) => {
  let n = b(yE);
  return t(e).pipe(
    re((r$1) =>
      r$1 instanceof Fr
        ? ve$1(ve(r$1)).pipe(
            Xe((o) => {
              let s = e.url.includes(`/import`);
              return (!Ce(o) && !s && n.error(ge(o.status)), j(() => new r(o)));
            }),
          )
        : j(() => r$1),
    ),
  );
};
function Ce(e) {
  return (e.status === 400 || e.status === 409) && Object.keys(e.fieldErrors).length > 0;
}
function ge(e) {
  return e === 0
    ? `We could not reach the server. Check that the API is running, then try again.`
    : e === 400
      ? `Some values were not accepted. Please check what you entered and try again.`
      : e === 404
        ? `The record could not be found. It may have been deleted by someone else.`
        : e === 409
          ? `This change conflicts with existing records. Please check the values and try again.`
          : `A server error occurred. Please try again later.`;
}
async function ve(e) {
  let t = e.status;
  if (e.error instanceof Blob)
    try {
      let n = await e.error.text();
      return de(t, JSON.parse(n));
    } catch {
      return ce(t);
    }
  return e.error && typeof e.error == `object` ? de(t, e.error) : ce(t);
}
function de(e, t) {
  let n = t?.errors,
    r = {};
  if (n && typeof n == `object`)
    for (let [o, s] of Object.entries(n))
      Array.isArray(s) ? (r[o] = s.map(String)) : s && (r[o] = [String(s)]);
  return { status: e, fieldErrors: r };
}
function ce(e) {
  return { status: e, fieldErrors: {} };
}
var c = async (e) =>
  e.hasUnsavedChanges()
    ? await b(yE).confirm({
        title: `Discard your changes?`,
        text: `You have changes that have not been saved. If you leave now, they will be lost.`,
        confirmButtonText: `Discard changes`,
        cancelButtonText: `Keep editing`,
        isDanger: !0,
      })
    : !0;
var ue = [
  { path: ``, pathMatch: `full`, redirectTo: `vehicle-makes` },
  {
    path: `vehicle-makes/import`,
    title: `Import Vehicle Makes`,
    data: { breadcrumb: `make-import`, kind: `vehicle` },
    loadComponent: () => import(`./chunk--FchPtod.js`).then((e) => e.MasterDataImportComponent),
  },
  {
    path: `premium-adjustments/import`,
    title: `Import Premium Adjustments`,
    data: { breadcrumb: `premium-adjustment-import`, kind: `premium` },
    loadComponent: () => import(`./chunk--FchPtod.js`).then((e) => e.MasterDataImportComponent),
  },
  {
    path: `vehicle-model-options/import`,
    title: `Import Vehicle Dropdown Choices`,
    data: { breadcrumb: `vehicle-model-options-import` },
    loadComponent: () =>
      import(`./chunk-ZmKyNM92.js`).then((e) => e.VehicleModelOptionsImportComponent),
  },
  {
    path: `premium-adjustments/new`,
    title: `Add Premium Adjustment`,
    data: { mode: `create`, breadcrumb: `premium-adjustment-new` },
    canDeactivate: [c],
    loadComponent: () =>
      import(`./chunk-BZ8ZSb8g.js`).then((e) => e.PremiumAdjustmentFormComponent),
  },
  {
    path: `premium-adjustments/view`,
    title: `Premium Adjustment Details`,
    data: { mode: `view`, breadcrumb: `premium-adjustment-view` },
    canDeactivate: [c],
    loadComponent: () =>
      import(`./chunk-BZ8ZSb8g.js`).then((e) => e.PremiumAdjustmentFormComponent),
  },
  {
    path: `premium-adjustments`,
    pathMatch: `full`,
    title: `Premium Adjustment Master`,
    data: { breadcrumb: `premium-adjustments` },
    loadComponent: () =>
      import(`./chunk-BhJP7DBy.js`).then((e) => e.PremiumAdjustmentListComponent),
  },
  {
    path: `vehicle-makes`,
    title: `Vehicle Make Master`,
    data: { breadcrumb: `makes` },
    loadComponent: () => import(`./chunk-D8ogpf4W.js`).then((e) => e.VehicleMakeListComponent),
  },
  {
    path: `vehicle-makes/new`,
    title: `Add vehicle make`,
    data: { mode: `create`, breadcrumb: `make-new` },
    canDeactivate: [c],
    loadComponent: () => import(`./chunk-DZMlPWA2.js`).then((e) => e.VehicleMakeFormComponent),
  },
  {
    path: `vehicle-makes/view`,
    title: `Vehicle make details`,
    data: { mode: `view`, breadcrumb: `make-view` },
    canDeactivate: [c],
    loadComponent: () => import(`./chunk-DZMlPWA2.js`).then((e) => e.VehicleMakeFormComponent),
  },
  {
    path: `vehicle-makes/:makeCode/models/import`,
    title: `Import Vehicle Models`,
    data: { breadcrumb: `model-import`, kind: `model` },
    loadComponent: () => import(`./chunk--FchPtod.js`).then((e) => e.MasterDataImportComponent),
  },
  {
    path: `vehicle-makes/:makeCode/models/new`,
    title: `Add vehicle model`,
    data: { breadcrumb: `model-new` },
    canDeactivate: [c],
    loadComponent: () => import(`./chunk-nzJDI88G.js`).then((e) => e.VehicleModelFormComponent),
  },
  {
    path: `vehicle-makes/:makeCode/models/:modelCode/edit`,
    title: `Edit vehicle model`,
    data: { breadcrumb: `model-edit` },
    canDeactivate: [c],
    loadComponent: () => import(`./chunk-nzJDI88G.js`).then((e) => e.VehicleModelFormComponent),
  },
  { path: `**`, redirectTo: `vehicle-makes` },
];
var B = { providers: [RS(), UO(ue, WO(), GO({ urlUpdateStrategy: `eager` })), tx(nx([pe]))] };
var ye = [
  `makes`,
  `make-new`,
  `make-view`,
  `model-new`,
  `model-edit`,
  `premium-adjustments`,
  `premium-adjustment-new`,
  `premium-adjustment-view`,
  `vehicle-model-options-import`,
  `make-import`,
  `premium-adjustment-import`,
  `model-import`,
];
function fe(e) {
  return typeof e == `string` && ye.includes(e);
}
var m = { label: `Master Data` };
var p = { label: `Vehicle Makes`, link: [`/vehicle-makes`] };
function I(e) {
  let t = e.makeCode;
  return t
    ? { label: t, link: [`/vehicle-makes/view`], state: { makeCode: t } }
    : { label: `Vehicle make` };
}
function be(e, t) {
  switch (e) {
    case `makes`:
      return [m, { label: `Vehicle Makes` }];
    case `make-new`:
      return [m, p, { label: `Add vehicle make` }];
    case `make-view`:
      return [m, p, { label: t.makeCode ?? `Vehicle make` }];
    case `model-new`:
      return [m, p, I(t), { label: `Add model` }];
    case `model-edit`:
      return [m, p, I(t), { label: t.modelCode ? `Edit ${t.modelCode}` : `Edit model` }];
    case `premium-adjustments`:
      return [m, { label: `Premium Adjustments` }];
    case `premium-adjustment-new`:
      return [
        m,
        { label: `Premium Adjustments`, link: [`/premium-adjustments`] },
        { label: `Add Premium Adjustment` },
      ];
    case `premium-adjustment-view`:
      return [
        m,
        { label: `Premium Adjustments`, link: [`/premium-adjustments`] },
        { label: t.adjustmentCode ?? `Adjustment Details` },
      ];
    case `vehicle-model-options-import`:
      return [m, p, { label: `Import dropdown choices` }];
    case `make-import`:
      return [m, p, { label: `Import vehicle makes` }];
    case `premium-adjustment-import`:
      return [
        m,
        { label: `Premium Adjustments`, link: [`/premium-adjustments`] },
        { label: `Import premium adjustments` },
      ];
    case `model-import`:
      return [m, p, I(t), { label: `Import vehicle models` }];
  }
}
var y = class e {
  router = b(Ko);
  trail = F(
    this.router.events.pipe(
      Qe((t) => t instanceof Qt),
      Ia(null),
      ne(() => this.currentTrail()),
    ),
    { initialValue: [] },
  );
  currentTrail() {
    let t$1 = this.router.routerState.snapshot.root;
    for (; t$1.firstChild;) t$1 = t$1.firstChild;
    let n = t$1.data.breadcrumb;
    if (!fe(n)) return [];
    return be(n, {
      makeCode: t$1.paramMap.get(`makeCode`) ?? n$1(),
      modelCode: t$1.paramMap.get(`modelCode`),
      adjustmentCode: t()?.code ?? null,
    });
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = k$1({ token: e, factory: e.ɵfac, providedIn: `root` });
};
function _e(e, t) {
  if ((e & 1 && (Sc(0, `a`, 1), yA(1), up()), e & 2)) {
    let n = $N().$implicit;
    (tb(`routerLink`, n.link)(`state`, n.state), P_(), Eb(n.label));
  }
}
function xe(e, t) {
  if ((e & 1 && (Sc(0, `span`), yA(1), up()), e & 2)) {
    let n = $N(),
      r = n.$implicit,
      o = n.$index,
      s = n.$count;
    (Uc(`aria-current`, o === s - 1 ? `page` : null), P_(), Eb(r.label));
  }
}
function we(e, t) {
  e & 1 && (Sc(0, `span`, 2), yA(1, `›`), up());
}
function Pe(e, t) {
  if (
    (e & 1 &&
      (Sc(0, `li`), _N(1, _e, 2, 3, `a`, 1)(2, xe, 2, 2, `span`), _N(3, we, 2, 0, `span`, 2), up()),
    e & 2)
  ) {
    let n = t.$implicit,
      r = t.$index,
      o = t.$count;
    (P_(), AN(n.link && r !== o - 1 ? 1 : 2), P_(2), AN(r !== o - 1 ? 3 : -1));
  }
}
function Me(e, t) {
  if ((e & 1 && (Sc(0, `nav`, 0)(1, `ol`), ON(2, Pe, 4, 2, `li`, null, RN), up()()), e & 2)) {
    let n = $N();
    (P_(2), kN(n.trail()));
  }
}
var k = class e {
  trail = b(y).trail;
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = sp({
    type: e,
    selectors: [[`app-breadcrumb`]],
    decls: 1,
    vars: 1,
    consts: [
      [`aria-label`, `Breadcrumb`, 1, `breadcrumb`],
      [3, `routerLink`, `state`],
      [`aria-hidden`, `true`, 1, `separator`],
    ],
    template: function (n, r) {
      (n & 1 && _N(0, Me, 4, 0, `nav`, 0), n & 2 && AN(r.trail().length > 0 ? 0 : -1));
    },
    dependencies: [hE],
    styles: [
      `.breadcrumb[_ngcontent-%COMP%]{padding:10px 24px;background:var(--%NS%sdd-surface);border-bottom:1px solid var(--%NS%sdd-border)}ol[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin:0;padding:0;list-style:none;font-size:.9375rem;color:var(--%NS%sdd-muted)}li[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}a[_ngcontent-%COMP%]{color:var(--%NS%sdd-accent);text-decoration:none}a[_ngcontent-%COMP%]:hover, a[_ngcontent-%COMP%]:focus-visible{text-decoration:underline}[aria-current=page][_ngcontent-%COMP%]{color:var(--%NS%sdd-text);font-weight:600}.separator[_ngcontent-%COMP%]{color:var(--%NS%sdd-muted)}`,
    ],
  });
};
var _ = class e {
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = sp({
    type: e,
    selectors: [[`app-root`]],
    decls: 15,
    vars: 0,
    consts: [
      [`mastersMenu`, ``],
      [1, `app-header`],
      [1, `brand`],
      [1, `section-dropdown`],
      [1, `section`],
      [`aria-label`, `Masters`, 1, `section-menu`],
      [`routerLink`, `/vehicle-makes`, 3, `click`],
      [`routerLink`, `/premium-adjustments`, 3, `click`],
      [1, `app-content`],
    ],
    template: function (n, r) {
      if (n & 1) {
        let o = UN();
        (Sc(0, `header`, 1)(1, `span`, 2),
          yA(2, `Broker Insurance`),
          up(),
          Sc(3, `details`, 3, 0)(5, `summary`, 4),
          yA(6, `Masters`),
          up(),
          Sc(7, `nav`, 5)(8, `a`, 6),
          Hc(`click`, function () {
            Wm(o);
            let x = ZN(4);
            return Ym((x.open = !1));
          }),
          yA(9, `Vehicle Make`),
          up(),
          Sc(10, `a`, 7),
          Hc(`click`, function () {
            Wm(o);
            let x = ZN(4);
            return Ym((x.open = !1));
          }),
          yA(11, `Premium Adjustments`),
          up()()()(),
          Vc(12, `app-breadcrumb`),
          Sc(13, `main`, 8),
          Vc(14, `router-outlet`),
          up());
      }
    },
    dependencies: [hE, mh, k],
    styles: [
      `[_nghost-%COMP%]{display:block;min-height:100vh}.app-header[_ngcontent-%COMP%]{display:flex;align-items:baseline;gap:12px;padding:14px 24px;background:var(--%NS%sdd-header-bg);color:var(--%NS%sdd-header-text)}.brand[_ngcontent-%COMP%]{font-size:1.1rem;font-weight:600;letter-spacing:.02em}.section-dropdown[_ngcontent-%COMP%]{position:relative}.section[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:.9rem;opacity:.75;list-style:none}.section[_ngcontent-%COMP%]::-webkit-details-marker{display:none}.section[_ngcontent-%COMP%]:after{content:"\\25be";font-size:.75rem}.section-dropdown[open][_ngcontent-%COMP%]   .section[_ngcontent-%COMP%]:after{content:"\\25b4"}.section-menu[_ngcontent-%COMP%]{position:absolute;z-index:10;top:calc(100% + 10px);left:-10px;display:grid;min-width:190px;padding:6px;border:1px solid rgb(0 0 0 / 12%);border-radius:6px;background:var(--%NS%sdd-header-bg);box-shadow:0 4px 12px #00000029}.section-menu[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{padding:9px 10px;border-radius:4px;color:var(--%NS%sdd-header-text);text-decoration:none}.section-menu[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .section-menu[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:focus-visible{background:#7f7f7f2e;outline:none}`,
    ],
  });
};
fetch(`/runtime-config.json`)
  .then((e) => {
    if (!e.ok) throw new Error(`Could not load /runtime-config.json`);
    return e.json();
  })
  .then((e) => {
    if (typeof e.apiBaseUrl != `string`)
      throw new Error(`runtime-config.json must define apiBaseUrl as a string`);
    let t = Y(C({}, B), { providers: [...B.providers, { provide: Qo, useValue: e.apiBaseUrl }] });
    return AR(_, t);
  })
  .catch((e) => console.error(e));
export {
  QO as $,
  gp as $t,
  I$1 as A,
  sy as An,
  bE as At,
  Lr as B,
  wE as Bn,
  dp as Bt,
  GN as C,
  qN as Cn,
  _N as Ct,
  Gn as D,
  s3 as Dn,
  ab as Dt,
  Ge as E,
  rx as En,
  a3 as Et,
  KT as F,
  uo as Fn,
  cb as Ft,
  ON as G,
  xo as Gn,
  fi as Gt,
  MT as H,
  wp as Hn,
  fR as Ht,
  Kc as I,
  up as In,
  ci as It,
  Oo as J,
  yE as Jn,
  ft as Jt,
  OS as K,
  xr as Kn,
  fm as Kt,
  Ko as L,
  vE as Ln,
  dT as Lt,
  Ia as M,
  tc as Mn,
  bt as Mt,
  Ib as N,
  ub as Nn,
  bv as Nt,
  Gq as O,
  sA as On,
  ay as Ot,
  In as P,
  um as Pn,
  c3 as Pt,
  Pr as Q,
  go as Qt,
  Kw as R,
  va as Rn,
  db as Rt,
  Fe as S,
  pp as Sn,
  Zc as St,
  Gc as T,
  r3 as Tn,
  _e$1 as Tt,
  Mu as U,
  xN as Un,
  fb as Ut,
  M as V,
  we$1 as Vn,
  eb as Vt,
  Nr as W,
  xa as Wn,
  fe$1 as Wt,
  Pe$1 as X,
  n$1 as Xn,
  gb as Xt,
  P_ as Y,
  zT as Yn,
  gN as Yt,
  Pi as Z,
  t as Zn,
  ge$1 as Zt,
  DE as _,
  nb as _n,
  YN as _t,
  U as a,
  je as an,
  TA as at,
  Eb as b,
  o3 as bn,
  ZN as bt,
  AN as c,
  ki as cn,
  Uc as ct,
  Be as d,
  lb as dn,
  Wm as dt,
  hc as en,
  QT as et,
  C as f,
  le as fn,
  Wn as ft,
  Cu as g,
  n3 as gn,
  Y as gt,
  Cn as h,
  mp as hn,
  Xw as ht,
  T as i,
  ib as in,
  Sc as it,
  I0 as j,
  tb as jn,
  bn as jt,
  Hc as k,
  sp as kn,
  b as kt,
  Ad as l,
  kr as ln,
  Uf as lt,
  Ce$1 as m,
  me as mn,
  Xe as mt,
  r as n,
  hi as nn,
  Qo as nt,
  $N as o,
  jo as on,
  UN as ot,
  Cb as p,
  mb as pn,
  XT as pt,
  Oi as q,
  yA as qn,
  fp as qt,
  F as r,
  hp as rn,
  SA as rt,
  A as s,
  kN as sn,
  Ub as st,
  n as t,
  he as tn,
  Qe as tt,
  Ar as u,
  lT as un,
  Vc as ut,
  E0 as v,
  ne as vn,
  Yc as vt,
  GT as w,
  qT as wn,
  _T as wt,
  F$1 as x,
  ob as xn,
  ZT as xt,
  EE as y,
  ns as yn,
  Ym as yt,
  Ln as z,
  ve$1 as zn,
  de$1 as zt,
};
