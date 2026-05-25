import curriculumData from "@/data/curriculum.json";
import type { Assessment, Curriculum, ModuleMeta, SubmoduleMeta } from "./types";
import fs from "fs";
import path from "path";

const curriculum = curriculumData as Curriculum;

export function getCurriculum(): Curriculum {
  return curriculum;
}

export function getPhases() {
  return curriculum.phases;
}

export function getModule(moduleId: number): ModuleMeta | undefined {
  return curriculum.modules.find((m) => m.id === moduleId);
}

export function getSubmodule(
  moduleId: number,
  subSlug: string
): SubmoduleMeta | undefined {
  const mod = getModule(moduleId);
  return mod?.submodules.find((s) => s.slug === subSlug);
}

export function getAssessment(
  moduleId: number,
  subSlug: string
): Assessment | null {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "assessments",
    String(moduleId),
    `${subSlug}.json`
  );
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Assessment;
}

export function getAllModules(): ModuleMeta[] {
  return curriculum.modules;
}
