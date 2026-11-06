import { lazy, Suspense, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import "@utils/chunkReload";

import "@utils/sceneClock";
import Nav from "@components/layout/Navigation/Nav";
import Hero from "@components/layout/Header/Hero";
import AmbientBackground from "@components/layout/AmbientBackground";
import IntroSplash from "@components/layout/IntroSplash";
import DeferredSection from "@components/layout/DeferredSection";
import ErrorBoundary from "@components/common/ErrorBoundary";
import ScrollProgress from "@components/ui/ScrollProgress";
import BackToTop from "@components/ui/BackToTop";
import MotionPreferenceControl from "@components/ui/MotionPreferenceControl";
import CommandPaletteHost from "@components/ui/CommandPalette/CommandPaletteHost";
import { BreakpointProvider } from "@hooks/BreakpointProvider";
import { MotionPreferenceProvider } from "@hooks/MotionPreferenceProvider";
import { SectionNavigationProvider } from "@hooks/SectionNavigationProvider";
import useMotionPreference from "@hooks/useMotionPreference";
import useLenisOnDemand from "@hooks/useLenisOnDemand";
import { CONTENT_SECTIONS } from "@/constants/sections";
import { getUiCopy } from "@data/ui";

const LENIS_OPTIONS = {
   lerp: 0.1,
   smoothWheel: true,
   wheelMultiplier: 1.1,
   touchMultiplier: 1.5,
   syncTouch: false,

   respectReducedMotion: false,

   autoRaf: false,
};

const StackFieldBackdrop = lazy(
   () => import("@components/layout/StackFieldBackdrop"),
);

const OMIT_BACKDROP = <></>;

const Footer = lazy(() => import("@components/layout/Footer/Footer"));
const FOOTER_PLACEHOLDER = (
   <div aria-hidden="true" className="footer-fade" style={{ minHeight: 480 }} />
);

const About = lazy(() => import("@pages/about/About"));
const News = lazy(() => import("@pages/news/News"));
const Experience = lazy(() => import("@pages/experience/Experience"));
const Skill = lazy(() => import("@pages/skill/Skill"));
const Education = lazy(() => import("@pages/education/Education"));
const Services = lazy(() => import("@pages/services/Services"));
const Projects = lazy(() => import("@pages/projects/Projects"));
const Achievement = lazy(() => import("@pages/achievement/Achievement"));
const Contact = lazy(() => import("@pages/contact/Contact"));
const Stats = lazy(() => import("@pages/stats/Stats"));

const SECTION_COMPONENTS = {
   about: About,
   news: News,
   experience: Experience,
   education: Education,
   skills: Skill,
   projects: Projects,
   achievements: Achievement,
   services: Services,
   stats: Stats,
   contact: Contact,
};

const SmoothScroll = ({ children }: { children: ReactNode }) => {
   const { reducedMotion } = useMotionPreference();
   useLenisOnDemand();
   return (
      <>
         {!reducedMotion && <ReactLenis root options={LENIS_OPTIONS} />}
         {children}
      </>
   );
};

const AppContent = () => {
   return (
      <SmoothScroll>
         <SectionNavigationProvider>
            <ErrorBoundary>
               <ScrollProgress />
               <IntroSplash />
               <AmbientBackground />
               {}
               <ErrorBoundary fallback={OMIT_BACKDROP}>
                  <Suspense fallback={null}>
                     <StackFieldBackdrop />
                  </Suspense>
               </ErrorBoundary>
               <div className="relative min-h-dvh">
                  <a href="#main-content" className="skip-link">
                     {getUiCopy().skip_link}
                  </a>
                  <Nav />
                  <main id="main-content" tabIndex={-1}>
                     <Hero />
                     {CONTENT_SECTIONS.map(({ id, label, surface }) => {
                        const Section = SECTION_COMPONENTS[id];
                        return (
                           <DeferredSection
                              key={id}
                              id={id}
                              label={label}
                              surface={surface}
                           >
                              <Section />
                           </DeferredSection>
                        );
                     })}
                  </main>
                  {}
                  <ErrorBoundary fallback={<></>}>
                     <Suspense fallback={FOOTER_PLACEHOLDER}>
                        <Footer />
                     </Suspense>
                  </ErrorBoundary>
                  <BackToTop />
                  <MotionPreferenceControl />
                  <CommandPaletteHost />
               </div>
            </ErrorBoundary>
         </SectionNavigationProvider>
      </SmoothScroll>
   );
};

const App = () => (
   <BreakpointProvider>
      <MotionPreferenceProvider>
         <AppContent />
      </MotionPreferenceProvider>
   </BreakpointProvider>
);

export default App;
