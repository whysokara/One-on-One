export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[var(--app-max-width)] items-start px-4 py-6 md:px-6">
      <div className="grid w-full gap-5">
        <div className="h-48 animate-pulse rounded-[28px] bg-white/70" />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-64 animate-pulse rounded-[24px] bg-white/60" />
          <div className="h-64 animate-pulse rounded-[24px] bg-white/60" />
        </div>
      </div>
    </div>
  );
}
