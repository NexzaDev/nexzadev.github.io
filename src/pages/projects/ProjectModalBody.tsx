import {
   Suspense,
   useEffect,
   useRef,
   useState,
   type ComponentType,
   type ReactNode,
} from "react";
import { motion } from "motion/react";
import {
   ExternalLink,
   Sparkles,
   Check,
   Play,
   CircleAlert,
   Copy,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import ErrorBoundary from "@components/common/ErrorBoundary";
import TechTag from "@components/ui/TechTag";
import GlossText from "@components/ui/GlossText";
import CaseStudyBrief from "@components/ui/CaseStudyBrief";
import { getSectionCopy } from "@data/sections";
import { newTabLabel } from "@data/ui";
import { fillTemplate } from "@utils/fillTemplate";
import { hasProjectUrl } from "@utils/projectMetadata";
import { projectShareUrl, projectSlug } from "@utils/projectLink";
import {
   TEXT_SECONDARY,
   TEXT_MUTED,
   MONO_FONT,
   DURATION,
   EASING,
} from "@/constants/theme";
import type { CategoryColors, ProjectWithCategory } from "./projectConstants";
import { getProjectDemo } from "./demos/demoRegistry";
import NmapFlow from "./demos/NmapFlow";

interface ProjectModalBodyProps {
   project: ProjectWithCategory;
   colors: CategoryColors;
   isMobile: boolean;
}

const fadeInUpProps = (delay: number) => ({
   initial: { opacity: 0, y: 10 },
   animate: { opacity: 1, y: 0 },
   transition: { delay, duration: DURATION.default, ease: EASING.cinematic },
});

const PROJECT_MODAL_COPY = getSectionCopy("projects").modal;

const sectionLabelStyle: React.CSSProperties = {
   fontSize: 11,
   color: TEXT_MUTED,
   fontWeight: 600,
   textTransform: "uppercase",
   letterSpacing: "0.06em",
   marginBottom: 8,
};

interface ModalLinkProps {
   href: string;
   ariaLabel: string;
   icon: ComponentType<{ size?: number }>;
   label: string;

   kind: "primary" | "outline";
}

const ModalLink = ({
   href,
   ariaLabel,
   icon: Icon,
   label,
   kind,
}: ModalLinkProps) => (
   <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={kind === "primary" ? "btn-primary" : "btn-outline"}
      style={{
         display: "inline-flex",
         alignItems: "center",
         gap: 8,
         padding: "10px 18px",
         fontSize: 13,
         textDecoration: "none",
      }}
      aria-label={newTabLabel(ariaLabel)}
   >
      <Icon size={15} />
      {label}
   </a>
);

interface SectionProps {
   delay: number;
   label?: ReactNode;
   children: ReactNode;
   order?: string;
}

const Section = ({ delay, label, children, order }: SectionProps) => (
   <motion.div data-modal-section={order} {...fadeInUpProps(delay)}>
      {label && <p style={sectionLabelStyle}>{label}</p>}
      {children}
   </motion.div>
);

const NmapCopyLink = ({ title }: { title: string }) => {
   const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
   const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const copy = async () => {
      try {
         await navigator.clipboard.writeText(
            projectShareUrl(projectSlug(title)),
         );
         setState("copied");
      } catch {
         setState("failed");
      }
      if (resetRef.current) clearTimeout(resetRef.current);
      resetRef.current = setTimeout(() => setState("idle"), 1600);
   };
   useEffect(
      () => () => {
         if (resetRef.current) clearTimeout(resetRef.current);
      },
      [],
   );
   const Icon =
      state === "copied" ? Check : state === "failed" ? CircleAlert : Copy;
   const text =
      state === "copied"
         ? PROJECT_MODAL_COPY.link_copied
         : state === "failed"
           ? PROJECT_MODAL_COPY.copy_failed
           : PROJECT_MODAL_COPY.copy_link;

   return (
      <button
         type="button"
         className="project-copy-link nmap-copy-link"
         onClick={() => void copy()}
         aria-live="polite"
      >
         <Icon size={14} aria-hidden="true" />
         {text}
      </button>
   );
};

const ProjectModalBody = ({
   project,
   colors,
   isMobile,
}: ProjectModalBodyProps) => {
   const features = project.features ?? [];
   const contributors = project.contributors ?? [];
   const hasGithub = hasProjectUrl(project.github);
   const hasLive = hasProjectUrl(project.live);
   const demo = getProjectDemo(project.id);
   const brief = project.case_study;
   const { links: linkLabels, modal: modalCopy } = getSectionCopy("projects");

   const links = (hasGithub || hasLive) && (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
         {hasLive && (
            <ModalLink
               href={project.live}
               ariaLabel={fillTemplate(linkLabels.live_label, {
                  title: project.title,
               })}
               icon={ExternalLink}
               label={linkLabels.live}
               kind="primary"
            />
         )}
         {hasGithub && (
            <ModalLink
               href={project.github}
               ariaLabel={fillTemplate(linkLabels.source_label, {
                  title: project.title,
               })}
               icon={FaGithub}
               label={linkLabels.view_source}
               kind="outline"
            />
         )}
      </div>
   );

   if (project.title === "Nmap-NSE-Script-Collection") {
      return (
         <div
            style={{
               padding: isMobile ? "16px 14px 24px" : "20px 24px 28px",
               display: "flex",
               flexDirection: "column",
               gap: 20,
            }}
         >
            <motion.p
               data-modal-section="overview"
               {...fadeInUpProps(0.18)}
               style={{
                  color: TEXT_SECONDARY,
                  fontSize: isMobile ? 13 : 14,
                  lineHeight: 1.7,
               }}
            >
               <GlossText text={project.description} />
            </motion.p>
            {demo && (
               <Section delay={0.21} order="sample-scan" label="Sample scan">
                  <ErrorBoundary fallback={<div style={{ height: 360 }} />}>
                     <Suspense
                        fallback={
                           <div className="skeleton" style={{ height: 360 }} />
                        }
                     >
                        <demo.Demo accent={colors.accent} isMobile={isMobile} />
                     </Suspense>
                  </ErrorBoundary>
               </Section>
            )}
            <Section delay={0.24} order="flow">
               <NmapFlow accent={colors.accent} isMobile={isMobile} />
            </Section>
            {features.length > 0 && (
               <Section
                  delay={0.27}
                  order="features"
                  label={modalCopy.features}
               >
                  <ul
                     style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                     }}
                  >
                     {features.map((feature) => (
                        <li
                           key={feature}
                           style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              color: TEXT_SECONDARY,
                              fontSize: isMobile ? 12 : 13,
                              lineHeight: 1.6,
                           }}
                        >
                           <Check
                              aria-hidden="true"
                              size={14}
                              style={{
                                 color: colors.accent,
                                 marginTop: 3,
                                 flexShrink: 0,
                              }}
                           />
                           <span style={{ flex: 1 }}>{feature}</span>
                        </li>
                     ))}
                  </ul>
               </Section>
            )}
            {project.tools_tech.length > 0 && (
               <Section delay={0.3} order="technology" label={modalCopy.tech}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                     {project.tools_tech.map((tool) => (
                        <TechTag
                           key={tool}
                           label={tool}
                           accent={colors.accent}
                           size={11}
                        />
                     ))}
                  </div>
               </Section>
            )}
            <Section delay={0.33} order="links">
               <div className="nmap-actions">
                  {hasGithub && (
                     <ModalLink
                        href={project.github}
                        ariaLabel={fillTemplate(linkLabels.source_label, {
                           title: project.title,
                        })}
                        icon={FaGithub}
                        label={linkLabels.source}
                        kind="outline"
                     />
                  )}
                  <NmapCopyLink title={project.title} />
               </div>
            </Section>
         </div>
      );
   }

   return (
      <div
         style={{
            padding: isMobile ? "16px 14px 24px" : "20px 24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
         }}
      >
         <motion.p
            {...fadeInUpProps(0.18)}
            style={{
               color: TEXT_SECONDARY,
               fontSize: isMobile ? 13 : 14,
               lineHeight: 1.7,
            }}
         >
            <GlossText text={project.description} />
         </motion.p>

         {brief ? (
            <Section delay={0.21} label={modalCopy.glance}>
               <CaseStudyBrief
                  brief={brief}
                  accent={colors.accent}
                  inspect={links || undefined}
               />
            </Section>
         ) : (
            links && <motion.div {...fadeInUpProps(0.21)}>{links}</motion.div>
         )}

         {project.tools_tech.length > 0 && (
            <Section delay={0.24} label={modalCopy.tech}>
               <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {project.tools_tech.map((t) => (
                     <TechTag
                        key={t}
                        label={t}
                        accent={colors.accent}
                        size={11}
                     />
                  ))}
               </div>
            </Section>
         )}

         {demo && (
            <Section
               delay={0.27}
               label={
                  <span
                     style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                     }}
                  >
                     <Play size={12} style={{ color: colors.accent }} />
                     {demo.label}
                  </span>
               }
            >
               <ErrorBoundary
                  fallback={<div style={{ height: isMobile ? 260 : 220 }} />}
               >
                  <Suspense
                     fallback={
                        <div
                           className="skeleton"
                           style={{ height: isMobile ? 260 : 220 }}
                        />
                     }
                  >
                     <demo.Demo accent={colors.accent} isMobile={isMobile} />
                  </Suspense>
               </ErrorBoundary>
            </Section>
         )}

         {features.length > 0 && (
            <Section
               delay={0.3}
               label={
                  <span
                     style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                     }}
                  >
                     <Sparkles size={12} style={{ color: colors.accent }} />
                     {modalCopy.features}
                  </span>
               }
            >
               <ul
                  style={{
                     display: "flex",
                     flexDirection: "column",
                     gap: 8,
                  }}
               >
                  {features.map((f) => (
                     <li
                        key={f}
                        style={{
                           display: "flex",
                           alignItems: "flex-start",
                           gap: 10,
                           color: TEXT_SECONDARY,
                           fontSize: isMobile ? 12 : 13,
                           lineHeight: 1.6,
                        }}
                     >
                        <Check
                           aria-hidden="true"
                           size={14}
                           style={{
                              color: colors.accent,
                              marginTop: 3,
                              flexShrink: 0,
                           }}
                        />
                        <span style={{ flex: 1 }}>{f}</span>
                     </li>
                  ))}
               </ul>
            </Section>
         )}

         {contributors.length > 0 && (
            <Section delay={0.36} label={modalCopy.contributors}>
               <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {contributors.map((c) => (
                     <span
                        key={c}
                        style={{
                           fontFamily: MONO_FONT,
                           fontSize: 11,
                           padding: "3px 8px",
                           borderRadius: 6,
                           background: "rgb(var(--ch-white) / 0.03)",
                           color: TEXT_SECONDARY,
                           border: "1px solid rgb(var(--ch-white) / 0.06)",
                        }}
                     >
                        {c}
                     </span>
                  ))}
               </div>
            </Section>
         )}
      </div>
   );
};

export default ProjectModalBody;
