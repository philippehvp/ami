DELIMITER $$
CREATE FUNCTION `fn_calculate_points`(`p_truth_winner` INT, `p_truth_runnerUp` INT, `p_bet_winner` INT, `p_bet_runnerUp` INT) RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN

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

DELIMITER $$
CREATE FUNCTION `fn_can_create_better`() RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN

    DECLARE     l_canCreateBetter INT;

    SELECT      CASE
                    WHEN    MAX(cpi_contest.endBetDate) > NOW()
                    THEN    1
                    ELSE    0
                END
    INTO        l_canCreateBetter
    FROM        cpi_contest
    WHERE       cpi_contest.startDate <= NOW();

    RETURN l_canCreateBetter;

END$$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION `fn_completed_categories`(p_day INT) RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN
    /* fn_completed_categories */
    DECLARE         l_completed INT;

    SELECT          COUNT(*) AS completed
    INTO            l_completed
    FROM            cpi_bet
    JOIN            cpi_better
                    ON      cpi_bet.better_id = cpi_better.id
    JOIN            cpi_category
                    ON      cpi_bet.category_id = cpi_category.id
    JOIN            cpi_contest
                    ON      cpi_category.contest_id = cpi_contest.id
    WHERE           cpi_contest.day = p_day
                    AND     cpi_better.isAdmin = 1
                    AND     cpi_bet.winner_player_id IS NOT NULL
                    AND     cpi_bet.runnerUp_player_id IS NOT NULL;

    RETURN l_completed;

END$$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION `fn_count_of_categories`(p_day INT) RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN
    /* fn_completed_categories */
    DECLARE         l_count INT;

    SELECT          COUNT(*)
    INTO            l_count
    FROM            cpi_bet
    JOIN            cpi_better
                    ON      cpi_bet.better_id = cpi_better.id
    JOIN            cpi_category
                    ON      cpi_bet.category_id = cpi_category.id
    JOIN            cpi_contest
                    ON      cpi_category.contest_id = cpi_contest.id
    WHERE           cpi_contest.day = p_day
                    AND     cpi_better.isAdmin = 1;

    RETURN l_count;

END$$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION `fn_connection_validity`() RETURNS datetime
    READS SQL DATA
    DETERMINISTIC
BEGIN

    RETURN DATE_ADD(NOW(), INTERVAL 15 MINUTE);

END$$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION `fn_count_of_betters`() RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN
/* fn_count_of_betters */

DECLARE             l_CountOfBetters INT;

SELECT              COUNT(*) AS countOf
INTO                l_CountOfBetters
FROM                (
                        SELECT              cpi_contest.id
                        FROM                cpi_contest
                        WHERE               cpi_contest.startDate <= NOW()
                                            AND     NOW() <= cpi_contest.endAdminDate
                        LIMIT               1
                    ) cpi_contest
JOIN                cpi_betting
                    ON      cpi_contest.id = cpi_betting.contest_id
JOIN                cpi_better
                    ON      cpi_betting.better_id = cpi_better.id
WHERE               cpi_better.isAdmin = 0;
RETURN              l_countOfBetters;
END$$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION `fn_end_bet_date`() RETURNS datetime
    READS SQL DATA
    DETERMINISTIC
BEGIN
	/* fn_end_bet_date */
    DECLARE     l_endBetDate DATETIME;

    SELECT      MAX(cpi_contest.endBetDate) AS endBetDate
    INTO        l_endBetDate
    FROM        cpi_contest
    WHERE       cpi_contest.startDate <= NOW();

    RETURN     l_endBetDate;

END$$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION `fn_max_start_date`() RETURNS datetime
    READS SQL DATA
    DETERMINISTIC
BEGIN

    DECLARE     l_max_start_date DATETIME;

    SELECT      MAX(cpi_contest.startDate)
    INTO        l_max_start_date
    FROM        cpi_contest
    WHERE       cpi_contest.startDate <= NOW();

    RETURN l_max_start_date;

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `sp_calculate_point_ranking`()
    NO SQL
    DETERMINISTIC
BEGIN
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
                        AND     cpi_point.better_id = cpi_bet.better_id
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
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `sp_create_missing_bets`(IN `p_better` INT)
    DETERMINISTIC
BEGIN
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
                        AND		cpi_betting.better_id IS NULL
                        AND     fn_can_create_better() = 1;

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
                        AND     cpi_bet.category_id IS NULL
                        AND     fn_can_create_better() = 1;

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
                        AND     cpi_duration.contest_day IS NULL
                        AND     fn_can_create_better() = 1;

    /* Pour les tables des points et des classements, il est important de ne rien créer pour l'administrateur */


    /* Table des points par série */
    INSERT INTO         cpi_point(better_id, category_id, points)
    SELECT              cpi_expected.better_id, cpi_expected.category_id, 0
    FROM                (
                            SELECT DISTINCT     cpi_betting.better_id, cpi_category.id AS category_id
                            FROM                cpi_betting
                            JOIN                cpi_better
                                                ON      cpi_betting.better_id = cpi_better.id
                            JOIN                cpi_contest
                                                ON      cpi_betting.contest_id = cpi_contest.id
                            JOIN                cpi_category
                                                ON    cpi_contest.id = cpi_category.contest_id
                            WHERE               cpi_betting.better_id = p_better
                                                AND     cpi_better.isAdmin = 0
                                                AND     cpi_contest.startDate <= NOW()
                                                AND     NOW() < cpi_contest.endBetDate
                        ) cpi_expected
    LEFT JOIN           cpi_point
                        ON      cpi_expected.better_id = cpi_point.better_id
                                AND     cpi_expected.category_id = cpi_point.category_id
    WHERE               cpi_point.better_id IS NULL
                        AND     cpi_point.category_id IS NULL
                        AND     fn_can_create_better() = 1;

    /* Table des classements */
    INSERT INTO         cpi_ranking(better_id, contest_day, points, ranking)
    SELECT              cpi_expected.better_id, cpi_expected.contest_day, 0, 0
    FROM                (
                            SELECT DISTINCT     cpi_betting.better_id, cpi_contest.day AS contest_day
                            FROM                cpi_betting
                            JOIN                cpi_better
                                                ON      cpi_betting.better_id = cpi_better.id
                            JOIN                cpi_contest
                                                ON      cpi_betting.contest_id = cpi_contest.id
                            WHERE               cpi_betting.better_id = p_better
                                                AND     cpi_better.isAdmin = 0
                                                AND     cpi_contest.startDate <= NOW()
                                                AND     NOW() < cpi_contest.endBetDate
                        ) cpi_expected
    LEFT JOIN           cpi_ranking
                        ON      cpi_expected.better_id = cpi_ranking.better_id
                                AND     cpi_expected.contest_day = cpi_ranking.contest_day
    WHERE               cpi_ranking.better_id IS NULL
                        AND     cpi_ranking.contest_day IS NULL
                        AND     fn_can_create_better() = 1;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `sp_delete_better`(IN `p_better` INT)
    DETERMINISTIC
BEGIN
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
    FROM		cpi_setting
    WHERE		cpi_setting.better_id = p_better;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `sp_unset_bets`(IN `p_better` INT)
    DETERMINISTIC
UPDATE      cpi_bet
SET         cpi_bet.winner_player_id = NULL, cpi_bet.runnerUp_player_id = NULL
WHERE       cpi_bet.better_id = p_better$$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION `fn_is_day1_bet_over`() RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN

    DECLARE     l_isDay1BetOver INT;

    SELECT      CASE
                    WHEN    MAX(cpi_contest.endBetDate) < NOW()
                    THEN    1
                    ELSE    0
                END
    INTO        l_isDay1BetOver
    FROM        cpi_contest
    WHERE       cpi_contest.day = 1;

    RETURN l_isDay1BetOver;

END$$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION `fn_is_day2_bet_over`() RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN

    DECLARE     l_isDay2BetOver INT;

    SELECT      CASE
                    WHEN    MAX(cpi_contest.endBetDate) < NOW()
                    THEN    1
                    ELSE    0
                END
    INTO        l_isDay2BetOver
    FROM        cpi_contest
    WHERE       cpi_contest.day = 2;

    RETURN l_isDay2BetOver;

END$$
DELIMITER ;
