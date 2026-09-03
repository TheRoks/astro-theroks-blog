/* global console, process */

import fs from "node:fs";
import path from "node:path";

const postsDirectory = path.resolve("src/content/post");
const today = new Date();
today.setHours(23, 59, 59, 999);
const errors = [];

function collectMarkdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectMarkdownFiles(entryPath) : /\.(md|mdx)$/.test(entryPath) ? [entryPath] : [];
  });
}

for (const filePath of collectMarkdownFiles(postsDirectory)) {
  const source = fs.readFileSync(filePath, "utf8");
  const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/m)?.[1] ?? "";
  const relativePath = path.relative(process.cwd(), filePath);
  const publishDate = frontmatter.match(/^publishDate:\s*["']?([^\n"']+)/m)?.[1]?.trim();
  const excerpt = frontmatter.match(/^excerpt:\s*(.+)$/m)?.[1];

  if (!publishDate) {
    errors.push(`${relativePath}: missing publishDate`);
  } else if (Number.isNaN(Date.parse(publishDate)) || new Date(publishDate) > today) {
    errors.push(`${relativePath}: publishDate must be a valid non-future date`);
  }

  if (!excerpt && !frontmatter.match(/^description:\s*(.+)$/m)) {
    errors.push(`${relativePath}: add description or excerpt`);
  }

  for (const match of source.matchAll(/!\[[^\]]*\]\((\/assets\/[^)\s]+)\)/g)) {
    const assetPath = path.resolve("public", `.${match[1]}`);
    if (!fs.existsSync(assetPath)) {
      errors.push(`${relativePath}: missing image ${match[1]}`);
    }
  }
}

if (errors.length > 0) {
  console.error("Content audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log("Content audit passed.");
}
