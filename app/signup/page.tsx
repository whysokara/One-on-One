import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth-forms";
import { FormShell } from "@/components/forms";
import { AppFrame, PageHeader, SectionCard } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(user.role === "manager" ? "/manager" : "/employee");
  }

  return (
    <AppFrame user={user}>
      <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-5">
          <PageHeader
            eyebrow="Get Started"
            title="Create your One-on-One account."
            description="Choose your role once and the app routes you into the correct workspace immediately."
          />
          <FormShell title="Create your account" description="Managers create boards. Reportees join with an invite code or link from their manager.">
            <SignupForm />
            <p className="mt-4 text-sm text-ink/60">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-pine">
                Log in
              </Link>
            </p>
          </FormShell>
        </div>
        <SectionCard title="Before you sign up">
          <ul className="space-y-2 text-sm leading-6 text-ink/72">
            <li>Choose Manager if you own the board and invite others.</li>
            <li>Choose Reportee if you’re contributing your own timeline.</li>
            <li>You can join a board after signup from the employee workspace.</li>
          </ul>
        </SectionCard>
      </div>
    </AppFrame>
  );
}
