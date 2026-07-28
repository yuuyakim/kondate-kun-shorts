import { Easing, interpolate } from "remotion";
import { VIDEO } from "./theme";

/** 秒 → フレーム */
export const sec = (s: number) => s * VIDEO.fps;

/**
 * startSec から durSec かけて 0 → 1 に進む値。
 * CSS の animation-delay / duration をフレームに読み替えたもの。
 */
export const prog = (
  frame: number,
  startSec: number,
  durSec: number,
  easing = Easing.out(Easing.cubic),
) =>
  interpolate(frame, [sec(startSec), sec(startSec + durSec)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** 下から持ち上がりながら現れる。見出しの既定の入り方 */
export const rise = (frame: number, startSec: number, distance = 38) => {
  const p = prog(frame, startSec, 0.62);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  };
};

/** 左から書かれていくワイプ。ペンで書く動きに見せる */
export const write = (frame: number, startSec: number, durSec = 0.4) => {
  const p = prog(frame, startSec, durSec, Easing.bezier(0.35, 0.6, 0.2, 1));
  return { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` };
};

/** 横に伸びる線（下線・打ち消し線） */
export const swipe = (frame: number, startSec: number, durSec = 0.5) => ({
  transform: `scaleX(${prog(frame, startSec, durSec)})`,
  transformOrigin: "left center",
});
