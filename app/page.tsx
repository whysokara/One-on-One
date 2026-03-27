import Link from "next/link";
import { AppFrame, Eyebrow, InfoStrip, SectionCard } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  const primaryHref = user ? (user.role === "manager" ? "/manager" : "/employee") : "/signup";
  const secondaryHref = user ? (user.role === "manager" ? "/manager" : "/employee") : "/login";
  const primaryLabel = user ? "Open workspace" : "Create account";
  const secondaryLabel = user ? "Open board" : "Log in";

  return (
    <AppFrame user={user}>
      <div className="flex w-full flex-col gap-5">
        <section className="overflow-hidden rounded-2xl border border-[#20334b]/12 bg-[linear-gradient(180deg,#18324d_0%,#10253a_100%)] px-5 py-5 text-white shadow-[0_16px_42px_rgba(16,24,40,0.12)] md:px-6 md:py-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.38fr)_21rem]">
            <div className="min-w-0">
              <Eyebrow>Performance Memory System</Eyebrow>
              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
                <div className="min-w-0">
                  <h1 className="max-w-3xl text-[2.45rem] font-semibold leading-[0.92] tracking-[-0.06em] md:text-[3.45rem]">
                    Performance reviews should not depend on memory.
                  </h1>
                  <p className="mt-3 max-w-xl text-[15px] leading-6 text-white/76 md:text-base">
                    One board for the team. One timeline for each reportee. Enough structure to stay useful, without turning into process theatre.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/82">
                    <span className="rounded-lg border border-white/12 bg-white/7 px-2.5 py-1.5">Invite by code or link</span>
                    <span className="rounded-lg border border-white/12 bg-white/7 px-2.5 py-1.5">Shared employee timeline</span>
                    <span className="rounded-lg border border-white/12 bg-white/7 px-2.5 py-1.5">Private manager notes</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <Link href={primaryHref} className="inline-flex h-10 items-center rounded-xl bg-white px-4 text-sm font-medium text-[color:var(--hero)]">
                      {primaryLabel}
                    </Link>
                    <Link href={secondaryHref} className="inline-flex h-10 items-center rounded-xl border border-white/16 bg-white/7 px-4 text-sm font-medium text-white">
                      {secondaryLabel}
                    </Link>
                  </div>
                </div>
                <InfoStrip
                  className="grid-cols-1 md:grid-cols-3 lg:grid-cols-1"
                  items={[
                    { label: "Capture", value: "Wins, blockers, learning, recognition." },
                    { label: "Review", value: "Shared entries plus manager-only notes." },
                    { label: "Result", value: "Cleaner, faster performance conversations." },
                  ]}
                />
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-xl border border-white/10 bg-white/7 p-4 backdrop-blur">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">Workflow</div>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-lg bg-white/8 px-3 py-2.5 text-sm text-white/84">Manager creates the board</div>
                  <div className="rounded-lg bg-white/8 px-3 py-2.5 text-sm text-white/84">Reportees join and log moments</div>
                  <div className="rounded-lg bg-white/8 px-3 py-2.5 text-sm text-white/84">Manager reviews evidence, not guesswork</div>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white p-4 text-[color:var(--ink)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Product surface</div>
                <div className="mt-3 overflow-hidden rounded-lg border border-[color:var(--line)] bg-[color:var(--mist)]">
                  <div className="grid grid-cols-[5.75rem_6.5rem_minmax(0,1fr)] gap-2 border-b border-[color:var(--line)] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    <span>Date</span>
                    <span>Type</span>
                    <span>Entry</span>
                  </div>
                  <div className="grid grid-cols-[5.75rem_6.5rem_minmax(0,1fr)] gap-2 px-3 py-3 text-sm">
                    <span className="text-[color:var(--muted)]">Mar 28</span>
                    <span className="text-[color:var(--muted)]">Blocker</span>
                    <span className="font-medium text-[color:var(--ink)]">Resolved vendor escalation before launch freeze.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          <SectionCard title="Built to stay useful all year" description="The interface stays compact because this product is meant to be referenced constantly, not visited once a quarter.">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">Manager</div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Scan the team, keep private context, and remove people cleanly when reporting changes.</p>
              </div>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">Reportee</div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Capture meaningful moments quickly enough that people will actually keep the timeline current.</p>
              </div>
              <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">Outcome</div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Fewer forgotten contributions, cleaner handoffs, and tighter one-on-one prep.</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Core flow" description="No setup maze. The product is deliberately narrow.">
            <ol className="space-y-2.5 text-sm leading-6 text-[color:var(--muted)]">
              <li>1. A manager creates one board for the team.</li>
              <li>2. Reportees join with a code or direct link.</li>
              <li>3. Work moments are captured in a running timeline.</li>
              <li>4. Managers review evidence, write private notes, and keep context attached to the right person.</li>
            </ol>
          </SectionCard>
        </div>
      </div>
    </AppFrame>
  );
}
