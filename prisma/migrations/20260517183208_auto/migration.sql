-- CreateTable
CREATE TABLE `ManyOne` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ManyTwo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ManyOneToManyTwo` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ManyOneToManyTwo_AB_unique`(`A`, `B`),
    INDEX `_ManyOneToManyTwo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ManyOneToManyTwo` ADD CONSTRAINT `_ManyOneToManyTwo_A_fkey` FOREIGN KEY (`A`) REFERENCES `ManyOne`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ManyOneToManyTwo` ADD CONSTRAINT `_ManyOneToManyTwo_B_fkey` FOREIGN KEY (`B`) REFERENCES `ManyTwo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
