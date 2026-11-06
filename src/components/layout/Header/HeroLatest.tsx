import { useMemo } from "react";
import { motion } from "motion/react";
import { getNews } from "@data/news";
import { getUiCopy, newTabLabel } from "@data/ui";
import { MONO_FONT, TEXT_MUTED } from "@/constants/theme";
import useBreakpoint from "@hooks/useBreakpoint";
import { heroLatest } from "./heroMotion";

const COPY = getUiCopy().hero;

const HeroLatest = () => {
   const { isMobile } = useBreakpoint();
   const item = useMemo(() => getNews()[0], []);
   if (!item) return null;

   const content = item.link ? (
      <a
         href={item.link}
         className="hero-latest-link"
         target="_blank"
         rel="noopener noreferrer"
         aria-label={newTabLabel(item.text)}
      >
         {item.text}
      </a>
   ) : (
      <span>{item.text}</span>
   );

   return (
      <motion.div
         variants={heroLatest}
         style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 4 : 14,
         }}
      >
         <span
            style={{
               fontFamily: MONO_FONT,
               fontSize: 11,
               fontWeight: 700,
               letterSpacing: "0.16em",
               textTransform: "uppercase",
               color: TEXT_MUTED,
               flexShrink: 0,
            }}
         >
            {COPY.latest}
         </span>
         <div style={{ fontSize: 14, lineHeight: 1.6 }}>{content}</div>
      </motion.div>
   );
};

export default HeroLatest;
