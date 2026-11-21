import React from "react";
import HeroSection from "@/components/ui/hero-01-utils/hero";
import type { NavigationSection } from "@/components/ui/hero-01-utils/header";
import Header from "@/components/ui/hero-01-utils/header";
import BrandSlider, {
  BrandList,
} from "@/components/ui/hero-01-utils/brand-slider";
import type { AvatarList } from "@/components/ui/hero-01-utils/hero";
import CoreSection from "./core-section";
import PastEventsSection from "./past-events-section";
import ServicesSection from "./services-section";
import Footer from "./footer";

export interface AgencyHeroSectionProps {
  avatarList?: AvatarList[];
  navigationData?: NavigationSection[];
  brandList?: BrandList[];
  onCtaClick?: () => void;
  onCollaborateClick?: () => void;
  onJoinClick?: () => void;
}

const DEFAULT_AVATARS: AvatarList[] = [
  {
    image: "/aman.jpg",
  },
  {
    image: "/armaan-portrait.jpg",
  },
  {
    image: "/sameer-portrait.jpg",
  },
  {
    image: "/rishita-portrait.jpg",
  },
];

const DEFAULT_NAVIGATION: NavigationSection[] = [
  {
    title: "Home",
    href: "#home",
    isActive: true,
  },
  {
    title: "Core",
    href: "#core",
  },
  {
    title: "Past Events",
    href: "#past-events",
  },
  {
    title: "Services",
    href: "#services",
  },
  {
    title: "Join Us",
    href: "#join-us",
  },
];

const DEFAULT_BRANDS: BrandList[] = [
  {
    image: "/sponsors/p-logo.png",
    lightimg: "/sponsors/white-logo.png",
    name: "BUILDCULT Partner",
  },
  {
    image: "/sponsors/p-sponsor-1.png",
    lightimg: "/sponsors/p-sponsor-1.png",
    name: "Elysian Cafe",
  },
  {
    image: "/sponsors/p-sponsor-2.png",
    lightimg: "/sponsors/p-sponsor-2.png",
    name: "Sponsor 2",
  },
  {
    image: "/sponsors/p-sponsor-3.png",
    lightimg: "/sponsors/p-sponsor-3.png",
    name: "Unstop",
  },
  {
    image: "/sponsors/p-sponsor-4.png",
    lightimg: "/sponsors/p-sponsor-4.png",
    name: "Geek Room",
  },
  {
    image: "/sponsors/p-sponsor-5.png",
    lightimg: "/sponsors/p-sponsor-5.png",
    name: "Coding Ninjas",
  },
  {
    image: "/sponsors/p-sponsor-6.png",
    lightimg: "/sponsors/p-sponsor-6.png",
    name: "Metro Walk",
  },
  {
    image: "/sponsors/p-sponsor-7.png",
    lightimg: "/sponsors/p-sponsor-7.png",
    name: "She Kunj",
  },
];

export default function AgencyHeroSection({
  avatarList = DEFAULT_AVATARS,
  navigationData = DEFAULT_NAVIGATION,
  brandList = DEFAULT_BRANDS,
  onCtaClick,
  onCollaborateClick,
  onJoinClick,
}: AgencyHeroSectionProps) {
  const handleCta = onJoinClick || onCtaClick;

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground">
      <Header
        navigationData={navigationData}
        onCollaborateClick={onCollaborateClick || onJoinClick}
      />
      <main className="flex-1">
        <div id="home">
          <HeroSection avatarList={avatarList} onCtaClick={handleCta} />
          <BrandSlider brandList={brandList} />
        </div>
        <PastEventsSection id="past-events" />
        <ServicesSection id="services" />
      </main>
      <Footer />
    </div>
  );
}
