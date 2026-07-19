/* zktool 工具页通用能力：草稿自动保存、URL 状态分享、工具间「发送到…」管道。
   按约定自动接线（也可用属性覆盖）：
   - 草稿/分享：所有带 id 的 <textarea>（值等于 defaultValue 时不存）；
     data-zk-save / data-zk-share 可显式加入其他控件，data-zk-off 退出。
   - 管道接收：第一个带 id 的 textarea，或显式 [data-zk-pipe]。
   - 管道来源：[data-zk-pipe-source]，或第一个 .output 元素。
   - 整页退出：<body data-zk-manual>（自带保存/分享的页面，如 mermaid-editor）。
   依赖 theme.js 先加载（复用 .zk-actions / .zk-icon-btn 样式与容器）。 */
(function () {
    "use strict";

    var PAGE = location.pathname.replace(/index\.html$/, "");
    var LS_PREFIX = "zktool.draft:" + PAGE + ":";
    var PIPE_KEY = "zktool.pipe";

    function tryLS(fn, fallback) {
        try { return fn(); } catch (e) { return fallback; }
    }

    /* ── UTF-8 安全的 base64url ── */
    function b64encode(s) {
        var bytes = new TextEncoder().encode(s);
        var bin = "";
        for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    function b64decode(s) {
        s = s.replace(/-/g, "+").replace(/_/g, "/");
        while (s.length % 4) s += "=";
        var bin = atob(s);
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder().decode(bytes);
    }

    function manual() { return document.body && document.body.hasAttribute("data-zk-manual"); }

    /* 约定 + 声明 合并出参与草稿/分享的控件 */
    function stateFields() {
        var els = Array.prototype.slice.call(document.querySelectorAll("textarea[id], [data-zk-save], [data-zk-share]"));
        return els.filter(function (el, i) {
            return el.id && !el.hasAttribute("data-zk-off") && els.indexOf(el) === i;
        });
    }

    /* ── 1. 草稿自动保存 ── */
    function initDraft(skipRestore) {
        stateFields().forEach(function (el) {
            if (!skipRestore && el.value === el.defaultValue) {
                var saved = tryLS(function () { return localStorage.getItem(LS_PREFIX + el.id); }, null);
                if (saved !== null && saved !== el.value) {
                    el.value = saved;
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                }
            }
            var timer = null;
            el.addEventListener("input", function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    tryLS(function () {
                        if (el.value === "" || el.value === el.defaultValue) localStorage.removeItem(LS_PREFIX + el.id);
                        else localStorage.setItem(LS_PREFIX + el.id, el.value);
                    });
                }, 400);
            });
        });
    }

    /* ── 2. URL 状态分享 ── */
    var zkShare = {
        /* 把参与状态的控件值编码为可分享 URL；超长（>4KB）时返回 null */
        encode: function () {
            var state = {};
            stateFields().forEach(function (el) {
                if (el.value && el.value !== el.defaultValue) {
                    if (el.type === "checkbox" || el.type === "radio") state[el.id] = el.checked ? "1" : "0";
                    else state[el.id] = el.value;
                }
            });
            if (!Object.keys(state).length) return location.href.split("#")[0];
            var enc = b64encode(JSON.stringify(state));
            if (enc.length > 4096) return null;
            return location.href.split("#")[0] + "#zk=" + enc;
        },
        /* 从 #zk= 解码回填；成功返回 true */
        restore: function () {
            var m = location.hash.match(/^#zk=(.+)$/);
            if (!m) return false;
            var state;
            try { state = JSON.parse(b64decode(m[1])); } catch (e) { return false; }
            var hit = false;
            Object.keys(state).forEach(function (id) {
                var el = document.getElementById(id);
                if (!el) return;
                if (el.type === "checkbox" || el.type === "radio") el.checked = state[id] === "1";
                else el.value = state[id];
                el.dispatchEvent(new Event("input", { bubbles: true }));
                el.dispatchEvent(new Event("change", { bubbles: true }));
                hit = true;
            });
            return hit;
        }
    };

    /* ── 3. 工具间管道 ── */
    var zkPipe = {
        /* 把 text 送往 toolPath（相对站点根，如 "tools/text-diff/"）并跳转 */
        send: function (toolPath, text) {
            tryLS(function () { sessionStorage.setItem(PIPE_KEY, JSON.stringify({ to: toolPath, text: String(text) })); });
            var root = (window.zkRoot || "../../");
            location.href = /^https?:/.test(toolPath) ? toolPath : root + toolPath;
        },
        /* 目标页调用：若有属于本页的管道数据则取走（一次性） */
        receive: function () {
            var raw = tryLS(function () { return sessionStorage.getItem(PIPE_KEY); }, null);
            if (!raw) return null;
            var data;
            try { data = JSON.parse(raw); } catch (e) { return null; }
            if (!data || PAGE.indexOf(data.to.replace(/\/$/, "")) === -1) return null;
            tryLS(function () { sessionStorage.removeItem(PIPE_KEY); });
            return data.text;
        }
    };

    /* 站点根路径：toolkit.js 位于 <root>/assets/ 下 */
    (function () {
        var self = document.currentScript || (function () {
            var ss = document.getElementsByTagName("script");
            for (var i = 0; i < ss.length; i++) if (/toolkit\.js/.test(ss[i].src)) return ss[i];
        })();
        if (self && self.src) window.zkRoot = self.src.replace(/assets\/toolkit\.js.*$/, "");
    })();

    /* ── 顶部按钮：分享链接 + 发送到… ── */
    function toast(msg) {
        var el = document.createElement("div");
        el.textContent = msg;
        el.setAttribute("role", "status");
        el.style.cssText = "position:fixed;left:50%;bottom:2rem;transform:translateX(-50%);z-index:1200;" +
            "padding:.55rem 1.1rem;border-radius:999px;font-size:.85rem;" +
            "background:var(--text,#1e293b);color:var(--bg,#fff);box-shadow:0 8px 24px -8px rgba(0,0,0,.4);" +
            "opacity:0;transition:opacity .25s";
        document.body.appendChild(el);
        requestAnimationFrame(function () { el.style.opacity = "1"; });
        setTimeout(function () { el.style.opacity = "0"; setTimeout(function () { el.remove(); }, 300); }, 1800);
    }

    function mountButtons() {
        var host = document.querySelector(".top");
        if (!host || manual()) return;
        var box = host.querySelector(".zk-actions");
        if (!box) {
            box = document.createElement("div");
            box.className = "zk-actions";
            host.appendChild(box);
        }

        /* 分享按钮：页面存在可分享控件时出现；hover 展示分享二维码 tip，点击复制链接 */
        if (stateFields().length && !box.querySelector(".zk-share-btn")) {
            var sbtn = document.createElement("button");
            sbtn.type = "button";
            sbtn.className = "zk-icon-btn zk-share-btn";
            sbtn.title = "复制当前状态的分享链接";
            sbtn.setAttribute("aria-label", "复制当前状态的分享链接");
            sbtn.innerHTML = "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/><path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/></svg>";
            sbtn.addEventListener("click", function () {
                var url = zkShare.encode();
                if (!url) { toast("内容过长，无法生成分享链接"); return; }
                (window.copyText ? copyText(url) : navigator.clipboard.writeText(url)).then(
                    function () { toast("分享链接已复制"); },
                    function () { toast("复制失败"); }
                );
            });
            attachQrTip(sbtn);
            box.insertBefore(sbtn, box.firstChild);
        }

        /* 发送到…：页面有输出区（.output 或 data-zk-pipe-source）时出现 */
        var src = document.querySelector("[data-zk-pipe-source]") || document.querySelector(".output");
        if (src && window.ZKTOOL_REGISTRY && !box.querySelector(".zk-pipe-btn")) {
            var pbtn = document.createElement("button");
            pbtn.type = "button";
            pbtn.className = "zk-icon-btn zk-pipe-btn";
            pbtn.title = "把结果发送到其他工具";
            pbtn.setAttribute("aria-label", "把结果发送到其他工具");
            pbtn.innerHTML = "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M22 2 11 13'/><path d='M22 2 15 22l-4-9-9-4Z'/></svg>";
            pbtn.addEventListener("click", function () { openPipeMenu(pbtn, src); });
            box.insertBefore(pbtn, box.firstChild);
        }
    }

    function sourceText(src) {
        return "value" in src && src.tagName !== "DIV" ? src.value : src.textContent;
    }

    /* ── 分享二维码 tip：hover/focus 分享按钮时本地生成当前状态链接的二维码 ──
       qrcode-generator 库按需加载（首次 hover 才请求本地 vendor），全程无网络生成。 */
    var qrLibPromise = null;
    function loadQrLib() {
        if (window.qrcode) return Promise.resolve();
        if (!qrLibPromise) {
            qrLibPromise = new Promise(function (resolve, reject) {
                var s = document.createElement("script");
                s.src = (window.zkRoot || "../../") + "assets/vendor/qrcode.min.js";
                s.onload = resolve;
                s.onerror = function () { qrLibPromise = null; reject(new Error("load fail")); };
                document.head.appendChild(s);
            });
        }
        return qrLibPromise;
    }

    /* 生成二维码 SVG 字符串；容量自适应纠错等级，超出二维码容量返回 null */
    function qrSvg(text) {
        var levels = ["M", "L"];
        for (var i = 0; i < levels.length; i++) {
            try {
                var qr = window.qrcode(0, levels[i]); /* typeNumber 0 = 自动选型 */
                qr.addData(text);
                qr.make();
                return qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
            } catch (e) { /* 容量不足则降纠错级重试 */ }
        }
        return null;
    }

    function attachQrTip(btn) {
        var tip = null, hideTimer = null, seq = 0;

        function hide() {
            hideTimer = setTimeout(function () {
                if (tip) { tip.remove(); tip = null; }
            }, 120);
        }
        function hideNow() {
            clearTimeout(hideTimer);
            if (tip) { tip.remove(); tip = null; }
        }

        function show() {
            clearTimeout(hideTimer);
            if (tip) return;
            var my = ++seq;
            tip = document.createElement("div");
            tip.className = "zk-qr-tip";
            tip.setAttribute("role", "tooltip");
            tip.style.cssText = "position:absolute;right:0;top:calc(100% + .5rem);z-index:1100;width:11.5rem;" +
                "padding:.75rem .75rem .55rem;border:1px solid var(--border,#e4e9f0);border-radius:14px;" +
                "background:var(--surface,#fff);box-shadow:0 16px 48px -16px rgba(0,0,0,.35);" +
                "text-align:center;opacity:0;transform:translateY(-4px);transition:opacity .18s,transform .18s";
            tip.innerHTML = "<div class='zk-qr-body' style='display:grid;place-items:center;min-height:10rem'>" +
                "<span style='font-size:.78rem;color:var(--text-3,#7a8aa0)'>生成中…</span></div>" +
                "<p style='margin:.5rem 0 0;font-size:.72rem;line-height:1.5;color:var(--text-2,#5b6b81)'>扫码在手机上打开当前状态</p>";
            /* tip 挂在按钮容器上，与发送菜单同套定位 */
            var wrap = btn.parentElement;
            wrap.style.position = "relative";
            wrap.appendChild(tip);
            tip.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
            tip.addEventListener("mouseleave", hide);
            requestAnimationFrame(function () {
                if (tip) { tip.style.opacity = "1"; tip.style.transform = "translateY(0)"; }
            });

            loadQrLib().then(function () {
                if (!tip || my !== seq) return;
                var url = zkShare.encode();
                var body = tip.querySelector(".zk-qr-body");
                var svg = url ? qrSvg(url) : null;
                if (!svg) {
                    body.innerHTML = "<span style='font-size:.78rem;color:var(--text-3,#7a8aa0);padding:0 .3rem'>内容过长，无法生成二维码<br>可点击按钮复制链接</span>";
                    return;
                }
                /* 白色衬底保证暗色模式下可扫 */
                body.innerHTML = "<div style='padding:.5rem;border-radius:10px;background:#fff;line-height:0'>" + svg + "</div>";
                var el = body.querySelector("svg");
                el.style.width = "9rem";
                el.style.height = "9rem";
            }, function () {
                if (tip && my === seq) tip.querySelector(".zk-qr-body").innerHTML =
                    "<span style='font-size:.78rem;color:var(--text-3,#7a8aa0)'>二维码组件加载失败</span>";
            });
        }

        btn.addEventListener("mouseenter", show);
        btn.addEventListener("mouseleave", hide);
        btn.addEventListener("focus", show);
        btn.addEventListener("blur", hide);
        /* 触屏没有 hover：点击（复制之余）也展示二维码，点击他处或 Esc 关闭 */
        btn.addEventListener("click", function () { show(); });
        document.addEventListener("click", function (e) {
            if (tip && !tip.contains(e.target) && e.target !== btn && !btn.contains(e.target)) hideNow();
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && tip) hideNow();
        });
    }

    var pipeMenu = null;
    function openPipeMenu(anchor, src) {
        if (pipeMenu) { closePipeMenu(); return; }
        var text = sourceText(src).trim();
        if (!text) { toast("当前没有可发送的内容"); return; }
        var items = window.ZKTOOL_REGISTRY.filter(function (it) {
            return it.type === "tool" && it.pipe !== false && PAGE.indexOf(it.path.replace(/\/$/, "")) === -1;
        });
        pipeMenu = document.createElement("div");
        pipeMenu.className = "zk-pipe-menu";
        pipeMenu.setAttribute("role", "menu");
        pipeMenu.style.cssText = "position:absolute;right:0;top:calc(100% + .4rem);z-index:1100;min-width:14rem;max-height:19rem;overflow-y:auto;" +
            "padding:.4rem;border:1px solid var(--border,#e4e9f0);border-radius:12px;background:var(--surface,#fff);" +
            "box-shadow:0 16px 48px -16px rgba(0,0,0,.35)";
        items.forEach(function (it) {
            var mi = document.createElement("button");
            mi.type = "button";
            mi.setAttribute("role", "menuitem");
            mi.textContent = it.name;
            mi.style.cssText = "display:block;width:100%;text-align:left;font:inherit;font-size:.85rem;padding:.45rem .65rem;" +
                "border:none;border-radius:8px;background:transparent;color:var(--text,#1e293b);cursor:pointer";
            mi.addEventListener("mouseenter", function () { mi.style.background = "var(--surface-2,#f1f5f9)"; });
            mi.addEventListener("mouseleave", function () { mi.style.background = "transparent"; });
            mi.addEventListener("focus", function () { mi.style.background = "var(--surface-2,#f1f5f9)"; });
            mi.addEventListener("blur", function () { mi.style.background = "transparent"; });
            mi.addEventListener("click", function () { zkPipe.send(it.path, sourceText(src).trim()); });
            pipeMenu.appendChild(mi);
        });
        var wrap = anchor.parentElement;
        wrap.style.position = "relative";
        wrap.appendChild(pipeMenu);

        function closePipeMenu() {
            if (!pipeMenu) return;
            pipeMenu.remove(); pipeMenu = null;
            document.removeEventListener("click", onDoc);
            document.removeEventListener("keydown", onKey);
        }
        function onDoc(e) {
            if (pipeMenu && !pipeMenu.contains(e.target) && e.target !== anchor) closePipeMenu();
        }
        /* 键盘：↑/↓ 循环移动焦点，Home/End 跳两端，Esc 关闭并回焦到按钮 */
        function onKey(e) {
            if (!pipeMenu) return;
            if (e.key === "Escape") { closePipeMenu(); anchor.focus(); return; }
            var mis = Array.prototype.slice.call(pipeMenu.querySelectorAll("[role=menuitem]"));
            if (!mis.length) return;
            var idx = mis.indexOf(document.activeElement);
            var to = null;
            if (e.key === "ArrowDown") to = mis[(idx + 1) % mis.length];
            else if (e.key === "ArrowUp") to = mis[(idx - 1 + mis.length) % mis.length];
            else if (e.key === "Home") to = mis[0];
            else if (e.key === "End") to = mis[mis.length - 1];
            if (to) { e.preventDefault(); to.focus(); to.scrollIntoView({ block: "nearest" }); }
        }
        var first = pipeMenu.querySelector("[role=menuitem]");
        if (first) first.focus();
        document.addEventListener("keydown", onKey);
        setTimeout(function () { document.addEventListener("click", onDoc); });
    }

    /* ── PWA：工具页也注册站点根的 service worker ──
       多数访客经搜索直达工具页、不经过首页，在这里注册才能兑现离线承诺。
       首页自带注册（含新版本刷新提示），重复 register 同一 URL 是幂等的。 */
    function registerSW() {
        if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
        var root = window.zkRoot || "../../";
        navigator.serviceWorker.register(root + "sw.js").catch(function () { /* 注册失败不影响使用 */ });
    }

    function init() {
        var fromShare = manual() ? false : zkShare.restore();
        if (!fromShare && !manual()) {
            /* 管道数据或 PWA share_target 的 ?text= 参数，注入首个输入区 */
            var piped = zkPipe.receive();
            if (piped === null) {
                var qs = new URLSearchParams(location.search);
                if (qs.has("text")) piped = qs.get("text");
            }
            if (piped !== null) {
                var target = document.querySelector("[data-zk-pipe]") || document.querySelector("textarea[id]");
                if (target) {
                    target.value = piped;
                    target.dispatchEvent(new Event("input", { bubbles: true }));
                    target.dispatchEvent(new Event("change", { bubbles: true }));
                }
            }
        }
        if (!manual()) initDraft(fromShare);
        mountButtons();
        registerSW();
    }

    window.zkShare = zkShare;
    window.zkPipe = zkPipe;
    window.zkToast = toast;

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
