/**
 * 動画に出す1週間の献立。
 *
 * 献立名・ジャンル・食材は、すべて本体リポジトリのシードデータ由来。
 *   backend/db/seeds/menus.sql
 *   backend/db/seeds/menu_ingredients.sql
 *
 * 画面に出す数字（延べ何品 → 何品、玉ねぎ×4献立）は
 * このデータから計算する。手で書かないので、献立を差し替えても数字がズレない。
 */

export type Genre = "和食" | "洋食" | "中華";

export type Dish = {
  day: string;
  name: string;
  genre: Genre;
  ingredients: string[];
};

/**
 * 並びは spec.md 2.2 の重複回避ルールに従う。
 *   1. 同一献立が週内に2度出ない
 *   2. 同一ジャンルが3日以上連続しない
 * 現在: 和 中 洋 和 和 洋 和 → 最長2連続。
 */
export const week: Dish[] = [
  {
    day: "月",
    name: "豚の生姜焼き",
    genre: "和食",
    ingredients: ["豚ロース肉", "生姜", "玉ねぎ", "キャベツ"],
  },
  {
    day: "火",
    name: "麻婆豆腐",
    genre: "中華",
    ingredients: ["豆腐", "豚ひき肉", "ねぎ", "にんにく", "生姜"],
  },
  {
    day: "水",
    name: "ハンバーグ",
    genre: "洋食",
    ingredients: ["合いびき肉", "玉ねぎ", "卵", "牛乳"],
  },
  {
    day: "木",
    name: "鮭の塩焼き",
    genre: "和食",
    ingredients: ["鮭", "大根", "米"],
  },
  {
    day: "金",
    name: "鶏の唐揚げ",
    genre: "和食",
    ingredients: ["鶏もも肉", "生姜", "にんにく", "レモン"],
  },
  {
    day: "土",
    name: "カレーライス",
    genre: "洋食",
    ingredients: ["米", "牛肉", "玉ねぎ", "にんじん", "じゃがいも", "カレールウ"],
  },
  {
    day: "日",
    name: "肉じゃが",
    genre: "和食",
    ingredients: [
      "豚こま切れ肉",
      "じゃがいも",
      "にんじん",
      "玉ねぎ",
      "糸こんにゃく",
    ],
  },
];

export type ShoppingItem = {
  name: string;
  /** この食材を使う献立の数 */
  count: number;
};

/** 食材を名前でまとめ、使う献立の数が多い順に並べる */
export const shoppingList: ShoppingItem[] = (() => {
  const tally = new Map<string, number>();
  for (const dish of week) {
    for (const ing of dish.ingredients) {
      tally.set(ing, (tally.get(ing) ?? 0) + 1);
    }
  }
  return [...tally]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"));
})();

/** まとめる前の延べ品数 */
export const totalOccurrences = week.reduce(
  (n, d) => n + d.ingredients.length,
  0,
);

/** まとめた後の品数 */
export const distinctCount = shoppingList.length;

/** 買い物リストで実際に画面に出す上位4件 */
export const topItems = shoppingList.slice(0, 4);

/** 献立マスタの総数（menus.sql のコメントより。main 316 / side 42 / soup 22） */
export const MENU_MASTER_COUNT = 380;
