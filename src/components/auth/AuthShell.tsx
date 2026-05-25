import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Link
        href="/"
        className="text-sm text-[var(--text-muted)] transition hover:text-mst-red"
      >
        ← Back to home
      </Link>
      <h1 className="mt-6 text-3xl font-black text-[var(--text)]">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm text-[var(--text-muted)]">{subtitle}</p>
      )}
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}

export function DemoFeeNote() {
  return (
    <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
      Demo Fee Display Only. Payment Gateway Integration Pending.
    </p>
  );
}

export function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="rounded-xl border-l-4 border-mst-red bg-mst-red/5 px-4 py-3 text-sm leading-relaxed text-[var(--text)]">
      {children}
    </blockquote>
  );
}

export function DemoFee({ amount }: { amount: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
        Demo Fee
      </p>
      <p className="mt-1 text-2xl font-black text-mst-red">
        ₹{amount.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-sm font-semibold text-[var(--text)]"
    >
      {children}
      {required && <span className="text-mst-red"> *</span>}
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-mst-red focus:ring-1 focus:ring-mst-red ${props.className ?? ""}`}
    />
  );
}

export function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-mst-red focus:ring-1 focus:ring-mst-red ${props.className ?? ""}`}
    />
  );
}

export function SubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-full bg-mst-red py-3 text-sm font-semibold text-white transition hover:bg-mst-red-dark disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-mst-red text-white"
          : "bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)]"
      }`}
    >
      {children}
    </button>
  );
}
