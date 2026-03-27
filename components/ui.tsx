import Link from "next/link";
import { logoutAction } from "@/lib/actions";
import { User } from "@/lib/types";
import { cn, formatDate, formatRelativeDate, slugifyCategory } from "@/lib/utils";

const PANEL = "rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[0_10px_30px_rgba(16,24,40,0.04)]";

export function AppFrame({
  user,
  children,
}: {
  user?: User | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent text-[color:var(--ink)]">
      <header className="px-4 pt-4 md:px-6 md:pt-5">
        <div className="mx-auto flex max-w-[var(--app-max-width)] items-center justify-between gap-4 rounded-2xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 backdrop-blur">
          <Link href="/" className="min-w-0 text-[color:var(--ink)]">
            <div className="text-[1.05rem] font-semibold tracking-[-0.03em]">One-on-One</div>
            <div className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">Performance memory for teams</div>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden max-w-[14rem] truncate rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-xs text-[color:var(--muted)] md:inline-flex">
                  {user.fullName}
                </span>
                <form action={logoutAction}>
                  <button className="inline-flex h-10 items-center rounded-xl border border-[color:var(--line)] bg-white px-4 text-sm font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--mist)]">
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex h-10 items-center rounded-xl border border-[color:var(--line)] bg-white px-4 text-sm font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--mist)]">
                  Log in
                </Link>
                <Link href="/signup" className="inline-flex h-10 items-center rounded-xl bg-[color:var(--hero)] px-4 text-sm font-medium text-white transition hover:bg-[color:var(--hero-strong)]">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[var(--app-max-width)] flex-1 px-4 py-4 md:px-6 md:py-5">{children}</main>
      <footer className="px-4 pb-4 md:px-6 md:pb-5">
        <div className="mx-auto flex max-w-[var(--app-max-width)] flex-col gap-1 rounded-2xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.7)] px-4 py-3 text-xs text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>{new Date().getFullYear()} One-on-One. Review conversations run better with evidence.</p>
          <p>
            Made by{" "}
            <a href="https://x.com/whysokara" target="_blank" rel="noreferrer" className="font-medium text-[color:var(--hero)]">
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
    <div className="inline-flex h-7 items-center rounded-lg border border-white/14 bg-white/8 px-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/84">
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(PANEL, "p-5 md:p-6", className)}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          {eyebrow ? <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">{eyebrow}</div> : null}
          <h1 className="mt-2 max-w-4xl text-[1.95rem] font-semibold tracking-[-0.045em] text-[color:var(--ink)] md:text-[2.35rem]">
            {title}
          </h1>
          {description ? <p className="mt-3 max-w-3xl text-[15px] leading-6 text-[color:var(--muted)]">{description}</p> : null}
        </div>
        {aside ? <div className="grid gap-3">{aside}</div> : null}
      </div>
    </section>
  );
}

export function InfoStrip({
  items,
  className,
  itemClassName,
}: {
  items: Array<{ label: string; value: string }>;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className={cn("grid gap-2 md:grid-cols-3", className)}>
      {items.map((item) => (
        <div key={item.label} className={cn("rounded-xl border border-white/10 bg-white/8 px-3 py-3", itemClassName)}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">{item.label}</div>
          <div className="mt-2 text-sm leading-6 text-white/88">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function SectionCard({
  title,
  children,
  description,
  actions,
  className,
}: {
  title: string;
  children: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(PANEL, "p-4 md:p-5", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h2 className="text-[1.1rem] font-semibold tracking-[-0.03em] text-[color:var(--ink)]">{title}</h2>
          {description ? <p className="mt-1.5 text-sm leading-6 text-[color:var(--muted)]">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
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
    <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</div>
      <div className="mt-2 text-[1.55rem] font-semibold tracking-[-0.04em] text-[color:var(--ink)]">{value}</div>
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
    <div className="rounded-xl border border-dashed border-[color:var(--line)] bg-[rgba(255,255,255,0.72)] px-4 py-4">
      <div className="text-base font-medium text-[color:var(--ink)]">{title}</div>
      <p className="mt-1.5 text-sm leading-6 text-[color:var(--muted)]">{body}</p>
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
    <article className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-4">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
        <span>{formatDate(date)}</span>
        <span className="rounded-md bg-[color:var(--mist)] px-2 py-1 normal-case tracking-normal text-[color:var(--muted)]">
          {slugifyCategory(category)}
        </span>
        {visibility ? (
          <span
            className={cn(
              "rounded-md px-2 py-1 normal-case tracking-normal",
              visibility === "manager_private" ? "bg-[color:var(--hero)] text-white" : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]",
            )}
          >
            {visibility === "manager_private" ? "Manager Private" : "Shared"}
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[color:var(--ink)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{description}</p>
    </article>
  );
}

export function TimelineTable({
  rows,
}: {
  rows: Array<{
    id: string;
    date: string;
    category: string;
    title: string;
    description: string;
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)]">
      <div className="hidden grid-cols-[7rem_8rem_minmax(0,1fr)] gap-4 border-b border-[color:var(--line)] bg-[color:var(--mist)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)] md:grid">
        <div>Date</div>
        <div>Category</div>
        <div>Entry</div>
      </div>
      <div className="divide-y divide-[color:var(--line)]">
        {rows.map((row) => (
          <div key={row.id} className="grid gap-2 px-4 py-3 md:grid-cols-[7rem_8rem_minmax(0,1fr)] md:gap-4">
            <div className="text-sm text-[color:var(--muted)]">{formatDate(row.date)}</div>
            <div>
              <span className="inline-flex rounded-md bg-[color:var(--mist)] px-2 py-1 text-xs text-[color:var(--muted)]">
                {slugifyCategory(row.category)}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[color:var(--ink)]">{row.title}</div>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{row.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemberCard({
  name,
  email,
  entryCount,
  lastUpdated,
  href,
  actions,
}: {
  name: string;
  email: string;
  entryCount: number;
  lastUpdated: string;
  href: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
      <div className="min-w-0">
        <div className="text-base font-semibold tracking-[-0.02em] text-[color:var(--ink)]">{name}</div>
        <div className="mt-1 truncate text-sm text-[color:var(--muted)]">{email}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]">
        <span className="rounded-md bg-[color:var(--mist)] px-2.5 py-1.5">{entryCount} entries</span>
        <span className="rounded-md bg-[color:var(--mist)] px-2.5 py-1.5">Updated {formatRelativeDate(lastUpdated)}</span>
        <Link href={href} className="inline-flex h-10 items-center rounded-xl border border-[color:var(--line)] bg-white px-4 font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--mist)]">
          View profile
        </Link>
        {actions}
      </div>
    </div>
  );
}
