"use client";

import Link from "next/link";
import { Typewriter } from "@/components/marketing/Typewriter";
import { AnimatedCounter } from "@/components/marketing/AnimatedCounter";
import { useInView } from "@/components/marketing/useInView";
import { RevealSection } from "@/components/marketing/RevealSection";
import { MarketingHeroBackground } from "@/components/marketing/MarketingHeroBackground";
import type { Phase } from "@/lib/types";
import { PHASE_HOURS } from "@/lib/academy-overview";
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
  Sparkles,
  Shield,
  Cpu,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: TreePine,
    title: "Interactive Learning Tree",
    description:
      "Navigate a visual learning tree that maps your entire journey from fundamentals to advanced topics.",
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: Monitor,
    title: "Full-screen Assessments",
    description:
      "Test your knowledge with immersive, lockdown-mode assessments designed to validate real understanding.",
    gradient: "from-mst-red/20 to-orange-500/10",
  },
  {
    icon: Code2,
    title: "Live Code Execution",
    description:
      "Write and execute Solidity, JavaScript, and more directly in the browser with instant feedback.",
    gradient: "from-purple-500/20 to-pink-500/10",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Track completion across all 4 phases and 21 modules with detailed analytics on your progress.",
    gradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: Link2,
    title: "Blockchain Focus",
    description:
      "Purpose-built for Web3. Every module is tailored to blockchain development, DeFi, NFTs, and DAOs.",
    gradient: "from-amber-500/20 to-yellow-500/10",
  },
  {
    icon: Award,
    title: "Certificate on Completion",
    description:
      "Earn a verifiable certificate upon completing the full curriculum, proving your blockchain expertise.",
    gradient: "from-rose-500/20 to-red-500/10",
  },
];

const PHASE_ICONS = [Blocks, Cpu, Layers, Rocket];
const PHASE_COLORS = [
  "var(--accent-blue)",
  "var(--mst-red)",
  "var(--accent-purple)",
  "var(--accent-green)",
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
  "Hardhat",
  "ZK Proofs",
  "RWA",
  "MST Chain",
  "Token Standards",
  "Layer 2",
  "Web3.js",
  "Security Audits",
];

interface LandingPageProps {
  phases: Phase[];
  moduleCount: number;
  submoduleCount: number;
}

export function LandingPage({
  phases,
  moduleCount,
  submoduleCount,
}: LandingPageProps) {
  const statsRef = useInView(0.25);

  return (
    <div className="overflow-hidden bg-[var(--bg)]">
      {/* Hero */}
      <section className="bg-grid relative flex min-h-screen flex-col overflow-hidden">
        <MarketingHeroBackground tall />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-16 pt-24 sm:px-6 sm:pt-32 lg:pt-36">
          <div className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center text-center">
            <p className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-gradient-to-r from-mst-red/15 via-[var(--surface)]/50 to-[var(--accent-purple)]/15 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-mst-red shadow-lg shadow-mst-red/10 backdrop-blur-md">
              <Sparkles className="h-4 w-4 animate-pulse-subtle" />
              MST Blockchain Academy
            </p>

            <h1 className="text-display animate-slide-up mt-10 font-black text-[var(--text)]">
              Master Blockchain
              <br />
              <Typewriter
                strings={[
                  "From Zero to Production",
                  "Learn • Build • Deploy",
                  "Fundamentals to Capstone",
                  "130+ Hours of Web3",
                ]}
                speedMs={38}
                pauseMs={950}
                className="text-gradient-red animate-gradient"
              />
            </h1>

            <p className="animate-slide-up stagger-2 mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-[var(--text-muted)] sm:text-2xl sm:leading-relaxed">
              A structured, industry-aligned Web3 programme — interactive lessons,
              live code, rigorous assessments, and a funnel built for fellowship,
              PPO, and lifetime MSTC rewards.
            </p>
            <p className="animate-slide-up stagger-3 mx-auto mt-4 max-w-2xl text-sm font-semibold uppercase tracking-[0.25em] text-mst-red">
              Lifetime access • 19-year MSTC reward stream • internship & hiring support
            </p>

            <div className="animate-slide-up stagger-4 mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/learn"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-mst-red via-red-600 to-mst-red bg-[length:200%_100%] px-10 py-4 text-lg font-bold text-white shadow-xl shadow-mst-red/30 transition hover:shadow-2xl hover:shadow-mst-red/40 animate-gradient"
              >
                <span className="btn-shimmer absolute inset-0" />
                <span className="relative flex items-center gap-2">
                  Start Learning
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/academy-overview"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--border-strong)] bg-[var(--surface)]/80 px-10 py-4 text-lg font-bold text-[var(--text)] backdrop-blur-md transition hover:border-mst-red hover:bg-[var(--bg-muted)]"
              >
                Explore Curriculum
              </Link>
            </div>

            {/* Inline hero stats */}
            <div className="animate-slide-up stagger-4 mt-14 flex flex-wrap justify-center gap-3">
              {[
                { v: "4", l: "Phases" },
                { v: String(moduleCount), l: "Modules" },
                { v: `${submoduleCount}+`, l: "Lessons" },
                { v: "130+", l: "Hours" },
              ].map((pill) => (
                <span
                  key={pill.l}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-5 py-2 text-sm font-semibold backdrop-blur-sm"
                >
                  <span className="text-gradient-red font-black">{pill.v}</span>{" "}
                  <span className="text-[var(--text-muted)]">{pill.l}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Phase path — larger */}
          <div className="animate-slide-up stagger-5 mx-auto mt-16 w-full max-w-5xl lg:mt-20">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/50 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="absolute inset-x-12 top-[4.5rem] hidden h-1 rounded-full bg-gradient-to-r from-[var(--accent-blue)] via-mst-red to-[var(--accent-green)] sm:block" />
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                {phases.map((phase, i) => {
                  const Icon = PHASE_ICONS[i] ?? Blocks;
                  const color = PHASE_COLORS[i];
                  const hours = PHASE_HOURS[phase.id]?.hours;
                  return (
                    <div
                      key={phase.id}
                      className="group relative flex flex-col items-center text-center"
                    >
                      <div
                        className="icon-pulse-glow relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 bg-[var(--bg)] shadow-xl transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20"
                        style={{ borderColor: color }}
                      >
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8" style={{ color }} />
                      </div>
                      <p
                        className="mt-4 text-sm font-bold uppercase tracking-wider"
                        style={{ color }}
                      >
                        Phase {i + 1}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[var(--text-muted)] sm:text-sm">
                        {phase.modules.length} modules
                        {hours ? ` · ~${hours}h` : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <a
            href="#stats"
            className="scroll-hint mx-auto mt-12 flex flex-col items-center gap-1 text-[var(--text-muted)] transition hover:text-mst-red"
          >
            <span className="text-xs font-semibold uppercase tracking-widest">
              Scroll
            </span>
            <ChevronDown className="h-6 w-6" />
          </a>
        </div>
      </section>

      {/* Stats */}
      <section
        id="stats"
        ref={statsRef.ref}
        className="relative border-y border-[var(--border)] bg-gradient-to-r from-[var(--bg-elevated)] via-[var(--surface)] to-[var(--bg-elevated)] py-4"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-subtle opacity-80" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
          {[
            { end: 4, suffix: "", label: "Phases" },
            { end: moduleCount, suffix: "", label: "Modules" },
            { end: submoduleCount, suffix: "+", label: "Submodules" },
            { end: 130, suffix: "+", label: "Hours" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`border-[var(--border)] px-6 py-16 text-center sm:py-20 ${
                i > 0 ? "border-l" : ""
              } ${statsRef.visible ? "animate-scale-in" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <p className="text-4xl font-black text-gradient-red sm:text-6xl">
                {statsRef.visible ? (
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                ) : (
                  "0"
                )}
              </p>
              <p className="mt-3 text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mst-red">
              Platform Features
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
              Everything you need to become a{" "}
              <span className="text-gradient-red">blockchain developer</span>
            </h2>
          </RevealSection>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <RevealSection key={feature.title} delay={i * 60}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-mst-red/40 hover:shadow-2xl">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition duration-500 group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-mst-red/10 ring-2 ring-mst-red/20">
                      <feature.icon className="h-7 w-7 text-mst-red" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboard" className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mst-red">
              Leaderboard
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
              Top performers earning MSTC, streak rewards, and real placement momentum
            </h2>
            <p className="mt-5 text-lg text-[var(--text-muted)]">
              See the cohort champions, daily streaks, and the students leading the Web3 movement.
            </p>
          </RevealSection>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {[
              {
                name: "Aarya S.",
                score: "98.2",
                coins: "12 MSTC",
                streak: "18 days",
                rank: "1",
              },
              {
                name: "Kiran P.",
                score: "94.5",
                coins: "9 MSTC",
                streak: "16 days",
                rank: "2",
              },
              {
                name: "Meera T.",
                score: "91.7",
                coins: "8 MSTC",
                streak: "14 days",
                rank: "3",
              },
            ].map((item) => (
              <RevealSection key={item.name} delay={80}>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-left shadow-xl shadow-black/5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        Rank {item.rank}
                      </p>
                      <p className="mt-3 text-2xl font-black text-[var(--text)]">{item.name}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-mst-red/10 text-mst-red">
                      {item.rank}
                    </div>
                  </div>
                  <div className="mt-8 space-y-3 text-sm text-[var(--text-muted)]">
                    <div className="flex items-center justify-between rounded-2xl bg-[var(--bg)] px-4 py-3">
                      <span>Score</span>
                      <span className="font-semibold text-[var(--text)]">{item.score}%</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-[var(--bg)] px-4 py-3">
                      <span>Coin reward</span>
                      <span className="font-semibold text-[var(--text)]">{item.coins}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-[var(--bg)] px-4 py-3">
                      <span>Streak</span>
                      <span className="font-semibold text-[var(--text)]">{item.streak}</span>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section
        id="curriculum"
        className="relative border-t border-[var(--border)] bg-[var(--bg-elevated)] py-24 sm:py-32"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-[32rem] w-[32rem] rounded-full bg-mst-red/8 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mst-red">
              Curriculum
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
              4 phases to blockchain mastery
            </h2>
            <p className="mt-5 text-lg text-[var(--text-muted)]">
              Progressive syllabus from internet foundations to capstone deployment
              and grant funding.
            </p>
          </RevealSection>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {phases.map((phase, i) => {
              const Icon = PHASE_ICONS[i] ?? Blocks;
              const color = PHASE_COLORS[i];
              const hours = PHASE_HOURS[phase.id];
              return (
                <RevealSection key={phase.id} delay={i * 80}>
                  <div className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:p-10">
                    <div
                      className="absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20 blur-3xl transition duration-500 group-hover:opacity-50"
                      style={{ backgroundColor: color }}
                    />
                    <div
                      className="absolute right-6 top-6 text-[6rem] font-black leading-none opacity-[0.06]"
                      style={{ color }}
                    >
                      {i + 1}
                    </div>
                    <div className="relative">
                      <div
                        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: `${color}22` }}
                      >
                        <Icon className="h-7 w-7" style={{ color }} />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="text-sm font-bold uppercase tracking-wider"
                          style={{ color }}
                        >
                          Phase {i + 1}
                        </span>
                        <span className="text-sm text-[var(--text-muted)]">
                          · {phase.modules.length} modules
                          {hours ? ` · ~${hours.hours} hrs` : ""}
                        </span>
                      </div>
                      <h3 className="mt-3 text-2xl font-bold leading-snug text-[var(--text)]">
                        {phase.title}
                      </h3>
                    </div>
                  </div>
                </RevealSection>
              );
            })}
          </div>

          <RevealSection className="mt-14 text-center">
            <Link
              href="/academy-overview"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-mst-red/40 bg-gradient-to-r from-mst-red/10 to-[var(--accent-purple)]/10 px-8 py-4 text-base font-bold text-mst-red transition hover:bg-mst-red hover:text-white"
            >
              View full curriculum with every submodule
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mst-red">
              Pricing Plans
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
              Choose the path that fits your Web3 ambition
            </h2>
            <p className="mt-5 text-lg text-[var(--text-muted)]">
              Lifetime course access, MSTC reward fraction, career-ready internships, and a dedicated leaderboard for top performers.
            </p>
          </RevealSection>

          <div className="mt-16 grid gap-6 lg:grid-cols-4">
            {[
              {
                title: "Student Plan",
                price: "₹14,999",
                description: "Full course with 2-month paid internship and 1 MSTC reward fraction.",
                badge: "Best for learners",
              },
              {
                title: "Validator Plan",
                price: "₹9,999",
                description: "Lifetime access plus validator reward fraction and early node readiness.",
                badge: "Best for builders",
              },
              {
                title: "General Plan",
                price: "₹19,999",
                description: "Full access, internship support, and MSTC reward fraction for serious professionals.",
                badge: "Full ecosystem",
              },
              {
                title: "Course Pass",
                price: "₹2,999",
                description: "Course-only access without internship or MSTC reward fraction.",
                badge: "Self-paced learners",
              },
            ].map((plan) => (
              <RevealSection key={plan.title} delay={80}>
                <div className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 transition hover:-translate-y-1 hover:shadow-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        {plan.badge}
                      </p>
                      <h3 className="mt-4 text-2xl font-black text-[var(--text)]">
                        {plan.title}
                      </h3>
                    </div>
                    <span className="rounded-2xl bg-mst-red/10 px-4 py-2 text-sm font-semibold text-mst-red">
                      {plan.price}
                    </span>
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-[var(--text-muted)]">
                    {plan.description}
                  </p>
                  <div className="mt-8">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mst-red to-red-600 px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
                    >
                      Enroll now
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-12">
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[var(--surface)] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[var(--surface)] to-transparent" />
          <div className="marquee-track gap-4 px-4">
            {[...topics, ...topics].map((topic, i) => (
              <span
                key={`${topic}-${i}`}
                className="shrink-0 rounded-full border border-[var(--border)] bg-gradient-to-r from-[var(--bg-elevated)] to-[var(--surface)] px-6 py-2.5 text-base font-semibold text-[var(--text)] shadow-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection>
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--bg-muted)] to-[var(--surface)] p-10 sm:p-14">
              <div className="bg-pattern-dots absolute inset-0 opacity-40" />
              <div className="hero-mesh absolute inset-0 opacity-30" />
              <div className="relative grid gap-10 sm:grid-cols-3">
                {[
                  {
                    icon: Shield,
                    title: "75% pass rule",
                    desc: "Unlock the next lesson only when you truly understand the material.",
                  },
                  {
                    icon: Zap,
                    title: "Live on MST Chain",
                    desc: "Deploy and test on an EVM-compatible hybrid Layer-1 built for India.",
                  },
                  {
                    icon: GraduationCap,
                    title: "College integrated",
                    desc: "Structured syllabus aligned with academic and industry standards.",
                  },
                ].map((item) => (
                  <div key={item.title} className="text-center sm:text-left">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mst-red/10 ring-1 ring-mst-red/20 sm:mx-0">
                      <item.icon className="h-7 w-7 text-mst-red" />
                    </div>
                    <p className="text-lg font-bold text-[var(--text)]">{item.title}</p>
                    <p className="mt-2 text-base text-[var(--text-muted)]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-[var(--border)]">
        <MarketingHeroBackground />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <RevealSection>
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-mst-red to-red-700 shadow-2xl shadow-mst-red/40 icon-pulse-glow">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
              Ready to start your{" "}
              <span className="text-gradient-red">Web3 journey</span>?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--text-muted)]">
              Join Masterstroke Academy — from zero blockchain knowledge to
              building, auditing, and pitching production-grade dApps.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-mst-red to-red-600 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-mst-red/30 transition hover:shadow-2xl"
              >
                <span className="btn-shimmer absolute inset-0" />
                <span className="relative flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--border-strong)] bg-[var(--surface)] px-10 py-4 text-lg font-bold text-[var(--text)] transition hover:border-mst-red"
              >
                Open Learning Tree
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
