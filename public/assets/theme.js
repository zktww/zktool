/* zktool 主题开关：跟随系统 → 浅色 → 深色 三态循环，存 localStorage。
   必须在 <head> 同步加载（不加 defer），保证手动主题在首屏渲染前生效；
   同时注入 .zk-actions / .zk-icon-btn 通用样式，palette.js 的搜索按钮复用。 */
(function () {
    "use strict";
    var KEY = "zktool.theme";
    var root = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* 隐私模式等场景忽略 */ }
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

    var ICONS = {
        auto: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><rect x='2' y='3' width='20' height='14' rx='2'/><path d='M8 21h8'/><path d='M12 17v4'/></svg>",
        light: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><circle cx='12' cy='12' r='4'/><path d='M12 2v2'/><path d='M12 20v2'/><path d='m4.93 4.93 1.41 1.41'/><path d='m17.66 17.66 1.41 1.41'/><path d='M2 12h2'/><path d='M20 12h2'/><path d='m6.34 17.66-1.41 1.41'/><path d='m19.07 4.93-1.41 1.41'/></svg>",
        dark: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/></svg>"
    };
    var EN = /^\/en(?:\/|$)/.test(location.pathname) || document.documentElement.lang === "en";
    var LABELS = EN
        ? { auto: "Theme: system", light: "Theme: light", dark: "Theme: dark" }
        : { auto: "主题：跟随系统", light: "主题：浅色", dark: "主题：深色" };
    var SWITCH_HINT = EN ? ", click to switch" : "，点击切换";

    function mode() { return root.getAttribute("data-theme") || "auto"; }

    function apply(m, btn) {
        if (m === "auto") {
            root.removeAttribute("data-theme");
            try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
        } else {
            root.setAttribute("data-theme", m);
            try { localStorage.setItem(KEY, m); } catch (e) { /* ignore */ }
        }
        if (btn) {
            btn.innerHTML = ICONS[m];
            btn.setAttribute("aria-label", LABELS[m] + SWITCH_HINT);
            btn.title = LABELS[m] + SWITCH_HINT;
        }
    }

    function init() {
        var style = document.createElement("style");
        style.textContent =
            ".zk-actions{display:inline-flex;align-items:center;gap:.42rem}" +
            ".top .zk-actions{margin-left:auto}" +
            ".zk-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;padding:0;border:1px solid var(--border,rgba(15,23,42,.085));border-radius:999px;background:var(--surface,#fff);color:var(--text-2,#52627a);cursor:pointer;box-shadow:var(--shadow-sm,0 1px 2px rgba(15,23,42,.04));transition:color .18s,border-color .18s,background .18s,transform .18s}" +
            ".zk-icon-btn:hover,.zk-icon-btn:focus-visible{color:var(--text,#0f172a);border-color:var(--border-hover,rgba(0,102,255,.28));background:var(--surface-hover,#f1f5fb);outline:none}" +
            ".zk-icon-btn:focus-visible{box-shadow:0 0 0 3px var(--brand-ring-soft,rgba(0,102,255,.14))}" +
            ".zk-icon-btn svg{width:15px;height:15px}" +
            ".zk-lang-link{display:inline-flex;align-items:center;justify-content:center;min-width:2.25rem;height:2.25rem;padding:0 .68rem;border:1px solid var(--border,rgba(15,23,42,.085));border-radius:999px;background:var(--surface,#fff);color:var(--text-2,#52627a);font:650 .76rem/1 inherit;text-decoration:none;box-shadow:var(--shadow-sm,0 1px 2px rgba(15,23,42,.04));transition:color .18s,border-color .18s,background .18s}" +
            ".zk-lang-link:hover{color:var(--text,#0f172a);border-color:var(--border-hover,rgba(0,102,255,.28));background:var(--surface-hover,#f1f5fb)}" +
            ".zk-lang-link:focus-visible{outline:2px solid var(--brand,#0066ff);outline-offset:3px}";
        document.head.appendChild(style);

        var host = document.querySelector(".top") || document.querySelector(".site-header") || document.querySelector(".toolbar");
        if (!host) return;
        var box = host.querySelector(".zk-actions");
        if (!box) {
            box = document.createElement("div");
            box.className = "zk-actions";
            host.appendChild(box);
        }
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "zk-icon-btn zk-theme-btn";
        btn.innerHTML = ICONS[mode()];
        btn.setAttribute("aria-label", LABELS[mode()] + SWITCH_HINT);
        btn.title = LABELS[mode()] + SWITCH_HINT;
        btn.addEventListener("click", function () {
            var order = ["auto", "light", "dark"];
            apply(order[(order.indexOf(mode()) + 1) % order.length], btn);
        });
        box.appendChild(btn);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();

    /* 供命令面板等调用：循环切换主题（会同步更新按钮图标） */
    window.zkTheme = {
        mode: mode,
        cycle: function () {
            var order = ["auto", "light", "dark"];
            apply(order[(order.indexOf(mode()) + 1) % order.length], document.querySelector(".zk-theme-btn"));
            return mode();
        }
    };
})();
