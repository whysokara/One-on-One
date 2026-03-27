import Link from "next/link";
import { AppFrame, SectionCard } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { getManagerBoard } from "@/lib/db";

export default async function ManagerPage() {
  const user = await requireRole("manager");
  const board = await getManagerBoard(user.id);

  return (
    <AppFrame user={user}>
      {!board ? (
        <SectionCard title="Create your board">
          <p className="max-w-2xl text-sm leading-7 text-ink/75">
            Start with a single team board. You will get an invite code and shareable link for reportees as soon as the board is created.
          </p>
          <Link href="/manager/create-board" className="mt-5 inline-flex rounded-full bg-pine px-5 py-3 text-sm font-medium text-white">
            Create board
          </Link>
        </SectionCard>
      ) : (
        <SectionCard title="Your board is ready">
          <p className="text-sm text-ink/75">Open your manager dashboard to view the team, announcements, and employee timelines.</p>
          <Link
            href={`/manager/board/${board.id}`}
            className="mt-5 inline-flex rounded-full bg-pine px-5 py-3 text-sm font-medium text-white"
          >
            Open dashboard
          </Link>
        </SectionCard>
      )}
    </AppFrame>
  );
}
