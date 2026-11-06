import { useMemo } from "react";
import { getCodingPlatformStats } from "@data/achievements";
import { getGitHubUsername } from "@data/personal";
import { getSectionCopy } from "@data/sections";
import { MAX_WIDTH_WIDE } from "@/constants/theme";
import PageSection from "@components/layout/PageSection";
import SectionEmptyState from "@components/ui/SectionEmptyState";
import GitHubCard from "./GitHubCard";

const Stats = () => {
   const username = getGitHubUsername();
   const { title, subtitle, empty } = getSectionCopy("stats");
   const githubStats = useMemo(() => getCodingPlatformStats().github, []);

   return (
      <PageSection
         id="stats"
         title={title}
         subtitle={subtitle}
         maxWidth={MAX_WIDTH_WIDE}
      >
         <div style={{ maxWidth: MAX_WIDTH_WIDE, margin: "0 auto" }}>
            {githubStats ? (
               <GitHubCard username={username} stats={githubStats} />
            ) : (
               <SectionEmptyState message={empty} />
            )}
         </div>
      </PageSection>
   );
};

export default Stats;
