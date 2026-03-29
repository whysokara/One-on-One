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
    <div className="app-frame">
      {/* Blended Corporate Header */}
      <header className="app-header">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-700 text-white font-display text-[10px] font-extrabold tracking-[0.18em]">
              1:1
            </div>
            <div className="font-display text-xl font-extrabold tracking-tight text-slate-900 hidden sm:block">
              One on One
            </div>
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <span className="hidden max-w-[12rem] truncate rounded bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 md:inline-flex">
                  {user.fullName}
                </span>
                <form action={logoutAction}>
                  <button className="flex h-9 items-center rounded border border-slate-200 bg-transparent px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="flex h-9 items-center rounded px-4 text-xs font-bold text-slate-600 transition hover:text-slate-900 hover:bg-slate-100">
                  Log in
                </Link>
                <Link href="/signup" className="flex h-9 items-center rounded-lg bg-blue-700 px-4 text-xs font-bold text-white transition hover:bg-blue-800">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="app-main">
        {children}
      </main>

      <footer className="px-4 pb-4 md:px-6 md:pb-5">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 rounded-2xl border border-slate-200 bg-white/75 px-4 py-3 text-xs text-slate-500 backdrop-blur md:flex-row md:items-center md:justify-between">
          <p>{new Date().getFullYear()} One on One.</p>
          <p>
            Made by{" "}
            <a href="https://x.com/whysokara" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 hover:text-blue-800">
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
    <div className="inline-flex h-6 lg:h-7 items-center rounded-full bg-blue-50 px-3 text-[10px] lg:text-xs font-bold uppercase tracking-widest text-blue-700 border border-blue-100">
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
    <section className={cn("panel p-6 md:p-8 flex-shrink-0 relative overflow-hidden", className)}>
      {/* Removed absolute background glows for corporate feel */}
      
      <div className="relative flex flex-col gap-6 justify-between items-start">
        <div className="min-w-0 flex-1">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            {title}
          </h1>
        </div>
        {aside ? <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full">{aside}</div> : null}
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
    <div className={cn("grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item) => (
          <div key={item.label} className={cn("rounded-xl border border-slate-100 bg-white p-4 transition hover:border-blue-200", itemClassName)}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{item.label}</div>
          <div className="mt-1.5 font-display text-sm font-bold text-slate-800">{item.value}</div>
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
    <section className={cn("panel section-card flex flex-col overflow-hidden", className)}>
      <div className="panel-header">
        <div className="min-w-0">
          <h2 className="font-display text-base font-bold tracking-tight text-slate-800">{title}</h2>
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      <div className="panel-body">{children}</div>
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
    <div className="summary-card">
      <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
      <div className="font-display text-xl font-extrabold text-blue-700">{value}</div>
    </div>
  );
}

export function BoardYearStrip({
  total,
  certifications,
  awards,
  needsAttention,
}: {
  total: number;
  certifications: number;
  awards: number;
  needsAttention: number;
}) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryTile label="This year" value={total} />
      <SummaryTile label="Certifications" value={certifications} />
      <SummaryTile label="Awards" value={awards} />
      <SummaryTile label="Needs attention" value={needsAttention} />
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
    <div className="empty-state">
      <div className="font-display text-base font-bold text-slate-800">{title}</div>
      <p className="mt-2 max-w-sm text-sm font-medium text-slate-500">{body}</p>
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
    <article className="group relative overflow-hidden rounded border border-slate-100 bg-white p-4 transition-colors hover:border-blue-200 hover:shadow-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-700" />
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <span className="text-slate-500">{formatDate(date)}</span>
          <span className="rounded bg-slate-100 px-2.5 py-1 normal-case tracking-tight text-slate-700 border border-slate-100">
            {slugifyCategory(category)}
          </span>
        </div>
        {visibility ? (
          <span
            className={cn(
              "rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border",
              visibility === "manager_private" 
                ? "bg-amber-50 text-amber-700 border-amber-100" 
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
            )}
          >
            {visibility === "manager_private" ? "Private" : "Shared"}
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 font-display text-sm font-bold tracking-tight text-slate-900">{title}</h3>
      <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-600">{description}</p>
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
    updatedAt?: string;
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
      <div className="hidden grid-cols-[7rem_8rem_minmax(0,1fr)_7rem] gap-4 border-b border-slate-100 bg-slate-50/70 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 md:grid">
        <div>Date</div>
        <div>Category</div>
        <div>Entry</div>
        <div>Updated</div>
      </div>
      <div className="divide-y divide-slate-200">
        {rows.map((row) => (
          <div key={row.id} className="group grid gap-2 px-4 py-3 transition-colors hover:bg-blue-50/40 md:grid-cols-[7rem_8rem_minmax(0,1fr)_7rem] md:items-start md:gap-4">
            <div className="text-[11px] font-semibold text-slate-500 transition-colors group-hover:text-blue-700">
              {formatDate(row.date)}
            </div>
            <div>
              <span className="inline-flex items-center rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 border border-slate-100">
                {slugifyCategory(row.category)}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900">{row.title}</div>
              <p className="mt-1 text-xs leading-5 text-slate-600">{row.description}</p>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 md:text-right">
              {row.updatedAt ? formatRelativeDate(row.updatedAt) : "—"}
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
  actions,
}: {
  name: string;
  email: string;
  entryCount: number;
  actions?: React.ReactNode;
}) {
  return (
    <div className="group relative panel p-4">
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0">
            <div className="font-display text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-700">{name}</div>
            <div className="truncate text-xs font-medium text-slate-500">{email}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-slate-100">
            {entryCount} entries
          </span>
          {actions ? <div className="relative z-20 self-center">{actions}</div> : null}
        </div>
      </div>
    </div>
  );
}
