-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 29, 2024 at 01:49 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydoaguru_letters`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_user`
--

CREATE TABLE `admin_user` (
  `id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_user`
--

INSERT INTO `admin_user` (`id`, `user_name`, `email`, `password`) VALUES
(1, 'MY DOAGURU', 'doaguru@gmail.com', '123456');

-- --------------------------------------------------------

--
-- Table structure for table `genrate_letters`
--

CREATE TABLE `genrate_letters` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `letter_type` varchar(200) NOT NULL,
  `Date` varchar(200) NOT NULL,
  `designation` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offer_letters`
--

CREATE TABLE `offer_letters` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `offerReleaseDate` varchar(255) NOT NULL,
  `joiningDate` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `salary` varchar(255) NOT NULL,
  `benefits` text NOT NULL,
  `officeTimings` varchar(255) NOT NULL,
  `noticePeriod` varchar(255) NOT NULL,
  `jobResponsibilities` text NOT NULL,
  `pdfPath` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offer_letters`
--

INSERT INTO `offer_letters` (`id`, `name`, `offerReleaseDate`, `joiningDate`, `designation`, `salary`, `benefits`, `officeTimings`, `noticePeriod`, `jobResponsibilities`, `pdfPath`, `created_at`) VALUES
(114, 'qqqq', '2024-01-01', '2024-01-01', 'jsd', '15000', '1', '1', '1', '[\"\"]', 'G:\\DOAGuru Infoststem\\GitHub\\Offer_leter_Doaguru\\Server\\Controller\\upload\\qqqq_offer_letter.pdf', '2024-08-17 13:21:17'),
(115, 'Mohit Sahu', '2024-01-01', '2024-01-01', 'JSD', '15000', 'One PaidLeave ', '10:00 AM  to 07:30 PM', '15 Days', '[\"Puri Jime dari ap ke kandho me he \"]', 'G:\\DOAGuru Infoststem\\GitHub\\Offer_leter_Doaguru\\Server\\Controller\\upload\\Mohit Sahu_offer_letter.pdf', '2024-08-28 11:57:21'),
(116, 'Mohit Sahu', '2024-01-01', '2024-01-01', 'JSD', '15000', 'One PaidLeave ', '10:00 AM  to 07:30 PM', '15 Days', '[\"Puri Jime dari ap ke kandho me he \"]', 'G:\\DOAGuru Infoststem\\GitHub\\Offer_leter_Doaguru\\Server\\Controller\\upload\\Mohit Sahu_offer_letter.pdf', '2024-08-28 11:57:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'testuser', '$2a$10$Nx.S7QdEbrucRUFfm24ojuK.6n0yEOTTrN0Ecfw688W2NM3vDKwZ6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_user`
--
ALTER TABLE `admin_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `genrate_letters`
--
ALTER TABLE `genrate_letters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offer_letters`
--
ALTER TABLE `offer_letters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_user`
--
ALTER TABLE `admin_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `genrate_letters`
--
ALTER TABLE `genrate_letters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offer_letters`
--
ALTER TABLE `offer_letters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
