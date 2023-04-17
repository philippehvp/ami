-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : lun. 17 avr. 2023 à 21:44
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
CREATE PROCEDURE `sp_calculate_point_ranking` ()  DETERMINISTIC NO SQL BEGIN
    /* sp_calculate_point_ranking */

    DECLARE     l_admin INT;
    DECLARE     l_day INT;

    /* Recherche du pronostiqueur administrateur */
    SELECT              cpi_better.id
    INTO                l_admin
    FROM                cpi_better
    WHERE               cpi_better.isAdmin = 1
    LIMIT               1;

    /* Recherche du jour de compétition */
    SELECT DISTINCT     cpi_contest.day
    INTO                l_day
    FROM                cpi_contest
    WHERE               cpi_contest.startDate <= NOW()
                        AND     NOW() <= cpi_contest.endAdminDate
    LIMIT 1;

    /* Calcul des points par série et par pronostiqueur pour les résultats finaux connus */
    UPDATE      cpi_point
    JOIN        (
                    /* Recherche de toutes les séries dont les résultats ont été saisis par l'administrateur */
                    SELECT      cpi_bet.winner_player_id, cpi_bet.runnerUp_player_id, cpi_bet.category_id
                    FROM        cpi_bet
                    JOIN        cpi_category
                                ON      cpi_bet.category_id = cpi_category.id
                    JOIN        cpi_contest
                                ON      cpi_category.contest_id = cpi_contest.id
                    WHERE       cpi_contest.startDate <= NOW()
                                AND     NOW() <= cpi_contest.endAdminDate
                                AND     cpi_bet.better_id = l_admin
                                AND     cpi_bet.winner_player_id <> 0
                                AND     cpi_bet.runnerUp_player_id <> 0

                ) cpi_truth
                ON      cpi_point.category_id = cpi_truth.category_id
    JOIN        cpi_bet
                ON      cpi_point.category_id = cpi_bet.category_id
    SET         cpi_point.points = fn_calculate_points(
                    cpi_truth.winner_player_id, cpi_truth.runnerUp_player_id,
                    cpi_bet.winner_player_id, cpi_bet.runnerUp_player_id
                )
    WHERE       cpi_point.better_id <> l_admin
                AND     cpi_bet.better_id <> l_admin;

    /* Calcul de la somme des points par pronostiqueur pour un jour de concours donné */
    UPDATE      cpi_ranking
    JOIN        (
                    SELECT      cpi_point.better_id, cpi_contest.day, SUM(cpi_point.points) AS points
                    FROM        cpi_point
                    JOIN        cpi_category
                                ON      cpi_point.category_id = cpi_category.id
                    JOIN        cpi_contest
                                ON      cpi_category.contest_id = cpi_contest.id
                    WHERE       cpi_contest.startDate <= NOW()
                                AND     NOW() <= cpi_contest.endAdminDate
                                AND     cpi_point.better_id <> l_admin
                    GROUP BY    cpi_point.better_id, cpi_contest.day
                ) cpi_point
                ON      cpi_ranking.better_id = cpi_point.better_id
                        AND     cpi_ranking.contest_day = cpi_point.day
    SET         cpi_ranking.points = cpi_point.points;

    /* Pour établir le classement, on compte pour chaque total de points le nombre de pronostiqueurs */
    /* ayant ce total de points */
    TRUNCATE TABLE  cpi_working_point;

    INSERT INTO 	cpi_working_point(cpi_working_point.points, cpi_working_point.numberOf)
    SELECT		    cpi_ranking.points, COUNT(*) AS numberOf
    FROM		    cpi_ranking
    JOIN            (
                        SELECT DISTINCT     cpi_contest.day
                        FROM                cpi_contest
                        WHERE               cpi_contest.startDate <= NOW()
                                            AND     NOW() <= cpi_contest.endAdminDate
                    ) cpi_contest
                    ON      cpi_ranking.contest_day = cpi_contest.day
    WHERE           cpi_ranking.better_id <> l_admin
    GROUP BY	    cpi_ranking.points, cpi_contest.day;

    /* Ensuite, on met à jour le classement des pronostiqueurs en regardant le nombre de personnes */
    /* ayant un total de points, total par total */
    UPDATE		cpi_ranking
    JOIN		(
                    SELECT		COUNT(r1.better_id) AS ranking, r1.contest_day, r1.better_id
                    FROM		cpi_ranking AS r1
                    JOIN		cpi_ranking AS r2
                                ON		r1.points <= r2.points
                                        AND		r1.contest_day = r2.contest_day
                    WHERE		r1.contest_day = l_day
                    GROUP BY	r1.better_id, r1.contest_day
                ) cpi_calculated_ranking
                ON		cpi_ranking.better_id = cpi_calculated_ranking.better_id
                        AND		cpi_ranking.contest_day = cpi_calculated_ranking.contest_day
    JOIN		cpi_working_point
                ON		cpi_ranking.points = cpi_working_point.points
    SET			cpi_ranking.ranking = cpi_calculated_ranking.ranking - cpi_working_point.numberOf + 1;
END$$

CREATE PROCEDURE `sp_create_missing_bets` (IN `p_better` INT)  DETERMINISTIC BEGIN
    /* sp_create_missing_bets */

    /* Table de participation aux pronostics */
    INSERT INTO         cpi_betting(better_id, contest_id)
    SELECT              p_better AS better_id, cpi_contest.id
    FROM                cpi_contest
    LEFT JOIN           cpi_betting
                        ON      cpi_contest.id = cpi_betting.contest_id
                                AND		cpi_betting.better_id = p_better
    WHERE               cpi_contest.startDate <= NOW()
                        AND     cpi_contest.endBetDate > NOW()
                        AND		cpi_betting.contest_id IS NULL
                        AND		cpi_betting.better_id IS NULL;

    /* Une fois la table de participation remplie, on peut se baser sur elle */

    /* Table des pronostics */
    INSERT INTO         cpi_bet(better_id, category_id, winner_player_id, runnerUp_player_id)
    SELECT              cpi_expected.better_id, cpi_expected.category_id, NULL, NULL
    FROM                (
                            SELECT      cpi_betting.better_id, cpi_category.id AS category_id
                            FROM        cpi_betting
                            JOIN        cpi_contest
                                        ON      cpi_betting.contest_id = cpi_contest.id
                            JOIN        cpi_category
                                        ON    cpi_contest.id = cpi_category.contest_id
                            WHERE       cpi_betting.better_id = p_better
                                        AND     cpi_contest.startDate <= NOW()
                                        AND     NOW() < cpi_contest.endBetDate
                        ) cpi_expected
    LEFT JOIN           cpi_bet
                        ON      cpi_expected.better_id = cpi_bet.better_id
                                AND     cpi_expected.category_id = cpi_bet.category_id
    WHERE               cpi_bet.better_id IS NULL
                        AND     cpi_bet.category_id IS NULL;

    /* Table des pronostics sur la durée du match le plus long */
    INSERT INTO         cpi_duration(better_id, contest_day, duration)
    SELECT DISTINCT     cpi_expected.better_id, cpi_expected.contest_day, 30
    FROM                (
                            SELECT DISTINCT     cpi_betting.better_id, cpi_contest.day AS contest_day
                            FROM                cpi_betting
                            JOIN                cpi_contest
                                                ON      cpi_betting.contest_id = cpi_contest.id
                            JOIN                cpi_category
                                                ON    cpi_contest.id = cpi_category.contest_id
                            WHERE               cpi_betting.better_id = p_better
                                                AND     cpi_contest.startDate <= NOW()
                                                AND     NOW() < cpi_contest.endBetDate
                        ) cpi_expected
    LEFT JOIN           cpi_duration
                        ON      cpi_expected.better_id = cpi_duration.better_id
                                AND     cpi_expected.contest_day = cpi_duration.contest_day
    WHERE               cpi_duration.better_id IS NULL
                        AND     cpi_duration.contest_day IS NULL;

    /* Table des points par série */
    INSERT INTO         cpi_point(better_id, category_id, points)
    SELECT              cpi_expected.better_id, cpi_expected.category_id, 0
    FROM                (
                            SELECT DISTINCT     cpi_betting.better_id, cpi_category.id AS category_id
                            FROM                cpi_betting
                            JOIN                cpi_contest
                                                ON      cpi_betting.contest_id = cpi_contest.id
                            JOIN                cpi_category
                                                ON    cpi_contest.id = cpi_category.contest_id
                            WHERE               cpi_betting.better_id = p_better
                                                AND     cpi_contest.startDate <= NOW()
                                                AND     NOW() < cpi_contest.endBetDate
                        ) cpi_expected
    LEFT JOIN           cpi_point
                        ON      cpi_expected.better_id = cpi_point.better_id
                                AND     cpi_expected.category_id = cpi_point.category_id
    WHERE               cpi_point.better_id IS NULL
                        AND     cpi_point.category_id IS NULL;

    /* Table des classements */
    INSERT INTO         cpi_ranking(better_id, contest_day, points, ranking)
    SELECT              cpi_expected.better_id, cpi_expected.contest_day, 0, 0
    FROM                (
                            SELECT DISTINCT     cpi_betting.better_id, cpi_contest.day AS contest_day
                            FROM                cpi_betting
                            JOIN                cpi_contest
                                                ON      cpi_betting.contest_id = cpi_contest.id
                            WHERE               cpi_betting.better_id = p_better
                                                AND     cpi_contest.startDate <= NOW()
                                                AND     NOW() < cpi_contest.endBetDate
                        ) cpi_expected
    LEFT JOIN           cpi_ranking
                        ON      cpi_expected.better_id = cpi_ranking.better_id
                                AND     cpi_expected.contest_day = cpi_ranking.contest_day
    WHERE               cpi_ranking.better_id IS NULL
                        AND     cpi_ranking.contest_day IS NULL;
END$$

CREATE PROCEDURE `sp_delete_better` (IN `p_better` INT)  DETERMINISTIC BEGIN
    /* sp_delete_better */
    DELETE
    FROM        cpi_duration
    WHERE       cpi_duration.better_id = p_better;

    DELETE
    FROM        cpi_betting
    WHERE       cpi_betting.better_id = p_better;

    DELETE
    FROM        cpi_bet
    WHERE       cpi_bet.better_id = p_better;

    DELETE
    FROM        cpi_better
    WHERE       cpi_better.id = p_better;

    DELETE
    FROM        cpi_point
    WHERE       cpi_point.better_id = p_better;

    DELETE
    FROM        cpi_ranking
    WHERE       cpi_ranking.better_id = p_better;
END$$

CREATE PROCEDURE `sp_unset_bets` (IN `p_better` INT)  DETERMINISTIC UPDATE      cpi_bet
SET         cpi_bet.winner_player_id = NULL, cpi_bet.runnerUp_player_id = NULL
WHERE       cpi_bet.better_id = p_better$$

--
-- Fonctions
--
CREATE FUNCTION `fn_calculate_points` (`p_truth_winner` INT, `p_truth_runnerUp` INT, `p_bet_winner` INT, `p_bet_runnerUp` INT) RETURNS INT DETERMINISTIC READS SQL DATA BEGIN

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

CREATE FUNCTION `fn_connection_validity` () RETURNS DATETIME DETERMINISTIC READS SQL DATA BEGIN

    RETURN DATE_ADD(NOW(), INTERVAL 15 MINUTE);

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `cpi_bet`
--

CREATE TABLE `cpi_bet` (
  `better_id` int NOT NULL,
  `category_id` int NOT NULL,
  `winner_player_id` int DEFAULT NULL,
  `runnerUp_player_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `cpi_bet`
--

INSERT INTO `cpi_bet` (`better_id`, `category_id`, `winner_player_id`, `runnerUp_player_id`) VALUES
(1, 11, 1, 2),
(1, 12, 6, 7),
(1, 13, NULL, NULL),
(1, 14, NULL, NULL),
(1, 15, NULL, NULL),
(1, 21, NULL, NULL),
(1, 22, NULL, NULL),
(1, 23, NULL, NULL),
(1, 24, NULL, NULL),
(1, 31, 91, 92),
(1, 32, NULL, NULL),
(1, 33, NULL, NULL),
(1, 34, NULL, NULL),
(1, 35, NULL, NULL),
(1, 36, NULL, NULL),
(5, 11, 2, 1),
(5, 12, 7, 6),
(5, 13, 12, 10),
(5, 14, 22, 24),
(5, 15, 41, 40),
(5, 21, 59, 57),
(5, 22, 64, 62),
(5, 23, 70, 73),
(5, 24, 79, 81),
(5, 31, 92, 91),
(5, 32, 103, 104),
(5, 33, 113, 112),
(5, 34, 125, 126),
(5, 35, 138, 140),
(5, 36, 151, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_better`
--

CREATE TABLE `cpi_better` (
  `id` int NOT NULL,
  `account` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `isAdmin` smallint NOT NULL,
  `accessKey` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `endAccessKeyValidityDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `cpi_better`
--

INSERT INTO `cpi_better` (`id`, `account`, `password`, `name`, `firstName`, `contact`, `isAdmin`, `accessKey`, `endAccessKeyValidityDate`) VALUES
(1, 'admin', 'admin', 'Administrateur', 'Site', 'Moi', 1, '$2y$10$5FFHd0x9GS/kpfzY0bkooO4rh9U15MDmOZ4OAV2SKM8es98EnuNMy', '2023-04-17 23:52:27'),
(5, 'p', 'p', 'p', 'p', 'p', 0, '$2y$10$hbFL9Oe8RkeaLU3Y77GCcOAD30mG/pXnqJGxIlfSMx8dleMFDcyDm', '2023-04-17 22:50:54');

-- --------------------------------------------------------

--
-- Structure de la table `cpi_betting`
--

CREATE TABLE `cpi_betting` (
  `better_id` int NOT NULL,
  `contest_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `cpi_betting`
--

INSERT INTO `cpi_betting` (`better_id`, `contest_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(5, 1),
(5, 2),
(5, 3);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_category`
--

CREATE TABLE `cpi_category` (
  `id` int NOT NULL,
  `shortName` varchar(2) NOT NULL,
  `longName` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `contest_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `cpi_category`
--

INSERT INTO `cpi_category` (`id`, `shortName`, `longName`, `contest_id`) VALUES
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
(33, 'S3', 'Série 3', 3),
(34, 'S4', 'Série 4', 3),
(35, 'S5', 'Série 5', 3),
(36, 'S6', 'Série 6', 3);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_contest`
--

CREATE TABLE `cpi_contest` (
  `id` int NOT NULL,
  `shortName` varchar(2) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `longName` varchar(32) NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `endBetDate` datetime DEFAULT NULL,
  `endAdminDate` datetime DEFAULT NULL,
  `day` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `cpi_contest`
--

INSERT INTO `cpi_contest` (`id`, `shortName`, `longName`, `startDate`, `endBetDate`, `endAdminDate`, `day`) VALUES
(1, 'DH', 'Doubles Hommes', '2023-04-17 07:00:00', '2023-04-19 23:00:00', '2023-04-20 00:00:00', 1),
(2, 'DD', 'Doubles Dames', '2023-04-17 07:00:00', '2023-04-19 23:00:00', '2023-04-20 00:00:00', 1),
(3, 'DM', 'Doubles Mixtes', '2023-07-16 01:00:00', '2023-04-16 23:00:00', '2023-04-17 00:00:00', 2);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_duration`
--

CREATE TABLE `cpi_duration` (
  `better_id` int NOT NULL,
  `contest_day` tinyint NOT NULL,
  `duration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `cpi_duration`
--

INSERT INTO `cpi_duration` (`better_id`, `contest_day`, `duration`) VALUES
(1, 1, 30),
(1, 2, 30),
(5, 1, 82),
(5, 2, 30);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_player`
--

CREATE TABLE `cpi_player` (
  `id` int NOT NULL,
  `playerName1` varchar(100) NOT NULL,
  `playerRanking1` varchar(3) NOT NULL,
  `playerName2` varchar(100) NOT NULL,
  `playerRanking2` varchar(3) NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `cpi_player`
--

INSERT INTO `cpi_player` (`id`, `playerName1`, `playerRanking1`, `playerName2`, `playerRanking2`, `category_id`) VALUES
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
(90, 'BAILLY Marie', 'P10', 'BRENOT Corinne', 'P11', 24),
(91, 'ANGLARET Axel', 'N3', 'LEVALLET Salomé', 'N2', 31),
(92, 'GASSION Pierre', 'N3', 'MALAUSSE Laurene', 'N2', 31),
(93, 'GALLET Quentin', 'N2', 'PEREGRINA Aurelie', 'N3', 31),
(94, 'FUCHS Alexandre', 'N3', 'DURAND Leslie', 'N2', 31),
(95, 'VILLEGER Guillaume', 'N3', 'STRADY Julie', 'N2', 31),
(96, 'DEBECHE Marwen', 'N2', 'DEBECHE Farah', 'R4', 31),
(97, 'RODRIGUEZ Vincent', 'N2', 'LAUNOY Claire', 'N3', 31),
(98, 'KIRSCH Loic', 'N3', 'ZIDHANE Shirine', 'N3', 31),
(99, 'STRADY Romain', 'N3', 'DUCREY Alexandra', 'N3', 31),
(100, 'SAVIGNY Anthony', 'N3', 'MOYROUD Manon', 'N3', 31),
(101, 'RICO Aurelio', 'N3', 'BOUSSELLIER Julia', 'N3', 31),
(102, 'PACALET Xavier', 'R4', 'MEDINA Karine', 'N3', 31),
(103, 'JOURDON Thomas', 'R4', 'ROUXEL Anastasia', 'N3', 32),
(104, 'MAZARS Guilhem', 'R4', 'MULTEDO Alexia', 'R4', 32),
(105, 'AJONC Michael', 'R6', 'SEGRESTAN Pauline', 'N3', 32),
(106, 'D\'ANGELO Antony', 'R4', 'ZANARDO Céline', 'R4', 32),
(107, 'CHAPPE Flavien', 'R5', 'ROSSIGNOL Christel', 'R4', 32),
(108, 'GUILLERM Quentin', 'R4', 'KIENTZI Mylene', 'R4', 32),
(109, 'CHOLLET Antonin', 'R4', 'DEBECHE Anissa', 'R5', 32),
(110, 'LEVAN Jean-pierre', 'R4', 'HERNANDEZ Tania', 'R4', 32),
(111, 'TAMINH Nicolas', 'R5', 'ESCALLE Aurélie', 'R4', 33),
(112, 'SNACEL Benjamin', 'R5', 'BOUKEDROUN Sabrina', 'R5', 33),
(113, 'TASHJIAN Florian', 'R5', 'ROCCI Carla', 'R5', 33),
(114, 'COQUARD Guylain', 'R5', 'LOISY Krissie', 'R5', 33),
(115, 'MORZIERES Anthony', 'R5', 'SIRE Marine', 'R6', 33),
(116, 'MARCEL Yann', 'R4', 'CHANALEILLE Sandra', 'D7', 33),
(117, 'JOURDON Luc', 'R6', 'MERCOURT May-lise', 'R6', 33),
(118, 'GIRARD Elie', 'R6', 'CHARRAS Océane', 'R6', 33),
(119, 'BOISLIVEAU-ZIKA Antoine', 'R6', 'FADDA Laure', 'R6', 33),
(120, 'JULIEN Michael', 'D7', 'LEVAN Agnès', 'R5', 33),
(121, 'LEBLET Jimmy', 'D7', 'LEBLET Emilie', 'R6', 33),
(122, 'SOULIE Fabien', 'R6', 'SEGALEN Emy', 'D7', 33),
(123, 'HOYER Maxime', 'D9', 'GRAVIER Océane', 'R6', 34),
(124, 'ROBIN Thibault', 'R6', 'PERO Amandine', 'D7', 34),
(125, 'RUGGERI Nicolas', 'D8', 'PASTOR Celine', 'R6', 34),
(126, 'FONDU Gerard', 'D7', 'TEISSIER-DEDIEU Arielle', 'D7', 34),
(127, 'LHUILLIER Brice', 'D8', 'THOMAE Cathy', 'R6', 34),
(128, 'TISET Sylvain', 'D7', 'BLEANDONU Alexia', 'D8', 34),
(129, 'VIDALE Gregory', 'D8', 'ARNAUD Melody', 'D7', 34),
(130, 'ISORCE Julien', 'D8', 'NEGRI Aurore', 'D7', 34),
(131, 'GILLES Morgan', 'D8', 'DESCHARMES Mylène', 'D8', 34),
(132, 'KEEBLE Hervé', 'D8', 'MOYA Laurie', 'D8', 34),
(133, 'TOCON Benjamin', 'D8', 'THOMET Estelle', 'D8', 34),
(134, 'LAURENT Aurélien', 'D8', 'BERTELLO Anais', 'D8', 34),
(135, 'OLIBER Marc', 'D8', 'DECHAZERON FELICI Nathalie', 'D8', 34),
(136, 'SOLA Pierre', 'D7', 'TALON Anaelle', 'D9', 34),
(137, 'KUDRYASHOV Anton', 'D7', 'BARBE Zélia', 'D9', 34),
(138, 'ARIZA Nathan', 'D8', 'ARGENTIERI Aureline', 'D8', 35),
(139, 'POELAERT Jérome', 'D8', 'MARINI Mélanie', 'D9', 35),
(140, 'MORRA Geoffroy', 'D8', 'SIMIAN YBANEZ Cindy', 'D9', 35),
(141, 'BERNARD Nicolas', 'D8', 'SAUTRON Olivia', 'D8', 35),
(142, 'D\'ANGELO Olivier', 'D9', 'XUE Qiong-hui', 'D8', 35),
(143, 'BOSSETI Maxime', 'D9', 'WYATT Christelle', 'D8', 35),
(144, 'GANANCIA-MARTIN Victor', 'D9', 'DOUISSARD Camille', 'D8', 35),
(145, 'BAUMER Thomas', 'D8', 'PORTIER Lucie', 'D9', 35),
(146, 'DELEVALLET Alexandre', 'D9', 'BOTHEREAU Annaelle', 'D8', 35),
(147, 'SAMMITO Anael', 'D8', 'GIRAUDOT Emmanuelle', 'D9', 35),
(148, 'PUGINIER Kellian', 'D8', 'DIAZ Lucie', 'D9', 35),
(149, 'EYMOND Remi', 'D8', 'PRADEILLES Sandrine', 'D9', 35),
(150, 'THEODON Alexandre', 'D9', 'ARTEL Valérie', 'D9', 36),
(151, 'BUI Didier', 'D9', 'COLONNA Alexandra', 'D9', 36),
(152, 'HOOKOOMSING Dilan', 'D9', 'GALMICHE Lucie', 'D8', 36),
(153, 'DECORPS Alexandre', 'D9', 'FERRAND Lucie', 'D9', 36),
(154, 'FARINA Jaufret', 'D9', 'BRESSON Anaïs', 'D9', 36),
(155, 'SIKA Guillaume', 'D9', 'AINSA Audrey', 'D9', 36),
(156, 'POITEVINEAU Francis', 'P10', 'ROUX Frederique', 'D9', 36),
(157, 'VALLAT Benjamin', 'P10', 'MASSON Nadège', 'D9', 36),
(158, 'DANJON Rémi', 'D9', 'GARRIDO Selena', 'P11', 36),
(159, 'KLASSEN Pierrick', 'D9', 'OGEE Manon', 'P11', 36),
(160, 'GHAOUI Hiacine', 'D9', 'LEBOIS Isabelle', 'P11', 36),
(161, 'HUYNH VINH PHAT Philippe', 'P11', 'MINEUR Amélie', 'D9', 36),
(162, 'LONGET Gregory', 'P10', 'LEBOEUF Agnes', 'P10', 36),
(163, 'DUFOUR Arnaud', 'P10', 'BRENOT Corinne', 'P10', 36),
(164, 'SIRE David', 'P11', 'FAYE Estelle', 'P11', 36);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_point`
--

CREATE TABLE `cpi_point` (
  `better_id` int NOT NULL,
  `category_id` int NOT NULL,
  `points` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `cpi_point`
--

INSERT INTO `cpi_point` (`better_id`, `category_id`, `points`) VALUES
(1, 11, 0),
(1, 12, 0),
(1, 13, 0),
(1, 14, 0),
(1, 15, 0),
(1, 21, 0),
(1, 22, 0),
(1, 23, 0),
(1, 24, 0),
(1, 31, 0),
(1, 32, 0),
(1, 33, 0),
(1, 34, 0),
(1, 35, 0),
(1, 36, 0),
(5, 11, 10),
(5, 12, 10),
(5, 13, 0),
(5, 14, 0),
(5, 15, 0),
(5, 21, 0),
(5, 22, 0),
(5, 23, 0),
(5, 24, 0),
(5, 31, 0),
(5, 32, 0),
(5, 33, 0),
(5, 34, 0),
(5, 35, 0),
(5, 36, 0);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_ranking`
--

CREATE TABLE `cpi_ranking` (
  `better_id` int NOT NULL,
  `contest_day` int NOT NULL,
  `points` int NOT NULL,
  `ranking` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `cpi_ranking`
--

INSERT INTO `cpi_ranking` (`better_id`, `contest_day`, `points`, `ranking`) VALUES
(1, 1, 0, 0),
(1, 2, 0, 0),
(5, 1, 20, 1),
(5, 2, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_working_point`
--

CREATE TABLE `cpi_working_point` (
  `points` int NOT NULL,
  `numberOf` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `cpi_working_point`
--

INSERT INTO `cpi_working_point` (`points`, `numberOf`) VALUES
(20, 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cpi_bet`
--
ALTER TABLE `cpi_bet`
  ADD PRIMARY KEY (`better_id`,`category_id`);

--
-- Index pour la table `cpi_better`
--
ALTER TABLE `cpi_better`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `cpi_betting`
--
ALTER TABLE `cpi_betting`
  ADD PRIMARY KEY (`better_id`,`contest_id`);

--
-- Index pour la table `cpi_category`
--
ALTER TABLE `cpi_category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `cpi_contest`
--
ALTER TABLE `cpi_contest`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `cpi_duration`
--
ALTER TABLE `cpi_duration`
  ADD PRIMARY KEY (`better_id`,`contest_day`);

--
-- Index pour la table `cpi_player`
--
ALTER TABLE `cpi_player`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `cpi_point`
--
ALTER TABLE `cpi_point`
  ADD PRIMARY KEY (`better_id`,`category_id`);

--
-- Index pour la table `cpi_ranking`
--
ALTER TABLE `cpi_ranking`
  ADD PRIMARY KEY (`better_id`,`contest_day`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cpi_better`
--
ALTER TABLE `cpi_better`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `cpi_player`
--
ALTER TABLE `cpi_player`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;
COMMIT;
