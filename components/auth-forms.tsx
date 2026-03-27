"use client";

import { ActionForm, Field, SelectField } from "@/components/forms";
import { loginAction, signupAction } from "@/lib/actions";

export function SignupForm() {
  return (
    <ActionForm action={signupAction} submitLabel="Create account">
      <Field label="Full name" name="fullName" required />
      <Field label="Work email" name="email" type="email" required />
      <Field label="Password" name="password" type="password" required />
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
      <Field label="Work email" name="email" type="email" required />
      <Field label="Password" name="password" type="password" required />
    </ActionForm>
  );
}
