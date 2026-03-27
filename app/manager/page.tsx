import Link from "next/link";
import { AppFrame, PageHeader, SectionCard } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { getManagerBoard } from "@/lib/db";

export default async function ManagerPage() {
  const user = await requireRole("manager");
  const board = await getManagerBoard(user.id);

  return (
    <AppFrame user={user}>
      <div className="flex w-full flex-col gap-5">
        <PageHeader
          eyebrow="Manager Workspace"
          title={board ? "Your board is live." : "Set up the board your team will actually use."}
          description={
            board
              ? "Open the board to review reportees, publish short team updates, remove people when reporting changes, and keep context attached to the right person."
              : "Create one board for the team you currently manage. The product will generate both a join code and a direct link immediately."
          }
          aside={
            <>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--mist)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Workspace purpose</div>
                Keep review evidence visible all year instead of reconstructing it in one panic-filled week.
              </div>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Board model</div>
                One manager board, one invite path, one clear place to track people and context.
              </div>
            </>
          }
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
          <SectionCard
            title={board ? "Open the live board" : "Create your board"}
            description={
              board
                ? "This is the operating view for reportees, announcements, private notes, and join logistics."
                : "Keep the name direct and recognizable so people know exactly where they belong when they join."
            }
          >
            <Link
              href={board ? `/manager/board/${board.id}` : "/manager/create-board"}
              className="inline-flex h-10 items-center rounded-xl bg-[color:var(--hero)] px-4 text-sm font-medium text-white transition hover:bg-[color:var(--hero-strong)]"
            >
              {board ? "Open dashboard" : "Create board"}
            </Link>
          </SectionCard>

          <SectionCard title="Manager playbook" description="The product works best when it stays lightweight.">
            <div className="space-y-3 text-sm leading-6 text-[color:var(--muted)]">
              <p>Start with one board, share the invite path quickly, and get people adding entries while the work is fresh.</p>
              <p>Use announcements for short prompts, not long memos. Use private notes only for manager-side context.</p>
              <p>If someone leaves the team or reporting changes, remove them from the board to keep the record accurate.</p>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppFrame>
  );
}
