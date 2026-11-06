import type { SkillIcon } from "@utils/skillIcons";
import { getSkillIcon } from "@utils/skillIcons";

export const AVATAR_SIZE = 320;
export const DISC_DIAMETER = 168;
export const ORBIT_RADIUS = 124;
export const TILE_SIZE = 40;
export const TILE_RADIUS = 12;
export const GLYPH_SIZE = 18;

export const ORBIT_PERIOD = 40;

export const CARD_FILL = "var(--color-bg-card)";
export const HAIRLINE = "rgba(255, 255, 255, 0.06)";

const ORBIT_SKILLS = [
   "Linux",
   "Python",
   "Lua",
   "Bash",
   "TypeScript",
   "JavaScript",
   "Next.js",
   "Node.js",
] as const;

interface OrbitItem {
   name: string;
   Icon: SkillIcon["Icon"];
   color: string;

   angle: number;
}

const ORBIT_STEP = 360 / ORBIT_SKILLS.length;

export const orbitItems: OrbitItem[] = ORBIT_SKILLS.flatMap((name, index) => {
   const skill = getSkillIcon(name);
   if (!skill) return [];
   return [
      { name, Icon: skill.Icon, color: skill.color, angle: index * ORBIT_STEP },
   ];
});

export const orbitPosition = (angle: number) => {
   const rad = (angle * Math.PI) / 180;
   const centre = AVATAR_SIZE / 2;
   return {
      x: Math.round(centre + ORBIT_RADIUS * Math.sin(rad)),
      y: Math.round(centre - ORBIT_RADIUS * Math.cos(rad)),
   };
};
