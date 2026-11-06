import { useMemo } from "react";
import { motion } from "motion/react";
import { getSectionCopy } from "@data/sections";
import { getServices } from "@data/services";
import { staggerContainer } from "@utils/animations";
import { MAX_WIDTH } from "@/constants/theme";
import PageSection from "@components/layout/PageSection";
import SectionEmptyState from "@components/ui/SectionEmptyState";
import ServiceCard from "./ServiceCard";
import "./services.css";

/* The six focus-area cards are driven by data/services.json. With no entries
   the section keeps its header and shows the quiet empty line instead; each
   card's key still has to be registered in ServiceAnimation.tsx. */
const Services = () => {
   const services = useMemo(() => getServices(), []);
   const { title, subtitle, empty } = getSectionCopy("services");

   if (services.length === 0) {
      return (
         <PageSection id="services" title={title} subtitle={subtitle}>
            <div style={{ maxWidth: MAX_WIDTH, margin: "0 auto" }}>
               <SectionEmptyState message={empty} />
            </div>
         </PageSection>
      );
   }

   return (
      <PageSection id="services" title={title} subtitle={subtitle}>
         <motion.div
            className="service-grid"
            style={{
               maxWidth: MAX_WIDTH,
               margin: "0 auto",
            }}
            variants={staggerContainer}
         >
            {services.map((service, i) => (
               <ServiceCard key={service.id} service={service} index={i} />
            ))}
         </motion.div>
      </PageSection>
   );
};

export default Services;
