import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
   createCloudflareHeaders,
   createContentSecurityPolicy,
   createSecurityHeaders,
} from "./security-policy.js";

const html = readFileSync("index.html", "utf8");
const deployedHeaders = readFileSync("public/_headers", "utf8");

describe("shared security policy", () => {
   it("generates the deployed CSP and required headers from one policy", () => {
      const expected = createContentSecurityPolicy(html);
      expect(deployedHeaders).toContain(`Content-Security-Policy: ${expected}`);
      expect(deployedHeaders).toContain("Strict-Transport-Security:");
      expect(deployedHeaders).toContain("X-Content-Type-Options: nosniff");
      expect(deployedHeaders).toContain(
         "Referrer-Policy: strict-origin-when-cross-origin",
      );
      expect(deployedHeaders).toContain("frame-ancestors 'none'");
      expect(deployedHeaders).toContain(
         "Cross-Origin-Embedder-Policy: credentialless",
      );
      expect(deployedHeaders).toContain(
         "Cache-Control: public, max-age=31536000, immutable",
      );
      expect(deployedHeaders).toContain("Cache-Control: no-cache");
      expect(expected).not.toMatch(/analytics|googletagmanager/i);
   });

   it("provides a development CSP for Vite without changing production policy", () => {
      const developmentHeaders = createSecurityHeaders(html, true);
      expect(developmentHeaders["Content-Security-Policy"]).toContain(
         "ws: wss:",
      );
      expect(developmentHeaders["Content-Security-Policy"]).toContain(
         "'unsafe-inline'",
      );
      expect(createCloudflareHeaders(html)).toBe(deployedHeaders);
   });
});
