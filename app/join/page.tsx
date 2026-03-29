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
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,1.02fr)_22rem]">
        <div className="space-y-5">
          <PageHeader
            eyebrow="Join Board"
            title={linkedBoard ? "Your board is already identified." : "Connect your account to the correct manager board."}
            description={
              linkedBoard
                ? `You are joining "${linkedBoard.name}"${manager ? ` managed by ${manager.fullName}` : ""}. Once this succeeds, your personal timeline becomes active immediately.`
                : "Use the invite code or direct link your manager shared with you. This attaches your reportee account to the right team board."
            }
            aside={
              <>
                <div className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-4 text-sm leading-6 text-[color:var(--muted)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">After joining</div>
                  You land in your timeline and can start adding work moments right away.
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-4 text-sm leading-6 text-[color:var(--muted)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">One board at a time</div>
                  This MVP keeps one active board per reportee so the workspace stays unambiguous.
                </div>
              </>
            }
          />

          <FormShell title="Join board" description="Use the code exactly as shared, or continue with the linked board already preselected.">
            <ActionForm action={joinBoardAction} submitLabel="Join board">
              <input type="hidden" name="boardId" value={linkedBoard ? boardId : ""} />
              {boardId && !linkedBoard ? (
                <div className="rounded-2xl border border-[color:var(--accent)]/16 bg-[color:var(--accent-soft)] px-4 py-3 text-sm leading-6 text-[color:var(--accent)]">
                  This join link is invalid. Ask your manager for a fresh link or enter a valid invite code below.
                </div>
              ) : null}
              {!boardId ? <Field label="Invite code" name="inviteCode" required placeholder="AB12CD" /> : null}
              {boardId && !linkedBoard ? <Field label="Invite code" name="inviteCode" required placeholder="AB12CD" /> : null}
            </ActionForm>
          </FormShell>
        </div>

        <SectionCard title="Need help?">
          <div className="space-y-3 text-sm leading-6 text-[color:var(--muted)]">
            <p>Ask your manager for a fresh six-character invite code if the original one was typed incorrectly.</p>
            <p>If you opened a direct join link, the board is preselected unless that link is malformed or expired.</p>
            <p>Once the join succeeds, you do not repeat it. Your timeline becomes the default workspace.</p>
          </div>
        </SectionCard>
      </div>
    </AppFrame>
  );
}
