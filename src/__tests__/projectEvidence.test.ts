import { describe, expect, it } from "vitest";
import { getEvidence } from "@utils/projectEvidence";
import { getFeaturedProjects } from "@data/projects";
import { hasProjectUrl } from "@utils/projectMetadata";

const GH = "https://github.com/example/repo";
const LIVE = "https://example.com";

describe("getEvidence", () => {
   it("marks a project with a live URL", () => {
      expect(getEvidence({ github: GH, live: LIVE })).toEqual([
         { kind: "live", label: "Live" },
      ]);
   });

   it("falls back to open-source evidence when there is no live URL", () => {
      expect(getEvidence({ github: GH, live: "" })).toEqual([
         { kind: "source", label: "Open source" },
      ]);
   });

   it("returns no evidence when there are no links", () => {
      expect(getEvidence({ github: "", live: "" })).toEqual([]);
   });

   it("always prefers the live URL over the source link", () => {
      expect(getEvidence({ github: GH, live: LIVE })).toEqual([
         { kind: "live", label: "Live" },
      ]);
   });

   it("never returns more than two badges for real project data", () => {
      const featured = getFeaturedProjects();
      for (const project of featured) {
         expect(getEvidence(project).length).toBeLessThanOrEqual(2);
      }
      const repoOnly = featured.filter(
         (project) => project.github && !hasProjectUrl(project.live),
      );
      expect(repoOnly.length).toBeGreaterThan(0);
      for (const project of repoOnly) {
         expect(getEvidence(project)[0]?.kind).toBe("source");
      }
   });
});
