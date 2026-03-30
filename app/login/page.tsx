import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth-forms";
import { FormShell } from "@/components/forms";
import { AppFrame, PageHeader, SectionCard } from "@/components/ui";
import { peekCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await peekCurrentUser();

  if (user) {
    redirect(user.role === "manager" ? "/manager" : "/employee");
  }

  return (
    <AppFrame user={user}>
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,1.04fr)_24rem]">
        <div className="space-y-5">
          <PageHeader
            eyebrow="Log In"
            title="Return to the working record."
            aside={
              <div className="grid w-full gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-4 text-sm leading-6 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">Managers</div>
                  Open the board, review reportees, publish announcements, and keep private notes with the right person.
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-4 text-sm leading-6 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Reportees</div>
                  Resume your timeline, add a new work moment, or review what already exists before the next one-on-one.
                </div>
              </div>
            }
          />

          <SectionCard title="What happens next">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm leading-6 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                Managers land in the live board dashboard.
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm leading-6 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                Reportees land in their own timeline.
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm leading-6 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                Valid sessions skip auth screens automatically.
              </div>
            </div>
          </SectionCard>
        </div>

        <FormShell title="Log in">
          <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-4 text-sm leading-6 text-slate-600">
            This is a real Cognito-backed login. New accounts can sign up and come back later with the same credentials.
          </div>
          <LoginForm />
          <p className="mt-4 text-sm text-slate-500">
            Need an account?{" "}
            <Link href="/signup" className="font-bold text-blue-700 hover:text-blue-800">
              Create one
            </Link>
          </p>
        </FormShell>
      </div>
    </AppFrame>
  );
}
