import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth-forms";
import { FormShell } from "@/components/forms";
import { AppFrame } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(user.role === "manager" ? "/manager" : "/employee");
  }

  return (
    <AppFrame user={user}>
      <div className="mx-auto max-w-xl">
        <FormShell title="Create Your One-on-One Account" description="Choose your role once and the app will route you into the right workspace immediately.">
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
