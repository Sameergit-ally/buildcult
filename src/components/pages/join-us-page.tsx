import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/hero-01-utils/header";
import { supabase } from "@/lib/supabase";
import {
  DEPARTMENTS,
  DEPARTMENT_LIST,
  DEPARTMENT_CONFIG,
  YEAR_OR_PROFESSION_OPTIONS,
  HEARD_FROM_OPTIONS,
  type DepartmentKey,
  type FieldConfig,
  type PersonalDetails,
  type FinalAnswers,
  type ApplicationInsertRow,
} from "./join-us-config";

export interface JoinUsPageProps {
  onBackToHome: () => void;
}

// Sanitizes WhatsApp phone numbers: removes spaces, hyphens, parentheses, and leading +91 or 0
function sanitizeWhatsApp(val: string): string {
  let cleaned = val.replace(/[\s\-()+]/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

// Validates email address format
function isValidEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

// Automatically prepends https:// to URLs if protocol is missing
function formatUrl(val: string): string {
  const trimmed = val.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

// Validates URL format
function isValidUrl(val: string): boolean {
  const trimmed = val.trim();
  if (!trimmed) return false;
  try {
    const formatted = formatUrl(trimmed);
    const parsed = new URL(formatted);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Pre-computed static values for liquid background mercury blobs
const STATIC_BLOBS_DATA = [
  { size: 240, left: 15, top: 20, animationDelay: -4, animationDuration: 18 },
  { size: 310, left: 70, top: 12, animationDelay: -11, animationDuration: 22 },
  { size: 190, left: 45, top: 65, animationDelay: -7, animationDuration: 16 },
  { size: 280, left: 25, top: 80, animationDelay: -15, animationDuration: 24 },
  { size: 220, left: 82, top: 75, animationDelay: -2, animationDuration: 19 },
  { size: 340, left: 60, top: 40, animationDelay: -18, animationDuration: 26 },
];

const CURRENT_YEAR = new Date().getFullYear();

export function JoinUsPage({ onBackToHome }: JoinUsPageProps) {
  // Screen 1: null (department chooser), Screen 2: department selected, Screen 3: submitted = true
  const [selectedDept, setSelectedDept] = useState<DepartmentKey | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);

  // Honeypot field (hidden from screen readers and real users)
  const [honeypot, setHoneypot] = useState("");

  // Step A: Personal details (persisted when switching departments)
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    full_name: "",
    email: "",
    whatsapp: "",
    college: "",
    year_or_profession: "",
    city: "",
    linkedin_url: "",
  });

  // Step B: Department-specific answers
  const [departmentAnswers, setDepartmentAnswers] = useState<Record<string, unknown>>({});
  // For multiselect custom "Other" inputs: { [fieldName]: string }
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});

  // Step C: Final questions
  const [finalAnswers, setFinalAnswers] = useState<FinalAnswers>({
    why_join: "",
    skill_to_learn: "",
    heard_from: "",
    can_commit: "",
    extra_notes: "",
  });

  // Validation touch tracker for inline error display
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Dark mode watcher for liquid mercury background
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      blobRefs.current.forEach((blob, index) => {
        if (blob) {
          const speed = (index + 1) * 18;
          blob.style.marginLeft = `${(x - 0.5) * speed}px`;
          blob.style.marginTop = `${(y - 0.5) * speed}px`;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Mark field as touched
  const markTouched = (name: string) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  // Switch / Change Department: Clears only department-specific answers
  const handleChangeDepartment = () => {
    setSelectedDept(null);
    setDepartmentAnswers({});
    setOtherInputs({});
    setCurrentStep(1);
    setSubmitError(null);
  };

  // Reset everything to start fresh
  const handleResetAll = () => {
    setSelectedDept(null);
    setCurrentStep(1);
    setSubmitted(false);
    setSubmitError(null);
    setDepartmentAnswers({});
    setOtherInputs({});
    setPersonalDetails({
      full_name: "",
      email: "",
      whatsapp: "",
      college: "",
      year_or_profession: "",
      city: "",
      linkedin_url: "",
    });
    setFinalAnswers({
      why_join: "",
      skill_to_learn: "",
      heard_from: "",
      can_commit: "",
      extra_notes: "",
    });
    setTouchedFields({});
  };

  // -------------------------------------------------------------
  // VALIDATION LOGIC
  // -------------------------------------------------------------
  const stepAErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    const nameTrimmed = personalDetails.full_name.trim();
    if (!nameTrimmed) {
      errors.full_name = "Full name is required";
    } else if (nameTrimmed.length < 2 || nameTrimmed.length > 100) {
      errors.full_name = "Name must be between 2 and 100 characters";
    }

    if (!personalDetails.email.trim()) {
      errors.email = "Email address is required";
    } else if (!isValidEmail(personalDetails.email)) {
      errors.email = "Please enter a valid email address (e.g. name@domain.com)";
    }

    const cleanWhatsapp = sanitizeWhatsApp(personalDetails.whatsapp);
    if (!personalDetails.whatsapp.trim()) {
      errors.whatsapp = "WhatsApp number is required";
    } else if (cleanWhatsapp.length !== 10 || !/^\d{10}$/.test(cleanWhatsapp)) {
      errors.whatsapp = "Must be a valid 10-digit number (e.g. 9876543210)";
    }

    if (!personalDetails.college.trim()) {
      errors.college = "College / University / Organization is required";
    }

    if (!personalDetails.year_or_profession) {
      errors.year_or_profession = "Please select your year or profession";
    }

    if (!personalDetails.city.trim()) {
      errors.city = "City is required";
    }

    if (personalDetails.linkedin_url.trim() && !isValidUrl(personalDetails.linkedin_url)) {
      errors.linkedin_url = "Please enter a valid URL (e.g. linkedin.com/in/username)";
    }

    return errors;
  }, [personalDetails]);

  const stepBErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    if (!selectedDept) return errors;

    const fields = DEPARTMENT_CONFIG[selectedDept] || [];
    for (const field of fields) {
      const val = departmentAnswers[field.name];

      if (field.required) {
        if (field.type === "multiselect") {
          const arr = Array.isArray(val) ? val : [];
          if (arr.length === 0) {
            errors[field.name] = `Please select at least one ${field.label.toLowerCase()}`;
          }
        } else if (field.type === "textarea") {
          const str = typeof val === "string" ? val.trim() : "";
          const min = field.minLength || 20;
          if (!str) {
            errors[field.name] = `${field.label} is required`;
          } else if (str.length < min) {
            errors[field.name] = `Minimum ${min} characters required (current: ${str.length})`;
          }
        } else if (field.type === "url") {
          const str = typeof val === "string" ? val.trim() : "";
          if (!str) {
            errors[field.name] = `${field.label} is required`;
          } else if (!isValidUrl(str)) {
            errors[field.name] = "Please enter a valid URL";
          }
        } else if (field.type === "select" || field.type === "radio") {
          const str = typeof val === "string" ? val.trim() : "";
          if (!str) {
            errors[field.name] = `Please select an option for ${field.label}`;
          }
        } else {
          // Normal text
          const str = typeof val === "string" ? val.trim() : "";
          if (!str) {
            errors[field.name] = `${field.label} is required`;
          }
        }
      } else {
        // Optional url validation if filled
        if (field.type === "url" && typeof val === "string" && val.trim()) {
          if (!isValidUrl(val)) {
            errors[field.name] = "Please enter a valid URL";
          }
        }
      }
    }
    return errors;
  }, [selectedDept, departmentAnswers]);

  const stepCErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    const whyTrimmed = finalAnswers.why_join.trim();

    if (!whyTrimmed) {
      errors.why_join = "Please tell us why you want to join BUILDCULT";
    } else if (whyTrimmed.length < 20) {
      errors.why_join = `Minimum 20 characters required (currently ${whyTrimmed.length})`;
    } else if (whyTrimmed.length > 2000) {
      errors.why_join = `Maximum 2000 characters allowed (currently ${whyTrimmed.length})`;
    }

    if (!finalAnswers.heard_from) {
      errors.heard_from = "Please select where you heard about us";
    }

    if (!finalAnswers.can_commit) {
      errors.can_commit = "Please confirm whether you can commit to at least one project/event per semester";
    }

    return errors;
  }, [finalAnswers]);

  const isStepAValid = Object.keys(stepAErrors).length === 0;
  const isStepBValid = Object.keys(stepBErrors).length === 0;
  const isStepCValid = Object.keys(stepCErrors).length === 0;

  // Handle advancing to next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!isStepAValid) {
        // Mark all Step A fields touched to show errors
        setTouchedFields((prev) => ({
          ...prev,
          full_name: true,
          email: true,
          whatsapp: true,
          college: true,
          year_or_profession: true,
          city: true,
          linkedin_url: true,
        }));
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      if (!isStepBValid) {
        if (selectedDept) {
          const fields = DEPARTMENT_CONFIG[selectedDept] || [];
          const touched: Record<string, boolean> = {};
          fields.forEach((f) => {
            touched[f.name] = true;
          });
          setTouchedFields((prev) => ({ ...prev, ...touched }));
        }
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // -------------------------------------------------------------
  // SUBMISSION HANDLER
  // -------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate step C
    if (!isStepCValid || !isStepAValid || !isStepBValid || !selectedDept) {
      setTouchedFields((prev) => ({
        ...prev,
        why_join: true,
        heard_from: true,
        can_commit: true,
      }));
      return;
    }

    // Honeypot trap: if filled by a spam bot, fake instant success and abort insert
    if (honeypot.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 500);
      return;
    }

    // Cooldown check (30 seconds)
    if (lastSubmitTime && Date.now() - lastSubmitTime < 30000) {
      const waitSeconds = Math.ceil((30000 - (Date.now() - lastSubmitTime)) / 1000);
      setSubmitError(`Please wait ${waitSeconds} seconds before submitting another application.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Assemble cleaned department answers with formatted URLs and "Other" specifics
      const finalDeptAnswers: Record<string, unknown> = {};
      const fields = DEPARTMENT_CONFIG[selectedDept] || [];

      for (const field of fields) {
        const val = departmentAnswers[field.name];
        if (field.type === "url" && typeof val === "string" && val.trim()) {
          finalDeptAnswers[field.name] = formatUrl(val);
        } else if (field.type === "multiselect" && Array.isArray(val)) {
          const copy = [...val];
          if (copy.includes("Other") && otherInputs[field.name]?.trim()) {
            const index = copy.indexOf("Other");
            copy[index] = `Other: ${otherInputs[field.name].trim()}`;
          }
          finalDeptAnswers[field.name] = copy;
        } else {
          finalDeptAnswers[field.name] = val ?? null;
        }
      }

      // Prepare Supabase row matching public.applications columns
      const row: ApplicationInsertRow = {
        full_name: personalDetails.full_name.trim(),
        email: personalDetails.email.trim().toLowerCase(),
        whatsapp: sanitizeWhatsApp(personalDetails.whatsapp),
        college: personalDetails.college.trim(),
        year_or_profession: personalDetails.year_or_profession,
        city: personalDetails.city.trim(),
        linkedin_url: personalDetails.linkedin_url.trim()
          ? formatUrl(personalDetails.linkedin_url)
          : null,
        department: selectedDept,
        department_answers: finalDeptAnswers,
        why_join: finalAnswers.why_join.trim(),
        skill_to_learn: finalAnswers.skill_to_learn.trim() || null,
        heard_from: finalAnswers.heard_from,
        can_commit: finalAnswers.can_commit === "Yes",
        extra_notes: finalAnswers.extra_notes.trim() || null,
        status: "new",
      };

      // Perform Supabase INSERT without calling .select()
      const { error } = await supabase.from("applications").insert(row);

      if (error) {
        if (
          error.code === "23505" ||
          error.message?.includes("23505") ||
          error.details?.includes("already exists")
        ) {
          setSubmitError(
            "You have already applied to this department with this email. You can apply to a different department."
          );
        } else {
          console.error("Supabase submission error:", error);
          setSubmitError("Something went wrong. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      // Successful submission
      setLastSubmitTime(Date.now());
      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Unexpected error during application submission:", err);
      setSubmitError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // GENERIC FIELD RENDERER FOR DEPARTMENT QUESTIONS
  // -------------------------------------------------------------
  const renderDepartmentField = (field: FieldConfig) => {
    const val = departmentAnswers[field.name];
    const hasError = touchedFields[field.name] && !!stepBErrors[field.name];
    const errorMessage = stepBErrors[field.name];

    switch (field.type) {
      case "text":
      case "url": {
        const textVal = typeof val === "string" ? val : "";
        return (
          <div key={field.name} className="group relative flex flex-col gap-1.5">
            <label
              htmlFor={`dept-field-${field.name}`}
              className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
            >
              {field.label} {field.required && <span className="text-primary">*</span>}
            </label>
            {field.helpText && (
              <span className="text-xs text-muted-foreground/70">{field.helpText}</span>
            )}
            <input
              id={`dept-field-${field.name}`}
              type={field.type === "url" ? "url" : "text"}
              placeholder={field.placeholder}
              value={textVal}
              onChange={(e) => {
                setDepartmentAnswers((prev) => ({ ...prev, [field.name]: e.target.value }));
              }}
              onBlur={() => {
                markTouched(field.name);
                if (field.type === "url" && textVal.trim()) {
                  setDepartmentAnswers((prev) => ({
                    ...prev,
                    [field.name]: formatUrl(textVal),
                  }));
                }
              }}
              className={cn(
                "w-full bg-background/20 rounded-xl px-4 py-3 text-sm sm:text-base text-foreground border outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50",
                hasError ? "border-rose-500/70 bg-rose-500/5" : "border-border/60 focus:border-primary/80"
              )}
            />
            {hasError && (
              <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {errorMessage}
              </p>
            )}
          </div>
        );
      }

      case "textarea": {
        const textVal = typeof val === "string" ? val : "";
        const minChars = field.minLength || 20;
        const currentLength = textVal.trim().length;
        const isMinMet = currentLength >= minChars;

        return (
          <div key={field.name} className="group relative flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`dept-field-${field.name}`}
                className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
              >
                {field.label} {field.required && <span className="text-primary">*</span>}
              </label>
              {field.required && (
                <span
                  className={cn(
                    "text-[11px] font-mono",
                    isMinMet ? "text-emerald-400 font-medium" : "text-muted-foreground/60"
                  )}
                >
                  {currentLength}/{minChars} min chars
                </span>
              )}
            </div>
            {field.helpText && (
              <span className="text-xs text-muted-foreground/70">{field.helpText}</span>
            )}
            <textarea
              id={`dept-field-${field.name}`}
              rows={3}
              placeholder={field.placeholder}
              value={textVal}
              onChange={(e) => {
                setDepartmentAnswers((prev) => ({ ...prev, [field.name]: e.target.value }));
              }}
              onBlur={() => markTouched(field.name)}
              className={cn(
                "w-full bg-background/20 rounded-xl p-4 text-sm sm:text-base text-foreground border outline-none resize-y transition-all placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50",
                hasError ? "border-rose-500/70 bg-rose-500/5" : "border-border/60 focus:border-primary/80"
              )}
            />
            {hasError && (
              <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {errorMessage}
              </p>
            )}
          </div>
        );
      }

      case "select": {
        const selectVal = typeof val === "string" ? val : "";
        return (
          <div key={field.name} className="group relative flex flex-col gap-1.5">
            <label
              htmlFor={`dept-field-${field.name}`}
              className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
            >
              {field.label} {field.required && <span className="text-primary">*</span>}
            </label>
            {field.helpText && (
              <span className="text-xs text-muted-foreground/70">{field.helpText}</span>
            )}
            <select
              id={`dept-field-${field.name}`}
              value={selectVal}
              onChange={(e) => {
                setDepartmentAnswers((prev) => ({ ...prev, [field.name]: e.target.value }));
              }}
              onBlur={() => markTouched(field.name)}
              className={cn(
                "w-full bg-background/40 dark:bg-zinc-900/60 rounded-xl px-4 py-3 text-sm sm:text-base text-foreground border outline-none transition-all focus:ring-1 focus:ring-primary/50",
                hasError ? "border-rose-500/70" : "border-border/60 focus:border-primary/80"
              )}
            >
              <option value="" disabled className="bg-background text-muted-foreground">
                {field.placeholder || "Select an option..."}
              </option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt} className="bg-background text-foreground">
                  {opt}
                </option>
              ))}
            </select>
            {hasError && (
              <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {errorMessage}
              </p>
            )}
          </div>
        );
      }

      case "radio": {
        const radioVal = typeof val === "string" ? val : "";
        return (
          <div key={field.name} className="flex flex-col gap-2">
            <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {field.label} {field.required && <span className="text-primary">*</span>}
            </label>
            {field.helpText && (
              <span className="text-xs text-muted-foreground/70">{field.helpText}</span>
            )}
            <div className="flex flex-wrap gap-2.5">
              {field.options?.map((opt) => {
                const isChecked = radioVal === opt;
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => {
                      setDepartmentAnswers((prev) => ({ ...prev, [field.name]: opt }));
                      markTouched(field.name);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer flex items-center gap-2",
                      isChecked
                        ? "glass-badge border-primary/50 ring-1 ring-primary/40 text-primary shadow-sm"
                        : "bg-background/20 hover:bg-background/50 border-border/50 text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "h-3 w-3 rounded-full border transition-all",
                        isChecked ? "border-primary bg-primary" : "border-muted-foreground/50"
                      )}
                    />
                    {opt}
                  </button>
                );
              })}
            </div>
            {hasError && (
              <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {errorMessage}
              </p>
            )}
          </div>
        );
      }

      case "multiselect": {
        const selectedArr = Array.isArray(val) ? (val as string[]) : [];
        const isOtherSelected = selectedArr.includes("Other");

        const toggleOption = (opt: string) => {
          let updated: string[];
          if (selectedArr.includes(opt)) {
            updated = selectedArr.filter((item) => item !== opt);
          } else {
            updated = [...selectedArr, opt];
          }
          setDepartmentAnswers((prev) => ({ ...prev, [field.name]: updated }));
          markTouched(field.name);
        };

        return (
          <div key={field.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {field.label} {field.required && <span className="text-primary">*</span>}
              </label>
              <span className="text-[11px] text-muted-foreground/60">
                {selectedArr.length > 0 ? `${selectedArr.length} selected` : "Select options"}
              </span>
            </div>
            {field.helpText && (
              <span className="text-xs text-muted-foreground/70">{field.helpText}</span>
            )}
            <div className="flex flex-wrap gap-2">
              {field.options?.map((opt) => {
                const isChecked = selectedArr.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleOption(opt)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 select-none",
                      isChecked
                        ? "glass-badge border-primary/50 text-foreground ring-1 ring-primary/40 shadow-sm"
                        : "bg-background/20 hover:bg-background/50 border-border/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full transition-all",
                        isChecked ? "bg-primary" : "bg-muted-foreground/40"
                      )}
                    />
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* If Other is selected and other inputs are supported, show specification field */}
            {field.allowOtherInput && isOtherSelected && (
              <div className="mt-2 pl-3 border-l-2 border-primary/40 flex flex-col gap-1">
                <label
                  htmlFor={`dept-other-${field.name}`}
                  className="text-xs font-mono text-muted-foreground"
                >
                  Specify &ldquo;Other&rdquo;:
                </label>
                <input
                  id={`dept-other-${field.name}`}
                  type="text"
                  placeholder="e.g. Kotlin, Rust, Product Strategy..."
                  value={otherInputs[field.name] || ""}
                  onChange={(e) => {
                    setOtherInputs((prev) => ({ ...prev, [field.name]: e.target.value }));
                  }}
                  className="w-full sm:max-w-md bg-background/20 rounded-lg px-3 py-1.5 text-xs text-foreground border border-border/60 outline-none focus:border-primary/80"
                />
              </div>
            )}

            {hasError && (
              <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {errorMessage}
              </p>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* SVG Gooey Filter for liquid coalescence */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="mercury-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Floating Mercury Physics Stage */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-50 dark:opacity-60 transition-opacity"
        style={{ filter: "url(#mercury-gooey)" }}
      >
        {STATIC_BLOBS_DATA.map((data, index) => (
          <div
            key={index}
            ref={(el) => {
              blobRefs.current[index] = el;
            }}
            className="absolute rounded-full will-change-transform"
            style={{
              width: `${data.size}px`,
              height: `${data.size}px`,
              left: `${data.left}%`,
              top: `${data.top}%`,
              background: isDark
                ? "linear-gradient(135deg, #e2e8f0 0%, #64748b 50%, #334155 100%)"
                : "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)",
              filter: "blur(22px)",
              boxShadow: isDark
                ? "inset -12px -12px 24px rgba(0,0,0,0.7), 12px 12px 32px rgba(255,255,255,0.25)"
                : "inset -12px -12px 24px rgba(0,0,0,0.2), 12px 12px 32px rgba(255,255,255,0.7)",
              animation: `mercuryFloat ${data.animationDuration}s infinite alternate ease-in-out`,
              animationDelay: `${data.animationDelay}s`,
              transition: "margin 0.15s cubic-bezier(0.2, 1, 0.3, 1)",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes mercuryFloat {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(8vw, 12vh) scale(1.15); }
          66% { transform: translate(-6vw, 8vh) scale(0.85); }
          100% { transform: translate(6vw, -8vh) scale(1.1); }
        }
      `}</style>

      {/* Navigation Top Bar */}
      <header className="relative z-20 w-full px-6 py-6 flex items-center justify-between max-w-6xl mx-auto gap-4">
        <Button
          variant="outline"
          onClick={onBackToHome}
          className="rounded-full gap-2 glass-badge cursor-pointer hover:border-white/40 transition-all text-xs sm:text-sm px-4 h-10 shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="glass-heading font-medium">Back to Home</span>
        </Button>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2.5 font-display font-extrabold tracking-tight text-lg">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black border border-white/20 p-1 shadow-sm overflow-hidden">
              <img
                src="/buildcult-logo.png"
                alt="BUILDCULT Logo"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="glass-heading">
              BUILD<span className="glass-accent">CULT</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Recruitment Flow */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-3xl flex-1 flex flex-col justify-center">
        {/* ========================================================================= */}
        {/* SCREEN 3: SUCCESS CONFIRMATION                                            */}
        {/* ========================================================================= */}
        {submitted ? (
          <div className="w-full glass-panel p-8 sm:p-14 rounded-3xl shadow-2xl text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="h-20 w-20 rounded-full glass-badge flex items-center justify-center text-emerald-400 shadow-xl border border-emerald-500/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="flex flex-col gap-2 max-w-md">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                Application Received
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight glass-heading">
                Welcome to the Pipeline, {personalDetails.full_name || "Builder"}.
              </h2>
              <p className="text-sm sm:text-base glass-subtext mt-2 leading-relaxed">
                Application received! We will contact you within 3-5 days.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-background/50 border border-border/40 text-xs font-mono text-muted-foreground w-full max-w-sm text-left flex flex-col gap-1.5 shadow-inner">
              <div className="flex justify-between border-b border-border/30 pb-1.5">
                <span className="text-muted-foreground/70">Applicant:</span>
                <span className="text-foreground font-semibold">{personalDetails.full_name}</span>
              </div>
              <div className="flex justify-between border-b border-border/30 pb-1.5">
                <span className="text-muted-foreground/70">Department:</span>
                <span className="text-primary font-semibold">
                  {selectedDept ? DEPARTMENTS[selectedDept].name : "N/A"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/30 pb-1.5">
                <span className="text-muted-foreground/70">Email:</span>
                <span className="text-foreground">{personalDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground/70">Review Window:</span>
                <span className="text-emerald-400">3 - 5 Business Days</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto">
              <Button
                onClick={onBackToHome}
                className="rounded-full px-6 h-11 glass-badge hover:border-white/40 cursor-pointer text-sm font-semibold shadow-lg"
              >
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={handleResetAll}
                className="rounded-full px-6 h-11 glass-badge hover:border-white/40 cursor-pointer text-xs sm:text-sm font-medium"
              >
                Apply to Another Department
              </Button>
            </div>
          </div>
        ) : !selectedDept ? (
          /* ========================================================================= */
          /* SCREEN 1: CHOOSE DEPARTMENT                                               */
          /* ========================================================================= */
          <div className="w-full glass-panel p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300">
            {/* Top Node Tracker */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Selection Portal · Step 1 of 2</span>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest glass-badge px-2.5 py-0.5 rounded-full">
                Season 2026
              </span>
            </div>

            {/* Header */}
            <div className="mb-8 text-left">
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight">
                <span className="glass-heading">PICK YOUR </span>
                <span className="font-serif italic font-normal glass-accent">DEPARTMENT</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base glass-subtext leading-relaxed max-w-xl">
                Choose the crew where you want to make the biggest impact. You can apply to one department at a time.
              </p>
            </div>

            {/* 5 Department Cards */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {DEPARTMENT_LIST.map((dept) => {
                const Icon = dept.icon;
                return (
                  <button
                    type="button"
                    key={dept.id}
                    onClick={() => {
                      setSelectedDept(dept.id);
                      setCurrentStep(1);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedDept(dept.id);
                        setCurrentStep(1);
                      }
                    }}
                    tabIndex={0}
                    className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer border border-border/50 bg-background/20 hover:bg-background/60 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/60 outline-none shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-background/60 border border-border/60 flex items-center justify-center text-foreground group-hover:text-primary group-hover:border-primary/40 group-hover:scale-105 transition-all shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {dept.name}
                          </h2>
                          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {dept.badge}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-snug">
                          {dept.oneLiner}
                        </p>
                      </div>
                    </div>

                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Verified Community Application
              </span>
              <span>Select a role to continue</span>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* SCREEN 2: MULTI-STEP DEPARTMENT FORM                                      */
          /* ========================================================================= */
          <div className="w-full glass-panel p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300">
            {/* Top Bar with Department Badge and Change Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">Applying for:</span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider glass-badge px-3 py-1 rounded-full text-primary border border-primary/30 flex items-center gap-1.5">
                  {React.createElement(DEPARTMENTS[selectedDept].icon, { className: "h-3.5 w-3.5" })}
                  {DEPARTMENTS[selectedDept].name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleChangeDepartment}
                className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/30 hover:bg-background/60 border border-border/40 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                Change department
              </button>
            </div>

            {/* 3-Step Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[
                  { step: 1, label: "About you" },
                  { step: 2, label: "Department questions" },
                  { step: 3, label: "Final questions" },
                ].map(({ step, label }) => {
                  const isActive = currentStep === step;
                  const isDone = currentStep > step;
                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => {
                        // Allow clicking back to completed steps
                        if (step < currentStep) {
                          setCurrentStep(step as 1 | 2 | 3);
                        }
                      }}
                      disabled={step > currentStep}
                      className={cn(
                        "flex items-center gap-2 text-xs font-mono transition-all text-left",
                        step <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                      )}
                    >
                      <span
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs transition-all",
                          isDone
                            ? "bg-emerald-500 text-black shadow-sm"
                            : isActive
                            ? "bg-primary text-primary-foreground ring-2 ring-primary/40"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isDone ? "✓" : step}
                      </span>
                      <span
                        className={cn(
                          "hidden sm:inline font-medium",
                          isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                        )}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Progress bar line */}
              <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Invisible Honeypot field for bot protection */}
              <div aria-hidden="true" style={{ display: "none" }}>
                <label htmlFor="hp_field">Do not fill this</label>
                <input
                  id="hp_field"
                  type="text"
                  name="user_verification_token"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Error banner if submission failed */}
              {submitError && (
                <div
                  aria-live="polite"
                  className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200"
                >
                  <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Submission Notice</p>
                    <p className="mt-0.5 text-rose-200/90">{submitError}</p>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STEP A: ABOUT YOU                                             */}
              {/* ------------------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-300">
                  <div className="border-b border-border/30 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight glass-heading">
                      Tell us about yourself
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      We want to know who you are and where you are building from.
                    </p>
                  </div>

                  {/* 1. Full Name */}
                  <div className="group relative flex flex-col gap-1.5">
                    <label
                      htmlFor="personal_name"
                      className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
                    >
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="personal_name"
                      type="text"
                      required
                      placeholder="e.g. Elena Vance"
                      value={personalDetails.full_name}
                      onChange={(e) =>
                        setPersonalDetails({ ...personalDetails, full_name: e.target.value })
                      }
                      onBlur={() => markTouched("full_name")}
                      className={cn(
                        "w-full bg-background/20 rounded-xl px-4 py-3 text-sm sm:text-base text-foreground border outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50",
                        touchedFields.full_name && stepAErrors.full_name
                          ? "border-rose-500/70 bg-rose-500/5"
                          : "border-border/60 focus:border-primary/80"
                      )}
                    />
                    {touchedFields.full_name && stepAErrors.full_name && (
                      <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {stepAErrors.full_name}
                      </p>
                    )}
                  </div>

                  {/* 2. Email & 3. WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="group relative flex flex-col gap-1.5">
                      <label
                        htmlFor="personal_email"
                        className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
                      >
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <input
                        id="personal_email"
                        type="email"
                        required
                        placeholder="elena@example.com"
                        value={personalDetails.email}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, email: e.target.value })
                        }
                        onBlur={() => markTouched("email")}
                        className={cn(
                          "w-full bg-background/20 rounded-xl px-4 py-3 text-sm sm:text-base text-foreground border outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50",
                          touchedFields.email && stepAErrors.email
                            ? "border-rose-500/70 bg-rose-500/5"
                            : "border-border/60 focus:border-primary/80"
                        )}
                      />
                      {touchedFields.email && stepAErrors.email && (
                        <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {stepAErrors.email}
                        </p>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div className="group relative flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="personal_whatsapp"
                          className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
                        >
                          WhatsApp Number <span className="text-primary">*</span>
                        </label>
                        <span className="text-[10px] text-muted-foreground/60 font-mono">10 digits</span>
                      </div>
                      <input
                        id="personal_whatsapp"
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={personalDetails.whatsapp}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, whatsapp: e.target.value })
                        }
                        onBlur={() => markTouched("whatsapp")}
                        className={cn(
                          "w-full bg-background/20 rounded-xl px-4 py-3 text-sm sm:text-base text-foreground border outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50",
                          touchedFields.whatsapp && stepAErrors.whatsapp
                            ? "border-rose-500/70 bg-rose-500/5"
                            : "border-border/60 focus:border-primary/80"
                        )}
                      />
                      {touchedFields.whatsapp && stepAErrors.whatsapp && (
                        <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {stepAErrors.whatsapp}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 4. College / Org & 5. Year / Profession */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* College */}
                    <div className="group relative flex flex-col gap-1.5">
                      <label
                        htmlFor="personal_college"
                        className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
                      >
                        College / Organization <span className="text-primary">*</span>
                      </label>
                      <input
                        id="personal_college"
                        type="text"
                        required
                        placeholder="e.g. IIT Delhi or Freelance"
                        value={personalDetails.college}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, college: e.target.value })
                        }
                        onBlur={() => markTouched("college")}
                        className={cn(
                          "w-full bg-background/20 rounded-xl px-4 py-3 text-sm sm:text-base text-foreground border outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50",
                          touchedFields.college && stepAErrors.college
                            ? "border-rose-500/70 bg-rose-500/5"
                            : "border-border/60 focus:border-primary/80"
                        )}
                      />
                      {touchedFields.college && stepAErrors.college && (
                        <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {stepAErrors.college}
                        </p>
                      )}
                    </div>

                    {/* Year / Profession */}
                    <div className="group relative flex flex-col gap-1.5">
                      <label
                        htmlFor="personal_year"
                        className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
                      >
                        Year / Profession <span className="text-primary">*</span>
                      </label>
                      <select
                        id="personal_year"
                        required
                        value={personalDetails.year_or_profession}
                        onChange={(e) =>
                          setPersonalDetails({
                            ...personalDetails,
                            year_or_profession: e.target.value,
                          })
                        }
                        onBlur={() => markTouched("year_or_profession")}
                        className={cn(
                          "w-full bg-background/40 dark:bg-zinc-900/60 rounded-xl px-4 py-3 text-sm sm:text-base text-foreground border outline-none transition-all focus:ring-1 focus:ring-primary/50",
                          touchedFields.year_or_profession && stepAErrors.year_or_profession
                            ? "border-rose-500/70"
                            : "border-border/60 focus:border-primary/80"
                        )}
                      >
                        <option value="" disabled className="bg-background text-muted-foreground">
                          Select current status...
                        </option>
                        {YEAR_OR_PROFESSION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-background text-foreground">
                            {opt}
                          </option>
                        ))}
                      </select>
                      {touchedFields.year_or_profession && stepAErrors.year_or_profession && (
                        <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {stepAErrors.year_or_profession}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 6. City & 7. LinkedIn URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City */}
                    <div className="group relative flex flex-col gap-1.5">
                      <label
                        htmlFor="personal_city"
                        className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
                      >
                        City <span className="text-primary">*</span>
                      </label>
                      <input
                        id="personal_city"
                        type="text"
                        required
                        placeholder="e.g. New Delhi, Bengaluru"
                        value={personalDetails.city}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, city: e.target.value })
                        }
                        onBlur={() => markTouched("city")}
                        className={cn(
                          "w-full bg-background/20 rounded-xl px-4 py-3 text-sm sm:text-base text-foreground border outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50",
                          touchedFields.city && stepAErrors.city
                            ? "border-rose-500/70 bg-rose-500/5"
                            : "border-border/60 focus:border-primary/80"
                        )}
                      />
                      {touchedFields.city && stepAErrors.city && (
                        <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {stepAErrors.city}
                        </p>
                      )}
                    </div>

                    {/* LinkedIn URL (Optional) */}
                    <div className="group relative flex flex-col gap-1.5">
                      <label
                        htmlFor="personal_linkedin"
                        className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
                      >
                        LinkedIn Profile <span className="text-xs text-muted-foreground/60">(Optional)</span>
                      </label>
                      <input
                        id="personal_linkedin"
                        type="url"
                        placeholder="linkedin.com/in/username"
                        value={personalDetails.linkedin_url}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, linkedin_url: e.target.value })
                        }
                        onBlur={() => {
                          markTouched("linkedin_url");
                          if (personalDetails.linkedin_url.trim()) {
                            setPersonalDetails((prev) => ({
                              ...prev,
                              linkedin_url: formatUrl(prev.linkedin_url),
                            }));
                          }
                        }}
                        className={cn(
                          "w-full bg-background/20 rounded-xl px-4 py-3 text-sm sm:text-base text-foreground border outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50",
                          touchedFields.linkedin_url && stepAErrors.linkedin_url
                            ? "border-rose-500/70 bg-rose-500/5"
                            : "border-border/60 focus:border-primary/80"
                        )}
                      />
                      {touchedFields.linkedin_url && stepAErrors.linkedin_url && (
                        <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {stepAErrors.linkedin_url}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STEP B: DEPARTMENT-SPECIFIC QUESTIONS                          */}
              {/* ------------------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  <div className="border-b border-border/30 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight glass-heading">
                        {DEPARTMENTS[selectedDept].name} Questions
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Tailored questions for your domain and experience.
                      </p>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Step 2 of 3
                    </span>
                  </div>

                  {/* Render fields data-driven from DEPARTMENT_CONFIG */}
                  <div className="flex flex-col gap-5">
                    {DEPARTMENT_CONFIG[selectedDept]?.map((field) => renderDepartmentField(field))}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STEP C: FINAL QUESTIONS                                       */}
              {/* ------------------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  <div className="border-b border-border/30 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight glass-heading">
                        Final Questions
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Almost done! Help us understand your goals and alignment.
                      </p>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Step 3 of 3
                    </span>
                  </div>

                  {/* 1. Why Join BUILDCULT (20-2000 chars) */}
                  <div className="group relative flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="final_why"
                        className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
                      >
                        Why do you want to join BUILDCULT? <span className="text-primary">*</span>
                      </label>
                      <span
                        className={cn(
                          "text-[11px] font-mono",
                          finalAnswers.why_join.trim().length >= 20 &&
                            finalAnswers.why_join.trim().length <= 2000
                            ? "text-emerald-400 font-medium"
                            : "text-muted-foreground/60"
                        )}
                      >
                        {finalAnswers.why_join.trim().length}/20 min (max 2000)
                      </span>
                    </div>
                    <textarea
                      id="final_why"
                      rows={4}
                      required
                      placeholder="Tell us what motivates you, what you want to build with the community, and what excites you about BUILDCULT..."
                      value={finalAnswers.why_join}
                      onChange={(e) =>
                        setFinalAnswers({ ...finalAnswers, why_join: e.target.value })
                      }
                      onBlur={() => markTouched("why_join")}
                      className={cn(
                        "w-full bg-background/20 rounded-xl p-4 text-sm sm:text-base text-foreground border outline-none resize-y transition-all placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50",
                        touchedFields.why_join && stepCErrors.why_join
                          ? "border-rose-500/70 bg-rose-500/5"
                          : "border-border/60 focus:border-primary/80"
                      )}
                    />
                    {touchedFields.why_join && stepCErrors.why_join && (
                      <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {stepCErrors.why_join}
                      </p>
                    )}
                  </div>

                  {/* 2. Skill To Learn (Optional) */}
                  <div className="group relative flex flex-col gap-1.5">
                    <label
                      htmlFor="final_skill"
                      className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
                    >
                      Skills / Technologies you want to learn{" "}
                      <span className="text-xs text-muted-foreground/60">(Optional)</span>
                    </label>
                    <input
                      id="final_skill"
                      type="text"
                      placeholder="e.g. Three.js shaders, Rust, community growth, motion design..."
                      value={finalAnswers.skill_to_learn}
                      onChange={(e) =>
                        setFinalAnswers({ ...finalAnswers, skill_to_learn: e.target.value })
                      }
                      className="w-full bg-background/20 rounded-xl px-4 py-3 text-sm sm:text-base text-foreground border border-border/60 outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50 focus:border-primary/80"
                    />
                  </div>

                  {/* 3. Where Heard From & 4. Commitment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Heard From */}
                    <div className="group relative flex flex-col gap-1.5">
                      <label
                        htmlFor="final_heard"
                        className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
                      >
                        Where did you hear about us? <span className="text-primary">*</span>
                      </label>
                      <select
                        id="final_heard"
                        required
                        value={finalAnswers.heard_from}
                        onChange={(e) =>
                          setFinalAnswers({ ...finalAnswers, heard_from: e.target.value })
                        }
                        onBlur={() => markTouched("heard_from")}
                        className={cn(
                          "w-full bg-background/40 dark:bg-zinc-900/60 rounded-xl px-4 py-3 text-sm sm:text-base text-foreground border outline-none transition-all focus:ring-1 focus:ring-primary/50",
                          touchedFields.heard_from && stepCErrors.heard_from
                            ? "border-rose-500/70"
                            : "border-border/60 focus:border-primary/80"
                        )}
                      >
                        <option value="" disabled className="bg-background text-muted-foreground">
                          Select a source...
                        </option>
                        {HEARD_FROM_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-background text-foreground">
                            {opt}
                          </option>
                        ))}
                      </select>
                      {touchedFields.heard_from && stepCErrors.heard_from && (
                        <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {stepCErrors.heard_from}
                        </p>
                      )}
                    </div>

                    {/* Can Commit */}
                    <div className="flex flex-col gap-1.5">
                      <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Can you commit to at least 1 project/event per semester?{" "}
                        <span className="text-primary">*</span>
                      </label>
                      <div className="flex gap-3 pt-1">
                        {["Yes", "No"].map((choice) => {
                          const isSelected = finalAnswers.can_commit === choice;
                          return (
                            <button
                              type="button"
                              key={choice}
                              onClick={() => {
                                setFinalAnswers({ ...finalAnswers, can_commit: choice });
                                markTouched("can_commit");
                              }}
                              className={cn(
                                "flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex items-center justify-center gap-2",
                                isSelected
                                  ? "glass-badge border-primary/50 ring-1 ring-primary/40 text-primary shadow-sm"
                                  : "bg-background/20 hover:bg-background/50 border-border/50 text-muted-foreground"
                              )}
                            >
                              <span
                                className={cn(
                                  "h-2.5 w-2.5 rounded-full transition-all",
                                  isSelected ? "bg-primary" : "bg-muted-foreground/40"
                                )}
                              />
                              {choice}
                            </button>
                          );
                        })}
                      </div>
                      {touchedFields.can_commit && stepCErrors.can_commit && (
                        <p aria-live="polite" className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {stepCErrors.can_commit}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 5. Extra Notes (Optional) */}
                  <div className="group relative flex flex-col gap-1.5">
                    <label
                      htmlFor="final_notes"
                      className="block font-mono text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-foreground transition-colors"
                    >
                      Anything else you want to share with us?{" "}
                      <span className="text-xs text-muted-foreground/60">(Optional)</span>
                    </label>
                    <textarea
                      id="final_notes"
                      rows={2}
                      placeholder="Links, thoughts, shoutouts, or questions for our team..."
                      value={finalAnswers.extra_notes}
                      onChange={(e) =>
                        setFinalAnswers({ ...finalAnswers, extra_notes: e.target.value })
                      }
                      className="w-full bg-background/20 rounded-xl p-4 text-sm sm:text-base text-foreground border border-border/60 outline-none resize-y transition-all placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50 focus:border-primary/80"
                    />
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STEP CONTROLS (Back, Next, Submit)                            */}
              {/* ------------------------------------------------------------- */}
              <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="rounded-full px-5 h-11 text-xs sm:text-sm font-mono uppercase tracking-wider glass-badge hover:border-white/40 cursor-pointer"
                  >
                    Back
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleChangeDepartment}
                    className="rounded-full px-4 h-11 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={
                      currentStep === 1
                        ? !isStepAValid && Object.keys(touchedFields).length > 0
                        : !isStepBValid && Object.keys(touchedFields).length > 0
                    }
                    className="rounded-full px-7 h-11 text-xs sm:text-sm font-mono uppercase tracking-wider glass-badge bg-primary/20 hover:bg-primary/30 border-primary/50 text-foreground cursor-pointer flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Continue</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !isStepCValid}
                    className={cn(
                      "group relative h-12 px-8 rounded-full overflow-hidden transition-all duration-300 cursor-pointer shadow-2xl glass-badge border-primary/50 flex items-center justify-center gap-2",
                      isSubmitting || !isStepCValid
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:border-primary hover:shadow-primary/20"
                    )}
                  >
                    {/* Liquid sheen highlight */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />

                    <span className="relative z-10 flex items-center gap-2 font-mono uppercase tracking-wider text-xs sm:text-sm font-bold glass-heading">
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span>Transmitting Application...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 text-primary" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs font-mono text-muted-foreground">
        <p>&copy; {CURRENT_YEAR} BUILDCULT · Liquid Architecture Protocol</p>
      </footer>
    </div>
  );
}

export default JoinUsPage;
