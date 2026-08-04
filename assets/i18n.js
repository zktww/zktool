/* zktool locale data and shared runtime helpers.
   Chinese source pages remain the only hand-maintained tool pages; gen-site.mjs
   consumes this same file when producing the English static pages under /en/. */
(function (global) {
    "use strict";

    var groups = {
        data: "Formatting & Data",
        codec: "Encoding & Characters",
        text: "Text Processing",
        time: "Time & Scheduling",
        gen: "Generators & Credentials",
        visual: "Charts & Images",
        device: "Devices & Mobile",
        ref: "Quick Reference"
    };

    var tools = {
        "tools/timestamp-converter/": ["Timestamp Converter", "Convert Unix timestamps and dates with automatic seconds/milliseconds detection, batch conversion, multiple formats, and time-zone comparison.", "Time"],
        "tools/json-formatter/": ["JSON Formatter & Validator", "Validate, format, minify, escape, and inspect JSON with syntax highlighting, tree view, precise errors, and statistics.", "JSON"],
        "tools/emoji-tool/": ["Emoji Library", "Browse and search Emoji by category, keep favorites and recents, switch skin tones, and copy with one click.", "Unicode"],
        "tools/mermaid-editor/": ["Mermaid Diagram Editor", "Edit and render Mermaid flowcharts, sequence diagrams, and more with templates, pan and zoom, share links, and PNG/SVG export.", "Diagrams"],
        "tools/url-codec/": ["URL Encoder & Query Parser", "Encode and decode URLs, inspect query parameters, and convert between query strings and objects.", "URL"],
        "tools/base64-converter/": ["Base64 Converter", "Encode and decode UTF-8 Base64, Hex, and Unicode escapes with byte statistics.", "Encoding"],
        "tools/regex-tester/": ["Regular Expression Tester", "Test JavaScript regular expressions with live highlights, capture groups, flags, and replacement previews.", "Regex"],
        "tools/random-generator/": ["Random ID Generator", "Generate UUID v4 values, passwords, tokens, numeric codes, and custom random strings in batches.", "Random"],
        "tools/cron-tool/": ["Cron Expression Parser", "Parse five-field Cron expressions, explain each field, and preview the next ten run times.", "Cron"],
        "tools/color-tool/": ["Color Converter & Contrast Checker", "Convert HEX, RGB, and HSL colors, generate shades, and check WCAG foreground/background contrast.", "Color"],
        "tools/text-diff/": ["Text Diff", "Compare two texts line by line and highlight additions, removals, and unchanged lines.", "Diff"],
        "tools/hash-tool/": ["Hash Calculator", "Calculate MD5, SHA-1, SHA-256, and SHA-512 hashes for text or files locally in your browser.", "Hash"],
        "tools/jwt-decoder/": ["JWT Decoder & Verifier", "Decode JWT headers and payloads, inspect expiration, and verify HS, RS, and ES signatures locally.", "Token"],
        "tools/json-converter/": ["JSON Format Converter", "Convert JSON to YAML, TypeScript interfaces, Go structs, or CSV.", "Convert"],
        "tools/text-case/": ["Text Case & Line Tools", "Convert camelCase, snake_case, and other naming styles, or deduplicate, sort, and clean lines.", "Text"],
        "tools/image-compressor/": ["Image Compressor & Converter", "Compress and convert images to WebP, JPEG, or PNG locally with adjustable quality and size.", "Images"],
        "tools/http-reference/": ["HTTP Status & MIME Reference", "Search common HTTP status codes and MIME types, then click any entry to copy it.", "Reference"],
        "tools/unicode-inspector/": ["Unicode Character Inspector", "Inspect code points and encodings character by character, including zero-width and invisible characters.", "Unicode"],
        "tools/sql-formatter/": ["SQL Formatter", "Format or minify SQL for common dialects and choose a keyword case style.", "SQL"],
        "tools/yaml-converter/": ["YAML Converter & Validator", "Convert YAML and JSON in both directions with live syntax validation and line/column errors.", "YAML"],
        "tools/curl-parser/": ["cURL Command Parser", "Parse cURL commands into structured requests and generate fetch and Python requests code.", "HTTP"],
        "tools/html-entities/": ["HTML Entity Encoder & Decoder", "Encode special characters as named, decimal, or hexadecimal HTML entities and decode them again.", "HTML"],
        "tools/keypair-generator/": ["Key Pair Generator", "Generate RSA, ECDSA, and Ed25519 key pairs locally and export PEM or JWK.", "Keys"],
        "tools/markdown-preview/": ["Markdown Preview & Publisher", "Render Markdown live, apply publishing themes, customize colors, and copy styled rich text or HTML.", "Markdown"],
        "tools/timezone-planner/": ["Time Zone Meeting Planner", "Compare local times and working hours across cities to find practical international meeting times.", "Time zones"],
        "tools/date-calculator/": ["Date Difference Calculator", "Calculate calendar days, business days, and calendar-unit differences, or add and subtract dates.", "Dates"],
        "tools/docker-compose-converter/": ["Docker Run to Compose", "Parse a docker run command and generate modern Docker Compose YAML for common runtime options.", "Docker"],
        "tools/rmb-uppercase/": ["Chinese RMB Uppercase Converter", "Convert numeric RMB amounts to formal Chinese uppercase notation and convert them back to numbers.", "Currency"],
        "tools/chmod-calculator/": ["chmod Permission Calculator", "Convert Linux file permissions between checkboxes, octal values, symbolic notation, and chmod commands.", "Linux"],
        "tools/svg-optimizer/": ["SVG Optimizer & Preview", "Optimize SVG markup locally, preview the result, and generate encoded or Base64 data URIs.", "SVG"],
        "tools/qr-scanner/": ["QR Code Scanner", "Scan QR codes with a camera or image file entirely in your browser.", "Scanner"],
        "tools/exif-viewer/": ["EXIF Viewer & Remover", "Inspect photo metadata such as capture time, device, exposure, and GPS, then export a clean copy.", "EXIF"],
        "tools/device-info/": ["Device Information", "Inspect screen size, DPR, viewport, safe areas, browser capabilities, and network state.", "Device"],
        "tools/touch-tester/": ["Touch Event Tester", "Visualize multiple touch points, movement trails, pressure, dimensions, and pointer-event logs.", "Touch"],
        "tools/sensor-viewer/": ["Sensor Viewer", "Visualize gyroscope, accelerometer, and compass readings on supported mobile devices.", "Sensors"],
        "tools/radix-converter/": ["Number Base Converter", "Convert binary, octal, decimal, hexadecimal, and custom bases from 2 to 36 with BigInt precision.", "Radix"],
        "tools/aes-tool/": ["AES Encrypt & Decrypt", "Encrypt and decrypt text with AES-256-GCM and PBKDF2 password derivation entirely in your browser.", "Encryption"],
        "tools/cert-decoder/": ["X.509 Certificate Decoder", "Decode PEM certificates and inspect validity, SANs, public keys, fingerprints, and certificate chains.", "Certificates"],
        "tools/json-diff/": ["JSON Diff", "Compare two JSON structures by path and list added, removed, modified, and type-changed values.", "Diff"],
    "tools/cidr-calculator/": ["CIDR Subnet Calculator", "Calculate IPv4 networks, broadcasts, masks, host ranges, membership, and subnet splits.", "Networking"],
        "https://qc.zktww.cn/": ["QR Code Generator", "Generate QR codes for links, text, and sharing in a separate service.", "External"],
        "demos/css-length-unit/": ["CSS Length Unit Explorer", "Compare px, rem, vw, and other CSS length units with adjustable examples.", "CSS"],
        "demos/drag-and-drop/": ["HTML5 Drag and Drop Demo", "Explore basic dragging, list sorting, file drops, and live event logs.", "DnD"],
        "demos/presentation/": ["Architect Growth Presentation", "A full-screen HTML presentation with keyboard navigation.", "Slides"],
        "demos/elephant-alpha/": ["Elephant Alpha Story", "A vertical interactive story about the elephant-alpha model identity.", "Story"]
    };

    var strings = {
        home: "Home",
        breadcrumb: "Breadcrumb",
        allTools: "All tools",
        relatedTools: "Related tools",
        githubTitle: "GitHub repository and issue tracker",
        searchTools: "Search tools (Ctrl+K)",
        shareTitle: "Copy a share link for the current state",
        sendTitle: "Send the result to another tool",
        copiedLink: "Share link copied",
        copiedTool: "Tool link copied because the content is too long",
        copyFailed: "Copy failed",
        shareTooLong: "The content is too long to create a share link",
        qrTooLong: "The content is too long to create a QR code",
        qrFailed: "The QR code component could not be loaded",
        updateReady: "A new version is available. Refresh to update.",
        languageLabel: "Language",
        switchLanguage: "中文",
        themeAuto: "Theme: system",
        themeLight: "Theme: light",
        themeDark: "Theme: dark",
        clickToSwitch: ", click to switch",
        action: "Action",
        switchTheme: "Switch theme",
        switchThemeDesc: "Cycle through system, light, and dark",
        copyPageLink: "Copy page link",
        copyPageLinkDesc: "Copy the current page URL to the clipboard",
        pageLinkCopied: "Page link copied",
        paletteLabel: "Tool search",
        palettePlaceholder: "Search tools and press Enter to open...",
        paletteHint: "Up/Down select · Enter open · Esc close",
        noToolMatch: "No matching tools"
    };

    var data = { defaultLocale: "zh-CN", locales: ["zh-CN", "en"], groups: groups, tools: tools, strings: strings };
    global.ZKTOOL_I18N = data;

    if (typeof document === "undefined") return;
    var isEnglish = /^\/en(?:\/|$)/.test(location.pathname) || document.documentElement.lang === "en";
    var locale = isEnglish ? "en" : "zh-CN";
    global.zkLocale = locale;
    global.zkLocalePrefix = isEnglish ? "en/" : "";
    global.zkT = function (key, fallback) { return isEnglish && strings[key] ? strings[key] : fallback; };

    if (isEnglish && global.ZKTOOL_GROUPS) {
        global.ZKTOOL_GROUPS.forEach(function (group) { if (groups[group.key]) group.title = groups[group.key]; });
    }
    if (isEnglish && global.ZKTOOL_REGISTRY) {
        global.ZKTOOL_REGISTRY.forEach(function (item) {
            var translated = tools[item.path];
            if (!translated) return;
            item.name = translated[0]; item.desc = translated[1]; item.tag = translated[2];
            item.kw += " " + translated.join(" ").toLowerCase();
        });
    }

    function alternatePath() {
        var path = location.pathname;
        if (isEnglish) return path.replace(/^\/en(?=\/|$)/, "") || "/";
        return path === "/" ? "/en/" : "/en" + path;
    }

    function mountLanguageSwitch() {
        if (document.querySelector(".zk-lang-link")) return;
        var host = document.querySelector(".top") || document.querySelector(".toolbar");
        if (!host) return;
        var box = host.querySelector(".zk-actions");
        if (!box) { box = document.createElement("div"); box.className = "zk-actions"; host.appendChild(box); }
        var link = document.createElement("a");
        link.className = "zk-lang-link";
        link.href = alternatePath() + location.search + location.hash;
        link.lang = isEnglish ? "zh-CN" : "en";
        link.hreflang = link.lang;
        link.textContent = isEnglish ? "中文" : "EN";
        link.title = isEnglish ? "切换到中文" : "Switch to English";
        link.setAttribute("aria-label", link.title);
        box.appendChild(link);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountLanguageSwitch);
    else mountLanguageSwitch();
})(typeof window !== "undefined" ? window : this);
