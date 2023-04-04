<?php
  include_once("../common.php");

  // Lecture du paramètre
  $better = $_GET["better"];

  if ($better) {
    $query =
      " SELECT      category.id AS categoryId," .
      "             IFNULL(bet.winner_player_id, 0) AS winnerId, IFNULL(bet.runnerUp_player_id, 0) AS runnerUpId" .
      " FROM        contest" .
      " JOIN        category" .
      "             ON      contest.id = category.contest_id" .
      " JOIN        bet" .
      "             ON      category.id = bet.category_id" .
      " WHERE       bet.better_id = ?" .
      "             AND     contest.startDate <= NOW()" .
      "             AND     contest.endDate >= NOW()";
  
    $req = $db->prepare($query);
    $req->execute(array($better));
    $res = $req->fetchAll(PDO::FETCH_ASSOC);
    if ($res && sizeof($res)) {
      echo json_encode($res, JSON_NUMERIC_CHECK);
    } else {
      echo json_encode(json_decode("[]"));
    }
  } else {
    echo json_encode(json_decode("[]"));
  }

?>