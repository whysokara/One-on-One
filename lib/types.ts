export type UserRole = "manager" | "reportee";

export type SharedCategory =
  | "achievement"
  | "learning"
  | "certification"
  | "project_contribution"
  | "appreciation"
  | "blocker"
  | "issue"
  | "other";

export type ManagerCategory =
  | "positive_observation"
  | "improvement_area"
  | "discipline_issue"
  | "coaching_note"
  | "other";

export type EntryCategory = SharedCategory | ManagerCategory;

export type EntryVisibility = "shared" | "manager_private";

export type User = {
  id: string;
  cognitoSub: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type Board = {
  id: string;
  managerId: string;
  name: string;
  description: string;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
};

export type BoardMember = {
  id: string;
  boardId: string;
  userId: string;
  joinedAt: string;
};

export type Entry = {
  id: string;
  boardId: string;
  employeeId: string;
  createdByUserId: string;
  visibility: EntryVisibility;
  category: EntryCategory;
  title: string;
  description: string;
  entryDate: string;
  createdAt: string;
  updatedAt: string;
};

export type Announcement = {
  id: string;
  boardId: string;
  createdByUserId: string;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthTokens = {
  idToken: string;
  expiresAt: number;
};
