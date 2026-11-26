import React, { useState, useRef, useEffect } from "react";
import { type EventCardData } from "@/components/ui/course-design-cards";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  Ticket,
  Calendar,
  MapPin,
  X,
  Palette,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";

interface EventPassModalProps {
  event: EventCardData | null;
  onClose: () => void;
  defaultAttendeeName?: string;
}

type TicketTheme = "cyber-purple" | "liquid-emerald" | "solar-gold" | "crimson-neon";

interface ThemeStyle {
  id: TicketTheme;
  name: string;
  pillColor: string;
  borderClass: string;
  bgGrad: string;
  badgeBg: string;
  primaryGlow: string;
  secondaryGlow: string;
  accentHex: string;
  subAccentHex: string;
}

const THEMES: Record<TicketTheme, ThemeStyle> = {
  "cyber-purple": {
    id: "cyber-purple",
    name: "Cyber Void",
    pillColor: "from-indigo-500 to-purple-500",
    borderClass: "border-indigo-500/50 hover:border-indigo-400",
    bgGrad: "from-slate-950 via-indigo-950/90 to-purple-950",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    primaryGlow: "rgba(99, 102, 241, 0.4)",
    secondaryGlow: "rgba(236, 72, 153, 0.3)",
    accentHex: "#6366f1",
    subAccentHex: "#ec4899",
  },
  "liquid-emerald": {
    id: "liquid-emerald",
    name: "Matrix Jade",
    pillColor: "from-emerald-400 to-teal-500",
    borderClass: "border-emerald-500/50 hover:border-emerald-400",
    bgGrad: "from-slate-950 via-teal-950/90 to-emerald-950",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    primaryGlow: "rgba(16, 185, 129, 0.4)",
    secondaryGlow: "rgba(20, 184, 166, 0.3)",
    accentHex: "#10b981",
    subAccentHex: "#14b8a6",
  },
  "solar-gold": {
    id: "solar-gold",
    name: "Solar Flare",
    pillColor: "from-amber-400 to-orange-500",
    borderClass: "border-amber-500/50 hover:border-amber-400",
    bgGrad: "from-stone-950 via-amber-950/80 to-orange-950",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    primaryGlow: "rgba(245, 158, 11, 0.45)",
    secondaryGlow: "rgba(249, 115, 22, 0.35)",
    accentHex: "#f59e0b",
    subAccentHex: "#f97316",
  },
  "crimson-neon": {
    id: "crimson-neon",
    name: "Blood Red",
    pillColor: "from-rose-500 to-red-600",
    borderClass: "border-rose-500/50 hover:border-rose-400",
    bgGrad: "from-neutral-950 via-rose-950/90 to-red-950",
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    primaryGlow: "rgba(244, 63, 94, 0.45)",
    secondaryGlow: "rgba(225, 29, 72, 0.35)",
    accentHex: "#f43f5e",
    subAccentHex: "#e11d48",
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
  const [role, setRole] = useState("Builder / Fullstack Dev");
  const [customHandle, setCustomHandle] = useState("");
  const [generated, setGenerated] = useState(false);
  const [activeTheme, setActiveTheme] = useState<TicketTheme>("cyber-purple");
  const [ticketId] = useState(() => `BC-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 3D Parallax Tilt state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Sound generator using Web Audio API (no external asset needed)
  const playLaserSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.26);
    } catch {
      // AudioContext not allowed or unsupported
    }
  };

  const playChimeSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.08);
        osc.stop(audioCtx.currentTime + i * 0.08 + 0.42);
      });
    } catch {
      // AudioContext fallback
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim()) return;
    playChimeSound();
    setGenerated(true);
  };

  // Mouse move over ticket for ultra-smooth 3D Hologram tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -14;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.65,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((p) => ({ ...p, opacity: 0 }));
  };

  // Flip card front/back
  const toggleFlip = () => {
    playLaserSound();
    setIsFlipped((f) => !f);
  };

  const handleShare = async () => {
    if (!event) return;
    playLaserSound();
    const handleTag = customHandle ? ` (${customHandle})` : "";
    const text = `🎟️ I just minted my VIP Builder Pass for ${event.title} by @BUILDCULT!\nHolder: ${attendeeName}${handleTag}\nTicket ID: #${ticketId}\nSee you inside the Cult! 🚀⚡`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BUILDCULT VIP Pass - ${event.title}`,
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
    if (!event) return;
    setDownloading(true);
    playLaserSound();
    const theme = THEMES[activeTheme];

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 1080;
      canvas.height = 1440; // High-res poster format

      // Base background
      const bg = ctx.createLinearGradient(0, 0, 1080, 1440);
      bg.addColorStop(0, "#030407");
      bg.addColorStop(0.5, "#090b14");
      bg.addColorStop(1, "#020305");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1080, 1440);

      // Cyber glow orbs
      const g1 = ctx.createRadialGradient(250, 300, 20, 250, 300, 520);
      g1.addColorStop(0, theme.primaryGlow);
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, 1080, 1440);

      const g2 = ctx.createRadialGradient(850, 1050, 20, 850, 1050, 500);
      g2.addColorStop(0, theme.secondaryGlow);
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, 1080, 1440);

      // Holographic grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 1080; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 1440);
        ctx.stroke();
      }
      for (let j = 0; j < 1440; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(1080, j);
        ctx.stroke();
      }

      // Ticket Card Container
      ctx.save();
      ctx.fillStyle = "rgba(15, 17, 28, 0.92)";
      ctx.strokeStyle = theme.accentHex;
      ctx.lineWidth = 4;

      const x = 90, y = 140, w = 900, h = 1160, r = 44;
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

      // Top notch cuts
      ctx.fillStyle = "#030407";
      ctx.beginPath();
      ctx.arc(90, y + 540, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(990, y + 540, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Header Brand
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 48px sans-serif";
      ctx.fillText("BUILDCULT", 160, 235);

      ctx.fillStyle = theme.accentHex;
      ctx.font = "bold 22px monospace";
      ctx.fillText("OFFICIAL VIP BUILDER PASS", 160, 275);

      // Ticket ID pill
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.fillRect(720, 205, 200, 52);
      ctx.strokeStyle = theme.accentHex;
      ctx.strokeRect(720, 205, 200, 52);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px monospace";
      ctx.fillText(`#${ticketId}`, 745, 240);

      // Dashed separator
      ctx.beginPath();
      ctx.setLineDash([14, 12]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.moveTo(140, 325);
      ctx.lineTo(940, 325);
      ctx.stroke();
      ctx.setLineDash([]);

      // Category Pill
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(160, 365, 180, 40);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px monospace";
      ctx.fillText((event.tag || "CULT GATHERING").toUpperCase(), 175, 392);

      // Event Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 52px sans-serif";
      const displayTitle = event.title.length > 27 ? event.title.slice(0, 25) + "..." : event.title;
      ctx.fillText(displayTitle, 160, 465);

      // Date & Location
      ctx.fillStyle = "#94a3b8";
      ctx.font = "28px sans-serif";
      ctx.fillText(`📅  ${event.date}`, 160, 520);
      if (event.location) {
        ctx.fillText(`📍  ${event.location}`, 160, 570);
      }

      // Attendee Section Box
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(160, 640, 760, 240);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.strokeRect(160, 640, 760, 240);

      ctx.fillStyle = theme.accentHex;
      ctx.font = "bold 22px monospace";
      ctx.fillText("VERIFIED ATTENDEE / BUILDER", 195, 690);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 56px sans-serif";
      ctx.fillText(attendeeName, 195, 760);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "26px sans-serif";
      const handleShow = customHandle ? ` · ${customHandle}` : "";
      ctx.fillText(`${role}${handleShow}`, 195, 820);

      // Barcode simulation
      ctx.fillStyle = "#ffffff";
      const startBx = 160, bY = 930, bH = 85;
      for (let bx = 0; bx < 760; bx += 8) {
        const barW = (bx % 16 === 0 || bx % 24 === 0) ? 5 : 2;
        ctx.fillRect(startBx + bx, bY, barW, bH);
      }

      ctx.fillStyle = "#64748b";
      ctx.font = "20px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`FAST TRACK GATE ENTRY · ${ticketId} · AUTHENTICATED`, 540, 1070);
      ctx.fillText("BUILDCULT PROTOCOL · SHAPING DIGITAL FUTURES", 540, 1190);
      ctx.textAlign = "left";

      ctx.restore();

      const link = document.createElement("a");
      link.download = `BUILDCULT-VIP-PASS-${attendeeName.replace(/\\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Ignore
    } finally {
      setDownloading(false);
    }
  };

  if (!event) return null;
  const currentTheme = THEMES[activeTheme];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/85 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl p-5 sm:p-7 bg-card border border-border/80 shadow-2xl space-y-5 my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls: Sound Toggle + Close */}
        <div className="flex items-center justify-between pb-1 border-b border-border/30">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cult Pass Generator v2.0
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
                <span>Personalized VIP Access</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mt-1">
                Customize Your Event Pass
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Mint your 3D interactive access card for{" "}
                <span className="font-semibold text-foreground">{event.title}</span>.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Your Full Name / Name *
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="e.g. Kaarunya Sharma"
                  className="w-full h-10 px-3.5 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-foreground">
                    Domain / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-xs text-foreground"
                  >
                    <option value="Builder / Fullstack Dev">Builder / Fullstack Dev</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                    <option value="Product Designer">UI/UX & Product Designer</option>
                    <option value="Web3 & Protocol Dev">Web3 & Protocol Dev</option>
                    <option value="Founder / Indie Hacker">Founder / Indie Hacker</option>
                    <option value="Student Hacker">Student Hacker</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-foreground">
                    Discord / GitHub Handle (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={25}
                    value={customHandle}
                    onChange={(e) => setCustomHandle(e.target.value)}
                    placeholder="@handle"
                    className="w-full h-10 px-3 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-xs text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Theme Selector Palette */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-mono font-semibold text-foreground flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-primary" />
                  <span>Choose Pass Hologram Theme</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(THEMES) as TicketTheme[]).map((thmKey) => {
                    const thm = THEMES[thmKey];
                    const isSelected = activeTheme === thmKey;
                    return (
                      <button
                        key={thmKey}
                        type="button"
                        onClick={() => {
                          playLaserSound();
                          setActiveTheme(thmKey);
                        }}
                        className={`py-2 px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? "border-primary bg-primary/15 shadow-sm scale-102"
                            : "border-border/60 bg-muted/30 hover:border-border"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-gradient-to-tr ${thm.pillColor} shadow`}
                        />
                        <span className="text-[10px] font-mono leading-tight font-medium text-foreground truncate w-full">
                          {thm.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-xs font-mono text-muted-foreground space-y-1">
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
                className="w-full h-11 rounded-xl text-xs font-semibold glass-badge hover:border-white/50 cursor-pointer shadow-lg gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Mint 3D Pass Now</span>
              </Button>
            </form>
          </div>
        ) : (
          /* STEP 2: Interactive 3D Holographic Card + Flip + Download */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Pass Minted</span>
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mt-0.5">
                  Welcome to the Cult, {attendeeName}!
                </h3>
              </div>

              {/* Theme Quick Switcher in Generated View */}
              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/40">
                {(Object.keys(THEMES) as TicketTheme[]).map((thmKey) => {
                  const thm = THEMES[thmKey];
                  const isSelected = activeTheme === thmKey;
                  return (
                    <button
                      key={thmKey}
                      onClick={() => {
                        playLaserSound();
                        setActiveTheme(thmKey);
                      }}
                      className={`h-6 w-6 rounded-lg transition-transform ${
                        isSelected ? "scale-115 ring-2 ring-primary ring-offset-1 ring-offset-background" : "opacity-60 hover:opacity-100"
                      }`}
                      style={{ background: thm.accentHex }}
                      title={thm.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* 3D Interactive Card Canvas with Hologram Glare */}
            <div className="perspective-1000 py-1 flex justify-center">
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={toggleFlip}
                className={`relative w-full max-w-[390px] rounded-3xl p-5 shadow-2xl cursor-pointer select-none transition-transform duration-150 ease-out border ${currentTheme.borderClass} bg-gradient-to-br ${currentTheme.bgGrad}`}
                style={{
                  transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg) scale3d(1.02, 1.02, 1.02)`,
                  transformStyle: "preserve-3d",
                  transition: isFlipped ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" : "transform 0.1s ease-out",
                }}
              >
                {/* Dynamic Holographic Glare Overlay */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                    opacity: glarePos.opacity,
                  }}
                />

                {/* Foil shine sheen lines */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.18)_50%,transparent_55%)] bg-[length:200%_200%] animate-[shine_4s_infinite]" />

                {/* Notches */}
                <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-card border border-border/80" />
                <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-card border border-border/80" />

                {!isFlipped ? (
                  /* FRONT FACE */
                  <div className="space-y-3">
                    <div className="flex items-start justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="font-display font-black tracking-wider text-xl text-white">
                          BUILDCULT
                        </span>
                        <p className="font-mono text-[9px] text-white/70 uppercase tracking-widest">
                          VIP Builder Pass
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${currentTheme.badgeBg}`}>
                          #{ticketId}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 py-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                        {event.tag || "Cult Gathering"}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold font-display text-white line-clamp-1">
                        {event.title}
                      </h4>
                      <p className="font-mono text-xs text-white/80 flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-white/90" />
                        {event.date}
                      </p>
                      {event.location && (
                        <p className="font-mono text-xs text-white/70 flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-white/80" />
                          {event.location}
                        </p>
                      )}
                    </div>

                    {/* Attendee Info Card */}
                    <div className="rounded-xl bg-black/45 border border-white/10 p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Pass Holder</p>
                        <p className="text-base font-bold text-white tracking-tight leading-tight">{attendeeName}</p>
                        <p className="text-[11px] text-white/80 font-mono">
                          {role} {customHandle && `· ${customHandle}`}
                        </p>
                      </div>

                      {/* Interactive Hologram Badge Stamp */}
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex flex-col items-center justify-center font-mono text-[10px] font-black text-white border border-white/20 shadow-inner">
                        <Flame className="h-4 w-4 text-amber-400 animate-bounce" />
                        <span>VIP</span>
                      </div>
                    </div>

                    {/* Barcode Strip */}
                    <div className="pt-2 flex flex-col items-center">
                      <div className="flex justify-between w-full h-7 opacity-85">
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
                      <p className="font-mono text-[8px] text-white/60 tracking-widest mt-1">
                        3D HOLOGRAPHIC PASS · CLICK TO FLIP ↻
                      </p>
                    </div>
                  </div>
                ) : (
                  /* BACK FACE (Flip Card) */
                  <div
                    className="space-y-3 py-4 text-center text-white"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                      <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
                        SECURITY SCAN VERIFIED
                      </span>
                      <div className="mx-auto h-24 w-24 rounded-xl bg-white p-2 flex items-center justify-center shadow-lg">
                        {/* High-contrast stylized QR Code grid */}
                        <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-0.5 bg-black p-1 rounded">
                          {[...Array(36)].map((_, qi) => (
                            <div
                              key={qi}
                              className={
                                qi === 0 || qi === 5 || qi === 30 || qi === 35 || qi % 2 === 0
                                  ? "bg-white"
                                  : "bg-black"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="font-mono text-[10px] text-white/70">
                        Scan at entry desk for fast-track badge collection.
                      </p>
                    </div>

                    <div className="text-[10px] font-mono text-white/60 space-y-0.5">
                      <p>Admission: 1 Person · Non-Transferable</p>
                      <p>Discord Access: Granted</p>
                      <p className="text-white/40">Click anywhere on card to flip back</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Interaction Hint */}
            <div className="flex items-center justify-center gap-3 text-xs font-mono text-muted-foreground">
              <button
                type="button"
                onClick={toggleFlip}
                className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5 text-primary" />
                <span>Flip Card (Front / QR Back)</span>
              </button>
              <span>·</span>
              <span className="text-[11px] text-muted-foreground/80">Move mouse to tilt hologram ✦</span>
            </div>

            {/* Actions: Download HD & Share */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 h-11 rounded-xl text-xs font-semibold glass-badge hover:border-white/50 cursor-pointer shadow gap-2"
              >
                <Download className="h-4 w-4" />
                <span>{downloading ? "Rendering HD Poster..." : "Download Pass (HD)"}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleShare}
                className="h-11 rounded-xl text-xs px-5 cursor-pointer gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Copied Link & Text!</span>
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
