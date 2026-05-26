"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, dashboardPath } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import {
  AuthShell,
  FieldLabel,
  SubmitButton,
  TextInput,
} from "./AuthShell";

export function LoginForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    refresh();
    router.push(dashboardPath(result.user.role as "student" | "validator"));
  }

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to continue your learning journey."
    >
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
          {loading ? "Signing in..." : "Sign In"}
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
