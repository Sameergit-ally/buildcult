import {
  Code2,
  Palette,
  TrendingUp,
  Calendar,
  Share2,
  type LucideIcon,
} from "lucide-react";

export type DepartmentKey =
  | "technical"
  | "design"
  | "marketing_growth"
  | "event_management"
  | "content_social";

export interface DepartmentMeta {
  id: DepartmentKey;
  name: string;
  oneLiner: string;
  icon: LucideIcon;
  badge: string;
}

export const DEPARTMENTS: Record<DepartmentKey, DepartmentMeta> = {
  technical: {
    id: "technical",
    name: "Technical",
    oneLiner: "Technical - build products, ship code",
    icon: Code2,
    badge: "Core Engineering",
  },
  design: {
    id: "design",
    name: "Design",
    oneLiner: "Design - UI/UX, branding, motion",
    icon: Palette,
    badge: "Visual & Motion",
  },
  marketing_growth: {
    id: "marketing_growth",
    name: "Marketing & Growth",
    oneLiner: "Marketing & Growth - sponsors, outreach, growth",
    icon: TrendingUp,
    badge: "Community & Scale",
  },
  event_management: {
    id: "event_management",
    name: "Event Management",
    oneLiner: "Event Management - logistics, speakers, on-ground ops",
    icon: Calendar,
    badge: "Operations & IRL",
  },
  content_social: {
    id: "content_social",
    name: "Content & Social Media",
    oneLiner: "Content & Social Media - posts, reels, writing",
    icon: Share2,
    badge: "Media & Editorial",
  },
};

export const DEPARTMENT_LIST: DepartmentMeta[] = Object.values(DEPARTMENTS);

export type FieldType = "text" | "url" | "textarea" | "select" | "multiselect" | "radio";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  minLength?: number;
  maxLength?: number;
  helpText?: string;
  allowOtherInput?: boolean;
}

export const HOURS_OPTIONS = ["2-4 hours", "5-8 hours", "8+ hours"];

export const YEAR_OR_PROFESSION_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Working Professional",
  "Freelancer",
  "Other",
];

export const HEARD_FROM_OPTIONS = [
  "Instagram",
  "LinkedIn",
  "Friend",
  "Event",
  "College",
  "Other",
];

export const DEPARTMENT_CONFIG: Record<DepartmentKey, FieldConfig[]> = {
  technical: [
    {
      name: "skills",
      label: "Technical Skills / Domains",
      type: "multiselect",
      required: true,
      options: [
        "Frontend",
        "Backend",
        "Full Stack",
        "AI/ML",
        "App Dev",
        "DevOps",
        "Web3",
        "DSA / Competitive Programming",
        "Other",
      ],
      allowOtherInput: true,
      helpText: "Select all that apply",
    },
    {
      name: "level",
      label: "Proficiency Level",
      type: "select",
      required: true,
      options: ["Beginner", "Intermediate", "Advanced"],
      placeholder: "Select your experience level",
    },
    {
      name: "github_url",
      label: "GitHub Profile or Repository URL",
      type: "url",
      required: true,
      placeholder: "github.com/your-username",
    },
    {
      name: "portfolio_url",
      label: "Portfolio or Live Project Link",
      type: "url",
      required: false,
      placeholder: "https://yourportfolio.dev",
    },
    {
      name: "project_description",
      label: "Describe one project you built: what it does, tech stack, your role",
      type: "textarea",
      required: true,
      minLength: 20,
      placeholder: "Tell us about the problem it solved, libraries/tools used, and your key contribution...",
    },
    {
      name: "hackathon_experience",
      label: "Hackathon Experience",
      type: "radio",
      required: true,
      options: ["Yes", "No"],
    },
    {
      name: "hours_per_week",
      label: "Weekly Availability",
      type: "select",
      required: true,
      options: HOURS_OPTIONS,
      placeholder: "Select weekly commitment",
    },
  ],

  design: [
    {
      name: "areas",
      label: "Design Focus Areas",
      type: "multiselect",
      required: true,
      options: ["UI/UX", "Graphic Design", "Motion / Video", "Branding", "3D", "Other"],
      allowOtherInput: true,
      helpText: "Select all areas you practice",
    },
    {
      name: "tools",
      label: "Tools You Use",
      type: "multiselect",
      required: true,
      options: [
        "Figma",
        "Photoshop",
        "Illustrator",
        "Canva",
        "After Effects",
        "Blender",
        "Premiere Pro",
        "Other",
      ],
      allowOtherInput: true,
      helpText: "Select primary creative software",
    },
    {
      name: "portfolio_url",
      label: "Portfolio URL (Behance / Dribbble / Drive / Figma)",
      type: "url",
      required: true,
      placeholder: "behance.net/username or figma.com/@profile",
    },
    {
      name: "design_thinking",
      label: "Share your best work and explain your design thinking",
      type: "textarea",
      required: true,
      minLength: 20,
      placeholder: "Walk us through your thought process, user problem, iterations, and final outcome...",
    },
    {
      name: "hours_per_week",
      label: "Weekly Availability",
      type: "select",
      required: true,
      options: HOURS_OPTIONS,
      placeholder: "Select weekly commitment",
    },
  ],

  marketing_growth: [
    {
      name: "areas",
      label: "Growth & Marketing Focus",
      type: "multiselect",
      required: true,
      options: [
        "Sponsorship / Outreach",
        "Partnerships",
        "Campus Ambassador",
        "Growth Marketing",
        "Email / Community Growth",
        "Other",
      ],
      allowOtherInput: true,
      helpText: "Select all that match your strengths",
    },
    {
      name: "past_experience",
      label: "Past Marketing or Sponsorship Experience",
      type: "textarea",
      required: false,
      placeholder: "Mention any sponsorships raised, campaigns led, or clubs you helped grow (optional)...",
    },
    {
      name: "plan_500_signups",
      label: "How would you get 500 sign-ups for our next event?",
      type: "textarea",
      required: true,
      minLength: 20,
      placeholder: "Channels, college outreach, viral hook, timeline, or influencer strategy...",
    },
    {
      name: "network_reach",
      label: "Which clubs, groups or communities are you part of?",
      type: "textarea",
      required: true,
      minLength: 20,
      placeholder: "List college societies, developer groups, Discord communities, or local meetups...",
    },
    {
      name: "hours_per_week",
      label: "Weekly Availability",
      type: "select",
      required: true,
      options: HOURS_OPTIONS,
      placeholder: "Select weekly commitment",
    },
  ],

  event_management: [
    {
      name: "areas",
      label: "Operations & Event Areas",
      type: "multiselect",
      required: true,
      options: [
        "Logistics",
        "Venue Management",
        "Speaker Management",
        "Volunteer Coordination",
        "Registration / On-ground Operations",
        "Other",
      ],
      allowOtherInput: true,
      helpText: "Select domains you are comfortable executing",
    },
    {
      name: "event_experience",
      label: "Have you organised or volunteered at any event? Tell us about it",
      type: "textarea",
      required: true,
      minLength: 20,
      placeholder: "Describe the event size, your responsibilities, and how you handled on-ground challenges...",
    },
    {
      name: "speaker_cancels_plan",
      label: "A speaker cancels 2 hours before the event. What do you do?",
      type: "textarea",
      required: true,
      minLength: 20,
      placeholder: "Contingency plan, audience management, alternative activity or buffer fill...",
    },
    {
      name: "weekend_availability",
      label: "Availability for Weekend Events / Hackathons",
      type: "radio",
      required: true,
      options: ["Yes", "Sometimes", "No"],
    },
    {
      name: "hours_per_week",
      label: "Weekly Availability",
      type: "select",
      required: true,
      options: HOURS_OPTIONS,
      placeholder: "Select weekly commitment",
    },
  ],

  content_social: [
    {
      name: "areas",
      label: "Content & Creation Areas",
      type: "multiselect",
      required: true,
      options: [
        "Social Media Management",
        "Content Writing",
        "Video Editing / Reels",
        "Photography",
        "Newsletter / Blog",
        "Other",
      ],
      allowOtherInput: true,
      helpText: "Select forms of content you create",
    },
    {
      name: "handle",
      label: "Social Media Handle (Instagram / X / LinkedIn)",
      type: "text",
      required: false,
      placeholder: "@handle or profile link",
    },
    {
      name: "work_sample_url",
      label: "Work Sample / Drive / Portfolio Link",
      type: "url",
      required: true,
      placeholder: "drive.google.com/... or your sample link",
    },
    {
      name: "hackathon_caption",
      label: "Write a 2-line caption announcing a hackathon",
      type: "text",
      required: true,
      placeholder: "Drop a sharp hook and a call-to-action...",
    },
    {
      name: "hours_per_week",
      label: "Weekly Availability",
      type: "select",
      required: true,
      options: HOURS_OPTIONS,
      placeholder: "Select weekly commitment",
    },
  ],
};

export interface PersonalDetails {
  full_name: string;
  email: string;
  whatsapp: string;
  college: string;
  year_or_profession: string;
  city: string;
  linkedin_url: string;
}

export interface FinalAnswers {
  why_join: string;
  skill_to_learn: string;
  heard_from: string;
  can_commit: string; // "Yes" | "No" | ""
  extra_notes: string;
}

export interface ApplicationInsertRow {
  full_name: string;
  email: string;
  whatsapp: string;
  college: string;
  year_or_profession: string;
  city: string;
  linkedin_url: string | null;
  department: DepartmentKey;
  department_answers: Record<string, unknown>;
  why_join: string;
  skill_to_learn: string | null;
  heard_from: string;
  can_commit: boolean;
  extra_notes: string | null;
  status?: string;
}
