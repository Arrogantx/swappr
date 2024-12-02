-- Users table policies
create policy "Users can view their own profile"
on public.users for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.users for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Skills table policies
create policy "Anyone can view skills"
on public.skills for select
using (true);

create policy "Users can create their own skills"
on public.skills for insert
with check (auth.uid() = user_id);

create policy "Users can update their own skills"
on public.skills for update
using (auth.uid() = user_id);

create policy "Users can delete their own skills"
on public.skills for delete
using (auth.uid() = user_id);

-- Reviews table policies
create policy "Anyone can view reviews"
on public.reviews for select
using (true);

create policy "Users can create reviews"
on public.reviews for insert
with check (auth.uid() = reviewer_id);

create policy "Users can update their own reviews"
on public.reviews for update
using (auth.uid() = reviewer_id);

-- Messages table policies
create policy "Users can view their own messages"
on public.messages for select
using (
  auth.uid() = sender_id or
  auth.uid() = recipient_id
);

create policy "Users can send messages"
on public.messages for insert
with check (auth.uid() = sender_id);

-- Skill swap requests policies
create policy "Users can view their own swap requests"
on public.skill_swap_requests for select
using (
  auth.uid() = requester_id or
  auth.uid() = provider_id
);

create policy "Users can create swap requests"
on public.skill_swap_requests for insert
with check (auth.uid() = requester_id);

create policy "Users can update their own swap requests"
on public.skill_swap_requests for update
using (
  (auth.uid() = requester_id and status = 'pending') or
  (auth.uid() = provider_id and status = 'pending')
);

-- Verification documents policies
create policy "Users can view their own verification documents"
on public.verification_documents for select
using (auth.uid() = user_id);

create policy "Users can create verification documents"
on public.verification_documents for insert
with check (auth.uid() = user_id);