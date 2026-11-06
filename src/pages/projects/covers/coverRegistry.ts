import type { ComponentType } from "react";
import { lazy } from "react";

interface SceneCoverProps {
   tint: string;
   variant?: string;
}

type SceneComponent = ComponentType<SceneCoverProps>;

const ScanScene = lazy(() => import("./ScanScene"));
const FallbackScene = lazy(() => import("./FallbackScene"));

type ProjectCover = {
   kind: "scene";
   Scene: SceneComponent;
   variant?: string;
};

const COVER_BY_ID: Record<number, ProjectCover> = {
   1: { kind: "scene", Scene: ScanScene },
};

const FALLBACK_COVER: ProjectCover = {
   kind: "scene",
   Scene: FallbackScene,
};

export const getProjectCover = (id: number): ProjectCover =>
   COVER_BY_ID[id] ?? FALLBACK_COVER;
