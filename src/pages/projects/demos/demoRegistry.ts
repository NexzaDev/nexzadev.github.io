import type { ComponentType } from "react";
import { getSectionCopy } from "@data/sections";
import { lazy } from "react";

export interface ProjectDemoProps {
   accent: string;
   isMobile: boolean;
}

interface ProjectDemo {
   label: string;
   Demo: ComponentType<ProjectDemoProps>;
}

const TerminalDemo = lazy(() => import("./TerminalDemo"));

const DEMO_BY_ID: Record<number, ComponentType<ProjectDemoProps>> = {
   1: TerminalDemo,
};

const DEMO_LABELS = getSectionCopy("projects").modal.demos ?? {};

export const getProjectDemo = (id: number): ProjectDemo | undefined => {
   const Demo = DEMO_BY_ID[id];
   return Demo ? { label: DEMO_LABELS[id] ?? "", Demo } : undefined;
};
