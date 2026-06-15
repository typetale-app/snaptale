#!/usr/bin/env bun
/**
 * build-widget.ts — Two-step production build for the Snaptale widget.
 *
 * Step 1: Build the iframe-side editor (snaptale-frame.tsx) into a
 *         self-contained IIFE bundle (JS + CSS).
 * Step 2: Inline that bundle into an HTML string and inject it as a
 *         build-time constant (__SNAPTALE_FRAME_HTML__) into the parent
 *         SDK (snaptale.tsx), producing the final distributable IIFE.
 *
 * The output is a single JS file in dist/widget/ that can be dropped
 * into any page. When `window.pintura.openDefaultEditor()` is called,
 * it creates an iframe with srcdoc — no server required, no CORS.
 */

import plugin from "bun-plugin-tailwind";
import { existsSync } from "fs";
import { rm } from "fs/promises";
import path from "path";

const TMP_DIR = path.resolve("dist/.tmp-frame");
const OUT_DIR = path.resolve("dist/widget");

const formatSize = (bytes: number) => {
  const units = ["B", "KB", "MB"];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
};

async function clean(...dirs: string[]) {
  for (const dir of dirs) {
    if (existsSync(dir)) await rm(dir, { recursive: true, force: true });
  }
}

// ──────────────────────────────────────────────────────────────────
// Step 1: Build the iframe editor bundle
// ──────────────────────────────────────────────────────────────────
console.log("\n🚀 Building Snaptale widget...\n");
await clean(TMP_DIR, OUT_DIR);

console.log("📦 Step 1 — Building iframe editor bundle...");
const frameResult = await Bun.build({
  entrypoints: [path.resolve("src/snaptale-frame.tsx")],
  outdir: TMP_DIR,
  plugins: [plugin],
  minify: true,
  target: "browser",
  sourcemap: "none",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

if (!frameResult.success) {
  console.error("❌ Iframe bundle build failed:");
  frameResult.logs.forEach((log) => console.error(log));
  process.exit(1);
}

// ──────────────────────────────────────────────────────────────────
// Step 2: Read outputs, construct the inline HTML
// ──────────────────────────────────────────────────────────────────
console.log("🔗 Step 2 — Inlining iframe bundle into HTML...");

let jsContent = "";
let cssContent = "";

for (const output of frameResult.outputs) {
  const text = await Bun.file(output.path).text();
  if (output.path.endsWith(".css")) {
    cssContent += text;
  } else if (output.path.endsWith(".js")) {
    jsContent += text;
  }
}

const frameHtml = [
  "<!doctype html>",
  '<html lang="en">',
  "<head>",
  '<meta charset="UTF-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1.0">',
  `<style>${cssContent}</style>`,
  "</head>",
  '<body style="margin:0;overflow:hidden">',
  `<script>${jsContent}<\/script>`,
  "</body>",
  "</html>",
].join("");

console.log(
  `   Iframe HTML size: ${formatSize(new TextEncoder().encode(frameHtml).length)}`
);

// ──────────────────────────────────────────────────────────────────
// Step 3: Build the parent SDK with the inlined HTML injected
// ──────────────────────────────────────────────────────────────────
console.log("📦 Step 3 — Building parent SDK with inlined editor...");

const sdkResult = await Bun.build({
  entrypoints: [path.resolve("src/snaptale.ts")],
  outdir: OUT_DIR,
  plugins: [plugin],
  minify: true,
  target: "browser",
  format: "iife",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    __SNAPTALE_FRAME_HTML__: JSON.stringify(frameHtml),
  },
});

if (!sdkResult.success) {
  console.error("❌ Parent SDK build failed:");
  sdkResult.logs.forEach((log) => console.error(log));
  process.exit(1);
}

// Clean up temp directory
await clean(TMP_DIR);

// ──────────────────────────────────────────────────────────────────
// Report
// ──────────────────────────────────────────────────────────────────
const table = sdkResult.outputs.map((o) => ({
  File: path.relative(process.cwd(), o.path),
  Type: o.kind,
  Size: formatSize(o.size),
}));

console.table(table);
console.log("\n✅ Widget build complete! Drop dist/widget/snaptale.js into any page.\n");
