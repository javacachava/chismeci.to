-- chambresito.com database schema
-- NOTE: This schema is intentionally minimal and deterministic.

create extension if not exists "pgcrypto";

-- Enums for strict domain constraints.
create type market_status as enum ('open', 'resolved', 'canceled');
create type prediction_choice as enum ('yes', 'no');
create type ledger_entry_type as enum ('consume');
create type reputation_reason as enum ('market_resolution');
create type subject_type as enum ('public_figure', 'organization', 'protocol', 'event');

-- Helper function to read admin role from JWT claims.
create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'role', '') = 'admin';
$$;

comment on function is_admin() is 'Checks JWT role claim for admin.';

-- Markets are ingested from X API only (no user-created markets).
create table if not exists markets (
  id uuid primary key default gen_random_uuid(),
  source_topic_id text not null,
  topic_text text not null,
  topic_slug text not null,
  question_text text not null,
  description text,
  subject_type subject_type not null,
  verification_required boolean not null default true,
  verification_source_url text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status market_status not null default 'open',
  resolution_rule_id uuid,
  resolved_outcome boolean,
  resolved_at timestamptz,
  resolution_evidence jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint markets_time_window_chk check (ends_at > starts_at),
  constraint markets_verification_chk check (
    verification_required = false or verification_source_url is not null
  )
);

comment on table markets is 'Auto-ingested prediction topics from X API.';
comment on column markets.source_topic_id is 'Stable ID from X source; used for idempotent ingest.';
comment on column markets.resolution_evidence is 'Deterministic evidence used for resolution.';
comment on column markets.subject_type is 'Categorization for safety rules; public_figure enforced for chisme markets.';
comment on column markets.verification_required is 'True when external verification is required.';
comment on column markets.verification_source_url is 'Public URL used to verify the market outcome.';

create unique index if not exists markets_source_topic_id_uidx on markets (source_topic_id);
create index if not exists markets_status_idx on markets (status);
create index if not exists markets_topic_slug_idx on markets (topic_slug);
create index if not exists markets_subject_type_idx on markets (subject_type);

-- Deterministic rules that define how a market resolves.
create table if not exists resolution_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source text not null,
  rule_json jsonb not null,
  deterministic boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table resolution_rules is 'Deterministic resolution rules per market.';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'markets_resolution_rule_fk'
  ) then
    alter table markets
      add constraint markets_resolution_rule_fk
      foreign key (resolution_rule_id)
      references resolution_rules(id)
      on delete set null;
  end if;
end;
$$;

-- User predictions are immutable and tied to a market.
create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  market_id uuid not null references markets(id) on delete restrict,
  choice prediction_choice not null,
  action_type text not null,
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  constraint predictions_choice_chk check (choice in ('yes', 'no'))
);

comment on table predictions is 'User predictions; immutable and append-only.';
comment on column predictions.idempotency_key is 'Stable key for idempotent prediction placement.';

create unique index if not exists predictions_idempotency_uidx on predictions (idempotency_key);
create index if not exists predictions_market_idx on predictions (market_id);
create index if not exists predictions_user_idx on predictions (user_id);

-- Immutable mirror ledger for token consumption (source of truth is vudy.com).
create table if not exists token_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  market_id uuid not null references markets(id) on delete restrict,
  prediction_id uuid not null references predictions(id) on delete restrict,
  vudy_tx_id text not null,
  entry_type ledger_entry_type not null default 'consume',
  amount integer not null,
  created_at timestamptz not null default now(),
  constraint token_ledger_amount_chk check (amount > 0)
);

comment on table token_ledger is 'Immutable append-only mirror of vudy consumption.';
comment on column token_ledger.vudy_tx_id is 'Unique transaction ID from vudy.com.';

create unique index if not exists token_ledger_vudy_tx_uidx on token_ledger (vudy_tx_id);
create index if not exists token_ledger_user_idx on token_ledger (user_id);
create index if not exists token_ledger_market_idx on token_ledger (market_id);

-- Time-series snapshots for market insight.
create table if not exists market_snapshots (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references markets(id) on delete restrict,
  snapshot_at timestamptz not null default now(),
  total_predictions integer not null,
  yes_count integer not null,
  no_count integer not null,
  constraint market_snapshots_counts_chk check (total_predictions >= 0 and yes_count >= 0 and no_count >= 0)
);

comment on table market_snapshots is 'Derived counts for market trend visualization.';

create index if not exists market_snapshots_market_idx on market_snapshots (market_id);
create index if not exists market_snapshots_time_idx on market_snapshots (snapshot_at);

-- User roles table (admin vs user); only for internal reference.
create table if not exists user_roles (
  user_id uuid primary key,
  role text not null,
  created_at timestamptz not null default now(),
  constraint user_roles_role_chk check (role in ('admin', 'user'))
);

comment on table user_roles is 'Internal mirror of user role; JWT claim is source of truth.';

-- Reputation points are separate from tokens.
create table if not exists reputation_points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  market_id uuid not null references markets(id) on delete restrict,
  points integer not null,
  reason reputation_reason not null,
  created_at timestamptz not null default now(),
  constraint reputation_points_amount_chk check (points <> 0)
);

comment on table reputation_points is 'Non-monetary reputation system, separate from tokens.';

create unique index if not exists reputation_points_unique_uidx
  on reputation_points (user_id, market_id, reason);

-- Prevent updates/deletes for immutable tables.
create or replace function block_update_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Updates and deletes are not allowed on immutable tables.';
end;
$$;

create trigger token_ledger_immutable_trg
before update or delete on token_ledger
for each row execute procedure block_update_delete();

create trigger predictions_immutable_trg
before update or delete on predictions
for each row execute procedure block_update_delete();

-- RPC to award reputation points on resolution.
create or replace function award_reputation_points(
  p_market_id uuid,
  p_outcome boolean
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into reputation_points (user_id, market_id, points, reason)
  select
    p.user_id,
    p.market_id,
    10,
    'market_resolution'
  from predictions p
  where p.market_id = p_market_id
    and (
      (p_outcome = true and p.choice = 'yes')
      or (p_outcome = false and p.choice = 'no')
    )
  on conflict (user_id, market_id, reason) do nothing;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

comment on function award_reputation_points is 'Awards reputation points to correct predictions.';

-- RPC for atomic prediction placement.
create or replace function place_prediction_tx(
  p_user_id uuid,
  p_market_id uuid,
  p_choice prediction_choice,
  p_amount integer,
  p_idempotency_key text,
  p_vudy_tx_id text,
  p_action_type text
)
returns table (
  prediction_id uuid,
  ledger_id uuid,
  snapshot_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prediction_id uuid;
  v_ledger_id uuid;
  v_snapshot_id uuid;
  v_yes_count integer;
  v_no_count integer;
  v_total integer;
  v_market_status market_status;
begin
  select status into v_market_status from markets where id = p_market_id for update;
  if v_market_status is null then
    raise exception 'market_not_found';
  end if;
  if v_market_status <> 'open' then
    raise exception 'market_closed';
  end if;

  insert into predictions (user_id, market_id, choice, idempotency_key, action_type)
  values (p_user_id, p_market_id, p_choice, p_idempotency_key, p_action_type)
  on conflict (idempotency_key) do nothing
  returning id into v_prediction_id;

  if v_prediction_id is null then
    select id into v_prediction_id from predictions where idempotency_key = p_idempotency_key;
  end if;

  insert into token_ledger (user_id, market_id, prediction_id, vudy_tx_id, entry_type, amount)
  values (p_user_id, p_market_id, v_prediction_id, p_vudy_tx_id, 'consume', p_amount)
  on conflict (vudy_tx_id) do nothing
  returning id into v_ledger_id;

  if v_ledger_id is null then
    select id into v_ledger_id from token_ledger where vudy_tx_id = p_vudy_tx_id;
  end if;

  select
    count(*) filter (where choice = 'yes') as yes_count,
    count(*) filter (where choice = 'no') as no_count,
    count(*) as total_predictions
  into v_yes_count, v_no_count, v_total
  from predictions
  where market_id = p_market_id;

  insert into market_snapshots (market_id, total_predictions, yes_count, no_count)
  values (p_market_id, v_total, v_yes_count, v_no_count)
  returning id into v_snapshot_id;

  return query select v_prediction_id, v_ledger_id, v_snapshot_id;
end;
$$;

comment on function place_prediction_tx is 'Atomic prediction placement, ledger mirror, and snapshot.';

-- RLS
alter table markets enable row level security;
alter table predictions enable row level security;
alter table token_ledger enable row level security;
alter table resolution_rules enable row level security;
alter table market_snapshots enable row level security;
alter table user_roles enable row level security;
alter table reputation_points enable row level security;

-- Markets: read for authenticated users, ingest/update for admins.
create policy markets_read on markets
  for select
  to anon, authenticated
  using (true);

create policy markets_admin_insert on markets
  for insert
  to authenticated
  with check (is_admin());

create policy markets_admin_update on markets
  for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- Resolution rules: admins manage.
create policy rules_read on resolution_rules
  for select
  to authenticated
  using (true);

create policy rules_admin_insert on resolution_rules
  for insert
  to authenticated
  with check (is_admin());

create policy rules_admin_update on resolution_rules
  for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- Market snapshots: read for authenticated users.
create policy snapshots_read on market_snapshots
  for select
  to anon, authenticated
  using (true);

-- Predictions: users can insert only when market is open, read own.
create policy predictions_read_own on predictions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy predictions_insert_open on predictions
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from markets
      where markets.id = predictions.market_id
        and markets.status = 'open'
    )
  );

-- Token ledger: users can read their own entries only.
create policy token_ledger_read_own on token_ledger
  for select
  to authenticated
  using (auth.uid() = user_id);

-- User roles: users read own; admins manage.
create policy user_roles_read_own on user_roles
  for select
  to authenticated
  using (auth.uid() = user_id or is_admin());

create policy user_roles_admin_insert on user_roles
  for insert
  to authenticated
  with check (is_admin());

create policy user_roles_admin_update on user_roles
  for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- Reputation points: users read own only.
create policy reputation_read_own on reputation_points
  for select
  to authenticated
  using (auth.uid() = user_id);
