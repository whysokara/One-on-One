"use client";

import { KeyboardEvent, ReactNode, startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function ReporteeCard({
  name,
  email,
  entryCount,
  href,
  actions,
}: {
  name: string;
  email: string;
  entryCount: number;
  href: string;
  actions?: ReactNode;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const openTimeline = () => {
    if (pending) return;
    setPending(true);
    startTransition(() => {
      router.push(href);
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openTimeline();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`Open ${name}'s entries`}
      onClick={openTimeline}
      onKeyDown={onKeyDown}
      className={cn(
        "group relative panel cursor-pointer p-4 outline-none transition",
        "hover:border-blue-200 hover:shadow-sm focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-200",
        pending && "border-blue-200 shadow-sm",
      )}
    >
      {pending ? (
        <div className="absolute inset-x-4 top-3 z-10 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-700 shadow-sm ring-1 ring-inset ring-blue-100">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" aria-hidden="true" />
          Opening entries
        </div>
      ) : null}
      <div className={cn("relative z-0 flex items-center justify-between gap-4", pending && "opacity-70")}>
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-700">{name}</div>
          <div className="truncate text-xs font-medium text-slate-500">{email}</div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="inline-flex shrink-0 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-slate-100">
            {entryCount} entries
          </span>
          {actions ? (
            <div
              className="relative z-20 flex items-center self-center"
              onClickCapture={(event) => event.stopPropagation()}
              onPointerDownCapture={(event) => event.stopPropagation()}
            >
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
