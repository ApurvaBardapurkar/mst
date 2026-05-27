import Link from "next/link";
import {
  Trophy,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const LEADERS = [
  {
    name: "Aarya S.",
    score: "98.2",
    coins: "12 MSTC",
    streak: "18 days",
    title: "Top performer",
  },
  {
    name: "Kiran P.",
    score: "94.5",
    coins: "9 MSTC",
    streak: "16 days",
    title: "Blockchain builder",
  },
  {
    name: "Meera T.",
    score: "91.7",
    coins: "8 MSTC",
    streak: "14 days",
    title: "Streak leader",
  },
];

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mst-red">
                Leaderboard
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
                The top Web3 performers on MST
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
                Track streaks, coin rewards, internship placement momentum, and the student champions shaping the MST blockchain future.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-3xl bg-mst-red/10 px-5 py-4 text-sm font-semibold text-mst-red shadow-lg shadow-mst-red/10">
              <Sparkles className="h-6 w-6" />
              Stay on the leaderboard with daily learning streaks
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {LEADERS.map((person, index) => (
            <div key={person.name} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Rank {index + 1}
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-[var(--text)]">{person.name}</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-mst-red/10 text-mst-red">
                  {index + 1}
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-[var(--text-muted)]">
                <div className="flex items-center justify-between rounded-2xl bg-[var(--bg)] px-4 py-3">
                  <span>{person.title}</span>
                  <span className="font-semibold text-[var(--text)]">{person.score}%</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[var(--bg)] px-4 py-3">
                  <span>Rewards</span>
                  <span className="font-semibold text-[var(--text)]">{person.coins}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[var(--bg)] px-4 py-3">
                  <span>Streak</span>
                  <span className="font-semibold text-[var(--text)]">{person.streak}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-[var(--text-muted)]">
            The MST Leaderboard is your go-to showcase for scholarship, internship eligibility, and full-time placement potential.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mst-red to-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-mst-red/20 transition hover:shadow-mst-red/30"
          >
            Join the cohort
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
