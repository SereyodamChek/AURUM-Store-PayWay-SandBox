-- Drop existing tables (WARNING: This will DELETE ALL DATA!)
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `User`;

-- Create User Table
CREATE TABLE `User` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `passwordHash` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE `orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `order_id` VARCHAR(191) NOT NULL UNIQUE,
  `payment_id` VARCHAR(191) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
  `paid_at` DATETIME NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX `idx_user_email` ON `User`(`email`);
CREATE INDEX `idx_order_user` ON `orders`(`user_id`);
CREATE INDEX `idx_order_order_id` ON `orders`(`order_id`);