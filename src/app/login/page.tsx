import { LoginForm } from "@/components/auth/LoginForm";
import type { UserRole } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role: roleParam } = await searchParams;
  const valid: UserRole[] = ["student", "validator"];
  const initialRole = valid.includes(roleParam as UserRole)
    ? (roleParam as UserRole)
    : "student";

  return <LoginForm initialRole={initialRole} />;
}
