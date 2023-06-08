<?php
  include_once("../common.php");

  // Lecture des paramètres
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $category = json_decode($data["category"]) ? json_decode($data["category"]) : $data["category"];

  if ($accessKey && $category) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT      cpi_player.id, cpi_player.playerName1, cpi_player.playerNameOnly1, cpi_player.playerRanking1, cpi_player.playerClub1," .
        "             cpi_player.playerClub2, cpi_player.playerName2, cpi_player.playerNameOnly2, cpi_player.playerRanking2" .
        " FROM        cpi_player" .
        " WHERE       cpi_player.category_id = ?";

      $req = $db->prepare($query);
      $req->execute(array($category));
      $res = $req->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($res, JSON_NUMERIC_CHECK);
    } else {
      echo returnIsOffline();
    }
  } else {
    echo json_encode([]);
  }
?>