-- CreateTable
CREATE TABLE `HomeFeaturedTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `catalog` ENUM('SAJNEN', 'OLIVE_WOOD') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `ctaLabel` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL,
    `imageSrc` VARCHAR(2048) NOT NULL,
    `imageAlt` VARCHAR(191) NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `HomeFeaturedTemplate_isPublished_idx`(`isPublished`),
    INDEX `HomeFeaturedTemplate_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'default',
    `homeHeroPublished` BOOLEAN NOT NULL DEFAULT true,
    `menuShowAccueil` BOOLEAN NOT NULL DEFAULT true,
    `menuShowSajnen` BOOLEAN NOT NULL DEFAULT true,
    `menuShowOliveWood` BOOLEAN NOT NULL DEFAULT true,
    `menuShowAPropos` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
