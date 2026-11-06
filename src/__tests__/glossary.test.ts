import { describe, expect, it } from "vitest";
import { GLOSSARY, segmentGloss } from "@utils/glossary";
import personalData from "../../data/personal.json";
import projectsData from "../../data/projects.json";
import experienceData from "../../data/experience.json";
import skillsData from "../../data/skills.json";
import sectionsData from "../../data/sections.json";

const marked = (text: string) =>
   segmentGloss(text)
      .filter((segment) => segment.term)
      .map(({ at, text: part, term }) => ({ at, text: part, term }));
const entry = GLOSSARY[0];
const surface = entry.match[0];
const longSurface = [...entry.match].sort((a, b) => b.length - a.length)[0];
const DASHES = [0x2013, 0x2014].map((code) => String.fromCodePoint(code));

describe("segmentGloss", () => {
   it("returns no segments for an empty string and one plain run without terms", () => {
      expect(segmentGloss("")).toEqual([]);
      expect(segmentGloss("Plain words only.")).toEqual([
         { at: 0, text: "Plain words only." },
      ]);
   });

   it("covers the whole string with offsets that line up", () => {
      const text = `${surface} between words ${surface} again.`;
      const parts = segmentGloss(text);
      expect(parts.map((part) => part.text).join("")).toBe(text);
      for (const { at, text: part } of parts) {
         expect(text.slice(at, at + part.length)).toBe(part);
      }
   });

   it("marks only the first occurrence of each term", () => {
      expect(segmentGloss(`${surface} again ${surface}`)).toEqual([
         { at: 0, text: surface, term: entry.term },
         { at: surface.length, text: ` again ${surface}` },
      ]);
   });

   it("matches whole words only", () => {
      expect(marked(`YOUR ${surface} TODAY`)).toEqual([
         { at: 5, text: surface, term: entry.term },
      ]);
      expect(marked(`YOUR${surface}x`)).toEqual([]);
   });

   it("prefers the longest surface form", () => {
      expect(marked(longSurface)).toEqual([
         { at: 0, text: longSurface, term: entry.term },
      ]);
   });

   it("is case-sensitive", () => {
      expect(marked(surface.toLowerCase())).toEqual([]);
   });
});

describe("glossary entries", () => {
   it("only defines terms that occur in the site copy", () => {
      const copy = JSON.stringify([
         personalData,
         projectsData,
         experienceData,
         skillsData,
         sectionsData,
      ]);
      const found = new Set(marked(copy).map((segment) => segment.term));
      for (const { term } of GLOSSARY) expect(found.has(term), term).toBe(true);
   });

   it("keeps each definition to one short plain sentence", () => {
      for (const { term, definition } of GLOSSARY) {
         expect(definition.split(/\s+/).length, term).toBeLessThanOrEqual(22);
         expect(
            DASHES.some((dash) => definition.includes(dash)),
            term,
         ).toBe(false);
         expect(definition.endsWith("."), term).toBe(true);
      }
   });

   it("never maps one surface form to two terms", () => {
      const forms = GLOSSARY.flatMap(({ match }) => match);
      expect(new Set(forms).size).toBe(forms.length);
   });
});
