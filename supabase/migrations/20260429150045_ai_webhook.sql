-- Enable the pg_net extension
create extension if not exists pg_net with schema extensions;

-- Function to trigger the moderation webhook
create or replace function public.trigger_ad_moderation()
returns trigger
language plpgsql
security definer
as $$
declare
  webhook_url text;
begin
  -- Replace with your actual deployed Vercel URL in production
  -- For local development, this needs to be an ngrok/localtunnel URL since Supabase is remote
  webhook_url := current_setting('app.settings.webhook_url', true);
  
  if webhook_url is null or webhook_url = '' then
    webhook_url := 'https://oculos-solidario.vercel.app/api/webhook/moderate';
  end if;

  perform net.http_post(
    url := webhook_url,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'type', 'INSERT',
      'table', 'ads',
      'schema', 'public',
      'record', row_to_json(NEW)
    )::jsonb
  );

  return NEW;
end;
$$;

-- Trigger to call the function after a new ad is inserted
create trigger ad_moderation_trigger
  after insert on public.ads
  for each row
  execute function public.trigger_ad_moderation();
