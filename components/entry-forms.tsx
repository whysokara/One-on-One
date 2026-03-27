"use client";

import {
  createAnnouncementAction,
  createPrivateNoteAction,
  createSharedEntryAction,
  deleteSharedEntryAction,
  updateSharedEntryAction,
} from "@/lib/actions";
import { ActionForm, Field, SelectField, TextArea } from "@/components/forms";
import { slugifyCategory } from "@/lib/utils";
import { Entry } from "@/lib/types";

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
    <ActionForm action={createSharedEntryAction} submitLabel="Save entry">
      <input type="hidden" name="boardId" value={boardId} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" name="title" required placeholder="Closed a major stakeholder loop" />
        <Field label="Date" name="entryDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      </div>
      <SelectField label="Category" name="category" options={categoryOptions(categories)} />
      <TextArea label="Description" name="description" required placeholder="Keep it short and specific so appraisal time is easy later." />
    </ActionForm>
  );
}

export function EditSharedEntryForm({
  entry,
  categories,
}: {
  entry: Entry;
  categories: string[];
}) {
  return (
    <ActionForm action={updateSharedEntryAction} submitLabel="Update entry">
      <input type="hidden" name="entryId" value={entry.id} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" name="title" required defaultValue={entry.title} />
        <Field label="Date" name="entryDate" type="date" required defaultValue={entry.entryDate} />
      </div>
      <SelectField label="Category" name="category" options={categoryOptions(categories)} defaultValue={entry.category} />
      <TextArea label="Description" name="description" required defaultValue={entry.description} />
    </ActionForm>
  );
}

export function DeleteSharedEntryForm({ entryId }: { entryId: string }) {
  return (
    <ActionForm action={deleteSharedEntryAction} submitLabel="Delete entry" className="mt-3">
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
    <ActionForm action={createPrivateNoteAction} submitLabel="Save note">
      <input type="hidden" name="boardId" value={boardId} />
      <input type="hidden" name="employeeId" value={employeeId} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" name="title" required placeholder="Handled client escalation calmly" />
        <Field label="Date" name="entryDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      </div>
      <SelectField label="Category" name="category" options={categoryOptions(categories)} />
      <TextArea label="Description" name="description" required />
    </ActionForm>
  );
}

export function AddAnnouncementForm({ boardId }: { boardId: string }) {
  return (
    <ActionForm action={createAnnouncementAction} submitLabel="Publish">
      <input type="hidden" name="boardId" value={boardId} />
      <Field label="Title" name="title" required placeholder="Month-end reminder" />
      <TextArea label="Message" name="message" required rows={5} placeholder="Add a short team update or prompt here." />
    </ActionForm>
  );
}
