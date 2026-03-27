import Link from "next/link";
import { AddAnnouncementForm } from "@/components/entry-forms";
import { EmptyState, AppFrame, MemberCard, SectionCard, SummaryTile } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { getManagerDashboard } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default async function ManagerBoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const user = await requireRole("manager");
  const { boardId } = await params;
  const dashboard = await getManagerDashboard(user.id);

  if (!dashboard || dashboard.board.id !== boardId) {
    return (
      <AppFrame user={user}>
        <EmptyState title="Board not found" body="This board does not exist or does not belong to your account." />
      </AppFrame>
    );
  }

  const inviteLink = `/join?boardId=${dashboard.board.id}`;

  return (
    <AppFrame user={user}>
      <div className="space-y-5">
        <section className="rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-card md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink/45">Manager Board</p>
              <h1 className="mt-2 text-[2.2rem] font-semibold tracking-[-0.05em] text-ink">{dashboard.board.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
                {dashboard.board.description || "A review-ready record of achievements, blockers, learning, and private coaching context."}
              </p>
            </div>
            <div className="grid gap-3 text-sm text-ink/75">
              <div className="rounded-2xl bg-sand px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink/45">Invite Code</div>
                <div className="mt-1 text-lg font-semibold text-ink">{dashboard.board.inviteCode}</div>
              </div>
              <div className="rounded-2xl bg-fog px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink/45">Invite Link</div>
                <Link className="mt-1 block font-medium text-pine" href={inviteLink}>
                  {inviteLink}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryTile label="Total reportees" value={dashboard.summary.totalReportees} />
          <SummaryTile label="Total entries" value={dashboard.summary.totalEntries} />
          <SummaryTile label="Entries this month" value={dashboard.summary.entriesThisMonth} />
          <SummaryTile label="Manager notes" value={dashboard.summary.managerNotesCount} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.28fr_0.92fr]">
          <SectionCard title="Reportees">
            <div className="space-y-4">
              {dashboard.members.length ? (
                dashboard.members.map((member) => (
                  <MemberCard
                    key={member.id}
                    name={member.fullName}
                    email={member.email}
                    entryCount={member.entryCount}
                    lastUpdated={member.lastUpdated}
                    href={`/manager/board/${dashboard.board.id}/employee/${member.id}`}
                  />
                ))
              ) : (
                <EmptyState title="No reportees yet" body="Share the invite code or link to let your team join this board." />
              )}
            </div>
          </SectionCard>

          <SectionCard title="Announcements">
            <div className="space-y-3.5">
              <AddAnnouncementForm boardId={dashboard.board.id} />
              {dashboard.announcements.length ? (
                <div className="space-y-2.5">
                  {dashboard.announcements.map((announcement) => (
                    <article key={announcement.id} className="rounded-[18px] bg-fog p-3.5">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-ink/45">{formatDate(announcement.createdAt)}</div>
                      <h3 className="mt-1.5 text-base font-semibold text-ink">{announcement.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-ink/70">{announcement.message}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="No announcements yet" body="Use this panel for light team reminders or rollout notes." />
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppFrame>
  );
}
