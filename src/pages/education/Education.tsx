import { useMemo } from "react";
import { motion } from "motion/react";
import { getEducation } from "@data/education";
import { getSectionCopy } from "@data/sections";
import { staggerContainer } from "@utils/animations";
import { SKY, MAX_WIDTH_NARROW } from "@/constants/theme";
import useBreakpoint from "@hooks/useBreakpoint";
import PageSection from "@components/layout/PageSection";
import SectionEmptyState from "@components/ui/SectionEmptyState";
import TimelineSpine from "@components/ui/TimelineSpine";
import EducationCard from "./EducationCard";

/* The timeline renders whatever data/education.json holds. With no entries
   the section keeps its number, title, rule and mascot, and shows the quiet
   empty line instead -- add entries to the JSON and the cards come back. */
const Education = () => {
   const education = useMemo(() => getEducation(), []);
   const { title, subtitle, empty } = getSectionCopy("education");
   const { isMobile } = useBreakpoint();

   return (
      <PageSection
         id="education"
         title={title}
         subtitle={subtitle}
         maxWidth={MAX_WIDTH_NARROW}
      >
         {education.length === 0 ? (
            <SectionEmptyState message={empty} />
         ) : (
            <motion.div variants={staggerContainer}>
               <TimelineSpine accentColor={SKY} count={education.length}>
                  {education.map((item, index) => (
                     <EducationCard
                        key={item.id}
                        item={item}
                        index={index}
                        isMobile={isMobile}
                     />
                  ))}
               </TimelineSpine>
            </motion.div>
         )}
      </PageSection>
   );
};

export default Education;
