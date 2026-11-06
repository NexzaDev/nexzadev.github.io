export const BLUE = "#2563eb";
export const BLUE_LIGHT = "#60a5fa";
export const SKILL_ICON_COLOR = "#60a5fa";
export const SKILL_ICON_MODE: "uniform" | "brand" = "brand";
export const SKY = "#38bdf8";
export const BLUE_PALE = "#93c5fd";
export const GREEN = "#22c55e";
export const AMBER = "#f59e0b";
export const ORANGE = "#f97316";
export const RED = "#ef4444";

export const GOLD = "#e5b93c";
export const GOLD_LIGHT = "#f3d36b";
export const GOLD_DEEP = "#b8892a";

export const MEDAL_GOLD = "#fbbf24";
export const MEDAL_SILVER = "#94a3b8";
export const MEDAL_BRONZE = "#d97706";

export const TEXT_PRIMARY = "#f3f6fb";
export const TEXT_SECONDARY = "#a3aec2";

export const TEXT_MUTED = "#8d99ae";

export const BG_PRIMARY = "#080b13";
export const BG_CARD = "#0d121d";

export const GLASS_BORDER = "rgba(255, 255, 255, 0.08)";

export const MONO_FONT = "Geist Mono Variable, ui-monospace, monospace";

export const MAX_WIDTH = 1152;
export const MAX_WIDTH_NARROW = 960;
export const MAX_WIDTH_WIDE = 1024;
export const MAX_WIDTH_FORM = 896;

const BREAKPOINTS = {
   sm: 640,
   md: 768,
   lg: 1024,
   xl: 1280,
} as const;

export const MEDIA_QUERIES = {
   mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
   tablet: `(max-width: ${BREAKPOINTS.lg - 1}px)`,

   wide: `(min-width: ${BREAKPOINTS.xl}px)`,

   hover: "(hover: hover)",

   coarse: "(pointer: coarse)",
} as const;

export const EASING = {
   standard: [0.4, 0, 0.2, 1] as const,
   cinematic: [0.16, 1, 0.3, 1] as const,
   brisk: [0.25, 0.1, 0.25, 1] as const,
} as const;

export const DURATION = {
   quick: 0.25,
   default: 0.4,
   slow: 0.7,
} as const;

export const TOUCH_HIT_AREA: React.CSSProperties = {
   position: "absolute",
   top: "50%",
   left: "50%",
   width: "max(100%, 44px)",
   height: "max(100%, 44px)",
   transform: "translate(-50%, -50%)",
};

export const CHROME_BAR_STYLE: React.CSSProperties = {
   background: "rgb(var(--ch-bg-sec) / 0.8)",
   borderBottom: "1px solid rgb(var(--ch-white) / 0.06)",
   display: "flex",
   alignItems: "center",
};
