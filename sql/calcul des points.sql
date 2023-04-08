

/* Recherche du pronostiqueur administrateur */
SELECT              better.id
INTO                l_admin
FROM                better
WHERE               better.isAdmin = 1
LIMIT               1;

/* Recherche de toutes les séries dont les résultats ont été saisis par l'administrateur */
SELECT              bet.winner_player_id, bet.runnerUp_player_id, bet.category_id
FROM                bet
JOIN                category
                    ON      bet.category_id = category.id
JOIN                contest
                    ON      category.contest_id = contest.id
WHERE               contest.startDate <= NOW()
                    AND     NOW() <= contest.endDate
                    AND     bet.better_id = l_admin
                    AND     bet.winner_player_id <> 0
                    AND     bet.runnerUp_player_id <> 0;

/* Calcul des points pour les résultats finaux connus */
UPDATE      point
JOIN        (
                SELECT      bet.winner_player_id, bet.runnerUp_player_id, bet.category_id
                FROM        bet
                JOIN        category
                            ON      bet.category_id = category.id
                JOIN        contest
                            ON      category.contest_id = contest.id
                WHERE       contest.startDate <= NOW()
                            AND     NOW() <= contest.endDate
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

SELECT      point.better_id,
            point.category_id,
            fn_calculate_points(
                truth.winner_player_id, truth.runnerUp_player_id,
                bet.winner_player_id, bet.runnerUp_player_id
            ) AS point
FROM		point
JOIN        (
                SELECT      bet.winner_player_id, bet.runnerUp_player_id, bet.category_id
                FROM        bet
                JOIN        category
                            ON      bet.category_id = category.id
                JOIN        contest
                            ON      category.contest_id = contest.id
                WHERE       contest.startDate <= NOW()
                            AND     NOW() <= contest.endDate
                            AND     bet.better_id = 19
                            AND     bet.winner_player_id <> 0
                            AND     bet.runnerUp_player_id <> 0

            ) truth
            ON      point.category_id = truth.category_id
JOIN        bet
            ON      point.category_id = bet.category_id
WHERE       point.better_id <> 19
			AND		bet.better_id <> 19;



