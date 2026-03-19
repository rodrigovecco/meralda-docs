-- Initial admin user
-- Run this after meralda_base_tables.sql.
-- Change the email and password hash before running in production.
-- Password must be a bcrypt hash (cost 10+). Never store plain text.

SET NAMES utf8mb4;

INSERT INTO `users` (
  `name`,
  `complete_name`,
  `pass`,
  `secpass`,
  `active`,
  `last_login_date`,
  `last_login_ip`,
  `is_main`,
  `rol_admin`,
  `reset_pass_code`,
  `reset_pass_enabled`,
  `reset_pass_expires`,
  `must_change_pass`,
  `image`,
  `phonenumber`,
  `rol_consult`,
  `rol_user`
) VALUES (
  'admin@meralda.dev',              -- change: admin email / username
  'Administrator',                  -- change: display name
  '$2y$10$8QTvkfaJdugQUHz3f3lxK.a48cuegnDhko46MNE/07QIzYxnn/5P6',       -- change: bcrypt hash of the initial password
  1,                                -- secpass
  1,                                -- active
  NULL,                             -- last_login_date
  '',                               -- last_login_ip
  1,                                -- is_main
  0,                                -- rol_admin
  '',                               -- reset_pass_code
  0,                                -- reset_pass_enabled
  '0000-00-00 00:00:00',            -- reset_pass_expires
  1,                                -- must_change_pass: force password change on first login
  '',                               -- image
  '',                               -- phonenumber
  0,                                -- rol_consult
  0                                 -- rol_user
);
