/*
  Warnings:

  - You are about to drop the `ProductChild` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProductChild` DROP FOREIGN KEY `ProductChild_productId_fkey`;

-- DropTable
DROP TABLE `ProductChild`;

-- CreateTable
CREATE TABLE `ProductChildren` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductChildren` ADD CONSTRAINT `ProductChildren_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
