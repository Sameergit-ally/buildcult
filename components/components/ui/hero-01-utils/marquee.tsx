import React, { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - var(--gap, 1rem))); }
        }
        @keyframes marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(calc(-100% - var(--gap, 1rem))); }
        }
        .animate-marquee-track {
          animation: marquee var(--duration, 20s) linear infinite;
        }
        .animate-marquee-vertical-track {
          animation: marquee-vertical var(--duration, 20s) linear infinite;
        }
        .animate-reverse-track {
          animation-direction: reverse !important;
        }
        .pause-on-hover-track:hover .animate-marquee-track,
        .pause-on-hover-track:hover .animate-marquee-vertical-track {
          animation-play-state: paused !important;
        }
      `}</style>
      <div
        {...props}
        style={{ "--gap": "1.5rem" } as React.CSSProperties}
        className={cn(
          "group flex overflow-hidden p-2 [--gap:1.5rem] [--duration:25s]",
          {
            "flex-row": !vertical,
            "flex-col": vertical,
            "pause-on-hover-track": pauseOnHover,
          },
          className,
        )}
      >
        {Array(repeat)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={cn("flex shrink-0 justify-around gap-6", {
                "animate-marquee-track flex-row": !vertical,
                "animate-marquee-vertical-track flex-col": vertical,
                "animate-reverse-track": reverse,
              })}
            >
              {children}
            </div>
          ))}
      </div>
    </>
  );
}

export default Marquee;

