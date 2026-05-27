"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";
import { dashboardPath } from "@/lib/auth";
import {
  Menu,
  X,
  BookOpen,
  LayoutDashboard,
  LogOut,
  UserPlus,
  LogIn,
  GraduationCap,
  Shield,
  Users,
} from "lucide-react";

export function Navbar() {
  const { user, ready, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardHref = user
    ? isAdmin
      ? "/dashboard/student"
      : dashboardPath(user.role)
    : "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-mst-red to-red-700 shadow-lg shadow-mst-red/20 transition-transform group-hover:scale-105">
            <Image
              src="/logo.svg"
              alt="MST"
              width={24}
              height={24}
              className="h-6 w-6 brightness-0 invert"
            />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-extrabold tracking-wide text-[var(--nav-text)]">
              MASTERSTROKE
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-mst-red">
              Academy
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/academy-overview"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--nav-text)]/70 transition hover:bg-white/10 hover:text-[var(--nav-text)]"
          >
            <GraduationCap size={16} />
            Curriculum
          </Link>
          <Link
            href="/learn"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--nav-text)]/70 transition hover:bg-white/10 hover:text-[var(--nav-text)]"
          >
            <BookOpen size={16} />
            Learning Tree
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--nav-text)]/70 transition hover:bg-white/10 hover:text-[var(--nav-text)]"
          >
            <Shield size={16} />
            Leaderboard
          </Link>
          {ready && user && (
            <Link
              href={dashboardHref}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--nav-text)]/70 transition hover:bg-white/10 hover:text-[var(--nav-text)]"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          )}
          {ready && isAdmin && (
            <>
              <Link
                href="/dashboard/validator"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--nav-text)]/70 transition hover:bg-white/10 hover:text-[var(--nav-text)]"
              >
                <Shield size={16} />
                Validator
              </Link>
              <Link
                href="/dashboard/non-validator"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--nav-text)]/70 transition hover:bg-white/10 hover:text-[var(--nav-text)]"
              >
                <Users size={16} />
                General
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {ready && user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href={dashboardHref}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-sm font-medium text-[var(--nav-text)] transition hover:border-mst-red/50 hover:bg-mst-red/10"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-mst-red text-[10px] font-bold text-white">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.fullName?.split(" ")[0]}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-white/10 p-2 text-[var(--nav-text)]/60 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-sm font-medium text-[var(--nav-text)] transition hover:border-mst-red/50 hover:bg-mst-red/10"
              >
                <LogIn size={14} />
                Sign In
              </Link>
              <Link
                href="/register"
                className="hidden items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-sm font-medium text-[var(--nav-text)] transition hover:border-mst-red/50 hover:bg-mst-red/10 md:flex"
              >
                <UserPlus size={14} />
                Register
              </Link>
            </div>
          )}

          <Link
            href="/learn"
            className="rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-mst-red/25 transition hover:shadow-mst-red/40 hover:brightness-110 active:scale-[0.98]"
          >
            Start Learning
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-[var(--nav-text)] transition hover:bg-white/10 md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[var(--nav-bg)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="/academy-overview"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--nav-text)] transition hover:bg-white/10"
            >
              <GraduationCap size={18} />
              Curriculum
            </Link>
            <Link
              href="/learn"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--nav-text)] transition hover:bg-white/10"
            >
              <BookOpen size={18} />
              Learning Tree
            </Link>
            <Link
              href="/leaderboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--nav-text)] transition hover:bg-white/10"
            >
              <Shield size={18} />
              Leaderboard
            </Link>
            {ready && user && (
              <Link
                href={dashboardHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--nav-text)] transition hover:bg-white/10"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            )}
            {ready && isAdmin && (
              <>
                <Link
                  href="/dashboard/validator"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--nav-text)] transition hover:bg-white/10"
                >
                  <Shield size={18} />
                  Validator Panel
                </Link>
                <Link
                  href="/dashboard/non-validator"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--nav-text)] transition hover:bg-white/10"
                >
                  <Users size={18} />
                  General Users
                </Link>
              </>
            )}
            <div className="my-2 border-t border-white/10" />
            {ready && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mst-red text-xs font-bold text-white">
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--nav-text)]">{user.fullName}</p>
                    <p className="text-xs text-[var(--nav-text)]/50">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--nav-text)] transition hover:bg-white/10"
                >
                  <LogIn size={18} />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--nav-text)] transition hover:bg-white/10"
                >
                  <UserPlus size={18} />
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
