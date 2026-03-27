import Link from "next/link";
import { logoutAction } from "@/lib/actions";
import { User } from "@/lib/types";
import { cn, formatDate, formatRelativeDate, slugifyCategory } from "@/lib/utils";

const SURFACE_CLASS = "rounded-[26px] border border-white/70 bg-white/90 shadow-card backdrop-blur";

export function AppFrame({
  user,
  children,
}: {
  user?: User | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/78 backdrop-blur">
        <div className="mx-auto flex max-w-[var(--app-max-width)] items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="min-w-0">
            <Link href="/" className="text-[1.1rem] font-semibold tracking-[-0.04em] text-ink">
              One-on-One
            </Link>
            <p className="mt-0.5 text-xs text-ink/55">Performance reviews without memory loss.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink/70">
            {user ? (
              <span className="hidden max-w-[14rem] truncate rounded-full border border-black/5 bg-fog px-3 py-1.5 text-xs font-medium text-ink/75 md:inline-flex">
                {user.fullName}
              </span>
            ) : null}
            {user ? (
              <form action={logoutAction}>
                <button className="inline-flex min-h-10 items-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink transition hover:bg-black/5">
                  Log out
                </button>
              </form>
            ) : (
              <>
                <Link href="/login" className="inline-flex min-h-10 items-center rounded-full border border-black/10 px-4 py-2 font-medium transition hover:bg-black/5">
                  Log in
                </Link>
                <Link href="/signup" className="inline-flex min-h-10 items-center rounded-full bg-pine px-4 py-2 font-medium text-white transition hover:bg-pine/90">
                  Start
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[var(--app-max-width)] flex-1 px-4 py-5 md:px-6 md:py-6">{children}</main>
      <footer className="border-t border-black/5 bg-white/58">
        <div className="mx-auto flex max-w-[var(--app-max-width)] flex-col gap-1 px-4 py-3 text-xs text-ink/58 md:flex-row md:items-center md:justify-between md:px-6">
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
    <div className="inline-flex rounded-full border border-white/30 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-current">
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
    <section className={cn(SURFACE_CLASS, "overflow-hidden p-5 md:p-6", className)}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-end">
        <div className="min-w-0">
          {eyebrow ? <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">{eyebrow}</div> : null}
          <h1 className="mt-2 text-[2rem] font-semibold leading-[0.98] tracking-[-0.05em] text-ink md:text-[2.5rem]">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/70 md:text-[15px]">{description}</p> : null}
        </div>
        {aside ? <div className="grid gap-3 self-stretch">{aside}</div> : null}
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
    <div className={cn("grid gap-2.5 sm:grid-cols-3", className)}>
      {items.map((item) => (
        <div key={item.label} className={cn("min-w-0 rounded-[20px] border border-white/14 bg-white/10 px-4 py-3.5", itemClassName)}>
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/62">{item.label}</div>
          <div className="mt-1.5 break-words text-sm font-medium leading-6 text-white">{item.value}</div>
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
    <section className={cn(SURFACE_CLASS, "p-4 md:p-5", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-[-0.02em] text-ink">{title}</h2>
          {description ? <p className="mt-1.5 text-sm leading-6 text-ink/68">{description}</p> : null}
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
    <div className="rounded-[22px] border border-black/5 bg-sand p-4 md:p-5">
      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/50">{label}</div>
      <div className="mt-2 text-[1.8rem] font-semibold tracking-[-0.05em] text-ink">{value}</div>
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
    <div className="rounded-[22px] border border-dashed border-black/12 bg-white/55 p-5 text-sm text-ink/70">
      <div className="font-semibold text-ink">{title}</div>
      <p className="mt-2 leading-6">{body}</p>
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
    <article className="rounded-[22px] border border-black/5 bg-white p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-ink/50">
        <span>{formatDate(date)}</span>
        <span className="rounded-full bg-fog px-2.5 py-1 normal-case tracking-normal text-ink/70">
          {slugifyCategory(category)}
        </span>
        {visibility ? (
          <span
            className={cn(
              "rounded-full px-2.5 py-1 normal-case tracking-normal",
              visibility === "manager_private" ? "bg-ink text-white" : "bg-moss/15 text-pine",
            )}
          >
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
    <div className="flex flex-col gap-4 rounded-[22px] border border-black/5 bg-fog/85 p-4 md:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="text-base font-semibold tracking-[-0.02em] text-ink">{name}</div>
        <div className="mt-1 truncate text-sm text-ink/65">{email}</div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/65">
        <span>{entryCount} entries</span>
        <span>Updated {formatRelativeDate(lastUpdated)}</span>
        <Link href={href} className="inline-flex min-h-10 items-center rounded-full bg-white px-4 py-2 font-medium text-ink transition hover:bg-white/70">
          View profile
        </Link>
      </div>
    </div>
  );
}
