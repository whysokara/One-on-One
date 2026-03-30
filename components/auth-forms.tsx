"use client";

import { ActionForm, Field, SelectField } from "@/components/forms";
import { loginAction, signupAction } from "@/lib/actions";
import { VALIDATION_LIMITS } from "@/lib/validation";

export function SignupForm() {
  return (
    <ActionForm action={signupAction} submitLabel="Create account" resetOnSuccess>
      <Field
        label="Full name"
        name="fullName"
        required
        placeholder="Kara Sharma"
        maxLength={VALIDATION_LIMITS.fullNameMax}
        minLength={VALIDATION_LIMITS.fullNameMin}
        autoComplete="name"
      />
      <Field label="Work email" name="email" type="email" required placeholder="kara@company.com" autoComplete="email" />
      <Field
        label="Password"
        name="password"
        type="password"
        required
        placeholder="At least 8 characters"
        minLength={VALIDATION_LIMITS.passwordMin}
        autoComplete="new-password"
      />
      <SelectField
        label="Role"
        name="role"
        options={[
          { value: "manager", label: "Manager" },
          { value: "reportee", label: "Reportee" },
        ]}
      />
    </ActionForm>
  );
}

export function LoginForm() {
  return (
    <ActionForm action={loginAction} submitLabel="Log in">
      <Field label="Work email" name="email" type="email" required placeholder="kara@company.com" autoComplete="email" />
      <Field label="Password" name="password" type="password" required placeholder="Enter your password" autoComplete="current-password" />
    </ActionForm>
  );
}
