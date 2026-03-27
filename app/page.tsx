import Link from "next/link";
import { AppFrame, Eyebrow, InfoStrip, SectionCard } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <AppFrame user={user}>
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.95fr]">
        <section className="rounded-[30px] bg-pine px-5 py-6 text-white shadow-card md:px-7 md:py-7">
          <Eyebrow>Performance Memory System</Eyebrow>
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div>
              <h1 className="max-w-3xl text-[2.7rem] font-semibold leading-[0.96] tracking-[-0.06em] md:text-[3.7rem]">
                Keep every review-ready moment in one place.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/78 md:text-lg">
                One-on-One helps managers and reportees log wins, learning, blockers, and coaching context as the year happens, not six months later.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Link href="/signup" className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-pine">
                  Create workspace
                </Link>
                <Link href="/login" className="rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-white">
                  Open account
                </Link>
              </div>
            </div>
            <InfoStrip
              items={[
                { label: "Best for", value: "Managers with 3-15 reportees" },
                { label: "Logs", value: "Achievements, blockers, learning, notes" },
                { label: "Outcome", value: "Fairer reviews with less chasing" },
              ]}
            />
          </div>
        </section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <SectionCard title="What It Does">
            <p className="text-sm leading-6 text-ink/75">
              A focused performance log for teams. It is not HR software, project management, or chat. It is a memory layer for appraisal season.
            </p>
          </SectionCard>
          <SectionCard title="Manager View">
            <p className="text-sm leading-6 text-ink/75">
              Invite reportees, scan updates fast, and keep private observations attached to the right person all year.
            </p>
          </SectionCard>
          <SectionCard title="Reportee View">
            <p className="text-sm leading-6 text-ink/75">
              Add concrete work moments in under a minute and keep a clean personal timeline ready for self-appraisal.
            </p>
          </SectionCard>
          <SectionCard title="Core Flow">
            <ul className="space-y-1.5 text-sm leading-6 text-ink/75">
              <li>Create one team board</li>
              <li>Share invite code or join link</li>
              <li>Log work moments through the year</li>
              <li>Review each timeline with evidence, not recall</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </AppFrame>
  );
}
