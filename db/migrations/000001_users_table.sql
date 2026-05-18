-- Migration 000001: Users table
-- Meralda original base table.

SET NAMES utf8mb4;
SET default_storage_engine = InnoDB;

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
