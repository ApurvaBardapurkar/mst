import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LessonViewer } from "@/components/lesson/LessonViewer";
import { getCurriculum, getModule, getSubmodule } from "@/lib/curriculum";
import { getLessonHtml } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id, slug } = await params;
  const moduleId = parseInt(id, 10);
  const mod = getModule(moduleId);
  const submodule = getSubmodule(moduleId, slug);
  if (!mod || !submodule) return { title: "Lesson Not Found" };

  return {
    title: `${submodule.id}: ${submodule.title} — Module ${mod.id}`,
    description: submodule.subtitle || `Lesson ${submodule.id} of Module ${mod.id}: ${mod.title}. Part of the Masterstroke Academy blockchain developer program.`,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;
  const moduleId = parseInt(id, 10);
  const mod = getModule(moduleId);
  const submodule = getSubmodule(moduleId, slug);
  if (!mod || !submodule) notFound();

  const html = getLessonHtml(moduleId, slug);
  if (!html) notFound();

  const idx = mod.submodules.findIndex((s) => s.slug === slug);
  const prevSlug = idx > 0 ? mod.submodules[idx - 1].slug : undefined;
  const nextSlug =
    idx < mod.submodules.length - 1 ? mod.submodules[idx + 1].slug : undefined;

  const curriculum = getCurriculum();
  const allModuleIds = curriculum.modules.map((m) => m.id);
  const moduleSlugMap: Record<number, string[]> = {};
  for (const m of curriculum.modules) {
    moduleSlugMap[m.id] = m.submodules.map((s) => s.slug);
  }

  return (
    <LessonViewer
      moduleId={moduleId}
      mod={mod}
      submodule={submodule}
      html={html}
      prevSlug={prevSlug}
      nextSlug={nextSlug}
      phaseId={mod.phaseId}
      allModuleIds={allModuleIds}
      moduleSlugMap={moduleSlugMap}
    />
  );
}
