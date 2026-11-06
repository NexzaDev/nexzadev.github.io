import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { getContactOptions } from "@data/contact";
import { getUiCopy } from "@data/ui";
import useMotionPreference from "@hooks/useMotionPreference";
import useBreakpoint from "@hooks/useBreakpoint";
import AccentText from "@components/ui/AccentText";
import { fillTemplate } from "@utils/fillTemplate";
import SlideToContact from "./SlideToContact";
import "./footer-end-note.css";

const COPY = getUiCopy().footer;
const HOLD_MS = 650;
const RING = 2 * Math.PI * 9;

const holdLabel = (email: string, copied: boolean, failed: boolean) => {
   if (copied) return COPY.copied;
   if (failed) return COPY.copy_failed;
   return fillTemplate(COPY.hold_copy, { email });
};

const HoldToCopy = ({ email }: { email: string }) => {
   const { reducedMotion } = useMotionPreference();
   const progress = useMotionValue(0);
   const dashOffset = useTransform(progress, (p) => RING * (1 - p));
   const [copied, setCopied] = useState(false);
   const [failed, setFailed] = useState(false);
   const runRef = useRef<ReturnType<typeof animate> | null>(null);
   const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   useEffect(
      () => () => {
         runRef.current?.stop();
         if (resetRef.current) clearTimeout(resetRef.current);
      },
      [],
   );

   const copy = async () => {
      try {
         await navigator.clipboard.writeText(email);
      } catch {
         setFailed(true);
         animate(progress, 0, { duration: 0.2 });
         if (resetRef.current) clearTimeout(resetRef.current);
         resetRef.current = setTimeout(() => setFailed(false), 1800);
         return;
      }
      setFailed(false);
      setCopied(true);
      if (resetRef.current) clearTimeout(resetRef.current);
      resetRef.current = setTimeout(() => {
         setCopied(false);
         progress.set(0);
      }, 1800);
   };

   const start = () => {
      if (copied) return;
      runRef.current?.stop();
      runRef.current = animate(progress, 1, {
         duration: reducedMotion ? 0 : HOLD_MS / 1000,
         ease: "linear",
         onComplete: () => void copy(),
      });
   };
   const cancel = () => {
      if (copied) return;
      runRef.current?.stop();
      animate(progress, 0, { duration: 0.2 });
   };

   return (
      <button
         type="button"
         className="hold-copy"
         onPointerDown={start}
         onPointerUp={cancel}
         onPointerLeave={cancel}
         onPointerCancel={cancel}
         onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
               event.preventDefault();
               start();
            }
         }}
         onKeyUp={(event) => {
            if (event.key === "Enter" || event.key === " ") cancel();
         }}
         onContextMenu={(event) => event.preventDefault()}
      >
         <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <circle
               cx="11"
               cy="11"
               r="9"
               fill="none"
               stroke="rgba(255,255,255,0.12)"
               strokeWidth="2"
            />
            <motion.circle
               cx="11"
               cy="11"
               r="9"
               fill="none"
               stroke="var(--color-accent-cyan)"
               strokeWidth="2"
               strokeLinecap="round"
               strokeDasharray={RING}
               style={{
                  strokeDashoffset: dashOffset,
                  rotate: -90,
                  originX: "50%",
                  originY: "50%",
               }}
            />
         </svg>
         <span aria-live="polite">{holdLabel(email, copied, failed)}</span>
      </button>
   );
};

const FooterEndNote = () => {
   const emailOption = getContactOptions().find((option) =>
      option.link.startsWith("mailto:"),
   );
   const email = emailOption?.value ?? "";
   const { isMobile } = useBreakpoint();

   return (
      <div className="footer-endnote">
         <p className="display-heading footer-endnote-line">
            <AccentText text={COPY.end_line} />
         </p>
         {email && isMobile && emailOption && (
            <SlideToContact href={emailOption.link} />
         )}
         {email && !isMobile && <HoldToCopy email={email} />}
      </div>
   );
};

export default FooterEndNote;
