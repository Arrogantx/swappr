-- Create admin role if it doesn't exist
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'admin') then
    create role admin;
  end if;
end
$$;

-- Grant admin access to all tables
grant all privileges on all tables in schema public to admin;
grant all privileges on all sequences in schema public to admin;

-- Admin policies for users table
create policy "Admins can view all users"
on public.users for select
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
);

create policy "Admins can update user verification status"
on public.users for update
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
)
with check (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
);

-- Admin policies for reviews
create policy "Admins can moderate reviews"
on public.reviews for update
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
);

-- Admin policies for messages
create policy "Admins can view and moderate flagged messages"
on public.messages for select
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
);

create policy "Admins can update message moderation status"
on public.messages for update
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
);

-- Admin policies for skill swap requests
create policy "Admins can view and moderate disputes"
on public.skill_swap_requests for select
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
);

create policy "Admins can update dispute resolution"
on public.skill_swap_requests for update
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
);

-- Admin policies for verification documents
create policy "Admins can view all verification documents"
on public.verification_documents for select
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
);

create policy "Admins can update verification status"
on public.verification_documents for update
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  )
);

-- Function to promote user to admin
create or replace function promote_to_admin(user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Verify the current user is an admin
  if not exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  ) then
    raise exception 'Only admins can promote users to admin role';
  end if;

  -- Update the user's admin status
  update public.users
  set is_admin = true
  where id = user_id;
end;
$$;