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
-- Table structure for table `cpi_player`
--

CREATE TABLE `cpi_player` (
  `id` int(11) NOT NULL,
  `playerName1` varchar(100) NOT NULL,
  `playerNameOnly1` varchar(100) DEFAULT NULL,
  `playerRanking1` varchar(3) NOT NULL,
  `playerClub1` varchar(255) NOT NULL,
  `playerName2` varchar(100) NOT NULL,
  `playerNameOnly2` varchar(100) DEFAULT NULL,
  `playerRanking2` varchar(3) NOT NULL,
  `playerClub2` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cpi_player`
--

INSERT INTO `cpi_player` (`id`, `playerName1`, `playerNameOnly1`, `playerRanking1`, `playerClub1`, `playerName2`, `playerNameOnly2`, `playerRanking2`, `playerClub2`, `category_id`) VALUES
(1, 'FABRE Gil', 'FABRE', 'N2', 'Aix Universite Club Badminton', 'GEORGEL Pierre', 'GEORGEL', 'N2', 'Aix Universite Club Badminton', 11),
(2, 'CONDOMINES Nathan', 'CONDOMINES', 'N2', 'Stade Marseillais Universite Club', 'FREQUELIN Sylvain', 'FREQUELIN', 'N2', 'Stade Marseillais Universite Club', 11),
(3, 'SICARD Gaëtan', 'SICARD', 'N3', 'Stade Marseillais Universite Club', 'VAUR Théo', 'VAUR', 'N2', 'Stade Marseillais Universite Club', 11),
(4, 'DEMARIA Thomas', 'DEMARIA', 'N3', 'Association Bad In Lez', 'RODRIGUEZ Vincent', 'RODRIGUEZ', 'N2', 'Association Bad In Lez', 11),
(5, 'CHOLLET Antonin', 'CHOLLET', 'N3', 'Aix Universite Club Badminton', 'GALLET Quentin', 'GALLET', 'N3', 'Aix Universite Club Badminton', 11),
(6, 'JOURDON Thomas', 'JOURDON', 'R4', 'Ailes Sportives Airbus Helicopters - Badminton', 'JULIEN Kévin', 'JULIEN', 'N3', 'Club Badminton de Nice', 11),
(7, 'LEBON Quentin', 'LEBON', 'N3', 'Istres Sports Badminton', 'VILLEDIEU Cedric', 'VILLEDIEU', 'N3', 'Istres Sports Badminton', 11),
(8, 'BARTOLO Romain', 'BARTOLO', 'N3', 'Badminton Club D\'Antibes', 'MARCHELIDON Mathis', 'MARCHELIDON', 'R4', 'Nice Universite Club Badminton', 11),
(9, 'GUILLERM Quentin', 'GUILLERM', 'R4', 'Badminton Pignan', 'TRAN Morgan', 'TRAN', 'R4', 'Olympique Badminton Club Nimes', 11),
(10, 'BONAVENTURA Didier', 'BONAVENTURA', 'R4', 'Ailes Sportives Airbus Helicopters - Badminton', 'SOULIE Fabien', 'SOULIE', 'R4', 'Ailes Sportives Airbus Helicopters - Badminton', 11),
(11, 'BORG Cyril', 'BORG', 'R4', 'Ailes Sportives Airbus Helicopters - Badminton', 'VAN BOXSOM Jeremy', 'VAN BOXSOM', 'R4', 'Ailes Sportives Airbus Helicopters - Badminton', 11),
(12, 'DELLA VALLE Théo', 'DELLA VALLE', 'R5', 'Martigues Badminton Club', 'TASSY Jerome', 'TASSY', 'R5', 'Martigues Badminton Club', 11),
(13, 'RAPEBACH Tom', 'RAPEBACH', 'R6', 'Saint Gely - Saint Clément Badminton', 'TEYSSIER Bastien', 'TEYSSIER', 'R4', 'Saint Gely - Saint Clément Badminton', 12),
(14, 'PACALET Xavier', 'PACALET', 'R5', 'Badminton Club D\'Antibes', 'TISET Sylvain', 'TISET', 'R5', 'Badminton Club D\'Antibes', 12),
(15, 'LEVAN Jean-pierre', 'LEVAN', 'R4', 'Badminton Club Langonais', 'MONCEL Fabrice', 'MONCEL', 'R6', 'Olympique Badminton Port-de-Bouc', 12),
(16, 'CARENSAC Paul', 'CARENSAC', 'R6', 'Bad A Flo', 'TAMINH Nicolas', 'TAMINH', 'R4', 'Bad A Flo', 12),
(17, 'DIEP Rémi', 'DIEP', 'R5', 'CLUB BADMINTON DE LATTES', 'LOPEZ Fabien', 'LOPEZ', 'R5', 'Badminton Pignan', 12),
(18, 'BUI Didier', 'BUI', 'R6', 'Nice Universite Club Badminton', 'MILLE Laurent', 'MILLE', 'R5', 'Bad In Marseille', 12),
(19, 'CHEKIR Yacine', 'CHEKIR', 'R5', 'Ailes Sportives Airbus Helicopters - Badminton', 'TORRIS Laurent', 'TORRIS', 'R6', 'Ailes Sportives Airbus Helicopters - Badminton', 12),
(20, 'BOIRON Cyril', 'BOIRON', 'R5', 'Simiane Badminton Club', 'KUDRYASHOV Anton', 'KUDRYASHOV', 'R5', 'Nice Universite Club Badminton', 12),
(21, 'BENAZIEB Othmene', 'BENAZIEB', 'R5', 'Association Bad In Lez', 'PUGINIER Kellian', 'PUGINIER', 'R6', 'Saint Gely - Saint Clément Badminton', 12),
(22, 'MUNOZ Marvin', 'MUNOZ', 'R5', 'Aigues Vives Badminton', 'ROUX Tristan', 'ROUX', 'R6', 'Montpellier Badminton Club', 12),
(23, 'JULIEN Michael', 'JULIEN', 'R6', 'Istres Sports Badminton', 'LE DREVO Alexandre', 'LE DREVO', 'R6', 'Istres Sports Badminton', 12),
(24, 'BENAVENT Jordan', 'BENAVENT', 'R6', 'Badminton Club D\'Antibes', 'SAMMITO Anael', 'SAMMITO', 'R6', 'Badminton Club D\'Antibes', 12),
(25, 'DENYS Alexandre', 'DENYS', 'R6', 'Simiane Badminton Club', 'SARROBERT Clément', 'SARROBERT', 'R6', 'Bad In Marseille', 13),
(26, 'KLASSEN Pierrick', 'KLASSEN', 'R6', 'Kimbad Ollioules', 'POELAERT Jérome', 'POELAERT', 'D8', 'Badminton Club Gapencais', 13),
(27, 'LAFOUCRIERE Guillaume', 'LAFOUCRIERE', 'D7', 'Bad à Morières', 'LORBER Angelo', 'LORBER', 'D7', 'Apt Badminton Club', 13),
(28, 'JARD Bastien', 'JARD', 'D7', 'Badminton Club D\'Antibes', 'ZOPPIS Alexandre', 'ZOPPIS', 'D7', 'Ass Crolloise Badminton', 13),
(29, 'HAY Bastien', 'HAY', 'D8', 'Briancon Badminton Club', 'JANDARD Noé', 'JANDARD', 'D7', 'Badminton Club Gapencais', 13),
(30, 'HOYER Maxime', 'HOYER', 'D8', 'Stade Marseillais Universite Club', 'ZOPPIS Baptiste', 'ZOPPIS', 'D7', 'Istres Sports Badminton', 13),
(31, 'ALEGRIA Matthias', 'ALEGRIA', 'D8', 'Martigues Badminton Club', 'JOUANNE Arnaud', 'JOUANNE', 'D7', 'Martigues Badminton Club', 13),
(32, 'CARON Damien', 'CARON', 'D8', 'Asptt Marseille', 'SIMANGUNSONG Franki', 'SIMANGUNSONG', 'D7', 'Asptt Marseille', 13),
(33, 'GODOT Tanguy', 'GODOT', 'D7', 'Badminton Olympique De Pernes', 'PREVOSTO Alexandre', 'PREVOSTO', 'D9', 'Badminton Olympique De Pernes', 13),
(34, 'JOBIN Marc', 'JOBIN', 'P10', 'Istres Sports Badminton', 'RIGAUT Tom', 'RIGAUT', 'D7', 'Istres Sports Badminton', 13),
(35, 'JULIEN Johan', 'JULIEN', 'D8', 'Olympique Badminton Club Nimes', 'MARTINEZ Thomas', 'MARTINEZ', 'D7', 'Olympique Badminton Club Nimes', 13),
(36, 'TERRASSON Julien', 'TERRASSON', 'D7', 'Union Montilienne Sportive Badminton', 'VAN HOUTEGHEM Pascal', 'VAN HOUTEGHEM', 'D8', 'Union Montilienne Sportive Badminton', 13),
(37, 'GAECHTER Frederic', 'GAECHTER', 'D9', 'Badminton Club Vaisonnais', 'SERVES Clément', 'SERVES', 'D7', 'Badminton Olympique De Pernes', 14),
(38, 'GARCIA Bernard', 'GARCIA', 'D8', '4ème Set Rognen', 'NGUYEN Truong-quan', 'NGUYEN', 'D8', 'Badminton Club De St Martin', 14),
(39, 'HARDI Dorian', 'HARDI', 'D8', 'Badminton Club Fos', 'NONY Stephane', 'NONY', 'P10', 'Istres Sports Badminton', 14),
(40, 'HUYNH VINH PHAT Philippe', 'HUYNH VINH PHAT', 'D8', 'Istres Sports Badminton', 'VIDALE Gregory', 'VIDALE', 'P10', 'Istres Sports Badminton', 14),
(41, 'JOUHAUD Guillaume', 'JOUHAUD', 'D8', 'Badminton Club De St Martin', 'RAMBIER Yoan', 'RAMBIER', 'D9', 'Badminton Club De St Martin', 14),
(42, 'LOCATELLI Stephane', 'LOCATELLI', 'D9', 'Badminton Club Fos', 'MANSUY Théo', 'MANSUY', 'D9', 'Badminton Club Fos', 14),
(43, 'AGOSTINO Killian', 'AGOSTINO', 'D9', 'Stade Marseillais Universite Club', 'LETAY-DROUET Robin', 'LETAY-DROUET', 'D9', 'Stade Marseillais Universite Club', 14),
(44, 'GHAOUI Hiacine', 'GHAOUI', 'D9', 'Badminton Club de Mallemort', 'SIONG Francois', 'SIONG', 'P10', 'Badminton Club de Mallemort', 14),
(45, 'LEVAN Clément', 'LEVAN', 'P10', 'Istres Sports Badminton', 'VALLAT Benjamin', 'VALLAT', 'D9', 'Istres Sports Badminton', 14),
(46, 'DECORPS Alexandre', 'DECORPS', 'P10', 'Istres Sports Badminton', 'HOOKOOMSING Dilan', 'HOOKOOMSING', 'D9', 'Saint Gely - Saint Clément Badminton', 14),
(47, 'FOURNEAU Olivier', 'FOURNEAU', 'P10', 'Istres Sports Badminton', 'FUZIER Stéphane', 'FUZIER', 'D9', 'Istres Sports Badminton', 14),
(48, 'DI SANTO Yoann', 'DI SANTO', 'D9', 'Partage de Passions', 'VITRY Alexis', 'VITRY', 'P10', 'Partage de Passions', 14),
(49, 'LEVY Lionel', 'LEVY', 'P10', 'Sports 13 Badminton', 'ROUBIN Anthony', 'ROUBIN', 'P10', 'Sports 13 Badminton', 15),
(50, 'OGET Aurélien', 'OGET', 'P10', 'Sports 13 Badminton', 'OUTREQUIN Clément', 'OUTREQUIN', 'P10', 'Sports 13 Badminton', 15),
(51, 'COYER Yann', 'COYER', 'P11', 'Istres Sports Badminton', 'GARCIA Salvador', 'GARCIA', 'P10', 'Badminton Club d\'Ensuès la Redonne', 15),
(52, 'GUILLEMAIN Quentin', 'GUILLEMAIN', 'P10', 'Istres Sports Badminton', 'ZORIO Bertrand', 'ZORIO', 'P11', 'Sports 13 Badminton', 15),
(53, 'CHAMARY Alexis', 'CHAMARY', 'P10', 'Badminton Olympique De Pernes', 'MOREL Yohan', 'MOREL', 'P12', 'Badminton Olympique De Pernes', 15),
(54, 'KHAMVILAY Stephane', 'KHAMVILAY', 'P10', 'Istres Sports Badminton', 'ROMAN Marcel', 'ROMAN', 'P11', 'Istres Sports Badminton', 15),
(55, 'DUFOUR Arnaud', 'DUFOUR', 'P11', 'Istres Sports Badminton', 'VANE Steven', 'VANE', 'P10', 'Istres Sports Badminton', 15),
(56, 'BRANDAZZI Thomas', 'BRANDAZZI', 'P11', 'Auriol Roquevaire Badminton', 'GORI Nicolas', 'GORI', 'P11', 'Auriol Roquevaire Badminton', 15),
(57, 'MEIGNAL Florent', 'MEIGNAL', 'NC', 'Istres Sports Badminton', 'VIEIRA Clément', 'VIEIRA', 'P11', 'Istres Sports Badminton', 15),
(58, 'AGUILAR Pierre yves', 'AGUILAR', 'P12', 'Sports 13 Badminton', 'JEANMOUGIN Christophe', 'JEANMOUGIN', 'P11', 'Sports 13 Badminton', 15),
(59, 'BRENOT Valentin', 'BRENOT', 'P11', 'Martigues Badminton Club', 'LE FOLL-AMIEL Morgan', 'LE FOLL-AMIEL', 'P11', 'Martigues Badminton Club', 15),
(60, 'GAZEAU Axel', 'GAZEAU', 'NC', 'Istres Sports Badminton', 'GAZEAU Jérôme', 'GAZEAU', 'NC', 'Istres Sports Badminton', 15),
(61, 'DEBECHE Farah', 'DEBECHE', 'N3', 'Vitrolles Badminton', 'MEDINA Karine', 'MEDINA', 'N2', 'Badminton Olympique De Pernes', 21),
(62, 'FARRELL Armance', 'FARRELL', 'N3', 'Aix Universite Club Badminton', 'LEVALLET Salomé', 'LEVALLET', 'N3', 'Aix Universite Club Badminton', 21),
(63, 'COLARD Marie', 'COLARD', 'N3', 'Aix Universite Club Badminton', 'VALLEE Amélie', 'VALLEE', 'N3', 'Olympique Badminton Club Nimes', 21),
(64, 'BROC Marianne', 'BROC', 'N3', 'Badminton Olympique De Pernes', 'RABEL Coline', 'RABEL', 'N3', 'Badminton Club de l\'Hermitage et du Tournonais', 21),
(65, 'BOUSSELLIER Julia', 'BOUSSELLIER', 'N3', 'Badminton Club Fos', 'HAY Clara', 'HAY', 'R5', 'Auriol Roquevaire Badminton', 21),
(66, 'BIFFI Caroline', 'BIFFI', 'R5', 'Badminton Club De Cannes', 'MOYROUD Manon', 'MOYROUD', 'N3', 'Aix Universite Club Badminton', 21),
(67, 'LAUNOY Claire', 'LAUNOY', 'R4', 'Association Bad In Lez', 'MULTEDO Alexia', 'MULTEDO', 'R4', 'Association Bad In Lez', 22),
(68, 'CHASTAGNER Cecile', 'CHASTAGNER', 'R5', 'Montpellier Badminton Club', 'HEBERT Morgane', 'HEBERT', 'R4', 'Olympique Badminton Club Nimes', 22),
(69, 'GRAVIER Océane', 'GRAVIER', 'R5', 'Stade Marseillais Universite Club', 'REY Alice', 'REY', 'R5', 'Aix Universite Club Badminton', 22),
(70, 'PEREGRINA Aurelie', 'PEREGRINA', 'R5', 'Aix Universite Club Badminton', 'REIN Julie', 'REIN', 'R5', 'Istres Sports Badminton', 22),
(71, 'BAQUE Cléa', 'BAQUE', 'R6', 'Club Sportif Pertuisien', 'PERO Amandine', 'PERO', 'R5', 'Stade Marseillais Universite Club', 22),
(72, 'OLIVIER Lison', 'OLIVIER', 'R6', 'Saint Gely - Saint Clément Badminton', 'WO Isabelle', 'WO', 'R5', 'Montpellier Badminton Club', 22),
(73, 'BRENO Anne', 'BRENO', 'R5', 'Sete Badminton Club', 'GIRAULT Sara', 'GIRAULT', 'R6', 'Aigues Vives Badminton', 23),
(74, 'KUHN Clara', 'KUHN', 'R6', 'U. S. Carrieres/seine', 'LOISY Krissie', 'LOISY', 'R5', 'Association Bad In Lez', 23),
(75, 'LARA-MARTIL Delphine', 'LARA-MARTIL', 'R6', 'Badminton Pignan', 'MADDENS Tiphaine', 'MADDENS', 'R6', 'Badminton Pignan', 23),
(76, 'DENOUEL Edwige', 'DENOUEL', 'R5', 'Nice Universite Club Badminton', 'DIDIERLAURENT Céline', 'DIDIERLAURENT', 'R6', 'Nice Universite Club Badminton', 23),
(77, 'ARGENTIERI Aureline', 'ARGENTIERI', 'R6', 'Badminton Club Brignolais', 'DOUISSARD Camille', 'DOUISSARD', 'R6', 'Kimbad Ollioules', 23),
(78, 'SARRAT Tiphaine', 'SARRAT', 'D7', 'La Ciotat Badminton', 'TEISSIER-DEDIEU Arielle', 'TEISSIER-DEDIEU', 'R6', 'Badminton Club Aubagnais', 23),
(79, 'FUCHEY Camille', 'FUCHEY', 'D7', 'Briancon Badminton Club', 'LE GUILLOUX-ARCIER Safia', 'LE GUILLOUX-ARCIER', 'R6', 'Briancon Badminton Club', 23),
(80, 'GIRONCE Camille', 'GIRONCE', 'R6', 'Association Bad In Lez', 'RICHEZ Lea', 'RICHEZ', 'D7', 'Saint Gely - Saint Clément Badminton', 23),
(81, 'DIAZ Lucie', 'DIAZ', 'R6', 'Badminton Club Lunellois', 'RAYMOND Elodie', 'RAYMOND', 'D7', 'Badminton Pignan', 23),
(82, 'ARNAUD Melody', 'ARNAUD', 'D7', 'Saint Gely - Saint Clément Badminton', 'ATTINA Aurore', 'ATTINA', 'D7', 'Saint Gely - Saint Clément Badminton', 23),
(83, 'MALLEA Sabine', 'MALLEA', 'D8', 'Bad à Morières', 'POLGE Magali', 'POLGE', 'D7', 'Apt Badminton Club', 23),
(84, 'FIZET Isabelle', 'FIZET', 'D7', 'Martigues Badminton Club', 'GASTALDI Thao', 'GASTALDI', 'D8', 'Martigues Badminton Club', 23),
(85, 'GROSSET Céline', 'GROSSET', 'D8', 'Badminton Club d\'Ensuès la Redonne', 'REOT Aurelie', 'REOT', 'D8', 'Badminton Club Vaisonnais', 24),
(86, 'GUEGUEN Morgane', 'GUEGUEN', 'D9', 'Istres Sports Badminton', 'MINEUR Amélie', 'MINEUR', 'D7', 'Istres Sports Badminton', 24),
(87, 'CASANOVA Elodie', 'CASANOVA', 'D8', 'Club Sportif Pertuisien', 'GOURMANI Sylvia', 'GOURMANI', 'D9', 'Union Sportive de Cagnes sur Mer - Badminton', 24),
(88, 'PRADEILLES Sandrine', 'PRADEILLES', 'D8', 'Badminton Club Remoulins', 'PRIVAT Pascale', 'PRIVAT', 'D9', 'Badminton Club Remoulins', 24),
(89, 'GAVET Elise', 'GAVET', 'D9', 'Istres Sports Badminton', 'XUE Qiong-hui', 'XUE', 'D8', 'Istres Sports Badminton', 24),
(90, 'CAUBISENS Clémentine', 'CAUBISENS', 'D9', 'Club Sports Loisirs Cult. Arles', 'NAVARRO Severine', 'NAVARRO', 'D9', 'Club Sports Loisirs Cult. Arles', 24),
(91, 'RIVIERE CLODIC Morgane', 'RIVIERE CLODIC', 'D9', 'Union Montilienne Sportive Badminton', 'TRONEL Sandrine', 'TRONEL', 'D9', 'Union Montilienne Sportive Badminton', 24),
(92, 'NGUYEN Charlotte', 'NGUYEN', 'D9', 'Martigues Badminton Club', 'TEILHARD Lucie', 'TEILHARD', 'D9', 'Martigues Badminton Club', 24),
(93, 'MASSON Nadège', 'MASSON', 'D9', 'Miramas Badminton Club', 'VERNAY Céline', 'VERNAY', 'D9', 'Miramas Badminton Club', 24),
(94, 'ALBERNHE Anaïs', 'ALBERNHE', 'D9', 'Badminton Olympique De Pernes', 'ALBIN Virginie', 'ALBIN', 'D9', 'Stade Laurentin Badminton', 24),
(95, 'RABUSSIER Mélanie', 'RABUSSIER', 'D9', 'Miramas Badminton Club', 'RODRIGUEZ Auriane', 'RODRIGUEZ', 'P10', 'Miramas Badminton Club', 24),
(96, 'BIARD Marie julia', 'BIARD', 'P10', 'Olympique Badminton Club Nimes', 'MESCLON Géraldine', 'MESCLON', 'P10', 'Olympique Badminton Club Nimes', 24),
(97, 'DOYLE Aurelia', 'DOYLE', 'P10', 'Asptt Marseille', 'LUCAS Catrherine', 'LUCAS', 'P11', 'Asptt Marseille', 25),
(98, 'GINESTIER Alexa', 'GINESTIER', 'P11', 'Martigues Badminton Club', 'RABBE Caroline', 'RABBE', 'P11', 'Martigues Badminton Club', 25),
(99, 'APPOURCHAUX Manon', 'APPOURCHAUX', 'P11', 'Vitrolles Badminton', 'DANGLA Maxine', 'DANGLA', 'P12', 'Vitrolles Badminton', 25),
(100, 'BLEIN Céline', 'BLEIN', 'NC', 'Istres Sports Badminton', 'MACKOWIAK Françoise', 'MACKOWIAK', 'NC', 'Istres Sports Badminton', 25),
(101, 'AROMATARIO Ilane', 'AROMATARIO', 'N2', 'Grenoble Alpes Badminton', 'GUEGUEN Maya', 'GUEGUEN', 'N2', 'Badminton Club Grenoble', 31),
(102, 'GEORGEL Pierre', 'GEORGEL', 'N2', 'Aix Universite Club Badminton', 'FARRELL Armance', 'FARRELL', 'N2', 'Aix Universite Club Badminton', 31),
(103, 'FABRE Gil', 'FABRE', 'N2', 'Aix Universite Club Badminton', 'COLARD Marie', 'COLARD', 'N3', 'Aix Universite Club Badminton', 31),
(104, 'LAURENT Adrien', 'LAURENT', 'N3', 'Badminton Club De Valence', 'BOUSSELLIER Julia', 'BOUSSELLIER', 'N2', 'Badminton Club Fos', 31),
(105, 'CHOLLET Antonin', 'CHOLLET', 'N3', 'Aix Universite Club Badminton', 'MOYROUD Manon', 'MOYROUD', 'N2', 'Aix Universite Club Badminton', 31),
(106, 'FRANCOISE Alexandre', 'FRANCOISE', 'N2', 'Aix Universite Club Badminton', 'FRANCOISE Elise', 'FRANCOISE', 'N3', 'Aix Universite Club Badminton', 31),
(107, 'CHANOUX Calvin', 'CHANOUX', 'R4', 'Aix Universite Club Badminton', 'VALLEE Amélie', 'VALLEE', 'N2', 'Olympique Badminton Club Nimes', 31),
(108, 'CONDOMINES Nathan', 'CONDOMINES', 'N3', 'Stade Marseillais Universite Club', 'STRADY Julie', 'STRADY', 'N3', 'Stade Marseillais Universite Club', 31),
(109, 'RODRIGUEZ Vincent', 'RODRIGUEZ', 'N2', 'Association Bad In Lez', 'LAUNOY Claire', 'LAUNOY', 'N3', 'Association Bad In Lez', 31),
(110, 'SICARD Gaëtan', 'SICARD', 'N3', 'Stade Marseillais Universite Club', 'BROC Marianne', 'BROC', 'N3', 'Badminton Olympique De Pernes', 31),
(111, 'VILLEDIEU Cedric', 'VILLEDIEU', 'R4', 'Istres Sports Badminton', 'MEDINA Karine', 'MEDINA', 'N2', 'Badminton Olympique De Pernes', 31),
(112, 'COQUARD Guylain', 'COQUARD', 'R4', 'Association Bad In Lez', 'KUHN Clara', 'KUHN', 'N3', 'U. S. Carrieres/seine', 31),
(113, 'GUILLERM Quentin', 'GUILLERM', 'N3', 'Badminton Pignan', 'GUILLERM Mylene', 'GUILLERM', 'N3', 'Badminton Pignan', 32),
(114, 'DEMARIA Thomas', 'DEMARIA', 'R4', 'Association Bad In Lez', 'MULTEDO Alexia', 'MULTEDO', 'N3', 'Association Bad In Lez', 32),
(115, 'PACALET Xavier', 'PACALET', 'N3', 'Badminton Club D\'Antibes', 'HAY Clara', 'HAY', 'R4', 'Auriol Roquevaire Badminton', 32),
(116, 'NAESSENS Thomas', 'NAESSENS', 'N3', 'Association Sportive des Alain Savary', 'LOISY Krissie', 'LOISY', 'R4', 'Association Bad In Lez', 32),
(117, 'FREQUELIN Sylvain', 'FREQUELIN', 'N3', 'Stade Marseillais Universite Club', 'GRAVIER Océane', 'GRAVIER', 'R4', 'Stade Marseillais Universite Club', 32),
(118, 'MARCHELIDON Mathis', 'MARCHELIDON', 'R4', 'Nice Universite Club Badminton', 'BIFFI Caroline', 'BIFFI', 'N3', 'Badminton Club De Cannes', 32),
(119, 'CHERAMY Baptiste', 'CHERAMY', 'R4', 'Montpellier Badminton Club', 'CHASTAGNER Cecile', 'CHASTAGNER', 'R4', 'Montpellier Badminton Club', 32),
(120, 'BOYER Manuel', 'BOYER', 'R4', 'Club Sports Loisirs Cult. Arles', 'FONTAINE Audrey', 'FONTAINE', 'R4', 'Club Sports Loisirs Cult. Arles', 32),
(121, 'TEYSSIER Bastien', 'TEYSSIER', 'R4', 'Saint Gely - Saint Clément Badminton', 'DIAZ Sophie', 'DIAZ', 'R4', 'Saint Gely - Saint Clément Badminton', 32),
(122, 'PASSANANTE Thibault', 'PASSANANTE', 'N3', 'Bad\'Hyères', 'AYCARD Chloe', 'AYCARD', 'R6', 'Bad\'Hyères', 32),
(123, 'JOURDON Thomas', 'JOURDON', 'R4', 'Ailes Sportives Airbus Helicopters - Badminton', 'VANNUNEN Floriane', 'VANNUNEN', 'R5', 'Ailes Sportives Airbus Helicopters - Badminton', 32),
(124, 'SOKIKIAN Tristan', 'SOKIKIAN', 'R4', 'Vitrolles Badminton', 'MATHIEU Cloe', 'MATHIEU', 'R5', 'Avignon Badminton Club', 32),
(125, 'BARTOLO Romain', 'BARTOLO', 'R5', 'Badminton Club D\'Antibes', 'WO Isabelle', 'WO', 'R4', 'Montpellier Badminton Club', 33),
(126, 'KUDRYASHOV Anton', 'KUDRYASHOV', 'R4', 'Nice Universite Club Badminton', 'ARGENTIERI Aureline', 'ARGENTIERI', 'R4', 'Badminton Club Brignolais', 33),
(127, 'DURNAIAN Lionel', 'DURNAIAN', 'R5', 'Stade Marseillais Universite Club', 'PERO Amandine', 'PERO', 'R4', 'Stade Marseillais Universite Club', 33),
(128, 'PERESSE Maxime', 'PERESSE', 'R5', 'Nice Universite Club Badminton', 'DENOUEL Edwige', 'DENOUEL', 'R5', 'Nice Universite Club Badminton', 33),
(129, 'MARCEL Yann', 'MARCEL', 'R5', 'Avignon Badminton Club', 'CHANALEILLE Sandra', 'CHANALEILLE', 'R6', 'Avignon Badminton Club', 33),
(130, 'LOPEZ Fabien', 'LOPEZ', 'R5', 'Badminton Pignan', 'BRENO Anne', 'BRENO', 'R5', 'Sete Badminton Club', 33),
(131, 'TESSIER Théo', 'TESSIER', 'R5', 'Juvibad', 'RAYMOND Elodie', 'RAYMOND', 'R5', 'Badminton Pignan', 33),
(132, 'LEBON Quentin', 'LEBON', 'R6', 'Istres Sports Badminton', 'REIN Julie', 'REIN', 'R4', 'Istres Sports Badminton', 33),
(133, 'JULIEN Kévin', 'JULIEN', 'R4', 'Club Badminton de Nice', 'SARRAT Tiphaine', 'SARRAT', 'R6', 'La Ciotat Badminton', 33),
(134, 'SOULIE Fabien', 'SOULIE', 'R4', 'Ailes Sportives Airbus Helicopters - Badminton', 'THOORIS Juliette', 'THOORIS', 'R6', 'Badminton Club Tretsois', 33),
(135, 'MASSA Lucas', 'MASSA', 'R6', 'Badminton Club de Mallemort', 'RODRIGUES Clélia', 'RODRIGUES', 'R6', 'Vitrolles Badminton', 33),
(136, 'FAUVEL Corentin', 'FAUVEL', 'D7', 'Stade Marseillais Universite Club', 'BOUKEDROUN Sabrina', 'BOUKEDROUN', 'R5', 'Stade Marseillais Universite Club', 33),
(137, 'MUNOZ Marvin', 'MUNOZ', 'R5', 'Aigues Vives Badminton', 'DIAZ Lucie', 'DIAZ', 'R6', 'Badminton Club Lunellois', 34),
(138, 'CARENSAC Paul', 'CARENSAC', 'R6', 'Bad A Flo', 'GUEDRI Rachida', 'GUEDRI', 'R6', 'Badminton Club Lunellois', 34),
(139, 'BENAZIEB Othmene', 'BENAZIEB', 'R6', 'Association Bad In Lez', 'GIRONCE Camille', 'GIRONCE', 'R6', 'Association Bad In Lez', 34),
(140, 'BOIRON Cyril', 'BOIRON', 'R5', 'Simiane Badminton Club', 'BOURELLY-SABOURAUD Elisa', 'BOURELLY-SABOURAUD', 'D7', 'Kimbad Ollioules', 34),
(141, 'JANDARD Noé', 'JANDARD', 'R6', 'Badminton Club Gapencais', 'ATTINA Aurore', 'ATTINA', 'R6', 'Saint Gely - Saint Clément Badminton', 34),
(142, 'GROSSETETE Pierre', 'GROSSETETE', 'R6', 'Ass. Sportive De Ventabren', 'FIZET Isabelle', 'FIZET', 'R6', 'Martigues Badminton Club', 34),
(143, 'DIEP Rémi', 'DIEP', 'R6', 'CLUB BADMINTON DE LATTES', 'VAILLANT Alexandra', 'VAILLANT', 'R6', 'Badminton Pignan', 34),
(144, 'LECART Clement', 'LECART', 'D7', 'Club Sports Loisirs Cult. Arles', 'LE GUILLOUX-ARCIER Safia', 'LE GUILLOUX-ARCIER', 'R6', 'Briancon Badminton Club', 34),
(145, 'PUGINIER Kellian', 'PUGINIER', 'D8', 'Saint Gely - Saint Clément Badminton', 'RICHEZ Lea', 'RICHEZ', 'R6', 'Saint Gely - Saint Clément Badminton', 34),
(146, 'BENAVENT Jordan', 'BENAVENT', 'R6', 'Badminton Club D\'Antibes', 'PERDERIZET Aurélie', 'PERDERIZET', 'R6', 'Badminton Club D\'Antibes', 34),
(147, 'BUI Didier', 'BUI', 'D7', 'Nice Universite Club Badminton', 'DOUISSARD Camille', 'DOUISSARD', 'R6', 'Kimbad Ollioules', 34),
(148, 'RIGAUT Tom', 'RIGAUT', 'D8', 'Istres Sports Badminton', 'XUE Qiong-hui', 'XUE', 'R6', 'Istres Sports Badminton', 34),
(149, 'RAPEBACH Tom', 'RAPEBACH', 'R6', 'Saint Gely - Saint Clément Badminton', 'VIBERT Chloé', 'VIBERT', 'D7', 'Montpellier Badminton Club', 35),
(150, 'DENYS Alexandre', 'DENYS', 'R6', 'Simiane Badminton Club', 'CASANOVA Elodie', 'CASANOVA', 'D8', 'Club Sportif Pertuisien', 35),
(151, 'FIORE Mathieu', 'FIORE', 'R6', 'CLUB BADMINTON COGOLINOIS', 'BOUNOUS Eva', 'BOUNOUS', 'D8', 'Bad\'Hyères', 35),
(152, 'FLOCHON Baptiste', 'FLOCHON', 'D7', 'Kimbad Ollioules', 'OGEE Manon', 'OGEE', 'D7', 'Badminton Club Brignolais', 35),
(153, 'TORRIS Laurent', 'TORRIS', 'D7', 'Ailes Sportives Airbus Helicopters - Badminton', 'LEITZELMAN Alexia', 'LEITZELMAN', 'D8', 'Ailes Sportives Airbus Helicopters - Badminton', 35),
(154, 'LAFOUCRIERE Guillaume', 'LAFOUCRIERE', 'D7', 'Bad à Morières', 'MALLEA Sabine', 'MALLEA', 'D7', 'Bad à Morières', 35),
(155, 'JULIEN Michael', 'JULIEN', 'D7', 'Istres Sports Badminton', 'PRADEILLES Sandrine', 'PRADEILLES', 'D7', 'Badminton Club Remoulins', 35),
(156, 'FORGUES Fabien', 'FORGUES', 'D7', 'Club Sportif Pertuisien', 'REOT Aurelie', 'REOT', 'D8', 'Badminton Club Vaisonnais', 35),
(157, 'HAY Bastien', 'HAY', 'D8', 'Briancon Badminton Club', 'FUCHEY Camille', 'FUCHEY', 'D7', 'Briancon Badminton Club', 35),
(158, 'HOOKOOMSING Dilan', 'HOOKOOMSING', 'D9', 'Saint Gely - Saint Clément Badminton', 'ARNAUD Melody', 'ARNAUD', 'D7', 'Saint Gely - Saint Clément Badminton', 35),
(159, 'ROUX Tristan', 'ROUX', 'D7', 'Montpellier Badminton Club', 'FRECHARD Mathilde', 'FRECHARD', 'D8', 'Badminton Club Lunellois', 35),
(160, 'PAGNI Olivier', 'PAGNI', 'D7', 'Martigues Badminton Club', 'GASTALDI Thao', 'GASTALDI', 'D8', 'Martigues Badminton Club', 35),
(161, 'VIDALE Gregory', 'VIDALE', 'D8', 'Istres Sports Badminton', 'GAVET Elise', 'GAVET', 'D7', 'Istres Sports Badminton', 36),
(162, 'MARTINEZ Thomas', 'MARTINEZ', 'D8', 'Olympique Badminton Club Nimes', 'GRUNENBERGER Audrey', 'GRUNENBERGER', 'D8', 'Badminton Club Aramonais', 36),
(163, 'TERRASSON Julien', 'TERRASSON', 'D8', 'Union Montilienne Sportive Badminton', 'TRONEL Sandrine', 'TRONEL', 'D8', 'Union Montilienne Sportive Badminton', 36),
(164, 'GHAOUI Hiacine', 'GHAOUI', 'D8', 'Badminton Club de Mallemort', 'ARTEL Valérie', 'ARTEL', 'D8', 'La Ciotat Badminton', 36),
(165, 'DUCRET Antoine', 'DUCRET', 'P10', 'Club De Prevessin Badmin Gessien', 'GUEGUEN Morgane', 'GUEGUEN', 'D7', 'Istres Sports Badminton', 36),
(166, 'SERVES Clément', 'SERVES', 'D8', 'Badminton Olympique De Pernes', 'MAURIERES Melanie', 'MAURIERES', 'D8', 'Badminton Olympique De Pernes', 36),
(167, 'HOYER Maxime', 'HOYER', 'D9', 'Stade Marseillais Universite Club', 'MINEUR Amélie', 'MINEUR', 'D8', 'Istres Sports Badminton', 36),
(168, 'REMAUD Evan', 'REMAUD', 'D8', 'Badminton Club de Mallemort', 'RECHOU Emilie', 'RECHOU', 'D8', 'Badminton Club de Mallemort', 36),
(169, 'ZOPPIS Baptiste', 'ZOPPIS', 'D9', 'Istres Sports Badminton', 'MARTIN Anais', 'MARTIN', 'D8', 'Istres Sports Badminton', 36),
(170, 'CLEMENT Arnaud', 'CLEMENT', 'D8', 'Badminton Club Sisteronais', 'LESBROS Billytiss', 'LESBROS', 'D8', 'Badminton Club Sisteronais', 36),
(171, 'LION Maxime', 'LION', 'D8', 'Apt Badminton Club', 'PONGY Marie elodie', 'PONGY', 'D9', 'Apt Badminton Club', 36),
(172, 'DJIRE Jean-baptiste', 'DJIRE', 'D9', 'Stade Marseillais Universite Club', 'MOREL Fabienne', 'MOREL', 'D8', 'Stade Marseillais Universite Club', 36),
(185, 'VAN HOUTEGHEM Pascal', 'VAN HOUTEGHEM', 'D9', 'Union Montilienne Sportive Badminton', 'RIVIERE CLODIC Morgane', 'RIVIERE CLODIC', 'D9', 'Union Montilienne Sportive Badminton', 37),
(186, 'SAGNIEZ Camille', 'SAGNIEZ', 'D9', 'Badminton Alpilles Montagnette', 'DOYLE Aurelia', 'DOYLE', 'D9', 'Asptt Marseille', 37),
(187, 'JOUANNE Arnaud', 'JOUANNE', 'D9', 'Martigues Badminton Club', 'RABBE Caroline', 'RABBE', 'D9', 'Martigues Badminton Club', 37),
(188, 'NONY Stephane', 'NONY', 'P10', 'Istres Sports Badminton', 'ALBIN Virginie', 'ALBIN', 'D9', 'Stade Laurentin Badminton', 37),
(189, 'CARUSO Corentin', 'CARUSO', 'P10', 'Martigues Badminton Club', 'GINESTIER Alexa', 'GINESTIER', 'D9', 'Martigues Badminton Club', 37),
(190, 'ALEGRIA Matthias', 'ALEGRIA', 'P10', 'Martigues Badminton Club', 'PROTCHE Lavande', 'PROTCHE', 'D9', 'Martigues Badminton Club', 37),
(191, 'LARTILLIER Alexandre', 'LARTILLIER', 'D9', 'Ailes Sportives Airbus Helicopters - Badminton', 'TRAN Emilie', 'TRAN', 'D9', 'Ailes Sportives Airbus Helicopters - Badminton', 37),
(192, 'MAYAN Marc', 'MAYAN', 'D9', 'Club Islois De Badminton', 'OSTIS Blandine', 'OSTIS', 'P10', 'Club Islois De Badminton', 37),
(193, 'OGET Aurélien', 'OGET', 'P10', 'Sports 13 Badminton', 'MEZIERE Claire', 'MEZIERE', 'P10', 'Sports 13 Badminton', 37),
(194, 'BOUYER Brice', 'BOUYER', 'D9', 'Badminton Club Sisteronais', 'MACHEMIN Ninon', 'MACHEMIN', 'P11', 'Partage de Passions', 37),
(195, 'RODRIGUES-VILA Victor', 'RODRIGUES-VILA', 'P11', 'Istres Sports Badminton', 'BRENOT Corinne', 'BRENOT', 'D9', 'Istres Sports Badminton', 37),
(196, 'GUILLOU Noah', 'GUILLOU', 'P11', 'Badminton Club Aubagnais', 'NOVAT Raphaëlle', 'NOVAT', 'P11', 'Badminton Club Aubagnais', 37);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cpi_player`
--
ALTER TABLE `cpi_player`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cpi_player`
--
ALTER TABLE `cpi_player`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=197;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
