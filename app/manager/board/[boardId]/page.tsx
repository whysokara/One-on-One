import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { AddAnnouncementForm, RemoveBoardMemberForm } from "@/components/entry-forms";
import { AppFrame, BoardYearStrip, EmptyState, SectionCard } from "@/components/ui";
import { InviteLinkButton } from "@/components/invite-link-button";
import { ReporteeCard } from "@/components/reportee-card";
import { requireRole } from "@/lib/auth";
import { getManagerDashboard, summarizeBoardYearMetrics } from "@/lib/queries";
import { buildInviteLink } from "@/lib/urls";

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

  const requestHeaders = await headers();
  const inviteLink = buildInviteLink(dashboard.board.id, requestHeaders);
  const yearMetrics = summarizeBoardYearMetrics(dashboard.entries);

  return (
    <AppFrame user={user}>
      <div className="flex w-full flex-col gap-5">
        <section className="panel relative overflow-hidden bg-gradient-to-br from-white via-white to-emerald-50/30 p-5 md:p-6">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          <div className="absolute right-0 top-0 h-28 w-28 -translate-y-10 translate-x-10 rounded-full bg-emerald-100/50 blur-3xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
              {dashboard.board.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-2 text-blue-700 ring-1 ring-inset ring-blue-100">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-400">Invite code</span>
                <span className="font-display text-sm font-extrabold tracking-[0.14em] text-slate-950">{dashboard.board.inviteCode}</span>
              </div>
              <InviteLinkButton href={inviteLink} />
            </div>
          </div>
        </section>

        <BoardYearStrip
          total={yearMetrics.total}
          certifications={yearMetrics.certifications}
          awards={yearMetrics.awards}
          needsAttention={yearMetrics.needsAttention}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.34fr)_21rem]">
          <SectionCard title={`Your reportees (${dashboard.members.length})`}>
            <div className="space-y-3">
              {dashboard.members.length ? (
                dashboard.members.map((member) => (
                  <ReporteeCard
                    key={member.id}
                    name={member.fullName}
                    email={member.email}
                    entryCount={member.entryCount}
                    href={`/manager/board/${dashboard.board.id}/employee/${member.id}`}
                    actions={<RemoveBoardMemberForm boardId={dashboard.board.id} employeeId={member.id} />}
                  />
                ))
              ) : (
                <EmptyState title="No reportees yet" body="Share the invite code or link to let your team join this board." />
              )}
            </div>
          </SectionCard>

          <SectionCard title="Announcements">
            <div className="space-y-3">
              {dashboard.announcements.length ? (
                <div className="space-y-3">
                  {dashboard.announcements.map((announcement) => (
                    <article
                      key={announcement.id}
                      className="rounded-xl bg-slate-50/80 px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-inset ring-slate-100"
                    >
                      <h3 className="mt-2 text-base font-semibold text-slate-900">{announcement.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{announcement.message}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="No announcements yet" body="Use this panel for light team reminders or rollout notes." />
              )}
              <AddAnnouncementForm boardId={dashboard.board.id} />
            </div>
          </SectionCard>
        </div>
      </div>
    </AppFrame>
  );
}
