import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, CheckCircle2, Send, Shield, Globe, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/hero-01-utils/header";

export interface JoinUsPageProps {
  onBackToHome: () => void;
}

const DEPARTMENTS = [
  {
    id: "engineering",
    label: "Engineering",
    desc: "React, WebGL, Next.js, Rust & Systems",
    icon: Terminal,
  },
  {
    id: "design",
    label: "Design & Motion",
    desc: "UI/UX, 3D Shaders, Spatial Craft & Figma",
    icon: Sparkles,
  },
  {
    id: "operations",
    label: "Community & Events",
    desc: "Backbone, IRL Demo Nights & Hackathons",
    icon: Shield,
  },
  {
    id: "growth",
    label: "DevRel & Growth",
    desc: "Open Source, Brand Direction & Culture",
    icon: Globe,
  },
];

export function JoinUsPage({ onBackToHome }: JoinUsPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    profession: "",
    department: "engineering",
    contact: "",
    portfolio: "",
    pitch: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Monitor theme state
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Generate static random values once per mount for fluid background blobs
  const blobsData = useMemo(() => {
    return Array.from({ length: 6 }).map(() => ({
      size: Math.random() * 220 + 160,
      left: Math.random() * 80 + 10,
      top: Math.random() * 80 + 10,
      animationDelay: Math.random() * -20,
      animationDuration: Math.random() * 14 + 14,
    }));
  }, []);

  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fluid mouse movement parallax on mercury blobs
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      blobRefs.current.forEach((blob, index) => {
        if (blob) {
          const speed = (index + 1) * 18;
          blob.style.marginLeft = `${(x - 0.5) * speed}px`;
          blob.style.marginTop = `${(y - 0.5) * speed}px`;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* SVG Gooey Filter for liquid coalescence */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="mercury-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Floating Mercury Physics Stage */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-50 dark:opacity-60 transition-opacity"
        style={{ filter: "url(#mercury-gooey)" }}
      >
        {blobsData.map((data, index) => (
          <div
            key={index}
            ref={(el) => {
              blobRefs.current[index] = el;
            }}
            className="absolute rounded-full will-change-transform"
            style={{
              width: `${data.size}px`,
              height: `${data.size}px`,
              left: `${data.left}%`,
              top: `${data.top}%`,
              background: isDark
                ? "linear-gradient(135deg, #e2e8f0 0%, #64748b 50%, #334155 100%)"
                : "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)",
              filter: "blur(22px)",
              boxShadow: isDark
                ? "inset -12px -12px 24px rgba(0,0,0,0.7), 12px 12px 32px rgba(255,255,255,0.25)"
                : "inset -12px -12px 24px rgba(0,0,0,0.2), 12px 12px 32px rgba(255,255,255,0.7)",
              animation: `mercuryFloat ${data.animationDuration}s infinite alternate ease-in-out`,
              animationDelay: `${data.animationDelay}s`,
              transition: "margin 0.15s cubic-bezier(0.2, 1, 0.3, 1)",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes mercuryFloat {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(8vw, 12vh) scale(1.15); }
          66% { transform: translate(-6vw, 8vh) scale(0.85); }
          100% { transform: translate(6vw, -8vh) scale(1.1); }
        }
      `}</style>

      {/* Navigation Top Bar */}
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
            <span className="glass-heading">BUILD<span className="glass-accent">CULT</span></span>
          </div>
        </div>
      </header>

      {/* Main Recruitment Portal */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-3xl flex-1 flex flex-col justify-center">
        {!submitted ? (
          <div className="w-full glass-panel p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300">
            {/* Top Node Tracker */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Node: RECRUIT-0x992</span>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest glass-badge px-2.5 py-0.5 rounded-full">
                Season 2026
              </span>
            </div>

            {/* Header */}
            <div className="mb-10 text-left">
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight">
                <span className="glass-heading">JOIN THE </span>
                <span className="font-serif italic font-normal glass-accent">CULT</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base glass-subtext leading-relaxed max-w-xl">
                We craft radical digital experiences, fluid motion engines, and bleeding-edge web infrastructure. Tell us about yourself.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-7">
              {/* Question 1: Name */}
              <div className="group relative">
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors group-focus-within:text-foreground">
                  01. Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-border/60 py-3 text-base sm:text-lg text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-foreground/80"
                />
              </div>

              {/* Question 2: College / University */}
              <div className="group relative">
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors group-focus-within:text-foreground">
                  02. College / University / Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IIT Delhi / University / Self-taught"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full bg-transparent border-b border-border/60 py-3 text-base sm:text-lg text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-foreground/80"
                />
              </div>

              {/* Question 3: Profession / Current Role */}
              <div className="group relative">
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors group-focus-within:text-foreground">
                  03. Current Profession / Focus *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack Dev / UI-UX Designer / CS Undergrad"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full bg-transparent border-b border-border/60 py-3 text-base sm:text-lg text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-foreground/80"
                />
              </div>

              {/* Question 4: Department Selection */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  04. Which Department Do You Want to Join? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEPARTMENTS.map((dept) => {
                    const Icon = dept.icon;
                    const isSelected = formData.department === dept.id;
                    return (
                      <button
                        type="button"
                        key={dept.id}
                        onClick={() => setFormData({ ...formData, department: dept.id })}
                        className={cn(
                          "flex items-start gap-3 p-3.5 rounded-xl text-left transition-all cursor-pointer border",
                          isSelected
                            ? "glass-badge border-primary/50 ring-1 ring-primary/40 shadow-md"
                            : "bg-background/30 hover:bg-background/60 border-border/50 text-muted-foreground"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg transition-colors mt-0.5",
                          isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className={cn("text-sm font-semibold", isSelected ? "glass-heading" : "text-foreground")}>
                            {dept.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
                            {dept.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 5: Contact Handle */}
              <div className="group relative">
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors group-focus-within:text-foreground">
                  05. Contact Email / Discord / Telegram *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. elena@buildcult.dev or @elena:discord"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full bg-transparent border-b border-border/60 py-3 text-base sm:text-lg text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-foreground/80"
                />
              </div>

              {/* Question 6: Portfolio / GitHub */}
              <div className="group relative">
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors group-focus-within:text-foreground">
                  06. Portfolio / GitHub / X Profile Link
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/yourhandle or portfolio URL"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  className="w-full bg-transparent border-b border-border/60 py-3 text-base sm:text-lg text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-foreground/80"
                />
              </div>

              {/* Question 7: Why BUILDCULT & What You Build */}
              <div className="group relative">
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors group-focus-within:text-foreground">
                  07. What drives you? Tell us about the coolest thing you've built.
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us what you love shipping, your favorite tech stacks, or what you want to achieve with BUILDCULT..."
                  value={formData.pitch}
                  onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                  className="w-full bg-transparent border-b border-border/60 py-3 text-sm sm:text-base text-foreground outline-none resize-none transition-all placeholder:text-muted-foreground/40 focus:border-foreground/80"
                />
              </div>

              {/* Mercury Submit Button */}
              <div className="mt-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full h-14 rounded-full overflow-hidden transition-all duration-500 cursor-pointer shadow-2xl glass-badge hover:border-white/50"
                >
                  {/* Fluid liquid mercury sheen on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2 font-mono uppercase tracking-[0.2em] text-xs sm:text-sm font-bold glass-heading">
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Transmitting Node Data...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-primary" />
                        Initialize Application
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success View */
          <div className="w-full glass-panel p-8 sm:p-14 rounded-3xl shadow-2xl text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="h-20 w-20 rounded-full glass-badge flex items-center justify-center text-emerald-400 shadow-xl border border-emerald-500/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="flex flex-col gap-2 max-w-md">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                Transmission Acknowledged
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight glass-heading">
                Welcome to the Pipeline, {formData.name || "Builder"}.
              </h2>
              <p className="text-sm sm:text-base glass-subtext mt-2 leading-relaxed">
                Your application for the <span className="font-semibold text-foreground uppercase">{formData.department}</span> department has been recorded into BUILDCULT's core ledger.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-background/50 border border-border/40 text-xs font-mono text-muted-foreground w-full max-w-sm text-left">
              <div>Applicant: {formData.name}</div>
              <div>Affiliation: {formData.college || "N/A"}</div>
              <div>Department: {formData.department}</div>
              <div>Status: Under Review by Core Crew</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button
                onClick={onBackToHome}
                className="rounded-full px-6 h-11 glass-badge hover:border-white/40 cursor-pointer text-sm font-semibold"
              >
                Return to BUILDCULT
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: "",
                    college: "",
                    profession: "",
                    department: "engineering",
                    contact: "",
                    portfolio: "",
                    pitch: "",
                  });
                }}
                className="rounded-full text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Submit Another Application
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs font-mono text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BUILDCULT · Liquid Architecture Protocol</p>
      </footer>
    </div>
  );
}

export default JoinUsPage;
