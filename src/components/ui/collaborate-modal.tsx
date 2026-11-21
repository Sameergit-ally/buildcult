import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, ArrowRight, Mail } from "lucide-react";

export interface CollaborateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CollaborateModal({ open, onOpenChange }: CollaborateModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "Full Web Application",
    budget: "$5k - $15k",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col justify-between h-full bg-background border-l border-border/80"
      >
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <SheetHeader className="text-left mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs font-semibold text-primary w-fit mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>COLLABORATE WITH BUILDCULT</span>
            </div>
            <SheetTitle className="text-2xl font-bold tracking-tight text-foreground">
              Let's Build Something Bold
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Tell us about your product or idea. Our founders respond within 24 hours.
            </SheetDescription>
          </SheetHeader>

          {submitted ? (
            <div className="py-12 flex flex-col items-center text-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Transmission Received!
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Thanks for reaching out! The BUILDCULT core team will review your project details and get back to you shortly.
              </p>
              <Button
                onClick={handleReset}
                className="rounded-full mt-4 text-xs h-9 px-6 cursor-pointer"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Your Name *
                </Label>
                <Input
                  id="name"
                  required
                  placeholder="Steve Jobs"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-xl h-10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="steve@apple.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="rounded-xl h-10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="company" className="text-xs font-semibold">
                  Company / Organization
                </Label>
                <Input
                  id="company"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="rounded-xl h-10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="projectType" className="text-xs font-semibold">
                  Project Scope
                </Label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) =>
                    setFormData({ ...formData, projectType: e.target.value })
                  }
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option>Full Web Application</option>
                  <option>Design System & Brand Identity</option>
                  <option>Interactive Motion & 3D Web</option>
                  <option>Monthly Studio Retainer</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="message" className="text-xs font-semibold">
                  Project Details
                </Label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Tell us what you're building, timeline, and goals..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full h-11 text-sm font-semibold gap-2 mt-2 cursor-pointer shadow-lg shadow-primary/10"
              >
                <span>Send Collaboration Request</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span>Direct: aman@buildcult.dev</span>
          </div>
          <span>BUILDCULT &copy; {new Date().getFullYear()}</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CollaborateModal;

