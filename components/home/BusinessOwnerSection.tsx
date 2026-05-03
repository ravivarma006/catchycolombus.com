import Link from "next/link";

const STEPS = [
  {
    icon: "📋",
    title: "Submit Your Listing",
    desc: "Add your business, event, or coupon in under 3 minutes. Free, no credit card required.",
  },
  {
    icon: "✅",
    title: "Get Approved Fast",
    desc: "Our team reviews and approves quality submissions within 24 hours, usually faster.",
  },
  {
    icon: "🚀",
    title: "Reach Columbus",
    desc: "Get discovered by thousands of Columbus residents and suburb visitors searching every week.",
  },
];

export default function BusinessOwnerSection() {
  return (
    <section className="relative py-20 md:py-28 px-6 md:px-16 lg:px-24 overflow-hidden">
      {/* primary teal background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, #0a3a47 50%, #062834 100%)",
        }}
      />

      {/* decorative rings */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-accent/20 pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full border border-accent/15 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-5 backdrop-blur-sm">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
              For Business Owners
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] mb-5"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Built for Columbus.{" "}
            <span style={{ color: "var(--accent)" }}>By Columbus.</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Got a business, event, or special offer?
            List it for free and reach thousands of locals and suburb visitors
            actively looking for what you offer.
          </p>
        </div>

        {/* 3 steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 hover:bg-white/10 hover:border-accent/30 transition-all duration-300 group"
            >
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-accent text-[#020C1B] flex items-center justify-center font-black text-sm shadow-lg">
                {i + 1}
              </div>

              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3
                className="text-white text-xl font-bold mb-2"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {step.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/services/submit"
            className="inline-flex items-center gap-2 bg-accent text-[#020C1B] font-bold text-sm px-8 py-4 rounded-2xl transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-amber-500/30"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            List Your Business — It&apos;s Free
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-white/80 font-semibold text-sm px-6 py-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:text-white transition-all"
          >
            See Premium Plans
          </Link>
        </div>

        {/* Trust line */}
        <p className="text-center text-white/40 text-xs mt-8 tracking-wider">
          Already trusted by 200+ Columbus businesses · No setup fees · Cancel anytime
        </p>
      </div>
    </section>
  );
}
