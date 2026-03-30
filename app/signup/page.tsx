import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth-forms";
import { AppFrame } from "@/components/ui";
import { peekCurrentUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await peekCurrentUser();

  if (user) {
    redirect(user.role === "manager" ? "/manager" : "/employee");
  }

  return (
    <AppFrame user={user}>
      <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="auth-note overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-500" />
          <div className="p-5 md:p-6">
            <div className="max-w-xl">
              <div className="auth-note-kicker text-blue-700/80">Choose the right role</div>
              <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-[2rem]">
                Start with the right account
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                Pick the account that matches how you will use the board. The manager owns it. The reportee joins it.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-inset ring-blue-100">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700 ring-1 ring-inset ring-blue-100">
                    M
                  </span>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700/80">Manager</div>
                </div>
                <p className="mt-3 text-sm leading-6 text-blue-950/90">Own the board, invite your team, review shared entries, and add private notes.</p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-inset ring-emerald-100">
                    R
                  </span>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700/80">Reportee</div>
                </div>
                <p className="mt-3 text-sm leading-6 text-emerald-950/90">Join the board and keep a simple timeline of what you worked on, learned, or achieved.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl bg-gradient-to-br from-white via-white to-emerald-50/70 p-[1px] shadow-[0_8px_28px_rgba(15,23,42,0.08)] ring-1 ring-inset ring-emerald-100/70">
          <div className="panel w-full overflow-hidden bg-white">
            <div className="h-1 bg-gradient-to-r from-[color:var(--hero)] via-sky-400 to-[color:var(--accent)]" />
            <div className="p-5 md:p-6">
              <div className="mb-4">
                <div className="inline-flex bg-sky-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
                  Create account
                </div>
              </div>
              <SignupForm />
              <p className="mt-4 text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-blue-700 hover:text-blue-800">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
