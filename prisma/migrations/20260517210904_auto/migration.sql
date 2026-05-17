-- CreateTable
CREATE TABLE `RelationOne` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RelationTwo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RelationOneTwo` (
    `relationOneId` INTEGER NOT NULL,
    `relationTwoId` INTEGER NOT NULL,
    `role` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`relationOneId`, `relationTwoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RelationOneTwo` ADD CONSTRAINT `RelationOneTwo_relationOneId_fkey` FOREIGN KEY (`relationOneId`) REFERENCES `RelationOne`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationOneTwo` ADD CONSTRAINT `RelationOneTwo_relationTwoId_fkey` FOREIGN KEY (`relationTwoId`) REFERENCES `RelationTwo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
