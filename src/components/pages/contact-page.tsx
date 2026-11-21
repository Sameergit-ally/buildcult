import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Send,
  MapPin,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/hero-01-utils/header";

export interface ContactPageProps {
  onBackToHome: () => void;
  onJoinClick?: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export function ContactPage({ onBackToHome, onJoinClick }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

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

      {/* Main Container */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-5xl flex-1 flex flex-col gap-12">
        {/* Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-xs font-mono text-primary border border-primary/30">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>TRANSMISSION LINE · CONTACT US</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight">
            <span className="glass-heading">LET'S START A </span>
            <span className="font-serif italic font-normal glass-accent">CONVERSATION</span>
          </h1>
          <p className="text-sm sm:text-base glass-subtext leading-relaxed">
            Have an event proposal, sponsorship opportunity, project idea, or question? Connect directly with our team.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Info Card (Left 2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-border/50 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Direct Channels</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  We reply within 24 hours on all core channels.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <a
                  href="mailto:contact@buildcult.dev"
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/30 hover:bg-background/60 border border-border/40 transition-colors group cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-muted-foreground text-[11px] font-mono uppercase">
                      Official Email
                    </span>
                    <span className="font-semibold text-foreground">contact@buildcult.dev</span>
                  </div>
                </a>

                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/30 hover:bg-background/60 border border-border/40 transition-colors group cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-muted-foreground text-[11px] font-mono uppercase">
                      Telegram Hub
                    </span>
                    <span className="font-semibold text-foreground">@buildcult_hq</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/30 border border-border/40">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-muted-foreground text-[11px] font-mono uppercase">
                      Headquarters
                    </span>
                    <span className="font-semibold text-foreground">Delhi NCR & Bengaluru, India</span>
                  </div>
                </div>
              </div>

              {/* Social Link Badges */}
              <div className="pt-2 border-t border-border/30">
                <span className="block text-[11px] font-mono text-muted-foreground uppercase mb-3">
                  Follow Our Sprints
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "X (Twitter)", href: "https://x.com/Build_Cult" },
                    { label: "LinkedIn", href: "https://www.linkedin.com/company/buildcult/about/" },
                    { label: "Instagram", href: "https://www.instagram.com/buildcult/" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full text-xs font-mono glass-badge hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{s.label}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Recruitment Callout */}
            <div className="glass-panel p-5 rounded-2xl border border-primary/30 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Looking to join the crew?</p>
                <p className="text-[11px] text-muted-foreground">Applications are open for 2026.</p>
              </div>
              <Button
                onClick={onJoinClick || (() => { window.location.hash = "#join-us"; })}
                className="rounded-full px-4 h-9 text-xs font-semibold glass-badge border-primary/50 cursor-pointer"
              >
                Join Us
              </Button>
            </div>
          </div>

          {/* Form Card (Right 3 cols) */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-border/50 shadow-2xl relative overflow-hidden">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-400">
                  <div className="h-16 w-16 rounded-full glass-badge flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Transmission Received</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Thank you for reaching out, <span className="text-foreground font-semibold">{formData.name}</span>. A core team member will review your note and respond shortly.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        subject: "General Inquiry",
                        message: "",
                      });
                    }}
                    variant="outline"
                    className="rounded-full px-6 h-10 text-xs font-mono uppercase glass-badge hover:border-white/40 cursor-pointer mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="border-b border-border/30 pb-3">
                    <h2 className="text-xl font-bold glass-heading">Send a Message</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Fill out the form below and we will get back to you promptly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Mercer"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-background/20 rounded-xl px-4 py-2.5 text-sm text-foreground border border-border/60 outline-none focus:border-primary/80 transition-all placeholder:text-muted-foreground/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-background/20 rounded-xl px-4 py-2.5 text-sm text-foreground border border-border/60 outline-none focus:border-primary/80 transition-all placeholder:text-muted-foreground/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Inquiry Category *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-background/40 dark:bg-zinc-900/60 rounded-xl px-4 py-2.5 text-sm text-foreground border border-border/60 outline-none focus:border-primary/80 transition-all"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Hackathon Sponsorship">Hackathon Sponsorship / Partnering</option>
                      <option value="Event Collaboration">Event Collaboration / College Chapter</option>
                      <option value="Development & Agency Services">Development & Agency Services</option>
                      <option value="Press / Media">Press / Media</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your project, idea, or how you want to collaborate..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-background/20 rounded-xl p-4 text-sm text-foreground border border-border/60 outline-none resize-y focus:border-primary/80 transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative h-12 rounded-full overflow-hidden transition-all duration-300 cursor-pointer shadow-xl glass-badge border-primary/50 flex items-center justify-center gap-2 mt-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                    <span className="relative z-10 flex items-center gap-2 font-mono uppercase tracking-wider text-xs sm:text-sm font-bold glass-heading">
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 text-primary" />
                          <span>Transmit Message</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
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

export default ContactPage;
