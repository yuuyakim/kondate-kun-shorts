import React from "react";
import { Composition } from "remotion";
import { WeeklyMemo } from "./WeeklyMemo";
import { VIDEO } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="WeeklyMemo"
    component={WeeklyMemo}
    durationInFrames={VIDEO.durationInFrames}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
