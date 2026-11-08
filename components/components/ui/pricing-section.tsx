import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const TIERS = [
  {
    name: "Sprint",
    price: "$4,500",
    period: "/project",
    description: "Rapid delivery of high-impact landing pages or core features.",
    features: [
      "Full bespoke design & wireframing",
      "React + Tailwind + shadcn implementation",
      "Interactive motion & physics micro-UX",
      "Fully responsive across all screens",
      "Delivered in 2-3 weeks",
    ],
    highlighted: false,
    cta: "Start a Sprint",
  },
  {
    name: "Dedicated Studio",
    price: "$8,900",
    period: "/month",
    description: "Your full-stack design & engineering powerhouse on demand.",
    features: [
      "Unlimited design & development requests",
      "Direct Slack/Discord access to founders",
      "Continuous design system evolution",
      "Complete SEO, speed & Core Web Vitals audit",
      "Pause or cancel anytime",
    ],
    highlighted: true,
    cta: "Join the Studio",
  },
  {
    name: "Enterprise Cult",
    price: "Custom",
    period: "",
    description: "Architectural transformations for scale-ups and enterprises.",
    features: [
      "Custom multi-platform design systems",
      "Full engineering team augmentation",
      "Advanced WebGL / 3D web experiences",
      "SLA guarantees & dedicated support",
      "Tailored security & SOC2 compliance",
    ],
    highlighted: false,
    cta: "Contact Founders",
  },
];

export function PricingSection({ id = "pricing" }: { id?: string }) {
  return (
    <section id={id} className="w-full py-20 border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            TRANSPARENT PRICING
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Simple, Transparent Plans
          </h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            No hidden fees, no opaque hourly billing. Just pure velocity and quality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TIERS.map((tier, index) => (
            <div
              key={index}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                tier.highlighted
                  ? "border-2 border-primary bg-card shadow-2xl shadow-primary/10 lg:-translate-y-2"
                  : "border border-border/70 bg-card/60"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-md flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  {tier.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm font-medium text-muted-foreground">
                      {tier.period}
                    </span>
                  )}
                </div>

                <div className="my-8 h-px bg-border/60" />

                <ul className="space-y-3.5 text-sm">
                  {tier.features.map((feat, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1 text-primary shrink-0 mt-0.5">
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Button
                  variant={tier.highlighted ? "default" : "outline"}
                  className="w-full rounded-full h-11 text-sm font-medium cursor-pointer"
                >
                  {tier.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;

