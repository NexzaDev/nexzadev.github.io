import { motion } from "motion/react";
import type { Easing } from "motion/react";
import useMotionPreference from "@hooks/useMotionPreference";

const EASE_IN_OUT: Easing = "easeInOut";

const GLOW_EASE: Easing[] = [EASE_IN_OUT, EASE_IN_OUT];

const drift = (from: string, to: string) => ({ transform: [from, to, from] });

const BEAM_TILT = 24;
const BEAM_TIMES = [0, 0.1, 0.9, 1];
const beamAt = (vw: number) => `translateX(${vw}vw) rotate(${BEAM_TILT}deg)`;
const BEAM_SWEEP = [0, 14, 126, 140].map(beamAt);

const glowStyle = {
   position: "absolute",
   borderRadius: "50%",
} as const;

const AmbientBackground = () => {
   const { preference, reducedMotion } = useMotionPreference();

   return (
      <div
         key={preference}
         aria-hidden="true"
         style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            overflow: "hidden",
            background: "var(--color-bg-primary)",
         }}
      >
         <div
            style={{
               position: "absolute",
               inset: 0,
               backgroundImage:
                  "radial-gradient(rgb(var(--ch-white) / 0.04) 1px, transparent 1px)",
               backgroundSize: "28px 28px",
               maskImage:
                  "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)",
               WebkitMaskImage:
                  "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)",
            }}
         />

         <motion.div
            style={{
               ...glowStyle,
               top: "-30%",
               left: "50%",
               width: 1100,
               height: 800,
               marginLeft: -550,
               background:
                  "radial-gradient(ellipse at center, rgb(var(--ch-blue) / 0.14), rgb(var(--ch-sky) / 0.05) 40%, transparent 75%)",
            }}
            animate={
               reducedMotion
                  ? undefined
                  : drift(
                       "translate(-80px, 0px) scale(1)",
                       "translate(80px, 40px) scale(1.08)",
                    )
            }
            transition={{ duration: 26, repeat: Infinity, ease: GLOW_EASE }}
         />

         <motion.div
            style={{
               ...glowStyle,
               bottom: "-35%",
               right: "-15%",
               width: 900,
               height: 700,
               background:
                  "radial-gradient(ellipse at center, rgb(37 99 235 / 0.10), transparent 70%)",
            }}
            animate={
               reducedMotion
                  ? undefined
                  : drift("translate(40px, 20px)", "translate(-60px, -30px)")
            }
            transition={{ duration: 32, repeat: Infinity, ease: GLOW_EASE }}
         />

         <motion.div
            style={{
               ...glowStyle,
               bottom: "-25%",
               left: "-15%",
               width: 700,
               height: 600,
               background:
                  "radial-gradient(ellipse at center, rgb(var(--ch-blue) / 0.07), transparent 70%)",
            }}
            animate={
               reducedMotion
                  ? undefined
                  : drift("translate(30px, -20px)", "translate(-40px, 30px)")
            }
            transition={{ duration: 40, repeat: Infinity, ease: GLOW_EASE }}
         />

         <motion.div
            style={{
               position: "absolute",
               top: "-10%",
               left: "-20%",
               width: 1,
               height: "130%",
               background:
                  "linear-gradient(180deg, transparent, rgb(var(--ch-blue-light) / 0.35) 30%, rgb(var(--ch-blue-light) / 0.35) 70%, transparent)",
               rotate: BEAM_TILT,
               transformOrigin: "top center",
               opacity: reducedMotion ? 0 : undefined,
            }}
            animate={
               reducedMotion
                  ? undefined
                  : { transform: BEAM_SWEEP, opacity: [0, 0.9, 0.9, 0] }
            }
            transition={{
               duration: 14,
               repeat: Infinity,
               ease: "linear",
               times: BEAM_TIMES,
            }}
         />

         <motion.div
            style={{
               position: "absolute",
               top: "-10%",
               left: "-20%",
               width: 1,
               height: "130%",
               background:
                  "linear-gradient(180deg, transparent, rgb(var(--ch-sky) / 0.22) 30%, rgb(var(--ch-sky) / 0.22) 70%, transparent)",
               rotate: BEAM_TILT,
               transformOrigin: "top center",
               opacity: reducedMotion ? 0 : undefined,
            }}
            animate={
               reducedMotion
                  ? undefined
                  : { transform: BEAM_SWEEP, opacity: [0, 0.8, 0.8, 0] }
            }
            transition={{
               duration: 21,
               repeat: Infinity,
               ease: "linear",
               delay: 7,
               times: BEAM_TIMES,
            }}
         />

         <div
            style={{
               position: "absolute",
               inset: 0,
               background:
                  "radial-gradient(ellipse 120% 90% at 50% 40%, transparent 50%, rgb(var(--ch-bg) / 0.85) 100%)",
            }}
         />
      </div>
   );
};

export default AmbientBackground;
