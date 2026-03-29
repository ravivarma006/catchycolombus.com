export default function EventsLoading() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)" }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/15 blur-[130px]" />
        <div className="absolute top-[40%] left-[35%] w-[40%] h-[40%] rounded-full bg-violet-600/15 blur-[110px]" />
      </div>

      {/* Header skeleton */}
      <div className="relative z-10 pt-16 pb-14 px-4 max-w-7xl mx-auto">
        <div className="h-3 w-32 bg-white/10 rounded-full mb-6 animate-pulse" />
        <div className="h-14 w-80 bg-white/10 rounded-2xl mb-4 animate-pulse" />
        <div className="h-4 w-96 bg-white/10 rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        {/* Featured skeleton */}
        <div className="mb-14">
          <div className="h-3 w-24 bg-white/10 rounded-full mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="w-full h-72 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="h-3 w-20 bg-white/10 rounded-full mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-72 rounded-3xl bg-white/5 border border-white/10 animate-pulse"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
