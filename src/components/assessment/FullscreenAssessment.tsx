"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { Assessment, AssessmentQuestion, UserAnswer } from "@/lib/types";
import { scoreAssessment } from "@/lib/scoring";
import { markAssessmentComplete, PASS_THRESHOLD } from "@/lib/progress";
import { CodingWorkspace } from "./CodingWorkspace";

// Intelligent coding question detector checking marks and file/script references
function isCodingQuestion(q: AssessmentQuestion): boolean {
  if (["coding", "live_coding"].includes(q.type)) {
    return true;
  }
  if (q.type === "other" || q.type === "coding_project") {
    const text = q.text.toLowerCase();
    const hasCodeExtension = text.includes(".sol") || text.includes(".js") || text.includes(".ts") || text.includes(".py") || text.includes(".cpp") || text.includes(".c ");
    const hasCodingKeywords = text.includes("smart contract") || text.includes("deployment script") || text.includes("test suite") || text.includes("react frontend") || text.includes("solidity contract");
    return q.marks >= 3 && (hasCodeExtension || hasCodingKeywords);
  }
  return false;
}

// Calculate question-specific timer in seconds
function getQuestionTimeLimit(q: AssessmentQuestion): number {
  if ((q as any).timeLimit) {
    const limit = (q as any).timeLimit;
    if (typeof limit === "number") return limit;
    if (typeof limit === "string") {
      if (limit.endsWith("m")) return parseInt(limit) * 60;
      if (limit.endsWith("s")) return parseInt(limit);
      return parseInt(limit) * 60;
    }
  }

  const type = q.type;
  const diff = (q.difficulty || "medium").toLowerCase();

  if (type === "mcq" || type === "true_false" || type === "true_false_justification") {
    if (diff === "easy" || diff === "required") return 30;
    if (diff === "hard") return 60;
    return 45; // medium
  }

  if (type === "descriptive") {
    if (diff === "easy" || diff === "required") return 5 * 60;
    if (diff === "hard") return 10 * 60;
    return 7 * 60; // medium
  }

  if (isCodingQuestion(q)) {
    if (diff === "easy") return 20 * 60; // 20 mins
    if (diff === "hard") return 45 * 60; // 45 mins
    return 30 * 60; // 30 mins (medium)
  }

  // default / assignment / other
  return 10 * 60; // 10 minutes per question
}

interface FullscreenAssessmentProps {
  moduleId: number;
  subSlug: string;
  submoduleId: string;
  submoduleTitle: string;
  assessment: Assessment;
}

export function FullscreenAssessment({
  moduleId,
  subSlug,
  submoduleId,
  submoduleTitle,
  assessment,
}: FullscreenAssessmentProps) {
  const questions = assessment.questions;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [startedAt] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  const current = questions[index];
  const storageKey = `mst-assessment-draft-${moduleId}-${subSlug}`;

  // Time limit for the entire assessment is capped to 45 minutes for project/assignment assessments
  const [totalTimeLimit] = useState(() => {
    const hasProjectQuestion = questions.some(
      q => q.marks >= 3 && (q.type === "other" || q.type === "coding_project")
    );
    if (hasProjectQuestion) {
      return 45 * 60; // 45 minutes total (2700 seconds) for project submissions
    }
    return questions.reduce((acc, q) => acc + getQuestionTimeLimit(q), 0);
  });

  const timeLeft = Math.max(0, totalTimeLimit - elapsed);

  // Load draft answers from sessionStorage
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem(storageKey);
      if (draft) {
        const { answers: a, index: i } = JSON.parse(draft);
        if (a) setAnswers(a);
        if (typeof i === "number") setIndex(i);
      }
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  // Save draft answers to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({ answers, index })
    );
  }, [answers, index, storageKey]);

  // Keep track of elapsed time
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  const setAnswer = useCallback(
    (q: AssessmentQuestion, value: string, selectedKey?: string, codingResults?: any) => {
      setAnswers((prev) => ({
        ...prev,
        [q.id]: { questionId: q.id, value, selectedKey, codingResults },
      }));
    },
    []
  );

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const handleSubmit = useCallback(() => {
    const answerList = Object.values(answers);
    const { results, totalEarned, totalMax } = scoreAssessment(
      questions,
      answerList
    );
    const pct = Math.round((totalEarned / totalMax) * 100);
    const passed = pct >= PASS_THRESHOLD;
    const durationSec = Math.floor((Date.now() - startedAt) / 1000);

    // Calculate attempted and skipped count
    const attempted = answerList.filter(a => a.value.trim().length > 0 || a.selectedKey).length;
    const skipped = questions.length - attempted;

    markAssessmentComplete(moduleId, subSlug, totalEarned, totalMax, passed);

    const payload = {
      results,
      totalEarned,
      totalMax,
      percentage: pct,
      passed,
      durationSec,
      answers: answerList,
      questions,
      submoduleTitle,
      submoduleId,
      attempted,
      skipped,
      completedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(
      `assessment-${moduleId}-${subSlug}`,
      JSON.stringify(payload)
    );
    sessionStorage.removeItem(storageKey);
    window.location.href = `/module/${moduleId}/${subSlug}/assessment/results`;
  }, [answers, moduleId, questions, startedAt, submoduleId, submoduleTitle, subSlug, storageKey]);

  // Auto-submit when time is up
  useEffect(() => {
    if (totalTimeLimit > 0 && elapsed >= totalTimeLimit) {
      handleSubmit();
    }
  }, [elapsed, totalTimeLimit, handleSubmit]);

  const getLiveScore = useCallback(() => {
    let score = 0;
    questions.forEach((q) => {
      const ans = answers[q.id];
      if (!ans) return;
      if (q.type === "mcq") {
        const correct = (q.correctAnswer || "").toUpperCase().charAt(0);
        const selected = (ans.selectedKey || ans.value || "").toUpperCase().charAt(0);
        if (selected === correct && !!selected) score += q.marks;
      } else if (q.type === "true_false" || q.type === "true_false_justification") {
        const val = ans.value || "";
        const verdict = val.trim().toUpperCase().split("\n")[0];
        const correct = (q.correctAnswer || q.tfVerdict || "").trim().toUpperCase();
        if (verdict === correct && !!verdict) {
          if (q.type === "true_false_justification") {
            const hasJustification = val.split("\n").slice(1).join("").trim().length > 40;
            score += hasJustification ? q.marks : Math.floor(q.marks / 2);
          } else {
            score += q.marks;
          }
        }
      } else if (isCodingQuestion(q)) {
        const codingResults = ans.codingResults;
        if (codingResults && (codingResults.passed + codingResults.failed) > 0) {
          const totalTests = codingResults.passed + codingResults.failed;
          score += Math.round((codingResults.passed / totalTests) * q.marks);
        } else if (ans.value.trim().length > 30) {
          score += q.marks;
        }
      } else if (q.type === "descriptive") {
        const wordCount = ans.value.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount >= 40) score += q.marks;
        else if (wordCount >= 20) score += Math.ceil(q.marks * 0.6);
        else if (wordCount >= 8) score += Math.ceil(q.marks * 0.3);
      } else {
        if (ans.value) score += Math.ceil(q.marks * 0.5);
      }
    });
    return score;
  }, [answers, questions]);

  if (!current) return null;

  const currentAnswer = answers[current.id];
  const progress = ((index + 1) / questions.length) * 100;
  const showScore = (assessment as any).showScore !== false;
  const totalMaxMarks = questions.reduce((s, q) => s + q.marks, 0);

  return (
    <div className="flex h-full flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-250">
      {/* TOP HEADER */}
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg)] px-4 py-4 md:px-6">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mst-red">
            {submoduleId} Assessment
          </p>
          <h1 className="truncate text-base font-black text-[var(--text)] md:text-lg">
            {submoduleTitle}
          </h1>
        </div>
        <div className="flex items-center gap-6">
          {showScore && (
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase text-[var(--text-muted)] font-bold">Live Score</p>
              <p className="text-sm font-black text-mst-red">
                {getLiveScore()} <span className="text-[10px] text-[var(--text-muted)] font-normal">/ {totalMaxMarks}</span>
              </p>
            </div>
          )}
          <div className="text-right">
            <p className="text-[10px] uppercase text-[var(--text-muted)] font-bold">Time Remaining</p>
            <p className={`flex items-center gap-1 font-mono text-sm font-black ${
              timeLeft < 60 ? "text-mst-red animate-pulse" : "text-[var(--text)]"
            }`}>
              <Clock size={14} /> {formatTime(timeLeft)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-[var(--text-muted)] font-bold">Question</p>
            <p className="text-sm font-black text-[var(--text)]">
              {index + 1} <span className="text-[var(--text-muted)] font-normal">of</span>{" "}
              {questions.length}
            </p>
          </div>
          <Link
            href={`/module/${moduleId}/${subSlug}`}
            className="rounded-full p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)] transition"
            title="Exit assessment"
          >
            <X size={20} />
          </Link>
        </div>
      </header>

      {/* DETAILED PROGRESS BAR */}
      <div className="flex items-center gap-3 px-4 py-2 md:px-6 bg-[var(--bg-muted)] border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
        <div className="w-32 bg-[var(--border)] h-2 rounded-full overflow-hidden shrink-0">
          <div
            className="bg-gradient-to-r from-orange-500 to-mst-red h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-semibold text-[var(--text)]">
          {Math.round(progress)}% Complete ({index + 1} of {questions.length} questions)
        </span>
      </div>

      {/* QUESTION BODY OR CODING WORKSPACE */}
      {isCodingQuestion(current) ? (
        <div className="min-h-0 flex-1">
          <CodingWorkspace
            question={current}
            questionIndex={index}
            value={currentAnswer?.value || ""}
            submoduleId={submoduleId}
            onChange={(v, results) => setAnswer(current, v, undefined, results)}
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden bg-[var(--bg)]">
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="mx-auto max-w-3xl">
              {/* Question Metadata Row */}
              <div className="mb-6 flex flex-wrap gap-2 items-center">
                <span className="rounded bg-mst-red/10 px-2.5 py-1 text-xs font-bold text-mst-red uppercase tracking-wider">
                  Q{current.number + 1}
                </span>
                <span className="rounded bg-[var(--bg-muted)] border border-[var(--border)] px-2.5 py-1 text-xs font-semibold capitalize text-[var(--text-muted)]">
                  {current.type.replace(/_/g, " ")}
                </span>
                <span className="rounded bg-[var(--bg-muted)] border border-[var(--border)] px-2.5 py-1 text-xs font-semibold capitalize text-[var(--text-muted)]">
                  {current.difficulty || "Medium"}
                </span>
                <span className="text-xs font-semibold text-[var(--text-muted)] ml-2">
                  {current.marks} mark{current.marks !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Question Text */}
              <div
                className="text-base md:text-lg leading-relaxed text-[var(--text)] font-semibold mb-8"
                dangerouslySetInnerHTML={{ __html: current.text }}
              />

              {/* MCQ Options */}
              {current.type === "mcq" && current.options && (
                <ul className="space-y-3">
                  {current.options.map((opt) => {
                    const sel = currentAnswer?.selectedKey === opt.key;
                    return (
                      <li key={opt.key}>
                        <button
                          type="button"
                          onClick={() => setAnswer(current, opt.text, opt.key)}
                          className={`w-full rounded-xl border-2 px-5 py-4 text-left text-sm transition font-medium ${
                            sel
                              ? "border-mst-red bg-mst-red/10 text-[var(--text)] shadow-sm"
                              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-muted)]"
                          }`}
                        >
                          <span className="mr-3 font-bold text-mst-red">
                            {opt.key}.
                          </span>
                          {opt.text}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* True/False with potential justification */}
              {(current.type === "true_false" ||
                current.type === "true_false_justification") && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    {["TRUE", "FALSE"].map((v) => {
                      const sel = currentAnswer?.value?.startsWith(v);
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            const just =
                              (currentAnswer?.value || "").split("\n---\n")[1] ||
                              "";
                            setAnswer(
                              current,
                              current.type === "true_false_justification"
                                ? `${v}\n---\n${just}`
                                : v,
                              v
                            );
                          }}
                          className={`flex-1 rounded-xl border-2 py-4 font-bold transition text-center ${
                            sel
                              ? "border-mst-red bg-mst-red/15 text-[var(--text)]"
                              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--bg-muted)] hover:border-[var(--border-strong)]"
                          }`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                  {current.type === "true_false_justification" && (
                    <textarea
                      rows={5}
                      placeholder="Mandatory justification (at least 40 characters)…"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-mst-red focus:outline-none"
                      value={
                        (currentAnswer?.value || "").split("\n---\n")[1] || ""
                      }
                      onChange={(e) => {
                        const verdict =
                          (currentAnswer?.value || "").split("\n---\n")[0] ||
                          "";
                        setAnswer(current, `${verdict}\n---\n${e.target.value}`);
                      }}
                    />
                  )}
                </div>
              )}

              {/* Descriptive / Project answers */}
              {(current.type === "descriptive" ||
                current.type === "other" ||
                current.type === "coding_project") &&
                !isCodingQuestion(current) && (
                  <textarea
                    rows={8}
                    placeholder="Type your answer here (minimum 40 words recommended, auto-saved)…"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-mst-red focus:outline-none"
                    value={currentAnswer?.value || ""}
                    onChange={(e) => setAnswer(current, e.target.value)}
                  />
                )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CONTROLS */}
      <footer className="flex shrink-0 items-center justify-between border-t border-[var(--border)] bg-[var(--bg)] px-4 py-4 md:px-8">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition disabled:opacity-30"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <Link
          href={`/module/${moduleId}/${subSlug}`}
          className="text-xs font-semibold text-[var(--text-muted)] hover:text-mst-red transition"
        >
          Save & exit lesson
        </Link>

        {index < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="inline-flex items-center gap-1.5 rounded-full bg-mst-red hover:bg-mst-red-dark px-6 py-2.5 text-sm font-bold text-white transition"
          >
            Continue <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-mst-red hover:bg-mst-red-dark px-8 py-2.5 text-sm font-bold text-white transition"
          >
            Submit Assessment
          </button>
        )}
      </footer>
    </div>
  );
}
