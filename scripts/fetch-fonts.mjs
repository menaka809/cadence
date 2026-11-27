// Downloads Clash Display from Fontshare before `dev` and `build`.
//
// The ITF Free Font License lets us self-host the font on our own site, but
// not redistribute the files through a public repository. So the files live
// in a git-ignored folder and are fetched from the official source here.
// Files are used unmodified (no subsetting or conversion, per the licence).

import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const WEIGHTS = [400, 500, 600];
// Satori (next/og) can't read woff2, so the share image uses this woff.
const OG_WEIGHT = 600;
const OUT_DIR = join(process.cwd(), "app", "fonts", "clash-display");
const CSS_URL = `https://api.fontshare.com/v2/css?f[]=clash-display@${WEIGHTS.join(",")}&display=swap`;

const exists = (p) => stat(p).then((s) => s.size > 0, () => false);

const wanted = [
  ...WEIGHTS.map((w) => ({ weight: w, ext: "woff2" })),
  { weight: OG_WEIGHT, ext: "woff" },
].map((f) => ({ ...f, path: join(OUT_DIR, `ClashDisplay-${f.weight}.${f.ext}`) }));

async function main() {
  const missing = [];
  for (const f of wanted) if (!(await exists(f.path))) missing.push(f);
  if (missing.length === 0) return;

  const css = await fetchText(CSS_URL);
  // Each @font-face block: its weight plus one url() per format.
  const blocks = css.split("@font-face").slice(1);
  const urls = new Map();
  for (const block of blocks) {
    const weight = Number(block.match(/font-weight:\s*(\d+)/)?.[1]);
    for (const m of block.matchAll(/url\('([^']+)'\)\s*format\('(woff2?|truetype)'\)/g)) {
      urls.set(`${weight}.${m[2]}`, m[1].startsWith("//") ? `https:${m[1]}` : m[1]);
    }
  }

  await mkdir(OUT_DIR, { recursive: true });
  for (const f of missing) {
    const url = urls.get(`${f.weight}.${f.ext}`);
    if (!url) throw new Error(`No ${f.ext} URL for weight ${f.weight} in Fontshare CSS`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} responded ${res.status}`);
    await writeFile(f.path, Buffer.from(await res.arrayBuffer()));
  }
  console.log(`[fonts] Clash Display: downloaded ${missing.length} file(s) from Fontshare`);
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.text();
}

main().catch((err) => {
  console.error(`[fonts] Could not download Clash Display: ${err.message}`);
  console.error("[fonts] The build needs network access to api.fontshare.com and cdn.fontshare.com.");
  process.exit(1);
});
