-- OAuth 2.1 support tables — reference copy
-- Canonical migration: mw/db/migrations/000004_oauth_tables.sql
--
-- Design: access and refresh tokens are STATELESS (HMAC-signed, not stored).
-- Only clients (DCR) and short-lived auth codes require DB rows.
--
-- The HMAC key for every derived token is user_api_tokens.token_hash.
-- Revoking the master token immediately invalidates all OAuth tokens from it.

-- Registered OAuth clients (Dynamic Client Registration, RFC 7591).
-- Claude registers itself automatically on first connection.
CREATE TABLE IF NOT EXISTS `oauth_clients` (
    `id`            VARCHAR(40)  NOT NULL                         COMMENT 'Random hex client_id',
    `client_name`   VARCHAR(200) NOT NULL DEFAULT '',
    `redirect_uris` TEXT         NOT NULL                         COMMENT 'JSON array of allowed redirect URIs',
    `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Short-lived authorization codes (deleted immediately on use).
-- Each row lives at most 10 minutes; a lazy GC cleans up any stragglers.
CREATE TABLE IF NOT EXISTS `oauth_auth_codes` (
    `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `code_hash`      CHAR(64)     NOT NULL                        COMMENT 'SHA-256 of the actual code (never stored in clear)',
    `client_id`      VARCHAR(40)  NOT NULL,
    `api_token_id`   INT UNSIGNED NOT NULL                        COMMENT 'FK to user_api_tokens.id — HMAC anchor for derived tokens',
    `redirect_uri`   VARCHAR(500) NOT NULL,
    `code_challenge` VARCHAR(128) NOT NULL                        COMMENT 'PKCE S256 challenge',
    `expires_at`     DATETIME     NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_code_hash`  (`code_hash`),
    KEY       `idx_expires`    (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
