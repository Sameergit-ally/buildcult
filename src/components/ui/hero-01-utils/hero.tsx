import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";

export type AvatarList = {
  image: string;
};

export type HeroSectionProps = {
  avatarList: AvatarList[];
  title?: React.ReactNode;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
};

export function HeroSection({
  avatarList,
  title,
  subtitle = "Build Cult is a builder-driven community focused on turning ideas into real and tangible outcomes. We create an environment where creators don't just participate; they create, experiment, and ship.",
  ctaText = "Join the Cult",
  onCtaClick,
}: HeroSectionProps) {
  return (
    <section className="relative pt-8 md:pt-16 pb-12">
      <div className="w-full h-full relative">
        <div className="relative w-full pt-4 md:pt-16 pb-8 md:pb-12">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col max-w-5xl mx-auto gap-8">
              <div className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="lg:text-8xl md:text-7xl text-4xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight md:leading-tight lg:leading-none"
                >
                  {title || (
                    <>
                      <span className="glass-heading">
                        SHIPPING THE RESULT.
                      </span>{" "}
                      <span className="font-serif italic font-normal tracking-tight glass-accent">
                        BUILDING THE CULT
                      </span>
                    </>
                  )}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
                  className="text-base sm:text-lg font-normal max-w-2xl glass-subtext mx-auto leading-relaxed"
                >
                  {subtitle}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                className="flex items-center flex-col sm:flex-row justify-center gap-8 mt-2"
              >
                <Button
                  onClick={onCtaClick}
                  variant="ghost"
                  className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer glass-badge shadow-xl hover:shadow-2xl hover:border-white/40 active:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-transparent"
                >
                  <span className="relative z-10 transition-all duration-500 glass-heading font-semibold">
                    {ctaText}
                  </span>
                  <span className="absolute right-1 w-10 h-10 bg-white/20 dark:bg-white/10 text-foreground backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45 shadow-sm border border-white/30">
                    <ArrowUpRight size={16} />
                  </span>
                </Button>

                <div className="flex items-center sm:gap-4 gap-3">
                  <ul className="flex flex-row items-center -space-x-3">
                    {avatarList.map((avatar, index) => (
                      <li
                        key={index}
                        className="relative z-10 hover:z-20 transition-transform hover:scale-110"
                      >
                        <img
                          src={avatar.image}
                          alt={`Client avatar ${index + 1}`}
                          width={44}
                          height={44}
                          className="h-11 w-11 rounded-full border-2 border-white/20 backdrop-blur-md object-cover shadow-sm"
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm font-medium glass-subtext">
                      Backed by 10+ sponsors & tech communities
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
