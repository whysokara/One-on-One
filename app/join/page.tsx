import { redirect } from "next/navigation";
import { ActionForm, Field, FormShell } from "@/components/forms";
import { AppFrame, PageHeader, SectionCard } from "@/components/ui";
import { joinBoardAction } from "@/lib/actions";
import { requireRole } from "@/lib/auth";
import { getBoardById, getBoardForReportee, getUserById } from "@/lib/db";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ boardId?: string }>;
}) {
  const user = await requireRole("reportee");
  const { boardId = "" } = await searchParams;
  const [currentBoard, linkedBoard] = await Promise.all([
    getBoardForReportee(user.id),
    boardId ? getBoardById(boardId) : Promise.resolve(null),
  ]);

  if (currentBoard) {
    redirect("/employee");
  }

  const manager = linkedBoard ? await getUserById(linkedBoard.managerId) : null;

  return (
    <AppFrame user={user}>
      <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <PageHeader
            eyebrow="Join a Team"
            title="Attach your account to your manager’s board."
            description={
              linkedBoard
                ? `You are joining "${linkedBoard.name}"${manager ? ` managed by ${manager.fullName}` : ""}.`
                : "Use the invite code or open the join link your manager shared with you."
            }
          />
          <FormShell title="Join a board" description="Use either the manager's invite code or the shareable link.">
            <ActionForm action={joinBoardAction} submitLabel="Join board">
              <input type="hidden" name="boardId" value={linkedBoard ? boardId : ""} />
              {boardId && !linkedBoard ? (
                <div className="rounded-[18px] border border-ember/18 bg-ember/10 px-4 py-3 text-sm leading-6 text-ember">
                  This join link is invalid. Ask your manager for a fresh invite link or enter a valid invite code below.
                </div>
              ) : null}
              {!boardId ? <Field label="Invite code" name="inviteCode" required placeholder="AB12CD" /> : null}
              {boardId && !linkedBoard ? <Field label="Invite code" name="inviteCode" required placeholder="AB12CD" /> : null}
            </ActionForm>
          </FormShell>
        </div>
        <SectionCard title="Need help?">
          <ul className="space-y-2 text-sm leading-6 text-ink/72">
            <li>Ask your manager for the six-character invite code.</li>
            <li>If you opened a share link, the board is preselected for you.</li>
            <li>Once you join, your personal timeline opens automatically.</li>
          </ul>
        </SectionCard>
      </div>
    </AppFrame>
  );
}
