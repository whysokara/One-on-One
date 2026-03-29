"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { clearSession, logIn, requireRole, signUp } from "@/lib/auth";
import { MANAGER_CATEGORIES, SHARED_CATEGORIES } from "@/lib/constants";
import {
  createAnnouncement,
  createBoard,
  createEntry,
  deleteEntry,
  getBoardById,
  getBoardForReportee,
  getBoardByInviteCode,
  getEntryById,
  getManagerBoard,
  joinBoard,
  removeBoardMember,
  updateEntry,
} from "@/lib/db";
import { ensureManagerOwnsBoard, ensureReporteeBelongsToBoard } from "@/lib/queries";
import { EntryCategory, UserRole } from "@/lib/types";
import {
  validateAnnouncementMessage,
  validateAnnouncementTitle,
  validateBoardName,
  validateEmail,
  validateEntryTitle,
  validateFullName,
  validateInviteCode,
  validateIsoDate,
  validateLongText,
  validatePassword,
} from "@/lib/validation";

export type FormState = {
  error?: string;
  success?: string;
  submissionId?: number;
};

function fail(message: string): FormState {
  return { error: message, submissionId: Date.now() };
}

function succeed(message: string): FormState {
  return { success: message, submissionId: Date.now() };
}

function rethrowRedirectError(error: unknown) {
  if (isRedirectError(error)) {
    throw error;
  }
}

const SAFE_ACTION_MESSAGE_PATTERNS = [
  /^.+ is required\.$/,
  /^Invalid role\.$/,
  /^Invalid category\.$/,
  /^Invalid invite code or link\.$/,
  /^Unauthorized\.$/,
  /^This person is no longer attached to your board\.$/,
  /^You are already attached to ".+"\.$/,
  /^Enter a valid work email\.$/,
  /^Password does not meet the required complexity\.$/,
  /^Email or password is incorrect\.$/,
  /^An account with this email already exists\.$/,
  /^This account is not confirmed yet\.$/,
  /^No account was found for this email\.$/,
  /^Password must be at least \d+ characters\.$/,
  /^.+ must be at least \d+ characters\.$/,
  /^.+ must be \d+ characters or fewer\.$/,
  /^Invite code must be 6 letters or numbers\.$/,
  /^Invalid date\.$/,
];

function isSafeActionMessage(message: string) {
  return SAFE_ACTION_MESSAGE_PATTERNS.some((pattern) => pattern.test(message));
}

function handleActionError(action: string, error: unknown, fallbackMessage: string): FormState {
  rethrowRedirectError(error);

  if (error instanceof Error && isSafeActionMessage(error.message)) {
    return fail(error.message);
  }

  console.error(`[actions] ${action} failed`, error);
  return fail(fallbackMessage);
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
  validateIsoDate(value);
  return value;
}

export async function signupAction(_: FormState | undefined, formData: FormData) {
  try {
    const fullName = readRequired(formData, "fullName", "Full name");
    const email = readRequired(formData, "email", "Email");
    const password = readRequired(formData, "password", "Password");
    const role = readRequired(formData, "role", "Role") as UserRole;

    validateFullName(fullName);
    validateEmail(email);
    validatePassword(password);

    if (!["manager", "reportee"].includes(role)) {
      return fail("Invalid role.");
    }

    const user = await signUp({ fullName, email, password, role });
    redirect(user.role === "manager" ? "/manager" : "/employee");
  } catch (error) {
    return handleActionError("signupAction", error, "Unable to sign up.");
  }
}

export async function loginAction(_: FormState | undefined, formData: FormData) {
  try {
    const email = readRequired(formData, "email", "Email");
    const password = readRequired(formData, "password", "Password");
    validateEmail(email);
    const user = await logIn({ email, password });
    redirect(user.role === "manager" ? "/manager" : "/employee");
  } catch (error) {
    return handleActionError("loginAction", error, "Unable to log in.");
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
      redirect("/manager");
    }

    const name = readRequired(formData, "name", "Board name");
    const description = readString(formData, "description");
    validateBoardName(name);
    const board = await createBoard({ managerId: manager.id, name, description });
    redirect(`/manager/board/${board.id}`);
  } catch (error) {
    return handleActionError("createBoardAction", error, "Unable to create board.");
  }
}

export async function joinBoardAction(_: FormState | undefined, formData: FormData) {
  try {
    const reportee = await requireRole("reportee");
    const inviteCode = readString(formData, "inviteCode");
    const boardId = readString(formData, "boardId");
    const currentBoard = await getBoardForReportee(reportee.id);

    if (!boardId) {
      validateInviteCode(inviteCode);
    }

    const board = boardId ? await getBoardById(boardId) : await getBoardByInviteCode(inviteCode);
    if (!board) {
      return fail("Invalid invite code or link.");
    }

    if (currentBoard?.id === board.id) {
      redirect("/employee");
    }

    if (currentBoard && currentBoard.id !== board.id) {
      return fail(`You are already attached to "${currentBoard.name}". One-on-One currently supports one board per reportee.`);
    }

    await joinBoard(board.id, reportee.id);
    redirect("/employee");
  } catch (error) {
    return handleActionError("joinBoardAction", error, "Unable to join board.");
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
    validateEntryTitle(title);
    validateLongText("Description", description);

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
    return succeed("Entry saved.");
  } catch (error) {
    return handleActionError("createSharedEntryAction", error, "Unable to save entry.");
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
    validateEntryTitle(title);
    validateLongText("Description", description);

    await updateEntry({
      entryId,
      title,
      description,
      category,
      entryDate,
    });

    revalidatePath("/employee");
    return succeed("Entry updated.");
  } catch (error) {
    return handleActionError("updateSharedEntryAction", error, "Unable to update entry.");
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
    return succeed("Entry deleted.");
  } catch (error) {
    return handleActionError("deleteSharedEntryAction", error, "Unable to delete entry.");
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
    validateEntryTitle(title);
    validateLongText("Description", description);

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
    return succeed("Private note saved.");
  } catch (error) {
    return handleActionError("createPrivateNoteAction", error, "Unable to save note.");
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
    validateAnnouncementTitle(title);
    validateAnnouncementMessage(message);

    await createAnnouncement({
      boardId,
      createdByUserId: manager.id,
      title,
      message,
    });

    revalidatePath(`/manager/board/${boardId}`);
    revalidatePath("/employee");
    return succeed("Announcement published.");
  } catch (error) {
    return handleActionError("createAnnouncementAction", error, "Unable to publish announcement.");
  }
}

export async function removeBoardMemberAction(_: FormState | undefined, formData: FormData) {
  try {
    const manager = await requireRole("manager");
    const boardId = readRequired(formData, "boardId", "Board");
    const employeeId = readRequired(formData, "employeeId", "Employee");
    const redirectToBoard = readString(formData, "redirectToBoard") === "1";
    const board = await ensureManagerOwnsBoard(manager.id, boardId);
    const membership = await ensureReporteeBelongsToBoard(employeeId, boardId);

    if (!board || !membership) {
      return fail("This person is no longer attached to your board.");
    }

    await removeBoardMember(boardId, employeeId);

    revalidatePath(`/manager/board/${boardId}`);
    revalidatePath(`/manager/board/${boardId}/employee/${employeeId}`);
    revalidatePath("/employee");

    if (redirectToBoard) {
      redirect(`/manager/board/${boardId}`);
    }

    return succeed("Board member removed.");
  } catch (error) {
    return handleActionError("removeBoardMemberAction", error, "Unable to remove this board member.");
  }
}
