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

Before anything else, settle the **project folder name** — the exact string used for the new folder, copied verbatim. If `$ARGUMENTS` already supplies it, just confirm in one short line. Don't ask about tone, SRT, or anything else yet — those come later.

Projects are bucketed by month under `projects/YYYY-MM/` (see workspace `CLAUDE.md` for the rationale). Always scaffold into the **current month** bucket — let `date` resolve it; don't hardcode the month.

Once the name is settled, run from the workspace root:

```bash
MONTH=$(date +%Y-%m)
mkdir -p "projects/$MONTH"
cp -R "_template" "projects/$MONTH/<Project Name>"
```

Then edit `projects/<MONTH>/<Project Name>/package.json` — set `name` to a slugified version of the folder (lowercase, hyphens, no spaces). E.g. `"GPT-5 vs Claude Opus"` → `"gpt-5-vs-claude-opus"`.

For all subsequent steps, the project path is `projects/<MONTH>/<Project Name>/` — use it everywhere (`cd`, SRT drop location, etc.). Remember the resolved `<MONTH>` value across steps; don't re-run `date` later in the session in case the month rolls over mid-task.

Do **not** run `npm install` yet. The SRT isn't there.

## Step 2 — Stop and wait for the SRT

Tell the user, in one short message:

> Scaffolded `projects/<MONTH>/<Project Name>/`. Drop your `.srt` into `projects/<MONTH>/<Project Name>/public/` and tell me when it's there — I'll install, parse, and brainstorm segments in one go.

Do not proceed past this step until the user confirms the SRT is in `public/`. Don't poll, don't guess — wait for them.

## Step 3 — Confirm topic + tone, then any beats to skip

Once the user says the SRT is in `public/`, ask in **one** short message:

1. **Topic** — one sentence on what the video is about. Needed for brainstorming.
2. **Tone** — default is **"clean tech review"**. Confirm or override (other examples: "energetic comparison", "playful demo").
3. **Anything to skip?** — sometimes the intro beat (Beat 1) or outro is shot natively and shouldn't have a motion-graphic replacement. Ask before brainstorming.

Don't proceed until topic + tone are settled. Skip-list can be empty.

## Step 4 — Install + parse the SRT

```bash
cd "projects/<MONTH>/<Project Name>"
npm install
npm run parse-srt
```

`parse-srt` reads `public/*.srt` and writes `src/captions.json`. Each entry: `{ i, t, s, e }` (index, text, start sec, end sec). This is the source of truth for word-level timing.

If `npm install` or `parse-srt` errors, surface the error verbatim and stop — don't try to "fix" the template; it's validated.

## Step 5 — Read the captions and brainstorm beats

**Read the SRT directly** (e.g. `public/<name>.srt`) for the brainstorm — it's faster to scan than `captions.json` because phrases stay grouped on lines. Use `captions.json` only when you need exact word-level timestamps for a specific reveal.

Brainstorming heuristic — the workspace has a validated style language; lean on it:

- **A "beat" replaces the talking head full-frame** for its duration. Voice-over continues underneath in your editor (FCP, Premiere, DaVinci). So a beat must be visually substantive enough to hold the screen — not a tiny lower-third overlay.
- **Good beat candidates:** comparisons (split-screen "A vs B"), score reveals / scoreboards, lists or specs that benefit from typography, before/after shots, product hero shots, statistics or numbers the host calls out, "let's dive in" / chapter transitions, named features that have a logo or icon.
- **Bad beat candidates:** generic filler, anything where the host's face/reaction is the point, jokes/asides where motion graphics would feel heavy.
- **Suspense rule:** if a beat could spoil the answer (which model wins, which option is which), plan to blur identifiers — and use the **same placeholder string** under the blur on both sides ("Hidden Model" / "Hidden Model"), or the silhouettes leak the answer.
- **No end-of-segment fade-outs** by default. Hard cut. The video editor handles the transition.
- **Beat numbers don't have to be sequential** — skipping is fine and expected. Note skipped beats with a reason in the project's CLAUDE.md.

Output the brainstorm as a markdown table the user can drop straight into the project's `CLAUDE.md`:

| Beat | Voice cue (s–e) | Trigger phrase | Concept | Composition ID | Why it works |
|------|-----------------|----------------|---------|----------------|--------------|

- **Voice cue** = exact start–end seconds from the SRT/captions for the beat's duration.
- **Trigger phrase** = a short quoted snippet of what the host is saying so the user can verify alignment by ear.
- **Composition ID** = `BeatNN-ShortName` with **hyphens, never underscores** (Remotion throws otherwise). PascalCase short name.
- **Why it works** = one short clause — what about this moment makes it screen-worthy.

Aim for **6–12 beats** for a typical short-form video, fewer for very short pieces. Don't pad. If the SRT yields only 4 obvious beats, propose 4.

## Step 6 — Update the project's `CLAUDE.md`

Replace the placeholder beat-plan table in the new project's `CLAUDE.md` with the brainstormed table. Fill in:

- Project description (one sentence)
- Tone (from step 3)
- SRT path (`public/<filename>.srt`)
- Beat plan table (status `TBD` for all beats since none built yet)

Leave the `## Project-specific overrides` section alone unless the user already named a non-standard canvas/codec.

## Step 7 — Hand off

End with a short message:

> Scaffolded `projects/<MONTH>/<Project Name>/` and brainstormed N beats. Run `cd "projects/<MONTH>/<Project Name>" && npm run dev` to launch Remotion Studio. Pick a beat to build first and I'll start with that one.

Don't start building beats unless the user picks one. The brainstorm is a menu, not a commitment.

---

## What NOT to do

- Don't modify `_template/` itself — only the copy.
- Don't write a node script to search captions; `Read` / `grep` the SRT directly.
- Don't render anything in this skill. Rendering is a separate, explicit step the user runs themselves.
- Don't propose beats that require assets (logos, screenshots) you haven't seen in `public/`. If a beat would need them, list the missing asset in the "Why it works" cell so the user can drop it in.
- Don't auto-init git or push to GitHub — the user owns their version control.
- Don't use emojis in the project files or the brainstorm output.
