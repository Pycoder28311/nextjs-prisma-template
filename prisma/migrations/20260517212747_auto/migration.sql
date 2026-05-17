-- CreateTable
CREATE TABLE `ProductChildTest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `productTestId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductChildTest` ADD CONSTRAINT `ProductChildTest_productTestId_fkey` FOREIGN KEY (`productTestId`) REFERENCES `TestTable`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
