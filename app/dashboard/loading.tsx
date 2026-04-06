export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#020C1B]">
      <div className="max-w-5xl mx-auto px-4 py-10 md:px-8 md:py-14">
        {/* Header skeleton */}
        <div className="h-10 w-64 bg-white/10 rounded-xl mb-2 animate-pulse" />
        <div className="h-4 w-48 bg-white/10 rounded-full mb-8 animate-pulse" />

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>

        {/* Action cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
