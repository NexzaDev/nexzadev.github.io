import type { Project, ProjectStatus } from "@/types";
import { getSectionCopy } from "@data/sections";
import { hasProjectUrl } from "@utils/projectMetadata";

const COPY = getSectionCopy("projects");

type EvidenceKind = "live" | "source";

interface Evidence {
   kind: EvidenceKind;
   label: string;
}

const MAX_BADGES = 2;

/**
 * Proof badges for a project card, derived only from existing links: a live
 * URL or, when there is no live URL, the public GitHub source. At most one.
 */
export const getEvidence = (
   project: Pick<Project, "live" | "github">,
): Evidence[] => {
   const isLive = hasProjectUrl(project.live);
   const badges: Evidence[] = [];

   if (isLive) badges.push({ kind: "live", label: COPY.evidence.live });
   else if (hasProjectUrl(project.github)) {
      badges.push({ kind: "source", label: COPY.evidence.source });
   }

   return badges.slice(0, MAX_BADGES);
};

export const STATUS_LABEL: Record<ProjectStatus, string> = COPY.project_status;
