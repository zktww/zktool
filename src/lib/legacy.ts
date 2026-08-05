import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd());

export type LegacyDocument = {
    lang: string;
    head: string;
    body: string;
    bodyAttrs: Record<string, string | boolean>;
};

function parseAttributes(raw: string) {
    const attrs: Record<string, string | boolean> = {};
    const expression = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
    for (const match of raw.matchAll(expression)) {
        const [, key, doubleQuoted, singleQuoted, bare] = match;
        attrs[key] = doubleQuoted ?? singleQuoted ?? bare ?? true;
    }
    return attrs;
}

export function loadLegacyDocument(relativePath: string): LegacyDocument {
    const source = readFileSync(resolve(ROOT, relativePath), "utf8");
    const html = /<html\b([^>]*)>/i.exec(source);
    const head = /<head\b[^>]*>([\s\S]*?)<\/head>/i.exec(source);
    const body = /<body\b([^>]*)>([\s\S]*?)<\/body>/i.exec(source);

    if (!head || !body) throw new Error(`Invalid legacy HTML document: ${relativePath}`);

    const lang = /\blang=["']([^"']+)["']/i.exec(html?.[1] || "")?.[1] || "zh-CN";
    return { lang, head: head[1], body: body[2], bodyAttrs: parseAttributes(body[1]) };
}

export function legacyToolPath(slug: string, locale: "zh-CN" | "en") {
    return locale === "en"
        ? `src/locales/en/tools/${slug}/index.html`
        : `src/tools/${slug}/index.html`;
}
