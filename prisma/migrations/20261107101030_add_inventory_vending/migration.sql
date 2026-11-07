-- AlterTable
ALTER TABLE `Product` ADD COLUMN `lowStockThreshold` INTEGER NOT NULL DEFAULT 3,
    ADD COLUMN `vendingEnabled` BOOLEAN NOT NULL DEFAULT true;
