-- Create database template
-- Replace 'your_database_name' with your actual database name,
-- then run this file before meralda_base_tables.sql.

SET default_storage_engine = InnoDB;

CREATE DATABASE IF NOT EXISTS `your_database_name`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
