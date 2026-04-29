-- Create messages table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.users(id) on delete cascade not null,
  receiver_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- Policies
create policy "Users can view their own messages." on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can insert their own messages." on public.messages for insert with check (auth.uid() = sender_id);
create policy "Users can update received messages to read." on public.messages for update using (auth.uid() = receiver_id);

-- Enable Realtime
alter publication supabase_realtime add table messages;
