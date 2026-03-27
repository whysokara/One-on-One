import Link from "next/link";
import { AddSharedEntryForm, DeleteSharedEntryForm, EditSharedEntryForm } from "@/components/entry-forms";
import { EmptyState, AppFrame, SectionCard, TimelineCard } from "@/components/ui";
import { SHARED_CATEGORIES } from "@/lib/constants";
import { requireRole } from "@/lib/auth";
import { filterEntries, getEmployeeHome } from "@/lib/queries";
import { slugifyCategory } from "@/lib/utils";

export default async function EmployeePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const user = await requireRole("reportee");
  const { category = "all" } = await searchParams;
  const payload = await getEmployeeHome(user.id);

  if (!payload.board) {
    return (
      <AppFrame user={user}>
        <SectionCard title="Join Your Manager's Board">
          <p className="max-w-2xl text-sm leading-6 text-ink/75">
            You have an account, but you are not attached to a board yet. Ask your manager for the invite code or link.
          </p>
          <Link href="/join" className="mt-4 inline-flex rounded-full bg-pine px-4 py-2.5 text-sm font-semibold text-white">
            Join Board
          </Link>
        </SectionCard>
      </AppFrame>
    );
  }

  const visibleEntries = filterEntries(payload.entries, category, "shared");

  return (
    <AppFrame user={user}>
      <div className="space-y-5">
        <section className="rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-card md:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-ink/45">My Timeline</div>
              <h1 className="mt-2 text-[2.2rem] font-semibold tracking-[-0.05em] text-ink">{payload.board.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
                Add proof of work as it happens. Everything here is visible to your manager and easy to revisit during appraisal time.
              </p>
            </div>
            <div className="rounded-2xl bg-fog px-3.5 py-2.5 text-sm text-ink/70">
              Manager: <span className="font-medium text-ink">{payload.manager.fullName}</span>
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[1.28fr_0.92fr]">
          <div className="space-y-5">
            <SectionCard title="Add Entry">
              <AddSharedEntryForm boardId={payload.board.id} categories={SHARED_CATEGORIES} />
            </SectionCard>
            <SectionCard title="My Entries">
              <div className="space-y-4">
                {visibleEntries.length ? (
                  visibleEntries.map((entry) => (
                    <div key={entry.id} className="rounded-[20px] bg-fog p-4">
                      <TimelineCard date={entry.entryDate} category={entry.category} title={entry.title} description={entry.description} />
                      <div className="mt-3 grid gap-3 lg:grid-cols-2">
                        <EditSharedEntryForm entry={entry} categories={SHARED_CATEGORIES} />
                        <DeleteSharedEntryForm entryId={entry.id} />
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState title="No entries yet" body="Use the quick add form above. The MVP is optimized for short, frequent updates." />
                )}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-5">
            <SectionCard title="Filter Timeline">
              <form className="grid gap-3 md:grid-cols-[1fr_auto]">
                <select name="category" defaultValue={category} className="rounded-2xl border border-black/10 bg-white px-3.5 py-2.5 text-sm">
                  <option value="all">All Categories</option>
                  {SHARED_CATEGORIES.map((option) => (
                    <option key={option} value={option}>
                      {slugifyCategory(option)}
                    </option>
                  ))}
                </select>
                <button className="rounded-full bg-pine px-4 py-2.5 text-sm font-semibold text-white">Apply</button>
              </form>
            </SectionCard>
            <SectionCard title="Announcements">
            <div className="space-y-2.5">
              {payload.announcements.length ? (
                payload.announcements.map((announcement) => (
                  <article key={announcement.id} className="rounded-[18px] bg-sand p-3.5">
                    <h3 className="text-base font-semibold text-ink">{announcement.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-ink/75">{announcement.message}</p>
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
