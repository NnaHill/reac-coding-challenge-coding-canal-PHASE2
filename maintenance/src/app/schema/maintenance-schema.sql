CREATE DATABASE maintenance_db;

USE maintenance_db;

CREATE TABLE Equipment (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    department ENUM('Machining', 'Assembly', 'Packaging', 'Shipping') NOT NULL,
    model VARCHAR(255) NOT NULL,
    serialNumber VARCHAR(255) NOT NULL,
    installDate DATE NOT NULL,
    status ENUM('Operational', 'Down', 'Maintenance', 'Retired') NOT NULL
);

CREATE TABLE MaintenanceRecord (
    id VARCHAR(255) PRIMARY KEY,
    equipmentId VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    type ENUM('Preventive', 'Repair', 'Emergency') NOT NULL,
    technician VARCHAR(255) NOT NULL,
    hoursSpent DECIMAL(5,2) NOT NULL,
    description TEXT NOT NULL,
    partsReplaced JSON,
    priority ENUM('Low', 'Medium', 'High') NOT NULL,
    completionStatus ENUM('Complete', 'Incomplete', 'Pending Parts') NOT NULL,
    FOREIGN KEY (equipmentId) REFERENCES Equipment(id)
);