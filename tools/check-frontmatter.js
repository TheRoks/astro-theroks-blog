const fs = require('fs').promises;
const path = require('path');

async function walk(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((d) => {
    const res = path.resolve(dir, d.name);
    return d.isDirectory() ? walk(res) : res;
  }));
  return Array.prototype.concat(...files);
}

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;
  const block = content.slice(3, end + 0).trim();
  const lines = block.split(/\r?\n/);
  const obj = {};
  for (let line of lines) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) {
      let key = m[1];
      let val = m[2].trim();
      // remove surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      obj[key] = val;
    }
  }
  return obj;
}

(async function main() {
  const root = path.resolve(process.cwd(), 'src', 'content');
  let allFiles = [];
  try {
    const list = await walk(root);
    allFiles = list.filter((f) => f.match(/\.(md|mdx|markdown)$/i));
  } catch (e) {
    console.error('Error reading content directory:', e.message);
    process.exit(2);
  }

  const missingTitle = [];
  const invalidPublishDate = [];
  const publishDateNotISO = [];
  const missingDraft = [];
  const doFix = process.argv.includes('--fix');

  for (const file of allFiles) {
    const content = await fs.readFile(file, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm) continue;
    if (!fm.title) missingTitle.push(file);
    if (fm.publishDate) {
      const d = Date.parse(fm.publishDate);
      if (isNaN(d)) invalidPublishDate.push({ file, value: fm.publishDate });
      else {
        // check if it's ISO-ish (starts with YYYY-)
        if (!/^\d{4}-\d{2}-\d{2}/.test(fm.publishDate)) {
          publishDateNotISO.push({ file, value: fm.publishDate });
        }
      }
    }
    if (typeof fm.draft === 'undefined') {
      missingDraft.push(file);
      if (doFix) {
        // insert draft: false into frontmatter before the closing ---
        const fmStart = content.indexOf('---');
        const fmEnd = content.indexOf('\n---', fmStart + 3);
        if (fmStart !== -1 && fmEnd !== -1) {
          const before = content.slice(0, fmEnd);
          const after = content.slice(fmEnd);
          // ensure there's a newline before insertion
          const insertion = '\n' + 'draft: false';
          const newContent = before + insertion + after;
          await fs.writeFile(file, newContent, 'utf8');
        }
      }
    }
  }

  console.log('Checked', allFiles.length, 'content files.');
  if (missingTitle.length) {
    console.log('\nFiles missing title:');
    missingTitle.forEach(f => console.log(' -', path.relative(process.cwd(), f)));
  } else console.log('\nNo files missing title.');

  if (invalidPublishDate.length) {
    console.log('\nFiles with invalid publishDate:');
    invalidPublishDate.forEach(x => console.log(' -', path.relative(process.cwd(), x.file), '=>', x.value));
  } else console.log('\nNo invalid publishDate values.');

  if (publishDateNotISO.length) {
    console.log('\nFiles with non-ISO publishDate (recommended to use YYYY-MM-DD):');
    publishDateNotISO.forEach(x => console.log(' -', path.relative(process.cwd(), x.file), '=>', x.value));
  } else console.log('\nAll publishDate values look ISO-like or are absent.');

  if (missingDraft.length) {
    console.log('\nFiles missing draft field (schema will default to false):');
    missingDraft.forEach(f => console.log(' -', path.relative(process.cwd(), f)));
  } else console.log('\nAll files have a draft field.');

})();
