import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const output = join(process.cwd(), "out");
if (!existsSync(output)) throw new Error("Missing out/. Run npm run build before npm run audit:seo.");
const htmlFiles = [];
function visit(directory) {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    statSync(full).isDirectory() ? visit(full) : entry.endsWith(".html") && htmlFiles.push(full);
  }
}
visit(output);
const required = [/<title>[^<]+<\/title>/i, /<meta name="description" content="[^"]+"/i, /<link rel="canonical"/i];
const seen = { titles: new Map(), descriptions: new Map(), canonicals: new Map() };
for (const file of htmlFiles) {
  if (file.includes("/admin/")) continue;
  const html = readFileSync(file, "utf8");
  for (const pattern of required) if (!pattern.test(html)) throw new Error(`${file} is missing ${pattern}`);
  const headings = html.match(/<h1\b[^>]*>/gi) ?? [];
  if (headings.length !== 1) throw new Error(`${file} must have exactly one h1; found ${headings.length}`);
  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=("[^"]*"|'[^']*')/i.test(image[0])) throw new Error(`${file} has an image without alt text: ${image[0]}`);
  }
  if (/sourceMappingURL/i.test(html)) throw new Error(`${file} exposes a source map reference`);
  const values = {
    titles: html.match(/<title>([^<]+)<\/title>/i)?.[1],
    descriptions: html.match(/<meta name="description" content="([^"]+)"/i)?.[1],
    canonicals: html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1],
  };
  if (file.endsWith("404.html") || file.includes("/404/")) continue;
  for (const [kind, value] of Object.entries(values)) {
    if (!value) continue;
    const firstFile = seen[kind].get(value);
    if (firstFile) throw new Error(`${file} duplicates ${kind.slice(0, -1)} from ${firstFile}`);
    seen[kind].set(value, file);
  }
}
for (const route of ["robots.txt", "sitemap.xml", "llms.txt"]) if (!existsSync(join(output, route))) throw new Error(`Missing ${route}`);
console.log(`SEO audit passed for ${htmlFiles.length} HTML files.`);
