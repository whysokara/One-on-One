import Link from "next/link";
import { AddPrivateNoteForm } from "@/components/entry-forms";
import { EmptyState, AppFrame, SectionCard, TimelineCard } from "@/components/ui";
import { MANAGER_CATEGORIES } from "@/lib/constants";
import { requireRole } from "@/lib/auth";
import { filterEntries, getManagerEmployeeView } from "@/lib/queries";
import { formatRelativeDate } from "@/lib/utils";

export default async function ManagerEmployeePage({
  params,
  searchParams,
}: {
  params: Promise<{ boardId: string; employeeId: string }>;
  searchParams: Promise<{ category?: string; visibility?: string }>;
}) {
  const user = await requireRole("manager");
  const { boardId, employeeId } = await params;
  const { category = "all", visibility = "all" } = await searchParams;
  const payload = await getManagerEmployeeView({ managerId: user.id, boardId, employeeId });

  if (!payload) {
    return (
      <AppFrame user={user}>
        <EmptyState title="Profile not found" body="This employee is not accessible from your account." />
      </AppFrame>
    );
  }

  const visibleEntries = filterEntries(payload.entries, category, visibility);
  const sharedCount = payload.entries.filter((entry) => entry.visibility === "shared").length;
  const lastUpdated = payload.entries[0]?.updatedAt ?? payload.employee.updatedAt;

  return (
    <AppFrame user={user}>
      <div className="space-y-8">
        <div className="flex items-center gap-3 text-sm text-ink/60">
          <Link href={`/manager/board/${boardId}`} className="font-medium text-pine">
            Back to board
          </Link>
          <span>/</span>
          <span>{payload.employee.fullName}</span>
        </div>

        <section className="rounded-[32px] bg-white/85 p-8 shadow-card">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.16em] text-ink/45">Employee timeline</div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{payload.employee.fullName}</h1>
              <p className="mt-2 text-sm text-ink/65">{payload.employee.email}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-ink/70">
              <div className="rounded-full bg-sand px-4 py-2">{sharedCount} shared entries</div>
              <div className="rounded-full bg-fog px-4 py-2">Updated {formatRelativeDate(lastUpdated)}</div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <SectionCard title="Filters">
              <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                <input type="hidden" name="boardId" value={boardId} />
                <select
                  name="category"
                  defaultValue={category}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                >
                  <option value="all">All categories</option>
                  {[
                    "achievement",
                    "learning",
                    "certification",
                    "project_contribution",
                    "appreciation",
                    "blocker",
                    "issue",
                    "other",
                    "positive_observation",
                    "improvement_area",
                    "discipline_issue",
                    "coaching_note",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
                <select
                  name="visibility"
                  defaultValue={visibility}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                >
                  <option value="all">All visibility</option>
                  <option value="shared">Shared entries</option>
                  <option value="manager_private">Manager private notes</option>
                </select>
                <button className="rounded-full bg-pine px-5 py-3 text-sm font-medium text-white">Apply</button>
              </form>
            </SectionCard>

            <SectionCard title="Timeline">
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

          <SectionCard title="Add private note">
            <AddPrivateNoteForm boardId={boardId} employeeId={employeeId} categories={MANAGER_CATEGORIES} />
          </SectionCard>
        </div>
      </div>
    </AppFrame>
  );
}
