"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FormState } from "@/lib/actions";
import { cn } from "@/lib/utils";

const EMPTY_STATE: FormState = {};
const CONTROL_CLASS =
  "w-full min-w-0 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3.5 py-2.5 text-sm text-[color:var(--ink)] outline-none transition placeholder:text-[color:var(--muted)]/65 focus:border-[color:var(--hero)] focus:ring-2 focus:ring-[rgba(23,50,77,0.08)]";
const LABEL_CLASS = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]";
const PRIMARY_BUTTON_CLASS =
  "inline-flex h-10 items-center justify-center rounded-xl bg-[color:var(--hero)] px-4 text-sm font-medium text-white transition hover:bg-[color:var(--hero-strong)] disabled:cursor-not-allowed disabled:opacity-60";
const DESTRUCTIVE_BUTTON_CLASS =
  "inline-flex h-10 items-center justify-center rounded-xl border border-[color:var(--accent)]/22 bg-[color:var(--accent-soft)] px-4 text-sm font-medium text-[color:var(--accent)] transition hover:bg-[rgba(160,106,55,0.16)] disabled:cursor-not-allowed disabled:opacity-60";

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
    <section className={cn("rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[0_10px_30px_rgba(16,24,40,0.04)] md:p-6", className)}>
      <h1 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[color:var(--ink)] md:text-[1.5rem]">{title}</h1>
      {description ? <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function ActionForm({
  action,
  children,
  submitLabel,
  className,
  submitVariant = "primary",
  resetOnSuccess = false,
  onSuccess,
  onSubmit,
  refreshOnSuccess = false,
}: {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState | undefined>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
  submitVariant?: "primary" | "destructive";
  resetOnSuccess?: boolean;
  onSuccess?: () => void;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  refreshOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState<FormState | undefined, FormData>(action, EMPTY_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!state?.success) {
      return;
    }

    if (resetOnSuccess) {
      formRef.current?.reset();
    }

    onSuccess?.();
    if (refreshOnSuccess) {
      router.refresh();
    }
  }, [onSuccess, refreshOnSuccess, resetOnSuccess, router, state?.submissionId, state?.success]);

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} className={cn("space-y-4", className)}>
      {children}
      {state?.error ? (
        <div className="rounded-xl border border-[color:var(--accent)]/20 bg-[color:var(--accent-soft)] px-3.5 py-3 text-sm leading-6 text-[color:var(--accent)]">
          {state.error}
        </div>
      ) : null}
      {state?.success ? (
        <div className="rounded-xl border border-[color:var(--success)]/16 bg-[rgba(37,107,95,0.08)] px-3.5 py-3 text-sm leading-6 text-[color:var(--success)]">
          {state.success}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "w-full sm:w-auto",
          submitVariant === "destructive" ? DESTRUCTIVE_BUTTON_CLASS : PRIMARY_BUTTON_CLASS,
        )}
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
  maxLength,
  minLength,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className={LABEL_CLASS}>{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        className={CONTROL_CLASS}
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
  maxLength,
  minLength,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className={LABEL_CLASS}>{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        className={cn(CONTROL_CLASS, "min-h-[7.5rem]")}
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
      <span className={LABEL_CLASS}>{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className={cn(CONTROL_CLASS, "min-h-12 appearance-none")}
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
