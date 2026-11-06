import type { ComponentType, LazyExoticComponent } from "react";
import type { EngagementSceneKey } from "@/types";
import type { TintProps } from "@pages/projects/covers/kit/sceneTokens";

export type EngagementScene = LazyExoticComponent<ComponentType<TintProps>>;

export const ENGAGEMENT_SCENES: Partial<
   Record<EngagementSceneKey, EngagementScene>
> = {};
