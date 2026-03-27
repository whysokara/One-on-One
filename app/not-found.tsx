import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[var(--app-max-width)] items-start px-4 py-6 md:px-6">
      <div className="w-full rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">Not found</div>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-ink">That page does not exist.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
          The link may be invalid, expired, or no longer available to your account.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white">
            Go home
          </Link>
          <Link href="/login" className="inline-flex min-h-11 items-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-ink">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
