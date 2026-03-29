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
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,1.04fr)_24rem]">
        <div className="space-y-5">
          <PageHeader
            eyebrow="Create Account"
            title="Create one account. The role decides the workspace."
            description="Managers create and run the board. Reportees create their account first, then join the correct board with a code or link."
            aside={
              <div className="grid w-full gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-4 text-sm leading-6 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">Manager role</div>
                  Create the board, invite the team, read shared timelines, publish announcements, and write private notes.
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-4 text-sm leading-6 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Reportee role</div>
                  Maintain your own timeline of achievements, blockers, learning, and progress for your manager to review later.
                </div>
              </div>
            }
          />

          <SectionCard title="Before you create the account">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm leading-6 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                Use your work email so the account remains easy to identify and recover.
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm leading-6 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                Choose Manager only if you own the board and invite others into it.
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm leading-6 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                Reportees can create the account now and join the board as soon as the invite arrives.
              </div>
            </div>
          </SectionCard>
        </div>

        <FormShell title="Create account" description="You can sign up now and immediately log back in with the same credentials.">
          <SignupForm />
          <p className="mt-4 text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-blue-700 hover:text-blue-800">
              Log in
            </Link>
          </p>
        </FormShell>
      </div>
    </AppFrame>
  );
}
