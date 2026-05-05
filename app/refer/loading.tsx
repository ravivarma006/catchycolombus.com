export default function ReferLoading() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)" }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="h-12 w-3/4 max-w-md bg-white/10 rounded-2xl mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-1/2 max-w-sm bg-white/10 rounded-2xl mx-auto mb-6 animate-pulse" />
          <div className="h-4 w-2/3 max-w-lg bg-white/10 rounded-full mx-auto animate-pulse" />
        </div>

        <div className="rounded-3xl bg-white/5 border border-white/10 p-8 mb-6 animate-pulse">
          <div className="h-3 w-24 bg-white/10 rounded-full mb-4" />
          <div className="h-10 w-full bg-white/10 rounded-xl mb-4" />
          <div className="h-12 w-40 bg-white/10 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
