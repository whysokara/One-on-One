import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth-forms";
import { FormShell } from "@/components/forms";
import { AppFrame, PageHeader, SectionCard } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(user.role === "manager" ? "/manager" : "/employee");
  }

  return (
    <AppFrame user={user}>
      <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-5">
          <PageHeader
            eyebrow="Welcome Back"
            title="Log in to continue your one-on-ones."
            description="Pick up exactly where you left off. One-on-One keeps review evidence visible all year instead of forcing a last-minute memory dump."
          />
          <FormShell title="Log in" description="Use your work account credentials to access your manager or reportee workspace.">
            <LoginForm />
            <p className="mt-4 text-sm text-ink/60">
              Need an account?{" "}
              <Link href="/signup" className="font-medium text-pine">
                Create one
              </Link>
            </p>
          </FormShell>
        </div>
        <SectionCard title="What you’ll see">
          <ul className="space-y-2 text-sm leading-6 text-ink/72">
            <li>Managers land in the board dashboard.</li>
            <li>Reportees land in their personal timeline.</li>
            <li>Existing sessions are routed automatically.</li>
          </ul>
        </SectionCard>
      </div>
    </AppFrame>
  );
}
