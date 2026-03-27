"use client";

import { useActionState } from "react";
import { FormState } from "@/lib/actions";
import { cn } from "@/lib/utils";

const EMPTY_STATE: FormState = {};

export function FormShell({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[26px] border border-white/60 bg-white/88 p-6 shadow-card backdrop-blur md:p-7", className)}>
      <h1 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-ink">{title}</h1>
      {description ? <p className="mt-1.5 max-w-2xl text-sm leading-6 text-ink/72">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function ActionForm({
  action,
  children,
  submitLabel,
  className,
}: {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState | undefined>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState<FormState | undefined, FormData>(action, EMPTY_STATE);

  return (
    <form action={formAction} className={cn("space-y-3.5", className)}>
      {children}
      {state?.error ? (
        <div className="rounded-2xl border border-ember/20 bg-ember/10 px-4 py-2.5 text-sm text-ember">
          {state.error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-full bg-pine px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pine/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Working..." : submitLabel}
      </button>
    </form>
  );
}

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/10 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-pine/40 focus:ring-2 focus:ring-pine/10"
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  required,
  rows = 4,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/10 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-pine/40 focus:ring-2 focus:ring-pine/10"
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: Array<{ label: string; value: string }>;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-black/10 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-pine/40 focus:ring-2 focus:ring-pine/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
