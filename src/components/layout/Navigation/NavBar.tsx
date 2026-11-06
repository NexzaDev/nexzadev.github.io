import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { setPaletteOpen } from "@utils/paletteState";
import {
   DURATION,
   EASING,
   GLASS_BORDER,
   TEXT_PRIMARY,
   TEXT_SECONDARY,
} from "@/constants/theme";
import MakerMark from "@components/ui/MakerMark";
import { getSectionCopy } from "@data/sections";
import { getUiCopy } from "@data/ui";
import { fillTemplate } from "@utils/fillTemplate";
import DesktopNav from "./DesktopNav";

const COPY = getUiCopy().nav;
const CONTACT_LABEL = fillTemplate(COPY.navigate_label, {
   label: getSectionCopy("contact").nav,
});

interface NavSection {
   id: string;
   label: string;
}

interface NavBarProps {
   scrolled: boolean;
   isMobile: boolean;
   sections: NavSection[];
   activeSection: string;
   mobileMenuOpen: boolean;
   onNavigate: (id: string) => void;
   onToggleMenu: () => void;
}

const ENTRANCE_TRANSITION = {
   duration: DURATION.slow,
   ease: "easeOut" as const,
};
const COLOR_TRANSITION = { color: { duration: 0.2, ease: EASING.brisk } };
const ICON_HOVER = { color: TEXT_PRIMARY };

const ICON_TRANSITION = { duration: 0.18, ease: "easeOut" as const };
const ICON_ENTER = { rotate: -90, opacity: 0 };
const ICON_REST = { rotate: 0, opacity: 1 };
const ICON_EXIT = { rotate: 90, opacity: 0 };
const ICON_STYLE: React.CSSProperties = {
   position: "absolute",
   inset: 0,
   display: "flex",
   alignItems: "center",
   justifyContent: "center",
};

const NavBar = ({
   scrolled,
   isMobile,
   sections,
   activeSection,
   mobileMenuOpen,
   onNavigate,
   onToggleMenu,
}: NavBarProps) => {
   const desktopSections = useMemo(
      () => sections.filter((s) => s.id !== "contact"),
      [sections],
   );

   return (
      <motion.nav
         layoutRoot
         style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            height: isMobile ? "calc(64px + env(safe-area-inset-top))" : 64,
            paddingTop: isMobile ? "env(safe-area-inset-top)" : undefined,
            backgroundColor: scrolled
               ? "rgb(var(--ch-bg) / 0.92)"
               : "rgb(var(--ch-bg) / 0.5)",
            borderBottom: scrolled
               ? "1px solid rgb(var(--ch-white) / 0.06)"
               : "1px solid transparent",
            transition: "background-color 0.3s, border-color 0.3s",
         }}
         initial={{ y: -80, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={ENTRANCE_TRANSITION}
         aria-label={COPY.label}
      >
         <div
            style={{
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               height: "100%",
               paddingLeft: 24,
               paddingRight: 24,
               maxWidth: 1280,
               marginLeft: "auto",
               marginRight: "auto",
            }}
         >
            <button
               onClick={() => onNavigate("hero")}
               style={{
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: "rgb(var(--ch-white) / 0.06)",
                  border: `1px solid ${GLASS_BORDER}`,
                  borderRadius: 10,
               }}
               aria-label={COPY.top_label}
            >
               <MakerMark size={36} />
            </button>

            {!isMobile && (
               <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <DesktopNav
                     sections={desktopSections}
                     activeSection={activeSection}
                     onNavigate={onNavigate}
                  />
                  <button
                     type="button"
                     onClick={() => setPaletteOpen(true)}
                     className="palette-trigger"
                     aria-label={COPY.palette_label}
                     aria-keyshortcuts="Control+K Meta+K"
                  >
                     <Search size={14} aria-hidden="true" />
                     <kbd>{COPY.palette_key}</kbd>
                  </button>
                  <button
                     onClick={() => onNavigate("contact")}
                     className="btn-pill"
                     style={{ fontSize: 13, minHeight: 44 }}
                     aria-label={CONTACT_LABEL}
                  >
                     {COPY.contact}
                  </button>
               </div>
            )}

            {isMobile && (
               <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <button
                     type="button"
                     onClick={() => setPaletteOpen(true)}
                     className="palette-trigger palette-trigger-icon"
                     aria-label={COPY.palette_label}
                  >
                     <Search size={18} aria-hidden="true" />
                  </button>
                  <motion.button
                     onClick={onToggleMenu}
                     style={{
                        position: "relative",
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        color: TEXT_SECONDARY,
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                     }}
                     whileHover={ICON_HOVER}
                     whileFocus={ICON_HOVER}
                     transition={COLOR_TRANSITION}
                     aria-label={
                        mobileMenuOpen ? COPY.menu_close : COPY.menu_open
                     }
                     aria-expanded={mobileMenuOpen}
                     aria-controls="mobile-menu"
                  >
                     <AnimatePresence mode="wait" initial={false}>
                        {mobileMenuOpen ? (
                           <motion.span
                              key="close"
                              style={ICON_STYLE}
                              initial={ICON_ENTER}
                              animate={ICON_REST}
                              exit={ICON_EXIT}
                              transition={ICON_TRANSITION}
                              aria-hidden="true"
                           >
                              <X size={22} />
                           </motion.span>
                        ) : (
                           <motion.span
                              key="open"
                              style={ICON_STYLE}
                              initial={ICON_ENTER}
                              animate={ICON_REST}
                              exit={ICON_EXIT}
                              transition={ICON_TRANSITION}
                              aria-hidden="true"
                           >
                              <Menu size={22} />
                           </motion.span>
                        )}
                     </AnimatePresence>
                  </motion.button>
               </div>
            )}
         </div>
      </motion.nav>
   );
};

export default memo(NavBar);
