-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : mer. 31 mai 2023 à 21:06
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
CREATE DEFINER=`root`@`%` PROCEDURE `sp_calculate_point_ranking` ()  DETERMINISTIC NO SQL BEGIN
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

CREATE DEFINER=`root`@`%` PROCEDURE `sp_create_missing_bets` (IN `p_better` INT)  DETERMINISTIC BEGIN
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
    INSERT INTO         cpi_duration(better_id, contest_day, duration, isDurationModified)
    SELECT DISTINCT     cpi_expected.better_id, cpi_expected.contest_day, 30, 0
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

CREATE DEFINER=`root`@`%` PROCEDURE `sp_delete_better` (IN `p_better` INT)  DETERMINISTIC BEGIN
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

    DELETE
    FROM        cpi_setting
    WHERE       cpi_setting.better_id = p_better;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `sp_unset_bets` (IN `p_better` INT)  DETERMINISTIC UPDATE      cpi_bet
SET         cpi_bet.winner_player_id = NULL, cpi_bet.runnerUp_player_id = NULL
WHERE       cpi_bet.better_id = p_better$$

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

CREATE DEFINER=`root`@`%` FUNCTION `fn_connection_validity` () RETURNS DATETIME DETERMINISTIC READS SQL DATA BEGIN

    RETURN DATE_ADD(NOW(), INTERVAL 30 MINUTE);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cpi_bet`
--

INSERT INTO `cpi_bet` (`better_id`, `category_id`, `winner_player_id`, `runnerUp_player_id`) VALUES
(10, 11, 2, 1),
(10, 12, 8, 6),
(10, 13, 12, 11),
(10, 14, NULL, NULL),
(10, 15, NULL, NULL),
(10, 21, NULL, NULL),
(10, 22, NULL, NULL),
(10, 23, NULL, NULL),
(10, 24, NULL, NULL),
(11, 11, 1, 2),
(11, 12, 6, 8),
(11, 13, 13, 10),
(11, 14, 23, 26),
(11, 15, 43, 41),
(11, 21, 58, 60),
(11, 22, 65, 64),
(11, 23, 71, 73),
(11, 24, 81, 83),
(14, 11, 2, 5),
(14, 12, 6, 7),
(14, 13, 14, 11),
(14, 14, 22, 24),
(14, 15, 43, 41),
(14, 21, 58, 59),
(14, 22, 67, 63),
(14, 23, 70, 73),
(14, 24, 80, 78);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_better`
--

CREATE TABLE `cpi_better` (
  `id` int NOT NULL,
  `password` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `isAdmin` smallint NOT NULL,
  `accessKey` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `endAccessKeyValidityDate` datetime DEFAULT NULL,
  `isTutorialDone` smallint NOT NULL,
  `evaluation` smallint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cpi_better`
--

INSERT INTO `cpi_better` (`id`, `password`, `name`, `firstName`, `contact`, `isAdmin`, `accessKey`, `endAccessKeyValidityDate`, `isTutorialDone`, `evaluation`) VALUES
(10, '1809', 'Admin', 'Admin', 'Admin', 1, '$2y$10$MlAJKeLpBVAOKw/I/OqEzu8qJr6Uclrs9iKjVIN4w1.xCYFIOKTtW', '2023-05-31 23:30:11', 1, 3),
(11, '1234', 'HVP', 'Philippe', '111', 0, '$2y$10$IH/N1WQALwugi.31kxZ9/OEgYCvJCrKbxiwyRRdG8hVv1Q4ixY8We', '2023-05-31 23:22:53', 1, 3),
(14, '1234', 'HUYNH', 'PHILIPPE', 'M', 0, '$2y$10$R1uGEu/uWF.x8AYF8FGqeOfs5oq.fjTUOsykq9K4V2gFn/5isCiB2', '2023-05-31 22:53:21', 1, -1);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_betting`
--

CREATE TABLE `cpi_betting` (
  `better_id` int NOT NULL,
  `contest_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cpi_betting`
--

INSERT INTO `cpi_betting` (`better_id`, `contest_id`) VALUES
(10, 1),
(10, 2),
(11, 1),
(11, 2),
(14, 1),
(14, 2);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_category`
--

CREATE TABLE `cpi_category` (
  `id` int NOT NULL,
  `shortName` varchar(2) NOT NULL,
  `longName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contest_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `shortName` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `longName` varchar(32) NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `endBetDate` datetime DEFAULT NULL,
  `endAdminDate` datetime DEFAULT NULL,
  `day` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cpi_contest`
--

INSERT INTO `cpi_contest` (`id`, `shortName`, `longName`, `startDate`, `endBetDate`, `endAdminDate`, `day`) VALUES
(1, 'DH', 'Doubles Hommes', '2023-04-17 07:00:00', '2023-06-30 23:00:00', '2023-07-01 00:00:00', 1),
(2, 'DD', 'Doubles Dames', '2023-04-17 07:00:00', '2023-06-30 23:00:00', '2023-07-01 00:00:00', 1),
(3, 'DM', 'Doubles Mixtes', '2023-07-16 01:00:00', '2023-04-16 23:00:00', '2023-04-17 00:00:00', 2);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_duration`
--

CREATE TABLE `cpi_duration` (
  `better_id` int NOT NULL,
  `contest_day` tinyint NOT NULL,
  `duration` int NOT NULL,
  `isDurationModified` smallint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cpi_duration`
--

INSERT INTO `cpi_duration` (`better_id`, `contest_day`, `duration`, `isDurationModified`) VALUES
(10, 1, 62, 0),
(11, 1, 47, 1),
(14, 1, 30, 0);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_player`
--

CREATE TABLE `cpi_player` (
  `id` int NOT NULL,
  `playerName1` varchar(100) NOT NULL,
  `playerRanking1` varchar(3) NOT NULL,
  `playerClub1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `playerName2` varchar(100) NOT NULL,
  `playerRanking2` varchar(3) NOT NULL,
  `playerClub2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cpi_player`
--

INSERT INTO `cpi_player` (`id`, `playerName1`, `playerRanking1`, `playerClub1`, `playerName2`, `playerRanking2`, `playerClub2`, `category_id`) VALUES
(1, 'GASSION Pierre', 'N3', 'Stade Marseillais Universite Club', 'VAUR Théo', 'N2', 'Union Saint-Bruno', 11),
(2, 'ANGLARET Axel', 'N3', 'Stade Marseillais Universite Club', 'VILLEGER Guillaume', 'N2', 'Bad\'Hyères', 11),
(3, 'LEBON Quentin', 'N3', 'Istres Sports Badminton', 'VILLEDIEU Cedric', 'N3', 'Istres Sports Badminton', 11),
(4, 'FUCHS Alexandre', 'N3', 'Badminton Club D\'Antibes', 'SAVIGNY Anthony', 'N3', 'Badminton Club D\'Antibes', 11),
(5, 'CHOLLET Antonin', 'R4', 'Patronages Laiques De Troyes', 'GALLET Quentin', 'N3', 'Aix Universite Club Badminton', 11),
(6, 'SOKIKIAN Tristan', 'N3', 'Vitrolles Badminton', 'TASSY Jerome', 'R5', 'Martigues Badminton Club', 12),
(7, 'D\'ANGELO Antony', 'R5', 'Simiane Badminton Club', 'PLATEL Romain', 'N3', 'Simiane Badminton Club', 12),
(8, 'CHAPPE Flavien', 'R4', 'Badminton Club d\'Ensuès la Redonne', 'JOURDON Thomas', 'R4', 'Ailes Sportives Airbus Helicopter - Badminton', 12),
(9, 'COQUARD Guylain', 'R4', 'Association Bad In Lez', 'MOLINA Ludovic', 'R4', 'Association Bad In Lez', 12),
(10, 'BONAVENTURA Didier', 'R5', 'Simiane Badminton Club', 'SOULIE Fabien', 'R5', 'Simiane Badminton Club', 13),
(11, 'FIELOUX Sebastien', 'R5', 'Avignon Badminton Club', 'MARCEL Yann', 'R5', 'Avignon Badminton Club', 13),
(12, 'JOURDON Luc', 'R5', 'Club Sports Loisirs Cult. Arles', 'TASHJIAN Florian', 'R5', 'Vitrolles Badminton', 13),
(13, 'GUICHARD Sylvain', 'R5', 'Badminton Club des Aiglons d\'Eyguieres', 'LEBLET Jimmy', 'R6', 'Badminton Club des Aiglons d\'Eyguieres', 13),
(14, 'AUDIBERT Jonathan', 'R5', 'Istres Sports Badminton', 'LEVAN Jean-pierre', 'R6', 'Istres Sports Badminton', 13),
(15, 'PUGINIER Kellian', 'D7', 'Saint Gely - Saint Clément Badminton', 'TAMINH Nicolas', 'R5', 'Beziers Badminton ABSR', 13),
(16, 'FLECHON Killian', 'R6', 'Badminton Salonais', 'ROBIN Thibault', 'R6', 'Aix Universite Club Badminton', 13),
(17, 'LLORCA Sylvain', 'R6', 'Badminton Club Aubagnais', 'PEPINO Jean-yves', 'R6', 'Badminton Club Aubagnais', 13),
(18, 'LE Thierry', 'R6', 'Bad In Marseille', 'SARROBERT Clément', 'R6', 'Aix Universite Club Badminton', 13),
(19, 'BENEVENTI Christophe', 'R6', 'Colmar B.ra.', 'TISET Sylvain', 'R6', 'Badminton Club D\'Antibes', 13),
(20, 'CASTANER Ulysse', 'D8', 'Stade Marseillais Universite Club', 'SNACEL Benjamin', 'R6', 'Stade Marseillais Universite Club', 13),
(21, 'JULIEN Michael', 'D8', 'Istres Sports Badminton', 'LE DREVO Alexandre', 'R6', 'Istres Sports Badminton', 13),
(22, 'BOSSETI Maxime', 'D7', 'Bad In Marseille', 'SAMMITO Anael', 'D7', 'Badminton Club D\'Antibes', 14),
(23, 'CATTAZZO Quentin', 'D7', 'Vitrolles Badminton', 'NOWICKI David', 'D7', 'Vitrolles Badminton', 14),
(24, 'PORQUET Terry', 'D7', 'Apt Badminton Club', 'RAMDANI Yassine', 'D7', 'Badminton Club Carpentrassien', 14),
(25, 'HOYER Maxime', 'D7', 'Istres Sports Badminton', 'ZOPPIS Baptiste', 'D8', 'Istres Sports Badminton', 14),
(26, 'DELCORSO Jean francois', 'D7', 'Badminton Alpilles Montagnette', 'MORATH Harald', 'D8', 'Badminton Alpilles Montagnette', 14),
(27, 'DEBECHE Naoufel', 'D7', 'Kimbad Ollioules', 'FONDU Gerard', 'D8', 'Club Islois De Badminton', 14),
(28, 'KEEBLE Hervé', 'D7', 'Badminton Club De St Martin', 'NGUYEN Truong-quan', 'D8', 'Badminton Club De St Martin', 14),
(29, 'BUI Didier', 'D9', 'Nice Universite Club Badminton', 'KUDRYASHOV Anton', 'D7', 'Nice Universite Club Badminton', 14),
(30, 'LORBER Angelo', 'D8', 'Apt Badminton Club', 'SERVES Clément', 'D9', 'Badminton Olympique De Pernes', 14),
(31, 'ALLE Marc', 'D8', 'Asptt Marseille', 'LUCAS Christophe', 'D8', 'Asptt Marseille', 14),
(32, 'DANEY Loic', 'D8', 'Badminton Club d\'Ensuès la Redonne', 'LHUILLIER Brice', 'D9', 'Martigues Badminton Club', 14),
(33, 'JARD Bastien', 'D8', 'Badminton Club D\'Antibes', 'ZOPPIS Alexandre', 'D9', 'Badminton Club D\'Antibes', 14),
(34, 'GANANCIA-MARTIN Victor', 'D8', 'Badminton Club Grasse', 'LAURENT Aurélien', 'D8', 'Badminton Club Grasse', 14),
(35, 'GAUTHIER Gilles', 'D9', 'Badminton Club De St Martin', 'JOUHAUD Guillaume', 'D8', 'Badminton Club De St Martin', 14),
(36, 'GUILLON Xavier', 'D9', 'Badminton Club Aubagnais', 'MAYAN Marc', 'D8', 'Club Islois De Badminton', 14),
(37, 'AJONC Michael', 'D8', 'Vitrolles Badminton', 'LERAT David', 'D9', 'Kimbad Ollioules', 14),
(38, 'LEBOEUF Benoît', 'D9', 'Simiane Badminton Club', 'LONGET Gregory', 'D9', 'Simiane Badminton Club', 14),
(39, 'POZZO Peter', 'D9', 'Badminton Club de Mallemort', 'RUIZ Aurélien', 'D9', 'Badminton Club de Mallemort', 14),
(40, 'BAQUE Rémi', 'D9', 'Badminton Club de Mallemort', 'MERVILLE Patrick', 'D9', 'Badminton Club de Mallemort', 15),
(41, 'D\'ANGELO Olivier', 'D9', 'Istres Sports Badminton', 'DECORPS Alexandre', 'D9', 'Istres Sports Badminton', 15),
(42, 'ARIZA Nathan', 'D9', 'Badminton Club Brignolais', 'DELEVALLET Alexandre', 'D9', 'Badminton Club Brignolais', 15),
(43, 'PIZZORNO Mathieu', 'D9', 'Badminton Club Garéoultais', 'VERBRUGGHE Quentin', 'D9', 'Badminton Club Garéoultais', 15),
(44, 'FARINA Jaufret', 'D9', 'Badminton Club de Mallemort', 'THEODON Alexandre', 'D9', 'Badminton Club de Mallemort', 15),
(45, 'BONIFACE Tibalt', 'D9', 'Badminton Club Brignolais', 'MALGRAS Sylvain', 'P10', 'Bad Jeunes 83', 15),
(46, 'FILLION Toussaint', 'D9', 'Badminton Club Fos', 'GARCIN Frédéric', 'D9', 'Badminton Club Fos', 15),
(47, 'HUYNH VINH PHAT Philippe', 'D9', 'Istres Sports Badminton', 'VIDALE Gregory', 'P10', 'Istres Sports Badminton', 15),
(48, 'PUEYO Alexandre', 'P11', 'Istres Sports Badminton', 'VALLAT Benjamin', 'D9', 'Istres Sports Badminton', 15),
(49, 'COYER Yann', 'P10', 'Istres Sports Badminton', 'GARCIA Salvador', 'P10', 'Badminton Club d\'Ensuès la Redonne', 15),
(50, 'FOURNEAU Olivier', 'P10', 'Istres Sports Badminton', 'HOOKOOMSING Dilan', 'P10', 'Istres Sports Badminton', 15),
(51, 'POITEVINEAU Francis', 'P10', 'Badminton Club d\'Ensuès la Redonne', 'UNIZYCKI Mathias', 'P10', 'Badminton Club d\'Ensuès la Redonne', 15),
(52, 'BOYE Baptiste', 'P10', 'Olympique Badminton Club Nimes', 'GOUZOU Matthieu', 'P10', 'Fédération Française de Badminton', 15),
(53, 'BRET Romain', 'P10', 'Istres Sports Badminton', 'GUILLEMAIN Quentin', 'P10', 'Istres Sports Badminton', 15),
(54, 'AUCANTE Martin', 'P10', 'Badminton Paris 18eme', 'SIMON Vladimir', 'P12', 'Badminton Paris 18eme', 15),
(55, 'FENOUIL Thomas', 'P11', 'Istres Sports Badminton', 'NONY Stephane', 'P10', 'Istres Sports Badminton', 15),
(56, 'DUFOUR Arnaud', 'P11', 'Istres Sports Badminton', 'VANE Steven', 'P11', 'Istres Sports Badminton', 15),
(57, 'MEDINA Karine', 'N2', 'Badminton Olympique De Pernes', 'VALLEE Amélie', 'N3', 'UnaNîm\'Bad', 21),
(58, 'DUCREY Alexandra', 'N3', 'Badminton Club D\'Antibes', 'LEVALLET Salomé', 'N2', 'Badminton Club Fos', 21),
(59, 'MALAUSSE Laurene', 'N2', 'Badminton Club D\'Antibes', 'ROUXEL Anastasia', 'N3', 'RACING CLUB DE FRANCE', 21),
(60, 'BROC Marianne', 'N3', 'Badminton Olympique De Pernes', 'ZIDHANE Shirine', 'N3', 'Badminton Club De Valence', 21),
(61, 'BOUSSELLIER Julia', 'N3', 'Istres Sports Badminton', 'FARRELL Armance', 'R4', 'CVN Bad', 21),
(62, 'LAUNOY Claire', 'R4', 'Association Bad In Lez', 'MULTEDO Alexia', 'R4', 'Association Bad In Lez', 22),
(63, 'DEBECHE Anissa', 'R5', 'RACING CLUB DE FRANCE', 'DEBECHE Farah', 'R4', 'Bad Jeunes 83', 22),
(64, 'SEGUIN Florine', 'R5', 'Aix Universite Club Badminton', 'ZANARDO Céline', 'R5', 'Ailes Sportives Airbus Helicopter - Badminton', 22),
(65, 'BANAS Samantha', 'R5', 'Stade Marseillais Universite Club', 'ROCHE Pauline', 'R5', 'Stade Marseillais Universite Club', 22),
(66, 'AHUIR Perrine', 'R5', 'Istres Sports Badminton', 'STRADY Julie', 'R5', 'Stade Marseillais Universite Club', 22),
(67, 'HERNANDEZ Tania', 'R5', 'Ailes Sportives Airbus Helicopter - Badminton', 'ROSSIGNOL Christel', 'R6', 'Ailes Sportives Airbus Helicopter - Badminton', 22),
(68, 'LEVAN Agnès', 'R5', 'Martigues Badminton Club', 'THOMAE Cathy', 'R6', 'Badminton Club d\'Ensuès la Redonne', 22),
(69, 'DELLA VALLE Chloé', 'R5', 'Stade Marseillais Universite Club', 'NOE Garance', 'D7', 'UnaNîm\'Bad', 22),
(70, 'ESCALLE Aurélie', 'R6', 'Badminton Pignan', 'KIENTZI Mylene', 'D7', 'Badminton Pignan', 23),
(71, 'MERCOURT May-lise', 'R6', 'Club Sports Loisirs Cult. Arles', 'ROCCI Carla', 'D7', 'Ailes Sportives Airbus Helicopter - Badminton', 23),
(72, 'DINET Caroline', 'R6', 'Badminton Salonais', 'SEGALEN Emy', 'D7', 'Kimbad Ollioules', 23),
(73, 'AYCARD Chloe', 'D7', 'Bad\'Hyères', 'SIRE Marine', 'D7', 'Kimbad Ollioules', 23),
(74, 'BLEANDONU Alexia', 'D7', 'Kimbad Ollioules', 'PASTOR Celine', 'D7', 'Martigues Badminton Club', 23),
(75, 'MINEUR Amélie', 'D8', 'Istres Sports Badminton', 'XUE Qiong-hui', 'D8', 'Istres Sports Badminton', 23),
(76, 'CHARRAS Océane', 'D8', 'Volant des Costières', 'PORTIER Lucie', 'D9', 'Volant des Costières', 23),
(77, 'BERTELLO Anais', 'D9', 'Badminton Club Grasse', 'DOUISSARD Camille', 'D8', 'Kimbad Ollioules', 23),
(78, 'SAUTRON Olivia', 'D8', 'Badminton Club Orangeois', 'TEISSIER-DEDIEU Arielle', 'D8', 'Stade Marseillais Universite Club', 24),
(79, 'ARNAUD Melody', 'D8', 'Saint Gely - Saint Clément Badminton', 'GALMICHE Lucie', 'D9', 'Istres Sports Badminton', 24),
(80, 'BARBE Zélia', 'P10', 'Badminton Associatif de Six Fours', 'COLONNA Alexandra', 'D9', 'Nice Universite Club Badminton', 24),
(81, 'GROSSET Céline', 'D9', 'Badminton Club d\'Ensuès la Redonne', 'ROUX Frederique', 'D9', 'Badminton Club d\'Ensuès la Redonne', 24),
(82, 'DOS SANTOS Laura', 'D9', 'Badminton Club d\'Ensuès la Redonne', 'GIVERSO Floriane', 'P10', 'Badminton Club d\'Ensuès la Redonne', 24),
(83, 'ARGENTIERI Aureline', 'D9', 'Badminton Club Brignolais', 'BOTHEREAU Annaelle', 'D9', 'USC LA CRAU BADMINTON ', 24),
(84, 'GIRAUDOT Emmanuelle', 'D9', 'Bad In Marseille', 'WYATT Christelle', 'D9', 'Martigues Badminton Club', 24),
(85, 'CHANALEILLE Sandra', 'P10', 'Avignon Badminton Club', 'DEGUIGNE Claire', 'D9', 'Avignon Badminton Club', 24),
(86, 'BENHAIM Jade', 'D9', 'Club Sports Loisirs Cult. Arles', 'CAUBISENS Clémentine', 'P10', 'Club Sports Loisirs Cult. Arles', 24),
(87, 'BRESSON Adélaïde', 'D9', 'Badminton Club de Mallemort', 'BRESSON Anaïs', 'P10', 'ALC Longvic Badminton', 24),
(88, 'BUFFET Céline', 'P10', 'Badminton Club d\'Ensuès la Redonne', 'SARRADET Florence', 'P10', 'Bad In Marseille', 24),
(89, 'PRADEILLES Sandrine', 'P10', 'Badminton Club Remoulins', 'PRIVAT Pascale', 'P10', 'Badminton Club Remoulins', 24),
(90, 'BAILLY Marie', 'P10', 'Bad à Morières', 'BRENOT Corinne', 'P11', 'Istres Sports Badminton', 24),
(91, 'ANGLARET Axel', 'N3', 'Stade Marseillais Universite Club', 'LEVALLET Salomé', 'N2', 'Badminton Club Fos', 31),
(92, 'GASSION Pierre', 'N3', 'Stade Marseillais Universite Club', 'MALAUSSE Laurene', 'N2', 'Badminton Club D\'Antibes', 31),
(93, 'GALLET Quentin', 'N2', 'Aix Universite Club Badminton', 'PEREGRINA Aurelie', 'N3', 'Aix Universite Club Badminton', 31),
(94, 'FUCHS Alexandre', 'N3', 'Badminton Club D\'Antibes', 'DURAND Leslie', 'N2', 'Bad\'Hyères', 31),
(95, 'VILLEGER Guillaume', 'N3', 'Bad\'Hyères', 'STRADY Julie', 'N2', 'Stade Marseillais Universite Club', 31),
(96, 'DEBECHE Marwen', 'N2', 'Kimbad Ollioules', 'DEBECHE Farah', 'R4', 'Bad Jeunes 83', 31),
(97, 'RODRIGUEZ Vincent', 'N2', 'Association Bad In Lez', 'LAUNOY Claire', 'N3', 'Association Bad In Lez', 31),
(98, 'KIRSCH Loic', 'N3', 'Badminton Club De Valence', 'ZIDHANE Shirine', 'N3', 'Badminton Club De Valence', 31),
(99, 'STRADY Romain', 'N3', 'Istres Sports Badminton', 'DUCREY Alexandra', 'N3', 'Badminton Club D\'Antibes', 31),
(100, 'SAVIGNY Anthony', 'N3', 'Badminton Club D\'Antibes', 'MOYROUD Manon', 'N3', 'Badminton Club Aubagnais', 31),
(101, 'RICO Aurelio', 'N3', 'Vitrolles Badminton', 'BOUSSELLIER Julia', 'N3', 'Istres Sports Badminton', 31),
(102, 'PACALET Xavier', 'R4', 'Badminton Club D\'Antibes', 'MEDINA Karine', 'N3', 'Badminton Olympique De Pernes', 31),
(103, 'JOURDON Thomas', 'R4', 'Ailes Sportives Airbus Helicopter - Badminton', 'ROUXEL Anastasia', 'N3', 'RACING CLUB DE FRANCE', 32),
(104, 'MAZARS Guilhem', 'R4', 'Association Bad In Lez', 'MULTEDO Alexia', 'R4', 'Association Bad In Lez', 32),
(105, 'AJONC Michael', 'R6', 'Vitrolles Badminton', 'SEGRESTAN Pauline', 'N3', 'Vitrolles Badminton', 32),
(106, 'D\'ANGELO Antony', 'R4', 'Simiane Badminton Club', 'ZANARDO Céline', 'R4', 'Ailes Sportives Airbus Helicopter - Badminton', 32),
(107, 'CHAPPE Flavien', 'R5', 'Badminton Club d\'Ensuès la Redonne', 'ROSSIGNOL Christel', 'R4', 'Ailes Sportives Airbus Helicopter - Badminton', 32),
(108, 'GUILLERM Quentin', 'R4', 'Badminton Pignan', 'KIENTZI Mylene', 'R4', 'Badminton Pignan', 32),
(109, 'CHOLLET Antonin', 'R4', 'Patronages Laiques De Troyes', 'DEBECHE Anissa', 'R5', 'RACING CLUB DE FRANCE', 32),
(110, 'LEVAN Jean-pierre', 'R4', 'Istres Sports Badminton', 'HERNANDEZ Tania', 'R4', 'Ailes Sportives Airbus Helicopter - Badminton', 32),
(111, 'TAMINH Nicolas', 'R5', 'Beziers Badminton ABSR', 'ESCALLE Aurélie', 'R4', 'Badminton Pignan', 33),
(112, 'SNACEL Benjamin', 'R5', 'Stade Marseillais Universite Club', 'BOUKEDROUN Sabrina', 'R5', 'Stade Marseillais Universite Club', 33),
(113, 'TASHJIAN Florian', 'R5', 'Vitrolles Badminton', 'ROCCI Carla', 'R5', 'Ailes Sportives Airbus Helicopter - Badminton', 33),
(114, 'COQUARD Guylain', 'R5', 'Association Bad In Lez', 'LOISY Krissie', 'R5', 'Saint Gely - Saint Clément Badminton', 33),
(115, 'MORZIERES Anthony', 'R5', 'Kimbad Ollioules', 'SIRE Marine', 'R6', 'Kimbad Ollioules', 33),
(116, 'MARCEL Yann', 'R4', 'Avignon Badminton Club', 'CHANALEILLE Sandra', 'D7', 'Avignon Badminton Club', 33),
(117, 'JOURDON Luc', 'R6', 'Club Sports Loisirs Cult. Arles', 'MERCOURT May-lise', 'R6', 'Club Sports Loisirs Cult. Arles', 33),
(118, 'GIRARD Elie', 'R6', 'Volant des Costières', 'CHARRAS Océane', 'R6', 'Volant des Costières', 33),
(119, 'BOISLIVEAU-ZIKA Antoine', 'R6', 'Stade Marseillais Universite Club', 'FADDA Laure', 'R6', 'Stade Marseillais Universite Club', 33),
(120, 'JULIEN Michael', 'D7', 'Istres Sports Badminton', 'LEVAN Agnès', 'R5', 'Martigues Badminton Club', 33),
(121, 'LEBLET Jimmy', 'D7', 'Badminton Club des Aiglons d\'Eyguieres', 'LEBLET Emilie', 'R6', 'Badminton Club des Aiglons d\'Eyguieres', 33),
(122, 'SOULIE Fabien', 'R6', 'Simiane Badminton Club', 'SEGALEN Emy', 'D7', 'Kimbad Ollioules', 33),
(123, 'HOYER Maxime', 'D9', 'Istres Sports Badminton', 'GRAVIER Océane', 'R6', 'Stade Marseillais Universite Club', 34),
(124, 'ROBIN Thibault', 'R6', 'Aix Universite Club Badminton', 'PERO Amandine', 'D7', 'Stade Marseillais Universite Club', 34),
(125, 'RUGGERI Nicolas', 'D8', 'Badminton Club des Aiglons d\'Eyguieres', 'PASTOR Celine', 'R6', 'Martigues Badminton Club', 34),
(126, 'FONDU Gerard', 'D7', 'Club Islois De Badminton', 'TEISSIER-DEDIEU Arielle', 'D7', 'Stade Marseillais Universite Club', 34),
(127, 'LHUILLIER Brice', 'D8', 'Martigues Badminton Club', 'THOMAE Cathy', 'R6', 'Badminton Club d\'Ensuès la Redonne', 34),
(128, 'TISET Sylvain', 'D7', 'Badminton Club D\'Antibes', 'BLEANDONU Alexia', 'D8', 'Kimbad Ollioules', 34),
(129, 'VIDALE Gregory', 'D8', 'Istres Sports Badminton', 'ARNAUD Melody', 'D7', 'Saint Gely - Saint Clément Badminton', 34),
(130, 'ISORCE Julien', 'D8', 'Badminton Club des Aiglons d\'Eyguieres', 'NEGRI Aurore', 'D7', 'Badminton Club des Aiglons d\'Eyguieres', 34),
(131, 'GILLES Morgan', 'D8', 'Avignon Badminton Club', 'DESCHARMES Mylène', 'D8', 'Badminton De La Plaine', 34),
(132, 'KEEBLE Hervé', 'D8', 'Badminton Club De St Martin', 'MOYA Laurie', 'D8', 'Badminton Club De St Martin', 34),
(133, 'TOCON Benjamin', 'D8', 'Badminton Club Sisteronais', 'THOMET Estelle', 'D8', 'Badminton Club Sisteronais', 34),
(134, 'LAURENT Aurélien', 'D8', 'Badminton Club Grasse', 'BERTELLO Anais', 'D8', 'Badminton Club Grasse', 34),
(135, 'OLIBER Marc', 'D8', 'Badminton Club De St Martin', 'DECHAZERON FELICI Nathalie', 'D8', 'Badminton Club De St Martin', 34),
(136, 'SOLA Pierre', 'D7', 'Badminton Salonais', 'TALON Anaelle', 'D9', 'Badminton Salonais', 34),
(137, 'KUDRYASHOV Anton', 'D7', 'Nice Universite Club Badminton', 'BARBE Zélia', 'D9', 'Badminton Associatif de Six Fours', 34),
(138, 'ARIZA Nathan', 'D8', 'Badminton Club Brignolais', 'ARGENTIERI Aureline', 'D8', 'Badminton Club Brignolais', 35),
(139, 'POELAERT Jérome', 'D8', 'Badminton Club Gapencais', 'MARINI Mélanie', 'D9', 'BC Dignois', 35),
(140, 'MORRA Geoffroy', 'D8', 'Badminton Club De St Martin', 'SIMIAN YBANEZ Cindy', 'D9', 'Badminton Club De St Martin', 35),
(141, 'BERNARD Nicolas', 'D8', 'Badminton Club Orangeois', 'SAUTRON Olivia', 'D8', 'Badminton Club Orangeois', 35),
(142, 'D\'ANGELO Olivier', 'D9', 'Istres Sports Badminton', 'XUE Qiong-hui', 'D8', 'Istres Sports Badminton', 35),
(143, 'BOSSETI Maxime', 'D9', 'Bad In Marseille', 'WYATT Christelle', 'D8', 'Martigues Badminton Club', 35),
(144, 'GANANCIA-MARTIN Victor', 'D9', 'Badminton Club Grasse', 'DOUISSARD Camille', 'D8', 'Kimbad Ollioules', 35),
(145, 'BAUMER Thomas', 'D8', 'Entente De Bad.de Pierrelatte', 'PORTIER Lucie', 'D9', 'Volant des Costières', 35),
(146, 'DELEVALLET Alexandre', 'D9', 'Badminton Club Brignolais', 'BOTHEREAU Annaelle', 'D8', 'USC LA CRAU BADMINTON ', 35),
(147, 'SAMMITO Anael', 'D8', 'Badminton Club D\'Antibes', 'GIRAUDOT Emmanuelle', 'D9', 'Bad In Marseille', 35),
(148, 'PUGINIER Kellian', 'D8', 'Saint Gely - Saint Clément Badminton', 'DIAZ Lucie', 'D9', 'Badminton Club Lunellois', 35),
(149, 'EYMOND Remi', 'D8', 'Badminton Club Remoulins', 'PRADEILLES Sandrine', 'D9', 'Badminton Club Remoulins', 35),
(150, 'THEODON Alexandre', 'D9', 'Badminton Club de Mallemort', 'ARTEL Valérie', 'D9', 'La Ciotat Badminton', 36),
(151, 'BUI Didier', 'D9', 'Nice Universite Club Badminton', 'COLONNA Alexandra', 'D9', 'Nice Universite Club Badminton', 36),
(152, 'HOOKOOMSING Dilan', 'D9', 'Istres Sports Badminton', 'GALMICHE Lucie', 'D8', 'Istres Sports Badminton', 36),
(153, 'DECORPS Alexandre', 'D9', 'Istres Sports Badminton', 'FERRAND Lucie', 'D9', 'Istres Sports Badminton', 36),
(154, 'FARINA Jaufret', 'D9', 'Badminton Club de Mallemort', 'BRESSON Anaïs', 'D9', 'ALC Longvic Badminton', 36),
(155, 'SIKA Guillaume', 'D9', 'Ass. Sportive De Ventabren', 'AINSA Audrey', 'D9', 'Ass. Sportive De Ventabren', 36),
(156, 'POITEVINEAU Francis', 'P10', 'Badminton Club d\'Ensuès la Redonne', 'ROUX Frederique', 'D9', 'Badminton Club d\'Ensuès la Redonne', 36),
(157, 'VALLAT Benjamin', 'P10', 'Istres Sports Badminton', 'MASSON Nadège', 'D9', 'Miramas Badminton Club', 36),
(158, 'DANJON Rémi', 'D9', 'Badminton Olympique De Pernes', 'GARRIDO Selena', 'P11', 'Badminton Club Orangeois', 36),
(159, 'KLASSEN Pierrick', 'D9', 'Badminton Club Brignolais', 'OGEE Manon', 'P11', 'Badminton Club Brignolais', 36),
(160, 'GHAOUI Hiacine', 'D9', 'Badminton Club de Mallemort', 'LEBOIS Isabelle', 'P11', 'Badminton Club de Mallemort', 36),
(161, 'HUYNH VINH PHAT Philippe', 'P11', 'Istres Sports Badminton', 'MINEUR Amélie', 'D9', 'Istres Sports Badminton', 36),
(162, 'LONGET Gregory', 'P10', 'Simiane Badminton Club', 'LEBOEUF Agnes', 'P10', 'Simiane Badminton Club', 36),
(163, 'DUFOUR Arnaud', 'P10', 'Istres Sports Badminton', 'BRENOT Corinne', 'P10', 'Istres Sports Badminton', 36),
(164, 'SIRE David', 'P11', 'Badminton Club Gardéen', 'FAYE Estelle', 'P11', 'Badminton Club Gardéen', 36);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_point`
--

CREATE TABLE `cpi_point` (
  `better_id` int NOT NULL,
  `category_id` int NOT NULL,
  `points` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cpi_point`
--

INSERT INTO `cpi_point` (`better_id`, `category_id`, `points`) VALUES
(10, 11, 0),
(10, 12, 0),
(10, 13, 0),
(10, 14, 0),
(10, 15, 0),
(10, 21, 0),
(10, 22, 0),
(10, 23, 0),
(10, 24, 0),
(11, 11, 7),
(11, 12, 7),
(11, 13, 20),
(11, 14, 0),
(11, 15, 0),
(11, 21, 0),
(11, 22, 0),
(11, 23, 0),
(11, 24, 0),
(14, 11, 0),
(14, 12, 0),
(14, 13, 0),
(14, 14, 0),
(14, 15, 0),
(14, 21, 0),
(14, 22, 0),
(14, 23, 0),
(14, 24, 0);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_ranking`
--

CREATE TABLE `cpi_ranking` (
  `better_id` int NOT NULL,
  `contest_day` int NOT NULL,
  `points` int NOT NULL,
  `ranking` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cpi_ranking`
--

INSERT INTO `cpi_ranking` (`better_id`, `contest_day`, `points`, `ranking`) VALUES
(10, 1, 0, 2),
(11, 1, 34, 1),
(14, 1, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_setting`
--

CREATE TABLE `cpi_setting` (
  `better_id` int NOT NULL,
  `clubName` smallint NOT NULL DEFAULT '0',
  `autoNavigation` smallint NOT NULL DEFAULT '0',
  `playerReverse` smallint NOT NULL DEFAULT '0',
  `darkMode` smallint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cpi_setting`
--

INSERT INTO `cpi_setting` (`better_id`, `clubName`, `autoNavigation`, `playerReverse`, `darkMode`) VALUES
(10, 0, 0, 0, 0),
(11, 0, 1, 1, 0),
(14, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `cpi_working_point`
--

CREATE TABLE `cpi_working_point` (
  `points` int NOT NULL,
  `numberOf` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cpi_working_point`
--

INSERT INTO `cpi_working_point` (`points`, `numberOf`) VALUES
(34, 1);

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
-- Index pour la table `cpi_setting`
--
ALTER TABLE `cpi_setting`
  ADD PRIMARY KEY (`better_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cpi_better`
--
ALTER TABLE `cpi_better`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `cpi_player`
--
ALTER TABLE `cpi_player`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;
COMMIT;
