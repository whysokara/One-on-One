import { EntryCategory, ManagerCategory, SharedCategory } from "@/lib/types";

export const SHARED_CATEGORIES: SharedCategory[] = [
  "achievement",
  "learning",
  "certification",
  "project_contribution",
  "appreciation",
  "blocker",
  "issue",
  "other",
];

export const MANAGER_CATEGORIES: ManagerCategory[] = [
  "positive_observation",
  "improvement_area",
  "discipline_issue",
  "coaching_note",
  "other",
];

export const ALL_CATEGORIES: EntryCategory[] = [
  ...SHARED_CATEGORIES,
  "positive_observation",
  "improvement_area",
  "discipline_issue",
  "coaching_note",
];

export const APP_NAME = "One-on-One";
