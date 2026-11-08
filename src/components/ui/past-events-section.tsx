import React, { useState } from "react";
import GlassFolder, { type FolderFile } from "./glass-folder";
import { Calendar, Sparkles, FolderArchive, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HACKATHON_FILES: FolderFile[] = [
  { name: "Group Photo", meta: "JPEG · Event Day", image: "/hackathon-1.jpg" },
  { name: "Stage Talks", meta: "JPEG · Speakers", image: "/hackathon-2.jpg" },
  { name: "Hacking in Action", meta: "JPEG · Builders", image: "/hackathon-3.jpg" },
  { name: "Winners Ceremony", meta: "JPEG · Awards", image: "/hackathon-4.jpg" },
];

const DEMODAY_FILES: FolderFile[] = [
  { name: "Stage Setup", meta: "JPEG · Venue", image: "/hackathon-5.jpg" },
  { name: "Crowd Shot", meta: "JPEG · Audience", image: "/hackathon-6.jpg" },
  { name: "Panel Discussion", meta: "JPEG · Speakers", image: "/hackathon-7.jpg" },
  { name: "Networking After", meta: "Press Release", art: "aurora" },
];

const CODEJAM_FILES: FolderFile[] = [
  { name: "Open Source Drops", meta: "12 Repos", art: "verdant" },
  { name: "Shader Showdown", meta: "GLSL Demos", art: "aurora" },
  { name: "Discord Stream VOD", meta: "4h 20m" },
];

const DESIGN_SUMMIT_FILES: FolderFile[] = [
  { name: "Figma Tokens Kit", meta: ".fig · 32 MB", art: "glacier" },
  { name: "Tailwind v4 Deep Dive", meta: "Recording", art: "ember" },
  { name: "Component Architecture", meta: "Whitepaper" },
];

export interface PastEventsSectionProps {
  id?: string;
  className?: string;
}

export function PastEventsSection({
  id = "past-events",
  className = "",
}: PastEventsSectionProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const folderTone = isDark ? "dark" : "light";

  return (
    <section
      id={id}
      className={`relative w-full py-20 md:py-28 bg-transparent overflow-hidden ${className}`}
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-[500px] w-[900px] max-w-full rounded-full bg-gradient-to-br from-primary/10 via-accent/5 to-transparent blur-3xl opacity-60" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold glass-badge mb-4">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>COMMUNITY CHRONICLES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight glass-heading">
            Our Past Events
          </h2>

          <p className="mt-3 text-base sm:text-lg glass-subtext leading-relaxed">
            Tangible archives from BUILDCULT hackathons, IRL demo nights, and midnight jams.
            Click any frosted folder to lift its files, inspect drops, or tap{" "}
            <span className="font-mono text-primary font-semibold">+</span> to add new notes.
          </p>

          {selectedFile && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs glass-badge animate-in fade-in">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="glass-heading">Viewing: {selectedFile}</span>
              <button
                onClick={() => setSelectedFile(null)}
                className="ml-2 hover:underline opacity-80 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Glass Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center items-start">
          {/* Folder 1: Cult Hackathon */}
          <div className="flex flex-col items-center">
            <GlassFolder
              label="Cult Hackathon '25"
              meta="48h Sprint · 120 Builders"
              tone={folderTone}
              image="/hackathon-1.jpg"
              seed={17}
              files={HACKATHON_FILES}
              width={290}
              action="add"
              onFileSelect={(file) => setSelectedFile(`${file.name} (${file.meta})`)}
            />
          </div>

          {/* Folder 2: Demoday Bangalore */}
          <div className="flex flex-col items-center">
            <GlassFolder
              label="Demoday Bangalore"
              meta="IRL Showcase · 400+ Attended"
              tone={folderTone}
              art="dusk"
              seed={42}
              files={DEMODAY_FILES}
              width={290}
              action="more"
              menu={[
                { label: "View Photo Stream" },
                { label: "Download Press Kit" },
              ]}
              onFileSelect={(file) => setSelectedFile(`${file.name} (${file.meta})`)}
            />
          </div>

          {/* Folder 3: Midnight Code Jam */}
          <div className="flex flex-col items-center">
            <GlassFolder
              label="Midnight Code Jam"
              meta="Virtual · 2.4k Hackers"
              tone={folderTone}
              art="verdant"
              seed={89}
              files={CODEJAM_FILES}
              width={290}
              action="add"
              onFileSelect={(file) => setSelectedFile(`${file.name} (${file.meta})`)}
            />
          </div>

          {/* Folder 4: Design Systems Summit */}
          <div className="flex flex-col items-center">
            <GlassFolder
              label="Design Summit '26"
              meta="Interactive Workshop"
              tone={folderTone}
              art="glacier"
              seed={64}
              files={DESIGN_SUMMIT_FILES}
              width={290}
              action="more"
              menu={[
                { label: "Download Figma Kit" },
                { label: "Watch Keynote" },
              ]}
              onFileSelect={(file) => setSelectedFile(`${file.name} (${file.meta})`)}
            />
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl glass-panel max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl glass-badge flex items-center justify-center shrink-0">
              <FolderArchive className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold glass-heading">
                Want to host or sponsor a BUILDCULT event?
              </h4>
              <p className="text-xs glass-subtext">
                We organize local IRL build nights and virtual shipathons worldwide.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full text-xs h-9 px-5 gap-1.5 cursor-pointer shrink-0 glass-badge hover:border-white/40"
          >
            <a href="mailto:aman@buildcult.dev">
              <span className="glass-heading font-medium">Propose an Event</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PastEventsSection;

