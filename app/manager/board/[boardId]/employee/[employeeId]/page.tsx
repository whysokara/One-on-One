import Link from "next/link";
import { notFound } from "next/navigation";
import { AddPrivateNoteForm, RemoveBoardMemberForm } from "@/components/entry-forms";
import { AppFrame, EmptyState, PageHeader, SectionCard, TimelineCard, TimelineTable } from "@/components/ui";
import { ALL_CATEGORIES, MANAGER_CATEGORIES } from "@/lib/constants";
import { requireRole } from "@/lib/auth";
import {
  filterEntries,
  getManagerEmployeeView,
  normalizeEntryCategoryFilter,
  normalizeEntryVisibilityFilter,
} from "@/lib/queries";
import { formatRelativeDate, slugifyCategory } from "@/lib/utils";

export default async function ManagerEmployeePage({
  params,
  searchParams,
}: {
  params: Promise<{ boardId: string; employeeId: string }>;
  searchParams: Promise<{ category?: string; visibility?: string }>;
}) {
  const user = await requireRole("manager");
  const { boardId, employeeId } = await params;
  const { category: rawCategory, visibility: rawVisibility } = await searchParams;
  const category = normalizeEntryCategoryFilter(rawCategory);
  const visibility = normalizeEntryVisibilityFilter(rawVisibility);
  const payload = await getManagerEmployeeView({ managerId: user.id, boardId, employeeId });

  if (!payload) {
    notFound();
  }

  const visibleEntries = filterEntries(payload.entries, category, visibility);
  const sharedEntries = visibleEntries.filter((entry) => entry.visibility === "shared");
  const privateEntries = visibleEntries.filter((entry) => entry.visibility === "manager_private");
  const sharedCount = payload.entries.filter((entry) => entry.visibility === "shared").length;
  const lastUpdated = payload.entries[0]?.updatedAt ?? payload.employee.updatedAt;

  return (
    <AppFrame user={user}>
      <div className="flex w-full flex-col gap-5">
        <div className="flex items-center gap-3 text-sm text-[color:var(--muted)]">
          <Link href={`/manager/board/${boardId}`} className="font-medium text-[color:var(--hero)]">
            Back to board
          </Link>
          <span>/</span>
          <span>{payload.employee.fullName}</span>
        </div>

        <PageHeader
          eyebrow="Employee Timeline"
          title={payload.employee.fullName}
          description="Shared employee entries and manager-only notes sit here together so the full story stays attached to the right person."
          aside={
            <>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--mist)] px-4 py-4 text-sm text-[color:var(--muted)]">
                <div className="text-[11px] uppercase tracking-[0.16em]">Shared entries</div>
                <div className="mt-1.5 text-lg font-semibold text-[color:var(--ink)]">{sharedCount}</div>
              </div>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-4 text-sm text-[color:var(--muted)]">
                <div className="text-[11px] uppercase tracking-[0.16em]">Last updated</div>
                <div className="mt-1.5 text-base font-semibold text-[color:var(--ink)]">{formatRelativeDate(lastUpdated)}</div>
              </div>
              <div className="rounded-xl border border-[color:var(--accent)]/22 bg-[color:var(--accent-soft)] px-4 py-4 text-sm text-[color:var(--muted)]">
                <div className="text-[11px] uppercase tracking-[0.16em]">Board access</div>
                <div className="mt-2">
                  <RemoveBoardMemberForm boardId={boardId} employeeId={employeeId} redirectToBoard />
                </div>
              </div>
            </>
          }
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.34fr)_21rem]">
          <div className="space-y-5">
            <SectionCard title="Filter timeline" description="Separate what the employee shared from the private manager context you added later.">
              <form className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <input type="hidden" name="boardId" value={boardId} />
                <select
                  name="category"
                  defaultValue={category}
                  className="min-h-11 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3.5 py-2.5 text-sm text-[color:var(--ink)]"
                >
                  <option value="all">All categories</option>
                  {ALL_CATEGORIES.map((option) => (
                    <option key={option} value={option}>
                      {slugifyCategory(option)}
                    </option>
                  ))}
                </select>
                <select
                  name="visibility"
                  defaultValue={visibility}
                  className="min-h-11 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3.5 py-2.5 text-sm text-[color:var(--ink)]"
                >
                  <option value="all">All visibility</option>
                  <option value="shared">Shared entries</option>
                  <option value="manager_private">Manager private notes</option>
                </select>
                <button className="inline-flex h-10 items-center justify-center rounded-xl bg-[color:var(--hero)] px-4 text-sm font-medium text-white transition hover:bg-[color:var(--hero-strong)]">
                  Apply
                </button>
              </form>
            </SectionCard>

            <SectionCard title="Shared timeline" description="Employee-visible entries are shown in compact table form so the record is easy to scan during review conversations.">
              {sharedEntries.length ? (
                <TimelineTable
                  rows={sharedEntries.map((entry) => ({
                    id: entry.id,
                    date: entry.entryDate,
                    category: entry.category,
                    title: entry.title,
                    description: entry.description,
                  }))}
                />
              ) : visibility === "manager_private" ? (
                <EmptyState title="Shared entries hidden by filter" body="You are currently viewing only manager-private notes. Switch visibility to shared or all." />
              ) : (
                <EmptyState title="No shared entries found" body="This employee has not added any shared work moments matching the current filters yet." />
              )}
            </SectionCard>

            <SectionCard title="Manager-only notes" description="Private coaching and manager context stay separate below. These notes never appear in the employee workspace.">
              <div className="space-y-3">
                {privateEntries.length ? (
                  privateEntries.map((entry) => (
                    <TimelineCard
                      key={entry.id}
                      date={entry.entryDate}
                      category={entry.category}
                      title={entry.title}
                      description={entry.description}
                      visibility={entry.visibility}
                    />
                  ))
                ) : visibility === "shared" ? (
                  <EmptyState title="Private notes hidden by filter" body="You are currently looking at shared entries only. Switch visibility to all if you want both." />
                ) : (
                  <EmptyState title="No private notes yet" body="Use the panel on the right to add manager-only context for future one-on-ones or review prep." />
                )}
              </div>
            </SectionCard>
          </div>

          <div className="xl:sticky xl:top-20 xl:self-start">
            <SectionCard title="Add private note" description="These notes stay visible only to the manager and preserve context that should not appear in the shared timeline.">
              <AddPrivateNoteForm boardId={boardId} employeeId={employeeId} categories={MANAGER_CATEGORIES} />
            </SectionCard>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
