"use client";

import { useState } from "react";
import {
  createAnnouncementAction,
  createPrivateNoteAction,
  createSharedEntryAction,
  deleteSharedEntryAction,
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
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Title"
          name="title"
          required
          placeholder="Closed a major stakeholder loop"
          minLength={VALIDATION_LIMITS.titleMin}
          maxLength={VALIDATION_LIMITS.titleMax}
        />
        <Field label="Date" name="entryDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      </div>
      <SelectField label="Category" name="category" options={categoryOptions(categories)} />
      <TextArea
        label="Description"
        name="description"
        required
        placeholder="Keep it short and specific so appraisal time is easy later."
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
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Title"
          name="title"
          required
          defaultValue={entry.title}
          minLength={VALIDATION_LIMITS.titleMin}
          maxLength={VALIDATION_LIMITS.titleMax}
        />
        <Field label="Date" name="entryDate" type="date" required defaultValue={entry.entryDate} />
      </div>
      <SelectField label="Category" name="category" options={categoryOptions(categories)} defaultValue={entry.category} />
      <TextArea
        label="Description"
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
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Title"
          name="title"
          required
          placeholder="Handled client escalation calmly"
          maxLength={VALIDATION_LIMITS.titleMax}
          minLength={VALIDATION_LIMITS.titleMin}
        />
        <Field label="Date" name="entryDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      </div>
      <SelectField label="Category" name="category" options={categoryOptions(categories)} />
      <TextArea
        label="Description"
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
    <div className="rounded-[22px] border border-black/5 bg-fog/80 p-3 md:p-4">
      <TimelineCard date={entry.entryDate} category={entry.category} title={entry.title} description={entry.description} />

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsEditing((value) => !value)}
          className={cn(
            "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
            isEditing ? "border-black/10 bg-black/5 text-ink hover:bg-black/8" : "border-black/10 bg-white text-ink hover:bg-white/80",
          )}
        >
          <PencilIcon />
          {isEditing ? "Close edit" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="mt-3 rounded-[20px] border border-black/6 bg-white/88 p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">Edit entry</div>
              <div className="mt-1 text-sm text-ink/68">Update the saved details below. Changes apply to the same timeline item.</div>
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
