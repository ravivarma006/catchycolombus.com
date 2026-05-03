-- Hero settings: controls whether hero shows image slides or a background video
create table if not exists public.hero_settings (
  id            integer primary key default 1 check (id = 1), -- single-row table
  hero_mode     text not null default 'slides' check (hero_mode in ('slides', 'video')),
  video_url     text,
  video_thumb_url text,
  updated_at    timestamptz not null default now()
);

-- Seed the single settings row
insert into public.hero_settings (id, hero_mode)
values (1, 'slides')
on conflict (id) do nothing;

-- RLS
alter table public.hero_settings enable row level security;

-- Public can read (needed for SSR home page with anon key)
create policy "hero_settings_public_read"
  on public.hero_settings for select
  using (true);

-- Only service-role / admin can update
create policy "hero_settings_admin_update"
  on public.hero_settings for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
