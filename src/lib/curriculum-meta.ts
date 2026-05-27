import type { LucideIcon } from "lucide-react";
import { Globe, Zap, Rocket, Target } from "lucide-react";

export type PhaseMeta = {
  short: string;
  label: string;
  color: string;
  gradient: string;
  borderColor: string;
  bgLight: string;
  bgDark: string;
  Icon: LucideIcon;
};

export const PHASE_META: Record<string, PhaseMeta> = {
  "phase-1": {
    short: "P1",
    label: "Foundation",
    color: "#3b82f6",
    gradient: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/30",
    bgLight: "from-blue-50 to-blue-100",
    bgDark: "from-blue-950/50 to-blue-900/30",
    Icon: Globe,
  },
  "phase-2": {
    short: "P2",
    label: "Tooling",
    color: "#a855f7",
    gradient: "from-purple-500 to-violet-500",
    borderColor: "border-purple-500/30",
    bgLight: "from-purple-50 to-purple-100",
    bgDark: "from-purple-950/50 to-purple-900/30",
    Icon: Zap,
  },
  "phase-3": {
    short: "P3",
    label: "Build",
    color: "#22c55e",
    gradient: "from-emerald-500 to-green-500",
    borderColor: "border-emerald-500/30",
    bgLight: "from-green-50 to-green-100",
    bgDark: "from-green-950/50 to-green-900/30",
    Icon: Rocket,
  },
  "phase-4": {
    short: "P4",
    label: "Launch",
    color: "#e31e24",
    gradient: "from-red-500 to-orange-500",
    borderColor: "border-red-500/30",
    bgLight: "from-red-50 to-red-100",
    bgDark: "from-red-950/50 to-red-900/30",
    Icon: Target,
  },
};

export function getPhaseMeta(phaseId: string, index: number): PhaseMeta {
  return (
    PHASE_META[phaseId] ?? {
      ...PHASE_META["phase-1"],
      short: `P${index + 1}`,
      label: `Phase ${index + 1}`,
    }
  );
}
