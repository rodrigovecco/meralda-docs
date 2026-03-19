-- =============================================================================
-- formsubmit module — table template
--
-- Each form gets its own table. Copy this template and replace
-- `your_form_table` with the actual table name returned by getTableName()
-- in your form manager.
--
-- Rate limiting is handled by counting rows WHERE ip_address = X AND
-- submitted_at >= NOW() - INTERVAL N MINUTES — no separate tracking table.
-- =============================================================================

CREATE TABLE IF NOT EXISTS `your_form_table` (
  `id`           bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_address`   varchar(45)         NOT NULL,
  `submitted_at` datetime            NOT NULL DEFAULT current_timestamp(),
  `data_json`    mediumtext              NULL COMMENT 'JSON-encoded submitted field values',
  `status`       tinyint(1)          NOT NULL DEFAULT 0 COMMENT '0=new 1=read 2=processed',
  PRIMARY KEY (`id`),
  KEY `ip_address`   (`ip_address`),
  KEY `submitted_at` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
