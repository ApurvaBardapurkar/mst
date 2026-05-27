"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, ChevronRight, BookOpen, Trophy } from "lucide-react";
import type { Curriculum, SubmoduleMeta } from "@/lib/types";
import {
  getActivePhaseId,
  getModuleStatus,
  getModuleProgressPercent,
  getSubmoduleProgress,
  isSubmoduleLocked,
} from "@/lib/progress";
import { getPhaseMeta } from "@/lib/curriculum-meta";
import { PhaseSidebar } from "./PhaseSidebar";
import { PhaseLearningTree } from "./PhaseLearningTree";
import { LessonContentPanel } from "./LessonContentPanel";
import { getCardSubmoduleTitle } from "@/lib/display-titles";
import { stripEmojis } from "@/lib/strip-emojis";

type TreeStep = "heading" | "modules" | "content";

export function LearnExperience({ curriculum }: { curriculum: Curriculum }) {
  const [mounted, setMounted] = useState(false);
  const [activePhaseId, setActivePhaseId] = useState("phase-1");
  const [treeStep, setTreeStep] = useState<TreeStep>("heading");
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedSubmoduleSlug, setSelectedSubmoduleSlug] = useState<string | null>(
    null
  );

  const allModuleIds = useMemo(
    () => curriculum.modules.map((m) => m.id),
    [curriculum.modules]
  );
  const moduleSlugMap = useMemo(
    () =>
      Object.fromEntries(
        curriculum.modules.map((m) => [m.id, m.submodules.map((s) => s.slug)])
      ) as Record<number, string[]>,
    [curriculum.modules]
  );

  const phaseIndex = curriculum.phases.findIndex((p) => p.id === activePhaseId);
  const phase = curriculum.phases[phaseIndex];
  const meta = getPhaseMeta(activePhaseId, Math.max(0, phaseIndex));
  const PhaseIcon = meta.Icon;

  const phaseMods = useMemo(
    () => curriculum.modules.filter((m) => m.phaseId === activePhaseId),
    [curriculum.modules, activePhaseId]
  );

  const resetTree = useCallback(() => {
    setTreeStep("heading");
    setSelectedModuleId(null);
    setSelectedSubmoduleSlug(null);
  }, []);

  const handlePhaseChange = useCallback(
    (phaseId: string) => {
      setActivePhaseId(phaseId);
      resetTree();
    },
    [resetTree]
  );

  useEffect(() => {
    setMounted(true);
    setActivePhaseId(getActivePhaseId());
  }, []);

  if (!mounted || !phase) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-mst-red" />
          <p className="text-sm font-medium text-[var(--text-muted)]">
            Loading learning tree…
          </p>
        </div>
      </div>
    );
  }

  const selectedModule = selectedModuleId
    ? curriculum.modules.find((m) => m.id === selectedModuleId) ?? null
    : null;
  const selectedModuleSlugs = selectedModule?.submodules.map((s) => s.slug) ?? [];
  const selectedModuleStatus = selectedModule
    ? getModuleStatus(selectedModule.id, allModuleIds, selectedModuleSlugs, (id) => moduleSlugMap[id] ?? [])
    : "locked";
  const selectedModuleProgress = selectedModule
    ? getModuleProgressPercent(selectedModule.id, selectedModuleSlugs)
    : 0;
  const showContent = treeStep === "content" && selectedSubmoduleSlug && selectedModuleId;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[var(--bg)]">
      <PhaseSidebar
        phases={curriculum.phases}
        activePhaseId={activePhaseId}
        onPhaseChange={handlePhaseChange}
      />

      <div
        className={`ml-[72px] flex min-w-0 flex-1 flex-col transition-all duration-500 md:ml-20 ${
          showContent ? "lg:flex-row" : ""
        }`}
      >
        {/* Tree area */}
        <div
          className={`relative flex min-h-0 flex-col ${
            showContent ? "h-full flex-1 lg:max-w-[58%]" : "h-full flex-1"
          }`}
        >
          {/* Top bar */}
          <div className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)]/80 px-4 py-3 backdrop-blur-sm sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  MST Blockchain Program
                </p>
                <h1 className="text-sm font-black text-[var(--text)] sm:text-base">
                  Learning Tree
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <BookOpen size={12} /> {phaseMods.length} modules
                </span>
                <span className="flex items-center gap-1">
                  <Trophy size={12} /> Phase {phaseIndex + 1}
                </span>
              </div>
            </div>

            {treeStep !== "heading" && (
              <button
                type="button"
                onClick={resetTree}
                className="mt-2 text-[11px] font-semibold text-mst-red transition hover:underline"
              >
                ← Back to phase overview
              </button>
            )}
          </div>

          {/* Main canvas */}
          <div className="relative min-h-0 flex-1">
            {treeStep === "heading" && (
              <div className="flex h-full items-center justify-center p-6 sm:p-10">
                <button
                  type="button"
                  onClick={() => setTreeStep("modules")}
                  className={`learn-phase-heading group max-w-2xl w-full overflow-hidden rounded-3xl border-2 p-[2px] text-left transition-all duration-500 hover:shadow-2xl ${meta.borderColor}`}
                  style={{ boxShadow: `0 0 0 0 ${meta.color}00` }}
                >
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${meta.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.12]`}
                  />
                  <div className="relative rounded-[22px] bg-[var(--surface)] px-8 py-10 sm:px-12 sm:py-14">
                    <div className="flex flex-col items-center text-center">
                      <span
                        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}08)`,
                          color: meta.color,
                        }}
                      >
                        <PhaseIcon size={32} strokeWidth={2} />
                      </span>
                      <span
                        className="text-xs font-bold uppercase tracking-[0.2em]"
                        style={{ color: meta.color }}
                      >
                        Phase {phaseIndex + 1} · {meta.label}
                      </span>
                      <h2 className="mt-3 text-xl font-black leading-tight text-[var(--text)] sm:text-2xl md:text-3xl">
                        {phase.title}
                      </h2>
                      <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--text-muted)]">
                        Click to explore {phaseMods.length} modules in this phase.
                        Select a module to view its lessons, then open a lesson to
                        read the content.
                      </p>
                      <span
                        className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition group-hover:gap-3"
                        style={{ background: meta.color }}
                      >
                        Open modules
                        <ChevronRight
                          size={18}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {(treeStep === "modules" || treeStep === "content") && (
              <div className="h-full opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                <PhaseLearningTree
                  curriculum={curriculum}
                  phaseId={activePhaseId}
                  phaseIndex={phaseIndex}
                  allModuleIds={allModuleIds}
                  moduleSlugMap={moduleSlugMap}
                  selectedModuleId={selectedModuleId}
                  onModuleSelect={(id) => {
                    setSelectedModuleId(id);
                    setSelectedSubmoduleSlug(null);
                    setTreeStep("modules");
                  }}
                />
              </div>
            )}

            {treeStep === "content" && !showContent && (
              <div className="flex h-full items-center justify-center p-6">
                <button
                  type="button"
                  onClick={() => setTreeStep("modules")}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:border-mst-red/30 hover:text-mst-red"
                >
                  Return to module tree
                </button>
              </div>
            )}
          </div>

          {treeStep === "modules" && selectedModuleId && !selectedSubmoduleSlug && (
            <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-center text-xs text-[var(--text-muted)] sm:px-6">
              <ChevronDown size={14} className="mx-auto mb-1 animate-bounce text-mst-red" />
              Select a lesson node below the highlighted module to open content
            </div>
          )}
        </div>

        {/* Lesson panel */}
        {selectedModule && !showContent && (
          <div className="flex min-h-[280px] flex-1 flex-col border-l border-[var(--border)] bg-[var(--surface)] lg:max-w-[42%]">
            <div className="border-b border-[var(--border)] px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-mst-red">
                Module {selectedModule.id}
              </p>
              <h2 className="mt-2 text-xl font-black text-[var(--text)]">
                {stripEmojis(selectedModule.title)}
              </h2>
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                {selectedModule.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[13px] text-[var(--text-muted)]">
                <span className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2">
                  {selectedModule.submodules.length} lessons
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2">
                  {selectedModuleProgress}% progress
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2">
                  {selectedModuleStatus === "locked" ? "Locked" : selectedModuleStatus === "active" ? "Active" : "Completed"}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[var(--text)]">Lessons in this module</p>
                  <p className="text-sm text-[var(--text-muted)]">Select a lesson to open the full content panel.</p>
                </div>
              </div>
              <div className="grid gap-3">
                {selectedModule.submodules.map((submodule, index) => {
                  const progress = getSubmoduleProgress(selectedModule.id, submodule.slug);
                  const locked = isSubmoduleLocked(
                    selectedModuleStatus === "locked",
                    index,
                    selectedModule.id,
                    selectedModule.submodules
                  );
                  const done = progress.lessonComplete && progress.assessmentComplete;
                  const title = getCardSubmoduleTitle(submodule.title);
                  return (
                    <button
                      type="button"
                      key={submodule.slug}
                      onClick={() => {
                        if (!locked) {
                          setSelectedSubmoduleSlug(submodule.slug);
                          setTreeStep("content");
                        }
                      }}
                      disabled={locked}
                      className={`flex w-full items-center justify-between gap-3 rounded-3xl border px-4 py-4 text-left transition ${
                        locked
                          ? "cursor-not-allowed border-[var(--border)] bg-[var(--bg)]/80 text-[var(--text-muted)]"
                          : done
                            ? "border-green-500/30 bg-green-500/10 text-[var(--text)] hover:border-green-500/50"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-mst-red/30"
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                          {locked ? "Unlock the previous lesson first" : "Open lesson"}
                        </p>
                      </div>
                      <div className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-bold text-white ${
                        done
                          ? "bg-green-500"
                          : locked
                            ? "bg-[var(--border)] text-[var(--text-muted)]"
                            : "bg-mst-red"
                      }`}>
                        {done ? "Done" : locked ? "Locked" : "Open"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {showContent && (
          <div className="h-[45vh] min-h-[280px] flex-1 lg:h-full lg:max-w-[42%]">
            <LessonContentPanel
              moduleId={selectedModuleId!}
              slug={selectedSubmoduleSlug!}
              onClose={() => {
                setSelectedSubmoduleSlug(null);
                setTreeStep("modules");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
