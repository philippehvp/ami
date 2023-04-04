<?php
  include_once("../common.php");

  function readPlayers($db, $category) {
    $query =
      " SELECT      player.id, player.playerName1, player.playerName2" .
      " FROM        player" .
      " WHERE       player.category_id = " . $category;

    $req = $db->query($query);
    $res = $req->fetchAll(PDO::FETCH_ASSOC);
    return $res;
  }

  // Lecture du paramètre
  $category = $_GET["category"];

  if ($category) {
    $res = readPlayers($db, $category);
    echo json_encode($res, JSON_NUMERIC_CHECK);
  } else {
    echo json_encode(json_decode("[]"));
  }
?>