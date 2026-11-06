import type { SocialProfile, StatsCopy } from "@/types";
import personalData from "../../data/personal.json";

interface PersonalFile {
   name: string;
   title: string;
   role: string;
   location: string;
   timezone: string;
   availability: string;
   languages: { name: string; level: string }[];
   about: Record<string, string>;
   social_profiles: SocialProfile[];
   contact: { github: string };
   stats?: StatsCopy;
   intro: string;
   role_label: string;
   hero_taglines: string[];
   headline: string;
   hero_greeting: string;
}

const personal = personalData as PersonalFile;

export const getName = (): string => personal.name;
export const getRole = (): string => personal.role;
export const getLocation = (): string => personal.location;
export const getTimezone = (): string => personal.timezone;
export const getAvailability = (): string => personal.availability;
export const getLanguages = (): { name: string; level: string }[] =>
   personal.languages;
export const getAbout = (): Record<string, string> => personal.about;
export const getSocialProfiles = (): SocialProfile[] =>
   personal.social_profiles;
export const getGitHubUsername = (): string => personal.contact.github;
export const getStatsCopy = (): StatsCopy => personal.stats as StatsCopy;
export const getIntro = (): string => personal.intro;
export const getRoleLabel = (): string => personal.role_label;
export const getHeroTaglines = (): string[] => personal.hero_taglines;
export const getHeadline = (): string => personal.headline;

export const getHeroGreeting = (): string => personal.hero_greeting;
