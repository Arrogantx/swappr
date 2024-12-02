-- Create storage buckets
create table if not exists storage.buckets (
  id text primary key,
  name text not null,
  owner uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  public boolean default false,
  avif_autodetection boolean default false,
  file_size_limit bigint,
  allowed_mime_types text[]
);

-- Create objects table if it doesn't exist
create table if not exists storage.objects (
  id uuid default uuid_generate_v4() primary key,
  bucket_id text references storage.buckets(id),
  name text,
  owner uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_accessed_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb,
  path_tokens text[] generated always as (string_to_array(name, '/')) stored
);

-- Create buckets
insert into storage.buckets (id, name, public)
values 
  ('verification-documents', 'verification-documents', false),
  ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

-- Enable RLS
alter table storage.objects enable row level security;

-- Drop existing policies
drop policy if exists "Users can view their own verification documents" on storage.objects;
drop policy if exists "Users can upload their own verification documents" on storage.objects;
drop policy if exists "Users can update their own verification documents" on storage.objects;
drop policy if exists "Users can delete their own verification documents" on storage.objects;
drop policy if exists "Anyone can view profile images" on storage.objects;
drop policy if exists "Users can upload their own profile images" on storage.objects;
drop policy if exists "Users can update their own profile images" on storage.objects;
drop policy if exists "Users can delete their own profile images" on storage.objects;
drop policy if exists "Admins can view all documents" on storage.objects;
drop policy if exists "Admins can manage all documents" on storage.objects;

-- Create policies for verification documents
create policy "Users can view their own verification documents"
on storage.objects for select
using (
  bucket_id = 'verification-documents' 
  and auth.uid() = owner
);

create policy "Users can upload their own verification documents"
on storage.objects for insert
with check (
  bucket_id = 'verification-documents' 
  and auth.uid() = owner
);

create policy "Users can update their own verification documents"
on storage.objects for update
using (
  bucket_id = 'verification-documents' 
  and auth.uid() = owner
);

create policy "Users can delete their own verification documents"
on storage.objects for delete
using (
  bucket_id = 'verification-documents' 
  and auth.uid() = owner
);

-- Profile images policies
create policy "Anyone can view profile images"
on storage.objects for select
using (bucket_id = 'profile-images');

create policy "Users can upload their own profile images"
on storage.objects for insert
with check (
  bucket_id = 'profile-images' 
  and auth.uid() = owner
);

create policy "Users can update their own profile images"
on storage.objects for update
using (
  bucket_id = 'profile-images' 
  and auth.uid() = owner
);

create policy "Users can delete their own profile images"
on storage.objects for delete
using (
  bucket_id = 'profile-images' 
  and auth.uid() = owner
);

-- Admin policies for storage
create policy "Admins can view all documents"
on storage.objects for select
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
);

create policy "Admins can manage all documents"
on storage.objects for all
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
);