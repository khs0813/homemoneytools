export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-w-0 gap-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-4">
      <span className="min-w-0 text-slate-600">{label}</span>
      <strong className="min-w-0 break-words text-left text-slate-950 sm:text-right">{value}</strong>
    </div>
  );
}
