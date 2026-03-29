import {
  getAnnouncementsForBoard,
  getBoardById,
  getBoardMembers,
  getEntriesForBoard,
  getManagerBoard,
  getMembership,
  getBoardForReportee,
  getUserById,
} from "@/lib/db";
import { Announcement, Board, Entry, EntryVisibility, User } from "@/lib/types";
import { ALL_CATEGORIES } from "@/lib/constants";

const BOARD_ACTIVITY_WINDOW_DAYS = 30;

function latestTimestamp(values: string[]) {
  return [...values].sort((a, b) => b.localeCompare(a))[0] ?? "";
}

function isRecentTimestamp(value: string, now: Date, windowDays: number) {
  return now.getTime() - new Date(value).getTime() <= windowDays * 24 * 60 * 60 * 1000;
}

export function summarizeBoardHealth(input: {
  boardUpdatedAt: string;
  members: Array<{ lastUpdated: string }>;
  entries: Entry[];
  announcements: Announcement[];
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const activeReportees = input.members.filter((member) => isRecentTimestamp(member.lastUpdated, now, BOARD_ACTIVITY_WINDOW_DAYS)).length;
  const staleReportees = Math.max(0, input.members.length - activeReportees);
  const latestActivityAt = latestTimestamp([
    input.boardUpdatedAt,
    ...input.entries.map((entry) => entry.updatedAt),
    ...input.announcements.map((announcement) => announcement.updatedAt),
  ]);

  return {
    activeReportees,
    staleReportees,
    latestActivityAt,
  };
}

export async function getManagerDashboard(managerId: string) {
  const board = await getManagerBoard(managerId);
  if (!board) {
    return null;
  }

  const [members, entries, announcements] = await Promise.all([
    getBoardMembers(board.id),
    getEntriesForBoard(board.id),
    getAnnouncementsForBoard(board.id),
  ]);

  const sortedAnnouncements = [...announcements].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const entriesThisMonth = entries.filter((entry) => {
    const date = new Date(entry.entryDate);
    const now = new Date();
    return date.getUTCFullYear() === now.getUTCFullYear() && date.getUTCMonth() === now.getUTCMonth();
  }).length;

  const memberCards = members.map((member) => {
    const personEntries = entries.filter((entry) => entry.employeeId === member.id && entry.visibility === "shared");
    const lastUpdated =
      personEntries
        .map((entry) => entry.updatedAt)
        .sort((a, b) => b.localeCompare(a))[0] ?? member.updatedAt;
    return {
      ...member,
      entryCount: personEntries.length,
      lastUpdated,
    };
  });

  memberCards.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));

  return {
    board,
    members: memberCards,
    entries,
    announcements: sortedAnnouncements,
    summary: {
      totalReportees: members.length,
      totalEntries: entries.filter((entry) => entry.visibility === "shared").length,
      entriesThisMonth,
      managerNotesCount: entries.filter((entry) => entry.visibility === "manager_private").length,
      latestActivityAt: summarizeBoardHealth({
        boardUpdatedAt: board.updatedAt,
        members: memberCards,
        entries,
        announcements: sortedAnnouncements,
      }).latestActivityAt,
    },
  };
}

export async function getManagerEmployeeView(input: {
  managerId: string;
  boardId: string;
  employeeId: string;
}) {
  const [board, employee, members, allEntries] = await Promise.all([
    getBoardById(input.boardId),
    getUserById(input.employeeId),
    getBoardMembers(input.boardId),
    getEntriesForBoard(input.boardId),
  ]);

  if (!board || board.managerId !== input.managerId || !employee) {
    return null;
  }

  const isMember = members.some((member) => member.id === employee.id);
  if (!isMember) {
    return null;
  }

  const entries = allEntries
    .filter((entry) => entry.employeeId === employee.id)
    .sort((a, b) => b.entryDate.localeCompare(a.entryDate) || b.createdAt.localeCompare(a.createdAt));

  return {
    board,
    employee,
    entries,
    summary: {
      sharedEntriesCount: entries.filter((entry) => entry.visibility === "shared").length,
      privateNotesCount: entries.filter((entry) => entry.visibility === "manager_private").length,
      latestActivityAt: latestTimestamp(entries.map((entry) => entry.updatedAt)),
    },
  };
}

export async function getEmployeeHome(userId: string) {
  const board = await getBoardForReportee(userId);
  if (!board) {
    return { board: null };
  }

  const [membership, manager, entries, announcements] = await Promise.all([
    getMembership(board.id, userId),
    getUserById(board.managerId),
    getEntriesForBoard(board.id),
    getAnnouncementsForBoard(board.id),
  ]);

  if (!membership || !manager) {
    return { board: null };
  }

  const ownEntries = entries
    .filter((entry) => entry.employeeId === userId && entry.visibility === "shared")
    .sort((a, b) => b.entryDate.localeCompare(a.entryDate) || b.createdAt.localeCompare(a.createdAt));

  return {
    board,
    manager,
    announcements,
    entries: ownEntries,
    summary: {
      sharedEntriesCount: ownEntries.length,
      announcementCount: announcements.length,
      latestActivityAt: latestTimestamp([
        ...ownEntries.map((entry) => entry.updatedAt),
        ...announcements.map((announcement) => announcement.updatedAt),
        board.updatedAt,
      ]),
    },
  };
}

export async function ensureManagerOwnsBoard(managerId: string, boardId: string) {
  const board = await getBoardById(boardId);
  if (!board || board.managerId !== managerId) {
    return null;
  }
  return board;
}

export async function ensureReporteeBelongsToBoard(reporteeId: string, boardId: string) {
  return getMembership(boardId, reporteeId);
}

export function filterEntries(entries: Entry[], category: string, visibility: string) {
  return entries.filter((entry) => {
    const categoryOk = category === "all" || entry.category === category;
    const visibilityOk = visibility === "all" || entry.visibility === visibility;
    return categoryOk && visibilityOk;
  });
}

export function normalizeEntryCategoryFilter(value?: string) {
  if (!value || value === "all") {
    return "all";
  }

  return ALL_CATEGORIES.includes(value as Entry["category"]) ? value : "all";
}

export function normalizeEntryVisibilityFilter(value?: string) {
  if (!value || value === "all") {
    return "all";
  }

  return value === "shared" || value === "manager_private" ? (value satisfies EntryVisibility) : "all";
}

export function summarizeBoardYearMetrics(entries: Entry[], now = new Date()) {
  const year = now.getUTCFullYear();
  const sharedThisYear = entries.filter((entry) => entry.visibility === "shared" && new Date(entry.entryDate).getUTCFullYear() === year);

  return {
    total: sharedThisYear.length,
    certifications: sharedThisYear.filter((entry) => entry.category === "certification").length,
    awards: sharedThisYear.filter((entry) => entry.category === "appreciation").length,
    needsAttention: sharedThisYear.filter((entry) => entry.category === "blocker" || entry.category === "issue").length,
  };
}

export type MemberCard = User & {
  entryCount: number;
  lastUpdated: string;
};

export type ManagerDashboard = {
  board: Board;
  members: MemberCard[];
  entries: Entry[];
  announcements: Awaited<ReturnType<typeof getAnnouncementsForBoard>>;
  summary: {
    totalReportees: number;
    totalEntries: number;
    entriesThisMonth: number;
    managerNotesCount: number;
    latestActivityAt: string;
  };
};
