import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import {
   copyFileSync,
   mkdirSync,
   readdirSync,
   readFileSync,
   writeFileSync,
} from "node:fs";
import { buildMachineFiles } from "./scripts/machine-view.js";
import { createSecurityHeaders } from "./scripts/security-policy.js";

const indexHtml = readFileSync(
   new URL("./index.html", import.meta.url),
   "utf8",
);

const PRIVATE_DATA = new Set(["contact.json"]);
function publishData() {
   return {
      name: "publish-data",
      apply: "build",
      closeBundle() {
         const src = new URL("./data/", import.meta.url);
         const out = new URL("./build/data/", import.meta.url);
         mkdirSync(out, { recursive: true });
         for (const file of readdirSync(src)) {
            if (file.endsWith(".json") && !PRIVATE_DATA.has(file)) {
               copyFileSync(new URL(file, src), new URL(file, out));
            }
         }
      },
   };
}

const MACHINE_TYPES = new Map([
   ["llms.txt", "text/plain; charset=utf-8"],
   ["index.md", "text/markdown; charset=utf-8"],
   ["nexza.vcf", "text/vcard; charset=utf-8"],
   ["rss.xml", "application/rss+xml; charset=utf-8"],
]);
function machineView() {
   const root = fileURLToPath(new URL(".", import.meta.url));
   let config;
   return {
      name: "machine-view",
      configResolved(resolved) {
         config = resolved;
      },
      closeBundle() {
         if (config.command !== "build") return;
         const out = resolve(config.root, config.build.outDir);
         for (const [file, body] of buildMachineFiles(root)) {
            writeFileSync(resolve(out, file), body);
         }
      },
      configureServer(server) {
         server.middlewares.use((req, res, next) => {
            const path = req.url?.split("?")[0] ?? "";
            const file = path.slice(config.base.length);
            if (!path.startsWith(config.base) || !MACHINE_TYPES.has(file)) {
               return next();
            }
            res.setHeader("Content-Type", MACHINE_TYPES.get(file));
            res.end(buildMachineFiles(root).get(file));
         });
      },
   };
}

const PRELOAD_FONTS = [
   "yellowtail-latin-400-normal.woff2",
   "bricolage-grotesque-latin-opsz-normal.woff2",
];
function preloadFonts() {
   let base = "/";
   return {
      name: "preload-fonts",
      apply: "build",
      configResolved(resolved) {
         base = resolved.base;
      },
      transformIndexHtml(_html, { bundle = {} }) {
         const assets = Object.values(bundle).filter(
            (output) => output.type === "asset",
         );
         return PRELOAD_FONTS.map((name) => {
            const asset = assets.find((output) => output.names.includes(name));
            if (!asset) {
               throw new Error(`preload-fonts: ${name} is not in the bundle`);
            }
            return {
               tag: "link",
               attrs: {
                  rel: "preload",
                  as: "font",
                  type: "font/woff2",
                  href: base + asset.fileName,
                  crossorigin: true,
               },
               injectTo: "head",
            };
         });
      },
   };
}

export default defineConfig(() => ({
   plugins: [
      tailwindcss(),
      react(),
      publishData(),
      machineView(),
      preloadFonts(),
   ],
   base: "/",
   resolve: {
      alias: {
         "@": fileURLToPath(new URL("./src", import.meta.url)),
         "@components": fileURLToPath(
            new URL("./src/components", import.meta.url),
         ),
         "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
         "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
         "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
         "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
         "@data": fileURLToPath(new URL("./src/data", import.meta.url)),
      },
   },
   server: {
      headers: createSecurityHeaders(indexHtml, true),
      port: 3000,
      open: false,
      host: "0.0.0.0",
      allowedHosts: true,
   },
   preview: {
      headers: createSecurityHeaders(indexHtml),
   },
   build: {
      outDir: "build",
      sourcemap: false,
      target: "esnext",
      cssCodeSplit: true,
      rollupOptions: {
         output: {
            manualChunks(id) {
               if (!id.includes("node_modules")) return;
               const normalized = id.replaceAll("\\", "/");
               if (
                  /\/node_modules\/(react|react-dom|scheduler)\//.test(
                     normalized,
                  )
               )
                  return "react-vendor";
               if (normalized.includes("/node_modules/motion/"))
                  return "motion-vendor";
               if (normalized.includes("/node_modules/lenis/"))
                  return "scroll-vendor";
               if (normalized.includes("/node_modules/cmdk/"))
                  return "palette-vendor";
               if (normalized.includes("/node_modules/@emailjs/"))
                  return "email-vendor";
            },
         },
      },
      chunkSizeWarningLimit: 1000,
   },
   test: {
      environment: "jsdom",
      pool: "threads",
      maxWorkers: 1,
      globals: true,
      setupFiles: ["./src/__tests__/setup.ts"],
      include: [
         "src/**/*.test.{js,jsx,ts,tsx}",
         "scripts/**/*.test.{js,jsx,ts,tsx}",
      ],
   },
}));
