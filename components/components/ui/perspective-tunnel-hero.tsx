"use client";

import {
    motion,
    useTransform,
    useReducedMotion,
    useMotionValue,
    useSpring,
    MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Use your hackathon images from /pictures folder
const IMAGES = [
    { src: "/hackathon-1.jpg", title: "Hackathon I" },
    { src: "/hackathon-2.jpg", title: "Hackathon II" },
    { src: "/hackathon-3.jpg", title: "Hackathon III" },
    { src: "/hackathon-4.jpg", title: "Hackathon IV" },
    { src: "/hackathon-5.jpg", title: "Build V" },
    { src: "/hackathon-6.jpg", title: "Build VI" },
    { src: "/hackathon-7.jpg", title: "Build VII" },
    { src: "/hackathon-8.jpg", title: "Build VIII" },
    { src: "/hackathon-9.jpg", title: "Build IX" },
];

interface TunnelCardData {
    item: { src: string; title: string };
    angleCos: number;
    angleSin: number;
    radiusFactorX: number;
    radiusFactorY: number;
    rotationZ: number;
    index: number;
}

const TUNNEL_CARDS: TunnelCardData[] = IMAGES.map((item, i) => {
    const goldenAngle = i * 137.5 * (Math.PI / 180);
    const radiusFactorX = 0.28 + (i % 3) * 0.08;
    const radiusFactorY = 0.26 + (i % 2) * 0.09;

    return {
        item,
        angleCos: Math.cos(goldenAngle),
        angleSin: Math.sin(goldenAngle),
        radiusFactorX,
        radiusFactorY,
        rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
        index: i,
    };
});

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
    width: number;
    height: number;
    isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, SPRING_CONFIG);
    const y = useSpring(rawY, SPRING_CONFIG);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e: PointerEvent) => {
            rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
            rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [enabled, rawX, rawY]);

    return { x, y };
}

interface TunnelCardProps {
    card: TunnelCardData;
    progress: MotionValue<number>;
    pointer: { x: MotionValue<number>; y: MotionValue<number> };
    total: number;
    stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
    const staggerSpan = 0.55;
    const start = (card.index / total) * (1 - staggerSpan);
    const end = start + staggerSpan;

    const localProgress = useTransform(progress, [start, end], [0, 1]);

    const farZ = stage.isMobile ? -1200 : -1700;
    const nearZ = stage.isMobile ? 350 : 500;
    const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

    const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

    const cardWidth = stage.isMobile
        ? Math.max(130, Math.min(180, stage.width * 0.38))
        : Math.max(180, Math.min(270, stage.width * 0.18));

    const baseX = card.angleCos * (stage.width * card.radiusFactorX);
    const baseY = card.angleSin * (stage.height * card.radiusFactorY);
    const panStrength = stage.isMobile ? 20 : 45;

    const transform = useTransform(
        [z, pointer.x, pointer.y],
        ([currZ, px, py]: number[]) => {
            const offsetX = baseX - px * panStrength;
            const offsetY = baseY - py * panStrength;
            return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
        }
    );

    return (
        <motion.div
            style={{
                width: cardWidth,
                transform,
                opacity,
                zIndex: card.index + 1,
            }}
            className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform select-none cursor-pointer"
        >
            <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-muted shadow-2xl shadow-black/10 dark:shadow-black/60 ring-1 ring-border/30 transition-all duration-500 hover:ring-primary/50 hover:shadow-primary/20">
                <img
                    src={card.item.src}
                    alt={card.item.title}
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent flex items-end p-4 sm:p-5">
                    <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-white/90">
                        {card.item.title}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export interface PerspectiveTunnelHeroProps {
    onEnterSite?: () => void;
}

export default function PerspectiveTunnelHero({ onEnterSite }: PerspectiveTunnelHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const hasTriggeredRef = useRef(false);

    const [stage, setStage] = useState<StageDimensions>({
        width: 1440,
        height: 900,
        isMobile: false,
    });

    useEffect(() => {
        const updateDimensions = () => {
            setStage({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < 768,
            });
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // Raw motion value controlled directly by mouse wheel / touch trackpad
    const rawProgress = useMotionValue(0);
    const smoothProgress = useSpring(rawProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.0001,
    });

    // Detect when user completes scroll through the tunnel to open landing page
    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (latest) => {
            if (latest >= 0.94 && !hasTriggeredRef.current) {
                hasTriggeredRef.current = true;
                if (onEnterSite) {
                    setTimeout(() => {
                        onEnterSite();
                    }, 250);
                }
            }
        });
        return () => unsubscribe();
    }, [smoothProgress, onEnterSite]);

    // Handle wheel, touch, and keyboard scrolling
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let touchStartY = 0;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const current = rawProgress.get();
            const delta = e.deltaY * 0.001;
            const next = Math.min(1, Math.max(0, current + delta));
            rawProgress.set(next);

            if (current >= 0.92 && delta > 0 && onEnterSite && !hasTriggeredRef.current) {
                hasTriggeredRef.current = true;
                onEnterSite();
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            touchStartY = touchY;

            const current = rawProgress.get();
            const delta = deltaY * 0.0025;
            const next = Math.min(1, Math.max(0, current + delta));
            rawProgress.set(next);

            if (current >= 0.92 && delta > 0 && onEnterSite && !hasTriggeredRef.current) {
                hasTriggeredRef.current = true;
                onEnterSite();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
                e.preventDefault();
                const current = rawProgress.get();
                const next = Math.min(1, current + 0.15);
                rawProgress.set(next);
                if (next >= 0.92 && onEnterSite && !hasTriggeredRef.current) {
                    hasTriggeredRef.current = true;
                    onEnterSite();
                }
            } else if (e.key === "ArrowUp" || e.key === "PageUp") {
                e.preventDefault();
                const current = rawProgress.get();
                const next = Math.max(0, current - 0.15);
                rawProgress.set(next);
            } else if (e.key === "Enter" || e.key === "Escape") {
                if (onEnterSite && !hasTriggeredRef.current) {
                    hasTriggeredRef.current = true;
                    onEnterSite();
                }
            }
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            el.removeEventListener("wheel", handleWheel);
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [rawProgress, onEnterSite]);

    const pointer = useCameraParallax(!reduce);

    // The miniature landing page zooms from small (0.25) to full (1.0) as user scrolls
    const previewScale = useTransform(smoothProgress, [0, 1], [0.25, 1]);
    const previewOpacity = useTransform(smoothProgress, [0, 0.05, 0.85, 1], [0.5, 1, 1, 1]);
    const previewBorderRadius = useTransform(smoothProgress, [0, 0.8, 1], [24, 8, 0]);
    const cardsOpacity = useTransform(smoothProgress, [0, 0.1, 0.7, 0.9], [0, 1, 1, 0]);
    const promptOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
    const enterButtonOpacity = useTransform(smoothProgress, [0.4, 0.85], [0, 1]);
    const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
    // Overlay fades out as you scroll — revealing the landing page underneath
    const overlayOpacity = useTransform(smoothProgress, [0.6, 0.95], [0.85, 0]);

    return (
        <div
            ref={containerRef}
            className="relative h-[100svh] w-screen overflow-hidden bg-background text-foreground select-none flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{
                perspective: stage.isMobile ? "900px" : "1200px",
                transformStyle: "preserve-3d",
            }}
        >
            {/* Miniature Landing Page Preview — zooms in as you scroll */}
            <motion.div
                style={{
                    scale: previewScale,
                    opacity: previewOpacity,
                    borderRadius: previewBorderRadius,
                }}
                className="absolute inset-0 z-0 overflow-hidden ring-1 ring-border/20 shadow-2xl"
            >
                {/* Actual Landing Page content rendered small */}
                <div className="w-full h-full overflow-hidden pointer-events-none">
                    <div className="relative w-full min-h-[100vh] bg-background text-foreground">
                        {/* Hero-like recreation */}
                        <div className="relative overflow-hidden pt-8 md:pt-16 pb-12">
                            {/* Ambient background glow */}
                            <div className="relative w-full pt-4 md:pt-16 pb-8 md:pb-12 before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-sky-100 before:via-white before:to-amber-100 before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-slate-900 dark:before:via-background dark:before:to-stone-900 dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10">
                                {/* Header bar */}
                                <div className="container mx-auto px-4 mb-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 font-display font-extrabold tracking-tight text-lg">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black border border-white/20 p-1 shadow-sm overflow-hidden">
                                                <img
                                                    src="/buildcult-logo.png"
                                                    alt="BUILDCULT Logo"
                                                    className="h-full w-full object-contain"
                                                />
                                            </span>
                                            <span className="glass-heading">BUILD<span className="glass-accent">CULT</span></span>
                                        </div>
                                        <div className="hidden md:flex items-center gap-6 text-sm glass-subtext">
                                            <span className="glass-heading font-medium">Home</span>
                                            <span>Core</span>
                                            <span>Past Events</span>
                                            <span>Services</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hero Content */}
                                <div className="container mx-auto px-4 relative z-10">
                                    <div className="flex flex-col max-w-5xl mx-auto gap-8">
                                        <div className="relative flex flex-col text-center items-center gap-4 sm:gap-6">
                                            <h1 className="lg:text-8xl md:text-7xl text-4xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight md:leading-tight lg:leading-none">
                                                <span className="glass-heading">SHIPPING THE RESULT.</span>{" "}
                                                <span className="font-serif italic font-normal tracking-tight glass-accent">
                                                    BUILDING THE CULT
                                                </span>
                                            </h1>
                                            <p className="text-sm sm:text-lg glass-subtext max-w-2xl mx-auto leading-relaxed">
                                                Build Cult is a builder-driven community focused on turning ideas into real and tangible outcomes. We create an environment where creators don&apos;t just participate; they create, experiment, and ship.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Placeholder cards representing the rest of the page */}
                        <div className="container mx-auto px-4 grid grid-cols-3 gap-4 pb-12">
                            <div className="h-32 rounded-xl glass-panel" />
                            <div className="h-32 rounded-xl glass-panel" />
                            <div className="h-32 rounded-xl glass-panel" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Dark scrim overlay that fades as you scroll in */}
            <motion.div
                style={{ opacity: overlayOpacity }}
                className="absolute inset-0 z-[1] bg-background/80 backdrop-blur-sm pointer-events-none"
            />

            {/* Top Bar Navigation / Skip Shortcut */}
            <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2 font-display font-extrabold tracking-tight text-lg">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black border border-white/20 p-1 shadow-sm overflow-hidden">
                        <img
                            src="/buildcult-logo.png"
                            alt="BUILDCULT Logo"
                            className="h-full w-full object-contain"
                        />
                    </span>
                    <span className="glass-heading">BUILD<span className="glass-accent">CULT</span></span>
                </div>

                {onEnterSite && (
                    <Button
                        onClick={() => {
                            hasTriggeredRef.current = true;
                            onEnterSite();
                        }}
                        variant="outline"
                        className="rounded-full text-xs h-9 px-4 gap-1.5 glass-badge hover:border-white/40 cursor-pointer"
                    >
                        <span className="glass-heading font-medium">Skip to Landing Page</span>
                        <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>

            {/* Subtle dot grid — uses theme colors */}
            <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] opacity-40" />

            {/* Depth Ring Guides */}
            <div className="pointer-events-none absolute z-[2] h-[48vmin] w-[48vmin] rounded-full border border-primary/10" />
            <div className="pointer-events-none absolute z-[2] h-[76vmin] w-[76vmin] rounded-full border border-dashed border-border/40" />

            {/* Scroll Prompt at Start */}
            <motion.div
                style={{ opacity: promptOpacity }}
                className="pointer-events-none absolute bottom-14 z-20 flex flex-col items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] glass-subtext"
            >
                <span>Scroll to Enter</span>
                <div className="h-6 w-px bg-gradient-to-b from-primary to-transparent animate-pulse" />
            </motion.div>

            {/* Warp Meter / Progress Line */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-48 sm:w-64 flex flex-col items-center gap-1 opacity-75">
                <div className="h-1 w-full bg-muted/60 rounded-full overflow-hidden backdrop-blur-xs">
                    <motion.div
                        style={{ width: progressWidth }}
                        className="h-full bg-gradient-to-r from-primary via-primary/70 to-primary rounded-full"
                    />
                </div>
            </div>

            {/* Enter Site Button when approaching end */}
            {onEnterSite && (
                <motion.div
                    style={{ opacity: enterButtonOpacity }}
                    className="absolute bottom-10 z-30 pointer-events-auto"
                >
                    <Button
                        onClick={() => {
                            hasTriggeredRef.current = true;
                            onEnterSite();
                        }}
                        className="rounded-full h-12 px-8 text-sm font-semibold shadow-2xl glass-badge hover:border-white/50 gap-2 cursor-pointer animate-bounce"
                    >
                        <span className="glass-heading font-semibold">Enter BUILDCULT</span>
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                </motion.div>
            )}

            {/* 3D Z-Space Plane — floating hackathon image cards */}
            <motion.div
                style={{ opacity: cardsOpacity }}
                className="absolute inset-0 pointer-events-none z-[3]"
            >
                <div
                    className="absolute inset-0"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {TUNNEL_CARDS.map((card, i) => (
                        <TunnelCard
                            key={i}
                            card={card}
                            progress={smoothProgress}
                            pointer={pointer}
                            total={TUNNEL_CARDS.length}
                            stage={stage}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
