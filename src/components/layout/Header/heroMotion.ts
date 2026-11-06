import { stagger, type TransformProperties, type Variants } from "motion/react";
import type { CSSProperties } from "react";
import { DURATION, EASING } from "@/constants/theme";

const STAGGER = 0.09;
const LEAD_IN = 0.15;
const LINE_STAGGER = 0.08;
const LOGO_DURATION = 0.5;

const entrance = (duration: number) => ({
   duration,
   ease: EASING.cinematic,
});

export const heroContainer: Variants = {
   hidden: {},
   visible: {
      transition: { delayChildren: stagger(STAGGER, { startDelay: LEAD_IN }) },
   },
};

export const heroLogo: Variants = {
   hidden: { opacity: 0, scale: 0.92 },
   visible: { opacity: 1, scale: 1, transition: entrance(LOGO_DURATION) },
};

export const heroLabel: Variants = {
   hidden: { opacity: 0, x: -14 },
   visible: { opacity: 1, x: 0, transition: entrance(DURATION.default) },
};

export const heroLatest: Variants = {
   hidden: { opacity: 0, x: -14 },
   visible: { opacity: 1, x: 0, transition: entrance(DURATION.quick) },
};

export const heroHeadline: Variants = {
   hidden: {},
   visible: { transition: { delayChildren: stagger(LINE_STAGGER) } },
};

export const heroHeadlineLine: Variants = {
   hidden: { y: "110%" },
   visible: { y: "0%", transition: entrance(DURATION.slow) },
};

const INTRO_HIDDEN_OPACITY = 0.001;

export const heroIntro: Variants = {
   hidden: { opacity: INTRO_HIDDEN_OPACITY, y: 16 },
   visible: { opacity: 1, y: 0, transition: entrance(DURATION.default) },
};

export const heroRow: Variants = {
   hidden: { opacity: 0, y: 12 },
   visible: { opacity: 1, y: 0, transition: entrance(DURATION.default) },
};

export const HEADLINE_MASK_STYLE: CSSProperties = {
   display: "block",
   overflow: "hidden",
   paddingBottom: "0.08em",
   marginBottom: "-0.08em",
};

export const passThroughTransform = (
   _transform: TransformProperties,
   generated: string,
) => generated;
