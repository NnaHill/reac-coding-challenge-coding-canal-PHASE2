-- CreateTable
CREATE TABLE `Equipment` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `department` ENUM('Machining', 'Assembly', 'Packaging', 'Shipping') NOT NULL,
    `model` VARCHAR(255) NOT NULL,
    `serialNumber` VARCHAR(255) NOT NULL,
    `installDate` DATE NOT NULL,
    `status` ENUM('Operational', 'Down', 'Maintenance', 'Retired') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaintenanceRecord` (
    `id` VARCHAR(255) NOT NULL,
    `equipmentId` VARCHAR(255) NOT NULL,
    `date` DATE NOT NULL,
    `type` ENUM('Preventive', 'Repair', 'Emergency') NOT NULL,
    `technician` VARCHAR(255) NOT NULL,
    `hoursSpent` DECIMAL(5, 2) NOT NULL,
    `description` TEXT NOT NULL,
    `partsReplaced` JSON NULL,
    `priority` ENUM('Low', 'Medium', 'High') NOT NULL,
    `completionStatus` ENUM('Complete', 'Incomplete', 'PendingParts') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MaintenanceRecord` ADD CONSTRAINT `MaintenanceRecord_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `Equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
