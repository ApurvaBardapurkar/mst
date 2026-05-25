import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-grid relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[var(--bg)]">
      <section className="relative mx-auto max-w-5xl px-4 py-24 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-mst-red">
          MST Blockchain · Masterstroke Academy
        </p>
        <h1 className="mt-6 text-4xl font-black text-[var(--text)] sm:text-6xl">
          Learn. Build. Launch.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--text-muted)]">
          21 modules · 4 phases · Interactive learning tree · Full-screen
          assessments · Live code execution
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-full bg-mst-red px-10 py-3 font-semibold text-white transition hover:bg-mst-red-dark"
          >
            Open Learning Tree →
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--text)] bg-transparent px-10 py-3 font-semibold text-[var(--text)] transition hover:bg-[var(--bg-muted)]"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] px-10 py-3 font-semibold text-[var(--text)] transition hover:border-mst-red"
          >
            Sign In
          </Link>
        </div>
        <div className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-4">
          {[
            { n: "4", label: "Phases" },
            { n: "21", label: "Modules" },
            { n: "122+", label: "Lessons" },
            { n: "∞", label: "Practice" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
            >
              <p className="text-3xl font-black text-mst-red">{stat.n}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
