import React, { useState } from "react";
import {
  HelpCircle,
  Mail,
  Shield,
  ChevronDown,
  Send,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What is BUILDCULT?",
    a: "A community of developers, designers, and operators building and shipping real web products through hackathons and sprints.",
  },
  {
    q: "How does recruitment work?",
    a: "Pick a department (Technical, Design, Marketing, Events, Content), submit your proof-of-work, and our core crew reviews it in 3-5 days.",
  },
  {
    q: "Is there any membership fee?",
    a: "No, joining BUILDCULT and participating in all sprints and events is 100% free.",
  },
  {
    q: "Can I sponsor or partner with BUILDCULT?",
    a: "Yes! We collaborate with colleges, hackathons, and tech companies. Reach out below.",
  },
];

export function InfoHubSection({ id = "info-hub" }: { id?: string }) {
  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "privacy">("faq");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id={id} className="w-full py-16 md:py-20 bg-transparent relative">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest px-3.5 py-1 rounded-full glass-badge mb-3">
            RESOURCES & INFO
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight glass-heading">
            Everything You Need to Know
          </h2>
        </div>

        {/* 3 Tab Pills: FAQ, Contact, Privacy */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-full glass-panel border border-border/50 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("faq")}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                activeTab === "faq"
                  ? "glass-badge border-primary/50 text-foreground ring-1 ring-primary/40 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <HelpCircle className="h-4 w-4 text-primary" />
              <span>FAQ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("contact")}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                activeTab === "contact"
                  ? "glass-badge border-primary/50 text-foreground ring-1 ring-primary/40 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Mail className="h-4 w-4 text-primary" />
              <span>Contact</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                activeTab === "privacy"
                  ? "glass-badge border-primary/50 text-foreground ring-1 ring-primary/40 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Shield className="h-4 w-4 text-primary" />
              <span>Privacy</span>
            </button>
          </div>
        </div>

        {/* TAB 1: FAQ */}
        {activeTab === "faq" && (
          <div className="max-w-3xl mx-auto flex flex-col gap-3 animate-in fade-in duration-200">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-2xl border transition-all duration-200 overflow-hidden",
                    isOpen
                      ? "glass-panel border-primary/40 bg-background/50"
                      : "glass-panel border-border/40 hover:border-border/70 bg-background/20"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-semibold text-foreground">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: CONTACT */}
        {activeTab === "contact" && (
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
            {/* Quick channels */}
            <div className="glass-panel p-6 rounded-2xl border border-border/50 flex flex-col justify-between gap-4">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-foreground">Get In Touch</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Have an event proposal, sponsorship idea, or questions? Send us a note.
                </p>
                <div className="space-y-2.5 text-xs">
                  <a
                    href="mailto:contact@buildcult.dev"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-background/30 hover:bg-background/60 border border-border/40 transition-colors"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">contact@buildcult.dev</span>
                  </a>
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-background/30 hover:bg-background/60 border border-border/40 transition-colors"
                  >
                    <Send className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">Telegram: @buildcult_hq</span>
                  </a>
                </div>
              </div>

              <div className="flex gap-2 text-xs">
                <a
                  href="https://x.com/Build_Cult"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full glass-badge text-[11px] hover:border-primary/50 text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  X (Twitter) <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/buildcult/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full glass-badge text-[11px] hover:border-primary/50 text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  LinkedIn <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>

            {/* Quick message form */}
            <div className="glass-panel p-6 rounded-2xl border border-border/50">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-6 gap-2">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                  <p className="text-sm font-bold text-foreground">Message Sent!</p>
                  <p className="text-xs text-muted-foreground">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-background/20 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-foreground border border-border/60 outline-none focus:border-primary/80"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-background/20 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-foreground border border-border/60 outline-none focus:border-primary/80"
                  />
                  <textarea
                    rows={3}
                    required
                    placeholder="Your Message..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-background/20 rounded-xl p-3 text-xs sm:text-sm text-foreground border border-border/60 outline-none resize-none focus:border-primary/80"
                  />
                  <button
                    type="submit"
                    className="h-10 rounded-full glass-badge border-primary/50 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer hover:border-primary transition-all"
                  >
                    <Send className="h-3.5 w-3.5 text-primary" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRIVACY */}
        {activeTab === "privacy" && (
          <div className="max-w-3xl mx-auto glass-panel p-6 sm:p-8 rounded-2xl border border-border/50 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-foreground">Privacy Summary</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed list-disc pl-5">
              <li>
                <strong className="text-foreground">Data Collection:</strong> We only collect information you provide directly (such as name, email, WhatsApp, and project portfolio for applications).
              </li>
              <li>
                <strong className="text-foreground">Usage:</strong> Used strictly for reviewing applications, organizing hackathons, and responding to inquiries. We never sell or share your data.
              </li>
              <li>
                <strong className="text-foreground">Security:</strong> Stored securely with Row Level Security (RLS) policies and encrypted database connections.
              </li>
              <li>
                <strong className="text-foreground">Your Rights:</strong> Request deletion or update of your data anytime at{" "}
                <a href="mailto:privacy@buildcult.dev" className="text-primary underline">
                  privacy@buildcult.dev
                </a>.
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default InfoHubSection;
