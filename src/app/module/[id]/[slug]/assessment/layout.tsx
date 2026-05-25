export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {children}
    </div>
  );
}
