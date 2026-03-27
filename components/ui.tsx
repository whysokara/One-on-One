import Link from "next/link";
import { logoutAction } from "@/lib/actions";
import { User } from "@/lib/types";
import { cn, formatDate, formatRelativeDate, slugifyCategory } from "@/lib/utils";

export function AppFrame({
  user,
  children,
}: {
  user?: User | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-black/5 bg-white/72 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div>
            <Link href="/" className="text-[1.1rem] font-semibold tracking-[-0.04em] text-ink">
              One-on-One
            </Link>
            <p className="text-xs text-ink/55">Performance reviews without memory loss.</p>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-ink/70">
            {user ? <span className="hidden rounded-full bg-fog px-3 py-1 text-xs font-medium text-ink/75 md:inline-flex">{user.fullName}</span> : null}
            {user ? (
              <form action={logoutAction}>
                <button className="rounded-full border border-black/10 px-3.5 py-2 text-ink transition hover:bg-black/5">
                  Log out
                </button>
              </form>
            ) : (
              <>
                <Link href="/login" className="rounded-full border border-black/10 px-3.5 py-2 transition hover:bg-black/5">
                  Log in
                </Link>
                <Link href="/signup" className="rounded-full bg-pine px-3.5 py-2 text-white transition hover:bg-pine/90">
                  Start
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-6">{children}</main>
      <footer className="border-t border-black/5 bg-white/55">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-xs text-ink/58 md:flex-row md:items-center md:justify-between md:px-6">
          <p>{new Date().getFullYear()} One-on-One. Performance memory for serious teams.</p>
          <p>
            Made by{" "}
            <a href="https://x.com/whysokara" target="_blank" rel="noreferrer" className="font-medium text-pine">
              kara
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-current">
      {children}
    </div>
  );
}

export function InfoStrip({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-white/14 bg-white/10 px-4 py-3">
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/62">{item.label}</div>
          <div className="mt-1 text-sm font-medium text-white">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function SectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[24px] border border-white/65 bg-white/88 p-4 shadow-card md:p-5", className)}>
      <h2 className="text-base font-semibold tracking-[-0.02em] text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function SummaryTile({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[22px] border border-black/5 bg-sand p-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/50">{label}</div>
      <div className="mt-1.5 text-[1.7rem] font-semibold tracking-[-0.04em] text-ink">{value}</div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[20px] border border-dashed border-black/10 bg-white/55 p-4 text-sm text-ink/70">
      <div className="font-medium text-ink">{title}</div>
      <p className="mt-1.5 leading-6">{body}</p>
    </div>
  );
}

export function TimelineCard({
  date,
  category,
  title,
  description,
  visibility,
}: {
  date: string;
  category: string;
  title: string;
  description: string;
  visibility?: string;
}) {
  return (
    <article className="rounded-[20px] border border-black/5 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-ink/50">
        <span>{formatDate(date)}</span>
        <span className="rounded-full bg-fog px-2 py-1 normal-case tracking-normal text-ink/70">
          {slugifyCategory(category)}
        </span>
        {visibility ? (
          <span className={cn("rounded-full px-2 py-1 normal-case tracking-normal", visibility === "manager_private" ? "bg-ink text-white" : "bg-moss/15 text-pine")}>
            {visibility === "manager_private" ? "Manager Private" : "Shared"}
          </span>
        ) : null}
      </div>
      <h3 className="mt-2.5 text-base font-semibold tracking-[-0.02em] text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-ink/75">{description}</p>
    </article>
  );
}

export function MemberCard({
  name,
  email,
  entryCount,
  lastUpdated,
  href,
}: {
  name: string;
  email: string;
  entryCount: number;
  lastUpdated: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-fog p-4 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="text-base font-semibold tracking-[-0.02em] text-ink">{name}</div>
        <div className="mt-0.5 text-sm text-ink/65">{email}</div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/65">
        <span>{entryCount} entries</span>
        <span>Updated {formatRelativeDate(lastUpdated)}</span>
        <Link href={href} className="rounded-full bg-white px-3.5 py-2 font-medium text-ink transition hover:bg-white/70">
          View profile
        </Link>
      </div>
    </div>
  );
}
