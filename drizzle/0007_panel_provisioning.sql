ALTER TABLE user_services ADD COLUMN order_id text DEFAULT '';

CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  catalog_id text NOT NULL,
  product_type text NOT NULL,
  status text NOT NULL,
  panel_url text NOT NULL DEFAULT '',
  metadata text NOT NULL DEFAULT '{}',
  created_at text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activated_at text
);

CREATE TABLE IF NOT EXISTS panel_accounts (
  id text PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  panel text NOT NULL,
  external_id text NOT NULL,
  created_at text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS panel_accounts_user_panel_idx ON panel_accounts(user_id, panel);

CREATE TABLE IF NOT EXISTS panel_resources (
  id text PRIMARY KEY,
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  panel text NOT NULL,
  external_id text NOT NULL,
  created_at text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS provisioning_jobs (
  id text PRIMARY KEY,
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  last_error text NOT NULL DEFAULT '',
  next_run_at text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS provisioning_jobs_status_idx ON provisioning_jobs(status, next_run_at);
