export default function HomeLoading() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #ffffff 0%, #f0f4f8 40%, #e8edf4 70%, #f5f3f0 100%)" }}
    >
      {/* Hero skeleton */}
      <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200/80 to-gray-300/60 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-6 right-6 md:left-16 md:right-16">
          <div className="h-3 w-28 bg-white/30 rounded-full mb-5 animate-pulse" />
          <div className="h-12 md:h-16 w-3/4 max-w-xl bg-white/30 rounded-2xl mb-4 animate-pulse" />
          <div className="h-5 w-1/2 max-w-md bg-white/20 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Section skeletons */}
      <div className="max-w-7xl mx-auto px-4 py-14 space-y-14">
        {Array.from({ length: 3 }).map((_, s) => (
          <div key={s}>
            <div className="h-3 w-24 bg-gray-200 rounded-full mb-3 animate-pulse" />
            <div className="h-8 w-64 bg-gray-200/80 rounded-2xl mb-6 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full h-64 rounded-3xl bg-white/70 border border-gray-200/80 shadow-sm animate-pulse"
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
