<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT          cpi_contest.shortName AS contestName, cpi_category.shortName AS categoryName" .
        " FROM            cpi_contest" .
        " JOIN            cpi_category" .
        "                 ON      cpi_contest.id = cpi_category.contest_id" .
        " WHERE           cpi_contest.startDate <= NOW()" .
        "                 AND   NOW() <= cpi_contest.endAdminDate" .
        " ORDER BY        cpi_category.id";
      $req = $db->query($query);
      $header = $req->fetchAll(PDO::FETCH_ASSOC);

      $query =
        " SELECT          CONCAT(cpi_better.name, ' ', cpi_better.firstName) AS name" .
        " FROM            cpi_better" .
        " WHERE           cpi_better.isAdmin = 0" .
        " ORDER BY        cpi_better.name, cpi_better.firstName, cpi_better.id";
      $req = $db->query($query);
      $betters = $req->fetchAll(PDO::FETCH_ASSOC);

      $query =
        " SELECT          IFNULL(winner.playerName1, '-') AS winner_playerName1, IFNULL(winner.playerName2, '-') AS winner_playerName2," .
        "                 IFNULL(runnerUp.playerName1, '-') AS runnerUp_playerName1, IFNULL(runnerUp.playerName2, '-') AS runnerUp_playerName2" .
        " FROM            cpi_better" .
        " JOIN            cpi_betting" .
        "                 ON    cpi_better.id = cpi_betting.better_id" .
        " JOIN            cpi_contest" .
        "                 ON    cpi_betting.contest_id = cpi_contest.id" .
        " JOIN            cpi_category" .
        "                 ON    cpi_contest.id = cpi_category.contest_id" .
        " JOIN            cpi_bet" .
        "                 ON    cpi_better.id = cpi_bet.better_id" .
        "                       AND   cpi_category.id = cpi_bet.category_id" .
        " LEFT JOIN       cpi_player winner" .
        "                 ON    cpi_bet.winner_player_id = winner.id" .
        " LEFT JOIN       cpi_player runnerUp" .
        "                 ON    cpi_bet.runnerUp_player_id = runnerUp.id" .
        " WHERE           cpi_better.isAdmin = 0" .
        "                 AND   cpi_contest.startDate <= NOW()" .
        "                 AND   NOW() <= cpi_contest.endAdminDate" .
        " ORDER BY        cpi_better.name, cpi_better.firstName, cpi_better.id, cpi_category.id";
      $req = $db->query($query);
      $betsRaw = $req->fetchAll(PDO::FETCH_ASSOC);
      $countOfCategories = sizeof($betsRaw) / sizeof($betters);

      $query =
        " SELECT          cpi_duration.duration" .
        " FROM            cpi_duration" .
        " JOIN            cpi_better" .
        "                 ON    cpi_duration.better_id = cpi_better.id" .
        " JOIN            cpi_contest" .
        "                 ON    cpi_duration.contest_day = cpi_contest.day" .
        " JOIN            cpi_category" .
        "                 ON      cpi_contest.id = cpi_category.contest_id" .
        " WHERE           cpi_contest.startDate <= NOW()" .
        "                 AND   NOW() <= cpi_contest.endAdminDate" .
        " ORDER BY        cpi_better.name, cpi_better.firstName, cpi_better.id";
      $req = $db->query($query);
      $duration = $req->fetchAll(PDO::FETCH_ASSOC);

      $bets = array();

      $betsIndex = 0;

      foreach($betters as $better) {
        $winners = array();
        $runnersUp = array();

        for($i = 0; $i < $countOfCategories; $i++) {
          array_push(
            $winners,
            array(
              "playerName1" => $betsRaw[$betsIndex]["winner_playerName1"],
              "playerName2" => $betsRaw[$betsIndex]["winner_playerName2"]
            )
          );

          array_push(
            $runnersUp,
            array(
              "playerName1" => $betsRaw[$betsIndex]["runnerUp_playerName1"],
              "playerName2" => $betsRaw[$betsIndex]["runnerUp_playerName2"]        
            )
          );

          $betsIndex++;
        }
        
        array_push(
          $bets,
          array(
            "name" => $better["name"],
            "winners" => $winners,
            "runnersUp" => $runnersUp,
            "duration" => $duration[0]["duration"]
          )
        );
      }

      $pointsArray = array("header" => $header, "bets" => $bets);

      echo json_encode($pointsArray, JSON_NUMERIC_CHECK);

    } else {
      echo returnIsOffline();
    }

  } else {
    return http_response_code(204);
  }
?>