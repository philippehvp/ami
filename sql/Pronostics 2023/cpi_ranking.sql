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
-- Table structure for table `cpi_ranking`
--

CREATE TABLE `cpi_ranking` (
  `better_id` int(11) NOT NULL,
  `contest_day` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `ranking` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cpi_ranking`
--

INSERT INTO `cpi_ranking` (`better_id`, `contest_day`, `points`, `ranking`) VALUES
(14, 1, 86, 16),
(14, 2, 52, 4),
(15, 1, 70, 34),
(15, 2, 17, 37),
(18, 1, 81, 20),
(18, 2, 14, 40),
(20, 1, 0, 53),
(21, 1, 0, 53),
(21, 2, 34, 18),
(22, 1, 63, 39),
(22, 2, 32, 23),
(23, 1, 61, 44),
(23, 2, 36, 16),
(24, 1, 71, 31),
(24, 2, 41, 11),
(25, 1, 69, 35),
(25, 2, 17, 37),
(26, 1, 61, 44),
(26, 2, 27, 27),
(27, 1, 68, 37),
(27, 2, 39, 14),
(28, 1, 87, 15),
(28, 2, 12, 41),
(29, 1, 56, 47),
(30, 1, 105, 3),
(30, 2, 42, 9),
(31, 1, 91, 11),
(31, 2, 48, 7),
(32, 1, 73, 29),
(33, 1, 74, 26),
(33, 2, 0, 43),
(34, 1, 56, 47),
(35, 1, 96, 9),
(36, 1, 86, 16),
(37, 1, 0, 53),
(38, 1, 62, 43),
(38, 2, 0, 43),
(39, 1, 90, 12),
(39, 2, 49, 5),
(40, 1, 88, 13),
(41, 1, 88, 13),
(42, 1, 20, 52),
(42, 2, 42, 9),
(43, 1, 63, 39),
(43, 2, 17, 37),
(44, 1, 105, 3),
(44, 2, 24, 30),
(45, 1, 81, 20),
(46, 1, 0, 53),
(47, 1, 79, 22),
(47, 2, 56, 2),
(48, 1, 76, 25),
(49, 1, 57, 46),
(50, 1, 0, 53),
(51, 1, 79, 22),
(52, 1, 63, 39),
(52, 2, 7, 42),
(53, 1, 66, 38),
(53, 2, 24, 30),
(54, 1, 72, 30),
(54, 2, 41, 11),
(55, 1, 102, 6),
(55, 2, 49, 5),
(58, 1, 37, 51),
(59, 1, 44, 49),
(60, 1, 63, 39),
(61, 1, 0, 53),
(62, 1, 107, 2),
(62, 2, 60, 1),
(63, 1, 98, 8),
(63, 2, 34, 18),
(64, 1, 118, 1),
(64, 2, 22, 35),
(65, 1, 71, 31),
(65, 2, 29, 25),
(66, 1, 83, 18),
(66, 2, 24, 30),
(67, 1, 96, 9),
(67, 2, 24, 30),
(68, 1, 83, 18),
(68, 2, 22, 35),
(69, 1, 74, 26),
(69, 2, 29, 25),
(70, 1, 69, 35),
(71, 1, 74, 26),
(71, 2, 0, 43),
(72, 1, 78, 24),
(72, 2, 31, 24),
(73, 1, 0, 53),
(74, 1, 0, 53),
(75, 1, 101, 7),
(76, 1, 103, 5),
(77, 1, 71, 31),
(78, 1, 39, 50),
(79, 2, 24, 30),
(80, 2, 0, 43),
(81, 2, 27, 27),
(82, 2, 34, 18),
(83, 2, 38, 15),
(84, 2, 36, 16),
(85, 2, 27, 27),
(86, 2, 34, 18),
(87, 2, 0, 43),
(88, 2, 41, 11),
(89, 2, 0, 43),
(90, 2, 33, 22),
(91, 2, 46, 8),
(92, 2, 55, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cpi_ranking`
--
ALTER TABLE `cpi_ranking`
  ADD PRIMARY KEY (`better_id`,`contest_day`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
