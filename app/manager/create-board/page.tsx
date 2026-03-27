import { FormShell, ActionForm, Field, TextArea } from "@/components/forms";
import { AppFrame } from "@/components/ui";
import { createBoardAction } from "@/lib/actions";
import { requireRole } from "@/lib/auth";

export default async function CreateBoardPage() {
  const user = await requireRole("manager");

  return (
    <AppFrame user={user}>
      <div className="mx-auto max-w-2xl">
        <FormShell title="Create a team board" description="Keep it simple. One board is enough for the MVP and maps cleanly to one manager team.">
          <ActionForm action={createBoardAction} submitLabel="Create board">
            <Field label="Board name" name="name" required placeholder="Kara Reportees FY26" />
            <TextArea label="Description" name="description" rows={4} placeholder="Optional context for your team, function, or review cycle." />
          </ActionForm>
        </FormShell>
      </div>
    </AppFrame>
  );
}
