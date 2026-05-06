import React from "react";
import { AbsoluteFill } from "remotion";
import { COLOR } from "../theme";

/**
 * Shared background for full-frame graphics.
 * Deep charcoal base with a soft cyan aurora glow and a faint grid.
 */
export const Background: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.bgDeep }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 75% 20%, ${COLOR.bgGradientStart} 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 15% 85%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)`,
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${COLOR.border} 1px, transparent 1px), linear-gradient(90deg, ${COLOR.border} 1px, transparent 1px)`,
          backgroundSize: "160px 160px",
          opacity: 0.35,
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
