"use client";

import { Layers } from "lucide-react";
import type { Phase } from "@/lib/types";
import { setActivePhaseId } from "@/lib/progress";

const PHASE_META: Record<
  string,
  { short: string; color: string; icon: string; label: string }
> = {
  "phase-1": { short: "P1", color: "#3b82f6", icon: "🌐", label: "Phase 1" },
  "phase-2": { short: "P2", color: "#a855f7", icon: "⚡", label: "Phase 2" },
  "phase-3": { short: "P3", color: "#22c55e", icon: "🚀", label: "Phase 3" },
  "phase-4": { short: "P4", color: "#e31e24", icon: "🎯", label: "Phase 4" },
};

interface PhaseSidebarProps {
  phases: Phase[];
  activePhaseId: string;
  onPhaseChange: (phaseId: string) => void;
}

export function PhaseSidebar({
  phases,
  activePhaseId,
  onPhaseChange,
}: PhaseSidebarProps) {
  return (
    <aside
      className="fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-[72px] flex-col items-center gap-3 border-r border-white/10 py-6 md:w-20"
      style={{ background: "var(--sidebar-bg)" }}
    >
      <p className="mb-1 hidden px-1 text-center text-[8px] font-bold uppercase leading-tight tracking-wider text-gray-500 md:block">
        Switch phase
      </p>
      {phases.map((phase, i) => {
        const meta = PHASE_META[phase.id] || {
          short: `P${i + 1}`,
          color: "#e31e24",
          icon: "•",
          label: `Phase ${i + 1}`,
        };
        const isActive = phase.id === activePhaseId;

        return (
          <button
            key={phase.id}
            type="button"
            title={phase.title}
            onClick={() => {
              setActivePhaseId(phase.id);
              onPhaseChange(phase.id);
            }}
            className={`group relative flex w-14 flex-col items-center rounded-xl border-2 px-1 py-3 transition-all duration-300 md:w-16 ${
              isActive
                ? "scale-105 border-mst-red bg-white shadow-[0_0_24px_rgba(227,30,36,0.25)]"
                : "border-white/10 bg-[#1a1a1a] hover:border-white/30 hover:bg-[#222]"
            }`}
          >
            <span className="text-lg">{meta.icon}</span>
            <span
              className="mt-1 text-[10px] font-black"
              style={{ color: isActive ? meta.color : "#888" }}
            >
              {meta.short}
            </span>
            {isActive && (
              <span className="absolute -right-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-mst-red" />
            )}
          </button>
        );
      })}
      <div className="mt-auto flex flex-col items-center gap-2 px-2 text-center">
        <Layers size={14} className="text-gray-500" />
        <span className="text-[8px] leading-tight text-gray-500">
          {phases.length} phases
        </span>
      </div>
    </aside>
  );
}
