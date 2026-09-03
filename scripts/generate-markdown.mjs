/* global console, process */

import fs from "node:fs";
import path from "node:path";
import slugify from "limax";

const postsDirectory = path.resolve("src/content/post");
const outputDirectory = path.resolve(process.argv[2] ?? "dist");

function collectMarkdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectMarkdownFiles(entryPath) : /\.(md|mdx)$/.test(entryPath) ? [entryPath] : [];
  });
}

function getFrontmatter(source) {
  return source.match(/^---\r?\n([\s\S]*?)\r?\n---/m)?.[1] ?? "";
}

function getValue(frontmatter, key) {
  return frontmatter
    .match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]
    ?.trim()
    .replace(/^['"]|['"]$/g, "");
}

function getBody(source) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}

const outputPaths = new Set();
let generated = 0;

for (const filePath of collectMarkdownFiles(postsDirectory)) {
  const source = fs.readFileSync(filePath, "utf8");
  const frontmatter = getFrontmatter(source);

  if (getValue(frontmatter, "draft") === "true") continue;

  const title = getValue(frontmatter, "title");
  if (!title) {
    throw new Error(`Missing title in ${path.relative(process.cwd(), filePath)}`);
  }

  const slug = slugify(path.basename(filePath, path.extname(filePath)));
  const outputPath = path.join(outputDirectory, `${slug}.md`);
  if (outputPaths.has(outputPath)) {
    throw new Error(`Duplicate Markdown output path: ${path.relative(process.cwd(), outputPath)}`);
  }
  outputPaths.add(outputPath);

  const excerpt = getValue(frontmatter, "excerpt") || getValue(frontmatter, "description");
  const sections = [`# ${title}`];
  if (excerpt) sections.push(`> ${excerpt}`);

  const body = getBody(source);
  if (body) sections.push(body);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${sections.join("\n\n")}\n`);
  generated += 1;
}

console.log(
  `Generated ${generated} Markdown representation${generated === 1 ? "" : "s"} in ${path.relative(process.cwd(), outputDirectory)}.`
);
