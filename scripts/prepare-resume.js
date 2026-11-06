import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { toResumeTex } from "./resume-tex.js";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = resolve(root, "data/cv.json");
const output = resolve(root, "public/resume-pages");
const cv = JSON.parse(await readFile(source, "utf8"));
await mkdir(output, { recursive: true });
await copyFile(source, resolve(output, "cv.json"));
await writeFile(resolve(output, "resume.tex"), toResumeTex(cv), "utf8");
