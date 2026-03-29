"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function OpenTimelineButton({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        setPending(true);
        startTransition(() => {
          router.push(href);
        });
      }}
      aria-label="Open entries"
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full bg-blue-700 px-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-70",
        className,
      )}
      disabled={pending}
    >
      {pending ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" />
          Opening
        </>
      ) : (
        <>
          <span aria-hidden="true">↗</span>
          Open entries
        </>
      )}
    </button>
  );
}
