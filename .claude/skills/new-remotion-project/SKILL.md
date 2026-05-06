---
name: new-remotion-project
description: Scaffold a new Remotion project from the workspace `_template/`, then (once the user drops in an SRT) parse it and brainstorm beat-by-beat segment ideas tied to word-level voice timings. Use when the user says "I have a new video", "new video", "I have another video", "new B-roll project", "new Remotion project", "start a new video", "starting a new project", or hands over an SRT and asks for segment ideas. Trigger broadly on any phrasing where the user signals they're beginning a fresh video project in this Remotion workspace.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# /new-remotion-project — Scaffold a Remotion project + brainstorm segments

This skill assumes it's running inside a clone of the AWA PRO Remotion workspace. Each video is a self-contained folder copied from `_template/`. Read the workspace `CLAUDE.md` (at the repo root) for full conventions before brainstorming — they govern style, naming, and rendering.

Arguments passed: `$ARGUMENTS` — usually the desired project folder name (e.g. `"GPT-5 vs Claude Opus"`). If empty, ask for it.

---

## Step 1 — Get the folder name and scaffold

Before anything else, settle the **project folder name** — the exact string used for the new folder, copied verbatim. If `$ARGUMENTS` already supplies it, just confirm in one short line. Don't ask about aspect, tone, SRT, or anything else yet — those come later.

Projects are bucketed by month under `projects/YYYY-MM/` (see workspace `CLAUDE.md` for the rationale). Always scaffold into the **current month** bucket — let `date` resolve it; don't hardcode the month.

Once the name is settled, run from the workspace root:

```bash
MONTH=$(date +%Y-%m)
mkdir -p "projects/$MONTH"
cp -R "_template" "projects/$MONTH/<Project Name>"
```

Then edit `projects/<MONTH>/<Project Name>/package.json` — set `name` to a slugified version of the folder (lowercase, hyphens, no spaces). E.g. `"GPT-5 vs Claude Opus"` → `"gpt-5-vs-claude-opus"`.

For all subsequent steps, the project path is `projects/<MONTH>/<Project Name>/` — use it everywhere (`cd`, SRT drop location, etc.). Remember the resolved `<MONTH>` value across steps; don't re-run `date` later in the session in case the month rolls over mid-task.

Do **not** run `npm install` yet. The SRT and aspect ratio aren't settled.

## Step 2 — Stop and wait for the SRT

Tell the user, in one short message:

> Scaffolded `projects/<MONTH>/<Project Name>/`. Drop your `.srt` into `projects/<MONTH>/<Project Name>/public/` and tell me when it's there — I'll ask a few questions, then install, parse, and brainstorm segments in one go.

Do not proceed past this step until the user confirms the SRT is in `public/`. Don't poll, don't guess — wait for them.

## Step 3 — Confirm aspect ratio + topic + tone, then any beats to skip

Once the user says the SRT is in `public/`, ask in **one** short message — aspect first, since it shapes the brainstorm:

1. **Aspect ratio** — `vertical` (9:16, e.g. TikTok / Reels / Shorts), `wide` (16:9, e.g. YouTube), or `square` (1:1, e.g. Instagram feed). **No default — always ask.** This shapes everything downstream.
2. **Topic** — one sentence on what the video is about. Needed for brainstorming.
3. **Tone** — default is **"clean tech review"**. Confirm or override (other examples: "energetic comparison", "playful demo", "high-energy fight-card").
4. **Anything to skip?** — sometimes the intro beat (Beat 1) or outro is shot natively and shouldn't have a motion-graphic replacement. Ask before brainstorming. Skip-list can be empty.

Don't proceed until aspect, topic, and tone are settled.

## Step 4 — Patch the canvas aspect, then install + parse

First, set the chosen aspect in `projects/<MONTH>/<Project Name>/src/theme.ts`. The file has this line near the top:

```ts
export const ASPECT: "wide" | "vertical" | "square" = "wide";
```

Edit the string literal at the end to match the user's choice — `"vertical"`, `"wide"`, or `"square"`. The `VIDEO` (canvas dimensions) and `SAFE` (inset constants) exports both derive from it automatically.

Then install and parse:

```bash
cd "projects/<MONTH>/<Project Name>"
npm install
npm run parse-srt
```

`parse-srt` reads `public/*.srt` and writes `src/captions.json`. Each entry: `{ i, t, s, e }` (index, text, start sec, end sec). This is the source of truth for word-level timing.

If `npm install` or `parse-srt` errors, surface the error verbatim and stop — don't try to "fix" the template; it's validated.

## Step 5 — Read the captions and brainstorm beats

**Read the SRT directly** (e.g. `public/<name>.srt`) for the brainstorm — it's faster to scan than `captions.json` because phrases stay grouped on lines. Use `captions.json` only when you need exact word-level timestamps for a specific reveal.

Universal heuristics (apply to every aspect):

- **A "beat" replaces the talking head full-frame** for its duration. Voice-over continues underneath in the user's editor (FCP, Premiere, DaVinci, CapCut). So a beat must be visually substantive enough to hold the screen — not a tiny lower-third overlay.
- **Suspense rule:** if a beat could spoil the answer (which model wins, which option is which), plan to blur identifiers — and use the **same placeholder string** under the blur on both sides ("Hidden Model" / "Hidden Model"), or the silhouettes leak the answer.
- **No end-of-segment fade-outs** by default. Hard cut. The video editor handles the transition.
- **Beat numbers don't have to be sequential** — skipping is fine and expected. Note skipped beats with a reason in the project's CLAUDE.md.
- **Don't propose beats that need assets** (logos, screenshots) you haven't seen in `public/`. If a beat would need them, list the missing asset in the "Why it works" cell so the user can drop it in.

**Aspect-conditional heuristics — only apply the block matching the user's choice:**

### If `wide` (16:9 — YouTube, web)

- **Good beat candidates:** split-screen "A vs B" comparisons, multi-column scoreboards, horizontal score reveals, lists / specs that benefit from typography, before/after shots, product hero shots, statistics or numbers the host calls out, "let's dive in" / chapter transitions, named features that have a logo or icon.
- **Bad:** generic filler, anything where the host's face/reaction is the point, jokes/asides where motion graphics would feel heavy.

### If `vertical` (9:16 — TikTok / Reels / Shorts)

- **Good beat candidates:** stacked layouts, single hero element per beat (one big number, one big logo, one bold headline), chunky number reveals, vertical list pop-ins synced to spoken keywords, product hero zoom, large emoji-style icon reveals.
- **Bad:** split-screen "A vs B" (cramped at 1080px wide), multi-column grids (everything shrinks), small type, dense data.
- **Use `SAFE` insets aggressively** — TikTok/Reels overlay UI covers ~220px top, ~320px bottom, and ~130px on each side. Critical content must stay inside `SAFE` or it gets covered by captions, share buttons, or the platform UI.
- Beats tend to run shorter (1.5–4s) with frequent cuts back to talking head — short-form pacing.

### If `square` (1:1 — Instagram feed)

- **Good beat candidates:** centered single-focus compositions, big bold typography, hero product shots, large stat reveals.
- **Bad:** anything that needs horizontal real estate (split-screen, wide scoreboards) or vertical pacing (long stacked lists).
- Designs should center-anchor; both top and bottom margins are visible so use them symmetrically.

### Output format

Output the brainstorm as a markdown table the user can drop straight into the project's `CLAUDE.md`:

| Beat | Voice cue (s–e) | Trigger phrase | Concept | Composition ID | Why it works |
|------|-----------------|----------------|---------|----------------|--------------|

- **Voice cue** = exact start–end seconds from the SRT/captions for the beat's duration.
- **Trigger phrase** = a short quoted snippet of what the host is saying so the user can verify alignment by ear.
- **Composition ID** = `BeatNN-ShortName` with **hyphens, never underscores** (Remotion CLI / studio require this). PascalCase short name.
- **Why it works** = one short clause — what about this moment makes it screen-worthy.

Aim for **6–12 beats** for a typical short-form video, fewer for very short pieces. Don't pad. If the SRT yields only 4 obvious beats, propose 4.

## Step 6 — Update the project's `CLAUDE.md`

Replace the placeholder beat-plan table in the new project's `CLAUDE.md` with the brainstormed table. Fill in:

- Project description (one sentence)
- Tone (from step 3)
- Aspect (from step 3)
- SRT path (`public/<filename>.srt`)
- Beat plan table (status `TBD` for all beats since none built yet)

Leave the `## Project-specific overrides` section alone unless the user already named non-standard brand colors or render flags.

## Step 7 — Hand off

End with a short message:

> Scaffolded `projects/<MONTH>/<Project Name>/` (aspect: `<aspect>`) and brainstormed N beats. Run `cd "projects/<MONTH>/<Project Name>" && npm run dev` to launch Remotion Studio. Pick a beat to build first and I'll start with that one.

Don't start building beats unless the user picks one. The brainstorm is a menu, not a commitment.

---

## What NOT to do

- Don't modify `_template/` itself — only the copy.
- Don't write a node script to search captions; `Read` / `grep` the SRT directly.
- Don't render anything in this skill. Rendering is a separate, explicit step the user runs themselves (studio button, by asking Claude later, or via CLI).
- Don't propose beats that require assets you haven't seen in `public/` — call them out as missing instead.
- Don't auto-init git or push to GitHub — the user owns their version control.
- Don't use emojis in the project files or the brainstorm output.
- Don't assume an aspect ratio — always ask in Step 3.
