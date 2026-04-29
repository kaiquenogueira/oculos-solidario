-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  city text,
  state text,
  neighborhood text,
  description text,
  photo_url text,
  rating numeric default 5.0,
  total_ratings integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create ads table
create type ad_type as enum ('donation', 'exchange');
create type ad_status as enum ('active', 'completed', 'blocked', 'review');
create type target_audience as enum ('adult', 'child', 'unisex');

create table public.ads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  type ad_type default 'donation',
  condition text default 'Bom',
  frame_style text,
  target_audience target_audience default 'adult',
  prescription_summary text,
  lens_details text,
  city text,
  state text,
  neighborhood text,
  status ad_status default 'review',
  photo_urls text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create prescription requests table
create type request_status as enum ('pending', 'adopted', 'completed', 'rejected');

create table public.prescription_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  patient_name text not null,
  description text not null,
  prescription_photo_url text not null,
  document_photo_url text not null,
  prescription_summary text,
  status request_status default 'pending',
  donor_id uuid references public.users(id) on delete set null,
  city text,
  state text,
  neighborhood text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create ratings table
create table public.ratings (
  id uuid default gen_random_uuid() primary key,
  from_user_id uuid references public.users(id) on delete set null,
  to_user_id uuid references public.users(id) on delete cascade not null,
  stars integer not null check (stars >= 1 and stars <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.ads enable row level security;
alter table public.prescription_requests enable row level security;
alter table public.ratings enable row level security;

-- Policies for users
create policy "Users can view all users." on public.users for select using (true);
create policy "Users can insert their own profile." on public.users for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.users for update using (auth.uid() = id);

-- Policies for ads
create policy "Ads are viewable by everyone." on public.ads for select using (status = 'active' or status = 'completed' or auth.uid() = user_id);
create policy "Users can insert own ads." on public.ads for insert with check (auth.uid() = user_id);
create policy "Users can update own ads." on public.ads for update using (auth.uid() = user_id);
create policy "Users can delete own ads." on public.ads for delete using (auth.uid() = user_id);

-- Policies for prescription_requests
create policy "Requests are viewable by everyone." on public.prescription_requests for select using (true);
create policy "Users can insert own requests." on public.prescription_requests for insert with check (auth.uid() = user_id);
create policy "Users can update own requests." on public.prescription_requests for update using (auth.uid() = user_id);
create policy "Donors can adopt requests." on public.prescription_requests for update using (status = 'pending') with check (auth.uid() = donor_id);

-- Policies for ratings
create policy "Ratings are viewable by everyone." on public.ratings for select using (true);
create policy "Users can insert ratings." on public.ratings for insert with check (auth.uid() = from_user_id);

-- Storage Buckets setup
insert into storage.buckets (id, name, public) values ('public-glasses', 'public-glasses', true);
insert into storage.buckets (id, name, public) values ('private-prescriptions', 'private-prescriptions', false);

-- Storage RLS
create policy "Public glasses are viewable by everyone." on storage.objects for select using (bucket_id = 'public-glasses');
create policy "Authenticated users can upload glasses." on storage.objects for insert with check (bucket_id = 'public-glasses' and auth.role() = 'authenticated');
create policy "Users can update their own glasses." on storage.objects for update using (bucket_id = 'public-glasses' and auth.uid() = owner);
create policy "Users can delete their own glasses." on storage.objects for delete using (bucket_id = 'public-glasses' and auth.uid() = owner);

create policy "Prescriptions are viewable by owner." on storage.objects for select using (bucket_id = 'private-prescriptions' and auth.uid() = owner);
create policy "Authenticated users can upload prescriptions." on storage.objects for insert with check (bucket_id = 'private-prescriptions' and auth.role() = 'authenticated');
create policy "Users can update their own prescriptions." on storage.objects for update using (bucket_id = 'private-prescriptions' and auth.uid() = owner);
create policy "Users can delete their own prescriptions." on storage.objects for delete using (bucket_id = 'private-prescriptions' and auth.uid() = owner);
