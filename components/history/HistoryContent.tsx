"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface PageContent {
  hero_heading: string;
  hero_subheading: string;
  history_title: string;
  history_text: string;
  achievements_title: string;
  achievements: string[];
}

const STATS = [
  { value: "1812", label: "Year Founded" },
  { value: "915K+", label: "City Population" },
  { value: "2.1M+", label: "Metro Population" },
  { value: "#1", label: "Largest City in Ohio" },
];

const TIMELINE = [
  {
    year: "1797",
    event: "Franklinton founded by Lucas Sullivant",
    detail: "The first European-American settlement on the west bank of the Scioto River — the seed of modern Columbus.",
  },
  {
    year: "1812",
    event: "Columbus officially founded and named",
    detail: "The Ohio General Assembly selected the east bank site and named the new city after explorer Christopher Columbus.",
  },
  {
    year: "1816",
    event: "Columbus becomes Ohio's state capital",
    detail: "The state government moved from Chillicothe, cementing Columbus as Ohio's political and administrative center.",
  },
  {
    year: "1827",
    event: "National Road reaches Columbus",
    detail: "The historic east-west highway (now US Route 40) brought commerce, settlers, and rapid economic growth.",
  },
  {
    year: "1850",
    event: "Railroad era transforms the city",
    detail: "The Columbus & Xenia Railroad connected Columbus to the regional rail network, fueling industrial expansion.",
  },
  {
    year: "1870",
    event: "Ohio State University established",
    detail: "Founded as the Ohio Agricultural and Mechanical College, OSU grew into one of the largest universities in the United States.",
  },
  {
    year: "1913",
    event: "Great Flood reshapes Franklinton",
    detail: "The catastrophic 1913 flood led to major flood-control infrastructure along the Scioto River, transforming the riverfront.",
  },
  {
    year: "1950s",
    event: "Post-war suburban boom",
    detail: "Columbus expanded rapidly with new neighborhoods and infrastructure, emerging as a major Midwestern economic center.",
  },
  {
    year: "1980s",
    event: "German Village restoration completed",
    detail: "German Village became the largest privately funded historic restoration in the United States — now a National Historic Landmark.",
  },
  {
    year: "Today",
    event: "Ohio's largest and fastest-growing city",
    detail: "Columbus has surpassed Cleveland to become Ohio's largest city and ranks among America's fastest-growing major metropolitan areas.",
  },
];

const NEIGHBORHOODS = [
  {
    name: "Short North",
    description: "The vibrant arts and entertainment district — home to galleries, independent restaurants, boutiques, and nightlife along High Street.",
    color: "from-purple-900 to-primary",
    icon: "🎨",
  },
  {
    name: "German Village",
    description: "A National Historic Landmark featuring 19th-century brick homes, cobblestone streets, and the legendary Book Loft.",
    color: "from-amber-900 to-primary",
    icon: "🏘️",
  },
  {
    name: "Downtown",
    description: "Columbus's commercial, cultural, and civic core — home to the Arena District, Columbus Commons, and major employers.",
    color: "from-primary to-blue-900",
    icon: "🏙️",
  },
  {
    name: "Franklinton",
    description: "The birthplace of Columbus, now reborn as the 'Franklinton Arts District' with murals, studios, and creative spaces.",
    color: "from-teal-900 to-primary",
    icon: "🎭",
  },
  {
    name: "Clintonville",
    description: "A beloved eclectic neighborhood known for independent shops, community gardens, and the Whetstone Park of Roses.",
    color: "from-green-900 to-primary",
    icon: "🌳",
  },
  {
    name: "Victorian Village",
    description: "Stunning late 19th-century architecture surrounding Goodale Park — the city's oldest public park, established in 1851.",
    color: "from-rose-900 to-primary",
    icon: "🏛️",
  },
  {
    name: "Italian Village",
    description: "Once home to Italian immigrants, now a trendy district of renovated row houses, wine bars, and artisan coffee shops.",
    color: "from-orange-900 to-primary",
    icon: "🍷",
  },
  {
    name: "Arena District",
    description: "The modern entertainment hub built around Nationwide Arena — home to NHL's Columbus Blue Jackets and Huntington Park.",
    color: "from-indigo-900 to-primary",
    icon: "🏒",
  },
];

const ACHIEVEMENTS = [
  "Home to The Ohio State University — one of the 10 largest universities in the United States with 60,000+ students",
  "America's most consistent 'test market city' — companies nationwide pilot new products and concepts here first",
  "Headquarters of Fortune 500 companies including Nationwide Insurance, Cardinal Health, and L Brands",
  "German Village — the largest privately funded historic preservation district in the United States",
  "Named one of the fastest-growing major cities in the Midwest by the U.S. Census Bureau",
  "Home to the Columbus Museum of Art and COSI (Center of Science and Industry) — ranked among the top science museums in the nation",
  "Columbus International Airport connects the city to 50+ non-stop destinations across North America",
  "A national leader in healthcare and medical research, anchored by OhioHealth and Nationwide Children's Hospital",
  "Columbus Crew (MLS) won the first-ever MLS Cup in 1996 — the original American professional soccer champions",
  "Recognized as a top-10 city for tech startups in the Midwest, attracting major investment from Silicon Valley firms",
  "The Scioto Mile and Bicentennial Park transformed the downtown riverfront into 175 acres of public green space",
  "Columbus's food and restaurant scene earns consistent recognition from James Beard Award nominees and national food media",
];

const FAQ = [
  {
    question: "When was Columbus, Ohio founded?",
    answer:
      "Columbus, Ohio was officially founded in 1812 when the Ohio General Assembly selected a site on the east bank of the Scioto River and named the new city after explorer Christopher Columbus. It became Ohio's state capital in 1816.",
  },
  {
    question: "Who founded Columbus, Ohio?",
    answer:
      "Columbus was established by the Ohio General Assembly in 1812. The nearby settlement of Franklinton, which later merged into Columbus, was founded in 1797 by Virginia surveyor Lucas Sullivant.",
  },
  {
    question: "Why is Columbus the capital of Ohio?",
    answer:
      "Columbus was chosen as Ohio's state capital in 1812 primarily for its central geographic location within the state. The government officially moved from Chillicothe to Columbus in 1816, making it the permanent seat of Ohio's government.",
  },
  {
    question: "What is Columbus, Ohio famous for?",
    answer:
      "Columbus is famous for being home to The Ohio State University, serving as Ohio's state capital, its thriving food and arts scene, the Short North Arts District, the historic German Village neighborhood, and being one of America's fastest-growing major cities.",
  },
  {
    question: "What is the population of Columbus, Ohio?",
    answer:
      "Columbus has a city population of approximately 915,000, making it the largest city in Ohio and the 14th largest in the United States. The greater Columbus metropolitan area has a population of over 2.1 million.",
  },
  {
    question: "What is German Village in Columbus?",
    answer:
      "German Village is a National Historic Landmark neighborhood in Columbus, Ohio. It is the largest privately funded historic preservation district in the United States, featuring 19th-century German-immigrant architecture, cobblestone streets, and brick homes south of downtown.",
  },
];

function FadeInUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HistoryContent({ content }: { content: PageContent }) {
  const historyText =
    content.history_text ||
    "Columbus was founded in 1812 on the east bank of the Scioto River, chosen by the Ohio General Assembly as Ohio's new state capital due to its central location. Named after the explorer Christopher Columbus, the young city grew steadily as the National Road arrived in 1827, bringing settlers and trade from the East Coast. The arrival of the railroad in 1850 transformed Columbus into an industrial and commercial hub.";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "City",
    name: "Columbus",
    description:
      "Columbus is the capital and largest city of Ohio, United States. Founded in 1812, it is home to The Ohio State University and is one of America's fastest-growing major cities.",
    containedInPlace: {
      "@type": "State",
      name: "Ohio",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 39.9612,
      longitude: -82.9988,
    },
    url: "https://catchcolumbus.com/history",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://catchcolumbus.com" },
      { "@type": "ListItem", position: 2, name: "History", item: "https://catchcolumbus.com/history" },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div
        className="min-h-screen relative"
        style={{
          background:
            "linear-gradient(160deg, #ffffff 0%, #f0f4f8 40%, #e8edf4 70%, #f5f3f0 100%)",
        }}
      >
        {/* Ambient glows — same as Events & Things To Do */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/8 blur-[120px]" />
          <div className="absolute top-[50%] left-[40%] w-[30%] h-[30%] rounded-full bg-blue-200/20 blur-[100px]" />
        </div>

        {/* ── Page Header ───────────────────────────── */}
        <div className="relative z-10 pt-16 pb-10 px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
              Columbus, Ohio
            </span>
          </div>
          <h1
            className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            History of{" "}
            <span style={{ color: "var(--accent)" }}>Columbus</span>
          </h1>
          <p className="text-gray-500 mt-3 text-lg font-medium max-w-2xl">
            From a frontier settlement on the Scioto River in 1812 to Ohio's largest, most
            dynamic city — the story of Columbus is one of vision, resilience, and growth.
          </p>
        </div>

        {/* ── Stats Bar ─────────────────────────────── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: "backOut" }}
                className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl shadow-lg shadow-gray-200/60 px-6 py-8 flex flex-col items-center text-center hover:shadow-xl hover:shadow-gray-300/60 transition-all duration-300"
              >
                <span
                  className="text-4xl font-extrabold mb-1"
                  style={{ color: "var(--accent)" }}
                >
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Founding Story ────────────────────────── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
          <FadeInUp className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl shadow-lg shadow-gray-200/60 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-8 bg-accent" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
                Our Story
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-gray-900 mb-5 tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              A City Born by Design
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-gray-600 text-lg leading-relaxed">
              <div>
                <p className="mb-4">{historyText}</p>
                <p>
                  The establishment of Ohio State University in 1870 anchored Columbus as an
                  intellectual and cultural capital. By the 20th century, the city had become
                  a national testing ground for consumer trends, earning the nickname
                  "America's test market city."
                </p>
              </div>
              <div>
                <p className="mb-4">
                  The 1913 Great Flood, which devastated the low-lying Franklinton district,
                  prompted major flood-control infrastructure and reshaped Columbus's
                  relationship with the Scioto River. Decades later, the river would become a
                  centerpiece of downtown revitalization through the Scioto Mile project.
                </p>
                <p>
                  Today, Columbus thrives as Ohio's economic engine — a hub for technology,
                  healthcare, finance, and higher education, welcoming tens of thousands of
                  new residents each year with its affordable cost of living, world-class
                  universities, and welcoming community.
                </p>
              </div>
            </div>
          </FadeInUp>
        </div>

        {/* ── Timeline ─────────────────────────────── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
          <FadeInUp className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-[2px] w-8 bg-accent" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
                Key Milestones
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Columbus Through the{" "}
              <span style={{ color: "var(--accent)" }}>Ages</span>
            </h2>
          </FadeInUp>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 transform md:-translate-x-px" />

            <div className="space-y-6">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className={`relative flex gap-6 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-start`}
                >
                  {/* Dot */}
                  <div className="absolute left-5 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-2 border-white shadow-md shadow-amber-300/40 mt-3 z-10" />

                  {/* Card */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[46%] bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl shadow-lg shadow-gray-200/60 p-5 hover:shadow-xl hover:shadow-gray-300/60 transition-all duration-300 ${
                      i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <span
                      className="text-xs font-black tracking-[0.15em] uppercase mb-1 block"
                      style={{ color: "var(--accent)" }}
                    >
                      {item.year}
                    </span>
                    <h3 className="text-gray-900 font-bold text-base mb-1">{item.event}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Achievements ─────────────────────────── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
          <FadeInUp className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-[2px] w-8 bg-accent" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
                Why Columbus
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              City <span style={{ color: "var(--accent)" }}>Achievements</span> &amp; Highlights
            </h2>
          </FadeInUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((achievement, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl shadow-lg shadow-gray-200/60 p-6 hover:shadow-xl hover:shadow-gray-300/60 transition-all duration-300 cursor-default"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <span className="text-lg" style={{ color: "var(--accent)" }}>
                    ★
                  </span>
                </div>
                <p className="text-gray-700 font-medium leading-relaxed text-sm">
                  {achievement}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Neighborhoods ────────────────────────── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
          <FadeInUp className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-[2px] w-8 bg-accent" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
                Explore the City
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Iconic <span style={{ color: "var(--accent)" }}>Neighborhoods</span>
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl text-lg font-medium">
              Every corner of Columbus tells a different story. Explore the districts that define
              this city.
            </p>
          </FadeInUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NEIGHBORHOODS.map((n, i) => (
              <motion.div
                key={n.name}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={`relative bg-gradient-to-br ${n.color} rounded-3xl p-6 text-white overflow-hidden cursor-default shadow-md hover:shadow-xl transition-all duration-300`}
              >
                <div className="text-4xl mb-3">{n.icon}</div>
                <h3 className="text-lg font-bold mb-2">{n.name}</h3>
                <p className="text-white/75 text-sm leading-relaxed">{n.description}</p>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── FAQ / AEO Section ─────────────────────── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
          <FadeInUp className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-[2px] w-8 bg-accent" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
                Common Questions
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Columbus <span style={{ color: "var(--accent)" }}>FAQs</span>
            </h2>
          </FadeInUp>

          <div className="space-y-4">
            {FAQ.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl shadow-lg shadow-gray-200/60 p-6 hover:shadow-xl hover:shadow-gray-300/60 transition-all duration-300"
              >
                <h3 className="text-gray-900 font-bold text-base md:text-lg mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
          <FadeInUp>
            <div className="bg-primary rounded-3xl p-10 md:p-16 text-center text-white overflow-hidden relative">
              <motion.div
                className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, var(--accent), transparent)" }}
                animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, #60A5FA, transparent)" }}
                animate={{ scale: [1, 1.15, 1], rotate: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative">
                <h2
                  className="text-3xl md:text-4xl font-black mb-4"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Ready to Catch Columbus?
                </h2>
                <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                  Discover local events, trusted services, and exclusive coupons — all in one place.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/events"
                    className="w-full sm:w-auto bg-accent text-[#020C1B] font-bold px-8 py-3 rounded-2xl hover:bg-yellow-400 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20"
                  >
                    Browse Events →
                  </Link>
                  <Link
                    href="/things-to-do"
                    className="w-full sm:w-auto border-2 border-white/50 text-white font-semibold px-8 py-3 rounded-2xl hover:bg-white/10 hover:border-white transition-all"
                  >
                    Things To Do
                  </Link>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </>
  );
}
