import Link from "next/link";
import { LoginForm } from "@/components/auth-forms";
import { FormShell } from "@/components/forms";
import { AppFrame } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  return (
    <AppFrame user={user}>
      <div className="mx-auto max-w-xl">
        <FormShell title="Log in" description="Sessions persist after refresh so teams can use the app through the year without friction.">
          <LoginForm />
          <p className="mt-4 text-sm text-ink/60">
            Need an account?{" "}
            <Link href="/signup" className="font-medium text-pine">
              Sign up
            </Link>
          </p>
        </FormShell>
      </div>
    </AppFrame>
  );
}
