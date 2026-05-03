-- Site-wide brand settings — single-row table
create table if not exists public.site_settings (
  id            integer primary key default 1 check (id = 1),
  primary_color text not null default '#0F4C5C',
  accent_color  text not null default '#F5A800',
  updated_at    timestamptz not null default now()
);

insert into public.site_settings (id, primary_color, accent_color)
values (1, '#0F4C5C', '#F5A800')
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

create policy "site_settings_public_read"
  on public.site_settings for select
  using (true);

create policy "site_settings_admin_update"
  on public.site_settings for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
