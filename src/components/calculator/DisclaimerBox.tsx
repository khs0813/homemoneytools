export function DisclaimerBox({ children }: { children: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
      <strong>참고용 안내:</strong> {children}
    </div>
  );
}
