import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { color, font, safe, VIDEO } from "./theme";
import { prog, rise, sec, swipe, write } from "./timeline";
import {
  distinctCount,
  MENU_MASTER_COUNT,
  topItems,
  totalOccurrences,
  week,
} from "./data/week-01";

/* ============================================================
   構成（秒）
     0.0 – 2.4   フック
     2.4 – 3.0   メモが落ちてマグネットで留まる
     3.0 – 6.3   月〜日が0.42秒間隔で書かれていく
     6.4 – 7.6   7日分、10秒で。
     7.6 – 12.0  買い物リストが重なる
    12.0 – 15.0  締め
   ============================================================ */

const ROW_START = 3.0;
const ROW_STEP = 0.42;

// ---------------------------------------------------------------- 背景
const Kitchen: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `
        radial-gradient(120% 70% at 50% 8%, #24405f 0%, transparent 60%),
        radial-gradient(90% 50% at 50% 100%, #16233a 0%, transparent 70%),
        ${color.yoru}`,
    }}
  >
    {/* 夕方の窓明かりの粒子感 */}
    <AbsoluteFill
      style={{
        opacity: 0.5,
        backgroundImage:
          "radial-gradient(rgba(255,255,255,.055) 1px, transparent 1px)",
        backgroundSize: "3px 3px",
      }}
    />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 1. フック
const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = prog(frame, 0, 0.5);
  const out = prog(frame, 2.15, 0.45);
  const opacity = Math.min(fadeIn, 1 - out);

  const line: React.CSSProperties = {
    fontFamily: font.display,
    fontWeight: 900,
    fontSize: 96,
    lineHeight: 1.3,
    color: "#fff",
    letterSpacing: ".005em",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${-out * 46}px) scale(${1 - out * 0.06})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ ...line, ...rise(frame, 0.08) }}>「今日なに作る」に、</div>
      <div style={{ ...line, marginTop: 10, ...rise(frame, 0.3) }}>
        毎晩
        <span style={{ color: color.nanohana, position: "relative" }}>
          10分
          <div
            style={{
              position: "absolute",
              left: -6,
              right: -6,
              bottom: -16,
              height: 9,
              borderRadius: 6,
              background: color.nanohana,
              ...swipe(frame, 0.95),
            }}
          />
        </span>
        。
      </div>
      <div
        style={{
          marginTop: 74,
          fontFamily: font.util,
          fontSize: 38,
          letterSpacing: ".16em",
          color: color.asagi,
          ...rise(frame, 1.35),
        }}
      >
        共働き・平日の夕方
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2-3. メモ
const Memo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drop = spring({
    frame: frame - sec(2.4),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 300,
        width: 900,
        boxSizing: "border-box",
        background: color.kinari,
        borderRadius: 4,
        padding: "64px 62px 58px",
        boxShadow: "0 44px 90px rgba(0,0,0,.55), 0 6px 0 rgba(0,0,0,.18)",
        // 下端がわずかにたわむ
        clipPath:
          "polygon(0 0, 100% 0, 100% calc(100% - 14px), 50% 100%, 0 calc(100% - 14px))",
        opacity: prog(frame, 2.4, 0.2),
        transform: `translateY(${interpolate(drop, [0, 1], [-190, 0])}px) rotate(${interpolate(drop, [0, 1], [-1.4, -0.5])}deg)`,
      }}
    >
      <Magnet side="left" />
      <Magnet side="right" />

      {/* レターヘッド = ブランド。タイトルカードを作らず、ここで12秒間見せ続ける */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          borderBottom: "3px solid rgba(31,37,48,.16)",
          paddingBottom: 26,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontFamily: font.memo,
            fontSize: 52,
            fontWeight: 700,
            color: color.sumi,
            letterSpacing: ".04em",
          }}
        >
          献立<span style={{ color: color.shu }}>くん</span>
        </div>
        <div style={{ fontFamily: font.util, fontSize: 26, color: "#8a8578", letterSpacing: ".1em" }}>
          今週のこんだて
        </div>
      </div>

      {week.map((dish, i) => (
        <Row key={dish.day} dish={dish} start={ROW_START + i * ROW_STEP} />
      ))}
    </div>
  );
};

const Magnet: React.FC<{ side: "left" | "right" }> = ({ side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - sec(2.86),
    fps,
    config: { damping: 10, mass: 0.4 },
  });
  return (
    <div
      style={{
        position: "absolute",
        top: -20,
        [side]: 96,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background:
          side === "left"
            ? "radial-gradient(circle at 34% 30%, #ff8f6b, #c9452a 70%)"
            : "radial-gradient(circle at 34% 30%, #8fd6e6, #2b7f99 70%)",
        boxShadow: "0 8px 18px rgba(0,0,0,.5)",
        opacity: s,
        transform: `scale(${s})`,
      }}
    />
  );
};

const Row: React.FC<{ dish: (typeof week)[number]; start: number }> = ({ dish, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chip = spring({
    frame: frame - sec(start),
    fps,
    config: { damping: 9, mass: 0.35 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
        padding: "19px 0",
        borderBottom: "2px solid rgba(31,37,48,.09)",
      }}
    >
      <div
        style={{
          fontFamily: font.util,
          fontSize: 34,
          fontWeight: 700,
          color: "#fff",
          background: color.ai,
          width: 64,
          height: 64,
          flex: "none",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: chip,
          transform: `scale(${chip})`,
        }}
      >
        {dish.day}
      </div>
      <div
        style={{
          fontFamily: font.memo,
          fontSize: 56,
          fontWeight: 700,
          color: color.sumi,
          letterSpacing: ".02em",
          whiteSpace: "nowrap",
          ...write(frame, start),
        }}
      >
        {dish.name}
      </div>
      <div
        style={{
          marginLeft: "auto",
          fontFamily: font.util,
          fontSize: 25,
          color: "#a09a8c",
          letterSpacing: ".08em",
          flex: "none",
          ...write(frame, start + 0.12, 0.3),
        }}
      >
        {dish.genre}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 4. 中打ち
const Punch: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, 6.35, 0.5);
  const out = prog(frame, 7.55, 0.4);
  return (
    <div
      style={{
        position: "absolute",
        left: safe.left,
        right: safe.right,
        top: 1330,
        textAlign: "center",
        opacity: Math.min(p, 1 - out),
        transform: `translateY(${(1 - p) * 34}px)`,
      }}
    >
      <span style={{ fontFamily: font.display, fontWeight: 900, fontSize: 76, color: "#fff", letterSpacing: ".02em" }}>
        7日分、<span style={{ color: color.nanohana }}>10秒</span>で。
      </span>
    </div>
  );
};

// ---------------------------------------------------------------- 5. 買い物リスト
const Cart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slide = spring({
    frame: frame - sec(7.6),
    fps,
    config: { damping: 16, mass: 0.8, stiffness: 110 },
  });
  const pop = spring({
    frame: frame - sec(8.9),
    fps,
    config: { damping: 10, mass: 0.4 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 980,
        width: 900,
        boxSizing: "border-box",
        background: color.kinari,
        borderRadius: 4,
        padding: "52px 56px 46px",
        boxShadow: "0 -30px 80px rgba(0,0,0,.6)",
        opacity: prog(frame, 7.6, 0.2),
        transform: `translateY(${interpolate(slide, [0, 1], [240, 0])}px) rotate(${interpolate(slide, [0, 1], [1.2, 0.5])}deg)`,
      }}
    >
      <div
        style={{
          fontFamily: font.memo,
          fontSize: 44,
          fontWeight: 700,
          color: color.sumi,
          borderBottom: "3px solid rgba(31,37,48,.16)",
          paddingBottom: 22,
          marginBottom: 26,
        }}
      >
        買い物リスト
      </div>

      {/* 延べ31品 → 22品。どちらもデータから計算している */}
      <div style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 30 }}>
        <span
          style={{
            fontFamily: font.display,
            fontWeight: 900,
            fontSize: 96,
            lineHeight: 1,
            color: "#bdb6a6",
            position: "relative",
          }}
        >
          {totalOccurrences}
          <div
            style={{
              position: "absolute",
              left: -8,
              right: -8,
              top: "52%",
              height: 8,
              background: color.shu,
              borderRadius: 5,
              ...swipe(frame, 8.55, 0.34),
            }}
          />
        </span>
        <span style={{ fontSize: 52, color: "#bdb6a6", opacity: frame >= sec(8.75) ? 1 : 0 }}>→</span>
        <span
          style={{
            fontFamily: font.display,
            fontWeight: 900,
            fontSize: 96,
            lineHeight: 1,
            color: color.shu,
            opacity: pop,
            transform: `scale(${pop})`,
          }}
        >
          {distinctCount}
        </span>
        <span style={{ fontFamily: font.util, fontSize: 30, color: "#8a8578", alignSelf: "flex-end", marginBottom: 14 }}>
          品にまとまる
        </span>
      </div>

      {topItems.map((item, i) => {
        const p = prog(frame, 9.3 + i * 0.25, 0.34);
        return (
          <div
            key={item.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "15px 0",
              borderBottom: "2px solid rgba(31,37,48,.09)",
              opacity: p,
              transform: `translateX(${(1 - p) * -26}px)`,
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                flex: "none",
                border: `3px solid ${color.sumi}`,
                borderRadius: 7,
              }}
            />
            <span style={{ fontFamily: font.memo, fontSize: 46, fontWeight: 700, color: color.sumi }}>
              {item.name}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: font.util,
                fontSize: 31,
                fontWeight: 700,
                color: "#fff",
                background: item.count >= 3 ? color.shu : color.ai,
                borderRadius: 999,
                padding: "9px 22px",
                flex: "none",
              }}
            >
              {item.count}献立
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- 6. 締め
const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - sec(12.9),
    fps,
    config: { damping: 10, mass: 0.45 },
  });

  return (
    <AbsoluteFill
      style={{
        opacity: prog(frame, 12.0, 0.55),
        background: `linear-gradient(180deg, rgba(16,24,40,0) 0%, rgba(16,24,40,.97) 26%, ${color.yoru} 55%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: font.memo,
          fontSize: 120,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: ".06em",
          ...rise(frame, 12.25),
        }}
      >
        献立<span style={{ color: color.nanohana }}>くん</span>
      </div>
      <div
        style={{
          marginTop: 34,
          fontFamily: font.util,
          fontSize: 42,
          color: color.asagi,
          letterSpacing: ".1em",
          ...rise(frame, 12.55),
        }}
      >
        献立{MENU_MASTER_COUNT}種から、重複なしで1週間
      </div>
      <div
        style={{
          marginTop: 64,
          fontFamily: font.display,
          fontWeight: 900,
          fontSize: 46,
          color: color.yoru,
          background: color.nanohana,
          borderRadius: 999,
          padding: "26px 58px",
          opacity: pop,
          transform: `scale(${pop})`,
        }}
      >
        1食分の提案は、ずっと無料
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 合成
export const WeeklyMemo: React.FC = () => (
  <AbsoluteFill style={{ width: VIDEO.width, height: VIDEO.height, overflow: "hidden" }}>
    <Kitchen />
    <Hook />
    <Memo />
    <Punch />
    <Cart />
    <Ending />
  </AbsoluteFill>
);
