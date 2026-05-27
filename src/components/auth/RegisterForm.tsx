"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DEMO_FEES,
  registerStudent,
  registerValidator,
  registerNonValidator,
  registerCourseOnly,
  dashboardPath,
} from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import {
  AuthShell,
  DemoFee,
  DemoFeeNote,
  FieldLabel,
  SubmitButton,
  TextInput,
} from "./AuthShell";

type UserType = "student" | "validator" | "normal" | "course-only";

const USER_TYPES: { id: UserType; label: string; emoji: string; desc: string; price: number }[] = [
  {
    id: "student",
    label: "Student Plan",
    emoji: "🎓",
    desc: "Full course + paid internship + MSTC reward fraction",
    price: DEMO_FEES.student,
  },
  {
    id: "validator",
    label: "Validator Plan",
    emoji: "🔐",
    desc: "Lifetime access + validator reward fraction",
    price: DEMO_FEES.validator,
  },
  {
    id: "normal",
    label: "General Plan",
    emoji: "👤",
    desc: "Lifetime access + internship + MSTC reward fraction",
    price: DEMO_FEES.normal,
  },
  {
    id: "course-only",
    label: "Course Pass",
    emoji: "📘",
    desc: "Course-only access without internship or MSTC reward",
    price: DEMO_FEES.courseOnly,
  },
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
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const selectedType = USER_TYPES.find((t) => t.id === userType)!;

  function generateOtp() {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  function handleSendOtp() {
    setError("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Enter a valid 10-digit mobile number before sending OTP.");
      return;
    }
    const otp = generateOtp();
    setSentOtp(otp);
    setOtpSent(true);
    setOtpVerified(false);
    setOtpValue("");
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpValue("");
    setSentOtp(null);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    if (!otpSent) {
      setLoading(false);
      setError("Send OTP to verify your mobile number.");
      return;
    }

    if (!otpVerified) {
      if (!sentOtp || otpValue !== sentOtp) {
        setLoading(false);
        setError("Invalid OTP. Please enter the code sent to your phone.");
        return;
      }
      setOtpVerified(true);
    }

    let result:
      | { ok: true; user: { role: string } }
      | { ok: false; error: string };

    if (userType === "validator") {
      result = registerValidator({
        fullName,
        email,
        phone,
        password,
      });
    } else if (userType === "student") {
      result = registerStudent({
        fullName,
        email,
        phone,
        password,
        packageType: "full",
      });
    } else if (userType === "course-only") {
      result = registerCourseOnly({
        fullName,
        email,
        phone,
        password,
        packageType: "course-only",
      });
    } else {
      result = registerNonValidator({
        fullName,
        email,
        phone,
        password,
        packageType: "full",
      });
    }

    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    refresh();
    router.push(
      dashboardPath(result.user.role as "student" | "validator" | "non-validator")
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
        <div>
          <FieldLabel htmlFor="fullName" required>Full Name</FieldLabel>
          <TextInput id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
        </div>
        <div>
          <FieldLabel htmlFor="email" required>Email</FieldLabel>
          <TextInput id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <FieldLabel htmlFor="phone" required>Mobile Number</FieldLabel>
          <TextInput
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="98765 43210"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSendOtp}
              className="rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-mst-red/20 transition hover:brightness-110"
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </button>
            {otpSent && (
              <p className="text-sm text-[var(--text-muted)]">
                Enter the 4-digit code sent to your phone to continue.
              </p>
            )}
          </div>
        </div>

        {otpSent && (
          <div>
            <FieldLabel htmlFor="otp" required>OTP Code</FieldLabel>
            <TextInput
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              placeholder="Enter OTP"
            />
            {sentOtp && (
              <p className="mt-2 rounded-xl border border-mst-red/20 bg-mst-red/5 px-3 py-2 text-sm text-mst-red">
                Demo OTP: {sentOtp}
              </p>
            )}
          </div>
        )}

        <div>
          <FieldLabel required>Choose your plan</FieldLabel>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {USER_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setUserType(t.id);
                  setError("");
                }}
                className={`relative flex flex-col items-start justify-between rounded-3xl border-2 p-4 text-left transition-all duration-300 ${
                  userType === t.id
                    ? "border-mst-red bg-mst-red/5 shadow-[0_12px_40px_rgba(227,30,36,0.18)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-mst-red/30"
                }`}
              >
                <div>
                  <div className="mb-3 text-2xl">{t.emoji}</div>
                  <p className="text-sm font-bold text-[var(--text)]">{t.label}</p>
                  <p className="mt-2 text-xs leading-snug text-[var(--text-muted)]">
                    {t.desc}
                  </p>
                </div>
                <div className="mt-4 text-sm font-black text-mst-red">
                  ₹{t.price.toLocaleString("en-IN")}
                </div>
                {userType === t.id && (
                  <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-mst-red text-[10px] text-white">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <DemoFee amount={selectedType.price} />

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
