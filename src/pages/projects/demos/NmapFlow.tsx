import { type CSSProperties } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { ProjectDemoProps } from "./demoRegistry";

const NmapFlow = ({ accent, isMobile }: ProjectDemoProps) => (
   <div
      className="nmap-flow"
      style={{ "--nmap-accent": accent } as CSSProperties}
      aria-label="Audit flow"
   >
      <div className="nmap-flow-step">
         <strong>Service response</strong>
         <span>HTTP headers and TLS service details are inspected.</span>
      </div>
      {isMobile ? (
         <ArrowDown className="nmap-flow-arrow" size={18} aria-hidden="true" />
      ) : (
         <ArrowRight className="nmap-flow-arrow" size={18} aria-hidden="true" />
      )}
      <div className="nmap-flow-step">
         <strong>Reported finding</strong>
         <span>
            Missing security headers and insecure cookie flags are reported.
         </span>
      </div>
   </div>
);

export default NmapFlow;
