/**
 * Homepage FAQ data — kept in a plain (non-client) module so it can be safely
 * imported by server components (e.g. app/page.tsx for JSON-LD schema) AND
 * by the client FAQSection component without crossing the client boundary.
 */
export const HOMEPAGE_FAQS = [
  {
    question: "What is Catch Columbus?",
    answer:
      "Catch Columbus is the local online guide for Columbus, Ohio. We help residents, suburb visitors, and tourists discover events, local services, exclusive coupons, things to do, and city announcements — all in one free, easy-to-use website.",
  },
  {
    question: "Is Catch Columbus free to use?",
    answer:
      "Yes — Catch Columbus is 100% free for residents and visitors. You can browse all events, services, coupons, and things to do without paying or even creating an account. Subscribing to our newsletter is also free and only requires an email address.",
  },
  {
    question: "What Columbus suburbs does Catch Columbus cover?",
    answer:
      "We cover all of greater Columbus and its surrounding suburbs including Dublin, Westerville, Hilliard, Grove City, Gahanna, Powell, Worthington, Upper Arlington, Bexley, New Albany, Reynoldsburg, and Pickerington. If a business or event is within the Columbus metro area, you'll find it here.",
  },
  {
    question: "How do I find free events in Columbus this weekend?",
    answer:
      "Visit our Events page to browse all upcoming Columbus events filtered by date and category. Free events are clearly marked with a 'FREE' badge. You can also subscribe to our newsletter to get a curated list of free weekend events delivered to your inbox every Friday.",
  },
  {
    question: "How do I list my Columbus business on Catch Columbus?",
    answer:
      "Business owners can submit a free listing in under 3 minutes. Just create an account, click 'List Your Business' on our Services page, and fill out the simple form. Submissions are reviewed and approved within 24 hours, usually faster. There are no setup fees and no credit card required.",
  },
  {
    question: "How do I get free Columbus coupons?",
    answer:
      "Browse the Coupons page anytime to view all current Columbus deals — no signup required. To get the best deals delivered weekly, subscribe to our free newsletter. Coupons include food discounts, service deals, event admission savings, and exclusive offers from local Columbus businesses.",
  },
  {
    question: "Are the events and coupons on Catch Columbus verified?",
    answer:
      "Yes. Every event, business listing, and coupon submitted to Catch Columbus is reviewed and approved by our admin team before going live. We verify legitimacy, accuracy, and quality so you can trust what you find on our site.",
  },
];
