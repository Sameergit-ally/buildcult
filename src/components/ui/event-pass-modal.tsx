import React, { useState, useRef } from "react";
import { type EventCardData } from "@/components/ui/course-design-cards";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  Ticket,
  Copy,
  Calendar,
  MapPin,
  X,
} from "lucide-react";

interface EventPassModalProps {
  event: EventCardData | null;
  onClose: () => void;
  defaultAttendeeName?: string;
}

export function EventPassModal({
  event,
  onClose,
  defaultAttendeeName = "",
}: EventPassModalProps) {
  const [attendeeName, setAttendeeName] = useState(
    defaultAttendeeName || (() => {
      try {
        return localStorage.getItem("pitti:name") || "";
      } catch {
        return "";
      }
    })
  );
  const [role, setRole] = useState("Builder / Developer");
  const [generated, setGenerated] = useState(false);
  const [ticketId] = useState(() => `BC-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!event) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim()) return;
    setGenerated(true);
  };

  const handleShare = async () => {
    const text = `🎟️ I just got my official VIP Pass for ${event.title} by @BUILDCULT!\nTicket ID: #${ticketId}\nSee you at the event! 🚀`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BUILDCULT Pass - ${event.title}`,
          text,
          url: window.location.href,
        });
      } catch {
        // Share cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    // Client-side SVG-to-Canvas high-res image generation
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 1080;
      canvas.height = 1350; // Instagram Story / Post 4:5 aspect ratio

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
      bgGrad.addColorStop(0, "#08080c");
      bgGrad.addColorStop(0.5, "#0f111a");
      bgGrad.addColorStop(1, "#050608");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1350);

      // Cyber glow orbs
      const glow1 = ctx.createRadialGradient(250, 300, 10, 250, 300, 450);
      glow1.addColorStop(0, "rgba(99, 102, 241, 0.35)");
      glow1.addColorStop(1, "transparent");
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, 1080, 1350);

      const glow2 = ctx.createRadialGradient(850, 950, 10, 850, 950, 450);
      glow2.addColorStop(0, "rgba(236, 72, 153, 0.25)");
      glow2.addColorStop(1, "transparent");
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, 1080, 1350);

      // Ticket Card Container
      ctx.save();
      ctx.fillStyle = "rgba(22, 24, 38, 0.85)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 3;

      // Rounded rect function
      const x = 90, y = 140, w = 900, h = 1070, r = 40;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Header Brand
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText("BUILDCULT", 160, 240);

      ctx.fillStyle = "#6366f1";
      ctx.font = "bold 24px monospace";
      ctx.fillText("OFFICIAL EVENT PASS", 160, 280);

      // Ticket ID pill
      ctx.fillStyle = "rgba(99, 102, 241, 0.18)";
      ctx.fillRect(720, 220, 200, 50);
      ctx.strokeStyle = "#6366f1";
      ctx.strokeRect(720, 220, 200, 50);
      ctx.fillStyle = "#a5b4fc";
      ctx.font = "bold 24px monospace";
      ctx.fillText(`#${ticketId}`, 750, 255);

      // Horizontal dashed line
      ctx.beginPath();
      ctx.setLineDash([12, 10]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.moveTo(140, 340);
      ctx.lineTo(940, 340);
      ctx.stroke();
      ctx.setLineDash([]);

      // Event Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 52px sans-serif";
      // Truncate title if long
      const displayTitle = event.title.length > 28 ? event.title.slice(0, 26) + "..." : event.title;
      ctx.fillText(displayTitle, 160, 440);

      // Event Meta
      ctx.fillStyle = "#94a3b8";
      ctx.font = "28px sans-serif";
      ctx.fillText(`📅  ${event.date}`, 160, 500);
      if (event.location) {
        ctx.fillText(`📍  ${event.location}`, 160, 550);
      }

      // Attendee Section Box
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(160, 610, 760, 230);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.strokeRect(160, 610, 760, 230);

      ctx.fillStyle = "#64748b";
      ctx.font = "bold 22px monospace";
      ctx.fillText("PASS HOLDER / BUILDER", 190, 660);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 56px sans-serif";
      ctx.fillText(attendeeName, 190, 730);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "26px sans-serif";
      ctx.fillText(`Role: ${role}  ·  Verified Cultist`, 190, 785);

      // Barcode simulation lines
      ctx.fillStyle = "#e2e8f0";
      const startBx = 160, bY = 890, bH = 80;
      for (let bx = 0; bx < 760; bx += 8) {
        const barW = (bx % 16 === 0 || bx % 24 === 0) ? 5 : 2;
        ctx.fillRect(startBx + bx, bY, barW, bH);
      }

      ctx.fillStyle = "#64748b";
      ctx.font = "18px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`SCAN AT VENUE GATE  ·  VALID FOR 1 ADMISSION  ·  ${ticketId}`, 540, 1020);
      ctx.fillText("WWW.BUILDCULT.ORG  ·  SHIPPING DIGITAL FUTURES", 540, 1140);
      ctx.textAlign = "left";

      ctx.restore();

      // Trigger download
      const link = document.createElement("a");
      link.download = `BUILDCULT-Pass-${attendeeName.replace(/\\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-card border border-border/80 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 h-8 w-8 rounded-full flex items-center justify-center bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {!generated ? (
          /* Step 1: Form to Generate Ticket */
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-medium">
                <Ticket className="h-3.5 w-3.5" />
                <span>Instant VIP Pass</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Get Your Official Event Pass
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate your personalized cyberpunk entry ticket for{" "}
                <span className="font-semibold text-foreground">{event.title}</span>.
                Download & share on socials to rep the Cult.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Your Full Name / Builder Handle *
                </label>
                <input
                  type="text"
                  required
                  maxLength={32}
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="e.g. Satoshi Nakamoto"
                  className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Your Domain / Specialization
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-sm text-foreground"
                >
                  <option value="Builder / Developer">Builder / Fullstack Dev</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="Product Designer">UI/UX & Product Designer</option>
                  <option value="Web3 & Blockchain">Web3 & Protocol Dev</option>
                  <option value="Founder / Hacker">Founder / Indie Hacker</option>
                  <option value="Student Creator">Student Enthusiast</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 text-xs font-mono space-y-1 text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>{event.date}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-sm font-semibold glass-badge hover:border-white/50 cursor-pointer shadow-lg gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Pass Now</span>
              </Button>
            </form>
          </div>
        ) : (
          /* Step 2: Rendered Ticket Preview & Action Buttons */
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Pass Issued Successfully</span>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                You're In, {attendeeName}!
              </h3>
            </div>

            {/* The Ticket Graphic UI */}
            <div
              ref={ticketRef}
              className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-slate-900/95 via-indigo-950/60 to-purple-950/80 p-6 shadow-2xl text-foreground font-sans backdrop-blur-xl"
            >
              {/* Top notch cutouts */}
              <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-card border border-border/80" />
              <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-card border border-border/80" />

              {/* Holographic accent glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-indigo-500/20 blur-2xl" />
              <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-pink-500/20 blur-2xl" />

              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="font-display font-black tracking-wider text-xl text-white">
                    BUILDCULT
                  </span>
                  <p className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                    VIP Builder Pass
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/30">
                    #{ticketId}
                  </span>
                </div>
              </div>

              {/* Ticket Content */}
              <div className="py-4 space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {event.tag || "Cult Gathering"}
                </span>
                <h4 className="text-lg font-bold font-display text-white line-clamp-1">
                  {event.title}
                </h4>
                <p className="font-mono text-xs text-white/70 flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-indigo-400" />
                  {event.date}
                </p>
                {event.location && (
                  <p className="font-mono text-xs text-white/70 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-pink-400" />
                    {event.location}
                  </p>
                )}
              </div>

              {/* Attendee Info Banner */}
              <div className="rounded-xl bg-black/40 border border-white/10 p-3 my-2 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Attendee</p>
                  <p className="text-base font-bold text-white tracking-tight">{attendeeName}</p>
                  <p className="text-[11px] text-indigo-300 font-mono">{role}</p>
                </div>
                <div className="text-right">
                  <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center font-mono text-xs font-bold text-white border border-white/20">
                    QR
                  </div>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="pt-3 flex flex-col items-center">
                <div className="flex justify-between w-full h-8 opacity-70">
                  {[...Array(38)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white"
                      style={{
                        width: i % 3 === 0 ? "3px" : i % 5 === 0 ? "5px" : "1.5px",
                      }}
                    />
                  ))}
                </div>
                <p className="font-mono text-[9px] text-white/50 tracking-widest mt-1">
                  VERIFIED BUILDER · ACCESS GRANTED
                </p>
              </div>
            </div>

            {/* Actions: Download Image & Share */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 h-11 rounded-xl text-xs font-semibold glass-badge hover:border-white/50 cursor-pointer shadow gap-2"
              >
                <Download className="h-4 w-4" />
                <span>{downloading ? "Exporting Pass..." : "Download Pass (HD)"}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleShare}
                className="h-11 rounded-xl text-xs px-5 cursor-pointer gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span>Share / Story</span>
                  </>
                )}
              </Button>
            </div>

            <p className="text-center font-mono text-[11px] text-muted-foreground">
              Tip: Post your pass on X / Instagram and tag{" "}
              <span className="text-primary font-semibold">@buildcult</span> to get featured!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventPassModal;
