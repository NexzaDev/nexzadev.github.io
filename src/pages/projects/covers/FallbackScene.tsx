import type { CSSProperties } from "react";
import { BLUE_LIGHT, GREEN, GOLD } from "@/constants/theme";
import type { TintProps } from "./kit/sceneTokens";

const NODES = [
   { x: 82, y: 112, color: BLUE_LIGHT },
   { x: 143, y: 67, color: GREEN },
   { x: 184, y: 128, color: GOLD },
   { x: 240, y: 70, color: BLUE_LIGHT },
   { x: 284, y: 135, color: GREEN },
];

const STAGE_STYLE: CSSProperties = {
   position: "absolute",
   inset: 0,
   width: "100%",
   height: "100%",
};

const FallbackScene = ({ tint }: TintProps) => (
   <div
      aria-hidden="true"
      style={{
         position: "absolute",
         inset: 0,
         overflow: "hidden",
         background: `radial-gradient(ellipse at 72% 22%, ${tint}26, transparent 46%), linear-gradient(145deg, #121b30, #080b13 72%)`,
      }}
   >
      <svg viewBox="0 0 360 225" preserveAspectRatio="none" style={STAGE_STYLE}>
         <defs>
            <pattern
               id="fallback-grid"
               width="18"
               height="18"
               patternUnits="userSpaceOnUse"
            >
               <path
                  d="M18 0H0V18"
                  fill="none"
                  stroke="#80b7d0"
                  strokeOpacity=".07"
                  strokeWidth=".6"
               />
            </pattern>
            <filter
               id="fallback-glow"
               x="-100%"
               y="-100%"
               width="300%"
               height="300%"
            >
               <feGaussianBlur stdDeviation="4" result="blur" />
               <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
               </feMerge>
            </filter>
         </defs>
         <rect width="360" height="225" fill="url(#fallback-grid)" />
         <path
            d="M82 112 143 67 184 128 240 70 284 135M143 67 240 70M82 112 184 128 284 135"
            fill="none"
            stroke="#71afd0"
            strokeOpacity=".35"
            strokeWidth="1.5"
         />
         {NODES.map(({ x, y, color }) => (
            <g key={`${x}-${y}`}>
               <circle cx={x} cy={y} r="17" fill="#101a2b" fillOpacity=".9" />
               <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="#111b30"
                  stroke={color}
                  strokeOpacity=".76"
                  strokeWidth="1.2"
               />
               <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={color}
                  filter="url(#fallback-glow)"
               />
            </g>
         ))}
      </svg>
   </div>
);

export default FallbackScene;
