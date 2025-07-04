SELECT		contest.id, category.id, bet.winner_player_id, bet.runnerUp_player_id
FROM		contest
JOIN		category
			ON		contest.id = category.contest_id
LEFT JOIN	bet
			ON		category.id = bet.category_id
                    AND		bet.better_id = 7
WHERE		contest.startDate <= NOW()
			AND		contest.endAdminDate >= NOW();

SELECT      contest.id, category.id, bet.winner_player_id, bet.runnerUp_player_id
FROM        contest
JOIN        category
            ON      contest.id = category.contest_id
JOIN        bet
            ON      category.id = bet.category_id
WHERE       bet.better_id = 7
            AND     contest.startDate <= NOW()
            AND     contest.endAdminDate >= NOW();