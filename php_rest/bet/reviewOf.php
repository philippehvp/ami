<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $randomKey = json_decode($data["randomKey"]) ? json_decode($data["randomKey"]) : $data["randomKey"];

  if ($accessKey && $randomKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT  		cpi_contest.id AS contestId, cpi_contest.longName AS contest_longName," .
        "             cpi_category.id as categoryId, cpi_category.longName AS category_longName," .

        "             cpi_winner.playerName1 AS winner_playerName1," .
        "             cpi_winner.playerNameOnly1 AS winner_playerNameOnly1," .
        "             cpi_winner.playerRanking1 AS winner_playerRanking1," .
        "             cpi_winner.playerClub1 AS winner_playerClub1," .

        "             cpi_winner.playerName2 AS winner_playerName2," .
        "             cpi_winner.playerNameOnly2 AS winner_playerNameOnly2," .
        "             cpi_winner.playerRanking2 AS winner_playerRanking2," .
        "             cpi_winner.playerClub2 AS winner_playerClub2," .

        "             cpi_runnerUp.playerName1 AS runnerUp_playerName1," .
        "             cpi_runnerUp.playerNameOnly1 AS runnerUp_playerNameOnly1," .
        "             cpi_runnerUp.playerRanking1 AS runnerUp_playerRanking1," .
        "             cpi_runnerUp.playerClub1 AS runnerUp_playerClub1," .

        "             cpi_runnerUp.playerName2 AS runnerUp_playerName2," .
        "             cpi_runnerUp.playerNameOnly2 AS runnerUp_playerNameOnly2," .
        "             cpi_runnerUp.playerRanking2 AS runnerUp_playerRanking2," .
        "             cpi_runnerUp.playerClub2 AS runnerUp_playerClub2," .
        
        "             results.winner_playerName1 AS realWinner_playerName1," .
        "             results.winner_playerNameOnly1 AS realWinner_playerNameOnly1," .
        "             results.winner_playerRanking1 AS realWinner_playerRanking1," .
        "             results.winner_playerClub1 AS realWinner_playerClub1," .

        "             results.winner_playerName2 AS realWinner_playerName2," .
        "             results.winner_playerNameOnly2 AS realWinner_playerNameOnly2," .
        "             results.winner_playerRanking2 AS realWinner_playerRanking2," .
        "             results.winner_playerClub2 AS realWinner_playerClub2," .

        "             results.runnerUp_playerName1 AS realRunnerUp_playerName1," .
        "             results.runnerUp_playerNameOnly1 AS realRunnerUp_playerNameOnly1," .
        "             results.runnerUp_playerRanking1 AS realRunnerUp_playerRanking1," .
        "             results.runnerUp_playerClub1 AS realRunnerUp_playerClub1," .

        "             results.runnerUp_playerName2 AS realRunnerUp_playerName2," .
        "             results.runnerUp_playerNameOnly2 AS realRunnerUp_playerNameOnly2," .
        "             results.runnerUp_playerRanking2 AS realRunnerUp_playerRanking2," .
        "             results.runnerUp_playerClub2 AS realRunnerUp_playerClub2," .

        "             IFNULL(cpi_point.points, 0) AS points," .
        "             results.category_done" .
        " FROM		    cpi_category" .
        " JOIN		    (" .
        "                 SELECT                cpi_contest.id, cpi_contest.longName" .
        "                 FROM                  cpi_contest" .
        "                 WHERE                 cpi_contest.startDate = fn_max_start_date()" .
        "             ) cpi_contest" .
			  "             ON		cpi_contest.id = cpi_category.contest_id" .
        " JOIN		    cpi_bet" .
			  "             ON		cpi_category.id = cpi_bet.category_id" .
        " LEFT JOIN		cpi_player AS cpi_winner" .
			  "             ON		cpi_bet.winner_player_id = cpi_winner.id" .
        " LEFT JOIN		cpi_player AS cpi_runnerUp" .
			  "             ON		cpi_bet.runnerUp_player_id = cpi_runnerUp.id" .
        " JOIN        cpi_better" .
        "             ON    cpi_bet.better_id = cpi_better.id" .
        " LEFT JOIN   cpi_point" .
        "             ON    cpi_better.id = cpi_point.better_id" .
        "                   AND   cpi_category.id = cpi_point.category_id" .
        " JOIN        (" .
        "                 SELECT                cpi_category.id AS category_id," .
        "                                       CASE" .
        "                                         WHEN    cpi_bet.winner_player_id IS NULL" .
        "                                                 AND   cpi_bet.runnerUp_player_id IS NULL" .
        "                                         THEN    0" .
        "                                         ELSE    1" .
        "                                       END AS category_done," .
        "                                       IFNULL(cpi_winner.playerName1, NULL) AS winner_playerName1," .
        "                                       IFNULL(cpi_winner.playerNameOnly1, NULL) AS winner_playerNameOnly1," .
        "                                       IFNULL(cpi_winner.playerRanking1, NULL) AS winner_playerRanking1," .
        "                                       IFNULL(cpi_winner.playerClub1, NULL) AS winner_playerClub1," .

        "                                       IFNULL(cpi_winner.playerName2, NULL) AS winner_playerName2," .
        "                                       IFNULL(cpi_winner.playerNameOnly2, NULL) AS winner_playerNameOnly2," .
        "                                       IFNULL(cpi_winner.playerRanking2, NULL) AS winner_playerRanking2," .
        "                                       IFNULL(cpi_winner.playerClub2, NULL) AS winner_playerClub2," .

        "                                       IFNULL(cpi_runnerUp.playerName1, NULL) AS runnerUp_playerName1," .
        "                                       IFNULL(cpi_runnerUp.playerNameOnly1, NULL) AS runnerUp_playerNameOnly1," .
        "                                       IFNULL(cpi_runnerUp.playerRanking1, NULL) AS runnerUp_playerRanking1," .
        "                                       IFNULL(cpi_runnerUp.playerClub1, NULL) AS runnerUp_playerClub1," .

        "                                       IFNULL(cpi_runnerUp.playerName2, NULL) AS runnerUp_playerName2," .
        "                                       IFNULL(cpi_runnerUp.playerNameOnly2, NULL) AS runnerUp_playerNameOnly2," .
        "                                       IFNULL(cpi_runnerUp.playerRanking2, NULL) AS runnerUp_playerRanking2," .
        "                                       IFNULL(cpi_runnerUp.playerClub2, NULL) AS runnerUp_playerClub2" .
        "                 FROM                  cpi_category" .
        "                 JOIN                  cpi_bet" .
        "                                       ON    cpi_category.id = cpi_bet.category_id" .
        "                 JOIN                  cpi_better" .
        "                                       ON    cpi_bet.better_id = cpi_better.id" .
        "                 LEFT JOIN             cpi_player AS cpi_winner" .
        "                                       ON    cpi_bet.winner_player_id = cpi_winner.id" .
        "                 LEFT JOIN             cpi_player AS cpi_runnerUp" .
        "                                       ON    cpi_bet.runnerUp_player_id = cpi_runnerUp.id" .
        "                 WHERE                 cpi_better.isAdmin = 1" .
        "             ) results" .
        "             ON    cpi_category.id = results.category_id" .
        " WHERE		    cpi_better.randomKey = ?" .
        " ORDER BY    cpi_contest.id, cpi_category.id";
      $req = $db->prepare($query);
      $req->execute(array($randomKey));
      $res = $req->fetchAll(PDO::FETCH_ASSOC);
      if ($res && sizeof($res)) {
        echo json_encode($res, JSON_NUMERIC_CHECK);
      } else {
        echo json_encode([]);
      }
    } else {
      echo returnIsOffline();
    }
  } else {
    echo json_encode([]);
  }

?>