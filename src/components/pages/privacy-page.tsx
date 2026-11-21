import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  FileText,
  Server,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/hero-01-utils/header";

export interface PrivacyPageProps {
  onBackToHome: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export function PrivacyPage({ onBackToHome }: PrivacyPageProps) {

  const SECTIONS = [
    {
      icon: Eye,
      title: "1. Information We Collect",
      content:
        "When you use our website, apply to join BUILDCULT, RSVP for hackathons, or submit contact requests, we may collect information including your full name, email address, WhatsApp/phone number, university or organization, current year or profession, city, portfolio or GitHub links, and domain-specific questionnaire answers. We do not collect sensitive payment credentials or unnecessary personal identifiers.",
    },
    {
      icon: Server,
      title: "2. How We Use Your Information",
      content:
        "The data you provide is used strictly for community administration, reviewing recruitment applications, coordinating on-ground hackathons, issuing event notifications, matching builders into sprint teams, and responding to project inquiries. We do not sell, rent, or trade your personal information to third-party data brokers or advertisers.",
    },
    {
      icon: Lock,
      title: "3. Data Security & Storage",
      content:
        "We implement industry-standard database encryption, Row Level Security (RLS) policies, and modern security protocols to protect your submitted records. Access to application responses and applicant contacts is restricted exclusively to authorized core organizers.",
    },
    {
      icon: UserCheck,
      title: "4. Your Rights & Data Retention",
      content:
        "You have the right to request a copy of the data we hold about you, request corrections to inaccurate details, or ask for the deletion of your application records and email subscriptions at any time by contacting contact@buildcult.dev.",
    },
    {
      icon: FileText,
      title: "5. Cookies & Analytics",
      content:
        "We use minimal, privacy-respecting client analytics and local storage (such as remembering your dark/light theme preference). We do not deploy invasive third-party cross-site tracking scripts.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground flex flex-col justify-between overflow-x-hidden selection:bg-primary/20">
      {/* Header */}
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

      {/* Main Container */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-4xl flex-1 flex flex-col gap-10">
        {/* Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-xs font-mono text-primary border border-primary/30">
            <Shield className="h-3.5 w-3.5" />
            <span>DATA INTEGRITY · PRIVACY POLICY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight">
            <span className="glass-heading">PRIVACY </span>
            <span className="font-serif italic font-normal glass-accent">POLICY</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono">
            Last updated: February 2026 · Protocol Version 2.4
          </p>
        </div>

        {/* Commitment Banner */}
        <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-primary/30 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Our Builder Privacy Oath</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              BUILDCULT is engineered by developers for developers. We treat your personal data and creative proof-of-work with the utmost respect. We collect only what is strictly required to review applications and organize transparent events.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="flex flex-col gap-5">
          {SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 sm:p-7 rounded-2xl border border-border/50 hover:border-border/80 transition-colors space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">{sec.title}</h2>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-11">
                  {sec.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Contact Info Card */}
        <div className="glass-panel p-6 rounded-2xl border border-border/40 text-center space-y-2">
          <p className="text-xs sm:text-sm text-foreground font-semibold">
            Have questions regarding this policy or your data rights?
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Send an email to <a href="mailto:privacy@buildcult.dev" className="text-primary hover:underline">privacy@buildcult.dev</a> or <a href="mailto:contact@buildcult.dev" className="text-primary hover:underline">contact@buildcult.dev</a>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs font-mono text-muted-foreground border-t border-border/30 mt-12">
        <p>&copy; {CURRENT_YEAR} BUILDCULT · Liquid Architecture Protocol</p>
      </footer>
    </div>
  );
}

export default PrivacyPage;
