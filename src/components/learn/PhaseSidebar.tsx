"use client";

import { Layers } from "lucide-react";
import type { Phase } from "@/lib/types";
import { setActivePhaseId } from "@/lib/progress";
import { getPhaseMeta } from "@/lib/curriculum-meta";

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
      className="fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-[72px] flex-col items-center gap-3 border-r border-[var(--border)] py-5 md:w-20"
      style={{ background: "var(--sidebar-bg)" }}
    >
      <p className="mb-1 hidden px-1 text-center text-[8px] font-bold uppercase leading-tight tracking-[0.18em] text-[var(--text-muted)] md:block">
        Phases
      </p>

      {phases.map((phase, i) => {
        const meta = getPhaseMeta(phase.id, i);
        const isActive = phase.id === activePhaseId;
        const Icon = meta.Icon;

        return (
          <button
            key={phase.id}
            type="button"
            title={phase.title}
            onClick={() => {
              setActivePhaseId(phase.id);
              onPhaseChange(phase.id);
            }}
            className={`group relative flex w-14 flex-col items-center rounded-2xl border-2 px-1 py-3.5 transition-all duration-300 md:w-16 ${
              isActive
                ? "scale-105 border-transparent shadow-xl dark:shadow-lg"
                : "border-[var(--border)] hover:border-[var(--text-muted)]/30 hover:shadow-md"
            }`}
            style={
              isActive
                ? {
                    background: `linear-gradient(135deg, ${meta.color}15, ${meta.color}08)`,
                    boxShadow: `0 4px 24px ${meta.color}30`,
                    borderColor: meta.color + "50",
                  }
                : { background: "var(--surface)" }
            }
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
              style={{
                background: isActive ? meta.color + "18" : "var(--bg-muted)",
                color: isActive ? meta.color : "var(--text-muted)",
              }}
            >
              <Icon size={18} strokeWidth={2.25} />
            </span>
            <span
              className="mt-1.5 text-[10px] font-black tracking-wider transition-colors"
              style={{ color: isActive ? meta.color : "var(--text-muted)" }}
            >
              {meta.short}
            </span>
            <span
              className="mt-0.5 text-[7px] font-semibold uppercase tracking-wider transition-colors"
              style={{ color: isActive ? meta.color + "cc" : "var(--text-muted)" }}
            >
              {meta.label}
            </span>
            {isActive && (
              <span
                className="absolute -right-[3px] top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-full shadow-sm"
                style={{ backgroundColor: meta.color }}
              />
            )}
          </button>
        );
      })}

      <div className="mt-auto flex flex-col items-center gap-2.5 px-2 text-center">
        <div className="h-px w-10 bg-[var(--border)]" />
        <Layers size={14} className="text-[var(--text-muted)]" />
        <span className="text-[8px] font-medium leading-tight text-[var(--text-muted)]">
          {phases.length} phases
          <br />
          21 modules
        </span>
      </div>
    </aside>
  );
}
