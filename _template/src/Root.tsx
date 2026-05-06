import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./theme";

/**
 * Each graphic is its own <Composition>. Render any of three ways:
 *
 *   1. Click the render button in Remotion Studio (browser, no terminal)
 *   2. Ask Claude Code: "render Beat01-Intro for me"
 *   3. CLI:  npx remotion render <id> "out/<name>.mp4" --codec=h264 --crf=18
 *
 * Composition IDs must match [a-zA-Z0-9-]+ (use hyphens, never underscores).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Add <Composition> entries here as segments are built. */}
      <Composition
        id="Placeholder"
        component={() => null}
        durationInFrames={60}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
