import { useRef, type CSSProperties } from "react";
import { motion } from "motion/react";
import useMotionPreference from "@hooks/useMotionPreference";
import useSceneClock from "@hooks/useSceneClock";
import { BLUE_LIGHT, GREEN, GOLD } from "@/constants/theme";
import type { TintProps } from "./kit/sceneTokens";
import "./scan-scene.css";

const SERVICES = ["HTTP", "DNS", "SMB", "TLS", "FTP"];
const CHECKS = [
   "HTTP security headers",
   "Cookie flags",
   "DNS configuration",
   "SMB configuration",
   "TLS configuration",
];
const FINDINGS = ["Missing security header", "Insecure cookie flag"];

const ScanScene = ({ tint }: TintProps) => {
   const sceneRef = useRef<HTMLDivElement>(null);
   const { reducedMotion } = useMotionPreference();
   useSceneClock(sceneRef);

   return (
      <div
         ref={sceneRef}
         className={`scan-scene${reducedMotion ? " scan-scene--reduced" : ""}`}
         style={{ "--scan-tint": tint } as CSSProperties}
         aria-hidden="true"
      >
         <div className="scan-scene__grid">
            <section className="scan-stage scan-stage--target">
               <h3 className="scan-stage__title">Target</h3>
               <p className="scan-target__address">192.0.2.10</p>
               <div className="scan-target__services">
                  {SERVICES.map((service, index) => (
                     <div
                        className="scan-row scan-row--service"
                        key={service}
                        style={
                           {
                              "--scan-delay": `${index * 0.14}s`,
                           } as CSSProperties
                        }
                     >
                        <span className="scan-dot" />
                        <span className="scan-row__label">{service}</span>
                     </div>
                  ))}
               </div>
            </section>
            <section className="scan-stage scan-stage--checks">
               <h3 className="scan-stage__title">Checks</h3>
               <div className="scan-checks">
                  {CHECKS.map((check, index) => (
                     <div
                        className="scan-row scan-row--check"
                        key={check}
                        style={
                           {
                              "--scan-delay": `${0.72 + index * 0.14}s`,
                           } as CSSProperties
                        }
                     >
                        <span className="scan-check__mark" />
                        <span className="scan-row__label">{check}</span>
                     </div>
                  ))}
               </div>
               {!reducedMotion && (
                  <svg
                     className="scan-checks__sweep"
                     viewBox="0 0 8 72"
                     preserveAspectRatio="none"
                     aria-hidden="true"
                  >
                     <motion.circle
                        cx="4"
                        cy="4"
                        r="2"
                        fill={GREEN}
                        animate={{ cy: [4, 68, 4] }}
                        transition={{
                           duration: 8,
                           repeat: Infinity,
                           ease: "linear",
                        }}
                     />
                  </svg>
               )}
            </section>
            <section className="scan-stage scan-stage--report">
               <h3 className="scan-stage__title">Report</h3>
               <div className="scan-report__rows">
                  {FINDINGS.map((finding, index) => (
                     <div
                        className="scan-row scan-row--finding"
                        key={finding}
                        style={
                           {
                              "--scan-delay": `${1.54 + index * 0.22}s`,
                           } as CSSProperties
                        }
                     >
                        <span className="scan-row__label">{finding}</span>
                        <span
                           className="scan-severity"
                           style={
                              {
                                 "--scan-severity":
                                    index === 0 ? BLUE_LIGHT : GOLD,
                              } as CSSProperties
                           }
                        >
                           INFO
                        </span>
                     </div>
                  ))}
               </div>
               <span className="scan-report__caption">Sample output</span>
            </section>
         </div>
      </div>
   );
};

export default ScanScene;
