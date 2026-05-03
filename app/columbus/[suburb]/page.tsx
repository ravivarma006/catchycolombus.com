import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SUBURBS, getSuburb } from "@/lib/suburbs";
import { breadcrumbSchema, faqSchema, jsonLd } from "@/lib/schema";

interface Props {
  params: { suburb: string };
}

export async function generateStaticParams() {
  return SUBURBS.map((s) => ({ suburb: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSuburb(params.suburb);
  if (!s) return {};
  const title = `Things to Do, Events & Local Businesses in ${s.name}, Ohio`;
  const description = `${s.description} Find ${s.name} events, local services, coupons, and things to do — all on Catch Columbus.`;
  return {
    title,
    description,
    keywords: [
      `${s.name} Ohio`,
      `things to do in ${s.name}`,
      `${s.name} events`,
      `${s.name} restaurants`,
      `${s.name} businesses`,
      `${s.name} coupons`,
      `Columbus suburbs`,
      s.knownFor,
    ],
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function SuburbPage({ params }: Props) {
  const suburb = getSuburb(params.suburb);
  if (!suburb) notFound();

  const faqs = [
    {
      question: `What is there to do in ${suburb.name}, Ohio?`,
      answer: `${suburb.name} offers many things to do including ${suburb.highlights
        .slice(0, 3)
        .join(", ")}. ${suburb.description}`,
    },
    {
      question: `Is ${suburb.name} a suburb of Columbus, Ohio?`,
      answer: `Yes, ${suburb.name} is a suburb of Columbus, Ohio with approximately ${suburb.population} residents. ${suburb.name} is part of the greater Columbus metropolitan area.`,
    },
    {
      question: `What is ${suburb.name} known for?`,
      answer: `${suburb.name} is best known for ${suburb.knownFor}. ${suburb.tagline}`,
    },
    {
      question: `How do I find local businesses and coupons in ${suburb.name}?`,
      answer: `Browse the Catch Columbus services and coupons pages to find verified ${suburb.name} businesses, restaurants, and current deals. Our directory covers all of greater Columbus including ${suburb.name}.`,
    },
  ];

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Columbus Suburbs", url: "/" },
    { name: suburb.name, url: `/columbus/${suburb.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD for SEO + AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faqs)) }}
      />

      <div
        className="min-h-screen relative"
        style={{
          background:
            "linear-gradient(160deg, #ffffff 0%, #f0f4f8 40%, #e8edf4 70%, #f5f3f0 100%)",
        }}
      >
        {/* Ambient glow */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/8 blur-[120px]" />
        </div>

        {/* Hero */}
        <div className="relative z-10 pt-16 pb-10 px-4 max-w-5xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>{" "}
            / <span className="text-gray-900">{suburb.name}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
              Columbus Suburb · {suburb.population} Residents
            </span>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.05] mb-5"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {suburb.name}, <span style={{ color: "var(--accent)" }}>Ohio</span>
          </h1>

          <p className="text-2xl md:text-3xl text-gray-700 font-medium mb-6">
            {suburb.tagline}
          </p>

          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mb-10">
            {suburb.description}
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {suburb.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent flex-shrink-0">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{h}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-16">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-7 py-3.5 rounded-2xl hover:scale-[1.03] active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Find {suburb.name} Businesses
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              href="/coupons"
              className="inline-flex items-center gap-2 bg-accent text-[#020C1B] font-bold text-sm px-7 py-3.5 rounded-2xl hover:scale-[1.03] active:scale-95 transition-all shadow-lg shadow-amber-500/20"
            >
              {suburb.name} Coupons
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-gray-700 font-semibold text-sm px-7 py-3.5 rounded-2xl border-2 border-gray-300 hover:border-primary hover:text-primary transition-all"
            >
              Upcoming Events
            </Link>
          </div>

          {/* FAQ */}
          <div className="border-t border-gray-200 pt-12">
            <h2
              className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-8"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-bold text-gray-900 hover:text-primary transition-colors">
                    {faq.question}
                    <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Other suburbs */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">
              Other Columbus Suburbs
            </p>
            <div className="flex flex-wrap gap-2">
              {SUBURBS.filter((s) => s.slug !== suburb.slug).map((s) => (
                <Link
                  key={s.slug}
                  href={`/columbus/${s.slug}`}
                  className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:border-accent hover:text-accent hover:shadow-md transition-all"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
