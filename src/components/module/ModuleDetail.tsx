"use client";

import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle, ChevronRight } from "lucide-react";
import type { ModuleMeta, Phase } from "@/lib/types";
import {
  getSubmoduleProgress,
  getModuleProgressPercent,
  getModuleStatus,
  isSubmoduleLocked,
} from "@/lib/progress";
import { getCardSubmoduleTitle } from "@/lib/display-titles";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export function ModuleDetail({
  mod,
  phase,
  allModuleIds,
  moduleSlugMap,
}: {
  mod: ModuleMeta;
  phase?: Phase;
  allModuleIds: number[];
  moduleSlugMap: Record<number, string[]>;
}) {
  const getSlugs = (id: number) => moduleSlugMap[id] ?? [];
  const { isAdmin, ready: authReady } = useAuth();
  const [, setRefresh] = useState(0);
  useEffect(() => {
    if (authReady) setRefresh((n) => n + 1);
  }, [authReady, isAdmin]);

  const slugs = mod.submodules.map((s) => s.slug);
  const progress = getModuleProgressPercent(mod.id, slugs);
  const status = getModuleStatus(mod.id, allModuleIds, slugs, getSlugs);
  const locked = status === "locked";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/learn"
          className="text-[var(--text-muted)] hover:text-mst-red"
        >
          ← Back to Phase
        </Link>
        <ChevronRight size={14} className="text-[var(--text-muted)]" />
        <span className="text-mst-red">Module {mod.id}</span>
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-mst-red">
        {phase?.title}
      </p>
      <h1 className="mt-2 text-3xl font-black text-[var(--text)]">
        {mod.title}
      </h1>
      <p className="mt-2 text-[var(--text-muted)]">{mod.description}</p>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--text)]">
            Module Progress
          </span>
          <span className="text-2xl font-black text-mst-red">{progress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--bg-muted)]">
          <div
            className="h-full bg-mst-red transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {locked && (
          <p className="mt-3 flex items-center gap-2 text-sm text-amber-600">
            <Lock size={16} /> Complete previous modules to unlock
          </p>
        )}
      </div>

      <h2 className="mt-10 text-lg font-bold text-[var(--text)]">
        Submodules
      </h2>
      <ol className="mt-4 space-y-3">
        {mod.submodules.map((sub, i) => {
          const p = getSubmoduleProgress(mod.id, sub.slug);
          const done = p.lessonComplete && p.assessmentComplete;
          const subLocked = isSubmoduleLocked(
            locked,
            i,
            mod.id,
            mod.submodules
          );

          return (
            <li
              key={sub.slug}
              className={`rounded-xl border p-4 transition ${
                subLocked
                  ? "border-[var(--border)] bg-[var(--bg-muted)] opacity-50"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-mst-red/40 hover:shadow-md"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mst-red/15 text-xs font-bold text-mst-red">
                    {sub.id}
                  </span>
                  <div>
                    <h3 className="font-bold text-[var(--text)]">
                      {getCardSubmoduleTitle(sub.title)}
                    </h3>
                    {sub.subtitle && (
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">
                        {sub.subtitle}
                      </p>
                    )}
                    {sub.hasAssessment && (
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Assessment · {sub.totalMarks} marks
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {done && (
                    <CheckCircle2 className="text-green-500" size={22} />
                  )}
                  {!subLocked && (
                    <>
                      <Link
                        href={`/module/${mod.id}/${sub.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border-2 border-[var(--text)] bg-transparent px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--bg-muted)]"
                      >
                        <PlayCircle size={14} /> Lesson
                      </Link>
                      {sub.hasAssessment && (
                        <Link
                          href={`/module/${mod.id}/${sub.slug}/assessment`}
                          className="rounded-full bg-mst-red px-4 py-2 text-xs font-semibold text-white"
                        >
                          Assessment
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/learn"
          className="rounded-full border border-[var(--border)] px-5 py-2 text-sm text-[var(--text)]"
        >
          Back to Learning Tree
        </Link>
        {mod.submodules[0] && !locked && (
          <Link
            href={`/module/${mod.id}/${mod.submodules[0].slug}`}
            className="rounded-full bg-mst-red px-5 py-2 text-sm font-semibold text-white"
          >
            Resume Learning
          </Link>
        )}
      </div>
    </div>
  );
}
