import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BreakpointProvider } from "@hooks/BreakpointProvider";
import { MotionPreferenceProvider } from "@hooks/MotionPreferenceProvider";
import useMotionPreference from "@hooks/useMotionPreference";
import MotionPreferenceControl from "@components/ui/MotionPreferenceControl";
import QuickFacts from "@pages/about/QuickFacts";
import ExpandableExtras from "@pages/education/ExpandableExtras";
import ProjectCard from "@pages/projects/ProjectCard";
import TimelineCardContent from "@pages/experience/TimelineCardContent";
import type { Education, ProfessionalExperience, Project } from "@/types";
import { BLUE_LIGHT } from "@/constants/theme";

// MotionPreferenceControl reads useBreakpoint, which throws outside its
// provider, so the harness supplies both application-root providers.
const renderWithMotion = (ui: React.ReactNode) =>
   render(
      <BreakpointProvider>
         <MotionPreferenceProvider>{ui}</MotionPreferenceProvider>
      </BreakpointProvider>,
   );

const project: Project & { category: string } = {
   id: 1,
   title: "Sample Network Audit",
   description: "A security auditing project.",
   date: "October 2026",
   status: "active",
   tools_tech: ["Lua", "Network Security"],
   features: ["Accessible details"],
   github: "https://github.com/NexzaDev/sample-network-audit",
   live: "",
   category: "Featured",
};

const education: Education = {
   id: 99,
   date: "2020 - 2024",
   title: "Degree",
   institution: "University",
   location: "City",
   cgpa: "9.0",
   achievements: ["Graduated with distinction"],
   skills: ["TypeScript"],
};

const experience: ProfessionalExperience = {
   id: 99,
   date: "2024 - Present",
   title: "Engineer",
   position: "Full-time",
   company: "Example Company",
   location: "Remote",
   summary: "Builds reliable systems.",
   projects: [
      {
         name: "Platform",
         description: { "1": "Built a platform." },
         skills: ["AWS"],
      },
   ],
};

describe("accessible interactions", () => {
   it("renders the concise role without a duplicate employer suffix", () => {
      render(<QuickFacts isMobile={false} />);
      expect(
         screen.getByText("Network Engineer · Developer · Cyber Security"),
      ).toBeTruthy();
      // The role line is shown once, with no duplicated employer suffix.
      expect(screen.queryByText(/Cyber Security @ /)).toBeNull();
   });

   it("uses an explicit project Details button without nesting links in a pseudo-button", () => {
      const onOpen = vi.fn();
      const { container } = renderWithMotion(
         <ProjectCard data={project} onOpen={onOpen} />,
      );
      const details = screen.getByRole("button", {
         name: "View details for Sample Network Audit",
      });
      const source = screen.getByRole("link", {
         name: /View Sample Network Audit on GitHub/,
      });

      expect(container.querySelector('[role="button"]')).toBeNull();
      fireEvent.keyDown(source, { key: "Enter" });
      expect(onOpen).not.toHaveBeenCalled();
      fireEvent.click(details);
      expect(onOpen).toHaveBeenCalledOnce();
   });

   it("opens and closes education achievements with a native disclosure", () => {
      render(<ExpandableExtras item={education} marginLeft={0} />);
      const disclosure = screen.getByRole("group") as HTMLDetailsElement;
      const trigger = disclosure.querySelector("summary")!;
      expect(trigger.textContent).toBe("1 achievement");
      expect(disclosure.open).toBe(false);

      fireEvent.click(trigger);
      expect(disclosure.open).toBe(true);
      expect(
         disclosure.contains(screen.getByText("Graduated with distinction")),
      ).toBe(true);

      fireEvent.click(trigger);
      expect(disclosure.open).toBe(false);
   });

   it("keeps timeline headings outside the explicit Details control", () => {
      const onClick = vi.fn();
      const { container } = render(
         <TimelineCardContent
            item={experience}
            accentColor={BLUE_LIGHT}
            isMobile={false}
            onClick={onClick}
         />,
      );
      const button = screen.getByRole("button", {
         name: "View details for Example Company",
      });
      expect(button.querySelector("h3")).toBeNull();
      expect(container.querySelector("h3")?.textContent).toBe(
         "Example Company",
      );
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledOnce();
   });

   it("defaults to Full on a first visit with nothing stored", () => {
      globalThis.localStorage.removeItem("portfolio-motion-preference");
      const Probe = () => {
         const { reducedMotion } = useMotionPreference();
         return <output>{reducedMotion ? "reduced" : "full"}</output>;
      };
      renderWithMotion(
         <>
            <MotionPreferenceControl />
            <Probe />
         </>,
      );
      expect(screen.getByText("full")).toBeTruthy();
      expect(document.documentElement.dataset.motion).toBe("full");
   });

   it("defaults to Full even when the OS prefers reduced motion, and toggles Full <-> Reduced", async () => {
      Object.defineProperty(globalThis, "matchMedia", {
         configurable: true,
         value: vi.fn((query: string) => ({
            matches: query.includes("prefers-reduced-motion"),
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(() => false),
         })),
      });
      // A value persisted by the retired System mode must read as Full.
      globalThis.localStorage.setItem("portfolio-motion-preference", "system");

      const Probe = () => {
         const { reducedMotion } = useMotionPreference();
         return <output>{reducedMotion ? "reduced" : "full"}</output>;
      };

      renderWithMotion(
         <>
            <MotionPreferenceControl />
            <Probe />
         </>,
      );
      expect(screen.getByText("full")).toBeTruthy();
      expect(
         screen.getByRole("button", {
            name: "Motion mode: Full. Switch to Reduced",
         }),
      ).toBeTruthy();

      // The control is a single button that toggles Full <-> Reduced.
      const toggle = () =>
         fireEvent.click(screen.getByRole("button", { name: /^Motion mode:/ }));

      toggle(); // -> Reduced (explicit; the OS preference is never consulted)
      await waitFor(() => expect(screen.getByText("reduced")).toBeTruthy());
      expect(document.documentElement.dataset.motion).toBe("reduced");
      expect(
         screen.getByRole("button", {
            name: "Motion mode: Reduced. Switch to Full",
         }),
      ).toBeTruthy();
      expect(
         globalThis.localStorage.getItem("portfolio-motion-preference"),
      ).toBe("reduced");

      toggle(); // -> Full again, overriding the OS preference
      await waitFor(() => expect(screen.getByText("full")).toBeTruthy());
      expect(
         globalThis.localStorage.getItem("portfolio-motion-preference"),
      ).toBe("full");
   });
});
