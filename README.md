# AWA PRO — Remotion Workspace

A scaffold + AI workflow for producing short-form motion-graphic and B-roll segments with [Remotion](https://www.remotion.dev/), used by members of **Automate What Academy PRO**.

You drop a transcript (`.srt`), Claude Code brainstorms beat-by-beat motion graphics tied to word-level voice timings, and you iterate in the browser. Each rendered `.mp4` drops into your editing timeline (FCP, Premiere, DaVinci, CapCut) on top of your talking-head footage.

Works for **wide (YouTube)**, **vertical (TikTok / Reels / Shorts)**, and **square (Instagram feed)**. Claude asks at scaffold time and configures the canvas + safe areas for you.

## What's inside

- **`_template/`** — a clean Remotion project scaffold (TypeScript, Inter font, validated style language, aspect-ratio presets, TikTok/Reels safe-area insets). Every new video gets a copy.
- **`.claude/skills/new-remotion-project/`** — a Claude Code skill that scaffolds a project, asks for aspect ratio + topic + tone, parses your SRT, and brainstorms motion-graphic beats. Triggered by saying "new video" (or similar) inside Claude Code.
- **`CLAUDE.md`** — workspace conventions (canvas presets, naming, color, typography, reveal timing). Claude Code reads this automatically.
- **`projects/`** — where your videos live, bucketed by month (`projects/2026-05/My Video/`).

## Prerequisites

- [Claude Code](https://claude.com/claude-code) (CLI, desktop app, or VS Code extension)
- [Node.js](https://nodejs.org/) 20 or newer
- A short-form video transcript as an `.srt` file. **Word-level timestamps strongly preferred** — one timestamp per word, not per sentence. This is what makes graphics pop in synced to specific spoken words. Phrase-level SRT (YouTube auto-captions, Premiere transcribe, CapCut) still works, you just lose per-word sync.

  **How to get a word-level SRT, free → paid:**

  - **[Whisper](https://github.com/openai/whisper)** (free, open-source) — runs locally on your machine. Once installed: `whisper your-audio.mp3 --word_timestamps True --output_format srt`. Requires the terminal and a one-time model download. Best price-to-quality if you're comfortable with the command line.
  - **[MacWhisper](https://goodsnooze.gumroad.com/l/macwhisper)** (Mac only, one-time purchase) — GUI wrapper around Whisper. Toggle word-level in export settings.
  - **[Descript](https://www.descript.com/)** (subscription) — also a full video editor; word-level is a checkbox in SRT export.

## 60-second quickstart

```bash
git clone https://github.com/mason-automate/awa-pro-remotion-workspace.git
cd awa-pro-remotion-workspace
```

Open the folder in Claude Code (`claude` in the terminal, or open in VS Code and start the extension), then say:

> new video

Claude will ask:

1. **Project name** — anything you want; becomes the folder name
2. **Aspect ratio** — `vertical` (9:16) / `wide` (16:9) / `square` (1:1)
3. **Topic + tone** — one sentence each
4. **Anything to skip** — e.g. an intro beat that's shot natively

Then drop your `.srt` into the project's `public/` folder and tell Claude. It installs, parses the SRT into word-level timings, and proposes 6–12 motion-graphic beats with exact voice cues.

Pick a beat to build first. Claude builds it, you preview it live in Remotion Studio:

```bash
cd "projects/YYYY-MM/<Your Project Name>"
npm run dev   # opens http://localhost:3000
```

When a beat looks right, **render it** — three options, pick whichever is friendliest:

1. **Click the render button** next to the composition in Remotion Studio (no terminal)
2. **Ask Claude Code:** "render Beat01-Intro for me" — Claude runs the CLI for you
3. **Run the CLI yourself:**

   ```bash
   npx remotion render Beat01-Intro "out/Beat01-Intro.mp4" --codec=h264 --crf=18
   ```

Drop the `.mp4` on your editing timeline at the beat's start time. Voice-over continues underneath on your audio track.

## What ships preconfigured

The workspace has opinionated defaults that have been validated across many videos:

- **Canvas:** three aspect-ratio presets (wide / vertical / square) — pick at scaffold time
- **SAFE-area insets:** baked-in margins so vertical content doesn't get covered by TikTok/Reels UI overlays
- **Type:** Inter (heavy weight headlines, semibold uppercase eyebrows)
- **Accent color:** cyan `#22D3EE` on a deep-charcoal background with a subtle aurora glow
- **No end-of-segment fade-outs** — hard cuts; your editor handles transitions
- **Suspense rule:** when a beat could spoil the answer (e.g. which model wins), blur the identifiers — and use the *same* placeholder text on both sides, or the silhouettes leak the answer
- **Composition IDs use hyphens, never underscores** (`Beat03-Scoreboard`) — Remotion CLI / studio require this
- **Render output:** `.mp4` h.264 by default (universal, plays everywhere); ProRes 4444 `.mov` documented for alpha overlays

The full list lives in [`CLAUDE.md`](./CLAUDE.md). Override any of them per-project — your project's own `CLAUDE.md` (created from `_template/CLAUDE.md`) is where deviations belong.

## Why each video is its own folder

Every video gets its own `node_modules` and locks its own Remotion version. A Remotion upgrade for a new project can't break an old render. Old work stays reproducible forever.

## Asking for help

Members: post in the AWA PRO Skool community.

## License

MIT — fork, modify, ship videos.
