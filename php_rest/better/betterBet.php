<?php
  include_once("../common.php");

  $query =
    " SELECT          contest.shortName AS contestName, category.longName AS categoryName" .
    " FROM            contest" .
    " JOIN            category" .
    "                 ON      contest.id = category.contest_id" .
    " WHERE           contest.startDate <= NOW()" .
    "                 AND   NOW() <= contest.endAdminDate";
  $req = $db->query($query);
  $header = $req->fetchAll(PDO::FETCH_ASSOC);
  
  $query =
    " SELECT          CONCAT(better.name, ' ', better.firstName) AS name" .
    " FROM            better" .
    " WHERE           better.isAdmin = 0" .
    " ORDER BY        better.name, better.firstName, better.id";
  $req = $db->query($query);
  $betters = $req->fetchAll(PDO::FETCH_ASSOC);

  $query =
    " SELECT          winner.playerName1 AS winner_playerName1, winner.playerName2 AS winner_playerName2," .
    "                 runnerUp.playerName1 AS runnerUp_playerName1, runnerUp.playerName2 AS runnerUp_playerName2" .
    " FROM            better" .
    " JOIN            betting" .
    "                 ON    better.id = betting.better_id" .
    " JOIN            contest" .
    "                 ON    better.id = betting.better_id" .
    "                       AND   betting.contest_id = contest.id" .
    " JOIN            category" .
    "                 ON    contest.id = category.contest_id" .
    " JOIN            bet" .
    "                 ON    better.id = bet.better_id" .
    "                       AND   category.id = bet.category_id" .
    " JOIN            player winner" .
    "                 ON    bet.winner_player_id = winner.id" .
    " JOIN            player runnerUp" .
    "                 ON    bet.runnerUp_player_id = runnerUp.id" .
    " WHERE           better.isAdmin = 0" .
    "                 AND   contest.startDate <= NOW()" .
    "                 AND   NOW() <= contest.endAdminDate" .
    " ORDER BY        better.name, better.firstName, better.id";
    $req = $db->query($query);
    $betsRaw = $req->fetchAll(PDO::FETCH_ASSOC);
    $countOfCategories = sizeof($betsRaw);

  $bets = array();

  foreach($betters as $better) {
    $winners = array();
    $runnersUp = array();

    for($i = 0; $i < $countOfCategories; $i++) {
      array_push(
        $winners,
        array(
          "playerName1" => $betsRaw[$i]["winner_playerName1"],
          "playerName2" => $betsRaw[$i]["winner_playerName2"]
        )
      );

      array_push(
        $runnersUp,
        array(
          "playerName1" => $betsRaw[$i]["runnerUp_playerName1"],
          "playerName2" => $betsRaw[$i]["runnerUp_playerName2"]        
        )
      );
    }

    array_push(
      $bets,
      array(
        "name" => $better["name"],
        "winners" => $winners,
        "runnersUp" => $runnersUp
      )
    );
  }

  $pointsArray = array("header" => $header, "bets" => $bets);
  echo json_encode(array($pointsArray), JSON_NUMERIC_CHECK);
?>