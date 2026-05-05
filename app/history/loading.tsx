export default function HistoryLoading() {
  return (
    <div
      className="min-h-screen relative"
      style={{ background: "linear-gradient(160deg, #ffffff 0%, #f0f4f8 40%, #e8edf4 70%, #f5f3f0 100%)" }}
    >
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/8 blur-[120px]" />
      </div>

      <div className="relative z-10 pt-16 pb-10 px-4 max-w-5xl mx-auto">
        <div className="h-3 w-32 bg-gray-200 rounded-full mb-6 animate-pulse" />
        <div className="h-14 w-2/3 max-w-xl bg-gray-200/80 rounded-2xl mb-4 animate-pulse" />
        <div className="h-4 w-1/2 max-w-md bg-gray-200/60 rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-24 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-40 rounded-3xl bg-white/70 border border-gray-200/80 shadow-sm animate-pulse"
            style={{ animationDelay: `${i * 0.06}s` }}
          />
        ))}
      </div>
    </div>
  );
}
