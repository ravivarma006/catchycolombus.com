export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-[#020C1B]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Search bar skeleton */}
        <div className="h-12 w-full max-w-xl mx-auto bg-white/10 rounded-2xl mb-12 animate-pulse" />

        {/* Results skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
