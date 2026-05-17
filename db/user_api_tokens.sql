-- User API Tokens
-- Standalone access tokens for users, independent of password.
-- Tokens have specific permission scopes and survive password changes.
--
-- The raw token string is NEVER stored — only its SHA-256 hash.
-- Tokens are generated once and displayed to the user at creation time only.
--
-- Permission codes are free-form strings (e.g. hbeat_read, hbeat_metrics_write).
-- The super admin user always passes all permission checks regardless of token scope.

CREATE TABLE IF NOT EXISTS `user_api_tokens` (
    `id`               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    `user_id`          INT           NOT NULL,
    `token_hash`       CHAR(64)      NOT NULL,
    `label`            VARCHAR(160)  NOT NULL,
    `permissions_json` TEXT          NULL     COMMENT 'JSON array of permission codes; NULL = no extra restriction',
    `active`           TINYINT(1)    NOT NULL DEFAULT 1,
    `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_used_at`     DATETIME      NULL,
    `expires_at`       DATETIME      NULL     COMMENT 'NULL = never expires',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_user_api_tokens_hash` (`token_hash`),
    KEY `idx_user_api_tokens_user`   (`user_id`),
    KEY `idx_user_api_tokens_active` (`active`)
);
