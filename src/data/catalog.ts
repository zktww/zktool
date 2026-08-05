import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

function loadLegacyData(file: string) {
    const sandbox: Record<string, unknown> = {};
    vm.runInNewContext(readFileSync(resolve(process.cwd(), file), "utf8"), sandbox, { filename: file });
    return sandbox;
}

const registry = loadLegacyData("src/data/registry.js");
const localeData = loadLegacyData("src/data/i18n.js");

export type Locale = "zh-CN" | "en";

export type Tool = {
    name: string;
    path: string;
    group: string;
    type: "tool" | "external";
    tag: string;
    desc: string;
    kw: string;
    c1: string;
    c2: string;
    icon: string;
};

export const groups = registry.ZKTOOL_GROUPS as Array<{ key: string; title: string }>;
export const tools = (registry.ZKTOOL_REGISTRY as Tool[]).filter((item) => item.type === "tool" || item.type === "external");

export function toolSlug(tool: Tool) {
    return tool.path.replace(/^tools\//, "").replace(/\/$/, "");
}

export function localizedTool(tool: Tool, locale: Locale): Tool {
    if (locale !== "en") return tool;
    const translated = (localeData.ZKTOOL_I18N as { tools: Record<string, [string, string, string]> }).tools[tool.path];
    if (!translated) throw new Error(`Missing English copy for ${tool.path}`);
    return { ...tool, name: translated[0], desc: translated[1], tag: translated[2] };
}

export function localizedGroup(group: { key: string; title: string }, locale: Locale) {
    return locale === "en"
        ? { ...group, title: (localeData.ZKTOOL_I18N as { groups: Record<string, string> }).groups[group.key] || group.title }
        : group;
}
