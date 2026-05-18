-- Migration 000002: Bruteforce protection tables

SET NAMES utf8mb4;
SET default_storage_engine = InnoDB;

CREATE TABLE IF NOT EXISTS `bruteforce_blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `banned_on` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip_address` (`ip_address`)
);

CREATE TABLE IF NOT EXISTS `bruteforce_ip_activity` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) DEFAULT NULL,
  `last_username_attempted` varchar(255) DEFAULT NULL,
  `failed_attempts` int(11) NOT NULL DEFAULT 0,
  `last_attempt` datetime NOT NULL DEFAULT current_timestamp(),
  `lock_until` datetime DEFAULT NULL,
  `historical_failed_attempts` int(11) NOT NULL DEFAULT 0,
  `historical_successful_attempts` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip_address` (`ip_address`)
);

CREATE TABLE IF NOT EXISTS `bruteforce_whitelist` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `added_on` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip_address` (`ip_address`)
);
