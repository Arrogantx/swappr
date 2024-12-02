-- Enable extensions
create extension if not exists "uuid-ossp";

-- Drop existing tables in correct order to handle dependencies
drop table if exists public.verification_documents cascade;
drop table if exists public.skill_swap_requests cascade;
drop table if exists public.messages cascade;
drop table if exists public.reviews cascade;
drop table if exists public.skills cascade;
drop table if exists public.users cascade;

-- Create users table
create table public.users (
  id uuid references auth.users primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text unique not null,
  name text not null,
  bio text,
  profile_image text,
  rating numeric default 0 not null,
  review_count integer default 0 not null,
  is_verified boolean default false not null,
  is_admin boolean default false not null,
  identity_verified boolean default false not null
);

-- Create skills table
create table public.skills (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  category text not null,
  description text not null,
  experience_level text not null check (experience_level in ('beginner', 'intermediate', 'expert')),
  tags text[] not null,
  user_id uuid references public.users(id) on delete cascade not null,
  rating numeric default 0 not null,
  review_count integer default 0 not null,
  is_verified boolean default false not null
);

-- Create reviews table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.users(id) on delete cascade not null,
  skill_id uuid references public.skills(id) on delete cascade not null,
  reviewer_id uuid references public.users(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  status text default 'pending' not null check (status in ('pending', 'approved', 'flagged')),
  admin_notes text
);

-- Create messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_id uuid references public.users(id) on delete cascade not null,
  recipient_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  is_flagged boolean default false not null,
  admin_review_status text check (admin_review_status in ('pending', 'reviewed', null)),
  admin_notes text
);

-- Create skill swap requests table
create table public.skill_swap_requests (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  requester_id uuid references public.users(id) on delete cascade not null,
  provider_id uuid references public.users(id) on delete cascade not null,
  requested_skill_id uuid references public.skills(id) on delete cascade not null,
  offered_skill_id uuid references public.skills(id) on delete cascade not null,
  status text default 'pending' not null check (status in ('pending', 'accepted', 'rejected', 'disputed')),
  message text not null,
  dispute_reason text,
  dispute_status text check (dispute_status in ('pending', 'resolved', null)),
  dispute_resolution text,
  admin_notes text
);

-- Create verification documents table
create table public.verification_documents (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  type text not null check (type in ('identity', 'skill')),
  name text not null,
  url text not null,
  status text default 'pending' not null check (status in ('pending', 'approved', 'rejected')),
  user_id uuid references public.users(id) on delete cascade not null,
  skill_id uuid references public.skills(id) on delete set null,
  reviewed_at timestamp with time zone,
  admin_notes text
);

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.skills enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.skill_swap_requests enable row level security;
alter table public.verification_documents enable row level security;

-- Create trigger to automatically create user profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

-- Create trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();