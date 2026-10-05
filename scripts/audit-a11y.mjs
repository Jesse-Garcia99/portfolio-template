import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// Accessibility tagging audit: static checks that interactive and structural
// markup carries the attributes assistive tech needs. Scans a build output
// directory (default `out/`); when a target holds no .html files it falls back
// to extracting `<!doctype html>…</html>` documents embedded in source files
// (Worker-rendered sites). Complements audit:seo — that one covers crawl
// metadata, this one covers assistive labelling.
const root = process.cwd();
const target = join(root, process.argv[2] || "out");
if (!existsSync(target)) throw new Error(`Missing ${process.argv[2] || "out"}/. Run the site build before npm run audit:a11y.`);

const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "_next", "admin", "graphify-out", "dist", ".vercel"]);
const htmlFiles = [];
const codeFiles = [];
function visit(directory) {
  for (const entry of readdirSync(directory)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) { visit(full); continue; }
    if (entry.endsWith(".html")) htmlFiles.push(full);
    else if (/\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(entry)) codeFiles.push(full);
  }
}
visit(target);

const rel = file => relative(root, file);
// Machine-verification stubs (Search Console tokens) aren't pages.
const SKIP_FILE = /google[-\w]*verification|google[0-9a-f]{16}|yandex[-\w]*verification|bing[-\w]*verify/i;
const docs = [];
if (htmlFiles.length) {
  for (const file of htmlFiles) {
    if (SKIP_FILE.test(file)) continue;
    docs.push({ name: rel(file), html: readFileSync(file, "utf8") });
  }
} else {
  for (const file of codeFiles) {
    const body = readFileSync(file, "utf8");
    const blocks = [...body.matchAll(/<!doctype\s+html[\s\S]*?<\/html>/gi)];
    blocks.forEach((m, i) => docs.push({ name: `${rel(file)}#doc${i + 1}`, html: m[0] }));
  }
}
if (!docs.length) throw new Error(`No HTML documents found under ${process.argv[2] || "out"}/`);

const strip = html => html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ");
const textOf = el => strip(el.replace(/<[^>]*>/g, " ")).replace(/&\w+;|&#\d+;/g, " ").trim();
const named = tag => /\baria-label\s*=\s*["'][^"']|\baria-labelledby\s*=\s*["'][^"']|\btitle\s*=\s*["'][^"']/i.test(tag);

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
// Ranges covered by an aria-hidden="true" element — the subtree is invisible
// to assistive tech, so labelling rules don't apply inside.
function hiddenRanges(html) {
  const ranges = [];
  const stack = [];
  let openAt = -1, depth = 0;
  for (const m of html.matchAll(/<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g)) {
    const [, close, tagRaw, attrs] = m;
    const tag = tagRaw.toLowerCase();
    if (close) {
      const i = stack.map(f => f.tag).lastIndexOf(tag);
      if (i === -1) continue;
      const popped = stack.splice(i);
      if (popped.some(f => f.self) && --depth === 0) { ranges.push([openAt, m.index + m[0].length]); openAt = -1; }
      continue;
    }
    if (VOID.has(tag) || /\/>$/.test(m[0])) continue;
    const self = /aria-hidden\s*=\s*["']true["']/i.test(attrs);
    if (self) {
      if (depth === 0) openAt = m.index;
      depth++;
    }
    stack.push({ tag, self });
  }
  if (openAt !== -1) ranges.push([openAt, Infinity]);
  return ranges;
}
const inRanges = (ranges, pos) => ranges.some(([a, b]) => pos >= a && pos <= b);

const violations = [];
for (const { name, html: raw } of docs) {
  // Body fragments (partial templates) aren't full documents — skip them.
  if (!/<!doctype|<html[\s>]/i.test(raw)) continue;
  const html = strip(raw);
  const add = msg => violations.push(`${name}: ${msg}`);

  if (!/<html\b[^>]*\blang\s*=\s*["'][^"']/i.test(raw)) add("missing <html lang>");

  // A skip link is only required when a nav landmark exists to bypass.
  const skip = html.match(/<a\b[^>]*href\s*=\s*["']#(main[\w-]*|content|primary)[\w-]*["']/i);
  if (/<nav\b/i.test(html) && !skip) {
    add("no skip link — add a first-focusable <a href=\"#main…\"> so keyboard users can bypass the nav");
  } else if (skip && !new RegExp(`id\\s*=\\s*["']${skip[1]}["']`, "i").test(html)) {
    add(`skip link targets #${skip[1]} but no element has that id`);
  }

  if (!/<main\b/i.test(html) && !/role\s*=\s*["']main["']/i.test(html)) add("no <main> landmark");

  const hidden = hiddenRanges(html);
  const shown = pos => !inRanges(hidden, pos);

  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (shown(m.index) && !/\balt\s*=\s*["'][^"']*["']/i.test(m[0])) add(`<img> without alt attribute: ${m[0].slice(0, 140)}`);
  }

  for (const m of html.matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi)) {
    if (!shown(m.index)) continue;
    const tag = m[0].slice(0, m[0].indexOf(">") + 1);
    if (/aria-hidden\s*=\s*["']true["']/i.test(tag)) continue;
    if (/\baria-label|\baria-labelledby|\brole\s*=\s*["']img["']/i.test(tag) || /<title[\s>]/i.test(m[0])) continue;
    add(`<svg> is neither aria-hidden nor labelled: ${tag.slice(0, 140)}`);
  }

  for (const m of html.matchAll(/<(a|button)\b[^>]*>[\s\S]*?<\/\1>/gi)) {
    if (!shown(m.index)) continue;
    const [el, kind] = [m[0], m[1].toLowerCase()];
    const tag = el.slice(0, el.indexOf(">") + 1);
    if (kind === "a" && !/\bhref\s*=/i.test(tag)) continue; // named anchor, not a control
    if (named(tag)) continue;
    if (/<img\b[^>]*\balt\s*=\s*["'][^"']+["']/i.test(el)) continue;
    if (/<svg\b[^>]*\baria-label\s*=\s*["'][^"']/i.test(el)) continue;
    if (textOf(el)) continue;
    add(`<${kind}> has no accessible name: ${tag.slice(0, 140)}`);
  }

  const labelFor = new Set([...html.matchAll(/<label\b[^>]*\bfor\s*=\s*["']([^"']+)/gi)].map(m => m[1]));
  const labelBodies = [...html.matchAll(/<label\b[^>]*>[\s\S]*?<\/label>/gi)].map(m => m[0]);
  for (const m of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
    if (!shown(m.index)) continue;
    const tag = m[0];
    if (/aria-hidden\s*=\s*["']true["']|\bhidden\b/i.test(tag)) continue;
    const type = tag.match(/\btype\s*=\s*["']?([\w-]+)/i)?.[1]?.toLowerCase() ?? "text";
    if (["hidden", "submit", "button", "reset"].includes(type)) continue;
    if (named(tag)) continue;
    const id = tag.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1];
    if (id && labelFor.has(id)) continue;
    if (labelBodies.some(body => body.includes(tag))) continue;
    const el = m[1] === "input" ? `<input type="${type}">` : `<${m[1]}>`;
    add(`${el} has no label — use <label for>, a wrapping <label>, or aria-label: ${tag.slice(0, 140)}`);
  }
  for (const m of html.matchAll(/<label\b[^>]*>[\s\S]*?<\/label>/gi)) {
    if (!/\bfor\s*=\s*["']/i.test(m[0]) && !/<(input|select|textarea)\b/i.test(m[0])) {
      add(`<label> is not associated with a control: ${m[0].slice(0, 140)}`);
    }
  }

  for (const m of html.matchAll(/<nav\b[^>]*>/gi)) {
    if (shown(m.index) && !/\baria-label\s*=\s*["'][^"']|\baria-labelledby\s*=\s*["'][^"']/i.test(m[0])) {
      add(`<nav> landmark needs an accessible name (aria-label): ${m[0].slice(0, 140)}`);
    }
  }

  for (const m of html.matchAll(/<iframe\b[^>]*>/gi)) {
    if (shown(m.index) && !/\btitle\s*=\s*["'][^"']/i.test(m[0])) add(`<iframe> missing title: ${m[0].slice(0, 140)}`);
  }

  let prevLevel = 0;
  for (const m of html.matchAll(/<h([1-6])\b/gi)) {
    const level = Number(m[1]);
    if (prevLevel && level > prevLevel + 1) add(`heading order skips a level (h${prevLevel} → h${level})`);
    prevLevel = level;
  }

  for (const m of html.matchAll(/tabindex\s*=\s*["'](\d+)/gi)) {
    if (Number(m[1]) > 0) add(`tabindex="${m[1]}" breaks natural tab order — use 0 or -1 only`);
  }

  if (/\bautofocus\b/i.test(html)) add("autofocus steals focus on load — remove it");

  for (const m of html.matchAll(/<(div|span|li)\b[^>]*\bonclick\s*=/gi)) {
    if (!/\brole\s*=|\btabindex\s*=/i.test(m[0])) add(`<${m[1]} onclick> is not keyboard-operable — use <button>/<a> or add role+tabindex: ${m[0].slice(0, 120)}`);
  }

  for (const m of html.matchAll(/<table\b[\s\S]*?<\/table>/gi)) {
    if (/<td\b/i.test(m[0]) && !/<th\b/i.test(m[0]) && !/role\s*=\s*["'](presentation|none)["']/i.test(m[0])) {
      add(`<table> has rows but no <th> headers — add header cells or role="presentation" if it's layout`);
    }
  }

  for (const m of html.matchAll(/<(video|audio)\b[\s\S]*?<\/\1>/gi)) {
    if (shown(m.index) && !/<track\b/i.test(m[0])) add(`<${m[1]}> without <track> captions/subtitles`);
  }
}

if (violations.length) throw new Error(`Accessibility tagging audit failed:\n- ${[...new Set(violations)].join("\n- ")}`);
console.log(`Accessibility tagging audit passed for ${docs.length} documents.`);
