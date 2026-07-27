import { describe, expect, it } from "vitest";
import { nextCode, nextId, yearOf } from "./codes";
import { formatCurrency } from "./mock-data";

describe("nextCode", () => {
  it("同一年の最大連番+1を3桁ゼロ埋めで返す", () => {
    expect(nextCode("P", 2026, ["P-2026-003", "P-2026-011", "P-2026-002"])).toBe(
      "P-2026-012"
    );
  });

  it("他の年のコードは無視する", () => {
    expect(nextCode("P", 2026, ["P-2025-099", "P-2026-001"])).toBe("P-2026-002");
  });

  it("該当年のコードが無ければ001から始まる", () => {
    expect(nextCode("C", 2027, ["C-2026-017"])).toBe("C-2027-001");
  });

  it("別プレフィックスのコードは無視する", () => {
    expect(nextCode("Q", 2026, ["P-2026-015", "Q-2026-020"])).toBe("Q-2026-021");
  });

  it("末尾に文字が付く不規則コード(Q-2026-016b)も数値部分で解釈する", () => {
    expect(nextCode("Q", 2026, ["Q-2026-016b", "Q-2026-002"])).toBe("Q-2026-017");
  });
});

describe("nextId", () => {
  it("最大の数値サフィックス+1を返す", () => {
    expect(nextId("pj", ["pj-1", "pj-15", "pj-3"])).toBe("pj-16");
  });

  it("空配列なら1から始まる", () => {
    expect(nextId("cu", [])).toBe("cu-1");
  });
});

describe("yearOf", () => {
  it("日付文字列から年を取り出す", () => {
    expect(yearOf("2026-07-28")).toBe(2026);
    expect(yearOf("2025-12-31")).toBe(2025);
  });
});

describe("formatCurrency", () => {
  it("円記号と3桁区切りで整形する", () => {
    expect(formatCurrency(32000000)).toBe("¥32,000,000");
    expect(formatCurrency(0)).toBe("¥0");
  });
});
