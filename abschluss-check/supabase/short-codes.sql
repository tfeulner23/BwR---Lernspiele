-- Vierstellige Alias-Codes für bestehende Plätze; alte Codes bleiben gültig.
alter table public.abschluss_seats add column if not exists short_code_hash text unique check (short_code_hash is null or length(short_code_hash)=64);
create table if not exists public.abschluss_login_buckets (
 bucket_key text not null check(length(bucket_key)=64),
 minute bigint not null,
 requests integer not null,
 primary key(bucket_key,minute)
);
alter table public.abschluss_login_buckets enable row level security;
revoke all on public.abschluss_login_buckets from public,anon,authenticated;
grant select,insert,update,delete on public.abschluss_login_buckets to service_role;
create or replace function public.abschluss_login_limit(bucket_key text) returns boolean
language plpgsql security invoker set search_path='' as $$
declare current_minute bigint := floor(extract(epoch from clock_timestamp())/60); n integer;
begin
 delete from public.abschluss_login_buckets b where b.minute < current_minute-2;
 insert into public.abschluss_login_buckets as b(bucket_key,minute,requests)
 values(abschluss_login_limit.bucket_key,current_minute,1)
 on conflict on constraint abschluss_login_buckets_pkey do update set requests=least(b.requests+1,91)
 returning requests into n;
 return n<=90;
end;
$$;
revoke all on function public.abschluss_login_limit(text) from public,anon,authenticated;
grant execute on function public.abschluss_login_limit(text) to service_role;
