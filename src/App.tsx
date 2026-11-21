import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AgencyHeroSection from "@/components/ui/hero-01";
import CorePage from "@/components/pages/core-page";
import JoinUsPage from "@/components/pages/join-us-page";
import ServicesPage from "@/components/pages/services-page";
import FutureEventsPage from "@/components/pages/future-events-page";
import AboutPage from "@/components/pages/about-page";
import FaqPage from "@/components/pages/faq-page";
import ContactPage from "@/components/pages/contact-page";
import PrivacyPage from "@/components/pages/privacy-page";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import GradientOrb from "@/components/ui/gradient-orb";
import { Sparkles } from "lucide-react";
import { PittiPitti } from "@/components/PittiPitti/PittiPitti";

export type PageRoute =
  | "home"
  | "core"
  | "services"
  | "join"
  | "future-events"
  | "about"
  | "faq"
  | "contact"
  | "privacy";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>("home");
  const [showTunnel, setShowTunnel] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      // Direct deep link to standalone pages skips intro tunnel
      if (
        window.location.hash === "#core-page" ||
        window.location.hash === "#core" ||
        window.location.hash === "#services-page" ||
        window.location.hash === "#services" ||
        window.location.hash === "#future-events" ||
        window.location.hash === "#events" ||
        window.location.hash === "#join-us" ||
        window.location.hash === "#join" ||
        window.location.hash === "#about" ||
        window.location.hash === "#faq" ||
        window.location.hash === "#contact" ||
        window.location.hash === "#privacy"
      ) return false;
      if (
        window.location.hash &&
        window.location.hash !== "#intro" &&
        window.location.hash !== "#home" &&
        window.location.hash !== "#"
      ) {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#core-page" || hash === "#core") {
        setCurrentPage("core");
        setShowTunnel(false);
      } else if (hash === "#services-page" || hash === "#services") {
        setCurrentPage("services");
        setShowTunnel(false);
      } else if (hash === "#future-events" || hash === "#events") {
        setCurrentPage("future-events");
        setShowTunnel(false);
      } else if (hash === "#join-us" || hash === "#join") {
        setCurrentPage("join");
        setShowTunnel(false);
      } else if (hash === "#about") {
        setCurrentPage("about");
        setShowTunnel(false);
      } else if (hash === "#faq") {
        setCurrentPage("faq");
        setShowTunnel(false);
      } else if (hash === "#contact") {
        setCurrentPage("contact");
        setShowTunnel(false);
      } else if (hash === "#privacy") {
        setCurrentPage("privacy");
        setShowTunnel(false);
      } else if (hash === "#intro") {
        setShowTunnel(true);
      } else {
        setCurrentPage("home");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToCore = () => {
    window.location.hash = "#core";
    setCurrentPage("core");
  };

  const navigateToServices = () => {
    window.location.hash = "#services";
    setCurrentPage("services");
  };

  const navigateToFutureEvents = () => {
    window.location.hash = "#future-events";
    setCurrentPage("future-events");
  };

  const navigateToHome = () => {
    window.location.hash = "";
    setCurrentPage("home");
  };

  const navigateToJoin = () => {
    window.location.hash = "#join-us";
    setCurrentPage("join");
  };

  const navigateToContact = () => {
    const el = document.getElementById("info");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "";
      setCurrentPage("home");
      setTimeout(() => {
        const infoEl = document.getElementById("info");
        if (infoEl) infoEl.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* 3D Perspective Tunnel Hero Entrance (No GradientOrb in scroll animation) */}
      <AnimatePresence mode="wait">
        {showTunnel && (
          <motion.div
            key="warp-tunnel"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.12,
              filter: "blur(12px)",
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            }}
            className="fixed inset-0 z-50 overflow-hidden bg-background"
          >
            <PerspectiveTunnelHero
              onEnterSite={() => {
                setShowTunnel(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* GradientOrb stays off services & future events, which have their own shader/canvas effects. */}
      {!showTunnel && currentPage !== "services" && currentPage !== "future-events" && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60 dark:opacity-85 transition-opacity duration-1000">
          <GradientOrb
            config={{
              background: "transparent",
              rotationSpeed: 0.28,
              noiseScale: 0.65,
              innerRadius: 0.1,
            }}
          />
        </div>
      )}

      {/* Active Page View */}
      <div className="relative z-10">
        {currentPage === "core" ? (
          <CorePage onBackToHome={navigateToHome} />
        ) : currentPage === "services" ? (
          <ServicesPage onBackToHome={navigateToHome} onJoinClick={navigateToJoin} />
        ) : currentPage === "future-events" ? (
          <FutureEventsPage onBackToHome={navigateToHome} onJoinClick={navigateToJoin} />
        ) : currentPage === "join" ? (
          <JoinUsPage onBackToHome={navigateToHome} />
        ) : currentPage === "about" ? (
          <AboutPage
            onBackToHome={navigateToHome}
            onJoinClick={navigateToJoin}
            onContactClick={navigateToContact}
          />
        ) : currentPage === "faq" ? (
          <FaqPage
            onBackToHome={navigateToHome}
            onJoinClick={navigateToJoin}
            onContactClick={navigateToContact}
          />
        ) : currentPage === "contact" ? (
          <ContactPage onBackToHome={navigateToHome} onJoinClick={navigateToJoin} />
        ) : currentPage === "privacy" ? (
          <PrivacyPage onBackToHome={navigateToHome} />
        ) : (
          <AgencyHeroSection
            onJoinClick={navigateToJoin}
            onCollaborateClick={navigateToContact}
            navigationData={[
              {
                title: "3D Intro",
                href: "#intro",
                onClick: (e) => {
                  e.preventDefault();
                  setShowTunnel(true);
                },
              },
              {
                title: "Home",
                href: "#home",
                isActive: true,
              },
              {
                title: "Core",
                href: "#core",
                onClick: (e) => {
                  e.preventDefault();
                  navigateToCore();
                },
              },
              {
                title: "Past Events",
                href: "#past-events",
              },
              {
                title: "Future Events",
                href: "#future-events",
                onClick: (e) => {
                  e.preventDefault();
                  navigateToFutureEvents();
                },
              },
              {
                title: "Services",
                href: "#services",
                onClick: (e) => {
                  e.preventDefault();
                  navigateToServices();
                },
              },
              {
                title: "Info & FAQ",
                href: "#info",
                onClick: (e) => {
                  e.preventDefault();
                  const el = document.getElementById("info");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                },
              },
              {
                title: "Join Us",
                href: "#join-us",
                onClick: (e) => {
                  e.preventDefault();
                  navigateToJoin();
                },
              },
            ]}
          />
        )}
      </div>

      {/* Floating Replay 3D Tunnel Pill */}
      {!showTunnel && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "instant" });
            setShowTunnel(true);
          }}
          aria-label="Replay 3D Warp Intro"
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full glass-badge px-4 py-2 text-xs font-semibold shadow-2xl hover:border-white/50 transition-all cursor-pointer group"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-primary group-hover:scale-110 transition-transform">
            <Sparkles className="h-3 w-3" />
          </span>
          <span className="glass-heading">Warp Tunnel</span>
        </button>
      )}

      {/* Pitti Pitti mascot */}
      <PittiPitti />
    </div>
  );
}
