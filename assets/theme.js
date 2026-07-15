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
    var LABELS = { auto: "主题：跟随系统", light: "主题：浅色", dark: "主题：深色" };

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
            btn.setAttribute("aria-label", LABELS[m] + "，点击切换");
            btn.title = LABELS[m] + "，点击切换";
        }
    }

    function init() {
        var style = document.createElement("style");
        style.textContent =
            ".zk-actions{display:inline-flex;align-items:center;gap:.5rem}" +
            ".top .zk-actions{margin-left:auto}" +
            ".zk-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:2.35rem;height:2.35rem;padding:0;border:1px solid var(--border,#e4e9f0);border-radius:999px;background:var(--surface,#fff);color:var(--text-2,#5b6b81);cursor:pointer;box-shadow:var(--shadow-sm,0 1px 2px rgba(15,23,42,.05));transition:color .2s,border-color .2s,background .2s}" +
            ".zk-icon-btn:hover,.zk-icon-btn:focus-visible{color:var(--text,#1e293b);border-color:var(--border-hover,#c9d4e3);background:var(--surface-hover,#f1f5f9);outline:none}" +
            ".zk-icon-btn:focus-visible{box-shadow:0 0 0 3px var(--brand-ring-soft,rgba(37,99,235,.12))}" +
            ".zk-icon-btn svg{width:16px;height:16px}";
        document.head.appendChild(style);

        var host = document.querySelector(".top") || document.querySelector(".toolbar");
        if (!host) return;
        var box = host.querySelector(".zk-actions");
        if (!box) {
            box = document.createElement("div");
            box.className = "zk-actions";
            host.appendChild(box);
        }
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "zk-icon-btn";
        btn.innerHTML = ICONS[mode()];
        btn.setAttribute("aria-label", LABELS[mode()] + "，点击切换");
        btn.title = LABELS[mode()] + "，点击切换";
        btn.addEventListener("click", function () {
            var order = ["auto", "light", "dark"];
            apply(order[(order.indexOf(mode()) + 1) % order.length], btn);
        });
        box.appendChild(btn);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
