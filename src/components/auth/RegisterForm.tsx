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

type UserType = "student" | "validator" | "normal";

const VALIDATOR_ID_PLACEHOLDER_URL = "https://example.com/validator-id-card.pdf";

const USER_TYPES: { id: UserType; label: string; emoji: string; desc: string; price: number }[] = [
  { id: "student", label: "Student", emoji: "🎓", desc: "Enroll in courses & earn certifications", price: DEMO_FEES.student },
  { id: "validator", label: "Validator", emoji: "🔐", desc: "Validate transactions & earn rewards", price: DEMO_FEES.validator },
  { id: "normal", label: "Normal User", emoji: "👤", desc: "Access all courses & content", price: DEMO_FEES.normal },
];

export function RegisterForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [userType, setUserType] = useState<UserType>("student");
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

  const selectedType = USER_TYPES.find((t) => t.id === userType)!;

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

    if (userType === "validator") {
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
    } else {
      if (userType === "student" && !studentIdFile) {
        setLoading(false);
        setError("Student ID card upload is required.");
        return;
      }
      if (userType === "student" && college === "Other" && !collegeOther.trim()) {
        setLoading(false);
        setError("Please enter your college name.");
        return;
      }
      result = registerStudent({
        fullName,
        email,
        phone,
        password,
        college: userType === "student" ? college : "N/A",
        collegeOther: userType === "student" && college === "Other" ? collegeOther : undefined,
        idCardFileName: userType === "student" ? studentIdFile!.name : "normal-user",
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
      subtitle="Choose your role and get started."
    >
      <div className="mb-5">
        <DemoFeeNote />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role selection */}
        <div>
          <FieldLabel required>I am registering as</FieldLabel>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {USER_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setUserType(t.id); setError(""); }}
                className={`relative flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-center transition-all ${
                  userType === t.id
                    ? "border-mst-red bg-mst-red/5 shadow-md shadow-mst-red/10"
                    : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text-muted)]/40"
                }`}
              >
                <span className="text-xl">{t.emoji}</span>
                <span className={`text-xs font-bold ${
                  userType === t.id ? "text-mst-red" : "text-[var(--text)]"
                }`}>
                  {t.label}
                </span>
                <span className="text-[10px] leading-tight text-[var(--text-muted)]">
                  Rs {t.price.toLocaleString("en-IN")}
                </span>
                {userType === t.id && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-mst-red text-[8px] text-white">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Common fields */}
        <div>
          <FieldLabel htmlFor="fullName" required>Full Name</FieldLabel>
          <TextInput id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
        </div>
        <div>
          <FieldLabel htmlFor="email" required>Email</FieldLabel>
          <TextInput id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <FieldLabel htmlFor="phone" required>Phone Number</FieldLabel>
          <TextInput id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
        </div>

        {/* Student-specific fields */}
        {userType === "student" && (
          <>
            <div>
              <FieldLabel htmlFor="college" required>College</FieldLabel>
              <SelectInput id="college" value={college} onChange={(e) => setCollege(e.target.value)}>
                {COLLEGES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </SelectInput>
            </div>
            {college === "Other" && (
              <div>
                <FieldLabel htmlFor="collegeOther" required>Enter College Name</FieldLabel>
                <TextInput id="collegeOther" required value={collegeOther} onChange={(e) => setCollegeOther(e.target.value)} placeholder="Your college name" />
              </div>
            )}
            <div>
              <FieldLabel htmlFor="studentId" required>Student ID Card Upload</FieldLabel>
              <TextInput id="studentId" type="file" accept="image/*,.pdf" required onChange={(e) => setStudentIdFile(e.target.files?.[0] ?? null)} />
              {studentIdFile && (
                <p className="mt-1 text-xs text-[var(--text-muted)]">Selected: {studentIdFile.name}</p>
              )}
            </div>
            <HighlightBox>
              Internship Opportunity available for eligible students who meet the required assessment criteria.
            </HighlightBox>
          </>
        )}

        {/* Validator-specific fields */}
        {userType === "validator" && (
          <>
            <div>
              <FieldLabel htmlFor="validatorId" required>Validator ID Card Upload</FieldLabel>
              <TextInput id="validatorId" type="file" accept="image/*,.pdf" required onChange={(e) => setValidatorIdFile(e.target.files?.[0] ?? null)} />
              {validatorIdFile && (
                <p className="mt-1 text-xs text-[var(--text-muted)]">Selected: {validatorIdFile.name}</p>
              )}
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Don&apos;t have a Validator ID Card?{" "}
              <a href={VALIDATOR_ID_PLACEHOLDER_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-mst-red hover:underline">
                Download Validator ID Card
              </a>
            </p>
          </>
        )}

        {/* Fee display */}
        <DemoFee amount={selectedType.price} />

        {/* Password */}
        <div>
          <FieldLabel htmlFor="password" required>Password</FieldLabel>
          <TextInput id="password" type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="confirmPassword" required>Confirm Password</FieldLabel>
          <TextInput id="confirmPassword" type="password" required minLength={6} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <SubmitButton disabled={loading}>
          {loading ? "Creating account..." : "Complete Registration"}
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
