<?php
  include_once("../common.php");

  // Lecture des paramètres
  $better = $_GET["better"];
  $category = $_GET["category"];

  if ($better && $category) {
    $query =
      " SELECT DISTINCT     bet.better_id AS betterId, bet.category_id AS categoryId," .
      "                     bet.winner_player_id AS winnerId, bet.runnerUp_player_id AS runnerUpId" .
      " FROM                bet" .
      " WHERE               bet.better_id = ?" .
      "                     AND   bet.category_id = ?";
  
    $req = $db->prepare($query);
    $req->execute(array($better, $category));
    $res = $req->fetchAll(PDO::FETCH_ASSOC);
    if ($res && sizeof($res)) {
      echo json_encode($res[0], JSON_NUMERIC_CHECK);
    } else {
      echo json_encode(json_decode("{}"));
    }
  } else {
    echo json_encode(json_decode("{}"));
  }

?>