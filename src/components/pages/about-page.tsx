import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Sparkles,
  Code2,
  Users2,
  Rocket,
  Flame,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/hero-01-utils/header";

export interface AboutPageProps {
  onBackToHome: () => void;
  onJoinClick?: () => void;
  onContactClick?: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export function AboutPage({ onBackToHome, onJoinClick, onContactClick }: AboutPageProps) {

  const PILLARS = [
    {
      icon: Code2,
      title: "Radical Craft & Code",
      description:
        "We reject bloated boilerplate and surface-level tutorials. Every line of code, interactive shader, and micro-interaction is designed with high standards of performance and taste.",
    },
    {
      icon: Flame,
      title: "Bias for Action",
      description:
        "Ideas are cheap; execution is the differentiator. BUILDCULT runs on relentless shipping cycles, weekend sprint hackathons, and real deployments that face real users.",
    },
    {
      icon: Users2,
      title: "Decentralized Peer Network",
      description:
        "Engineers, product designers, spatial artists, and community founders working shoulder to shoulder without bureaucratic layers. Build with peers who raise your baseline.",
    },
    {
      icon: Rocket,
      title: "Venture & Distribution",
      description:
        "When projects show real traction, we don't let them gather dust in a repository. We connect teams with founder mentorship, angel networks, and early adopter distribution.",
    },
  ];

  const MILESTONES = [
    {
      year: "2024",
      title: "The Genesis",
      desc: "Founded as an underground circle of college hackers and developers frustrated by passive learning. First 48-hour build sprint shipped 12 live apps.",
    },
    {
      year: "2025",
      title: "Expansion & IRL Hackathons",
      desc: "Scaled across university campuses, partnered with tech ecosystems like Unstop and Geek Room, and hosted high-energy developer demo nights.",
    },
    {
      year: "2026",
      title: "The Cult Protocol",
      desc: "Launching full-stack project incubation squads, interactive web design services, and opening community recruitment across 5 specialized departments.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground flex flex-col justify-between overflow-x-hidden selection:bg-primary/20">
      {/* Top Header */}
      <header className="relative z-20 w-full px-6 py-6 flex items-center justify-between max-w-6xl mx-auto gap-4">
        <Button
          variant="outline"
          onClick={onBackToHome}
          className="rounded-full gap-2 glass-badge cursor-pointer hover:border-white/40 transition-all text-xs sm:text-sm px-4 h-10 shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="glass-heading font-medium">Back to Home</span>
        </Button>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2.5 font-display font-extrabold tracking-tight text-lg">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black border border-white/20 p-1 shadow-sm overflow-hidden">
              <img
                src="/buildcult-logo.png"
                alt="BUILDCULT Logo"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="glass-heading">
              BUILD<span className="glass-accent">CULT</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-5xl flex-1 flex flex-col gap-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-xs font-mono text-primary border border-primary/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>MANIFESTO · ABOUT BUILDCULT</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-tight">
            <span className="glass-heading">NOT JUST A COMMUNITY. </span>
            <br />
            <span className="font-serif italic font-normal glass-accent">A MOVEMENT OF BUILDERS.</span>
          </h1>
          <p className="text-base sm:text-lg glass-subtext leading-relaxed">
            BUILDCULT is an ecosystem of ambitious engineers, designers, and operators who believe in shipping real products over passive consumption. We learn by building, optimize for craft, and launch together.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "500+", label: "Active Builders" },
            { value: "25+", label: "Shipped Projects" },
            { value: "10+", label: "IRL & Online Sprints" },
            { value: "5", label: "Core Divisions" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl text-center border border-border/50 hover:border-primary/40 transition-colors"
            >
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Core Pillars */}
        <div className="space-y-6">
          <div className="text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-primary">Philosophy</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight glass-heading mt-1">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel p-6 sm:p-7 rounded-2xl border border-border/50 flex flex-col gap-3 hover:border-primary/40 transition-all hover:shadow-lg"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline / Evolution */}
        <div className="space-y-6">
          <div className="text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-primary">Journey</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight glass-heading mt-1">
              Our Evolution
            </h2>
          </div>

          <div className="relative border-l border-border/60 ml-4 sm:ml-6 space-y-8 pl-6">
            {MILESTONES.map((m, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors" />
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {m.year}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Card */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-primary/30 text-center flex flex-col items-center gap-5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight glass-heading">
            Ready to Build With Us?
          </h2>
          <p className="text-sm sm:text-base glass-subtext max-w-xl">
            Whether you are an engineer looking for teammates, a designer with bold vision, or a partner aiming to collaborate—there is a place for you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Button
              onClick={onJoinClick || (() => { window.location.hash = "#join-us"; })}
              className="rounded-full px-7 h-11 text-xs sm:text-sm font-semibold glass-badge border-primary/60 hover:border-primary text-foreground cursor-pointer shadow-lg"
            >
              Apply to Join Us
            </Button>
            <Button
              variant="outline"
              onClick={onContactClick || (() => { window.location.hash = "#contact"; })}
              className="rounded-full px-6 h-11 text-xs sm:text-sm font-medium glass-badge hover:border-white/40 cursor-pointer"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs font-mono text-muted-foreground border-t border-border/30 mt-12">
        <p>&copy; {CURRENT_YEAR} BUILDCULT · Liquid Architecture Protocol</p>
      </footer>
    </div>
  );
}

export default AboutPage;
