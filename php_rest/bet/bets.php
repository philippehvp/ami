<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT      category.id AS categoryId," .
        "             IFNULL(bet.winner_player_id, 0) AS winnerId," .
        "             IFNULL(bet.runnerUp_player_id, 0) AS runnerUpId" .
        " FROM        contest" .
        " JOIN        category" .
        "             ON      contest.id = category.contest_id" .
        " JOIN        bet" .
        "             ON      category.id = bet.category_id" .
        " JOIN        better" .
        "             ON    bet.better_id = better.id" .
        " WHERE       better.accessKey = ?" .
        "             AND     contest.startDate <= NOW()" .
        "             AND     NOW() <= contest.endAdminDate";
    
      $req = $db->prepare($query);
      $req->execute(array($accessKey));
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