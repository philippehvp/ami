<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT      cpi_category.id AS categoryId," .
        "             IFNULL(cpi_bet.winner_player_id, 0) AS winnerId," .
        "             IFNULL(cpi_bet.runnerUp_player_id, 0) AS runnerUpId" .
        " FROM        cpi_contest" .
        " JOIN        cpi_category" .
        "             ON      cpi_contest.id = cpi_category.contest_id" .
        " JOIN        cpi_bet" .
        "             ON      cpi_category.id = cpi_bet.category_id" .
        " JOIN        cpi_better" .
        "             ON    cpi_bet.better_id = cpi_better.id" .
        " WHERE       cpi_better.accessKey = ?" .
        "             AND     cpi_contest.startDate <= NOW()" .
        "             AND     NOW() <= cpi_contest.endAdminDate";
    
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