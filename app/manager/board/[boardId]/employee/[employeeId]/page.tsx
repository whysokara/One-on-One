import Link from "next/link";
import { notFound } from "next/navigation";
import { AddPrivateNoteForm } from "@/components/entry-forms";
import { AppFrame, EmptyState, PageHeader, SectionCard, TimelineCard } from "@/components/ui";
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
  const sharedCount = payload.entries.filter((entry) => entry.visibility === "shared").length;
  const lastUpdated = payload.entries[0]?.updatedAt ?? payload.employee.updatedAt;

  return (
    <AppFrame user={user}>
      <div className="flex w-full flex-col gap-5">
        <div className="flex items-center gap-3 text-sm text-ink/60">
          <Link href={`/manager/board/${boardId}`} className="font-medium text-pine">
            Back to Board
          </Link>
          <span>/</span>
          <span>{payload.employee.fullName}</span>
        </div>

        <PageHeader
          eyebrow="Employee Timeline"
          title={payload.employee.fullName}
          description={payload.employee.email}
          aside={
            <>
              <div className="rounded-[22px] bg-sand px-4 py-4 text-sm text-ink/75">
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink/45">Shared Entries</div>
                <div className="mt-1.5 text-lg font-semibold text-ink">{sharedCount}</div>
              </div>
              <div className="rounded-[22px] bg-fog px-4 py-4 text-sm text-ink/75">
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink/45">Last Updated</div>
                <div className="mt-1.5 text-base font-semibold text-ink">{formatRelativeDate(lastUpdated)}</div>
              </div>
            </>
          }
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.32fr)_22rem]">
          <div className="space-y-5">
            <SectionCard title="Filters" description="Narrow the timeline by category or by what the employee shared versus what you noted privately.">
              <form className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <input type="hidden" name="boardId" value={boardId} />
                <select
                  name="category"
                  defaultValue={category}
                  className="min-h-12 rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-ink"
                >
                  <option value="all">All Categories</option>
                  {ALL_CATEGORIES.map((option) => (
                    <option key={option} value={option}>
                      {slugifyCategory(option)}
                    </option>
                  ))}
                </select>
                <select
                  name="visibility"
                  defaultValue={visibility}
                  className="min-h-12 rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-ink"
                >
                  <option value="all">All Visibility</option>
                  <option value="shared">Shared Entries</option>
                  <option value="manager_private">Manager Private Notes</option>
                </select>
                <button className="inline-flex min-h-11 items-center justify-center rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white">
                  Apply
                </button>
              </form>
            </SectionCard>

            <SectionCard title="Timeline" description="Shared entries and private manager notes appear together in chronological order.">
              <div className="space-y-4">
                {visibleEntries.length ? (
                  visibleEntries.map((entry) => (
                    <TimelineCard
                      key={entry.id}
                      date={entry.entryDate}
                      category={entry.category}
                      title={entry.title}
                      description={entry.description}
                      visibility={entry.visibility}
                    />
                  ))
                ) : (
                  <EmptyState title="Nothing matches this filter" body="Try a broader category or visibility setting." />
                )}
              </div>
            </SectionCard>
          </div>

          <div className="xl:sticky xl:top-24 xl:self-start">
            <SectionCard title="Add Private Note" description="These notes stay visible only to the manager and help preserve coaching context.">
              <AddPrivateNoteForm boardId={boardId} employeeId={employeeId} categories={MANAGER_CATEGORIES} />
            </SectionCard>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
