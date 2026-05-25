"use client";

import { isAdminUser } from "./auth";

export type ModuleStatus = "locked" | "active" | "completed";

function adminBypass(): boolean {
  if (typeof window === "undefined") return false;
  return isAdminUser();
}

export interface SubmoduleProgress {
  lessonComplete: boolean;
  assessmentComplete: boolean;
  score?: number;
  maxScore?: number;
  passed?: boolean;
  completedAt?: string;
}

const PREFIX = "mst-academy-";

function key(path: string) {
  return `${PREFIX}${path}`;
}

export function getSubmoduleProgress(
  moduleId: number,
  slug: string
): SubmoduleProgress {
  if (typeof window === "undefined") {
    return { lessonComplete: false, assessmentComplete: false };
  }
  try {
    const raw = localStorage.getItem(key(`sub-${moduleId}-${slug}`));
    if (!raw) return { lessonComplete: false, assessmentComplete: false };
    return JSON.parse(raw) as SubmoduleProgress;
  } catch {
    return { lessonComplete: false, assessmentComplete: false };
  }
}

export function saveSubmoduleProgress(
  moduleId: number,
  slug: string,
  data: Partial<SubmoduleProgress>
) {
  const current = getSubmoduleProgress(moduleId, slug);
  localStorage.setItem(
    key(`sub-${moduleId}-${slug}`),
    JSON.stringify({ ...current, ...data })
  );
}

export function markLessonComplete(moduleId: number, slug: string) {
  saveSubmoduleProgress(moduleId, slug, {
    lessonComplete: true,
    completedAt: new Date().toISOString(),
  });
}

export function markAssessmentComplete(
  moduleId: number,
  slug: string,
  score: number,
  maxScore: number,
  passed: boolean
) {
  saveSubmoduleProgress(moduleId, slug, {
    assessmentComplete: true,
    lessonComplete: true,
    score,
    maxScore,
    passed,
    completedAt: new Date().toISOString(),
  });
}

export function getActivePhaseId(): string {
  if (typeof window === "undefined") return "phase-1";
  return localStorage.getItem(key("active-phase")) || "phase-1";
}

export function setActivePhaseId(phaseId: string) {
  localStorage.setItem(key("active-phase"), phaseId);
}

export function isModuleFullyComplete(
  moduleId: number,
  submoduleSlugs: string[]
): boolean {
  if (!submoduleSlugs.length) return false;
  return submoduleSlugs.every((slug) => {
    const p = getSubmoduleProgress(moduleId, slug);
    return p.lessonComplete && p.assessmentComplete;
  });
}

export function getGlobalActiveModuleId(
  allModuleIds: number[],
  getSlugs: (id: number) => string[]
): number {
  const sorted = [...allModuleIds].sort((a, b) => a - b);
  for (const id of sorted) {
    if (!isModuleFullyComplete(id, getSlugs(id))) return id;
  }
  return sorted[sorted.length - 1] ?? 1;
}

export function getModuleStatus(
  moduleId: number,
  allModuleIds: number[],
  submoduleSlugs: string[],
  getSlugs: (id: number) => string[]
): ModuleStatus {
  if (adminBypass()) {
    if (isModuleFullyComplete(moduleId, submoduleSlugs)) return "completed";
    return "active";
  }
  const activeId = getGlobalActiveModuleId(allModuleIds, getSlugs);
  if (isModuleFullyComplete(moduleId, submoduleSlugs)) return "completed";
  if (moduleId === activeId) return "active";
  if (moduleId < activeId) return "completed";
  return "locked";
}

export function isSubmoduleLocked(
  moduleLocked: boolean,
  subIndex: number,
  moduleId: number,
  submodules: { slug: string }[]
): boolean {
  if (adminBypass()) return false;
  if (moduleLocked) return true;
  if (subIndex === 0) return false;
  const prev = getSubmoduleProgress(
    moduleId,
    submodules[subIndex - 1].slug
  );
  return !prev.assessmentComplete;
}

export function getModuleProgressPercent(
  moduleId: number,
  submoduleSlugs: string[]
): number {
  if (!submoduleSlugs.length) return 0;
  let done = 0;
  for (const slug of submoduleSlugs) {
    const p = getSubmoduleProgress(moduleId, slug);
    if (p.lessonComplete) done += 0.5;
    if (p.assessmentComplete) done += 0.5;
  }
  return Math.round((done / submoduleSlugs.length) * 100);
}

export const PASS_THRESHOLD = 75;
