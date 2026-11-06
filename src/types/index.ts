import type { ComponentType } from "react";

export interface Certification {
   id: number;
   name: string;
   type: string;
   issuer: string;
   issueDate: string;
   badgeId: string;
   badgeUrl: string;
   level?: string;
   expiryDate?: string;
   imageUrl: string;
}

export interface LearningBadge {
   id: number;
   name: string;
   type: string;
   issuer: string;
   issueDate: string;
   badgeId: string;
   badgeUrl: string;
   imageUrl: string;
   level?: string;
   expiryDate?: string;
}

export interface Achievement {
   id: number;
   title: string;
   organizer: string;
   date: string;
   type: string;
}

export interface CodingPlatformStat {
   username: string;
   url: string;

   contributions?: number;
   pull_requests?: number;
   longest_streak?: number;

   languages?: { name: string; percent: number }[];

   fetched?: string;
}

export type CodingPlatformStats = Record<string, CodingPlatformStat>;

export interface ContactOption {
   id: number;
   icon: string;
   title: string;
   value: string;
   link: string;
   message: string;
}

export interface EmailConfig {
   service_id?: string;
   template_id?: string;
   public_key?: string;
   validation_pattern: string;
   fallback_email: string;
}

export interface Education {
   id: number;
   date: string;
   title: string;
   institution: string;
   department?: string;
   board?: string;
   field?: string;
   location: string;
   cgpa: string;
   achievements?: string[];
   skills: string[];
}

export interface CaseStudy {
   problem: string;
   built: string;
   decisions: string[];
   outcome: string;
}

export type EngagementSceneKey = string;

export interface ExperienceProject {
   name: string;
   date?: string;
   description: Record<string, string>;
   skills: string[];

   link?: string;

   linkLabel?: string;
   case_study?: CaseStudy;

   scene?: EngagementSceneKey;
}

export interface InternalContribution {
   title: string;
   type: "talk" | "publication" | "program";
   year?: string;

   count?: number;
}

export interface ProfessionalExperience {
   id: number;
   date: string;
   title: string;
   position?: string;
   company: string;
   location?: string;
   summary: string;
   projects?: ExperienceProject[];

   scene?: EngagementSceneKey;
   internal_contributions?: InternalContribution[];
   internal_achievements?: InternalContribution[];
}

export interface PositionOfResponsibility {
   id: number;
   date: string;
   title: string;
   position: string;
   company: string;
   location: string;
   summary: string;
   description: Record<string, string>;
   skills: string[];
}

export interface SocialProfile {
   id: number;
   name: string;
   link: string;
   icon: string;
}

interface CalendarCopy {
   label: string;
   current: string;
   less: string;
   more: string;
   loading: string;
   summary: string;
   days_one: string;
   days_many: string;
   tip: string;
   contributions_none: string;
   contributions_one: string;
   contributions_many: string;
}

interface PlatformCopy {
   label: string;
}

interface GitHubCardCopy extends PlatformCopy {
   contributions: string;
   pull_requests: string;
   longest_streak: string;
   streak_value: string;
   updated: string;
   languages: string;

   profile_label: string;
   calendar: CalendarCopy;
}

export interface StatsCopy {
   platforms: {
      link_label: string;
      github: GitHubCardCopy;
   };
}

export type ProjectStatus = "active" | "beta" | "complete";

export type ProjectFilter =
   "All" | "Featured" | "Community" | "Collab" | "Others";

export interface Project {
   id: number;
   title: string;
   description: string;
   date: string;
   status: ProjectStatus;

   version?: string;
   tools_tech: string[];
   features: string[];
   github: string;
   live: string;
   team?: string;
   organization?: string;
   contributors?: string[];
   case_study?: CaseStudy;
}

export interface OpenSourceContribution {
   repo: string;

   stars: number;
   title: string;
   url: string;
   status: "merged" | "open" | "closed";

   merged_at?: string;
   note?: string;
}

export interface CommunityDiscussion {
   repo: string;
   title: string;
   url: string;
   status: "accepted" | "helpful";
}

export type NewsType =
   "launch" | "oss" | "community" | "cert" | "award" | "work" | "education";

export interface NewsItem {
   date: string;
   type: NewsType;
   text: string;
   link?: string;

   impact?: "major" | "minor";
}

export interface ProjectsFile {
   spotlight_project_id?: number | null;
   featured_projects: Project[];
   collaborative_projects: Project[];
   other_projects: Project[];
   community_projects?: Project[];
   open_source_contributions?: OpenSourceContribution[];
   community_discussions?: CommunityDiscussion[];
}

export type SkillsData = Record<string, string[]>;

export type SkillCategoryKey = string;

interface SkillCategoryCopy {
   label: string;
}

export interface SkillsFile {
   [key: string]: string[] | Record<string, SkillCategoryCopy> | undefined;
   hero_stack?: string[];
   categories: Record<SkillCategoryKey, SkillCategoryCopy>;
}

export type ServiceKey =
   | "landing-zones"
   | "iac-cicd"
   | "cloud-networking"
   | "mlops-genai"
   | "agent-tooling"
   | "full-stack";

export interface Service {
   id: number;
   key: ServiceKey;
   title: string;
   list: string[];
}

interface SectionCopy {
   nav: string;

   title: string;
   subtitle: string;

   blurb?: string;
}

interface ProjectSearchCopy {
   placeholder: string;
   label: string;
   clear: string;
   summary: string;
   order_spotlight: string;
   order_newest: string;
   empty_title: string;
   empty_body: string;
   reset: string;
   filter_label: string;
   filter_count_one: string;
   filter_count_many: string;
}

interface ProjectModalCopy {
   close: string;
   glance: string;
   tech: string;
   features: string;
   contributors: string;
   copy_link: string;
   link_copied: string;
   copy_failed: string;
   demos: Record<string, string>;
}

interface NewsTypeCopy {
   chip: string;
   label: string;
}

export interface SectionCopyMap extends Record<string, SectionCopy> {
   about: SectionCopy & {
      facts: {
         based_in: string;
         role: string;
         role_value: string;
         education: string;
         education_value: string;
         languages?: string;
      };
   };
   experience: SectionCopy & {
      subsections: { positions: string };
      links: {
         source: string;
         source_label: string;
         details: string;
         details_label: string;
      };
      card: { responsibilities: string; present: string; active_role: string };
      modal: {
         close: string;
         contributions: string;
         achievements: string;
         skills: string;
         full_details: string;
      };
   };
   education: SectionCopy & {
      empty: string;
      extras: { achievements_one: string; achievements_many: string };
   };
   projects: SectionCopy & {
      open_source_empty: string;
      subsections: { open_source: string };
      links: {
         details: string;
         source: string;
         live: string;
         view_source: string;
         details_label: string;
         source_label: string;
         live_label: string;
      };
      search: ProjectSearchCopy;
      filters: Record<ProjectFilter, string>;
      card: { spotlight: string; evidence_label: string };
      project_status: Record<ProjectStatus, string>;
      evidence: { live: string; source: string };

      open_source: Record<
         OpenSourceContribution["status"] | CommunityDiscussion["status"],
         string
      >;
      contribution_status: Record<OpenSourceContribution["status"], string>;
      discussion_status: Record<CommunityDiscussion["status"], string>;
      modal: ProjectModalCopy;
   };
   achievements: SectionCopy & {
      empty: string;
      subsections: {
         certifications: string;
         badges: string;
         competitions: string;
      };
      certifications: {
         active_count: string;
         credential: string;
         level: string;
         expired: string;
         expires: string;
      };
      competitions: {
         podium: string;
         other: string;
         rank: string;
         place: string;
      };
   };
   services: SectionCopy & { empty: string; cta: string; cta_label: string };
   stats: SectionCopy & { empty: string; subsections: { platforms: string } };
   news: SectionCopy & {
      empty: string;
      filters: {
         all: string;
         group_label: string;
         show_all: string;
         show_less: string;
      };
      types: Record<NewsType, NewsTypeCopy>;
   };
   contact: SectionCopy & {
      card_label: string;
      vcard: { label: string; hint: string };
      form: {
         name: string;
         name_placeholder: string;
         email: string;
         email_placeholder: string;
         message: string;
         message_placeholder: string;
         send: string;
         send_label: string;
         sending_label: string;
         invalid_email: string;
         send_failed: string;
         send_timeout: string;
         mailto_hint?: string;
      };
      sent: { title: string; thanks: string; again: string };
   };
}

interface PaletteRowCopy {
   keywords: string;
   command: string;
}

interface PaletteActionCopy extends PaletteRowCopy {
   hint: string;
}

export interface UiCopy {
   new_tab: string;

   profile_label: string;
   skip_link: string;
   error: {
      title: string;
      body: string;
      refresh: string;
      refresh_label: string;
   };
   section: {
      loading: string;
      unavailable: string;
      unavailable_body: string;
      refresh: string;
   };
   nav: {
      label: string;
      home: string;
      top_label: string;
      navigate_label: string;
      palette_label: string;
      palette_key: string;
      contact: string;
      more: string;
      menu_open: string;
      menu_close: string;
      menu_label: string;
      menu_dismiss: string;
   };
   hero: {
      projects_cta: string;
      cv_cta: string;
      pdf_cta: string;
      latest: string;
      latest_pr: string;
      latest_project: string;
      scroll: string;
      scroll_label: string;
   };
   footer: {
      copyright: string;
      disclaimer: string;
      site: string;
      site_label: string;
      social: string;
      social_label: string;
      download_cv: string;
      easter_egg: string;

      end_line: string;
      hold_copy: string;
      copied: string;
      copy_failed: string;
      slide: string;
      slide_label: string;
      slide_sent: string;
      visitor_gap: string;
      gap_hours: string;
      gap_minutes: string;
      gap_ahead: string;
      gap_behind: string;
   };
   motion: {
      modes: { full: string; reduced: string };
      button: string;
      label: string;
      title: string;
   };
   back_to_top: string;
   toast_dismiss: string;
   case_study: {
      problem: string;
      built: string;
      decisions: string;
      outcome: string;
      inspect: string;
   };
   palette: {
      label: string;
      prompt: string;
      placeholder: string;
      close_key: string;
      empty: string;
      groups: {
         go: string;
         actions: string;
         under_the_hood: string;
         projects: string;
         elsewhere: string;
      };
      rows: {
         home: PaletteActionCopy;
         section: PaletteRowCopy;
         email: PaletteRowCopy & { copied: string; failed: string };
         cv: PaletteActionCopy;
         booking: PaletteActionCopy;
         motion: PaletteRowCopy & { hint_full: string; hint_reduced: string };
         llms: PaletteActionCopy;
         markdown: PaletteActionCopy;
         rss: PaletteActionCopy;
         vcard: PaletteActionCopy;
         project: PaletteRowCopy;
         profile: PaletteRowCopy;
      };
   };
   cv: {
      title: string;
      close: string;
      unavailable: string;
      download_instead: string;
      view_label: string;
      view_web: string;
      view_pages: string;
      pages_one: string;
      pages_many: string;
      loading: string;
      zoom_out: string;
      zoom_in: string;
      open_pdf: string;
      download: string;
      download_short: string;
      page_alt: string;
      sheet_label: string;
   };
}

export type IconMap = Record<string, ComponentType<{ size?: number | string }>>;
