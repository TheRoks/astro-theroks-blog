/* global console, process */

import fs from "node:fs";
import path from "node:path";
import slugify from "limax";

const postsDirectory = path.resolve("src/content/post");
const outputPath = path.resolve(process.argv[2] ?? "dist/_redirects");

function collectMarkdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectMarkdownFiles(entryPath) : /\.(md|mdx)$/.test(entryPath) ? [entryPath] : [];
  });
}

function normalizePath(value) {
  const trimmed = value
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "/";
}

const redirects = [];
for (const filePath of collectMarkdownFiles(postsDirectory)) {
  const source = fs.readFileSync(filePath, "utf8");
  const legacyPath = source.match(/^path:\s*(.+)$/m)?.[1];
  if (!legacyPath) continue;

  const filename = path.basename(filePath, path.extname(filePath));
  const currentPath = `/${slugify(filename)}`;
  const oldPath = normalizePath(legacyPath);
  if (oldPath !== currentPath) {
    redirects.push(`${oldPath} ${currentPath} 301`);
  }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${redirects.sort().join("\n")}${redirects.length ? "\n" : ""}`);
console.log(
  `Generated ${redirects.length} legacy redirect${redirects.length === 1 ? "" : "s"} in ${path.relative(process.cwd(), outputPath)}.`
);
