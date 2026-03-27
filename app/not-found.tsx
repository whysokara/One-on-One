import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[var(--app-max-width)] items-start px-4 py-5 md:px-6">
      <div className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[0_10px_30px_rgba(16,24,40,0.04)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Not found</div>
        <h1 className="mt-2 text-[1.9rem] font-semibold tracking-[-0.04em] text-[color:var(--ink)]">That page is not available.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
          The link may be invalid, expired, or no longer accessible to your account.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex h-10 items-center rounded-xl bg-[color:var(--hero)] px-4 text-sm font-medium text-white transition hover:bg-[color:var(--hero-strong)]">
            Go home
          </Link>
          <Link href="/login" className="inline-flex h-10 items-center rounded-xl border border-[color:var(--line)] bg-white px-4 text-sm font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--mist)]">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
