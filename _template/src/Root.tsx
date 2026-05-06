import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./theme";

/**
 * Each graphic is its own <Composition>. Render with:
 *
 *   npx remotion render <id> "out/<name>.mov" \
 *     --codec=prores --prores-profile=hq
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
