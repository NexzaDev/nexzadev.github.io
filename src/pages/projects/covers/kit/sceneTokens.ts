import type { CSSProperties } from "react";
import { BG_PRIMARY, MONO_FONT } from "@/constants/theme";
import { sceneDriver } from "@utils/sceneClock";

export interface TintProps {
   tint: string;
}

export { BG_PRIMARY as INK } from "@/constants/theme";
export const BASE_GRADIENT = `linear-gradient(160deg, #101626 0%, ${BG_PRIMARY} 60%)`;

export const PANEL_SOLID = "#0f1522";
export const W03 = "rgba(255,255,255,0.03)";
export const W06 = "rgba(255,255,255,0.06)";
export const W10 = "rgba(255,255,255,0.10)";
export const W16 = "rgba(255,255,255,0.16)";
export const W25 = "rgba(255,255,255,0.25)";
export const W40 = "rgba(255,255,255,0.4)";
export const W55 = "rgba(255,255,255,0.55)";
export const W70 = "rgba(255,255,255,0.7)";
export const NON_SCALING = "non-scaling-stroke";
export const STAGE_W = 320;
export const STAGE_H = 200;

export type Pt = readonly [number, number];
export type Box = readonly [x: number, y: number, w: number, h: number];

const round2 = (v: number) => Math.round(v * 100) / 100;

export const pct = (v: number, span: number, round = false) => {
   const p = (v / span) * 100;
   return `${round ? round2(p) : p}%`;
};

export const pctX = (x: number) => pct(x, STAGE_W, true);
export const pctY = (y: number) => pct(y, STAGE_H, true);

export const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const layer: CSSProperties = { position: "absolute", inset: 0 };

const HAIR = "rgba(255,255,255,0.045)";
export const DOTS: CSSProperties = {
   backgroundImage:
      "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1.4px)",
   backgroundSize: "16px 16px",
};
export const GRID: CSSProperties = {
   backgroundImage: `linear-gradient(${HAIR} 1px, transparent 1px), linear-gradient(90deg, ${HAIR} 1px, transparent 1px)`,
   backgroundSize: "20px 20px",
};
export const RAILS: CSSProperties = {
   backgroundImage: `linear-gradient(${HAIR} 1px, transparent 1px)`,
   backgroundSize: "100% 18px",
};
export const COLUMNS: CSSProperties = {
   backgroundImage: `linear-gradient(90deg, ${HAIR} 1px, transparent 1px)`,
   backgroundSize: "22px 100%",
};

export const label: CSSProperties = {
   position: "absolute",
   fontFamily: MONO_FONT,
   fontSize: 8,
   fontWeight: 700,
   letterSpacing: 0.9,
   lineHeight: 1,
   textTransform: "uppercase",
   whiteSpace: "nowrap",
};

export const dotAt = (at: Pt, size: number, color: string): CSSProperties => ({
   position: "absolute",
   left: pctX(at[0]),
   top: pctY(at[1]),
   width: size,
   height: size,
   marginLeft: -size / 2,
   marginTop: -size / 2,
   borderRadius: "50%",
   background: color,
});

type Ease = "linear" | "easeInOut";

interface Tracks {
   x?: (number | string)[];
   y?: (number | string)[];
   opacity?: number[];
   scale?: number[];
   scaleX?: number[];
   pathLength?: number[];
   pathOffset?: number[];
}

export interface Loop extends Tracks {
   duration: number;
   times: number[];
   ease?: Ease;
}

export type Keys = Omit<Loop, "duration">;

export const loopProps = ({
   duration,
   times,
   ease = "easeInOut",
   ...animate
}: Loop) => ({
   animate,
   transition: {
      duration,
      times,
      ease: times.slice(1).map(() => ease),
      repeat: Infinity,
      driver: sceneDriver,
   },
});

export const clock =
   (duration: number) =>
   (keys: Keys): Loop => ({ ...keys, duration });

export const shown = (on: number, off: number, ramp = 0.03): Keys => ({
   times: [0, on, on + ramp, off - ramp, off, 1],
   opacity: [0, 0, 1, 1, 0, 0],
});

export const backAtFor =
   (clear: readonly number[]) =>
   (at: number, ramp = 0.04): Keys => ({
      times: [0, ...clear, at, at + ramp, 1],
      opacity: [1, 1, 0, 0, 1, 1],
   });

export type Cubic = readonly [Pt, Pt, Pt, Pt];

const mix = (a: Pt, b: Pt, f: number): Pt => [
   a[0] + (b[0] - a[0]) * f,
   a[1] + (b[1] - a[1]) * f,
];

export const sCurve = (a: Pt, b: Pt): Cubic => {
   const k = (b[0] - a[0]) / 2;
   return [a, [a[0] + k, a[1]], [b[0] - k, b[1]], b];
};

export const line = (a: Pt, b: Pt): Cubic => [
   a,
   mix(a, b, 1 / 3),
   mix(a, b, 2 / 3),
   b,
];

const fmt = ([x, y]: Pt) => `${round2(x)},${round2(y)}`;
export const curveD = ([a, c1, c2, b]: Cubic) =>
   `M${fmt(a)}C${fmt(c1)} ${fmt(c2)} ${fmt(b)}`;

const bezier = ([a, c1, c2, b]: Cubic, t: number): Pt => {
   const u = 1 - t;
   const w0 = u * u * u;
   const w1 = 3 * u * u * t;
   const w2 = 3 * u * t * t;
   const w3 = t * t * t;
   return [
      w0 * a[0] + w1 * c1[0] + w2 * c2[0] + w3 * b[0],
      w0 * a[1] + w1 * c1[1] + w2 * c2[1] + w3 * b[1],
   ];
};

const TABLE = 48;

const measure = (c: Cubic) => {
   const pts = Array.from({ length: TABLE + 1 }, (_, i) =>
      bezier(c, i / TABLE),
   );
   const acc = [0];
   for (let i = 1; i <= TABLE; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      acc.push(acc[i - 1] + Math.hypot(x1 - x0, y1 - y0));
   }
   const length = acc[TABLE];
   const at = (f: number): Pt => {
      const target = f * length;
      let i = 1;
      while (i < TABLE && acc[i] < target) i++;
      const span = acc[i] - acc[i - 1] || 1;
      return mix(pts[i - 1], pts[i], (target - acc[i - 1]) / span);
   };
   return { length, at };
};

export interface Route {
   d: string;

   ends: number[];
   at: (s: number) => Pt;
}

export const route = (...segs: Cubic[]): Route => {
   const parts = segs.map(measure);
   const total = parts.reduce((sum, p) => sum + p.length, 0);
   const ends: number[] = [];
   let run = 0;
   for (const p of parts) {
      run += p.length;
      ends.push(run / total);
   }
   const at = (s: number): Pt => {
      let i = ends.findIndex((end) => s <= end);
      if (i === -1) i = ends.length - 1;
      const start = i === 0 ? 0 : ends[i - 1];
      return parts[i].at((s - start) / (ends[i] - start || 1));
   };
   const tail = segs
      .slice(1)
      .map(([, c1, c2, b]) => `C${fmt(c1)} ${fmt(c2)} ${fmt(b)}`)
      .join("");
   return { d: curveD(segs[0]) + tail, ends, at };
};

export type Stop = readonly [t: number, s: number];

interface Sample {
   t: number;
   s: number;
}

const SAMPLES = 6;
const easeInOut = (u: number) =>
   u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;

const sampleStops = (stops: readonly Stop[]): Sample[] => {
   const out: Sample[] = [{ t: stops[0][0], s: stops[0][1] }];
   for (let i = 1; i < stops.length; i++) {
      const [t0, s0] = stops[i - 1];
      const [t1, s1] = stops[i];
      const n = s0 === s1 ? 1 : SAMPLES;
      for (let j = 1; j <= n; j++) {
         out.push({
            t: t0 + ((t1 - t0) * j) / n,
            s: s0 + (s1 - s0) * easeInOut(j / n),
         });
      }
   }
   return out;
};

export const passAt = ([t0, s0]: Stop, [t1, s1]: Stop, s: number): number => {
   const goal = (s - s0) / (s1 - s0);
   let lo = 0;
   let hi = 1;
   for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (easeInOut(mid) < goal) lo = mid;
      else hi = mid;
   }
   return t0 + ((t1 - t0) * (lo + hi)) / 2;
};

export const FADE = 0.025;

export const ride = (r: Route, stops: readonly Stop[]): Keys => {
   const path = sampleStops(stops);
   const first = path[0];
   const last = path.at(-1) ?? first;
   const frames = [
      { t: 0, s: first.s, o: 0 },
      { t: first.t - FADE, s: first.s, o: 0 },
      ...path.map((p) => ({ ...p, o: 1 })),
      { t: last.t + FADE, s: last.s, o: 0 },
      { t: 1, s: first.s, o: 0 },
   ];
   return {
      times: frames.map((f) => f.t),
      x: frames.map((f) => pctX(r.at(f.s)[0])),
      y: frames.map((f) => pctY(r.at(f.s)[1])),
      opacity: frames.map((f) => f.o),
      ease: "linear",
   };
};

export const comet = (stops: readonly Stop[], len = 0.1): Keys => {
   const path = sampleStops(stops);
   let from = path[0].s;
   const dash = path.map((p, i) => {
      const prev = i === 0 ? p.s : path[i - 1].s;
      if (p.s === prev) from = p.s;
      const run = Math.min(len, Math.abs(p.s - from));
      return { t: p.t, length: run, offset: p.s > from ? p.s - run : p.s };
   });
   const home = path[0].s;
   const last = path.at(-1) ?? path[0];

   const frames = [
      { t: 0, length: 0, offset: home, o: 0 },
      ...dash.map((d) => ({ ...d, o: 1 })),
      { t: last.t + FADE, length: 0, offset: last.s, o: 0 },
      { t: 1, length: 0, offset: home, o: 0 },
   ];
   return {
      times: frames.map((f) => f.t),
      pathLength: frames.map((f) => f.length),
      pathOffset: frames.map((f) => f.offset),
      opacity: frames.map((f) => f.o),
      ease: "linear",
   };
};

export const lit = (stops: readonly Stop[], hold: number): Keys => {
   const path = sampleStops(stops);
   let reach = 0;
   const grown = path.map((p) => {
      reach = Math.max(reach, p.s);
      return { t: p.t, length: reach };
   });
   const frames = [
      { t: 0, length: 0, o: 0 },
      ...grown.map((g) => ({ ...g, o: 1 })),
      { t: hold, length: reach, o: 1 },
      { t: hold + FADE, length: reach, o: 0 },
      { t: 1, length: 0, o: 0 },
   ];
   return {
      times: frames.map((f) => f.t),
      pathLength: frames.map((f) => f.length),
      opacity: frames.map((f) => f.o),
      ease: "linear",
   };
};
