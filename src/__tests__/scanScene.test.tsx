import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MotionPreferenceProvider } from "@hooks/MotionPreferenceProvider";
import ScanScene from "@pages/projects/covers/ScanScene";

const renderScene = () =>
   render(
      <MotionPreferenceProvider>
         <ScanScene tint="#60a5fa" />
      </MotionPreferenceProvider>,
   );

const expectedLabels = [
   "Target",
   "192.0.2.10",
   "HTTP",
   "DNS",
   "SMB",
   "TLS",
   "FTP",
   "Checks",
   "HTTP security headers",
   "Cookie flags",
   "DNS configuration",
   "SMB configuration",
   "TLS configuration",
   "Report",
   "Missing security header",
   "Insecure cookie flag",
   "Sample output",
];

beforeEach(() => {
   globalThis.localStorage.clear();
});

describe("network audit project cover", () => {
   it("renders all three stages and every sample row", () => {
      renderScene();
      for (const label of expectedLabels) {
         expect(screen.getByText(label)).toBeTruthy();
      }
   });

   it("keeps the complete still frame in reduced motion", () => {
      globalThis.localStorage.setItem("portfolio-motion-preference", "reduced");
      const { container } = renderScene();
      expect(container.querySelector(".scan-scene--reduced")).toBeTruthy();
      for (const label of expectedLabels) {
         expect(screen.getByText(label)).toBeTruthy();
      }
      expect(container.querySelector(".scan-checks__sweep")).toBeNull();
   });
});
