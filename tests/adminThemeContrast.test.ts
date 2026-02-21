import { describe, expect, test } from "vitest";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

function linearize(v: number): number {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  const [rl, gl, bl] = [linearize(r), linearize(g), linearize(b)];
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(fg: string, bg: string): number {
  const [light, dark] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

describe("Wagtail admin theme contrast", () => {
  test("component text/control pairs meet contrast thresholds", () => {
    const checks: Array<[string, string, string, number]> = [
      ["header search text", "#112743", "#ffffff", 4.5],
      ["header search placeholder", "#58708f", "#ffffff", 4.5],
      ["filter input text", "#123252", "#ffffff", 4.5],
      ["selected row text", "#0f2741", "#cddff5", 4.5],
      ["hover row text", "#6e4f00", "#dbe8f8", 4.5],
      ["checkbox border", "#1f4a75", "#ffffff", 3.0],
      ["active gold on blue header", "#ffbf00", "#022851", 4.5],
    ];

    for (const [label, fg, bg, min] of checks) {
      const ratio = contrastRatio(fg, bg);
      expect(
        ratio,
        `${label} contrast ${ratio.toFixed(2)} should be >= ${min.toFixed(2)}`,
      ).toBeGreaterThanOrEqual(min);
    }
  });
});
