drop policy if exists "Prescriptions are viewable by owner." on storage.objects;

create policy "Prescriptions are viewable by owner and donor." on storage.objects for select using (
  bucket_id = 'private-prescriptions' and (
    auth.uid() = owner
    or exists (
      select 1 from public.prescription_requests pr
      where auth.uid() = pr.donor_id
      and (
        pr.prescription_photo_url like '%' || name
        or pr.document_photo_url like '%' || name
      )
    )
  )
);
