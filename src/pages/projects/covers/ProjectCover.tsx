import { Suspense, useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import ErrorBoundary from "@components/common/ErrorBoundary";
import useFreezeAnimations from "@hooks/useFreezeAnimations";
import useMotionPreference from "@hooks/useMotionPreference";
import usePauseOffscreen from "@hooks/usePauseOffscreen";
import useSceneClock from "@hooks/useSceneClock";
import { getProjectCover } from "./coverRegistry";
import { BASE_GRADIENT } from "./kit/sceneTokens";

interface ProjectCoverProps {
   projectId: number;
   accent: string;
}

const SCENE_MOUNT_MARGIN = "300px 0px";

const SCENE_PLACEHOLDER = BASE_GRADIENT;

const FILL: CSSProperties = { position: "absolute", inset: 0 };

const SCENE_FAILED = <div style={{ ...FILL, background: SCENE_PLACEHOLDER }} />;

const ProjectCover = ({ projectId, accent }: ProjectCoverProps) => {
   const cover = getProjectCover(projectId);
   const frameRef = useRef<HTMLDivElement>(null);
   const nearViewport = useInView(frameRef, { margin: SCENE_MOUNT_MARGIN });
   const { preference } = useMotionPreference();
   useFreezeAnimations(frameRef);
   usePauseOffscreen(frameRef);
   useSceneClock(frameRef);
   if (!cover) return null;

   let media: ReactNode;
   if (nearViewport) {
      media = (
         <div
            className="project-cover-img"
            data-cover-scene=""
            aria-hidden="true"
            style={FILL}
         >
            <ErrorBoundary fallback={SCENE_FAILED}>
               <Suspense fallback={<div className="skeleton" style={FILL} />}>
                  <cover.Scene
                     key={preference}
                     tint={accent}
                     variant={cover.variant}
                  />
               </Suspense>
            </ErrorBoundary>
         </div>
      );
   } else {
      media = (
         <div
            aria-hidden="true"
            style={{ ...FILL, background: SCENE_PLACEHOLDER }}
         />
      );
   }

   return (
      <div
         ref={frameRef}
         className="project-cover"
         style={{
            position: "relative",
            overflow: "hidden",
            containerType: "inline-size",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "#0c111b",
         }}
      >
         {media}

         <div
            aria-hidden="true"
            style={{
               ...FILL,
               background:
                  "linear-gradient(180deg, transparent 72%, rgb(13 18 29 / 0.85) 100%)",
               pointerEvents: "none",
            }}
         />
      </div>
   );
};

export default ProjectCover;
