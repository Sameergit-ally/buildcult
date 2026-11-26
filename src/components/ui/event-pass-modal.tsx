import React, { useState, useRef } from "react";
import { type EventCardData } from "@/components/ui/course-design-cards";
import { Button } from "@/components/ui/button";
import { AdmitOneTicket } from "@/components/ui/admit-one-ticket";
import {
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  Ticket,
  Calendar,
  MapPin,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";

interface EventPassModalProps {
  event: EventCardData | null;
  onClose: () => void;
  defaultAttendeeName?: string;
}

// Event-specific theme palettes: different color + shader shape per event category
interface EventShaderTheme {
  name: string;
  badge: string;
  texture: {
    colorBack: string;
    colorFront: string;
    shape: string;
    type: string;
    size: number;
    scale: number;
    rotation: number;
    speed: number;
  };
  layout: {
    inkColor: string;
    watermarkColor: string;
  };
}

const EVENT_THEMES: Record<string, EventShaderTheme> = {
  // 1. Hackathon -> Cyber Neon Emerald (matrix/code vibes)
  hackathon: {
    name: "Matrix Neon",
    badge: "Flagship Hackathon Pass",
    texture: {
      colorBack: "#03281c",
      colorFront: "#38ef7d",
      shape: "dots",
      type: "4x4",
      size: 1.2,
      scale: 1.1,
      rotation: 45,
      speed: 0.6,
    },
    layout: {
      inkColor: "#053d28",
      watermarkColor: "#5aff9d",
    },
  },
  // 2. Tech Event -> Electric Cyan / Blue (deep dive / tech workshop)
  "tech-event": {
    name: "Cyber Cobalt",
    badge: "Workshop & Speaker Pass",
    texture: {
      colorBack: "#081b3a",
      colorFront: "#00d2ff",
      shape: "wave",
      type: "random",
      size: 1.4,
      scale: 1.2,
      rotation: 15,
      speed: 0.5,
    },
    layout: {
      inkColor: "#072048",
      watermarkColor: "#70e2ff",
    },
  },
  // 3. Meet -> Solar Amber / Orange (warm IRL community gathering)
  meet: {
    name: "Solar Ember",
    badge: "Community IRL Pass",
    texture: {
      colorBack: "#381404",
      colorFront: "#ff9046",
      shape: "warp",
      type: "random",
      size: 0.9,
      scale: 1.2,
      rotation: 0,
      speed: 0.45,
    },
    layout: {
      inkColor: "#4a1900",
      watermarkColor: "#ffd4ad",
    },
  },
  // 4. Project Meet -> Royal Violet / Fuchsia (builder squad milestone sync)
  "project-meet": {
    name: "Synthwave Violet",
    badge: "Squad Review Pass",
    texture: {
      colorBack: "#200634",
      colorFront: "#d946ef",
      shape: "swirl",
      type: "8x8",
      size: 1.3,
      scale: 1.3,
      rotation: 20,
      speed: 0.55,
    },
    layout: {
      inkColor: "#32064d",
      watermarkColor: "#f5a3ff",
    },
  },
};

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
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!event) return null;

  // Selected event theme based on category
  const eventTheme = EVENT_THEMES[event.category] || EVENT_THEMES["meet"];

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.07);
        osc.stop(audioCtx.currentTime + idx * 0.07 + 0.36);
      });
    } catch {
      // AudioContext fallback
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim()) return;
    playChime();
    setGenerated(true);
  };

  const handleShare = async () => {
    const text = `🎟️ I just got my official Admit One VIP Pass for ${event.title} by @BUILDCULT!\nPass Holder: ${attendeeName}\nTicket ID: #${ticketId}\nSee you there! 🚀`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BUILDCULT Pass - ${event.title}`,
          text,
          url: window.location.href,
        });
      } catch {
        // Cancelled
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 1200;
      canvas.height = 700; // Classic horizontal admit one aspect ratio

      // Background
      ctx.fillStyle = eventTheme.texture.colorBack;
      ctx.fillRect(0, 0, 1200, 700);

      // Glow accent
      const radGrad = ctx.createRadialGradient(400, 350, 50, 400, 350, 600);
      radGrad.addColorStop(0, eventTheme.texture.colorFront);
      radGrad.addColorStop(1, eventTheme.texture.colorBack);
      ctx.fillStyle = radGrad;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(0, 0, 1200, 700);
      ctx.globalAlpha = 1.0;

      // Ticket Border
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 1140, 640);

      // Perforation line
      ctx.beginPath();
      ctx.setLineDash([12, 12]);
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.moveTo(900, 30);
      ctx.lineTo(900, 670);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ink Text
      ctx.fillStyle = eventTheme.layout.inkColor;

      // Header
      ctx.font = "bold 26px monospace";
      ctx.fillText("BUILDCULT PRESENTS", 70, 95);
      ctx.fillText(event.title.toUpperCase(), 70, 135);

      // Attendee Name
      ctx.font = "900 68px sans-serif";
      ctx.fillText(attendeeName.toUpperCase(), 70, 260);

      // Role & Badge
      ctx.font = "bold 28px sans-serif";
      ctx.fillText(`${role} · Verified Cultist`, 70, 320);

      // Meta: Venue & Date
      ctx.font = "bold 24px monospace";
      ctx.fillText(`📍 ${event.location || "Online Hub"}  ·  📅 ${event.date}`, 70, 560);
      ctx.fillText(`TICKET ID #${ticketId} · ADMIT ONE · BUILDCULT.ORG`, 70, 610);

      // Stub section (Right)
      ctx.save();
      ctx.translate(970, 580);
      ctx.rotate(-Math.PI / 2);
      ctx.font = "bold 52px monospace";
      ctx.fillText("ADMIT ONE", 0, 0);
      ctx.restore();

      // Watermark in stub
      ctx.fillStyle = eventTheme.layout.watermarkColor;
      ctx.font = "bold 130px sans-serif";
      ctx.fillText("2026", 930, 390);

      const link = document.createElement("a");
      link.download = `BUILDCULT-ADMIT-ONE-${attendeeName.replace(/\\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Ignore
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/85 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl p-5 sm:p-7 bg-card border border-border/80 shadow-2xl space-y-5 my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls: Category Badge, Audio Toggle & Close */}
        <div className="flex items-center justify-between pb-2 border-b border-border/30">
          <div className="flex items-center gap-2">
            <span
              className="flex h-2.5 w-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: eventTheme.texture.colorFront }}
            />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {eventTheme.badge} · {eventTheme.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title={soundEnabled ? "Mute SFX" : "Unmute SFX"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!generated ? (
          /* STEP 1: Customizer Form */
          <div className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-medium">
                <Ticket className="h-3.5 w-3.5" />
                <span>Admit One Pass</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mt-1">
                Generate Your Official Event Pass
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Live interactive shader pass designed exclusively for{" "}
                <span className="font-semibold text-foreground">{event.title}</span>.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Your Full Name / Builder Handle *
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="e.g. Kaarunya Sharma"
                  className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Specialization / Domain
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-xs text-foreground"
                >
                  <option value="Builder / Developer">Builder / Fullstack Dev</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="Product Designer">UI/UX & Product Designer</option>
                  <option value="Web3 & Protocol Dev">Web3 & Protocol Dev</option>
                  <option value="Indie Founder">Indie Hacker / Founder</option>
                  <option value="Student Enthusiast">Student Enthusiast</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40 text-xs font-mono text-muted-foreground space-y-1.5">
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
                <div className="flex items-center justify-between pt-1 border-t border-border/20 text-[11px]">
                  <span>Assigned Theme:</span>
                  <span
                    className="font-bold uppercase tracking-wider"
                    style={{ color: eventTheme.texture.colorFront }}
                  >
                    {eventTheme.name}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-xs font-semibold glass-badge hover:border-white/50 cursor-pointer shadow-lg gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Mint Admit One Ticket</span>
              </Button>
            </form>
          </div>
        ) : (
          /* STEP 2: Live WebGL Dithering AdmitOneTicket + Parallax Tilt + Export */
          <div className="space-y-5">
            <div className="text-center space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>VIP Ticket Minted</span>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                You're In, {attendeeName}!
              </h3>
              <p className="text-xs font-mono text-muted-foreground">
                Move mouse over the ticket for interactive 3D physics tilt & glare.
              </p>
            </div>

            {/* ADMIT ONE TICKET SHADER COMPONENT */}
            <div className="py-2 flex justify-center overflow-hidden">
              <div className="max-w-full overflow-x-auto p-1">
                <AdmitOneTicket
                  name={attendeeName}
                  presenter="BUILDCULT PRESENTS"
                  event={event.title}
                  venue={event.location || "Worldwide"}
                  dates={event.date}
                  stubText="ADMIT ONE"
                  watermark="2026"
                  width={620}
                  tilt={{
                    maxTilt: 12,
                    scale: 1.03,
                    glare: 0.22,
                  }}
                  texture={eventTheme.texture}
                  layout={{
                    ...eventTheme.layout,
                    padding: 57 / 741,
                    labelTop: 54 / 741,
                    labelSize: 18 / 741,
                    labelLead: 24 / 741,
                    labelTracking: 0.02,
                    nameTop: 165 / 741,
                    nameSize: 58 / 741,
                    nameLead: 58 / 741,
                    nameTracking: -0.015,
                    footerTop: 345 / 741,
                    footerSize: 18 / 741,
                    footerTracking: 0.02,
                    stubSize: 62 / 741,
                    stubTracking: 0,
                    stubOpacity: 0.88,
                    watermarkSize: 138 / 741,
                    watermarkOpacity: 0.65,
                  }}
                />
              </div>
            </div>

            {/* Actions: Download HD & Share */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 h-11 rounded-xl text-xs font-semibold glass-badge hover:border-white/50 cursor-pointer shadow gap-2"
              >
                <Download className="h-4 w-4" />
                <span>{downloading ? "Exporting High-Res..." : "Download Pass (HD)"}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleShare}
                className="h-11 rounded-xl text-xs px-5 cursor-pointer gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Copied Details!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span>Share on Socials</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventPassModal;
