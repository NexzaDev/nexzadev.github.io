import { Suspense, useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import ErrorBoundary from "@components/common/ErrorBoundary";
import useFreezeAnimations from "@hooks/useFreezeAnimations";
import useMotionPreference from "@hooks/useMotionPreference";
import usePauseOffscreen from "@hooks/usePauseOffscreen";
import useSceneClock from "@hooks/useSceneClock";
import type { EngagementSceneKey } from "@/types";
import { BASE_GRADIENT } from "@pages/projects/covers/kit/sceneTokens";
import { ENGAGEMENT_SCENES } from "./sceneRegistry";

interface EngagementSceneProps {
   scene: EngagementSceneKey;
   tint: string;

   style: CSSProperties;

   fade?: boolean;
}

const MOUNT_MARGIN = "300px 0px";

const SCENE_FAILED = <></>;

const BOTTOM_FADE: CSSProperties = {
   position: "absolute",
   inset: 0,
   pointerEvents: "none",
   background:
      "linear-gradient(180deg, transparent 72%, rgb(13 18 29 / 0.85) 100%)",
};

const EngagementScene = ({
   scene,
   tint,
   style,
   fade = false,
}: Readonly<EngagementSceneProps>) => {
   const slotRef = useRef<HTMLDivElement>(null);
   const nearViewport = useInView(slotRef, { margin: MOUNT_MARGIN });
   const { preference } = useMotionPreference();
   useFreezeAnimations(slotRef);
   usePauseOffscreen(slotRef);
   useSceneClock(slotRef);
   const Scene = ENGAGEMENT_SCENES[scene];

   if (!Scene) return null;

   return (
      <div
         ref={slotRef}
         aria-hidden="true"
         data-engagement-scene={scene}
         style={{
            position: "relative",
            overflow: "hidden",

            background: BASE_GRADIENT,
            ...style,
         }}
      >
         {nearViewport && (
            <ErrorBoundary fallback={SCENE_FAILED}>
               <Suspense fallback={null}>
                  <Scene key={preference} tint={tint} />
               </Suspense>
            </ErrorBoundary>
         )}
         {fade && <div style={BOTTOM_FADE} />}
      </div>
   );
};

export default EngagementScene;
