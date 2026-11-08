import React from "react";
import TeamLanyardRail, { type LanyardMember } from "./team-lanyard-rail";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles, Users } from "lucide-react";

export const CORE_MEMBERS: LanyardMember[] = [
  {
    id: "armaan",
    name: "Armaan",
    role: "President",
    team: "BUILDCULT · Executive Leadership",
    image: "/armaan-portrait.jpg",
    bio: "President of BUILDCULT. Leading strategic vision, ecosystem partnerships, and scaling the builder culture nationwide.",
    tags: ["President", "Executive Leadership", "Vision & Strategy"],
    tone: 1,
    links: [
      { label: "armaan@buildcult.dev", href: "mailto:armaan@buildcult.dev" },
      { label: "x.com/buildcult", href: "https://x.com/Build_Cult" },
      { label: "linkedin/buildcult", href: "https://www.linkedin.com/company/buildcult/about/" },
    ],
  },
  {
    id: "aman",
    name: "Aman",
    role: "Vice President",
    team: "BUILDCULT · Leadership",
    image: "/aman.jpg",
    bio: "The backbone of our community. Driving operations, culture, and growth across BUILDCULT.",
    tags: ["Vice President", "Community Backbone", "Leadership"],
    tone: 2,
    links: [
      { label: "aman@buildcult.dev", href: "mailto:aman@buildcult.dev" },
      { label: "x.com/aman", href: "https://x.com" },
      { label: "linkedin/aman", href: "https://linkedin.com" },
    ],
  },
  {
    id: "pragya",
    name: "Pragya",
    role: "General Secretary",
    team: "BUILDCULT · Administration & Operations",
    image: "/pragya-portrait.jpg",
    bio: "General Secretary of BUILDCULT. Coordinating community governance, internal operations, communication, and event execution.",
    tags: ["General Secretary", "Governance", "Operations"],
    tone: 3,
    links: [
      { label: "pragya@buildcult.dev", href: "mailto:pragya@buildcult.dev" },
      { label: "x.com/buildcult", href: "https://x.com/Build_Cult" },
      { label: "linkedin/buildcult", href: "https://www.linkedin.com/company/buildcult/about/" },
    ],
  },
  {
    id: "sameer",
    name: "Sameer",
    role: "Technical Head",
    team: "BUILDCULT · Engineering & Tech",
    image: "/sameer-portrait.jpg",
    bio: "Technical Head of BUILDCULT. Leading full-stack engineering, hackathon tech stacks, project evaluations, and core infrastructure.",
    tags: ["Technical Head", "Engineering", "Core Systems"],
    tone: 1,
    links: [
      { label: "sameer@buildcult.dev", href: "mailto:sameer@buildcult.dev" },
      { label: "github/buildcult", href: "https://github.com" },
      { label: "x.com/buildcult", href: "https://x.com/Build_Cult" },
    ],
  },
  {
    id: "rishita",
    name: "Rishita",
    role: "Design Head",
    team: "BUILDCULT · Design & Creative Studio",
    image: "/rishita-portrait.jpg",
    bio: "Design Head of BUILDCULT. Shaping visual identity, brand aesthetics, UI/UX craft, and creative storytelling.",
    tags: ["Design Head", "Brand Aesthetics", "Creative Direction"],
    tone: 3,
    links: [
      { label: "rishita@buildcult.dev", href: "mailto:rishita@buildcult.dev" },
      { label: "instagram/buildcult", href: "https://www.instagram.com/buildcult/" },
      { label: "x.com/buildcult", href: "https://x.com/Build_Cult" },
    ],
  },
  {
    id: "saiansh",
    name: "Saiansh",
    role: "KUCH BHI",
    team: "BUILDCULT · Wildcard Operations",
    image: "/saiansh-portrait.jpg",
    bio: "KUCH BHI. Doing everything from chaotic experiments to solving impossible problems across the community.",
    tags: ["KUCH BHI", "Wildcard", "All-Rounder"],
    tone: 4,
    links: [
      { label: "saiansh@buildcult.dev", href: "mailto:saiansh@buildcult.dev" },
      { label: "x.com/buildcult", href: "https://x.com/Build_Cult" },
      { label: "instagram/buildcult", href: "https://www.instagram.com/buildcult/" },
    ],
  },
  {
    id: "angel",
    name: "Angel",
    role: "Social Media Head",
    team: "BUILDCULT · Media & Growth",
    image: "/angel-portrait.jpg",
    bio: "Head of Social Media & Storytelling. Leading brand presence, community drops, viral campaigns, and digital engagement.",
    tags: ["Social Media Head", "Community Drops", "Media & Growth"],
    tone: 5,
    links: [
      { label: "angel@buildcult.dev", href: "mailto:angel@buildcult.dev" },
      { label: "instagram/buildcult", href: "https://www.instagram.com/buildcult/" },
      { label: "x.com/buildcult", href: "https://x.com/Build_Cult" },
    ],
  },
];

export interface CoreSectionProps {
  id?: string;
  className?: string;
  onJoinClick?: () => void;
}

export function CoreSection({
  id = "core",
  className = "",
  onJoinClick,
}: CoreSectionProps) {
  return (
    <section
      id={id}
      className={`relative w-full py-16 md:py-24 bg-transparent transition-colors ${className}`}
    >
      {/* Decorative backdrop glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-[450px] w-[750px] max-w-full rounded-full bg-gradient-to-tr from-primary/10 via-accent/5 to-transparent blur-3xl opacity-70" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold glass-badge mb-4">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>CORE CREW</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight">
            <span className="glass-heading">Meet the Builders Behind the </span>
            <span className="font-serif italic font-normal glass-accent">
              Cult
            </span>
          </h2>

          <p className="mt-3 text-base sm:text-lg glass-subtext leading-relaxed">
            Drag badges on the rail, flip them to read bios and scan personal badges,
            or tug the strings to feel the spring physics in action.
          </p>
        </div>

        {/* Lanyard Rail Physics Playground */}
        <div className="w-full rounded-2xl glass-panel shadow-2xl overflow-hidden py-4">
          <TeamLanyardRail
            items={CORE_MEMBERS}
            autoplay={true}
            interval={3500}
            caption="Hover or drag any lanyard badge to examine the card details."
            action={
              <div className="flex items-center gap-3 mt-1">
                <Button
                  onClick={onJoinClick}
                  variant="outline"
                  className="rounded-full text-xs sm:text-sm px-5 h-9 gap-1.5 group cursor-pointer glass-badge hover:border-white/40"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="glass-heading font-medium">Join Our Team</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}

export default CoreSection;
