"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  login,
  roleLabel,
  dashboardPath,
  type UserRole,
} from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import {
  AuthShell,
  FieldLabel,
  SubmitButton,
  TabButton,
  TextInput,
} from "./AuthShell";

const LOGIN_ROLES: { id: UserRole; label: string }[] = [
  { id: "student", label: "Student" },
  { id: "validator", label: "Validator" },
  { id: "non-validator", label: "General User" },
];

export function LoginForm({ initialRole = "student" }: { initialRole?: UserRole }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login(email, password, role);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    refresh();
    if (result.user.role === "admin") {
      router.push(dashboardPath(role));
      return;
    }
    router.push(dashboardPath(result.user.role));
  }

  return (
    <AuthShell
      title="Sign In"
      subtitle="Demo admin (abc@gmail.com / ABC123) works on every role tab for testing."
    >
      <div className="mb-6 flex gap-2">
        {LOGIN_ROLES.map((r) => (
          <TabButton
            key={r.id}
            active={role === r.id}
            onClick={() => setRole(r.id)}
          >
            {r.label}
          </TabButton>
        ))}
      </div>

      <p className="mb-4 text-xs text-[var(--text-muted)]">
        Signing in as <strong className="text-[var(--text)]">{roleLabel(role)}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel htmlFor="email" required>
            Email
          </FieldLabel>
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <FieldLabel htmlFor="password" required>
            Password
          </FieldLabel>
          <TextInput
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <SubmitButton disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        New here?{" "}
        <Link href="/register" className="font-semibold text-mst-red hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
