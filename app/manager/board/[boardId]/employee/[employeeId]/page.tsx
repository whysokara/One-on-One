import Link from "next/link";
import { notFound } from "next/navigation";
import { AddPrivateNoteForm, RemoveBoardMemberForm } from "@/components/entry-forms";
import { AppFrame, EmptyState, InfoStrip, SectionCard, TimelineCard, TimelineTable } from "@/components/ui";
import { MANAGER_CATEGORIES } from "@/lib/constants";
import { requireRole } from "@/lib/auth";
import { getManagerEmployeeView } from "@/lib/queries";

export default async function ManagerEmployeePage({
  params,
}: {
  params: Promise<{ boardId: string; employeeId: string }>;
}) {
  const user = await requireRole("manager");
  const { boardId, employeeId } = await params;
  const payload = await getManagerEmployeeView({ managerId: user.id, boardId, employeeId });

  if (!payload) {
    notFound();
  }
  const sharedEntries = payload.entries.filter((entry) => entry.visibility === "shared");
  const privateEntries = payload.entries.filter((entry) => entry.visibility === "manager_private");

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

        <div className="flex items-start justify-between gap-4 rounded-[1.25rem] bg-gradient-to-r from-white via-white to-slate-50/80 px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-inset ring-slate-200/70">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[color:var(--ink)] md:text-4xl">
              {payload.employee.fullName}
            </h1>
          </div>
          <RemoveBoardMemberForm boardId={boardId} employeeId={employeeId} redirectToBoard />
        </div>

        <InfoStrip
          items={[
            { label: "Shared entries", value: String(payload.summary.sharedEntriesCount) },
            { label: "Private notes", value: String(payload.summary.privateNotesCount) },
          ]}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.34fr)_21rem]">
          <div className="space-y-5">
            <SectionCard title="Shared timeline">
              {sharedEntries.length ? (
                <TimelineTable
                  rows={sharedEntries.map((entry) => ({
                    id: entry.id,
                    date: entry.entryDate,
                    category: entry.category,
                    title: entry.title,
                    description: entry.description,
                    updatedAt: entry.updatedAt,
                  }))}
                />
              ) : (
                <EmptyState title="No shared entries found" body="This employee has not added any shared work moments matching the current filters yet." />
              )}
            </SectionCard>

            <SectionCard title="Manager-only notes">
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
                ) : (
                  <EmptyState title="No private notes yet" body="Use the panel on the right to add manager-only context for future one-on-ones or review prep." />
                )}
              </div>
            </SectionCard>
          </div>

          <div className="xl:sticky xl:top-20 xl:self-start">
            <SectionCard title="Add private note">
              <AddPrivateNoteForm boardId={boardId} employeeId={employeeId} categories={MANAGER_CATEGORIES} />
            </SectionCard>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
