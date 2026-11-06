import { useState, type ReactNode, type RefObject } from "react";
import {
   motion,
   AnimatePresence,
   useDragControls,
   useMotionValue,
   useTransform,
   type PanInfo,
   type Variants,
} from "motion/react";
import { createPortal } from "react-dom";
import { BG_CARD, DURATION, EASING } from "@/constants/theme";
import "./modal-shell.css";

interface ModalShellProps {
   isOpen: boolean;
   onClose: () => void;
   dialogRef: RefObject<HTMLDivElement | null>;
   isMobile: boolean;

   titleId: string;
   children: ReactNode;
}

const BACKDROP_STYLE = {
   background: "rgba(0,0,0,0.3)",
   backdropFilter: "blur(12px)",
   WebkitBackdropFilter: "blur(12px)",
} as const;

const DISMISS_OFFSET_PX = 120;
const DISMISS_VELOCITY = 500;
const SHEET_ELASTIC = { top: 0, bottom: 0.6 };
const SHEET_CONSTRAINTS = { top: 0, bottom: 0 };

interface ExitCustom {
   isMobile: boolean;
   dragDismissed: boolean;
}

const dialogVariants: Variants = {
   exit: ({ isMobile, dragDismissed }: ExitCustom) =>
      dragDismissed
         ? {
              opacity: 0,
              y: globalThis.innerHeight,
              transition: { duration: 0.3, ease: EASING.cinematic },
           }
         : { opacity: 0, y: isMobile ? 100 : 30, scale: 0.97 },
};

const ModalShell = ({
   isOpen,
   onClose,
   dialogRef,
   isMobile,
   titleId,
   children,
}: ModalShellProps) => {
   const dragControls = useDragControls();
   const sheetY = useMotionValue(0);
   const backdropOpacity = useTransform(sheetY, [0, 300], [1, 0]);
   const [dragDismissed, setDragDismissed] = useState(false);
   const exitCustom: ExitCustom = { isMobile, dragDismissed };

   const handleDragEnd = (_e: unknown, info: PanInfo) => {
      if (
         info.offset.y > DISMISS_OFFSET_PX ||
         info.velocity.y > DISMISS_VELOCITY
      ) {
         setDragDismissed(true);
         onClose();
      }
   };

   return createPortal(
      <AnimatePresence
         custom={exitCustom}
         onExitComplete={() => setDragDismissed(false)}
      >
         {isOpen && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: DURATION.quick }}
               onClick={onClose}
               style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 1000,
                  display: "flex",
                  alignItems: isMobile ? "flex-end" : "center",
                  justifyContent: "center",

                  padding: isMobile
                     ? "max(12px, env(safe-area-inset-top)) 12px max(16px, env(safe-area-inset-bottom))"
                     : 20,

                  ...(!isMobile && BACKDROP_STYLE),
                  overscrollBehavior: "contain",
               }}
            >
               {isMobile && (
                  <motion.div
                     aria-hidden="true"
                     style={{
                        position: "absolute",
                        inset: 0,
                        ...BACKDROP_STYLE,
                        opacity: backdropOpacity,
                     }}
                  />
               )}
               <motion.div
                  ref={dialogRef}
                  custom={exitCustom}
                  variants={dialogVariants}
                  initial={{
                     opacity: 0,
                     y: isMobile ? 100 : 50,
                     scale: 0.95,
                  }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit="exit"
                  transition={{
                     duration: DURATION.default,
                     ease: EASING.cinematic,
                  }}
                  drag={isMobile ? "y" : false}
                  dragControls={dragControls}
                  dragListener={false}
                  dragConstraints={SHEET_CONSTRAINTS}
                  dragElastic={SHEET_ELASTIC}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => e.stopPropagation()}
                  onWheel={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  tabIndex={-1}

                  data-lenis-prevent
                  style={{
                     position: "relative",
                     width: "100%",
                     maxWidth: isMobile ? "100%" : 720,
                     maxHeight: isMobile
                        ? "calc(100dvh - max(12px, env(safe-area-inset-top)) - max(16px, env(safe-area-inset-bottom)))"
                        : "85dvh",

                     overflowY: isMobile ? "hidden" : "auto",

                     overscrollBehavior: "contain",
                     ...(isMobile && {
                        display: "flex",
                        flexDirection: "column",
                     }),

                     borderRadius: 20,
                     border: "1px solid rgba(255,255,255,0.1)",
                     background: BG_CARD,
                     boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                     y: sheetY,
                  }}
               >
                  {isMobile ? (
                     <>
                        <div
                           aria-hidden="true"
                           className="sheet-handle"
                           onPointerDown={(e) => dragControls.start(e)}
                        />
                        <div
                           style={{
                              flex: 1,
                              minHeight: 0,
                              overflowY: "auto",
                              overscrollBehavior: "contain",
                           }}
                        >
                           {children}
                        </div>
                     </>
                  ) : (
                     children
                  )}
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>,
      document.body,
   );
};

export default ModalShell;
