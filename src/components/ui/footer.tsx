import React, { useState } from "react";
import Logo from "./hero-01-utils/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Send, Check } from "lucide-react";

// SVG Icons for Instagram & LinkedIn
const InstagramIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XTwitterIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-transparent pt-16 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/40">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="text-sm glass-subtext max-w-sm leading-relaxed">
              <span className="glass-accent font-semibold">SHIPPING THE RESULT. BUILDING THE CULT</span>
              <br />
              A builder-driven community turning ideas into tangible outcomes. Learn by doing, build consistently, ship together.
            </p>
            <div className="flex gap-2.5 mt-2">
              {[
                { icon: XTwitterIcon, href: "https://x.com/Build_Cult", label: "X (Twitter)" },
                { icon: LinkedinIcon, href: "https://www.linkedin.com/company/buildcult/about/", label: "LinkedIn" },
                { icon: InstagramIcon, href: "https://www.instagram.com/buildcult/", label: "Instagram" },
                { icon: Send, href: "https://t.me", label: "Telegram" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full glass-badge text-muted-foreground hover:text-white transition cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase glass-heading">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 text-sm glass-subtext">
              <li>
                <a href="#home" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition">
                  About
                </a>
              </li>
              <li>
                <a href="#core" className="hover:text-white transition">
                  Core Crew
                </a>
              </li>
              <li>
                <a href="#past-events" className="hover:text-white transition">
                  Past Events
                </a>
              </li>
              <li>
                <a href="#future-events" className="hover:text-white transition">
                  Future Events
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#join-us" className="text-primary font-semibold hover:underline transition">
                  Join Us (Recruitment)
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase glass-heading">
              Stay in the Cult
            </h4>
            <p className="text-xs glass-subtext">
              Receive drops, engineering teardowns, and design experiments.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-1">
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="rounded-full glass-panel border-white/20 pr-10 text-xs sm:text-sm h-10 glass-subtext"
                  required
                />
              </div>
              <Button
                type="submit"
                className="rounded-full text-xs h-9 font-medium gap-1.5 cursor-pointer glass-badge hover:border-white/40"
              >
                {subscribed ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Join Newsletter</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs glass-subtext">
          <p>&copy; {new Date().getFullYear()} BUILDCULT. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#about" className="hover:text-white transition">
              About
            </a>
            <a href="#faq" className="hover:text-white transition">
              FAQ
            </a>
            <a href="#contact" className="hover:text-white transition">
              Contact
            </a>
            <a href="#privacy" className="hover:text-white transition">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
