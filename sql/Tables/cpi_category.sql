-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: istresspruisb.mysql.db
-- Generation Time: Jul 10, 2023 at 11:20 PM
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
-- Table structure for table `cpi_category`
--

CREATE TABLE `cpi_category` (
  `id` int(11) NOT NULL,
  `shortName` varchar(2) NOT NULL,
  `longName` varchar(32) NOT NULL,
  `contest_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cpi_category`
--

INSERT INTO `cpi_category` (`id`, `shortName`, `longName`, `contest_id`) VALUES
(11, '1', 'Série 1', 1),
(12, '2', 'Série 2', 1),
(13, '3', 'Série 3', 1),
(14, '4', 'Série 4', 1),
(15, '5', 'Série 5', 1),
(21, '1', 'Série 1', 2),
(22, '2', 'Série 2', 2),
(23, '3', 'Série 3', 2),
(24, '4', 'Série 4', 2),
(25, '5', 'Série 5', 2),
(31, '1', 'Série 1', 3),
(32, '2', 'Série 2', 3),
(33, '3', 'Série 3', 3),
(34, '4', 'Série 4', 3),
(35, '5', 'Série 5', 3),
(36, '6', 'Série 6', 3),
(37, '7', 'Série 7', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cpi_category`
--
ALTER TABLE `cpi_category`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
