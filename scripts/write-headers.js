import { readFileSync, writeFileSync } from "node:fs";
import { createCloudflareHeaders } from "./security-policy.js";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const headers = createCloudflareHeaders(html);
writeFileSync(new URL("../public/_headers", import.meta.url), headers);
