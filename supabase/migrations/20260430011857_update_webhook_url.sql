create or replace function public.trigger_ad_moderation()
returns trigger
language plpgsql
security definer
as $$
declare
  webhook_url text;
begin
  -- Using the hardcoded production URL
  webhook_url := 'https://oculos-solidario.vercel.app/api/webhook/moderate';

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
