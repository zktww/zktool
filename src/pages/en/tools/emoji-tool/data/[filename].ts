import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";

// Serve the same local datasets at the relative URLs used by the English tool.
export function getStaticPaths() {
    return ["data-by-group.json", "annotations-zh.json"].map(filename => ({
        params: { filename },
        props: { filename }
    }));
}

export const GET: APIRoute = async ({ props }) => {
    const data = await readFile(`public/tools/emoji-tool/data/${props.filename}`, "utf8");
    return new Response(data, { headers: { "Content-Type": "application/json" } });
};
