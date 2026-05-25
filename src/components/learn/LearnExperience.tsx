"use client";

import { useState, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import type { Curriculum } from "@/lib/types";
import { PhaseSidebar } from "./PhaseSidebar";
import { PhaseLearningTree } from "./PhaseLearningTree";
import { getActivePhaseId } from "@/lib/progress";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export function LearnExperience({ curriculum }: { curriculum: Curriculum }) {
  const [activePhaseId, setActivePhaseId] = useState("phase-1");
  const [mounted, setMounted] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    setActivePhaseId(getActivePhaseId());
    setMounted(true);
  }, []);

  const phaseIndex = curriculum.phases.findIndex((p) => p.id === activePhaseId);
  const allModuleIds = curriculum.modules.map((m) => m.id);
  const moduleSlugMap = Object.fromEntries(
    curriculum.modules.map((m) => [m.id, m.submodules.map((s) => s.slug)])
  ) as Record<number, string[]>;
  const activePhase = curriculum.phases[phaseIndex];

  function handlePhaseChange(phaseId: string) {
    if (phaseId === activePhaseId) return;
    setActivePhaseId(phaseId);
    setTransitionKey((k) => k + 1);
  }

  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-[var(--text-muted)]">
        Loading learning path…
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-4rem)] bg-[var(--bg)]">
      <PhaseSidebar
        phases={curriculum.phases}
        activePhaseId={activePhaseId}
        onPhaseChange={handlePhaseChange}
      />

      <div className="ml-[72px] flex flex-1 flex-col md:ml-20">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-mst-red">
              Phase {phaseIndex + 1}
            </p>
            <h1 className="text-lg font-bold text-[var(--text)] md:text-xl">
              {activePhase?.title}
            </h1>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Modules {activePhase?.modules[0]} to{" "}
              {activePhase?.modules[activePhase.modules.length - 1]} · Pan and
              zoom the tree · Click a module to open lessons
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div
          className={`relative flex-1 ${theme === "light" ? "bg-grid" : "bg-grid-dark"}`}
          style={{ backgroundColor: "var(--tree-bg)" }}
        >
          <div key={`${activePhaseId}-${transitionKey}`} className="phase-enter h-full w-full">
            <ReactFlowProvider>
              <PhaseLearningTree
                curriculum={curriculum}
                phaseId={activePhaseId}
                phaseIndex={phaseIndex}
                allModuleIds={allModuleIds}
                moduleSlugMap={moduleSlugMap}
              />
            </ReactFlowProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
