"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function NonValidatorDashboardPage() {
  return (
    <DashboardShell role="non-validator" title="General User Hub">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold text-[var(--text)]">Developer Program</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Build blockchain skills across 21 modules. Upon enrollment, fractional MST
          Validator participation may be allocated for ecosystem participation.
        </p>
      </section>
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold text-[var(--text)]">Start Building</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Open the learning tree to begin Phase 1 and progress through hands on
          assessments and live coding challenges.
        </p>
      </section>
    </DashboardShell>
  );
}
