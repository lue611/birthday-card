-- 在 Supabase Dashboard → SQL Editor 中完整执行一次。
create table if not exists public.cards (
  id uuid primary key,
  template_id text not null check (template_id in ('birthday-letter','mom-letter','teacher-thanks')),
  recipient text not null check (char_length(recipient) between 1 and 30),
  sender text not null check (char_length(sender) between 1 and 30),
  content jsonb not null default '{}'::jsonb,
  photo_path text,
  open_at timestamptz,
  expires_at timestamptz not null default (now() + interval '90 days'),
  created_at timestamptz not null default now()
);
alter table public.cards enable row level security;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('card-media','card-media',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "No direct media uploads" on storage.objects;
create policy "No direct media uploads" on storage.objects for insert to anon,authenticated with check (false);
