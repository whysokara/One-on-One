import Link from "next/link";
import { SignupForm } from "@/components/auth-forms";
import { FormShell } from "@/components/forms";
import { AppFrame } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await getCurrentUser();

  return (
    <AppFrame user={user}>
      <div className="mx-auto max-w-xl">
        <FormShell title="Create your One-on-One account" description="Use the role selector so the app can route you to the right experience immediately.">
          <SignupForm />
          <p className="mt-4 text-sm text-ink/60">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-pine">
              Log in
            </Link>
          </p>
        </FormShell>
      </div>
    </AppFrame>
  );
}
