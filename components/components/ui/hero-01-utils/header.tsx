import React, { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  ArrowUpRight,
  Globe,
  Share2,
  Send,
  MessageSquareShare,
  Sun,
  Moon,
} from "lucide-react";
import Logo from "./logo";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export type NavigationSection = {
  title: string;
  href: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

export type HeaderProps = {
  navigationData: NavigationSection[];
  className?: string;
  onCollaborateClick?: () => void;
};

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light/dark theme"
      className="rounded-full border border-border p-2.5 hover:bg-muted transition text-foreground cursor-pointer"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

const CollaborateButton = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => (
  <Button
    onClick={onClick}
    className={cn(
      "relative text-sm font-medium rounded-full h-10 p-1 ps-5 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-5 w-fit overflow-hidden cursor-pointer glass-badge shadow-md hover:border-white/40",
      className,
    )}
  >
    <span className="relative z-10 transition-all duration-500 glass-heading font-semibold text-xs sm:text-sm">
      Let's Collaborate
    </span>
    <span className="absolute right-1 w-8 h-8 bg-white/20 dark:bg-white/10 text-foreground backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45 shadow-xs border border-white/30">
      <ArrowUpRight size={16} />
    </span>
  </Button>
);

export const Header = ({
  navigationData,
  className,
  onCollaborateClick,
}: HeaderProps) => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 30);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={cn(
        "inset-x-0 z-50 px-4 flex items-center justify-center sticky top-0 h-20 transition-all duration-300",
        className,
      )}
    >
      <div
        className={cn(
          "w-full max-w-6xl flex items-center justify-between gap-4 transition-all duration-500",
          sticky
            ? "p-2.5 px-4 bg-background/80 backdrop-blur-md border border-border/60 shadow-lg shadow-primary/5 rounded-full"
            : "bg-transparent border-transparent",
        )}
      >
        {/* Logo */}
        <div>
          <a href="#" className="flex items-center">
            <Logo />
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <NavigationMenu className="glass-panel p-1 rounded-full border border-white/20 dark:border-white/10">
            <NavigationMenuList className="flex gap-1">
              {navigationData.map((navItem) => (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuLink
                    href={navItem.href}
                    onClick={navItem.onClick}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 block cursor-pointer",
                      navItem.isActive
                        ? "glass-badge font-semibold shadow-sm"
                        : "glass-subtext hover:text-white hover:bg-white/10",
                    )}
                  >
                    {navItem.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop CTA, Theme Switcher & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <CollaborateButton
            className="hidden lg:flex"
            onClick={onCollaborateClick}
          />

          {/* Mobile Sheet Trigger */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="rounded-full border border-border p-2.5 hover:bg-muted transition text-foreground"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>

              <SheetContent
                showCloseButton={false}
                side="right"
                className="w-full sm:w-96 p-0 flex flex-col justify-between h-full bg-background border-l border-border"
              >
                <div>
                  <div className="flex items-center justify-between p-6 border-b border-border/40">
                    <Logo />
                    <SheetClose asChild>
                      <button
                        type="button"
                        aria-label="Close menu"
                        className="rounded-full border border-border p-2 hover:bg-muted transition text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </SheetClose>
                  </div>

                  <div className="flex flex-col gap-8 px-6 py-8">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <nav className="flex flex-col gap-4">
                      {navigationData.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          onClick={(e) => {
                            if (item.onClick) item.onClick(e);
                            setIsOpen(false);
                          }}
                          className={cn(
                            "group flex items-center text-xl font-semibold tracking-tight transition-all duration-200 py-1",
                            item.isActive
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground hover:translate-x-2",
                          )}
                        >
                          <span
                            className={cn(
                              "h-0.5 bg-primary transition-all duration-300 mr-2",
                              item.isActive ? "w-4" : "w-0 group-hover:w-4",
                            )}
                          />
                          {item.title}
                        </a>
                      ))}
                    </nav>

                    <div className="pt-4">
                      <CollaborateButton
                        className="w-full justify-center"
                        onClick={() => {
                          if (onCollaborateClick) onCollaborateClick();
                          setIsOpen(false);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-border/40 flex flex-col gap-4">
                  <div className="flex gap-3">
                    {[
                      { icon: Globe, label: "Website", href: "#" },
                      { icon: Share2, label: "Community", href: "#" },
                      { icon: Send, label: "Telegram", href: "#" },
                      { icon: MessageSquareShare, label: "Chat", href: "#" },
                    ].map((social) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          aria-label={social.label}
                          className="flex items-center justify-center rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition p-2.5"
                        >
                          <IconComponent className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} BUILDCULT. All rights reserved.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
