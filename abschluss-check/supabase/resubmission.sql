-- Aktuellen Entwurf und letzte Abgabe getrennt halten.
alter table public.abschluss_attempts add column if not exists submitted_answers jsonb check (submitted_answers is null or (jsonb_typeof(submitted_answers)='object' and octet_length(submitted_answers::text)<=40000));
alter table public.abschluss_attempts add column if not exists submission_revision integer;
update public.abschluss_attempts set submitted_answers=answers,submission_revision=revision where submitted_at is not null and submitted_answers is null;
