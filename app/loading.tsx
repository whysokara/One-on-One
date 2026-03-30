export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-auto px-4 py-6">
      <div className="flex animate-pulse flex-col gap-6 md:flex-row">
        <div className="h-40 w-full md:w-1/3 animate-pulse rounded border border-slate-200 bg-slate-50" />
        <div className="grid w-full md:w-2/3 gap-4 sm:grid-cols-2">
          <div className="h-72 animate-pulse rounded border border-slate-200 bg-slate-50" />
          <div className="h-72 animate-pulse rounded border border-slate-200 bg-slate-50" />
        </div>
      </div>
    </div>
  );
}
