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

## Environment Variables (`.env.local` — never commit)
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## Project Directory
`C:\columbusapp`

## Database Tables (Supabase)
| Table | Purpose |
|-------|---------|
| `profiles` | User accounts with roles: visitor, business_user, admin |
| `service_categories` | Categories like Electrical, Plumbing, Handyman |
| `service_providers` | Approved business listings under service categories |
| `provider_requests` | Business owner submissions (pending/approved/rejected/needs_changes) |
| `events` | Approved city events with date/time/location |
| `event_requests` | Event submission requests from business users |
| `coupon_categories` | Categories for coupons: Food, Events, Services, Products |
| `coupons` | Approved coupon listings |
| `coupon_requests` | Coupon submission requests from business users |
| `announcements` | City news/announcements (supports pinned) |
| `subscribers` | Newsletter email subscribers |
| `banners` | Site-wide banner images managed by admin |
| `pages` | CMS content for About page etc. |

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
| 2 | Next.js project init, Supabase client, Auth, layout | Pending |
| 3 | Home page (hero, banners, city images) | Pending |
| 4 | About page | Pending |
| 5 | Events module | Pending |
| 6 | Services directory | Pending |
| 7 | Coupons module | Pending |
| 8 | Announcements + Subscribe | Pending |
| 9 | User Dashboard | Pending |
| 10 | Admin Dashboard | Pending |
| 11 | SEO + Deploy to Hostinger | Pending |

## Migration Files
- `supabase/migrations/001_initial_tables.sql` — all table DDL
- `supabase/migrations/002_rls_policies.sql` — RLS policies
- `supabase/seed.sql` — initial seed data

## Useful Links
- Supabase Dashboard: https://supabase.com/dashboard
- Next.js Docs: https://nextjs.org/docs
- Supabase JS Docs: https://supabase.com/docs/reference/javascript
