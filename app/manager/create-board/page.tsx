import { redirect } from "next/navigation";
import { ActionForm, Field, FormShell, TextArea } from "@/components/forms";
import { AppFrame, PageHeader, SectionCard } from "@/components/ui";
import { createBoardAction } from "@/lib/actions";
import { requireRole } from "@/lib/auth";
import { getManagerBoard } from "@/lib/db";
import { VALIDATION_LIMITS } from "@/lib/validation";

export default async function CreateBoardPage() {
  const user = await requireRole("manager");
  const existingBoard = await getManagerBoard(user.id);

  if (existingBoard) {
    redirect(`/manager/board/${existingBoard.id}`);
  }

  return (
    <AppFrame user={user}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <PageHeader
          eyebrow="Board Setup"
          title="Create the board your team will join."
          description="This board becomes the manager surface for people, announcements, timeline review, and private notes."
          aside={
            <>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--mist)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Generated instantly</div>
                Invite code, direct join link, and the live manager board.
              </div>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Naming rule</div>
                Use a team label people already recognize. Keep it direct and easy to scan.
              </div>
            </>
          }
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <FormShell title="Create board" description="This project keeps one active board per manager, so keep the setup concise and specific.">
            <ActionForm action={createBoardAction} submitLabel="Create board">
              <Field
                label="Board name"
                name="name"
                required
                placeholder="Kara Reportees FY26"
                minLength={VALIDATION_LIMITS.boardNameMin}
                maxLength={VALIDATION_LIMITS.boardNameMax}
              />
              <TextArea
                label="Description"
                name="description"
                rows={4}
                placeholder="Optional context for your team, function, or review cycle."
                maxLength={VALIDATION_LIMITS.descriptionMax}
              />
            </ActionForm>
          </FormShell>

          <SectionCard title="What good setup looks like" description="Keep the board easy to recognize.">
            <div className="space-y-3 text-sm leading-6 text-[color:var(--muted)]">
              <p>Use one board per current team, not one board per experiment.</p>
              <p>Invite people as soon as the board exists so the timeline starts building early.</p>
              <p>Keep the description short. The working surface matters more than the introduction.</p>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppFrame>
  );
}
