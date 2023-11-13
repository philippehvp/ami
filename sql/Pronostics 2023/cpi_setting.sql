-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: istresspruisb.mysql.db
-- Generation Time: Jul 10, 2023 at 11:22 PM
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
-- Table structure for table `cpi_setting`
--

CREATE TABLE `cpi_setting` (
  `better_id` int(11) NOT NULL,
  `clubName` smallint(6) NOT NULL DEFAULT '0',
  `autoNavigation` smallint(6) NOT NULL DEFAULT '0',
  `playerReverse` smallint(6) NOT NULL DEFAULT '0',
  `theme_id` smallint(6) NOT NULL DEFAULT '1',
  `firstNameVisible` smallint(6) NOT NULL DEFAULT '1',
  `playerRanking` smallint(6) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cpi_setting`
--

INSERT INTO `cpi_setting` (`better_id`, `clubName`, `autoNavigation`, `playerReverse`, `theme_id`, `firstNameVisible`, `playerRanking`) VALUES
(1, 0, 0, 0, 1, 0, 1),
(14, 1, 0, 0, 1, 1, 1),
(15, 0, 1, 1, 1, 1, 1),
(18, 1, 0, 0, 1, 1, 1),
(20, 0, 0, 0, 0, 1, 1),
(21, 0, 1, 0, 1, 0, 0),
(22, 0, 1, 0, 1, 1, 1),
(23, 1, 0, 1, 1, 1, 1),
(24, 0, 1, 0, 1, 1, 1),
(25, 1, 0, 0, 1, 1, 1),
(26, 1, 1, 1, 1, 1, 1),
(27, 0, 0, 0, 1, 1, 1),
(28, 0, 0, 1, 4, 1, 1),
(29, 0, 0, 0, 1, 1, 1),
(30, 0, 0, 0, 0, 1, 1),
(31, 0, 0, 0, 4, 1, 1),
(32, 0, 0, 0, 0, 1, 1),
(33, 0, 1, 1, 1, 1, 1),
(34, 0, 0, 1, 4, 1, 1),
(35, 0, 1, 1, 4, 1, 1),
(36, 0, 0, 0, 0, 1, 1),
(37, 0, 0, 0, 0, 1, 1),
(38, 0, 0, 0, 0, 1, 1),
(39, 1, 0, 1, 1, 1, 1),
(40, 0, 0, 0, 0, 1, 1),
(41, 0, 0, 0, 0, 1, 1),
(42, 0, 1, 0, 1, 1, 1),
(43, 1, 0, 0, 1, 1, 1),
(44, 0, 0, 0, 4, 1, 1),
(45, 1, 1, 0, 1, 1, 1),
(46, 0, 0, 0, 0, 1, 1),
(47, 0, 0, 0, 1, 1, 1),
(48, 1, 1, 0, 1, 1, 1),
(49, 1, 1, 0, 1, 1, 1),
(50, 0, 1, 0, 1, 1, 1),
(51, 0, 0, 0, 1, 1, 1),
(52, 0, 1, 1, 1, 1, 1),
(53, 0, 0, 0, 1, 1, 1),
(54, 0, 1, 0, 1, 1, 1),
(55, 0, 0, 0, 1, 1, 1),
(58, 0, 0, 0, 0, 1, 1),
(59, 0, 0, 0, 0, 1, 1),
(60, 0, 0, 0, 1, 1, 1),
(61, 0, 0, 0, 0, 1, 1),
(62, 0, 1, 1, 1, 1, 1),
(63, 0, 0, 0, 1, 1, 1),
(64, 0, 0, 0, 0, 1, 1),
(65, 0, 0, 0, 0, 1, 1),
(66, 0, 0, 0, 0, 1, 1),
(67, 0, 0, 0, 0, 1, 1),
(68, 0, 1, 0, 1, 1, 1),
(69, 0, 1, 0, 4, 1, 1),
(70, 1, 0, 0, 5, 1, 1),
(71, 0, 1, 1, 1, 1, 1),
(72, 0, 0, 0, 0, 1, 1),
(73, 0, 0, 0, 0, 1, 1),
(74, 0, 0, 0, 0, 1, 1),
(75, 0, 0, 0, 5, 1, 1),
(76, 0, 0, 0, 0, 1, 1),
(77, 0, 1, 0, 5, 1, 1),
(78, 0, 0, 0, 0, 1, 1),
(79, 0, 1, 1, 1, 1, 1),
(80, 0, 0, 0, 0, 1, 1),
(81, 0, 0, 1, 1, 1, 1),
(82, 0, 0, 0, 0, 1, 1),
(83, 0, 0, 0, 0, 1, 1),
(84, 0, 0, 0, 0, 1, 1),
(85, 0, 0, 0, 0, 1, 1),
(86, 0, 0, 0, 0, 1, 1),
(87, 0, 1, 0, 3, 1, 1),
(88, 0, 0, 0, 0, 1, 1),
(89, 0, 0, 0, 1, 1, 1),
(90, 0, 0, 0, 0, 1, 1),
(91, 0, 0, 1, 1, 1, 1),
(92, 0, 0, 0, 0, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cpi_setting`
--
ALTER TABLE `cpi_setting`
  ADD PRIMARY KEY (`better_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
