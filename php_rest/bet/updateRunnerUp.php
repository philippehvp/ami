<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $contest = json_decode($data["contest"]) ? json_decode($data["contest"]) : $data["contest"];
  $category = json_decode($data["category"]) ? json_decode($data["category"]) : $data["category"];
  $player = json_decode($data["player"]) ? json_decode($data["player"]) : $data["player"];

  if ($accessKey && $contest && $category) {
    if (isAccessKeyValid($db, $accessKey)) {
      if (isUpdatable($db, $contest, $accessKey)) {
        $query =
          " UPDATE            bet" .
          " JOIN              better" .
          "                   ON    bet.better_id = better.id" .
          " SET               bet.runnerUp_player_id = ?," .
          "                   bet.winner_player_id =" .
          "                   CASE" .
          "                       WHEN    bet.winner_player_id = ?" .
          "                       THEN    NULL" .
          "                       ELSE    bet.winner_player_id" .
          "                   END" .
          " WHERE             better.accessKey = ?" .
          "                   AND   bet.category_id = ?";
        $req = $db->prepare($query);
        $req->execute(array($player, $player, $accessKey, $category));
  
        $ret = array("player" => $player);
        echo json_encode($ret, JSON_NUMERIC_CHECK);
      } else {
        echo returnIsNotUpdatable();
      }
    } else {
      echo returnIsOffline();
    }
  } else {
    return http_response_code(204);
  }
?>