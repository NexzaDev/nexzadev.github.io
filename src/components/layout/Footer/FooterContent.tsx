import { useMemo, useCallback, useState } from "react";
import { motion } from "motion/react";
import { getName, getSocialProfiles } from "@data/personal";
import { getUiCopy, newTabLabel } from "@data/ui";
import { fillTemplate } from "@utils/fillTemplate";
import { staggerItem } from "@utils/animations";
import {
   BLUE_LIGHT,
   EASING,
   GLASS_BORDER,
   TEXT_PRIMARY,
} from "@/constants/theme";
import { CONTENT_SECTIONS, type ContentSectionId } from "@/constants/sections";
import useBreakpoint from "@hooks/useBreakpoint";
import useMotionPreference from "@hooks/useMotionPreference";
import useSectionNavigation from "@hooks/useSectionNavigation";
import MakerMark from "@components/ui/MakerMark";
import FooterSocial from "./FooterSocial";
import FooterEndNote from "./FooterEndNote";
import FooterStatusBar from "./FooterStatusBar";

const CURRENT_YEAR = new Date().getFullYear();
const LINK_COLOR = "rgb(var(--ch-text) / 0.9)";
const UI = getUiCopy();
const COPY = UI.footer;

const FOOTER_SECTION_IDS = new Set<ContentSectionId>([
   "projects",
   "stats",
   "contact",
]);
const SITE_LINKS: { id: string; label: string }[] = [
   { id: "hero", label: UI.nav.home },
   ...CONTENT_SECTIONS.filter(({ id }) => FOOTER_SECTION_IDS.has(id)).map(
      ({ id, label }) => ({ id, label }),
   ),
];

const FULL_TURN_DEG = 360;
const SPIN_SPRING = { type: "spring", stiffness: 110, damping: 14 } as const;
const TILE_TAP = { scale: 0.94 };
const TILE_TRANSITION = {
   rotate: SPIN_SPRING,
   scale: { duration: 0.12, ease: EASING.brisk },
};

const columnHeading: React.CSSProperties = {
   fontSize: 12,
   fontWeight: 700,
   letterSpacing: "0.15em",
   textTransform: "uppercase",
   color: BLUE_LIGHT,
   marginBottom: 12,
};

const columnLink: React.CSSProperties = {
   display: "flex",
   alignItems: "center",
   minHeight: 44,
   fontSize: 14,
   color: LINK_COLOR,
   padding: "4px 0",
   cursor: "pointer",
   background: "none",
   border: "none",
   textAlign: "left",
};

const FooterContent = () => {
   const { isMobile } = useBreakpoint();
   const { reducedMotion } = useMotionPreference();
   const name = useMemo(() => getName(), []);
   const socialProfiles = useMemo(() => getSocialProfiles(), []);

   const [turns, setTurns] = useState(0);
   const spin = useCallback(() => setTurns((count) => count + 1), []);

   const spinOnKeyboardFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      if (e.currentTarget.matches(":focus-visible")) spin();
   };
   const spinTarget = reducedMotion
      ? undefined
      : { rotate: turns * FULL_TURN_DEG };

   const { navigateToSection } = useSectionNavigation();

   return (
      <>
         {}
         <motion.div
            style={{
               display: "grid",
               gridTemplateColumns: isMobile ? "1fr" : "1fr auto auto",
               gap: isMobile ? 32 : 80,
               alignItems: "start",
               width: "100%",
            }}
            variants={staggerItem}
         >
            {}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
               <motion.button
                  type="button"
                  onClick={() => navigateToSection("hero")}
                  onHoverStart={spin}
                  onFocus={spinOnKeyboardFocus}
                  whileTap={TILE_TAP}
                  animate={spinTarget}
                  transition={TILE_TRANSITION}
                  aria-label={UI.nav.home}
                  style={{
                     width: 48,
                     height: 48,
                     borderRadius: 12,
                     border: `1px solid ${GLASS_BORDER}`,
                     cursor: "pointer",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     background: "rgb(var(--ch-white) / 0.06)",
                  }}
               >
                  <MakerMark size={40} />
               </motion.button>
               <p
                  className="font-signature"
                  aria-hidden="true"
                  style={{ color: TEXT_PRIMARY, fontSize: 30, lineHeight: 1 }}
               >
                  {name}
               </p>
               <p style={{ color: "rgb(var(--ch-text) / 0.8)", fontSize: 14 }}>
                  {fillTemplate(COPY.copyright, { year: CURRENT_YEAR, name })}
               </p>
               <p
                  style={{
                     color: "rgb(var(--ch-text) / 0.6)",
                     fontSize: 12,
                     maxWidth: 280,
                  }}
               >
                  {COPY.disclaimer}
               </p>
               <FooterSocial />
            </div>

            <nav aria-label={COPY.site_label}>
               <h2 style={columnHeading}>{COPY.site}</h2>
               {SITE_LINKS.map((link) => (
                  <button
                     key={link.id}
                     type="button"
                     className="footer-link"
                     onClick={() => navigateToSection(link.id)}
                     style={columnLink}
                  >
                     {link.label}
                  </button>
               ))}
               <button
                  type="button"
                  className="footer-link"
                  style={columnLink}
                  onClick={() =>
                     globalThis.dispatchEvent(new Event("nexza:open-cv"))
                  }
               >
                  {COPY.download_cv}
               </button>
            </nav>

            <nav aria-label={COPY.social_label}>
               <h2 style={columnHeading}>{COPY.social}</h2>
               {socialProfiles.map((profile) => (
                  <a
                     key={profile.id}
                     href={profile.link}
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label={newTabLabel(profile.name)}
                     className="footer-link"
                     style={columnLink}
                  >
                     {profile.name}
                  </a>
               ))}
            </nav>
         </motion.div>

         <FooterEndNote />

         <FooterStatusBar />
      </>
   );
};

export default FooterContent;
