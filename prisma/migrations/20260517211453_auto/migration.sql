/*
  Warnings:

  - You are about to drop the `RelationOne` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RelationOneTwo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RelationTwo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `RelationOneTwo` DROP FOREIGN KEY `RelationOneTwo_relationOneId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationOneTwo` DROP FOREIGN KEY `RelationOneTwo_relationTwoId_fkey`;

-- DropTable
DROP TABLE `RelationOne`;

-- DropTable
DROP TABLE `RelationOneTwo`;

-- DropTable
DROP TABLE `RelationTwo`;
