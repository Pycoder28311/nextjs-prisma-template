/*
  Warnings:

  - You are about to drop the `ProductChildTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProductChildTest` DROP FOREIGN KEY `ProductChildTest_productTestId_fkey`;

-- DropTable
DROP TABLE `ProductChildTest`;
