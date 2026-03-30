"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-100 bg-white p-8 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="mb-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Error Experienced</div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">The request failed.</h1>
        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500 max-w-md mx-auto">
          We encountered an unexpected error while processing this page. Please try refreshing or return to the dashboard.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex h-10 items-center justify-center rounded-lg bg-blue-700 px-6 text-sm font-bold text-white transition-colors hover:bg-blue-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
