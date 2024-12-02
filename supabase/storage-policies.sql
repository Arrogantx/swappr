-- Create storage buckets if they don't exist
insert into storage.buckets (id, name)
values ('verification-documents', 'verification-documents')
on conflict do nothing;

insert into storage.buckets (id, name)
values ('profile-images', 'profile-images')
on conflict do nothing;

-- Storage policies for verification documents
create policy "Anyone can view verification documents"
on storage.objects for select
using (
  bucket_id = 'verification-documents'
);

create policy "Users can upload their own verification documents"
on storage.objects for insert
with check (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own verification documents"
on storage.objects for update
using (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own verification documents"
on storage.objects for delete
using (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for profile images
create policy "Anyone can view profile images"
on storage.objects for select
using (
  bucket_id = 'profile-images'
);

create policy "Users can upload their own profile images"
on storage.objects for insert
with check (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own profile images"
on storage.objects for update
using (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own profile images"
on storage.objects for delete
using (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);