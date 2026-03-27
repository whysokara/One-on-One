export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[var(--app-max-width)] items-start px-4 py-5 md:px-6">
      <div className="grid w-full gap-4">
        <div className="h-40 animate-pulse rounded-2xl border border-[color:var(--line)] bg-white/70" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <div className="h-72 animate-pulse rounded-2xl border border-[color:var(--line)] bg-white/60" />
          <div className="h-72 animate-pulse rounded-2xl border border-[color:var(--line)] bg-white/60" />
        </div>
      </div>
    </div>
  );
}
