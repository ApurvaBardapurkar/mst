"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BLOCKCHAIN_LEVELS,
  COLLEGES,
  DEMO_FEES,
  registerNonValidator,
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
  TabButton,
  TextInput,
} from "./AuthShell";

type PrimaryTab = "student" | "developer";
type DeveloperTab = "validator" | "non-validator";

const VALIDATOR_ID_PLACEHOLDER_URL = "https://example.com/validator-id-card.pdf";

export function RegisterForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>("student");
  const [developerTab, setDeveloperTab] = useState<DeveloperTab>("validator");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState<string>(COLLEGES[0]);
  const [collegeOther, setCollegeOther] = useState("");
  const [blockchainLevel, setBlockchainLevel] = useState(BLOCKCHAIN_LEVELS[0]);
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [validatorIdFile, setValidatorIdFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function resetErrors() {
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetErrors();
    setLoading(true);

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    let result:
      | { ok: true; user: { role: string } }
      | { ok: false; error: string };

    if (primaryTab === "student") {
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
    } else if (developerTab === "validator") {
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
      result = registerNonValidator({
        fullName,
        email,
        phone,
        password,
        blockchainLevel,
      });
    }

    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    refresh();
    router.push(
      dashboardPath(
        result.user.role as "student" | "validator" | "non-validator"
      )
    );
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle="Choose your path. Fees shown are demo values until payment integration is live."
    >
      <div className="mb-4 space-y-4">
        <DemoFeeNote />
        <div className="flex gap-2">
          <TabButton
            active={primaryTab === "student"}
            onClick={() => {
              setPrimaryTab("student");
              resetErrors();
            }}
          >
            Student
          </TabButton>
          <TabButton
            active={primaryTab === "developer"}
            onClick={() => {
              setPrimaryTab("developer");
              resetErrors();
            }}
          >
            User / Developer
          </TabButton>
        </div>
      </div>

      {primaryTab === "developer" && (
        <div className="mb-6 flex gap-2">
          <TabButton
            active={developerTab === "validator"}
            onClick={() => {
              setDeveloperTab("validator");
              resetErrors();
            }}
          >
            Validator
          </TabButton>
          <TabButton
            active={developerTab === "non-validator"}
            onClick={() => {
              setDeveloperTab("non-validator");
              resetErrors();
            }}
          >
            Non Validator
          </TabButton>
        </div>
      )}

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
          />
        </div>

        {primaryTab === "student" && (
          <>
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
              />
            </div>
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

        {primaryTab === "developer" && developerTab === "validator" && (
          <>
            <div>
              <FieldLabel htmlFor="v-email" required>
                Registered Email
              </FieldLabel>
              <TextInput
                id="v-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="v-phone" required>
                Registered Mobile Number
              </FieldLabel>
              <TextInput
                id="v-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
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

        {primaryTab === "developer" && developerTab === "non-validator" && (
          <>
            <div>
              <FieldLabel htmlFor="nv-email" required>
                Email
              </FieldLabel>
              <TextInput
                id="nv-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="nv-phone" required>
                Phone Number
              </FieldLabel>
              <TextInput
                id="nv-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="level" required>
                Blockchain Knowledge Level
              </FieldLabel>
              <SelectInput
                id="level"
                value={blockchainLevel}
                onChange={(e) =>
                  setBlockchainLevel(
                    e.target.value as (typeof BLOCKCHAIN_LEVELS)[number]
                  )
                }
              >
                {BLOCKCHAIN_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </SelectInput>
            </div>
            <DemoFee amount={DEMO_FEES.nonValidator} />
            <HighlightBox>
              Upon successful enrollment, a fractional share of MST Validator
              participation will be allocated to the user, enabling Validator
              ecosystem participation.
            </HighlightBox>
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
