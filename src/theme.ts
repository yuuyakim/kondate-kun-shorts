/**
 * 献立くん ショート動画のデザイントークン。
 * shorts/01-weekly-memo.html の CSS 変数と同じ値を持つ。
 */

export const color = {
  /** 夜の台所 */
  yoru: "#101828",
  /** 藍 */
  ai: "#1B2E4A",
  /** 菜の花。唯一の強いアクセント */
  nanohana: "#FFC93C",
  /** 生成り。紙 */
  kinari: "#FAF6EC",
  /** 墨。紙の上の文字 */
  sumi: "#1F2530",
  /** 浅葱。弱い情報 */
  asagi: "#86A9C4",
  /** 朱。打ち消しと強調 */
  shu: "#C9452A",
} as const;

/**
 * すべて Windows 標準の同梱書体。追加インストールは要らない。
 *
 * ⚠️ Linux や CI で描画すると豆腐になる。
 *    その環境で回すなら @remotion/google-fonts などで読み込むこと。
 */
export const font = {
  /** 見出し。焦りの質感 */
  display: '"Noto Sans JP Black","Noto Sans JP","游ゴシック",sans-serif',
  /** 献立名。手で書いた献立表の質感 */
  memo: '"UD デジタル 教科書体 NP","UD デジタル 教科書体 N",serif',
  /** ラベル・数字 */
  util: '"BIZ UDPゴシック","BIZ UDPGothic","Yu Gothic UI",sans-serif',
} as const;

/**
 * TikTok / Instagram のUIが被る範囲。文字は必ずこの内側に置く。
 */
export const safe = {
  left: 90,
  right: 90,
  top: 240,
  bottom: 360,
} as const;

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 450, // 15.0s
} as const;
