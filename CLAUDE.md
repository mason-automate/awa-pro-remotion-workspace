# AWA PRO — Remotion Workspace

A workspace for short-form Remotion motion-graphic / B-roll projects. Each video lives in its own self-contained folder with its own `node_modules`, so old renders stay reproducible forever (a Remotion upgrade for a new project can't break an old one).

## How to start a new project

The fastest path is the `/new-remotion-project` skill — say "new video" (or any similar phrase) and it scaffolds, waits for your SRT, installs, parses, and brainstorms beats. Manual steps below for reference.

1. **Copy the template into the current month's bucket:**
   ```bash
   mkdir -p "projects/$(date +%Y-%m)"
   cp -R "_template" "projects/$(date +%Y-%m)/Your Project Name"
   ```

2. **Rename the package** in `projects/YYYY-MM/Your Project Name/package.json` (`name` field).

3. **Drop the SRT** into `projects/YYYY-MM/Your Project Name/public/` (any filename ending in `.srt`).

4. **Drop other source assets** into `public/` (logos, image generations, etc.). Use subfolders for organized sets, e.g., `public/outputs/model-a/`, `public/outputs/model-b/`.

5. **Install + parse SRT:**
   ```bash
   cd "projects/YYYY-MM/Your Project Name"
   npm install
   npm run parse-srt   # generates src/captions.json from public/*.srt
   ```

6. **Tell Claude the project goal**, the brand/tone (clean tech review, energetic, etc.), and which beats need motion graphics. Claude reads the SRT and proposes per-beat ideas.

7. **Iterate in browser:**
   ```bash
   npm run dev   # opens Remotion Studio at http://localhost:3000
   ```
   Each beat = one `<Composition>` in `src/Root.tsx`. Reload the studio after edits.

8. **Render** for the editing timeline:
   ```bash
   npx remotion render BeatNN-Name "out/BeatNN-Name.mov" --codec=prores --prores-profile=hq
   ```

## Validated conventions

These are the defaults that ship with this workspace. Override per-project if a video needs something different.

### Canvas
- **3840 × 2160 @ 60fps** by default. Match your screen-recording source. Set in `src/theme.ts`.

### Naming
- One beat = one file: `src/graphics/BeatNN_ShortName.tsx` (PascalCase component name, e.g., `Beat03_Scoreboard`).
- Composition IDs use **hyphens, never underscores**: `Beat03-Scoreboard`. Remotion throws at load time otherwise.
- Beat numbers correspond to narrative beats in the SRT, not always sequential — skip numbers if a beat is dropped.

### Rendering
- ProRes 422 HQ (`--codec=prores --prores-profile=hq`) — the standard intermediate for FCP / Premiere / DaVinci.
- Use `--prores-profile=4444` only if a beat needs alpha for overlay (rare; most beats are full-frame B-roll cuts).

### Captions
- The parsed `src/captions.json` is the source of truth for word-level timing. Each entry: `{ i, t, s, e }` (index, text, start sec, end sec).
- For programmatic timing inside compositions: `findPhrase("the final score")` from `src/captions.ts`.
- For one-off lookups ("when does he say X?"): just `Read`/`grep` the SRT file directly. Don't write a node script.

### Segments are full-frame
- Beats replace the talking head for their duration. Voice-over continues on the editor's audio track underneath.
- Drop the rendered `.mov` on the timeline at the absolute beat-start time.

### No end-of-segment fade-out (default)
- Hard-end the segment; let the editor handle the cut. Fade-outs tend to cut off the final reveal too soon.
- If you do need a fade, make it short (≤12 frames) and only on the final overlay element, not the whole composition.

## Validated style language

These hold across beats unless a project explicitly overrides:

### Background
- Shared `<Background>` in `src/graphics/Background.tsx`: deep charcoal (`#07070A`) with cyan aurora glow top-right, faint grid mask, and vignette.
- Reuse — don't re-create. If a project wants a different vibe, edit `Background.tsx` once.

### Typography
- Inter via `@remotion/google-fonts/Inter`, loaded in `src/theme.ts`.
- Headlines: 140–200px, weight 900 (`weightHeavy`), letter-spacing -2 to 0.
- Eyebrow / pill labels: 44–56px, weight 600 (`weightSemibold`), letter-spacing 4–8, uppercase.

### Color
- Primary accent: cyan `#22D3EE` (`COLOR.accent`). Used for the dot indicator on pills, the VS badge border, the "Let's dive in" CTA, checkmark fills.
- Surfaces: `surfaceElevated` (rgba white 0.06) panels with `border` (rgba white 0.08) outlines on cards/pills.
- Avoid using brand colors of the products being compared on left/right panels — it telegraphs the answer.

### Reveals
- Pills slide in from offset (Y±30px) with `spring({ damping: 18, stiffness: 130-140 })`.
- Score numbers / hero elements: `spring({ damping: 22, stiffness: 80 })` for a slower count-up feel.
- Fast pops (VS badge, checkmarks): `spring({ damping: 12, stiffness: 150-160 })` for snap.

### Suspense / non-spoiler treatment
- When a beat could give away the answer (which model won, which is which), blur identifiers with `filter: blur(36px)`.
- **Critical:** if you blur text, render the SAME placeholder string under the blur on both sides (e.g., `"Hidden Model"` on both left and right panels). Different text creates different blur silhouettes that leak the answer.
- Don't show "WINNER" labels or color-glow the higher-scoring side until the final reveal beat.

## Per-project quirks live in the project's own CLAUDE.md

- Brand-specific colors, custom asset paths, deviations from the conventions above.
- The actual segment plan + voice timings.
- Anything render-target-specific (codec, resolution if non-standard).

## Repo layout

Projects are bucketed by month under `projects/YYYY-MM/` so the top level stays uncluttered as the project count grows. Recent work surfaces at the top of any listing; old work archives itself passively without manual moves.

```
awa-pro-remotion-workspace/
├── README.md                          ← start here
├── CLAUDE.md                          ← this file (workspace conventions)
├── .claude/
│   └── skills/
│       └── new-remotion-project/      ← scaffolds + brainstorms a new video
├── _template/                         ← scaffold for new projects (do not modify per-project)
│   ├── CLAUDE.md
│   ├── package.json, tsconfig.json, etc.
│   ├── scripts/parse-srt.mjs
│   └── src/
│       ├── Root.tsx, index.ts, theme.ts, captions.ts
│       └── graphics/Background.tsx
└── projects/
    └── YYYY-MM/                       ← month bucket (e.g. 2026-04/)
        └── <Project Name>/            ← one folder per video
            ├── CLAUDE.md              ← project-specific notes + segment plan
            ├── public/                ← SRT + source assets (large videos git-ignored)
            ├── src/graphics/BeatNN_*.tsx
            └── out/                   ← rendered .mov files (git-ignored)
```

**Multi-episode series:** prefix the folder name (e.g. `myshow-ep03-...`) so all episodes are findable via `find projects -name "myshow-ep*"` regardless of which month bucket they landed in.
