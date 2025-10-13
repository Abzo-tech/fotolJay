/*
  Warnings:

  - You are about to drop the column `is_read` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `is_vip` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(0))`.
  - Added the required column `recipient_email` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_email` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_name` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_phone` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_user_id_fkey`;

-- DropIndex
DROP INDEX `notifications_is_read_idx` ON `notifications`;

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `is_read`,
    DROP COLUMN `user_id`,
    ADD COLUMN `recipient_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `sent` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sent_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `photos` ADD COLUMN `public_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `user_id`,
    ADD COLUMN `seller_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `seller_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `seller_phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `is_vip`,
    DROP COLUMN `phone`,
    MODIFY `role` ENUM('MODERATOR', 'ADMIN') NOT NULL DEFAULT 'MODERATOR';

-- CreateIndex
CREATE INDEX `notifications_recipient_email_idx` ON `notifications`(`recipient_email`);

-- CreateIndex
CREATE INDEX `notifications_sent_idx` ON `notifications`(`sent`);

-- CreateIndex
CREATE INDEX `products_seller_email_idx` ON `products`(`seller_email`);
