"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HOMEPAGE_FAQS } from "@/lib/faq-data";

// Re-export for any existing imports
export { HOMEPAGE_FAQS };

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-20 md:py-24 px-6 md:px-16 lg:px-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
              Common Questions
            </span>
            <span className="h-[2px] w-8 bg-accent" />
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Everything You Need to{" "}
            <span style={{ color: "var(--accent)" }}>Know</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Quick answers about Catch Columbus, Columbus events, and how to get
            free deals.
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-3">
          {HOMEPAGE_FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? "border-accent/40 shadow-lg shadow-amber-500/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <h3
                    className={`text-base md:text-lg font-bold pr-4 ${
                      isOpen ? "text-primary" : "text-gray-900"
                    }`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {faq.question}
                  </h3>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isOpen
                        ? "bg-accent text-[#020C1B] rotate-180"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 -mt-2">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Closing CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <a
            href="mailto:hello@catchcolumbus.com"
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
          >
            Email us at hello@catchcolumbus.com
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
