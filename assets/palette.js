/* zktool 命令面板：Ctrl+K / Cmd+K 呼出，搜索并跳转到任意工具。
   依赖 registry.js 先加载；根路径从本脚本 src 推导，主页和工具页都能用。 */
(function () {
    "use strict";
    if (!window.ZKTOOL_REGISTRY) return;

    /* 站点根路径：palette.js 位于 <root>/assets/ 下 */
    var root = "./";
    var self = document.currentScript || (function () {
        var ss = document.getElementsByTagName("script");
        for (var i = 0; i < ss.length; i++) if (/palette\.js/.test(ss[i].src)) return ss[i];
    })();
    if (self && self.src) root = self.src.replace(/assets\/palette\.js.*$/, "");

    var items = window.ZKTOOL_REGISTRY;
    var overlay, box, input, list, active = 0, filtered = items;

    /* 动作型条目：不跳转页面，执行本地操作 */
    var ACTIONS = [
        { name: "切换主题", desc: "跟随系统 → 浅色 → 深色 循环", tag: "动作", kw: "theme dark light qhzt 切换 主题 暗色 深色 浅色", run: function () {
            if (window.zkTheme) {
                var m = window.zkTheme.cycle();
                if (window.zkToast) zkToast({ auto: "主题：跟随系统", light: "主题：浅色", dark: "主题：深色" }[m]);
            }
        } },
        { name: "复制本页链接", desc: "把当前页面地址复制到剪贴板", tag: "动作", kw: "copy link url fzlj 复制 链接 地址", run: function () {
            var url = location.href;
            var done = function () { if (window.zkToast) zkToast("链接已复制"); };
            if (window.copyText) copyText(url).then(done, function () {});
            else if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () {});
        } },
    ];

    function readRecents() {
        try { return JSON.parse(localStorage.getItem("zktool.recents")) || []; } catch (e) { return []; }
    }

    /* 空查询：最近使用的工具排前面（recents 存主页卡片 href，即相对根路径），动作条目垫底 */
    function defaultList() {
        var recents = readRecents();
        var sorted = items.slice().sort(function (a, b) {
            var ra = recents.indexOf(a.path); if (ra < 0) ra = 999;
            var rb = recents.indexOf(b.path); if (rb < 0) rb = 999;
            return ra - rb;
        });
        return sorted.concat(ACTIONS);
    }

    var css = [
        ".zk-palette{position:fixed;inset:0;z-index:1000;display:none;background:rgba(15,23,42,.4);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}",
        ".zk-palette.open{display:block}",
        ".zk-palette-box{max-width:560px;margin:12vh auto 0;padding:.55rem;border:1px solid var(--border,#e4e9f0);border-radius:14px;background:var(--surface,#fff);box-shadow:0 24px 64px -24px rgba(0,0,0,.4)}",
        ".zk-palette-box input{width:100%;font:inherit;font-size:1rem;padding:.65rem .8rem;border:1px solid var(--border,#e4e9f0);border-radius:10px;background:var(--bg-soft,#f8fafc);color:var(--text,#1e293b);outline:none;min-height:0}",
        ".zk-palette-box input:focus{border-color:var(--brand-ring,rgba(37,99,235,.55));box-shadow:0 0 0 3px var(--brand-ring-soft,rgba(37,99,235,.12))}",
        ".zk-palette-list{max-height:46vh;overflow-y:auto;margin-top:.45rem}",
        ".zk-palette-item{display:flex;align-items:baseline;gap:.6rem;padding:.55rem .7rem;border-radius:9px;cursor:pointer;color:var(--text,#1e293b)}",
        ".zk-palette-item .zk-tag{flex-shrink:0;font-size:.66rem;padding:.1rem .5rem;border-radius:999px;border:1px solid var(--border,#e4e9f0);color:var(--text-2,#5b6b81)}",
        ".zk-palette-item .zk-desc{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-3,#94a3b8);font-size:.78rem}",
        ".zk-palette-item.active{background:var(--brand-soft,rgba(37,99,235,.1))}",
        ".zk-palette-item b{font-weight:650;font-size:.9rem}",
        ".zk-palette-empty{padding:1rem;text-align:center;color:var(--text-3,#94a3b8);font-size:.85rem}",
        ".zk-palette-hint{padding:.4rem .7rem 0;color:var(--text-3,#94a3b8);font-size:.72rem;text-align:right}",
    ].join("");

    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]; }); }

    function build() {
        var style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
        overlay = document.createElement("div");
        overlay.className = "zk-palette";
        overlay.innerHTML = "<div class='zk-palette-box' role='dialog' aria-modal='true' aria-label='工具搜索'>" +
            "<input type='text' placeholder='搜索工具，回车打开…' aria-label='搜索工具' />" +
            "<div class='zk-palette-list' role='listbox'></div>" +
            "<div class='zk-palette-hint'>↑↓ 选择 · Enter 打开 · Esc 关闭</div></div>";
        document.body.appendChild(overlay);
        box = overlay.firstChild;
        input = box.querySelector("input");
        list = box.querySelector(".zk-palette-list");
        overlay.addEventListener("mousedown", function (e) { if (e.target === overlay) close(); });
        input.addEventListener("input", function () { filter(); render(); });
        input.addEventListener("keydown", function (e) {
            if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); render(); }
            else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); render(); }
            else if (e.key === "Enter") { e.preventDefault(); go(filtered[active]); }
            else if (e.key === "Escape") { e.preventDefault(); close(); }
        });
        list.addEventListener("click", function (e) {
            var el = e.target.closest("[data-i]");
            if (el) go(filtered[+el.getAttribute("data-i")]);
        });
        list.addEventListener("mousemove", function (e) {
            var el = e.target.closest("[data-i]");
            if (el && +el.getAttribute("data-i") !== active) { active = +el.getAttribute("data-i"); render(); }
        });
    }

    function filter() {
        var kw = input.value.trim().toLowerCase();
        active = 0;
        var pool = items.concat(ACTIONS);
        if (!kw) { filtered = defaultList(); return; }
        /* 名称命中的排在描述/关键词命中的前面 */
        filtered = pool.filter(function (it) {
            return (it.name + " " + it.desc + " " + it.kw + " " + it.tag).toLowerCase().indexOf(kw) >= 0;
        }).sort(function (a, b) {
            var na = a.name.toLowerCase().indexOf(kw) >= 0 ? 0 : 1;
            var nb = b.name.toLowerCase().indexOf(kw) >= 0 ? 0 : 1;
            return na - nb;
        });
    }

    function render() {
        if (!filtered.length) { list.innerHTML = "<div class='zk-palette-empty'>没有匹配的工具</div>"; return; }
        list.innerHTML = filtered.map(function (it, i) {
            return "<div class='zk-palette-item" + (i === active ? " active" : "") + "' data-i='" + i + "' role='option' aria-selected='" + (i === active) + "'>" +
                "<b>" + esc(it.name) + "</b><span class='zk-desc'>" + esc(it.desc) + "</span><span class='zk-tag'>" + esc(it.tag) + "</span></div>";
        }).join("");
        var el = list.children[active];
        if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
    }

    function go(it) {
        if (!it) return;
        if (it.run) { close(); it.run(); return; }
        if (it.type === "external") window.open(it.path, "_blank", "noopener");
        else location.href = /^https?:/.test(it.path) ? it.path : root + it.path;
        close();
    }

    function open() {
        if (!overlay) build();
        overlay.classList.add("open");
        input.value = ""; filter(); render();
        input.focus();
    }
    function close() { if (overlay) overlay.classList.remove("open"); }

    document.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
            e.preventDefault();
            if (overlay && overlay.classList.contains("open")) close(); else open();
        }
    });

    /* 顶部搜索按钮：给触屏等无键盘场景一个呼出面板的入口。
       与 theme.js 共用 .zk-actions 容器与 .zk-icon-btn 样式（谁先执行谁创建容器）。 */
    function mountTrigger() {
        /* 主页自带大搜索框（工具栏含分类筛选），无需再放触发按钮 */
        if (document.querySelector(".filters [data-filter]")) return;
        var host = document.querySelector(".top") || document.querySelector(".toolbar");
        if (!host || host.querySelector(".zk-palette-trigger")) return;
        var box = host.querySelector(".zk-actions");
        if (!box) {
            box = document.createElement("div");
            box.className = "zk-actions";
            host.appendChild(box);
        }
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "zk-icon-btn zk-palette-trigger";
        btn.setAttribute("aria-label", "搜索工具（Ctrl+K）");
        btn.title = "搜索工具（Ctrl+K）";
        btn.innerHTML = "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>";
        btn.addEventListener("click", open);
        /* 搜索按钮排在主题按钮前 */
        box.insertBefore(btn, box.firstChild);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountTrigger);
    else mountTrigger();

    window.zkPalette = { open: open, close: close };
})();
