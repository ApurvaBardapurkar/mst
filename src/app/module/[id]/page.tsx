import { notFound } from "next/navigation";
import { ModuleDetail } from "@/components/module/ModuleDetail";
import { getCurriculum, getModule } from "@/lib/curriculum";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const moduleId = parseInt(id, 10);
  const mod = getModule(moduleId);
  if (!mod) notFound();

  const curriculum = getCurriculum();
  const phase = curriculum.phases.find((p) => p.id === mod.phaseId);
  const allModuleIds = curriculum.modules.map((m) => m.id);
  const moduleSlugMap = Object.fromEntries(
    curriculum.modules.map((m) => [m.id, m.submodules.map((s) => s.slug)])
  ) as Record<number, string[]>;

  return (
    <ModuleDetail
      mod={mod}
      phase={phase}
      allModuleIds={allModuleIds}
      moduleSlugMap={moduleSlugMap}
    />
  );
}
