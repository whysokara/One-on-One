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
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,1.04fr)_24rem]">
        <div className="space-y-5">
          <PageHeader
            eyebrow="Log In"
            title="Return to the working record."
            description="Existing accounts go straight into the correct workspace. No duplicate setup. No alternate role path."
            aside={
              <>
                <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--mist)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Managers</div>
                  Open the board, review reportees, publish announcements, and keep private notes with the right person.
                </div>
                <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Reportees</div>
                  Resume your timeline, add a new work moment, or review what already exists before the next one-on-one.
                </div>
              </>
            }
          />

          <SectionCard title="What happens next" description="The routing stays simple after sign-in.">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4 text-sm leading-6 text-[color:var(--muted)]">
                Managers land in the live board dashboard.
              </div>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4 text-sm leading-6 text-[color:var(--muted)]">
                Reportees land in their own timeline.
              </div>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4 text-sm leading-6 text-[color:var(--muted)]">
                Valid sessions skip auth screens automatically.
              </div>
            </div>
          </SectionCard>
        </div>

        <FormShell title="Log in" description="Use the same work email and password used when the account was created.">
          <div className="mb-5 rounded-xl border border-[color:var(--line)] bg-[color:var(--mist)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
            This is a real Cognito-backed login. New accounts can sign up and come back later with the same credentials.
          </div>
          <LoginForm />
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            Need an account?{" "}
            <Link href="/signup" className="font-medium text-[color:var(--hero)]">
              Create one
            </Link>
          </p>
        </FormShell>
      </div>
    </AppFrame>
  );
}
