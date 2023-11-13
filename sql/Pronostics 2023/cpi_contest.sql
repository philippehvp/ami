-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: istresspruisb.mysql.db
-- Generation Time: Jul 10, 2023 at 11:21 PM
-- Server version: 5.7.42-log
-- PHP Version: 8.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `istresspruisb`
--

-- --------------------------------------------------------

--
-- Table structure for table `cpi_contest`
--

CREATE TABLE `cpi_contest` (
  `id` int(11) NOT NULL,
  `shortName` varchar(2) NOT NULL,
  `longName` varchar(32) NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `endBetDate` datetime DEFAULT NULL,
  `endAdminDate` datetime DEFAULT NULL,
  `day` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cpi_contest`
--

INSERT INTO `cpi_contest` (`id`, `shortName`, `longName`, `startDate`, `endBetDate`, `endAdminDate`, `day`) VALUES
(1, 'DH', 'Doubles hommes', '2023-07-03 07:00:00', '2023-07-08 11:00:00', '2023-07-09 06:59:59', 1),
(2, 'DD', 'Doubles dames', '2023-07-03 07:00:00', '2023-07-08 11:00:00', '2023-07-09 06:59:59', 1),
(3, 'DM', 'Doubles mixtes', '2023-07-09 07:00:00', '2023-07-09 14:00:00', '2023-07-10 00:00:00', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cpi_contest`
--
ALTER TABLE `cpi_contest`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
