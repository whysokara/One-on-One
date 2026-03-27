"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, logIn, requireRole, signUp } from "@/lib/auth";
import { MANAGER_CATEGORIES, SHARED_CATEGORIES } from "@/lib/constants";
import {
  createAnnouncement,
  createBoard,
  createEntry,
  deleteEntry,
  getBoardById,
  getBoardByInviteCode,
  getEntryById,
  getManagerBoard,
  joinBoard,
  updateEntry,
} from "@/lib/db";
import { ensureManagerOwnsBoard, ensureReporteeBelongsToBoard } from "@/lib/queries";
import { EntryCategory, UserRole } from "@/lib/types";

export type FormState = {
  error?: string;
};

const EMPTY_STATE: FormState = {};

function fail(message: string): FormState {
  return { error: message };
}

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readRequired(formData: FormData, key: string, label: string) {
  const value = readString(formData, key);
  if (!value) {
    throw new Error(`${label} is required.`);
  }
  return value;
}

function assertCategory(category: string, allowed: string[]): EntryCategory {
  if (!allowed.includes(category)) {
    throw new Error("Invalid category.");
  }
  return category as EntryCategory;
}

function assertDate(value: string) {
  if (!value || Number.isNaN(new Date(value).getTime())) {
    throw new Error("Invalid date.");
  }
  return value;
}

export async function signupAction(_: FormState | undefined, formData: FormData) {
  try {
    const fullName = readRequired(formData, "fullName", "Full name");
    const email = readRequired(formData, "email", "Email");
    const password = readRequired(formData, "password", "Password");
    const role = readRequired(formData, "role", "Role") as UserRole;

    if (!["manager", "reportee"].includes(role)) {
      return fail("Invalid role.");
    }

    const user = await signUp({ fullName, email, password, role });
    redirect(user.role === "manager" ? "/manager" : "/employee");
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to sign up.");
  }
}

export async function loginAction(_: FormState | undefined, formData: FormData) {
  try {
    const email = readRequired(formData, "email", "Email");
    const password = readRequired(formData, "password", "Password");
    const user = await logIn({ email, password });
    redirect(user.role === "manager" ? "/manager" : "/employee");
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to log in.");
  }
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function createBoardAction(_: FormState | undefined, formData: FormData) {
  try {
    const manager = await requireRole("manager");
    if (await getManagerBoard(manager.id)) {
      return fail("You already have a board.");
    }

    const name = readRequired(formData, "name", "Board name");
    const description = readString(formData, "description");
    const board = await createBoard({ managerId: manager.id, name, description });
    redirect(`/manager/board/${board.id}`);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to create board.");
  }
}

export async function joinBoardAction(_: FormState | undefined, formData: FormData) {
  try {
    const reportee = await requireRole("reportee");
    const inviteCode = readString(formData, "inviteCode");
    const boardId = readString(formData, "boardId");

    const board = boardId ? await getBoardById(boardId) : await getBoardByInviteCode(inviteCode);
    if (!board) {
      return fail("Invalid invite code or link.");
    }

    await joinBoard(board.id, reportee.id);
    redirect("/employee");
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to join board.");
  }
}

export async function createSharedEntryAction(_: FormState | undefined, formData: FormData) {
  try {
    const reportee = await requireRole("reportee");
    const boardId = readRequired(formData, "boardId", "Board");
    const membership = await ensureReporteeBelongsToBoard(reportee.id, boardId);
    if (!membership) {
      return fail("Unauthorized.");
    }

    const title = readRequired(formData, "title", "Title");
    const description = readRequired(formData, "description", "Description");
    const category = assertCategory(readRequired(formData, "category", "Category"), SHARED_CATEGORIES);
    const entryDate = assertDate(readRequired(formData, "entryDate", "Date"));

    await createEntry({
      boardId,
      employeeId: reportee.id,
      createdByUserId: reportee.id,
      visibility: "shared",
      category,
      title,
      description,
      entryDate,
    });

    revalidatePath("/employee");
    return EMPTY_STATE;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to save entry.");
  }
}

export async function updateSharedEntryAction(_: FormState | undefined, formData: FormData) {
  try {
    const reportee = await requireRole("reportee");
    const entryId = readRequired(formData, "entryId", "Entry");
    const entry = await getEntryById(entryId);
    if (!entry || entry.employeeId !== reportee.id || entry.visibility !== "shared" || entry.createdByUserId !== reportee.id) {
      return fail("Unauthorized.");
    }

    const title = readRequired(formData, "title", "Title");
    const description = readRequired(formData, "description", "Description");
    const category = assertCategory(readRequired(formData, "category", "Category"), SHARED_CATEGORIES);
    const entryDate = assertDate(readRequired(formData, "entryDate", "Date"));

    await updateEntry({
      entryId,
      title,
      description,
      category,
      entryDate,
    });

    revalidatePath("/employee");
    return EMPTY_STATE;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to update entry.");
  }
}

export async function deleteSharedEntryAction(_: FormState | undefined, formData: FormData) {
  try {
    const reportee = await requireRole("reportee");
    const entryId = readRequired(formData, "entryId", "Entry");
    const entry = await getEntryById(entryId);
    if (!entry || entry.employeeId !== reportee.id || entry.visibility !== "shared" || entry.createdByUserId !== reportee.id) {
      return fail("Unauthorized.");
    }
    await deleteEntry(entryId);
    revalidatePath("/employee");
    return EMPTY_STATE;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to delete entry.");
  }
}

export async function createPrivateNoteAction(_: FormState | undefined, formData: FormData) {
  try {
    const manager = await requireRole("manager");
    const boardId = readRequired(formData, "boardId", "Board");
    const employeeId = readRequired(formData, "employeeId", "Employee");
    const board = await ensureManagerOwnsBoard(manager.id, boardId);
    const membership = await ensureReporteeBelongsToBoard(employeeId, boardId);
    if (!board || !membership) {
      return fail("Unauthorized.");
    }

    const title = readRequired(formData, "title", "Title");
    const description = readRequired(formData, "description", "Description");
    const category = assertCategory(readRequired(formData, "category", "Category"), MANAGER_CATEGORIES);
    const entryDate = assertDate(readRequired(formData, "entryDate", "Date"));

    await createEntry({
      boardId,
      employeeId,
      createdByUserId: manager.id,
      visibility: "manager_private",
      category,
      title,
      description,
      entryDate,
    });

    revalidatePath(`/manager/board/${boardId}/employee/${employeeId}`);
    return EMPTY_STATE;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to save note.");
  }
}

export async function createAnnouncementAction(_: FormState | undefined, formData: FormData) {
  try {
    const manager = await requireRole("manager");
    const boardId = readRequired(formData, "boardId", "Board");
    const board = await ensureManagerOwnsBoard(manager.id, boardId);
    if (!board) {
      return fail("Unauthorized.");
    }

    const title = readRequired(formData, "title", "Title");
    const message = readRequired(formData, "message", "Message");

    await createAnnouncement({
      boardId,
      createdByUserId: manager.id,
      title,
      message,
    });

    revalidatePath(`/manager/board/${boardId}`);
    revalidatePath("/employee");
    return EMPTY_STATE;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to publish announcement.");
  }
}
