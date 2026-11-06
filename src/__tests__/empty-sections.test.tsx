import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BreakpointProvider } from "@hooks/BreakpointProvider";
import { MotionPreferenceProvider } from "@hooks/MotionPreferenceProvider";
import Education from "@pages/education/Education";
import Achievement from "@pages/achievement/Achievement";
import Services from "@pages/services/Services";
import OpenSourceBanner from "@pages/projects/OpenSourceBanner";

const renderWithProviders = (ui: React.ReactNode) =>
   render(
      <BreakpointProvider>
         <MotionPreferenceProvider>{ui}</MotionPreferenceProvider>
      </BreakpointProvider>,
   );

describe("empty content sections", () => {
   it("keeps the Education title and shows its JSON-driven empty state", () => {
      renderWithProviders(<Education />);
      expect(screen.getByRole("heading", { name: "Education" })).toBeTruthy();
      expect(screen.getByText(/Nothing listed yet/)).toBeTruthy();
      expect(document.querySelector(".mascot-perch")).toBeTruthy();
   });

   it("keeps the Achievements title and shows one quiet empty state", () => {
      renderWithProviders(<Achievement />);
      expect(
         screen.getByRole("heading", { name: "Achievements" }),
      ).toBeTruthy();
      expect(screen.getByText(/Coming soon\. No certifications/)).toBeTruthy();
      expect(screen.queryByText("Industry Certifications")).toBeNull();
   });

   it("keeps Focus Areas and replaces the cards with an empty state", () => {
      renderWithProviders(<Services />);
      expect(screen.getByRole("heading", { name: "Focus Areas" })).toBeTruthy();
      expect(
         screen.getByText(/The focus areas are being written up/),
      ).toBeTruthy();
      expect(document.querySelector(".service-grid")).toBeNull();
   });

   it("keeps Open Source Contributions and shows its empty state, not a grid", () => {
      render(<OpenSourceBanner />);
      expect(
         screen.getByRole("heading", { name: "Open Source Contributions" }),
      ).toBeTruthy();
      expect(
         screen.getByText("No upstream contributions listed yet."),
      ).toBeTruthy();
      expect(document.querySelector(".contribution-grid")).toBeNull();
   });
});
