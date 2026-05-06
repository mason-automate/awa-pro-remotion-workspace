# <Project Name>

Remotion project building motion-graphic / B-roll segments for **<describe video here>**. Each beat is its own `<Composition>` in `src/Root.tsx`, rendered as a standalone `.mp4` and dropped into the editing timeline.

> Workspace-level conventions live in `../CLAUDE.md`. This file captures only what's specific to this project.

**Tone:** <e.g., "clean tech review", "playful", "high-energy fight-card">
**Aspect:** <wide / vertical / square — set in `src/theme.ts` `ASPECT` constant>

## Source assets
- SRT: `public/<...>.srt`
- <list source images, logos, etc. and their paths>

## Beat plan

| Beat | Voice cue (start–end) | Concept | Composition ID | Status |
|------|------------------------|---------|----------------|--------|
| 1    | 0:00–0:00              |         | `Beat01-...`   | TBD    |

> Update this table as beats are built. "Skipped" is a valid status — note why.

## Project-specific overrides

- **Brand colors:** <only if added beyond the workspace defaults>
- **Special render flags:** <only if non-default>

## Render

Three options, pick whichever:

1. **Studio button** — click the render icon next to the composition name in Remotion Studio.
2. **Ask Claude Code** — "render Beat01-Intro for me" and Claude runs the CLI for you.
3. **CLI directly:**
   ```bash
   npx remotion render <BeatNN-Name> "out/<BeatNN-Name>.mp4" --codec=h264 --crf=18
   ```

If a beat needs **alpha transparency** for overlay (rare — most beats are full-frame B-roll), use ProRes 4444 instead:
```bash
npx remotion render <BeatNN-Name> "out/<BeatNN-Name>.mov" \
  --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png
```
All four flags are required for alpha — without `--image-format=png` the render fails.
