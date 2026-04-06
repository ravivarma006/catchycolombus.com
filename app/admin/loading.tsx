export default function AdminLoading() {
  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      {/* Header skeleton */}
      <div className="h-8 w-48 bg-gray-200 rounded-lg mb-1 animate-pulse" />
      <div className="h-4 w-64 bg-gray-100 rounded-full mb-8 animate-pulse" />

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-gray-100 animate-pulse"
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </div>

      {/* Recent activity skeleton */}
      <div className="h-6 w-36 bg-gray-200 rounded-lg mb-4 animate-pulse" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-gray-100 animate-pulse"
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </div>
    </div>
  );
}
