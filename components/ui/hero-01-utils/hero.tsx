import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";

export type AvatarList = {
  image: string;
};

export type HeroSectionProps = {
  avatarList: AvatarList[];
};

export function HeroSection({ avatarList }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-8 md:pt-16 pb-12">
      <div className="w-full h-full relative">
        <div className="relative w-full pt-4 md:pt-16 pb-8 md:pb-12 before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-sky-100 before:via-white before:to-amber-100 before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-slate-900 dark:before:via-background dark:before:to-stone-900 dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col max-w-5xl mx-auto gap-8">
              <div className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="lg:text-8xl md:text-7xl text-4xl sm:text-5xl font-medium tracking-tight leading-tight md:leading-tight lg:leading-none text-foreground"
                >
                  Building bold brands with{" "}
                  <span className="font-serif italic font-normal tracking-tight text-primary">
                    thoughtful design
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
                  className="text-base sm:text-lg font-normal max-w-2xl text-muted-foreground mx-auto"
                >
                  We help high-growth startups tackle the world's biggest
                  challenges with tailored digital experiences, guiding you from
                  strategy to market leadership.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                className="flex items-center flex-col sm:flex-row justify-center gap-8 mt-2"
              >
                <Button className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer shadow-lg shadow-primary/10">
                  <span className="relative z-10 transition-all duration-500">
                    Get Started
                  </span>
                  <span className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45 shadow-sm">
                    <ArrowUpRight size={16} />
                  </span>
                </Button>

                <div className="flex items-center sm:gap-4 gap-3">
                  <ul className="flex flex-row items-center -space-x-3">
                    {avatarList.map((avatar, index) => (
                      <li key={index} className="relative z-10 hover:z-20 transition-transform hover:scale-110">
                        <img
                          src={avatar.image}
                          alt={`Client avatar ${index + 1}`}
                          width={44}
                          height={44}
                          className="h-11 w-11 rounded-full border-2 border-background object-cover shadow-sm"
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
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Trusted by 1,000+ clients
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
