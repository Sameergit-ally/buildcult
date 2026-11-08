import React from "react";
import { Code2, Palette, Cpu, Rocket, ArrowUpRight } from "lucide-react";

const SERVICES = [
  {
    icon: Rocket,
    title: "Hackathons & Build Sprints",
    description:
      "Rapid 24h–48h sprints taking builders from blank canvas to shipped code with mentorship, peer review, and demo day spotlights.",
    tags: ["Build Sprints", "Hackathons", "Ship Fast"],
  },
  {
    icon: Code2,
    title: "Collaborative Squad Projects",
    description:
      "Form cross-disciplinary teams uniting developers, designers, and operators to execute real-world ideas, MVPs, and open-source software.",
    tags: ["Team Matchmaking", "Open Source", "Real MVPs"],
  },
  {
    icon: Cpu,
    title: "Next-Gen Web & Interactive Craft",
    description:
      "Fluid micro-interactions, hardware-accelerated animations, and engaging physics engines that captivate visitors and elevate web experiences.",
    tags: ["WebGL & Three.js", "Physics Engines", "Micro-UX"],
  },
  {
    icon: Palette,
    title: "Builder Ecosystem & Campus Chapters",
    description:
      "An evolving network across campuses and cities designed to enable real work, shared knowledge, and push the culture of building forward.",
    tags: ["Campus Nodes", "IRL Meetups", "Lifelong Network"],
  },
];

export function ServicesSection({ id = "services" }: { id?: string }) {
  return (
    <section id={id} className="w-full py-20 bg-background/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest px-3.5 py-1 rounded-full glass-badge mb-3">
            WHAT WE DO
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight glass-heading">
            A System Built to Create
          </h2>
          <p className="mt-3 glass-subtext text-base sm:text-lg">
            Build Cult brings together developers, designers, operators and creators who believe in learning by doing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl glass-panel p-8 transition-all duration-300 hover:border-white/35 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl glass-badge text-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight glass-heading mb-2">
                  {service.title}
                </h3>
                <p className="text-sm glass-subtext leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full glass-badge px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;

