"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FormState } from "@/lib/actions";
import { cn } from "@/lib/utils";

const EMPTY_STATE: FormState = {};
export function FormShell({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel p-5 md:p-6", className)}>
      <h1 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-slate-900 md:text-[1.5rem]">{title}</h1>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function ActionForm({
  action,
  children,
  submitLabel,
  submitContent,
  submitAriaLabel,
  className,
  submitVariant = "primary",
  submitClassName,
  resetOnSuccess = false,
  onSuccess,
  onSubmit,
  refreshOnSuccess = false,
}: {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState | undefined>;
  children: React.ReactNode;
  submitLabel: string;
  submitContent?: React.ReactNode;
  submitAriaLabel?: string;
  className?: string;
  submitVariant?: "primary" | "destructive";
  submitClassName?: string;
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
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-6 text-rose-600">
          {state.error}
        </div>
      ) : null}
      {state?.success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm leading-6 text-emerald-600">
          {state.success}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        aria-label={submitAriaLabel ?? submitLabel}
        className={cn(
          "w-full sm:w-auto",
          submitVariant === "destructive" ? "destructive-button" : "primary-button",
          submitClassName,
        )}
      >
        {pending ? "Working..." : submitContent ?? submitLabel}
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
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        autoComplete={autoComplete}
        className="input-control"
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
      <span className="field-label">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        className="input-control min-h-[7.5rem]"
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
      <span className="field-label">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="input-control min-h-12 appearance-none"
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
