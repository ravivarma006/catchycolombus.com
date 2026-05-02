# Catch Columbus — Project Context for Claude

## Project Overview
**Catch Columbus** is a city information and business listing website for Columbus, Ohio.
It allows residents and visitors to discover events, services, and coupons in the city,
and lets business owners submit listing requests that go through an admin approval workflow.

## Technology Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database + Auth + Storage**: Supabase
- **Styling**: Tailwind CSS
- **Hosting**: Hostinger (Node.js deployment)
- **Email**: TBD (Resend or SendGrid — to be added in a later phase)
- **Animation**: Framer Motion (`framer-motion` installed)

## Brand
- **Name**: Catch Columbus
- **City**: Columbus, Ohio
- **Primary Color**: Deep Teal `#0F4C5C`
- **Accent Color**: Gold `#F5A800`
- **Background**: White `#FFFFFF`
- **Text**: Dark `#1A1A2E`
- **Tailwind custom colors** (in tailwind.config.ts):
  - `primary`: `#0F4C5C`
  - `accent`: `#F5A800`
- **Fonts**: Outfit (headings), Inter (body) — loaded via Google Fonts in layout

## Environment Variables (`.env.local` — never commit)
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_GA_ID=G-EXG39D7M0F
NEXT_PUBLIC_SITE_URL=https://catchcolumbus.com
```

## Project Directory
`C:\columbusapp`

## Database Tables (Supabase)
| Table | Purpose |
|-------|---------|
| `profiles` | User accounts with roles: visitor, business_user, admin. Includes `referral_code` column |
| `service_categories` | Categories like Electrical, Plumbing, Handyman |
| `service_providers` | Approved business listings under service categories |
| `provider_requests` | Business owner submissions (pending/approved/rejected/needs_changes) |
| `events` | Approved city events — columns: `id, title, slug, event_date, event_time, location, description, price, category, is_featured, is_active, image_url, website` |
| `event_requests` | Event submission requests — columns include `event_name` (not `title`) |
| `coupon_categories` | Categories for coupons: Food, Events, Services, Products |
| `coupons` | Approved coupon listings with `is_premium`, `max_redemptions`, `current_redemptions`, `expires_at` |
| `coupon_requests` | Coupon submission requests from business users |
| `announcements` | City news/announcements (supports `is_pinned`) |
| `subscribers` | Newsletter email subscribers |
| `banners` | Site-wide banner images managed by admin |
| `pages` | CMS content for About page etc. |
| `activity_categories` | Categories for Things to Do (Museums, Parks, etc.) |
| `activities` | Things to Do listings with `is_featured`, `is_active`, `neighborhood`, `price_range`, `category_id` |
| `hero_slides` | Hero carousel slides with `image_url, thumb_url, location, tag, headline, subtitle, overlay_from, overlay_to` |
| `hero_stats` | Stats shown in hero section (e.g. "500+ Events") |
| `subscription_plans` | Pricing plans for the /pricing page |
| `referrals` | Referral tracking — `referrer_id`, `referred_user_id`, `status` |

> **Field name gotcha**: `events.title` vs `event_requests.event_name` — they are different tables with different column names.

## Storage Buckets (Supabase)
| Bucket | Purpose |
|--------|---------|
| `city-images` | Columbus city photos (hero, about, backgrounds) |
| `provider-images` | Business provider logos/photos |
| `event-images` | Event flyers/images |
| `coupon-images` | Coupon images |
| `banner-images` | Site-wide banner images |

All buckets are **public**. Max file size: 5MB. Allowed: jpeg, png, webp.

## User Roles
- **visitor**: Read-only public access (no login required)
- **business_user**: Can submit requests (provider, event, coupon); view own request status
- **admin**: Full access — approve/reject requests, manage all content, banners

## Key Rules
- **Never bypass RLS** — always use anon key on client side; service role key is server-only
- **Image format**: prefer webp; accept jpg/png
- **Slugs**: always lowercase, hyphenated (e.g., `short-north-plumbing`)
- **Status flow**: `pending` → `approved` | `rejected` | `needs_changes` → `pending` (after resubmit)
- **Phase-by-phase**: Do NOT add features from later phases until current phase is reviewed & approved

## Development Phases
| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Supabase setup, DB tables, storage buckets, MCP, CLAUDE.md | Completed |
| 2 | Next.js project init, Supabase client, Auth, layout | Completed |
| 3 | Home page (hero, banners, city images, featured deals) | Completed |
| 4 | About page | Completed |
| 5 | Events module (list, detail, submit) | Completed |
| 6 | Services directory (list, category, detail, submit) | Completed |
| 7 | Coupons module (list, detail, submit, countdown, scarcity) | Completed |
| 8 | Announcements + Subscribe | Completed |
| 9 | User Dashboard + Submissions | Completed |
| 10 | Admin Dashboard (events, services, coupons, announcements, hero, things-to-do, subscribers, campaigns) | Completed |
| 11 | SEO + Deploy to Hostinger | In Progress (sitemap, robots, manifest done — deploy pending) |

## Extra Features Built (beyond original phases)
- **Things to Do** module — `activity_categories` + `activities` tables, full CRUD in admin
- **Search** — cross-module search across events, services, coupons, activities
- **Pricing page** — `/pricing` reads from `subscription_plans` table
- **Refer page** — `/refer` with referral code + progress tracker + copy link (client component)
- **Admin Hero Manager** — manage `hero_slides` and `hero_stats` via admin UI
- **Admin Campaigns** — Beehiiv email campaign stub (API integration pending)
- **Google Analytics** — `NEXT_PUBLIC_GA_ID` env var wires to `GoogleAnalytics` component in layout

## Migration Files
- `supabase/migrations/001_initial_tables.sql` — core tables
- `supabase/migrations/002_rls_policies.sql` — RLS policies
- `supabase/migrations/003_add_category_image.sql`
- `supabase/migrations/004_things_to_do.sql` — activity_categories + activities
- `supabase/migrations/005_things_to_do_rls.sql`
- `supabase/migrations/006_things_to_do_seed.sql`
- `supabase/migrations/007_admin_user_seed.sql`
- `supabase/migrations/008_hero_slides.sql`
- `supabase/migrations/009_hero_slides_seed.sql`
- `supabase/migrations/010_coupon_expiration.sql`
- `supabase/migrations/011_subscriptions.sql`
- `supabase/migrations/012_monetization_scale.sql`
- `supabase/migrations/013_audit_and_slugs.sql`
- `supabase/migrations/014_fix_handle_new_user_search_path.sql`
- `supabase/migrations/015_allow_business_user_storage_uploads.sql`
- `supabase/migrations/016_restrict_events_coupons_to_admin_only.sql`
- `supabase/migrations/017_provider_requests_neighborhood_hours_columns.sql`
- `supabase/migrations/018_service_providers_add_user_id_and_updated_at.sql`
- `supabase/seed.sql` — initial seed data

## Useful Links
- Supabase Dashboard: https://supabase.com/dashboard
- Next.js Docs: https://nextjs.org/docs
- Supabase JS Docs: https://supabase.com/docs/reference/javascript
