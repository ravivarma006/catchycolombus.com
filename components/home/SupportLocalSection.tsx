import Link from "next/link";

const NEIGHBORHOODS = [
  "Short North", "German Village", "Easton", "Dublin", "Westerville",
  "Hilliard", "Grove City", "Gahanna", "Powell", "Worthington",
  "Upper Arlington", "Bexley", "New Albany", "Reynoldsburg", "Pickerington",
];

export default function SupportLocalSection() {
  return (
    <section className="relative py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-white overflow-hidden">
      {/* soft ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* LEFT: copy */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
              Columbus &amp; Suburbs
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.05] mb-6"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Columbus Runs on{" "}
            <span style={{ color: "var(--accent)" }}>Local</span>.
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            From Short North to Westerville, Dublin to Gahanna — discover
            the people, places, and deals that make this city worth living in.
            We celebrate the small businesses, hidden gems, and weekend
            traditions that define Columbus, Ohio.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-7 py-3.5 rounded-2xl transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-primary/20"
            >
              Browse Local Services
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/coupons"
              className="inline-flex items-center gap-2 bg-accent text-[#020C1B] font-bold text-sm px-7 py-3.5 rounded-2xl transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-amber-500/20"
            >
              Get Free Coupons
            </Link>
          </div>
        </div>

        {/* RIGHT: neighborhood pills */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold tracking-widest uppercase shadow-lg z-10">
            15+ Neighborhoods
          </div>
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-200/80 rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/40">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">
              We cover all of Columbus
            </p>
            <div className="flex flex-wrap gap-2.5">
              {NEIGHBORHOODS.map((n) => (
                <span
                  key={n}
                  className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:border-accent hover:text-accent hover:shadow-md transition-all cursor-default"
                >
                  {n}
                </span>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200/80 flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-yellow-400 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-teal-700 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 border-2 border-white" />
              </div>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">2,000+ residents</strong>{" "}
                check Catch Columbus every week
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
