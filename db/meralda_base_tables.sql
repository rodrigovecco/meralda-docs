-- Meralda base tables
-- Server: MariaDB 10.4+
-- Run create_db.sql first, then execute this file against your database.
-- After this, run initial_user.sql to create the main admin user.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;
SET default_storage_engine = InnoDB;

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `complete_name` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `secpass` tinyint(1) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `last_login_date` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(255) NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT 0,
  `rol_admin` tinyint(1) NOT NULL DEFAULT 0,
  `reset_pass_code` varchar(255) NOT NULL,
  `reset_pass_enabled` tinyint(1) NOT NULL,
  `reset_pass_expires` datetime NOT NULL,
  `must_change_pass` tinyint(1) NOT NULL,
  `image` varchar(255) NOT NULL,
  `phonenumber` varchar(100) NOT NULL,
  `rol_consult` tinyint(1) NOT NULL DEFAULT 0,
  `rol_user` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
);

-- --------------------------------------------------------
-- Table: bruteforce_blacklist
-- --------------------------------------------------------

DROP TABLE IF EXISTS `bruteforce_blacklist`;
CREATE TABLE IF NOT EXISTS `bruteforce_blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `banned_on` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip_address` (`ip_address`)
);

-- --------------------------------------------------------
-- Table: bruteforce_ip_activity
-- --------------------------------------------------------

DROP TABLE IF EXISTS `bruteforce_ip_activity`;
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

-- --------------------------------------------------------
-- Table: bruteforce_whitelist
-- --------------------------------------------------------

DROP TABLE IF EXISTS `bruteforce_whitelist`;
CREATE TABLE IF NOT EXISTS `bruteforce_whitelist` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `added_on` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip_address` (`ip_address`)
);
