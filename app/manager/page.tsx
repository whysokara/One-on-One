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
          title={board ? "Your board is ready." : "Start your team board."}
          description={
            board
              ? "Open the dashboard to review reportees, publish team updates, and scan each employee timeline with context attached."
              : "Create one board for your current team. The app will generate an invite code and join link immediately."
          }
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <SectionCard
            title={board ? "Open the dashboard" : "Create your board"}
            description={
              board
                ? "This takes you to your active manager view with reportees, announcements, metrics, and timeline drill-down."
                : "Keep the name clear and review-cycle specific so people know exactly where to join."
            }
          >
            <Link
              href={board ? `/manager/board/${board.id}` : "/manager/create-board"}
              className="inline-flex min-h-11 items-center rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white"
            >
              {board ? "Open dashboard" : "Create board"}
            </Link>
          </SectionCard>

          <SectionCard title="Manager checklist">
            <ul className="space-y-2 text-sm leading-6 text-ink/72">
              <li>Keep one active board per team.</li>
              <li>Share the invite code or join link with reportees.</li>
              <li>Use announcements for lightweight rollout notes.</li>
              <li>Capture private notes on the employee profile when needed.</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </AppFrame>
  );
}
