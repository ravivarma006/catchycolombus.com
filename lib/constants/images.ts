/**
 * Centralized Supabase Storage image URLs.
 *
 * All static category / fallback images live in Supabase Storage buckets.
 * Components import from here instead of using hardcoded local paths.
 */

const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;

/* ── Homepage category cards ── */
export const HOME_CATEGORY_IMAGES: Record<string, string> = {
  dining:     `${STORAGE_BASE}/categories/home-categories/dining.png`,
  health:     `${STORAGE_BASE}/categories/home-categories/health.png`,
  realestate: `${STORAGE_BASE}/categories/home-categories/realestate.png`,
  home:       `${STORAGE_BASE}/categories/services/home.png`,
};

/* ── Service category fallback images (when service_categories.image_url is NULL) ── */
export const SERVICE_FALLBACK_IMAGES: Record<string, string> = {
  dining:            `${STORAGE_BASE}/categories/services/dining.png`,
  health:            `${STORAGE_BASE}/categories/services/health.png`,
  realestate:        `${STORAGE_BASE}/categories/services/realestate.png`,
  automotive:        `${STORAGE_BASE}/categories/services/automotive.png`,
  beauty:            `${STORAGE_BASE}/categories/services/beauty.png`,
  education:         `${STORAGE_BASE}/categories/services/education.png`,
  legal:             `${STORAGE_BASE}/categories/services/legal.png`,
  home:              `${STORAGE_BASE}/categories/services/home.png`,
  handyman:          `${STORAGE_BASE}/categories/services/handyman.png`,
  electrical:        `${STORAGE_BASE}/categories/services/electrical.png`,
  plumbing:          `${STORAGE_BASE}/categories/services/plumbing.png`,
  cleaning:          `${STORAGE_BASE}/categories/services/cleaning.png`,
  restaurant:        `${STORAGE_BASE}/categories/services/restaurant.png`,
  landscaping:       `${STORAGE_BASE}/categories/services/landscaping.png`,
  hvac:              `${STORAGE_BASE}/categories/services/hvac.png`,
  moving:            `${STORAGE_BASE}/categories/services/moving.png`,
  "mobile-mechanic": `${STORAGE_BASE}/categories/services/mobile-mechanic.png`,
  "mobile-tech":     `${STORAGE_BASE}/categories/services/mobile-tech.png`,
};

/* ── Event fallback images (cycled when events.image_url is NULL) ── */
export const EVENT_FALLBACK_IMAGES: string[] = [
  `${STORAGE_BASE}/event-images/fallbacks/soccer.png`,
  `${STORAGE_BASE}/event-images/fallbacks/comfest.png`,
  `${STORAGE_BASE}/event-images/fallbacks/fair.png`,
  `${STORAGE_BASE}/event-images/fallbacks/concert.png`,
  `${STORAGE_BASE}/event-images/fallbacks/food.png`,
];

/* ── Defaults when nothing else matches ── */
export const DEFAULT_SERVICE_IMAGE = `${STORAGE_BASE}/categories/services/dining.png`;
export const DEFAULT_EVENT_IMAGE   = `${STORAGE_BASE}/event-images/fallbacks/soccer.png`;
