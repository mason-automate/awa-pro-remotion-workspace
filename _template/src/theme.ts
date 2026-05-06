import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const inter = loadInter();

// === Aspect ratio ===
// Pick one of: "wide" | "vertical" | "square".
// The /new-remotion-project skill sets this at scaffold time. Flip manually if you want to change later.
export const ASPECT: "wide" | "vertical" | "square" = "wide";

const ASPECT_PRESETS = {
  // 16:9 — YouTube / web. 4K renders downsample cleanly to 1080p.
  wide: { width: 3840, height: 2160, fps: 60 },
  // 9:16 — TikTok / Reels / Shorts.
  vertical: { width: 1080, height: 1920, fps: 60 },
  // 1:1 — Instagram feed.
  square: { width: 1080, height: 1080, fps: 60 },
} as const;

// Keep critical text and graphics inside SAFE on every composition.
// Vertical insets account for TikTok/Reels overlay UI (caption row top, share/like/comment column right, captions bottom).
const SAFE_AREA_PRESETS = {
  vertical: { x: 130, top: 220, bottom: 320 },
  wide: { x: 120, top: 80, bottom: 80 },
  square: { x: 80, top: 80, bottom: 80 },
} as const;

export const VIDEO = ASPECT_PRESETS[ASPECT];
export const SAFE = SAFE_AREA_PRESETS[ASPECT];

export const COLOR = {
  // Background
  bgDeep: "#07070A",
  bgLift: "#0E0E14",
  bgGradientStart: "#0C2A33",
  bgGradientEnd: "#07070A",
  // Surfaces
  surface: "rgba(255, 255, 255, 0.03)",
  surfaceElevated: "rgba(255, 255, 255, 0.06)",
  border: "rgba(255, 255, 255, 0.08)",
  borderBright: "rgba(255, 255, 255, 0.14)",
  // Text
  textPrimary: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textMuted: "#64748B",
  textDim: "#334155",
  // Accents
  accent: "#22D3EE",
  accentBright: "#67E8F9",
  accentDeep: "#0E7490",
  accentGlow: "rgba(34, 211, 238, 0.35)",
  success: "#34D399",
  warn: "#F87171",
} as const;

export const FONT = {
  family: inter.fontFamily,
  weightRegular: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,
  weightHeavy: 900,
} as const;
