/*
  Warnings:

  - You are about to drop the column `user` on the `otp` table. All the data in the column will be lost.
  - Added the required column `expiredAt` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Made the column `refreshToken` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `otp` DROP COLUMN `user`,
    ADD COLUMN `expiredAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `refreshToken` VARCHAR(191) NOT NULL;
