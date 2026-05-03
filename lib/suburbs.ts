/**
 * Columbus suburb data — used for /columbus/[suburb] landing pages
 * and to power suburb-specific SEO content.
 */

export interface Suburb {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  population: string;
  knownFor: string;
}

export const SUBURBS: Suburb[] = [
  {
    slug: "dublin",
    name: "Dublin",
    tagline: "Home of the Memorial Tournament & Irish heritage.",
    description:
      "Dublin, Ohio is one of the most vibrant suburbs of Columbus, known for its top-rated schools, the prestigious Memorial Tournament golf event at Muirfield Village, and a strong Irish-American cultural scene. With over 49,000 residents, Dublin offers a perfect mix of upscale dining, family-friendly parks, and growing tech businesses.",
    highlights: [
      "Memorial Tournament (PGA)",
      "Historic Dublin shopping district",
      "Bridge Park entertainment",
      "Top-rated public schools",
    ],
    population: "49,000+",
    knownFor: "Irish Festival, Memorial Tournament golf",
  },
  {
    slug: "westerville",
    name: "Westerville",
    tagline: "Historic charm meets modern community.",
    description:
      "Westerville, Ohio is a thriving suburb of Columbus with deep historic roots, home to Otterbein University and a beautifully preserved Uptown district. With over 41,000 residents, Westerville is known for excellent schools, scenic trails, and a strong sense of community.",
    highlights: [
      "Uptown Westerville historic district",
      "Otterbein University",
      "Hoover Reservoir Park",
      "Annual events at Heritage Park",
    ],
    population: "41,000+",
    knownFor: "Otterbein University, Uptown district",
  },
  {
    slug: "hilliard",
    name: "Hilliard",
    tagline: "Family-first suburb west of Columbus.",
    description:
      "Hilliard, Ohio is a popular family suburb located west of Columbus, with a strong community feel, top-rated schools, and a charming historic Old Hilliard district. With around 38,000 residents, it's a favorite for families looking for quality of life close to the city.",
    highlights: [
      "Old Hilliard historic district",
      "Heritage Trail",
      "Hilliard Station Park",
      "Annual Hilliard Rotary Express event",
    ],
    population: "38,000+",
    knownFor: "Old Hilliard Rail District, family events",
  },
  {
    slug: "grove-city",
    name: "Grove City",
    tagline: "Town Center charm & growing community.",
    description:
      "Grove City, Ohio is a suburb south of Columbus known for its walkable Town Center, family-friendly events, and excellent parks. With roughly 41,000 residents, Grove City offers a small-town feel with easy access to all of Columbus.",
    highlights: [
      "Grove City Town Center",
      "Fryer Park",
      "Beulah Park (former horse track)",
      "Grove City Wine & Arts Festival",
    ],
    population: "41,000+",
    knownFor: "Town Center, wine festival",
  },
  {
    slug: "gahanna",
    name: "Gahanna",
    tagline: "Herb Capital of Ohio.",
    description:
      "Gahanna, Ohio is a Columbus suburb located east of the city, officially designated the 'Herb Capital of Ohio.' With around 35,000 residents, Gahanna combines historic charm in Olde Gahanna Sanctuary with modern amenities and excellent schools.",
    highlights: [
      "Creekside District (riverwalk dining)",
      "Olde Gahanna Sanctuary",
      "Gahanna Herb Day",
      "Friendship Park",
    ],
    population: "35,000+",
    knownFor: "Creekside dining, Herb Day festival",
  },
  {
    slug: "powell",
    name: "Powell",
    tagline: "Charming village just north of Columbus.",
    description:
      "Powell, Ohio is an upscale suburb just north of Columbus, home to the Columbus Zoo and Aquarium. With around 14,000 residents, Powell offers a small-town village feel with high-end shopping, dining, and proximity to one of America's top-rated zoos.",
    highlights: [
      "Columbus Zoo and Aquarium",
      "Zoombezi Bay water park",
      "Historic downtown Powell",
      "Highbanks Metro Park",
    ],
    population: "14,000+",
    knownFor: "Columbus Zoo, Zoombezi Bay",
  },
  {
    slug: "worthington",
    name: "Worthington",
    tagline: "Colonial heritage in the heart of central Ohio.",
    description:
      "Worthington, Ohio is one of the oldest suburbs of Columbus, founded in 1803 and known for its preserved colonial architecture and tree-lined Old Worthington district. With around 14,500 residents, it offers historic charm, top-rated schools, and excellent dining.",
    highlights: [
      "Old Worthington shopping & dining",
      "Worthington Farmers Market",
      "McConnell Arts Center",
      "Annual Memorial Day Parade",
    ],
    population: "14,500+",
    knownFor: "Old Worthington, Farmers Market",
  },
];

export function getSuburb(slug: string): Suburb | undefined {
  return SUBURBS.find((s) => s.slug === slug);
}
