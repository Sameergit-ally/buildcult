import React from "react";
import { cn } from "@/lib/utils";

export interface EventCardData {
  id: number | string;
  category: "hackathon" | "tech-event" | "meet" | "project-meet";
  colorClass: "green" | "orange" | "red" | "blue" | "purple" | "cyan";
  date: string;
  title: string;
  description: string;
  progressPercent: string;
  progressValue: string;
  progressLabel?: string;
  imgSrc1?: string;
  imgAlt1?: string;
  imgSrc2?: string;
  imgAlt2?: string;
  imgSrc3?: string;
  imgAlt3?: string;
  countdownText: string;
  location?: string;
  tag?: string;
  onActionClick?: () => void;
}

export interface EventCardProps {
  data: EventCardData;
  className?: string;
}

const COLOR_VARIANTS: Record<
  EventCardData["colorClass"],
  {
    badge: string;
    progress: string;
    borderHover: string;
    countdown: string;
    glow: string;
  }
> = {
  green: {
    badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    progress: "bg-emerald-500",
    borderHover: "hover:border-emerald-500/40",
    countdown: "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border-emerald-500/30",
    glow: "from-emerald-500/10 to-transparent",
  },
  orange: {
    badge: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    progress: "bg-amber-500",
    borderHover: "hover:border-amber-500/40",
    countdown: "bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border-amber-500/30",
    glow: "from-amber-500/10 to-transparent",
  },
  red: {
    badge: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    progress: "bg-rose-500",
    borderHover: "hover:border-rose-500/40",
    countdown: "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border-rose-500/30",
    glow: "from-rose-500/10 to-transparent",
  },
  blue: {
    badge: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    progress: "bg-sky-500",
    borderHover: "hover:border-sky-500/40",
    countdown: "bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 border-sky-500/30",
    glow: "from-sky-500/10 to-transparent",
  },
  purple: {
    badge: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    progress: "bg-purple-500",
    borderHover: "hover:border-purple-500/40",
    countdown: "bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border-purple-500/30",
    glow: "from-purple-500/10 to-transparent",
  },
  cyan: {
    badge: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    progress: "bg-cyan-500",
    borderHover: "hover:border-cyan-500/40",
    countdown: "bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border-cyan-500/30",
    glow: "from-cyan-500/10 to-transparent",
  },
};

export const EventCard: React.FC<EventCardProps> = ({ data, className }) => {
  const {
    colorClass,
    date,
    title,
    description,
    progressPercent,
    progressValue,
    progressLabel = "Capacity",
    imgSrc1,
    imgAlt1,
    imgSrc2,
    imgAlt2,
    imgSrc3,
    imgAlt3,
    countdownText,
    location,
    tag,
    onActionClick,
  } = data;

  const variant = COLOR_VARIANTS[colorClass] || COLOR_VARIANTS.blue;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl p-6 md:p-7 transition-all duration-500",
        "bg-card/75 dark:bg-card/45 backdrop-blur-xl",
        "border border-border/60 hover:shadow-2xl hover:-translate-y-1",
        variant.borderHover,
        className
      )}
    >
      {/* Decorative ambient color glow */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          variant.glow
        )}
      />

      {/* Header: Date + Tag + Options */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-mono text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border",
                variant.badge
              )}
            >
              {date}
            </span>
            {tag && (
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/40">
                {tag}
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label="Event options"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Body: Title + Location + Description */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-foreground capitalize group-hover:text-primary transition-colors">
            {title}
          </h3>
          {location && (
            <p className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              {location}
            </p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 pt-1">
            {description}
          </p>
        </div>

        {/* Progress Bar Section */}
        <div className="space-y-2 mb-7">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">{progressLabel}</span>
            <span className="font-semibold text-foreground">{progressValue}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted/70 dark:bg-muted/40">
            <div
              className={cn("h-full rounded-full transition-all duration-700 ease-out", variant.progress)}
              style={{ width: progressPercent }}
            />
          </div>
        </div>
      </div>

      {/* Footer: User Avatars + Add Button + Countdown CTA */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/40">
        <ul className="flex items-center -space-x-2.5">
          {imgSrc1 && (
            <li className="relative z-10 transition-transform hover:scale-110 hover:z-30">
              <img
                src={imgSrc1}
                alt={imgAlt1 || "Participant"}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-background object-cover shadow-sm"
              />
            </li>
          )}
          {imgSrc2 && (
            <li className="relative z-20 transition-transform hover:scale-110 hover:z-30">
              <img
                src={imgSrc2}
                alt={imgAlt2 || "Participant"}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-background object-cover shadow-sm"
              />
            </li>
          )}
          {imgSrc3 && (
            <li className="relative z-20 transition-transform hover:scale-110 hover:z-30">
              <img
                src={imgSrc3}
                alt={imgAlt3 || "Participant"}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-background object-cover shadow-sm"
              />
            </li>
          )}
          <li className="relative z-30">
            <button
              type="button"
              onClick={onActionClick}
              aria-label="Join or RSVP"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-muted hover:bg-primary/20 hover:text-primary text-muted-foreground border-2 border-background transition-all shadow-sm cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>

        <button
          type="button"
          onClick={onActionClick}
          className={cn(
            "rounded-full px-4 py-2 text-xs font-mono font-semibold border transition-all duration-300 shadow-sm cursor-pointer flex items-center gap-1.5",
            variant.countdown
          )}
        >
          <span>{countdownText}</span>
        </button>
      </div>
    </div>
  );
};

export default EventCard;

