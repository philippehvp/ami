-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : lun. 10 avr. 2023 à 23:11
-- Version du serveur : 8.0.30
-- Version de PHP : 8.0.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de données : `cpi`
--

DELIMITER $$
--
-- Procédures
--
CREATE DEFINER=`root`@`%` PROCEDURE `sp_calculate_point_ranking` ()  DETERMINISTIC BEGIN
    DECLARE     l_admin INT;
    DECLARE     l_day INT;

    /* Recherche du pronostiqueur administrateur */
    SELECT              better.id
    INTO                l_admin
    FROM                better
    WHERE               better.isAdmin = 1
    LIMIT               1;

    /* Recherche du jour de compétition */
    SELECT DISTINCT     contest.day
    INTO                l_day
    FROM                contest
    WHERE               contest.startDate <= NOW()
                        AND     NOW() <= contest.endAdminDate;

    /* Calcul des points par série et par pronostiqueur pour les résultats finaux connus */
    UPDATE      point
    JOIN        (
                    /* Recherche de toutes les séries dont les résultats ont été saisis par l'administrateur */
                    SELECT      bet.winner_player_id, bet.runnerUp_player_id, bet.category_id
                    FROM        bet
                    JOIN        category
                                ON      bet.category_id = category.id
                    JOIN        contest
                                ON      category.contest_id = contest.id
                    WHERE       contest.startDate <= NOW()
                                AND     NOW() <= contest.endAdminDate
                                AND     bet.better_id = l_admin
                                AND     bet.winner_player_id <> 0
                                AND     bet.runnerUp_player_id <> 0

                ) truth
                ON      point.category_id = truth.category_id
    JOIN        bet
                ON      point.category_id = bet.category_id
    SET         point.points = fn_calculate_points(
                    truth.winner_player_id, truth.runnerUp_player_id,
                    bet.winner_player_id, bet.runnerUp_player_id
                )
    WHERE       point.better_id <> l_admin
                AND     bet.better_id <> l_admin;

    /* Calcul de la somme des points par pronostiqueur pour un jour de concours donné */
    UPDATE      ranking
    JOIN        (
                    SELECT      point.better_id, contest.day, SUM(point.points) AS points
                    FROM        point
                    JOIN        category
                                ON      point.category_id = category.id
                    JOIN        contest
                                ON      category.contest_id = contest.id
                    WHERE       contest.startDate <= NOW()
                                AND     NOW() <= contest.endAdminDate
                                AND     point.better_id <> l_admin
                    GROUP BY    point.better_id, contest.day
                ) point
                ON      ranking.better_id = point.better_id
                        AND     ranking.contest_day = point.day
    SET         ranking.points = point.points;

    /* Pour établir le classement, on compte pour chaque total de points le nombre de pronostiqueurs */
    /* ayant ce total de points */
    TRUNCATE TABLE working_point;

    INSERT INTO 	working_point(points, numberOf)
    SELECT		    ranking.points, COUNT(*) AS numberOf
    FROM		    ranking
    JOIN            (
                        SELECT DISTINCT     contest.day
                        FROM                contest
                        WHERE               contest.startDate <= NOW()
                                            AND     NOW() <= contest.endAdminDate
                    ) contest
                    ON      ranking.contest_day = contest.day
    WHERE           ranking.better_id <> l_admin
    GROUP BY	    ranking.points, contest.day;

    /* Ensuite, on met à jour le classement des pronostiqueurs en regardant le nombre de personnes */
    /* ayant un total de points, total par total */
    UPDATE		ranking
    JOIN		(
                    SELECT		COUNT(r1.better_id) AS ranking, r1.contest_day, r1.better_id
                    FROM		ranking AS r1
                    JOIN		ranking AS r2
                                ON		r1.points <= r2.points
                                        AND		r1.contest_day = r2.contest_day
                    WHERE		r1.contest_day = l_day
                    GROUP BY	r1.better_id, r1.contest_day
                ) calculated_ranking
                ON		ranking.better_id = calculated_ranking.better_id
                        AND		ranking.contest_day = calculated_ranking.contest_day
    JOIN		working_point
                ON		ranking.points = working_point.points
    SET			ranking.ranking = calculated_ranking.ranking - working_point.numberOf + 1;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `sp_delete_better` (IN `p_better` INT)  DETERMINISTIC BEGIN
    DELETE
    FROM        duration
    WHERE       duration.better_id = p_better;

    DELETE
    FROM        betting
    WHERE       betting.better_id = p_better;

    DELETE
    FROM        bet
    WHERE       bet.better_id = p_better;

    DELETE
    FROM        better
    WHERE       better.id = p_better;

    DELETE
    FROM        point
    WHERE       point.better_id = p_better;

    DELETE
    FROM        ranking
    WHERE       ranking.better_id = p_better;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `sp_unset_bets` (IN `p_better` INT)  DETERMINISTIC UPDATE      bet
SET         bet.winner_player_id = NULL, bet.runnerUp_player_id = NULL
WHERE       bet.better_id = p_better$$

--
-- Fonctions
--
CREATE DEFINER=`root`@`%` FUNCTION `fn_calculate_points` (`p_truth_winner` INT, `p_truth_runnerUp` INT, `p_bet_winner` INT, `p_bet_runnerUp` INT) RETURNS INT DETERMINISTIC READS SQL DATA BEGIN

    DECLARE     l_points INT;

    SET         l_points =
                    CASE
                        WHEN p_truth_winner = p_bet_winner AND p_truth_runnerUp = p_bet_runnerUp THEN 20
                        WHEN p_truth_winner = p_bet_winner AND p_truth_runnerUp <> p_bet_runnerUp THEN 12
                        WHEN p_truth_winner = p_bet_runnerUp AND p_truth_runnerUp = p_bet_winner THEN 10
                        WHEN p_truth_winner <> p_bet_winner AND p_truth_runnerUp = p_bet_runnerUp THEN 7
                        WHEN p_truth_winner = p_bet_runnerUp OR p_truth_runnerUp = p_bet_winner THEN 5
                        ELSE 0
                    END;

    RETURN l_points;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `bet`
--

CREATE TABLE `bet` (
  `better_id` int NOT NULL,
  `category_id` int NOT NULL,
  `winner_player_id` int DEFAULT NULL,
  `runnerUp_player_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `bet`
--

INSERT INTO `bet` (`better_id`, `category_id`, `winner_player_id`, `runnerUp_player_id`) VALUES
(19, 11, 1, 3),
(19, 12, 9, 6),
(19, 13, 15, 10),
(19, 14, 22, 26),
(19, 15, NULL, NULL),
(19, 21, NULL, NULL),
(19, 22, NULL, NULL),
(19, 23, NULL, NULL),
(19, 24, NULL, NULL),
(19, 31, NULL, NULL),
(19, 32, NULL, NULL),
(19, 33, NULL, NULL),
(22, 11, 1, 3),
(22, 12, 6, 8),
(22, 13, 10, 13),
(22, 14, 28, 24),
(22, 15, 47, 49),
(22, 21, 57, 60),
(22, 22, 65, 69),
(22, 23, 76, 71),
(22, 24, 80, 83),
(22, 31, NULL, NULL),
(22, 32, NULL, NULL),
(22, 33, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `better`
--

CREATE TABLE `better` (
  `id` int NOT NULL,
  `account` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `isAdmin` smallint NOT NULL,
  `accessKey` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `endAccessKeyValidityDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `better`
--

INSERT INTO `better` (`id`, `account`, `password`, `name`, `firstName`, `contact`, `isAdmin`, `accessKey`, `endAccessKeyValidityDate`) VALUES
(19, 'admin', 'admin', 'Admin', 'Admin', 'Admin', 1, '$2y$10$RIbIakE8LGuArfIXUwFLbuIN6UJsbTkyev7RYq8orN1VGrs7tI462', '2023-04-11 01:24:32'),
(22, 'p', 'p', 'HVP', 'Philippe', 'Moi', 0, '$2y$10$jF09ah4w0vlVBmFhkhxbH.Kk026P0jUzQzEgANEaRy3b/MA9x8ILK', '2023-04-10 23:16:57');

-- --------------------------------------------------------

--
-- Structure de la table `betting`
--

CREATE TABLE `betting` (
  `better_id` int NOT NULL,
  `contest_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `betting`
--

INSERT INTO `betting` (`better_id`, `contest_id`) VALUES
(19, 1),
(19, 2),
(19, 3),
(22, 1),
(22, 2),
(22, 3);

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id` int NOT NULL,
  `shortName` varchar(2) NOT NULL,
  `longName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contest_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `shortName`, `longName`, `contest_id`) VALUES
(11, 'S1', 'Série 1', 1),
(12, 'S2', 'Série 2', 1),
(13, 'S3', 'Série 3', 1),
(14, 'S4', 'Série 4', 1),
(15, 'S5', 'Série 5', 1),
(21, 'S1', 'Série 1', 2),
(22, 'S2', 'Série 2', 2),
(23, 'S3', 'Série 3', 2),
(24, 'S4', 'Série 4', 2),
(31, 'S1', 'Série 1', 3),
(32, 'S2', 'Série 2', 3),
(33, 'S3', 'Série 3', 3);

-- --------------------------------------------------------

--
-- Structure de la table `contest`
--

CREATE TABLE `contest` (
  `id` int NOT NULL,
  `shortName` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `longName` varchar(32) NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `endBetDate` datetime DEFAULT NULL,
  `endAdminDate` datetime DEFAULT NULL,
  `day` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `contest`
--

INSERT INTO `contest` (`id`, `shortName`, `longName`, `startDate`, `endBetDate`, `endAdminDate`, `day`) VALUES
(1, 'DH', 'Doubles Hommes', '2023-04-11 00:00:00', '2023-04-11 20:00:00', '2023-04-12 00:00:00', 1),
(2, 'DD', 'Doubles Dames', '2023-04-11 00:00:00', '2023-04-11 20:00:00', '2023-04-12 00:00:00', 1),
(3, 'DM', 'Doubles Mixtes', '2023-04-11 07:00:00', '2023-04-11 13:00:00', '2023-04-12 00:00:00', 2);

-- --------------------------------------------------------

--
-- Structure de la table `duration`
--

CREATE TABLE `duration` (
  `better_id` int NOT NULL,
  `contest_day` tinyint NOT NULL,
  `duration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `duration`
--

INSERT INTO `duration` (`better_id`, `contest_day`, `duration`) VALUES
(19, 1, 48),
(19, 2, 30),
(22, 1, 60),
(22, 2, 30);

-- --------------------------------------------------------

--
-- Structure de la table `player`
--

CREATE TABLE `player` (
  `id` int NOT NULL,
  `playerName1` varchar(100) NOT NULL,
  `playerRanking1` varchar(3) NOT NULL,
  `playerName2` varchar(100) NOT NULL,
  `playerRanking2` varchar(3) NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `player`
--

INSERT INTO `player` (`id`, `playerName1`, `playerRanking1`, `playerName2`, `playerRanking2`, `category_id`) VALUES
(1, 'GASSION Pierre', 'N3', 'VAUR Théo', 'N2', 11),
(2, 'ANGLARET Axel', 'N3', 'VILLEGER Guillaume', 'N2', 11),
(3, 'LEBON Quentin', 'N3', 'VILLEDIEU Cedric', 'N3', 11),
(4, 'FUCHS Alexandre', 'N3', 'SAVIGNY Anthony', 'N3', 11),
(5, 'CHOLLET Antonin', 'R4', 'GALLET Quentin', 'N3', 11),
(6, 'SOKIKIAN Tristan', 'N3', 'TASSY Jerome', 'R5', 12),
(7, 'D\'ANGELO Antony', 'R5', 'PLATEL Romain', 'N3', 12),
(8, 'CHAPPE Flavien', 'R4', 'JOURDON Thomas', 'R4', 12),
(9, 'COQUARD Guylain', 'R4', 'MOLINA Ludovic', 'R4', 12),
(10, 'BONAVENTURA Didier', 'R5', 'SOULIE Fabien', 'R5', 13),
(11, 'FIELOUX Sebastien', 'R5', 'MARCEL Yann', 'R5', 13),
(12, 'JOURDON Luc', 'R5', 'TASHJIAN Florian', 'R5', 13),
(13, 'GUICHARD Sylvain', 'R5', 'LEBLET Jimmy', 'R6', 13),
(14, 'AUDIBERT Jonathan', 'R5', 'LEVAN Jean-pierre', 'R6', 13),
(15, 'PUGINIER Kellian', 'D7', 'TAMINH Nicolas', 'R5', 13),
(16, 'FLECHON Killian', 'R6', 'ROBIN Thibault', 'R6', 13),
(17, 'LLORCA Sylvain', 'R6', 'PEPINO Jean-yves', 'R6', 13),
(18, 'LE Thierry', 'R6', 'SARROBERT Clément', 'R6', 13),
(19, 'BENEVENTI Christophe', 'R6', 'TISET Sylvain', 'R6', 13),
(20, 'CASTANER Ulysse', 'D8', 'SNACEL Benjamin', 'R6', 13),
(21, 'JULIEN Michael', 'D8', 'LE DREVO Alexandre', 'R6', 13),
(22, 'BOSSETI Maxime', 'D7', 'SAMMITO Anael', 'D7', 14),
(23, 'CATTAZZO Quentin', 'D7', 'NOWICKI David', 'D7', 14),
(24, 'PORQUET Terry', 'D7', 'RAMDANI Yassine', 'D7', 14),
(25, 'HOYER Maxime', 'D7', 'ZOPPIS Baptiste', 'D8', 14),
(26, 'DELCORSO Jean francois', 'D7', 'MORATH Harald', 'D8', 14),
(27, 'DEBECHE Naoufel', 'D7', 'FONDU Gerard', 'D8', 14),
(28, 'KEEBLE Hervé', 'D7', 'NGUYEN Truong-quan', 'D8', 14),
(29, 'BUI Didier', 'D9', 'KUDRYASHOV Anton', 'D7', 14),
(30, 'LORBER Angelo', 'D8', 'SERVES Clément', 'D9', 14),
(31, 'ALLE Marc', 'D8', 'LUCAS Christophe', 'D8', 14),
(32, 'DANEY Loic', 'D8', 'LHUILLIER Brice', 'D9', 14),
(33, 'JARD Bastien', 'D8', 'ZOPPIS Alexandre', 'D9', 14),
(34, 'GANANCIA-MARTIN Victor', 'D8', 'LAURENT Aurélien', 'D8', 14),
(35, 'GAUTHIER Gilles', 'D9', 'JOUHAUD Guillaume', 'D8', 14),
(36, 'GUILLON Xavier', 'D9', 'MAYAN Marc', 'D8', 14),
(37, 'AJONC Michael', 'D8', 'LERAT David', 'D9', 14),
(38, 'LEBOEUF Benoît', 'D9', 'LONGET Gregory', 'D9', 14),
(39, 'POZZO Peter', 'D9', 'RUIZ Aurélien', 'D9', 14),
(40, 'BAQUE Rémi', 'D9', 'MERVILLE Patrick', 'D9', 15),
(41, 'D\'ANGELO Olivier', 'D9', 'DECORPS Alexandre', 'D9', 15),
(42, 'ARIZA Nathan', 'D9', 'DELEVALLET Alexandre', 'D9', 15),
(43, 'PIZZORNO Mathieu', 'D9', 'VERBRUGGHE Quentin', 'D9', 15),
(44, 'FARINA Jaufret', 'D9', 'THEODON Alexandre', 'D9', 15),
(45, 'BONIFACE Tibalt', 'D9', 'MALGRAS Sylvain', 'P10', 15),
(46, 'FILLION Toussaint', 'D9', 'GARCIN Frédéric', 'D9', 15),
(47, 'HUYNH VINH PHAT Philippe', 'D9', 'VIDALE Gregory', 'P10', 15),
(48, 'PUEYO Alexandre', 'P11', 'VALLAT Benjamin', 'D9', 15),
(49, 'COYER Yann', 'P10', 'GARCIA Salvador', 'P10', 15),
(50, 'FOURNEAU Olivier', 'P10', 'HOOKOOMSING Dilan', 'P10', 15),
(51, 'POITEVINEAU Francis', 'P10', 'UNIZYCKI Mathias', 'P10', 15),
(52, 'BOYE Baptiste', 'P10', 'GOUZOU Matthieu', 'P10', 15),
(53, 'BRET Romain', 'P10', 'GUILLEMAIN Quentin', 'P10', 15),
(54, 'AUCANTE Martin', 'P10', 'SIMON Vladimir', 'P12', 15),
(55, 'FENOUIL Thomas', 'P11', 'NONY Stephane', 'P10', 15),
(56, 'DUFOUR Arnaud', 'P11', 'VANE Steven', 'P11', 15),
(57, 'MEDINA Karine', 'N2', 'VALLEE Amélie', 'N3', 21),
(58, 'DUCREY Alexandra', 'N3', 'LEVALLET Salomé', 'N2', 21),
(59, 'MALAUSSE Laurene', 'N2', 'ROUXEL Anastasia', 'N3', 21),
(60, 'BROC Marianne', 'N3', 'ZIDHANE Shirine', 'N3', 21),
(61, 'BOUSSELLIER Julia', 'N3', 'FARRELL Armance', 'R4', 21),
(62, 'LAUNOY Claire', 'R4', 'MULTEDO Alexia', 'R4', 22),
(63, 'DEBECHE Anissa', 'R5', 'DEBECHE Farah', 'R4', 22),
(64, 'SEGUIN Florine', 'R5', 'ZANARDO Céline', 'R5', 22),
(65, 'BANAS Samantha', 'R5', 'ROCHE Pauline', 'R5', 22),
(66, 'AHUIR Perrine', 'R5', 'STRADY Julie', 'R5', 22),
(67, 'HERNANDEZ Tania', 'R5', 'ROSSIGNOL Christel', 'R6', 22),
(68, 'LEVAN Agnès', 'R5', 'THOMAE Cathy', 'R6', 22),
(69, 'DELLA VALLE Chloé', 'R5', 'NOE Garance', 'D7', 22),
(70, 'ESCALLE Aurélie', 'R6', 'KIENTZI Mylene', 'D7', 23),
(71, 'MERCOURT May-lise', 'R6', 'ROCCI Carla', 'D7', 23),
(72, 'DINET Caroline', 'R6', 'SEGALEN Emy', 'D7', 23),
(73, 'AYCARD Chloe', 'D7', 'SIRE Marine', 'D7', 23),
(74, 'BLEANDONU Alexia', 'D7', 'PASTOR Celine', 'D7', 23),
(75, 'MINEUR Amélie', 'D8', 'XUE Qiong-hui', 'D8', 23),
(76, 'CHARRAS Océane', 'D8', 'PORTIER Lucie', 'D9', 23),
(77, 'BERTELLO Anais', 'D9', 'DOUISSARD Camille', 'D8', 23),
(78, 'SAUTRON Olivia', 'D8', 'TEISSIER-DEDIEU Arielle', 'D8', 24),
(79, 'ARNAUD Melody', 'D8', 'GALMICHE Lucie', 'D9', 24),
(80, 'BARBE Zélia', 'P10', 'COLONNA Alexandra', 'D9', 24),
(81, 'GROSSET Céline', 'D9', 'ROUX Frederique', 'D9', 24),
(82, 'DOS SANTOS Laura', 'D9', 'GIVERSO Floriane', 'P10', 24),
(83, 'ARGENTIERI Aureline', 'D9', 'BOTHEREAU Annaelle', 'D9', 24),
(84, 'GIRAUDOT Emmanuelle', 'D9', 'WYATT Christelle', 'D9', 24),
(85, 'CHANALEILLE Sandra', 'P10', 'DEGUIGNE Claire', 'D9', 24),
(86, 'BENHAIM Jade', 'D9', 'CAUBISENS Clémentine', 'P10', 24),
(87, 'BRESSON Adélaïde', 'D9', 'BRESSON Anaïs', 'P10', 24),
(88, 'BUFFET Céline', 'P10', 'SARRADET Florence', 'P10', 24),
(89, 'PRADEILLES Sandrine', 'P10', 'PRIVAT Pascale', 'P10', 24),
(90, 'BAILLY Marie', 'P10', 'BRENOT Corinne', 'P11', 24);

-- --------------------------------------------------------

--
-- Structure de la table `point`
--

CREATE TABLE `point` (
  `better_id` int NOT NULL,
  `category_id` int NOT NULL,
  `points` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `point`
--

INSERT INTO `point` (`better_id`, `category_id`, `points`) VALUES
(19, 11, 0),
(19, 12, 0),
(19, 13, 0),
(19, 14, 0),
(19, 15, 0),
(19, 21, 0),
(19, 22, 0),
(19, 23, 0),
(19, 24, 0),
(19, 31, 0),
(19, 32, 0),
(19, 33, 0),
(22, 11, 20),
(22, 12, 5),
(22, 13, 5),
(22, 14, 0),
(22, 15, 0),
(22, 21, 0),
(22, 22, 0),
(22, 23, 0),
(22, 24, 0),
(22, 31, 0),
(22, 32, 0),
(22, 33, 0);

-- --------------------------------------------------------

--
-- Structure de la table `ranking`
--

CREATE TABLE `ranking` (
  `better_id` int NOT NULL,
  `contest_day` int NOT NULL,
  `points` int NOT NULL,
  `ranking` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `ranking`
--

INSERT INTO `ranking` (`better_id`, `contest_day`, `points`, `ranking`) VALUES
(22, 1, 30, 1),
(22, 2, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `working_point`
--

CREATE TABLE `working_point` (
  `points` int NOT NULL,
  `numberOf` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `working_point`
--

INSERT INTO `working_point` (`points`, `numberOf`) VALUES
(30, 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bet`
--
ALTER TABLE `bet`
  ADD PRIMARY KEY (`better_id`,`category_id`);

--
-- Index pour la table `better`
--
ALTER TABLE `better`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `betting`
--
ALTER TABLE `betting`
  ADD PRIMARY KEY (`better_id`,`contest_id`);

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `contest`
--
ALTER TABLE `contest`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `duration`
--
ALTER TABLE `duration`
  ADD PRIMARY KEY (`better_id`,`contest_day`);

--
-- Index pour la table `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `point`
--
ALTER TABLE `point`
  ADD PRIMARY KEY (`better_id`,`category_id`);

--
-- Index pour la table `ranking`
--
ALTER TABLE `ranking`
  ADD PRIMARY KEY (`better_id`,`contest_day`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `better`
--
ALTER TABLE `better`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `player`
--
ALTER TABLE `player`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;
COMMIT;