import rawCaptions from "./captions.json";

export type Word = {
  /** Original SRT cue index */
  index: number;
  /** Word text, whitespace-trimmed */
  text: string;
  /** Start time in seconds, measured from video start */
  start: number;
  /** End time in seconds, measured from video start */
  end: number;
};

const captions: Word[] = (rawCaptions as { i: number; t: string; s: number; e: number }[]).map(
  (w) => ({ index: w.i, text: w.t, start: w.s, end: w.e }),
);

export const allWords = (): Word[] => captions;

/** Words whose [start, end] overlaps the half-open range [fromSec, toSec). */
export const wordsInRange = (fromSec: number, toSec: number): Word[] =>
  captions.filter((w) => w.end > fromSec && w.start < toSec);

/** Find consecutive-word matches of a phrase. Case-insensitive, punctuation-insensitive. */
export const findPhrase = (phrase: string): Word[][] => {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9'\s]/g, "").trim();
  const target = normalize(phrase).split(/\s+/).filter(Boolean);
  if (target.length === 0) return [];
  const matches: Word[][] = [];
  for (let i = 0; i <= captions.length - target.length; i++) {
    let ok = true;
    for (let j = 0; j < target.length; j++) {
      if (normalize(captions[i + j].text) !== target[j]) {
        ok = false;
        break;
      }
    }
    if (ok) matches.push(captions.slice(i, i + target.length));
  }
  return matches;
};

/** Convert seconds to frames at the given fps (rounded). */
export const secToFrames = (sec: number, fps: number): number => Math.round(sec * fps);

/** Frame range a word occupies at the given fps. */
export const wordFrames = (w: Word, fps: number): { from: number; durationInFrames: number } => {
  const from = secToFrames(w.start, fps);
  const to = secToFrames(w.end, fps);
  return { from, durationInFrames: Math.max(1, to - from) };
};
