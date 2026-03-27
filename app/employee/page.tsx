import Link from "next/link";
import { AddSharedEntryForm, SharedEntryCard } from "@/components/entry-forms";
import { EmptyState, AppFrame, PageHeader, SectionCard } from "@/components/ui";
import { SHARED_CATEGORIES } from "@/lib/constants";
import { requireRole } from "@/lib/auth";
import { filterEntries, getEmployeeHome, normalizeEntryCategoryFilter } from "@/lib/queries";
import { slugifyCategory } from "@/lib/utils";

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
            eyebrow="Employee Workspace"
            title="You’re signed in but not attached to a board yet."
            description="Ask your manager for an invite code or join link. Once you join, this page becomes your running work timeline."
          />
          <SectionCard title="Join your manager’s board">
            <Link href="/join" className="inline-flex min-h-11 items-center rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white">
              Join board
            </Link>
          </SectionCard>
        </div>
      </AppFrame>
    );
  }

  const visibleEntries = filterEntries(payload.entries, category, "shared");

  return (
    <AppFrame user={user}>
      <div className="flex w-full flex-col gap-5">
        <PageHeader
          eyebrow="My Timeline"
          title={payload.board.name}
          description="Add proof of work as it happens. Everything here is visible to your manager and easy to revisit during appraisal time."
          aside={
            <div className="rounded-[22px] bg-fog px-4 py-4 text-sm text-ink/70">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">Manager</div>
              <div className="mt-1.5 text-base font-semibold text-ink">{payload.manager.fullName}</div>
            </div>
          }
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_22rem]">
          <div className="space-y-5">
            <SectionCard title="Add entry" description="Keep updates short, specific, and easy to revisit later.">
              <AddSharedEntryForm boardId={payload.board.id} categories={SHARED_CATEGORIES} />
            </SectionCard>
            <SectionCard title="My entries" description="Everything below is part of the shared employee timeline.">
              <div className="space-y-4">
                {visibleEntries.length ? (
                  visibleEntries.map((entry) => (
                    <SharedEntryCard key={entry.id} entry={entry} categories={SHARED_CATEGORIES} />
                  ))
                ) : (
                  <EmptyState title="No entries yet" body="Use the quick add form above. The MVP is optimized for short, frequent updates." />
                )}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
            <SectionCard title="Filter timeline" description="Narrow the list when you want to scan a specific kind of work evidence.">
              <form className="grid gap-3 md:grid-cols-[1fr_auto]">
                <select name="category" defaultValue={category} className="min-h-12 rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-ink">
                  <option value="all">All Categories</option>
                  {SHARED_CATEGORIES.map((option) => (
                    <option key={option} value={option}>
                      {slugifyCategory(option)}
                    </option>
                  ))}
                </select>
                <button className="inline-flex min-h-11 items-center justify-center rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white">
                  Apply
                </button>
              </form>
            </SectionCard>
            <SectionCard title="Announcements" description="Team-wide reminders and rollout notes from your manager.">
              <div className="space-y-3">
                {payload.announcements.length ? (
                  payload.announcements.map((announcement) => (
                    <article key={announcement.id} className="rounded-[20px] bg-sand p-4">
                      <h3 className="text-base font-semibold text-ink">{announcement.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink/75">{announcement.message}</p>
                    </article>
                  ))
                ) : (
                  <EmptyState title="No announcements yet" body="This section will show team-wide updates from your manager." />
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
