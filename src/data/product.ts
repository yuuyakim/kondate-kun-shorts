/**
 * 動画の締めに出す、献立くん自体の情報。
 *
 * ⚠️ 価格は税込で持つこと。
 *    消費者向けに提示する価格には総額表示義務がある（spec.md 参照）。
 *    税抜だけを大きく出すのは不可。
 */

export const product = {
  name: "献立くん",
  url: "kondatekun.yuuyakim.com",
  /** 月額（税込・円） */
  premiumMonthlyYen: 300,
} as const;

/** 無料でできること（spec.md 2.1） */
export const FREE_LINE = "1食分の提案は無料";

/** プレミアムでできること（spec.md 2.2 / 2.8 / 2.11） */
export const PREMIUM_LINE = `1週間分は月${product.premiumMonthlyYen}円（税込）`;
