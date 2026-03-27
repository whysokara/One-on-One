import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth-forms";
import { FormShell } from "@/components/forms";
import { AppFrame } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(user.role === "manager" ? "/manager" : "/employee");
  }

  return (
    <AppFrame user={user}>
      <div className="mx-auto max-w-xl">
        <FormShell title="Log In" description="Pick up exactly where you left off. One-on-One keeps review evidence visible all year.">
          <LoginForm />
          <p className="mt-4 text-sm text-ink/60">
            Need an account?{" "}
            <Link href="/signup" className="font-medium text-pine">
              Create one
            </Link>
          </p>
        </FormShell>
      </div>
    </AppFrame>
  );
}
