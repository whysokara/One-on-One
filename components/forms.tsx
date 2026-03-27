"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormState } from "@/lib/actions";
import { cn } from "@/lib/utils";

const EMPTY_STATE: FormState = {};
const CONTROL_CLASS =
  "w-full min-w-0 rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-pine/35 focus:ring-4 focus:ring-pine/8";
const LABEL_CLASS = "mb-2 block text-[13px] font-semibold tracking-[-0.01em] text-ink";
const PRIMARY_BUTTON_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pine/92 disabled:cursor-not-allowed disabled:opacity-60";
const DESTRUCTIVE_BUTTON_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-ember/25 bg-ember/8 px-5 py-2.5 text-sm font-semibold text-ember transition hover:bg-ember/12 disabled:cursor-not-allowed disabled:opacity-60";

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
    <section className={cn("rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-card backdrop-blur md:p-7", className)}>
      <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-ink md:text-[2rem]">{title}</h1>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">{description}</p> : null}
      <div className="mt-6">{children}</div>
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
}: {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState | undefined>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
  submitVariant?: "primary" | "destructive";
  resetOnSuccess?: boolean;
  onSuccess?: () => void;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}) {
  const [state, formAction, pending] = useActionState<FormState | undefined, FormData>(action, EMPTY_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state?.success) {
      return;
    }

    if (resetOnSuccess) {
      formRef.current?.reset();
    }

    onSuccess?.();
  }, [onSuccess, resetOnSuccess, state?.submissionId, state?.success]);

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} className={cn("space-y-4", className)}>
      {children}
      {state?.error ? (
        <div className="rounded-[18px] border border-ember/18 bg-ember/10 px-4 py-3 text-sm leading-6 text-ember">
          {state.error}
        </div>
      ) : null}
      {state?.success ? (
        <div className="rounded-[18px] border border-moss/20 bg-moss/10 px-4 py-3 text-sm leading-6 text-pine">
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
