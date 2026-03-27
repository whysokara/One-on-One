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
        <SectionCard title="Create Your Board">
          <p className="max-w-2xl text-sm leading-6 text-ink/75">
            Start with a single team board. You will get an invite code and shareable link for reportees as soon as the board is created.
          </p>
          <Link href="/manager/create-board" className="mt-4 inline-flex rounded-full bg-pine px-4 py-2.5 text-sm font-semibold text-white">
            Create Board
          </Link>
        </SectionCard>
      ) : (
        <SectionCard title="Your Board Is Ready">
          <p className="text-sm leading-6 text-ink/75">Open the manager dashboard to review the team, announcements, and year-round employee timelines.</p>
          <Link
            href={`/manager/board/${board.id}`}
            className="mt-4 inline-flex rounded-full bg-pine px-4 py-2.5 text-sm font-semibold text-white"
          >
            Open Dashboard
          </Link>
        </SectionCard>
      )}
    </AppFrame>
  );
}
