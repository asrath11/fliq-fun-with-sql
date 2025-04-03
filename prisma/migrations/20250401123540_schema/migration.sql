/*
  Warnings:

  - You are about to drop the `addons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `city` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `otp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `package` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `state` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `city` DROP FOREIGN KEY `City_stateId_fkey`;

-- DropTable
DROP TABLE `addons`;

-- DropTable
DROP TABLE `city`;

-- DropTable
DROP TABLE `otp`;

-- DropTable
DROP TABLE `package`;

-- DropTable
DROP TABLE `state`;

-- DropTable
DROP TABLE `user`;
