import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/**
 * Parse the SRT in public/ into src/captions.json.
 *
 * Usage:
 *   node scripts/parse-srt.mjs                      # auto-detect first .srt in public/
 *   node scripts/parse-srt.mjs path/to/file.srt     # explicit path
 */

const findSrt = () => {
  const arg = process.argv[2];
  if (arg) return resolve(root, arg);
  const publicDir = resolve(root, "public");
  const srts = readdirSync(publicDir).filter((f) => f.toLowerCase().endsWith(".srt"));
  if (srts.length === 0) {
    throw new Error("No .srt file found in public/. Drop one in or pass a path arg.");
  }
  if (srts.length > 1) {
    console.warn(`Multiple SRTs in public/. Using: ${srts[0]}`);
  }
  return resolve(publicDir, srts[0]);
};

const SRT_PATH = findSrt();
const OUT_PATH = resolve(root, "src/captions.json");

const timeToSeconds = (t) => {
  const [hms, ms] = t.split(",");
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3600 + m * 60 + s + Number(ms) / 1000;
};

const src = readFileSync(SRT_PATH, "utf8");
const blocks = src.split(/\r?\n\r?\n/).filter(Boolean);

const words = [];
for (const block of blocks) {
  const lines = block.split(/\r?\n/);
  if (lines.length < 2) continue;
  const index = Number(lines[0]);
  const m = lines[1].match(
    /^(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/,
  );
  if (!m) continue;
  const start = timeToSeconds(m[1]);
  const end = timeToSeconds(m[2]);
  const text = lines.slice(2).join(" ").trim();
  if (!text) continue;
  words.push({ i: index, t: text, s: start, e: end });
}

writeFileSync(OUT_PATH, JSON.stringify(words));
console.log(`Wrote ${words.length} words to ${OUT_PATH} (from ${SRT_PATH})`);
