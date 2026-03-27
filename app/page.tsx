import Link from "next/link";
import { AppFrame, Eyebrow, InfoStrip, SectionCard } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  const primaryHref = user ? (user.role === "manager" ? "/manager" : "/employee") : "/signup";
  const secondaryHref = user ? "/" : "/login";
  const primaryLabel = user ? "Open workspace" : "Create workspace";
  const secondaryLabel = user ? "Stay on overview" : "Open account";

  return (
    <AppFrame user={user}>
      <div className="grid w-full gap-5 xl:grid-cols-[minmax(0,1.42fr)_22rem]">
        <section className="rounded-[32px] bg-pine px-5 py-6 text-white shadow-card md:px-7 md:py-7">
          <Eyebrow>Performance Memory System</Eyebrow>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start">
            <div className="min-w-0">
              <h1 className="max-w-3xl text-[2.35rem] font-semibold leading-[0.96] tracking-[-0.065em] md:text-[3.15rem] xl:text-[3.45rem]">
                Track the work that deserves to be remembered.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
                One-on-One helps managers and reportees capture wins, blockers, learning, and coaching context while the year is still happening.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href={primaryHref} className="inline-flex min-h-11 items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-pine">
                  {primaryLabel}
                </Link>
                <Link href={secondaryHref} className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white">
                  {secondaryLabel}
                </Link>
              </div>
            </div>
            <InfoStrip
              className="grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-1"
              itemClassName="bg-white/12"
              items={[
                { label: "Built for", value: "Managers running recurring one-on-ones and review cycles" },
                { label: "Capture", value: "Achievements, blockers, learning, appreciation, and notes" },
                { label: "Result", value: "Fairer reviews with less recall bias and less chasing" },
              ]}
            />
          </div>
        </section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <SectionCard title="What It Does">
            <p className="text-sm leading-6 text-ink/75">
              A focused memory layer for performance conversations. Not HR software, not project management, and not chat.
            </p>
          </SectionCard>
          <SectionCard title="Manager View">
            <p className="text-sm leading-6 text-ink/75">
              Invite reportees, scan recent updates fast, and keep private observations attached to the right person all year.
            </p>
          </SectionCard>
          <SectionCard title="Reportee View">
            <p className="text-sm leading-6 text-ink/75">
              Add concrete work moments in under a minute and maintain a clean timeline ready for self-appraisal.
            </p>
          </SectionCard>
          <SectionCard title="Core Flow">
            <ul className="space-y-2 text-sm leading-6 text-ink/75">
              <li>Create one team board</li>
              <li>Share invite code or join link</li>
              <li>Log work moments throughout the year</li>
              <li>Review each timeline with evidence instead of memory</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </AppFrame>
  );
}
