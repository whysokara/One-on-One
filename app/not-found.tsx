import Link from "next/link";
import { AppFrame } from "@/components/ui";

export default function NotFound() {
  return (
    <AppFrame>
      <div className="flex w-full items-center justify-center p-4 min-h-[50vh]">
        <div className="w-full max-w-md rounded-xl border border-slate-100 bg-white p-8 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <h2 className="font-display text-5xl font-extrabold text-slate-900 mb-2">404</h2>
          <p className="text-sm font-medium text-slate-500 mb-8">The requested page could not be found.</p>
          <Link href="/" className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-700 px-6 text-sm font-bold text-white transition-colors hover:bg-blue-800">
            Return Home
          </Link>
        </div>
      </div>
    </AppFrame>
  );
}
