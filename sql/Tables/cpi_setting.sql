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
