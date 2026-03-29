export default function AnnouncementsLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-14">
          <div className="h-3 w-28 bg-white/20 rounded-full mb-4 animate-pulse" />
          <div className="h-12 w-80 bg-white/20 rounded-2xl mb-3 animate-pulse" />
          <div className="h-4 w-96 bg-white/20 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-2xl bg-gray-50 border border-gray-100 animate-pulse"
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </div>
    </div>
  );
}
