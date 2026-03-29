"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HOME_CATEGORY_IMAGES } from "@/lib/constants/images";

const CATEGORIES = [
  {
    id: "dining",
    title: "Dining & Nightlife",
    subtitle: "A taste of the city",
    link: "/services/dining",
    img: HOME_CATEGORY_IMAGES.dining,
    colSpan: "col-span-1 md:col-span-2 lg:col-span-5", // WIDER card
  },
  {
    id: "health",
    title: "Health & Wellness",
    subtitle: "Unwind & rejuvenate",
    link: "/services/health",
    img: HOME_CATEGORY_IMAGES.health,
    colSpan: "col-span-1 md:col-span-1 lg:col-span-3", // NARROWER card
  },
  {
    id: "realestate",
    title: "Real Estate",
    subtitle: "Find your dream home",
    link: "/services/realestate",
    img: HOME_CATEGORY_IMAGES.realestate,
    colSpan: "col-span-1 md:col-span-1 lg:col-span-3", // NARROWER card
  },
  {
    id: "home",
    title: "Home Services",
    subtitle: "Everything you need",
    link: "/services/home",
    img: HOME_CATEGORY_IMAGES.home,
    colSpan: "col-span-1 md:col-span-2 lg:col-span-5", // WIDER card
  },
];

/* ── Motion Variants ── */
const containerVar = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVar = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function CategoriesSection() {
  return (
    <section className="relative w-full py-24 sm:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-accent" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent !font-sans uppercase">
                Explore by Category
              </span>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-black text-[#020C1B] tracking-tight leading-tight" 
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Discover the <span className="text-accent relative">Best<span className="absolute bottom-1 left-0 w-full h-1 bg-accent/30 rounded-full" /></span> of Columbus
            </h2>
          </motion.div>
        </div>

        {/* Dynamic Grid Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 md:gap-6"
          variants={containerVar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.id} variants={cardVar} className={`group ${cat.colSpan}`}>
              <Link href={cat.link} className="block relative w-full h-[320px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#020C1B]/15 transition-all duration-500">
                {/* Image */}
                <Image
                  src={cat.img}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Gradient Overlays (Default & Hover state) */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#020C1B]/90 via-[#020C1B]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-60" />
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#020C1B]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                
                {/* Border effect on hover */}
                <div className="absolute inset-0 border-[1.5px] border-white/0 group-hover:border-white/20 rounded-[2rem] transition-colors duration-500 z-10 pointer-events-none" />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-20 flex flex-col justify-end">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 
                      className="text-3xl md:text-4xl font-black text-white mb-2 leading-none"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {cat.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-white/80 font-medium text-sm md:text-base opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-[50ms]">
                        {cat.subtitle}
                      </p>
                      
                      {/* Arrow Button */}
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-accent group-hover:border-accent group-hover:text-[#020C1B] text-white transition-all duration-500 shrink-0 shadow-lg group-hover:scale-110 group-hover:-translate-y-2">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-in-out">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
