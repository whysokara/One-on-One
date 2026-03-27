import { ActionForm, Field, FormShell } from "@/components/forms";
import { AppFrame } from "@/components/ui";
import { joinBoardAction } from "@/lib/actions";
import { requireRole } from "@/lib/auth";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ boardId?: string }>;
}) {
  const user = await requireRole("reportee");
  const { boardId = "" } = await searchParams;

  return (
    <AppFrame user={user}>
      <div className="mx-auto max-w-xl">
        <FormShell title="Join a board" description="Use either the manager's invite code or the shareable link.">
          <ActionForm action={joinBoardAction} submitLabel="Join board">
            <input type="hidden" name="boardId" value={boardId} />
            {!boardId ? <Field label="Invite code" name="inviteCode" required placeholder="AB12CD" /> : null}
          </ActionForm>
        </FormShell>
      </div>
    </AppFrame>
  );
}
