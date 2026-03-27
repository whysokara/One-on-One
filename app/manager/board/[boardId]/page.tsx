import Link from "next/link";
import { notFound } from "next/navigation";
import { AddAnnouncementForm } from "@/components/entry-forms";
import { AppFrame, EmptyState, MemberCard, PageHeader, SectionCard, SummaryTile } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { requireAwsConfig } from "@/lib/config";
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
    notFound();
  }

  const config = requireAwsConfig();
  const inviteLink = `${config.appBaseUrl.replace(/\/$/, "")}/join?boardId=${dashboard.board.id}`;

  return (
    <AppFrame user={user}>
      <div className="flex w-full flex-col gap-5">
        <PageHeader
          eyebrow="Manager Board"
          title={dashboard.board.name}
          description={
            dashboard.board.description || "A review-ready record of achievements, blockers, learning, and private coaching context."
          }
          aside={
            <>
              <div className="rounded-[22px] bg-sand px-4 py-4 text-sm text-ink/75">
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink/45">Invite Code</div>
                <div className="mt-1.5 text-lg font-semibold tracking-[0.04em] text-ink">{dashboard.board.inviteCode}</div>
              </div>
              <div className="rounded-[22px] bg-fog px-4 py-4 text-sm text-ink/75">
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink/45">Invite Link</div>
                <Link className="mt-1.5 block break-all font-medium text-pine" href={inviteLink}>
                  {inviteLink}
                </Link>
              </div>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryTile label="Total reportees" value={dashboard.summary.totalReportees} />
          <SummaryTile label="Total entries" value={dashboard.summary.totalEntries} />
          <SummaryTile label="Entries this month" value={dashboard.summary.entriesThisMonth} />
          <SummaryTile label="Manager notes" value={dashboard.summary.managerNotesCount} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.32fr)_22rem]">
          <SectionCard title="Reportees" description="Each card rolls up shared entry count and recent activity so you can scan the team quickly.">
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

          <SectionCard title="Announcements" description="Use this for short team reminders, prompts, or rollout notes.">
            <div className="space-y-3.5">
              <AddAnnouncementForm boardId={dashboard.board.id} />
              {dashboard.announcements.length ? (
                <div className="space-y-3">
                  {dashboard.announcements.map((announcement) => (
                    <article key={announcement.id} className="rounded-[20px] bg-fog/85 p-4">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-ink/45">{formatDate(announcement.createdAt)}</div>
                      <h3 className="mt-2 text-base font-semibold text-ink">{announcement.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink/70">{announcement.message}</p>
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
