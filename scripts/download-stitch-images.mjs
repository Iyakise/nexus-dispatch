#!/usr/bin/env node
/**
 * Downloads every remote image referenced by the Stitch exports into
 * public/images/stitch/ so the app never hotlinks lh3.googleusercontent.com
 * (those URLs are temporary).
 *
 *   npm run assets:list       # print the URLs found, no network
 *   npm run assets:download   # download + write manifest.json
 *
 * Re-running skips files that already exist.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const designsDir = path.join(root, "stitch-designs");
const outDir = path.join(root, "public", "images", "stitch");
const listOnly = process.argv.includes("--list");

const URL_RE = /https:\/\/lh3\.googleusercontent\.com\/[A-Za-z0-9_\-/]+/g;
const EXT_BY_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

async function collect() {
  /** @type {Map<string, Set<string>>} url -> screen folders that use it */
  const found = new Map();
  for (const entry of await readdir(designsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(designsDir, entry.name, "code.html");
    if (!existsSync(file)) continue;
    const html = await readFile(file, "utf8");
    for (const url of html.match(URL_RE) ?? []) {
      if (!found.has(url)) found.set(url, new Set());
      found.get(url).add(entry.name);
    }
  }
  return found;
}

const found = await collect();
console.log(`Found ${found.size} distinct remote images in ${designsDir}`);

if (listOnly) {
  for (const [url, screens] of found) {
    console.log(`\n${url}\n  used by: ${[...screens].join(", ")}`);
  }
  process.exit(0);
}

await mkdir(outDir, { recursive: true });
const manifest = {};
let failures = 0;

for (const [url, screens] of found) {
  const id = createHash("sha1").update(url).digest("hex").slice(0, 10);
  const existing = (await readdir(outDir)).find((f) => f.startsWith(`${id}.`));
  if (existing) {
    manifest[url] = { file: existing, screens: [...screens] };
    console.log(`skip     ${existing}`);
    continue;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
    const ext = EXT_BY_TYPE[type] ?? "bin";
    const file = `${id}.${ext}`;
    await writeFile(path.join(outDir, file), Buffer.from(await res.arrayBuffer()));
    manifest[url] = { file, screens: [...screens] };
    console.log(`saved    ${file}  (${type})`);
  } catch (err) {
    failures += 1;
    console.error(`FAILED   ${url}\n         ${err.message}`);
  }
}

await writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nDone. ${Object.keys(manifest).length} saved/kept, ${failures} failed.`);
if (failures > 0) {
  console.error("Some downloads failed. The URLs may have expired; re-export from Stitch and try again.");
  process.exit(1);
}
