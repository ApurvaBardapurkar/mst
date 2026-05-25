"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function ValidatorDashboardPage() {
  return (
    <DashboardShell role="validator" title="Validator Hub">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold text-[var(--text)]">Validator Area</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Review validator resources, access the full curriculum for testing, and
          explore MST Validator ecosystem tools from the learning tree.
        </p>
      </section>
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold text-[var(--text)]">Curriculum Access</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          All phases and coding assessments are available from the learning tree
          when your account has full access.
        </p>
      </section>
    </DashboardShell>
  );
}
