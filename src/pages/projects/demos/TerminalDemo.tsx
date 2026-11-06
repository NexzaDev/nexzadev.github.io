import { type CSSProperties } from "react";
import { CHROME_BAR_STYLE } from "@/constants/theme";
import type { ProjectDemoProps } from "./demoRegistry";

const SAMPLE_FINDINGS = [
   {
      service: "HTTP",
      target: "192.0.2.18",
      finding: "Missing security header",
   },
   { service: "HTTP", target: "192.0.2.18", finding: "Insecure cookie flag" },
];

const TerminalDemo = ({ accent }: ProjectDemoProps) => (
   <div
      className="nmap-demo"
      style={{ "--nmap-accent": accent } as CSSProperties}
   >
      <div className="nmap-terminal">
         <div className="nmap-terminal-header" style={CHROME_BAR_STYLE}>
            <span className="nmap-terminal-caption">Sample output</span>
            <span className="nmap-terminal-label">Informational audit</span>
         </div>
         <div
            className="nmap-findings"
            role="table"
            aria-label="Sample scan findings"
         >
            {SAMPLE_FINDINGS.map((row) => (
               <div className="nmap-scan-row" role="row" key={row.finding}>
                  <div className="nmap-field" role="cell">
                     <span className="nmap-field-label">Service</span>
                     <span className="nmap-field-value">{row.service}</span>
                  </div>
                  <div className="nmap-field" role="cell">
                     <span className="nmap-field-label">Target</span>
                     <span className="nmap-field-value">{row.target}</span>
                  </div>
                  <div className="nmap-field nmap-field--finding" role="cell">
                     <span className="nmap-field-label">Finding</span>
                     <span className="nmap-field-value nmap-finding">
                        <span
                           className="nmap-severity-dot"
                           aria-label="Informational finding"
                        />
                        {row.finding}
                     </span>
                  </div>
               </div>
            ))}
         </div>
         <p className="nmap-terminal-ending">No exploit payloads run.</p>
      </div>
   </div>
);

export default TerminalDemo;
