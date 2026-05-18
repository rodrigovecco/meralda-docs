-- Migration 000003: User API tokens
-- Standalone access tokens for users, independent of password.

SET NAMES utf8mb4;
SET default_storage_engine = InnoDB;

CREATE TABLE IF NOT EXISTS `user_api_tokens` (
  `id`               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`          INT           NOT NULL,
  `token_hash`       CHAR(64)      NOT NULL,
  `label`            VARCHAR(160)  NOT NULL,
  `permissions_json` TEXT          NULL     COMMENT 'JSON array of permission codes (NULL = no extra restriction)',
  `active`           TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_used_at`     DATETIME      NULL,
  `expires_at`       DATETIME      NULL     COMMENT 'NULL means never expires',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_api_tokens_hash` (`token_hash`),
  KEY `idx_user_api_tokens_user`   (`user_id`),
  KEY `idx_user_api_tokens_active` (`active`)
);
