"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[var(--app-max-width)] items-start px-4 py-6 md:px-6">
      <div className="w-full rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember/80">Something went wrong</div>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-ink">This screen failed to load.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
          Try the action again. If the problem keeps happening, refresh the page or restart the local app session.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
