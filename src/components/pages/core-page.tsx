import React from "react";
import Header, { type NavigationSection } from "@/components/ui/hero-01-utils/header";
import CoreSection from "@/components/ui/core-section";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { GridPulse } from "@/components/ui/grid-pulse";

export interface CorePageProps {
  onBackToHome?: () => void;
}

export function CorePage({ onBackToHome }: CorePageProps) {
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
      isActive: true,
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
      title: "Future Events",
      href: "#future-events",
      onClick: (e) => {
        e.preventDefault();
        window.location.hash = "#future-events";
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
      title: "Join Us",
      href: "#join-us",
      onClick: (e) => {
        e.preventDefault();
        window.location.hash = "#join-us";
      },
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* GridPulse fills the entire page background */}
      <GridPulse
        className="fixed inset-0 z-0"
        cell={28}
        reach={2.8}
        ambient={3}
        maxLit={200}
      />
      <div className="relative z-10 flex flex-col flex-1">
        <Header
          navigationData={navigationData}
          onCollaborateClick={() => {
            window.location.hash = "#join-us";
          }}
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

        <main className="flex-1">
          <CoreSection
            id="core"
            onJoinClick={() => {
              window.location.hash = "#join-us";
            }}
          />
        </main>

        <footer className="py-8 text-center text-sm glass-subtext">
          <p>&copy; {new Date().getFullYear()} BUILDCULT. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default CorePage;

