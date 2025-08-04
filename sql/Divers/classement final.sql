SELECT cpi_ranking.ranking AS Classement,
       CONCAT (cpi_better.name, ' ', cpi_better.firstname) AS Joueur,
       cpi_ranking.points AS Points,
       cpi_duration.duration AS Durée
FROM   cpi_better
       JOIN cpi_ranking
         ON cpi_better.id = cpi_ranking.better_id
       JOIN (SELECT * FROM cpi_contest WHERE cpi_contest.day = 1 LIMIT 1) cpi_contest
         ON cpi_ranking.contest_day = cpi_contest.day
       JOIN cpi_duration
         ON cpi_better.id = cpi_duration.better_id
            AND cpi_contest.day = cpi_duration.contest_day
WHERE  cpi_contest.day = 1
       AND cpi_better.isadmin <> 1
ORDER  BY cpi_ranking.ranking,
          cpi_better.name,
          cpi_better.firstname,
          cpi_better.id;


SELECT cpi_ranking.ranking AS Classement,
       CONCAT (cpi_better.name, ' ', cpi_better.firstname) AS Joueur,
       cpi_ranking.points AS Points,
       cpi_duration.duration AS Durée
FROM   cpi_better
       JOIN cpi_ranking
         ON cpi_better.id = cpi_ranking.better_id
       JOIN (SELECT * FROM cpi_contest WHERE cpi_contest.day = 2 LIMIT 1) cpi_contest
         ON cpi_ranking.contest_day = cpi_contest.day
       JOIN cpi_duration
         ON cpi_better.id = cpi_duration.better_id
            AND cpi_contest.day = cpi_duration.contest_day
WHERE  cpi_contest.day = 2
       AND cpi_better.isadmin <> 1
ORDER  BY cpi_ranking.ranking,
          cpi_better.name,
          cpi_better.firstname,
          cpi_better.id;