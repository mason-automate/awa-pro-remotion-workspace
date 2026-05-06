import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const inter = loadInter();

export const VIDEO = {
  width: 3840,
  height: 2160,
  fps: 60,
} as const;

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
