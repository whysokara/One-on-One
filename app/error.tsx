"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[var(--app-max-width)] items-start px-4 py-5 md:px-6">
      <div className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[0_10px_30px_rgba(16,24,40,0.04)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">Well, this is awkward</div>
        <h1 className="mt-2 text-[1.9rem] font-semibold tracking-[-0.04em] text-[color:var(--ink)]">The page forgot how to behave.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
          Nothing here looks fatal, but this screen clearly made a poor decision. Try again. If it repeats itself, refresh the app and let the drama pass.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex h-10 items-center rounded-xl bg-[color:var(--hero)] px-4 text-sm font-medium text-white transition hover:bg-[color:var(--hero-strong)]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
