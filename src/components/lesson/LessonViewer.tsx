"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import type { ModuleMeta, SubmoduleMeta } from "@/lib/types";
import { markLessonComplete } from "@/lib/progress";
import { getLessonDisplayTitle } from "@/lib/display-titles";
import { ThemeToggle } from "@/components/ThemeToggle";

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const lang = language.includes("sol") ? "solidity" : language || "javascript";

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-[var(--border-strong)]">
      <div className="flex items-center justify-between bg-[var(--bg-muted)] px-4 py-2">
        <span className="text-xs font-medium text-[var(--text-muted)]">{lang}</span>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--text-muted)] hover:bg-[var(--surface)]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        customStyle={{ margin: 0, padding: "1.25rem", fontSize: "0.85rem" }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function LessonContent({ html }: { html: string }) {
  const normalizedHtml = html
    .replace(/<p>\s*-\s+/g, "<p>• ")
    .replace(/<li>\s*-\s+/g, "<li>• ");

  const parts = normalizedHtml.split(/(<pre[\s\S]*?<\/pre>)/gi);

  return (
    <div className="lesson-content space-y-6">
      {parts.map((part, i) => {
        const preMatch = part.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
        if (preMatch) {
          const inner = preMatch[1].replace(/<\/?code[^>]*>/gi, "").trim();
          const lang = inner.includes("pragma solidity")
            ? "solidity"
            : inner.includes("function") && inner.includes("{")
              ? "javascript"
              : "text";
          const shouldCollapse = inner.split("\n").length > 8;
          return (
            <details
              key={i}
              open={!shouldCollapse}
              className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] transition-shadow hover:shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)]"
            >
              <summary className="cursor-pointer bg-[var(--bg-muted)] px-5 py-4 text-sm font-semibold text-[var(--text)]">
                {shouldCollapse ? "Show code example" : "Code example"}
                <span className="ml-2 text-xs font-medium text-[var(--text-muted)]">
                  {lang}
                </span>
              </summary>
              <div className="border-t border-[var(--border)] p-4">
                <CodeBlock code={inner} language={lang} />
              </div>
            </details>
          );
        }
        return (
          <div
            key={i}
            className="prose prose-invert max-w-none prose-a:text-mst-red prose-a:underline prose-strong:text-[var(--text)] prose-p:leading-8 prose-p:text-[var(--text-muted)] prose-blockquote:border-l-mst-red prose-blockquote:bg-[rgba(255,115,103,0.06)] prose-blockquote:text-[var(--text)]"
            dangerouslySetInnerHTML={{ __html: part }}
          />
        );
      })}
    </div>
  );
}

interface LessonViewerProps {
  moduleId: number;
  mod: ModuleMeta;
  submodule: SubmoduleMeta;
  html: string;
  prevSlug?: string;
  nextSlug?: string;
  phaseId: string;
}

export function LessonViewer({
  moduleId,
  mod,
  submodule,
  html,
  prevSlug,
  nextSlug,
}: LessonViewerProps) {
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [validToc, setValidToc] = useState(submodule.toc);

  const normalizeText = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[“”"']/g, "")
      .replace(/\s+/g, " ");

  useEffect(() => {
    const t = setTimeout(() => markLessonComplete(moduleId, submodule.slug), 3000);
    return () => clearTimeout(t);
  }, [moduleId, submodule.slug]);

  useEffect(() => {
    const content = document.querySelector(".lesson-content");
    if (!content) return;

    const headings = Array.from(
      content.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ) as HTMLElement[];

    headings.forEach((heading) => {
      heading.style.scrollMarginTop = "5rem";
      heading.style.padding = "0.5rem 0";
      heading.style.transition = "border-color 0.2s ease, background-color 0.2s ease";
      heading.style.borderLeft = "4px solid transparent";
      heading.style.borderRadius = "0.5rem";
    });

    const matchedItems = submodule.toc.filter((item) => {
      const normalizedItem = normalizeText(item.title);
      const match = headings.find((heading) => {
        const headingText = normalizeText(heading.textContent || "");
        return (
          headingText === normalizedItem ||
          headingText.startsWith(normalizedItem) ||
          normalizedItem.startsWith(headingText)
        );
      });
      if (match) {
        match.id = item.id;
        return true;
      }
      return false;
    });

    setValidToc(matchedItems);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target.id) {
          setActiveHeading(visible.target.id);
        }
      },
      {
        rootMargin: "-50% 0px -40% 0px",
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading);
      }
    });

    return () => observer.disconnect();
  }, [submodule.toc, html]);

  useEffect(() => {
    const content = document.querySelector(".lesson-content");
    if (!content) return;

    const headings = Array.from(
      content.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ) as HTMLElement[];

    headings.forEach((heading) => {
      if (!heading.id) return;
      if (heading.id === activeHeading) {
        heading.style.borderLeftColor = "rgb(249 115 22)";
        heading.style.backgroundColor = "rgba(249, 115, 22, 0.08)";
      } else {
        heading.style.borderLeftColor = "transparent";
        heading.style.backgroundColor = "transparent";
      }
    });
  }, [activeHeading]);

  const lessonTitle = getLessonDisplayTitle(submodule.title, submodule.id);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[var(--bg)]">
      <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--sidebar-bg)] lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-5rem)] lg:flex-col lg:overflow-y-auto">
        <div className="border-b border-[var(--border)] p-5">
          <Link
            href="/learn"
            className="text-xs text-[var(--sidebar-text)]/60 hover:text-mst-red"
          >
            ← Phase Tree
          </Link>
          <Link
            href={`/module/${moduleId}`}
            className="mt-2 block text-sm font-bold text-[var(--sidebar-text)] hover:text-mst-red"
          >
            Module {moduleId}
          </Link>
          <span className="mt-2 inline-block rounded-full bg-mst-red/20 px-3 py-1 text-xs font-bold text-mst-red">
            {submodule.id}
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[var(--sidebar-text)]/50">
            Table of Contents
          </p>
          <ul className="space-y-2">
            {validToc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block rounded-2xl border px-3 py-2 text-sm transition ${
                    activeHeading === item.id
                      ? "border-white/20 bg-white/10 text-[var(--text)]"
                      : "border-transparent text-[var(--sidebar-text)]/80 hover:border-white/10 hover:bg-white/5 hover:text-[var(--text)]"
                  }`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2 border-t border-[var(--border)] p-4">
          <Link
            href={`/module/${moduleId}/${submodule.slug}/assessment`}
            className="block w-full rounded-full bg-mst-red py-2.5 text-center text-sm font-semibold text-white"
          >
            Start Assessment
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col bg-[var(--bg-elevated)]">
        <header className="sticky top-16 z-30 flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 lg:px-10">
          <div>
            <div className="text-sm text-[var(--text-muted)]">
              <Link
                href={`/module/${moduleId}`}
                className="text-mst-red hover:underline"
              >
                Module {moduleId}
              </Link>
              <span className="mx-2">/</span>
              <span className="font-medium text-[var(--text)]">
                {submodule.id}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-black text-[var(--text)]">
              {lessonTitle}
            </h1>
            {submodule.subtitle && (
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {submodule.subtitle}
              </p>
            )}
          </div>
          <ThemeToggle />
        </header>

        <article className="flex-1 overflow-y-auto px-4 py-8 lg:px-12 lg:py-10" style={{ scrollBehavior: 'smooth' }}>
          <LessonContent html={html} />
        </article>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 lg:px-10">
          {prevSlug ? (
            <Link
              href={`/module/${moduleId}/${prevSlug}`}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)]"
            >
              <ChevronLeft size={16} /> Previous
            </Link>
          ) : (
            <span />
          )}
          <Link
            href={`/module/${moduleId}/${submodule.slug}/assessment`}
            className="rounded-full bg-mst-red px-6 py-2 text-sm font-semibold text-white"
          >
            Continue to Assessment →
          </Link>
          {nextSlug ? (
            <Link
              href={`/module/${moduleId}/${nextSlug}`}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)]"
            >
              Next <ChevronRight size={16} />
            </Link>
          ) : (
            <Link
              href={`/module/${moduleId}`}
              className="text-sm text-mst-red"
            >
              Back to Module
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
}
