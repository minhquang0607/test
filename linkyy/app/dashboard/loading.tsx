export default function DashboardLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-busy aria-label="Đang tải">
      <div className="h-10 w-64 rounded-2xl bg-ink/10" />
      <div className="h-28 rounded-3xl bg-ink/5" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="h-72 rounded-3xl bg-ink/5" />
        <div className="h-72 rounded-3xl bg-ink/5" />
      </div>
    </div>
  );
}
