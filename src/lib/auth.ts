"use client";

export type UserRole = "student" | "validator" | "non-validator" | "admin";

export type BlockchainLevel = "Beginner" | "Intermediate" | "Expert";

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  college?: string;
  collegeOther?: string;
  blockchainLevel?: BlockchainLevel;
  registeredAt: string;
}

export interface RegisterStudentInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  college: string;
  collegeOther?: string;
  idCardFileName: string;
}

export interface RegisterValidatorInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  idCardFileName: string;
}

export interface RegisterNonValidatorInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  blockchainLevel: BlockchainLevel;
}

const SESSION_KEY = "mst-academy-session";
const USERS_KEY = "mst-academy-users";

export const DEMO_ADMIN_EMAIL = "abc@gmail.com";
export const DEMO_ADMIN_PASSWORD = "ABC123";

export const COLLEGES = [
  "MIT WPU",
  "DY Patil University",
  "PCCOE",
  "VIIT",
  "Sinhgad College",
  "MIT ADT University",
  "Other",
] as const;

export const BLOCKCHAIN_LEVELS: BlockchainLevel[] = [
  "Beginner",
  "Intermediate",
  "Expert",
];

export const DEMO_FEES = {
  student: 2999,
  validator: 3999,
  nonValidator: 8999,
} as const;

function loadUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as AuthUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isAdminCredentials(email: string, password: string): boolean {
  return (
    normalizeEmail(email) === normalizeEmail(DEMO_ADMIN_EMAIL) &&
    password === DEMO_ADMIN_PASSWORD
  );
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: AuthUser | null) {
  if (user) {
    const { password: _pw, ...safe } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function isAdminUser(user?: AuthUser | null): boolean {
  const u = user ?? getSession();
  return u?.role === "admin";
}

export function login(
  email: string,
  password: string,
  requestedRole?: UserRole
): { ok: true; user: AuthUser } | { ok: false; error: string } {
  if (isAdminCredentials(email, password)) {
    const admin: AuthUser = {
      id: "admin-demo",
      email: DEMO_ADMIN_EMAIL,
      password: DEMO_ADMIN_PASSWORD,
      fullName: "Demo Admin",
      role: "admin",
      registeredAt: new Date().toISOString(),
    };
    setSession(admin);
    return { ok: true, user: admin };
  }

  const users = loadUsers();
  const found = users.find((u) => normalizeEmail(u.email) === normalizeEmail(email));
  if (!found) {
    return { ok: false, error: "No account found. Please register first." };
  }

  if (found.password !== password) {
    return { ok: false, error: "Incorrect password." };
  }

  if (requestedRole && found.role !== requestedRole && found.role !== "admin") {
    return {
      ok: false,
      error: `This account is registered as ${roleLabel(found.role)}. Use the correct login tab or register.`,
    };
  }

  setSession(found);
  return { ok: true, user: found };
}

export function logout() {
  setSession(null);
}

export function registerStudent(input: RegisterStudentInput) {
  return registerUser({
    ...input,
    role: "student",
    college:
      input.college === "Other" ? input.collegeOther || "Other" : input.college,
  });
}

export function registerValidator(input: RegisterValidatorInput) {
  return registerUser({ ...input, role: "validator" });
}

export function registerNonValidator(input: RegisterNonValidatorInput) {
  return registerUser({ ...input, role: "non-validator" });
}

function registerUser(
  input: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    college?: string;
    blockchainLevel?: BlockchainLevel;
    idCardFileName?: string;
  }
): { ok: true; user: AuthUser } | { ok: false; error: string } {
  if (input.password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }
  if (isAdminCredentials(input.email, DEMO_ADMIN_PASSWORD)) {
    return {
      ok: false,
      error: "This email is reserved for the demo admin account.",
    };
  }

  const users = loadUsers();
  if (users.some((u) => normalizeEmail(u.email) === normalizeEmail(input.email))) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const user: AuthUser = {
    id: `user-${Date.now()}`,
    email: input.email.trim(),
    password: input.password,
    fullName: input.fullName.trim(),
    role: input.role,
    phone: input.phone?.trim(),
    college: input.college,
    blockchainLevel: input.blockchainLevel,
    registeredAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);
  setSession(user);
  return { ok: true, user };
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case "student":
      return "Student";
    case "validator":
      return "Validator";
    case "non-validator":
      return "Non Validator";
    case "admin":
      return "Admin";
  }
}

export function dashboardPath(role: UserRole): string {
  switch (role) {
    case "student":
      return "/dashboard/student";
    case "validator":
      return "/dashboard/validator";
    case "non-validator":
      return "/dashboard/non-validator";
    case "admin":
      return "/dashboard/student";
  }
}

export function canAccessDashboard(role: UserRole): boolean {
  const user = getSession();
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.role === role;
}
