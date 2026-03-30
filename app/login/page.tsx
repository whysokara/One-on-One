import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth-forms";
import { AppFrame } from "@/components/ui";
import { peekCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await peekCurrentUser();

  if (user) {
    redirect(user.role === "manager" ? "/manager" : "/employee");
  }

  return (
    <AppFrame user={user}>
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_27rem]">
        <section className="relative overflow-hidden lg:min-h-[32rem]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,91,187,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,145,218,0.05),transparent_28%)]" />
          <div className="flex h-full flex-col justify-center p-6 md:p-8 xl:p-10">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-[3.25rem]">
                Open your workspace
              </h1>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl bg-gradient-to-br from-white via-white to-sky-50/70 p-[1px] shadow-[0_8px_28px_rgba(15,23,42,0.08)] ring-1 ring-inset ring-sky-100/70 xl:self-center">
          <div className="panel w-full overflow-hidden bg-white">
            <div className="h-1 bg-gradient-to-r from-[color:var(--hero)] via-sky-400 to-[color:var(--accent)]" />
            <div className="p-6 md:p-7">
              <div className="mb-4">
                <div className="inline-flex bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700 ring-1 ring-inset ring-blue-100">
                  Continue
                </div>
              </div>
              <LoginForm />

              <p className="mt-4 text-sm text-slate-500">
                Need an account?{" "}
                <Link href="/signup" className="font-bold text-blue-700 hover:text-blue-800">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
