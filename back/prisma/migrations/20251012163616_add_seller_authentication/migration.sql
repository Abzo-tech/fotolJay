/*
  Warnings:

  - You are about to drop the column `seller_email` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `seller_name` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `seller_phone` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(0))`.
  - Added the required column `seller_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Create a default admin user for existing products (if not exists)
INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `role`, `is_active`, `created_at`, `updated_at`)
SELECT 
  'default-admin-seller',
  'system-admin@fotoljay.com',
  '$2b$10$CPDwziKpv8p9K8r148DawuiYNgUtS/1ZTrJBXGIP4dIZUDgqP.Gpa',
  'System',
  'Admin',
  'ADMIN',
  1,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `email` = 'system-admin@fotoljay.com');

-- Step 2: Add seller_id column with temporary default
ALTER TABLE `products` ADD COLUMN `seller_id` VARCHAR(191) NULL;

-- Step 3: Update existing products to use the default admin
UPDATE `products` SET `seller_id` = 'default-admin-seller' WHERE `seller_id` IS NULL;

-- Step 4: Make seller_id NOT NULL
ALTER TABLE `products` MODIFY `seller_id` VARCHAR(191) NOT NULL;

-- DropIndex (if exists)
DROP INDEX IF EXISTS `products_seller_email_idx` ON `products`;

-- Step 5: Drop old seller columns
ALTER TABLE `products` DROP COLUMN `seller_email`,
    DROP COLUMN `seller_name`,
    DROP COLUMN `seller_phone`;

-- AlterTable: Update user roles enum
ALTER TABLE `users` MODIFY `role` ENUM('SELLER', 'MODERATOR', 'ADMIN') NOT NULL DEFAULT 'SELLER';

-- CreateIndex
CREATE INDEX `products_seller_id_idx` ON `products`(`seller_id`);

-- CreateIndex
CREATE INDEX `users_role_idx` ON `users`(`role`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_seller_id_fkey` FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
