"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  COLLEGES,
  DEMO_FEES,
  registerStudent,
  registerValidator,
  dashboardPath,
} from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import {
  AuthShell,
  DemoFee,
  DemoFeeNote,
  FieldLabel,
  HighlightBox,
  SelectInput,
  SubmitButton,
  TextInput,
} from "./AuthShell";

type SelectedRole = "student" | "validator";

const VALIDATOR_ID_PLACEHOLDER_URL = "https://example.com/validator-id-card.pdf";

export function RegisterForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [role, setRole] = useState<SelectedRole>("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState<string>(COLLEGES[0]);
  const [collegeOther, setCollegeOther] = useState("");
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [validatorIdFile, setValidatorIdFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    let result:
      | { ok: true; user: { role: string } }
      | { ok: false; error: string };

    if (role === "student") {
      if (!studentIdFile) {
        setLoading(false);
        setError("Student ID card upload is required.");
        return;
      }
      if (college === "Other" && !collegeOther.trim()) {
        setLoading(false);
        setError("Please enter your college name.");
        return;
      }
      result = registerStudent({
        fullName,
        email,
        phone,
        password,
        college,
        collegeOther: college === "Other" ? collegeOther : undefined,
        idCardFileName: studentIdFile.name,
      });
    } else {
      if (!validatorIdFile) {
        setLoading(false);
        setError("Validator ID card upload is required.");
        return;
      }
      result = registerValidator({
        fullName,
        email,
        phone,
        password,
        idCardFileName: validatorIdFile.name,
      });
    }

    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    refresh();
    router.push(
      dashboardPath(result.user.role as "student" | "validator")
    );
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle="Choose your path and get started."
    >
      <div className="mb-6 space-y-4">
        <DemoFeeNote />

        <div>
          <FieldLabel required>I am registering as a</FieldLabel>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setRole("student"); setError(""); }}
              className={`group relative flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition-all ${
                role === "student"
                  ? "border-mst-red bg-mst-red/5 shadow-md shadow-mst-red/10"
                  : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text-muted)]/40 hover:bg-[var(--bg-muted)]"
              }`}
            >
              <span className="text-3xl">🎓</span>
              <span className={`text-sm font-bold ${
                role === "student" ? "text-mst-red" : "text-[var(--text)]"
              }`}>
                Student
              </span>
              <span className="text-[11px] leading-tight text-[var(--text-muted)]">
                Enroll in courses & earn certifications
              </span>
              {role === "student" && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-mst-red text-[10px] text-white">
                  ✓
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setRole("validator"); setError(""); }}
              className={`group relative flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition-all ${
                role === "validator"
                  ? "border-mst-red bg-mst-red/5 shadow-md shadow-mst-red/10"
                  : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text-muted)]/40 hover:bg-[var(--bg-muted)]"
              }`}
            >
              <span className="text-3xl">🔐</span>
              <span className={`text-sm font-bold ${
                role === "validator" ? "text-mst-red" : "text-[var(--text)]"
              }`}>
                Validator
              </span>
              <span className="text-[11px] leading-tight text-[var(--text-muted)]">
                Validate transactions & earn rewards
              </span>
              {role === "validator" && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-mst-red text-[10px] text-white">
                  ✓
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel htmlFor="fullName" required>
            Full Name
          </FieldLabel>
          <TextInput
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div>
          <FieldLabel htmlFor="email" required>
            Email
          </FieldLabel>
          <TextInput
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <FieldLabel htmlFor="phone" required>
            Phone Number
          </FieldLabel>
          <TextInput
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        {role === "student" && (
          <>
            <div>
              <FieldLabel htmlFor="college" required>
                College
              </FieldLabel>
              <SelectInput
                id="college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              >
                {COLLEGES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SelectInput>
            </div>
            {college === "Other" && (
              <div>
                <FieldLabel htmlFor="collegeOther" required>
                  Enter College Name
                </FieldLabel>
                <TextInput
                  id="collegeOther"
                  required
                  value={collegeOther}
                  onChange={(e) => setCollegeOther(e.target.value)}
                  placeholder="Your college name"
                />
              </div>
            )}
            <div>
              <FieldLabel htmlFor="studentId" required>
                Student ID Card Upload
              </FieldLabel>
              <TextInput
                id="studentId"
                type="file"
                accept="image/*,.pdf"
                required
                onChange={(e) =>
                  setStudentIdFile(e.target.files?.[0] ?? null)
                }
              />
              {studentIdFile && (
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Selected: {studentIdFile.name}
                </p>
              )}
            </div>
            <DemoFee amount={DEMO_FEES.student} />
            <HighlightBox>
              Internship Opportunity available for eligible students who meet
              the required assessment criteria.
            </HighlightBox>
          </>
        )}

        {role === "validator" && (
          <>
            <div>
              <FieldLabel htmlFor="validatorId" required>
                Validator ID Card Upload
              </FieldLabel>
              <TextInput
                id="validatorId"
                type="file"
                accept="image/*,.pdf"
                required
                onChange={(e) =>
                  setValidatorIdFile(e.target.files?.[0] ?? null)
                }
              />
              {validatorIdFile && (
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Selected: {validatorIdFile.name}
                </p>
              )}
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Don&apos;t have a Validator ID Card?{" "}
              <a
                href={VALIDATOR_ID_PLACEHOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-mst-red hover:underline"
              >
                Download Validator ID Card
              </a>
            </p>
            <DemoFee amount={DEMO_FEES.validator} />
          </>
        )}

        <div>
          <FieldLabel htmlFor="password" required>
            Password
          </FieldLabel>
          <TextInput
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel htmlFor="confirmPassword" required>
            Confirm Password
          </FieldLabel>
          <TextInput
            id="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <SubmitButton disabled={loading}>
          {loading ? "Creating account…" : "Complete Registration"}
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-mst-red hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
