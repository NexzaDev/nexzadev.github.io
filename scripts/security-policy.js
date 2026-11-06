import { createHash } from "node:crypto";

const getJsonLdHash = (html) => {
   const match = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
   );
   if (!match) throw new Error("The page must contain a JSON-LD script.");
   const digest = createHash("sha256")
      .update(match[1].replaceAll("\r\n", "\n"))
      .digest("base64");
   return `'sha256-${digest}'`;
};

export const createContentSecurityPolicy = (html, development = false) => {
   const scriptPolicy = development
      ? "script-src 'self' 'unsafe-inline'"
      : `script-src 'self' ${getJsonLdHash(html)}`;
   const connectPolicy = development
      ? "connect-src 'self' https://api.emailjs.com https://github-contributions-api.jogruber.de ws: wss:"
      : "connect-src 'self' https://api.emailjs.com https://github-contributions-api.jogruber.de";
   return [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      scriptPolicy,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.credly.com",
      "font-src 'self' data:",
      connectPolicy,
      "media-src 'self'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self' mailto:",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
      "upgrade-insecure-requests",
   ].join("; ");
};

export const createSecurityHeaders = (html, development = false) => ({
   "Content-Security-Policy": createContentSecurityPolicy(html, development),
   "X-Content-Type-Options": "nosniff",
   "Referrer-Policy": "strict-origin-when-cross-origin",
   "Permissions-Policy":
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()",
   "X-Frame-Options": "DENY",
   "Cross-Origin-Opener-Policy": "same-origin",
   "Cross-Origin-Embedder-Policy": "credentialless",
   "Cross-Origin-Resource-Policy": "same-origin",
});

export const createCloudflareHeaders = (html) => {
   const headers = createSecurityHeaders(html);
   const lines = ["/*"];
   for (const [name, value] of Object.entries(headers)) {
      lines.push(`  ${name}: ${value}`);
   }
   lines.push(
      "  Strict-Transport-Security: max-age=31536000; includeSubDomains",
   );
   lines.push("", "/", "  Cache-Control: no-cache");
   lines.push("", "/index.html", "  Cache-Control: no-cache");
   lines.push("", "/*.html", "  Cache-Control: no-cache");
   lines.push(
      "",
      "/assets/*",
      "  Cache-Control: public, max-age=31536000, immutable",
      "",
   );
   return lines.join("\n");
};
