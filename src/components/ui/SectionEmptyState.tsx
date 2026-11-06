import { motion } from "motion/react";
import { fadeInUp, VIEWPORT_MARGIN } from "@utils/animations";
import { MONO_FONT, TEXT_MUTED } from "@/constants/theme";

interface SectionEmptyStateProps {
   /** One quiet line, from the section's own copy in data/sections.json. */
   message: string;
   /** Sits under a subsection heading instead of directly under the header. */
   indented?: boolean;
}

/**
 * The placeholder a section shows while its data is empty: the section keeps
 * its number, title, header rule and mascot, and this line takes the place of
 * the content. Fill the JSON and the real content comes back on its own -- no
 * component changes.
 */
const SectionEmptyState = ({
   message,
   indented = false,
}: SectionEmptyStateProps) => (
   <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: VIEWPORT_MARGIN }}
      variants={fadeInUp}
      style={{
         margin: 0,
         marginTop: indented ? 0 : 28,
         padding: "4px 0 4px 14px",
         borderLeft: "2px solid rgb(var(--ch-blue-light) / 0.45)",
         fontFamily: MONO_FONT,
         fontSize: 12.5,
         lineHeight: 1.9,
         color: TEXT_MUTED,
      }}
   >
      {message}
   </motion.p>
);

export default SectionEmptyState;
