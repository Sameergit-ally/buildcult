import React, { useState } from "react";
import { type EventCardData } from "@/components/ui/course-design-cards";
import { Button } from "@/components/ui/button";
import { AdmitOneTicket } from "@/components/ui/admit-one-ticket";
import {
  Download,
  Share2,
  CheckCircle2,
  Lock,
  Calendar,
  MapPin,
  X,
  AlertCircle,
  Users,
  ShieldCheck,
  FileText,
} from "lucide-react";

interface EventPassModalProps {
  event: EventCardData | null;
  onClose: () => void;
  defaultAttendeeName?: string;
}

// Secret admin passcode to gate access to the pass generator
const ADMIN_PASSCODE = "BUILDCULT2026";

// Light aesthetic pastel palette (high-contrast deep ink)
const TICKET_STYLE = {
  texture: {
    colorBack: "#ffedd5", // Soft warm cream
    colorFront: "#fed7aa", // Light pastel peach
    shape: "warp",
    type: "random",
    size: 0.75,
    scale: 1.15,
    rotation: 0,
    speed: 0.35,
  },
  layout: {
    inkColor: "#5a3520", // Deep roasted espresso ink
    watermarkColor: "#ea580c",
  },
};

export function EventPassModal({
  event,
  onClose,
  defaultAttendeeName = "",
}: EventPassModalProps) {
  // Admin Authorization State
  const [passcode, setPasscode] = useState("");
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(() => {
    try {
      return localStorage.getItem("bc_admin_auth") === "true";
    } catch {
      return false;
    }
  });
  const [authError, setAuthError] = useState("");

  // Registration Form State
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [holderName, setHolderName] = useState(
    defaultAttendeeName || (() => {
      try {
        return localStorage.getItem("pitti:name") || "";
      } catch {
        return "";
      }
    })
  );

  const [formError, setFormError] = useState("");
  const [generated, setGenerated] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!event) return null;

  // Admin access validation
  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === ADMIN_PASSCODE) {
      setIsAdminAuthorized(true);
      try {
        localStorage.setItem("bc_admin_auth", "true");
      } catch {
        /* storage disabled */
      }
      setAuthError("");
    } else {
      setAuthError("Invalid access key. Only designated administrators can issue passes.");
    }
  };

  // Check email uniqueness and register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setFormError("Please provide a valid email address.");
      return;
    }
    if (!teamName.trim() || !leaderName.trim() || !holderName.trim()) {
      setFormError("All fields (Team Name, Leader Name, Holder Name) are required.");
      return;
    }

    // Check localStorage for 1 ID per email enforcement
    try {
      const issuedKey = `bc_pass_${cleanEmail}`;
      const existing = localStorage.getItem(issuedKey);
      if (existing) {
        setFormError("This email has already been registered for an ID card. Only 1 pass per email is permitted.");
        return;
      }

      const newId = `BC-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(newId);

      const passData = {
        id: newId,
        email: cleanEmail,
        teamName: teamName.trim(),
        leaderName: leaderName.trim(),
        holderName: holderName.trim(),
        eventTitle: event.title,
        issuedAt: new Date().toISOString(),
      };
      localStorage.setItem(issuedKey, JSON.stringify(passData));
    } catch {
      setTicketId(`BC-${Math.floor(100000 + Math.random() * 900000)}`);
    }

    setGenerated(true);
  };

  // Google Drive format download (Organized folder naming + High-res pass data)
  const handleDownload = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 1200;
      canvas.height = 700;

      // Clean Light background
      ctx.fillStyle = TICKET_STYLE.texture.colorBack;
      ctx.fillRect(0, 0, 1200, 700);

      // Radial peach gradient
      const rad = ctx.createRadialGradient(400, 350, 50, 400, 350, 600);
      rad.addColorStop(0, TICKET_STYLE.texture.colorFront);
      rad.addColorStop(1, TICKET_STYLE.texture.colorBack);
      ctx.fillStyle = rad;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(0, 0, 1200, 700);
      ctx.globalAlpha = 1.0;

      // Border
      ctx.strokeStyle = "rgba(90, 53, 32, 0.4)";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 1140, 640);

      // Perforation line
      ctx.beginPath();
      ctx.setLineDash([12, 12]);
      ctx.strokeStyle = "rgba(90, 53, 32, 0.5)";
      ctx.moveTo(900, 30);
      ctx.lineTo(900, 670);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ink typography (no emojis)
      ctx.fillStyle = TICKET_STYLE.layout.inkColor;

      ctx.font = "bold 24px monospace";
      ctx.fillText("BUILDCULT PRESENTS", 70, 90);
      ctx.fillText(event.title.toUpperCase(), 70, 130);

      // Holder Name
      ctx.font = "900 64px sans-serif";
      ctx.fillText(holderName.toUpperCase(), 70, 240);

      // Team & Leader info
      ctx.font = "bold 26px monospace";
      ctx.fillText(`TEAM: ${teamName.toUpperCase()}  |  LEADER: ${leaderName.toUpperCase()}`, 70, 310);

      ctx.font = "20px monospace";
      ctx.fillText(`EMAIL: ${email.toLowerCase()}`, 70, 360);

      // Meta: Venue & Date
      ctx.font = "bold 22px monospace";
      ctx.fillText(`VENUE: ${event.location || "WORLDWIDE"}  ·  DATE: ${event.date.toUpperCase()}`, 70, 560);
      ctx.fillText(`TICKET ID #${ticketId} · ADMIT ONE · BUILDCULT.ORG`, 70, 605);

      // Stub section (Right)
      ctx.save();
      ctx.translate(970, 580);
      ctx.rotate(-Math.PI / 2);
      ctx.font = "bold 48px monospace";
      ctx.fillText("ADMIT ONE", 0, 0);
      ctx.restore();

      // Watermark in stub
      ctx.fillStyle = TICKET_STYLE.layout.watermarkColor;
      ctx.font = "bold 130px sans-serif";
      ctx.fillText("2026", 930, 390);

      // Download file in structured Drive-ready naming convention:
      // BUILDCULT_DRIVE_PASS_[TEAM]_[HOLDER]_[ID].png
      const safeTeam = teamName.replace(/[^a-zA-Z0-9]/g, "_");
      const safeHolder = holderName.replace(/[^a-zA-Z0-9]/g, "_");
      const link = document.createElement("a");
      link.download = `BUILDCULT_DRIVE_PASS_${safeTeam}_${safeHolder}_${ticketId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Ignore
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const text = `Official Admit One Pass for ${event.title} by BUILDCULT.\nPass Holder: ${holderName}\nTeam: ${teamName}\nLeader: ${leaderName}\nTicket ID: #${ticketId}\nVerified at buildcult.org`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BUILDCULT Pass - ${event.title}`,
          text,
          url: window.location.href,
        });
      } catch {
        /* canceled */
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/30">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-orange-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Official Jan Hackathon ID Pass Portal
            </span>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* SCREEN 1: ADMIN ACCESS PASSCODE GATE */}
        {!isAdminAuthorized ? (
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-mono font-medium">
                <Lock className="h-3.5 w-3.5" />
                <span>Restricted Access Gate</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                Administrator Authentication Required
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ID pass registration and issuance is currently restricted to authorized administrators for Jan Hackathon. Please enter your access key to proceed.
              </p>
            </div>

            <form onSubmit={handleAdminVerify} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter administrator passkey"
                  className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground font-mono"
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20 font-mono">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-xs font-semibold glass-badge hover:border-white/50 cursor-pointer shadow gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Verify Access</span>
              </Button>
            </form>
          </div>
        ) : !generated ? (
          /* SCREEN 2: REGISTRATION FORM (1 ID PER EMAIL, TEAM + LEADER + HOLDER) */
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Verified · Registration Open</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                Jan Hackathon Official ID Card
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enforcing strictly one ID card per email address. Details will be formatted for Google Drive records.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Email Address * (Strictly 1 Pass Per Email)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="participant@example.com"
                  className="w-full h-10 px-3.5 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-xs text-foreground placeholder:text-muted-foreground font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-foreground">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={32}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. CultHackers"
                    className="w-full h-10 px-3.5 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-xs text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-foreground">
                    Team Leader Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={32}
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="e.g. Alex Sharma"
                    className="w-full h-10 px-3.5 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-xs text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-foreground">
                  ID Card Holder Name *
                </label>
                <input
                  type="text"
                  required
                  maxLength={32}
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder="e.g. Kaarunya"
                  className="w-full h-10 px-3.5 rounded-xl bg-muted/50 border border-border/80 focus:border-primary focus:outline-none text-xs text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20 font-mono">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

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
                className="w-full h-11 rounded-xl text-xs font-semibold glass-badge hover:border-white/50 cursor-pointer shadow gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>Issue Jan Hackathon ID Card</span>
              </Button>
            </form>
          </div>
        ) : (
          /* SCREEN 3: ISSUED ADMIT ONE TICKET SHADER PASS */
          <div className="space-y-4">
            <div className="text-center space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Official Pass Registered</span>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                {holderName} (Team {teamName})
              </h3>
              <p className="text-xs font-mono text-muted-foreground">
                Leader: {leaderName} · Registered to {email}
              </p>
            </div>

            {/* LIVE SHADER TICKET */}
            <div className="py-2 flex justify-center items-center w-full overflow-hidden">
              <div className="w-full flex justify-center items-center">
                <AdmitOneTicket
                  name={holderName}
                  teamName={teamName}
                  leaderName={leaderName}
                  presenter="BUILDCULT PRESENTS"
                  event="JAN HACKATHON 2026"
                  venue={event.location || "WORLDWIDE"}
                  dates={event.date}
                  stubText="ADMIT ONE"
                  watermark="2026"
                  width={Math.min(580, typeof window !== "undefined" ? window.innerWidth - 64 : 580)}
                  tilt={{
                    maxTilt: 10,
                    scale: 1.02,
                    glare: 0.15,
                  }}
                  texture={TICKET_STYLE.texture}
                  layout={{
                    ...TICKET_STYLE.layout,
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
                    stubOpacity: 0.9,
                    watermarkSize: 138 / 741,
                    watermarkOpacity: 0.55,
                  }}
                />
              </div>
            </div>

            {/* Actions: Download Drive Format & Share */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 h-11 rounded-xl text-xs font-semibold glass-badge hover:border-white/50 cursor-pointer shadow gap-2"
              >
                <Download className="h-4 w-4" />
                <span>{downloading ? "Preparing Drive Export..." : "Download Drive Format ID"}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleShare}
                className="h-11 rounded-xl text-xs px-5 cursor-pointer gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Copied Details</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span>Share Pass Info</span>
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
