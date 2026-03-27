"use client";

import { useState } from "react";
import {
  createAnnouncementAction,
  createPrivateNoteAction,
  createSharedEntryAction,
  deleteSharedEntryAction,
  removeBoardMemberAction,
  updateSharedEntryAction,
} from "@/lib/actions";
import { ActionForm, Field, SelectField, TextArea } from "@/components/forms";
import { TimelineCard } from "@/components/ui";
import { cn, slugifyCategory } from "@/lib/utils";
import { Entry } from "@/lib/types";
import { VALIDATION_LIMITS } from "@/lib/validation";

function categoryOptions(values: string[]) {
  return values.map((value) => ({ value, label: slugifyCategory(value) }));
}

export function AddSharedEntryForm({
  boardId,
  categories,
}: {
  boardId: string;
  categories: string[];
}) {
  return (
    <ActionForm action={createSharedEntryAction} submitLabel="Save entry" resetOnSuccess refreshOnSuccess>
      <input type="hidden" name="boardId" value={boardId} />
      <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--mist)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
        Write one concrete moment per entry. Good examples: resolved a blocker, shipped a meaningful outcome, learned something important, or received notable appreciation.
      </div>
      <Field
        label="What happened"
        name="title"
        required
        placeholder="Resolved vendor escalation before launch freeze"
        minLength={VALIDATION_LIMITS.titleMin}
        maxLength={VALIDATION_LIMITS.titleMax}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Date" name="entryDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
        <SelectField label="Category" name="category" options={categoryOptions(categories)} />
      </div>
      <TextArea
        label="Why it matters"
        name="description"
        required
        placeholder="Add the important context, result, impact, or learning in plain language."
        minLength={VALIDATION_LIMITS.descriptionMin}
        maxLength={VALIDATION_LIMITS.descriptionMax}
      />
    </ActionForm>
  );
}

export function EditSharedEntryForm({
  entry,
  categories,
  onSuccess,
}: {
  entry: Entry;
  categories: string[];
  onSuccess?: () => void;
}) {
  return (
    <ActionForm
      action={updateSharedEntryAction}
      submitLabel="Update entry"
      className="space-y-4"
      onSuccess={onSuccess}
      refreshOnSuccess
    >
      <input type="hidden" name="entryId" value={entry.id} />
      <Field
        label="What happened"
        name="title"
        required
        defaultValue={entry.title}
        minLength={VALIDATION_LIMITS.titleMin}
        maxLength={VALIDATION_LIMITS.titleMax}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Date" name="entryDate" type="date" required defaultValue={entry.entryDate} />
        <SelectField label="Category" name="category" options={categoryOptions(categories)} defaultValue={entry.category} />
      </div>
      <TextArea
        label="Why it matters"
        name="description"
        required
        defaultValue={entry.description}
        minLength={VALIDATION_LIMITS.descriptionMin}
        maxLength={VALIDATION_LIMITS.descriptionMax}
      />
    </ActionForm>
  );
}

export function DeleteSharedEntryForm({ entryId }: { entryId: string }) {
  return (
    <ActionForm
      action={deleteSharedEntryAction}
      submitLabel="Delete entry"
      submitVariant="destructive"
      refreshOnSuccess
      onSubmit={(event) => {
        if (!window.confirm("Delete this entry permanently?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="entryId" value={entryId} />
    </ActionForm>
  );
}

export function AddPrivateNoteForm({
  boardId,
  employeeId,
  categories,
}: {
  boardId: string;
  employeeId: string;
  categories: string[];
}) {
  return (
    <ActionForm action={createPrivateNoteAction} submitLabel="Save note" resetOnSuccess refreshOnSuccess>
      <input type="hidden" name="boardId" value={boardId} />
      <input type="hidden" name="employeeId" value={employeeId} />
      <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--mist)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
        Use this for coaching context, pattern recognition, or manager observations that should stay private.
      </div>
      <Field
        label="Private note title"
        name="title"
        required
        placeholder="Handled client escalation calmly"
        maxLength={VALIDATION_LIMITS.titleMax}
        minLength={VALIDATION_LIMITS.titleMin}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Date" name="entryDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
        <SelectField label="Category" name="category" options={categoryOptions(categories)} />
      </div>
      <TextArea
        label="Context"
        name="description"
        required
        maxLength={VALIDATION_LIMITS.descriptionMax}
        minLength={VALIDATION_LIMITS.descriptionMin}
      />
    </ActionForm>
  );
}

export function AddAnnouncementForm({ boardId }: { boardId: string }) {
  return (
    <ActionForm action={createAnnouncementAction} submitLabel="Publish" resetOnSuccess refreshOnSuccess>
      <input type="hidden" name="boardId" value={boardId} />
      <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--mist)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
        Best for short prompts, reminders, deadlines, or rollout notes that every reportee on the board should see.
      </div>
      <Field
        label="Title"
        name="title"
        required
        placeholder="Month-end reminder"
        minLength={VALIDATION_LIMITS.announcementTitleMin}
        maxLength={VALIDATION_LIMITS.announcementTitleMax}
      />
      <TextArea
        label="Message"
        name="message"
        required
        rows={5}
        placeholder="Add a short team update or prompt here."
        minLength={VALIDATION_LIMITS.announcementMessageMin}
        maxLength={VALIDATION_LIMITS.announcementMessageMax}
      />
    </ActionForm>
  );
}

export function RemoveBoardMemberForm({
  boardId,
  employeeId,
  redirectToBoard = false,
}: {
  boardId: string;
  employeeId: string;
  redirectToBoard?: boolean;
}) {
  return (
    <ActionForm
      action={removeBoardMemberAction}
      submitLabel="Remove from board"
      submitVariant="destructive"
      refreshOnSuccess={!redirectToBoard}
      onSubmit={(event) => {
        if (!window.confirm("Remove this person from the board and clear their board-specific history?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="boardId" value={boardId} />
      <input type="hidden" name="employeeId" value={employeeId} />
      <input type="hidden" name="redirectToBoard" value={redirectToBoard ? "1" : "0"} />
    </ActionForm>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M13.9 3.4a1.5 1.5 0 0 1 2.1 0l.6.6a1.5 1.5 0 0 1 0 2.1l-8.7 8.7-3 0.3 0.3-3 8.7-8.7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m12.8 4.5 2.7 2.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SharedEntryCard({
  entry,
  categories,
}: {
  entry: Entry;
  categories: string[];
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-3 md:p-4">
      <TimelineCard date={entry.entryDate} category={entry.category} title={entry.title} description={entry.description} />

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsEditing((value) => !value)}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition",
            isEditing
              ? "border-[color:var(--line)] bg-[color:var(--mist)] text-[color:var(--ink)] hover:bg-[rgba(15,23,42,0.05)]"
              : "border-[color:var(--line)] bg-white text-[color:var(--ink)] hover:bg-[color:var(--mist)]",
          )}
        >
          <PencilIcon />
          {isEditing ? "Close edit" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="mt-3 rounded-xl border border-[color:var(--line)] bg-white p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Edit entry</div>
              <div className="mt-1 text-sm text-[color:var(--muted)]">Update the saved details below. Changes apply to the same timeline item.</div>
            </div>
            <div className="lg:w-[10rem]">
              <DeleteSharedEntryForm entryId={entry.id} />
            </div>
          </div>
          <div className="mt-4">
            <EditSharedEntryForm entry={entry} categories={categories} onSuccess={() => setIsEditing(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
