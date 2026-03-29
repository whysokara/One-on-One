import { redirect } from "next/navigation";
import { peekCurrentUser, requireUser } from "@/lib/auth";
import { getBoardForReportee, getManagerBoard } from "@/lib/db";

export default async function WorkspacePage() {
  const user = (await peekCurrentUser()) ?? (await requireUser());

  if (user.role === "manager") {
    const board = await getManagerBoard(user.id);
    redirect(board ? `/manager/board/${board.id}` : "/manager/create-board");
  }

  const board = await getBoardForReportee(user.id);
  redirect(board ? "/employee" : "/join");
}
