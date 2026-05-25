"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";
import { dashboardPath } from "@/lib/auth";

export function Navbar() {
  const { user, ready, logout, isAdmin } = useAuth();

  const dashboardHref = user
    ? isAdmin
      ? "/dashboard/student"
      : dashboardPath(user.role)
    : "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="MST Blockchain"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <div className="leading-tight">
            <span className="block text-sm font-bold tracking-wide text-[var(--nav-text)]">
              MASTERSTROKE
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-mst-red">
              Academy
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-[var(--nav-text)]/70 md:flex">
          <Link
            href="/learn"
            className="transition hover:text-[var(--nav-text)]"
          >
            Learning Tree
          </Link>
          {ready && isAdmin && (
            <>
              <Link
                href="/dashboard/validator"
                className="transition hover:text-[var(--nav-text)]"
              >
                Validator
              </Link>
              <Link
                href="/dashboard/non-validator"
                className="transition hover:text-[var(--nav-text)]"
              >
                Non Validator
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {ready && user ? (
            <>
              <Link
                href={dashboardHref}
                className="hidden rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--nav-text)] transition hover:border-mst-red sm:inline-block"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--nav-text)] transition hover:border-mst-red sm:inline-block"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--nav-text)] transition hover:border-mst-red sm:inline-block"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="hidden rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--nav-text)] transition hover:border-mst-red md:inline-block"
              >
                Register
              </Link>
            </>
          )}
          <Link
            href="/learn"
            className="rounded-full bg-mst-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-mst-red-dark sm:px-5"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </header>
  );
}
