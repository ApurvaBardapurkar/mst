"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/components/AuthProvider";

export default function StudentDashboardPage() {
  const { isAdmin } = useAuth();

  return (
    <DashboardShell role="student" title="Student Hub">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold text-[var(--text)]">Your Learning Path</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Access modules, lessons, and coding assessments from the learning tree.
          {isAdmin &&
            " As demo admin, all phases, modules, and assessments are unlocked."}
        </p>
        <Link
          href="/learn"
          className="mt-4 inline-block text-sm font-semibold text-mst-red hover:underline"
        >
          Go to Learning Tree →
        </Link>
      </section>
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold text-[var(--text)]">Internship Track</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Eligible students who meet assessment criteria may qualify for internship
          opportunities. Complete modules and pass assessments to progress.
        </p>
      </section>
    </DashboardShell>
  );
}
