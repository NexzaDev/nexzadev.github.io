import { describe, expect, it } from "vitest";
import { SKILL_ICON_COLOR, SKILL_ICON_MODE } from "@/constants/theme";
import {
   getSkillIcon,
   getSkillIconColor,
   getSkillIconNames,
} from "@utils/skillIcons";
import skills from "../../data/skills.json";

const ORIGINAL_COLORS: Record<string, string> = {
   Python: "#3776AB",
   JavaScript: "#F7DF1E",
   TypeScript: "#3178C6",
   "C++": "#649AD2",
   Java: "#ED8B00",
   HCL: "#844FBA",
   Bash: "#4EAA25",
   Go: "#00ADD8",
   "C#": "#8B72E9",
   R: "#276DC3",
   "HTML/CSS": "#E34F26",
   React: "#61DAFB",
   "Next.js": "#FFFFFF",
   Astro: "#FF5D01",
   Vite: "#646CFF",
   "Tailwind CSS": "#38BDF8",
   "Three.js": "#FFFFFF",
   Motion: "#F5F5F5",
   Redux: "#764ABC",
   MUI: "#007FFF",
   "shadcn/ui": "#FFFFFF",
   "React Router": "#F44250",
   Preact: "#9B6BE0",
   Vue: "#4FC08D",
   "Chart.js": "#FF6384",
   Axios: "#8C6BF0",
   Lucide: "#F56565",
   "Node.js": "#5FA04E",
   "Express.js": "#FFFFFF",
   FastAPI: "#009688",
   GraphQL: "#E10098",
   MongoDB: "#47A248",
   PostgreSQL: "#699ECA",
   MySQL: "#4479A1",
   Redis: "#FF4438",
   SQLite: "#6BB3DE",
   JWT: "#FB015B",
   SQLAlchemy: "#E2533A",
   "Drizzle ORM": "#C5F74F",
   Mongoose: "#E35B5B",
   Neon: "#00E599",
   Terraform: "#844FBA",
   Docker: "#2496ED",
   Ansible: "#EE4444",
   "GitHub Actions": "#2088FF",
   Jenkins: "#D24939",
   Linux: "#FCC624",
   "HCP Terraform": "#844FBA",
   PyTest: "#0A9EDC",
   Packer: "#02A8EF",
   TensorFlow: "#FF6F00",
   PyTorch: "#EE4C2C",
   "Scikit-learn": "#F7931E",
   "Pandas / NumPy": "#9A8FDB",
   "OpenCV / Image Processing": "#5C3EE8",
   "Apache Airflow": "#017CEE",
   Prefect: "#FFFFFF",
   Keras: "#D00000",
   Ollama: "#FFFFFF",
   "Claude Code": "#D97757",
   "GitHub Copilot": "#FFFFFF",
   Git: "#F05032",
   "VS Code": "#3EA8E5",
   "Jupyter Notebook": "#F37626",
   Postman: "#FF6C37",
   Figma: "#F24E1E",
   "Anthropic SDK": "#D97757",
   SonarQube: "#4E9BCD",
   Unity: "#FFFFFF",
   Vercel: "#FFFFFF",
   "Chrome Extensions": "#4285F4",
   "Cloudflare Workers": "#F38020",
   "Cloudflare R2": "#F38020",
   Render: "#FFFFFF",
   "GitHub Pages": "#FFFFFF",
   pnpm: "#F69220",
   esbuild: "#FFCF00",
};
const skillNames = [
   ...new Set(Object.values(skills).filter(Array.isArray).flat() as string[]),
];

describe("skill icon color system", () => {
   it("defaults to exact original brand colors for shared skills", () => {
      expect(SKILL_ICON_MODE).toBe("brand");
      const currentNames = new Set(getSkillIconNames());
      for (const [name, color] of Object.entries(ORIGINAL_COLORS)) {
         if (!currentNames.has(name)) continue;
         expect(getSkillIconColor(name), name).toBe(color);
         expect(getSkillIcon(name).color, name).toBe(color);
      }
   });

   it("provides a visible icon and color for every listed skill", () => {
      for (const name of skillNames) {
         const icon = getSkillIcon(name);
         expect(["function", "object"], name).toContain(typeof icon.Icon);
         expect(icon.color, name).toMatch(/^#[\da-f]{6}$/i);
      }
   });

   it("keeps the optional uniform mode on the shared token", () => {
      expect(SKILL_ICON_COLOR).toBe("#60a5fa");
      for (const name of skillNames) {
         expect(getSkillIconColor(name, "uniform"), name).toBe(
            SKILL_ICON_COLOR,
         );
      }
   });

   it("uses the requested colors for the added skills", () => {
      const expected: Record<string, string> = {
         Linux: "#FCC624",
         Bash: "#4EAA25",
         Python: "#3776AB",
         JavaScript: "#F7DF1E",
         TypeScript: "#3178C6",
         Lua: "#8B8FE8",
         HTML: "#E34F26",
         CSS: "#38BDF8",
         React: "#61DAFB",
         "Next.js": "#FFFFFF",
         "Node.js": "#5FA04E",
         MongoDB: "#47A248",
         GraphQL: "#E10098",
         MySQL: "#4479A1",
         "Git/GitHub": "#F05032",
         GitHub: "#FFFFFF",
         "VS Code": "#3EA8E5",
         Figma: "#F24E1E",
         Canva: "#60a5fa",
         CapCut: "#60a5fa",
         WebSockets: "#60a5fa",
         SQL: "#60a5fa",
      };
      for (const [name, color] of Object.entries(expected)) {
         expect(getSkillIconColor(name, "brand"), name).toBe(color);
      }
   });
});
