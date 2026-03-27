import Link from "next/link";
import { AddSharedEntryForm, SharedEntryCard } from "@/components/entry-forms";
import { AppFrame, EmptyState, PageHeader, SectionCard, SummaryTile } from "@/components/ui";
import { SHARED_CATEGORIES } from "@/lib/constants";
import { requireRole } from "@/lib/auth";
import { filterEntries, getEmployeeHome, normalizeEntryCategoryFilter } from "@/lib/queries";
import { formatRelativeDate, slugifyCategory } from "@/lib/utils";

export default async function EmployeePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const user = await requireRole("reportee");
  const { category: rawCategory } = await searchParams;
  const category = normalizeEntryCategoryFilter(rawCategory);
  const payload = await getEmployeeHome(user.id);

  if (!payload.board) {
    return (
      <AppFrame user={user}>
        <div className="flex w-full flex-col gap-5">
          <PageHeader
            eyebrow="Reportee Workspace"
            title="You are signed in, but not attached to a board yet."
            description="Ask your manager for an invite code or join link. Once you join, this page becomes your running work timeline."
          />
          <SectionCard title="Join your manager board" description="You only need to do this once.">
            <Link href="/join" className="inline-flex h-10 items-center rounded-xl bg-[color:var(--hero)] px-4 text-sm font-medium text-white transition hover:bg-[color:var(--hero-strong)]">
              Join board
            </Link>
          </SectionCard>
        </div>
      </AppFrame>
    );
  }

  const visibleEntries = filterEntries(payload.entries, category, "shared");
  const latestUpdate = payload.entries[0]?.updatedAt ?? payload.board.updatedAt;

  return (
    <AppFrame user={user}>
      <div className="flex w-full flex-col gap-5">
        <PageHeader
          eyebrow="Reportee Workspace"
          title={payload.board.name}
          description="Capture work while it is still fresh. This timeline is the shared record your manager will read later, so keep entries short, concrete, and useful."
          aside={
            <>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--mist)] px-4 py-4 text-sm text-[color:var(--muted)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Manager</div>
                <div className="mt-1.5 text-base font-semibold text-[color:var(--ink)]">{payload.manager.fullName}</div>
              </div>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Board access</div>
                You are already connected. New entries become visible to your manager after save.
              </div>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryTile label="Shared entries" value={payload.entries.length} />
          <SummaryTile label="Current filter" value={category === "all" ? "All" : slugifyCategory(category)} />
          <SummaryTile label="Last update" value={formatRelativeDate(latestUpdate)} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.36fr)_21rem]">
          <div className="space-y-5">
            <SectionCard title="Add a work moment" description="Think in moments, not essays. What happened, when did it happen, and why does it matter later?">
              <AddSharedEntryForm boardId={payload.board.id} categories={SHARED_CATEGORIES} />
            </SectionCard>

            <SectionCard title="Shared timeline" description="Every saved entry below is already part of the record your manager can review.">
              <div className="space-y-3">
                {visibleEntries.length ? (
                  visibleEntries.map((entry) => <SharedEntryCard key={entry.id} entry={entry} categories={SHARED_CATEGORIES} />)
                ) : (
                  <EmptyState title="No entries yet" body="Use the entry form above to capture a work moment while it is still easy to remember clearly." />
                )}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-5 xl:sticky xl:top-20 xl:self-start">
            <SectionCard title="Filter view" description="Narrow the timeline when you want to scan one type of contribution quickly.">
              <form className="grid gap-3 md:grid-cols-[1fr_auto]">
                <select
                  name="category"
                  defaultValue={category}
                  className="min-h-11 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3.5 py-2.5 text-sm text-[color:var(--ink)]"
                >
                  <option value="all">All categories</option>
                  {SHARED_CATEGORIES.map((option) => (
                    <option key={option} value={option}>
                      {slugifyCategory(option)}
                    </option>
                  ))}
                </select>
                <button className="inline-flex h-10 items-center justify-center rounded-xl bg-[color:var(--hero)] px-4 text-sm font-medium text-white transition hover:bg-[color:var(--hero-strong)]">
                  Apply
                </button>
              </form>
            </SectionCard>

            <SectionCard title="Announcements" description="Short team-wide notes from your manager live here.">
              <div className="space-y-3">
                {payload.announcements.length ? (
                  payload.announcements.map((announcement) => (
                    <article key={announcement.id} className="rounded-xl border border-[color:var(--line)] bg-[color:var(--mist)] px-4 py-4">
                      <h3 className="text-base font-semibold text-[color:var(--ink)]">{announcement.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{announcement.message}</p>
                    </article>
                  ))
                ) : (
                  <EmptyState title="No announcements yet" body="This area will show team-wide updates from your manager." />
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
