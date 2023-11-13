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
-- Table structure for table `cpi_duration`
--

CREATE TABLE `cpi_duration` (
  `better_id` int(11) NOT NULL,
  `contest_day` tinyint(4) NOT NULL,
  `duration` int(11) NOT NULL,
  `isDurationModified` smallint(6) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cpi_duration`
--

INSERT INTO `cpi_duration` (`better_id`, `contest_day`, `duration`, `isDurationModified`) VALUES
(1, 1, 66, 1),
(1, 2, 58, 1),
(14, 1, 55, 1),
(14, 2, 60, 1),
(15, 1, 60, 1),
(15, 2, 60, 1),
(18, 1, 59, 1),
(18, 2, 56, 1),
(20, 1, 35, 1),
(21, 1, 30, 0),
(21, 2, 54, 1),
(22, 1, 64, 1),
(22, 2, 58, 1),
(23, 1, 75, 1),
(23, 2, 63, 1),
(24, 1, 64, 1),
(24, 2, 61, 1),
(25, 1, 65, 1),
(25, 2, 30, 0),
(26, 1, 71, 1),
(26, 2, 72, 1),
(27, 1, 65, 1),
(27, 2, 58, 1),
(28, 1, 61, 1),
(28, 2, 30, 0),
(29, 1, 85, 1),
(30, 1, 52, 1),
(30, 2, 50, 1),
(31, 1, 56, 1),
(31, 2, 61, 1),
(32, 1, 30, 1),
(33, 1, 70, 1),
(33, 2, 30, 0),
(34, 1, 70, 1),
(35, 1, 70, 1),
(36, 1, 85, 1),
(37, 1, 30, 1),
(38, 1, 61, 1),
(38, 2, 30, 0),
(39, 1, 69, 1),
(39, 2, 69, 1),
(40, 1, 87, 1),
(41, 1, 47, 1),
(42, 1, 65, 1),
(42, 2, 70, 1),
(43, 1, 68, 1),
(43, 2, 30, 0),
(44, 1, 56, 1),
(44, 2, 65, 1),
(45, 1, 62, 1),
(46, 1, 30, 0),
(47, 1, 82, 1),
(47, 2, 66, 1),
(48, 1, 77, 1),
(49, 1, 62, 1),
(50, 1, 30, 0),
(51, 1, 30, 0),
(52, 1, 53, 1),
(52, 2, 58, 1),
(53, 1, 51, 1),
(53, 2, 57, 1),
(54, 1, 72, 1),
(54, 2, 65, 1),
(55, 1, 82, 1),
(55, 2, 61, 1),
(58, 1, 30, 0),
(59, 1, 66, 1),
(60, 1, 62, 1),
(61, 1, 30, 0),
(62, 1, 89, 1),
(62, 2, 63, 1),
(63, 1, 52, 1),
(63, 2, 58, 1),
(64, 1, 58, 1),
(64, 2, 63, 1),
(65, 1, 56, 1),
(65, 2, 59, 1),
(66, 1, 51, 1),
(66, 2, 30, 0),
(67, 1, 75, 1),
(67, 2, 60, 1),
(68, 1, 54, 1),
(68, 2, 57, 1),
(69, 1, 74, 1),
(69, 2, 63, 1),
(70, 1, 58, 1),
(71, 1, 30, 0),
(71, 2, 64, 1),
(72, 1, 62, 1),
(72, 2, 56, 1),
(73, 1, 30, 0),
(74, 1, 30, 0),
(75, 1, 51, 1),
(76, 1, 77, 1),
(77, 1, 52, 1),
(78, 1, 30, 0),
(79, 2, 55, 1),
(80, 2, 41, 1),
(81, 2, 61, 1),
(82, 2, 56, 1),
(83, 2, 58, 1),
(84, 2, 77, 1),
(85, 2, 84, 1),
(86, 2, 54, 1),
(87, 2, 55, 1),
(88, 2, 49, 1),
(89, 2, 67, 1),
(90, 2, 59, 1),
(91, 2, 52, 1),
(92, 2, 64, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cpi_duration`
--
ALTER TABLE `cpi_duration`
  ADD PRIMARY KEY (`better_id`,`contest_day`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
