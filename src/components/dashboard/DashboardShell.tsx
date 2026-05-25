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

const DASHBOARD_LINKS: { role: UserRole; href: string; label: string }[] = [
  { role: "student", href: "/dashboard/student", label: "Student" },
  { role: "validator", href: "/dashboard/validator", label: "Validator" },
  { role: "non-validator", href: "/dashboard/non-validator", label: "General User" },
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
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-[var(--text-muted)]">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-mst-red">
            {roleLabel(role)} Dashboard
            {isAdmin && (
              <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-700 dark:text-amber-300">
                Admin Access
              </span>
            )}
          </p>
          <h1 className="mt-2 text-3xl font-black text-[var(--text)]">{title}</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Signed in as {user.fullName} ({user.email})
          </p>
        </div>
        <ThemeToggle />
      </div>

      {isAdmin && (
        <nav className="mt-6 flex flex-wrap gap-2">
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

      <div className="mt-8 space-y-6">{children}</div>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-[var(--border)] pt-8">
        <Link
          href="/learn"
          className="rounded-full bg-mst-red px-6 py-2.5 text-sm font-semibold text-white"
        >
          Open Learning Tree
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm text-[var(--text)]"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
