ALTER TABLE users ADD COLUMN email_verified integer NOT NULL DEFAULT 0;

CREATE TABLE auth_codes (
  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  email text NOT NULL,
  code text NOT NULL,
  purpose text NOT NULL,
  expires_at text NOT NULL,
  created_at text NOT NULL DEFAULT CURRENT_TIMESTAMP
);
