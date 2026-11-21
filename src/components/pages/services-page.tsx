import React from "react";
import Header, { type NavigationSection } from "@/components/ui/hero-01-utils/header";
import DottedTrailCursor from "@/components/ui/dotted-trail-cursor";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Flame,
  Terminal,
  Cpu,
  Boxes,
  Users2,
  Workflow,
  ArrowUpRight,
  Code2,
  Rocket
} from "lucide-react";

export interface ServicesPageProps {
  onBackToHome?: () => void;
  onJoinClick?: () => void;
}

const WHAT_WE_OFFER = [
  {
    icon: Flame,
    title: "Hackathons & Build Sprints",
    category: "Action-Driven",
    description:
      "Intensive 24h–48h sprints where ideas transform into production code. We provide problem statements, mentorship, high-stakes judging, and raw execution energy.",
    features: ["End-to-End Sprint Coordination", "Hands-On Mentorship", "Prize Pools & Sponsor Grants", "Real-Time Demo Days"],
  },
  {
    icon: Terminal,
    title: "Collaborative Project Incubation",
    category: "Ecosystem",
    description:
      "Beyond weekend events, we form cross-disciplinary builder squads—pairing engineers with designers and operators to launch open-source and venture-track projects.",
    features: ["Team Formation & Matchmaking", "Technical Architecture Reviews", "VCS & CI/CD Pipeline Setup", "Milestone Accountability"],
  },
  {
    icon: Cpu,
    title: "Next-Gen Web & Interactive Craft",
    category: "Engineering",
    description:
      "Pushing the boundaries of the web with fluid physics, WebGL shaders, Three.js 3D spatial micro-interactions, and uncompromising React performance.",
    features: ["Shader & Motion Physics", "Design System Engineering", "Speed & Core Web Vitals Audits", "Headless & Distributed Architectures"],
  },
  {
    icon: Boxes,
    title: "Developer Network & Campus Chapters",
    category: "Community",
    description:
      "An evolving nationwide network connecting university creators, self-taught hackers, and experienced startup engineers under one collaborative flag.",
    features: ["Decentralized Campus Nodes", "IRL Meetups & Midnight Jams", "Exclusive Discord Builder Rooms", "Cross-Campus Talent Access"],
  },
  {
    icon: Workflow,
    title: "Venture Velocity & Launchpad",
    category: "Growth",
    description:
      "For teams that ship products with real traction: direct connections to founders, seed angel networks, demo night spotlights, and distribution channels.",
    features: ["Founder Office Hours", "Demo Night Spotlights", "Early User Testing Feedback", "Investor & Grant Introductions"],
  },
  {
    icon: Users2,
    title: "Talent & Core Apprenticeship",
    category: "Culture",
    description:
      "Learn by building in public. We don't do theory or passive lectures; our builders level up by contributing to real codebases, shipping daily, and reviewing PRs.",
    features: ["Code Reviews with Senior Builders", "Open-Source Contributions", "Leadership Track in Core Crew", "Lifelong Builder Credentials"],
  },
];

export function ServicesPage({ onBackToHome, onJoinClick }: ServicesPageProps) {
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
      title: "Services",
      href: "#services",
      isActive: true,
    },
    {
      title: "Future Events",
      href: "#future-events",
      onClick: (e) => {
        e.preventDefault();
        window.location.hash = "#future-events";
      },
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

  return (
    <DottedTrailCursor>
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Header
        navigationData={navigationData}
        onCollaborateClick={onJoinClick || (() => { window.location.hash = "#join-us"; })}
      />

      <div className="container mx-auto px-4 pt-6">
        <Button
          variant="ghost"
          onClick={onBackToHome}
          className="gap-2 glass-badge cursor-pointer rounded-full hover:border-white/40"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="glass-heading font-medium">Back to Home</span>
        </Button>
      </div>

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold glass-badge mb-4">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>ECOSYSTEM & CAPABILITIES</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight">
              <span className="glass-heading">What We </span>
              <span className="font-serif italic font-normal glass-accent">Do</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg glass-subtext leading-relaxed">
              Build Cult is a builder-driven community focused on turning ideas into real, tangible outcomes. We provide the ecosystem, engineering backing, and platform to help creators build consistently.
            </p>
          </div>

          {/* About Us Manifesto Banner */}
          <div className="w-full glass-panel p-8 sm:p-12 rounded-3xl mb-16 relative overflow-hidden border border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
              <div className="max-w-2xl">
                <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                  WHO WE ARE · OUR MANIFESTO
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-bold mt-2 mb-4 glass-heading">
                  A System Built to Create.
                </h2>
                <div className="space-y-3 text-sm sm:text-base glass-subtext leading-relaxed">
                  <p>
                    We bring together developers, designers, operators and creators who believe in learning by doing. Through hackathons, build sprints and collaborative projects, Build Cult creates an environment where individuals don’t just participate; they create, experiment, and ship.
                  </p>
                  <p>
                    The goal is simple — move beyond passive consumption and build consistently. From forming teams to executing ideas, the community is designed to enable real work, real collaboration, and real growth.
                  </p>
                  <p className="font-medium text-foreground">
                    Build Cult is not limited to a single event or campus. It is an evolving network of builders aiming to create impactful projects, host meaningful experiences, and push the culture of building forward.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6 rounded-2xl glass-badge max-w-xs w-full">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  The Principle
                </span>
                <blockquote className="font-serif italic text-lg glass-accent">
                  "If you’re here, you’re not just joining a community; you’re joining a system built to create."
                </blockquote>
                <Button
                  onClick={onJoinClick || (() => { window.location.hash = "#join-us"; })}
                  className="rounded-full h-10 text-xs font-semibold glass-badge hover:border-white/50 cursor-pointer gap-2 mt-2"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Join the System</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Grid of Services / Offerings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHAT_WE_OFFER.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group relative rounded-2xl glass-panel p-7 transition-all duration-300 hover:border-white/35 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl glass-badge text-primary group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-[11px] tracking-wider uppercase text-muted-foreground glass-badge px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold tracking-tight glass-heading mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm glass-subtext leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="border-t border-border/40 pt-4 mt-auto">
                    <ul className="flex flex-col gap-2">
                      {item.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center flex flex-col items-center gap-4 py-12 rounded-3xl glass-panel">
            <h3 className="text-2xl sm:text-4xl font-display font-bold glass-heading">
              Ready to Turn Your Ideas into Reality?
            </h3>
            <p className="text-sm sm:text-base glass-subtext max-w-lg">
              Whether you want to build alongside our crew, attend our next hackathon sprint, or bring Build Cult to your campus.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button
                onClick={onJoinClick || (() => { window.location.hash = "#join-us"; })}
                className="rounded-full px-8 h-12 text-sm font-semibold glass-badge hover:border-white/50 cursor-pointer gap-2"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Apply to Join Build Cult</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm glass-subtext">
        <p>&copy; {new Date().getFullYear()} BUILDCULT · A System Built to Create.</p>
      </footer>
    </div>
    </DottedTrailCursor>
  );
}

export default ServicesPage;

