import { redirect } from "next/navigation";
import { FormShell, ActionForm, Field, TextArea } from "@/components/forms";
import { AppFrame, PageHeader } from "@/components/ui";
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
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <PageHeader
          eyebrow="Board Setup"
          title="Create a team board"
          description="Keep it simple. One board is enough for this MVP and maps cleanly to one manager team."
        />
        <FormShell title="Create a team board" description="Keep it simple. One board is enough for the MVP and maps cleanly to one manager team.">
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
      </div>
    </AppFrame>
  );
}
