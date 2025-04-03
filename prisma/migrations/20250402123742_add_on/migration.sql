/*
  Warnings:

  - You are about to drop the `addons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `addons`;

-- CreateTable
CREATE TABLE `addOn` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` ENUM('Decorations', 'Cakes_EggLess_Cakes', 'photograpy', 'Roses', 'Special_Effects') NULL,
    `displayType` ENUM('AddOns', 'Gifts') NULL,
    `price` INTEGER NOT NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `addOn_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
