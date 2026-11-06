import { useMemo } from "react";
import {
   getCertifications,
   getLearningBadges,
   getAchievements,
} from "@data/achievements";
import { getSectionCopy } from "@data/sections";
import PageSection from "@components/layout/PageSection";
import SectionEmptyState from "@components/ui/SectionEmptyState";
import { MAX_WIDTH } from "@/constants/theme";
import { LEVEL_ORDER } from "./achievementConstants";
import CertBadgeShowcase from "./CertBadgeShowcase";
import BadgesSection from "./BadgesSection";
import CompetitionsSection from "./CompetitionsSection";

/* Certifications, learning badges and competition results all come from
   data/achievements.json. While all three are empty the section keeps its
   header and shows one quiet line instead of three empty subsections. */
const Achievement = () => {
   const { title, subtitle, empty } = getSectionCopy("achievements");
   const rawCertifications = useMemo(() => getCertifications(), []);
   const learningBadges = useMemo(() => getLearningBadges(), []);
   const achievements = useMemo(() => getAchievements(), []);

   const certifications = useMemo(
      () =>
         [...rawCertifications].sort(
            (a, b) =>
               (LEVEL_ORDER[a.level ?? ""] ?? 99) -
               (LEVEL_ORDER[b.level ?? ""] ?? 99),
         ),
      [rawCertifications],
   );

   const isEmpty =
      certifications.length === 0 &&
      learningBadges.length === 0 &&
      achievements.length === 0;

   if (isEmpty) {
      return (
         <PageSection id="achievements" title={title} subtitle={subtitle}>
            <div style={{ maxWidth: MAX_WIDTH, margin: "0 auto" }}>
               <SectionEmptyState message={empty} />
            </div>
         </PageSection>
      );
   }

   return (
      <PageSection id="achievements" title={title} subtitle={subtitle}>
         <div
            style={{
               maxWidth: MAX_WIDTH,
               margin: "0 auto",
               display: "flex",
               flexDirection: "column",
               gap: 48,
            }}
         >
            <CertBadgeShowcase certifications={certifications} />
            <BadgesSection badges={learningBadges} />
            <CompetitionsSection achievements={achievements} />
         </div>
      </PageSection>
   );
};

export default Achievement;
