import type { SVGAttributes } from "react";
import { Sparkles } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2.5 font-display font-extrabold tracking-tight text-xl ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black border border-white/20 p-1 shadow-md overflow-hidden group">
        <img
          src="/buildcult-logo.png"
          alt="BUILDCULT Logo"
          className="h-full w-full object-contain filter drop-shadow transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <span className="font-display font-black text-xl tracking-tight">
        <span className="glass-heading">BUILD</span>
        <span className="glass-accent font-bold">CULT</span>
      </span>
    </div>
  );
};

export default Logo;
