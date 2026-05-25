import Link from "next/link";
import {
  TreePine,
  Monitor,
  Code2,
  BarChart3,
  Link2,
  Award,
  ChevronRight,
  Blocks,
  Layers,
  Rocket,
  Zap,
  GraduationCap,
  ArrowRight,
  FileCode,
} from "lucide-react";

const features = [
  {
    icon: TreePine,
    title: "Interactive Learning Tree",
    description:
      "Navigate a visual learning tree that maps your entire journey from fundamentals to advanced topics.",
  },
  {
    icon: Monitor,
    title: "Full-screen Assessments",
    description:
      "Test your knowledge with immersive, lockdown-mode assessments designed to validate real understanding.",
  },
  {
    icon: Code2,
    title: "Live Code Execution",
    description:
      "Write and execute Solidity, JavaScript, and more directly in the browser with instant feedback.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Track completion across all 4 phases and 21 modules with detailed analytics on your progress.",
  },
  {
    icon: Link2,
    title: "Blockchain Focus",
    description:
      "Purpose-built for Web3. Every module is tailored to blockchain development, DeFi, NFTs, and DAOs.",
  },
  {
    icon: Award,
    title: "Certificate on Completion",
    description:
      "Earn a verifiable certificate upon completing the full curriculum, proving your blockchain expertise.",
  },
];

const phases = [
  {
    number: 1,
    title: "Blockchain Foundations",
    modules: 6,
    icon: Blocks,
    description:
      "Core concepts — cryptography, consensus mechanisms, wallets, and blockchain architecture.",
    color: "var(--accent-blue)",
  },
  {
    number: 2,
    title: "Smart Contracts & Solidity",
    modules: 5,
    icon: FileCode,
    description:
      "Solidity programming, smart contract design patterns, security, and testing frameworks.",
    color: "var(--mst-red)",
  },
  {
    number: 3,
    title: "DeFi & Advanced Protocols",
    modules: 5,
    icon: Layers,
    description:
      "Decentralized finance, AMMs, lending protocols, oracles, and cross-chain bridges.",
    color: "var(--accent-purple)",
  },
  {
    number: 4,
    title: "Capstone & Deployment",
    modules: 5,
    icon: Rocket,
    description:
      "Build and deploy production-grade dApps. Governance, tokenomics, and real-world architecture.",
    color: "var(--accent-green)",
  },
];

const stats = [
  { value: "4", label: "Phases" },
  { value: "21", label: "Modules" },
  { value: "122+", label: "Lessons" },
  { value: "Live", label: "Assessments" },
];

const topics = [
  "Solidity",
  "DeFi",
  "NFTs",
  "DAOs",
  "Smart Contracts",
  "Cryptography",
  "Consensus",
  "EVM",
  "Web3.js",
  "Hardhat",
  "Token Standards",
  "Layer 2",
];

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-[var(--bg)]">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="bg-grid relative">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-block rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-mst-red">
              MST Blockchain Academy
            </p>

            <h1 className="mt-8 text-4xl font-black leading-[1.1] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              Master Blockchain Development{" "}
              <span className="text-gradient-red">From Zero to Production</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
              A structured, 4-phase curriculum covering everything from
              cryptography basics to deploying production dApps — with
              interactive lessons, live code execution, and rigorous
              assessments.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/learn"
                className="group inline-flex items-center gap-2 rounded-full bg-mst-red px-8 py-3.5 font-semibold text-white shadow-lg shadow-mst-red/20 transition-all hover:bg-mst-red-dark hover:shadow-xl hover:shadow-mst-red/30"
              >
                Start Learning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#curriculum"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-8 py-3.5 font-semibold text-[var(--text)] transition-all hover:border-mst-red hover:bg-[var(--bg-muted)]"
              >
                Explore Curriculum
              </Link>
            </div>
          </div>

          {/* Learning path preview */}
          <div className="mx-auto mt-16 max-w-3xl">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:gap-0">
              {phases.map((phase, i) => (
                <div key={phase.number} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm sm:h-14 sm:w-14"
                      style={{ borderColor: phase.color }}
                    >
                      <phase.icon
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        style={{ color: phase.color }}
                      />
                    </div>
                    <span className="whitespace-nowrap text-[10px] font-semibold text-[var(--text-muted)] sm:text-xs">
                      Phase {phase.number}
                    </span>
                  </div>
                  {i < phases.length - 1 && (
                    <ChevronRight className="mx-1 h-4 w-4 shrink-0 text-[var(--border-strong)] sm:mx-3 sm:h-5 sm:w-5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-[var(--border)] sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-10 text-center sm:py-12">
              <p className="text-3xl font-black text-mst-red sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-mst-red">
              Platform Features
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">
              Everything you need to become a blockchain developer
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--border-strong)] hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-muted)]">
                  <feature.icon className="h-5 w-5 text-mst-red" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Curriculum Preview ────────────────────────── */}
      <section
        id="curriculum"
        className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-mst-red">
              Curriculum
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">
              4 phases to blockchain mastery
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              A progressive curriculum that takes you from the fundamentals to
              deploying production-grade decentralized applications.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {phases.map((phase) => (
              <div
                key={phase.number}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--border-strong)] hover:shadow-lg sm:p-8"
              >
                <div
                  className="absolute right-4 top-4 text-[5rem] font-black leading-none opacity-[0.04]"
                  style={{ color: phase.color }}
                >
                  {phase.number}
                </div>
                <div className="relative">
                  <div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: phase.color,
                      opacity: 0.12,
                    }}
                  >
                    <phase.icon
                      className="h-5 w-5"
                      style={{ color: phase.color }}
                    />
                  </div>
                  {/* Re-render icon on top for correct color */}
                  <div
                    className="absolute left-0 top-0 mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  >
                    <phase.icon
                      className="h-5 w-5"
                      style={{ color: phase.color }}
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: phase.color }}
                    >
                      Phase {phase.number}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      · {phase.modules} modules
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-[var(--text)]">
                    {phase.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/learn"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-mst-red transition hover:text-mst-red-dark"
            >
              View full curriculum in the learning tree
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Technologies ──────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="bg-pattern-dots absolute inset-0 opacity-50" />
            <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-mst-red/10">
                <Zap className="h-6 w-6 text-mst-red" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[var(--text)] sm:text-3xl">
                Built for blockchain developers
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[var(--text-muted)]">
                Covering the technologies and protocols that matter most in the
                Web3 ecosystem.
              </p>

              <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-3">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-1.5 text-sm font-medium text-[var(--text)]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <GraduationCap className="mx-auto h-10 w-10 text-mst-red" />
          <h2 className="mt-6 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">
            Ready to start your blockchain journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--text-muted)]">
            Join Masterstroke Academy and go from zero blockchain knowledge to
            building and deploying production-grade decentralized applications.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-mst-red px-8 py-3.5 font-semibold text-white shadow-lg shadow-mst-red/20 transition-all hover:bg-mst-red-dark hover:shadow-xl hover:shadow-mst-red/30"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-8 py-3.5 font-semibold text-[var(--text)] transition-all hover:border-mst-red hover:bg-[var(--bg-muted)]"
            >
              Explore the Learning Tree
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
