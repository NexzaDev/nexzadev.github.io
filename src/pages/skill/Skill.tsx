import { useMemo } from "react";
import {
   Braces,
   Compass,
   Database,
   PanelsTopLeft,
   Radar,
   Wrench,
} from "lucide-react";
import { getSkillCategoryLabel, getSkills } from "@data/skills";
import { getSectionCopy } from "@data/sections";
import type { SkillCategoryKey, SkillsData } from "@/types";
import { MAX_WIDTH } from "@/constants/theme";
import PageSection from "@components/layout/PageSection";
import SkillCategory, { type CategoryGlyph } from "./SkillCategory";
import SecondarySkills from "./SecondarySkills";

interface CategoryConfig {
   glyph: CategoryGlyph;

   rails: number;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
   networking: { glyph: Radar, rails: 1 },
   aws: { glyph: Database, rails: 2 },
   devops: { glyph: Wrench, rails: 2 },
   ai_tools: { glyph: Braces, rails: 1 },
   languages: { glyph: Braces, rails: 2 },
   backend: { glyph: Database, rails: 2 },
   frontend: { glyph: PanelsTopLeft, rails: 2 },
   tools_platforms: { glyph: Wrench, rails: 2 },
   cs_fundamentals: { glyph: Compass, rails: 1 },
   soft_skills: { glyph: Compass, rails: 1 },
   areas_of_interest: { glyph: Radar, rails: 1 },
};

const SECONDARY_GLYPHS: Record<string, CategoryGlyph> = {
   focus: Compass,
};

const Skill = () => {
   const skills: SkillsData = getSkills();
   const { title, subtitle } = getSectionCopy("skills");

   const primaryCategories = useMemo(() => {
      let railOffset = 0;
      return Object.entries(CATEGORY_CONFIG)
         .filter(([key]) => key in skills)
         .map(([key, { glyph, rails }]) => {
            const category = {
               key,
               label: getSkillCategoryLabel(key as SkillCategoryKey),
               glyph,
               rails,
               railOffset,
               items: skills[key as keyof SkillsData],
            };
            railOffset += rails;
            return category;
         });
   }, [skills]);

   const secondaryCategories = useMemo(
      () =>
         Object.entries(SECONDARY_GLYPHS)
            .filter(([key]) => key in skills)
            .map(([key, glyph]) => ({
               key,
               label: getSkillCategoryLabel(key as SkillCategoryKey),
               glyph,
               items: skills[key as keyof SkillsData],
            })),
      [skills],
   );

   return (
      <PageSection id="skills" title={title} subtitle={subtitle}>
         <div style={{ maxWidth: MAX_WIDTH, margin: "0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
               {primaryCategories.map(
                  ({ key, label, glyph, items, rails, railOffset }, index) => (
                     <SkillCategory
                        key={key}
                        label={label}
                        glyph={glyph}
                        items={items}
                        index={index}
                        rails={rails}
                        railOffset={railOffset}
                        breathe
                     />
                  ),
               )}
            </div>

            <SecondarySkills
               categories={secondaryCategories}
               railOffset={primaryCategories.reduce(
                  (sum, { rails }) => sum + rails,
                  0,
               )}
            />
         </div>
      </PageSection>
   );
};

export default Skill;
