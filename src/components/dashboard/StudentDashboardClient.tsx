"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import type { Curriculum, ModuleMeta } from "@/lib/types";
import {
  getSubmoduleProgress,
  getModuleProgressPercent,
  isModuleFullyComplete,
  getModuleStatus,
  getGlobalActiveModuleId,
} from "@/lib/progress";
import { canAccessDashboard, roleLabel } from "@/lib/auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  BookOpen,
  Award,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Zap,
  Trophy,
  Brain,
  LogOut,
  TreePine,
  ClipboardCheck,
  LayoutDashboard,
  User,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Phase metadata                                                     */
/* ------------------------------------------------------------------ */

const PHASE_META: Record<string, { icon: typeof BookOpen; color: string }> = {
  "phase-1": { icon: BookOpen, color: "#3b82f6" },
  "phase-2": { icon: Zap, color: "#8b5cf6" },
  "phase-3": { icon: Brain, color: "#f59e0b" },
  "phase-4": { icon: Trophy, color: "#10b981" },
};

const PHASE_BAR_BG: Record<string, string> = {
  "phase-1": "bg-blue-500",
  "phase-2": "bg-violet-500",
  "phase-3": "bg-amber-500",
  "phase-4": "bg-emerald-500",
};

const MODULE_PHASE_DOT: Record<string, string> = {
  "phase-1": "bg-blue-400",
  "phase-2": "bg-violet-400",
  "phase-3": "bg-amber-400",
  "phase-4": "bg-emerald-400",
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ComputedStats {
  daysSinceRegistration: number;
  modulesCompleted: number;
  totalModules: number;
  assessmentsPassed: number;
  totalAssessments: number;
  averageScore: number;
  overallProgress: number;
  avgTimePerAssessment: number;
  totalStudyTimeMinutes: number;
  streakDays: number;
  phaseStats: {
    phaseId: string;
    title: string;
    completed: number;
    total: number;
    percent: number;
  }[];
  scoreData: { name: string; score: number; max: number; moduleId: number }[];
  moduleCards: {
    id: number;
    title: string;
    phaseId: string;
    progress: number;
    status: "locked" | "active" | "completed";
  }[];
  lowScoreModules: { id: number; title: string; score: number; max: number }[];
  skippedAssessments: { moduleId: number; title: string; subTitle: string }[];
  recentActivity: {
    label: string;
    type: "lesson" | "assessment";
    score?: number;
    max?: number;
    passed?: boolean;
    completedAt: string;
  }[];
  activeModuleId: number;
}

/* ------------------------------------------------------------------ */
/*  Stat computation                                                   */
/* ------------------------------------------------------------------ */

function computeStats(
  curriculum: Curriculum,
  registeredAt: string
): ComputedStats {
  const { phases, modules } = curriculum;
  const allModuleIds = modules.map((m) => m.id);
  const getSlugs = (id: number) =>
    modules.find((m) => m.id === id)?.submodules.map((s) => s.slug) ?? [];

  const now = Date.now();
  const regDate = new Date(registeredAt).getTime();
  const daysSinceRegistration = Math.max(
    0,
    Math.floor((now - regDate) / 86_400_000)
  );

  let modulesCompleted = 0;
  let assessmentsPassed = 0;
  let totalAssessments = 0;
  let scoreSum = 0;
  let scoredCount = 0;
  let totalSubmodules = 0;
  let completedSubmodules = 0;

  const scoreData: ComputedStats["scoreData"] = [];
  const lowScoreModules: ComputedStats["lowScoreModules"] = [];
  const skippedAssessments: ComputedStats["skippedAssessments"] = [];
  const recentActivity: ComputedStats["recentActivity"] = [];
  const moduleCards: ComputedStats["moduleCards"] = [];

  for (const mod of modules) {
    const slugs = mod.submodules.map((s) => s.slug);
    const progress = getModuleProgressPercent(mod.id, slugs);
    const status = getModuleStatus(mod.id, allModuleIds, slugs, getSlugs);
    if (isModuleFullyComplete(mod.id, slugs)) modulesCompleted++;

    moduleCards.push({
      id: mod.id,
      title: mod.title,
      phaseId: mod.phaseId,
      progress,
      status,
    });

    for (const sub of mod.submodules) {
      totalSubmodules++;
      const p = getSubmoduleProgress(mod.id, sub.slug);

      if (p.lessonComplete) completedSubmodules += 0.5;
      if (p.assessmentComplete) completedSubmodules += 0.5;

      if (sub.hasAssessment) {
        totalAssessments++;
        if (p.assessmentComplete) {
          if (p.passed) assessmentsPassed++;
          if (p.score !== undefined && p.maxScore) {
            const pct = Math.round((p.score / p.maxScore) * 100);
            scoreSum += pct;
            scoredCount++;
            scoreData.push({
              name: `M${mod.id}`,
              score: pct,
              max: 100,
              moduleId: mod.id,
            });
            if (pct < 60) {
              lowScoreModules.push({
                id: mod.id,
                title: mod.title,
                score: p.score,
                max: p.maxScore,
              });
            }
          }
        } else if (status !== "locked") {
          skippedAssessments.push({
            moduleId: mod.id,
            title: mod.title,
            subTitle: sub.title,
          });
        }
      }

      if (p.completedAt) {
        recentActivity.push({
          label: `${mod.title} — ${sub.title}`,
          type: p.assessmentComplete ? "assessment" : "lesson",
          score: p.score,
          max: p.maxScore,
          passed: p.passed,
          completedAt: p.completedAt,
        });
      }
    }
  }

  recentActivity.sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const phaseStats = phases.map((ph) => {
    const phaseModules = modules.filter((m) => m.phaseId === ph.id);
    let completed = 0;
    for (const m of phaseModules) {
      const slugs = m.submodules.map((s) => s.slug);
      if (isModuleFullyComplete(m.id, slugs)) completed++;
    }
    return {
      phaseId: ph.id,
      title: ph.title,
      completed,
      total: phaseModules.length,
      percent:
        phaseModules.length > 0
          ? Math.round((completed / phaseModules.length) * 100)
          : 0,
    };
  });

  const overallProgress =
    totalSubmodules > 0
      ? Math.round((completedSubmodules / totalSubmodules) * 100)
      : 0;

  const activeModuleId = getGlobalActiveModuleId(allModuleIds, getSlugs);

  const AVG_LESSON_READ_MINUTES = 12;
  const AVG_ASSESSMENT_MINUTES = 8;
  const completedLessons = Math.round(completedSubmodules);
  const totalStudyTimeMinutes =
    completedLessons * AVG_LESSON_READ_MINUTES +
    scoredCount * AVG_ASSESSMENT_MINUTES;

  const avgTimePerAssessment =
    scoredCount > 0 ? AVG_ASSESSMENT_MINUTES : 0;

  let streakDays = 0;
  if (recentActivity.length > 0) {
    const sortedDates = [...new Set(
      recentActivity
        .filter((a) => a.completedAt)
        .map((a) => new Date(a.completedAt).toDateString())
    )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (sortedDates.length > 0) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86_400_000).toDateString();
      if (sortedDates[0] === today || sortedDates[0] === yesterday) {
        streakDays = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const prev = new Date(sortedDates[i - 1]).getTime();
          const curr = new Date(sortedDates[i]).getTime();
          if (prev - curr <= 86_400_000 * 1.5) {
            streakDays++;
          } else {
            break;
          }
        }
      }
    }
  }

  return {
    daysSinceRegistration,
    modulesCompleted,
    totalModules: modules.length,
    assessmentsPassed,
    totalAssessments,
    averageScore: scoredCount > 0 ? Math.round(scoreSum / scoredCount) : 0,
    overallProgress,
    avgTimePerAssessment,
    totalStudyTimeMinutes,
    streakDays,
    phaseStats,
    scoreData,
    moduleCards,
    lowScoreModules,
    skippedAssessments,
    recentActivity: recentActivity.slice(0, 10),
    activeModuleId,
  };
}

/* ------------------------------------------------------------------ */
/*  Small reusable pieces                                              */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  emoji,
  gradientFrom = "from-red-500",
  gradientTo = "to-orange-500",
}: {
  icon: typeof BookOpen;
  label: string;
  value: string | number;
  sub?: string;
  emoji?: string;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-[var(--surface)] p-[2px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-30 transition-opacity group-hover:opacity-50`} />
      <div className="relative flex items-start gap-4 rounded-[10px] bg-[var(--surface)] p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-mst-red/15 to-orange-500/10 text-mst-red">
          {emoji ? (
            <span className="text-xl">{emoji}</span>
          ) : (
            <Icon size={20} />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {label}
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[var(--text)]">{value}</p>
          {sub && (
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{sub}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressRing({
  percent,
  size = 80,
  stroke = 7,
}: {
  percent: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const gradientId = `progress-grad-${size}`;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e31e24" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
        opacity={0.3}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000"
        style={{ filter: "drop-shadow(0 0 6px rgba(227, 30, 36, 0.3))" }}
      />
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Not Started":
      "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    "In Progress":
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    Completed:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] ?? ""}`}
    >
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/* ------------------------------------------------------------------ */
/*  Custom tooltip for the bar chart                                   */
/* ------------------------------------------------------------------ */

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-[var(--text)]">{d.name}</p>
      <p className="text-[var(--text-muted)]">Score: {d.score}%</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function StudentDashboardClient({
  curriculum,
}: {
  curriculum: Curriculum;
}) {
  const router = useRouter();
  const { user, ready, logout, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login?role=student");
      return;
    }
    if (!canAccessDashboard("student")) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  const stats = useMemo(() => {
    if (!mounted || !user) return null;
    return computeStats(curriculum, user.registeredAt);
  }, [mounted, user, curriculum]);

  if (!ready || !user || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--text-muted)]">
        Loading…
      </div>
    );
  }

  const firstName = user.fullName.split(" ")[0];

  const activeModule = curriculum.modules.find(
    (m) => m.id === stats.activeModuleId
  );

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* ---- sidebar ---- */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col">
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mst-red text-sm font-bold text-white">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text)]">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-[var(--text-muted)]">
              {roleLabel(user.role === "admin" ? "student" : user.role)}
              {isAdmin && " · Admin"}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <SidebarLink
            href="/dashboard/student"
            icon={LayoutDashboard}
            label="Overview"
            active
          />
          <SidebarLink href="/learn" icon={TreePine} label="Learning Tree" />
          <SidebarLink
            href="/dashboard/student#assessments"
            icon={ClipboardCheck}
            label="Assessments"
          />
          <SidebarLink
            href="/dashboard/student#progress"
            icon={BarChart3}
            label="Progress"
          />
        </nav>

        <div className="space-y-1 border-t border-[var(--border)] px-3 py-4">
          <ThemeToggle className="w-full justify-start gap-2 rounded-lg px-3 py-2 text-sm" />
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ---- main content ---- */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* mobile header */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mst-red text-sm font-bold text-white">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-semibold text-[var(--text)]">
                {user.fullName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="rounded-full border border-[var(--border)] p-2 text-[var(--text-muted)]"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* header */}
          <header className="mb-8">
            <h1 className="text-2xl font-black text-[var(--text)] sm:text-3xl">
              👋 Welcome back, {firstName}!
              {isAdmin && (
                <span className="ml-2 inline-block align-middle rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  Admin
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Here&apos;s your learning progress at a glance.
            </p>
          </header>

          {/* ---- quick stat cards ---- */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon={Clock}
              label="Days Enrolled"
              value={stats.daysSinceRegistration}
              sub={`Since ${new Date(user.registeredAt).toLocaleDateString()}`}
              emoji="📅"
              gradientFrom="from-blue-500"
              gradientTo="to-cyan-500"
            />
            <StatCard
              icon={CheckCircle2}
              label="Modules Done"
              value={`${stats.modulesCompleted}/${stats.totalModules}`}
              emoji="✅"
              gradientFrom="from-emerald-500"
              gradientTo="to-green-500"
            />
            <StatCard
              icon={Award}
              label="Assessments Passed"
              value={`${stats.assessmentsPassed}/${stats.totalAssessments}`}
              emoji="🏅"
              gradientFrom="from-amber-500"
              gradientTo="to-yellow-500"
            />
            <StatCard
              icon={Target}
              label="Average Score"
              value={stats.averageScore > 0 ? `${stats.averageScore}%` : "—"}
              sub={
                stats.averageScore >= 75
                  ? "Above passing threshold"
                  : stats.averageScore > 0
                    ? "Below 60% threshold"
                    : "No assessments taken"
              }
              emoji="🎯"
              gradientFrom="from-purple-500"
              gradientTo="to-violet-500"
            />
          </div>

          {/* ---- additional metrics row ---- */}
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon={Zap}
              label="Streak"
              value={stats.streakDays > 0 ? `${stats.streakDays} day${stats.streakDays > 1 ? "s" : ""}` : "—"}
              sub={stats.streakDays > 0 ? "Keep it going!" : "Start learning today"}
              emoji="🔥"
              gradientFrom="from-orange-500"
              gradientTo="to-red-500"
            />
            <StatCard
              icon={Clock}
              label="Study Time"
              value={
                stats.totalStudyTimeMinutes >= 60
                  ? `${Math.floor(stats.totalStudyTimeMinutes / 60)}h ${stats.totalStudyTimeMinutes % 60}m`
                  : `${stats.totalStudyTimeMinutes}m`
              }
              sub="Estimated total"
              emoji="⏱️"
              gradientFrom="from-teal-500"
              gradientTo="to-cyan-500"
            />
            <StatCard
              icon={Clock}
              label="Avg per Assessment"
              value={stats.avgTimePerAssessment > 0 ? `~${stats.avgTimePerAssessment}m` : "—"}
              sub={stats.avgTimePerAssessment > 0 ? "Per assessment" : "No data yet"}
              emoji="📝"
              gradientFrom="from-indigo-500"
              gradientTo="to-blue-500"
            />
            <StatCard
              icon={TrendingUp}
              label="Completion"
              value={`${stats.overallProgress}%`}
              sub={`${stats.modulesCompleted} of ${stats.totalModules} modules`}
              emoji="📊"
              gradientFrom="from-rose-500"
              gradientTo="to-pink-500"
            />
          </div>

          {/* ---- overall progress ---- */}
          <section className="group relative mt-8 overflow-hidden rounded-2xl bg-[var(--surface)] p-[2px] transition-all hover:shadow-lg">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-mst-red via-orange-500 to-yellow-500 opacity-20 transition-opacity group-hover:opacity-35" />
            <div className="relative rounded-[14px] bg-[var(--surface)] p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative flex items-center justify-center">
                  <ProgressRing percent={stats.overallProgress} size={110} stroke={9} />
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-[var(--text)]">
                      {stats.overallProgress}%
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Complete
                    </span>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="flex items-center justify-center gap-2 text-lg font-bold text-[var(--text)] sm:justify-start">
                    <span>🎓</span> Overall Progress
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {stats.modulesCompleted === stats.totalModules
                      ? "🎉 Congratulations! You've completed all modules."
                      : `You've completed ${stats.modulesCompleted} of ${stats.totalModules} modules. Keep going! 💪`}
                  </p>
                  <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[var(--border)]/30">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-mst-red via-orange-500 to-yellow-500 transition-all duration-1000"
                      style={{ width: `${stats.overallProgress}%` }}
                    />
                  </div>
                  {stats.streakDays > 0 && (
                    <p className="mt-2 text-xs font-medium text-orange-500">
                      🔥 {stats.streakDays}-day streak! Keep learning daily.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ---- phase progress ---- */}
          <section className="mt-8" id="progress">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--text)]">
              <span>📈</span>
              Phase Progress
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.phaseStats.map((ph) => {
                const meta = PHASE_META[ph.phaseId] ?? PHASE_META["phase-1"];
                const Icon = meta.icon;
                const barClass =
                  PHASE_BAR_BG[ph.phaseId] ?? "bg-gray-500";
                const statusLabel =
                  ph.completed === 0
                    ? "Not Started"
                    : ph.completed === ph.total
                      ? "Completed"
                      : "In Progress";
                const phaseEmojis: Record<string, string> = {
                  "phase-1": "🌐", "phase-2": "⚡", "phase-3": "🚀", "phase-4": "🎯",
                };
                return (
                  <div
                    key={ph.phaseId}
                    className="group relative overflow-hidden rounded-xl p-[1.5px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div
                      className="absolute inset-0 rounded-xl opacity-25 transition-opacity group-hover:opacity-45"
                      style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}60)` }}
                    />
                    <div className="relative rounded-[10px] bg-[var(--surface)] p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{ background: meta.color + "18" }}
                          >
                            <span className="text-lg">{phaseEmojis[ph.phaseId] || "📘"}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--text)]">
                              {ph.phaseId
                                .replace("phase-", "Phase ")
                                .toUpperCase()}
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-muted)]">
                              {ph.title}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={statusLabel} />
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                          <span>
                            {ph.completed}/{ph.total} modules
                          </span>
                          <span className="font-semibold">{ph.percent}%</span>
                        </div>
                        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--border)]/30">
                          <div
                            className={`h-full rounded-full ${barClass} transition-all duration-700`}
                            style={{ width: `${ph.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---- performance chart ---- */}
          {stats.scoreData.length > 0 && (
            <section className="mt-8" id="assessments">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--text)]">
                <span>📊</span>
                Assessment Scores
              </h2>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={stats.scoreData}
                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "var(--text-muted-raw, #888)", fontSize: 12 }}
                      axisLine={{ stroke: "var(--border)" }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: "var(--text-muted-raw, #888)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--border)", opacity: 0.3 }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {stats.scoreData.map((d, i) => (
                        <Cell
                          key={i}
                          fill={d.score >= 60 ? "#10b981" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
                  Green = passed (≥60%) · Red = needs review
                </p>
              </div>
            </section>
          )}

          {/* ---- module progress grid ---- */}
          <section className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--text)]">
              <span>📚</span>
              Module Progress
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {stats.moduleCards.map((mc) => {
                const dotClass =
                  MODULE_PHASE_DOT[mc.phaseId] ?? "bg-gray-400";
                const borderGradient =
                  mc.status === "completed"
                    ? "from-emerald-500 to-green-500"
                    : mc.status === "active"
                      ? "from-mst-red to-orange-500"
                      : "from-gray-400 to-gray-500";
                return (
                  <Link
                    key={mc.id}
                    href={`/learn#module-${mc.id}`}
                    className="group relative overflow-hidden rounded-xl p-[1.5px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${borderGradient} opacity-30 transition-opacity group-hover:opacity-60`} />
                    <div className="relative rounded-[10px] bg-[var(--surface)] p-4">
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-block h-2.5 w-2.5 rounded-full ${dotClass}`}
                        />
                        {mc.status === "completed" ? (
                          <CheckCircle2
                            size={16}
                            className="text-emerald-500"
                          />
                        ) : mc.status === "active" ? (
                          <Zap size={16} className="text-amber-500" />
                        ) : (
                          <Clock size={16} className="text-[var(--text-muted)]" />
                        )}
                      </div>
                      <p className="mt-2 text-xs font-bold text-[var(--text-muted)]">
                        Module {mc.id}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-tight text-[var(--text)]">
                        {mc.title}
                      </p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            mc.status === "completed"
                              ? "bg-gradient-to-r from-green-400 to-emerald-500"
                              : "bg-gradient-to-r from-mst-red to-orange-500"
                          }`}
                          style={{ width: `${mc.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-right text-[10px] font-medium text-[var(--text-muted)]">
                        {mc.progress}%
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ---- areas of improvement ---- */}
          {(stats.lowScoreModules.length > 0 ||
            stats.skippedAssessments.length > 0) && (
            <section className="mt-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--text)]">
                <span>⚠️</span>
                Areas of Improvement
              </h2>
              <div className="space-y-3">
                {stats.lowScoreModules.map((m, idx) => (
                  <div
                    key={`low-${m.id}-${idx}`}
                    className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
                  >
                    <AlertTriangle
                      size={18}
                      className="shrink-0 text-amber-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--text)]">
                        Review Module {m.id} — scored{" "}
                        {Math.round((m.score / m.max) * 100)}%
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {m.title} · {m.score}/{m.max} marks
                      </p>
                    </div>
                    <Link
                      href={`/learn#module-${m.id}`}
                      className="shrink-0 text-xs font-semibold text-mst-red hover:underline"
                    >
                      Revisit
                    </Link>
                  </div>
                ))}
                {stats.skippedAssessments.slice(0, 5).map((s, i) => (
                  <div
                    key={`skip-${i}`}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
                  >
                    <ClipboardCheck
                      size={18}
                      className="shrink-0 text-[var(--text-muted)]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--text)]">
                        Assessment not taken
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Module {s.moduleId}: {s.subTitle}
                      </p>
                    </div>
                    <Link
                      href={`/learn#module-${s.moduleId}`}
                      className="shrink-0 text-xs font-semibold text-mst-red hover:underline"
                    >
                      Take Now
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ---- recent activity ---- */}
          {stats.recentActivity.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--text)]">
                <span>🕐</span>
                Recent Activity
              </h2>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                {stats.recentActivity.map((a, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 px-5 py-4 ${
                      i !== 0
                        ? "border-t border-[var(--border)]"
                        : ""
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        a.type === "assessment"
                          ? "bg-violet-500/10 text-violet-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {a.type === "assessment" ? (
                        <Award size={14} />
                      ) : (
                        <BookOpen size={14} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--text)]">
                        {a.label}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        {formatDate(a.completedAt)}
                        {a.type === "assessment" &&
                          a.score !== undefined &&
                          a.max !== undefined && (
                            <>
                              {" · "}
                              <span
                                className={
                                  a.passed
                                    ? "text-emerald-500"
                                    : "text-red-500"
                                }
                              >
                                {a.score}/{a.max} (
                                {Math.round((a.score / a.max) * 100)}%)
                              </span>
                            </>
                          )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ---- quick actions ---- */}
          <section className="mt-8 pb-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--text)]">
              <span>⚡</span>
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              {activeModule && (
                <Link
                  href={`/learn#module-${activeModule.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-mst-red px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  Continue Learning — Module {activeModule.id}
                  <ArrowRight size={16} />
                </Link>
              )}
              {stats.lowScoreModules.length > 0 && (
                <Link
                  href={`/learn#module-${stats.lowScoreModules[0].id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-mst-red/50"
                >
                  <AlertTriangle size={16} className="text-amber-500" />
                  Retake Failed Assessment
                </Link>
              )}
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-mst-red/50"
              >
                <TreePine size={16} className="text-emerald-500" />
                View Learning Tree
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar link                                                       */
/* ------------------------------------------------------------------ */

function SidebarLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: typeof BookOpen;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-mst-red/10 text-mst-red"
          : "text-[var(--text-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
      }`}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}
