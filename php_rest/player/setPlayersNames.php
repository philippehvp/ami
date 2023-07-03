<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      // Lecture des joueurs dans un premier temps
      $query =
        " SELECT      cpi_player.id, cpi_player.playerName1, cpi_player.playerName2" .
        " FROM        cpi_player";

      $req = $db->query($query);
      $players = $req->fetchAll(PDO::FETCH_ASSOC);

      // Ensuite, on va mettre à jour chaque ligne
      foreach($players as $p) {
        $playerNameOnly1 = extractNameFromFullName($p["playerName1"]);
        $playerNameOnly2 = extractNameFromFullName($p["playerName2"]);

        $query =
          " UPDATE      cpi_player" .
          " SET         cpi_player.playerNameOnly1 = ?," .
          "             cpi_player.playerNameOnly2 = ?" .
          " WHERE       cpi_player.id = " . $p["id"];

        $req = $db->prepare($query);
        $req->execute(array($playerNameOnly1, $playerNameOnly2));
      }
    } else {
      echo returnIsOffline();
    }
  } else {
    echo returnIsOffline();
  }
?>