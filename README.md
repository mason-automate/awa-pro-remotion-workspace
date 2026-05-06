# AWA PRO — Remotion Workspace

A scaffold + AI workflow for producing short-form motion-graphic and B-roll segments with [Remotion](https://www.remotion.dev/), used by members of **Automate What Academy PRO**.

You drop a transcript (`.srt`), Claude Code brainstorms beat-by-beat motion graphics tied to word-level voice timings, and you iterate in the browser. Each rendered `.mov` drops into your editing timeline (FCP, Premiere, DaVinci) on top of your talking-head footage.

## What's inside

- **`_template/`** — a clean Remotion project scaffold (TypeScript, Inter font, validated style language). Every new video gets a copy.
- **`.claude/skills/new-remotion-project/`** — a Claude Code skill that scaffolds a project, parses your SRT, and brainstorms motion-graphic beats. Triggered by saying "new video" (or similar) inside Claude Code.
- **`CLAUDE.md`** — workspace conventions (canvas, naming, color, typography, reveal timing). Claude Code reads this automatically.
- **`projects/`** — where your videos live, bucketed by month (`projects/2026-05/My Video/`).

## Prerequisites

- [Claude Code](https://claude.com/claude-code) (CLI, desktop app, or VS Code extension)
- [Node.js](https://nodejs.org/) 20 or newer
- A short-form video transcript as an `.srt` file (most transcription tools export this)
- *(Optional, for rendering)* A working `ffmpeg` install

## 60-second quickstart

```bash
git clone https://github.com/mason-automate/awa-pro-remotion-workspace.git
cd awa-pro-remotion-workspace
```

Open the folder in Claude Code (`claude` in the terminal, or open in VS Code and start the extension), then say:

> new video

Claude scaffolds a fresh project under `projects/YYYY-MM/<Your Project Name>/` and stops. Drop your `.srt` into that project's `public/` folder and tell Claude. It installs dependencies, parses the SRT into word-level timings, and proposes 6–12 motion-graphic beats with exact voice cues.

Pick a beat to build first. Claude builds it, you preview it live in Remotion Studio:

```bash
cd "projects/YYYY-MM/<Your Project Name>"
npm run dev   # opens http://localhost:3000
```

When a beat looks right, render it for your editor:

```bash
npx remotion render Beat01-Intro "out/Beat01-Intro.mov" --codec=prores --prores-profile=hq
```

Drop the `.mov` on your editing timeline at the beat's start time. Voice-over continues underneath on your audio track.

## Conventions

The workspace ships with opinionated defaults that have been validated across many videos:

- **Canvas:** 3840×2160 @ 60fps
- **Type:** Inter (heavy weight headlines, semibold uppercase eyebrows)
- **Accent color:** cyan `#22D3EE` on a deep-charcoal background with a subtle aurora glow
- **No end-of-segment fade-outs** — hard cuts; your editor handles transitions
- **Suspense rule:** when a beat could spoil the answer (e.g. which model wins), blur the identifiers — and use the *same* placeholder text on both sides, or the silhouettes leak the answer
- **Composition IDs use hyphens, never underscores** (`Beat03-Scoreboard`) — Remotion throws otherwise

The full list lives in [`CLAUDE.md`](./CLAUDE.md). Override any of them per-project — your project's own `CLAUDE.md` (created from `_template/CLAUDE.md`) is where deviations belong.

## Why each video is its own folder

Every video gets its own `node_modules` and locks its own Remotion version. A Remotion upgrade for a new project can't break an old render. Old work stays reproducible forever.

## Asking for help

Members: post in the AWA PRO Skool community.

## License

MIT — fork, modify, ship videos.
