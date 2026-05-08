/*
  Warnings:

  - A unique constraint covering the columns `[position]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Made the column `position` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `position` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_position_key` ON `Product`(`position`);
