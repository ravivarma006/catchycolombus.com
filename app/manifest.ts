import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Catch Columbus — Your City Guide",
    short_name: "Catch Columbus",
    description:
      "Discover events, services, coupons, and things to do in Columbus, Ohio and surrounding suburbs including Dublin, Westerville, Hilliard, Grove City, Gahanna, Powell, and Worthington.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0D0D0D",
    theme_color: "#0F4C5C",
    scope: "/",
    lang: "en-US",
    categories: ["lifestyle", "travel", "news", "shopping"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Browse Events",
        short_name: "Events",
        description: "Upcoming Columbus events",
        url: "/events",
      },
      {
        name: "Free Coupons",
        short_name: "Coupons",
        description: "Free Columbus deals and discounts",
        url: "/coupons",
      },
      {
        name: "Local Services",
        short_name: "Services",
        description: "Find Columbus businesses",
        url: "/services",
      },
      {
        name: "Things to Do",
        short_name: "Activities",
        description: "Columbus attractions and activities",
        url: "/things-to-do",
      },
    ],
  };
}
