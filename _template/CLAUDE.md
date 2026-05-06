# <Project Name>

Remotion project building motion-graphic / B-roll segments for **<describe video here>**. Each beat is its own `<Composition>` in `src/Root.tsx`, rendered as a standalone ProRes 422 HQ `.mov` and assembled in Final Cut Pro.

> Workspace-level conventions live in `../CLAUDE.md`. This file captures only what's specific to this project.

**Tone:** <e.g., "clean tech review", "playful", "high-energy fight-card">

## Source assets
- SRT: `public/<...>.srt`
- <list source images, logos, etc. and their paths>

## Beat plan

| Beat | Voice cue (start–end) | Concept | Composition ID | Status |
|------|------------------------|---------|----------------|--------|
| 1    | 0:00–0:00              |         | `Beat01-...`   | TBD    |

> Update this table as beats are built. "Skipped" is a valid status — note why.

## Project-specific overrides

- **Canvas:** <only if non-standard, otherwise delete this line — default is 3840×2160 @ 60fps>
- **Brand colors:** <only if added beyond the workspace defaults>
- **Special render flags:** <only if non-default>

## Render

```bash
npx remotion render <BeatNN-Name> "out/<BeatNN-Name>.mov" --codec=prores --prores-profile=hq
```
