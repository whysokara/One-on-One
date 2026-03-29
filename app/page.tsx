import Link from "next/link";
import { AppFrame } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  const primaryHref = user ? "/workspace" : "/signup";
  const secondaryHref = user ? "/workspace" : "/login";
  const primaryLabel = user ? "Open workspace" : "Get started";

  return (
    <AppFrame user={user}>
      <div className="flex w-full flex-col lg:flex-row gap-12 h-full min-h-0 items-center justify-center pt-10">
        {/* Left Column: Flat corporate value prop */}
        <div className="flex flex-col w-full lg:w-5/12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="font-display text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
              Track your wins.<br/>
              <span className="text-blue-700">
                Ace your reviews.
              </span>
            </h1>
            <p className="mt-6 text-base font-medium leading-relaxed text-slate-500 max-w-lg">
              A shared timeline for you and your manager. Log your progress, stay in sync, and grow together.
            </p>
          </div>
          
          <div className="mt-10 flex flex-wrap items-center gap-4 shrink-0">
            <Link href={primaryHref} className="flex h-12 flex-1 min-w-[160px] items-center justify-center rounded-lg bg-blue-700 px-6 text-sm font-bold text-white transition-colors hover:bg-blue-800">
              {primaryLabel}
            </Link>
            {!user && (
              <Link href={secondaryHref} className="flex h-12 flex-1 min-w-[160px] items-center justify-center rounded-lg border border-slate-200 bg-white/80 px-6 text-sm font-bold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800">
                Log in
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Flat App Preview */}
        <div className="panel flex h-full max-h-[700px] w-full flex-col overflow-hidden lg:w-7/12">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
             <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-slate-200" />
               <div className="w-3 h-3 rounded-full bg-slate-200" />
               <div className="w-3 h-3 rounded-full bg-slate-200" />
             </div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Timeline</div>
          </div>
          
          <div className="flex-1 p-6 md:p-8 grid gap-4 overflow-y-auto content-start bg-slate-50/50">
             {/* Fake entry 1 */}
             <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-colors hover:border-slate-200 relative overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
               <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />
               <div className="flex justify-between items-center mb-3 pl-2">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Oct 12</span>
                 <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Certification</span>
               </div>
               <div className="font-display font-bold text-base text-slate-800 pl-2">AWS Solutions Architect</div>
               <div className="text-xs font-medium text-slate-500 mt-1 truncate pl-2">Passed the associate exam with score of 890.</div>
             </div>
             
             {/* Fake entry 2 */}
             <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-colors hover:border-slate-200 ml-8 md:ml-12 relative overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
               <div className="absolute left-0 top-0 h-full w-1 bg-blue-700" />
               <div className="flex justify-between items-center mb-3 pl-2">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sep 28</span>
                 <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">Appreciation</span>
               </div>
               <div className="font-display font-bold text-base text-slate-800 pl-2">Client Kudos: Acme Corp Launch</div>
               <div className="text-xs font-medium text-slate-500 mt-1 truncate pl-2">Received outstanding feedback on the delivery speed.</div>
             </div>

             {/* Fake entry 3 */}
             <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-colors hover:border-slate-200 relative overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
               <div className="absolute left-0 top-0 h-full w-1 bg-sky-600" />
               <div className="flex justify-between items-center mb-3 pl-2">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aug 15</span>
                 <span className="rounded bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-700">Award</span>
               </div>
               <div className="font-display font-bold text-base text-slate-800 pl-2">Won Internal Hackathon</div>
               <div className="text-xs font-medium text-slate-500 mt-1 truncate pl-2">Built an AI document parser that won 1st place overall.</div>
             </div>
             
             {/* Add Input Fake */}
             <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-5 text-center transition-colors hover:bg-white hover:border-blue-200 ml-8 md:ml-12 cursor-pointer mt-2">
               <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                 </svg>
               </div>
               <div className="text-[13px] font-bold text-slate-600 mb-1">Add achievement...</div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 inline-block px-3 py-1 rounded">Press ⌘K</div>
             </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
