CREATE TABLE IF NOT EXISTS `users` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `password_hash` text NOT NULL,
  `created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);

CREATE TABLE IF NOT EXISTS `catalog_items` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `category` text NOT NULL,
  `owner` text NOT NULL,
  `created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);

CREATE INDEX IF NOT EXISTS `catalog_items_created_idx` ON `catalog_items` (`created_at`);

CREATE TABLE IF NOT EXISTS `user_services` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` integer NOT NULL,
  `created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  `name` text NOT NULL,
  `area` text NOT NULL,
  `plan` text NOT NULL,
  `price` text NOT NULL,
  `billing` text NOT NULL,
  `next_invoice` text NOT NULL,
  `status` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `user_services_user_idx` ON `user_services` (`user_id`);
