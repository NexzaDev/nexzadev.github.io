import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
   BG_CARD,
   BG_PRIMARY,
   TEXT_MUTED,
   TEXT_PRIMARY,
   TEXT_SECONDARY,
} from "@/constants/theme";

const css = readFileSync("src/index.css", "utf8");

const linearChannel = (value) => {
   const channel = value / 255;
   return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
   const channels = [1, 3, 5].map((index) =>
      Number.parseInt(hex.slice(index, index + 2), 16),
   );
   return (
      linearChannel(channels[0]) * 0.2126 +
      linearChannel(channels[1]) * 0.7152 +
      linearChannel(channels[2]) * 0.0722
   );
};

const contrast = (foreground, background) => {
   const first = luminance(foreground);
   const second = luminance(background);
   return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
};

describe("midnight-ink palette", () => {
   it("uses the requested background and text tokens", () => {
      expect(BG_PRIMARY).toBe("#080b13");
      expect(BG_CARD).toBe("#0d121d");
      expect(TEXT_PRIMARY).toBe("#f3f6fb");
      expect(TEXT_SECONDARY).toBe("#a3aec2");
      expect(TEXT_MUTED).toBe("#8d99ae");
      expect(css).toContain("--color-bg-secondary: #0c111b;");
      expect(css).toContain("--color-bg-tertiary: #0f1522;");
      expect(css).toContain("--color-bg-card-hover: #131a2a;");
      expect(css).toContain("--color-border: #1b2438;");
      expect(css).toContain("--color-border-hover: #2c3957;");
   });

   it("keeps text contrast at WCAG AA for the page and card surfaces", () => {
      const foregrounds = [TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED];
      const backgrounds = [BG_PRIMARY, BG_CARD];
      for (const foreground of foregrounds) {
         for (const background of backgrounds) {
            expect(contrast(foreground, background)).toBeGreaterThanOrEqual(
               4.5,
            );
         }
      }
   });
});
