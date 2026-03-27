const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const INVITE_CODE_REGEX = /^[A-Z0-9]{6}$/;

export const VALIDATION_LIMITS = {
  fullNameMin: 2,
  fullNameMax: 80,
  passwordMin: 8,
  boardNameMin: 3,
  boardNameMax: 80,
  titleMin: 3,
  titleMax: 120,
  descriptionMin: 8,
  descriptionMax: 1500,
  announcementTitleMin: 3,
  announcementTitleMax: 120,
  announcementMessageMin: 8,
  announcementMessageMax: 1500,
} as const;

function assertLength(label: string, value: string, min: number, max: number) {
  if (value.length < min) {
    throw new Error(`${label} must be at least ${min} characters.`);
  }

  if (value.length > max) {
    throw new Error(`${label} must be ${max} characters or fewer.`);
  }
}

export function validateEmail(value: string) {
  if (!EMAIL_REGEX.test(value.trim())) {
    throw new Error("Enter a valid work email.");
  }
}

export function validateFullName(value: string) {
  assertLength("Full name", value.trim(), VALIDATION_LIMITS.fullNameMin, VALIDATION_LIMITS.fullNameMax);
}

export function validatePassword(value: string) {
  if (value.length < VALIDATION_LIMITS.passwordMin) {
    throw new Error(`Password must be at least ${VALIDATION_LIMITS.passwordMin} characters.`);
  }
}

export function validateBoardName(value: string) {
  assertLength("Board name", value.trim(), VALIDATION_LIMITS.boardNameMin, VALIDATION_LIMITS.boardNameMax);
}

export function validateEntryTitle(value: string) {
  assertLength("Title", value.trim(), VALIDATION_LIMITS.titleMin, VALIDATION_LIMITS.titleMax);
}

export function validateLongText(label: string, value: string) {
  assertLength(label, value.trim(), VALIDATION_LIMITS.descriptionMin, VALIDATION_LIMITS.descriptionMax);
}

export function validateAnnouncementTitle(value: string) {
  assertLength(
    "Title",
    value.trim(),
    VALIDATION_LIMITS.announcementTitleMin,
    VALIDATION_LIMITS.announcementTitleMax,
  );
}

export function validateAnnouncementMessage(value: string) {
  assertLength(
    "Message",
    value.trim(),
    VALIDATION_LIMITS.announcementMessageMin,
    VALIDATION_LIMITS.announcementMessageMax,
  );
}

export function validateInviteCode(value: string) {
  if (!INVITE_CODE_REGEX.test(value.trim().toUpperCase())) {
    throw new Error("Invite code must be 6 letters or numbers.");
  }
}

export function validateIsoDate(value: string) {
  if (!ISO_DATE_REGEX.test(value)) {
    throw new Error("Invalid date.");
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date.");
  }
}
