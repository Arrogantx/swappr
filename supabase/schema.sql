-- Create tables
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

-- Enable RLS
alter table public.users enable row level security;

-- Create policies
create policy "Enable read access for all users"
on public.users for select
using (true);

create policy "Enable insert for authenticated users only"
on public.users for insert
with check (auth.uid() = id);

create policy "Enable update for users based on id"
on public.users for update
using (auth.uid() = id);

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
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();