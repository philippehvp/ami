BEGIN
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
END;
