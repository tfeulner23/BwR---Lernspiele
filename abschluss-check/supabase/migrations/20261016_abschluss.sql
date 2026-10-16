-- Private Schülerbearbeitungen. Zugriff ausschließlich über die authentifizierende Edge Function.
create table public.abschluss_teachers (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
create table public.abschluss_setup (
 singleton boolean primary key default true check(singleton),
 code_hash text not null check(length(code_hash)=64),
 expires_at timestamptz not null,
 claimed_by uuid references auth.users(id),
 claimed_at timestamptz
);
create table public.abschluss_classes (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id),
 title text not null check(length(title) between 1 and 60),
 version text not null default 'abschluss-v1',
 created_at timestamptz not null default now()
);
create index abschluss_classes_owner_idx on public.abschluss_classes(owner_id);
create table public.abschluss_seats (
 id uuid primary key default gen_random_uuid(),
 class_id uuid not null references public.abschluss_classes(id) on delete cascade,
 label text not null check(length(label) between 1 and 30),
 code_hash text not null unique check(length(code_hash)=64),
 created_at timestamptz not null default now(),
 unique(class_id,label)
);
create index abschluss_seats_class_idx on public.abschluss_seats(class_id);
create table public.abschluss_attempts (
 seat_id uuid primary key references public.abschluss_seats(id) on delete cascade,
 answers jsonb not null default '{}'::jsonb check(jsonb_typeof(answers)='object' and octet_length(answers::text)<=40000),
 revision integer not null default 0 check(revision>=0),
 started_at timestamptz,
 updated_at timestamptz not null default now(),
 submitted_at timestamptz,
 feedback jsonb,
 check((submitted_at is null and feedback is null) or (submitted_at is not null and feedback is not null))
);
alter table public.abschluss_teachers enable row level security;
alter table public.abschluss_setup enable row level security;
alter table public.abschluss_classes enable row level security;
alter table public.abschluss_seats enable row level security;
alter table public.abschluss_attempts enable row level security;
revoke all on public.abschluss_teachers,public.abschluss_setup,public.abschluss_classes,public.abschluss_seats,public.abschluss_attempts from public,anon,authenticated;
grant all on public.abschluss_teachers,public.abschluss_setup,public.abschluss_classes,public.abschluss_seats,public.abschluss_attempts to service_role;
