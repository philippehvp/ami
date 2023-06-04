<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $randomKey = json_decode($data["randomKey"]) ? json_decode($data["randomKey"]) : $data["randomKey"];

  if ($accessKey && $randomKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT  		cpi_contest.id AS contest_id, cpi_category.id as category_id, cpi_category.shortName AS categoryShortName," .
        "             IFNULL(cpi_winner.playerName1, '-') AS winner_playerName1, IFNULL(cpi_winner.playerName2, '-') AS winner_playerName2," .
        "             IFNULL(cpi_runnerUp.playerName1, '-') AS runnerUp_playerName1, IFNULL(cpi_runnerUp.playerName2, '-') AS runnerUp_playerName2" .
        " FROM		    cpi_category" .
        " JOIN		    cpi_contest" .
			  "             ON		cpi_contest.id = cpi_category.contest_id" .
        " JOIN		    cpi_bet" .
			  "             ON		cpi_category.id = cpi_bet.category_id" .
        " LEFT JOIN		cpi_player AS cpi_winner" .
			  "             ON		cpi_bet.winner_player_id = cpi_winner.id" .
        " LEFT JOIN		cpi_player AS cpi_runnerUp" .
			  "             ON		cpi_bet.runnerUp_player_id = cpi_runnerUp.id" .
        " JOIN        cpi_better" .
        "             ON      cpi_bet.better_id = cpi_better.id" .
        " WHERE		    cpi_better.randomKey = ?" .
			  "             AND		cpi_contest.startDate <= NOW()" .
			  "             AND		NOW() <= cpi_contest.endAdminDate" .
        " ORDER BY    cpi_category.id";
    
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