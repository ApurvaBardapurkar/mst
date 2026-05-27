"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Loader2,
  ClipboardCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import type { SubmoduleMeta } from "@/lib/types";
import { stripEmojis } from "@/lib/strip-emojis";
import { getCardSubmoduleTitle } from "@/lib/display-titles";

function cleanLessonHtml(html: string): string {
  return stripEmojis(html)
    .replace(/<p>\s*[-–—]\s+/g, "<p>• ")
    .replace(/<li>\s*[-–—]\s+/g, "<li>")
    .replace(/>\s*-\s{2,}/g, "> ")
    .replace(/<p>\s*[-–—]\s*/g, "<p>")
    .replace(/<br\s*\/?>\s*[-–—]\s+/g, "<br>• ");
}

interface LessonContentPanelProps {
  moduleId: number;
  slug: string;
  onClose: () => void;
}

export function LessonContentPanel({
  moduleId,
  slug,
  onClose,
}: LessonContentPanelProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [submodule, setSubmodule] = useState<SubmoduleMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/lesson/${moduleId}/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load lesson");
        return res.json();
      })
      .then((data: { html: string; submodule: SubmoduleMeta }) => {
        if (cancelled) return;
        setHtml(data.html);
        setSubmodule(data.submodule);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load lesson content.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [moduleId, slug]);

  const title = submodule
    ? getCardSubmoduleTitle(submodule.title)
    : "Lesson";

  return (
    <div className="learn-content-panel flex h-full flex-col border-l border-[var(--border)] bg-[var(--surface)] shadow-2xl">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mst-red">
            Module {moduleId}
          </p>
          <h2 className="truncate text-sm font-extrabold text-[var(--text)] sm:text-base">
            {stripEmojis(title)}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href={`/module/${moduleId}/${slug}`}
            className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[10px] font-bold text-[var(--text-muted)] transition hover:border-mst-red/30 hover:text-mst-red"
          >
            <ExternalLink size={12} />
            Full page
          </Link>
          {submodule?.hasAssessment && (
            <Link
              href={`/module/${moduleId}/${slug}/assessment`}
              className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-[10px] font-bold text-blue-600 transition hover:bg-blue-500/20"
            >
              <ClipboardCheck size={12} />
              Assessment
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
            aria-label="Close lesson"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 size={28} className="animate-spin text-mst-red" />
            <p className="text-sm text-[var(--text-muted)]">Loading lesson…</p>
          </div>
        )}
        {error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
        {html && !loading && (
          <article
            className="lesson-content prose-lesson max-w-none"
            dangerouslySetInnerHTML={{ __html: cleanLessonHtml(html) }}
          />
        )}
      </div>

      {html && !loading && (
        <div className="shrink-0 border-t border-[var(--border)] px-4 py-3 sm:px-5">
          <Link
            href={`/module/${moduleId}/${slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-mst-red px-4 py-2.5 text-sm font-bold text-white transition hover:bg-mst-red/90"
          >
            Continue in full lesson view
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
