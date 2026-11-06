import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { getAvailability, getLocation, getTimezone } from "@data/personal";
import { getUiCopy } from "@data/ui";
import { staggerItem } from "@utils/animations";
import { fillTemplate } from "@utils/fillTemplate";
import {
   GLASS_BORDER,
   GREEN,
   MONO_FONT,
   TEXT_SECONDARY,
} from "@/constants/theme";
import useBreakpoint from "@hooks/useBreakpoint";
import { describeGap, offsetMinutes } from "@utils/timeGap";

const LABEL_COLOR = "rgb(var(--ch-text) / 0.55)";
const VALUE_COLOR = "rgb(var(--ch-text) / 0.9)";
const COPY = getUiCopy().footer;

interface ClockReading {
   text: string;
   zone: string;
   iso: string;
}

interface ClockFormats {
   time: Intl.DateTimeFormat;
   zone: Intl.DateTimeFormat;
}

const clockFormats = (timeZone: string): ClockFormats => ({
   time: new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
   }),
   zone: new Intl.DateTimeFormat("en-IN", { timeZone, timeZoneName: "short" }),
});

const readClock = (formats: ClockFormats, timeZone: string): ClockReading => {
   const now = new Date();
   return {
      text: formats.time.format(now),
      zone:
         formats.zone
            .formatToParts(now)
            .find((part) => part.type === "timeZoneName")?.value ?? timeZone,
      iso: now.toISOString(),
   };
};

const LocalClock = ({ timeZone }: { timeZone: string }) => {
   const timeRef = useRef<HTMLTimeElement>(null);
   const formats = useMemo(() => clockFormats(timeZone), [timeZone]);
   const [now, setNow] = useState(() => readClock(formats, timeZone));
   const [onScreen, setOnScreen] = useState(false);

   useEffect(() => {
      const element = timeRef.current;
      if (!element) return;
      const observer = new IntersectionObserver((entries) => {
         for (const entry of entries) {
            if (entry.isIntersecting) setNow(readClock(formats, timeZone));
            setOnScreen(entry.isIntersecting);
         }
      });
      observer.observe(element);
      return () => observer.disconnect();
   }, [formats, timeZone]);

   useEffect(() => {
      if (!onScreen) return;
      const tick = () => setNow(readClock(formats, timeZone));
      const id = window.setInterval(tick, 1000);
      return () => window.clearInterval(id);
   }, [onScreen, formats, timeZone]);

   return (
      <time
         ref={timeRef}
         dateTime={now.iso}
         style={{
            fontSize: 12,
            fontFamily: MONO_FONT,
            fontVariantNumeric: "tabular-nums",
            color: VALUE_COLOR,
         }}
      >
         {now.text} {now.zone}
      </time>
   );
};

const VisitorGap = ({ timeZone }: { timeZone: string }) => {
   const [visitorZone] = useState(
      () => Intl.DateTimeFormat().resolvedOptions().timeZone,
   );
   const visitorFormat = useMemo(
      () =>
         new Intl.DateTimeFormat(undefined, {
            timeZone: visitorZone,
            hour: "2-digit",
            minute: "2-digit",
         }),
      [visitorZone],
   );
   const [now, setNow] = useState(() => new Date());

   useEffect(() => {
      const id = window.setInterval(() => setNow(new Date()), 30_000);
      return () => window.clearInterval(id);
   }, []);

   const gap = describeGap(
      offsetMinutes(timeZone, now),
      offsetMinutes(visitorZone, now),
   );
   if (!gap) return null;

   return (
      <span
         style={{
            fontSize: 11,
            fontFamily: MONO_FONT,
            fontVariantNumeric: "tabular-nums",
            color: LABEL_COLOR,
         }}
      >
         {fillTemplate(COPY.visitor_gap, {
            time: visitorFormat.format(now),
            gap,
         })}
      </span>
   );
};

const FooterStatusBar = () => {
   const { isMobile } = useBreakpoint();
   const availability = getAvailability();
   const timeZone = getTimezone();
   const city = getLocation().split(",")[0].trim();

   return (
      <motion.div
         style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto 1fr",
            alignItems: "center",
            gap: isMobile ? 14 : 24,
            width: "100%",
            paddingTop: 20,
            paddingBottom: isMobile ? 72 : 56,
            borderTop: `1px solid ${GLASS_BORDER}`,
         }}
         variants={staggerItem}
      >
         <div
            style={{
               display: "flex",
               alignItems: "center",
               gap: 10,
               flexWrap: "wrap",
               justifyContent: isMobile ? "center" : "flex-start",
            }}
         >
            <span
               aria-hidden="true"
               className="animate-glow-pulse"
               style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: GREEN,
                  flexShrink: 0,
               }}
            />
            <span
               style={{
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: LABEL_COLOR,
                  fontFamily: MONO_FONT,
               }}
            >
               {city}
            </span>
            <LocalClock timeZone={timeZone} />
            <VisitorGap timeZone={timeZone} />
            {!isMobile && (
               <span
                  style={{
                     fontSize: 11,
                     color: TEXT_SECONDARY,
                  }}
               >
                  {availability}
               </span>
            )}
         </div>
      </motion.div>
   );
};

export default FooterStatusBar;
