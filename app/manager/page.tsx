import Link from "next/link";
import { redirect } from "next/navigation";
import { AppFrame, PageHeader, SectionCard } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { getManagerBoard } from "@/lib/db";

export default async function ManagerPage() {
  const user = await requireRole("manager");
  const board = await getManagerBoard(user.id);

  if (board) {
    redirect(`/manager/board/${board.id}`);
  }

  return (
    <AppFrame user={user}>
      <div className="flex w-full flex-col gap-4">
        <PageHeader
          eyebrow="Manager Workspace"
          title="Set up the board your team will actually use."
        />

        <div className="grid gap-5">
          <SectionCard title="Create your board">
            <Link
              href="/manager/create-board"
              className="inline-flex h-10 items-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Create board
            </Link>
          </SectionCard>
        </div>
      </div>
    </AppFrame>
  );
}
