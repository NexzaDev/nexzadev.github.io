import { useEffect, useRef, useState, type ReactNode } from "react";
import { Command } from "cmdk";
import {
   ArrowUpRight,
   Copy,
   FileDown,
   FileText,
   FolderGit2,
   Hash,
   Sparkles,
   UserPlus,
} from "lucide-react";
import { NAV_SECTIONS } from "@/constants/sections";
import { getContactOptions } from "@data/contact";
import { getSocialProfiles } from "@data/personal";
import { getFeaturedProjects } from "@data/projects";
import { getUiCopy } from "@data/ui";
import useMotionPreference from "@hooks/useMotionPreference";
import useSectionNavigation from "@hooks/useSectionNavigation";
import { setPaletteOpen } from "@utils/paletteState";
import { fillTemplate } from "@utils/fillTemplate";
import "./command-palette.css";

const COPY = getUiCopy().palette;
const ROWS = COPY.rows;

type CopyState = "idle" | "copied" | "failed";
const COPY_COMMAND: Record<CopyState, string> = {
   idle: ROWS.email.command,
   copied: ROWS.email.copied,
   failed: ROWS.email.failed,
};

const close = () => setPaletteOpen(false);

const siteFile = (file: string) => `${import.meta.env.BASE_URL}${file}`;

const openExternal = (url: string) => {
   globalThis.open(url, "_blank", "noopener,noreferrer");
   close();
};

interface RowProps {
   value: string;
   command: string;
   hint: string;
   icon: ReactNode;
   onSelect: () => void;
}

const Row = ({ value, command, hint, icon, onSelect }: RowProps) => (
   <Command.Item value={value} onSelect={onSelect} className="palette-item">
      <span className="palette-icon" aria-hidden="true">
         {icon}
      </span>
      <span className="palette-command">{command}</span>
      <span className="palette-hint">{hint}</span>
   </Command.Item>
);

const slug = (text: string) =>
   text
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-|-$/g, "");

const CommandPalette = ({ open }: { open: boolean }) => {
   const { navigateToSection } = useSectionNavigation();
   const { preference, setPreference } = useMotionPreference();
   const [copyState, setCopyState] = useState<CopyState>("idle");
   const copyResetRef = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
   );
   useEffect(() => () => clearTimeout(copyResetRef.current), []);
   const contacts = getContactOptions();
   const email = contacts.find((c) => c.link.startsWith("mailto:"))?.value;

   const go = (id: string) => {
      close();
      navigateToSection(id);
   };

   const copyEmail = async (address: string) => {
      let next: CopyState = "copied";
      try {
         await navigator.clipboard.writeText(address);
      } catch {
         next = "failed";
      }
      setCopyState(next);
      clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => setCopyState("idle"), 1600);
   };

   return (
      <Command.Dialog
         open={open}
         onOpenChange={setPaletteOpen}
         label={COPY.label}
         overlayClassName="palette-overlay"
         contentClassName="palette"
         loop
      >
         <div className="palette-prompt">
            <span aria-hidden="true">{COPY.prompt}</span>
            <Command.Input
               placeholder={COPY.placeholder}
               className="palette-input"
               autoCapitalize="none"
               autoCorrect="off"
               spellCheck={false}
               enterKeyHint="go"
            />
            <kbd className="palette-kbd">{COPY.close_key}</kbd>
         </div>
         <Command.List className="palette-list">
            <Command.Empty className="palette-empty">
               {COPY.empty}
            </Command.Empty>

            <Command.Group heading={COPY.groups.go} className="palette-group">
               <Row
                  value={ROWS.home.keywords}
                  command={ROWS.home.command}
                  hint={ROWS.home.hint}
                  icon={<Hash size={14} />}
                  onSelect={() => go("hero")}
               />
               {NAV_SECTIONS.map(({ id, label }) => (
                  <Row
                     key={id}
                     value={fillTemplate(ROWS.section.keywords, { id, label })}
                     command={fillTemplate(ROWS.section.command, { id })}
                     hint={label}
                     icon={<Hash size={14} />}
                     onSelect={() => go(id)}
                  />
               ))}
            </Command.Group>

            <Command.Group
               heading={COPY.groups.actions}
               className="palette-group"
            >
               {email && (
                  <Row
                     value={fillTemplate(ROWS.email.keywords, { email })}
                     command={COPY_COMMAND[copyState]}
                     hint={email}
                     icon={<Copy size={14} />}
                     onSelect={() => void copyEmail(email)}
                  />
               )}
               <Row
                  value={ROWS.cv.keywords}
                  command={ROWS.cv.command}
                  hint={ROWS.cv.hint}
                  icon={<FileDown size={14} />}
                  onSelect={() => {
                     globalThis.dispatchEvent(new Event("nexza:open-cv"));
                     close();
                  }}
               />
               <Row
                  value={ROWS.motion.keywords}
                  command={fillTemplate(ROWS.motion.command, {
                     mode: preference === "reduced" ? "full" : "reduced",
                  })}
                  hint={
                     preference === "reduced"
                        ? ROWS.motion.hint_full
                        : ROWS.motion.hint_reduced
                  }
                  icon={<Sparkles size={14} />}
                  onSelect={() => {
                     setPreference(
                        preference === "reduced" ? "full" : "reduced",
                     );
                     close();
                  }}
               />
            </Command.Group>

            <Command.Group
               heading={COPY.groups.under_the_hood}
               className="palette-group"
            >
               <Row
                  value={ROWS.llms.keywords}
                  command={ROWS.llms.command}
                  hint={ROWS.llms.hint}
                  icon={<FileText size={14} />}
                  onSelect={() => openExternal(siteFile("llms.txt"))}
               />
               <Row
                  value={ROWS.markdown.keywords}
                  command={ROWS.markdown.command}
                  hint={ROWS.markdown.hint}
                  icon={<FileText size={14} />}
                  onSelect={() => openExternal(siteFile("index.md"))}
               />
               <Row
                  value={ROWS.rss.keywords}
                  command={ROWS.rss.command}
                  hint={ROWS.rss.hint}
                  icon={<FileText size={14} />}
                  onSelect={() => openExternal(siteFile("rss.xml"))}
               />
               <Row
                  value={ROWS.vcard.keywords}
                  command={ROWS.vcard.command}
                  hint={ROWS.vcard.hint}
                  icon={<UserPlus size={14} />}
                  onSelect={() => {
                     globalThis.location.assign(siteFile("nexza.vcf"));
                     close();
                  }}
               />
            </Command.Group>

            <Command.Group
               heading={COPY.groups.projects}
               className="palette-group"
            >
               {getFeaturedProjects()
                  .filter((project) => project.github)
                  .map((project) => (
                     <Row
                        key={project.id}
                        value={fillTemplate(ROWS.project.keywords, {
                           title: project.title,
                        })}
                        command={fillTemplate(ROWS.project.command, {
                           slug: slug(project.title),
                        })}
                        hint={project.title}
                        icon={<FolderGit2 size={14} />}
                        onSelect={() => openExternal(project.github)}
                     />
                  ))}
            </Command.Group>

            <Command.Group
               heading={COPY.groups.elsewhere}
               className="palette-group"
            >
               {getSocialProfiles().map((profile) => (
                  <Row
                     key={profile.id}
                     value={fillTemplate(ROWS.profile.keywords, {
                        name: profile.name,
                     })}
                     command={fillTemplate(ROWS.profile.command, {
                        slug: profile.name.toLowerCase(),
                     })}
                     hint={profile.link.replace(/^https?:\/\/(www\.)?/, "")}
                     icon={<ArrowUpRight size={14} />}
                     onSelect={() => openExternal(profile.link)}
                  />
               ))}
            </Command.Group>
         </Command.List>
      </Command.Dialog>
   );
};

export default CommandPalette;
