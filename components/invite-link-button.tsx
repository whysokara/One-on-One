"use client";

import { useState } from "react";

export function InviteLinkButton({ href }: { href: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(href);
        } catch {
          const temp = document.createElement("textarea");
          temp.value = href;
          temp.setAttribute("readonly", "true");
          temp.style.position = "absolute";
          temp.style.left = "-9999px";
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      className="secondary-button gap-2 px-3 py-2 text-xs"
      aria-label="Copy invite link"
      title="Copy invite link"
      >
      <span>Invite link</span>
      {copied ? (
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 text-emerald-600">
          <path
            d="M5.5 10.5 8.5 13.5 14.5 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 text-slate-500">
          <path
            d="M7.75 4.5H12.5a2 2 0 0 1 2 2v5.25M5.5 6.75h4.75a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2V8.75a2 2 0 0 1 2-2Zm2.5 2.5h4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
