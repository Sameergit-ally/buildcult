import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronDown,
  HelpCircle,
  MessageCircleQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/hero-01-utils/header";

export interface FaqPageProps {
  onBackToHome: () => void;
  onJoinClick?: () => void;
  onContactClick?: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

type FaqItem = {
  question: string;
  answer: string;
  category: "General" | "Recruitment" | "Events" | "Partnerships";
};

const FAQ_DATA: FaqItem[] = [
  {
    category: "General",
    question: "What exactly is BUILDCULT?",
    answer:
      "BUILDCULT is an action-driven builder collective. We bring together developers, designers, product thinkers, and operators to build production-grade web applications, interactive experiments, and open-source software together. No passive lectures—just building and shipping.",
  },
  {
    category: "General",
    question: "Is BUILDCULT only for computer science students?",
    answer:
      "Not at all. While many members study computer science, we have self-taught developers, designers, video creators, community managers, and working professionals. Anyone with passion, curiosity, and high standards is welcome.",
  },
  {
    category: "General",
    question: "Is there any membership fee to join BUILDCULT?",
    answer:
      "No. Joining BUILDCULT and participating in our hackathons, sprints, and core teams is 100% free. We are supported by community grants, partnerships, and event sponsorships.",
  },
  {
    category: "Recruitment",
    question: "How does the recruitment process work?",
    answer:
      "You pick one of our 5 departments (Technical, Design, Marketing & Growth, Event Management, or Content & Social Media) on the Join Us page, fill out the application with your proof-of-work, and submit. Our core team reviews every application within 3 to 5 business days and invites shortlisted candidates for a conversation.",
  },
  {
    category: "Recruitment",
    question: "Can I apply to multiple departments at once?",
    answer:
      "You can only submit one active application per department. If you have diverse skills, choose the primary department where you want to contribute first. Once inside the community, cross-collaboration between engineering, design, and growth is highly encouraged.",
  },
  {
    category: "Recruitment",
    question: "What if I am a beginner with no prior hackathon experience?",
    answer:
      "We value curiosity, consistency, and a strong willingness to learn over an extensive resume. If you have built small personal projects, tried new technologies, or have a clear vision of what you want to achieve, we encourage you to apply.",
  },
  {
    category: "Events",
    question: "How often do you organize hackathons and build sprints?",
    answer:
      "We run monthly online build sprints and quarterly in-person hackathons / demo nights across major university chapters and tech hubs. Check our Future Events page for the upcoming schedule.",
  },
  {
    category: "Events",
    question: "How do I RSVP or participate in an upcoming event?",
    answer:
      "Every upcoming event listed on the Future Events page has an active RSVP button. You can register individually or with a team. Notifications and team matchmaking links are shared via Discord and email.",
  },
  {
    category: "Partnerships",
    question: "How can my company or college club sponsor or collaborate with BUILDCULT?",
    answer:
      "We frequently partner with universities, developer tools, and tech companies for event sponsorships, workshop co-hosting, hiring pipelines, and hackathon challenges. You can reach out directly through our Contact page or click 'Let's Collaborate'.",
  },
  {
    category: "Partnerships",
    question: "Does BUILDCULT offer client web development or design services?",
    answer:
      "Yes! Our specialized agency wing crafts high-end web experiences, 3D interactive interfaces, WebGL shaders, and performance-tuned applications for founders and organizations. Check out our Services page for details.",
  },
];

export function FaqPage({ onBackToHome, onJoinClick, onContactClick }: FaqPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openIndices, setOpenIndices] = useState<number[]>([0]); // First open by default

  const categories = ["All", "General", "Recruitment", "Events", "Partnerships"];

  const filteredFaqs =
    selectedCategory === "All"
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === selectedCategory);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

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
            <MessageCircleQuestion className="h-3.5 w-3.5" />
            <span>KNOWLEDGE BASE · FAQ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight">
            <span className="glass-heading">FREQUENTLY ASKED </span>
            <span className="font-serif italic font-normal glass-accent">QUESTIONS</span>
          </h1>
          <p className="text-sm sm:text-base glass-subtext leading-relaxed">
            Everything you need to know about BUILDCULT, joining the community, our sprint hackathons, and collaboration opportunities.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all cursor-pointer",
                selectedCategory === cat
                  ? "glass-badge border-primary/50 text-foreground ring-1 ring-primary/40 shadow-sm"
                  : "bg-background/20 hover:bg-background/50 border-border/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-3.5">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "glass-panel border-primary/40 shadow-lg bg-background/50"
                    : "glass-panel border-border/50 hover:border-border/80 bg-background/20"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-foreground">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="glass-panel p-8 rounded-3xl border border-border/50 text-center space-y-4 mt-6">
          <HelpCircle className="h-8 w-8 text-primary mx-auto" />
          <h3 className="text-xl font-bold text-foreground">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Can't find the answer you're looking for? Reach out to our core team directly or join our community discussions.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              onClick={onContactClick || (() => { window.location.hash = "#contact"; })}
              className="rounded-full px-6 h-10 text-xs font-semibold glass-badge border-primary/50 cursor-pointer"
            >
              Contact Team
            </Button>
            <Button
              variant="outline"
              onClick={onJoinClick || (() => { window.location.hash = "#join-us"; })}
              className="rounded-full px-6 h-10 text-xs font-medium glass-badge hover:border-white/40 cursor-pointer"
            >
              Join Us
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

export default FaqPage;
