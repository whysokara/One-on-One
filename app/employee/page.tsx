import Link from "next/link";
import { AddSharedEntryForm } from "@/components/entry-forms";
import { AppFrame, EmptyState, InfoStrip, PageHeader, SectionCard, TimelineTable } from "@/components/ui";
import { SHARED_CATEGORIES } from "@/lib/constants";
import { requireRole } from "@/lib/auth";
import { getEmployeeHome } from "@/lib/queries";

export default async function EmployeePage() {
  const user = await requireRole("reportee");
  const payload = await getEmployeeHome(user.id);

  if (!payload.board) {
    return (
      <AppFrame user={user}>
        <div className="flex w-full flex-col gap-4">
          <PageHeader
            title="You are signed in, but not attached to a board yet."
          />
          <SectionCard title="Join your manager board">
            <Link href="/join" className="inline-flex h-10 items-center rounded-xl bg-[color:var(--hero)] px-4 text-sm font-medium text-white transition hover:bg-[color:var(--hero-strong)]">
              Join board
            </Link>
          </SectionCard>
        </div>
      </AppFrame>
    );
  }

  return (
    <AppFrame user={user}>
      <div className="flex w-full flex-col gap-4">
        <PageHeader
          title={payload.board.name}
          description={`Manager: ${payload.manager.fullName}`}
        />

        <InfoStrip
          items={[
            { label: "Shared entries", value: String(payload.summary.sharedEntriesCount) },
            { label: "Announcements", value: String(payload.summary.announcementCount) },
          ]}
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_20rem]">
          <div className="space-y-4">
            <SectionCard title="Shared timeline">
              <div className="space-y-4">
                {payload.entries.length ? (
                  <TimelineTable
                    rows={payload.entries.map((entry) => ({
                      id: entry.id,
                      date: entry.entryDate,
                      category: entry.category,
                      title: entry.title,
                      description: entry.description,
                      updatedAt: entry.updatedAt,
                    }))}
                  />
                ) : (
                  <EmptyState title="No entries yet" body="Use the form below to capture your first work moment." />
                )}
              </div>
            </SectionCard>

            <SectionCard title="Add a work moment">
              <AddSharedEntryForm boardId={payload.board.id} categories={SHARED_CATEGORIES} />
            </SectionCard>
          </div>

          <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <SectionCard title="Announcements">
              <div className="space-y-3">
                {payload.announcements.length ? (
                  payload.announcements.map((announcement) => (
                    <article key={announcement.id} className="rounded-xl bg-slate-50/80 px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-inset ring-slate-100">
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
