-- AlterTable
ALTER TABLE `products` ADD COLUMN `expires_at` DATETIME(3) NULL,
    ADD COLUMN `vip_until` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NULL,
    `type` ENUM('BUY_CREDITS', 'SPEND_VIP', 'SPEND_EXTENSION') NOT NULL,
    `amount` INTEGER NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `transactions_user_id_idx`(`user_id`),
    INDEX `transactions_product_id_idx`(`product_id`),
    INDEX `transactions_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `products_expires_at_idx` ON `products`(`expires_at`);

-- CreateIndex
CREATE INDEX `products_vip_until_idx` ON `products`(`vip_until`);

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
