import { notFound } from "next/navigation";
import { LessonViewer } from "@/components/lesson/LessonViewer";
import { getCurriculum, getModule, getSubmodule } from "@/lib/curriculum";
import { getLessonHtml } from "@/lib/content";

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

  return (
    <LessonViewer
      moduleId={moduleId}
      mod={mod}
      submodule={submodule}
      html={html}
      prevSlug={prevSlug}
      nextSlug={nextSlug}
      phaseId={mod.phaseId}
    />
  );
}
