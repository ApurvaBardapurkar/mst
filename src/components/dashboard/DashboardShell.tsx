"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  canAccessDashboard,
  roleLabel,
  type UserRole,
} from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  TreePine,
  ClipboardCheck,
  BarChart3,
  LogOut,
  BookOpen,
} from "lucide-react";

const DASHBOARD_LINKS: { role: UserRole; href: string; label: string }[] = [
  { role: "student", href: "/dashboard/student", label: "Student" },
  { role: "validator", href: "/dashboard/validator", label: "Validator" },
  { role: "non-validator", href: "/dashboard/non-validator", label: "General User" },
];

const SIDEBAR_NAV = [
  { href: "/dashboard/student", icon: LayoutDashboard, label: "Overview" },
  { href: "/learn", icon: TreePine, label: "Learning Tree" },
  { href: "/dashboard/student#assessments", icon: ClipboardCheck, label: "Assessments" },
  { href: "/dashboard/student#progress", icon: BarChart3, label: "Progress" },
];

export function DashboardShell({
  role,
  title,
  children,
}: {
  role: UserRole;
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, ready, logout, isAdmin } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(`/login?role=${role}`);
      return;
    }
    if (!canAccessDashboard(role)) {
      router.replace("/login");
    }
  }, [ready, user, role, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--text-muted)]">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* ---- sidebar (desktop) ---- */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col">
        {/* profile */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mst-red text-sm font-bold text-white">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text)]">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-[var(--text-muted)]">
              {roleLabel(role)}
              {isAdmin && " · Admin"}
            </p>
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {SIDEBAR_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === `/dashboard/${role}` ||
              item.href === `/dashboard/${role}#assessments` ||
              item.href === `/dashboard/${role}#progress`;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive && item.href === `/dashboard/${role}`
                    ? "bg-mst-red/10 text-mst-red"
                    : "text-[var(--text-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}

          {isAdmin && (
            <div className="mt-4 space-y-1 border-t border-[var(--border)] pt-4">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Admin Dashboards
              </p>
              {DASHBOARD_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    role === link.role
                      ? "bg-mst-red/10 text-mst-red"
                      : "text-[var(--text-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
                  }`}
                >
                  <BookOpen size={16} />
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* bottom */}
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
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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

          {/* page header */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-mst-red">
              {roleLabel(role)} Dashboard
              {isAdmin && (
                <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-700 dark:text-amber-300">
                  Admin Access
                </span>
              )}
            </p>
            <h1 className="mt-2 text-2xl font-black text-[var(--text)] sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Signed in as {user.fullName} ({user.email})
            </p>
          </div>

          {/* admin nav (mobile) */}
          {isAdmin && (
            <nav className="mb-6 flex flex-wrap gap-2 lg:hidden">
              {DASHBOARD_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    role === link.role
                      ? "bg-mst-red text-white"
                      : "border border-[var(--border)] text-[var(--text)] hover:border-mst-red"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* content */}
          <div className="space-y-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
