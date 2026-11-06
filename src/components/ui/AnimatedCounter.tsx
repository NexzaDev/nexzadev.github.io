import { useMemo, useRef } from "react";
import { useInView } from "motion/react";
import NumberFlow from "@number-flow/react";
import useMotionPreference from "@hooks/useMotionPreference";

interface Props {
   value: string | number;
   duration?: number;

   compact?: boolean;
}

const isDigit = (ch: string | undefined) =>
   ch !== undefined && ch >= "0" && ch <= "9";

const parseCounterValue = (str: string) => {
   let start = 0;
   while (start < str.length && !isDigit(str[start])) start++;
   if (start === str.length) {
      return {
         prefix: "",
         numericValue: 0,
         decimals: 0,
         grouped: false,
         suffix: str,
      };
   }
   let end = start;
   while (isDigit(str[end]) || str[end] === ",") end++;
   if (str[end] === "." && isDigit(str[end + 1])) {
      end++;
      while (isDigit(str[end])) end++;
   }
   const num = str.slice(start, end);
   const dot = num.indexOf(".");
   return {
      prefix: str.slice(0, start),
      numericValue: Number.parseFloat(num.replaceAll(",", "")),
      decimals: dot === -1 ? 0 : num.length - dot - 1,
      grouped: num.includes(","),
      suffix: str.slice(end),
   };
};

const AnimatedCounter = ({
   value,
   duration = 2,
   compact = false,
}: Readonly<Props>) => {
   const ref = useRef<HTMLSpanElement>(null);
   const { reducedMotion } = useMotionPreference();
   const inView = useInView(ref, { once: true, amount: 0.5 });

   const { prefix, numericValue, decimals, grouped, suffix } = useMemo(
      () => parseCounterValue(String(value)),
      [value],
   );

   const shown = inView || reducedMotion ? numericValue : 0;
   const timing = {
      duration: duration * 1000 * 0.6,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
   };

   const suffixIsAnnotation = suffix.trim().length > 2;

   return (
      <span
         ref={ref}
         className={`font-mono ${compact ? "text-2xl" : "text-3xl"} font-bold text-accent-cyan tabular-nums`}
      >
         {prefix && <span className="text-accent-cyan/70">{prefix}</span>}
         <NumberFlow
            value={shown}
            animated={!reducedMotion}
            locales="en-US"
            format={{
               minimumFractionDigits: decimals,
               maximumFractionDigits: decimals,
               useGrouping: grouped,
            }}
            spinTiming={timing}
            transformTiming={timing}
         />
         {suffix && (
            <span
               className="text-accent-cyan/70"
               style={
                  suffixIsAnnotation
                     ? { fontSize: "0.5em", fontWeight: 600 }
                     : undefined
               }
            >
               {suffix}
            </span>
         )}
      </span>
   );
};

export default AnimatedCounter;
