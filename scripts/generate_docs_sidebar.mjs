#!/usr/bin/env node

/**
 * Generate a hierarchical sidebar JSON for the docs/ directory.
 * Output: docs/sidebar.json
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("docs");

function isMarkdown(file) {
  return file.endsWith(".md") || file.endsWith(".mdx");
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items = [];
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const readme = path.join(full, "README.md");
      items.push({
        type: "category",
        name: e.name,
        hasIndex: fs.existsSync(readme),
        children: scanDir(full),
      });
    } else if (isMarkdown(e.name) && e.name.toLowerCase() !== "readme.md") {
      items.push({
        type: "doc",
        name: e.name.replace(/\.mdx?$/, ""),
        path: path.relative(root, full),
      });
    }
  }
  // sort categories first then docs alphabetically
  items.sort((a, b) => {
    if (a.type !== b.type) return a.type === "category" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return items;
}

const tree = scanDir(root);
const out = { generatedAt: new Date().toISOString(), tree };
fs.writeFileSync(path.join(root, "sidebar.json"), JSON.stringify(out, null, 2));
console.log("[docs-sidebar] wrote docs/sidebar.json");
