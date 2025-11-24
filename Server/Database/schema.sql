-- Database schema for DOAGuru Letters

-- Drop existing tables if they exist
DROP TABLE IF EXISTS `offer_letters`;
DROP TABLE IF EXISTS `internship_offers`;

-- Table structure for offer_letters
CREATE TABLE `offer_letters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` text,
  `phoneNumber` varchar(20),
  `email` varchar(255),
  `offerReleaseDate` date,
  `joiningDate` date,
  `designation` varchar(100),
  `salary` varchar(100),
  `probationPeriod` varchar(50),
  `noticePeriod` varchar(50),
  `confirmationNoticePeriod` varchar(50),
  `jobResponsibilities` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for internship_offers
CREATE TABLE `internship_offers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` text,
  `phoneNumber` varchar(20),
  `email` varchar(255),
  `startDate` date,
  `endDate` date,
  `position` varchar(100),
  `stipend` varchar(100),
  `mentorName` varchar(100),
  `mentorContact` varchar(100),
  `termsAndConditions` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
