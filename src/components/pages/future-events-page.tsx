import React, { useState } from "react";
import Header, { type NavigationSection } from "@/components/ui/hero-01-utils/header";
import { ShaderMetal } from "@/components/ui/shader-metal";
import EventCard, { type EventCardData } from "@/components/ui/course-design-cards";
import { EventPassModal } from "@/components/ui/event-pass-modal";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Trophy,
  Cpu,
  Users2,
  FolderGit2,
  Calendar,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FutureEventsPageProps {
  onBackToHome?: () => void;
  onJoinClick?: () => void;
}

// Exactly one real event per requested section
const FUTURE_EVENTS: EventCardData[] = [
  // 1. Upcoming Hackathons
  {
    id: "hackathon-1",
    category: "hackathon",
    colorClass: "green",
    date: "Upcoming · Season 2026/27",
    title: "CodeYourCult II",
    location: "IRL & Worldwide Virtual",
    tag: "Flagship Hackathon",
    description:
      "The flagship 48-hour builder hackathon by BUILDCULT. Bringing together top developers, designers, and creators to ship tangible projects with peer reviews and ecosystem grants.",
    progressLabel: "Registrations",
    progressPercent: "85%",
    progressValue: "85% Capacity",
    imgSrc1: "/aman.jpg",
    imgSrc2: "/armaan-portrait.jpg",
    imgSrc3: "/sameer-portrait.jpg",
    countdownText: "Coming Soon",
  },

  // 2. Tech Events
  {
    id: "tech-1",
    category: "tech-event",
    colorClass: "blue",
    date: "Upcoming Workshop",
    title: "BUILDCULT Tech Workshop & Speaker Session",
    location: "Live Community Stage",
    tag: "Tech Deep-Dive",
    description:
      "Hands-on interactive technical session covering engineering pipelines, modern web architectures, WebGL shaders, and high-performance React led by the BUILDCULT tech leads.",
    progressLabel: "RSVP Status",
    progressPercent: "75%",
    progressValue: "Open for RSVP",
    imgSrc1: "/sameer-portrait.jpg",
    imgSrc2: "/rishita-portrait.jpg",
    countdownText: "RSVP Open",
  },

  // 3. Meets
  {
    id: "meet-1",
    category: "meet",
    colorClass: "orange",
    date: "Community Gathering",
    title: "BUILDCULT IRL Community Meet",
    location: "Delhi Hub & Campus Chapters",
    tag: "Offline Meetup",
    description:
      "In-person meetup for builders, creators, and developers. Bring your laptops, share prototypes, exchange raw feedback, and hang out directly with the core team.",
    progressLabel: "Attendees",
    progressPercent: "90%",
    progressValue: "Limited Seats",
    imgSrc1: "/aman.jpg",
    imgSrc2: "/armaan-portrait.jpg",
    imgSrc3: "/pragya-portrait.jpg",
    countdownText: "Save Date",
  },

  // 4. Project Meet
  {
    id: "proj-1",
    category: "project-meet",
    colorClass: "purple",
    date: "Sprint Sync",
    title: "Project Meet & Builder Squad Review",
    location: "Discord Builder Voice",
    tag: "Squad Sync",
    description:
      "Collaborative sprint review and milestone sync for active builder squads, hackathon prototypes, and open-source initiatives shipping under the BUILDCULT flag.",
    progressLabel: "Squad Slots",
    progressPercent: "70%",
    progressValue: "Review Slots Open",
    imgSrc1: "/sameer-portrait.jpg",
    imgSrc2: "/saiansh-portrait.jpg",
    countdownText: "Register Squad",
  },
];

type CategoryFilter = "all" | "hackathon" | "tech-event" | "meet" | "project-meet";

export function FutureEventsPage({ onBackToHome, onJoinClick }: FutureEventsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [rsvpModalEvent, setRsvpModalEvent] = useState<EventCardData | null>(null);
  const [passModalEvent, setPassModalEvent] = useState<EventCardData | null>(null);

  const navigationData: NavigationSection[] = [
    {
      title: "Home",
      href: "#",
      onClick: (e) => {
        e.preventDefault();
        if (onBackToHome) onBackToHome();
      },
    },
    {
      title: "Core",
      href: "#core",
      onClick: (e) => {
        e.preventDefault();
        window.location.hash = "#core";
      },
    },
    {
      title: "Past Events",
      href: "#past-events",
      onClick: (e) => {
        e.preventDefault();
        if (onBackToHome) {
          onBackToHome();
          setTimeout(() => {
            const el = document.getElementById("past-events");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      },
    },
    {
      title: "Services",
      href: "#services",
      onClick: (e) => {
        e.preventDefault();
        window.location.hash = "#services";
      },
    },
    {
      title: "Future Events",
      href: "#future-events",
      isActive: true,
    },
    {
      title: "Join Us",
      href: "#join-us",
      onClick: (e) => {
        e.preventDefault();
        if (onJoinClick) onJoinClick();
        else window.location.hash = "#join-us";
      },
    },
  ];

  const hackathon = FUTURE_EVENTS.find((e) => e.category === "hackathon")!;
  const techEvent = FUTURE_EVENTS.find((e) => e.category === "tech-event")!;
  const meet = FUTURE_EVENTS.find((e) => e.category === "meet")!;
  const projectMeet = FUTURE_EVENTS.find((e) => e.category === "project-meet")!;

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden selection:bg-primary/20">
      {/* Liquid ShaderMetal Canvas Background (Theme-Aware, Hardware-Accelerated) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-65 transition-opacity duration-700">
        <ShaderMetal
          metal="chrome"
          color="#f37c7c"
          ribbons={4}
          speed={0.28}
          iridescence={0.4}
          interactive={true}
          theme="auto"
        />
      </div>

      {/* Subtle radial lighting vignette */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.7)_80%)]"
      />

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Navigation Bar */}
        <Header
          navigationData={navigationData}
          onCollaborateClick={onJoinClick || (() => { window.location.hash = "#join-us"; })}
        />

        {/* Top Back Home & Breadcrumb */}
        <div className="container mx-auto px-4 pt-6 max-w-6xl flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBackToHome}
            className="gap-2 glass-badge cursor-pointer rounded-full hover:border-white/40 h-9 px-4 text-xs font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="glass-heading">Back to Home</span>
          </Button>

          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs glass-badge">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SEASON 2026/2027</span>
          </div>
        </div>

        {/* Hero Section of Future Events */}
        <section className="container mx-auto px-4 pt-10 pb-12 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold glass-badge mb-5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>FUTURE EVENTS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-tight md:leading-none">
            <span className="glass-heading">WHAT'S </span>
            <span className="font-serif italic font-normal glass-accent">NEXT</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg glass-subtext max-w-xl mx-auto leading-relaxed">
            The next milestones on the BUILDCULT radar. One focused gathering for each dimension of our community.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: "all", label: "All Events", icon: Flame },
              { id: "hackathon", label: "Hackathons", icon: Trophy },
              { id: "tech-event", label: "Tech Events", icon: Cpu },
              { id: "meet", label: "Meets", icon: Users2 },
              { id: "project-meet", label: "Project Meet", icon: FolderGit2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as CategoryFilter)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-medium transition-all duration-300 cursor-pointer border shadow-sm",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                      : "bg-card/70 dark:bg-card/40 backdrop-blur-md border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4 Dedicated Sections — Exactly 1 Event Each */}
        <main className="container mx-auto px-4 max-w-5xl pb-24 space-y-16">
          {/* SECTION 1: UPCOMING HACKATHONS */}
          {(selectedCategory === "all" || selectedCategory === "hackathon") && (
            <section id="hackathons" className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight glass-heading">
                    1. Upcoming Hackathons
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    48-hour build sprint with mentorship, peer reviews, and demo spotlights.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl">
                <EventCard
                  data={{
                    ...hackathon,
                    onActionClick: () => setRsvpModalEvent(hackathon),
                  }}
                />
              </div>
            </section>
          )}

          {/* SECTION 2: TECH EVENTS */}
          {(selectedCategory === "all" || selectedCategory === "tech-event") && (
            <section id="tech-events" className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight glass-heading">
                    2. Tech Events
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Deep-dive interactive technical sessions and speaker teardowns.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl">
                <EventCard
                  data={{
                    ...techEvent,
                    onActionClick: () => setRsvpModalEvent(techEvent),
                  }}
                />
              </div>
            </section>
          )}

          {/* SECTION 3: MEETS */}
          {(selectedCategory === "all" || selectedCategory === "meet") && (
            <section id="meets" className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm">
                  <Users2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight glass-heading">
                    3. Meets
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    In-person community hangouts, casual builder jams, and campus networking.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl">
                <EventCard
                  data={{
                    ...meet,
                    onActionClick: () => setRsvpModalEvent(meet),
                  }}
                />
              </div>
            </section>
          )}

          {/* SECTION 4: PROJECT MEET */}
          {(selectedCategory === "all" || selectedCategory === "project-meet") && (
            <section id="project-meet" className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm">
                  <FolderGit2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight glass-heading">
                    4. Project Meet
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Internal squad sync and milestone reviews for active projects shipping with BUILDCULT.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl">
                <EventCard
                  data={{
                    ...projectMeet,
                    onActionClick: () => setRsvpModalEvent(projectMeet),
                  }}
                />
              </div>
            </section>
          )}
        </main>

        {/* RSVP Confirmation Modal */}
        {rsvpModalEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setRsvpModalEvent(null)}
          >
            <div
              className="relative w-full max-w-md rounded-3xl p-7 glass-panel shadow-2xl border border-border/80 bg-card space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <span className="font-mono text-xs uppercase text-primary font-semibold">
                  Reserve Spot
                </span>
                <button
                  onClick={() => setRsvpModalEvent(null)}
                  className="text-muted-foreground hover:text-foreground text-lg leading-none cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {rsvpModalEvent.date}
                </span>
                <h3 className="text-xl font-display font-bold mt-2 text-foreground">
                  {rsvpModalEvent.title}
                </h3>
                {rsvpModalEvent.location && (
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    📍 {rsvpModalEvent.location}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  {rsvpModalEvent.description}
                </p>
              </div>

              <div className="rounded-2xl bg-muted/40 p-4 border border-border/40 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-emerald-400 font-semibold">Open for Registration</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span>{rsvpModalEvent.progressValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timeline:</span>
                  <span>{rsvpModalEvent.countdownText}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => {
                    const ev = rsvpModalEvent;
                    setRsvpModalEvent(null);
                    setPassModalEvent(ev);
                  }}
                  className="flex-1 rounded-full h-11 text-xs font-semibold glass-badge hover:border-white/50 cursor-pointer"
                >
                  Confirm & Get VIP Pass 🎟️
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRsvpModalEvent(null)}
                  className="rounded-full h-11 text-xs px-5 cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Instant Shareable VIP Pass Modal */}
        {passModalEvent && (
          <EventPassModal
            event={passModalEvent}
            onClose={() => setPassModalEvent(null)}
          />
        )}

        {/* Footer */}
        <footer className="py-8 text-center text-xs font-mono text-muted-foreground border-t border-border/30">
          <p>&copy; {new Date().getFullYear()} BUILDCULT · Liquid Metal Architecture</p>
        </footer>
      </div>
    </div>
  );
}

export default FutureEventsPage;
