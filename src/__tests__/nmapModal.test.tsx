import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MotionPreferenceProvider } from "@hooks/MotionPreferenceProvider";
import { getFeaturedProjects } from "@data/projects";
import ProjectModalBody from "@pages/projects/ProjectModalBody";
import { getCategoryColors } from "@pages/projects/projectConstants";

beforeEach(() => {
   globalThis.localStorage.clear();
});

describe("Nmap project modal", () => {
   it("renders its sections in order without a comparison slider", async () => {
      const project = { ...getFeaturedProjects()[0], category: "Featured" };
      const { container } = render(
         <MotionPreferenceProvider>
            <ProjectModalBody
               project={project}
               colors={getCategoryColors("Featured")}
               isMobile={false}
            />
         </MotionPreferenceProvider>,
      );

      await screen.findByText("Sample output", {}, { timeout: 5000 });
      await screen.findByText(
         "No exploit payloads run.",
         {},
         { timeout: 5000 },
      );
      await waitFor(() => {
         expect(
            Array.from(container.querySelectorAll("[data-modal-section]")).map(
               (section) => section.getAttribute("data-modal-section"),
            ),
         ).toEqual([
            "overview",
            "sample-scan",
            "flow",
            "features",
            "technology",
            "links",
         ]);
      });
      expect(container.querySelector(".compare-slider")).toBeNull();
      expect(screen.getAllByText("Service")).toHaveLength(2);
      expect(screen.getAllByText("Target")).toHaveLength(2);
      expect(screen.getAllByText("Finding")).toHaveLength(2);
      expect(screen.getByText("Service response")).toBeTruthy();
      expect(screen.getByText("Reported finding")).toBeTruthy();
      expect(container.querySelector(".nmap-actions a")?.textContent).toContain(
         "Source",
      );
      expect(screen.getByRole("button", { name: "Copy link" })).toBeTruthy();
   });
});
