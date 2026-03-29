import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getBoardForReportee, getManagerBoard } from "@/lib/db";

export default async function WorkspacePage() {
  const user = await requireUser();

  if (user.role === "manager") {
    const board = await getManagerBoard(user.id);
    redirect(board ? `/manager/board/${board.id}` : "/manager/create-board");
  }

  const board = await getBoardForReportee(user.id);
  redirect(board ? "/employee" : "/join");
}
