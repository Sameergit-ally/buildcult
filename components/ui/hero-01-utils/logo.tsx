import type { SVGAttributes } from "react";
import { Sparkles } from "lucide-react";

export const Logo = ({ className = "", ...props }: SVGAttributes<SVGElement> & { className?: string }) => {
  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight text-xl ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Sparkles className="h-5 w-5" />
      </div>
      <span className="text-foreground font-semibold text-lg tracking-tight">
        Agency<span className="text-primary font-normal">Space</span>
      </span>
    </div>
  );
};

export default Logo;
