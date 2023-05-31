DECLARE             l_countOfBetters INT;

/* Nombre de pronostiqueurs */
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


SELECT              CONCAT(cpi_player.playerName1, ' - ', cpi_player.playerName2) AS "players",
                    TRUNCATE(IFNULL(winners.countOfWinner, 0) / l_CountOfBetters * 100, 2) AS "winner",
                    TRUNCATE(IFNULL(runnersUp.countOfRunnerUp, 0) / l_CountOfBetters * 100, 2) AS "runnerUp",
                    CONCAT(cpi_contest.longName, ' - ', cpi_category.longName) AS "category"
FROM                cpi_player
JOIN                cpi_category
                    ON      cpi_player.category_id = cpi_category.id
JOIN                cpi_contest
                    ON      cpi_category.contest_id = cpi_contest.id
LEFT JOIN           (
                        SELECT              winner.id AS player_id, COUNT(*) AS countOfWinner, cpi_bet.category_id
                        FROM                cpi_player winner
                        JOIN                cpi_bet
                                            ON      winner.id = cpi_bet.winner_player_id
                        JOIN                cpi_better
                                            ON      cpi_bet.better_id = cpi_better.id
                        WHERE               cpi_better.isAdmin = 0
                        GROUP BY            winner.id, cpi_bet.category_id
                    ) winners
                    ON      cpi_player.id = winners.player_id
                            AND     cpi_player.category_id = winners.category_id
LEFT JOIN           (
                        SELECT              runnerUp.id AS player_id, COUNT(*) AS countOfRunnerUp, cpi_bet.category_id
                        FROM                cpi_player runnerUp
                        JOIN                cpi_bet
                                            ON      runnerUp.id = cpi_bet.runnerUp_player_id
                        JOIN                cpi_better
                                            ON      cpi_bet.better_id = cpi_better.id
                        WHERE               cpi_better.isAdmin = 0
                        GROUP BY            runnerUp.id, cpi_bet.category_id
                    ) runnersUp
                    ON      cpi_player.id = runnersUp.player_id
                            AND     cpi_player.category_id = runnersUp.category_id
WHERE               (   winners.category_id IS NOT NULL
                        OR      runnersUp.category_id IS NOT NULL
                    )
                    AND     (   countOfWinner > 0
                                OR      countOfRunnerUp > 0
                            )
ORDER BY            IFNULL(winners.category_id, runnersUp.category_id),
                    IFNULL(runnersUp.category_id, winners.category_id),
                    countOfWinner DESC,
                    countOfRunnerUp DESC;


