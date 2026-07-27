-- ===========================================================================
-- 0007_consent_message.sql — make the consent refusal actionable for editors
-- ---------------------------------------------------------------------------
-- The child-safety gate from 0003 works, but its message was written for a
-- developer reading a Postgres log:
--
--   Cannot publish gallery item 73575356-…: media lacks verified guardian consent
--
-- Once the app started surfacing P0001 messages to editors (rather than a
-- generic "something went wrong"), that string became the text a volunteer
-- actually reads. The row id means nothing to them and the sentence does not
-- say what to do next.
--
-- Only the message changes. The rule, its timing and its strictness are
-- untouched: publishing without verified guardian consent remains impossible.
-- ===========================================================================

create or replace function public.require_consent_to_publish()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'published'
     and not exists (
       select 1 from public.media m
       where m.id = new.media_id and m.consent_verified
     )
  then
    raise exception
      'This image needs verified guardian consent before it can be published. Open it in the Media library and confirm consent, then publish again.';
  end if;
  return new;
end;
$$;

comment on function public.require_consent_to_publish is
  'Child-safety gate: blocks publishing a gallery item whose media lacks verified guardian consent. The message is shown verbatim to CMS editors — keep it human-readable and actionable.';
